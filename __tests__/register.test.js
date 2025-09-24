const puppeteer = require('puppeteer');

const BASE_URL = "http://localhost:3000";

describe("Register", () => {
  let browser;
  let page;

  const first_name = 'input[placeholder="Enter your first name"]';
  const last_name = 'input[placeholder="Enter your last name"]';
  const username = 'input[placeholder="Enter your username"]';
  const email = 'input[placeholder="Corporate email"]';
  const password = 'input[placeholder="Please choose a strong password"]';
  const confirmPassword = 'input[placeholder="Confirm your password"]';
  const tos = 'input[type="checkbox"]';
  const registerButton = 'button[type="submit"]';

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto(`${BASE_URL}/auth/register`);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should display error for mismatching passwords", async () => {
    await page.waitForSelector(password);
    await page.type(password, 'Passw0rd!');

    await page.waitForSelector(confirmPassword);
    await page.type(confirmPassword, 'DifferentPass!');

    await page.waitForSelector(registerButton);
    await page.click(registerButton);

    const passwordError = await page.$eval('.ant-form-item-explain-error', el => el.textContent);
    expect(passwordError).toBe("Passwords do not match");
  });


  it("should display error for invalid email format", async () => {
    await page.waitForSelector(email);
    await page.type(email, 'invalidemail@domain');

    await page.waitForSelector(registerButton);
    await page.click(registerButton);

    const emailError = await page.$eval('.ant-form-item-explain-error', el => el.textContent);
    expect(emailError).toBe("Please enter a valid business email");
  });

  it("should register successfully with valid inputs", async () => {
    await page.waitForSelector(first_name);
    await page.type(first_name, 'John');
    
    await page.waitForSelector(last_name);
    await page.type(last_name, 'Doe');
    
    await page.waitForSelector(username);
    await page.type(username, 'testuser');
    
    await page.waitForSelector(email);
    await page.click(email);
    for (i = 0; i < 25; i++) {
      await page.keyboard.press("Backspace");
    }
    await page.type(email, 'test@business.com');
    
    await page.waitForSelector(password);
    await page.click(password);
    for (i = 0; i < 25; i++) {
      await page.keyboard.press("Backspace");
    }
    await page.type(password, 'Passw0rd!');
    
    await page.waitForSelector(confirmPassword);
    await page.click(confirmPassword);
    for (i = 0; i < 25; i++) {
      await page.keyboard.press("Backspace");
    }
    await page.type(confirmPassword, 'Passw0rd!');
    
    await page.waitForSelector(tos);
    await page.click(tos);
    
    await page.waitForSelector(registerButton);
    await page.click(registerButton);

    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    expect(page.url()).toBe(`${BASE_URL}/auth/login`);
  });
});