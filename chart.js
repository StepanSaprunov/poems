/*
   + нарисовать градиент
   - нарисовать график
   - добавить точки
   - сделать так чтобы точки можно было двигать вертикально
   - соединить точки линиями
   - добавить возможность увеличивать график
*/

class Chart {

    constructor (canvas, width, height, dots) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
        this.dotsNumber = dots;
        this.width = width;
        this.height = height;
        this.#drawGradient();
    }

    #drawGradient() {
        this.gradient = this.context.createLinearGradient(0,0, 0, this.height);
        this.gradient.addColorStop(0, "red");
        this.gradient.addColorStop(1, "blue");
        this.context.fillStyle = this.gradient;
        this.context.fillRect(10, 10, this.width-20, this.height-20);
        this.context.strokeRect(10, 10, this.width-20, this.height-20);
        this.context.strokeRect(0, 0, this.width, this.height);
    }
}

let chart = new Chart(document.getElementById("chart"), 400, 200, 4);
let scroll0 = document.getElementById("scroll0");
scroll0.addEventListener("click", ()=>{
    document.getElementById("emotions-block").scrollIntoView();
})
let scroll1 = document.getElementById("scroll1");
scroll1.addEventListener("click", ()=>{
    document.getElementById("who-block").scrollIntoView();
})
let scroll2 = document.getElementById("scroll2");
scroll2.addEventListener("click", ()=>{
    document.getElementById("chart-block").scrollIntoView();
})
let scroll3 = document.getElementById("scroll3");
scroll3.addEventListener("click", ()=>{
    document.getElementById("emotions-block").scrollIntoView();
})