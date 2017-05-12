// ********************************
// Modules & Global Variables
// ********************************

// The file system module
const fs = require('fs');
// The http call module
const request = require('request');
// The jQuery helper
const cheerio = require('cheerio')

// The urls needed
const websiteUrl = 'http://www.shirts4mike.com/';
const shirtsPath = 'shirts.php';



// ********************************
// The Promise Interface
// ********************************
var scrapeTheWebsite = new Promise((resolve, reject) => {
    resolve(console.log('scraper is starting fetching data'));
})

// Run the scraper
scrapeTheWebsite
    .then(createDataFile)
    .then(accessTheWebsite)
    .then(getShirtsInfo)



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
function accessTheWebsite() {
    return new Promise((resolve, reject) => {
        request(websiteUrl+shirtsPath, (error, response, body) => {
            $ = cheerio.load(body);
            var arrayOfShirtsPages = [];
            $( ".products li" ).each(function() {
                let fullUrl = websiteUrl + shirtsPath + '?' + $(this).find('a').attr('href');
                arrayOfShirtsPages.push(fullUrl);
            });
            resolve(arrayOfShirtsPages)
        });
    }) // End: Promise
} // End: accessTheWebsite


function getShirtsInfo(shirtsUrl) {
    console.log('Info is comming from getShirtsInfo \n', shirtsUrl);
}
