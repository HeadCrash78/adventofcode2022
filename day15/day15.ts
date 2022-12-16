import { getInputDataLines, isVerbose } from '../common';
import { Coordinate } from '../common/types';

interface SensorData {
    sensorPos: Coordinate,
    beaconPos: Coordinate,
    distance: number,
    // Array with four positions in the order top, right, bottom, left
    coverageCorners: Coordinate[]
}

class Range {
    left: number;
    right: number;

    constructor(left: number, right: number) {
        this.left = left;
        this.right = right;
    }

    contains(r: Range): boolean {
        return this.left <= r.left && r.right <= this.right;
    }

    containsValue(value: number): boolean {
        return this.left <= value && value <= this.right;
    }

    overlaps(r: Range): boolean {
        return Math.max(this.left, r.left) <= Math.min(this.right, r.right);
    }

    merge(r: Range): boolean {
        if (!this.overlaps(r)) {
            return false;
        }
        this.left = Math.min(this.left, r.left);
        this.right = Math.max(this.right, r.right);
        return true;
    }

    exclude(r: Range): Range[] | undefined {
        if (r.contains(this)) {
            return undefined;
        }
        if (this.contains(r)) {
            let result: Range[] = []
            if (this.left < r.left) {
                result.push(new Range(this.left, r.left - 1));
            }
            if (this.right > r.right) {
                result.push(new Range(r.right + 1, this.right))
            }
            return result;
        }
        if (this.overlaps(r)) {
            this.left = r.left < this.left ? r.right + 1 : this.left;
            this.right = r.right > this.right ? r.left - 1 : this.right;
        }
        return [ this ];
    }
}

class RangeSet {
    public ranges: Range[] = [];

    add(range: Range) {
        for (let r of this.ranges) {
            if (r.contains(range)) {
                return;
            }
            if (r.merge(range)) {
                return;
            }
        };
        this.ranges.push(range);
    }

    reduce(): RangeSet {
        for (let i = this.ranges.length - 1; i > 0; --i) {
            let r1 = this.ranges[i - 1];
            let r2 = this.ranges[i];
            if (r1.contains(r2) || r1.merge(r2)) {
                this.ranges.splice(i, 1);
            }
        }
        return this;
    }

    removeFrom(range: Range): Range[] {
        let result = [ range ];
        this.ranges.forEach(r => {
            let intermediateResult: Range[] = [];
            result.forEach(rr => {
                let newRanges = rr!.exclude(r);
                if (newRanges) {
                    intermediateResult.push(...newRanges);
                }
            });
            result = intermediateResult;
        });
        return result;
    }
}

function createSensorData(inputData: string[]): SensorData[] {
    return inputData.map(line => {
        const coords = line.match(/-?\d+/g)!.map(v => Number(v));
        const distance = Math.abs(coords[0] - coords[2]) + Math.abs(coords[1] - coords[3]);
        return <SensorData>{
            sensorPos: { x: coords[0], y: coords[1] },
            beaconPos: { x: coords[2], y: coords[3] },
            distance: distance,
            coverageCorners: [
                { x: coords[0], y: coords[1] - distance },
                { x: coords[0] + distance, y: coords[1] },
                { x: coords[0], y: coords[1] + distance },
                { x: coords[0] - distance, y: coords[1] }
            ]
        };
    });
}

function getRowCoverage(row: number, sensorData: SensorData): number[] | undefined {
    if (sensorData.coverageCorners[0].y <= row && row <= sensorData.coverageCorners[2].y) {
        let coverageRange = (sensorData.distance - Math.abs(sensorData.sensorPos.y - row));
        return [sensorData.sensorPos.x - coverageRange, sensorData.sensorPos.x + coverageRange];
    }
    return undefined;
} 

function calculateMinAndMaxHorizontalPositionsInRow(sensorData: SensorData[], row: number, minPosition: number = Number.NEGATIVE_INFINITY, maxPosition: number = Number.POSITIVE_INFINITY): RangeSet {
    let ranges = new RangeSet();
    sensorData.forEach(s => {
        let minMax = getRowCoverage(row, s);
        if (minMax) {
            ranges.add(new Range(minMax[0], minMax[1]));
        }
    });
    return ranges;
}

function getFieldSize(sensorData: SensorData[]): { minX: number, minY: number, maxX: number, maxY: number } {
    let field = { minX: Number.POSITIVE_INFINITY, minY: Number.POSITIVE_INFINITY, maxX: Number.NEGATIVE_INFINITY, maxY: Number.NEGATIVE_INFINITY };
    sensorData.forEach(s => {
        field.minX = s.coverageCorners[3].x < field.minX ? s.coverageCorners[3].x : field.minX;
        field.minY = s.coverageCorners[0].y < field.minY ? s.coverageCorners[0].y : field.minY;
        field.maxX = s.coverageCorners[1].x > field.maxX ? s.coverageCorners[1].x : field.maxX;
        field.maxY = s.coverageCorners[2].y > field.maxY ? s.coverageCorners[2].y : field.maxY;
    });
    return field;
}

function drawField(sensorData: SensorData[], minRow?: number, maxRow?: number) {
    if (isVerbose()) {
        console.log();
        let field = getFieldSize(sensorData);
        field.minX = Math.max(typeof minRow !== 'undefined' ? minRow : Number.NEGATIVE_INFINITY, field.minX);
        field.minY = Math.max(typeof minRow !== 'undefined' ? minRow : Number.NEGATIVE_INFINITY, field.minY);
        field.maxX = Math.min(typeof maxRow !== 'undefined' ? maxRow : Number.POSITIVE_INFINITY, field.maxX);
        field.maxY = Math.min(typeof maxRow !== 'undefined' ? maxRow : Number.POSITIVE_INFINITY, field.maxY);
        if (field.maxX - field.minX > 1000) {
            console.log('WARNING: Field too large to draw!');
        } else {
            let prefixLength = Math.max(`${field.minY}`.length, `${field.maxX}`.length);
            for (let y = field.minY; y <= field.maxY; ++y) {
                process.stdout.write(`${y}`.padStart(prefixLength, ' ') + ' ');
                let coveredRanges = calculateMinAndMaxHorizontalPositionsInRow(sensorData, y).reduce().ranges.sort((a, b) => a.left - b.left);
                let line = '';
                let posX = field.minX;
                coveredRanges.forEach(r => {
                    if (posX <= field.maxX) {
                        let uncovered = (r.left < posX ? posX : r.left > field.maxX ? field.maxX : r.left) - posX;
                        line += `${'.'.repeat(uncovered)}`;
                        posX += uncovered;
                        let covered = (r.right > field.maxX ? field.maxX : r.right < posX ? posX - 1: r.right) - posX + 1;
                        line += `${'#'.repeat(covered)}`;
                        posX += covered;
                    }
                });
                if (posX <= field.maxX) {
                    process.stdout.write(`${line}${'.'.repeat(field.maxX - posX + 1)}`);
                } else {
                    process.stdout.write(line);
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