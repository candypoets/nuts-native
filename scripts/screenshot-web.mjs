import { chromium } from 'playwright-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_PATH = process.argv[2] || './screenshot.png';
const BUNDLE = process.argv[3] || 'main';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.wasm': 'application/wasm',
  '.bundle': 'application/octet-stream',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  let filePath = req.url.split('?')[0];

  if (filePath.endsWith('.web.bundle')) {
    filePath = path.join(process.cwd(), 'dist', path.basename(filePath));
  } else if (filePath === '/' || filePath === '/index.html') {
    filePath = path.join(process.cwd(), 'web-host', 'index.html');
  } else {
    filePath = path.join(process.cwd(), filePath);
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    const ext = path.extname(filePath);
    const mime = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
});

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  console.log(`Server running at http://127.0.0.1:${port}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.error(`[PAGE ERROR] ${err.message}`));

  try {
    await page.goto(`http://127.0.0.1:${port}/?bundle=${BUNDLE}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('lynx-view', { timeout: 15000 });
    await page.waitForTimeout(5000);

    const state = await page.evaluate(() => {
      const lv = document.querySelector('lynx-view');
      return lv ? {
        shadowHtml: lv.shadowRoot?.innerHTML?.substring(0, 500) || 'no shadow root',
        innerHtml: lv.innerHTML?.substring(0, 500) || 'empty',
        url: lv.getAttribute('url'),
      } : 'no lynx-view found';
    });
    console.log('lynx-view state:', JSON.stringify(state, null, 2));

    await page.screenshot({ path: SCREENSHOT_PATH, fullPage: false });
    console.log(`Screenshot saved to ${SCREENSHOT_PATH}`);
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: SCREENSHOT_PATH, fullPage: false });
    console.log(`Fallback screenshot saved to ${SCREENSHOT_PATH}`);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
