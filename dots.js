 /* Shape Related Variable and Functions */
var centerX = Math.ceil(window.innerWidth / 2);
var centerY = Math.ceil(window.innerHeight/ 2);
var diameter = Math.min(centerX, centerY);
var outerCircles = [];
var innerCircles = [];
var TwoPI = 2*Math.PI;
var p = 750;
var edgeBuffer = 4;
var layers = [];
var cRadius = 20;
var totalCircles = 0;
var clearScreen = true;
var ringDistance = diameter - cRadius;
var TRIANGLE = "triangle";
var ELLIPSE = "ellipse";
var LINE = "line";
var BOX = "box";

var circle = function(i, x, y, radius, ringDistance, t, color) {
  return {
    "i": i,
    "position": {
      "vector": {
        "dx": 0,
        "dy": 0
      },
      "moving": false,
      "reset": false,
      "resetVelocity": false,
      "origin": {
        "x": -1,
        "y": -1
      },
      "x": x || 0,
      "y": y || 0
    },
    "radius": radius,
    "t": t,  // beginning point in triangle wave cycle
    "previousT": t,  // beginning point in triangle wave cycle
    "color": color, // must be a color object
    "shape": ELLIPSE,
    "flip": false
  };
};

function setCircleCenter(circle, i, total, ringDistance) {
  circle.position.x = Math.ceil(centerX + ringDistance * Math.cos(TwoPI * (i / total)));
  circle.position.y = Math.ceil(centerY + ringDistance * Math.sin(TwoPI * (i / total)));
  circle.position.origin.x = circle.position.x;
  circle.position.origin.y = circle.position.y;
  return circle;
}

function setPhase(circle, p) {
  cricle.t = p;
  return circle;
}

function shiftColor(circle) {
  var t = circle.t;
  var val = Math.floor(255 * Math.abs(2 * ((t / p) - Math.floor((t / p) + (1/2)))));
  circle.color = color(val, val, val);
  circle.t = (circle.t + 5) % p;
}

function updateColor(circle) {
  // 0 - 255 --> 255 - 0
  shiftColor(circle);
  return circle.color;
}

function placeCircles(ringDistance, radius, phaseT) {
  var circles = [];
  var edgeBuffer = 4; // don't pack the circles too close
  var numberOfCircles = Math.floor((2 * Math.PI * ringDistance) / (radius + edgeBuffer));
  totalCircles += numberOfCircles;
  for (var i = 0; i < numberOfCircles; i++) {
    var c = circle(i, 0, 0, radius, ringDistance, phaseT, color(0, 0, 0));
    c = setCircleCenter(c, i, numberOfCircles, ringDistance);
    circles.push(c);
  }
  return circles;
}

function updatePosition(circle) {
  // apply simple vector
  if (circle.position.reset) {
    // create a velocity back to the original position
    var xDistance = circle.position.x - circle.position.origin.x;
    var yDistance = circle.position.y - circle.position.origin.y;
    if (circle.position.resetVelocity) {
      // ensure we stick the landing
      if ((Math.abs(xDistance) < 2) && (Math.abs(yDistance) < 2)) {
        circle.position.x = circle.position.origin.x;
        circle.position.y = circle.position.origin.y;
        circle.position.resetVelocity = false;
        circle.position.reset = false;
        circle.position.moving = false;
        circle.position.vector.dx = 0;
        circle.position.vector.dy = 0;
      }
    } else {
      var dx = xDistance / 75;
      circle.position.vector.dx = -dx;
      var dy = yDistance / 75;
      circle.position.vector.dy = -dy;
      circle.position.resetVelocity = true;
    }
  }

  if (circle.position.moving) {
    circle.position.x += circle.position.vector.dx;
    circle.position.y += circle.position.vector.dy;
    applyBoundsCheck(circle);
  }

}

function applyBoundsCheck(circle) {
  // wrap the circle around the screen if necessary
  // update X
  if (circle.position.x > window.innerWidth) {
    circle.position.x = 0;
  } else if (circle.position.x < 0) {
    circle.position.x = window.innerWidth;
  }
  // update Y
  if (circle.position.y > window.innerHeight) {
    circle.position.y = 0;
  } else if (circle.position.y < 0) {
    circle.position.y = window.innerHeight;
  }
}

function degToRad(d) {
  console.log(d * Math.PI / 180);
  return (d * Math.PI / 180);
}

