const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = process.argv[2] || 'http://localhost:5000';
const outFile = process.argv[3] || 'screenshot.png';
const width = process.argv[4] || '1440';
const height = process.argv[5] || '900';

const outPath = path.resolve(process.cwd(), outFile);

try {
  console.log(`Taking screenshot of ${targetUrl} (${width}x${height}) -> ${outPath}`);
  execFileSync(chromePath, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--window-size=${width},${height}`,
    `--screenshot=${outPath}`,
    targetUrl
  ], { timeout: 15000 });
  console.log('Result exists:', fs.existsSync(outPath), 'Size:', fs.existsSync(outPath) ? fs.statSync(outPath).size : 0);
} catch (err) {
  console.error('Error taking screenshot:', err.message);
}

