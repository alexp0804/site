
var canvasSize = 700;
var cellSize = 20;
var numCells = canvasSize / cellSize;
var cells = [];

// Disable scroll with keys
window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

var snake = [];
var snakeDirection = [];
var sLength = 1;
var nextX = 0, nextY = 0;

var food = false;
var game = true;

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.snake = false;
        this.food = false;
    }

    drawCell() {
        strokeWeight(0);

        if (this.snake) {
            fill('darkgreen');
        }
        else if (this.food) {
            fill(color('#263859'));
        }

        else {
            strokeWeight(0.1);
            stroke(255);
            fill(color('#252525'));
        }

        rect(this.x * cellSize, this.y * cellSize, cellSize, cellSize, 4);
    }
}

// Assumes arrays are equal length.
function arraysMatch(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }

    return true;
}

function keyPressed() {
    if (keyCode == UP_ARROW || keyCode == 75 && !arraysMatch(snakeDirection, [0, 1])) {
        snakeDirection = [0, -1];
    }
    if (keyCode == LEFT_ARROW || keyCode == 72 && !arraysMatch(snakeDirection, [1, 0])) {
        snakeDirection = [-1, 0];
    }
    if (keyCode == RIGHT_ARROW || keyCode == 76 && !arraysMatch(snakeDirection, [-1, 0])) {
        snakeDirection = [1, 0];
    }
    if (keyCode == DOWN_ARROW || keyCode == 74 && !arraysMatch(snakeDirection, [0, -1])) {
        snakeDirection = [0, 1];
    }
}

function reset() {
    snake = [];
    sLength = 1;
    food = false;
    game = true;

    for (let i = 0; i < numCells; i++) {
        for (let j = 0; j < numCells; j++) {
            cells[i][j].snake = false;
            cells[i][j].food = false;
            cells[i][j].drawCell();
        }
    }

    snake = [cells[1][1]];
    cells[1][1].snake = true;
    snakeDirection = [0, 1];

    loop();
}

function endGame() {
    game = false;
    background(color(0, 0, 0, 180));
    noLoop();
}

// Find coordinates of the next cell based off the current location of the snake head and the direction of the snake.
function nextCell() {
    nextX = snake[snake.length - 1].x + snakeDirection[0];
    nextY = snake[snake.length - 1].y + snakeDirection[1];
}

// Checks that the next cell is a valid move (not a snake, not out of bounds).
function checkValidity() {
    if (!(nextX >= 0 && nextX < numCells && nextY >= 0 && nextY < numCells)) {
        endGame();
    }
}

// Moves the head of the snake to the next cell based off nextCell().
function moveSnake() {
    let newCell = cells[nextX][nextY];

    if (newCell.food) {
        sLength += 2;
        newCell.food = false;
        newCell.drawCell();
        food = false;
    }

    if (newCell.snake) {
        endGame();
        return;
    }

    snake.push(newCell);
    newCell.snake = true;
    newCell.drawCell();
}

function cutSnake() {
    snake[0].snake = false;
    snake[0].drawCell();
    snake.shift();
}

function spawnFood() {
    let foodX = Math.floor(random(0, numCells)), foodY = Math.floor(random(0, numCells));

    while (cells[foodX][foodY].snake) {
        foodX = Math.floor(random(0, numCells));
        foodY = Math.floor(random(0, numCells));
    }

    cells[foodX][foodY].food = true;
    cells[foodX][foodY].drawCell();

    food = true;
}

function setup() {
    var canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent("displayCanvas");

    background(color('#131313'))

    for (let i = 0; i < numCells; i++) {
        cells[i] = [];
        for (let j = 0; j < numCells; j++) {
            cells[i].push(new Cell(i, j));
            cells[i][j].drawCell();
        }
    }

    let resetButton = createButton('RESET');
    resetButton.mousePressed(reset);  
    resetButton.parent("sheet");


    snake = [cells[1][1]];
    cells[1][1].snake = true;
    snakeDirection = [0, 1];

    frameRate(16);
}

function draw() {
    nextCell();
    checkValidity();

    if (game) {
        moveSnake();

        if (!food) {
            spawnFood();
        }

        if (snake.length > sLength) {
            cutSnake();
        }
    }
}
