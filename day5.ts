import { getInputData } from "./helpers";

function buildStacks(stackInfo: string[]): string[][] {
    const noOfStacks = stackInfo.pop()!.trim().split(/\s+/).length;
    let stacks: string[][] = new Array(noOfStacks).fill(0).map(e => []);

    let stackElements: string | undefined;
    while (stackElements = stackInfo.pop()) {
        let stackIndex = 0;
        while (stackElements.length > stackIndex * 4) {
            let element = stackElements[stackIndex * 4 + 1];
            if (element != ' ') {
                stacks[stackIndex].push(element);
            }
            ++stackIndex;
        }
    }

    return stacks;
}

function moveEach(stacks: string[][], count: number, from: number, to: number) {
    for (let i = 0; i < count; ++i) {
        stacks[to].push(stacks[from].pop()!);
    }
}

function moveAll(stacks: string[][], count: number, from: number, to: number) {
    stacks[to].push(...stacks[from].splice(stacks[from].length - count, count));
}

const moveRegex = /^move (?<count>\d+) from (?<from>\d) to (?<to>\d)$/;
let stackInfo: string[] = [];
let stacks: string[][] = [];
let stacks2: string[][] = [];
let match: RegExpMatchArray | null;
const inputData = getInputData();
inputData.forEach(line => {
    if (line.length == 0) {
        stacks = buildStacks(stackInfo);
        stacks2 = JSON.parse(JSON.stringify(stacks));
    }
    if (!(match = line.match(moveRegex))) {
        stackInfo.push(line)
    } else {
        moveEach(stacks, Number(match!.groups!.count), Number(match!.groups!.from) - 1, Number(match!.groups!.to) - 1);
        moveAll(stacks2, Number(match!.groups!.count), Number(match!.groups!.from) - 1, Number(match!.groups!.to) - 1);
    }
});
console.log(`The result when moving each crate is ${stacks.map(s => s[s.length - 1]).join('')}`);
console.log(`The result when moving all crates at once is ${stacks2.map(s => s[s.length - 1]).join('')}`);