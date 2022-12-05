import * as fs from 'fs';
import * as path from 'path';

export function getInputData(): string[] {
    const scriptFileName = path.basename(process.argv[1]);
    return fs.readFileSync(`${scriptFileName.substring(0,scriptFileName.length - 3)}-input.txt`, { encoding: 'utf-8' }).split('\n');
}