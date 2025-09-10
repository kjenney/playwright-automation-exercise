#!/bin/bash

# Playwright Automation Exercise Setup Script
# This script sets up the environment for running the Playwright automation

set -e  # Exit on any error

echo "🚀 Setting up Playwright Automation Exercise..."
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Installing Node.js..."
    
    # Update package index
    sudo apt update
    
    # Install curl if not already installed
    sudo apt install -y curl
    
    # Add NodeSource repository and install Node.js
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    
    echo "✅ Node.js installed successfully"
else
    echo "✅ Node.js is already installed: $(node --version)"
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available"
    exit 1
else
    echo "✅ npm is available: $(npm --version)"
fi

echo "📦 Installing npm dependencies..."
# Install Playwright
npm install playwright

echo "🌐 Installing browser binaries..."
# Install Playwright browsers
npx playwright install

echo "🔧 Installing system dependencies..."
# Install system dependencies for browsers (might require sudo)
if command -v sudo &> /dev/null; then
    sudo npx playwright install-deps || echo "⚠️  Could not install system dependencies. You might need to run this manually."
else
    npx playwright install-deps || echo "⚠️  Could not install system dependencies. You might need to run this manually."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo "=============================================="
echo ""
echo "📋 Next steps:"
echo "1. Run the automation script: node automation_script.js"
echo "   or use npm: npm start"
echo ""
echo "📖 For more information, see README.md"
echo ""
echo "🔧 Troubleshooting:"
echo "- If you encounter browser issues, try: npm run install-browsers"
echo "- For system dependency issues, try: npm run install-deps"
echo "- To run in headless mode, edit automation_script.js and set headless: true"
echo ""

# Test if the script is executable
if [ -f "automation_script.js" ]; then
    echo "✅ automation_script.js found - ready to run!"
else
    echo "⚠️  automation_script.js not found. Make sure to copy/create the script file."
fi

echo "✨ Setup complete! Happy automating!"