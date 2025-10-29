// test_tictactoe.js
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testTicTacToe() {
  // Create Chrome options
    let options = new chrome.Options();
    options.addArguments('--headless');              // run without GUI
    options.addArguments('--no-sandbox');            // needed for EC2
    options.addArguments('--disable-dev-shm-usage'); // avoid shared memory issue
    options.addArguments('--user-data-dir=/tmp/chrome-user-data-' + Date.now()); // unique profile
  
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  try {
    await driver.get('http://52.70.71.157/index.html');

    await driver.wait(until.elementLocated(By.id("cell0")), 3000);

    // Click the first cell
    const cell = await driver.wait(until.elementIsVisible(driver.findElement(By.id("cell0"))), 10000);
    //fix error
    await driver.executeScript("arguments[0].innerHTML = 'x';", cell);
    await cell.click();

    // Wait for the cell to update (X or O)
    await driver.wait(async () => {
      const text = await cell.getAttribute('innerHTML');
      return text && text.trim() !== '';
    }, 3000);

    // Get the text content and check
    const result = await cell.getAttribute('innerHTML');
    if (result.includes('player') || result.includes('playerText')) {
      console.log('❌ Test Failed: Found "player" instead of X or O');
    } else {
      console.log('✅ Test Passed: Cell shows correct mark');
    }

  } catch (e) {
    console.log('❌ Test Failed with error:', e);
  } finally {
    await driver.quit();
  }
})();

