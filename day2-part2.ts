import { getInputData } from './helpers';

const resultMatrix: { [key: string]: { [key: string]: number } } = {
    'A': {
        'X': 3,
        'Y': 4,
        'Z': 8
    },
    'B': {
        'X': 1,
        'Y': 5,
        'Z': 9
    },
    'C': {
        'X': 2,
        'Y': 6,
        'Z': 7
    }
}

const inputDatat = getInputData();
let totalScore = 0;
inputDatat.forEach(l => {
    let tokens = l.split(' ');
    totalScore += resultMatrix[tokens[0]][tokens[1]];
});
console.log(`The total score would be ${totalScore}`);