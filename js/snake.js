
var canvas_size = 800;
var cell_size = 20;
var num_cells = canvas_size / cell_size;
var cells = [];

// Disable scroll with keys
window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

var snake = [];
var snake_direction = [];
var s_length = 1;
var next_x = 0, next_y = 0;

var food = false;
var game = true;

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.snake = false;
        this.food = false;
    }

    draw_cell() {
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

        rect(this.x * cell_size, this.y * cell_size, cell_size, cell_size, 4);
    }
}

// Assumes arrays are equal length.
function arrays_match(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }

    return true;
}

function keyPressed() {
    if (keyCode == UP_ARROW || keyCode == 75 && !arrays_match(snake_direction, [0, 1])) {
        snake_direction = [0, -1];
    }
    if (keyCode == LEFT_ARROW || keyCode == 72 && !arrays_match(snake_direction, [1, 0])) {
        snake_direction = [-1, 0];
    }
    if (keyCode == RIGHT_ARROW || keyCode == 76 && !arrays_match(snake_direction, [-1, 0])) {
        snake_direction = [1, 0];
    }
    if (keyCode == DOWN_ARROW || keyCode == 74 && !arrays_match(snake_direction, [0, -1])) {
        snake_direction = [0, 1];
    }
}

function reset() {
    snake = [];
    s_length = 1;
    food = false;
    game = true;

    for (let i = 0; i < num_cells; i++) {
        for (let j = 0; j < num_cells; j++) {
            cells[i][j].snake = false;
            cells[i][j].food = false;
            cells[i][j].draw_cell();
        }
    }

    snake = [cells[1][1]];
    cells[1][1].snake = true;
    snake_direction = [0, 1];

    loop();
}

function end_game() {
    game = false;
    background(color(0, 0, 0, 180));
    noLoop();
}

// Find coordinates of the next cell based off the current location of the snake head and the direction of the snake.
function next_cell() {
    next_x = snake[snake.length - 1].x + snake_direction[0];
    next_y = snake[snake.length - 1].y + snake_direction[1];
}

// Checks that the next cell is a valid move (not a snake, not out of bounds).
function check_validity() {
    if (!(next_x >= 0 && next_x < num_cells && next_y >= 0 && next_y < num_cells)) {
        end_game();
    }
}

// Moves the head of the snake to the next cell based off next_cell().
function move_snake() {
    let new_cell = cells[next_x][next_y];

    if (new_cell.food) {
        s_length += 2;
        new_cell.food = false;
        new_cell.draw_cell();
        food = false;
    }

    if (new_cell.snake) {
        end_game();
        return;
    }

    snake.push(new_cell);
    new_cell.snake = true;
    new_cell.draw_cell();
}

function cut_snake() {
    snake[0].snake = false;
    snake[0].draw_cell();
    snake.shift();
}

function spawn_food() {
    let food_x = Math.floor(random(0, num_cells)), food_y = Math.floor(random(0, num_cells));

    while (cells[food_x][food_y].snake) {
        food_x = Math.floor(random(0, num_cells));
        food_y = Math.floor(random(0, num_cells));
    }

    cells[food_x][food_y].food = true;
    cells[food_x][food_y].draw_cell();

    food = true;
}

function setup() {
    var canvas = createCanvas(canvas_size, canvas_size);
    canvas.parent("displayCanvas");

    background(color('#131313'))

    for (let i = 0; i < num_cells; i++) {
        cells[i] = [];
        for (let j = 0; j < num_cells; j++) {
            cells[i].push(new Cell(i, j));
            cells[i][j].draw_cell();
        }
    }

    let reset_button = createButton('RESET');
    reset_button.mousePressed(reset);

    snake = [cells[1][1]];
    cells[1][1].snake = true;
    snake_direction = [0, 1];

    frameRate(16);
}

function draw() {
    next_cell();
    check_validity();

    if (game) {
        move_snake();

        if (!food) {
            spawn_food();
        }

        if (snake.length > s_length) {
            cut_snake();
        }
    }
}
