var cW = window.innerWidth;
var cH = window.innerHeight;
var TwoPI = 2*Math.PI;
var p = 750;
var shapes = [];
var cellHeight = 15;
var cellWidth = 15;
var numberOfCells = 0;
var numberOfRows = 0;
var clearScreen = true;
//var img = null;
var images = [];
var nImages = 20;

var cell = function(x, y, w, h, t, color) {
  return {
    "x": x || 0,
    "y": y || 0,
    "w": w || 15,
    "h": h || 15,
    "t": t || 0,
    "color": color
  };
};

var drawCell = function(cell) {
  updateCell(cell);
  shiftColor(cell);
  smooth();
  fill(cell.color);
  noStroke();
  rect(cell.x, cell.y, cell.w, cell.h);
};


function shiftColor(cell) {
  var t = cell.t;
  var val = Math.floor(255 * Math.abs(2 * ((t / p) - Math.floor((t / p) + (1/2)))));
  cell.color = color(val, val, val);
  cell.t = (cell.t + 5) % p;
}

function updateCell(cell) {
  
}


function keyTyped() {
  var newT = 0;
  var alternate = false;
  var asRings = false;
  var remainder = 0;
  var doOp = true;
  var random = false;
  var gradient = false;
  var clockwise = false;
  var allAsOne = false;
  var move = false;
  var backToStart = false;
  var moveOnlyVerticallyUp = false;
  var moveOnlyVerticallyDown = false;
  var moveOnlyHorizontallyLeft = false;
  var moveOnlyHorizontallyRight = false;
  var direction = 1;
  var increaseRadius = false;
  var decreaseRadius = false;
  var drawTriangles = false;
  var drawEllipses = false;
  var drawLines = false;
  var flip = false;

  switch (key) {
    case "v":
      moveOnlyVerticallyUp = true;
      break;
    case "V":
      moveOnlyVerticallyDown = true;
      break;
    case "h":
      moveOnlyHorizontallyLeft = true;
      break;
    case "H":
      moveOnlyHorizontallyRight = true;
      break;
    case "a":
      allAsOne = true;
      break;
    case "A":
      allAsOne = true;
      alternate = true;
      break;
    case "s":
      break;
    case "S":
      newT = (.5) * p;
      break;
    case "g":
      clockwise = true;
      gradient = true;
      break;
    case "G":
      gradient = true;
      break;
    case "r":
    case "R":
      random = true;
      break;
    case "i":
    case "I":
      asRings= true;
      remainder = 1;
      break;
    case "o":
    case "O":
      asRings = true;
      remainder = 0;
      break;
    case "c":
      clearScreen = false;
      doOp = false;
      break;
    case "C":
      clearScreen = true;
      doOp = false;
      break;
    default:
      doOp = false;
  }
  if (!doOp) {
    return;
  }
  var counter = 0;
  for (var l = 0; l < numberOfRows; l++) {
    for (var c = 0; c < numberOfCells; c++) {
      var currentCell = shapes[l][c];
      if (random) {
        currentCell.t = Math.floor(Math.random() * p);
      } else if (asRings) {
        if (l % 2 === remainder) {
          currentCell.t = newT;
        } else {
          currentCell.t = (.5) * p;
        }
      } else if (gradient) {
        var coeff = currentCell.i / layerLength;
        if (clockwise) {
          coeff = 1 - coeff;
        }
        currentCell.t = Math.floor(coeff * p);
      } else if (allAsOne) {
        // [0, (.5)*p] --> range for black to white
        newT = Math.floor((counter / totalCircles) * (.5) * p);
        if (alternate) {
          newT = Math.floor((.5) * p - newT);
        }
        currentCell.t = newT;
        counter += 1;
      } else if (moveOnlyHorizontallyLeft) {
        newT = (1 - (c / numberOfCells)) * p;
        currentCell.t = newT;
      } else if (moveOnlyHorizontallyRight) {
        newT = (c / numberOfCells) * p;
        currentCell.t = newT;
      } else if (moveOnlyVerticallyUp) {
        newT = (1 - (l / numberOfRows)) * p;
        currentCell.t = newT;
      } else if (moveOnlyVerticallyDown) {
        newT = (l / numberOfRows) * p;
        currentCell.t = newT;
      } else {
        currentCell.t = newT;
        currentCell.t = newT;
      }
    }
  }
}



function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  numberOfRows = Math.floor(cH / cellHeight);
  numberOfCells = Math.floor(cW / cellWidth);
  for (var i=0; i < numberOfRows; i++) {
    shapes[i] = [];
    for (var j=0; j < numberOfCells; j++) {
      var randCol = Math.floor(255 * Math.random());
      shapes[i].push(cell(j*cellWidth,
                          i*cellHeight,
                          cellWidth,
                          cellHeight,
                          (1 - (i / numberOfRows)) * p, // Phase 
                          color(randCol, randCol, randCol)));
    }
  }
}

function draw() {
  frameRate(30);
  if (clearScreen) {
    clear();
  }
  for (var i=0; i < numberOfRows; i++) {
    for (var j=0; j < numberOfCells; j++) {
      drawCell(shapes[i][j]);
      //var randCol = Math.floor(255 * Math.random());
      //shapes[i][j].color = color(randCol, randCol, randCol);
    }
  }
}



/// CODE SAM[]DLE GRAVEYARD \\\
/*
   * These are attemtps with creating images for the animation
  img.loadPixels();
  for (var i=0; i < img.width; i++) {
    for (var j=0; j < img.height; j++) {
      var randCol = Math.floor(255 * Math.random());
      img.set(i, j, color(randCol, randCol, randCol));
    }
  }
  img.updatePixels();
  image(img, 0, 0, cW, cH);
  */
  /*
  var x = Math.floor(nImages * Math.random());
  image(images[x], 0, 0, cW, cH);
  */
  /*
   * These are attemtps with creating images for the animation
  for (var x=0; x < nImages; x++) {
    var img = createImage(cW, cH);
    img.loadPixels();
    for (var i=0; i < img.width; i++) {
      for (var j=0; j < img.height; j++) {
        var randCol = Math.floor(255 * Math.random());
        img.set(i, j, color(randCol, randCol, randCol));
      }
    }
    img.updatePixels();
    images.push(img);
  }
  */
  //image(img, 0, 0, cW, cH);
