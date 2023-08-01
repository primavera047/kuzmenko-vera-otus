const commander = require('commander');
const tree = require('./treeFunc');

commander.option('--path <fsPath>', 'folder for scan').parse();
const options = commander.opts();
const fsPath = options.path;

tree(fsPath).then((content) => {
    console.log(content);
});
