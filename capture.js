const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, 'assets', 'screenshots');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function capture() {
    console.log('Starting browser...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 400, height: 900 } });
    const page = await context.newPage();
    
    await page.goto('https://sign-interpreter-five.vercel.app');
    console.log('Page loaded');
    
    // Wait for initial load
    await page.waitForTimeout(4000);
    
    // Capture home
    console.log('Capturing home...');
    await page.screenshot({ path: path.join(outputDir, '01_home.png'), fullPage: false });
    
    // Navigate to learn using JS
    console.log('Capturing learn...');
    await page.evaluate(() => showScreen('learn'));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, '02_learn.png'), fullPage: false });
    
    // Navigate to settings using JS
    console.log('Capturing settings...');
    await page.evaluate(() => showScreen('settings'));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, '03_settings.png'), fullPage: false });
    
    // Navigate to voice settings
    console.log('Capturing voice settings...');
    await page.evaluate(() => showScreen('voice-settings'));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, '04_voice_settings.png'), fullPage: false });
    
    // Navigate to about
    console.log('Capturing about...');
    await page.evaluate(() => showScreen('about'));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, '05_about.png'), fullPage: false });
    
    // Navigate to history
    console.log('Capturing history...');
    await page.evaluate(() => showScreen('history'));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, '06_history.png'), fullPage: false });
    
    console.log('All screenshots captured!');
    await browser.close();
    
    // List captured files
    const files = fs.readdirSync(outputDir);
    console.log('Files captured:', files);
}

capture().catch(console.error);
