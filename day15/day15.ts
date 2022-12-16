import { getInputDataLines, isVerbose, RegExps } from '../common';
import { Coordinate, Range, RangeSet } from '../common/types';

class SensorData {
    sensorCoord: Coordinate;
    beaconCoord: Coordinate;
    distance: number;
    // Array with four positions in the order top, right, bottom, left
    coverageCorners: Coordinate[];

    constructor(input: string) {
        const coords = input.match(RegExps.allNumbers)!;
        this.sensorCoord = new Coordinate(coords[0], coords[1]);
        this.beaconCoord = new Coordinate(coords[2], coords[3]);
        this.distance = this.sensorCoord.manhattanDistanceTo(this.beaconCoord);
        this.coverageCorners = [
            new Coordinate(this.sensorCoord.x, this.sensorCoord.y - this.distance),
            new Coordinate(this.sensorCoord.x + this.distance, this.sensorCoord.y),
            new Coordinate(this.sensorCoord.x, this.sensorCoord.y + this.distance),
            new Coordinate(this.sensorCoord.x - this.distance, this.sensorCoord.y)
        ];
    }
}

function createSensorData(inputData: string[]): SensorData[] {
    return inputData.map(line => new SensorData(line));
}

function getRowCoverage(row: number, sensorData: SensorData): number[] | undefined {
    if (sensorData.coverageCorners[0].y <= row && row <= sensorData.coverageCorners[2].y) {
        let coverageRange = (sensorData.distance - Math.abs(sensorData.sensorCoord.y - row));
        return [sensorData.sensorCoord.x - coverageRange, sensorData.sensorCoord.x + coverageRange];
    }
    return undefined;
} 

function calculateMinAndMaxHorizontalPositionsInRow(sensorData: SensorData[], row: number): RangeSet {
    let ranges = new RangeSet();
    sensorData.forEach(s => {
        let minMax = getRowCoverage(row, s);
        if (minMax) {
            ranges.add(new Range(minMax[0], minMax[1]));
        }
    });
    return ranges;
}

function getFieldSize(sensorData: SensorData[]): { min: Coordinate, max: Coordinate } {
    let field = { min: new Coordinate(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), max: new Coordinate(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY) };
    sensorData.forEach(s => {
        field.min.minimize(new Coordinate(s.coverageCorners[3].x, s.coverageCorners[0].y));
        field.max.maximize(new Coordinate(s.coverageCorners[1].x, s.coverageCorners[2].y));
    });
    return field;
}

function drawField(sensorData: SensorData[], minRow?: number, maxRow?: number) {
    if (isVerbose()) {
        console.log();
        let field = getFieldSize(sensorData);
        if (minRow !== undefined) {
            field.min.maximize(new Coordinate(minRow, minRow));
        }
        if (maxRow !== undefined) {
            field.max.minimize(new Coordinate(maxRow, maxRow));
        }
        if (field.min.horizontalDistanceTo(field.max) > 1000) {
            console.log('WARNING: Field too large to draw!');
        } else {
            let prefixLength = Math.max(`${field.min.y}`.length, `${field.max.y}`.length);
            for (let y = field.min.y; y <= field.max.y; ++y) {
                process.stdout.write(`${y}`.padStart(prefixLength, ' ') + ' ');
                let coveredRanges = calculateMinAndMaxHorizontalPositionsInRow(sensorData, y).reduce().ranges.sort((a, b) => a.left - b.left);
                let posX = field.min.x;
                coveredRanges.forEach(r => {
                    if (posX <= field.max.x) {
                        let uncovered = (r.left < posX ? posX : r.left > field.max.x ? field.max.x : r.left) - posX;
                        process.stdout.write(`${'.'.repeat(uncovered)}`);
                        posX += uncovered;
                        let covered = (r.right > field.max.x ? field.max.x : r.right < posX ? posX - 1: r.right) - posX + 1;
                        process.stdout.write(`${'#'.repeat(covered)}`);
                        posX += covered;
                    }
                });
                if (posX <= field.max.x) {
                    process.stdout.write('.'.repeat(field.max.x - posX + 1));
                }
                process.stdout.write('\n');
            }
        }
        console.log();
    }
}

const inputData = getInputDataLines();
const sensorData = createSensorData(inputData);

const rowToMeasure = 2000000;
let coveredRanges = calculateMinAndMaxHorizontalPositionsInRow(sensorData, rowToMeasure).reduce();
let coveredPositions = coveredRanges.ranges.reduce<number>((c, r) => c += Math.abs(r.right - r.left), 0);
console.log(`There are ${coveredPositions} covered positions in row ${rowToMeasure}.`);
drawField(sensorData);

const minRow = 0;
const maxRow = 4000000;
let distressBeaconPos: Coordinate | undefined;
for (let row = minRow; row <= maxRow; ++row) {
    let ranges = calculateMinAndMaxHorizontalPositionsInRow(sensorData, row).reduce();
    let distressRanges = ranges.removeFrom(new Range(minRow, maxRow)).filter(dr => dr.left == dr.right);
    if (distressRanges.length && distressRanges[0].left == distressRanges[0].right) {
        distressBeaconPos = new Coordinate(distressRanges[0].left, row);
        break;
    }
}
if (distressBeaconPos) {
    console.log(`The distress beacon is at Coordinate ${distressBeaconPos.toString()} with tuning frequency ${distressBeaconPos.x * 4000000 + distressBeaconPos.y}.`);
}
drawField(sensorData, minRow, maxRow);