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
        this.dots = new Array(dots).fill({
            offset: 0,
            x: 0,
            y: 0,
            radius: 10,
        });
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.mobile = mobile;
        if (mobile) {
            this.canvas.width = vwToPixels(80);
            this.canvas.height = vhToPixels(80);
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.gradient = this.context.createLinearGradient(this.width, 0, 0, 0);
        }
        else {
            this.canvas.width = vwToPixels(80);
            this.canvas.height = vwToPixels(80)/2;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.gradient = this.context.createLinearGradient(0,0, 0, this.height);
        }
        this.dotsNumber = dots;
        this.#drawGradient();
        this.#drawAxis();
        this.context.save();
        this.#drawDots();
        this.isDragging = false;
        this.dotDragging = -1;
        const mouseDown = (e) => {
            let offsetX = this.canvas.getBoundingClientRect().left;
            let offsetY = this.canvas.getBoundingClientRect().top;
            e.preventDefault();
            e.stopPropagation();
            let mx=parseInt(e.clientX-offsetX);
            let my=parseInt(e.clientY-offsetY);
            function inRadius(x,y, x1, y1, radius){
                return ((x1-x)**2 + (y1-y)**2)*0.5 <= radius;
            }
            this.dots.forEach((el, i)=>{
                if (inRadius(mx, my, el.x, el.y, el.radius)) {
                    this.isDragging = true;
                    this.dotDragging = i;
                }
            })
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
                    this.dots[this.dotDragging].x = mx;
                }
                else {
                    this.dots[this.dotDragging].y = my;
                }
            }
        }
        const mouseUp = (e) => {
            this.isDragging = false;
            this.dotDragging = -1;
        }
        this.canvas.addEventListener("mousedown", mouseDown);
        this.canvas.addEventListener("mouseup", mouseUp);
        this.canvas.addEventListener("mousemove", mouseMove);
    }

    #drawGradient() {
        this.gradient.addColorStop(0, "red");
        this.gradient.addColorStop(1, "blue");
        this.context.fillStyle = this.gradient;
        this.context.fillRect(40, 40, this.width-80, this.height-80);
        this.context.strokeRect(0, 0, this.width, this.height);
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
                el.x = this.width/2 + el.offset;
                el.y = 10+i*step + 40*2 + 10;
                el.radius = 10;
                this.context.beginPath();
                this.context.arc(el.x, el.y, el.radius, 0, Math.PI*2, false);
                this.context.stroke();
            })
        }
        else {
            let step = (this.width - 40*2 - 10 - 10)/(this.dots.length + 1);
            this.dots.forEach((el, i)=>{
                el.x = 10+i*step + 40*2 + 10;
                el.y = this.height/2 + el.offset;
                el.radius = 10;
                this.context.beginPath();
                this.context.arc(el.x, el.y, el.radius, 0, Math.PI*2, false);
                this.context.stroke();
            })
        }
    }
}

let chart = new Chart(
    document.getElementById("chart"), 
    10, 
    vwToPixels(1) < vhToPixels(1));
let scroll0 = document.getElementById("scroll0");
scroll0.addEventListener("click", ()=>{
    document.getElementById("chart-block").scrollIntoView();
})
let scroll1 = document.getElementById("scroll1");
scroll1.addEventListener("click", ()=>{
    document.getElementById("who-block").scrollIntoView();
})