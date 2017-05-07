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


function getProducts(url) {
    scrapeIt('http://www.shirts4mike.com/'+url, {
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
    console.log(value)
})};


// Program your scraper so that it visits the website and uses the shirts.php as single entry point
const getUrl = scrapeIt('http://www.shirts4mike.com/', {
    listItem: 'h1',
    url: {
        selector: '.nav .shirts a',
        attr: 'href'
    }

}).then(function(value) {
    let productsUrl = value.url;
    getProducts(productsUrl);
}, function(raison) {
    console.log(raison);
});
