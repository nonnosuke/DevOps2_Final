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
    await driver.get('http://54.175.235.187/index.html');
    await driver.sleep(10000);

      try {
    // --- Select easy ---
      const easyRadio = await driver.findElement(By.id('r0'));
      await easyRadio.click();

      const xRadio = await driver.findElement(By.id('rx'));
      await xRadio.click();

       // --- Click Play button ---
      const playButton = await driver.findElement(By.id('okBtn'));
      await playButton.click();

    } catch (e) {
      console.log("❌ No options dialog detected, continuing...");
    }    

    await driver.wait(until.elementLocated(By.id("cell0")), 10000);
    // Click the first cell
    const cell = await driver.findElement(By.id("cell0"));
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
      console.log('✅ Test Success: Cell shows correct mark');
    }

  } catch (e) {
    console.log('❌ Test Failed:', e);
    process.exit(1);
  } finally {
    await driver.quit();
  }
})();

