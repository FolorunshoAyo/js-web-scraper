const fs = require("fs");
const { parse } = require("csv-parse");

let links = [];
let finalResult = [];
let index = 0;

function handleData (data){
    links[index] = [...links[index], ...data];
}

function scraper(browser, scraperInfo) {
    // CREATE NEW ARRAY LIST FOR LINKS AND RESULTS
    links[index] = [];
    finalResult[index] = [];

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

                        for(const key in pageDetails.selectors){
                            if(key === "image") {
                                dataObj[key] = await newPage.$eval(pageDetails.selectors[key], el => el.src)
                            }else{
                                dataObj[key] = await newPage.$eval(pageDetails.selectors[key], el => el.textContent);
                            }
                        }
                            
                        resolve(dataObj);
                        await newPage.close();
                    });

                    // Visiting all the links
                    for(const link of links[index]){
                        let scrappedData = await pagePromise(link);
                        finalResult[index].push(scrappedData);
                    }

                } catch(e) { }
            
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