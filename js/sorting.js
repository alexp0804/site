// Alexander Peterson
// Implements a visual representation of common search algorithms

var canvasSize = 700;

var numElements = 100;
var elementWidth = canvasSize / numElements;
var elements = [];

var sortingPointer;
var sorting = false;
var selector;

function drawElement(val, index) {
    let height = canvasSize * val / numElements;
    let pos = (index) / numElements * canvasSize;

    rect(pos, canvasSize, elementWidth, -height);
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

                drawElement(elements[j + 1], j + 1);
                fill(color("#131313"));
                drawElement(numElements, j);
                fill(color("#BBBBBB"));
                drawElement(elements[j], j);
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

        drawElement(elements[j + 1], j + 1);

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

        drawElement(elements[min], min);
        fill(color("#BBBBBB"));

        await sleep(40);
    }
}

async function mergeSort(list, lo, hi) {
    let mid = Math.floor(lo + (hi - lo) / 2);
    let mergedList = [];

    if (lo >= hi) {
        return;
    }

    await mergeSort(list, lo, mid);
    await mergeSort(list, mid + 1, hi);

    // Merge the lists, which should all be sorted.
    // i is the start of the first sorted array, j is the start of the second.
    let i = lo, j = mid + 1;


    // While both sorted portions have elements remaining, add the smaller of the two.
    while (i <= mid && j <= hi) {
        if (list[i] < list[j]) {
            mergedList.push(list[i]);
            i++;
        }
        else {
            mergedList.push(list[j]);
            j++;
        }
    }

    // At this point, at least one of the sorted portions have merged completely, so add the rest from the other portion.
    while (i <= mid) {
        mergedList.push(list[i]);
        i++;
    }
    while (j <= hi) {
        mergedList.push(list[j]);
        j++;
    }

    // Overwrite the unsorted portion of the array with the newly merged and sorted portion.
    for (let i = lo; i <= hi; i++) {
        await sleep(1);
        drawElement(list[i], i);
        list[i] = mergedList[i - lo];
    }

    return list.filter(n => n);
}

async function partition(list, lo, hi) {
    var pivot = list[lo];
    var i = lo + 1, j = hi;

    drawElement(list[lo], lo);
    drawElement(list[hi], hi);

    while (i <= j) {
        while (list[i] < pivot) {
            i++;
        }
        while (list[j] > pivot) {
            j--;
        }

        if (i <= j) {
            drawElement(list[j], j);
            drawElement(list[i], i);
            await swap(list, i, j);
            i++;
            j--;
        }
    }

    await swap(list, lo, j);
    return i;
}

async function quickSort(list, lo, hi) {
    if (lo >= hi) {
        return;
    }

    let partitionIndex = await partition(list, lo, hi);

    await quickSort(list, lo, partitionIndex - 1);
    await quickSort(list, partitionIndex, hi);
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

function startSort() {
    if (sorting) {
        return;
    }

    if (sorted(elements)) {
        randomize(elements);
    }

    if (selector.value().localeCompare("Bubble Sort") == 0) {
        sortingPointer = bubble();
    }

    if (selector.value().localeCompare("Insertion Sort") == 0) {
        sortingPointer = insertion(elements);
    }

    if (selector.value().localeCompare("Selection Sort") == 0) {
        sortingPointer = selection(elements);
    }
    if (selector.value().localeCompare("Merge Sort") == 0) {
        sortingPointer = mergeSort(elements, 0, elements.length - 1);
    }

    if (selector.value().localeCompare("Quick Sort") == 0) {
        sortingPointer = quickSort(elements, 0, elements.length - 1);
    }

    sorting = true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setup() {
    var canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent("displayCanvas");

    strokeWeight(0.3);

    selector = createSelect();
    selector.option("Bubble Sort");
    selector.option("Insertion Sort");
    selector.option("Selection Sort");
    selector.option("Merge Sort");
    selector.option("Quick Sort");
    selector.parent("sheet")

    var startButton = createButton("Start");
    startButton.parent("sheet")
    startButton.mousePressed(startSort);

    for (let i = 0; i < numElements; i++) {
        elements.push(i + 1);
    }

    elements.sort(() => Math.random() - 0.5);
}

function draw() {
    background(color("#131313"));

    for (let i = 0; i < numElements; i++) {
        fill(color("#BBBBBB"));
        drawElement(elements[i], i);
    }

    if (!sorting) {
        sortingPointer;
    }

    if (sorted(elements)) {
        sorting = false;
    }
}
