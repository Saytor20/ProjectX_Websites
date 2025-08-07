#!/bin/bash

# Restaurant Website Generator - Setup Script
# This script configures the CLI for your system

echo "🌐 Restaurant Website Generator - Setup"
echo "======================================"

# Get current directory
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

print_color() {
    echo -e "${1}${2}${NC}"
}

print_color $CYAN "Setting up Restaurant Website Generator..."
echo

# 1. Check requirements
print_color $YELLOW "1. Checking system requirements..."

# Check Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_color $GREEN "✅ Node.js found: $NODE_VERSION"
else
    print_color $RED "❌ Node.js not found. Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_color $GREEN "✅ npm found: v$NPM_VERSION"
else
    print_color $RED "❌ npm not found. Please install npm."
    exit 1
fi

# Check Python3 (for local server)
if command -v python3 >/dev/null 2>&1; then
    PYTHON_VERSION=$(python3 --version)
    print_color $GREEN "✅ Python3 found: $PYTHON_VERSION"
else
    print_color $YELLOW "⚠️  Python3 not found. You won't be able to preview websites locally."
fi

echo

# 2. Update CLI script with current path
print_color $YELLOW "2. Configuring CLI script..."

if [ -f "$CURRENT_DIR/websites" ]; then
    # Create backup
    cp "$CURRENT_DIR/websites" "$CURRENT_DIR/websites.backup"
    
    # Update PROJECT_ROOT in the CLI script
    sed -i.tmp "s|PROJECT_ROOT=\".*\"|PROJECT_ROOT=\"$CURRENT_DIR\"|g" "$CURRENT_DIR/websites"
    rm "$CURRENT_DIR/websites.tmp" 2>/dev/null
    
    print_color $GREEN "✅ CLI script updated with current path: $CURRENT_DIR"
else
    print_color $RED "❌ CLI script 'websites' not found!"
    exit 1
fi

# 3. Make CLI executable
chmod +x "$CURRENT_DIR/websites"
print_color $GREEN "✅ CLI script made executable"

# 4. Install dependencies
print_color $YELLOW "3. Installing dependencies..."

if [ -d "$CURRENT_DIR/templates/_shared" ]; then
    cd "$CURRENT_DIR/templates/_shared"
    
    print_color $CYAN "Installing npm packages..."
    if npm install; then
        print_color $GREEN "✅ Dependencies installed successfully"
    else
        print_color $RED "❌ Failed to install dependencies"
        exit 1
    fi
    
    cd "$CURRENT_DIR"
else
    print_color $RED "❌ Templates directory not found!"
    exit 1
fi

echo

# 5. Verify setup
print_color $YELLOW "4. Verifying setup..."

# Check if templates exist
TEMPLATE_COUNT=$(find templates/variants -maxdepth 1 -type d | wc -l)
TEMPLATE_COUNT=$((TEMPLATE_COUNT - 1)) # Subtract 1 for the variants directory itself
print_color $GREEN "✅ Found $TEMPLATE_COUNT templates"

# Check if restaurant data exists
if [ -d "$CURRENT_DIR/places_json" ]; then
    RESTAURANT_COUNT=$(ls places_json/*.json 2>/dev/null | wc -l)
    print_color $GREEN "✅ Found $RESTAURANT_COUNT restaurants"
else
    print_color $RED "❌ Restaurant data directory not found!"
fi

# Create final_websites directory if it doesn't exist
if [ ! -d "$CURRENT_DIR/final_websites" ]; then
    mkdir -p "$CURRENT_DIR/final_websites"
    print_color $GREEN "✅ Created final_websites directory"
fi

echo
print_color $GREEN "🎉 Setup completed successfully!"
echo
print_color $CYAN "Next Steps:"
echo "1. Run the CLI: ./websites"
echo "2. Select 'Build Websites'"  
echo "3. Choose a template and restaurant"
echo "4. Wait for website generation (~2-3 minutes)"
echo "5. Preview your website at http://localhost:8080"
echo
print_color $YELLOW "📚 For detailed instructions, see:"
echo "   • README.md - Quick start guide"
echo "   • CLI_GUIDE.md - Detailed CLI documentation"
echo
print_color $CYAN "🚀 Ready to generate beautiful restaurant websites!"