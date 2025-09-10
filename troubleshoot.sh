#!/bin/bash

# Ubuntu Playwright Troubleshooting Script
echo "🔧 Playwright Ubuntu Troubleshooting & Fix Script"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "automation_script.js" ]; then
    echo "❌ automation_script.js not found. Make sure you're in the project directory."
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo "📁 Files in directory:"
ls -la

echo ""
echo "🔍 Checking system environment..."

# Check if running in WSL
if grep -qi microsoft /proc/version; then
    echo "🐧 Detected: Running in WSL (Windows Subsystem for Linux)"
    WSL_DETECTED=true
else
    echo "🐧 Detected: Native Ubuntu Linux"
    WSL_DETECTED=false
fi

# Check for display environment
echo "🖥️  Display environment:"
echo "   DISPLAY variable: ${DISPLAY:-'Not set'}"
echo "   WAYLAND_DISPLAY: ${WAYLAND_DISPLAY:-'Not set'}"

# Check if X server is running
if command -v xdpyinfo >/dev/null 2>&1; then
    if xdpyinfo >/dev/null 2>&1; then
        echo "   X Server: ✅ Running"
    else
        echo "   X Server: ❌ Not accessible"
    fi
else
    echo "   X Server: ❓ xdpyinfo not installed"
fi

echo ""
echo "🔧 Applying fixes..."

# Fix 1: Install missing system dependencies
echo "📦 Installing/updating system dependencies..."
sudo apt update -qq
sudo apt install -y \
    libnss3-dev \
    libatk-bridge2.0-dev \
    libdrm-dev \
    libxkbcommon-dev \
    libgtk-3-dev \
    libasound2-dev \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcairo-gobject2 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    xvfb

echo "✅ System dependencies installed"

# Fix 2: Ensure Playwright browsers are properly installed
echo "🌐 Reinstalling Playwright browsers..."
npx playwright install chromium
npx playwright install-deps chromium

echo "✅ Playwright browsers reinstalled"

# Fix 3: Create a headless-optimized version of the script
echo "🖥️  Creating headless-optimized script..."
cat > automation_script_headless.js << 'EOF'
const { chromium } = require('playwright');

async function automateProductSearch() {
  // Launch browser with explicit headless configuration for Ubuntu
  const browser = await chromium.launch({ 
    headless: true,
    // Additional args for better Ubuntu compatibility
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });
  
  const context = await browser.newContext({
    // Additional context options for headless mode
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    console.log('🚀 Starting automation script in headless mode...');
    
    // Step 1: Navigate to the website
    console.log('📍 Navigating to https://www.automationexercise.com/');
    await page.goto('https://www.automationexercise.com/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Step 2: Click on Products link
    console.log('🔗 Clicking on Products link...');
    await page.getByRole('link', { name: ' Products' }).click();
    await page.waitForLoadState('networkidle');

    // Step 3: Search for "dress"
    console.log('🔍 Searching for "dress"...');
    await page.getByRole('textbox', { name: 'Search Product' }).fill('dress');
    await page.getByRole('button', { name: '' }).first().click();
    await page.waitForLoadState('networkidle');

    // Step 4: Extract product data from the first row of results
    console.log('📊 Extracting product data from search results...');
    const products = await page.evaluate(() => {
      const productContainers = document.querySelectorAll('.features_items .col-sm-4');
      const products = [];
      
      for (let i = 0; i < Math.min(4, productContainers.length); i++) {
        const container = productContainers[i];
        const nameElement = container.querySelector('.productinfo p');
        const name = nameElement ? nameElement.textContent.trim() : '';
        const priceElement = container.querySelector('.productinfo h2');
        const price = priceElement ? priceElement.textContent.trim() : '';
        
        if (name && price) {
          products.push({ name: name, price: price });
        }
      }
      
      return products;
    });

    console.log('✅ Search completed successfully!');
    console.log('📋 First row of search results for "dress":');
    console.log(JSON.stringify(products, null, 2));

    return products;

  } catch (error) {
    console.error('❌ Error during automation:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('🔒 Browser closed.');
  }
}

async function main() {
  try {
    const results = await automateProductSearch();
    
    console.log('\n🎯 Final Results (JSON):');
    console.log(JSON.stringify(results, null, 2));
    
    const fs = require('fs');
    fs.writeFileSync('search_results.json', JSON.stringify(results, null, 2));
    console.log('💾 Results saved to search_results.json');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { automateProductSearch };
EOF

echo "✅ Created automation_script_headless.js"

# Fix 4: Create test scripts
echo "🧪 Creating test scripts..."

# Simple Playwright test
cat > test_playwright.js << 'EOF'
const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing Playwright basic functionality...');
  
  try {
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    
    console.log('✅ Playwright test successful!');
    console.log('📄 Page title:', title);
    
    await browser.close();
  } catch (error) {
    console.error('❌ Playwright test failed:', error.message);
  }
})();
EOF

echo "✅ Created test_playwright.js"

echo ""
echo "🎯 Troubleshooting complete! Try these options:"
echo ""
echo "1. 🔄 Run the updated script:"
echo "   node automation_script.js"
echo ""
echo "2. 🖥️  Run the headless-optimized version:"
echo "   node automation_script_headless.js"
echo ""
echo "3. 🧪 Test basic Playwright functionality:"
echo "   node test_playwright.js"
echo ""
echo "4. 🐧 If still having issues, try with xvfb:"
echo "   xvfb-run -a node automation_script.js"
echo ""

if [ "$WSL_DETECTED" = true ]; then
    echo "💡 WSL-specific tips:"
    echo "   - Make sure you have WSL 2 installed"
    echo "   - Consider using Windows Terminal"
    echo "   - If issues persist, try: export DISPLAY=:0"
    echo ""
fi

echo "📚 For more help, check README.md or run one of the test commands above."
