const { startBrowser } = require('./browser');
const scraperController = require('./pageController');

//Start the browser and create a browser instance
let browserInstance = startBrowser();

// Pass the browser instance to the scraper controller
scraperController(browserInstance, 
    [
        {
            csvFile:"marine-engine-parts.csv", 
            ids: 
                {
                    product_title: {
                        selector: "span[itemprop='name']",
                        type: "text"
                    },
                    product_image: {
                        selector:  "img.fotorama__img",
                        type: "image"
                    }, 
                    product_sku:{
                        selector: "div[itemprop='sku']",
                        type: "text"
                    },
                    product_details: {
                        selector: ".table-wrapper",
                        type: "HTML"
                    },

                }
        }
    ])