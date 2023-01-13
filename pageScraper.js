const fs = require("fs");
const { parse } = require("csv-parse");

let links = [];
let finalResult = [];

function handleData (data){
    links = [...links, ...data];
}

function scraper(browser, csvFile, dataToScrape) {

    fs.createReadStream(csvFile)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", handleData)
    .on("error", function(error){
        console.log(`Error: ${error}`);
    })
    .on("end", function (){
        console.log("CSV parsed successfully");
        console.log(links);

        async function performScraping(){
            try {
                let pagePromise = (link) => new Promise(async(resolve, reject) => {
                    let dataObj = {};
                    let newPage = await browser.newPage();

                    await newPage.goto(link);

                    for(const key in dataToScrape){
                        if(key === "image") {
                            dataObj[key] = await newPage.$eval(dataToScrape[key], el => el.src)
                        }else{
                            dataObj[key] = await newPage.$eval(dataToScrape[key], el => el.textContent);
                        }
                    }
                        
                    resolve(dataObj);
                    await newPage.close();
                });

                for(const link of links){
                    let scrappedData = await pagePromise(link);
                    console.log(scrappedData);
                    finalResult.push(scrappedData);
                }
            } catch(e) { }
        
            await browser.close();
        }

        performScraping();
    });
}

module.exports = {
    scraper
}