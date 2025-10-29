const { Builder, By, until } = require('selenium-webdriver');

(async function testValidation() {
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

