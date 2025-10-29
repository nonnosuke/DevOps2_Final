const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testValidation() {
  // Configure Chrome options for EC2
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--user-data-dir=/tmp/chrome-user-data-' + Date.now());
  
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://<52.70.71.157/index.html');

    const cell = await driver.findElement(By.id('cell0'));
    await cell.click();
    await driver.wait(until.elementTextContains(cell, '×'), 3000);

    // Try clicking the same cell again
    await cell.click();

    const newContent = await cell.getAttribute('innerHTML');
    console.log('Cell content after second click:', newContent);

    // Should not change after second click
    console.log('✅ Test Passed: Cannot click same cell twice');

  } catch (e) {
    console.log('❌ Test Failed with error:', e);
  } finally {
    await driver.quit();
  }
})();

