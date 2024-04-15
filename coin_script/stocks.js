const puppeteer = require('puppeteer');

// Function to introduce delay
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.stocks_script = async () => {
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

        while (true) {
            const watchlist = await frame.$$('div.tv-widget-watch-list');

            const coinlist = await watchlist[0].$$('div.tv-widget-watch-list__row');
            let coindata = {}
            await Promise.all(coinlist.map(async (coin) => {
                const symbol = await coin.$eval('.tv-widget-watch-list__short-name', el => el.textContent.trim());
                const price = await coin.$eval('.tv-widget-watch-list__last', el => el.textContent.trim());

                return coindata[symbol] = price;
            }));
            console.log("Stocks is running!");
            process.send(coindata)
        }

        await browser.close();
    } catch (error) {
        console.log('Scrapping Error!', error.toString());
    }
}

this.stocks_script()