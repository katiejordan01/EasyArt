const canvas = document.getElementById("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const colorSelector = document.getElementById('stroke');
let thickness = document.getElementById("thickness");

const ctx = canvas.getContext("2d")

let utensil = 0;
let color = '#000000';

let prevX = null
let prevY = null
let selecting = false;
let lineWidth = thickness.value;

ctx.lineWidth = lineWidth

let draw = false;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

let penBtn = document.querySelector(".pen")
penBtn.addEventListener("click", () => {
    utensil = 0;
    ctx.globalAlpha = 1;
    console.log(utensil);
})
let pencilBtn = document.querySelector(".pencil")
pencilBtn.addEventListener("click", () => {
    utensil = 2;
    ctx.globalAlpha = .9;
})
let airbrushBtn = document.querySelector(".airbrush")
airbrushBtn.addEventListener("click", () => {
    utensil = 1;
    // let rgb = hexToRgb(color);
    // console.log(rgb);
    // ctx.strokeStyle = 'red';
    ctx.globalAlpha = 0.05;

})


window.addEventListener("mousedown", (e) => {
    draw = true;
    
})
window.addEventListener("mouseup", (e) => {
    clrDraw = true;
    draw = false
})

window.addEventListener("mousemove", (e) => {
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
            ctx.arc(e.clientX, e.clientY,lineWidth, 0, Math.PI*2);
        } else if (utensil === 0) {
            ctx.arc(e.clientX, e.clientY,lineWidth, 0, Math.PI*2)
        }

        ctx.stroke()
        

        prevX = currentX
        prevY = currentY
        
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