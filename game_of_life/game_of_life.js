// Alexander Peterson
// Dec 30 2020
// Game of Life in JS with P5JS.

let cells = [];
let nextCells = [];
var numCells = 50;
var canvasSize = 800;
var cellSize = canvasSize / numCells;
var previous_cell = [-1, -1];
var looping = false;

class Cell {
  constructor(x, y, alive) {
    this.x = x;
    this.y = y;
    this.alive = alive;
  }

  drawCell() {
    if (this.alive) {
      fill(255);
    }
    else {
      fill(0);
    }
    rect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
  }
}

function inRange(x, y, range) {
  return (x >= 0 && x < range) && (y >= 0 && y < range);
}

function neighborCount(cells, c) {
  var neighborCount = 0;
  var curX, curY;

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      curX = i + c.x - 1;
      curY = j + c.y - 1;

      if (inRange(curX, curY, numCells) && cells[curX][curY].alive && !(curX == c.x && curY == c.y)) {
        neighborCount += 1;
      }
    }
  }

  return neighborCount;
}

function boardEmpty(cells) {
  for (var i = 0; i < numCells; i++) {
    for (var j = 0; j < numCells; j++) {
      if (cells[i][j].alive) {
        return false;
      }
    }
  }
  return true;
}

function reset() {
  for (var i = 0; i < numCells; i++) {
    for (var j = 0; j < numCells; j++) {
      cells[i][j].alive = false;
      nextCells[i][j].alive = false;
    }
  }
  looping = false;
}

function start() {
  looping = true;
}

function populate() {
  let chances = [0, 0, 1];
  let alive = 0;
  for (let i = 0; i < numCells; i++) {
    for (let j = 0; j < numCells; j++) {
      cells[i][j].alive = false;
      alive = random(chances);
      if (alive) {
        cells[i][j].alive = true;
      }
    }
  }
}

function setup() {
  let alive = 1;
  for (var i = 0; i < numCells; i++) {
    cells[i] = [];
    nextCells[i] = [];

    for (var j = 0; j < numCells; j++) {
      cells[i].push(new Cell(i, j));
      nextCells[i].push(new Cell(i, j));
    }
  }

  var canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent("displayCanvas");

  clearButton = createButton("CLEAR");
  clearButton.mousePressed(reset);

  startButton = createButton("START");
  startButton.mousePressed(start);

  populateButton = createButton("POPULATE");
  populateButton.mousePressed(populate);

  populate();

  background(0);
  frameRate(18);
}

function draw() {
  background(0);
  var numNeighbors = 0, i, j;

  mouseXCell = Math.floor(mouseX / cellSize);
  mouseYCell = Math.floor(mouseY / cellSize);

  if (mouseIsPressed) {
    if (!(mouseXCell == previous_cell[0] && mouseYCell == previous_cell[1]) && inRange(mouseXCell, mouseYCell, numCells)) {
      cells[mouseXCell][mouseYCell].alive = !cells[mouseXCell][mouseYCell].alive;
      previous_cell[0] = mouseXCell;
      previous_cell[1] = mouseYCell;
    }
  }

  for (i = 0; i < numCells; i++) {
    for (j = 0; j < numCells; j++) {
      numNeighbors = neighborCount(cells, cells[i][j]);

      // Rules of life:
      //   1. Any alive cell that has 2 or 3 neighbors lives.
      //   2. Any dead cell with 3 neighbors lives.
      //   3. All other cells retain their current state.
      if (cells[i][j].alive && (numNeighbors == 2 || numNeighbors == 3)) {
        nextCells[i][j].alive = true;
      }
      else if (!cells[i][j].alive && numNeighbors == 3) {
        nextCells[i][j].alive = true;
      }
      else {
        nextCells[i][j].alive = false;
      }

      cells[i][j].drawCell();
    }
  }
  if (boardEmpty(cells)) {
    looping = false;
  }

  for (i = 0; i < numCells; i++) {
    for (j = 0; j < numCells; j++) {
      if (looping) {
        cells[i][j].alive = nextCells[i][j].alive;
        nextCells[i][j].alive = false;
      }
      else {
        nextCells[i][j].alive = cells[i][j].alive;
      }
    }
  }
}
