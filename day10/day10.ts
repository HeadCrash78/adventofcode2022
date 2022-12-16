import { getInputDataLines } from '../common';
import { Coordinate, Grid } from '../common/types';

interface Instruction {
    f: (r: number, val?: number) => number,
    cycles: number
}

const ops: { [key: string]: Instruction } = {
    'noop': { f: r => r, cycles: 1 },
    'addx': { f: (r, v) => r + v!, cycles: 2 }
}

function checkSignalStrength() {
    if (cycles == initialMeasureCycle || (cycles - initialMeasureCycle) % measureCycleInterval == 0) {
        sumOfSignalStrenghts += register * cycles;
    }
}

function draw() {
    if (screenPosition.x >= register - 1 && screenPosition.x <= register + 1) {
        screen.mark('#', screenPosition);
    }
    if (++screenPosition.x == screenWidth) {
        ++screenPosition.y;
        screenPosition.x = 0;
    }
}

const inputData = getInputDataLines();
let cycles = 0;
let register = 1;
let initialMeasureCycle = 20;
let measureCycleInterval = 40;
let sumOfSignalStrenghts = 0;
let screenPosition: Coordinate = new Coordinate(0, 0);
const screenWidth = 40;
let screen = new Grid<string>(6, screenWidth, '.');

inputData.forEach(line => {
    let tokens = line.split(/\s+/);
    let op = ops[tokens[0]];
    for (let tick = 1; tick <= op.cycles; ++tick) {
        draw();
        ++cycles;
        checkSignalStrength();
        if (tick == op.cycles) {
            register = op.f(register, Number(tokens[1]));
        }
    }
});
checkSignalStrength();

console.log(`The sum of the signal strenghts is ${sumOfSignalStrenghts}.`)
screen.printToConsole();