function updateCircles(circles) {
  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];
    // update circle position
    updatePosition(circle);
    // updateColor
    noStroke();
    smooth();
    var newColor = updateColor(circle);
    fill(newColor);
    var r = Math.round(circle.radius / 2);
    switch (circle.shape) {
      case TRIANGLE:
        // Draw Triangles
        var x1 = circle.position.x;
        var y1 = circle.position.y - 2*r; // go up -
        var x2 = Math.round(circle.position.x + Math.cos(degToRad(210))*r);
        var y2 = Math.round(circle.position.y + Math.sin(degToRad(210))*r);
        var x3 = Math.round(circle.position.x + Math.cos(degToRad(330))*r);
        var y3 = Math.round(circle.position.y + Math.sin(degToRad(330))*r);
        triangle(x1, y1, x2, y2, x3, y3);
        break;
      case ELLIPSE:
        // Draw Circles
        ellipse(circle.position.x, circle.position.y, circle.radius, circle.radius);
        break;
      case LINE:
        // Draw Lines
        stroke(newColor);
        if (circle.flip) {
          line(circle.position.x - circle.radius * 2,
              circle.position.y,
              circle.position.x + circle.radius * 2,
              circle.position.y);
        } else {
          line(circle.position.x,
              circle.position.y - circle.radius * 2,
              circle.position.x,
              circle.position.y + circle.radius * 2);
        }
        break;
    }
  }
}

var newOperation = function (key, value, preFunc) {
    var def = {
        "key": "",
        "value": "",
        "pre": noOp
    }
    def.key = key;
    def.value = value;
    if (preFunc !== null) {
      def.preFunc = preFunc;
    }
    return def;
}

function operate(operations) {
    var op = operations.pop();
    if (op === undefined) {
        return false;
    }
    console.log("Setting operation", op);
    op.pre();
    var result = operateOnKey(op.key);
    if (result !== null) {
      masterControl(result.newT, result.remainder, result.direction);
    }
    return true;
}

/* Processing Environment Related Functions */
function keyTyped() {
  console.log("Enter: keyTyped");
  var result = operateOnKey(key);
  if (result !== null) {
      console.log("Result is not null:", result);
      masterControl(result.newT, result.remainder, result.direction);
  }
  console.log("Exit: keyTyped");
}

var alternate = false;
var asRings = false;
var random = false;
var gradient = false;
var clockwise = false;
var allAsOne = false;
var move = false;
var backToStart = false;
var moveOnlyVertically = false;
var moveOnlyHorizontally = false;
var increaseRadius = false;
var decreaseRadius = false;
var drawTriangles = false;
var drawEllipses = false;
var drawLines = false;
var flip = false;

function defaultVars() {
  alternate = false;
  asRings = false;
  random = false;
  gradient = false;
  clockwise = false;
  allAsOne = false;
  move = false;
  backToStart = false;
  moveOnlyVertically = false;
  moveOnlyHorizontally = false;
  increaseRadius = false;
  decreaseRadius = false;
  drawTriangles = false;
  drawEllipses = false;
  drawLines = false;
  flip = false;
}

function operateOnKey(key) {
  var doOp = true;
  var newT = 0;
  var remainder = 0;
  var direction = 1;
  defaultVars();
  switch (key) {
  case "v":
    moveOnlyVertically = true;
    direction = -1;
    break;
  case "V":
    moveOnlyVertically = true;
    direction = 1;
    break;
  case "h":
    moveOnlyHorizontally = true;
    direction = -1;
    break;
  case "H":
    moveOnlyHorizontally = true;
    direction = 1;
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
  case "m":
    move = true;
    break;
  case "M":
    move = false;
    break;
  case "b":
  case "B":
    backToStart = true;
    break;
  case "c":
    clearScreen = false;
    doOp = false;
    break;
  case "C":
    clearScreen = true;
    doOp = false;
    break;
  case "=": // easier to press than holding shift, can easily move between - and + (proxy)
    increaseRadius = true;
    break;
  case "-":
    decreaseRadius = true;
    break;
  case "t":
    drawTriangles = true;
    break;
  case "e":
    drawEllipses = true;
    console.log("drawing ellipses");
    break;
  case "f":
    flip = true;
    break;
  case "l":
    drawLines = true;
    console.log("drawing lines");
    break;
  default:
    doOp = false;
  }
  if (!doOp) {
    console.log("!dOp: keyTyped");
    return null;
  }
  return {
    "newT": newT,
    "remainder": remainder,
    "direction": direction,
  }
};

