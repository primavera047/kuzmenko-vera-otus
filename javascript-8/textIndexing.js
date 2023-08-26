const fs = require('fs');

function textIndexing(inPath, outPath) {    
    return new Promise((resolve, reject) => {
        const rStream = fs.createReadStream(inPath, 'utf-8');
        const wStream = fs.createWriteStream(outPath);
        let textRepresentation = {};

        rStream.on('error', (error) => {
            console.log(`Read error: ${error}`);
            reject();
        });

        rStream.on('readable', () => {
            let chunk;

            while ((chunk = rStream.read()) !== null) {                
                const words = chunk.replace(/[^A-Za-z0-9\u00C0-\u00FF]+/g, ' ').split(' ');

                for (let word of words) {
                    if (word !== "") {
                        word = word.toLowerCase();
                        
                        if (textRepresentation.hasOwnProperty(word)) {
                            ++textRepresentation[word];
                        }
                        else {
                            textRepresentation[word] = 1;
                        }                
                    }            
                }
            }
        });

        rStream.on('end', () => {
            const sortedWords = Object.keys(textRepresentation).sort();

            for (let word of sortedWords) {
                wStream.write(`${textRepresentation[word]},`);        
            }

            wStream.end();

            resolve();
        });
    });
}

module.exports = textIndexing;