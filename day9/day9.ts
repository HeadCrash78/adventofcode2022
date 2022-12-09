import { exit } from 'process';
import { getInputDataLines } from '../common/helpers';

interface Position {
    x: number,
    y: number
}

function createGridAndStartPosition(inputData: string[]): { start: Position, grid: number[][] } {
    let x = 0, minX = 0, maxX = 0, y = 0, minY = 0, maxY = 0;
    inputData.forEach(line => {
        let tokens = line.split(/\s+/);
        switch (tokens[0]) {
            case 'L':
                x -= Number(tokens[1]);
                break;
            case 'R':
                x += Number(tokens[1]);
                break;
            case 'U':
                y -= Number(tokens[1]);
                break;
            case 'D':
                y += Number(tokens[1]);
                break;
            default:
                console.log('ERROR: Invalid input data!');
                exit(1);
        }
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    });

    let sizeX = Math.abs(Math.min(0, minX)) + Math.max(0, maxX) + 1;
    let sizeY = Math.abs(Math.min(0, minY)) + Math.max(0, maxY) + 1;
    return { start: { x: Math.abs(minX), y: Math.abs(minY) }, grid: new Array(sizeY).fill(0).map(_ => new Array(sizeX).fill(0))};
}

function fixTailPositions(head: Position, tails: Position[]) {
    for (let tailIndex = 0; tailIndex < tails.length; ++tailIndex) {
        let compareKnot = tailIndex == 0 ? head : tails[tailIndex - 1];
        if (Math.abs(compareKnot.x - tails[tailIndex].x) > 1) {
            tails[tailIndex].x += compareKnot.x < tails[tailIndex].x ? -1 : 1;
            if (compareKnot.y != tails[tailIndex].y) {
                tails[tailIndex].y += compareKnot.y < tails[tailIndex].y ? -1 : 1;
            }
        }
        if (Math.abs(compareKnot.y - tails[tailIndex].y) > 1) {
            tails[tailIndex].y += compareKnot.y < tails[tailIndex].y ? -1 : 1;
            if (compareKnot.x != tails[tailIndex].x) {
                tails[tailIndex].x += compareKnot.x < tails[tailIndex].x ? -1 : 1;
            }
        }
    }
}

function executeMoves(inputData: string[], start: Position, tailNumber: number, grid: number[][]) {
    let head = start, tails: Position[] = new Array(tailNumber).fill(0).map(_ => JSON.parse(JSON.stringify(start)));
    inputData.forEach(line => {
        let tokens = line.split(/\s+/);
        let distance = Number(tokens[1])
        switch (tokens[0]) {
            case 'L':
                while (distance-- > 0) {
                    --head.x;
                    fixTailPositions(head, tails);
                    grid[tails[tailNumber - 1].y][tails[tailNumber - 1].x] = 1;
                }
                break;
            case 'R':
                while (distance-- > 0) {
                    ++head.x;
                    fixTailPositions(head, tails);
                    grid[tails[tailNumber - 1].y][tails[tailNumber - 1].x] = 1;
                }
                break;
            case 'U':
                while (distance-- > 0) {
                    --head.y;
                    fixTailPositions(head, tails);
                    grid[tails[tailNumber - 1].y][tails[tailNumber - 1].x] = 1;
                }
                break;
            case 'D':
                while (distance-- > 0) {
                    ++head.y;
                    fixTailPositions(head, tails);
                    grid[tails[tailNumber - 1].y][tails[tailNumber - 1].x] = 1;
                }
                break;
        }
    });
}

function printGrid(grid: number[][]) {
    if (process.argv[3] == 'verbose') {
        grid.forEach(row => console.log(row.map(n => n ? '#' : '.').join('')));
        console.log();
    }
}

const inputData = getInputDataLines();
let startInfo = createGridAndStartPosition(inputData);
console.log(`The grid is ${startInfo.grid[0].length}x${startInfo.grid.length} fields with starting point (${startInfo.start.x},${startInfo.start.y}).`);

let part1Grid = startInfo.grid;
let part1Start = startInfo.start;
let part2Grid: number[][] = JSON.parse(JSON.stringify(startInfo.grid));
let part2Start = JSON.parse(JSON.stringify(startInfo.start));

executeMoves(inputData, part1Start, 1, part1Grid);
printGrid(part1Grid);
let visitedPositions = part1Grid.reduce<number>((c, row) => c += row.reduce((c, val) => c += val, 0), 0);
console.log(`The tail visited ${visitedPositions} positions.`);

executeMoves(inputData, part2Start, 9, part2Grid);
printGrid(part2Grid);
visitedPositions = part2Grid.reduce<number>((c, row) => c += row.reduce((c, val) => c += val, 0), 0);
console.log(`The last tail visited ${visitedPositions} positions.`);