const { scraper } = require('./pageScraper');

async function scrapeAll(browserInstance, csvFile, dataToScrape){
	let browser;
	try{
		browser = await browserInstance;
		await scraper(browser, csvFile, dataToScrape);	
		
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance, csvFile, dataToScrape) => scrapeAll(browserInstance, csvFile, dataToScrape)