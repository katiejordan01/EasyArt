const canvas = document.getElementById("canvas")
//const selector = document.getElementById('stroke');
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const colorSelector = document.getElementById('stroke');

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

const selR= 0, selG = 0, selB = 0;

// let clrs = document.querySelectorAll(".clr")
// clrs = Array.from(clrs)
// clrs.forEach(clr => {
//     clr.addEventListener("click", () => {
//         ctx.strokeStyle = clr.dataset.clr
//     })
//     clr.addEventListener("mousedown", (e) => {

//         clrDraw = false;
//         clrX = e.clientX - clrWidth/2;
//         //680
//         clrY = e.clientY - (clrHeight + 20);
//         clrX2 = e.clientX + clrWidth/2;
//         clrY2 = e.clientY - 20;
        
//         div = document.createElement('div');
//         div.style.backgroundImage = "linear-gradient(to right, white,red,orange,yellow,green,blue,indigo,violet,black)";
//         div.style.borderRadius = "10px"
//         div.style.borderStyle = "inset"
//         //div.style.backgroundImage = "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))";
//         div.style.position = "absolute";
//         div.style.left = clrX + "px";
//         div.style.top = clrY + "px";
//         div.style.width = clrWidth + "px";
//         div.style.height = clrHeight+ "px";
//         div.setAttribute("id", "clrSelector");
//         document.getElementsByTagName('body')[0].appendChild(div);

//         // let clrSelector = document.getElementById('clrSelector');

//         // clrSelector.addEventListener("mouseup", (e) => {
//         //     const x = e.clientX;
//         //     const y = e.clientY;
//         //     const imgData = ctx.getImageData(x, y, 1, 1);
//         //     const [selR, selG, SelB] = imgData.data;
//         // //     console.log(selR);
//         //     console.log(selG);
//         //     console.log(selB);
    
//         // })


//         // const gradientH = div.createLinearGradient(clrX, 0, clrX2, 0);
//         // gradientH.addColorStop(0, "rgb(255, 0, 0)"); // red
//         // gradientH.addColorStop(1/6, "rgb(255, 255, 0)"); // yellow
//         // gradientH.addColorStop(2/6, "rgb(0, 255, 0)"); // green
//         // gradientH.addColorStop(3/6, "rgb(0, 255, 255)");
//         // gradientH.addColorStop(4/6, "rgb(0, 0, 255)"); // blue
//         // gradientH.addColorStop(5/6, "rgb(255, 0, 255)");
//         // gradientH.addColorStop(1, "rgb(255, 0, 0)"); // red
//         // div.fillStyle = gradientH;
//         // div.fillRect(clrX, clrY, clrWidth, clrHeight);
//         // const gradientV = div.createLinearGradient(0, clrY, 0, clrY2);
//         // gradientV.addColorStop(0, "rgba(255, 255, 255, 1)"); // white
//         // gradientV.addColorStop(0.5, "rgba(255, 255, 255, 0)");
//         // gradientV.addColorStop(0.5, "rgba(0, 0, 0, 0)"); // transparent
//         // gradientV.addColorStop(1, "rgba(0, 0, 0, 1)"); // black
//         // div.fillStyle = gradientV;
//         // div.fillRect(clrX, clrY, clrWidth, clrHeight);

//     })

// })


// let clrSelector = document.getElementById('clrSelector');
// if (clrSelector != null) {
//     console.log("nice");
//     clrSelector.addEventListener("mouseup", (e) => {
//         const x = e.clientX;
//         const y = e.clientY;
//         const imgData = ctx.getImageData(x, y, 1, 1);
//         const [selR, selG, SelB] = imgData.data;
//         console.log(selR);
//         console.log(selG);
//         console.log(selB);

//     })
// }

let clrs = document.querySelectorAll(".stroke");
clrs = Array.from(clrs);
clrs.forEach(clr => {
    clr.addEventListener("click", (e) => {
        ctx.strokeStyle = e.target.value;
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
    const element = document.getElementById('clrSelector');
    if (element !== null) {
        const x = e.clientX;
        const y = e.clientY;
        let img = new Image();
        img.src = element.style.backgroundImage;
        // const imgData = img.getImageData(x, y, 1, 1);
        // const [selR, selG, selB] = imgData.data;
        // console.log(selR);
        // console.log(selG);
        // console.log(selB);
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