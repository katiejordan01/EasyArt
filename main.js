const canvas = document.getElementById("canvas")
const canvas2 = document.getElementById("CursorLayer");

canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

canvas2.style.position = "absolute";
canvas2.style.border = '1px solid #000';
var selectedWidth = 0;
var selectedHeight = 0;

const ctx2 = canvas2.getContext("2d");
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const colorSelector = document.getElementById('stroke');

const lineWidthSelector = document.getElementById('lineWidth');
const tools = document.getElementById('side');
var textboxes = [];


const ctx = canvas.getContext("2d")
let thickness = document.getElementById("thickness");

canvas2.style.marginTop = "-" + canvas.height+ "px";

let utensil = 0;
let color = '#000000';
let isDragging = false;
var startX, startY;
var mouseX, mouseY;


let prevX = null
let prevY = null
let selecting = false;
let lineWidth = 10;

ctx.lineWidth = lineWidth

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

//ctx.lineWidth = lineWidthSelector.value;


let draw = false;
// modes: 0-draw 1-select 2-recognition
let mode = 0;
const selR= 0, selG = 0, selB = 0;

let clrs = document.querySelectorAll(".stroke");
clrs = Array.from(clrs);
clrs.forEach(clr => {
    clr.addEventListener("click", (e) => {
        ctx.strokeStyle = e.target.value;
        color = e.target.value;
    })
    clr.addEventListener('change', e => {
        ctx.strokeStyle = e.target.value;
        color = e.target.value;
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

thickness.addEventListener('change', () => {
    lineWidth = thickness.value;
    ctx.lineWidth = thickness.value;
})
thickness.addEventListener('mousedown', () => {
    selecting = true;
})
thickness.addEventListener('mouseup', () => {
    selecting = false;
})
// window.addEventListener('scroll', (e) => {
//     if(e.deltaY > 1) {
//         console.log(e.deltaY)
//         thickness.value++;
//       } else if (e.deltaY < -1) {
//         thickness.value--;
//       } 
// })


//let clearBtn = document.querySelector(".clear")
//clearBtn.addEventListener("click", () => {
    // Clearning the entire canvas
//    ctx.clearRect(10, 0, canvas.width, canvas.height)
//})

//let penBtn = document.querySelector(".pen")
//penBtn.addEventListener("click", () => {
//    mode = 0;
//    utensil = 0;
//    ctx.globalAlpha = 1;
//    console.log(utensil);
//})
let pencilBtn = document.querySelector(".pencil")
pencilBtn.addEventListener("click", () => {
    mode = 0;
    utensil = 2;
    ctx.globalAlpha = .9;
})
let airbrushBtn = document.querySelector(".airbrush")
airbrushBtn.addEventListener("click", () => {
    utensil = 1;
    mode = 0;
    ctx.globalAlpha = 0.05;

})

let selectBtn = document.querySelector(".select")
selectBtn.addEventListener("click", () => {
    mode = 1;
    console.log(mode);
})

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
    if (mode === 1) {
        isDragging = true;
        ctx2.fillStyle="transparent";
        ctx2.setLineDash([10,10])
        ctx2.strokeStyle="blue";
        ctx2.lineWidth=3;
        startX = e.clientX;
        startY = e.clientY;
    }
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
    if (mode === 0) {
        if (!selecting) {
            if(prevX == null || prevY == null || !draw) {
                prevX = e.clientX
                prevY = e.clientY
                return
            }
    
            let currentX = e.clientX
            let currentY = e.clientY
    
            ctx.beginPath()
            ctx.moveTo(prevX, prevY)
            ctx.lineTo(currentX, currentY)
            if (utensil === 1) {
                ctx.lineJoin = 'round';
                ctx.miterLimit = 2;
                ctx.arc(e.clientX, e.clientY,lineWidth/4, 0, Math.PI*2);
            } else if (utensil === 0) {
                ctx.lineJoin = 'round';
                ctx.miterLimit = 2;
                ctx.arc(e.clientX, e.clientY,lineWidth/4, 0, Math.PI*2)
            }
    
            ctx.stroke()
            
    
            prevX = currentX
            prevY = currentY
            
        }
    } else if (mode === 1) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isDragging) {return;}

        ctx2.clearRect(0,0,canvas2.width, canvas2.height);
        drawRectangle(mouseX, mouseY)
    }
})
document.addEventListener('keypress', (event) => {
    var name = event.key;
    if (name === "q") {
        if (mode === 0) {

        } else if (mode === 1) {
            ctx.clearRect(startX, startY, selectedWidth, selectedHeight);
            ctx2.clearRect(0,0,canvas.width,canvas.height);
        }
    }
})

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function drawRectangle(mouseX,mouseY){
    selectedWidth=mouseX-startX;
    selectedHeight=mouseY-startY;
    ctx2.beginPath();
    ctx2.rect(startX,startY,selectedWidth,selectedHeight);
    ctx2.fill();
    ctx2.stroke();
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
