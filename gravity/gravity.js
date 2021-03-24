var canvasSize = 800;
var bodies = [];
var G = 30;
var stars = []
var trails = true;

class Body {
    constructor(x, y, mass, radius, slider) {
        this.x = x;
        this.y = y;
        this.vel = [0, 0]; // Velocity in X, Y
        this.acc = [0, 0]; // Acceleration in X, Y
        this.mass = mass;
        this.radius = radius;
        this.mass_slider = slider;
        this.points = [];
    }

    drawBody() {
        fill('#12A400');
        circle(this.x, this.y, this.radius * 2);
    }

    move() {
        this.vel[0] += this.acc[0];
        this.vel[1] += this.acc[1];

        // Handle bounces along the wall
        if (this.x + this.vel[0] + this.radius / 2 > canvasSize || this.x + this.vel[0] - this.radius / 2 < 0) {
            this.vel[0] *= -1 / 2;
            this.acc[0] *= -1;
        }
        if (this.y + this.vel[1] + this.radius / 2 > canvasSize || this.y + this.vel[1] - this.radius / 2 < 0) {
            this.vel[1] *= -1 / 2;
            this.acc[1] *= -1;
        }

        this.x += this.vel[0];
        this.y += this.vel[1];
    }
}

// Force formula: g * m1 * m2 / r^2
function force(bodyA, bodyB) {
    let r = dist(bodyA.x, bodyA.y, bodyB.x, bodyB.y);
    let c = 1;

    // If r is too small the resulting force would be increasingly large. To fix this, shrink the final force.
    if (r < bodyA.radius + bodyB.radius) {
        c = 1 / 100;
    }

    return G * bodyA.mass * bodyB.mass / (r * r) * c;
}

function angle(bodyA, bodyB) {
    return Math.atan2((bodyB.y - bodyA.y), (bodyB.x - bodyA.x));
}

function applyForce(bodyA, bodyB) {
    // Force is the exact same for both bodies.
    let f = force(bodyA, bodyB);

    // Opposite angles, angleB could also be angleA + pi.
    let angleA = angle(bodyA, bodyB);
    let angleB = angle(bodyB, bodyA);

    // Apply acceleration in the proper direction.
    bodyA.acc[0] += Math.cos(angleA) * f / bodyA.mass;
    bodyA.acc[1] += Math.sin(angleA) * f / bodyA.mass;

    bodyB.acc[0] += Math.cos(angleB) * f / bodyB.mass;
    bodyB.acc[1] += Math.sin(angleB) * f / bodyB.mass;
}

function randPoint() {
    return Math.floor(Math.random() * 401) + 150; // Picks a random point around the middle of the screen.
}

function toggleTrails() {
    trails = !trails;
    for (let i = 0; i < bodies.length; i++) {
        bodies[i].points = []; // Deleting each set of lines.
    }
}

function setup() {
    var canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent("displayCanvas");

    bodies = [
        new Body(randPoint(), randPoint(), 10, 11, createSlider(5, 60, 32.5)),
        new Body(randPoint(), randPoint(), 10, 11, createSlider(5, 60, 32.5)),
        new Body(randPoint(), randPoint(), 10, 11, createSlider(5, 60, 32.5))
    ];

    createP();

    var trailsButton = createButton("TOGGLE TRAILS");
    trailsButton.mousePressed(toggleTrails);

    for (let i = 0; i < 50; i++) {
        let x = random(width);
        let y = random(height);

        stars.push(createVector(x, y));
    }

    frameRate(60);
}

function draw() {
    background(0);

    // Draw stars.
    for (let i = 0; i < stars.length; i++) {
        fill(255);
        circle(stars[i].x, stars[i].y, 2);
    }

    for (let i = 0; i < bodies.length; i++) {
        bodies[i].points.push(bodies[i].x, bodies[i].y);

        // Cut off beginning of trail once it gets too long, to avoid visual clutter and reduce lag.
        if (bodies[i].points.length > 2000) {
            bodies[i].points.splice(0, 2);
        }
        // Apply slider values.
        bodies[i].mass = bodies[i].mass_slider.value();
        bodies[i].radius = bodies[i].mass / 15 + 10; // Range of raidus: 10.33 - 14, depending on mass. 
    }

    // Draw trails.
    if (trails) {
        stroke(255);
        noFill();

        for (let i = 0; i < bodies.length; i++) {
            beginShape();
            // Loop through each set of coordinates, or simply each point.
            for (let j = 0; j < bodies[i].points.length; j += 2) {
                curveVertex(bodies[i].points[j], bodies[i].points[j + 1]);
            }
            endShape();
        }

        stroke(0);
    }

    // Reset acceleration.
    for (let i = 0; i < bodies.length; i++) {
        bodies[i].acc[0] = 0;
        bodies[i].acc[1] = 0;
    }

    // Apply forces to each planet.
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
            applyForce(bodies[i], bodies[j])
        }
    }

    // Move and draw planets.
    for (let i = 0; i < bodies.length; i++) {
        bodies[i].move();
        bodies[i].drawBody();
    }
}
