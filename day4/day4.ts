import { getInputData } from '../common/helpers';

const inputData = getInputData();
let fullyContained = 0;
let overlap = 0;
inputData.forEach(line => {
    let tokens = line.split(/[-,]/);
    let e1Start = Number(tokens[0]);
    let e1End = Number(tokens[1]);
    let e2Start = Number(tokens[2]);
    let e2End = Number(tokens[3]);
    fullyContained += e1Start == e2Start || e1End == e2End
        || e1Start < e2Start && e2End < e1End
        || e2Start < e1Start && e1End < e2End ? 1 : 0;
    overlap += Math.max(e1Start, e2Start) <= Math.min(e1End, e2End) ? 1 : 0;
});
console.log(`There are ${fullyContained} fully contained segments`);
console.log(`There are ${overlap} overlapping segments overlap`);