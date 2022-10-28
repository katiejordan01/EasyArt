const canvas = document.getElementById("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth

const ctx = canvas.getContext("2d")
//const {width, height} = canvas;

let prevX = null
let prevY = null

ctx.lineWidth = 5

let draw = false;
let clrDraw = true;
let clrWidth = 200;
let clrHeight = 150;

let clrX;

let clrY;
let clrX2;
let clrY2;

let clrs = document.querySelectorAll(".clr")
clrs = Array.from(clrs)
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr
    })
    clr.addEventListener("mousedown", (e) => {

        clrDraw = false;
        clrX = e.clientX - clrWidth/2;
        //680
        clrY = e.clientY - clrHeight;
        clrX2 = e.clientX + clrWidth/2;
        clrY2 = e.clientY;
        
        div = document.createElement('div');
        div.style.backgroundColor = "black";
        div.style.position = "absolute";
        div.style.left = "0px";
        div.style.top = "0px";
        div.style.width = "50px";
        div.style.height = "50px";
        div.setAttribute("id", "uniqueIdentifier");
        document.getElementsByTagName('body')[0].appendChild(div);


        const gradientH = ctx.createLinearGradient(clrX, 0, clrX2, 0);
        gradientH.addColorStop(0, "rgb(255, 0, 0)"); // red
        gradientH.addColorStop(1/6, "rgb(255, 255, 0)"); // yellow
        gradientH.addColorStop(2/6, "rgb(0, 255, 0)"); // green
        gradientH.addColorStop(3/6, "rgb(0, 255, 255)");
        gradientH.addColorStop(4/6, "rgb(0, 0, 255)"); // blue
        gradientH.addColorStop(5/6, "rgb(255, 0, 255)");
        gradientH.addColorStop(1, "rgb(255, 0, 0)"); // red
        ctx.fillStyle = gradientH;
        ctx.fillRect(clrX, clrY, clrWidth, clrHeight);
        const gradientV = ctx.createLinearGradient(0, clrY, 0, clrY2);
        gradientV.addColorStop(0, "rgba(255, 255, 255, 1)"); // white
        gradientV.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradientV.addColorStop(0.5, "rgba(0, 0, 0, 0)"); // transparent
        gradientV.addColorStop(1, "rgba(0, 0, 0, 1)"); // black
        ctx.fillStyle = gradientV;
        ctx.fillRect(clrX, clrY, clrWidth, clrHeight);

    })

})

let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
    // Clearning the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})


window.addEventListener("mousedown", (e) => {
    if (clrDraw === true) {
        draw = true
    }
    
})
window.addEventListener("mouseup", (e) => {
    const element = document.getElementById('uniqueIdentifier');
    if (element !== null) {
       element.remove(); 
    }
    clrDraw = true;
    draw = false
})

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