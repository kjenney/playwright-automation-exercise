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
      '--disable-extensions'
    ]
  });
  
  const context = await browser.newContext();
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
    await page.getByRole('button', { name: '' }).first().click(); // Search button
    await page.waitForLoadState('networkidle');

    // Step 4: Extract product data from the first row of results
    console.log('📊 Extracting product data from search results...');
    const products = await page.evaluate(() => {
      // Get all product containers in the search results section
      const productContainers = document.querySelectorAll('.features_items .col-sm-4');
      
      // Extract data from the first few products (first row typically contains 3-4 products)
      const products = [];
      
      // Limit to first 4 products to represent the first row
      for (let i = 0; i < Math.min(4, productContainers.length); i++) {
        const container = productContainers[i];
        
        // Extract product name from paragraph element
        const nameElement = container.querySelector('.productinfo p');
        const name = nameElement ? nameElement.textContent.trim() : '';
        
        // Extract price from h2 element
        const priceElement = container.querySelector('.productinfo h2');
        const price = priceElement ? priceElement.textContent.trim() : '';
        
        if (name && price) {
          products.push({
            name: name,
            price: price
          });
        }
      }
      
      return products;
    });

    // Step 5: Display results
    console.log('✅ Search completed successfully!');
    console.log('📋 First row of search results for "dress":');
    console.log(JSON.stringify(products, null, 2));

    // Return the results
    return products;

  } catch (error) {
    console.error('❌ Error during automation:', error);
    throw error;
  } finally {
    // Close browser
    await browser.close();
    console.log('🔒 Browser closed.');
  }
}

// Main execution
async function main() {
  try {
    const results = await automateProductSearch();
    
    console.log('\n🎯 Final Results (JSON):');
    console.log(JSON.stringify(results, null, 2));
    
    // You can also save to file if needed
    const fs = require('fs');
    fs.writeFileSync('search_results.json', JSON.stringify(results, null, 2));
    console.log('💾 Results saved to search_results.json');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Run the script if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { automateProductSearch };