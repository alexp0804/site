
var canvasSize = 700;
var penA;
var penB;
var points = [];
var g = 1.2;
var penLength = 195;
var i = 0;

class Pendulum {
    constructor(Xi, Yi, Xf, Yf, l, mass) {
        this.piv = createVector(Xi, Yi);
        this.bob = createVector(Xf, Yf);
        this.l = l;
        this.theta = 0;
        this.thetaVel = 0;
        this.thetaAcc = 0;
        this.mass = mass;
    }

    updatePos() {
        this.thetaVel += this.thetaAcc;
        this.thetaVel *= 0.999;
        this.theta += this.thetaVel;
        this.bob.x = this.piv.x + this.l * sin(this.theta);
        this.bob.y = this.piv.y + this.l * cos(this.theta);
    }

    updatePiv(vec) {
        this.piv.x = vec.x;
        this.piv.y = vec.y;
    }
}

// Very ugly math
function theta1Acc(p1, p2) {
    let num1 = -g * (2 * p1.mass + p2.mass) * sin(p1.theta);
    let num2 = -p2.mass * g * sin(p1.theta - 2 * p2.theta);
    let num3 = -2 * sin(p1.theta - p2.theta) * p2.mass * (p2.thetaVel ** 2 * p2.l + p1.thetaVel ** 2 * p1.l * cos(p1.theta - p2.theta));
    let den = p1.l * (2 * p1.mass + p2.mass - p2.mass * cos(2 * p1.theta - 2 * p2.theta));

    return (num1 + num2 + num3) / den;
}

// Very ugly math part 2
function theta2Acc(p1, p2) {
    let num = 2 * sin(p1.theta - p2.theta) * (p1.thetaVel ** 2 * p1.l * (p1.mass + p2.mass) + g * (p1.mass + p2.mass) * cos(p1.theta) + p2.thetaVel ** 2 * p2.l * p2.mass * cos(p1.theta - p2.theta));
    let den = p2.l * (2 * p1.mass + p2.mass - p2.mass * cos(2 * p1.theta - 2 * p2.theta));

    return num / den;
}

function reset() {
    // Random angle in the upper half of the screen
    penA.theta = random(5 * PI / 4, 3 * PI / 4);
    penA.thetaAcc = 0;
    penA.thetaVel = 0;

    penB.theta = random(5 * PI / 4, 3 * PI / 4);
    penB.thetaAcc = 0;
    penB.thetaVel = 0;

    points = [];
}

function setup() {
    var canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent("displayCanvas");

    var resetButton = createButton("Reset");
    resetButton.mousePressed(reset);
    resetButton.parent("sheet");

    background(0);

    penA = new Pendulum(0, 0, 0, penLength, penLength, 17);
    penB = new Pendulum(0, 0, 0, penLength + penLength * cos(penA.theta) - 10, penLength - 10, 8);

    reset();
}

function draw() {
    background(color('#131313'));
    translate(canvasSize / 2, 300);

    // Calculate angular acceleration
    penA.thetaAcc = theta1Acc(penA, penB);
    penB.thetaAcc = theta2Acc(penA, penB);

    penA.updatePos();
    penB.updatePiv(penA.bob);
    penB.updatePos();

    // Draw pendulum rods
    stroke(color("#999999"))
    strokeWeight(5);
    stroke(128);
    line(penA.piv.x, penA.piv.y, penA.bob.x, penA.bob.y);
    line(penB.piv.x, penB.piv.y, penB.bob.x, penB.bob.y);

    // Add point to list for trails
    points.push(penB.bob.x, penB.bob.y);

    // Draw bob/pivot
    stroke(color('#263859'));
    fill(color('#263859'));
    circle(penA.bob.x, penA.bob.y, 8);
    circle(penB.bob.x, penB.bob.y, 8);
    circle(0, 0, 8);

    stroke(color("#999999"));
    strokeWeight(1);
    noFill();

    // Draw trails but only first 600
    beginShape()
    for (i = 0; i < 600 && i < points.length - 1; i += 2) {
        curveVertex(points[i], points[i + 1]);
    }
    endShape();

    // Remove remaining points
    for (; i < points.length;) {
        points.shift();
    }
}