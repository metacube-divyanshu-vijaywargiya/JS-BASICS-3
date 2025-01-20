//Base class for both colorful balls and evil circle
class Shape {
    constructor(x, y, velX, velY) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = true;
    }
}

//Colorfull balls extending shape class
class Ball extends Shape {
    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY); //calling constructor of Shape class
        this.color = color;
        this.size = size;
    }

    //Method for creating colorfull balls on the canvas
    draw(context) {
        if(this.exists){
            context.beginPath();
            context.fillStyle = this.color;
            context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            context.fill();
        }
    }

    //Method for updating velocity of balls
    update() {
        if ((this.x + this.size) >= canvas.width) {
            this.velX = -(this.velX);
        }

        if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }

        if ((this.y + this.size) >= canvas.height) {
            this.velY = -(this.velY);
        }

        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    //Method to detect collision of colorful ball with evil circle
    collisionDetect(evilCircle) {
        const dx = this.x - evilCircle.x;
        const dy = this.y - evilCircle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + evilCircle.size) {
            this.exists = false;
            evilCircle.eatBall();
        }
    }
}


//Extending shape class to make Evil circle class
class EvilCircle extends Shape {
    constructor(x, y, velX, velY, size) {
        super(x, y, velX, velY);  //calling constructor of Shape class
        this.size = size;
        this.changePosition(); // Set initial position of evil circle on canvas
    }

    // Randomly change the position of the EvilCircle
    changePosition() {
        this.x = Math.random() * (canvas.width - this.size * 2);
        this.y = Math.random() * (canvas.height - this.size * 2);
    }

    //Method to draw evil circle on canvas and styling it
    draw(context) {
            context.beginPath();
            context.fillStyle = 'black'; 
            context.arc(this.x, this.y, this.size, 0, 2 * Math.PI); //context.arc(x, y, radius, startAngle, endAngle);
            context.fill();

            context.lineWidth = 4;
            context.strokeStyle = 'white';
            context.stroke();
    }

    eatBall() {
        ballsCount--;
        scoreDisplay.textContent = `Balls left: ${ballsCount}`;
    }
}

//defining canvas and its size
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 1250;
canvas.height = 550;

let balls = []; //to store all the balls which are on canvas
let ballsCount = 0; //to store number of balls left
const scoreDisplay = document.getElementById('score');

const colors = ['blue', 'green', 'yellow', 'purple', 'orange', 'pink'];


// Create balls
for (let i = 0; i < 25; i++) {
    const size = Math.random() * 20 + 8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const ball = new Ball(
        Math.random() * (canvas.width - size * 1.5) + size,
        Math.random() * (canvas.height - size * 1.5) + size,
        Math.random() * 4 + 2,
        Math.random() * 4 + 2,
        color,
        size
    );
    balls.push(ball);
    ballsCount++;
}

// Create an EvilCircle with size 15 and everything 0 initially
const evilCircle = new EvilCircle(0, 0, 0, 0, 15);

// Update the score display
scoreDisplay.textContent = `Balls left: ${ballsCount}`;

// Game loop
function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update balls which are on canvas 
    for (let ball of balls) {
        if (ball.exists) {
            ball.draw(context);
            ball.update();
            ball.collisionDetect(evilCircle);
        }
    }

    // Draw the evil circle
    evilCircle.draw(context);

    // Request the next animation frame
    requestAnimationFrame(loop);
}

// Start the game loop
loop();

