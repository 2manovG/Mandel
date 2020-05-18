var canvas = document.getElementById("hDc");
var fpsText = document.getElementById("text");
var hdc = canvas.getContext("2d");
  
var width = canvas.width;
var height = canvas.height;

canvas.addEventListener('contextmenu', function(e) { if (e.button == 2) { e.preventDefault(); } });

var imageData = hdc.getImageData(0, 0, width, height);
var data = imageData.data;

function draw()
{
	let pframe = new Date().getTime();
	//start of calculation
	for (let x = 0; x < width; x++)
		for (let y = 0; y < height; y++)
		{
			let i = 4 * (x + y * width);
			data[i] = x / width * 255;
			data[i + 1] = y / height * 255;
			data[i + 2] = 128 + 127 * Math.sin(pframe / 1000.0);
			data[i + 3] = 255;
		}
	//end of calculation
	let now = new Date().getTime();
	fpsText.textContent = "" + (now - pframe); //show dt
	pframe = now;
	
	hdc.putImageData(imageData, 0, 0); //show pixels
}
setInterval(draw, 10);