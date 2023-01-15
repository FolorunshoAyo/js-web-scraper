const { scraper } = require('./pageScraper');

async function scrapeAll(browserInstance, scrapperInfo){
	let browser;
	try{
		browser = await browserInstance;
		await scraper(browser, scrapperInfo);	
		
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance, scrapperInfo) => scrapeAll(browserInstance, scrapperInfo)