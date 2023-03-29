const fs = require("fs");
const { parse } = require("csv-parse");
const ObjectsToCsv = require('objects-to-csv'); 

let links = [];
let finalResult = [];
let index = 0;

function handleData (data){
    links.push(data[0]);
}

function addToResults(data){
    finalResult.push(data);

    if(links.length === finalResult.length){
        console.log("Final ", finalResult);

        (async () => {
            const csv = new ObjectsToCsv(finalResult);
        
            // Save to file:
            await csv.toDisk('./test.csv');
        })();
    }
}

function scraper(browser, scraperInfo) {
    for(const pageDetails of scraperInfo){
        // Converting each csv file to JSON
        fs.createReadStream(pageDetails.csvFile)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", handleData)
        .on("error", function(error){
            console.log(`Error: ${error}`);
        })
        .on("end", function (){
            console.log("CSV parsed successfully");
            console.log(links);

            // performing scrapping for each page in a CSV file
            async function performScraping(){
                try {
                    let pagePromise = (link) => new Promise(async(resolve, reject) => {
                        let dataObj = {};
                        let newPage = await browser.newPage();

                        await newPage.goto(link);

                        // for(const key1 in pageDetails.ids){
                            // if(pageDetails.ids[key1].type.toLowerCase() === "image") {
                            //     dataObj[key1] = await newPage.$eval(pageDetails.ids[key1].selector, el => el.src)
                            // }else if(pageDetails.ids[key1].type.toLowerCase() === "html"){
                            //     dataObj[key1] = await newPage.evaluate(() => {
                            //         const element = document.querySelector(pageDetails.ids[key1].selector);

                            //         if(element){
                            //             return element.innerHTML;
                            //         }else{
                            //             return "";
                            //         }
                            //     });
                            // }else{
                            //     dataObj[key1] = await newPage.evaluate(function () {
                                    
                            //         const element = document.querySelector(pageDetails.ids[key1].selector);

                            //         if(element){
                            //             return element.textContent;
                            //         }else{
                            //             return "";
                            //         }
                            //     });
                            // }
                        // }

                        dataObj = await newPage.evaluate(function () {
                            let scrapedData = {};

                            const product_name = document.querySelector(".product-content .name h2");
                            const product_sku = document.querySelector(".product-content .anteros span.value");
                            const product_price = document.querySelector(".listPrice span.value:nth-of-type(1)");
                            const product_description = document.querySelector("div.description-big");
                            const product_features = document.querySelector("#product_parameters");

                            scrapedData = {
                                product_name: product_name.textContent,
                                product_sku: product_sku? product_sku.textContent : "",
                                product_price: product_price? product_price.textContent : "",
                                product_description: product_description.innerHTML,
                                product_features: product_features.innerHTML
                            }

                            return scrapedData;
                        });

                        // MITUTOYO ADDITION FOR SCRAPING IMAGES
                        await newPage.click("img.clickable", {delay: 500});

                        if(await newPage.waitForSelector("img.cboxPhoto")){
                            dataObj.product_image = await newPage.evaluate(() => {
                                const element = document.querySelector("img.cboxPhoto");

                                if(element){
                                    return element.src;
                                }else{
                                   return "";
                                }

                            });
                        }

                        console.log(dataObj);

                        resolve(dataObj);
                        await newPage.close();
                    });

                    // Visiting all the links
                    for(const link of links){
                        let scrapedData = await pagePromise(link);
                        addToResults(scrapedData);
                    }

                } catch(e) {
                    console.log(e);
                }
            
                await browser.close();
            }

            performScraping();
            index++;
        });
    }
}

module.exports = {
    scraper
}