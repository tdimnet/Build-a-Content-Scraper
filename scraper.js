// ********************************
// Modules & Global Variables
// ********************************

// The file system module
const fs = require('fs');
// The http call module
const request = require('request');
// The jQuery helper
const cheerio = require('cheerio');
// The CSV module
var json2csv = require('json2csv');

// The urls needed
const websiteUrl = 'http://www.shirts4mike.com/';
const shirtsPath = 'shirts.php';



// ********************************
// The Promise Interface
// ********************************
var scrapeTheWebsite = new Promise((resolve, reject) => {
    resolve(console.log('The scraper is starting to work :)'));
})

// Run the scraper
scrapeTheWebsite
    .then(createDataFile)
    .then(accessTheWebsite)
    .then(getShirtsInfo)
    .then(displayData)



// ********************************
// The data folder
// ********************************

// Check if the folder already exists, if not, create a new one
function createDataFile() {
    fs.stat('./data/', (err, stats) => {
        // ENOENT = No such file or directory
        if (err && (err.code === 'ENOENT')) {
            fs.mkdir('./data');
            console.log('A new data folder has been created');
        }
    })
}



// ********************************
// The scraper scripts
// ********************************

// Return all the full urls for all shirt items contain within the shirts.php
function accessTheWebsite() {
    console.log('The scraper is fetching the pages')
    return new Promise((resolve, reject) => {
        request(websiteUrl+shirtsPath, (error, response, body) => {
            // Append the cheerio utility
            $ = cheerio.load(body);

            // Fill in the table with all shirt urls
            var arrayOfShirtsPages = [];
            $( ".products li" ).each(function() {
                let fullUrl = websiteUrl + $(this).find('a').attr('href');
                arrayOfShirtsPages.push(fullUrl);
            });

            // Once you're done, return the promise object
            resolve(arrayOfShirtsPages)
        }); // End: request
    }) // End: Promise
} // End: accessTheWebsite


// Return all the data of the shirts (url, title, price, picture)
function getShirtsInfo(shirtsUrls) {
    console.log('The scraper is collecting the data for the shirts');
    // Loop into the data
    var data = shirtsUrls.map(function(shirtUrl) {
        return new Promise((resolve, reject) => {
            request(shirtUrl, (error, response, body) => {

                // Load the cheerio module
                $ = cheerio.load(body);

                // Format the data into an object
                let data = {
                    title: $('.shirt-details h1').text().substr(4),
                    price: $('.price').text(),
                    picture: $('.shirt-picture img').attr('src'),
                    url: shirtUrl,
                    date: new Date().toLocaleString(),
                }

                // Return the fetched data
                resolve(data)
            })
        }) // End Promise
    }) // End map

    // Return all the promises in one place
    return Promise.all(data)
} // End: getShirtsInfo


// Once everything is done, write all the data inside the csv file
function displayData(shirtsData) {
    console.log('The scraper is compiling for the csv file');

    // The fields of the csv file
    const fields = ['title', 'price', 'imageUrl', 'url', 'time'];
    // Construct the csv
    const csv = json2csv({ data: shirtsData, fields: fields });

    const nameOfTheFile = new Date().toLocaleDateString();

    // Then, write it
    fs.writeFile('./data/' + nameOfTheFile + '.csv', csv, function(err) {
      if (err) throw err;
      console.log('The data has been saved into the file.csv :)');
    });
}
