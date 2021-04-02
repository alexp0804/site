// Alexander Peterson
// April 2 2021

var canvas_size = 800;
var cur_i = 0;
var max_i = 30;

var states = [];
var not_in_set = new Array(canvas_size).fill(false).map(() => new Array(canvas_size).fill(false));

var x0, y0, x, y, x2, y2, iteration, x_temp; // Used in Mandelbrot calculation

function draw_state(state) {
    for (let i = 0; i < canvas_size; i++) {
        for (let j = 0; j < canvas_size; j++) {
            set(i, j, state[i][j]);
        }
    }
}

function setup() {
    var canvas = createCanvas(canvas_size, canvas_size);
    canvas.parent("displayCanvas");
    slider = createSlider(0, max_i, 0, 1);
}

function draw() {
    if (cur_i <= max_i) {
        // Create canvas_size x canvas_size matrix and fill with 0s
        let arr = new Array(canvas_size).fill(0).map(() => new Array(canvas_size).fill(0));

        // ** Note ** //
        // We are using a matrix of canvas_size x canvas_size when we are only drawing every other pixel.
        // This is un-optimized memory-wise as we could use a much smaller matrix, but it makes the calculation easier.

        // Process every other pixel
        for (let i = 0; i < canvas_size; i += 2) {
            for (let j = 0; j < canvas_size; j += 2) {

                // If we know this pixel isn't in the set, skip to the next.
                if (not_in_set[i][j])
                    continue;

                // Centering the set
                x0 = map(i, 0, canvas_size, -2.05, 0.7);
                y0 = map(j, 0, canvas_size, -1.3, 1.3);

                x = 0;
                y = 0;
                x2 = 0;
                y2 = 0;
                w = 0;
                iteration = 0;

                // Mandelbrot calculations
                while (x2 + y2 <= 4 && iteration < cur_i) {
                    x = x2 - y2 + x0;
                    y = w - x2 - y2 + y0;
                    x2 = x * x;
                    y2 = y * y;
                    w = (x + y) * (x + y);
                    iteration++;
                }

                arr[i][j] = color(255);

                // If the iteration count is too low (meaning the point diverged very quickly) exclude from the set.
                if ((iteration / cur_i <= 0.98)) {
                    not_in_set[i][j] = true;
                }
            }
        }
        // Store the state of the pixels so we can view them later.
        states.push(arr);
    }

    // If we have already processed each state, draw whichever the slider is pointing too.
    if (cur_i > max_i) {
        draw_state(states[slider.value()]);
    }
    // Otherwise draw the current state.
    else {
        slider.value(cur_i);
        draw_state(states[cur_i]);
    }

    cur_i += 1;

    updatePixels();
}