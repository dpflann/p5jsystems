var cW = window.innerWidth;
var cH = window.innerHeight;
var TwoPI = 2*Math.PI;
// p was removed because now we transitioning between different colors points
// the phase function was useful for moving between two colors
// var t = Math.abs(2 * ((t / p) - Math.floor((t / p) + (1/2))));
// cell.t = newT % (p + 1);
// (1 - (i / numberOfRows)) * p, // Phase
var shapes = [];
var cellHeight = 30;
var cellWidth = cellHeight;
var numberOfCells = 0;
var numberOfRows = 0;
var clearScreen = true;
var gradientColors = [[100, 25, 255], [255, 255, 255], [0, 0, 255], [255, 60, 100], [45, 125, 200]];
var RECT = 0;
var ELLIPSE = 1;

var cell = function(x, y, w, h, t, cellColor) {
  return {
    "x": x || 0,
    "y": y || 0,
    "w": w || 15,
    "h": h || 15,
    "t": t || 0, // a value between [0,1)
    "color": cellColor,
    "colorIndex": 0,
    "colors": Object.assign([], gradientColors),
    "shape": RECT,
    "groups": {
        "squares": -1
    }
  };
};

var drawCell = function(cell) {
  updateCell(cell);
  shiftColor(cell);
  smooth();
  fill(cell.color);
  noStroke();
  if (cell.shape == RECT) {
    rect(cell.x, cell.y, cell.w, cell.h);
  } else if (cell.shape == ELLIPSE) {
    ellipse(cell.x + cell.w / 2, cell.y + cell.h / 2, cell.w, cell.h);
  }
};

/*
* 000000000
* 011111110
* 012222210
* 012333210
* 012343210
* 012333210
* 012222210
* 011111110
* 000000000
*/
function assignSquareGroups(cells) {
    var cellsLen = cells.length;
    var groups = Math.ceil(cellsLen / 2);
    for (var i = 0; i < groups; i++) {
        var len = cells[i].length;
        var mid = Math.ceil(len / 2);
        var gs = [];
        for (var k = 0; k <= i; k++) {
            gs.push(k);
        }
        var currentGroup = gs.shift();
        // There has to be a simpler mathematical way, I'm sad....
        for (var j = 0; j <= mid; j++) {
            console.log("Setting squares", i, j, k, currentGroup);
            cells[i][j]["groups"]["squares"] = currentGroup;
            cells[i][len - 1 - j]["groups"]["squares"] = currentGroup;
            cells[cellsLen - 1 - i][j]["groups"]["squares"] = currentGroup;
            cells[cellsLen - 1 - i][len - 1 - j]["groups"]["squares"] = currentGroup;
            var nextGroup = gs.shift();
            if (nextGroup !== undefined) {
                currentGroup = nextGroup;
            }
        }
    }
}


function shiftColor(cell) {
  var t = cell.t;

  // determine "distance between colors"
  var ci = cell.colorIndex;
  var cj = (cell.colorIndex + 1) % cell.colors.length;

  var R = (cell.colors[ci][0] + Math.floor((cell.colors[cj][0] - cell.colors[ci][0])) * t) % 256;
  var G = (cell.colors[ci][1] + Math.floor((cell.colors[cj][1] - cell.colors[ci][1])) * t) % 256;
  var B = (cell.colors[ci][2] + Math.floor((cell.colors[cj][2] - cell.colors[ci][2])) * t) % 256;

  cell.color = color(R, G, B);

  var newT = (t + .02);
  if (newT > .97) { // this is a "magic" threshold, arbitrarily/intuitively selected...
    cell.colorIndex = cj;
    newT = 0;
  }
  cell.t = newT % 1;
};

