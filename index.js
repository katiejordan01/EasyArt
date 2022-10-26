const canvas = document.getElementById('draw');
const tools = document.getElementById('tool');
const ctx = canvas.getContext('2d');
const colorSelector = document.getElementById('stroke');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

console.log("x:" + canvasOffsetX);
console.log("y:" + canvasOffsetY);
console.log("x1:" + window.innerWidth);
console.log("y1:" + window.innerHeight);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var eraserImg = new Image();
eraserImg.src = "eraser_icon.png"
let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

tools.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (e.target.id === 'eraser') {
        console.log("I'm using the eraser now!");
        ctx.strokeStyle = "#FFFFFF";
        document.body.style.cursor = "url(https://findicons.com/files/icons/1156/fugue/16/eraser.png), auto";
    } else if (e.target.id === "pen") {
        console.log("I'm using the pen now!")
        ctx.strokeStyle = colorSelector.value;
        document.body.style.cursor = "url(https://findicons.com/files/icons/1620/crystal_project/22/14_pencil.png), auto";
    } else if (e.target.id === "text") {
        document.body.style.cursor = "text";
    } else if (e.target.id === "stroke") {
        ctx.strokeStyle = e.target.value;
    }
});
tools.addEventListener('dblclick', (event) => {
    ctx.strokeStyle = "#FFFFFF";
});



tools.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
    
});

const draw = (e) => {
    if(!isPainting) {
        return;
    } else if (isPainting) {
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
        ctx.stroke();
    }
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);
