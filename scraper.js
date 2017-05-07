// Create a folder called data if it does not already exist inside the folder
const fs = require('fs');

// The web scraper
const scrapeIt = require('scrape-it');


// Check if the folder exists or not. If not, create a new one
const check = fs.stat('./data/', (err, stats) => {
    // ENOENT = No such file or directory
    if (err && (err.code === 'ENOENT')) {
        console.log('A new data folder has been created');
        fs.mkdir('./data');
    }
    // If the directory already exists, just do nothing
})


// Choose and use two third-party npm packages.
    // One package should be used to scrape content from the site
        // For now the choosen scraper is scrape-it
    // The other package should create the CSV file.


// Program your scraper so that it visits the website and uses the shirts.php as single entry point
scrapeIt('http://www.shirts4mike.com/', {
    // listItem: 'h1',
    // url: {
    //     selector: '.nav .shirts a',
    //     attr: 'href'
    // }

    // This function gets me the t-shirts from the home page, I now need to access the shirts page
    shirts: {
        listItem: '.products li',
        name: 'shirts',
        data: {
            title: 'a',
            url: {
                selector: 'a',
                attr: 'href'
            }
        }

    }

}).then(function(value) {
    console.log(value);
}, function(raison) {
    console.log(raison);
});
