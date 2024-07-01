let txt_script = document.getElementById("txt_script");


let defaultScript = ">>>>>+++++[>+++++++++++[>++++++++++<-]<-[<+>-]<]>>>------.>---------.>--.>--.>+.";
let script = "";
let memory_size = 15;

let visual_memorySize = 25;
let visual_memorySize_2 = visual_memorySize/2;
let margin_x = 10;

let drawStackPushArrow = 0;
let drawStackPopArrow = 0;

let program;
let visited = [];

function run () {
	script = txt_script.value;
	program = Compile(script, memory_size);
	setInterval(() => program.next(), 200);
	visited = Array(script.length).fill(0);
}

function setup () {
	createCanvas(400, 400);
	txt_script.textContent = defaultScript;
}

function draw () {
	background(255);


	push();
	fill(0);
	noStroke();
	textFont('monospace');
	textAlign(CENTER, CENTER);
	textSize(18);

	let y = 40;
	let dx = 18;
	for (let i = 0; i < script.length; i++) {
		text(script[i], margin_x + dx*i - dx*program_pointer, y);

		push();
		fill(40,200,40, 5*visited[i]);
		rect(margin_x + dx*i - dx*program_pointer - dx/2, y-20, dx,-10);
		pop();
	}

	textSize(10);
	for (let i = 0; i < script.length; i++) {
		text(i, margin_x + dx*i - dx*program_pointer, y+25);
	}

	stroke(0);
	noFill();
	rect(margin_x+dx/2,y-14, dx,47, 3);
	pop();

	push();
	y = 120;
	text("memory:", margin_x, y-5);

	textAlign(CENTER, CENTER);
	for (let i = 0; i < memory.length; i++) {
		rect(margin_x + i*visual_memorySize,y, visual_memorySize,visual_memorySize);
		text(memory[i], margin_x + i*visual_memorySize + visual_memorySize_2,y + visual_memorySize_2);
	}

	textFont('monospace');
	textSize(20);
	text("^", margin_x + memory_pointer*visual_memorySize + visual_memorySize_2, y + visual_memorySize+visual_memorySize_2 + 5);
	pop();

	push();
	y = 200;
	y_ = y + 8*20;
	text("loop stack:", margin_x, y-5);

	textAlign(CENTER, CENTER);
	for (let i = 0; i < loopStack.values.length; i++) {
		rect(margin_x,y_ - i*20, 70,20);
		text(loopStack.get(i), margin_x+35,y_ - i*20 + 10);
	}

	stroke(0); strokeWeight(2);
	noFill();
	beginShape();
	vertex(margin_x,220);
	vertex(margin_x,380);
	vertex(margin_x+70,380);
	vertex(margin_x+70,220);
	endShape();
	pop();

	if (drawStackPushArrow > 0) {
		arrow_stackpush();
		drawStackPushArrow -= 0.1;
	}
	if (drawStackPopArrow > 0) {
		arrow_stackpop();
		drawStackPopArrow -= 0.1;
	}


	push();
	y = y_;
	text("output:", margin_x + 120, y-5);
	textFont('monospace');
	rect(margin_x+120, y, 200, 20);
	text(output_buffer, margin_x + 120 + 5, y+14);
	pop();
}






function arrow_stackpush () {
	Arrow(
		[
			margin_x,205,
			margin_x+25,205,
			margin_x+25,375-20*loopStack.values.length
		], 2, 100
	);
}
function arrow_stackpop () {
	Arrow(
		[
			margin_x+45,375-20*loopStack.values.length,
			margin_x+45,205,
			margin_x+70,205
		], 2, 100
	);
}
function Arrow (xys, size, col)
{
	let N = xys.length;

	push();
	stroke(col); strokeWeight(size);
	noFill();
	beginShape();
	for (let i = 0; i < N; i += 2) {
		vertex(xys[i], xys[i + 1]);
	}
	endShape();


	fill(col);
	let dx = xys[N-2]-xys[N-4];
	let dy = xys[N-1]-xys[N-3];
	let arrowSize = size * 2;
	translate(xys[N-2], xys[N-1]);
	rotate(atan2(dy, dx));
	translate(-arrowSize, 0);
	triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
	pop();
}
