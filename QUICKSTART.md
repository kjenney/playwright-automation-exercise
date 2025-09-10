# Quick Start Guide

## For Ubuntu Linux Users

### 1. Navigate to the project directory
```bash
cd /Users/kjenney/devel/claude/playwright-automation-exercise
```

### 2. Make the setup script executable
```bash
chmod +x setup.sh
```

### 3. Run the automated setup
```bash
./setup.sh
```

This will:
- Install Node.js (if not already installed)
- Install Playwright and dependencies
- Install browser binaries
- Install system dependencies

### 4. Run the automation script
```bash
node automation_script.js
```
or
```bash
npm start
```

### 5. View results
The script will:
- Display results in the console
- Save results to `search_results.json`

## Manual Installation (Alternative)

If the setup script doesn't work, follow these steps:

```bash
# Install Node.js
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install dependencies
npm install playwright
npx playwright install
sudo npx playwright install-deps

# Run the script
node automation_script.js
```

## Expected Results

The script should extract product data like:
```json
[
  {
    "name": "Sleeveless Dress",
    "price": "Rs. 1000"
  },
  {
    "name": "Stylish Dress",
    "price": "Rs. 1500"
  }
]
```

For detailed information, see README.md