function masterControl(newT, remainder, direction) {
  var counter = 0;
  for (var l = 0; l < layers.length; l++) {
    var layerLength = layers[l].length;
    for (var c = 0; c < layerLength; c++) {
      var currentC = layers[l][c];
      currentC.flip = currentC.flip ^ flip;;
      if (drawTriangles) {
        currentC.shape = TRIANGLE;
      } else if (drawEllipses) {
        currentC.shape = ELLIPSE;
      } else if (drawLines) {
        currentC.shape = LINE;
      }
      if (random) {
        currentC.t = Math.floor(Math.random() * p);
      } else if (asRings) {
        if (l % 2 === remainder) {
          currentC.t = newT;
        } else {
          currentC.t = (.5) * p;
        }
      } else if (gradient) {
        var coeff = currentC.i / layerLength;
        if (clockwise) {
          coeff = 1 - coeff;
        }
        currentC.t = Math.floor(coeff * p);
      } else if (allAsOne) {
        // [0, (.5)*p] --> range for black to white
        newT = Math.floor((counter / totalCircles) * (.5) * p);
        if (alternate) {
          newT = Math.floor((.5) * p - newT);
        }
        currentC.t = newT;
        counter += 1;
      } else if (move) {
        currentC.position.moving = true;
        currentC.position.reset = false;
        currentC.position.resetVelocity = false;
        currentC.position.vector.dx = ([-1,1][Math.round(Math.random())]) * Math.random();
        currentC.position.vector.dy = ([-1,1][Math.round(Math.random())]) * Math.random();
      } else if (backToStart) {
        currentC.position.moving = true;
        currentC.position.reset = true;
        currentC.position.resetVelocity = false;
        currentC.position.vector.dx = 0;
        currentC.position.vector.dy = 0;
      } else if (moveOnlyVertically) {
        currentC.position.moving = true;
        currentC.position.reset = false;
        currentC.position.resetVelocity = false;
        currentC.position.vector.dx = 0;
        // if initialized, the dy is 0..
        if (currentC.position.vector.dy === 0) {
          currentC.position.vector.dy = Math.random();
        }
        currentC.position.vector.dy = Math.abs(currentC.position.vector.dy) * direction;
      } else if (moveOnlyHorizontally) {
        currentC.position.moving = true;
        currentC.position.reset = false;
        currentC.position.resetVelocity = false;
        currentC.position.vector.dy = 0;
        // if initialized, the dy is 0..
        if (currentC.position.vector.dx === 0) {
          currentC.position.vector.dx = Math.random();
        }
        currentC.position.vector.dx = Math.abs(currentC.position.vector.dx) * direction;
      } else if (increaseRadius) {
        currentC.radius += 2;
      } else if (decreaseRadius) {
        currentC.radius -= 2;
        if (currentC.radius < 0) {
          currentC.radius = 0;
        }
      } else {
        currentC.t = newT;
        currentC.t = newT;
      }
    }
  }
};

function noOp() { return; }

function wait(t) {
    if (t < 10) {
        t = t * 1000;
    }
    setTimeout(t);
}

function commandsToOperations(commands) {
    var ops = [];
    for (var i = 0; i < commands.length; i++) {
        ops.push(newOperation(
            commands[i],
            true,
            noOp)
        );
    }
    return ops;
}

var commands = "";
function updateOperations() {
    console.log("Calling update operations");
    var parsedCommands = commandsToOperations(commands);
    if (parsedCommands.length > 0) {
        console.log("Updating operations via commands: ", parsedCommands);
        // globals
        operations = operations.concat(parsedCommands);
        commands = "";
    }
}
var operations = [
    newOperation("l", true, noOp),
    newOperation("e", true, noOp),
    newOperation("l", true, noOp),
    newOperation("e", true, noOp),
    newOperation("c", true, noOp),
    newOperation("m", true, noOp),
    newOperation("b", true, wait(3)),
    newOperation("m", true, wait(3)),
    newOperation("l", true, noOp),
    newOperation("=", true, noOp),
    newOperation("=", true, noOp),
    newOperation("=", true, noOp),
    newOperation("=", true, noOp),
    newOperation("-", true, noOp),
    newOperation("-", true, noOp),
    newOperation("-", true, noOp),
    newOperation("=", true, noOp)
];
var rate = 30;
function setup() {
  setInterval(
    function() { operate(operations) },
    2000
  );
  setInterval(
        updateOperations,
        10*1000
  );
  frameRate(rate);
  createCanvas(window.innerWidth, window.innerHeight);
  var L = Math.floor(ringDistance / (cRadius + edgeBuffer));
  for (var i = 1; i <= L; i++) {
    layers.push(placeCircles(ringDistance * (i/L), cRadius, (p * (i/L)), color(0, 0, 0)));
  }
}

function draw() {
  if (clearScreen) {
    clear();
  }
  for (var l = 0; l < layers.length; l++) {
    updateCircles(layers[l]);
  }
}
