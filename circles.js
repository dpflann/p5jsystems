var noOp = function() {};
var drawFunc = noOp;
var t = 0;
var tDelta = 0.05;
var D = 0;
var rotateFunc = function(c) {};
var shiftTranslate = true;
var curZ = 0;

function keyTyped() {
    switch (key) {
        case "1":
            drawFunc = drawLinedCircles;
            break;
        case "2":
            drawFunc = drawSpiralingSquares;
            break;
        case "x":
            rotateFunc = rotateX;
            break;
        case "y":
            rotateFunc = rotateY;
            break;
        case "z":
            rotateFunc = rotateZ;
            break;
        case "n":
            shiftTranslate = false;
            break;
        case "N":
            shiftTranslate = true;
            break;
        case "c":
            clear();
            background(0);
            break;
        case "s":
            drawFunc = noOp;
            break;
    }
}

var coef = 1;
function drawSpirals(centerX, centerY, c, rot, shift, colorBase) {
    var weight = 1.5;
    var w = windowWidth;
    var h = w;
    var d = 24;
    var delta = (2 * PI) / d;
    var theta = 0;
    var rCoef = 1;
    var wDampen = (1/1.15);;
    var tDampen = d / w;
    tDampen = (1/25);
    if (c !== undefined) { rCoef = c; }
    if (rot === undefined) { rot = rotateX; }
    if (shift === undefined) { shift = 0; }
    if (colorBase === undefined) { colorBase = 0; }
    for (var i = 1; i <= d; i++) {
       push();
       //translate(centerX + Math.cos(rCoef * t * tDampen) * 100, centerY + Math.sin(rCoef * t * tDampen) * 100);
       //translate(centerX * Math.cos(rCoef * t * tDampen), centerY * Math.sin(rCoef * t * tDampen));
       var st = 500 * Math.cos(rCoef * (t * tDampen + shift));
       var st = shift + 500 * Math.cos(rCoef * (t * tDampen));
       if (shiftTranslate) {
           curZ = st;
           // keep at current Z
           translate(centerX, centerY, st);
       } else {
           translate(centerX, centerY, curZ);
       }
       //translate(centerX, centerY + Math.sin(D + shift) * 100);
       var rVal = rCoef * (delta * i + (t * tDampen * i));
       rVal = rCoef * t * tDampen;
       rot(rVal);
       noFill();
       //w = w / 1.5 * 1.414 - weight;
       w = w * wDampen;
       if (i > d) {
           rotateZ(rVal);
           fill(
               255 * noise(t * tDampen + 10) + t,
               255 * noise(t * tDampen + 20) + t,
               255 * noise(t * tDampen + 30) + t
           );

       } else {
           strokeWeight(weight);
           stroke(
               (255 - colorBase) * noise(t/50+ 10) + colorBase,
               (255 - colorBase) * noise(t/50 + 20) + colorBase,
               (255 - colorBase) * noise(t/50 + 30) + colorBase
           );
       }
       //box(w/2 + w/2 * Math.sin(D + shift));
       box(w);
       //rect(-w / 2, -w / 2, w, w);
       pop();
       t += 0.001 * coef;
    }
    function applyBounds(t) {
        if (t > 130) {
            t = 130;
            coef = -1;
        } else if (t < 85) {
            t = 85;
            coef = 1;
        }
    }
    //applyBounds(t);
}

function drawSpiralingSquares() {
    var cX = 0;
    var cY =  0;
    var v = 500;
    var yScaler = 0.75;
    // X formation
    // 3D
    var shift = PI/10;
    shift =  -200;
    shift = 0;
    drawSpirals(cX, cY, 1, rotateFunc);
    // 4 3 2 1 0 1 2 3 4 //
    // outer 
    drawSpirals(cX + v * 2, cY, 1, rotateFunc, shift * 4, 25);
    drawSpirals(cX - v * 2, cY, -1, rotateFunc, shift * 4, 25);
    drawSpirals(cX + v * 1.5, cY, 1, rotateFunc, shift * 3, 50);
    drawSpirals(cX - v * 1.5, cY, -1, rotateFunc, shift * 3, 50);
    drawSpirals(cX - v, cY, 1, rotateFunc, shift * 2, 75)
    drawSpirals(cX + v, cY, -1, rotateFunc, shift * 2, 75);
    drawSpirals(cX + v / 2, cY, 1, rotateFunc, shift, 100);
    drawSpirals(cX - v / 2, cY, -1, rotateFunc, shift, 100);
    D += 0.01;
    /*
    drawSpirals(cX, cY, 1, rotateZ);
    drawSpirals(cX - v, cY, 1, rotateY);
    drawSpirals(cX + v, cY, -1, rotateY);
    drawSpirals(cX, cY + v, 1, rotateX);
    drawSpirals(cX, cY - v, -1, rotateX);
    */
    /* 2D
    drawSpirals(v, 0, -1, rotateX);
    drawSpirals(-v, 0, 1, rotateX);
    drawSpirals(0, v * yScaler, -1, rotateY);
    drawSpirals(0, -v * yScaler, 1, rotateY);
    */
}


