var pic;
var picsDone = 0;
var picYPos = 0;
var boundaryHeight = 10;

window.onload = function () {
    pic = new Picture('picture');
    pic.setBoundaryHeight(boundaryHeight);
    setUpControls();
}

function setUpControls() {
    var pencilButton = document.getElementById('pencilButton');
    var eraserButton = document.getElementById('eraserButton');

    pencilButton.onmouseup = function (e) { selectPencil(); };
    eraserButton.onmouseup = function (e) { selectErasor(); };

    //select pencil by default
    selectPencil();

    var doneButton = document.getElementById('doneButton');
    doneButton.onmouseup = function () { nextImage(); };
}


function selectPencil() {
    var pencilButton = document.getElementById('pencilButton');
    var eraserButton = document.getElementById('eraserButton');
    pencilButton.setAttribute('inUse', 'true');
    eraserButton.removeAttribute('inUse');

    pic.setPenColour('#000000');
    pic.setPenWidth(1);
}

function selectErasor() {
    var pencilButton = document.getElementById('pencilButton');
    var eraserButton = document.getElementById('eraserButton');
    eraserButton.setAttribute('inUse', 'true');
    pencilButton.removeAttribute('inUse');

    pic.setPenColour('#ffffff');
    pic.setPenWidth(5);

}

function saveImage() {
    setPicDataURL();
}

function nextImage() {
  var nextImageStart = pic.captureNextBoundary();

  //get current image data
  var currentPicData = pic.getCurrentImageData();

  //draw onto full canvas
  var fullCanvas = document.getElementById('fullPic');
  fullCtx = fullCanvas.getContext('2d');
  fullCtx.putImageData(currentPicData, 0, picYPos);

  //draw pic onto offscreen canvas so we can save the image
  var offscreenPic = document.createElement('canvas');
  var offscreenPicCtx = offscreenPic.getContext('2d');
  offscreenPic.width = currentPicData.width;
  offscreenPic.height = currentPicData.height;
  offscreenPicCtx.putImageData(currentPicData, 0, 0);

  //get dataURL from offscreen canvas - then we can send it off to a server or something I guess ...
  var currentPicDataURL = offscreenPic.toDataURL();



  picsDone++;
  picYPos += currentPicData.height;

  //clear current canvas for the next pic
  pic.clear();
  pic.setStartImageData(nextImageStart);

  pic.drawBoundaryLine();
  pic.drawStartImage();
}

function setPicDataURL() {
    var dataURL = pic.getDataURL();

    var imageEl = document.getElementById('canvasSaved');
    imageEl.src = dataURL;

}