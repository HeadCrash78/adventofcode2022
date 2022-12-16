import { getInputDataLines, isVerbose } from '../common';
import { Coordinate, GraphNode, Grid } from '../common/types';

class Field extends Coordinate {
    value: string
    
    constructor(x: number, y: number, value: string) {
        super(x, y);
        this.value = value;
    }

    get height(): number {
        switch (this.value) {
            case 'S':
                return 1;
            case 'E':
                return 26;
            default:
                return this.value.charCodeAt(0) - 96;
        }
    }
}

function addNeighbors(nodes: Map<string, GraphNode<Field>>) {
    for (let node of nodes.values()) {
        let adjacentFields = node.value.getAdjacent();
        adjacentFields.forEach(f => {
            // Remember: we're traversing in reverse order. Thus, the comparison is flipped.
            if (nodes.has(f.toString()) && (node.value.height - nodes.get(f.toString())!.value.height <= 1)) {
                node.addNeighbor(nodes.get(f.toString())!);
            }
        });
    };
}

function buildNodes(inputData: string[]): Map<string, GraphNode<Field>> {
    let nodes: Map<string, GraphNode<Field>> = new Map<string, GraphNode<Field>>();
    inputData.forEach((line, y) => Array.from(line).map((c, x) => {
        let f = new Field(x, y, c);
        nodes.set(f.toString(), new GraphNode(f));
    }));
    addNeighbors(nodes);

    return nodes;
}

function getNodeWithShortestDistance(nodes: Map<string, GraphNode<Field>>): GraphNode<Field> {
    let shortestDistanceNode: GraphNode<Field> | undefined;

    for (let node of nodes.values()) {
        if (!shortestDistanceNode) {
            shortestDistanceNode = node;
        } else {
            shortestDistanceNode = node.distance < shortestDistanceNode.distance ? node : shortestDistanceNode;
        }
    }
    return shortestDistanceNode!;
}

function findNodesWithFieldValues(values: Set<string>, nodes: Map<string, GraphNode<Field>>): GraphNode<Field>[] {
    let matchingNodes: GraphNode<Field>[] = [];

    for (let node of nodes.values()) {
        if (values.has(node.value.value)) {
            matchingNodes.push(node);
        }
    }

    return matchingNodes;
}

function getAllPathsToNode(targetNode: GraphNode<Field>, allNodes: Map<string, GraphNode<Field>>): Map<string, GraphNode<Field>> {
    // Because we need all paths to all nodes with height 1, we traverse the nodes backwards,
    // so every node contains the distance to the end node
    allNodes.get(targetNode.value.toString())!.distance = 0;
    let parentNodes = new Map<string, GraphNode<Field>>();

    while (nodes.size) {
        let shortestDistanceNode = getNodeWithShortestDistance(nodes);
        for (let neighbor of shortestDistanceNode.neighbors) {
            if (shortestDistanceNode.distance + 1 < neighbor.distance) {
                neighbor.distance = shortestDistanceNode.distance + 1;
                parentNodes.set(neighbor.value.toString(), shortestDistanceNode);
            }
        }
        nodes.delete(shortestDistanceNode.value.toString());
    }
    
    return parentNodes;
}

function getDirectionCharacter(currentField: Field, nextField: Field): string {
    return nextField.x < currentField.x ? '<' :
        nextField.x > currentField.x ? '>' :
        nextField.y < currentField.y ? '∧' : '∨';
}

function drawField(startNode: GraphNode<Field>, parentNodes: Map<string, GraphNode<Field>>) {
    if (isVerbose()) {
        console.log();
        let fieldToDraw = new Grid(inputData.length, inputData[0].length, '.');
        let path: Field[] = []
        let node: GraphNode<Field> | undefined = startNode;
        while (node) {
            path.push(node.value);
            node = parentNodes.get(node.value.toString());
        }
        for (let i = 0; i <= path.length - 1; ++i) {
            let cur = path[i];
            let next: Field;
            if (i < path.length - 1) {
                next = path[i + 1];
            } else {
                next = path[i - 1];
            }
            fieldToDraw.mark(getDirectionCharacter(cur, next), cur);
        }
        fieldToDraw.printToConsole();
        console.log();
    }
}

const inputData = getInputDataLines();
let nodes = buildNodes(inputData);
let endNode = findNodesWithFieldValues(new Set('E'), nodes)[0];
let heightOneNodes = findNodesWithFieldValues(new Set(['S', 'a']), nodes);
let startNode = findNodesWithFieldValues(new Set('S'), nodes)[0];

let allPaths = getAllPathsToNode(endNode, nodes);
let shortestPath = allPaths.get(startNode.value.toString())!;
console.log(`The minimum distance from ${startNode.value.toString()} to ${endNode.value.toString()} is ${shortestPath.distance + 1} steps.`);
drawField(startNode, allPaths);

let shortestPathStartNode = startNode;
for (let node of heightOneNodes) {
    let path = allPaths.get(node.value.toString());
    if (path && path.distance < shortestPath.distance) {
        shortestPath = path;
        shortestPathStartNode = node;
    }
}
console.log(`The minimum distance from any position with height 1 to ${endNode.value.toString()} is ${shortestPath.distance + 1} steps.`);
drawField(shortestPathStartNode, allPaths);