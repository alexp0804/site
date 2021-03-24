
var board_length = 9;
var canvas_size = 800;
var square_size = canvas_size / board_length;
var solving = false;
var begin = false;

var board = [[5, 3, 4, 6, 7, 0, 9, 1, 0],
[0, 0, 2, 0, 9, 0, 0, 0, 0],
[0, 9, 0, 0, 4, 2, 0, 6, 0],
[8, 0, 0, 0, 6, 0, 0, 0, 3],
[4, 0, 0, 8, 0, 3, 0, 0, 1],
[7, 0, 0, 0, 2, 0, 0, 0, 6],
[0, 6, 0, 0, 0, 0, 2, 8, 0],
[0, 0, 0, 4, 1, 9, 0, 0, 5],
[0, 0, 0, 0, 8, 0, 0, 7, 9]];

function draw_square(x, y) {
    let value = board[y][x];

    // Clear square
    fill(255);
    rectMode(CORNER);
    rect(x * square_size, y * square_size, square_size);

    if (value == 0) {
        return;
    }

    // Draw number (if non-zero)
    fill(0);
    rectMode(CENTER);
    text(value.toString(), x * square_size + square_size / 2, y * square_size + square_size / 2 + 2);
}

function is_valid(x, y, key) {
    // Check current row and column
    for (let i = 0; i < board_length; i++) {
        if (i != y) {
            if (board[x][i] == key) {
                return false;
            }
        }
        if (i != x) {
            if (board[i][y] == key) {
                return false;
            }
        }
    }

    let sub_x = Math.floor(x / 3), sub_y = Math.floor(y / 3);

    // Checks the subgrid that the given x,y falls inside.
    for (let i = sub_x * 3; i < sub_x * 3 + 3; i++) {
        for (let j = sub_y * 3; j < sub_y * 3 + 3; j++) {
            if (board[i][j] == key && x != i && y != j) {
                return false;
            }
        }
    }

    return true;
}

// Finds the first empty square on the board.
function next_square() {
    for (let row = 0; row < board_length; row++) {
        for (let col = 0; col < board_length; col++) {
            if (board[row][col] == 0) {
                return [row, col];
            }
        }
    }

    return false;
}

// Checks if the board is full of numbers.
function full() {
    for (let i = 0; i < board_length; i++) {
        for (let j = 0; j < board_length; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }

    return true;
}

//  
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function solve(row, col) {
    // If the current board is invalid, go back and try another one.
    if (!is_valid(row, col, board[row][col])) {
        return false;
    }

    // If the board is full, it must be complete.
    if (full()) {
        return true;
    }

    // Finds next non-zero square.
    let next = next_square();
    let next_row = next[0], next_col = next[1];

    // Try each possibility and recursively call to the next square.
    for (let i = 1; i < 10; i++) {
        board[next_row][next_col] = i;

        // Artificially slow down the program to make the drawing visible.
        await sleep(1);

        if (await solve(next_row, next_col)) {
            return true;
        }

        board[next_row][next_col] = 0;
    }

    return false;
}

// Changes the global variable "board" to the given option.
function select_puzzle() {
    if (solving) {
        return;
    }

    // Selector values are in the form of "PUZZLE #N"
    // This piece of code gets N and stores it in num.
    let num = my_select.value();
    num = parseInt(num.substr(num.length - 1));

    switch (num) {
        case 1:
            board = [[5, 3, 4, 6, 7, 0, 9, 1, 0],
            [0, 0, 2, 0, 9, 0, 0, 0, 0],
            [0, 9, 0, 0, 4, 2, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]];
            break;
        case 2:
            board = [[3, 0, 0, 8, 0, 1, 0, 0, 2],
            [2, 0, 1, 0, 3, 0, 6, 0, 4],
            [0, 0, 0, 2, 0, 4, 0, 0, 0],
            [8, 0, 9, 0, 0, 0, 0, 0, 0],
            [0, 6, 0, 0, 0, 0, 0, 0, 0],
            [7, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 5, 0, 9, 0, 0, 0],
            [9, 0, 4, 0, 8, 0, 7, 0, 5],
            [6, 0, 0, 1, 0, 7, 0, 0, 3]];
            break;
        case 3:
            board = [[6, 0, 9, 0, 0, 4, 0, 0, 1],
            [8, 0, 0, 0, 5, 0, 0, 0, 0],
            [0, 3, 5, 1, 0, 9, 0, 0, 8],
            [0, 0, 8, 0, 0, 0, 0, 0, 4],
            [0, 5, 0, 0, 0, 0, 0, 3, 0],
            [4, 0, 0, 0, 7, 0, 0, 5, 2],
            [0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 0, 4, 0, 0, 0, 0],
            [7, 6, 0, 0, 3, 0, 0, 0, 0]];
            break;
        case 4:
            board = [[1, 0, 0, 0, 0, 9, 0, 0, 0],
            [5, 6, 0, 0, 1, 7, 0, 3, 9],
            [0, 0, 8, 6, 0, 0, 1, 0, 4],
            [6, 0, 9, 0, 0, 0, 0, 0, 0],
            [3, 8, 0, 0, 2, 0, 0, 7, 6],
            [0, 0, 0, 0, 0, 0, 2, 0, 8],
            [4, 0, 5, 0, 0, 1, 6, 0, 0],
            [2, 1, 0, 8, 5, 0, 0, 4, 3],
            [0, 0, 0, 3, 0, 0, 0, 0, 1]];

            break;
        case 5:
            board = [[1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            break;
    }
}

function start_solve() {
    begin = true;
}

function setup() {
    var canvas = createCanvas(canvas_size, canvas_size);
    canvas.parent("displayCanvas");

    my_select = createSelect();
    my_select.option('PUZZLE #1');
    my_select.option('PUZZLE #2');
    my_select.option('PUZZLE #3');
    my_select.option('PUZZLE #4');
    my_select.option('PUZZLE #5');
    my_select.changed(select_puzzle);

    my_start = createButton("START");
    my_start.mousePressed(start_solve);

    textSize(40);
    textAlign(CENTER, CENTER);

    for (let row = 0; row < board_length; row++) {
        for (let col = 0; col < board_length; col++) {
            draw_square(row, col);
        }
    }
}

function draw() {
    background(0);

    // Toggle start 
    if (begin) {
        solve(0, 0);
        begin = false;
        solving = true;
    }

    // Draw board repeatedly
    for (let row = 0; row < board_length; row++) {
        for (let col = 0; col < board_length; col++) {
            draw_square(row, col);
        }
    }

    // Draws subgrid lines.
    strokeWeight(4);
    for (let i = 1; i <= 2; i++) {
        line(square_size * 3 * i, 0, square_size * 3 * i, canvas_size);
        line(0, square_size * 3 * i, canvas_size, square_size * 3 * i);
    }
    strokeWeight(1);
}