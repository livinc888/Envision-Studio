const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\0af4d2c0-b933-4db4-9c43-7b38e478eba4';

const viewports = [
  { name: '1440', width: 1440, height: 1100 },
  { name: '390', width: 390, height: 844 }
];

for (const vp of viewports) {
  const outFile = path.join(brainDir, `services_fixed_${vp.name}.png`);
  console.log(`Capturing services ${vp.name}...`);
  try {
    execFileSync(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      `--window-size=${vp.width},${vp.height}`,
      `--screenshot=${outFile}`,
      'http://127.0.0.1:5000/?skipPreloader=true&scrollTo=services'
    ], { timeout: 25000 });
    console.log(`Saved ${outFile} (${fs.statSync(outFile).size} bytes)`);
  } catch (e) {
    console.error(`Failed ${vp.name}:`, e.message);
  }
}
