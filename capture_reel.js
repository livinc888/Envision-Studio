const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\0af4d2c0-b933-4db4-9c43-7b38e478eba4';

// We can test taking a screenshot of the hero and opening the reel modal
const script = `
  setTimeout(() => {
    // Find button containing 'Play Reel'
    const btns = Array.from(document.querySelectorAll('button'));
    const reelBtn = btns.find(b => b.textContent && b.textContent.includes('Play Reel'));
    if (reelBtn) {
      reelBtn.click();
      console.log('Clicked Play Reel button');
    }
  }, 1000);
`;

const viewports = [
  { name: '1440', width: 1440, height: 900 },
  { name: '390', width: 390, height: 844 }
];

for (const vp of viewports) {
  const outFile = path.join(brainDir, `reel_modal_${vp.name}.png`);
  console.log(`Capturing Reel modal ${vp.name}...`);
  try {
    execFileSync(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      `--window-size=${vp.width},${vp.height}`,
      `--virtual-time-budget=4000`,
      `--screenshot=${outFile}`,
      'http://127.0.0.1:5000/?openReel=true'
    ], { timeout: 25000 });
    console.log(`Saved ${outFile} (${fs.statSync(outFile).size} bytes)`);
  } catch (e) {
    console.error(`Failed ${vp.name}:`, e.message);
  }
}

