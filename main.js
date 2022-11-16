import {DollarRecognizer}from "./DollarRecognizer.js";

const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("CursorLayer");

var dollar = new DollarRecognizer();

canvas2.style.position = "absolute";
var selectedWidth = 0;
var selectedHeight = 0;
const ctx = canvas.getContext("2d", {willReadFrequently: true});
const ctx2 = canvas2.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
const colorSelector = document.getElementById('stroke');
let thickness = document.getElementById("thickness");
var textboxes = [];
var changeColor = "#000000";
var currentPixel;

var minY = Math.pow(10, 1000);
var minX = Math.pow(10, 1000);
var maxY = 0;
var maxX = 0;

var snapping = false;

// canvas2.style.marginTop = "-" + canvas.height+ "px";
canvas2.style.top = '0px'
canvas2.style.left = '0px'

let utensil = 0;
let color = '#000000';
let isDragging = false;
var startX, startY;
var mouseX, mouseY = 0;

var points = [];



let prevX = null
let prevY = null
let selecting = false;
let lineWidth = 10;

ctx.lineWidth = lineWidth
ctx2.lineWidth = lineWidth

let selectingColor = false;

let clrDraw;

let draw = false;
//used to check if mouse is down and moved or just down (click and hold functionality)
let moved, down = false;
// modes: 0-draw 1-select 2-recognition 3-text
let mode = 0;

let clrs = document.querySelectorAll(".stroke");
clrs = Array.from(clrs);
clrs.forEach(clr => {
    clr.addEventListener("click", (e) => {
        if (!snapping) {
            ctx.strokeStyle = e.target.value;
            color = e.target.value;
            mode = 0; 
        } else {
            ctx2.strokeStyle = e.target.value;
            color = e.target.value;
            mode = 4;
        }
        
    })
    clr.addEventListener('change', e => {
        if (!snapping) {
            ctx.strokeStyle = e.target.value;
            color = e.target.value;
            mode = 0; 
        } else {
            ctx2.strokeStyle = e.target.value;
            color = e.target.value;
            mode = 4;
        }
    })
})

thickness.addEventListener('change', () => {
    if (!snapping) {
        lineWidth = thickness.value;
        ctx.lineWidth = thickness.value;
    } else {
        lineWidth = thickness.value;
        ctx2.lineWidth = thickness.value;
    }
})
thickness.addEventListener('mousedown', () => {
    selecting = true;
})
thickness.addEventListener('mouseup', () => {
    selecting = false;
})


let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
    // Clearning the entire canvas
    ctx.clearRect(10, 0, canvas.width, canvas.height)
})
let snapBtn = document.querySelector(".switch")
snapBtn.addEventListener("change", () => {
    // Clearning the entire canvas
    if (mode === 4) {
        ctx.strokeStyle = color;
        ctx2.lineWidth = lineWidth
        ctx2.strokeStyle= color;
        ctx2.setLineDash([]);
        mode = 0;
        snapping = false;
    } else {
        ctx.strokeStyle = color;
        ctx2.lineWidth = lineWidth
        ctx2.strokeStyle= color;
        ctx2.setLineDash([]);
        mode = 4;
        snapping = true;
    }
})

let penBtn = document.querySelector(".pen")
penBtn.addEventListener("click", () => {
    if (!snapping) {
        mode = 0;
        utensil = 0;
        ctx.globalAlpha = 1;
    } else {
        mode = 4;
        utensil = 0;
        ctx2.globalAlpha = 1;
        ctx.strokeStyle = color;
        ctx2.lineWidth = lineWidth
        ctx2.strokeStyle= color;
        ctx2.setLineDash([]);
    }

})
let pencilBtn = document.querySelector(".pencil")
pencilBtn.addEventListener("click", () => {
    if (!snapping) {
        mode = 0;
        utensil = 2;
        ctx.globalAlpha = .9;
    } else {
        mode = 4;
        utensil = 2;
        ctx2.globalAlpha = .9;
        ctx.strokeStyle = color;
        ctx2.lineWidth = lineWidth
        ctx2.strokeStyle= color;
        ctx2.setLineDash([]);
    }
})
let airbrushBtn = document.querySelector(".airbrush")
airbrushBtn.addEventListener("click", () => {
    if (!snapping) {
        mode = 0;
        utensil = 1;
        ctx.globalAlpha = 0.05;
    } else {
        mode = 4;
        utensil = 0;
        ctx2.globalAlpha = 0.05;
        ctx.strokeStyle = color;
        ctx2.lineWidth = lineWidth
        ctx2.setLineDash([]);
    }


})

