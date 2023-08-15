import { fork } from 'child_process';
import puppeteer from 'puppeteer';

jest.setTimeout(90000);

describe('Test validation form', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    server = fork('./e2e.server.js');
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        } else {
          reject();
        }
      });
    });

    browser = await puppeteer.launch({
      headless: true,
    //   slowMo: 100,
    //   devtools: true,
    });

    page = await browser.newPage();
  });

  test('add new product, with valid input', async () => {
    await page.goto('http://localhost:9000');
    await page.waitForSelector('.products');
    await page.locator('.add').click();

    await page.locator('.name_input').fill('samsung');
    await page.locator('.price_input').fill('30000');
    await page.locator('.save_btn').click();

    await page.waitForSelector('.product');
  });

  test('edit product', async () => {
    await page.locator('.edit').click();

    await page.locator('.name_input').fill('samsung folid');
    await page.locator('.price_input').fill('150000');
    await page.locator('.save_btn').click();

    await page.waitForSelector('.product');
  });

  test('cancel button', async () => {
    await page.locator('.edit').click();
    await page.locator('.cancel_btn').click();

    await page.waitForSelector('.modal', { hidden: true });
  });

  test('remove product', async () => {
    await page.locator('.delete').click();

    await page.$eval('.product', () => false).catch(() => false);
  });

  test('add new product, with not valid name input', async () => {
    await page.locator('.add').click();

    await page.locator('.name_input').fill('');
    await page.locator('.price_input').fill('30000');
    await page.locator('.save_btn').click();

    await page.waitForSelector('.form_error');
  });

  test('add new product, with not valid price input (valueMissing)', async () => {
    await page.locator('.name_input').fill('apple');
    await page.locator('.price_input').fill('');
    await page.locator('.save_btn').click();

    await page.waitForSelector('.form_error');
  });

  test('add new product, with not valid price input (patternMismatch)', async () => {
    await page.locator('.name_input').fill('apple');
    await page.locator('.price_input').fill('0');
    await page.locator('.save_btn').click();

    await page.waitForSelector('.form_error');

    await page.locator('.price_input').fill('asdasd');
    await page.locator('.save_btn').click();

    await page.waitForSelector('.form_error');
  });

  afterAll(async () => {
    await browser.close();
    await server.kill();
  });
});
