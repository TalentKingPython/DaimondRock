const puppeteer = require('puppeteer');

// Function to introduce delay
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.commodity_script = async () => {
    try {
        const browser = await puppeteer.launch({
            // headless: false,
            ignoreHTTPSErrors: false,
            timeout: 10000
        });
        // Launch the browser and open a new blank page
        const page = (await browser.pages())[0];

        // Set screen size
        await page.setViewport({ width: 3000, height: 2000 });

        // Navigate the page to a URL
        await page.goto('https://crm.daimondrock.com/trade');

        const iframeSelector = 'iframe#watchlists';
        await page.waitForSelector(iframeSelector);
        const iframeElement = await page.$(iframeSelector);
        const frame = await iframeElement.contentFrame();
        await delay(500)

        const commodityBtn = await frame.$('button#\\34');
        commodityBtn.click();

        while (true) {
            const watchlist = await frame.$$('div.tv-widget-watch-list');

            const coinlist = await watchlist[4].$$('div.tv-widget-watch-list__row');
            let coindata = {}
            await Promise.all(coinlist.map(async (coin) => {
                const symbol = await coin.$eval('.tv-widget-watch-list__short-name', el => el.textContent.trim());
                const price = await coin.$eval('.tv-widget-watch-list__last', el => el.textContent.trim());

                return coindata[symbol] = price;
            }));
            console.log("commodity is running!");

            process.send(coindata)
        }

        await browser.close();
    } catch (error) {
        console.log('Scrapping Error!', error.toString());
    }
}

this.commodity_script()