// Bug position and slow speed
let bugX = 200;
let bugY = 200;
let speedX = 1.5;
let speedY = 1.2;

// 1. ARRAY: Much slower speeds to trigger cat stalking instincts
let speeds = [-2.5, -1.5, 1.5, 2.5];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("sketch-holder");
}

function draw() {
  // Pure black background for high contrast
  background(0);

  // 2. CONDITIONALS & MOVEMENT:
  // Move only if the user is NOT holding the SPACE bar
  // 3. KEYBOARD: keyIsPressed checks if space is held
  if (keyIsPressed && key === " ") {
    // Bug freezes and plays dead!
  } else {
    bugX = bugX + speedX;
    bugY = bugY + speedY;
  }

  // Bounce off left / right edges (gentle, slow bounce angle)
  // 4. RANDOMNESS: random() changes the vertical bounce angle
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
  speedX = random(speeds); // Picks a slow speed from the array
  speedY = random(speeds); // Picks a slow speed from the array
}

// Custom function: draws the bug in bright electric blue
// 7. SEVERAL SHAPES: circle(), rect(), line()
function drawCockroach(x, y) {
  // High-contrast electric blue (peak spectrum for feline vision)
  fill(0, 229, 255);
  stroke(0, 229, 255);

  // SHAPE 1: line() for 6 legs
  strokeWeight(5);
  line(x - 55, y - 35, x + 55, y - 35); // Front legs
  line(x - 65, y, x + 65, y); // Middle legs
  line(x - 55, y + 35, x + 55, y + 35); // Back legs

  // Antennae
  line(x - 15, y - 60, x - 50, y - 100);
  line(x + 15, y - 60, x + 50, y - 100);

  // SHAPE 2: rect() for the main body
  rectMode(CENTER);
  rect(x, y, 60, 100, 20); // Rounded corners

  // SHAPE 3: circle() for the head
  noStroke();
  circle(x, y - 50, 40);
}
