import { getInputDataLines } from '../common/helpers';

function getItemPrio(item: string): number {
    let charCode = item.charCodeAt(0);
    return charCode >= 97 ? charCode - 96 : charCode - 38;
}

const inputData = getInputDataLines();
let sumOfPrios = 0;
let sumOfBadgePrios = 0;
let group: string[] = [];
inputData.forEach(line => {
    group.push(line);
    let firstComp = line.substring(0,line.length / 2);
    let secondCompRegex = new RegExp(`[${line.substring(line.length / 2)}]`);
    sumOfPrios += getItemPrio(firstComp.match(secondCompRegex)![0]);
    if (group.length % 3 == 0) {
        sumOfBadgePrios += getItemPrio(group[0].match(new RegExp(`[${group[1]}]`, 'g'))!.join('').match(new RegExp(`[${group[2]}]`))![0]);
        group = [];
    }
});
console.log(`The sum of the item priorities is ${sumOfPrios}.`);
console.log(`The sum of the badge priorities is ${sumOfBadgePrios}.`);