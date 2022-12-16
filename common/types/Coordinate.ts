export class Coordinate {
    x: number;
    y: number;

    constructor(x: string | number, y: string | number) {
        this.x = Number(x);
        this.y = Number(y);
    }

    public clone(): Coordinate {
        return new Coordinate(this.x, this.y);
    }

    public getAdjacent(includeDiagonal: boolean = false): Coordinate[] {
        let adjacentCoords: Coordinate[] = [
            new Coordinate(this.x, this.y + 1),
            new Coordinate(this.x + 1, this.y),
            new Coordinate(this.x, this.y - 1),
            new Coordinate(this.x - 1, this.y)
        ];
        if (includeDiagonal) {
            adjacentCoords.push(
                new Coordinate(this.x + 1, this.y - 1),
                new Coordinate(this.x + 1, this.y + 1),
                new Coordinate(this.x - 1, this.y - 1),
                new Coordinate(this.x - 1, this.y + 1)
            )
        }
        return adjacentCoords;
    }

    public minimize(coord: Coordinate): Coordinate {
        if (coord.x < this.x) {
            this.x = coord.x;
        }
        if (coord.y < this.y) {
            this.y = coord.y;
        }
        return this;
    }

    public maximize(coord: Coordinate): Coordinate {
        if (coord.x > this.x) {
            this.x = coord.x;
        }
        if (coord.y > this.y) {
            this.y = coord.y;
        }
        return this;
    }

    public abs(): Coordinate {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }

    public moveDown(): Coordinate {
        ++this.y;
        return this;
    }

    public moveUp(): Coordinate {
        --this.y;
        return this;
    }

    public moveRight(): Coordinate {
        ++this.x;
        return this;
    }

    public moveLeft(): Coordinate {
        --this.x;
        return this;
    }

    public moveDownLeft(): Coordinate {
        this.moveDown().moveLeft();
        return this;
    }

    public moveDownRight(): Coordinate {
        this.moveDown().moveRight();
        return this;
    }

    public moveUpLeft(): Coordinate {
        this.moveUp().moveLeft();
        return this;
    }

    public moveUpRight(): Coordinate {
        this.moveUp().moveRight();
        return this;
    }

    public moveBy(coord: Coordinate, times: number = 1): Coordinate {
        this.x += coord.x * times;
        this.y += coord.y * times;
        return this;
    }

    private snapDistance(coord: Coordinate): Coordinate {
        let x: number = 0, y: number = 0;
        let dx = this.x - coord.x;
        let dy = this.y - coord.y;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            x = dx < 0 ? 1 : dx > 0 ? -1 : 0;
            y = dy < 0 ? 1 : dy > 0 ? -1 : 0;
        }
        return new Coordinate(x, y);
    }

    public snapTo(coord: Coordinate): Coordinate {
        this.moveBy(this.snapDistance(coord));
        return this;
    }

    public get [Symbol.toStringTag]() {
        return 'Coordinate';
    }

    public toString(): string {
        return `(${this.x},${this.y})`;
    }

    public equals(coord: Coordinate) {
        return this.x == coord.x && this.y == coord.y;
    }
}