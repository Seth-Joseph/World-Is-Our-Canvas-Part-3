var canvas;
var drawing = [];
var currentPath = [];
var isDrawing = false;

function setup() {
  canvas = createCanvas(1100, 600);
  canvas.mousePressed(startPath);
  canvas.parent('canvascontainer');
  canvas.mouseReleased(endPath);
  var saveButton = select('#saveButton');
  saveButton.mousePressed(saveDrawing);

  var clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);

  database = firebase.database();
  var ref = database.ref('drawings');
  ref.on('value', gotData, errData);
}

function startPath() {
  isDrawing = true;
  currentPath = [];
  drawing.push(currentPath);
}
function endPath() {
  isDrawing = false;
}

function draw() {
  background(255, 255, 255);

  if (isDrawing) {
    var point = {
      x: mouseX,
      y: mouseY,
    };
    currentPath.push(point);
  }
  beginShape();
  stroke(0);
  strokeWeight(4);
  noFill();
  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];
    beginShape();
    for (var j = 0; j < path.length; j++) {
      vertex(path[j].x, path[j].y);
    }

    endShape();
  }
}

function saveDrawing() {
  var ref = database.ref('drawings');
  var data = {
    drawing: drawing,
  };
  ref.push(data);
  alert('Drawing saved.');
}
function clearDrawing() {
  drawing = [];
}

function gotData(data) {
  var elements = selectAll('.listing');
  for (var i = 0; i < elements.length; i++) {
    elements[i].remove();
  }

  var drawings = data.val();
  var keys = Object.keys(drawings);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var li = createElement('li', '');
    li.class('listing');
    var ahref = createA('#', key);
    // ahref.title('drawing')
    ahref.mousePressed(showDrawing);
    ahref.parent(li);
    li.parent('drawinglist');
  }
}

function errData(err) {
  console.log(err);
}

function showDrawing() {
  var key = this.html();
  var ref = database.ref('drawings/' + key);
  ref.on('value', oneDrawing, errData);

  function oneDrawing(data) {
    var dbdrawing = data.val();
    drawing = dbdrawing.drawing;
    console.log(drawing);
  }
}
