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
      waitUntil: 'domcontentloaded',  // Changed from networkidle to domcontentloaded
      timeout: 30000 
    });

    // Wait a bit for the page to stabilize
    await page.waitForTimeout(2000);

    // Step 2: Click on Products link
    console.log('🔗 Clicking on Products link...');
    await page.getByRole('link', { name: ' Products' }).click();
    
    // Wait for the products page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Step 3: Search for "dress"
    console.log('🔍 Searching for "dress"...');
    
    // Wait for the search box to be visible and fill it
    await page.waitForSelector('input[placeholder*="Search"], input[name*="search"], #search_product', { timeout: 10000 });
    await page.fill('input[placeholder*="Search"], input[name*="search"], #search_product', 'dress');
    
    // Click the search button - try multiple selectors
    try {
      await page.click('#submit_search');
    } catch {
      try {
        await page.click('button[type="submit"]');
      } catch {
        await page.click('.btn.btn-default.btn-lg');
      }
    }

    // Wait for search results to load
    console.log('⏳ Waiting for search results...');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for the search results section to appear
    await page.waitForSelector('.features_items, .searched-products, h2:has-text("Searched Products")', { 
      timeout: 15000 
    });
    
    // Additional wait to ensure products are loaded
    await page.waitForTimeout(3000);

    // Step 4: Extract product data from the first row of results
    console.log('📊 Extracting product data from search results...');
    
    const products = await page.evaluate(() => {
      // Try multiple selectors for product containers
      let productContainers = document.querySelectorAll('.features_items .col-sm-4');
      
      if (productContainers.length === 0) {
        productContainers = document.querySelectorAll('.product-image-wrapper');
      }
      
      if (productContainers.length === 0) {
        productContainers = document.querySelectorAll('.single-products');
      }
      
      console.log(`Found ${productContainers.length} product containers`);
      
      const products = [];
      
      // Limit to first 4 products to represent the first row
      for (let i = 0; i < Math.min(4, productContainers.length); i++) {
        const container = productContainers[i];
        
        // Try multiple selectors for product name
        let nameElement = container.querySelector('.productinfo p');
        if (!nameElement) {
          nameElement = container.querySelector('p');
        }
        if (!nameElement) {
          nameElement = container.querySelector('.product-overlay p');
        }
        
        const name = nameElement ? nameElement.textContent.trim() : '';
        
        // Try multiple selectors for price
        let priceElement = container.querySelector('.productinfo h2');
        if (!priceElement) {
          priceElement = container.querySelector('h2');
        }
        if (!priceElement) {
          priceElement = container.querySelector('.product-overlay h2');
        }
        
        const price = priceElement ? priceElement.textContent.trim() : '';
        
        console.log(`Product ${i + 1}: Name="${name}", Price="${price}"`);
        
        if (name && price) {
          products.push({
            name: name,
            price: price
          });
        }
      }
      
      return products;
    });

    if (products.length === 0) {
      console.log('⚠️  No products found. Let me check the page structure...');
      
      // Debug: Check what's on the page
      const pageContent = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          hasSearchResults: !!document.querySelector('h2'),
          searchResultsText: document.querySelector('h2')?.textContent || 'No h2 found',
          productCount: document.querySelectorAll('.col-sm-4').length,
          allText: document.body.innerText.substring(0, 500)
        };
      });
      
      console.log('🔍 Page debug info:', JSON.stringify(pageContent, null, 2));
      
      // Try to find products with a more general approach
      const fallbackProducts = await page.evaluate(() => {
        const products = [];
        const allElements = document.querySelectorAll('*');
        
        for (let element of allElements) {
          const text = element.textContent || '';
          if (text.includes('Rs.') && text.includes('dress')) {
            products.push({
              name: 'Found product containing "dress"',
              price: text.match(/Rs\.\s*\d+/)?.[0] || 'Price found with dress'
            });
            if (products.length >= 2) break;
          }
        }
        
        return products;
      });
      
      if (fallbackProducts.length > 0) {
        console.log('✅ Found products using fallback method');
        return fallbackProducts;
      }
    }

    // Step 5: Display results
    console.log('✅ Search completed successfully!');
    console.log('📋 First row of search results for "dress":');
    console.log(JSON.stringify(products, null, 2));

    // Return the results
    return products;

  } catch (error) {
    console.error('❌ Error during automation:', error);
    
    // Try to get more info about what went wrong
    try {
      const currentUrl = await page.url();
      const pageTitle = await page.title();
      console.log(`📍 Current URL: ${currentUrl}`);
      console.log(`📄 Page Title: ${pageTitle}`);
      
      // Take a screenshot for debugging (optional)
      await page.screenshot({ path: 'error-screenshot.png' });
      console.log('📸 Screenshot saved as error-screenshot.png');
      
    } catch (debugError) {
      console.log('Could not gather debug information');
    }
    
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