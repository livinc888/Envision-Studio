const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });

  // Navigate to server with preloader skip
  await page.goto('http://localhost:5000/?skipPreloader=true&snapshot=true', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  // Give 1 second for GSAP to settle
  await new Promise((r) => setTimeout(r, 1000));

  // Scroll smoothly down to the #about section
  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });

  await new Promise((r) => setTimeout(r, 800));

  const outPath = path.join('C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\0af4d2c0-b933-4db4-9c43-7b38e478eba4', 'scrolled_about_view.png');
  await page.screenshot({ path: outPath });

  console.log('Captured scrolled view to:', outPath);
  await browser.close();
})();

