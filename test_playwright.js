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