function updateCell(cell) {};

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
  var moveVerticallyUp = false;
  var moveVerticallyDown = false;
  var moveHorizontallyLeft = false;
  var moveHorizontallyRight = false;
  var moveDiagonallyRightDown = false;
  var moveDiagonallyLeftUp = false;
  var moveDiagonallyRightUp = false;
  var moveDiagonallyLeftDown = false;
  var direction = 1;
  var increaseRadius = false;
  var decreaseRadius = false;
  var drawEllipses = false;
  var drawRects = false;
  var drawLines = false;
  var flip = false;
  var squares = false;

  switch (key) {
    case "v":
      moveVerticallyUp = true;
      break;
    case "V":
      moveVerticallyDown = true;
      break;
    case "h":
      moveHorizontallyLeft = true;
      break;
    case "H":
      moveHorizontallyRight = true;
      break;
    case "d":
      moveDiagonallyRightDown = true;
      break;
    case "D":
      moveDiagonallyLeftUp = true;
      break;
    case "w":
      moveDiagonallyRightUp = true;
      break;
    case "W":
      moveDiagonallyLeftDown = true;
      break;
    case "a":
      allAsOne = true;
      break;
    case "A":
      allAsOne = true;
      alternate = true;
      break;
    case "s":
      squares = true;
      break;
    case "S":
      newT = (.5);
      break;
    case "g":
      clockwise = true;
      gradient = true;
      break;
    case "G":
      gradient = true;
      break;
    case "R":
      random = true;
      break;
    case "r":
      drawRects = true;
      break;
    case "e":
      drawEllipses = true;
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
      if (drawEllipses) {
        currentCell.shape = ELLIPSE;
      } else if (drawRects) {
        currentCell.shape = RECT;
      }
      if (random) {
        currentCell.t = Math.floor(Math.random());
      } else if (asRings) {
        if (l % 2 === remainder) {
          currentCell.t = newT;
        } else {
          currentCell.t = (.5);
        }
      } else if (gradient) {
        var coeff = currentCell.i / layerLength;
        if (clockwise) {
          coeff = 1 - coeff;
        }
        currentCell.t = Math.floor(coeff);
      } else if (allAsOne) {
        // [0, (.5)*p] --> range for black to white
        newT = Math.floor((counter / totalCircles) * (.5));
        if (alternate) {
          newT = Math.floor((.5) - newT);
        }
        currentCell.t = newT;
        counter += 1;
      } else if (moveHorizontallyLeft) {
        newT = (1 - (c / numberOfCells));
        currentCell.t = newT;
        // without reseting the colorIndex - this resulted in a patchwork of colors
        currentCell.colorIndex = 0;
      } else if (moveHorizontallyRight) {
        newT = (c / numberOfCells);
        currentCell.t = newT;
        // without reseting the colorIndex - this resulted in a patchwork of colors
        currentCell.colorIndex = 0;
      } else if (moveVerticallyUp) {
        newT = (1 - (l / numberOfRows));
        currentCell.t = newT;
        // without reseting the colorIndex - this resulted in a patchwork of colors
        currentCell.colorIndex = 0;
      } else if (moveVerticallyDown) {
        newT = (l / numberOfRows);
        currentCell.t = newT;
        // without reseting the colorIndex - this resulted in a patchwork of colors
        currentCell.colorIndex = 0;
      } else if (moveDiagonallyRightDown) {
        newT = (1 - ((l + c) / (numberOfRows + numberOfCells)));
        currentCell.t = newT;
        // without reseting the colorIndex - this resulted in a patchwork of colors
        currentCell.colorIndex = 0;
      } else if (moveDiagonallyLeftUp) {
        newT = ((l + c) / (numberOfRows + numberOfCells));
        currentCell.t = newT;
        // without reseting the colorIndex - this resulted in a patchwork of colors
        currentCell.colorIndex = 0;
      } else if (moveDiagonallyLeftDown) {
        newT = ((Math.abs(l - numberOfRows) + c) / (numberOfRows + numberOfCells));
        currentCell.t = newT;
        // without reseting the colorIndex - this resulted in a patchwork of colors
        currentCell.colorIndex = 0;
      } else if (moveDiagonallyRightUp) {
        newT = ((l + c) / (numberOfRows + numberOfCells));
        newT = (1 - ((Math.abs(l - numberOfRows) + c) / (numberOfRows + numberOfCells)));
        currentCell.t = newT;
        // without reseting the colorIndex - this resulted in a patchwork of colors
        currentCell.colorIndex = 0;
      } else if (squares) {
        // adjust the newT based upon the group number
        newT = (currentCell.groups.squares / numberOfRows / 2);
        currentCell.t = newT;
        currentCell.colorIndex = 0;
      }
    }
  }
};

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
                          (1 - (i / numberOfRows)),
                          color(randCol, randCol, randCol)));
    }
  }
  assignSquareGroups(shapes);
};

function draw() {
  frameRate(30);
  if (clearScreen) {
    clear();
  }
  for (var i=0; i < numberOfRows; i++) {
    for (var j=0; j < numberOfCells; j++) {
      drawCell(shapes[i][j]);
    }
  }
};
