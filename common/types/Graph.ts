export class GraphNode<T> {
    value: T;
    distance: number;
    neighbors: GraphNode<T>[] = [];
    pathWeights: number[] = [];

    constructor(value: T, distance: number = Number.POSITIVE_INFINITY) {
        this.value = value;
        this.distance = distance;
    }

    addNeighbor(node: GraphNode<T>, pathWeigth: number = 1): GraphNode<T> {
        this.neighbors.push(node);
        this.pathWeights.push(pathWeigth);
        return this;
    }
}