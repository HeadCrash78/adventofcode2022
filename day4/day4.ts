import { getInputDataLines, RegExps } from '../common';
import { Range } from '../common/types';

const inputData = getInputDataLines();
let fullyContained = 0;
let overlap = 0;
inputData.forEach(line => {
    let values = line.match(RegExps.allPositiveNumbers)!;
    let elve1 = new Range(values[0], values[1]);
    let elve2 = new Range(values[2], values[3]);
    fullyContained += elve1.contains(elve2) || elve2.contains(elve1) ? 1 : 0;
    overlap += elve1.overlaps(elve2) ? 1 : 0;
});
console.log(`There are ${fullyContained} fully contained segments.`);
console.log(`There are ${overlap} overlapping segments.`);