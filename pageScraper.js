const fs = require("fs");
const { parse } = require("csv-parse");
const ObjectsToCsv = require("objects-to-csv");

let links = [];
let finalResult = [];
let index = 0;

function handleData(data) {
  links.push(data[0]);
}

function addToResults(data) {
  if (Array.isArray(data)) {
    for (const scrapedObject of data) {
      finalResult.push(scrapedObject);
    }
  } else {
    finalResult.push(data);
  }

  // if (links.length === finalResult.length) {
  //   console.log("Final ", finalResult);

  //   (async () => {
  //     const csv = new ObjectsToCsv(finalResult);

  //     // Save to file:
  //     await csv.toDisk("./test.csv");
  //   })();
  // }
}

function scraper(browser, scraperInfo) {
  for (const pageDetails of scraperInfo) {
    // Converting each csv file to JSON
    fs.createReadStream(pageDetails.csvFile)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", handleData)
      .on("error", function (error) {
        console.log(`Error: ${error}`);
      })
      .on("end", function () {
        console.log("CSV parsed successfully");
        console.log(links);

        // performing scrapping for each page in a CSV file
        async function performScraping() {
          try {
            let pagePromise = (link) =>
              new Promise(async (resolve, reject) => {
                // const dataObjArr = [];
                // const imagesArr = [];
                // let variantLength = 0;
                // let productImages = 0;

                let dataObj;

                let newPage = await browser.newPage();

                // { waitUntil: "load", timeout: 0 }
                await newPage.setDefaultNavigationTimeout(0);

                await Promise.all([
                  newPage.waitForNavigation(),
                  newPage.goto(link),
                  newPage.waitForSelector("h1")
                ]);

                // MITUTOYO SCRPAER
                // ==============================================
                // dataObj = await newPage.evaluate(function () {
                //   let scrapedData = {};

                //   const product_name = document.querySelector(
                //     ".product-content .name h2"
                //   );
                //   const product_sku = document.querySelector(
                //     ".product-content .anteros span.value"
                //   );
                //   const product_price = document.querySelector(
                //     ".listPrice span.value:nth-of-type(1)"
                //   );
                //   const product_description = document.querySelector(
                //     "div.description-big"
                //   );
                //   const product_features = document.querySelector(
                //     "#product_parameters"
                //   );
                //   const link = document.URL;
                //   const product_image = document.querySelector("img.clickable");

                //   if (product_image != null) {
                //     scrapedData.product_image = product_image.src;
                //   } else {
                //     scrapedData.product_image = "";
                //   }

                //   scrapedData = {
                //     product_link: link,
                //     product_name: product_name ? product_name.textContent : "",
                //     product_sku: product_sku ? product_sku.textContent : "",
                //     product_price: product_price
                //       ? product_price.textContent
                //       : "",
                //     product_description: product_description
                //       ? product_description.innerHTML
                //       : "",
                //     product_features: product_features
                //       ? product_features.innerHTML
                //       : "",
                //     product_image: product_image,
                //   };

                //   return scrapedData;
                // });

                // if (dataObj.product_image != null) {
                //   // MITUTOYO ADDITION FOR SCRAPING IMAGES
                //   await newPage.click("img.clickable", { delay: 500 });

                //   if (await newPage.waitForSelector("img.cboxPhoto")) {
                //     dataObj.product_image = await newPage.evaluate(() => {
                //       const element = document.querySelector("img.cboxPhoto");

                //       if (element) {
                //         return element.src;
                //       } else {
                //         return "";
                //       }
                //     });
                //   }
                // }

                // ==============================================
                /*
                if (
                  await newPage.waitForSelector("#part_group_dropdown > div")
                ) {
                  // CLICK READ MORE

                  if (
                    await newPage.$(
                      "button.ExpandablePaneToggle-components__sc-rgnog7-1"
                    )
                  ) {
                    await newPage.click(
                      "button.ExpandablePaneToggle-components__sc-rgnog7-1",
                      {
                        delay: 500,
                      }
                    );
                  }

                  await newPage.click("#part_group_dropdown > div", {
                    delay: 500,
                  });

                  if (
                    await newPage.waitForSelector("li[name='dropDownListItem']")
                  ) {
                    variantLength = await newPage.evaluate(function () {
                      const productOptions = document.querySelectorAll(
                        "li[name='dropDownListItem']"
                      );

                      return productOptions.length;
                    });

                    productImages = await newPage.evaluate(function () {
                      const prodImages =
                        document.querySelectorAll("button.ccZsQQ");

                      return prodImages.length;
                    });

                    // COLLECT PRODUCT IMAGES
                    for (let i = 1; i <= productImages; i++) {
                      await newPage.click(
                        "button.ccZsQQ:nth-of-type(" + i + ")",
                        {
                          delay: 500,
                        }
                      );

                      const productImage = await newPage.evaluate(function () {
                        const image = document.querySelector("img.kTmVyL");

                        return image.src;
                      });

                      imagesArr.push(productImage);
                    }

                    // COLLECT PRODUCT VARIANT INFORMATION
                    for (let i = 1; i <= variantLength; i++) {
                      let dataObj = {};

                      await newPage.click("#part_group_dropdown > div", {
                        delay: 500,
                      });

                      if (
                        await newPage.waitForSelector(
                          "li[name='dropDownListItem']"
                        )
                      ) {
                        await newPage.click(
                          "li[name='dropDownListItem']:nth-of-type(" + i + ")",
                          { delay: 500 }
                        );

                        dataObj = await newPage.evaluate(function () {
                          let scrapedData = {};

                          const product_name =
                            document.querySelector("h2[name='heading']");
                          const product_sku = document.querySelector(
                            "div[datatype='partNumber']"
                          );
                          const product_price =
                            document.querySelector("#partgroup-price");
                          const product_description = document.querySelector(
                            "div.StyledExpandablePane-components__sc-rgnog7-2"
                          );
                          const link = document.URL;
                          const product_category = "Engine and drives";
                          const product_specs = document.querySelector(
                            "div.AccordionBodyContent-components__sc-1f1u20f-5"
                          );
                          const product_variant = document.querySelector("div.DropdownPlaceholder-components__sc-1sy667m-3");

                          scrapedData = {
                            product_link: link,
                            product_name: product_name
                              ? product_name.textContent
                              : "",
                            product_sku: product_sku
                              ? product_sku.textContent
                              : "",
                            product_price: product_price
                              ? product_price.textContent
                              : "",
                            product_description: product_description
                              ? product_description.innerHTML
                              : "",
                            product_specs: product_specs
                              ? product_specs.innerHTML
                              : "",
                            product_category: product_category,
                            product_variant: product_variant? product_variant.innerHTML : ""
                          };

                          return scrapedData;
                        });

                        dataObj.product_images = imagesArr
                          ? imagesArr.join(",")
                          : "";

                        console.log(dataObj.variant_name);

                        dataObjArr.push(dataObj);
                      }
                    }
                  }
                }
              */

                dataObj = await newPage.evaluate(function () {
                  let scrapedData = {};

                  const product_name = document.querySelector(
                    "h1"
                  );
                  const product_sku = document.querySelector(
                    "span.product-sku__value"
                  );

                  const product_price = document.querySelector(
                    ".product-info__price .price__default strong"
                  );
                  
                  // const product_spec = document.querySelector(
                  //   "#product-details div.tab-pane:nth-of-type(2)"
                  // );

                  // const additional_info = document.querySelector(
                  //   "#technicalSpecifications"
                  // );

                  const product_description = document.querySelector(
                    "div.product-description"
                  );

                  const link = document.URL;
                  const product_image = document.querySelector("img.product-image");

                  scrapedData = {
                    product_link: link,
                    product_name: product_name ? product_name.textContent : "",
                    product_sku: product_sku ? product_sku.textContent : "",
                    product_image: product_image? product_image.src : "",
                    product_price: product_price? product_price.textContent: "",
                    product_description: product_description? product_description.innerHTML : "",
                    // product_spec: product_spec? product_spec.innerHTML : "",
                      // product_long_description: product_long_description
                      // ? product_long_description.innerHTML
                      // : "",
                    // additional_info: additional_info? additional_info.innerHTML : "",
                  };

                  return scrapedData;
                });

                resolve(dataObj);

                await newPage.close();
              });

            let linkCount = 1;
            // Visiting all the links
            for (const link of links) {
              let scrapedData = await pagePromise(link);
              addToResults(scrapedData);

              (async () => {
                const csv = new ObjectsToCsv(finalResult);

                // Save to file:
                await csv.toDisk("./test.csv");
                console.log(`Saved results to test (Count ${linkCount})`);
                linkCount++;
              })();
            }
          } catch (e) {
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
  scraper,
};
