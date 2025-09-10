const { chromium } = require('playwright');

async function debugAutomation() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔍 DEBUG: Starting step-by-step automation...');
    
    // Step 1: Navigate to website
    console.log('📍 DEBUG: Navigating to https://www.automationexercise.com/');
    await page.goto('https://www.automationexercise.com/', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    console.log('✅ DEBUG: Main page loaded');
    console.log(`📄 Page title: ${await page.title()}`);
    console.log(`📍 Current URL: ${page.url()}`);
    
    // Check if Products link exists
    const productsLink = await page.locator('a:has-text("Products")').first();
    const isVisible = await productsLink.isVisible();
    console.log(`🔗 DEBUG: Products link visible: ${isVisible}`);
    
    if (isVisible) {
      // Step 2: Click Products link
      console.log('🔗 DEBUG: Clicking on Products link...');
      await productsLink.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      console.log('✅ DEBUG: Products page loaded');
      console.log(`📍 Current URL: ${page.url()}`);
      
      // Check for search box
      const searchSelectors = [
        'input[placeholder*="Search"]',
        'input[name*="search"]', 
        '#search_product',
        '.form-control'
      ];
      
      let searchBox = null;
      for (const selector of searchSelectors) {
        try {
          searchBox = await page.locator(selector).first();
          if (await searchBox.isVisible()) {
            console.log(`🔍 DEBUG: Found search box with selector: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (searchBox) {
        // Step 3: Search for dress
        console.log('🔍 DEBUG: Filling search box with "dress"...');
        await searchBox.fill('dress');
        
        // Find and click search button
        const searchButtonSelectors = [
          '#submit_search',
          'button[type="submit"]',
          '.btn-default',
          'button:has-text("Search")',
          'i.fa-search'
        ];
        
        let searchButton = null;
        for (const selector of searchButtonSelectors) {
          try {
            searchButton = await page.locator(selector).first();
            if (await searchButton.isVisible()) {
              console.log(`🔘 DEBUG: Found search button with selector: ${selector}`);
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (searchButton) {
          console.log('🔘 DEBUG: Clicking search button...');
          await searchButton.click();
          
          // Wait for results
          console.log('⏳ DEBUG: Waiting for search results...');
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(3000);
          
          console.log(`📍 Current URL after search: ${page.url()}`);
          console.log(`📄 Page title after search: ${await page.title()}`);
          
          // Check for search results
          const resultsSelectors = [
            'h2:has-text("Searched Products")',
            '.features_items',
            '.searched-products',
            '.col-sm-4'
          ];
          
          for (const selector of resultsSelectors) {
            const count = await page.locator(selector).count();
            console.log(`🔍 DEBUG: Found ${count} elements with selector: ${selector}`);
          }
          
          // Try to extract products
          console.log('📊 DEBUG: Attempting to extract products...');
          const products = await page.evaluate(() => {
            const results = [];
            
            // Get all potential product containers
            const containers = document.querySelectorAll('.col-sm-4, .product-image-wrapper, .single-products');
            console.log(`Found ${containers.length} potential product containers`);
            
            for (let i = 0; i < Math.min(4, containers.length); i++) {
              const container = containers[i];
              const allText = container.innerText || container.textContent || '';
              
              // Look for price patterns
              const priceMatch = allText.match(/Rs\.\s*\d+/);
              const price = priceMatch ? priceMatch[0] : '';
              
              // Look for product names (text before price or in specific elements)
              const nameElements = container.querySelectorAll('p, h2, .product-name, .productinfo p');
              let name = '';
              
              for (const el of nameElements) {
                const text = el.textContent.trim();
                if (text && !text.startsWith('Rs.') && text.length > 2) {
                  name = text;
                  break;
                }
              }
              
              if (!name) {
                // Fallback: extract first meaningful text
                const lines = allText.split('\n').filter(line => 
                  line.trim() && 
                  !line.startsWith('Rs.') && 
                  !line.includes('Add to cart') &&
                  !line.includes('View Product') &&
                  line.length > 2
                );
                name = lines[0] || 'Unknown Product';
              }
              
              if (name && price) {
                results.push({ name: name.trim(), price: price.trim() });
              }
            }
            
            return results;
          });
          
          console.log('📊 DEBUG: Extracted products:');
          console.log(JSON.stringify(products, null, 2));
          
          return products;
          
        } else {
          console.log('❌ DEBUG: Could not find search button');
        }
      } else {
        console.log('❌ DEBUG: Could not find search box');
      }
    } else {
      console.log('❌ DEBUG: Products link not found or not visible');
    }
    
  } catch (error) {
    console.error('❌ DEBUG: Error occurred:', error);
    
    // Save page content for analysis
    try {
      const content = await page.content();
      require('fs').writeFileSync('debug-page-content.html', content);
      console.log('💾 DEBUG: Page content saved to debug-page-content.html');
    } catch (e) {
      console.log('Could not save page content');
    }
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  debugAutomation();
}