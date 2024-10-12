const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs'); // File system module for saving screenshots

// Configure Chrome to run in headless mode
const options = new chrome.Options();
options.addArguments('headless');
options.addArguments('disable-gpu');
options.addArguments('window-size=1920x1080');

let driver;

describe('Selenium with Jest - Capture Screenshots', () => {
  // Before all tests, start the browser
  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  // After all tests, quit the browser
  afterAll(async () => {
    await driver.quit();
  });

  // Helper function to take a screenshot
  const takeScreenshot = async (filename) => {
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(filename, screenshot, 'base64');
    console.log(`Screenshot saved: ${filename}`);
  };

  test('should wait for the callback, click button, and take screenshot on failure', async () => {
    try {
      // Navigate to the /applications page
      await driver.get('http://localhost:4200/applications');

      // Wait for a specific element to load (e.g., table loaded after API call)
      await driver.wait(until.elementLocated(By.css('.table-loaded')), 10000);

      // Find and click the button in the table
      const button = await driver.findElement(By.css('table tbody tr:first-child button'));
      await driver.wait(until.elementIsVisible(button), 10000);
      await button.click();

      // Check the response (example check)
      const response = await driver.findElement(By.css('.response')).getText();
      expect(response).toContain('Expected Result');

    } catch (error) {
      // Capture a screenshot if the test fails
      await takeScreenshot('test-failure-screenshot.png');
      throw error; // Re-throw the error so Jest knows the test failed
    }
  });
});
