const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

// Manually set the path to ChromeDriver
const chromeDriverPath = 'C:/webdrivers/chromedriver.exe';  // Adjust to the correct path where you placed chromedriver.exe
const service = new chrome.ServiceBuilder(chromeDriverPath).build();
chrome.setDefaultService(service);

const options = new chrome.Options();
options.addArguments('headless');  // Optional: run in headless mode
options.addArguments('disable-gpu');  // Optional: necessary for some environments
options.addArguments('window-size=1920x1080');  // Set the window size to avoid rendering issues

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
    if (driver) {
      await driver.quit();
    }
  });

  test('should wait for the callback, click button, and take screenshot on failure', async () => {
    try {
      await driver.get('http://localhost:4200/applications');

      // Wait for a specific element to load (e.g., after API call)
      await driver.wait(until.elementLocated(By.css('.table-loaded')), 10000);

      const button = await driver.findElement(By.css('table tbody tr:first-child button'));
      await driver.wait(until.elementIsVisible(button), 10000);
      await button.click();

      const response = await driver.findElement(By.css('.response')).getText();
      expect(response).toContain('Expected Result');
      
    } catch (error) {
      // Take a screenshot if the test fails
      const screenshot = await driver.takeScreenshot();
      const fs = require('fs');
      fs.writeFileSync('failure-screenshot.png', screenshot, 'base64');
      throw error;
    }
  });
});
