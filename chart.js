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
            this.canvas.width = vwToPixels(90);
            this.canvas.height = vhToPixels(80);
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.gradient = this.context.createLinearGradient(this.width, 0, 0, 0);
        }
        else {
            this.canvas.width = vwToPixels(60);
            this.canvas.height = vhToPixels(40);
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.gradient = this.context.createLinearGradient(0,0, 0, this.height);
        }
        if (this.mobile) {
            let step = (this.height - 60)/(this.dots.length+1);
            this.dots.forEach((el, i)=>{
                el.x = this.width/2 + el.offset;
                el.y = i*step + 60;
                el.radius = 10;
            })
        }
        else {
            let step = (this.width - 60)/(this.dots.length + 1);
            for (let i = 0; i < this.dots.length; i++) {
                this.dots[i].x = i*step + 60;
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
            if (!this.mobile) {
                e.preventDefault();
                e.stopPropagation();
            }
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
                if (!this.mobile) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                    
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
        this.context.fillRect(0, 0, this.width, this.height);
    }

    #drawAxis() {
        if (this.mobile) {
            this.context.lineWidth = 5;
            this.context.beginPath();
            this.context.moveTo(this.width/2, 0);
            this.context.lineTo(this.width/2, this.height);
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(0, 20);
            this.context.lineTo(this.width, 20);
            this.context.stroke();
        }
        else {
            this.context.lineWidth = 5;
            this.context.beginPath();
            this.context.moveTo(0, this.height/2);
            this.context.lineTo(this.width, this.height/2);
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(20, 0);
            this.context.lineTo(20, this.height);
            this.context.stroke();
        }
    }

    #drawDots() {
        if (this.mobile) {
            let step = (this.height - 10 - 10)/(this.dots.length);
            this.dots.forEach((el, i)=>{
                if (i < this.dots.length-1) {
                    this.context.beginPath();
                    this.context.moveTo(el.x, el.y);
                    this.context.lineTo(this.dots[i+1].x, this.dots[i+1].y);
                    this.context.stroke();
                }
                this.context.beginPath();
                this.context.arc(el.x, el.y, el.radius, 0, Math.PI*2, false);
                this.context.stroke();
            })
        }
        else {
            let step = (this.width - 10 - 10)/(this.dots.length + 1);
            this.dots.forEach((el, i)=>{
                if (i < this.dots.length-1) {
                    this.context.beginPath();
                    this.context.moveTo(el.x, el.y);
                    this.context.lineTo(this.dots[i+1].x, this.dots[i+1].y);
                    this.context.stroke();
                }
                this.context.beginPath();
                this.context.arc(el.x, el.y, el.radius, 0, Math.PI*2, false);
                this.context.stroke();
            })
        }
    }

    addPoint() {
        if (this.dots.length < 20) {
            if (this.mobile) {
                this.dots.push({
                    offset: 0,
                    x: this.width/2,
                    y: 0,
                    radius: 10,
                });
            }
            else {
                this.dots.push({
                    offset: 0,
                    x: 0,
                    y: this.height/2,
                    radius: 10,
                });
            }
            this.#updateDotsCoordinates();
            this.#clearCanvas();
            this.#doDrawing();
            return true;
        }
        return false;
    }

    removePoint() {
        if (this.dots.length > 1)  {
            this.dots.pop();
            this.#updateDotsCoordinates();
            this.#clearCanvas();
            this.#doDrawing();
            return true;
        } 
        return false;
    }

    #updateDotsCoordinates() {
        if (this.mobile) {
            let step = (this.height-60)/(this.dots.length);
            this.dots.forEach((el, i)=>{
                el.y = 60+i*step;
                el.radius = 10;
            })
        }
        else {
            let step = (this.width-60)/(this.dots.length);
            for (let i = 0; i < this.dots.length; i++) {
                this.dots[i].x = 60+i*step;
                this.dots[i].radius = 10;
            }
        }
    }
}

let chart = new Chart(
    document.getElementById("chart"), 
    4, 
    vwToPixels(1) < vhToPixels(1));

document.getElementById("dot-increase").addEventListener("click", ()=>{
    if (chart.addPoint()) {
        let element = document.createElement('input');
        let parent = document.getElementById("strings-container");
        element.setAttribute("type", "text");
        element.setAttribute("name", 
            "string"+(parent.childElementCount));
        element.setAttribute("id",
            "string"+(parent.childElementCount));
        element.classList.add("string");
        parent.insertAdjacentElement("beforeend", element);
    }
})
document.getElementById("dot-decrease").addEventListener("click", ()=>{
    if (chart.removePoint()) {
        let parent = document.getElementById("strings-container");
        parent.removeChild(parent.lastElementChild);
    }
})