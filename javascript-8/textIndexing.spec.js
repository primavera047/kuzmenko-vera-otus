const fs = require('fs');
const mock = require('mock-fs');

const textIndexing = require('./textIndexing');

describe('textIndexing tests', () => {
    beforeAll(() => {
        mock({
            'empty.txt': '',
            'normal_text.txt': 'a b c d e a b c d a b c a b a',
            'text_with_symbols.txt': 'a b!\n\n\nc d -\t e\t\t\t \na ^()\tb c\nd a b \n\n\n\n\n\nc a \n\n\n\t\t\t\tb \n\t\t\t\ta.\n'
        });        
    });
    
    test('test mock existent', () => {
        expect(fs.existsSync('empty.txt')).toBeTruthy();
        expect(fs.existsSync('normal_text.txt')).toBeTruthy();
        expect(fs.existsSync('text_with_symbols.txt')).toBeTruthy();
    });

    test('test mock content', () => {
        const result = fs.readFileSync('normal_text.txt', {encoding: 'utf-8', flag: 'r'});
        expect(result).toEqual('a b c d e a b c d a b c a b a');
    });

    test('test textIndexing with empty.txt', async () => {
        const inPath = 'empty.txt';
        const outPath = 'empty-index.txt';

        await textIndexing(inPath, outPath);

        expect(fs.existsSync(outPath)).toBeTruthy();
        
        const result = fs.readFileSync(outPath, {encoding: 'utf-8', flag: 'r'});
        expect(result).toEqual('');
    });

    test('test textIndexing with normal_text.txt', async () => {
        const inPath = 'normal_text.txt';
        const outPath = 'normal_text-index.txt';

        await textIndexing(inPath, outPath);

        expect(fs.existsSync(outPath)).toBeTruthy();
        
        const result = fs.readFileSync(outPath, {encoding: 'utf-8', flag: 'r'});
        expect(result).toEqual('5,4,3,2,1,');
    });

    test('test textIndexing with text_with_symbols.txt', async () => {
        const inPath = 'text_with_symbols.txt';
        const outPath = 'text_with_symbols-index.txt';

        await textIndexing(inPath, outPath);

        expect(fs.existsSync(outPath)).toBeTruthy();
        
        const result = fs.readFileSync(outPath, {encoding: 'utf-8', flag: 'r'});
        expect(result).toEqual('5,4,3,2,1,');
    });

    afterAll(() => {
        mock.restore();
    });
})