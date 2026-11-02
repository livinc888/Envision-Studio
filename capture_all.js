const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const prefix = process.argv[2] || 'before';

const viewports = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
  { name: '390', width: 390, height: 844 }
];

const screenshotsDir = path.resolve(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

for (const vp of viewports) {
  const outFile = path.join(screenshotsDir, `${prefix}_${vp.name}.png`);
  console.log(`Capturing ${vp.name} (${vp.width}x${vp.height}) -> ${outFile}`);
  try {
    execFileSync(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      `--window-size=${vp.width},${vp.height}`,
      `--screenshot=${outFile}`,
      'http://localhost:5000'
    ], { timeout: 20000 });
    console.log(`Saved ${outFile} (size: ${fs.statSync(outFile).size} bytes)`);
  } catch (e) {
    console.error(`Failed ${vp.name}:`, e.message);
  }
}

