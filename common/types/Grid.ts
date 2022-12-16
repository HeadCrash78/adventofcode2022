import { Coordinate } from './Coordinate';

export class Grid<T> {
    grid: (T | undefined)[][];

    constructor(height: number, width: number, initialValue?: T) {
        this.grid = new Array(height).fill(0).map(_ => new Array(width).fill(initialValue));
    }
    
    public get height(): number {
        return this.grid.length;
    }

    public get width(): number {
        return this.grid[0].length;
    }

    public get(xOrCoord: Coordinate | number, y?: number): T | undefined {
        if (xOrCoord instanceof Coordinate) {
            return this.grid[xOrCoord.y][xOrCoord.x];
        }
        if (y !== undefined) {
            return this.grid[y!][Number(xOrCoord)];
        }
        return undefined;
    }

    public clone(): Grid<T> {
        let newGrid = new Grid<T>(this.height, this.width);
        for (let row = 0; row < this.grid.length; ++row) {
            for (let col = 0; col < this.grid[row].length; ++col) {
                newGrid.grid[row][col] = this.grid[row][col];
            }
        }
        return newGrid;
    }

    public extendTop(rows: number = 1, value?: T): Grid<T> {
        let newRows = new Array(rows).fill(0).map(_ => new Array(this.width).fill(value));
        this.grid.splice(0, 0, ...newRows);
        return this;
    }

    public extendBottom(rows: number = 1, value?: T): Grid<T> {
        let newRows = new Array(rows).fill(0).map(_ => new Array(this.width).fill(value));
        this.grid.push(...newRows);
        return this;
    }

    public extendLeft(cols: number = 1, value?: T): Grid<T> {
        let newCols: T[] = new Array(cols).fill(value);
        this.grid.forEach(row => row.splice(0, 0, ...newCols))
        return this;
    }

    public extendRight(cols: number = 1, value?: T): Grid<T> {
        let newCols: T[] = new Array(cols).fill(value);
        this.grid.forEach(row => row.splice(row.length, 0, ...newCols))
        return this;
    }

    public mark(marker: T, xOrCoord: Coordinate | number, y?: number): Grid<T> {
        if (xOrCoord instanceof Coordinate) {
            this.grid[xOrCoord.y][xOrCoord.x] = marker;
        } else if (y !== undefined) {
            this.grid[y][Number(xOrCoord)] = marker;
        }
        return this;
    }

    public getMarkedPositionCount(marker: T): number {
        return this.grid.reduce<number>((c, row) => c += row.reduce<number>((c, val) => c += val == marker ? 1 : 0, 0), 0);
    }

    public [Symbol.toStringTag]() {
        return 'Grid';
    }

    public printToConsole(separator: string = '') {
        this.grid.forEach(row => console.log(row.join(separator)));
    }
}