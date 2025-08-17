/**
 * Production Atomic Write Operations
 * 
 * Provides crash-consistent file operations with atomic writes,
 * directory staging, and automatic rollback capabilities.
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface WriteOperation {
  type: 'write' | 'mkdir' | 'copy' | 'delete';
  source?: string;
  target: string;
  content?: string | Buffer;
  backup?: string;
  completed: boolean;
}

export interface StagedDirectory {
  stagingPath: string;
  targetPath: string;
  operations: WriteOperation[];
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export class ProductionAtomicWriter {
  private operations: WriteOperation[] = [];
  private backups: Map<string, string> = new Map();

  /**
   * Atomically writes a file using same-directory temp file + rename
   */
  async writeFileAtomic(filePath: string, content: string | Buffer): Promise<void> {
    const dir = path.dirname(filePath);
    const tempFile = path.join(
      dir, 
      `.tmp-${process.pid}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
    );

    let backupPath: string | undefined;

    try {
      // Create backup if file exists
      if (await this.fileExists(filePath)) {
        backupPath = `${filePath}.backup-${Date.now()}`;
        await fs.copyFile(filePath, backupPath);
        this.backups.set(filePath, backupPath);
      }

      // Write to temp file with exclusive creation
      await fs.writeFile(tempFile, content, { flag: 'wx' });

      // Force sync to disk for crash consistency
      const fd = await fs.open(tempFile, 'r+');
      await fd.sync();
      await fd.close();

      // Atomic rename (same filesystem guaranteed)
      await fs.rename(tempFile, filePath);

      // Force directory sync
      await this.syncDirectory(dir);

      // Record successful operation
      this.operations.push({
        type: 'write',
        target: filePath,
        backup: backupPath,
        completed: true
      });

      console.log(`✓ Atomically wrote: ${path.basename(filePath)}`);

    } catch (error) {
      // Cleanup temp file if it exists
      if (await this.fileExists(tempFile)) {
        await fs.unlink(tempFile).catch(() => {});
      }

      // Restore backup if we created one
      if (backupPath && await this.fileExists(backupPath)) {
        await fs.rename(backupPath, filePath).catch(() => {});
        this.backups.delete(filePath);
      }

      throw new AtomicWriteError(
        `Failed to write ${filePath} atomically: ${error instanceof Error ? error.message : 'Unknown error'}`,
        filePath,
        error instanceof Error ? error : new Error('Unknown error')
      );
    }
  }

  /**
   * Creates a staged directory for multi-file atomic operations
   */
  async createStagedDirectory(targetDir: string): Promise<StagedDirectory> {
    const stagingDir = `${targetDir}.staging-${process.pid}-${Date.now()}`;
    await fs.mkdir(stagingDir, { recursive: true });

    const operations: WriteOperation[] = [];

    return {
      stagingPath: stagingDir,
      targetPath: targetDir,
      operations,

      async commit(): Promise<void> {
        const backupDir = `${targetDir}.backup-${Date.now()}`;
        let needsRestore = false;

        try {
          // Backup existing directory if it exists
          if (await this.fileExists(targetDir)) {
            await fs.rename(targetDir, backupDir);
            needsRestore = true;
          }

          // Atomic directory swap
          await fs.rename(stagingDir, targetDir);

          // Force parent directory sync
          await this.syncDirectory(path.dirname(targetDir));

          // Clean up backup after successful commit
          if (await this.fileExists(backupDir)) {
            await fs.rm(backupDir, { recursive: true, force: true });
          }

          operations.push({
            type: 'mkdir',
            target: targetDir,
            completed: true
          });

          console.log(`✓ Committed staged directory: ${path.basename(targetDir)}`);

        } catch (error) {
          // Restore backup on failure
          if (needsRestore && await this.fileExists(backupDir)) {
            // Remove partial target if it exists
            if (await this.fileExists(targetDir)) {
              await fs.rm(targetDir, { recursive: true, force: true });
            }
            await fs.rename(backupDir, targetDir);
          }

          // Clean up staging directory
          if (await this.fileExists(stagingDir)) {
            await fs.rm(stagingDir, { recursive: true, force: true });
          }

          throw new AtomicWriteError(
            `Failed to commit staged directory ${targetDir}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            targetDir,
            error instanceof Error ? error : new Error('Unknown error')
          );
        }
      },

      async rollback(): Promise<void> {
        try {
          if (await this.fileExists(stagingDir)) {
            await fs.rm(stagingDir, { recursive: true, force: true });
            console.log(`✓ Rolled back staged directory: ${path.basename(stagingDir)}`);
          }
        } catch (error) {
          console.warn(`Warning: Failed to clean up staging directory ${stagingDir}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    };
  }

  /**
   * Copies a file atomically
   */
  async copyFileAtomic(sourcePath: string, targetPath: string): Promise<void> {
    const content = await fs.readFile(sourcePath);
    await this.writeFileAtomic(targetPath, content);

    this.operations.push({
      type: 'copy',
      source: sourcePath,
      target: targetPath,
      completed: true
    });
  }

  /**
   * Creates a directory atomically (with parent directories)
   */
  async mkdirAtomic(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });

    // Sync parent directory
    await this.syncDirectory(path.dirname(dirPath));

    this.operations.push({
      type: 'mkdir',
      target: dirPath,
      completed: true
    });

    console.log(`✓ Created directory: ${path.basename(dirPath)}`);
  }

  /**
   * Rolls back all operations performed by this writer
   */
  async rollback(): Promise<void> {
    console.log('🔄 Rolling back atomic operations...');
    const rollbackErrors: Error[] = [];

    // Process operations in reverse order
    for (const operation of this.operations.reverse()) {
      if (!operation.completed) continue;

      try {
        switch (operation.type) {
          case 'write':
          case 'copy':
            if (operation.backup && await this.fileExists(operation.backup)) {
              // Restore from backup
              await fs.rename(operation.backup, operation.target);
              console.log(`↶ Restored: ${path.basename(operation.target)}`);
            } else if (await this.fileExists(operation.target)) {
              // Remove file (no backup existed)
              await fs.unlink(operation.target);
              console.log(`🗑 Removed: ${path.basename(operation.target)}`);
            }
            break;

          case 'mkdir':
            if (await this.fileExists(operation.target)) {
              await fs.rm(operation.target, { recursive: true, force: true });
              console.log(`🗑 Removed directory: ${path.basename(operation.target)}`);
            }
            break;
        }
      } catch (error) {
        rollbackErrors.push(
          new Error(`Failed to rollback ${operation.type} operation on ${operation.target}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        );
      }
    }

    // Clean up remaining backups
    for (const [originalPath, backupPath] of this.backups) {
      try {
        if (await this.fileExists(backupPath)) {
          await fs.unlink(backupPath);
        }
      } catch (error) {
        rollbackErrors.push(
          new Error(`Failed to clean up backup ${backupPath}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        );
      }
    }

    // Reset state
    this.operations = [];
    this.backups.clear();

    if (rollbackErrors.length > 0) {
      throw new AtomicWriteError(
        `Rollback completed with errors: ${rollbackErrors.map(e => e.message).join('; ')}`,
        'rollback',
        rollbackErrors[0]
      );
    }

    console.log('✅ Rollback completed successfully');
  }

  /**
   * Returns a summary of operations performed
   */
  getOperationsSummary(): {
    total: number;
    completed: number;
    types: Record<string, number>;
  } {
    const types: Record<string, number> = {};
    let completed = 0;

    for (const op of this.operations) {
      types[op.type] = (types[op.type] || 0) + 1;
      if (op.completed) completed++;
    }

    return {
      total: this.operations.length,
      completed,
      types
    };
  }

  // Private helper methods

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async syncDirectory(dirPath: string): Promise<void> {
    try {
      const fd = await fs.open(dirPath, 'r');
      await fd.sync();
      await fd.close();
    } catch (error) {
      // Directory sync might not be supported on all filesystems
      // This is a best-effort operation
      console.warn(`Warning: Could not sync directory ${dirPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Atomic Write Error with context
 */
export class AtomicWriteError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'AtomicWriteError';
  }
}

/**
 * Build Transaction Manager
 * 
 * Manages the entire build process as a single atomic transaction
 */
export class BuildTransaction {
  private writer = new ProductionAtomicWriter();
  private stagedDirectories: StagedDirectory[] = [];
  private completed = false;

  async writeFile(filePath: string, content: string | Buffer): Promise<void> {
    return this.writer.writeFileAtomic(filePath, content);
  }

  async copyFile(sourcePath: string, targetPath: string): Promise<void> {
    return this.writer.copyFileAtomic(sourcePath, targetPath);
  }

  async createDirectory(dirPath: string): Promise<void> {
    return this.writer.mkdirAtomic(dirPath);
  }

  async createStagedDirectory(targetDir: string): Promise<StagedDirectory> {
    const staged = await this.writer.createStagedDirectory(targetDir);
    this.stagedDirectories.push(staged);
    return staged;
  }

  async commit(): Promise<void> {
    try {
      // Commit all staged directories
      for (const staged of this.stagedDirectories) {
        await staged.commit();
      }

      this.completed = true;
      console.log('✅ Build transaction committed successfully');

      // Get operations summary
      const summary = this.writer.getOperationsSummary();
      console.log(`📊 Transaction summary: ${summary.completed}/${summary.total} operations completed`);
      
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  async rollback(): Promise<void> {
    if (this.completed) {
      console.warn('⚠️ Cannot rollback completed transaction');
      return;
    }

    // Rollback staged directories first
    for (const staged of this.stagedDirectories.reverse()) {
      await staged.rollback();
    }

    // Then rollback file operations
    await this.writer.rollback();
  }

  isCompleted(): boolean {
    return this.completed;
  }

  getOperationsSummary(): ReturnType<ProductionAtomicWriter['getOperationsSummary']> {
    return this.writer.getOperationsSummary();
  }
}

// Utility functions for integration

/**
 * Executes a function within an atomic transaction
 */
export async function withAtomicTransaction<T>(
  fn: (transaction: BuildTransaction) => Promise<T>
): Promise<T> {
  const transaction = new BuildTransaction();

  try {
    const result = await fn(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}