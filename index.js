const { startBrowser } = require('./browser');
const scraperController = require('./pageController');

//Start the browser and create a browser instance
let browserInstance = startBrowser();

// Pass the browser instance to the scraper controller
scraperController(browserInstance, 
    [
        {
            csvFile:"mitutoyo-shop-links-test.csv", 
            ids: 
                {
                    product_name: {
                        selector: ".product-content .name h2",
                        type: "text"
                    },
                    product_sku:{
                        selector: ".product-content .anteros span.value",
                        type: "text"
                    },
                    product_price: {
                        selector: ".listPrice span.value:nth-of-type(1)",
                        type: "text"
                    },
                    product_description: {
                        selector: "div.description-big",
                        type: "HTML"
                    },
                    product_features: {
                        selector: "#product_parameters",
                        type: "HTML"
                    },
                }
        }
    ])