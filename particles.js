//DLA with particles Pierre MARZIN 19/09/2017
var parts=[];
var nparts=3000;
var maxspeed;
var heat;
var mainlayer, uplayer;
var showparts, end;
function setup() {
    createCanvas(600, 600, P2D);
    init();
}
function init() {
    showparts=true;
    end=false;
    maxspeed=random(1.5, 4);
    heat=pow(random(.2,1),.2);
    uplayer=createGraphics(width, height);
    uplayer.background(0, 0);
    uplayer.fill(255, 255, 0);
    uplayer.noStroke();
    mainlayer=createGraphics(width, height);
    mainlayer.background(0);
    mainlayer.stroke(255, 0, 0);
    mainlayer.strokeWeight(3);
    mainlayer.noFill();
    mainlayer.ellipse(width/2, height/2, 500, 500);
    mainlayer.noStroke();
    for (var i=0; i<nparts; i++) {
        parts[i]=new Part();
    }
    mainlayer.loadPixels();
}
function draw() {
    end=true;
    image(mainlayer, 0, 0);
    uplayer.clear();
    for (var i=0; i<nparts; i++) {
        if (parts[i].age<2.5)parts[i].update();
    }
    mainlayer.loadPixels();
    if (showparts)image(uplayer, 0, 0);
    if (end)setup();
}
function mousePressed() {
    showparts=!showparts;
}
function Part() {
    this.age=0;
    this.position=createVector(300, 300);//random(width), random(height));
    this.velocity=createVector(random(-maxspeed, maxspeed), random(-maxspeed, maxspeed));
    this.velocity.limit(maxspeed);
}
Part.prototype.update=function() {
    end=false;
    this.position.add(this.velocity);
    if (this.position.x>width ||this.position.x<0||this.position.y>height ||this.position.y<0)this.relocate();
    uplayer.fill(255,255-this.age*100,0);
    uplayer.ellipse(this.position.x, this.position.y, 3.5-this.age, 3.5-this.age);
    if (random(1)>heat) {
        this.velocity.x+=random(-maxspeed, maxspeed);
        this.velocity.y+=random(-maxspeed, maxspeed);
        this.velocity.limit(maxspeed);
    }
    if (mainlayer.pixels[4*(int(this.position.y)*width+int(this.position.x))]!=0) {
        //var vel=this.velocity.copy();
        //vel.normalize();
        this.position.sub(this.velocity);//vel);
        mainlayer.fill(255, this.age*100, 0);
        mainlayer.ellipse(this.position.x, this.position.y, 3.5-this.age, 3.5-this.age);
        this.age+=.5;
        this.relocate();
    }
}
Part.prototype.relocate=function() {
    this.position=createVector(300, 300);//random(width), random(height));
    this.velocity=createVector(random(-maxspeed, maxspeed), random(-maxspeed, maxspeed));
    this.velocity.limit(maxspeed);
}
