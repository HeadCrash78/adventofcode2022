import { getInputDataAsString } from '../common';

const inputData = getInputDataAsString();
let elves: {key: number, calories: number}[] = [];
inputData.split('\n\n').map((val, idx) => {
    elves.push({ key: idx + 1,
        calories: val.split('\n').reduce<number>((total, val) => total + Number(val), 0) });
})

let topThreeElves = elves.sort((a,b) => b.calories - a.calories).slice(0,3);
let totalTopThreeCalories = 0;
topThreeElves.forEach(e => { totalTopThreeCalories += e.calories });
let totalCalories = elves.map(e => e.calories).reduce((t, c) => t+c);

console.log(`There are ${elves.length} elves carrying ${totalCalories} total calories.`);
console.log(`Elve no. ${topThreeElves[0].key} with ${topThreeElves[0].calories} carries the most.`);
console.log(`Elves no. ${topThreeElves.map(e => e.key).join(', ')} with ${totalTopThreeCalories} carry the most.`);
