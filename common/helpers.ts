import * as fs from 'fs';
import * as path from 'path';

export function getInputDataLines(): string[] {
    return getInputDataAsString().split('\n');
}

export function getInputDataAsString(): string {
    let day: string = process.argv[2];
    return fs.readFileSync(path.join(day, 'input.txt'), { encoding: 'utf-8' });
}