function drawPendulaWave() {
    var cX = windowWidth / 2;
    var cY = windowHeight / 2;
    var R = 50;
    var r = 50;
    var n = 5;
    for ( var i = 0; i < n; i++) {
        drawPendulum(cX, cY, R + i * r, r, t, 0.04 - i/5);
    }
}

function drawPendulum(x, y, R, r, t, B) {
    // x, y will be the center around which
    // the object will rotate.
    if (t > (PI - B)) {
        tDelta = -0.01;
        t = PI - B;
    } else if (t < B) {
        tDelta = 0.01;
        t = B;
    }
    ellipse(x + Math.cos(t) * R, y + Math.sin(t) * R, r, r);
    t += tDelta;
}

function drawLinedCircles() {
    var fs = [];
    var r = 600;
    var n = 10;
    for (var i = 0; i < n; i++) {
        // begin circle
        push();
        // translate how?
        translate(windowWidth / 2, windowHeight / 2);
        rotate((-1)**i * ((2 * PI * i) / n + t/n));
        drawLinedCircle(0, 0, r, 60);
        pop();
        // end circle
        t += 0.01;
    }
}

function drawLinedCircle(x, y, r, n) {
    function star() {
        var delta = PI / n;
        var theta = 0;
        stroke(255, 0, 0);
        for (var i = 0; i < n; i++) {
            // picking two points on the circle, opposite eachother
            // moving from `left` to `right`
            // then drawing a line between those points
            // circle is bound by these values
            var x1 = x + Math.cos(theta + t) * r;
            var y1 = y + Math.sin(theta + t) * r;
            var x2 = x - Math.cos(theta + t) * r;
            var y2 = y - Math.sin(theta + t) * r;
            line(x1, y1, x2, y2);
            theta += delta;
        }
        t += 0.01;
    };
    function grate(x, y, r, n) {
        var delta = (PI / 2) / (n / 2);
        var theta = 0;
        stroke(255 * noise(t / 50 + 10), 255 * noise(t / 50 + 20), 255  * noise(t / 50 + 30));
            // picking two points on the circle, opposite eachother
            // moving from `left` to `right`
            // then drawing a line between those points
            // circle is bound by these values
            // adding t causes a nice effect of growth and contractions of the lines
            /*
            var x1 = x + Math.cos(theta + t) * r;
            var x2 = x + Math.cos(PI - theta + t) * r;
            line(x1, topY, x2, topY);
            line(x1, bottomY, x2, bottomY);
            topY += dy;
            bottomY -= dy;
            theta += delta;
            */
            // only move along the 1st quadrant.
            // [0, PI / 2];
        for (var i = 0; i < Math.floor(n / 2); i++) {
            if (theta != 0) {
                line(
                    x - Math.floor(r * Math.cos(theta)),
                    y - Math.floor(r * Math.sin(theta)),
                    x + Math.floor(r * Math.cos(theta)),
                    y - Math.floor(r * Math.sin(theta))
                );
            }
            line(
                x - Math.floor(r * Math.cos(theta)),
                y + Math.floor(r * Math.sin(theta)),
                x + Math.floor(r * Math.cos(theta)),
                y + Math.floor(r * Math.sin(theta))
            )
            theta = theta + delta;
        }
    };
    //grate(x, y, r, n);
    grate(x + Math.cos(t/100) * r/2, y + Math.sin(t/100) * r/2, r/2, n);
    grate(x - Math.cos(t/100) * r/2, y - Math.sin(t/100) * r/2, r/2, n);
    //grate(x, y, r, n);
    //grate(x + noise(t/100) * r/2, y + noise(t/100) * r/2, r / 2, n / 2);
    //grate(x - noise(t/100) * r/2, y - noise(t/100) * r/2, r / 2, n / 2);
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(0);
}

function draw() {
    //clear();
    background(0);
    drawFunc();
}
