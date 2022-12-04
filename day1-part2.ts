import * as fs from 'fs';

async function run() {
    const inputData = fs.readFileSync('day1-input.txt', { encoding: 'utf-8' });
    let elves: {key: number, calories: number}[] = [];
    let elveIndex = 1;
    let totalCalories = 0;
    if (inputData.length > 0) {
        let calories = 0;
        inputData.split('\n').forEach((l: string) => {
            if (l.length == 0) {
                elves.push({key: elveIndex++, calories: calories});
                calories = 0;
            } else {
                calories += Number(l);
                totalCalories += Number(l);
            }
        });
    }
    let topThreeElves = elves.sort((a,b) => b.calories - a.calories).slice(0,3);
    let totalTopThreeCalories = 0;
    topThreeElves.forEach(e => { totalTopThreeCalories += e.calories });
    console.log(`There are ${elves.length} carrying ${totalCalories} total calories.`);
    console.log(`Elves no. ${topThreeElves.map(e => e.key).join(', ')} with ${totalTopThreeCalories} carry the most.`)
}

run();