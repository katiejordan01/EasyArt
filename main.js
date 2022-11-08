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
let thickness = document.getElementById("thickness");

canvas2.style.marginTop = "-" + canvas.height+ "px";

const ctx = canvas.getContext("2d")

let utensil = 0;
let color = '#000000';
let isDragging = false;
var startX, startY;
var mouseX, mouseY = 0;



let prevX = null
let prevY = null
let selecting = false;
let lineWidth = 10;

ctx.lineWidth = lineWidth

let draw = false;
//used to check if mouse is down and moved or just down (click and hold functionality)
let moved, down = false;
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
})
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


window.addEventListener("mousedown", (e) => {
    if (mode === 0) {
        draw = true;
        down = true;
        console.log(moved);
        moved = false;
        if (!moved) {
            setTimeout(function() {
                if (!moved) {
                    const gradient = ctx2.createConicGradient(0, e.clientX, e.clientY);

                    gradient.addColorStop(0, "red");
                    gradient.addColorStop(0.25, "orange");
                    gradient.addColorStop(0.5, "yellow");
                    gradient.addColorStop(0.75, "green");
                    gradient.addColorStop(1, "blue");

                    ctx2.fillStyle = gradient;
                    ctx2.borderRadius = '50%';
                    ctx2.roundRect(e.clientX-100, e.clientY-100, 200, 200, 200);
                    ctx2.fill();

                }
            }, 1000);
        } 
        
        console.log(moved);
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
        ctx2.clearRect(0,0,canvas.width, canvas.height)
    } else if (mode === 1) {
        isDragging = false;
        mouseX = e.clientX;
        mouseY = e.clientY;

        ctx2.clearRect(0,0,canvas2.width, canvas2.height);
        drawRectangle(mouseX, mouseY)
    }
})

window.addEventListener("mousemove", (e) => {
    if (mode === 0) {
        moved = true;
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