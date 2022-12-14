import { getInputDataLines, isVerbose } from '../common/helpers';

class Position {
    x: number;
    y: number;

    constructor(x: string | number, y: string | number) {
        this.x = Number(x);
        this.y = Number(y);
    }

    public clone() {
        return new Position(this.x, this.y);
    }

    public minimize(pos: Position) {
        if (pos.x < this.x) {
            this.x = pos.x;
        }
        if (pos.y < this.y) {
            this.y = pos.y;
        }
    }

    public maximize(pos: Position) {
        if (pos.x > this.x) {
            this.x = pos.x;
        }
        if (pos.y > this.y) {
            this.y = pos.y;
        }
    }

    public moveDown() {
        ++this.y;
    }

    public moveDownLeft() {
        ++this.y;
        --this.x;
    }

    public moveDownRight() {
        ++this.y;
        ++this.x;
    }
}

const symbols = {
    air: '.',
    rock: '#',
    sandSource: '+',
    restingSand: 'o',
    freeFallingSand: '~'
}
const blockingSymbols = [ symbols.restingSand, symbols.rock ];

function drawRock(cave: string[][], lines: Position[][], xOffset: number) {
    let startPos: Position | undefined;
    let endPos: Position | undefined;
    lines.forEach(line => {
        startPos = line[0];
        for (let i = 1; i <= line.length - 1; ++i) {
            endPos = line[i];
            let xMove = startPos.x < endPos.x ? 1 : -1;
            let yMove = startPos.y < endPos.y ? 1 : -1;
            for (let x = startPos.x - xOffset; xMove > 0 && x <= endPos.x - xOffset || xMove < 0 && x >= endPos.x - xOffset; x += xMove) {
                for (let y = startPos.y; yMove > 0 && y <= endPos.y || yMove < 0 && y >= endPos.y; y += yMove) {
                    cave[y][x] = symbols.rock;
                }
            }
            startPos = endPos;
        }
    });
}

function buildCave(inputData: string[], withFloor: boolean = false): { cave: string[][], sandSource: Position } {
    let lines: Position[][] = [];
    let minCoordinate: Position = new Position(Number.MAX_VALUE, 0);
    let maxCoordinate: Position = new Position(0, 0);
    inputData.forEach(line => {
        let coordinates: Position[] = []
        let values = line.match(/\d+/g)!
        for (let ci = 0; ci < values.length - 1; ci += 2) {
            let coordinate: Position = new Position(values[ci], values[ci + 1]);
            minCoordinate.minimize(coordinate);
            maxCoordinate.maximize(coordinate);
            coordinates.push(coordinate);
        }
        lines.push(coordinates);
    });

    let cave: string[][];
    // We're adding 3 instead of 1 to get cave edges where sand can fall down
    let caveWidth = maxCoordinate.x - minCoordinate.x + 3;
    // Offset needs to include the left edge as well
    let xOffset = minCoordinate.x - 1;
    if (withFloor) {
        // The floor is always two levels lower than the lowest rock formation
        lines.push([new Position(0 + xOffset, maxCoordinate.y + 2), new Position(caveWidth - 1 + xOffset, maxCoordinate.y + 2)]);
        cave = new Array(maxCoordinate.y + 3).fill(0).map(_ => new Array(caveWidth).fill(symbols.air));
    } else {
        // We also add three extra lines to draw free falling sand
        cave = new Array(maxCoordinate.y + 4).fill(0).map(_ => new Array(caveWidth).fill(symbols.air));
    }
    drawRock(cave!, lines, xOffset);
    let sandSource = new Position(500 - xOffset, 0);
    cave[sandSource.y][sandSource.x] = symbols.sandSource;

    return { cave: cave!, sandSource: sandSource };
}

function extendCaveLeft(cave: string[][]) {
    cave.forEach(l => {
        l.splice(0, 0, symbols.air)
    });
    cave[cave.length - 1][0] = symbols.rock;
}

