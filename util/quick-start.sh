#!/bin/bash

# Restaurant Website Generator - Quick Start
# One-command setup and demo generation

echo "🚀 Restaurant Website Generator - Quick Start"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

print_color() {
    echo -e "${1}${2}${NC}"
}

# Get current directory
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

print_color $CYAN "Starting quick setup and demo generation..."
echo

# 1. Run setup
print_color $YELLOW "🔧 Running setup..."
if [ -f "$CURRENT_DIR/setup.sh" ]; then
    bash "$CURRENT_DIR/setup.sh"
else
    print_color $RED "❌ setup.sh not found!"
    exit 1
fi

echo

# 2. Generate a demo website
print_color $YELLOW "🎨 Generating demo website..."
print_color $CYAN "   Template: Modern Restaurant"
print_color $CYAN "   Restaurant: First available restaurant"

cd "$CURRENT_DIR"

# Find first restaurant JSON file
FIRST_RESTAURANT=$(ls places_json/*.json | head -n 1)
if [ -z "$FIRST_RESTAURANT" ]; then
    print_color $RED "❌ No restaurant data found!"
    exit 1
fi

RESTAURANT_NAME=$(basename "$FIRST_RESTAURANT" .json)
print_color $CYAN "   Selected: $RESTAURANT_NAME"

# Generate website using the direct method
print_color $YELLOW "Building website..."

# Create temporary script to automate CLI interaction
cat > temp_auto_build.sh << 'EOF'
#!/bin/bash
# Auto-build script

# Simulate CLI selections
echo "1"    # Build Websites
echo "1"    # Modern Restaurant template  
echo "1"    # First restaurant
echo "4"    # Exit after completion
EOF

chmod +x temp_auto_build.sh

# Run the automated build
if timeout 600 ./temp_auto_build.sh | ./websites; then
    print_color $GREEN "✅ Demo website generated successfully!"
else
    # Fallback to direct generator call
    print_color $YELLOW "Trying direct generation..."
    cd generator
    if node website-builder.js --template modern-restaurant --restaurant "../$FIRST_RESTAURANT"; then
        print_color $GREEN "✅ Demo website generated successfully!"
    else
        print_color $RED "❌ Failed to generate demo website"
        rm -f ../temp_auto_build.sh
        exit 1
    fi
    cd ..
fi

# Cleanup
rm -f temp_auto_build.sh

# 3. Launch preview
print_color $YELLOW "🌐 Launching preview..."

# Find generated website
GENERATED_SITES=$(find final_websites -maxdepth 1 -type d -not -name "final_websites" | head -n 1)

if [ -n "$GENERATED_SITES" ]; then
    SITE_NAME=$(basename "$GENERATED_SITES")
    print_color $GREEN "✅ Website generated: $SITE_NAME"
    
    # Start local server
    cd "$GENERATED_SITES"
    print_color $CYAN "🚀 Starting local server..."
    print_color $YELLOW "   Opening: http://localhost:8080"
    print_color $YELLOW "   Press Ctrl+C to stop the server"
    echo
    
    # Try to open browser (works on macOS and some Linux)
    if command -v open >/dev/null 2>&1; then
        open http://localhost:8080 2>/dev/null &
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open http://localhost:8080 2>/dev/null &
    fi
    
    # Start Python server
    python3 -m http.server 8080
else
    print_color $RED "❌ No generated website found!"
    print_color $YELLOW "💡 Try running: ./websites manually"
fi

echo
print_color $GREEN "🎉 Quick start completed!"
print_color $CYAN "To generate more websites, run: ./websites"