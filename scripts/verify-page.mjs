import { chromium } from 'playwright-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const BUNDLE = process.argv[2] || 'main';
const OUT_DIR = process.argv[3] || './web-host';

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
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
});

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  console.log(`Server: http://127.0.0.1:${port}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const logs = [];
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    logs.push(text);
    console.log(text);
  });
  page.on('pageerror', err => {
    const text = `[PAGE ERROR] ${err.message}`;
    logs.push(text);
    console.error(text);
  });

  const result = {
    bundle: BUNDLE,
    timestamp: new Date().toISOString(),
    screenshot: path.join(OUT_DIR, `verify-${BUNDLE}.png`),
    logs,
    elements: [],
    passed: false,
    error: null,
  };

  try {
    await page.goto(`http://127.0.0.1:${port}/?bundle=${BUNDLE}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForSelector('lynx-view', { timeout: 15000 });
    await page.waitForTimeout(5000);

    // Extract visible text elements
    const elements = await page.evaluate(() => {
      const lv = document.querySelector('lynx-view');
      if (!lv || !lv.shadowRoot) return [];
      const texts = Array.from(lv.shadowRoot.querySelectorAll('*'))
        .filter(el => el.textContent?.trim())
        .map(el => ({
          tag: el.tagName.toLowerCase(),
          text: el.textContent.trim().substring(0, 100),
          visible: el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0,
        }))
        .filter((v, i, a) => a.findIndex(t => t.text === v.text) === i)
        .slice(0, 50);
      return texts;
    });
    result.elements = elements;

    // Check if any content rendered
    result.passed = elements.some(e => e.visible && e.text.length > 0);

    await page.screenshot({ path: result.screenshot, fullPage: false });
    console.log(`Screenshot: ${result.screenshot}`);
    console.log(`Passed: ${result.passed}`);
    console.log(`Visible elements: ${elements.filter(e => e.visible).length}`);
  } catch (e) {
    result.error = e.message;
    console.error('Error:', e.message);
    await page.screenshot({ path: result.screenshot, fullPage: false });
  } finally {
    await browser.close();
    server.close();

    // Write report
    const reportPath = path.join(OUT_DIR, `verify-${BUNDLE}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
    console.log(`Report: ${reportPath}`);
    process.exit(result.passed ? 0 : 1);
  }
});
