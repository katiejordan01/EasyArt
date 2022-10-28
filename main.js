const canvas = document.getElementById("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth

const ctx = canvas.getContext("2d")
const {width, height} = canvas;

let prevX = null
let prevY = null

ctx.lineWidth = 5

let draw = false

let clrs = document.querySelectorAll(".clr")
clrs = Array.from(clrs)
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr
    })
    clr.addEventListener("mousedown", () => {
        const {width, height} = canvas;
        const gradientH = ctx.createLinearGradient(0, 0, 10, 0);
        gradientH.addColorStop(0, "rgb(255, 0, 0)"); // red
        gradientH.addColorStop(1/6, "rgb(255, 255, 0)"); // yellow
        gradientH.addColorStop(2/6, "rgb(0, 255, 0)"); // green
        gradientH.addColorStop(3/6, "rgb(0, 255, 255)");
        gradientH.addColorStop(4/6, "rgb(0, 0, 255)"); // blue
        gradientH.addColorStop(5/6, "rgb(255, 0, 255)");
        gradientH.addColorStop(1, "rgb(255, 0, 0)"); // red
        ctx.fillStyle = gradientH;
        ctx.fillRect(0, 0, width, height);
        const gradientV = ctx.createLinearGradient(0, 0, 0, height);
        gradientV.addColorStop(0, "rgba(255, 255, 255, 1)"); // white
        gradientV.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradientV.addColorStop(0.5, "rgba(0, 0, 0, 0)"); // transparent
        gradientV.addColorStop(1, "rgba(0, 0, 0, 1)"); // black
        ctx.fillStyle = gradientV;
        ctx.fillRect(0, 0, width, height);
    })
})

let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
    // Clearning the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})


window.addEventListener("mousedown", (e) => draw = true)
window.addEventListener("mouseup", (e) => draw = false)

window.addEventListener("mousemove", (e) => {
    if(prevX == null || prevY == null || !draw){
        prevX = e.clientX
        prevY = e.clientY
        return
    }

    let currentX = e.clientX
    let currentY = e.clientY

    ctx.beginPath()
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(currentX, currentY)
    ctx.stroke()

    prevX = currentX
    prevY = currentY
})