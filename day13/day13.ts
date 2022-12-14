import { getInputDataAsString, isVerbose } from '../common/helpers';

function getDiff(left: any, right: any): number {
    let p1 = left;
    let p2 = right;
    let index = 0;
    let diff = 0;
    for (index = 0; !diff && index < Math.min(p1.length, p2.length); ++index) {
        if (typeof p1[index] !== typeof p2[index]) {
            if (typeof p1[index] === 'object') {
                p2[index] = [p2[index]];
            } else {
                p1[index] = [p1[index]];
            }
        }
        if (typeof p1[index] === 'object') {
            diff = getDiff(p1[index], p2[index]);
        } else {
            diff = p1[index] - p2[index];
        }
    }
    return diff ? diff : p1.length - p2.length;
}

function isOrderedCorrectly(left: any, right: any): boolean {
    let diff = getDiff(left, right);
    return diff < 0 ? true : false;
}

function outputOrderedPackets(packets: any[][]) {
    if (isVerbose()) {
        console.log();
        packets.forEach(p => console.log(JSON.stringify(p)));
        console.log();
    }
}

const inputData = getInputDataAsString();
const pairs: any[][] = [];
inputData.split('\n\n').forEach(pair => {
    pairs.push(pair.split('\n').map(list => eval(list)));
});

let indexSum = 0;
pairs.forEach((p, i) => {
    if (isOrderedCorrectly(p[0], p[1])) {
        indexSum += i + 1;
    }
});
console.log(`The sum of indices of correctly orderd packets is ${indexSum}.`)

let allPackets: any[][] = []
inputData.split('\n').forEach(line => {
    if (line.length) {
        allPackets.push(eval(line));
    }
});
let dividers = [[[2]], [[6]]];
allPackets.push(...dividers);
allPackets.sort(getDiff);
outputOrderedPackets(allPackets);
let dividerIndex1 = allPackets.indexOf(dividers[0]) + 1;
let dividerIndex2 = allPackets.indexOf(dividers[1]) + 1;
console.log(`The decoder key is ${(dividerIndex1 * dividerIndex2)}.`)