function extendCaveRight(cave: string[][]) {
    cave.forEach(l => {
        l.splice(l.length, 0, symbols.air)
    });
    cave[cave.length - 1][cave[0].length - 1] = symbols.rock;
}

function moveGrainOfSand(cave: string[][], sandPosition: Position, withFloor: boolean = false): { moved: boolean, movePositionsBy: number } {
    let newY = sandPosition.y + 1;
    let movePositionsBy = 0;
    if (newY < cave.length) {
        if (blockingSymbols.indexOf(cave[newY][sandPosition.x]) < 0) {
            sandPosition.moveDown();
            return { moved: true, movePositionsBy: movePositionsBy };
        }
        if (sandPosition.x >= 0 && blockingSymbols.indexOf(cave[newY][sandPosition.x - 1]) < 0) {
            sandPosition.moveDownLeft();
            if (withFloor && sandPosition.x == 0) {
                extendCaveLeft(cave);
                ++sandPosition.x;
                movePositionsBy = 1;
            }
            return { moved: true, movePositionsBy: movePositionsBy };
        }
        if (sandPosition.x < cave[0].length && blockingSymbols.indexOf(cave[newY][sandPosition.x + 1]) < 0) {
            sandPosition.moveDownRight();
            if (withFloor && sandPosition.x == cave[0].length - 1) {
                extendCaveRight(cave);
            }
            return { moved: true, movePositionsBy: movePositionsBy };
        }
    }
    return { moved: false, movePositionsBy: movePositionsBy };
}

function isOnCaveEdgeOrCaveFull(cave: string[][], sandPosition: Position, withFloor: boolean = false): boolean {
    return sandPosition.x == 0 || sandPosition.x == cave[0].length - 1
        || !withFloor && sandPosition.y == cave.length - 1
        || withFloor && sandPosition.y == 0 && cave[sandPosition.y][sandPosition.x] == symbols.restingSand;
}

function pourSand(cave: string[][], sandSource: Position, withFloor: boolean = false) {
    let sandPosition: Position;
    do {
        sandPosition = sandSource.clone();
        let move;
        while ((move = moveGrainOfSand(cave, sandPosition, withFloor)).moved) {
            sandSource.x += move.movePositionsBy;
        }
        if (!isOnCaveEdgeOrCaveFull(cave, sandPosition, withFloor)) {
            cave[sandPosition.y][sandPosition.x] = symbols.restingSand;
        } else {
            // Add free falling sand
            sandPosition = sandSource.clone();
            while ((move = moveGrainOfSand(cave, sandPosition, withFloor)).moved) {
                cave[sandPosition.y][sandPosition.x] = symbols.freeFallingSand;
            }
            cave[sandPosition.y][sandPosition.x] = symbols.freeFallingSand;
        }
    } while (!isOnCaveEdgeOrCaveFull(cave, sandPosition, withFloor));
}

function drawCave(cave: string[][]) {
    if (isVerbose()) {
        console.log();
        cave.forEach(line => console.log(line.join('')));
        console.log();
    }
}

const inputData = getInputDataLines();
let buildResult = buildCave(inputData);
pourSand(buildResult.cave, buildResult.sandSource);
drawCave(buildResult.cave);
let restingSandGrains = buildResult.cave.reduce<number>((c, l) => c += l.reduce<number>((c, v) => c += v == symbols.restingSand ? 1 : 0, 0), 0)
console.log(`There are ${restingSandGrains} units of resting sand.`);

// Part 2
buildResult = buildCave(inputData, true);
pourSand(buildResult.cave, buildResult.sandSource, true);
drawCave(buildResult.cave);
restingSandGrains = buildResult.cave.reduce<number>((c, l) => c += l.reduce<number>((c, v) => c += v == symbols.restingSand ? 1 : 0, 0), 0)
console.log(`There are ${restingSandGrains} units of resting sand when the cave has a floor.`);

