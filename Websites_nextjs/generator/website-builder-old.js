#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class WebsiteBuilder {
    constructor(options = {}) {
        this.templateName = options.template || 'modern-nextjs';
        this.templateDir = options.templateDir || `../templates/${this.templateName}`;
        this.placesDir = options.placesDir || '../places_json';
        this.outputDir = options.outputDir || path.resolve(__dirname, '../final_websites');
        this.tempDir = path.join(__dirname, 'temp_build');
        this.templatesConfigPath = path.resolve(__dirname, '../templates/template-config.json');
    }

    // Load template configuration
    loadTemplateConfig() {
        try {
            if (fs.existsSync(this.templatesConfigPath)) {
                const config = JSON.parse(fs.readFileSync(this.templatesConfigPath, 'utf8'));
                return config;
            }
        } catch (error) {
            console.warn('Could not load template config:', error.message);
        }
        return null;
    }

    // Transform restaurant data to match the new template format
    transformRestaurantData(restaurantData) {
        const { restaurant_info, menu_categories = {}, contact_info = {} } = restaurantData;
        
        // Transform menu items from menu_categories to match the new format
        const transformedMenu = [];
        let itemId = 1;
        
        Object.entries(menu_categories).forEach(([category, items]) => {
            items.forEach(item => {
                transformedMenu.push({
                    id: itemId.toString(),
                    name: item.item_en || item.name || 'Menu Item',
                    description: item.description || item.item_description || '',
                    price: parseFloat(item.price) || 0,
                    category: category,
                    image: item.image || item.image_url || item.photo_url || ''
                });
                itemId++;
            });
        });

        // Create gallery from available images
        const gallery = [];
        if (restaurant_info.photo_url) gallery.push(restaurant_info.photo_url);
        if (restaurant_info.cover_photo) gallery.push(restaurant_info.cover_photo);
        
        // Add menu item images to gallery
        Object.values(menu_categories).flat().forEach(item => {
            if (item.image && !gallery.includes(item.image)) {
                gallery.push(item.image);
            }
        });

        return {
            name: restaurant_info.name || 'Restaurant',
            description: restaurant_info.description || restaurant_info.about || 'Experience delicious cuisine in a welcoming atmosphere.',
            phone: contact_info.phone || restaurant_info.phone || '(555) 123-4567',
            address: restaurant_info.address || restaurant_info.location || 'Restaurant Address',
            email: contact_info.email || restaurant_info.email || 'info@restaurant.com',
            website: restaurant_info.website || restaurant_info.website_url || 'www.restaurant.com',
            heroImage: restaurant_info.photo_url || restaurant_info.cover_photo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            aboutImage: restaurant_info.about_image || restaurant_info.photo_url || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            menu: transformedMenu,
            gallery: gallery
        };
    }

    // Replace template placeholders with actual data
    replaceTemplatePlaceholders(content, restaurantData, restaurantFile) {
        const { restaurant_info } = restaurantData;
        
        // Helper function to escape strings for JSX/TSX and HTML
        const escapeForJSX = (str) => {
            if (!str) return '';
            // Escape both single and double quotes, and handle special characters
            return str
                .replace(/\\/g, '\\\\')  // Escape backslashes first
                .replace(/'/g, "\\'")    // Escape single quotes
                .replace(/"/g, '\\\"')    // Escape double quotes
                .replace(/\n/g, '\\\n')   // Escape newlines
                .replace(/\r/g, '\\\r')   // Escape carriage returns
                .replace(/\t/g, '\\\t');  // Escape tabs
        };
        
        const placeholders = {
            '{{RESTAURANT_NAME}}': escapeForJSX(restaurant_info.name),
            '{{RESTAURANT_REGION}}': escapeForJSX(restaurant_info.region),
            '{{RESTAURANT_TYPE}}': escapeForJSX(restaurant_info.type_of_food),
            '{{RESTAURANT_FILE}}': restaurantFile
        };

        let result = content;
        Object.entries(placeholders).forEach(([placeholder, value]) => {
            result = result.replace(new RegExp(placeholder, 'g'), value || '');
        });

        return result;
    }

    // Copy template files and replace placeholders
    async prepareTemplate(restaurantData, restaurantFile) {
        const restaurantName = restaurantFile.replace('.json', '');
        const buildDir = path.join(this.tempDir, restaurantName);
        
        // Clean and create build directory
        if (fs.existsSync(buildDir)) {
            fs.rmSync(buildDir, { recursive: true, force: true });
        }
        fs.mkdirSync(buildDir, { recursive: true });

        // Copy template files
        await this.copyDirectorySync(path.resolve(__dirname, this.templateDir), buildDir);

        // Transform restaurant data to new format
        const transformedData = this.transformRestaurantData(restaurantData);
        
        // Create the restaurant data file in the new format
        const dataFilePath = path.join(buildDir, 'src/data/restaurant.ts');
        const dataContent = `import { RestaurantData } from '@/types/restaurant';

export const restaurantData: RestaurantData = ${JSON.stringify(transformedData, null, 2)};
`;
        fs.writeFileSync(dataFilePath, dataContent);

        // Copy restaurant data file to build directory for reference
        const originalDataPath = path.resolve(__dirname, this.placesDir, restaurantFile);
        const buildDataPath = path.join(buildDir, 'restaurant-data.json');
        fs.copyFileSync(originalDataPath, buildDataPath);

        // Process template files if they exist
        const filesToProcess = [
            'src/app/layout.tsx',
            'src/app/page.tsx'
        ];

        filesToProcess.forEach(file => {
            const filePath = path.join(buildDir, file);
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                content = this.replaceTemplatePlaceholders(content, restaurantData, restaurantFile);
                fs.writeFileSync(filePath, content);
            }
        });

        return buildDir;
    }

    // Copy directory recursively
    copyDirectorySync(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (let entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                this.copyDirectorySync(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    // Build Next.js project and export static files
    async buildWebsite(buildDir, restaurantData) {
        console.log(`Building website for ${restaurantData.restaurant_info.name}...`);
        
        try {
            // Install dependencies
            console.log('Installing dependencies...');
            execSync('npm install', { 
                cwd: buildDir, 
                stdio: 'pipe'
            });

            // Build and export
            console.log('Building and exporting...');
            execSync('npm run build', { 
                cwd: buildDir, 
                stdio: 'pipe'
            });

            // For Next.js, we need to export static files
            console.log('Exporting static files...');
            execSync('npm run export', { 
                cwd: buildDir, 
                stdio: 'pipe'
            });

            // The 'out' directory contains the static files
            const outDir = path.join(buildDir, 'out');
            if (fs.existsSync(outDir)) {
                return outDir;
            } else {
                throw new Error('Export directory not found');
            }

        } catch (error) {
            console.error(`Build failed for ${restaurantData.restaurant_info.name}:`, error.message);
            throw error;
        }
    }

    // Copy built website to final destination
    async finalizeWebsite(builtDir, restaurantData, restaurantFile) {
        const restaurantName = restaurantFile.replace('.json', '');
        const finalDir = path.join(this.outputDir, restaurantName);
        
        // Ensure output directory exists
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        // Remove existing directory
        if (fs.existsSync(finalDir)) {
            fs.rmSync(finalDir, { recursive: true, force: true });
        }

        // Move built files
        fs.renameSync(builtDir, finalDir);

        // Add restaurant data file
        const dataFile = path.join(finalDir, 'restaurant-data.json');
        fs.writeFileSync(dataFile, JSON.stringify(restaurantData, null, 2));

        // Add deployment info
        const deploymentInfo = {
            restaurant_name: restaurantData.restaurant_info.name,
            restaurant_id: restaurantData.restaurant_info.id,
            generated_at: new Date().toISOString(),
            template_used: this.templateName,
            ready_for_deployment: true,
            index_file: 'index.html'
        };

        const deploymentFile = path.join(finalDir, 'deployment-info.json');
        fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

        return finalDir;
    }

    // Generate website for a single restaurant
    async generateSingle(restaurantFile) {
        try {
            console.log(`\n=== Generating website for ${restaurantFile} ===`);
            
            // Load restaurant data
            const dataPath = path.resolve(__dirname, this.placesDir, restaurantFile);
            const restaurantData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

            // Prepare template
            const buildDir = await this.prepareTemplate(restaurantData, restaurantFile);

            // Build website
            const builtDir = await this.buildWebsite(buildDir, restaurantData);

            // Finalize
            const finalDir = await this.finalizeWebsite(builtDir, restaurantData, restaurantFile);

            // Cleanup temp directory
            fs.rmSync(buildDir, { recursive: true, force: true });

            console.log(`✅ Website generated successfully: ${finalDir}`);
            
            return {
                success: true,
                restaurant_name: restaurantData.restaurant_info.name,
                restaurant_id: restaurantData.restaurant_info.id,
                output_directory: finalDir
            };

        } catch (error) {
            console.error(`❌ Failed to generate website for ${restaurantFile}:`, error.message);
            process.exit(1);
        }
    }

    // Generate websites for multiple restaurants
    async generateMultiple(restaurantFiles) {
        const results = [];
        
        console.log(`\n🚀 Starting generation for ${restaurantFiles.length} restaurants...\n`);

        for (const restaurantFile of restaurantFiles) {
            const result = await this.generateSingle(restaurantFile);
            results.push(result);
        }

        // Generate summary
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        const summary = {
            total_restaurants: restaurantFiles.length,
            successful_builds: successful.length,
            failed_builds: failed.length,
            generated_at: new Date().toISOString(),
            successful_restaurants: successful,
            failed_restaurants: failed
        };

        // Save summary
        const summaryPath = path.resolve(__dirname, this.outputDir, '_generation_summary.json');
        fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

        console.log(`\n📊 Generation Summary:`);
        console.log(`- Total: ${summary.total_restaurants}`);
        console.log(`- Successful: ${summary.successful_builds}`);
        console.log(`- Failed: ${summary.failed_builds}`);
        console.log(`- Summary saved: ${summaryPath}`);

        return summary;
    }

    // Clean up temp directories
    cleanup() {
        if (fs.existsSync(this.tempDir)) {
            fs.rmSync(this.tempDir, { recursive: true, force: true });
        }
    }
}

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {};

    // Parse command line arguments
    let restaurantFiles = [];
    let generateAll = false;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--all') {
            generateAll = true;
        } else if (arg === '--restaurant' && args[i + 1]) {
            restaurantFiles.push(args[i + 1]);
            i++;
        } else if (arg === '--template' && args[i + 1]) {
            options.template = args[i + 1];
            i++;
        } else if (arg === '--output' && args[i + 1]) {
            options.outputDir = args[i + 1];
            i++;
        } else if (!arg.startsWith('--')) {
            restaurantFiles.push(arg);
        }
    }

    const builder = new WebsiteBuilder(options);

    // Determine which restaurants to build
    if (generateAll) {
        const placesDir = path.resolve(__dirname, builder.placesDir);
        restaurantFiles = fs.readdirSync(placesDir)
            .filter(file => file.endsWith('.json') && !file.startsWith('_'));
    }

    if (restaurantFiles.length === 0) {
        console.log('Usage: node website-builder.js [options] [restaurant-files...]');
        console.log('');
        console.log('Options:');
        console.log('  --all                 Generate websites for all restaurants');
        console.log('  --restaurant <file>   Generate website for specific restaurant');
        console.log('  --template <name>     Use specific template (default: modern-nextjs)');
        console.log('  --output <dir>        Output directory (default: ../final_websites)');
        console.log('');
        console.log('Examples:');
        console.log('  node website-builder.js --restaurant sanabel_al_salam_102737.json');
        console.log('  node website-builder.js --template modern-nextjs --restaurant sanabel_al_salam_102737.json');
        console.log('  node website-builder.js --all');
        console.log('  node website-builder.js mcdonalds_14622.json herfy_19550.json');
        process.exit(1);
    }

    // Generate websites
    if (restaurantFiles.length === 1) {
        builder.generateSingle(restaurantFiles[0])
            .then(result => {
                builder.cleanup();
                process.exit(result.success ? 0 : 1);
            });
    } else {
        builder.generateMultiple(restaurantFiles)
            .then(summary => {
                builder.cleanup();
                process.exit(summary.failed_builds === 0 ? 0 : 1);
            });
    }
}

module.exports = WebsiteBuilder;
