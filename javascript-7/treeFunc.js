const fs = require('fs/promises');
const path = require('path');

async function tree(fsPath) {    
    console.log(fsPath);

    let result = {
        dirs: [],
        files: []
    };

    const content = await fs.readdir(fsPath, { withFileTypes: true });

    for (const obj of content) {
        const objName = path.join(fsPath, obj.name);        

        if (obj.isDirectory()) {
            result.dirs.push(objName);

            const subContent = await tree(objName);

            for (const dirObj of subContent.dirs) {
                result.dirs.push(dirObj);
            }

            for (const fileObj of subContent.files) {
                result.files.push(fileObj);
            }            
        }
        else {
            result.files.push(objName);
        }
    }

    return result;
}

module.exports = tree;