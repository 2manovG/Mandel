var canvas = document.getElementById("hDc");
var fpsText = document.getElementById("text");
var hdc = canvas.getContext("2d");
  
var width = canvas.width;
var height = canvas.height;

//canvas.addEventListener('contextmenu', function(e) { if (e.button == 2) { e.preventDefault(); } });

var imageData = hdc.getImageData(0, 0, width, height);
var data = imageData.data;
var pixels = [];
for (let i = 0; i < width * height; i++) pixels.push(0);
//--------------------------------------------------------

function Mandel(r, i, maxIter)
{
	let cx = r, cy = i, nr, ni;
	for (let iter = 0; iter < maxIter; iter++)
	{
		if (r * r + i * i > 4) return iter;
		nr = r * r - i * i + cx;
		ni = 2 * r * i + cy;
		r = nr;
		i = ni;
	}
	return 0;
}

function Render()
{
	//setup
	let maxIter = 1024, scale = 0.0175, cx = -1.36022, cy = 0.0653316;
	
	//borders
	let minR = cx - scale * width / height, maxR = cx + scale * width / height;
	let minI = cy - scale, maxI = cy + scale;
	
	for (let x = 0; x < width; x++)
		for (let y = 0; y < height; y++)
		{
			let r = minR + (maxR - minR) * x / width;
			let i = minI + (maxI - minI) * y / height;
			
			pixels[x + y * width] = Mandel(r, i, maxIter);
		}
}

var offPallet = 0;
function draw()
{
	let pframe = new Date().getTime();
	//start of calculation
	
	Render();
	
	//end of calculation
	//show dt
	let now = new Date().getTime(), dt = now - pframe;
	pframe = now;
	fpsText.textContent = "" + dt;
	
	//convert pixels to image
	for (let i = 0; i < width * height; i++)
	{
		let p = pixels[i];
		data[4 * i] = 128 - 127 * Math.cos(p * 0.01227);
		data[4 * i + 1] = 128 - 127 * Math.cos(p * 0.01227 * 3);
		data[4 * i + 2] = 128 - 127 * Math.cos(p * 0.01227 * 5);
		data[4 * i + 3] = 255;
	}
	hdc.putImageData(imageData, 0, 0); //show pixels
}
setInterval(draw, 10);