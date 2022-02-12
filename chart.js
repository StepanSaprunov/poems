/*
   + нарисовать градиент
   - нарисовать оси
   - добавить точки
   - сделать так чтобы точки можно было двигать 
   - соединить точки линиями
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
    }

    #drawGradient() {
        this.gradient.addColorStop(0, "red");
        this.gradient.addColorStop(1, "blue");
        this.context.fillStyle = this.gradient;
        this.context.fillRect(10, 10, this.width-20, this.height-20);
        this.context.strokeRect(0, 0, this.width, this.height);
    }

    #drawaxis() {
        if (this.mobile) {

        }
    }
}



let chart = new Chart(
    document.getElementById("chart"), 
    4, 
    vwToPixels(1) < vhToPixels(1));
let scroll0 = document.getElementById("scroll0");
scroll0.addEventListener("click", ()=>{
    document.getElementById("chart-block").scrollIntoView();
})
let scroll1 = document.getElementById("scroll1");
scroll1.addEventListener("click", ()=>{
    document.getElementById("who-block").scrollIntoView();
})