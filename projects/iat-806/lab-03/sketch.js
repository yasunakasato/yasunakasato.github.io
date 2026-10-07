let frames = [];
let numFrames = 8;

let sounds = [];
let numSounds = 4;
let soundIndex = 0;

// Arrays to support multiple dancers (our "something fun" feature)
let xs = [100];
let ys = [100];

let firstName = "Yasu";
let lastName = "Nakasato";
let fullName = firstName + " " + lastName;

async function setup() {
  createCanvas(400, 400);

  // Load custom cat animation frames
  for (let i = 0; i < numFrames; i++) {
    let fileName = "cat_dance/cat_" + i + ".svg";
    frames.push(await loadImage(fileName));
  }

  // Load sound effects into the sounds array
  for (let i = 0; i < numSounds; i++) {
    let soundName = "sounds/sound" + i + ".mp3";
    sounds.push(await loadSound(soundName));
  }
}

function draw() {
  background(250);
  fill("black");
  textSize(24);
  text(fullName, 100, 50);

  let speed = 10;
  let slowFrame = floor(frameCount / speed);
  let index = slowFrame % frames.length;

  // Draw all cats at their positions
  if (frames.length > 0) {
    for (let i = 0; i < xs.length; i++) {
      image(frames[index], xs[i], ys[i], 160, 160);
    }
  }
}

// 1. Play next sound and add a dancer on click
function mousePressed() {
  // Browsers require user interaction before audio starts
  userStartAudio();

  // Play next sound and cycle index
  if (sounds.length > 0) {
    sounds[soundIndex].play();
    soundIndex = (soundIndex + 1) % sounds.length;
  }

  // Something fun: click spawns a new cat dancer at mouse position
  xs.push(mouseX - 80);
  ys.push(mouseY - 80);
}

// 2. Pause and resume animation when pressing Spacebar
function keyPressed() {
  if (key === " ") {
    if (isLooping()) {
      noLoop();
    } else {
      loop();
    }
  }
}
