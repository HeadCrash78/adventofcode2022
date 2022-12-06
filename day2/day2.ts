import { getInputDataLines } from '../common/helpers';

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
const resultMatrixPart2: { [key: string]: { [key: string]: number } } = {
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

const inputData = getInputDataLines();
let totalScore = 0;
let totalScorePart2 = 0;
inputData.forEach(l => {
    let tokens = l.split(' ');
    totalScore += choiceScore[tokens[1]] + roundScore[resultMatrix[tokens[0]][tokens[1]]];
    totalScorePart2 += resultMatrixPart2[tokens[0]][tokens[1]];
});
console.log(`The total score in part 1 would be ${totalScore}.`);
console.log(`The total score in part 2 would be ${totalScorePart2}.`);