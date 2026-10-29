let balls = [];
let numberOfBalls = 300; // Lower number keeps it running smoothly

let video;
let bodySegmentation;
let segmentation;
let options = { maskType: "person" };

async function setup() {
  createCanvas(640, 480);

  // Set up webcam
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Load ml5 body segmentation model
  bodySegmentation = await ml5.bodySegmentation("SelfieSegmentation", options);
  bodySegmentation.detectStart(video, gotResults);

  // Create the balls
  for (let i = 0; i < numberOfBalls; i++) {
    balls.push(Ball.createRandomBall());
  }
}

function gotResults(result) {
  segmentation = result;
}

function draw() {
  background(20);

  // Optional debug: uncomment to see your body mask on screen
  // if (segmentation && segmentation.mask) {
  //   image(segmentation.mask, 0, 0, width, height);
  // }

  // Update and check each ball against the body mask
  for (let ball of balls) {
    if (segmentation && segmentation.mask) {
      let onBody = ball.isOnBody(segmentation.mask);
      ball.respond(onBody);
    }
    ball.update();
  }
}

// Manual click test
function mousePressed() {
  for (let ball of balls) {
    let isInside = ball.contains(mouseX, mouseY);
    ball.respond(isInside);
  }
}
