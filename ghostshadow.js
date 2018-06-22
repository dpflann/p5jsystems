var t;
var w = 400;
var h = 400;
var x = w / 2;
var y = h / 2;

function setup() {
    console.log(x,y);
    createCanvas(w, h);
    background(0);
    t = 0;
    // middle left
    // middle right
    // dots
}

function draw() {
    // sysmetric pyschadelic polka-dots beziers
    //fade the background by giving it a low opacity
    background(0, 5);
    // middle left
    // middle right
    // dots
    // 
    ghost(x, y);
    ghost(100 * noise(t), 100 * noise(t));
    ghost(100 * noise(t+10), 100 * noise(t+10));
    ghost(100 * noise(t+20), 100 * noise(t+20));
    ghost(100 * noise(t+30), 100 * noise(t+30));
    t = t + 0.01;
}

function ghost(x, y) {
    //var x = width * noise(t);
    //var y = height * noise(t+5);
    var r = 255 * noise(t+10);
    var g = 255 * noise(t+15);
    var b = 255 * noise(t+20);
    noStroke();

    fill(r, g, b);
    ellipse(x, y, 120 + (100 * noise(t+30)), 120 + (100 * noise(t+30)));
    //fill(255, 255, 255);
    fill([r,g,b].map(function(x) { return Math.abs(255 - x ) % 256; }));
    ellipse(x, y, 110, 110);
}

function bezierShape() {
    noStroke();
    beginShape();
    vertex(30, 20);
    bezierVertex(80, 20, 80, 75, 30, 75);
    bezierVertex(50, 80, 60, 25, 30, 20);
    endShape();
}
