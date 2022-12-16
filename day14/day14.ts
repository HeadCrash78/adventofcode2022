import { getInputDataLines, isVerbose, RegExps } from '../common';
import { Coordinate, Grid } from '../common/types';

const symbols = {
    air: '.',
    rock: '#',
    sandSource: '+',
    restingSand: 'o',
    freeFallingSand: '~'
}
const blockingSymbols = new Set([ symbols.restingSand, symbols.rock ]);

function drawRock(cave: Grid<string>, lines: Coordinate[][], xOffset: number) {
    let offset = new Coordinate(xOffset, 0);
    lines.forEach(line => {
        let startPos = line[0].moveBy(offset);
        for (let i = 1; i <= line.length - 1; ++i) {
            let endPos = line[i].moveBy(offset);
            let moveBy = new Coordinate(startPos.x < endPos.x ? 1 : startPos.x > endPos.x ? -1 : 0, startPos.y < endPos.y ? 1 : startPos.y > endPos.y ? -1 : 0);
            do {
                cave.mark(symbols.rock, startPos);
            } while (!startPos.moveBy(moveBy).equals(endPos));
            cave.mark(symbols.rock, startPos);
            startPos = endPos;
        }
    });
}

function buildCave(inputData: string[], withFloor: boolean = false): { cave: Grid<string>, sandSource: Coordinate } {
    let lines: Coordinate[][] = [];
    let minCoordinate = new Coordinate(Number.POSITIVE_INFINITY, 0);
    let maxCoordinate = new Coordinate(0, 0);
    inputData.forEach(line => {
        let coordinates: Coordinate[] = []
        let values = line.match(RegExps.allPositiveNumbers)!
        for (let ci = 0; ci < values.length - 1; ci += 2) {
            let coordinate = new Coordinate(values[ci], values[ci + 1]);
            minCoordinate.minimize(coordinate);
            maxCoordinate.maximize(coordinate);
            coordinates.push(coordinate);
        }
        lines.push(coordinates);
    });

    // We're adding 3 instead of 1 to get cave edges where sand can fall down
    let caveWidth = maxCoordinate.x - minCoordinate.x + 3;
    // We're adding two more levels to the cave so we can draw free falling sand
    let caveHeight = maxCoordinate.y + 3;
    // Offset needs to include the left edge as well
    let xOffset = (minCoordinate.x - 1) * -1;
    if (withFloor) {
        // The floor is always two levels lower than the lowest rock formation
        lines.push([new Coordinate(0 - xOffset, maxCoordinate.y + 2), new Coordinate(caveWidth - 1 - xOffset, maxCoordinate.y + 2)]);
    }
    let cave = new Grid<string>(caveHeight, caveWidth, symbols.air);
    drawRock(cave, lines, xOffset);
    let sandSource = new Coordinate(500 + xOffset, 0);
    cave.mark(symbols.sandSource, sandSource);

    return { cave: cave, sandSource: sandSource };
}

function moveGrainOfSand(cave: Grid<string>, sandPosition: Coordinate, withFloor: boolean = false): { moved: boolean, movePositionsBy: number } {
    let newY = sandPosition.y + 1;
    let movePositionsBy = 0;
    if (newY < cave.height) {
        if (!blockingSymbols.has(cave.get(sandPosition.x, newY)!)) {
            sandPosition.moveDown();
            return { moved: true, movePositionsBy: movePositionsBy };
        }
        if (sandPosition.x >= 0 && !blockingSymbols.has(cave.get(sandPosition.x - 1, newY)!)) {
            sandPosition.moveDownLeft();
            if (withFloor && sandPosition.x == 0) {
                cave.extendLeft(1, symbols.air).mark(symbols.rock, 0, cave.height - 1);
                ++sandPosition.x;
                movePositionsBy = 1;
            }
            return { moved: true, movePositionsBy: movePositionsBy };
        }
        if (sandPosition.x < cave.width && !blockingSymbols.has(cave.get(sandPosition.x + 1, newY)!)) {
            sandPosition.moveDownRight();
            if (withFloor && sandPosition.x == cave.width - 1) {
                cave.extendRight(1, symbols.air).mark(symbols.rock, cave.width - 1, cave.height - 1);
            }
            return { moved: true, movePositionsBy: movePositionsBy };
        }
    }
    return { moved: false, movePositionsBy: movePositionsBy };
}

function isOnCaveEdgeOrCaveFull(cave: Grid<string>, sandPosition: Coordinate, withFloor: boolean = false): boolean {
    return sandPosition.x == 0 || sandPosition.x == cave.width - 1
        || !withFloor && sandPosition.y == cave.height - 1
        || withFloor && sandPosition.y == 0 && cave.get(sandPosition) == symbols.restingSand;
}

function pourSand(cave: Grid<string>, sandSource: Coordinate, withFloor: boolean = false) {
    let sandPosition: Coordinate;
    do {
        sandPosition = sandSource.clone();
        let move;
        while ((move = moveGrainOfSand(cave, sandPosition, withFloor)).moved) {
            sandSource.x += move.movePositionsBy;
        }
        if (!isOnCaveEdgeOrCaveFull(cave, sandPosition, withFloor)) {
            cave.mark(symbols.restingSand, sandPosition);
        } else {
            // Add free falling sand
            sandPosition = sandSource.clone();
            while ((move = moveGrainOfSand(cave, sandPosition, withFloor)).moved) {
                cave.mark(symbols.freeFallingSand, sandPosition);
            }
            cave.mark(symbols.freeFallingSand, sandPosition);
        }
    } while (!isOnCaveEdgeOrCaveFull(cave, sandPosition, withFloor));
}

function drawCave(cave: Grid<string>) {
    if (isVerbose()) {
        console.log();
        cave.printToConsole();
        console.log();
    }
}

const inputData = getInputDataLines();
let buildResult = buildCave(inputData);
pourSand(buildResult.cave, buildResult.sandSource);
drawCave(buildResult.cave);
let restingSandGrains = buildResult.cave.getMarkedPositionCount(symbols.restingSand);
console.log(`There are ${restingSandGrains} units of resting sand.`);

// Part 2
buildResult = buildCave(inputData, true);
pourSand(buildResult.cave, buildResult.sandSource, true);
drawCave(buildResult.cave);
restingSandGrains = buildResult.cave.getMarkedPositionCount(symbols.restingSand);
console.log(`There are ${restingSandGrains} units of resting sand when the cave has a floor.`);

