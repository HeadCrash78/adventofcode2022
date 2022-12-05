import { getInputData } from './helpers';

// const inputData = fs.readFileSync('day1-input.txt', { encoding: 'utf-8' });
const inputData = getInputData();
let elves = 0;
let elveWithMaxCalories = 0;
let totalCalories = 0;
let maxCalories = 0;
if (inputData.length > 0) {
    ++elves;
    let calories = 0;
    inputData.forEach((l: string) => {
        if (l.length == 0) {
            if (calories > maxCalories) {
                maxCalories = calories;
                elveWithMaxCalories = elves;
            }
            ++elves;
            calories = 0;
        } else {
            calories += Number(l);
            totalCalories += Number(l);
        }
    })
}
console.log(`There are ${elves} carrying ${totalCalories} total calories.`);
console.log(`Elve no. ${elveWithMaxCalories} with ${maxCalories} carries the most.`);