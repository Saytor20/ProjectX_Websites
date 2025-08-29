#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

interface TemplateManifest {
  id: string;
  name: string;
  slots: string[];
  version: string;
}

const REQUIRED_SLOTS = ['navbar', 'hero', 'menu', 'gallery', 'hours', 'cta', 'footer'];
const REQUIRED_FILES = ['Template.tsx', 'template.module.css', 'manifest.json'];

class TemplateValidator {
  private templateId: string;
  private templatePath: string;
  private errors: string[] = [];
  private warnings: string[] = [];

  constructor(templateId: string) {
    this.templateId = templateId;
    this.templatePath = path.join(process.cwd(), 'templates', templateId);
  }

  public validate(): boolean {
    console.log(`\n🔍 Validating template: ${this.templateId}`);
    console.log(`📁 Path: ${this.templatePath}`);

    // Check if template directory exists
    if (!this.checkDirectoryExists()) {
      return false;
    }

    // Check required files
    this.checkRequiredFiles();

    // Validate manifest
    const manifest = this.validateManifest();
    if (manifest) {
      this.validateSlots(manifest);
      this.validateMetadata(manifest);
    }

    // Check Template.tsx structure
    this.validateTemplateComponent();

    // Check CSS module
    this.validateCSSModule();

    // Display results
    this.displayResults();

    return this.errors.length === 0;
  }

  private checkDirectoryExists(): boolean {
    if (!fs.existsSync(this.templatePath)) {
      this.errors.push(`Template directory does not exist: ${this.templatePath}`);
      return false;
    }
    return true;
  }

  private checkRequiredFiles(): void {
    REQUIRED_FILES.forEach(file => {
      const filePath = path.join(this.templatePath, file);
      if (!fs.existsSync(filePath)) {
        this.errors.push(`Missing required file: ${file}`);
      }
    });
  }

  private validateManifest(): TemplateManifest | null {
    const manifestPath = path.join(this.templatePath, 'manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(content) as TemplateManifest;

      // Check required fields
      if (!manifest.id) {
        this.errors.push('Manifest missing required field: id');
      } else if (manifest.id !== this.templateId) {
        this.errors.push(`Manifest id "${manifest.id}" does not match template folder "${this.templateId}"`);
      }

      if (!manifest.name) {
        this.errors.push('Manifest missing required field: name');
      }

      if (!manifest.slots || !Array.isArray(manifest.slots)) {
        this.errors.push('Manifest missing required field: slots (must be an array)');
      }

      if (!manifest.version) {
        this.errors.push('Manifest missing required field: version');
      } else if (!this.isValidSemver(manifest.version)) {
        this.warnings.push(`Version "${manifest.version}" is not valid semver format`);
      }

      return manifest;
    } catch (error) {
      this.errors.push(`Failed to parse manifest.json: ${error}`);
      return null;
    }
  }

  private validateSlots(manifest: TemplateManifest): void {
    if (!manifest.slots) return;

    const missingSlots = REQUIRED_SLOTS.filter(slot => !manifest.slots.includes(slot));
    if (missingSlots.length > 0) {
      this.errors.push(`Missing required slots: ${missingSlots.join(', ')}`);
    }

    const extraSlots = manifest.slots.filter(slot => !REQUIRED_SLOTS.includes(slot));
    if (extraSlots.length > 0) {
      this.warnings.push(`Additional slots defined: ${extraSlots.join(', ')}`);
    }
  }

  private validateMetadata(manifest: TemplateManifest): void {
    // Additional metadata validation can be added here
    if (!manifest.name || manifest.name.length < 3) {
      this.warnings.push('Template name should be at least 3 characters long');
    }
  }

  private validateTemplateComponent(): void {
    const templatePath = path.join(this.templatePath, 'Template.tsx');
    
    if (!fs.existsSync(templatePath)) {
      return;
    }

    try {
      const content = fs.readFileSync(templatePath, 'utf-8');

      // Check for required imports
      if (!content.includes('React') && !content.includes('react')) {
        this.warnings.push('Template.tsx should import React');
      }

      // Check for Restaurant prop type
      if (!content.includes('Restaurant')) {
        this.warnings.push('Template.tsx should use Restaurant type for props');
      }

      // Check for data-block attributes
      REQUIRED_SLOTS.forEach(slot => {
        if (!content.includes(`data-block="${slot}"`) && !content.includes(`data-block='${slot}'`)) {
          this.warnings.push(`Template.tsx missing data-block attribute for slot: ${slot}`);
        }
      });

      // Check for export
      if (!content.includes('export default') && !content.includes('export {')) {
        this.errors.push('Template.tsx must export the component');
      }
    } catch (error) {
      this.errors.push(`Failed to read Template.tsx: ${error}`);
    }
  }

  private validateCSSModule(): void {
    const cssPath = path.join(this.templatePath, 'template.module.css');
    
    if (!fs.existsSync(cssPath)) {
      return;
    }

    try {
      const content = fs.readFileSync(cssPath, 'utf-8');
      const stats = fs.statSync(cssPath);
      const sizeKB = stats.size / 1024;

      // Check size
      if (sizeKB > 50) {
        this.errors.push(`CSS file exceeds 50KB limit (current: ${sizeKB.toFixed(2)}KB)`);
      }

      // Check for CSS variables usage
      if (!content.includes('var(--')) {
        this.warnings.push('CSS module should use CSS variables from tokens');
      }

      // Check for global styles
      if (content.includes(':global(') && !content.includes(':global(.')) {
        this.warnings.push('Avoid using :global() selector without specific classes');
      }

      // Check for important usage
      const importantCount = (content.match(/!important/g) || []).length;
      if (importantCount > 5) {
        this.warnings.push(`Excessive use of !important (${importantCount} occurrences)`);
      }
    } catch (error) {
      this.errors.push(`Failed to read template.module.css: ${error}`);
    }
  }

  private isValidSemver(version: string): boolean {
    const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    return semverRegex.test(version);
  }

  private displayResults(): void {
    console.log('\n' + '='.repeat(50));

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ Template validation passed with no issues!');
    } else {
      if (this.errors.length > 0) {
        console.log(`\n❌ Errors (${this.errors.length}):`);
        this.errors.forEach(error => console.log(`   • ${error}`));
      }

      if (this.warnings.length > 0) {
        console.log(`\n⚠️  Warnings (${this.warnings.length}):`);
        this.warnings.forEach(warning => console.log(`   • ${warning}`));
      }
    }

    console.log('\n' + '='.repeat(50));
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: npm run validate-template -- <template-id>');
    console.error('Example: npm run validate-template -- bistly');
    process.exit(1);
  }

  const templateId = args[0];
  if (!templateId) {
    console.error('Error: Template ID is required');
    process.exit(1);
  }
  const validator = new TemplateValidator(templateId);
  const isValid = validator.validate();

  process.exit(isValid ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { TemplateValidator };