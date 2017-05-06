// Create a folder called data if it does not already exist inside the folder
const fs = require('fs');


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
    // One package should be used to scrape content from the site.
    // The other package should create the CSV file.
