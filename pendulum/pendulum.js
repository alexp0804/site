
var canvas_size = 800;
var pen_1;
var pen_2;
var points = [];
var g = 1.2;
var pen_length = 195;
var i = 0;

class Pendulum {
    constructor(x_i, y_i, x_f, y_f, l, mass) {
        this.piv = createVector(x_i, y_i);
        this.bob = createVector(x_f, y_f);
        this.l = l;
        this.theta = 0;
        this.theta_vel = 0;
        this.theta_acc = 0;
        this.mass = mass;
    }

    update_pos() {
        this.theta_vel += this.theta_acc;
        this.theta_vel = constrain(this.theta_vel, -0.8, 0.8);
        this.theta += this.theta_vel;
        this.bob.x = this.piv.x + this.l * sin(this.theta);
        this.bob.y = this.piv.y + this.l * cos(this.theta);
    }

    update_piv(vec) {
        this.piv.x = vec.x;
        this.piv.y = vec.y;
    }
}

// Very ugly math
function theta_1_acc(p1, p2) {
    let num_1 = -g * (2 * p1.mass + p2.mass) * sin(p1.theta);
    let num_2 = -p2.mass * g * sin(p1.theta - 2 * p2.theta);
    let num_3 = -2 * sin(p1.theta - p2.theta) * p2.mass * (p2.theta_vel ** 2 * p2.l + p1.theta_vel ** 2 * p1.l * cos(p1.theta - p2.theta));
    let den = p1.l * (2 * p1.mass + p2.mass - p2.mass * cos(2 * p1.theta - 2 * p2.theta));

    return (num_1 + num_2 + num_3) / den;
}

// Very ugly math part 2
function theta_2_acc(p1, p2) {
    let num = 2 * sin(p1.theta - p2.theta) * (p1.theta_vel ** 2 * p1.l * (p1.mass + p2.mass) + g * (p1.mass + p2.mass) * cos(p1.theta) + p2.theta_vel ** 2 * p2.l * p2.mass * cos(p1.theta - p2.theta));
    let den = p2.l * (2 * p1.mass + p2.mass - p2.mass * cos(2 * p1.theta - 2 * p2.theta));

    return num / den;
}

function reset() {
    // Random angle in the upper half of the screen
    pen_1.theta = random(5 * PI / 4, 3 * PI / 4);
    pen_1.theta_acc = 0;
    pen_1.theta_vel = 0;

    pen_2.theta = random(5 * PI / 4, 3 * PI / 4);
    pen_2.theta_acc = 0;
    pen_2.theta_vel = 0;

    points = [];
}

function setup() {
    var canvas = createCanvas(canvas_size, canvas_size);
    canvas.parent("displayCanvas");

    var reset_button = createButton("RESET");
    reset_button.mousePressed(reset);

    background(0);

    pen_1 = new Pendulum(0, 0, 0, pen_length, pen_length, 17);
    pen_2 = new Pendulum(0, 0, 0, pen_length + pen_length * cos(pen_1.theta) - 10, pen_length - 10, 8);

    reset();
}

function draw() {
    background('gainsboro');
    translate(canvas_size / 2, 300);

    // Calculate angular acceleration
    pen_1.theta_acc = theta_1_acc(pen_1, pen_2);
    pen_2.theta_acc = theta_2_acc(pen_1, pen_2);

    pen_1.update_pos();
    pen_2.update_piv(pen_1.bob);
    pen_2.update_pos();

    // Draw pendulum rods
    strokeWeight(5);
    stroke(128);
    line(pen_1.piv.x, pen_1.piv.y, pen_1.bob.x, pen_1.bob.y);
    line(pen_2.piv.x, pen_2.piv.y, pen_2.bob.x, pen_2.bob.y);

    // Add point to list for trails
    points.push(pen_2.bob.x, pen_2.bob.y);

    // Draw bob/pivot
    stroke(color('green'));
    fill(color('green'));
    circle(pen_1.bob.x, pen_1.bob.y, 8);
    circle(pen_2.bob.x, pen_2.bob.y, 8);
    circle(0, 0, 8);

    stroke(0);
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