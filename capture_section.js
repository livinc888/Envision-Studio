const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\0af4d2c0-b933-4db4-9c43-7b38e478eba4';

const targets = [
  { name: 'strip_combined_1440', width: 1440, height: 2100, url: 'http://127.0.0.1:5000/?skipPreloader=true&snapshot=true&scrollTo=about' },
  { name: 'strip_combined_390', width: 390, height: 1800, url: 'http://127.0.0.1:5000/?skipPreloader=true&snapshot=true&scrollTo=about' }
];

for (const t of targets) {
  const outFile = path.join(brainDir, `${t.name}.png`);
  console.log(`Capturing ${t.name} -> ${outFile}`);
  try {
    execFileSync(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      `--window-size=${t.width},${t.height}`,
      `--virtual-time-budget=4000`,
      `--screenshot=${outFile}`,
      t.url
    ], { timeout: 35000 });
    console.log(`Saved ${outFile} (${fs.statSync(outFile).size} bytes)`);
  } catch (e) {
    console.error(`Failed ${t.name}:`, e.message);
  }
}
