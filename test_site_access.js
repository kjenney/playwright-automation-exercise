const { chromium } = require('playwright');

async function testSiteAccess() {
  console.log('🧪 Testing site accessibility...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  
  try {
    // Test 1: Basic site access
    console.log('📍 Test 1: Accessing automationexercise.com...');
    const response = await page.goto('https://www.automationexercise.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    console.log(`✅ Response status: ${response.status()}`);
    console.log(`📄 Page title: ${await page.title()}`);
    console.log(`📍 Final URL: ${page.url()}`);
    
    // Test 2: Check for key elements
    console.log('\n📍 Test 2: Checking for key page elements...');
    
    const elements = {
      'Products link': 'a:has-text("Products")',
      'Navigation menu': '.navbar, nav',
      'Page content': 'body',
      'Any links': 'a'
    };
    
    for (const [name, selector] of Object.entries(elements)) {
      try {
        const count = await page.locator(selector).count();
        console.log(`${count > 0 ? '✅' : '❌'} ${name}: ${count} found`);
      } catch (e) {
        console.log(`❌ ${name}: Error checking`);
      }
    }
    
    // Test 3: Try to navigate to products page directly
    console.log('\n📍 Test 3: Direct navigation to products page...');
    await page.goto('https://www.automationexercise.com/products', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    console.log(`📄 Products page title: ${await page.title()}`);
    console.log(`📍 Products page URL: ${page.url()}`);
    
    // Check for search functionality
    const searchElements = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      const buttons = document.querySelectorAll('button');
      
      return {
        inputCount: inputs.length,
        buttonCount: buttons.length,
        hasSearchInput: !!document.querySelector('input[placeholder*="Search"], input[name*="search"], #search_product'),
        searchInputs: Array.from(inputs).map(input => ({
          type: input.type,
          placeholder: input.placeholder,
          name: input.name,
          id: input.id
        })).filter(input => 
          input.placeholder?.toLowerCase().includes('search') || 
          input.name?.toLowerCase().includes('search') ||
          input.id?.toLowerCase().includes('search')
        )
      };
    });
    
    console.log('🔍 Search elements analysis:');
    console.log(`   Total inputs: ${searchElements.inputCount}`);
    console.log(`   Total buttons: ${searchElements.buttonCount}`);
    console.log(`   Has search input: ${searchElements.hasSearchInput}`);
    console.log('   Search-related inputs:', JSON.stringify(searchElements.searchInputs, null, 4));
    
    console.log('\n✅ Site accessibility test completed!');
    
  } catch (error) {
    console.error('❌ Site accessibility test failed:', error.message);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  testSiteAccess();
}