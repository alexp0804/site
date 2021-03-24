// Hello!

// Alexander Peterson
// Implements a visual representation of common search algorithms
// Using the p5js library and my own sorting functions

var canvas_size = 800;

var num_elements = 100;
var element_width = canvas_size / num_elements;
var elements = [];

var sorting_pointer;
var sorting = false;
var selector;


function draw_element(val, index) {
    let height = canvas_size * val / num_elements;
    let pos = (index) / num_elements * canvas_size;

    rect(pos, canvas_size, element_width, -height);
}

async function swap(list, i, j) {
    let temp = list[j];
    list[j] = list[i];
    list[i] = temp;

    await sleep(10);
}

async function bubble() {
    for (let i = 0; i < elements.length; i++) {
        for (let j = 0; j < elements.length - i - 1; j++) {
            if (elements[j] > elements[j + 1]) {
                await swap(elements, j, j + 1);

                fill(color('green'));
                draw_element(elements[j + 1], j + 1);
                fill(color('black'));
                draw_element(num_elements, j);
                fill(color('white'));
                draw_element(elements[j], j);
            }
        }
    }
}

async function insertion(list) {
    for (let i = 1; i < list.length; i++) {
        let key = list[i];
        let j = i - 1;
        while (j >= 0 && key <= list[j]) {
            swap(list, j + 1, j);
            j -= 1;
        }

        fill(color('green'));
        draw_element(elements[j + 1], j + 1);

        await sleep(40);

        list[j + 1] = key;
    }
}

async function selection(list) {
    for (let i = 0; i < list.length; i++) {
        let min = i;
        for (let j = i + 1; j < list.length; j++) {
            if (list[min] > list[j]) {
                min = j;
            }
        }
        swap(list, min, i);

        fill(color('green'));
        draw_element(elements[min], min);
        fill(color('white'));

        await sleep(40);
    }
}

async function merge_sort(list, lo, hi) {
    let mid = Math.floor(lo + (hi - lo) / 2);
    let merged_list = [];

    if (lo >= hi) {
        return;
    }

    await merge_sort(list, lo, mid);
    await merge_sort(list, mid + 1, hi);

    // Merge the lists, which should all be sorted.
    // i is the start of the first sorted array, j is the start of the second.
    let i = lo, j = mid + 1;


    // While both sorted portions have elements remaining, add the smaller of the two.
    while (i <= mid && j <= hi) {
        if (list[i] < list[j]) {
            merged_list.push(list[i]);
            i++;
        }
        else {
            merged_list.push(list[j]);
            j++;
        }
    }

    // At this point, at least one of the sorted portions have merged completely, so add the rest from the other portion.
    while (i <= mid) {
        merged_list.push(list[i]);
        i++;
    }
    while (j <= hi) {
        merged_list.push(list[j]);
        j++;
    }

    // Overwrite the unsorted portion of the array with the newly merged and sorted portion.
    for (let i = lo; i <= hi; i++) {
        await sleep(1);
        fill(color('green'));
        draw_element(list[i], i);
        list[i] = merged_list[i - lo];
    }

    return list.filter(n => n);
}

async function partition(list, lo, hi) {
    var pivot = list[lo];
    var i = lo + 1, j = hi;


    fill(color('green'));
    draw_element(list[lo], lo);
    draw_element(list[hi], hi);

    while (i <= j) {
        while (list[i] < pivot) {
            i++;
        }
        while (list[j] > pivot) {
            j--;
        }

        if (i <= j) {
            fill(color('green'));
            draw_element(list[j], j);
            draw_element(list[i], i);
            await swap(list, i, j);
            i++;
            j--;
        }
    }

    await swap(list, lo, j);

    return i;
}

async function quick_sort(list, lo, hi) {
    if (lo >= hi) {
        return;
    }

    let partition_index = await partition(list, lo, hi);

    await quick_sort(list, lo, partition_index - 1);
    await quick_sort(list, partition_index, hi);
}

function randomize() {
    if (!sorting) {
        elements.sort(() => Math.random() - 0.5);
    }
}

function sorted(list) {
    for (let i = 0; i < list.length - 1; i++) {
        if (list[i] > list[i + 1]) {
            return false;
        }
    }

    return true;
}

function start_sort() {
    if (sorting) {
        return;
    }

    if (sorted(elements)) {
        randomize(elements);
    }

    if (selector.value().localeCompare('BUBBLE SORT') == 0) {
        sorting_pointer = bubble();
    }

    if (selector.value().localeCompare('INSERTION SORT') == 0) {
        sorting_pointer = insertion(elements);
    }

    if (selector.value().localeCompare('SELECTION SORT') == 0) {
        sorting_pointer = selection(elements);
    }
    if (selector.value().localeCompare('MERGE SORT') == 0) {
        sorting_pointer = merge_sort(elements, 0, elements.length - 1);
    }

    if (selector.value().localeCompare('QUICK SORT') == 0) {
        sorting_pointer = quick_sort(elements, 0, elements.length - 1);
    }

    sorting = true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setup() {
    var canvas = createCanvas(canvas_size, canvas_size);
    canvas.parent('displayCanvas');

    strokeWeight(0.3);

    selector = createSelect();
    selector.option('BUBBLE SORT');
    selector.option('INSERTION SORT');
    selector.option('SELECTION SORT');
    selector.option('MERGE SORT');
    selector.option('QUICK SORT');

    var startButton = createButton('START');
    startButton.mousePressed(start_sort);

    for (let i = 0; i < num_elements; i++) {
        elements.push(i + 1);
    }

    elements.sort(() => Math.random() - 0.5);
}

function draw() {
    background(0);

    for (let i = 0; i < num_elements; i++) {
        fill(color('white'));
        draw_element(elements[i], i);
    }

    if (!sorting) {
        sorting_pointer;
    }

    if (sorted(elements)) {
        sorting = false;
    }
}
