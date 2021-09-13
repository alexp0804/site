
var canvasSize = 700;
var numNodes = 50;
var nodeSize = canvasSize / numNodes;

var nodes = [];

var prevWall;

var startNode;
var startPlaced = false;
var endNode;
var endPlaced = false;;

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        // Used in pathfinding algorithm
        this.fScore = 0;
        this.gScore = Infinity;

        // Used for drawing purposes.
        this.wall = false;
        this.visited = false;
        this.previous = null;
    }

    drawNode(color) {
        fill(color);
        rect(this.x * nodeSize, this.y * nodeSize, nodeSize);
    }
}

// Using custom distance function instead of dist() to make comparisons easier.
function distance(nodeA, nodeB) {
    return Math.floor(1000 * Math.sqrt((nodeB.x - nodeA.x) ** 2 + (nodeB.y - nodeA.y) ** 2));
}

// Tests if a given x, y coordinate is in bounds of the global node grid.
function inBounds(x, y) {
    return (x >= 0 && x < numNodes) && (y >= 0 && y < numNodes);
}

// Used to create delay in asynchronous functions.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Returns a list of surrounding nodes (excluding diagonal neighbors), given a node.
function findNeighbors(node) {
    let x = node.x, y = node.y, neighbors = [];

    // Add up/down, left/right neighbors.
    for (let i = -1; i <= 1; i += 2) {
        if (inBounds(x, y + i) && !nodes[x][y + i].visited && !nodes[x][y + i].wall) {
            neighbors.push(nodes[x][y + i]);
        }
        if (inBounds(x + i, y) && !nodes[x + i][y].visited && !nodes[x + i][y].wall) {
            neighbors.push(nodes[x + i][y]);
        }
    }

    return neighbors;
}

async function aStar(startNode, endNode) {
    let openSet = [startNode];
    startNode.gScore = 0;
    startNode.fScore = distance(startNode, endNode);

    while (openSet.length > 0) {
        openSet.sort((a, b) => (a.fScore - b.fScore));

        let current = openSet[0];
        openSet.shift();

        let neighbors = findNeighbors(current);

        if (current == endNode) {
            return;
        }

        for (let i = 0; i < neighbors.length; i++) {
            let testGScore = current.gScore + distance(current, neighbors[i]);

            if (testGScore < neighbors[i].gScore) {
                let n = neighbors[i];

                await sleep(0.5);
                n.drawNode(color('darkgrey'));

                n.previous = current;
                n.gScore = testGScore;
                n.fScore = n.gScore + distance(n, endNode);

                if (!openSet.includes(n)) {
                    openSet.push(n);
                }
            }
        }
    }
}

// Places the start node. Returns if placement successful.
function placeStart() {
    let x = Math.floor(mouseX / nodeSize), y = Math.floor(mouseY / nodeSize);

    if (inBounds(x, y)) {
        startNode = nodes[x][y];
        return true;
    }

    return false;
}

// Places the end node. Returns if placement successful.
function placeEnd() {
    let x = Math.floor(mouseX / nodeSize), y = Math.floor(mouseY / nodeSize);

    // Only place the end node if it's not in the same location as the start node.
    if (inBounds(x, y) && nodes[x][y] != startNode) {
        endNode = nodes[x][y];
        return true;
    }

    return false;
}

// Places wall node on mouse location.
function placeWall() {
    let x = Math.floor(mouseX / nodeSize), y = Math.floor(mouseY / nodeSize);

    // Only place wall if its within bounds, and not a start or end node. 
    // Also prevents from changing the wall that was just changed, to avoid flickering.
    if (inBounds(x, y) && nodes[x][y] != prevWall && nodes[x][y] != startNode && nodes[x][y] != endNode) {
        nodes[x][y].wall = true;
        prevWall = nodes[x][y];
    }
}

// Calls A* once both start and end nodes are placed.
function start() {
    if (startPlaced && endPlaced) {
        aStar(startNode, endNode);
    }
}

// Resets all nodes and walls.
function reset() {

    background(color('#999999'));

    for (let i = 0; i < numNodes; i++) {
        for (let j = 0; j < numNodes; j++) {
            nodes[i][j].fScore = 0
            nodes[i][j].gScore = Infinity;
            nodes[i][j].wall = false;
            nodes[i][j].visited = false;
            nodes[i][j].previous = null;
            nodes[i][j].drawNode(color('#BBBBBB'));
        }
    }

    startNode = null;
    startPlaced = false
    endNode = null;
    endPlaced = false;


}

function setup() {
    var canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent("displayCanvas");

    var startButton = createButton("Start");
    startButton.mousePressed(start);
    startButton.parent("sheet");

    var resetButton = createButton("Reset");
    resetButton.mousePressed(reset);
    resetButton.parent("sheet");

    strokeWeight(0.05);

    for (let i = 0; i < numNodes; i++) {
        nodes.push([]);

        for (let j = 0; j < numNodes; j++) {
            nodes[i][j] = new Node(i, j);
            nodes[i][j].drawNode(color('#999999'));
        }
    }
}

function draw() {
    // Logic for node/wall placement.
    if (!startPlaced && mouseIsPressed) {
        startPlaced = placeStart();;
    }
    else if (startPlaced && !endPlaced && mouseIsPressed) {
        endPlaced = placeEnd();;
    }
    else if (startPlaced && endPlaced && mouseIsPressed) {
        placeWall();
    }

    // Test if the end node has a path linked behind it. If it does, the algorithm has finished, so draw the path.
    let p = endNode;
    while (p && p.previous) {
        p = p.previous;
        p.drawNode(color('grey'));
    }

    // Draw all nodes.
    for (let i = 0; i < numNodes; i++) {
        for (let j = 0; j < numNodes; j++) {
            let curr = nodes[i][j];
            if (curr == startNode || curr == endNode) {
                curr.drawNode(color('#263859'));
            }
            if (curr.wall) {
                curr.drawNode(color('black'));
            }
        }
    }
}