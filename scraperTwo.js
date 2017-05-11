// Create a folder called data if it does not already exist inside the folder
const fs = require('fs');
// The web scraper
const scrapeIt = require('scrape-it');
// The JSON to CSV
var json2csv = require('json2csv');


(function() {
    // First step: go the shirts4mike.com website
    scrapeIt("http://www.shirts4mike.com/", {
        url: {
            selector: '.nav .shirts a',
            attr: 'href'
        }
    }).then((value) => {
        // Then take all the urls needed
        scrapeIt('http://www.shirts4mike.com/'+value.url, {
            shirts: {
            listItem: '.products li',
            name: 'shirts',
            data: {
                url: {
                    selector: 'a',
                    attr: 'href'
                    }
                }
            }
        }).then((value) => {
            // For now, we are displaying them in an array of url
            // console.log(value.shirts);
            let fields = ['url'];
            let urlPages = value.shirts;
            let csv = json2csv({ data: urlPages, fields: fields });

            fs.writeFile('file.csv', csv, function(err) {
              if (err) throw err;
              console.log('file saved');
            });

        })
    });
})();