let selectBtn = document.querySelector(".select")
selectBtn.addEventListener("click", () => {
    mode = 1;
    //ctx2.fillStyle="transparent";
    ctx2.setLineDash([10,10])
    ctx2.strokeStyle="blue";
    ctx2.lineWidth=3;
    ctx2.globalAlpha = 1;

})
function paintBucketMode() {
    console.log("I'm using the paint bucket now now!");
    currentToolState = Tool.PaintBucket; //sets the state to Paint Bucket
    iconOffsetY = -45;
    iconOffsetX = -49;
    ctx.linecap = "round"
    ctx.strokeStyle = changeColor;
    ctx.globalAlpha = 1;
    document.body.style.cursor = "url(https://findicons.com/files/icons/2332/super_mono/64/paint_bucket.png), auto";
}
function penMode() {
    console.log("I'm using the pen now!") //sets the state to Pen
    currentToolState = Tool.Pen;
    iconOffsetX = -2;
    iconOffsetY = -47;
    ctx.lineCap = 'round';
    // ctx.lineWidth = lineWidthSelector.value;
    ctx.strokeStyle = changeColor;
    document.body.style.cursor = "url(https://findicons.com/files/icons/2166/oxygen/48/pen.png), auto"; //setting the icon
}
function pencilMode() {
    console.log("I'm using the pencil now!") //sets the state to Pencil
    currentToolState = Tool.Pencil;
    iconOffsetX = -2;
    iconOffsetY = -25;
    // ctx.lineWidth = lineWidthSelector.value;
    ctx.strokeStyle = changeColor;
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
    if (mode === 0 || mode === 4) {
        draw = true;
        down = true;
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
            if (currentToolState == Tool.PaintBucket) {
                //pixel testing
                // const currentPixel = ctx.getImageData(e.clientX - iconOffsetX, e.clientY - iconOffsetY, 1, 1);
                // const pixelData = currentPixel.data;
                // const [r,g,b] = pixelData;
                // console.log(currentPixel);
                // console.log(currentPixel['data']);
                // console.log(pixelData);
                // console.log(r,g,b);
                // currentPixel['data'][0] = 0;
                // currentPixel['data'][1] = 0;
                // currentPixel['data'][2] = 0;
                // ctx.putImageData(currentPixel, e.clientX - iconOffsetX, e.clientY - iconOffsetY);
                // color = rgbToHex(r,g,b);
                // console.log(color);
                console.log('clickx:', e.clientX - iconOffsetX, 'clicky:', e.clientY - iconOffsetY);
                floodFill(e.clientX - iconOffsetX, e.clientY - iconOffsetY, changeColor);
            }
        }
        
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
            const imgData = ctx2.getImageData(e.clientX - iconOffsetX, e.clientY - iconOffsetY, 1, 1);
            const [r, g, b] = imgData.data;
            color = rgbToHex(r,g,b);
            ctx.strokeStyle = color;
            ctx2.strokeStyle = color;
            clrs[0].value = color;
        }
        selectingColor = false;
        
        ctx2.clearRect(0,0,canvas2.width, canvas2.height)

    } else if (mode === 1) {

        isDragging = false;
        mouseX = e.clientX;
        mouseY = e.clientY;

        ctx2.clearRect(0,0,canvas2.width, canvas2.height);
        drawRectangle(mouseX, mouseY)
    } else if (mode === 4) {
        down = false;
        moved = true;
        clrDraw = true;
        draw = false
        if (selectingColor) {
            const imgData = ctx2.getImageData(e.clientX, e.clientY, 1, 1);
            const [r, g, b] = imgData.data;
            color = rgbToHex(r,g,b);
            ctx.strokeStyle = color;
            clrs[0].value = color;
        }
        selectingColor = false;
        if (points.length !== 0) {
            let result = dollar.Recognize(points, false);
            console.log(result);
            if (result.Name === 'triangle') {

                //make it so that in shape recognition mode, it draws on ctx2 and then the shape pops up on the bottom ctx
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo((minX+maxX)/2, (minY));
                ctx.lineTo(minX, maxY);
                ctx.lineTo(maxX, maxY);
                ctx.closePath();
                ctx.stroke();
            } else if (result.Name === 'circle') {
                var centerX = (minX + maxX) / 2;
                var centerY = (minY + maxY) / 2;
                var radius = (((maxY-minY)/2)+((maxX-minX)/2))/2;
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
                ctx.stroke();
            } else if (result.Name === 'rectangle') {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.rect(minX, minY, (maxX-minX), (maxY-minY));
                ctx.stroke();
            } else if (result.Name === 'x') {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(minX, minY);
                ctx.lineTo(maxX, maxY);

                ctx.moveTo(maxX, minY);
                ctx.lineTo(minX, maxY);
                ctx.stroke();
            } else if (result.Name === 'check') {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(minX, (maxY+minY)/2);
                ctx.lineTo((maxX+minX)/2, maxY);
                ctx.lineTo(maxX, minY);
                ctx.stroke();
            } else if (result.Name === 'v') {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(minX, minY);
                ctx.lineTo((maxX+minX)/2, maxY);
                ctx.lineTo(maxX, minY);
                ctx.stroke();
            } else if (result.Name === 'caret') {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(minX, maxY);
                ctx.lineTo((maxX+minX)/2, minY);
                ctx.lineTo(maxX, maxY);
                ctx.stroke();
            } else if (result.Name === 'left square bracket') {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(maxX, minY);
                ctx.lineTo(minX, minY);
                ctx.lineTo(minX, maxY);
                ctx.lineTo(maxX, maxY);
                ctx.stroke();
            } else if (result.Name === 'right square bracket') {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(minX, minY);
                ctx.lineTo(maxX, minY);
                ctx.lineTo(maxX, maxY);
                ctx.lineTo(minX, maxY);
                ctx.stroke();
            }

        }
        
        ctx2.clearRect(0,0,canvas2.width, canvas2.height)
        minY = Math.pow(10, 1000);
        minX = Math.pow(10, 1000);
        maxY = 0;
        maxX = 0;
        points = []; 
    }
})

