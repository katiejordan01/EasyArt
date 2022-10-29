const canvas = document.getElementById('canvas');
const tools = document.getElementById('tools');
const ctx = canvas.getContext('2d');
//made vars so that we can access stroke color and line width outside of callbacks
const colorSelector = document.getElementById('stroke');
const lineWidthSelector = document.getElementById('lineWidth');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;
let prevX = null;
let prevY = null;
// offsets to make the drawing/action happen at the right area of the icon
let iconOffsetX;
let iconOffsetY;
//keeps track of whether we are drawing or not
let draw = false;
//keeps track of the state of which tool is being used
let currentToolState = null;
//an "enum" to hold all current and future tools that we use as states
const Tool = {
    Eraser: 'Eraser',
    Pen: 'Pen',
    Text: 'Text',
}
let startX;
let startY;

tools.addEventListener('click', e => {
    //clears all the drawing on the screen
    //TODO: need to figure out how to clear the text boxes
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (e.target.id === 'eraser') { //logic for the eraser tool - it paints white
        console.log("I'm using the eraser now!");
        currentToolState = Tool.Eraser; //sets the state to Eraser
        iconOffsetY = -14;
        ctx.strokeStyle = "#FFFFFF";
        document.body.style.cursor = "url(https://findicons.com/files/icons/1156/fugue/16/eraser.png), auto"; //setting a different icon from the internet
    } else if (e.target.id === "pen") { //logic for the pen
        console.log("I'm using the pen now!") //sets the state to Pen
        currentToolState = Tool.Pen;
        iconOffsetX = -2;
        iconOffsetY = -20;
        ctx.lineCap = 'round';
        ctx.lineWidth = lineWidthSelector.value;
        ctx.strokeStyle = colorSelector.value;
        document.body.style.cursor = "url(https://findicons.com/files/icons/1620/crystal_project/22/14_pencil.png), auto"; //setting the icon
    } else if (e.target.id === "text") { // the text tool, I'm using someone's text box from this website: https://goldfirestudios.com/canvasinput-html5-canvas-text-input
        console.log("I'm using the text tool now!");
        document.body.style.cursor = "text"; //setting the icon to change
        currentToolState = Tool.Text;
        iconOffsetX = 0
        iconOffsetY = 0
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
//tracking the dimensions of the text box based on click and drag
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
    if (currentToolState == Tool.Text) { //I can use the states in my logic -> it makes things simpler
        textXEnd = e.clientX - canvasOffsetX - iconOffsetX;
        textYEnd = e.clientY - canvasOffsetY - iconOffsetY;
        if (textXEnd != textXStart) {
            console.log(textXStart, textXEnd);
            var input = new CanvasInput({ //this is the class I used from the internet
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
    if (currentToolState == Tool.Pen || currentToolState == Tool.Eraser) { //we're drawing a path for both pen and eraser because they both draw; eraser is just white (color of background)
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(currentX, currentY)
        ctx.stroke()
    }

    prevX = currentX
    prevY = currentY
});
canvas.addEventListener("contextmenu", (e) => { //this is the right click to pull up a default sized text box wherever you right click
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
canvas.addEventListener("dblclick", (e) => { //double clicking changes a pen to an eraser and vice-versa using states
    //TODO: this logic is weird when text boxes are on the page; after switching, I can't click and drag
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