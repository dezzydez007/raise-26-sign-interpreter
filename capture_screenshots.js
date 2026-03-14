const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 375, height: 812 } // Mobile viewport
    });
    const page = await context.newPage();
    
    // Listen for console errors
    page.on('console', msg => {
        if (msg.type() === 'error') console.log('Console Error:', msg.text());
    });

    const baseUrl = 'https://sign-interpreter-five.vercel.app';
    const screenshots = [
        { name: '01_home', url: baseUrl },
        { name: '02_translate', url: `${baseUrl}#translate`, click: '#translate-screen button:first-child' },
        { name: '03_learn', url: `${baseUrl}#learn` },
        { name: '04_numbers', url: `${baseUrl}#numbers` },
        { name: '05_words', url: `${baseUrl}#words` },
        { name: '06_face', url: `${baseUrl}#face` },
        { name: '07_history', url: `${baseUrl}#history` },
        { name: '08_settings', url: `${baseUrl}#settings` },
        { name: '09_voice', url: `${baseUrl}#voice-settings` },
        { name: '10_about', url: `${baseUrl}#about` },
    ];

    console.log('Starting screenshot capture...');

    for (const shot of screenshots) {
        try {
            console.log(`Capturing ${shot.name}...`);
            await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(2000);
            
            // Skip loading screen
            const loading = await page.$('#loading-screen');
            if (loading) {
                await page.waitForTimeout(3000);
            }
            
            await page.screenshot({ 
                path: `assets/screenshots/${shot.name}.png`,
                fullPage: false 
            });
            console.log(`✓ ${shot.name} captured`);
        } catch (e) {
            console.error(`✗ ${shot.name} failed:`, e.message);
        }
    }

    await browser.close();
    console.log('Done!');
})();
