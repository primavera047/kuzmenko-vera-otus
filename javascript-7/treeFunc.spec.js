const tree = require('./treeFunc');

test('empty folder', async () => {
    const fsPath = "./empty";

    const expectedResult = {
        dirs: [],
        files: []
    };

    const result = await tree(fsPath);

    expect(result).toEqual(expectedResult);
})

test('only subfolder', async () => {
    const fsPath = "./onlySubfolders";

    const expectedResult = {
        dirs: [
            'onlySubfolders/sub1',
            'onlySubfolders/sub2',
            'onlySubfolders/sub2/sub3'
        ],
        files: []
    };

    const result = await tree(fsPath);

    expect(result).toEqual(expectedResult);
})

test('only files', async () => {
    const fsPath = "./onlyFiles";

    const expectedResult = {
        dirs: [],
        files: [
            'onlyFiles/file1.txt',
            'onlyFiles/file2.txt',
        ]
    };

    const result = await tree(fsPath);

    expect(result).toEqual(expectedResult);
})

test('files and subfolders', async () => {
    const fsPath = "./subfoldersAndFiles";

    const expectedResult = {
        dirs: [
            'subfoldersAndFiles/sub1',
            'subfoldersAndFiles/sub2',
            'subfoldersAndFiles/sub2/sub3'
        ],
        files: [
            'subfoldersAndFiles/file.txt',
            'subfoldersAndFiles/sub1/file1.txt',
            'subfoldersAndFiles/sub2/sub3/file3.txt'
        ]
    };

    const result = await tree(fsPath);

    expect(result).toEqual(expectedResult);
})