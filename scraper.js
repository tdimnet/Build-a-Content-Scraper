// Create a folder called data if it does not already exist inside the folder
const fs = require('fs');
// The web scraper
const scrapeIt = require('scrape-it');
// The JSON to CSV
var json2csv = require('json2csv');


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


// Once you went to the http://www.shirts4mike.com/shirt.php,
    // Capture the urls of the shirts display inside the page
function getProductsUrl(url) {
    scrapeIt('http://www.shirts4mike.com/'+url, {
        shirts: {
        listItem: '.products li',
        name: 'shirts',
        data: {
            // title: 'a',
            url: {
                selector: 'a',
                attr: 'href'
            }
        }
    }
}).then(function(value) {
    // let arrayOfShirtsUrl = value.shirts;
    let table = [];
    // For now, we are working with just one value => this is an object, so thing to access the property
    for (let i = 0; i < value.shirts.length; i++) {
        let oneShirtUrl = value.shirts[i].url;
        // console.log(oneShirtUrl);
        getAllShirtsInfo(oneShirtUrl);
    }
}, function(raison) {
    console.log(raison);
})};


function getAllShirtsInfo(shirtsUrl) {

    scrapeIt('http://www.shirts4mike.com/'+shirtsUrl, {
        title: '.shirt-details h1',
        picture: {
            selector: '.shirt-picture img',
            attr: 'src'
        }

    }).then(function(value) {
        // The log below gives the url, the shirt title (with price and color) and the shirt picture
        // console.log(shirtsUrl + '\n' + value.title + '\n' + value.picture);
        arrayOfShirts(shirtsUrl, value.title, value.picture);
    })
}

function arrayOfShirts(url, title, picture) {
    // console.log(url, title, picture)
    let foo = {
        url: url,
        title: title,
        picture: picture
    }
    console.log(foo)
}

// Program your scraper so that it visits the website and uses the shirts.php as single entry point
const getUrl = scrapeIt('http://www.shirts4mike.com/', {
    url: {
        selector: '.nav .shirts a',
        attr: 'href'
    }

}).then(function(value) {
    let productsUrl = value.url;
    getProductsUrl(productsUrl);
}, function(raison) {
    console.log(raison);
});
