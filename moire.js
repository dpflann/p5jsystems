var rows = 25;
var columns = 50;
var length = 5;
var layers = 10;
var t = 100;
var colLen = 0;
var colLenHalf = 0;
var rowLen = 0;
var rowLenHalf = 0;
var ELLIPSE = 0;
var LINE = 1;
var noOp = function() {};
var drawFunc = noOp;
var numberOfWaves = 6;

function drawGrid(shape, usingGrowth) {
    colLen = Math.ceil(windowWidth / columns);
    colLenHalf = Math.ceil(colLen / 2);
    rowLen = Math.ceil(windowHeight / rows);
    rowLenHalf = Math.ceil(rowLen / 2);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var centerX = j * colLen + colLenHalf;
            var centerY = i * rowLen  + rowLenHalf;
            var r = 255 * noise(t + 10, t + 10);
            var g = 255 * noise(t + 20, t + 20);
            var b = 255 * noise(t + 30, t + 30);
            if (shape == LINE) {
                //stroke(r, g, b);
                stroke(r, r, r);
                line(j * colLen, i * rowLen, (j + 1) * colLen, (i + 1) * rowLen);
            } else {
                //fill(r, g, b);
                fill(r, r, r);
                if (usingGrowth) {
                    ellipse(centerX, centerY, length + length * noise(t + 40, t+ 40), length + length * noise(t + 40, t + 40));
                } else {
                    ellipse(centerX, centerY, length, length);
                }
            }
        }
    }
    t += 0.01;
}

function drawLines(n) {
    var colLen = Math.ceil(windowWidth / n);
    for (var i = 0; i < windowWidth; i += colLen) {
        var r = 255 * noise(t + 10, t + 10);
        var g = 255 * noise(t + 20, t + 20);
        var b = 255 * noise(t + 30, t + 30);
        noFill();
        //stroke(r, g, b);
        stroke(r, r, r);
        bezier(
            i, 0,
            noise(t + i, t + i) * windowWidth, noise(t + i, t + i) * windowHeight,
            noise(t + i, t + i) * windowWidth, noise(t + i, t + 1) * windowHeight,
            i, windowHeight
        );
    }
    t += 0.01;
}

function drawMoire() {
    clear();
    background(0);
    for (var i = 0; i < layers; i++) {
        drawLines(columns);
    }
    t += 0.01;
}

function drawDottedLine() {
    var rowLen = Math.ceil(windowWidth / rows);
    var rowLenHalf = Math.ceil(rowLen / 2)
    var colLen = Math.ceil(windowHeight / columns);
    var colLenHalf = Math.ceil(colLen / 2)
    for (var j = 0; j < columns; j++) {
        var centerX = j * colLen + colLenHalf;
        var centerY = rowLenHalf;
        var r = 255 * noise(t + 10, t + 10);
        var g = 255 * noise(t + 20, t + 10);
        var b = 255 * noise(t + 30, t + 10);
        fill(r, g, b);
        ellipse(centerX, centerY, length, length);
    }
    t += 0.01;
}

function drawSwirl() {
    push();
    translate(windowWidth / 2, windowHeight / 2);
    rotate(radians(frameCount));
    drawDottedLine();
    pop();
}

function drawWobblingCircles() {
    var withGrowth = true;
    push();
    translate(100 * noise(t) * Math.cos(t), 100 * noise(t) * Math.sin(t));
    drawGrid(ELLIPSE, withGrowth);
    pop();
    t += 0.01;
}

function drawCoils() {
    var withoutGrowth = false;
    for (var i = 0; i < 3; i++) {
        push();
        translate(75 * Math.cos(t + i), 75 * Math.sin(t + i));
        drawGrid(ELLIPSE, withoutGrowth);
        pop();
    }
    t += 0.01;
}

function drawKnots() {
    var withGrowth = true;
    for (var i = 0; i < layers; i++) {
        push();
        translate(windowWidth / 2, windowHeight / 2);
        var dir = (-1)**i;
        translate(50 * Math.cos(t + i) * dir, 50 * Math.sin(t + i) * dir);
       // rotate((t + i) * dir);
        rotate(2 * PI * i / layers * dir);
        drawGrid(ELLIPSE, withGrowth);
        pop();
    }
    t += 0.01;
}

function drawEllipseKaleidoscope() {
    var withoutGrowth = false;
    for (var i = 0; i < layers; i++) {
        push();
        var dir = (-1)**i;
        translate(windowWidth / 2, windowHeight / 2);
        rotate((t + i) * dir);
        drawGrid(ELLIPSE, true);
        pop();
    }
    t += 0.01;
}

function drawLineKaleidoscope() {
    var withoutGrowth = false;
    for (var i = 0; i < layers; i++) {
        push();
        var dir = (-1)**i;
        translate(windowWidth / 2, windowHeight / 2);
        rotate((t + i) * dir);
        drawGrid(LINE, withoutGrowth);
        pop();
    }
    t += 0.01;
}

function drawScales() {
    var withoutGrowth = false;
    for (var i = 0; i < layers; i++) {
        push();
        var dir = (-1)**i;
        translate(windowWidth / 2, windowHeight / 2);
        translate(50 * noise(t + 40, t + 40), 50 * noise(t + 40, t + 40));
        rotate((t + i) * dir);
        drawGrid(ELLIPSE, withoutGrowth);
        pop();
    }
    t += 0.01;
}


