# Playwright Automation Exercise

This project contains a Playwright automation script that demonstrates web scraping and automation capabilities by searching for products on the AutomationExercise.com website.

## Overview

The automation script performs the following actions:
1. Navigates to https://www.automationexercise.com/
2. Clicks on the "Products" link in the navigation
3. Searches for "dress" in the search form
4. Extracts product names and prices from the first row of search results
5. Returns the data as JSON and saves it to a file

## Prerequisites

### System Requirements
- Ubuntu Linux (18.04 or later recommended)
- Node.js (version 14 or later)
- npm (comes with Node.js)

### Installing Node.js on Ubuntu

If you don't have Node.js installed, you can install it using one of these methods:

#### Method 1: Using NodeSource Repository (Recommended)
```bash
# Update package index
sudo apt update

# Install curl if not already installed
sudo apt install curl

# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### Method 2: Using Ubuntu's Default Repository
```bash
sudo apt update
sudo apt install nodejs npm
```

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd playwright-automation-exercise
   ```

2. **Run the automated setup:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

   Or manually install:
   ```bash
   npm install playwright
   npx playwright install
   sudo npx playwright install-deps
   ```

## Project Structure

```
playwright-automation-exercise/
├── README.md                      # This file
├── automation_script.js           # Main automation script (headless optimized)
├── package.json                  # Node.js dependencies
├── setup.sh                      # Ubuntu setup script
├── troubleshoot.sh               # Ubuntu troubleshooting script
├── QUICKSTART.md                 # Quick start instructions
└── search_results.json           # Output file (created after running)
```

## Usage

### Quick Start
```bash
# Make scripts executable
chmod +x setup.sh troubleshoot.sh

# Run setup
./setup.sh

# Run the automation
node automation_script.js
```

### If You Get Display/X Server Errors

If you see errors like "Missing X server or $DISPLAY", try these solutions:

#### Solution 1: Run the troubleshoot script
```bash
chmod +x troubleshoot.sh
./troubleshoot.sh
```

#### Solution 2: Use xvfb (Virtual Display)
```bash
# Install xvfb if not already installed
sudo apt install xvfb

# Run with virtual display
xvfb-run -a node automation_script.js
```

#### Solution 3: Check the script has headless: true
Make sure your automation_script.js has:
```javascript
const browser = await chromium.launch({ 
  headless: true,  // Must be true for servers without display
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});
```

### Alternative Running Methods

**Basic run:**
```bash
node automation_script.js
```

**With npm:**
```bash
npm start
```

**With xvfb (for display issues):**
```bash
xvfb-run -a node automation_script.js
```

**Debug mode:**
```bash
DEBUG=pw:api node automation_script.js
```

## Expected Output

### Console Output
```
🚀 Starting automation script in headless mode...
📍 Navigating to https://www.automationexercise.com/
🔗 Clicking on Products link...
🔍 Searching for "dress"...
📊 Extracting product data from search results...
✅ Search completed successfully!
📋 First row of search results for "dress":
[
  {
    "name": "Sleeveless Dress",
    "price": "Rs. 1000"
  },
  {
    "name": "Stylish Dress",
    "price": "Rs. 1500"
  },
  {
    "name": "Sleeves Top and Short - Blue & Pink",
    "price": "Rs. 478"
  },
  {
    "name": "Sleeveless Unicorn Patch Gown - Pink",
    "price": "Rs. 1050"
  }
]

🎯 Final Results (JSON):
[Same JSON data as above]
💾 Results saved to search_results.json
🔒 Browser closed.
```

## Troubleshooting

### Common Ubuntu Issues and Solutions

#### 1. "Missing X server or $DISPLAY" Error
This happens when the browser tries to open in GUI mode on a headless server.

**Solutions:**
```bash
# Option A: Use xvfb virtual display
sudo apt install xvfb
xvfb-run -a node automation_script.js

# Option B: Run troubleshoot script
./troubleshoot.sh

# Option C: Verify headless mode in script
# Make sure automation_script.js has headless: true
```

#### 2. Browser Installation Issues
```bash
# Install system dependencies
sudo apt update
sudo apt install -y libnss3-dev libatk-bridge2.0-dev libdrm-dev libxkbcommon-dev libgtk-3-dev libasound2-dev

# Reinstall browser binaries
npx playwright install chromium
sudo npx playwright install-deps chromium
```

#### 3. Permission Errors
```bash
# Fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Or install with proper permissions
npm install playwright --unsafe-perm=true
```

#### 4. WSL (Windows Subsystem for Linux) Issues
If running in WSL:
```bash
# Make sure you're using WSL 2
wsl --set-version Ubuntu 2

# Set display if needed
export DISPLAY=:0

# Use headless mode (recommended for WSL)
# Ensure headless: true in the script
```

#### 5. Network/Timeout Issues
```bash
# Test basic connectivity
ping automationexercise.com

# Increase timeouts in script or run with:
DEBUG=pw:api node automation_script.js
```

## Advanced Usage

### Testing Playwright Installation
```bash
# Run basic test
node -e "console.log('Testing...'); const { chromium } = require('playwright'); (async () => { const browser = await chromium.launch({headless: true}); console.log('✅ Playwright working!'); await browser.close(); })()"
```

### Running with Different Options
```bash
# Slow motion (for debugging)
# Edit script and add: slowMo: 1000 to launch options

# Different browser
# Change chromium to firefox or webkit in the script

# Custom search term
# Edit the script and change 'dress' to your desired search term
```

### Environment Variables
```bash
# Set display for GUI apps (if needed)
export DISPLAY=:0

# Debug Playwright
export DEBUG=pw:api

# Then run the script
node automation_script.js
```

## Files Description

- **automation_script.js**: Main script optimized for headless Ubuntu execution
- **setup.sh**: Automated setup script for Ubuntu systems
- **troubleshoot.sh**: Diagnostic and fix script for common Ubuntu issues
- **package.json**: Node.js project configuration
- **README.md**: This comprehensive documentation
- **QUICKSTART.md**: Quick reference guide

## Contributing

Feel free to modify the script for your specific needs:
- Add error handling for specific scenarios
- Extract additional product information
- Implement pagination handling
- Add support for multiple search terms
- Create CSV output format

## License

This project is for educational and demonstration purposes. Please respect the website's robots.txt and terms of service when using this script.

## Support

If you encounter issues:

1. **First, run the troubleshoot script:**
   ```bash
   ./troubleshoot.sh
   ```

2. **Check common solutions:**
   - Ensure `headless: true` is set in the script
   - Try running with `xvfb-run -a node automation_script.js`
   - Verify all dependencies are installed

3. **For persistent issues:**
   - Check if you're in WSL (Windows Subsystem for Linux)
   - Verify Ubuntu version compatibility
   - Test with: `node test_playwright.js` (created by troubleshoot script)

4. **Get help:**
   - Check Playwright documentation: https://playwright.dev/
   - Ubuntu community forums
   - Playwright GitHub issues

The script is specifically optimized for Ubuntu headless execution with comprehensive error handling and troubleshooting support.