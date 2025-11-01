// test_tictactoe.js
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testTicTacToe() {
  // Create Chrome options
    let options = new chrome.Options();
    options.addArguments('headless');
    options.addArguments('disable-gpu')
    options.setChromeBinaryPath('/usr/bin/google-chrome');
  
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  try {
    await driver.get('http://54.89.150.159/index.html');
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="optionsDlg"]/div')), 5000);

     try {
      // --- Click Play button ---
      const playButton = await driver.findElement(By.id('okBtn'));
      await playButton.click();

    } catch (e) {
      console.log("❌ No options dialog detected, continuing...");
    }   

    await driver.wait(until.elementLocated(By.id("cell0")), 5000);
    // Click the first cell
    const cell = await driver.findElement(By.id("cell0"));
    await cell.click();
    
    // Intentionally wait for wrong text to force failure
    await driver.wait(until.elementTextContains(cell, 'O'), 3000);

    console.log('✅ Test Success: Cell contains O');

  } catch (e) {
    console.log('❌ Test Failed and skip next step:', e);
    process.exit(1);
  } finally {
    await driver.quit();
  }
}
 testTicTacToe();
