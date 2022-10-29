const canvas = document.getElementById('canvas');
const tools = document.getElementById('tools');
const ctx = canvas.getContext('2d');
const colorSelector = document.getElementById('stroke');
const lineWidthSelector = document.getElementById('lineWidth');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let prevX = null;
let prevY = null;
let iconOffsetX;
let iconOffsetY;
let draw = false;
let isPen = false;
let currentToolState = null;
const Tool = {
    Eraser: 'Eraser',
    Pen: 'Pen',
    Text: 'Text',
}

var eraserImg = new Image();
eraserImg.src = "eraser_icon.png"
let isTexting = false;
let startX;
let startY;

tools.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (e.target.id === 'eraser') {
        console.log("I'm using the eraser now!");
        currentToolState = Tool.Eraser;
        iconOffsetY = -14;
        ctx.strokeStyle = "#FFFFFF";
        document.body.style.cursor = "url(https://findicons.com/files/icons/1156/fugue/16/eraser.png), auto";
    } else if (e.target.id === "pen") {
        console.log("I'm using the pen now!")
        currentToolState = Tool.Pen;
        iconOffsetX = -2;
        iconOffsetY = -20;
        ctx.lineCap = 'round';
        ctx.lineWidth = lineWidthSelector.value;
        ctx.strokeStyle = colorSelector.value;
        document.body.style.cursor = "url(https://findicons.com/files/icons/1620/crystal_project/22/14_pencil.png), auto";
    } else if (e.target.id === "text") {
        console.log("I'm using the text tool now!");
        document.body.style.cursor = "text";
        currentToolState = Tool.Text;
        iconOffsetX = 0
        iconOffsetY = 0
        isPen = false
    }
});

tools.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if(e.target.id === 'lineWidth') {
        ctx.lineWidth = e.target.value;
    }
    
});
let textXStart = null;
let textYStart = null;
let textXEnd = null;
let textYEnd = null;

canvas.addEventListener("mousedown", (e) => {
    draw = true;
    if (currentToolState == Tool.Text) {
        textXStart = e.clientX - canvasOffsetX - iconOffsetX;
        textYStart = e.clientY - canvasOffsetY - iconOffsetY;
    }
    
});
canvas.addEventListener("mouseup", (e) => {
    draw = false;
    if (currentToolState == Tool.Text) {
        textXEnd = e.clientX - canvasOffsetX - iconOffsetX;
        textYEnd = e.clientY - canvasOffsetY - iconOffsetY;
        if (textXEnd != textXStart) {
            console.log(textXStart, textXEnd);
            var input = new CanvasInput({
                canvas: document.getElementById('canvas'),
                x: textXStart,
                y: textYStart,
                width: textXEnd - textXStart,
                height: textYEnd - textYStart,
                fontSize: textYEnd - textYStart,
            });
        }
    }
});
canvas.addEventListener("mousemove", (e) => {
    if(prevX == null || prevY == null || !draw){
        prevX = e.clientX - canvasOffsetX - iconOffsetX;
        prevY = e.clientY - canvasOffsetY - iconOffsetY;
        return
    }

    let currentX = e.clientX - canvasOffsetX - iconOffsetX;
    let currentY = e.clientY - canvasOffsetY - iconOffsetY;
    if (currentToolState == Tool.Pen || currentToolState == Tool.Eraser) {
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(currentX, currentY)
        ctx.stroke()
    }

    prevX = currentX
    prevY = currentY
});
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    let rightClickTextX = e.clientX - canvasOffsetX;
    let rightClickTextY = e.clientY - canvasOffsetY;
    console.log(rightClickTextX, rightClickTextY);
    var input = new CanvasInput({
        canvas: document.getElementById('canvas'),
        x: rightClickTextX,
        y: rightClickTextY,
    });
});
canvas.addEventListener("dblclick", (e) => {
    if (currentToolState == Tool.Pen) {
        console.log("I'm using the eraser now!");
        currentToolState = Tool.Eraser;
        draw = false;
        iconOffsetY = -14;
        ctx.strokeStyle = "#FFFFFF";
        document.body.style.cursor = "url(https://findicons.com/files/icons/1156/fugue/16/eraser.png), auto";
    } else if (currentToolState == Tool.Eraser) {
        console.log("I'm using the pen now!");
        currentToolState = Tool.Pen;
        draw = false;
        iconOffsetX = -2;
        iconOffsetY = -20;
        ctx.lineCap = 'round';
        ctx.lineWidth = lineWidthSelector.value;
        ctx.strokeStyle = colorSelector.value;
        document.body.style.cursor = "url(https://findicons.com/files/icons/1620/crystal_project/22/14_pencil.png), auto";
    }
});