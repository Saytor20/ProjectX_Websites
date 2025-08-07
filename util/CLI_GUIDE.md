# Restaurant Website Generator CLI Guide

## 🚀 Quick Start

### Run the CLI
```bash
cd "/Users/mohammadalmusaiteer/Project Shawrma-Website temp/Websites_nextjs"
./websites
```

## 📋 Main Menu Options

### 1. Build Websites
Interactive workflow to generate restaurant websites:
- **Select Template**: Choose from available templates (modern-restaurant, classic-restaurant, minimal-cafe)
- **Select Restaurant**: Choose specific restaurant or generate all 100
- **Automated Generation**: Build process with real-time feedback

### 2. Update Template Configuration
Scans template directory and updates configuration:
- Automatically detects available templates
- Updates `templates/template-config.json`
- Validates template structure

### 3. System Status
Shows comprehensive system information:
- Template count and availability
- Restaurant data file count
- Generated website count
- Dependency status (Node.js, npm, Python3)

### 4. Exit
Safely exits the CLI application

## 🎨 Templates

### Available Templates
1. **Modern Restaurant** (Default)
   - Best for: restaurants, fast-food, cafes, desserts
   - Features: Modern design, bilingual support, interactive elements

2. **Classic Restaurant** (Coming Soon)
   - Best for: fine-dining, traditional, hotel restaurants
   - Features: Elegant typography, sophisticated design

3. **Minimal Cafe** (Coming Soon) 
   - Best for: cafes, bakeries, coffee shops
   - Features: Clean, minimal design

### Template Auto-Selection
The system automatically selects appropriate templates based on restaurant type:
- Desserts → Modern Restaurant
- Coffee → Minimal Cafe
- Fast Food → Modern Restaurant
- Traditional → Classic Restaurant
- Cafe → Minimal Cafe
- Restaurant → Modern Restaurant

## 🍽️ Restaurant Data

### Data Location
Restaurant data files are stored in: `places_json/`

### File Format
Each restaurant has a JSON file with structure:
```json
{
  "restaurant_info": {
    "name": "Restaurant Name",
    "type_of_food": "Fast Food",
    "region": "Riyadh",
    "id": "unique_id"
  }
}
```

### Viewing Restaurant Data
- Use option 22 in restaurant selection to see all available restaurants
- Files are named with format: `restaurant_name_id.json`

## 🌐 Generated Websites

### Output Location
Generated websites are stored in: `final_websites/`

### Viewing Websites
After generation, start a local server:
```bash
cd final_websites/restaurant_name/
python3 -m http.server 8080
```
Then open: http://localhost:8080

### Website Structure
Each generated website includes:
- `index.html` - Main website file
- `_next/` - Next.js build assets
- `deployment-info.json` - Build metadata
- `package.json` - Dependencies

## 🔧 System Requirements

### Required Dependencies
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **Python3** (for local server)

### Installation Check
The CLI automatically checks for required dependencies on startup.

## ⚠️ Common Issues & Solutions

### 1. "Command not found: ./websites"
**Solution**: Make script executable
```bash
chmod +x websites
```

### 2. "Project directory not found"
**Solution**: Update PROJECT_ROOT variable in the script to match your actual path

### 3. "No templates found"
**Solution**: Run "Update Template Configuration" from main menu

### 4. "No restaurant data found"
**Solution**: Ensure JSON files exist in `places_json/` directory

### 5. Website generation fails
**Solution**: 
- Check Node.js installation
- Verify template exists
- Check restaurant JSON file format

## 🚀 Performance Notes

### Single Website Generation
- **Time**: ~2-3 minutes per website
- **Resources**: Moderate CPU and memory usage

### Bulk Generation (All 100)
- **Time**: ~3 hours total
- **Resources**: High CPU usage, monitor system performance
- **Recommendation**: Run during off-peak hours

## 🔄 Git Integration

### Remote Branch Detection
The system automatically detects the default remote branch to avoid push conflicts:
- Uses `git symbolic-ref` for detection
- Falls back to `git remote show origin` 
- Final fallback to "main" branch

This prevents the "refspec does not match any" error when pushing to repositories.

## 📊 Monitoring & Logging

### Build Progress
- Real-time feedback during generation
- Error messages with exit codes
- Success confirmation with next steps

### System Status
- Dependency verification
- File count monitoring
- Template validation

## 🔧 Advanced Usage

### Direct Command Line (Alternative)
You can also run the website builder directly:
```bash
cd generator/
node website-builder.js --template modern-restaurant --restaurant restaurant_file.json
```

### Template Development
To add new templates:
1. Create template directory in `templates/`
2. Add `template.json` with metadata
3. Run "Update Template Configuration"

## 📞 Troubleshooting

### Getting Help
1. Use "System Status" menu option to check system health
2. Verify all dependencies are installed
3. Check file permissions on scripts
4. Ensure restaurant data files are valid JSON

### Error Recovery
- The CLI includes loop protection to prevent infinite loops
- Maximum 100 iterations per session for safety
- Automatic dependency checking on startup
- Graceful error handling with user feedback

## 🎯 Best Practices

1. **Before Starting**: Always run "System Status" to verify setup
2. **Template Selection**: Use auto-selection for best results
3. **Testing**: Generate single websites first before bulk operations
4. **Monitoring**: Watch for error messages during generation
5. **Performance**: Close other applications during bulk generation

---

*For technical issues or feature requests, check the project documentation or contact the development team.*