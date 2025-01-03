class Shape {
    constructor(x, y, velX, velY) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = true;
    }
}

class Ball extends Shape {
    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY);
        this.color = color;
        this.size = size;
    }

    draw(context) {
        if (this.exists) {
            context.beginPath();
            context.fillStyle = this.color;
            context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            context.fill();
        }
    }

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

class EvilCircle extends Shape {
    constructor(x, y, velX, velY, size) {
        super(x, y, velX, velY);
        this.size = size;
        this.changePosition(); // Set initial position
    }

    changePosition() {
        // Randomly change the position of the EvilCircle
        this.x = Math.random() * (canvas.width - this.size * 2);
        this.y = Math.random() * (canvas.height - this.size * 2);
    }

    draw(context) {
        if (this.exists) {
            // Draw the black fill
            context.beginPath();
            context.fillStyle = 'black'; // Fill color
            context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            context.fill();

            // Draw the white border
            context.lineWidth = 4; // Set the border width
            context.strokeStyle = 'white'; // Border color
            context.stroke();
        }
    }

    update() {
        if ((this.x + this.size) >= canvas.width || (this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }

        if ((this.y + this.size) >= canvas.height || (this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    eatBall() {
        ballsCount--;
        scoreDisplay.textContent = `Balls left: ${ballsCount}`;
    }
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 1250;
canvas.height = 550;

let balls = [];
let ballsCount = 0;
const scoreDisplay = document.getElementById('score');

const colors = ['blue', 'green', 'yellow', 'purple', 'orange', 'pink'];


// Create balls
for (let i = 0; i < 25; i++) {
    const size = Math.random() * 20 + 10;
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

// Create an EvilCircle instance
const evilCircle = new EvilCircle(400, 300, 0, 0, 15);

// Update the score display
scoreDisplay.textContent = `Balls left: ${ballsCount}`;

// Game loop
function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update balls
    for (let ball of balls) {
        if (ball.exists) {
            ball.draw(context);
            ball.update();
            ball.collisionDetect(evilCircle);
        }
    }

    // Draw and update the evil circle
    evilCircle.draw(context);
    evilCircle.update();

    // Request the next animation frame
    requestAnimationFrame(loop);
}

// Start the game loop
loop();

