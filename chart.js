/*
   + нарисовать градиент
   + нарисовать оси
   + добавить точки
   - сделать так чтобы точки можно было двигать 
   - добавить возможность увеличивать график
*/

function vhToPixels (vh) {
    return Math.round(window.innerHeight / (100 / vh));
}
function vwToPixels (vw) {
    return Math.round(window.innerWidth / (100 / vw));
}

class Chart {

    constructor (canvas, dots, mobile) {
        this.dots = [];
        for (let i = 0; i < dots; i++) {
            this.dots.push({
                offset: 0,
                x: 0,
                y: 0,
                radius: 10,
            });
        }
        
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.mobile = mobile;
        if (mobile) {
            this.canvas.width = vwToPixels(100);
            this.canvas.height = vhToPixels(80);
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.gradient = this.context.createLinearGradient(this.width, 0, 0, 0);
        }
        else {
            this.canvas.width = vwToPixels(60);
            this.canvas.height = vhToPixels(80);
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.gradient = this.context.createLinearGradient(0,0, 0, this.height);
        }
        if (this.mobile) {
            let step = (this.height - 40*2 - 10 - 10)/(this.dots.length);
            this.dots.forEach((el, i)=>{
                el.x = this.width/2 + el.offset;
                el.y = 10+i*step + 40*2 + 10;
                el.radius = 10;
            })
        }
        else {
            let step = (this.width - 40*2 - 10 - 10)/(this.dots.length + 1);
            for (let i = 0; i < this.dots.length; i++) {
                this.dots[i].x = 10+i*step + 40*2 + 10;
                this.dots[i].y = this.height/2 + this.dots[i].offset;
                this.dots[i].radius = 10;
            }
        }
        this.dotsNumber = dots;
        this.#doDrawing();
        this.isDragging = false;
        this.dotDragging = -1;
        const mouseDown = (e) => {
            let offsetX = this.canvas.getBoundingClientRect().left;
            let offsetY = this.canvas.getBoundingClientRect().top;
            e.preventDefault();
            e.stopPropagation();
            let mx=parseInt(e.clientX-offsetX);
            let my=parseInt(e.clientY-offsetY);
            if (this.mobile) {
                mx = e.changedTouches[0].clientX-offsetX;
                my = e.changedTouches[0].clientY-offsetY;
            }
            function inRadius(x,y, x1, y1, radius){
                return Math.pow((Math.pow((x1-x),2) + Math.pow((y1-y), 2)), 0.5) <= radius*2;
            }
            for (let i = 0; i < this.dots.length; i++) {
                if (inRadius(mx, my, this.dots[i].x, this.dots[i].y, this.dots[i].radius)) {
                    this.isDragging = true;
                    this.dotDragging = i;
                    break;
                }
            }
        }
        const mouseMove = (e) => {
            let offsetX = this.canvas.getBoundingClientRect().left;
            let offsetY = this.canvas.getBoundingClientRect().top;
            if (this.isDragging) {
                e.preventDefault();
                e.stopPropagation();
                let mx=parseInt(e.clientX-offsetX);
                let my=parseInt(e.clientY-offsetY);
                if (this.mobile) {
                    mx=e.changedTouches[0].clientX;
                    my=e.changedTouches[0].clientY;
                }
                if (this.mobile) {
                    this.dots[this.dotDragging].x = mx;
                    this.#clearCanvas();
                    this.#doDrawing();
                }
                else {
                    this.dots[this.dotDragging].y = my;
                    this.#clearCanvas();
                    this.#doDrawing();
                }
            }
        }
        const mouseUp = (e) => {
            this.isDragging = false;
            this.dotDragging = -1;
        }
       
        
        if (mobile) {
            this.canvas.addEventListener("touchmove", mouseMove);
            this.canvas.addEventListener("touchstart", mouseDown);
            this.canvas.addEventListener("touchend", mouseUp);
        }
        else {
            this.canvas.addEventListener("mousemove", mouseMove);
            this.canvas.addEventListener("mousedown", mouseDown);
            this.canvas.addEventListener("mouseup", mouseUp);
        }
    }

    #doDrawing() {
        this.#drawGradient();
        this.#drawAxis();
        this.#drawDots();
    }

    #clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    #drawGradient() {
        this.gradient.addColorStop(0, "red");
        this.gradient.addColorStop(1, "blue");
        this.context.fillStyle = this.gradient;
        this.context.fillRect(40, 40, this.width-80, this.height-80);
    }

    #drawAxis() {
        if (this.mobile) {
            this.context.lineWidth = 5;
            this.context.beginPath();
            this.context.moveTo(this.width/2, 40);
            this.context.lineTo(this.width/2, this.height-40);
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(40, 50);
            this.context.lineTo(this.width-40, 50);
            this.context.stroke();
        }
        else {
            this.context.lineWidth = 5;
            this.context.beginPath();
            this.context.moveTo(40, this.height/2);
            this.context.lineTo(this.width-40, this.height/2);
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(50, 40);
            this.context.lineTo(50, this.height-40);
            this.context.stroke();
        }
    }

    #drawDots() {
        if (this.mobile) {
            let step = (this.height - 40*2 - 10 - 10)/(this.dots.length);
            this.dots.forEach((el, i)=>{
                this.context.beginPath();
                this.context.arc(el.x, el.y, el.radius, 0, Math.PI*2, false);
                this.context.stroke();
            })
        }
        else {
            let step = (this.width - 40*2 - 10 - 10)/(this.dots.length + 1);
            for (let i = 0; i < this.dots.length; i++) {
                this.context.beginPath();
                this.context.arc(this.dots[i].x, this.dots[i].y, this.dots[i].radius, 0, Math.PI*2, false);
                this.context.stroke();
            }
        }
    }
}

if (vwToPixels(1) < vhToPixels(1)) {
    document.getElementsByTagName("body")[0].classList.add("mobile");
    document.getElementsByClassName("chart")[0].classList.add("mobile-chart");
}

let chart = new Chart(
    document.getElementById("chart"), 
    10, 
    vwToPixels(1) < vhToPixels(1));

