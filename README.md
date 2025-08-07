# Shawrma Website Project

A comprehensive system for generating restaurant websites using AI-powered data processing and Next.js templates.

## Overview

This project automates the creation of restaurant websites by:
1. Processing restaurant data from various sources
2. Generating website templates using AI
3. Building Next.js websites with modern, responsive designs
4. Deploying websites to hosting platforms

## Project Structure

```
├── Websites_nextjs/          # Next.js website generator
│   ├── generator/            # Website generation scripts
│   ├── templates/            # Website templates
│   ├── places_json/          # Restaurant data
│   └── final_websites/       # Generated websites
├── data/                     # Data processing pipeline
│   ├── source/               # Raw restaurant data
│   ├── processed/            # Processed data
│   ├── stages_impl/          # Pipeline stages
│   └── website_templates/    # Generated templates
├── websites                  # CLI script for website generation
├── requirements.txt          # Python dependencies
└── README.md                # This file
```

## Features

- **AI-Powered Data Processing**: Uses Gemini API for restaurant data analysis
- **Website Generation**: Creates modern, responsive restaurant websites
- **Template System**: Multiple design templates for different restaurant types
- **Automated Pipeline**: End-to-end processing from data to deployment
- **Multi-language Support**: Handles Arabic and English content
- **CLI Interface**: Easy-to-use command line interface

## Quick Start

1. **Clone the repository**
   ```bash
   git clone git@github.com:Saytor20/Websites.git
   cd Websites
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Install the CLI**
   ```bash
   chmod +x websites
   ```

5. **Run the website generator**
   ```bash
   # Using the CLI
   ./websites generate --restaurant "Restaurant Name"
   
   # Or using the Node.js builder directly
   cd Websites_nextjs
   node generator/website-builder.js
   ```

## CLI Usage

The project includes a powerful CLI for website generation:

```bash
# Generate a website for a specific restaurant
./websites generate --restaurant "Restaurant Name"

# Generate multiple websites
./websites generate --batch

# List available templates
./websites templates

# Build existing templates
./websites build

# Deploy websites
./websites deploy

# Get help
./websites --help
```

## Configuration

### Environment Variables
- `GOOGLE_API_KEY`: Google Places API key
- `GEMINI_API_KEY`: Google Gemini API key
- `AZURE_FORM_RECOGNIZER_KEY`: Azure Form Recognizer key

### API Configuration
Create `config/api_config.json` with your API endpoints and keys.

## Development

### Data Processing Pipeline
The system processes restaurant data through several stages:
1. **Data Collection**: Gather restaurant information from Google Places
2. **Image Processing**: Screenshot and analyze restaurant websites
3. **OCR Processing**: Extract text from menu images
4. **AI Analysis**: Use Gemini to analyze and structure data
5. **Template Generation**: Create website templates from processed data

### Website Generation
The Next.js generator creates websites using:
- Modern React components
- Responsive design patterns
- SEO optimization
- Performance optimization

## Templates

The system includes multiple website templates:
- Modern Restaurant
- Classic Restaurant
- Cafe/Bakery
- Fast Food
- Fine Dining
- And more...

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue in the repository. 