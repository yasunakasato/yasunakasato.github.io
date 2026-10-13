// Bug position and slow speed
let bugX = 200;
let bugY = 200;
let speedX = 1.5;
let speedY = 1.2;

// Track whether space is held down
let isPlayingDead = false;

// 1. ARRAY: Much slower speeds to trigger cat stalking instincts
let speeds = [-2.5, -1.5, 1.5, 2.5];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("sketch-holder");

  // Native window listeners ensure space works even if canvas isn't clicked first
  window.addEventListener("keydown", function (e) {
    if (e.code === "Space" || e.key === " ") {
      isPlayingDead = true;
      e.preventDefault(); // stops page from scrolling down
    }
  });

  window.addEventListener("keyup", function (e) {
    if (e.code === "Space" || e.key === " ") {
      isPlayingDead = false;
    }
  });
}

function draw() {
  // Pure black background for high contrast
  background(0);

  // 2. CONDITIONALS & MOVEMENT:
  // Move only if NOT playing dead
  if (!isPlayingDead) {
    bugX = bugX + speedX;
    bugY = bugY + speedY;
  }

  // Bounce off left / right edges
  if (bugX > width - 70 || bugX < 70) {
    speedX = speedX * -1;
    speedY = random(-1.5, 1.5);
  }

  // Bounce off top / bottom edges
  if (bugY > height - 70 || bugY < 70) {
    speedY = speedY * -1;
    speedX = random(-1.5, 1.5);
  }

  // 5. CUSTOM FUNCTION: Call our function to draw the bug
  drawCockroach(bugX, bugY);
}

// 6. MOUSE: Clicking or cat paw taps moves it and keeps speed slow
function mousePressed() {
  bugX = mouseX;
  bugY = mouseY;
  speedX = random(speeds);
  speedY = random(speeds);
}

// Custom function: draws the bug in bright electric blue
function drawCockroach(x, y) {
  fill(0, 229, 255);
  stroke(0, 229, 255);

  // 6 legs
  strokeWeight(5);
  line(x - 55, y - 35, x + 55, y - 35);
  line(x - 65, y, x + 65, y);
  line(x - 55, y + 35, x + 55, y + 35);

  // Antennae
  line(x - 15, y - 60, x - 50, y - 100);
  line(x + 15, y - 60, x + 50, y - 100);

  // Main body
  rectMode(CENTER);
  rect(x, y, 60, 100, 20);

  // Head
  noStroke();
  circle(x, y - 50, 40);
}
