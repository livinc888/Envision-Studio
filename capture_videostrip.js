const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\0af4d2c0-b933-4db4-9c43-7b38e478eba4';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const viewports = [
    { name: '1440', width: 1440, height: 1000 },
    { name: '390', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });

    console.log(`Navigating to ${vp.name}...`);
    await page.goto('http://127.0.0.1:5000/?skipPreloader=true&snapshot=true', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise((r) => setTimeout(r, 1200));

    // Scroll to #image-strip-track or #about
    await page.evaluate(() => {
      const el = document.getElementById('image-strip-track') || document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });

    await new Promise((r) => setTimeout(r, 1500));

    const outPath = path.join(brainDir, `videostrip_${vp.name}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved ${outPath} (${fs.statSync(outPath).size} bytes)`);
    await page.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully');
})();

