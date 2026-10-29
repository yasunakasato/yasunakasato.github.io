let balls = [];
let video;
let bodySegmentation;
let segmentation;
let options = { maskType: "person" };

async function setup() {
  // Create canvas and attach it to the sketch-holder div in index.html
  let canvas = createCanvas(640, 480);
  canvas.parent("sketch-holder");

  // Create and hide the webcam video feed
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Load the ml5 body segmentation model asynchronously
  bodySegmentation = await ml5.bodySegmentation("SelfieSegmentation", options);
  bodySegmentation.detectStart(video, gotResults);

  // Populate the array with random balls
  for (let i = 0; i < 50; i++) {
    balls.push(Ball.createRandomBall(width, height));
  }
}

// Callback function that receives and stores the latest segmentation results
function gotResults(result) {
  segmentation = result;
}

function draw() {
  background(240);

  // Optional: Draw the segmentation mask to visualize yourself on screen
  if (segmentation && segmentation.mask) {
    image(segmentation.mask, 0, 0);
  }

  // Update every ball and check interaction with both body mask and mouse clicks
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];

    // Check if the ball is over your body in the webcam view
    let onBody = false;
    if (segmentation && segmentation.mask) {
      onBody = b.isOnBody(segmentation.mask);
    }

    // Check if the ball is currently clicked by the mouse
    let clicked = b.contains(mouseX, mouseY) && mouseIsPressed;

    // Respond if either the body mask or a mouse click activates it
    b.respond(onBody || clicked);
    b.update();
  }
}
