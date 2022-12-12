import { exit } from 'process';
import { getInputDataLines, isVerbose } from '../common/helpers';

class Field {
    x: number
    y: number
    value: string
    
    constructor(x: number, y: number, value: string) {
        this.x = x;
        this.y = y;
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

    toString(): string {
        return `${this.x},${this.y}`;
    }
}

interface GraphNode {
    field: Field,
    distance: number,
    neighbors: GraphNode[]
}

function buildNodes(inputData: string[]): Map<string, GraphNode> {
    let nodes: Map<string, GraphNode> = new Map<string, GraphNode>();
    inputData.forEach((line, y) => Array.from(line).map((c, x) => {
        let f = new Field(x, y, c);
        nodes.set(f.toString(), <GraphNode>{ field: f, distance: Number.MAX_VALUE, neighbors: [] });
    }));
    for (let node of nodes.values()) {
        node.neighbors = getNeighbors(node, nodes)
    };
   
    return nodes;
}

function getNeighbors(node: GraphNode, nodes: Map<string, GraphNode>): GraphNode[] {
    let adjacentPsitions: string[] = [
        `${node.field.x - 1},${node.field.y}`,
        `${node.field.x + 1},${node.field.y}`,
        `${node.field.x},${node.field.y - 1}`,
        `${node.field.x},${node.field.y + 1}`
    ];
    let neighbors: GraphNode[] = [];
    adjacentPsitions.forEach(p => {
        // Remember: we're traversing in reverse order. Thus, the comparison is flipped.
        if (nodes.has(p) && (node.field.height - nodes.get(p)!.field.height <= 1)) {
            neighbors.push(nodes.get(p)!)
        }
    });
    return neighbors;
}

function getNodeWithShortestDistance(nodes: Map<string, GraphNode>): GraphNode {
    let shortestDistanceNode: GraphNode | undefined;

    for (let node of nodes.values()) {
        if (!shortestDistanceNode) {
            shortestDistanceNode = node;
        } else {
            shortestDistanceNode = node.distance < shortestDistanceNode.distance ? node : shortestDistanceNode;
        }
    }
    return shortestDistanceNode!;
}

function findNodesWithFieldValues(values: string[], nodes: Map<string, GraphNode>): GraphNode[] {
    let matchingNodes: GraphNode[] = [];

    for (let node of nodes.values()) {
        if (values.indexOf(node.field.value) >= 0) {
            matchingNodes.push(node);
        }
    }

    return matchingNodes;
}

function getAllPathsToNode(targetNode: GraphNode, allNodes: Map<string, GraphNode>): Map<string, GraphNode> {
    // Because we need all paths to all nodes with height 1, we traverse the nodes backwards,
    // so every node contains the distance to the end node
    allNodes.get(targetNode.field.toString())!.distance = 0;
    let parentNodes = new Map<string, GraphNode>();

    while (nodes.size) {
        let shortestDistanceNode = getNodeWithShortestDistance(nodes);
        for (let neighbor of shortestDistanceNode.neighbors) {
            if (shortestDistanceNode.distance + 1 < neighbor.distance) {
                neighbor.distance = shortestDistanceNode.distance + 1;
                parentNodes.set(neighbor.field.toString(), shortestDistanceNode);
            }
        }
        nodes.delete(shortestDistanceNode.field.toString());
    }
    
    return parentNodes;
}

function getDirectionCharacter(currentField: Field, nextField: Field): string {
    return nextField.x < currentField.x ? '<' :
        nextField.x > currentField.x ? '>' :
        nextField.y < currentField.y ? '∧' : '∨';
}

function drawField(startNode: GraphNode, parentNodes: Map<string, GraphNode>) {
    if (isVerbose()) {
        console.log();
        let fieldToDraw = new Array(inputData.length).fill(0).map(_ => new Array(inputData[0].length).fill('.'));
        let path: Field[] = []
        let node: GraphNode | undefined = startNode;
        while (node) {
            path.push(node.field);
            node = parentNodes.get(node.field.toString());
        }
        for (let i = 0; i <= path.length - 1; ++i) {
            let cur = path[i];
            if (i < path.length - 1) {
                let next = path[i + 1];
                fieldToDraw[cur.y][cur.x] = getDirectionCharacter(cur, next);
            } else {
                let next = path[i - 1];
                fieldToDraw[cur.y][cur.x] = getDirectionCharacter(next, cur);
            }
        }
        fieldToDraw.forEach(line => console.log(line.join('')));
        console.log();
    }
}

const inputData = getInputDataLines();
let nodes = buildNodes(inputData);
let endNode = findNodesWithFieldValues(['E'], nodes)[0];
let heightOneNodes = findNodesWithFieldValues(['S', 'a'], nodes);
let startNode = findNodesWithFieldValues(['S'], nodes)[0];

let allPaths = getAllPathsToNode(endNode, nodes);
let shortestPath = allPaths.get(startNode.field.toString())!;
console.log(`The minimum distance from (${startNode.field.toString()}) to (${endNode.field.toString()}) is ${shortestPath.distance + 1} steps.`);
drawField(startNode, allPaths);

let shortestPathStartNode: GraphNode = startNode;
for (let node of heightOneNodes) {
    let path = allPaths.get(node.field.toString());
    if (path && path.distance < shortestPath.distance) {
        shortestPath = path;
        shortestPathStartNode = node;
    }
}
console.log(`The minimum distance from any position with height 1 to (${endNode.field.toString()}) is ${shortestPath.distance + 1} steps.`);
drawField(shortestPathStartNode, allPaths);