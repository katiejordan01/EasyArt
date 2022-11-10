const canvas = document.getElementById("canvas")
const canvas2 = document.getElementById("CursorLayer");


canvas2.style.position = "absolute";
var selectedWidth = 0;
var selectedHeight = 0;

const ctx2 = canvas2.getContext("2d");
canvas.height = window.innerHeight
canvas.width = window.innerWidth
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
const colorSelector = document.getElementById('stroke');
let thickness = document.getElementById("thickness");
var textboxes = [];

// canvas2.style.marginTop = "-" + canvas.height+ "px";
canvas2.style.top = '0px'
canvas2.style.left = '0px'

const ctx = canvas.getContext("2d")

let utensil = 0;
let color = '#000000';
let isDragging = false;
var startX, startY;
var mouseX, mouseY = 0;

let iconOffsetX;
let iconOffsetY;
//holds state of which tool is being used
let currentToolState = null;
//an "enum" to hold all current and future tools that we use as states
const Tool = {
    Eraser: 'Eraser',
    Pen: 'Pen',
    Text: 'Text',
    Airbrush: 'Airbrush',
    Select: 'Select',
    Pencil: 'Pencil'
}

let prevX = null
let prevY = null
let selecting = false;
let lineWidth = 10;

ctx.lineWidth = lineWidth

let selectingColor = false;

let draw = false;
//used to check if mouse is down and moved or just down (click and hold functionality)
let moved, down = false;
// modes: 0-draw 1-select 2-recognition 3-text
let mode = 0;
const selR= 0, selG = 0, selB = 0;

let clrs = document.querySelectorAll(".stroke");
clrs = Array.from(clrs);
clrs.forEach(clr => {
    clr.addEventListener("click", (e) => {
        ctx.strokeStyle = e.target.value;
        color = e.target.value;
        mode = 0;
    })
    clr.addEventListener('change', e => {
        ctx.strokeStyle = e.target.value;
        color = e.target.value;
    })
})

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


let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
    // Clearning the entire canvas
    ctx.clearRect(10, 0, canvas.width, canvas.height)
})

let penBtn = document.querySelector(".pen")
penBtn.addEventListener("click", () => {
    mode = 0;
    utensil = 0;
    ctx.globalAlpha = 1;
    console.log(utensil);
    penMode();
})
let pencilBtn = document.querySelector(".pencil")
pencilBtn.addEventListener("click", () => {
    mode = 0;
    utensil = 2;
    ctx.globalAlpha = .9;
    pencilMode();
})
let eraserBtn = document.querySelector(".eraser");
eraserBtn.addEventListener("click", () => {
    mode = 0;
    utensil = 0;
    eraserMode();
})
let textBtn = document.querySelector(".text");
textBtn.addEventListener("click", () => {
    textMode();
})
let airbrushBtn = document.querySelector(".airbrush")
airbrushBtn.addEventListener("click", () => {
    utensil = 1;
    mode = 0;
    ctx.globalAlpha = 0.05;
    airbrushMode();
})

let selectBtn = document.querySelector(".select")
selectBtn.addEventListener("click", () => {
    mode = 1;
    console.log(mode);
    selectMode();
})

function penMode() {
    console.log("I'm using the pen now!") //sets the state to Pen
    currentToolState = Tool.Pen;
    iconOffsetX = -2;
    iconOffsetY = -47;
    ctx.lineCap = 'round';
    // ctx.lineWidth = lineWidthSelector.value;
    ctx.strokeStyle = clrs[0].value;
    document.body.style.cursor = "url(https://findicons.com/files/icons/2166/oxygen/48/pen.png), auto"; //setting the icon
}
function pencilMode() {
    console.log("I'm using the pencil now!") //sets the state to Pen
    currentToolState = Tool.Pencil;
    iconOffsetX = -2;
    iconOffsetY = -25;
    // ctx.lineWidth = lineWidthSelector.value;
    ctx.strokeStyle = clrs[0].value;
    document.body.style.cursor = "url(https://findicons.com/files/icons/1620/crystal_project/22/14_pencil.png), auto"; //setting the icon
}
function eraserMode() {
    console.log("I'm using the eraser now!");
    currentToolState = Tool.Eraser; //sets the state to Eraser
    iconOffsetY = -14;
    iconOffsetX = 0;
    ctx.linecap = "round"
    ctx.strokeStyle = "#FFFFFF";
    ctx.globalAlpha = 1;
    document.body.style.cursor = "url(https://findicons.com/files/icons/1156/fugue/16/eraser.png), auto"; //setting a different icon from the internet
}
function textMode() { // the text tool, I'm using someone's text box from this website: https://goldfirestudios.com/canvasinput-html5-canvas-text-input
    mode = 3;
    console.log("I'm using the text tool now!");
    document.body.style.cursor = "text"; //setting the icon to change
    currentToolState = Tool.Text;
    iconOffsetX = 0;
    iconOffsetY = 0;
}
function airbrushMode() {
    console.log("I'm using the airbrush tool now!");
    iconOffsetX = -2;
    iconOffsetY = -40;
    document.body.style.cursor = "url(https://findicons.com/files/icons/2579/iphone_icons/40/airbrush.png), auto";
    currentToolState = Tool.Airbrush;
}
function selectMode() {
    console.log("I'm using the select tool now!");
    currentToolState = Tool.Select;
    document.body.style.cursor = "crosshair";
    iconOffsetX = 0;
    iconOffsetY = 0;
}

