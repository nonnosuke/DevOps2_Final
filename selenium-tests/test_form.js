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

    //Initial page
    // Wait for modal buttons to appear
    await driver.wait(until.elementLocated(By.id('yesBtn')), 8000);
    await driver.findElement(By.id('yesBtn')).click();

    await driver.wait(until.elementLocated(By.xpath('//*[@id="rx"]')), 3000);
    await driver.findElement(By.xpath('//*[@id="rx"]')).click();

    await driver.findElement(By.id("okBtn")).click();

    await driver.wait(until.elementLocated(By.id("cell0")), 5000);

    // Click the first cell
    const cell = await driver.findElement(By.id("cell0"));
    //fix error
   // await driver.executeScript("arguments[0].innerHTML = 'x';", cell);
    await cell.click();

    // Wait for the cell to update (X or O)
    await driver.wait(async () => {
      const text = await cell.getAttribute('innerHTML');
      return text && text.trim() !== '';
    }, 3000);

    // Get the text content and check
    const result = await cell.getAttribute('innerHTML');
    console.log('Cell content:', result);
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