window.addEventListener("mousemove", (e) => {
    if (mode === 0) {
        moved = true;
        if (!selecting && !selectingColor && currentToolState != Tool.PaintBucket) {
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
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isDragging) {return;}

        ctx2.clearRect(0,0,canvas2.width, canvas2.height);
        drawRectangle(mouseX, mouseY)
        
    } else if (mode === 4) {
        moved = true;
        if (!selecting && !selectingColor) {
            if(prevX == null || prevY == null || !draw) {
                prevX = e.clientX
                prevY = e.clientY
                return
            }
            if (e.clientX < minX) {
                minX = e.clientX
            }
            if (e.clientX > maxX) {
                maxX = e.clientX
            }
            if (e.clientY < minY) {
                minY = e.clientY
            }
            if (e.clientY > maxY) {
                maxY = e.clientY
            } 
            var point = {X: e.clientX, Y: e.clientY};
            points.push(point);
    
            let currentX = e.clientX
            let currentY = e.clientY
    
            ctx2.beginPath()
            ctx2.moveTo(prevX, prevY)
            ctx2.lineTo(currentX, currentY)
            if (utensil === 1) {
                ctx2.lineJoin = 'round';
                ctx2.miterLimit = 2;
                ctx2.arc(e.clientX, e.clientY,lineWidth/4, 0, Math.PI*2);
            } else if (utensil === 0) {
                ctx2.lineJoin = 'round';
                ctx2.miterLimit = 2;
                ctx2.arc(e.clientX, e.clientY,lineWidth/4, 0, Math.PI*2)
            }
    
            ctx2.stroke()
            
    
            prevX = currentX
            prevY = currentY
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
    //thickness.value--;
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

function getCurrentPixelColor(sr, sc) {
    // const currentPixel = ctx.getImageData(e.clientX - iconOffsetX, e.clientY - iconOffsetY, 1, 1);
    // const pixelData = currentPixel.data;
    // const [r,g,b] = pixelData;
    currentPixel = ctx.getImageData(sr, sc, 1, 1);
    const pixelData = currentPixel.data;
    const [r,g,b] = pixelData;
    // const current = rgbToHex(r,g,b);
    console.log(sr,sc,current);
    return current;
}
function setCurrentPixelColor(sr,sc,newColor) { 
    var r,g,b,d1, d2;
    var myColor;
    d1,d2,myColor = hexToRgb(newColor);
    r = myColor['r'];
    g = myColor['g'];
    b = myColor['b'];
    currentPixel = ctx.getImageData(sr, sc, 1, 1);
    currentPixel['data'][0] = r;
    currentPixel['data'][1] = g;
    currentPixel['data'][2] = b;
    ctx.putImageData(currentPixel, sr, sc);
}


const floodFill = (sr, sc, newColor) => {
    //Get the input which needs to be replaced.
    const current = getCurrentPixelColor(sr,sc);
    //If the newColor is same as the existing 
    //Then return the original image.
    if(current === newColor){
        return;
    }
    
    //Other wise call the fill function which will fill in the existing image.
    fill(sr, sc, newColor, current);
    
    //Return the image once it is filled
    return;
};

const fill = (sr, sc, newColor, current) => {
    //If row is less than 0
    if(sr < 0){
        return;
    }

    //If column is less than 0
    if(sc < 0){
        return;
    }

    //If row is greater than image length
    if(sr > canvas.height - 1){
        return;
    }

    //If column is greater than image length
    if(sc > canvas.width - 1){
        return;
    }

    //If the current pixel is not which needs to be replaced //TODO: query color //prev:image[sr][sc]
    var newCurrent = getCurrentPixelColor(sr,sc);
    // console.log(newCurrent);
    if(getCurrentPixelColor(sr,sc) != current){
        return;
    }
    
    //Update the new color //TODO: set color//  image[sr][sc] = newColor;
    setCurrentPixelColor(sr,sc,newColor);
    console.log("I set the color of a pixel!");

    //Fill in all four directions
    //Fill Prev row
    if (getCurrentPixelColor(sr-1, sc) == current || newColor) {
        fill(sr - 1, sc, newColor, current);
    }

    //Fill Prev col
    fill(sr, sc - 1, newColor, current);

    //Fill Next row
    fill(sr + 1, sc, newColor, current);

    //Fill next col
    fill(sr, sc + 1, newColor, current);
    
}