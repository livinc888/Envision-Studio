const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// We can inject a scroll script or use an HTML wrapper or query param
// In React, let's look at window.location.hash or an auto-scroll param
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outFile = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\0af4d2c0-b933-4db4-9c43-7b38e478eba4\\plaintext_scrolled_1440.png';

// In MarketingHome.tsx or via query param scrollY=950:
execFileSync(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  '--window-size=1440,2200',
  `--screenshot=${outFile}`,
  'http://localhost:5000/?skipPreloader=true&scrollTo=about'
], { timeout: 25000 });

console.log('Saved', outFile);
