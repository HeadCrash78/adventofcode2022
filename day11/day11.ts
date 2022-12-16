import { getInputDataAsString, RegExps } from '../common';

class Monkey {
    private items: number[];
    private operation: string;
    public testDivisor: number;
    public worryModDivisor = 0;
    private operationLinePrefixLength = '  Operation: '.length;
    private receivingMonkeyIndexes: number[] = [];
    private inspections = 0;

    constructor(monkeyData: string) {
        const data = monkeyData.split('\n');
        this.items = data[1].match(RegExps.allNumbers)!.map(i => Number(i));
        this.operation = data[2].substring(this.operationLinePrefixLength).replace(/(new|old)/g, 'item');
        this.testDivisor = Number(data[3].match(RegExps.allNumbers)![0]);
        this.receivingMonkeyIndexes.push(Number(data[4].match(RegExps.allNumbers)![0]));
        this.receivingMonkeyIndexes.push(Number(data[5].match(RegExps.allNumbers)![0]));
    }

    public get inspectionCount(): number {
        return this.inspections;
    }

    public play(otherMonkeys: Monkey[], decreaseWorry: boolean = true) {
        while (this.items.length) {
            let item = this.items.splice(0, 1)[0];
            ++this.inspections;
            eval(this.operation);
            if (decreaseWorry) {
                item = Math.floor(item / 3);
            } else {
                item = item % this.worryModDivisor;
            }
            if (item % this.testDivisor == 0) {
                otherMonkeys[this.receivingMonkeyIndexes[0]].catch(item);
            } else {
                otherMonkeys[this.receivingMonkeyIndexes[1]].catch(item);
            }
        }
    }

    public catch(item: number) {
        this.items.push(item);
    }
}

function play(rounds: number, decreaseWorry: boolean = true) {
    const monkeys: Monkey[] = monkeyData.map(d => new Monkey(d));
    let modDivisor = monkeys.reduce<number>((d, m) => d * m.testDivisor, 1);
    monkeys.forEach(m => m.worryModDivisor = modDivisor);

    for (let i = 0; i < rounds; ++i) {
        for (let monkey of monkeys) {
            monkey.play(monkeys, decreaseWorry);
        }
    }
    monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);
    console.log(`The monkey business is ${monkeys[0].inspectionCount * monkeys[1].inspectionCount}.`);
}

const monkeyData = getInputDataAsString().split('\n\n');
play(20);
play(10000, false);