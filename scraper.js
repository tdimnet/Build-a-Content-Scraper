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
const json2csv = require('json2csv');

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
// The error log
// ********************************

// Write the error inside the log file when something went wrong
function logErrorMessage(error) {
    console.log('There\’s been a 404 error. Cannot connect to the to http://shirts4mike.com.');
    // According to the error, show the message
    if (error && (error.code = 'ENOTFOUND')) {
        // In our case, we cannot use let or const
        var errorMessage = '[' + new Date() + '] - ';
        errorMessage += 'There\’s been a 404 error. Cannot connect to the to http://shirts4mike.com. \n';
        errorMessage += error + '\n';
    }

    // Then, write the error into the log file
    fs.readFile('scraper-error.log', (err, data) => {
        // An error can occur if the file is not present. If this case, create it.
        if (err && (err.code = 'ENOENT')) {
            fs.writeFile('scraper-error.log', errorMessage);
        } else {
        // if the file already exists, just write the data
        fs.appendFile('scraper-error.log', errorMessage, (err) => {
          if (err) throw err;
          console.log('The error log file has been updated.');
        });

        }
    }) // End: readeFile
} // End: logErrorMessage



// ********************************
// The scraper scripts
// ********************************

// Return all the full urls for all shirt items contain within the shirts.php
function accessTheWebsite() {
    console.log('The scraper is fetching the pages')
    return new Promise((resolve, reject) => {
        request(websiteUrl+shirtsPath, (error, response, body) => {

            // If any problems have been found, process the script
            if (!error && response.statusCode === 200) {
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

            // End, show the error
            } else {
                logErrorMessage(error);
            }
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
                    time: new Date().toLocaleString(),
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
    const fields = ['title', 'price', 'picture', 'url', 'time'];
    // Construct the csv
    const csv = json2csv({ data: shirtsData, fields: fields });

    const nameOfTheFile = new Date().toLocaleDateString();

    // Then, write it
    fs.writeFile('./data/' + nameOfTheFile + '.csv', csv, function(err) {
      if (err) throw err;
      console.log('The data has been saved into the file.csv :)');
    });
}
