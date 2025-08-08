#!/usr/bin/env bash
set -euo pipefail

# Restaurant Website Deployment Script
# Deploys a generated website to Vercel

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

print_color() {
    echo -e "${1}${2}${NC}"
}

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SITE_SLUG="${1:-}"

print_header() {
    print_color $CYAN "🚀 Restaurant Website Deployment Tool"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Check if site slug provided
if [ -z "$SITE_SLUG" ]; then
    print_header
    print_color $RED "❌ Error: Please specify a site to deploy"
    echo
    echo "Usage: ./deploy-site.sh <site-name>"
    echo "Example: ./deploy-site.sh al_othaim_137466"
    echo
    echo "Available sites:"
    if [ -d "$PROJECT_ROOT/final_websites" ]; then
        ls -1 "$PROJECT_ROOT/final_websites" | head -10
        if [ $(ls -1 "$PROJECT_ROOT/final_websites" | wc -l) -gt 10 ]; then
            print_color $YELLOW "... and $(( $(ls -1 "$PROJECT_ROOT/final_websites" | wc -l) - 10 )) more"
        fi
    else
        print_color $YELLOW "No generated websites found. Run './websites' first to generate sites."
    fi
    exit 1
fi

TARGET_DIR="$PROJECT_ROOT/final_websites/$SITE_SLUG"

print_header
print_color $CYAN "Deploying: $SITE_SLUG"
print_color $CYAN "Source directory: $TARGET_DIR"
echo

# Verify site exists
if [ ! -d "$TARGET_DIR" ]; then
  print_color $RED "❌ Site not found at: $TARGET_DIR"
  echo
  print_color $YELLOW "Available sites:"
  if [ -d "$PROJECT_ROOT/final_websites" ]; then
      ls -1 "$PROJECT_ROOT/final_websites"
  else
      print_color $YELLOW "No generated websites found. Run './websites' first to generate sites."
  fi
  exit 1
fi

# Check for Vercel CLI
if ! command -v vercel >/dev/null 2>&1; then
    print_color $RED "❌ Vercel CLI not found"
    echo
    print_color $YELLOW "To install Vercel CLI:"
    echo "  npm install -g vercel"
    echo "  # or"
    echo "  pnpm add -g vercel"
    echo "  # or"
    echo "  yarn global add vercel"
    echo
    print_color $CYAN "After installation, run:"
    echo "  vercel login"
    exit 1
fi

# Deploy to Vercel
print_color $YELLOW "🚀 Deploying to Vercel..."
echo

cd "$TARGET_DIR"

# Check if already initialized as Vercel project
if [ ! -f ".vercel/project.json" ]; then
    print_color $CYAN "Initializing Vercel project..."
    vercel --yes
else
    print_color $CYAN "Deploying to production..."
    vercel --prod --yes
fi

deployment_exit=$?

if [ $deployment_exit -eq 0 ]; then
    print_color $GREEN "✅ Deployment completed successfully!"
    echo
    print_color $CYAN "Your website is now live on Vercel!"
    print_color $YELLOW "Check your Vercel dashboard for the live URL"
else
    print_color $RED "❌ Deployment failed"
    exit 1
fi

