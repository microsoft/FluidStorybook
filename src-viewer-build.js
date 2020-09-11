const fs = require('fs'),
      path = require('path');

let targetDirectory = __dirname + '/src';
let outputDirectory = __dirname + '/public';

function parseDirectory(directoryName, files) {
    fs.readdirSync(directoryName).forEach((file) => {
        var fullFileName = path.join(directoryName, file);
        var stat = fs.lstatSync(fullFileName);

        if (stat.isDirectory()) {
            parseDirectory(fullFileName, files);
        }
        else {
            let srcFileName = getSrcFileName(fullFileName);
            files[srcFileName] = { raw: getFile(fullFileName) };
        }
    });
}

function getSrcFileName(fileName) {
    return fileName.replace(targetDirectory + '/', '');
}

function getFile(fileName) {
    return fs.readFileSync(fileName, { encoding: 'utf8' }).replace(/\r/g, '');
}

let files = {};
parseDirectory(targetDirectory, files);

// Generate file
fs.writeFileSync(outputDirectory + '/rawSources.json', JSON.stringify({
    "files": {
        ...files
    }
}));
console.log(outputDirectory + '/rawSources.json created!');