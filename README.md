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

1. **Clone or download this project directory:**
   ```bash
   # If you have the files, navigate to the project directory
   cd playwright-automation-exercise
   ```

2. **Initialize npm and install dependencies:**
   ```bash
   # Initialize package.json if it doesn't exist
   npm init -y
   
   # Install Playwright
   npm install playwright
   ```

3. **Install Playwright browsers:**
   ```bash
   # This downloads the browser binaries (Chrome, Firefox, Safari)
   npx playwright install
   ```

   If you encounter permission issues, you might need to install system dependencies:
   ```bash
   # Install system dependencies for browsers
   npx playwright install-deps
   ```

## Project Structure

```
playwright-automation-exercise/
├── README.md                 # This file
├── automation_script.js      # Main automation script
├── package.json             # Node.js dependencies
├── setup.sh                 # Setup script for Ubuntu
└── search_results.json      # Output file (created after running)
```

## Usage

### Quick Start
```bash
# Make setup script executable and run it
chmod +x setup.sh
./setup.sh
```

### Basic Usage

Run the automation script:
```bash
node automation_script.js
```

The script will:
- Open a Chrome browser window (visible by default)
- Navigate through the automation steps
- Display progress in the console
- Save results to `search_results.json`
- Close the browser automatically

### Alternative npm commands
```bash
npm start          # Run the script
npm run install-browsers  # Install browser binaries
npm run install-deps     # Install system dependencies
```

### Running in Headless Mode

To run the browser in the background (headless mode), modify the script:

1. Open `automation_script.js`
2. Change `headless: false` to `headless: true` in the browser launch options
3. Run the script normally

### Custom Search Terms

To search for different products, modify the search term in the script:
1. Open `automation_script.js`
2. Find the line: `await page.getByRole('textbox', { name: 'Search Product' }).fill('dress');`
3. Replace 'dress' with your desired search term
4. Save and run the script

## Expected Output

### Console Output
```
🚀 Starting automation script...
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

### File Output
A file named `search_results.json` will be created containing the extracted product data.

## Troubleshooting

### Common Issues and Solutions

#### 1. Browser Installation Issues
If you encounter errors related to browser installation:
```bash
# Install system dependencies
sudo apt update
sudo apt install -y libnss3-dev libatk-bridge2.0-dev libdrm-dev libxkbcommon-dev libgtk-3-dev libasound2-dev

# Reinstall browser binaries
npx playwright install chromium
```

#### 2. Permission Errors
If you get permission errors:
```bash
# Fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Or use npm with --unsafe-perm flag
sudo npm install playwright --unsafe-perm=true --allow-root
```

#### 3. Display Issues (Headless Mode)
If running on a server without a display and getting display errors:
- Make sure to set `headless: true` in the script
- Or install a virtual display:
```bash
sudo apt install xvfb
export DISPLAY=:99
Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
```

#### 4. Network Issues
If the script fails to load the website:
- Check your internet connection
- Verify that https://www.automationexercise.com/ is accessible
- Try increasing timeout values in the script

#### 5. Element Not Found Errors
If the script can't find page elements:
- The website structure might have changed
- Try adding wait conditions or increasing delays
- Use Playwright's debug mode: `DEBUG=pw:api node automation_script.js`

## Advanced Usage

### Debug Mode
Run with debug output:
```bash
DEBUG=pw:api node automation_script.js
```

### Slow Motion
To slow down the automation for better visibility, modify the browser launch:
```javascript
const browser = await chromium.launch({ 
  headless: false, 
  slowMo: 1000 // 1 second delay between actions
});
```

### Different Browsers
To use Firefox or Safari instead of Chrome:
```javascript
const { firefox } = require('playwright');
// or
const { webkit } = require('playwright');

const browser = await firefox.launch({ headless: false });
```

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
1. Check the troubleshooting section above
2. Ensure all dependencies are properly installed
3. Verify your Ubuntu version compatibility
4. Check Playwright documentation: https://playwright.dev/
5. Test with a simple Playwright example first

## Script Details

The automation uses Playwright's modern web automation capabilities:
- **Page Navigation**: Uses `page.goto()` for reliable navigation
- **Element Selection**: Utilizes role-based selectors for better reliability
- **Wait Conditions**: Implements `waitForLoadState()` to ensure page readiness
- **Data Extraction**: Uses `page.evaluate()` for client-side JavaScript execution
- **Error Handling**: Comprehensive try-catch blocks with cleanup
- **Logging**: Detailed console output for debugging and monitoring

This script demonstrates best practices for web automation including proper resource cleanup, error handling, and reliable element selection strategies.