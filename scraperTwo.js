// Create a folder called data if it does not already exist inside the folder
const fs = require('fs');
// The web scraper
const scrapeIt = require('scrape-it');

(function() {
    scrapeIt("http://www.shirts4mike.com/", {
        url: {
            selector: '.nav .shirts a',
            attr: 'href'
        }
    }).then((value) => {
        let shirtUrl = value.url;
        return shirtUrl;
    }).then( function(value) {
        scrapeIt('http://www.shirts4mike.com/'+value, {
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
        }).then((value) => {
            console.log(value)
        })
    });
})();
