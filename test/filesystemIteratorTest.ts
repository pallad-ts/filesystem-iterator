import {filesystemIterator} from "@src/filesystemIterator";
import * as path from 'path';


describe('filesystemIterator', () => {

    const ROOT_DIR = path.join(__dirname, './fixtures/example');

    async function iteratorToArray(gen: AsyncGenerator<string>) {
        const results = [];
        for await (const entry of gen) {
            results.push(path.relative(ROOT_DIR, entry));
        }
        return results;
    }

    it('all files', async () => {
        const files = await iteratorToArray(filesystemIterator(ROOT_DIR));

        expect(files)
            .toMatchSnapshot();
    });

    it('skipping directories', async () => {
        const files = await iteratorToArray(filesystemIterator(ROOT_DIR, {skipDirectories: true}));
        expect(files)
            .toMatchSnapshot();
    });

    it('max depth', async () => {
        const files = await iteratorToArray(filesystemIterator(ROOT_DIR, {maxDepth: 1}));
        expect(files)
            .toMatchSnapshot();
    });

    it('using filter', async () => {
        const files = await iteratorToArray(filesystemIterator(ROOT_DIR, {
            filter(x) {
                return x.includes('more');
            }
        }));
        expect(files)
            .toMatchSnapshot();
    });

    it('using filter with skipping directories', async () => {
        const files = await iteratorToArray(filesystemIterator(ROOT_DIR, {
            filter(x) {
                return x.includes('more');
            },
            skipDirectories: true
        }));
        expect(files)
            .toMatchSnapshot();
    })
});