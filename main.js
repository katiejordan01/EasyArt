import {DollarRecognizer}from "./DollarRecognizer.js";

const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("CursorLayer");

var dollar = new DollarRecognizer();

canvas2.style.position = "absolute";
var selectedWidth = 0;
var selectedHeight = 0;

const ctx2 = canvas2.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
const colorSelector = document.getElementById('stroke');
let thickness = document.getElementById("thickness");

var minY = Math.pow(10, 1000);
var minX = Math.pow(10, 1000);
var maxY = 0;
var maxX = 0;

var snapping = false;

// canvas2.style.marginTop = "-" + canvas.height+ "px";
canvas2.style.top = '0px'
canvas2.style.left = '0px'

const ctx = canvas.getContext("2d")

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
// modes: 0-draw 1-select 2-recognition
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
        mode = 0;
        snapping = false;
    } else {
        ctx.strokeStyle = color;
        ctx2.lineWidth = lineWidth
        ctx2.strokeStyle= color;
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
        ctx2.strokeStyle= color;
    }

})

let selectBtn = document.querySelector(".select")
selectBtn.addEventListener("click", () => {
    mode = 1;
})


window.addEventListener("mousedown", (e) => {
    if (mode === 0 || mode === 4) {
        draw = true;
        down = true;
        moved = false;
        ctx2.clearRect(0,0,canvas2.width, canvas2.height);
        if (!moved) {
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
        
    } else if (mode === 1) {
        isDragging = true;
        ctx2.fillStyle="transparent";
        ctx2.setLineDash([10,10])
        ctx2.strokeStyle="blue";
        ctx2.lineWidth=3;
        startX = e.clientX;
        startY = e.clientY;
    }
    
})
window.addEventListener("mouseup", (e) => {
    if (mode === 0) {
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
        if (!selecting && !selectingColor) {
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