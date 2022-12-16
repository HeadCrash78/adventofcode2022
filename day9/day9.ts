import { getInputDataLines, isVerbose } from '../common';
import { Coordinate, Grid } from '../common/types';

const moves: { [key: string]: Coordinate } = {
    'L': new Coordinate(-1, 0),
    'U': new Coordinate(0, -1),
    'R': new Coordinate(1, 0),
    'D': new Coordinate(0, 1)
};

function createGridAndStartPosition(inputData: string[]): { start: Coordinate, grid: Grid<string> } {
    let pos = new Coordinate(0, 0), minPos = new Coordinate(0, 0), maxPos = new Coordinate(0, 0);
    inputData.forEach(line => {
        let tokens = line.split(/\s+/);
        pos.moveBy(moves[tokens[0]], Number(tokens[1]));
        minPos.minimize(pos);
        maxPos.maximize(pos);
    });

    let sizeX = Math.abs(Math.min(0, minPos.x)) + Math.max(0, maxPos.x) + 1;
    let sizeY = Math.abs(Math.min(0, minPos.y)) + Math.max(0, maxPos.y) + 1;
    return { start: minPos.abs(), grid: new Grid(sizeY, sizeX, '.')};
}

function fixTailPositions(head: Coordinate, tails: Coordinate[]) {
    for (let tailIndex = 0; tailIndex < tails.length; ++tailIndex) {
        let compareKnot = tailIndex == 0 ? head : tails[tailIndex - 1];
        tails[tailIndex].snapTo(compareKnot);
    }
}

function executeMoves(inputData: string[], start: Coordinate, tailNumber: number, grid: Grid<string>) {
    let head = start, tails: Coordinate[] = new Array(tailNumber).fill(0).map(_ => start.clone());
    inputData.forEach(line => {
        let tokens = line.split(/\s+/);
        let move = moves[tokens[0]];
        let distance = Number(tokens[1])
        while (distance-- > 0) {
            head.moveBy(move);
            fixTailPositions(head, tails);
            grid.mark('#', tails[tailNumber - 1]);
        }
    });
}

function printGrid(grid: Grid<string>) {
    if (isVerbose()) {
        grid.grid.forEach(row => console.log(row.join('')));
        console.log();
    }
}

const inputData = getInputDataLines();
let startInfo = createGridAndStartPosition(inputData);
console.log(`The grid is ${startInfo.grid.width}x${startInfo.grid.height} fields with starting point ${startInfo.start.toString()}.`);

let part1Grid = startInfo.grid;
let part1Start = startInfo.start;
let part2Grid = startInfo.grid.clone();
let part2Start = startInfo.start.clone();

executeMoves(inputData, part1Start, 1, part1Grid);
printGrid(part1Grid);
console.log(`The tail visited ${part1Grid.getMarkedPositionCount('#')} positions.`);

executeMoves(inputData, part2Start, 9, part2Grid);
printGrid(part2Grid);
console.log(`The last tail visited ${part2Grid.getMarkedPositionCount('#')} positions.`);