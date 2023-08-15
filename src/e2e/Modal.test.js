import { fork } from 'child_process';
import puppeteer from 'puppeteer';

jest.setTimeout(20000);

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
      // headless: true,
    //   slowMo: 100,
    //   devtools: true,
    });

    page = await browser.newPage();
  });

  test('add new product, with valid input', async () => {
    await page.goto('http://localhost:9000');
    await page.waitForSelector('.container');
  });

  afterAll(async () => {
    await browser.close();
    await server.kill();
  });
});
