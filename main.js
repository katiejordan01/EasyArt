const canvas = document.getElementById("canvas")
const canvas2 = document.getElementById("CursorLayer");

canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
// canvas2.style.zIndex = 8;
canvas2.style.position = "absolute";
canvas2.style.border = '1px solid #000';
var selectedWidth = 0;
var selectedHeight = 0;
// canvas2.style.marginLeft = "10%";


// var body = document.getElementsByTagName("body")[0];
// body.appendChild(canvas2);
// cursorLayer = document.getElementById("CursorLayer");

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
var mouseX, mouseY;


let prevX = null
let prevY = null
let selecting = false;
let lineWidth = 10;

ctx.lineWidth = lineWidth

let draw = false;
// modes: 0-draw 1-select 2-recognition
let mode = 0;
const selR= 0, selG = 0, selB = 0;

let clrs = document.querySelectorAll(".stroke");
clrs = Array.from(clrs);
clrs.forEach(clr => {
    clr.addEventListener("click", (e) => {
        console.log(e.target.value);
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
    // let rgb = hexToRgb(color);
    // console.log(rgb);
    // ctx.strokeStyle = 'red';
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
        clrDraw = true;
        draw = false
    } else if (mode === 1) {
        isDragging = false;
    }
})

window.addEventListener("mousemove", (e) => {
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
    var code = event.code;
    console.log("got here");
    if (name === "q") {
        if (mode === 0) {

        } else if (mode === 1) {
            console.log("got here");
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