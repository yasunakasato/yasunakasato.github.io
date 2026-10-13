// Frame arrays for the two dances
let frames = []; // Dance 1: Your custom cat dance (8 poses)
let numFrames = 8;

let frames2 = []; // Dance 2: Jump dance (4 poses)
let numFrames2 = 4;

// Grid configuration
let cols = 4;
let rows = 4;
let colWidth, rowHeight;

// 2D arrays for per-cell colors and base speeds
let cellColors = [];
let speeds = [];

let firstName = "Yasu";
let lastName = "Nakasato";
let fullName = firstName + " " + lastName;

async function setup() {
  createCanvas(400, 400);

  colWidth = width / cols;
  rowHeight = height / rows;

  // Load dance 1: your custom cat frames
  for (let i = 0; i < numFrames; i++) {
    let fileName = "cat_dance/cat_" + i + ".svg";
    frames.push(await loadImage(fileName));
  }

  // Load dance 2: jump frames
  for (let i = 0; i < numFrames2; i++) {
    let fileName = "jump_frames/jump" + i + ".png";
    frames2.push(await loadImage(fileName));
  }

  // Initialize 2D arrays: each cell gets its own random color and base speed
  for (let i = 0; i < cols; i++) {
    cellColors[i] = [];
    speeds[i] = [];
    for (let j = 0; j < rows; j++) {
      cellColors[i][j] = color(
        random(150, 255),
        random(150, 255),
        random(150, 255),
      );
      speeds[i][j] = random(5, 12);
    }
  }
}

function draw() {
  background(250);

  // Maximum possible distance across canvas (corner-to-corner)
  let maxDist = dist(0, 0, width, height);

  // Nested loop across the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Find center of current cell
      let x = i * colWidth + colWidth / 2;
      let y = j * rowHeight + rowHeight / 2;

      // Part 1: Mouse reaction
      // Calculate distance from cell center to mouse
      let d = dist(x, y, mouseX, mouseY);

      // Scale the random base speed by distance
      // Closer to mouse = faster (smaller frame duration); farther = slower
      let speed = speeds[i][j] * map(d, 0, maxDist, 0.5, 3);

      // Part 2: Two dances on one floor
      // Checkerboard alternation: (i + j) % 2 switches between dance 1 and dance 2
      let danceFrames;
      if ((i + j) % 2 === 0) {
        danceFrames = frames;
      } else {
        danceFrames = frames2;
      }

      // Draw cell background
      noStroke();
      fill(cellColors[i][j]);
      rect(i * colWidth, j * rowHeight, colWidth, rowHeight);

      // Call single animate function with chosen frame set
      animate(danceFrames, x, y, speed);
    }
  }

  // Display name on top
  fill(0);
  textSize(18);
  textAlign(CENTER, TOP);
  text(fullName, width / 2, 8);
}

// Draw a single dancer frame at (x, y)
function animate(activeFrames, x, y, speed) {
  if (activeFrames.length === 0) return;

  // Pass activeFrames so getFrameIndex calculates the correct length
  let index = getFrameIndex(activeFrames, speed);

  imageMode(CENTER);
  image(activeFrames[index], x, y, colWidth * 0.8, rowHeight * 0.8);
}

// Calculate the frame index based on frameCount, speed, and array size
function getFrameIndex(activeFrames, speed) {
  let safeSpeed = max(speed, 0.5);
  let slowFrame = floor(frameCount / safeSpeed);

  return slowFrame % activeFrames.length;
}

// Pause/resume when pressing Spacebar
function keyPressed() {
  if (key === " ") {
    if (isLooping()) {
      noLoop();
    } else {
      loop();
    }
  }
}
