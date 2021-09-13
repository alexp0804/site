// May 11, 2021

var cSize = 700;
var theta = 0;
var sel;
var slide;
var wave = [];

var neg_if_odd = i => (i % 2 == 0) ? 1 : -1;

// Coefficients for the wave
var c = {
    'Square': (i) => (4 / ((2 * i + 1) * PI)),
    'Sawtooth': (i) => 2 / (i + 1) * neg_if_odd(i),
    'Triangle': (i) => (neg_if_odd(i) * 8) / ((PI ** 2) * ((2 * i + 1) ** 2))
};

// Coefficients for theta
var c_t = {
    'Square': (i) => (2 * i + 1),
    'Sawtooth': (i) => (i + 1),
    'Triangle': (i) => (2 * i + 1)
};

// These values scale so each wave has the same initial size
var sc = {
    'Square': 100,
    'Sawtooth': 63.5,
    'Triangle': 157
};

function setup() {
    var canvas = createCanvas(cSize, cSize);
    canvas.parent("displayCanvas");

    slide = createSlider(1, 50, 25, 1);
    slide.parent("sheet");

    sel = createSelect();
    sel.option('Square');
    sel.option('Sawtooth');
    sel.option('Triangle');
    sel.parent("sheet");

    noFill();
    stroke(255);
}

function draw() {
    background(color('#131313'));
    translate(cSize / 4, cSize / 2);

    var x, y;
    var x0 = 0, y0 = 0;

    for (let i = 0; i < slide.value(); i++) {
        // Get coefficients, scale value
        let co = c[sel.value()];
        let t_co = c_t[sel.value()];
        let scl = sc[sel.value()];

        // Radius is the coefficient scaled
        let radius = scl * co(i);

        // Simple polar to cartesian
        x = radius * cos(t_co(i) * theta);
        y = radius * sin(t_co(i) * theta);

        // Draw circle centered at previous point
        stroke(color('#BBBBBB'), 70);
        ellipse(x0, y0, radius * 2, radius * 2);
        // Line from previous point to current point, update previous point information 
        line(x0, y0, x0 += x, y0 += y);
    }
    // Add final point to the wave-form
    wave.unshift([x0, y0]);

    stroke(color('#BBBBBB'), 100);
    line(x0, y0, 0, wave[0][1])

    // Draw wave-form
    stroke(color('#BBBBBB'));
    beginShape();
    for (let i = 0; i < wave.length; i++) {
        vertex(i, wave[i][1]);
    }
    endShape();

    // Cut-off to avoid unnecessary points
    while (wave.length > 600) {
        wave.pop();
    }

    theta += 0.03;
}