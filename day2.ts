import * as fs from 'fs';

const choiceScore: { [key: string]: number } = {
    'X': 1,
    'Y': 2,
    'Z': 3
};
const roundScore: {  [key: string]: number } = {
    'win': 6,
    'draw': 3,
    'lose': 0
};
const resultMatrix: { [key: string]: { [key: string]: string } } = {
    'A': {
        'X': 'draw',
        'Y': 'win',
        'Z': 'lose'
    },
    'B': {
        'X': 'lose',
        'Y': 'draw',
        'Z': 'win'
    },
    'C': {
        'X': 'win',
        'Y': 'lose',
        'Z': 'draw'
    }
}

const inputDatat = fs.readFileSync('day2-input.txt', { encoding: 'utf-8' });
let totalScore = 0;
inputDatat.split('\n').forEach(l => {
    let tokens = l.split(' ');
    totalScore += choiceScore[tokens[1]] + roundScore[resultMatrix[tokens[0]][tokens[1]]];
});
console.log(`The total score would be ${totalScore}`);