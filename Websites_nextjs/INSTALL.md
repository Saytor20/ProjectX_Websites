# 🛠️ Installation Guide

## System Requirements

### Prerequisites
- **Operating System**: macOS, Linux, or Windows (with WSL recommended)
- **Node.js**: Version 18 or higher ([Download here](https://nodejs.org/))
- **npm**: Comes with Node.js installation
- **Git**: For repository management
- **Terminal**: Command line access

### Hardware Recommendations
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space for dependencies and generated websites
- **CPU**: Any modern processor (build process can be CPU intensive)

## Quick Installation

### 1. Clone Repository
```bash
git clone git@github.com:Saytor20/ProjectX_Websites.git
cd ProjectX_Websites
```

### 2. Make CLI Executable
```bash
chmod +x websites
```

### 3. Install Dependencies
```bash
cd templates/_shared
npm install
cd ../..
```

### 4. Configure Path (Optional)
Update the `websites` script with your actual path:
```bash
# Edit the websites script
nano websites

# Change this line:
PROJECT_ROOT="/Users/mohammadalmusaiteer/Project Shawrma-Website temp/Websites_nextjs"

# To your actual path:
PROJECT_ROOT="/your/actual/path/to/ProjectX_Websites"
```

### 5. Test Installation
```bash
./websites
```

## Detailed Installation Steps

### Step 1: Node.js Installation

#### macOS (Homebrew)
```bash
brew install node
```

#### macOS/Linux (Node Version Manager)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

#### Windows
1. Download installer from [nodejs.org](https://nodejs.org/)
2. Run installer with default settings
3. Restart command prompt

#### Verify Installation
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### Step 2: Repository Setup

#### Using SSH (Recommended)
```bash
git clone git@github.com:Saytor20/ProjectX_Websites.git
cd ProjectX_Websites
```

#### Using HTTPS
```bash
git clone https://github.com/Saytor20/ProjectX_Websites.git
cd ProjectX_Websites
```

#### Download ZIP (Alternative)
1. Go to [GitHub repository](https://github.com/Saytor20/ProjectX_Websites)
2. Click "Code" → "Download ZIP"
3. Extract to desired location
4. Open terminal in extracted folder

### Step 3: Dependency Installation

#### Install Core Dependencies
```bash
cd templates/_shared
npm install
```

#### Verify Installation
```bash
ls node_modules/  # Should show installed packages
npm list --depth=0  # Show top-level dependencies
```

#### Common Dependencies Installed
- `next@15.4.2` - React framework
- `react@19.1.0` - UI library
- `@mui/material@7.2.0` - UI components
- `typescript@5.x` - Type checking
- `tailwindcss@4.0` - Utility CSS

### Step 4: Configuration

#### Update Project Path
The CLI script needs to know your project location:

```bash
# Find your current path
pwd

# Edit the websites script
nano websites  # or use your preferred editor

# Update PROJECT_ROOT variable
PROJECT_ROOT="/your/actual/path/to/ProjectX_Websites"
```

#### Set Executable Permissions
```bash
chmod +x websites
```

### Step 5: Verification

#### Test CLI Functionality
```bash
./websites
```

Expected output:
```
🌐 Restaurant Website Generator

1. Build Websites
2. System Status
3. List Templates
4. List Restaurants
5. Clean Generated Sites
6. Exit

Choose an option (1-6):
```

#### Test System Status
1. Run `./websites`
2. Select option `2` (System Status)
3. Verify all components show ✅ green checkmarks

## Troubleshooting Installation

### Common Issues

#### "Permission denied" when running ./websites
```bash
chmod +x websites
```

#### "node: command not found"
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart terminal after installation
- Verify with `node --version`

#### "npm install" fails with permission errors
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Or use node version manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

#### "Project directory not found"
- Update `PROJECT_ROOT` in the `websites` script
- Use absolute path (starting with `/`)
- Verify path with `pwd` command

#### Build errors during template generation
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
cd templates/_shared
rm -rf node_modules package-lock.json
npm install
```

### System Diagnostics

#### Check Installation Health
```bash
# Node.js version
node --version

# npm version
npm --version

# Verify project structure
ls -la
# Should see: places_json/, templates/, final_websites/, websites*

# Test dependencies
cd templates/_shared
npm list
```

#### Performance Testing
```bash
# Test build performance
time ./websites
# Select option 1, build a test website
# Note: First build takes longer due to dependency setup
```

### Advanced Configuration

#### Custom Node.js Installation Path
```bash
# If using custom Node.js installation, update PATH
export PATH="/path/to/your/node/bin:$PATH"

# Add to ~/.bashrc or ~/.zshrc for persistence
echo 'export PATH="/path/to/your/node/bin:$PATH"' >> ~/.bashrc
```

#### Network Configuration
```bash
# If behind corporate firewall, configure npm
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

## Platform-Specific Instructions

### macOS
```bash
# Install Xcode command line tools (if not already installed)
xcode-select --install

# Install Homebrew (if not already installed)  
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js via Homebrew
brew install node
```

### Linux (Ubuntu/Debian)
```bash
# Update package manager
sudo apt update

# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Windows (WSL Recommended)
```bash
# Install WSL2 first, then use Linux instructions
# Or use Windows installer from nodejs.org

# If using Command Prompt or PowerShell:
# Download and run installer from https://nodejs.org/
```

## Post-Installation

### First Website Generation
```bash
# Run CLI
./websites

# Select "1. Build Websites" 
# Choose any template (e.g., "Modern Restaurant")
# Select any restaurant (e.g., "Al Hatab")
# Wait for generation (2-3 minutes first time)
# Website opens automatically in browser
```

### Backup Configuration
```bash
# Create backup of working installation
cp websites websites.backup
tar -czf projectx-backup.tar.gz templates/ places_json/
```

## Next Steps

After successful installation:

1. **Read Documentation**: 
   - `CLI_GUIDE.md` - Learn CLI interface
   - `TEMPLATE_CREATION_GUIDELINES.md` - Create custom templates

2. **Generate Test Website**: Create your first restaurant website

3. **Explore Templates**: Try different design templates

4. **Add Custom Data**: Add your own restaurant data files

---

## Quick Installation Summary

For experienced users:

```bash
# Clone and setup
git clone git@github.com:Saytor20/ProjectX_Websites.git
cd ProjectX_Websites
chmod +x websites

# Install dependencies  
cd templates/_shared && npm install && cd ../..

# Update path in websites script (edit PROJECT_ROOT)

# Test installation
./websites
```

**Installation complete! 🎉 Ready to generate restaurant websites.**