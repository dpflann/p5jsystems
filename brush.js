function paintStroke(strokeLength, strokeColor, strokeThickness) {
    var stepLength = strokeLength/4.0;

    // Determines if the stroke is curved. A straight line is 0.
    var tangent1 = 0;
    var tangent2 = 0;

    var odds = random(1.0);

    if (odds < 0.7) {
        tangent1 = random(-strokeLength, strokeLength);
        tangent2 = random(-strokeLength, strokeLength);
    } 

    // Draw a big stroke
    noFill();
    stroke(strokeColor);
    strokeWeight(strokeThickness);
    curve(tangent1, -stepLength*2, 0, -stepLength, 0, stepLength, tangent2, stepLength*2);

    var z = 1;

    // Draw stroke's details
    for (var num = strokeThickness; num > 0; num --) {
        var offset = random(-50, 25);
        var newColor = color(red(strokeColor)+offset, green(strokeColor)+offset, blue(strokeColor)+offset, random(100, 255));

        stroke(newColor);
        strokeWeight(int(random(0, 3)));
        curve(tangent1, -stepLength*2, z-strokeThickness/2, -stepLength*random(0.9, 1.1), z-strokeThickness/2, stepLength*random(0.9, 1.1), tangent2, stepLength*2);

        z += 1;
    }
}

function paintShape(w, h, color, withFill, withStroke) {
    if (withFill === true) {
        fill(color);
    } else {
        noFill();
    }
    if (withStroke === true) {
        stroke(color);
    } else {
        noStroke();
    }
    ellipse(0, 0, w, h);
}

function impressionistBrushes() {
    translate(width/2, height/2);

    for (var i = 0; i < 200; i++) {
        var x = int(random(0, img.width));
        var y = int(random(0, img.height));
        // DPF how to speed up by indexing into img.pixels
        //var pixel = img.get(x, y);
        var index = 4 * (x + y * img.width);
        var pixelColor = color(
                /*
                pixel[0],
                pixel[1],
                pixel[2],
                pixel[3]
                */
                img.pixels[index],
                img.pixels[index + 1],
                img.pixels[index + 2],
                img.pixels[index + 3]
            );

            push();
            translate(x-img.width/2, y-img.height/2);
            rotate(radians(random(-90, 90)));

            //Paint by layers from rough strokes to finer details
        if (iterations < 20) {
                //Big rough strokes
                paintStroke(random(150, 250), pixelColor, int(random(20, 40)));
            } else if (iterations < 50) {
                //Thick strokes
                paintStroke(random(75, 125), pixelColor, int(random(8, 12)));
            } else if (iterations < 300) {
                //Small strokes
                paintStroke(random(30, 60), pixelColor, int(random(1, 4)));
            } else if (iterations < 350) {
                //Big dots
                //paintStroke(random(5, 20), pixelColor, int(random(5, 15)));
                //Small dots
                paintStroke(random(5, 10), pixelColor, int(random(1, 7)));
            } else if (iterations < 600) {
                //Small dots
                //paintStroke(random(1, 10), pixelColor, int(random(1, 7)));
                //Very small dots
                paintStroke(random(1, 5), pixelColor, int(random(1, 3)));
            }

            pop();
    }
    if (iterations > 600) {
        noLoop();
    }

}

function shaped() {
    translate(width/2, height/2);

    for (var i = 0; i < 200; i++) {
        var x = int(random(0, img.width));
        var y = int(random(0, img.height));
        // DPF how to speed up by indexing into img.pixels
        //var pixel = img.get(x, y);
        var index = 4 * (x + y * img.width);
        var pixelColor = color(
                /*
                pixel[0],
                pixel[1],
                pixel[2],
                pixel[3]
                */
                img.pixels[index],
                img.pixels[index + 1],
                img.pixels[index + 2],
                img.pixels[index + 3]
            );

            push();
            translate(x-img.width/2, y-img.height/2);
            rotate(radians(random(-90, 90)));

            //Paint by layers from rough strokes to finer details
        if (iterations < 20) {
                // (w, h, color)
                paintShape(random(150, 250), random(150, 250), pixelColor, true); 
            } else if (iterations < 50) {
                paintShape(random(75, 125), random(75, 125), pixelColor, true); 
            } else if (iterations < 300) {
                paintShape(random(30, 60), random(30, 60), pixelColor, true); 
            } else if (iterations < 350) {
                paintShape(random(5, 10), random(5, 10), pixelColor, true); 
            } else if (iterations < 600) {
                paintShape(random(1, 5), random(1, 5), pixelColor, true); 
            }

            pop();
    }
    if (iterations > 600) {
        noLoop();
    }
}


var img;
var originalImg;
var canvas;
function preload() {
      //img = loadImage('assets/skull1.jpg');
      //img = createImg('https://cdn.figuren-shop.de/media/image/15/b0/35/Totenkopf-Silberfarben_1280x1280.jpg');
    //var url = "https://instagram.fatl1-2.fna.fbcdn.net/vp/102b6f126760da144cb761c2addf000c/5C8C02E0/t51.2885-15/e35/44431528_260334491294998_1684650958900430454_n.jpg";
    var url = "https://instagram.fatl1-2.fna.fbcdn.net/vp/fcfe62cc4e501624cc11be789c2ee9af/5C8E46EF/t51.2885-15/e35/46816271_389026878307466_7567294214358021916_n.jpg";
    //var url = "https://ae01.alicdn.com/kf/HTB1sw4gX8jTBKNjSZFDq6zVgVXak/ZABRA-Luxury-Solid-925-Sterling-Silver-Skull-Ring-Men-Vintage-Punk-Rock-Cross-Gold-Big-Heavy.jpg_640x640.jpg";
}

function loadAndAssignImg(url) {
    loadImage(url,
        function(i) {      
          img = i;
          originalImg = createImg(url);
          img.loadPixels();
          if (img.width > 950 && img.height > 700) {
                img.resize(950, 700);
                originalImg.size(950, 700);
           }
           originalImg.hide();
           originalImg.position(width/4 + 15, 200);
           // Attach listeners for mouse events related to img.
            originalImg.mousePressed(uniHide);
            canvas.mousePressed(function() {
                originalImg.show();
            });
            loop();
            background(0);
            iterations = 0;
        }, function(e) {
            console.log(e);
        });
}

var input, button, greeting, saveButton;
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    background(0);
    frameRate(30);

    input = createInput();
    input.position(20, 65);

    button = createButton('submit');
    button.position(input.x + input.width, 65);
    button.mousePressed(getImage);

    greeting = createElement('h2', 'Input Image URL');
    greeting.position(20, 5);
    
    saveButton = createButton('save');
    saveButton.position(input.x + input.width, 100);
    saveButton.mousePressed(saveIt);

    textAlign(CENTER);
    textSize(50);
}

function saveIt() {
    saveCanvas(canvas, 'canvas','jpg');
}

function getImage() {
    var url = input.value();
    loadAndAssignImg(url);
}

var iterations = 0;
function draw() {
    if (img) {
        impressionistBrushes();
        //shaped();
        iterations += 1;
    }
}

function uniHide() {
    if (originalImg) {
        originalImg.hide();
    }
}

function uniShow() {
  if (originalImg) {
      originalImg.show();
  }
}
