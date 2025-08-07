#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Data transformation script for Hungerstation data
class HungerstationDataProcessor {
    constructor(inputFile, outputDir) {
        this.inputFile = inputFile;
        this.outputDir = outputDir;
    }

    // Transform Hungerstation format to our website format
    transformRestaurantData(restaurant) {
        // Group menu items by category
        const menuCategories = {};
        
        restaurant.menu_items.forEach(item => {
            const category = item.Menu_Category || 'General';
            
            if (!menuCategories[category]) {
                menuCategories[category] = [];
            }

            // Transform menu item
            const transformedItem = {
                item_en: item.Item_Name,
                item_ar: item.Item_Name, // TODO: Add Arabic translation logic
                price: parseFloat(item.Item_Price) || 0,
                currency: "SAR",
                description: item.Menu_Description || "",
                image: item.Menu_Item_Images || "",
                offer_price: item.Offer_Price ? parseFloat(item.Offer_Price) : null,
                discount: item.Discount || "",
                menu_id: item.menu_id
            };

            menuCategories[category].push(transformedItem);
        });

        // Create transformed restaurant object
        return {
            restaurant_info: {
                id: restaurant.Restaurant_id,
                name: restaurant.Restaurant_name,
                region: restaurant.City,
                state: restaurant.State,
                country: restaurant.Country,
                coordinates: {
                    latitude: restaurant.Latitude,
                    longitude: restaurant.Longitude
                },
                rating: parseFloat(restaurant.Restaurant_Rating) || 0,
                review_count: parseInt(restaurant.Restaurant_Review_Count) || 0,
                type_of_food: restaurant.Type_of_Food,
                hungerstation_url: restaurant.Restaurant_url
            },
            menu_categories: menuCategories,
            generated_at: new Date().toISOString(),
            source: "Hungerstation"
        };
    }

    // Generate a clean filename from restaurant name
    generateFilename(restaurantName, restaurantId) {
        const cleanName = restaurantName
            .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .toLowerCase();
        
        return `${cleanName}_${restaurantId}.json`;
    }

    // Process all restaurants from input file
    async processData() {
        try {
            console.log(`Reading data from: ${this.inputFile}`);
            const rawData = fs.readFileSync(this.inputFile, 'utf8');
            const restaurants = JSON.parse(rawData);

            console.log(`Found ${restaurants.length} restaurants to process`);

            // Ensure output directory exists
            if (!fs.existsSync(this.outputDir)) {
                fs.mkdirSync(this.outputDir, { recursive: true });
            }

            const processed = [];
            
            for (let i = 0; i < restaurants.length; i++) {
                const restaurant = restaurants[i];
                console.log(`Processing ${i + 1}/${restaurants.length}: ${restaurant.Restaurant_name}`);

                try {
                    const transformedData = this.transformRestaurantData(restaurant);
                    const filename = this.generateFilename(restaurant.Restaurant_name, restaurant.Restaurant_id);
                    const outputPath = path.join(this.outputDir, filename);

                    // Write individual restaurant file
                    fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));
                    
                    processed.push({
                        id: restaurant.Restaurant_id,
                        name: restaurant.Restaurant_name,
                        filename: filename,
                        menu_items_count: restaurant.menu_items.length,
                        categories_count: Object.keys(transformedData.menu_categories).length
                    });

                } catch (error) {
                    console.error(`Error processing restaurant ${restaurant.Restaurant_name}:`, error);
                }
            }

            // Generate summary file
            const summary = {
                total_restaurants: restaurants.length,
                successfully_processed: processed.length,
                processing_date: new Date().toISOString(),
                restaurants: processed
            };

            const summaryPath = path.join(this.outputDir, '_processing_summary.json');
            fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

            console.log(`\nProcessing complete!`);
            console.log(`- Total restaurants: ${restaurants.length}`);
            console.log(`- Successfully processed: ${processed.length}`);
            console.log(`- Output directory: ${this.outputDir}`);
            console.log(`- Summary file: ${summaryPath}`);

            return summary;

        } catch (error) {
            console.error('Error processing data:', error);
            throw error;
        }
    }
}

// Script execution
if (require.main === module) {
    const inputFile = process.argv[2];
    const outputDir = process.argv[3];

    if (!inputFile || !outputDir) {
        console.log('Usage: node data-processor.js <input-file> <output-directory>');
        console.log('Example: node data-processor.js ../XBFAS_GT6971_Hungerstation_SampleData_31072025.json ../places_json');
        process.exit(1);
    }

    const processor = new HungerstationDataProcessor(inputFile, outputDir);
    processor.processData()
        .then(summary => {
            console.log('\nData processing completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('Data processing failed:', error);
            process.exit(1);
        });
}

module.exports = HungerstationDataProcessor;