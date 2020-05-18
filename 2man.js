var canvas = document.getElementById("hDc");
var hdc = canvas.getContext("2d");

canvas.addEventListener('contextmenu', function(e) { if (e.button == 2) { e.preventDefault(); } });
  
var width = canvas.width;
var height = canvas.height;
var keys = [], pkeys = [], mouse = [], pmouse = [];
var mouseX, mouseY;

function keyDownHandler(e){keys[e.keyCode] = true;}
function keyUpHandler(e){keys[e.keyCode] = false;}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function mouseMoveHandler(e){mouseX = e.offsetX; mouseY = e.offsetY;}
function mouseDownHandler(e){mouse[e.button] = true;}
function mouseUpHandler(e){mouse[e.button] = false;}

canvas.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("mousedown", mouseDownHandler, false);
canvas.addEventListener("mouseup", mouseUpHandler, false);

function intersect(x1, y1, w1, h1, x2, y2, w2, h2)
{
    return (Math.max(x1+w1, x2+w2) - Math.min(x1, x2) < w1+w2) &&
        (Math.max(y1+h1, y2+h2) - Math.min(y1, y2) < h1+h2);
}

function keyPressed(k)
{
	let ik = k.charCodeAt(0);
	return keys[ik] && !pkeys[ik];
}