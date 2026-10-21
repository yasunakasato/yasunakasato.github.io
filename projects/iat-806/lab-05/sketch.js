let balls = [];
let numberOfBalls = 100; // You can increase this up to 500-5000 as in class

function setup() {
  createCanvas(600, 600);

  for (let i = 0; i < numberOfBalls; i++) {
    let ballX = random(0, width);
    let ballY = 300;
    let ballColor = color(120, 10, 140 + random(0, 100));
    let ballR = 25;
    let ball = new Ball(ballX, ballY, ballColor, ballR);
    balls.push(ball);
  }
}

function draw() {
  background(20);

  // Call change() for every ball, every frame
  for (let ball of balls) {
    ball.change(2);
  }
}

class Ball {
  constructor(x, y, c, r) {
    this.x = x;
    this.y = y;
    this.color = c;
    this.r = r;
    this.baseR = r; // Stores initial radius for pulsing
    this.offset = random(TWO_PI); // Gives each ball an individual pulse rhythm
  }

  // Master method that runs all behaviors, then draws the ball
  change(byHowMuch) {
    this.changeSize(byHowMuch);
    this.move(byHowMuch);

    // Call your two new methods before show()
    this.followMouse(0.02);
    this.pulse(10);

    this.show();
  }

  // Method 1: Smoothly slides the ball toward the mouse cursor
  followMouse(speed) {
    this.x = lerp(this.x, mouseX, speed);
    this.y = lerp(this.y, mouseY, speed);
  }

  // Method 2: Makes the ball breathe in and out using a smooth sine wave
  pulse(amplitude) {
    this.r = max(
      2,
      this.baseR + amplitude * sin(frameCount * 0.05 + this.offset),
    );
  }

  changeSize(byHowMuch) {
    this.r += random(-byHowMuch, byHowMuch);
    this.r = max(2, this.r);
  }

  move(byHowMuch) {
    this.x += random(-byHowMuch, byHowMuch);
    this.y += random(-byHowMuch, byHowMuch);
  }

  show() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.r * 2);
  }
}
