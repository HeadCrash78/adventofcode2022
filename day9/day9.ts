import { getInputDataLines, isVerbose } from '../common/helpers';

class Grid {
    grid: any[][];

    constructor(height: number, width: number) {
        this.grid = new Array(height).fill(0).map(_ => new Array(width).fill('.'));
    }

    public get height(): number {
        return this.grid.length;
    }

    public get width(): number {
        return this.grid[0].length;
    }

    public clone(): Grid {
        return new Grid(this.grid.length, this.grid[0].length);
    }

    public visit(pos: Position, marker: any = '#') {
        this.grid[pos.y][pos.x] = marker;
    }

    public getVisitedPositionCount(marker: any = '#'): number {
        return this.grid.reduce<number>((c, row) => c += row.reduce<number>((c, pos) => c += pos == marker ? 1 : 0, 0), 0);
    }
}
class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public clone(): Position {
        return new Position(this.x, this.y);
    }

    public moveBy(pos: Position, times: number = 1) {
        this.x += pos.x * times;
        this.y += pos.y * times;
    }

    public minimize(pos: Position) {
        this.x = Math.min(this.x, pos.x);
        this.y = Math.min(this.y, pos.y);
    }

    public maximize(pos: Position) {
        this.x = Math.max(this.x, pos.x);
        this.y = Math.max(this.y, pos.y);
    }

    public abs(): Position {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }

    private snapDistance(pos: Position): Position {
        let x: number = 0, y: number = 0;
        let dx = this.x - pos.x;
        let dy = this.y - pos.y;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            x = dx < 0 ? 1 : dx > 0 ? -1 : 0;
            y = dy < 0 ? 1 : dy > 0 ? -1 : 0;
        }
        return new Position(x, y);
    }

    public snapTo(pos: Position) {
        this.moveBy(this.snapDistance(pos));
    }
}

const moves: { [key: string]: Position } = {
    'L': new Position(-1, 0),
    'U': new Position(0, -1),
    'R': new Position(1, 0),
    'D': new Position(0, 1)
};

function createGridAndStartPosition(inputData: string[]): { start: Position, grid: Grid } {
    let pos = new Position(0, 0), minPos = new Position(0, 0), maxPos = new Position(0, 0);
    inputData.forEach(line => {
        let tokens = line.split(/\s+/);
        pos.moveBy(moves[tokens[0]], Number(tokens[1]));
        minPos.minimize(pos);
        maxPos.maximize(pos);
    });

    let sizeX = Math.abs(Math.min(0, minPos.x)) + Math.max(0, maxPos.x) + 1;
    let sizeY = Math.abs(Math.min(0, minPos.y)) + Math.max(0, maxPos.y) + 1;
    return { start: minPos.abs(), grid: new Grid(sizeY, sizeX)};
}

function fixTailPositions(head: Position, tails: Position[]) {
    for (let tailIndex = 0; tailIndex < tails.length; ++tailIndex) {
        let compareKnot = tailIndex == 0 ? head : tails[tailIndex - 1];
        tails[tailIndex].snapTo(compareKnot);
    }
}

function executeMoves(inputData: string[], start: Position, tailNumber: number, grid: Grid) {
    let head = start, tails: Position[] = new Array(tailNumber).fill(0).map(_ => start.clone());
    inputData.forEach(line => {
        let tokens = line.split(/\s+/);
        let move = moves[tokens[0]];
        let distance = Number(tokens[1])
        while (distance-- > 0) {
            head.moveBy(move);
            fixTailPositions(head, tails);
            grid.visit(tails[tailNumber - 1]);
        }
    });
}

function printGrid(grid: Grid) {
    if (isVerbose()) {
        grid.grid.forEach(row => console.log(row.join('')));
        console.log();
    }
}

const inputData = getInputDataLines();
let startInfo = createGridAndStartPosition(inputData);
console.log(`The grid is ${startInfo.grid.width}x${startInfo.grid.height} fields with starting point (${startInfo.start.x},${startInfo.start.y}).`);

let part1Grid = startInfo.grid;
let part1Start = startInfo.start;
let part2Grid = startInfo.grid.clone();
let part2Start = startInfo.start.clone();

executeMoves(inputData, part1Start, 1, part1Grid);
printGrid(part1Grid);
console.log(`The tail visited ${part1Grid.getVisitedPositionCount()} positions.`);

executeMoves(inputData, part2Start, 9, part2Grid);
printGrid(part2Grid);
console.log(`The last tail visited ${part2Grid.getVisitedPositionCount()} positions.`);