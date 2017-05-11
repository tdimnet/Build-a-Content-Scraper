// Create a folder called data if it does not already exist inside the folder
const fs = require('fs');
// The web scraper
const scrapeIt = require('scrape-it');
// The JSON to CSV
var json2csv = require('json2csv');


function retrieveAllShirtsInfo(url) {
    scrapeIt('http://www.shirts4mike.com/'+url, {
        title: '.shirt-details h1',
        price: '.shirt-details .price',
        picture: {
            selector: '.shirt-picture img',
            attr: 'src'
        }

    }).then(function(value) {
        // The log below gives the url, the shirt title (with price and color) and the shirt picture
        // console.log(shirtsUrl + '\n' + value.title + '\n' + value.picture);

    })
}




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
            let shirtsPagesUrl = value.shirts;
            // console.log(shirtsPagesUrl[0].url)
            // retrieveAllShirtsInfo(shirtsPagesUrl[0].url)

            let table = [];
            for (let i = 0; i < shirtsPagesUrl.length; i++) {
                let shirtInfo = retrieveAllShirtsInfo(shirtsPagesUrl[i].url);
                table.push(shirtInfo);
            }
            console.log(table)

        })
    });
})();
