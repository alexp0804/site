
var canvasSize = 800;

// Timestep for the differential equations
var dt = 0.015;

// Variable to keep track of the lorenz attractor
var attractor;

// Camera variable
var easyCam;

// Maximum length for the number of points drawn.
var maxLength = 1500;

// Initial conditions for the set of differential equations
var sigma = 10, rho = 28, beta = 8/3;

class Attractor {
    constructor()
    {
        // Position vector
        this.r = createVector(2, 2, 2);

        // Set of history points 
        this.points = [];
    }

    step() {
        let dx, dy, dz;
        let x = this.r.x, y = this.r.y, z = this.r.z;

        // Differential equations as described by:
        // https://en.wikipedia.org/wiki/Lorenz_system 
        dx = (sigma * (y - x)) * dt;
        dy = (x * (rho - z) - y) * dt;
        dz = ((x * y) - (beta * z)) * dt;

        // Add differential to position
        this.r.add(dx, dy, dz);
        
        // Push the current point to the list of previous points
        this.points.push(this.r.x, this.r.y, this.r.z);

        // Cut off the beginning of the points list to minimize render time. The 3* is there to ensure only sets of three are shifted, as the points are stored as three integers.
        while (this.points.length > 3 * maxLength) {
            this.points.shift();
        }
    }

    render() {
        let p = this.points;

        let l = p.length - 3;
        let ll = l - 3;

        if (l < 0 || ll < 0) {
            return;
        }

        stroke(255);
        noFill();
        strokeWeight(0.5);

        beginShape();
        for (let i = 0; i < p.length - 1; i += 3) {
            vertex(p[i], p[i+1], p[i+2]);
        }
        endShape();
    }
}

function setup() {
    var canvas = createCanvas(canvasSize, canvasSize, WEBGL);
    canvas.parent("displayCanvas");
    easyCam = createEasyCam(); 
    
    // Right click menu disabled
    document.oncontextmenu = function () { return false; }
    attractor = new Attractor();

    stroke(255);
}

function draw() {
    scale(6);
    background(0);
    translate(0, 0, -30);
    attractor.step();
    attractor.render();
}

