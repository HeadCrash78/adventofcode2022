import { getInputDataLines } from '../common';

function findVisibleTrees(trees: number[][]): number[][] {
    let visibleTrees: number[][] = new Array(trees.length).fill(0).map(_ => new Array(trees[0].length).fill(0))
    let biggestFromTop = new Array<number>(trees[0].length).fill(0).map((_, idx) => trees[0][idx]);
    let biggestFromBottom = new Array<number>(trees[0].length).fill(0).map((_, idx) => trees[trees.length - 1][idx]);
    let biggestFromLeft = new Array<number>(trees.length).fill(0).map((_,idx) => trees[idx][0]);
    let biggestFromRight = new Array<number>(trees.length).fill(0).map((_,idx) => trees[idx][trees[idx].length - 1]);

    let top = 0;
    let bottom = trees.length - 1;

    while (++top < trees.length - 2 && 0 < --bottom) {
        let left = 0;
        let right = trees[0].length - 1;
        while (++left < trees[0].length - 2 && 0 < --right) {
            if (!visibleTrees[top][left]) {
                if (trees[top][left] > biggestFromLeft[top]) {
                    visibleTrees[top][left] = 1;
                    biggestFromLeft[top] = trees[top][left];
                }
                if (trees[top][left] > biggestFromTop[left]) {
                    visibleTrees[top][left] = 1;
                    biggestFromTop[left] = trees[top][left];
                }
            }
            if (!visibleTrees[top][right]) {
                if (trees[top][right] > biggestFromRight[top]) {
                    visibleTrees[top][right] = 1;
                    biggestFromRight[top] = trees[top][right];
                }
                if (trees[top][right] > biggestFromTop[right]) {
                    visibleTrees[top][right] = 1;
                    biggestFromTop[right] = trees[top][right];
                }
            }
            if (!visibleTrees[bottom][left]) {
                if (trees[bottom][left] > biggestFromLeft[bottom]) {
                    visibleTrees[bottom][left] = 1;
                    biggestFromLeft[bottom] = trees[bottom][left];
                }
                if (trees[bottom][left] > biggestFromBottom[left]) {
                    visibleTrees[bottom][left] = 1;
                    biggestFromBottom[left] = trees[bottom][left];
                }
            }
            if (!visibleTrees[bottom][right]) {
                if (trees[bottom][right] > biggestFromRight[bottom]) {
                    visibleTrees[bottom][right] = 1;
                    biggestFromRight[bottom] = trees[bottom][right];
                }
                if (trees[bottom][right] > biggestFromBottom[right]) {
                    visibleTrees[bottom][right] = 1;
                    biggestFromBottom[right] = trees[bottom][right];
                }
            }
        }
    }

    return visibleTrees;
}

function getMaxScenicScore(trees: number[][]): number {
    let dl: number, dt: number, dr: number, db: number;
    let maxScenicScore = 0;

    let y = 0;
    while (++y < trees.length - 1) {
        let x = 0;
        while (++x < trees[y].length - 1) {
            for (dl = x - 1; dl >= 0 && trees[y][dl] < trees[y][x]; --dl) {}
            for (dt = y - 1; dt >= 0 && trees[dt][x] < trees[y][x]; --dt) {}
            for (dr = x + 1; dr <= trees[y].length - 1 && trees[y][dr] < trees[y][x]; ++dr) {}
            for (db = y + 1; db <= trees.length - 1 && trees[db][x] < trees[y][x]; ++db) {}
            let scenicScore = (x - Math.max(0 , dl)) * (y - Math.max(0, dt)) * (Math.min(trees[y].length - 1, dr) - x) * (Math.min(trees.length - 1, db) - y);
            if (scenicScore > maxScenicScore) {
                maxScenicScore = scenicScore;
            }
        }
    }

    return maxScenicScore;
}

const inputData = getInputDataLines();
const trees: number[][] = new Array(inputData.length);

inputData.forEach((row, index) => trees[index] = Array.from(row, e => Number(e)))
let visibleTrees = findVisibleTrees(trees);

// All trees on the edge are visible
let visibleCount = (trees.length + trees[0].length) * 2 - 4;
visibleCount += visibleTrees.reduce<number>((c, line) => c += line.reduce((c, val) => c += val, 0), 0);

console.log(`There are ${visibleCount} visible trees.`)
console.log(`The maximum scenic score is ${getMaxScenicScore(trees)}.`)