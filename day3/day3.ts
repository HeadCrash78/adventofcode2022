import { getInputData } from '../common/helpers';

const inputData = getInputData();
let sumOfPrios = 0;
let sumOfBadgePrios = 0;
let group: string[] = [];
inputData.forEach(line => {
    group.push(line);
    let firstComp = line.substring(0,line.length / 2);
    let secondCompRegex = new RegExp(`[${line.substring(line.length / 2)}]`);
    let itemInBothCompsPrio = firstComp.match(secondCompRegex)![0].charCodeAt(0);
    sumOfPrios += itemInBothCompsPrio >= 97 ? itemInBothCompsPrio - 96 : itemInBothCompsPrio - 38;
    if (group.length % 3 == 0) {
        let commonItemPrio = group[0].match(new RegExp(`[${group[1]}]`, 'g'))!.join('')
            .match(new RegExp(`[${group[2]}]`))![0].charCodeAt(0);
        sumOfBadgePrios += commonItemPrio >= 97 ? commonItemPrio - 96 : commonItemPrio - 38;
        group = [];
    }
});
console.log(`The sum of the items priorities is ${sumOfPrios}`);
console.log(`The sum of the badge priorities is ${sumOfBadgePrios}`);