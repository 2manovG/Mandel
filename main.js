var canvas = document.getElementById("hDc");
var fpsText = document.getElementById("text");
var hdc = canvas.getContext("2d");
  
var width = canvas.width;
var height = canvas.height;

//canvas.addEventListener('contextmenu', function(e) { if (e.button == 2) { e.preventDefault(); } });

var imageData = hdc.getImageData(0, 0, width, height);
var data = imageData.data; //actual screen data (don't touch)
var pixels = []; //this is where to draw (usig pallete)
for (let i = 0; i < width * height; i++) pixels.push(0); //fill array
//--------------------------------------------------------
	
//setup
var maxIter = 1024, scale = 2, cx = -0.7460000000001, cy = 0.1000010000000375;

function Mandel(r, i, maxIter) //get value of mandelbrot set at specific point
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

var queue = [], qhead, qtail, qsize = 4 * (width + height); //queue of pixels to update
var done = []; //extra data

function AddQueue(p) //add pixel to queue
{
	if (done[p].queued) return; //already was in queue
	done[p].queued = true;
	
	queue[qhead++] = p; //add to queue
	if (qhead == qsize) qhead = 0;
}

function Load(p) //proceed pixel
{
	if (done[p].loaded) return pixels[p]; //don't proceed if already
	done[p].loaded = true;
	
	//borders
	let minR = cx - scale * width / height, maxR = cx + scale * width / height;
	let minI = cy - scale, maxI = cy + scale;
	
	//calculate
	let x = p % width, y = Math.floor(p / width);
	return pixels[p] = Mandel(minR + (maxR - minR) * x / width, minI + (maxI - minI) * y / height, maxIter);
}

function Scan(p) //have no idea how to call it, cause I just copypasting this code from Bisquit :P
{
	let x = p % width, y = Math.floor(p / width), center = Load(p);
	let ll = x > 0, uu = y > 0, rr = x < width - 1, dd = y < height - 1; //just border check
	
	//not just border check
	let l = ll && (Load(p - 1) != center);
	let r = rr && (Load(p + 1) != center);
	let u = uu && (Load(p - width) != center);
	let d = dd && (Load(p + width) != center);
	
	//add to queue new pixels
	if (l) AddQueue(p - 1); 
	if (r) AddQueue(p + 1); 
	if (u) AddQueue(p - width); 
	if (d) AddQueue(p + width); 
	if((uu&&ll)&&(l||u)) AddQueue(p - width - 1);
	if((uu&&rr)&&(r||u)) AddQueue(p - width + 1);
	if((dd&&ll)&&(l||d)) AddQueue(p + width - 1);
	if((dd&&rr)&&(r||d)) AddQueue(p + width + 1);
}

function Render() //render set
{
	//init
	done = [];
	for (let i = 0; i < width * height; i++) done.push({loaded : false, queued : false});
	
	queue = [];
	for (let i = 0; i < qsize; i++) queue.push(0);

	qhead = qtail = 0;
	
	//add starting points
	for (let i = 0; i < width; i++) { AddQueue(i); AddQueue(width * (height - 1) + i); }
	for (let i = 1; i < height - 1; i++) { AddQueue(width * i); AddQueue(width * (i + 1) - 1); }
	
	//cycle
	let flag = 0;
	while (qhead != qtail)
	{
		let p;
		if (qhead <= qtail || ++flag & 3)
		{
			p = queue[qtail++];
			if (qtail == qsize) qtail = 0;
		}
		else p = queue[--qhead];
		Scan(p);
	}
	
	//post work
	for (let p = 0; p < width * height - 1; p++)
		if (done[p].loaded && !done[p + 1].loaded)
		{
			done[p + 1].loaded = true;
			pixels[p + 1] = pixels[p];
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
	
	//move
	scale *= Math.pow(0.5, dt / 1000);
	
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