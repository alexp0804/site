
var canvas_size = 700;
var num_nodes = 50;
var node_size = canvas_size / num_nodes;

var nodes = [];

var previous_wall;

var start_node;
var start_placed = false;
var end_node;
var end_placed = false;;

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

    draw_node(color) {
        fill(color);
        rect(this.x * node_size, this.y * node_size, node_size);
    }
}

// Using custom distance function instead of dist() to make comparisons easier.
function distance(node_a, node_b) {
    return Math.floor(1000 * Math.sqrt((node_b.x - node_a.x) ** 2 + (node_b.y - node_a.y) ** 2));
}

// Tests if a given x, y coordinate is in bounds of the global node grid.
function in_bounds(x, y) {
    return (x >= 0 && x < num_nodes) && (y >= 0 && y < num_nodes);
}

// Used to create delay in asynchronous functions.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Returns a list of surrounding nodes (excluding diagonal neighbors), given a node.
function find_neighbors(node) {
    let x = node.x, y = node.y, neighbors = [];

    // Add up/down, left/right neighbors.
    for (let i = -1; i <= 1; i += 2) {
        if (in_bounds(x, y + i) && !nodes[x][y + i].visited && !nodes[x][y + i].wall) {
            neighbors.push(nodes[x][y + i]);
        }
        if (in_bounds(x + i, y) && !nodes[x + i][y].visited && !nodes[x + i][y].wall) {
            neighbors.push(nodes[x + i][y]);
        }
    }

    return neighbors;
}

async function a_star(start_node, end_node) {
    let open_set = [start_node];
    start_node.gScore = 0;
    start_node.fScore = distance(start_node, end_node);

    while (open_set.length > 0) {
        open_set.sort((a, b) => (a.fScore - b.fScore));

        let current = open_set[0];
        open_set.shift();

        let neighbors = find_neighbors(current);

        if (current == end_node) {
            return;
        }

        for (let i = 0; i < neighbors.length; i++) {
            let test_gScore = current.gScore + distance(current, neighbors[i]);

            if (test_gScore < neighbors[i].gScore) {
                let n = neighbors[i];

                await sleep(0.5);
                n.draw_node(color('darkgrey'));

                n.previous = current;
                n.gScore = test_gScore;
                n.fScore = n.gScore + distance(n, end_node);

                if (!open_set.includes(n)) {
                    open_set.push(n);
                }
            }
        }
    }
}

// Places the start node. Returns if placement successful.
function place_start() {
    let x = Math.floor(mouseX / node_size), y = Math.floor(mouseY / node_size);

    if (in_bounds(x, y)) {
        start_node = nodes[x][y];
        return true;
    }

    return false;
}

// Places the end node. Returns if placement successful.
function place_end() {
    let x = Math.floor(mouseX / node_size), y = Math.floor(mouseY / node_size);

    // Only place the end node if it's not in the same location as the start node.
    if (in_bounds(x, y) && nodes[x][y] != start_node) {
        end_node = nodes[x][y];
        return true;
    }

    return false;
}

// Places wall node on mouse location.
function place_wall() {
    let x = Math.floor(mouseX / node_size), y = Math.floor(mouseY / node_size);

    // Only place wall if its within bounds, and not a start or end node. 
    // Also prevents from changing the wall that was just changed, to avoid flickering.
    if (in_bounds(x, y) && nodes[x][y] != previous_wall && nodes[x][y] != start_node && nodes[x][y] != end_node) {
        nodes[x][y].wall = true;
        previous_wall = nodes[x][y];
    }
}

// Calls A* once both start and end nodes are placed.
function start() {
    if (start_placed && end_placed) {
        a_star(start_node, end_node);
    }
}

// Resets all nodes and walls.
function reset() {

    background(color('#999999'));

    for (let i = 0; i < num_nodes; i++) {
        for (let j = 0; j < num_nodes; j++) {
            nodes[i][j].fScore = 0
            nodes[i][j].gScore = Infinity;
            nodes[i][j].wall = false;
            nodes[i][j].visited = false;
            nodes[i][j].previous = null;
            nodes[i][j].draw_node(color('#BBBBBB'));
        }
    }

    start_node = null;
    start_placed = false
    end_node = null;
    end_placed = false;


}

function setup() {
    var canvas = createCanvas(canvas_size, canvas_size);
    canvas.parent("displayCanvas");

    var startButton = createButton("Start");
    startButton.mousePressed(start);
    startButton.parent("sheet");

    var resetButton = createButton("Reset");
    resetButton.mousePressed(reset);
    resetButton.parent("sheet");

    strokeWeight(0.05);

    for (let i = 0; i < num_nodes; i++) {
        nodes.push([]);

        for (let j = 0; j < num_nodes; j++) {
            nodes[i][j] = new Node(i, j);
            nodes[i][j].draw_node(color('#999999'));
        }
    }
}

function draw() {
    // Logic for node/wall placement.
    if (!start_placed && mouseIsPressed) {
        start_placed = place_start();;
    }
    else if (start_placed && !end_placed && mouseIsPressed) {
        end_placed = place_end();;
    }
    else if (start_placed && end_placed && mouseIsPressed) {
        place_wall();
    }

    // Test if the end node has a path linked behind it. If it does, the algorithm has finished, so draw the path.
    let p = end_node;
    while (p && p.previous) {
        p = p.previous;
        p.draw_node(color('grey'));
    }

    // Draw all nodes.
    for (let i = 0; i < num_nodes; i++) {
        for (let j = 0; j < num_nodes; j++) {
            let curr = nodes[i][j];
            if (curr == start_node || curr == end_node) {
                curr.draw_node(color('#263859'));
            }
            if (curr.wall) {
                curr.draw_node(color('black'));
            }
        }
    }
}