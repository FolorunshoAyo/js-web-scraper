const { startBrowser } = require('./browser');
const scraperController = require('./pageController');

//Start the browser and create a browser instance
let browserInstance = startBrowser();

// Pass the browser instance to the scraper controller
scraperController(browserInstance, "marine-engine-parts.csv", {image: "div.productView-img-container a img", name: "h1.productView-title.main-heading"})