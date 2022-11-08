const canvas = document.getElementById("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const colorSelector = document.getElementById('stroke');
const lineWidthSelector = document.getElementById('lineWidth');
const tools = document.getElementById('side');
var textboxes = [];


const ctx = canvas.getContext("2d")


let prevX = null
let prevY = null
// offsets to make the drawing/action happen at the right area of the icon
let iconOffsetX;
let iconOffsetY;
//holds state of which tool is being used
let currentToolState = null;
//an "enum" to hold all current and future tools that we use as states
const Tool = {
    Eraser: 'Eraser',
    Pen: 'Pen',
    Text: 'Text',
}

ctx.lineWidth = lineWidthSelector.value;

let draw = false;
const selR= 0, selG = 0, selB = 0;

let clrs = document.querySelectorAll(".stroke");
clrs = Array.from(clrs);
clrs.forEach(clr => {
    clr.addEventListener("click", (e) => {
        console.log(e.target.value);
        ctx.strokeStyle = e.target.value;
    })
    clr.addEventListener('change', e => {
        ctx.strokeStyle = e.target.value;
    })
})

tools.addEventListener('click', e => {
    //clears all the drawing on the screen
    //TODO: need to figure out how to clear the text boxes
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < textboxes.length; i++) {
            textboxes[i].destroy();
        }
        // textboxes.forEach(textbox => textbox.destroy())
    } else if (e.target.id === 'eraser') { //logic for the eraser tool - it paints white
        eraserMode()
    } else if (e.target.id === "pen") { //logic for the pen
        penMode()
    } else if (e.target.id === "text") { // the text tool, I'm using someone's text box from this website: https://goldfirestudios.com/canvasinput-html5-canvas-text-input
        console.log("I'm using the text tool now!");
        document.body.style.cursor = "text"; //setting the icon to change
        currentToolState = Tool.Text;
        iconOffsetX = 0
        iconOffsetY = 0
    }
});

function penMode() {
    console.log("I'm using the pen now!") //sets the state to Pen
    currentToolState = Tool.Pen;
    iconOffsetX = -2;
    iconOffsetY = -25;
    ctx.lineCap = 'round';
    ctx.lineWidth = lineWidthSelector.value;
    ctx.strokeStyle = "#000000"
    document.body.style.cursor = "url(https://findicons.com/files/icons/1620/crystal_project/22/14_pencil.png), auto"; //setting the icon
}

function eraserMode() {
    console.log("I'm using the eraser now!");
    currentToolState = Tool.Eraser; //sets the state to Eraser
    iconOffsetY = -14;
    ctx.strokeStyle = "#FFFFFF";
    document.body.style.cursor = "url(https://findicons.com/files/icons/1156/fugue/16/eraser.png), auto"; //setting a different icon from the internet
}

tools.addEventListener('change', e => {
    if(e.target.id === 'lineWidth') {
        ctx.lineWidth = e.target.value;
    }  
});

//tracking the dimensions of the text box based on click and drag
let textXStart = null;
let textYStart = null;
let textXEnd = null;
let textYEnd = null;

window.addEventListener("mousedown", (e) => {
    draw = true;
    if (currentToolState == Tool.Text) {
        textXStart = e.clientX - iconOffsetX;
        textYStart = e.clientY - iconOffsetY;
    }
})
window.addEventListener("mouseup", (e) => {
    clrDraw = true;
    draw = false
    if (currentToolState == Tool.Text) { //I can use the states in my logic -> it makes things simpler
        textXEnd = e.clientX - iconOffsetX;
        textYEnd = e.clientY - iconOffsetY;
        if (textXEnd != textXStart) {
            console.log(textXStart, textXEnd);
            textboxes.push(new CanvasInput({ //this is the class I used from the internet
                canvas: document.getElementById('canvas'),
                x: textXStart,
                y: textYStart,
                width: textXEnd - textXStart,
                height: textYEnd - textYStart,
                fontSize: textYEnd - textYStart,
            }));
        }
    }
})
window.addEventListener("mousemove", (e) => {
    if(prevX == null || prevY == null || !draw){
        prevX = e.clientX - iconOffsetX
        prevY = e.clientY - iconOffsetY
        return
    }

    let currentX = e.clientX - iconOffsetX
    let currentY = e.clientY - iconOffsetY

    if (currentToolState == Tool.Pen || currentToolState == Tool.Eraser) { //we're drawing a path for both pen and eraser because they both draw; eraser is just white (color of background)
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(currentX, currentY)
        ctx.stroke()
    }

    prevX = currentX
    prevY = currentY
})
window.addEventListener("contextmenu", (e) => { //this is the right click to pull up a default sized text box wherever you right click
    e.preventDefault();
    let rightClickTextX = e.clientX;
    let rightClickTextY = e.clientY;
    console.log(rightClickTextX, rightClickTextY);
    textboxes.push(new CanvasInput({
        canvas: document.getElementById('canvas'),
        x: rightClickTextX,
        y: rightClickTextY,
    }));
}); 
window.addEventListener("dblclick", (e) => { //double clicking changes a pen to an eraser and vice-versa using states
    //TODO: this logic is weird when text boxes are on the page; after switching, I can't click and drag
    if (currentToolState == Tool.Pen) {
        eraserMode()
    } else if (currentToolState == Tool.Eraser) {
        penMode()
    }
});