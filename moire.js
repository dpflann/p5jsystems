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

//var clearing = setInterval(function() { clear(); background(0); }, 2000);

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
                stroke(r, g, b);
                line(j * colLen, i * rowLen, (j + 1) * colLen, (i + 1) * rowLen);
            } else {
                fill(r, g, b);
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
        //line(i, 0, i, windowHeight);
        noFill();
        stroke(r, g, b);
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
        rotate((t + i) * dir);
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
        translate(i * windowWidth / layers, i * windowHeight / layers);
        //translate(windowWidth / 2, windowHeight / 2);
        rotate(((2*PI * i / layers) + t) * dir);
        //rotate((t + i) * dir);
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
        translate(noise(t) * 50 * dir, noise(t) * 50 * dir);
        rotate(((2*PI * i / layers) + t) * dir);
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
        //translate(50 * noise(t + 40, t + 40), 50 * noise(t + 40, t + 40)); 
        translate(100 * Math.random() * dir, 100 * Math.random() * dir);
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
        // IDEA: place the layers on points of an ellipse surrounding the canvas
        // rotation may not be necessary
        x = Math.cos(2 * PI * i/layers) * windowWidth / 2; 
        y = Math.sin(2 * PI * i/layers) * windowHeight / 2; 
        translate(x, y);
        //rotate(PI * i / layers); 
        drawGrid(LINE);
        pop();

    }
}


function wave(xShift, yShift, size) {
    var xspacing = 16;    // Distance between each horizontal location
    var period = 500.0;   // How many pixels before the wave repeats
    if (xShift === undefined) {
        xShift = 0;
    }
    if (yShift === undefined) {
        yShift = 0;
    }
    if (size === undefined) {
        size = 16;
    }
    return {
        xspacing: xspacing,    // Distance between each horizontal location
        yvalues: new Array(floor((windowWidth + xspacing)/xspacing)),
        theta: 0.0,
        amplitude: 75.0, // Height of wave
        period: period,   // How many pixels before the wave repeats
        dx: (TWO_PI / period) * xspacing, // Value for incrementing x
        xShift: xShift,
        yShift: yShift,
        size: size
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
    var r = 255 * noise(t + 10, t + 10);
    var g = 255 * noise(t + 20, t + 20);
    var b = 255 * noise(t + 30, t + 30);
    fill(r, g, b);
    //A simple way to draw the wave with an ellipse at each location
    for (var x = 0; x < wave.yvalues.length; x++) {
        ellipse(x * wave.xspacing + wave.xShift, windowHeight/2 + wave.yvalues[x] + wave.yShift, wave.size);
    }
    t += 0.01;
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
// what is happening here with the waves?
// I had a lot of trouble updating the waves' properties
// I would prefer an OOP-like approach
var waves = []; 
function setup() {
    for (var i = 0; i < 2; i++) {
        waves.push(wave(i * 20, 0)); 
    }
    for (var i = 0; i < 2; i++) {
        waves.push(wave(0, 50 + i * 20)); 
    }
    createCanvas(windowWidth, windowHeight);
    background(0);
}

function drawWaves(waves) {
    return function() {
        background(0);
        for (var i = 0; i < waves.length; i++) {
            drawWave(waves[i]);
        }
    }
}

function draw() {
    drawFunc();
}
