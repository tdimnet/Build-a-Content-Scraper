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
const scrapeTheWebsite = new Promise((resolve, reject) => {
    resolve(console.log('scraper is starting fetching data'));
})

// Run the scraper
scrapeTheWebsite
    .then(createDataFile)
    .then(accessTheWebsite);



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
    request(websiteUrl+shirtsPath, (err, res, body) => {
        $ = cheerio.load(body);
        var title = $('.branding-title a').text();
        console.log(title)
    })
}