//tracking the dimensions of the text box based on click and drag
let textXStart = null;
let textYStart = null;
let textXEnd = null;
let textYEnd = null;

window.addEventListener("mousedown", (e) => {
    if (mode === 0) {
        draw = true;
        down = true;
        console.log(moved);
        moved = false;
        ctx2.clearRect(0,0,canvas2.width, canvas2.height);
        if (!moved && currentToolState != Tool.Eraser) {
            setTimeout(function() {
                if (!moved) {
                    //fix bug
                    selectingColor = true;
                    const gradient = ctx2.createConicGradient(0, e.clientX, e.clientY);

                    gradient.addColorStop(0, "red");
                    gradient.addColorStop(1/7, "orange");
                    gradient.addColorStop(2/7, "yellow");
                    gradient.addColorStop(3/7, "green");
                    gradient.addColorStop(4/7, "blue");
                    gradient.addColorStop(5/7, "black");
                    gradient.addColorStop(6/7, "white");
                    gradient.addColorStop(1, "red");

                    ctx2.fillStyle = gradient;
                    ctx2.borderRadius = '50%';
                    ctx2.fillRect(e.clientX-100, e.clientY-100, 200, 200, 200);


                }
            }, 1000);
        } 
        
        console.log(moved);
    } else if (mode === 1) {
        if (currentToolState == Tool.Select) {
            isDragging = true;
            ctx2.fillStyle="transparent";
            ctx2.setLineDash([10,10]);
            ctx2.strokeStyle="blue";
            ctx2.lineWidth=3;
            startX = e.clientX;
            startY = e.clientY;
        }
    } else if (mode === 3) {
        if (currentToolState == Tool.Text) {
            textXStart = e.clientX - iconOffsetX;
            textYStart = e.clientY - iconOffsetY;
            // isDragging = true;
            // ctx2.fillStyle="transparent";
            // ctx2.setLineDash([10,10]);
            // ctx2.strokeStyle="red";
            // ctx2.lineWidth=3;
            // startX = e.clientX;
            // startY = e.clientY;
        }
    }
})
window.addEventListener("mouseup", (e) => {
    if (mode === 0) {
        down = false;
        moved = true;
        clrDraw = true;
        draw = false
        if (selectingColor && currentToolState != Tool.Eraser) {
            const imgData = ctx2.getImageData(e.clientX, e.clientY, 1, 1);
            const [r, g, b] = imgData.data;
            console.log(r + g+ b);
            color = rgbToHex(r,g,b);
            ctx.strokeStyle = color;
            clrs[0].value = color;
            console.log(rgbToHex(r,g,b))
        }
        selectingColor = false;
        ctx2.clearRect(0,0,canvas2.width, canvas2.height)
    } else if (mode === 1) {
        if (currentToolState == Tool.Select) {
            isDragging = false;
            mouseX = e.clientX;
            mouseY = e.clientY;
            ctx2.clearRect(0,0,canvas2.width, canvas2.height);
            drawRectangle(mouseX, mouseY);
        }
    } else if (mode === 3) {
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
            // isDragging = false;
            // mouseX = e.clientX;
            // mouseY = e.clientY;
            // ctx2.clearRect(0,0,canvas2.width, canvas2.height);
            // drawRectangle(mouseX, mouseY);
        }
    }
})

window.addEventListener("mousemove", (e) => {
    if (mode === 0) {
        moved = true;
        if (!selecting && !selectingColor) {
            if(prevX == null || prevY == null || !draw) {
                prevX = e.clientX
                prevY = e.clientY
                return
            }
    
            let currentX = e.clientX;
            let currentY = e.clientY;
            if (currentToolState == Tool.Pencil) {
                ctx.lineCap = "butt";
            } else if (currentToolState == Tool.Eraser) {
                ctx.lineCap = "round";
            }
                
            ctx.beginPath()
            ctx.moveTo(prevX - iconOffsetX, prevY - iconOffsetY)
            ctx.lineTo(currentX - iconOffsetX, currentY - iconOffsetY)
            if (utensil === 1) {
                ctx.lineJoin = 'round';
                ctx.miterLimit = 2;
                ctx.arc(e.clientX - iconOffsetX, e.clientY - iconOffsetY,lineWidth/4, 0, Math.PI*2);
            } else if (utensil === 0) {
                // ctx.lineJoin = 'round';
                // ctx.miterLimit = 2;
                // ctx.arc(e.clientX, e.clientY,lineWidth/4, 0, Math.PI*2)
            }
            ctx.stroke()
            
    
            prevX = currentX
            prevY = currentY
            
        }
    } else if (mode === 1) {
        if (currentToolState == Tool.Select) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isDragging) {return;}
            ctx2.clearRect(0,0,canvas2.width, canvas2.height);
            drawRectangle(mouseX, mouseY);
        }
    } else if (mode === 3) {
        if (currentToolState == Tool.Text) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // if (!isDragging) {return;}
            // ctx2.clearRect(0,0,canvas2.width, canvas2.height);
            // drawRectangle(mouseX + 10, mouseY + 10);
        }
    }
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

document.addEventListener('scroll', (event) => {
    console.log(event.deltaY);
    thickness.value--;
})

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

  function drawRectangle(mouseX,mouseY){
    selectedWidth=mouseX-startX;
    selectedHeight=mouseY-startY;
    ctx2.beginPath();
    ctx2.rect(startX,startY,selectedWidth,selectedHeight);
    ctx2.fill();
    ctx2.stroke();
}