function drawRotatedLayers() {
    clear();
    background(0);
    var x = 0;
    var y = 0;
    for (var i = 0; i < layers; i++) {
        push();
        x = Math.cos(2 * PI * i/layers) * windowWidth / 2;
        y = Math.sin(2 * PI * i/layers) * windowHeight / 2;
        translate(x, y);
        //rotate(PI * i / layers);
        drawGrid(LINE);
        pop();
    }
}


function wave(xShift, yShift, centerX, centerY, size) {
    var xspacing = 50;    // Distance between each horizontal location
    var period = 500.0;   // How many pixels before the wave repeats
    if (xShift === undefined) {
        xShift = 0;
    }
    if (yShift === undefined) {
        yShift = 0;
    }
    if (size === undefined) {
        size = 5;
    }
    if (centerX === undefined) {
        centerX = windowWidth/2;
    }
    if (centerY === undefined) {
        centerY = windowHeight/2;
    }
    var cofactor = 50;
    return {
        xspacing: xspacing,    // Distance between each horizontal location
        yvalues: new Array(floor((windowWidth + xspacing)/xspacing)),
        theta: 0.0,
        amplitude: 75.0, // Height of wave
        period: period,   // How many pixels before the wave repeats
        dx: (TWO_PI / period) * xspacing / cofactor, // Value for incrementing x
        xShift: xShift,
        yShift: yShift,
        size: size,
        centerX: centerX,
        centerY: centerY,
        r: 0,
        g: 0,
        b: 0

    }
}
function drawWave(wave) {
    wave.theta = wave.theta + 0.05;

    // For every x value, calculate a y value with sine function
    var x = wave.theta;
    for (var i = 0; i < wave.yvalues.length; i++) {
        wave.yvalues[i] = sin(x) * wave.amplitude;
        x += wave.dx;
    }

    noStroke();
    var tt  = t/100;
    var r = 255 * noise(tt + 1, tt + 1);
    var g = 255 * noise(tt + 2, tt + 2);
    var b = 255 * noise(tt + 3, tt + 3);
    var coFactor = 2;
    stroke(r, g, b);
    //A simple way to draw the wave with an ellipse at each location
    for (var x = 0; x < wave.yvalues.length; x++) {
       line(x * wave.xspacing + wave.xShift * Math.cos(t/10),
            wave.centerY - coFactor * windowHeight * noise(tt + x, tt + x),
            x * wave.xspacing + wave.xShift * Math.cos(t/10),
            wave.centerY + coFactor * windowHeight * noise(tt + x, tt + x));
    }
    t += 0.002;
}

function keyTyped() {
    switch (key) {
        case "1":
            drawFunc = drawWaves(waves);
            break;
        case "2":
            drawFunc = drawSwirl;
            break;
        case "3":
            drawFunc = drawCoils;
            break;
        case "4":
            drawFunc = drawWobblingCircles;
            break;
        case "5":
            drawFunc = drawKnots;
            break;
        case "6":
            drawFunc = drawEllipseKaleidoscope;
            break;
        case "7":
            drawFunc = drawLineKaleidoscope;
            break;
        case "8":
            drawFunc = drawScales;
            break;
        case "9":
            drawFunc = drawMoire;
            break;
        case "0":
            drawFunc = drawRotatedLayers;
            break;
        case "c":
            clear();
            background(0);
            break;
        case "s":
            drawFunc = noOp;
            break;
        case "r":
            stallRotation = true;
            break;
    }
}

var waves = [];
function setup() {
    numberOfWaves = 25;
    var colors = [[255, 255, 255], [255, 0, 0], [0, 255, 0], [0, 0, 255]];
    for (var i = 0; i < numberOfWaves; i++) {
        var w = wave(100, 0, 0, 0);
        waves.push(w);
    }
    createCanvas(windowWidth, windowHeight);
    background(0);
}

function drawWaves(waves) {
    return function() {
        background(0);
        for (var i = 0; i < waves.length; i++) {
            push();
            translate(windowWidth / 2 + 50 * Math.cos(t/10), windowHeight / 2 + 50 * Math.sin(t/10));
            rotate((t/100+ i) * (-1)**i);
            drawWave(waves[i]);
            pop();
        }
        for (var i = 0; i < waves.length; i++) {
            push();
            translate(50 * Math.cos(t/10), 50 * Math.sin(t/10));
            rotate((t/1000 + i) * (-1)**i);
            drawWave(waves[i]);
            pop();
        }
        for (var i = 0; i < waves.length; i++) {
            push();
            translate(windowWidth * 50 * Math.cos(t/10), windowHeight + 50 * Math.sin(t/10));
            rotate((t/100 + i) * (-1)**i);
            drawWave(waves[i]);
            pop();
        }
        for (var i = 0; i < waves.length; i++) {
            push();
            translate(0, windowHeight + 50 * Math.sin(t/10));
            rotate((t/100 + i) * (-1)**i);
            drawWave(waves[i]);
            pop();
        }
        for (var i = 0; i < waves.length; i++) {
            push();
            translate(windowWidth + 50 * Math.cos(t/10), 0);
            rotate((t/100 + i) * (-1)**i);
            drawWave(waves[i]);
            pop();
        }
    }
}

function draw() {
    drawFunc();
}
