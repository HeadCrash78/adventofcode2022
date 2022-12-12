import * as fs from 'fs';
import * as path from 'path';

export function getInputDataLines(): string[] {
    return getInputDataAsString().split('\n');
}

export function getInputDataAsString(): string {
    let scriptFileName = path.basename(process.argv[1]);
    scriptFileName = scriptFileName.substring(0,scriptFileName.length - 3);
    return fs.readFileSync(path.join(scriptFileName, 'input.txt'), { encoding: 'utf-8' });
}

export function isVerbose(): boolean {
    return process.argv[2] == 'verbose';
}