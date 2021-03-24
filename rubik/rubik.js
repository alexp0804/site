
var canvas_size = 800;
var c_size = 40;

var cube;
var n;

// var cube = [[[tl, tm, tr], // top row
//              [ml, mm, mr], 
//              [bl, bm, br]], 
//                  [[tl, tm, tr], 
//                   [ml, mm, mr], 
//                   [bl, bm, br]], // middle row
//                        [[tl, tm, tr], 
//                         [ml, mm, mr], 
//                         [bl, bm, br]]]; // last row

class Cubie {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.n = [0, 0, 1]; // Vector normal to the white surface of the cubie and is used to determine which way to draw
    }

    // draw_cubie(i, j, k) {

    //     let n = createVector(this.n[0], this.n[1], this.n[2]);
    //     let z_angle = n.angleBetween(createVector(0, 0, 1));

    //     push();
    //     translate(-c_size, -c_size, -c_size);
    //     // Top
    //     push();
    //     fill(color('white'));
    //     translate(i * c_size, c_size * (j - 0.5) - 0.01, k * c_size);
    //     // rotateX(PI / 2);
    //     rotateX(z_angle + PI / 2);

    //     plane(c_size, c_size, 2);
    //     pop();

    //     // Bottom
    //     push();
    //     fill(color('yellow'));
    //     translate(i * c_size, c_size * (j + 0.5) + 0.01, k * c_size);
    //     rotateX(PI / 2);
    //     plane(c_size, c_size, 2);
    //     pop();

    //     // Front
    //     push();
    //     fill(color('green'));
    //     translate(c_size * (i + 0.5) + 0.01, j * c_size, k * c_size);
    //     rotateY(PI / 2);
    //     plane(c_size, c_size, 2);
    //     pop();

    //     // Back
    //     push();
    //     fill(color('blue'));
    //     translate(c_size * (i - 0.5) - 0.01, j * c_size, k * c_size);
    //     rotateY(PI / 2);
    //     plane(c_size, c_size, 2);
    //     pop();

    //     // Right
    //     push();
    //     fill(color('red'));
    //     translate(c_size * i, j * c_size, c_size * (k - 0.5) - 0.01);
    //     rotateZ(PI / 2);
    //     plane(c_size, c_size, 2);
    //     pop();

    //     // Left
    //     push();
    //     fill(color('orange'));
    //     translate(c_size * i, j * c_size, c_size * (k + 0.5) + 0.01);
    //     rotateZ(PI / 2);
    //     plane(c_size, c_size, 2);
    //     pop();

    //     // Edges, can't draw stroke on higher detailed planes
    //     push();
    //     stroke(0);
    //     noFill();
    //     translate(i * c_size, j * c_size, k * c_size);
    //     box(c_size);
    //     pop();
    //     pop();
    // }

    draw_cubie() {
        let n = createVector(this.n[0], this.n[1], this.n[2])
        // Translate to the middle of the cubie
        push();
        translate(this.x * c_size, this.y * c_size, this.z * c_size);
        rotateX(n.angleBetween(createVector(0, 0, 1)));
        // rotate(n.angleBetween(createVector(0, 1, 0)));

        push();
        fill(color('white'));
        // translate(this.x * c_size, c_size * (this.y - 0.5) - 0.01, this.z * c_size);
        rotateX(PI / 2);
        plane(c_size, c_size, 2);
        pop();

        // Bottom
        push();
        fill(color('yellow'));
        rotateX(PI / 2);
        translate(0, 0, -0.01);
        // translate(this.x * c_size, c_size * (this.y + 0.5) + 0.01, this.y * c_size);
        plane(c_size, c_size, 2);
        pop();



        pop();
    }
}

// Each double array is a horizontal row, top (white) to bottom (yellow)
// Starts top left cubie (if looking from above)
// Row then col
// So first would be white top with blue/orange Cubie first


cube = [
    [[new Cubie(-1, -1, 1), new Cubie(-1, 0, 1), new Cubie(-1, 1, 1)],
    [new Cubie(0, -1, 1), new Cubie(0, 0, 1), new Cubie(0, 1, 1)],
    [new Cubie(1, -1, 1), new Cubie(1, 0, 1), new Cubie(1, 1, 1)]],

    [[new Cubie(-1, -1, 0), new Cubie(-1, 0, 0), new Cubie(-1, 1, 0)],
    [new Cubie(0, -1, 0), new Cubie(0, 0, 0), new Cubie(0, 1, 0)],
    [new Cubie(1, -1, 0), new Cubie(1, 0, 0), new Cubie(1, 1, 0)]],

    [[new Cubie(-1, -1, -1), new Cubie(-1, 0, -1), new Cubie(-1, 1, -1)],
    [new Cubie(0, -1, -1), new Cubie(0, 0, -1), new Cubie(0, 1, -1)],
    [new Cubie(1, -1, -1), new Cubie(1, 0, -1), new Cubie(1, 1, -1)]],
];


function draw_axes(len) {
    stroke(0, 255, 0);

    line(0, 0, 0, len, 0, 0);

    push();
    translate(0, 0, len);
    rotateX(PI / 2);
    cone(5, len / 10);
    pop();

    line(0, 0, 0, 0, len, 0);

    push();
    translate(0, len, 0);
    cone(5, len / 10);
    pop();

    line(0, 0, 0, 0, 0, len);

    push();
    translate(len, 0, 0);
    rotateZ(-PI / 2);
    cone(5, len / 10);
    pop();

}

function setup() {
    var canvas = createCanvas(canvas_size, canvas_size, WEBGL);
    canvas.parent("displayCanvas");
    createEasyCam();

    // noLoop();

    frameRate(30);
}

function draw() {
    background(0);
    draw_axes(200);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                cube[i][j][k].draw_cubie(i, j, k);
            }
        }
    }
}