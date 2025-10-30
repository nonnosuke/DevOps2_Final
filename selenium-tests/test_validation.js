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
    await driver.get('http://23.20.189.207/index.html');
    await driver.sleep(3000);

     try {
      const easyRadio = await driver.findElement(By.id('r0'));
      await easyRadio.click();
      
      // --- Select player (X) ---
      const xRadio = await driver.findElement(By.id('rx'));
      await xRadio.click();

       // --- Click Play button ---
      const playButton = await driver.findElement(By.id('okBtn'));
      await playButton.click();

    } catch (e) {
      console.log("ℹ️ No options dialog detected, continuing...");
    }


    //Initial page
    // Wait for modal buttons to appear
    //await driver.wait(until.elementLocated(By.id('yesBtn')), 8000);
    //await driver.findElement(By.id('yesBtn')).click();

    //await driver.wait(until.elementLocated(By.xpath('//*[@id="rx"]')), 3000);
    //await driver.findElement(By.xpath('//*[@id="rx"]')).click();

   // await driver.findElement(By.id("okBtn")).click();

    await driver.wait(until.elementLocated(By.id("cell0")), 5000);
    // Click the first cell
    const cell = await driver.findElement(By.id("cell0"));
    //fix error
   // await driver.executeScript("arguments[0].innerHTML = 'x';", cell);
    await cell.click();

    // Intentionally wait for wrong text to force failure
    await driver.wait(until.elementTextContains(cell, 'O'), 3000);

    console.log('✅ Test Passed: Cell contains O');

  } catch (e) {
    console.log('❌ Test Failed with error:', e);
  } finally {
    await driver.quit();
  }
})();
