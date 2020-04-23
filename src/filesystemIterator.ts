import * as fs from 'fs';
import * as path from 'path';

export function filesystemIterator(dir: string, options?: filesystemIterator.Options.FromUser): AsyncGenerator<string> {
    const opts: filesystemIterator.Options = {
        filter: options?.filter,
        skipDirectories: options?.skipDirectories ?? false,
        maxDepth: options?.maxDepth ?? Infinity
    };

    const iterator = async function* (dir: string, depth: number): AsyncGenerator<string> {
        const handle = await fs.promises.opendir(dir);
        while (true) {
            const entry = await handle.read();
            if (entry === null) {
                return;
            }

            const currentPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (depth + 1 <= opts.maxDepth) {
                    yield* iterator(currentPath, depth + 1);
                }
                if (opts.skipDirectories) {
                    continue;
                }
            }

            if (opts.filter && !opts.filter(currentPath)) {
                continue;
            }
            yield currentPath;
        }
    };

    return iterator(dir, 0);
}

export namespace filesystemIterator {
    export interface Options {
        maxDepth: number;
        skipDirectories: boolean;
        filter?: (path: string) => boolean
    }

    export namespace Options {
        export type FromUser = Partial<Pick<Options, 'maxDepth' | 'skipDirectories'>> & Pick<Options, 'filter'>;
    }
}