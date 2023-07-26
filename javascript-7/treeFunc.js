const { dir } = require('console');
const fs = require('fs/promises');
const path = require('path');

async function tree(fsPath) {
    let result = {
        dirs: [],
        files: []
    };

    const content = await fs.readdir(fsPath, { withFileTypes: true });

    for (const obj of content) {
        const objName = path.join(fsPath, obj.name);

        if (obj.isFile()) {
            result.files.push(objName);
        }
        else {
            result.dirs.push(objName);

            const subContent = await tree(objName);

            for (const dirObj of subContent.dirs) {
                result.dirs.push(dirObj);
            }

            for (const fileObj of subContent.files) {
                result.files.push(fileObj);
            }
        }
    }

    return result;
}

module.exports = tree;