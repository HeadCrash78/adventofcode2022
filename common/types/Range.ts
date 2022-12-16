export class Range {
    left: number;
    right: number;

    constructor(left: string | number, right: string | number) {
        this.left = Number(left);
        this.right = Number(right);
    }

    contains(r: Range): boolean {
        return this.left <= r.left && r.right <= this.right;
    }

    containsValue(value: number): boolean {
        return this.left <= value && value <= this.right;
    }

    overlaps(r: Range): boolean {
        return Math.max(this.left, r.left) <= Math.min(this.right, r.right);
    }

    merge(r: Range): boolean {
        if (!this.overlaps(r)) {
            return false;
        }
        this.left = Math.min(this.left, r.left);
        this.right = Math.max(this.right, r.right);
        return true;
    }

    exclude(r: Range): Range[] | undefined {
        if (r.contains(this)) {
            return undefined;
        }
        if (this.contains(r)) {
            let result: Range[] = []
            if (this.left < r.left) {
                result.push(new Range(this.left, r.left - 1));
            }
            if (this.right > r.right) {
                result.push(new Range(r.right + 1, this.right))
            }
            return result;
        }
        if (this.overlaps(r)) {
            this.left = r.left < this.left ? r.right + 1 : this.left;
            this.right = r.right > this.right ? r.left - 1 : this.right;
        }
        return [ this ];
    }
}

export class RangeSet {
    public ranges: Range[] = [];

    add(range: Range): RangeSet {
        for (let r of this.ranges) {
            if (r.contains(range)) {
                return this;
            }
            if (r.merge(range)) {
                return this;
            }
        };
        this.ranges.push(range);
        return this;
    }

    reduce(): RangeSet {
        for (let i = this.ranges.length - 1; i > 0; --i) {
            let r1 = this.ranges[i - 1];
            let r2 = this.ranges[i];
            if (r1.contains(r2) || r1.merge(r2)) {
                this.ranges.splice(i, 1);
            }
        }
        return this;
    }

    removeFrom(range: Range): Range[] {
        let result = [ range ];
        this.ranges.forEach(r => {
            let intermediateResult: Range[] = [];
            result.forEach(rr => {
                let newRanges = rr!.exclude(r);
                if (newRanges) {
                    intermediateResult.push(...newRanges);
                }
            });
            result = intermediateResult;
        });
        return result;
    }
}