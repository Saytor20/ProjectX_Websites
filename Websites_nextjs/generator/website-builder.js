#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class WebsiteBuilder {
    constructor(options = {}) {
        this.templateName = options.template || 'modern-restaurant';
        this.sharedDir = path.resolve(__dirname, '../templates/_shared');
        this.variantDir = path.resolve(__dirname, `../templates/variants/${this.templateName}`);
        this.placesDir = options.placesDir || '../places_json';
        this.outputDir = options.outputDir || path.resolve(__dirname, '../final_websites');
        this.tempDir = path.join(__dirname, 'temp_build');
        this.templatesConfigPath = path.resolve(__dirname, '../templates/template-config.json');
    }

    // Discover available templates from variants directory
    discoverTemplates() {
        const variantsDir = path.resolve(__dirname, '../templates/variants');
        if (!fs.existsSync(variantsDir)) {
            console.error('Variants directory not found:', variantsDir);
            return [];
        }

        const templates = [];
        const entries = fs.readdirSync(variantsDir, { withFileTypes: true });
        
        for (let entry of entries) {
            if (entry.isDirectory()) {
                const templateJsonPath = path.join(variantsDir, entry.name, 'template.json');
                if (fs.existsSync(templateJsonPath)) {
                    try {
                        const templateConfig = JSON.parse(fs.readFileSync(templateJsonPath, 'utf8'));
                        templates.push({
                            id: entry.name,
                            name: templateConfig.name || entry.name,
                            description: templateConfig.description || 'No description',
                            recommended_for: templateConfig.recommended_for || []
                        });
                    } catch (error) {
                        console.warn(`Warning: Could not parse template.json for ${entry.name}:`, error.message);
                    }
                }
            }
        }
        
        return templates;
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

    // Merge shared and variant structures
    async mergeSharedAndVariant(buildDir) {
        console.log('Merging shared base with template variant...');
        
        // First, copy everything from _shared
        if (fs.existsSync(this.sharedDir)) {
            await this.copyDirectorySync(this.sharedDir, buildDir);
            console.log('✓ Copied shared base structure');
        } else {
            throw new Error(`Shared directory not found: ${this.sharedDir}`);
        }

        // Then, overlay the variant-specific files
        if (fs.existsSync(this.variantDir)) {
            await this.copyDirectorySync(this.variantDir, buildDir);
            console.log(`✓ Applied ${this.templateName} variant`);
        } else {
            throw new Error(`Template variant not found: ${this.variantDir}`);
        }
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

        // Merge shared and variant structures
        await this.mergeSharedAndVariant(buildDir);

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

        console.log(`✓ Template prepared in: ${buildDir}`);
        return buildDir;
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

            return true;
        } catch (error) {
            console.error('Build failed:', error.message);
            return false;
        }
    }

    // Deploy built website to final location
    async deployWebsite(buildDir, restaurantData, restaurantFile) {
        const restaurantName = restaurantFile.replace('.json', '');
        const deployDir = path.join(this.outputDir, restaurantName);
        
        // Clean deploy directory
        if (fs.existsSync(deployDir)) {
            fs.rmSync(deployDir, { recursive: true, force: true });
        }
        
        // Copy built files
        const exportDir = path.join(buildDir, 'out');
        if (fs.existsSync(exportDir)) {
            await this.copyDirectorySync(exportDir, deployDir);
        } else {
            throw new Error('Export directory not found after build');
        }

        // Copy restaurant data file
        const buildDataPath = path.join(buildDir, 'restaurant-data.json');
        const deployDataPath = path.join(deployDir, 'restaurant-data.json');
        if (fs.existsSync(buildDataPath)) {
            fs.copyFileSync(buildDataPath, deployDataPath);
        }

        // Create deployment info
        const deploymentInfo = {
            template: this.templateName,
            restaurant: restaurantData.restaurant_info.name,
            generated_at: new Date().toISOString(),
            restaurant_file: restaurantFile,
            build_directory: buildDir,
            deploy_directory: deployDir
        };
        
        fs.writeFileSync(
            path.join(deployDir, 'deployment-info.json'), 
            JSON.stringify(deploymentInfo, null, 2)
        );

        console.log(`✅ Website deployed to: ${deployDir}`);
        return deployDir;
    }

    // Main build process
    async buildForRestaurant(restaurantFile) {
        console.log(`\n🚀 Starting website build for: ${restaurantFile}`);
        console.log(`📋 Using template: ${this.templateName}`);
        
        try {
            // Load restaurant data
            const restaurantPath = path.resolve(__dirname, this.placesDir, restaurantFile);
            if (!fs.existsSync(restaurantPath)) {
                throw new Error(`Restaurant file not found: ${restaurantPath}`);
            }
            
            const restaurantData = JSON.parse(fs.readFileSync(restaurantPath, 'utf8'));
            
            // Prepare template
            const buildDir = await this.prepareTemplate(restaurantData, restaurantFile);
            
            // Build website
            const buildSuccess = await this.buildWebsite(buildDir, restaurantData);
            if (!buildSuccess) {
                throw new Error('Website build failed');
            }
            
            // Deploy website
            const deployDir = await this.deployWebsite(buildDir, restaurantData, restaurantFile);
            
            // Clean up temp directory
            if (fs.existsSync(buildDir)) {
                fs.rmSync(buildDir, { recursive: true, force: true });
            }
            
            console.log(`\n✅ Website generation completed successfully!`);
            console.log(`📁 Website location: ${deployDir}`);
            
            return {
                success: true,
                deployDir: deployDir,
                restaurantName: restaurantData.restaurant_info.name
            };
            
        } catch (error) {
            console.error(`\n❌ Website generation failed:`, error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Clone a website using httrack or wget
    async cloneWebsite(url, tool = 'httrack') {
        console.log(`\n🚀 Cloning website from: ${url} using ${tool}`);
        const cloneDir = path.resolve(__dirname, '../templates/clone');
        
        try {
            if (!fs.existsSync(cloneDir)) {
                fs.mkdirSync(cloneDir, { recursive: true });
            }

            let command;
            if (tool === 'httrack') {
                command = `httrack "${url}" -O "${cloneDir}"`;
            } else if (tool === 'wget') {
                const domain = new URL(url).hostname;
                command = `/opt/homebrew/bin/wget --recursive --no-clobber --page-requisites --html-extension --convert-links --restrict-file-names=windows --domains ${domain} -P "${cloneDir}" "${url}"`;
            } else {
                throw new Error(`Unsupported cloning tool: ${tool}. Please use 'httrack' or 'wget'.`);
            }

            console.log(`Executing: ${command}`);
            execSync(command, { stdio: 'inherit' });

            console.log(`\n✅ Website cloned successfully!`);
            console.log(`📁 Cloned website location: ${cloneDir}`);
            
            return {
                success: true,
                cloneDir: cloneDir
            };

        } catch (error) {
            console.error(`\n❌ Website cloning failed:`, error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    let template = 'modern-restaurant';
    let restaurant = null;
    let cloneUrl = null;
    let cloneTool = 'httrack';

    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--template' && args[i + 1]) {
            template = args[i + 1];
            i++; // Skip next argument
        } else if (args[i] === '--restaurant' && args[i + 1]) {
            restaurant = args[i + 1];
            i++; // Skip next argument
        } else if (args[i] === '--clone' && args[i + 1]) {
            cloneUrl = args[i + 1];
            i++;
        } else if (args[i] === '--tool' && args[i + 1]) {
            cloneTool = args[i + 1];
            i++;
        }
    }

    const builder = new WebsiteBuilder({ template });

    if (cloneUrl) {
        builder.cloneWebsite(cloneUrl, cloneTool).then(result => {
            process.exit(result.success ? 0 : 1);
        });
    } else if (restaurant) {
        builder.buildForRestaurant(restaurant).then(result => {
            process.exit(result.success ? 0 : 1);
        });
    } else {
        console.error('❌ Error: Please specify either a restaurant to build or a URL to clone.');
        console.log('Usage for building: node website-builder.js --template <template> --restaurant <file>');
        console.log('Usage for cloning: node website-builder.js --clone <url> [--tool <httrack|wget>]');
        process.exit(1);
    }
}

module.exports = WebsiteBuilder;
