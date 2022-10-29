const canvas = document.getElementById('draw');
const tools = document.getElementById('tool');
const ctx = canvas.getContext('2d');
const colorSelector = document.getElementById('stroke');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

console.log("x:" + canvasOffsetX);
console.log("y:" + canvasOffsetY);
console.log("x1:" + window.innerWidth);
console.log("y1:" + window.innerHeight);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var eraserImg = new Image();
eraserImg.src = "eraser_icon.png"
let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

tools.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (e.target.id === 'eraser') {
        console.log("I'm using the eraser now!");
        ctx.strokeStyle = "#FFFFFF";
        document.body.style.cursor = "url(https://findicons.com/files/icons/1156/fugue/16/eraser.png), auto";
    } else if (e.target.id === "pen") {
        console.log("I'm using the pen now!")
        ctx.strokeStyle = colorSelector.value;
        document.body.style.cursor = "url(https://findicons.com/files/icons/1620/crystal_project/22/14_pencil.png), auto";
    } else if (e.target.id === "text") {
        document.body.style.cursor = "text";
    } else if (e.target.id === "stroke") {
        ctx.strokeStyle = e.target.value;
    }
});
tools.addEventListener('dblclick', (event) => {
    ctx.strokeStyle = "#FFFFFF";
});



tools.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
    
});

const draw = (e) => {
    if(!isPainting) {
        return;
    } else if (isPainting) {
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
        ctx.stroke();
    }
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', (e) => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});
canvas.addEventListener('mousemove', draw);


//paint bucket
canvas.addEventListener('click', function (evt) {
    if (evt.detail === 3) {
        pixelStack = [[evt.clientX, evt.clientY]];

        while(pixelStack.length)
        {
        var newPos, x, y, pixelPos, reachLeft, reachRight;
        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];
        
        pixelPos = (y*canvas.width + x) * 4;
        while(y-- >= 0 && matchStartColor(pixelPos))
        {
            pixelPos -= canvasWidth * 4;
        }
        pixelPos += canvasWidth * 4;
        ++y;
        reachLeft = false;
        reachRight = false;
        while(y++ < canvasHeight-1 && matchStartColor(pixelPos))
        {
            colorPixel(pixelPos);

            if(x > 0)
            {
            if(matchStartColor(pixelPos - 4))
            {
                if(!reachLeft){
                pixelStack.push([x - 1, y]);
                reachLeft = true;
                }
            }
            else if(reachLeft)
            {
                reachLeft = false;
            }
            }
            
            if(x < canvasWidth-1)
            {
            if(matchStartColor(pixelPos + 4))
            {
                if(!reachRight)
                {
                pixelStack.push([x + 1, y]);
                reachRight = true;
                }
            }
            else if(reachRight)
            {
                reachRight = false;
            }
            }
                    
            pixelPos += canvasWidth * 4;
        }
        }
        context.putImageData(colorLayer, 0, 0);
    }
})

function matchStartColor(pixelPos)
{
  var r = colorLayer.data[pixelPos];	
  var g = colorLayer.data[pixelPos+1];	
  var b = colorLayer.data[pixelPos+2];
	
  return (r == startR && g == startG && b == startB);
}

function colorPixel(pixelPos)
{
  colorLayer.data[pixelPos] = fillColorR;
  colorLayer.data[pixelPos+1] = fillColorG;
  colorLayer.data[pixelPos+2] = fillColorB;
  colorLayer.data[pixelPos+3] = 255;
}

