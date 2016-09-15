function Picture(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.canvasContext = this.canvas.getContext('2d');
    this.drawing = false;
    this.lastDrawnCoords = null;

    this.startImageData = null;

    this.addCanvasListeners();
    this.drawBoundaryLine();
    this.boundaryHeight = null;
}

Picture.prototype.setBoundaryHeight = function(height) {
  this.boundaryHeight = height;
}

Picture.prototype.setStartImageData = function(imageData) {
  this.startImageData = imageData;
}

Picture.prototype.getCurrentImageData = function() {
  return this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height - this.boundaryHeight);
}


Picture.prototype.clear = function () {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Picture.prototype.setPenColour = function (colour) {
    this.canvasContext.strokeStyle = colour;
}

Picture.prototype.setPenWidth = function(width) {
  this.canvasContext.lineWidth = width;
}

Picture.prototype.addCanvasListeners = function () {
    var that = this;
    this.canvas.onmousedown = function (e) { that.onCanvasMouseDown(e); };
    this.canvas.onmousemove = function (e) { that.onCanvasMouseMove(e); };
    this.canvas.onmouseup = function (e) { that.onCanvasMouseUp(e); };
    this.canvas.onmouseout = function (e) { that.onCanvasMouseOut(e); };
}

Picture.prototype.onCanvasMouseDown = function (e) {
    this.drawing = true;
    var canvasBoundingRect = this.canvas.getBoundingClientRect();
    this.draw(e.pageX - canvasBoundingRect.left, e.pageY - canvasBoundingRect.top, true);
}

Picture.prototype.onCanvasMouseMove = function (e) {
    if (this.drawing) {
        var canvasBoundingRect = this.canvas.getBoundingClientRect();
        this.draw(e.pageX - canvasBoundingRect.left, e.pageY - canvasBoundingRect.top);
    }
}

Picture.prototype.onCanvasMouseUp = function (e) {
    this.drawing = false;
}

Picture.prototype.onCanvasMouseOut = function () {
    this.drawing = false;
}

Picture.prototype.draw = function (x, y, starting) {
    this.canvasContext.beginPath();

    if (starting) {
        this.canvasContext.moveTo(x - 1, y - 1);
    }
    else {
        this.canvasContext.moveTo(this.lastDrawnCoords.x, this.lastDrawnCoords.y);
    }

    this.canvasContext.lineTo(x, y);
    this.lastDrawnCoords = {x: x, y: y};
    this.canvasContext.closePath();
    this.canvasContext.stroke();

    this.drawBoundaryLine();
    this.drawStartImage();
}

Picture.prototype.getDataURL = function () {
    return this.canvas.toDataURL();
}


Picture.prototype.drawBoundaryLine = function() {
  var boundaryHeight = 10;
  var boundaryLineY = this.canvas.height - boundaryHeight;
  var dashSize = 5;
  var spaceSize = 3;

  var currentStrokeStyle = this.canvasContext.strokeStyle;
  var currentLineWidth = this.canvasContext.lineWidth;

  this.canvasContext.strokeStyle = '#AAAAAA';
  this.canvasContext.lineWidth = 1;

  for (var i = 0; i < this.canvas.width; i += dashSize + spaceSize) {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(i, boundaryLineY);
    this.canvasContext.lineTo(i + dashSize, boundaryLineY);
    this.canvasContext.closePath();
    this.canvasContext.stroke();
  }

  //reset
  this.canvasContext.strokeStyle = currentStrokeStyle;
  this.canvasContext.lineWidth = currentLineWidth;
}

Picture.prototype.drawStartImage = function() {
  if (this.startImageData) {
    this.canvasContext.putImageData(this.startImageData, 0, 0);
  }
}

Picture.prototype.captureNextBoundary = function() {
  //var boundaryHeight = 10;
  var boundaryLineY = this.canvas.height - this.boundaryHeight;

  return this.canvasContext.getImageData(0, boundaryLineY + 1, this.canvas.width, this.canvas.height - (boundaryLineY + 1));
}