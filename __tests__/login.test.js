const puppeteer = require('puppeteer');

const BASE_URL = "http://localhost:3000";

describe("Login", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`${BASE_URL}/auth/login`);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should login successfully", async () => {
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', 'test123');

    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="password"]', 'test123');

    await page.waitForSelector('button[type="submit"]');
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    expect(page.url()).toContain(`${BASE_URL}/dashboards/crypto`);
  });
});
