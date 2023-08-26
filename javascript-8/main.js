const commander = require('commander');
const textIndexing = require('./textIndexing');

commander.option('-p <inPath>', 'file to process');
commander.option('-o <outPath>', 'file to write result');
commander.parse();
const options = commander.opts();
const inPath = options.p;
const outPath = options.o;

textIndexing(inPath, outPath);