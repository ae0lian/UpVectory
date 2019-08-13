export default function Canvas() {
    // Circles
    let arrCircles = [];
    let c;
    var qCircles;
    let innerWidth ;
    let innerHeight;
    let that = this;
    this.idAnimation;

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    this.create = function() {
        const circleCanvas = document.createElement("canvas");
        circleCanvas.style = "position: absolute; top: 0; left: 0; z-index: -1;";
        circleCanvas.id = "circleCanvas";
        circleCanvas.width = window.innerWidth - (window.innerWidth - document.documentElement.clientWidth);
        circleCanvas.height = document.documentElement.scrollHeight;
        document.body.append(circleCanvas);
        c = circleCanvas.getContext('2d');
    
        innerWidth = window.innerWidth - (window.innerWidth - document.documentElement.clientWidth);
        innerHeight = document.documentElement.scrollHeight;

        if (innerWidth < 550) {
            qCircles = 3;
        }  else {
            qCircles = 6;
        }
    }


    this.generate = function () {
        arrCircles = [];
        for (var i = 0; i < qCircles; i++) {
            var radius;
            if (innerWidth < 550) {
                radius = getRandom(20, 50);
            } else {
                radius = getRandom(50, 120);
            }
            const x = Math.random() * (innerWidth - radius * 2) + radius;
            const y = Math.random() * (innerHeight - radius * 2) + radius;
            const dx = (Math.random() - 0.5) * 2;
            const dy = (Math.random() - 0.5) * 2;
            var rgb = "rgb(255, 255, 255, 0.2)";

            arrCircles.push(new Circle(x, y, dx, dy, radius, rgb));
        }
    }
    function animate () {
        that.idAnimation = requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth, innerHeight);
        for (var i = 0; i < arrCircles.length; i++) {
            arrCircles[i].update();
        }
    }

    this.init = function() {
        cancelAnimationFrame(this.idAnimation);
        this.create();
        this.generate();
        this.idAnimation = requestAnimationFrame(animate);
    }

    function Circle(x, y, dx, dy, radius, rgb) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.dr = 0.5;
        this.initRadius = radius;
        this.fillStyle = rgb;
        this.angle = 0
        this.radius

        if (innerWidth < 550) {
            this.minRadius = getRandom(10, 30)
        } else {
            this.minRadius = getRandom(30, 55)
        }



        this.draw = function () {
            c.beginPath();
            c.fillStyle = this.fillStyle;
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fill();
            this.angle += Math.PI / 720;

        }

        this.update = function () {
            if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            this.x += this.dx;

            if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }
            this.y += this.dy;


            this.radius = this.initRadius + 75 * Math.abs(Math.cos(this.angle));


            this.draw();
        }



    }
}
