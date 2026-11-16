let bgImg = null;
let sherryImg = null;
let userCam = null;
let camReady = false;

let currentStage = 0;
let modalOpen = false;
let savedLetters = [];

// Sherry ghost animation variables
let sherryAlpha = 190;
let sherryFading = false;
let sherryFloatOffset = 0;
let sherryX = 0;
let sherryY = 0;
let sherryW = 0;
let sherryH = 0;

// Heart absorption glow effect
let heartGlowAlpha = 0;
let heartGlowColor = [255, 255, 255];

// Final text fade-in
let finalMessageAlpha = 0;

// 5 Grief Stages with meaningful symbolic colors
let stages = [
  {
    name: "Denial",
    question: "What part of this loss still feels unreal?",
    color: [195, 218, 245], // Misty Periwinkle Blue
    orbAlpha: 0,
    state: "appearing", // appearing -> active -> flyingToHeart -> done
  },
  {
    name: "Anger",
    question: "What feels most unfair about how things happened?",
    color: [242, 138, 122], // Warm Ember Coral
    orbAlpha: 0,
    state: "waiting",
  },
  {
    name: "Bargaining",
    question: "What do I wish I had more time to say or do with you?",
    color: [247, 206, 126], // Soft Amber Gold
    orbAlpha: 0,
    state: "waiting",
  },
  {
    name: "Depression",
    question:
      "Where do I feel that absence most heavily in my day-to-day life?",
    color: [148, 165, 224], // Quiet Twilight Indigo
    orbAlpha: 0,
    state: "waiting",
  },
  {
    name: "Acceptance",
    question:
      "What is one small step I can take to care for myself as I adjust to this new reality?",
    color: [176, 228, 202], // Serene Dawn Sage
    orbAlpha: 0,
    state: "waiting",
  },
];

let orb = {
  x: 0,
  y: 0,
  startX: 0,
  startY: 0,
  r: 58,
  currentR: 58,
  flyProgress: 0,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Cormorant Garamond");

  // Load images asynchronously so nothing can ever block the canvas
  loadImage(
    "kentucky blue grass.png",
    (img) => {
      bgImg = img;
    },
    () => {
      loadImage("kentucky blue grass.jpg", (img) => {
        bgImg = img;
      });
    },
  );

  loadImage(
    "Sherry.png",
    (img) => {
      sherryImg = img;
      updatePositions();
    },
    () => {
      loadImage("Sherry.jpg", (img) => {
        sherryImg = img;
        updatePositions();
      });
    },
  );

  updatePositions();
  setupModalEvents();

  // Initialize webcam feed
  userCam = createCapture(VIDEO, () => {
    camReady = true;
  });
  userCam.hide();
}

function updatePositions() {
  // Keep Sherry strictly in the center
  sherryH = height * 0.65;
  let imgAspect =
    sherryImg && sherryImg.width > 0
      ? sherryImg.width / sherryImg.height
      : 0.66;
  sherryW = sherryH * imgAspect;
  sherryX = width * 0.5;
  sherryY = height - sherryH / 2 - 12;

  // Slightly larger orb radius so your face is clearly visible inside it
  orb.r = constrain(min(width, height) * 0.075, 50, 68);
  orb.startX = sherryX;
  orb.startY = max(orb.r + 22, sherryY - sherryH / 2 - orb.r - 18);
  orb.x = orb.startX;
  orb.y = orb.startY;
  orb.currentR = orb.r;
}

function draw() {
  background(28, 36, 28);

  // 1. Draw Kentucky Bluegrass Background
  drawBackgroundCover();

  // 2. Draw Sherry strictly in the center
  drawSherryGhost();

  // 3. Draw warm heart glow when an orb enters her heart
  drawHeartGlow();

  // 4. Draw the Single Active Grief Orb (with live webcam inside!)
  drawCurrentOrb();

  // 5. Peaceful ending message once Sherry & the orb fade away
  if (sherryFading && sherryAlpha <= 5) {
    drawFinalMessage();
  }
}

function drawBackgroundCover() {
  if (!bgImg || bgImg.width <= 0) return;

  let imgRatio = bgImg.width / bgImg.height;
  let canvasRatio = width / height;
  let drawW, drawH;

  if (canvasRatio > imgRatio) {
    drawW = width;
    drawH = width / imgRatio;
  } else {
    drawH = height;
    drawW = height * imgRatio;
  }

  imageMode(CENTER);
  image(bgImg, width / 2, height / 2, drawW, drawH);
}

function getHeartPosition() {
  let currentSherryY = sherryY + sherryFloatOffset;
  return {
    x: sherryX,
    y: currentSherryY - sherryH * 0.16,
  };
}

function drawSherryGhost() {
  if (sherryAlpha <= 0 || !sherryImg || sherryImg.width <= 0) return;

  sherryFloatOffset = sin(frameCount * 0.025) * 8;

  if (sherryFading) {
    sherryAlpha = max(0, sherryAlpha - 1.1);
  }

  push();
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = `rgba(255, 250, 240, ${sherryAlpha / 255})`;
  tint(245, 245, 255, sherryAlpha);
  imageMode(CENTER);
  image(sherryImg, sherryX, sherryY + sherryFloatOffset, sherryW, sherryH);
  pop();
}

function drawHeartGlow() {
  if (heartGlowAlpha <= 0) return;

  let heart = getHeartPosition();
  heartGlowAlpha = max(0, heartGlowAlpha - 3.5);

  push();
  noStroke();
  let [r, g, b] = heartGlowColor;
  drawingContext.shadowBlur = 35;
  drawingContext.shadowColor = `rgba(${r}, ${g}, ${b}, ${heartGlowAlpha / 255})`;
  fill(r, g, b, heartGlowAlpha * 0.65);
  ellipse(heart.x, heart.y, 95 * (1 + (1 - heartGlowAlpha / 220) * 0.5));
  fill(255, 255, 255, heartGlowAlpha * 0.85);
  ellipse(heart.x, heart.y, 40);
  pop();
}

function drawCurrentOrb() {
  // Once all 5 letters are sent, the orb (and webcam inside it) are completely gone
  if (currentStage >= stages.length) {
    cursor(ARROW);
    return;
  }

  let stage = stages[currentStage];
  let [cr, cg, cb] = stage.color;
  let heart = getHeartPosition();

  if (stage.state === "appearing") {
    orb.x = orb.startX;
    orb.y = orb.startY + sin(frameCount * 0.035) * 6;
    orb.currentR = orb.r;
    orb.flyProgress = 0;

    stage.orbAlpha = min(255, stage.orbAlpha + 5);
    if (stage.orbAlpha >= 255) {
      stage.state = "active";
    }
  } else if (stage.state === "active") {
    orb.x = orb.startX;
    orb.y = orb.startY + sin(frameCount * 0.035) * 6;
    orb.currentR = orb.r;
  } else if (stage.state === "flyingToHeart") {
    orb.flyProgress = min(1, orb.flyProgress + 0.022);
    let ease = orb.flyProgress * orb.flyProgress * (3 - 2 * orb.flyProgress);

    let floatStartY = orb.startY + sin(frameCount * 0.035) * 6;
    orb.x = lerp(orb.startX, heart.x, ease);
    orb.y = lerp(floatStartY, heart.y, ease);

    orb.currentR = lerp(orb.r, 10, ease);

    if (orb.flyProgress > 0.72) {
      stage.orbAlpha = map(orb.flyProgress, 0.72, 1, 255, 0);
    }

    if (orb.flyProgress >= 1) {
      stage.state = "done";
      heartGlowColor = stage.color;
      heartGlowAlpha = 220;

      currentStage++;

      let remaining = stages.length - currentStage;
      sherryAlpha = map(remaining, 0, stages.length, 70, 190);

      if (currentStage < stages.length) {
        stages[currentStage].state = "appearing";
      } else {
        sherryFading = true;
      }
      return;
    }
  }

  let d = dist(mouseX, mouseY, orb.x, orb.y);
  let isHovered = stage.state === "active" && d < orb.currentR && !modalOpen;
  cursor(isHovered ? HAND : ARROW);

  let radius = isHovered ? orb.currentR * 1.06 : orb.currentR;
  let diameter = radius * 2;

  push();
  noStroke();

  // 1. Colored ethereal outer halo
  let pulse = sin(frameCount * 0.05) * 5;
  let outerGlow =
    (isHovered ? orb.currentR * 2.75 : orb.currentR * 2.35) + pulse;
  fill(cr, cg, cb, (stage.orbAlpha / 255) * 75);
  ellipse(orb.x, orb.y, outerGlow);

  // 2. Base orb glow behind the webcam
  drawingContext.shadowBlur = 26;
  drawingContext.shadowColor = `rgba(${cr}, ${cg}, ${cb}, ${stage.orbAlpha / 255})`;
  fill(cr, cg, cb, stage.orbAlpha * 0.85);
  ellipse(orb.x, orb.y, diameter);

  // 3. Live mirrored webcam clipped cleanly inside the question orb
  if (camReady && userCam && userCam.width > 0 && userCam.height > 0) {
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.arc(orb.x, orb.y, radius - 1.5, 0, TWO_PI);
    drawingContext.clip();

    // Scale webcam to cover the circle cleanly without stretching
    let camAspect = userCam.width / userCam.height;
    let drawW, drawH;
    if (camAspect > 1) {
      drawH = diameter;
      drawW = diameter * camAspect;
    } else {
      drawW = diameter;
      drawH = diameter / camAspect;
    }

    push();
    translate(orb.x, orb.y);
    scale(-1, 1); // Mirror horizontally
    imageMode(CENTER);
    tint(255, stage.orbAlpha * 0.92);
    image(userCam, 0, 0, drawW, drawH);
    pop();

    drawingContext.restore();
  }

  // 4. Soft symbolic color wash & glass rim over the webcam so the stage color and text stay readable
  fill(cr, cg, cb, stage.orbAlpha * 0.34);
  stroke(255, 255, 255, stage.orbAlpha * 0.92);
  strokeWeight(2.2);
  ellipse(orb.x, orb.y, diameter);

  // 5. Inner glass highlight
  noStroke();
  fill(255, 255, 255, stage.orbAlpha * 0.28);
  ellipse(orb.x - radius * 0.28, orb.y - radius * 0.28, radius * 0.6);

  // 6. Stage word centered inside the orb with a subtle shadow so it pops over your face
  if (orb.currentR > 22) {
    drawingContext.shadowBlur = 8;
    drawingContext.shadowColor = `rgba(255, 250, 245, ${stage.orbAlpha / 255})`;
    fill(28, 22, 18, stage.orbAlpha);
    textAlign(CENTER, CENTER);
    textSize(radius * 0.34);
    textStyle(BOLDITALIC);
    text(stage.name, orb.x, orb.y);
  }
  pop();
}

function drawFinalMessage() {
  finalMessageAlpha = min(255, finalMessageAlpha + 1.5);

  push();
  textAlign(CENTER, CENTER);
  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = `rgba(0, 0, 0, ${finalMessageAlpha / 255})`;

  fill(255, 250, 242, finalMessageAlpha);
  textSize(34);
  textStyle(ITALIC);
  text(
    "Your letters to Sherry are gone with her in a peaceful place.",
    width / 2,
    height * 0.46,
  );
  pop();
}

function mousePressed() {
  if (modalOpen || currentStage >= stages.length) return;

  let stage = stages[currentStage];
  if (stage.state !== "active") return;

  if (dist(mouseX, mouseY, orb.x, orb.y) < orb.currentR) {
    openLetterModal(currentStage);
  }
}

function openLetterModal(index) {
  modalOpen = true;
  const stage = stages[index];

  document.getElementById("modalQuestion").textContent = `"${stage.question}"`;
  document.getElementById("letterInput").value = "";
  document.getElementById("letterModal").classList.add("active");
}

function setupModalEvents() {
  const modal = document.getElementById("letterModal");
  const input = document.getElementById("letterInput");
  const submitBtn = document.getElementById("submitBtn");

  submitBtn.addEventListener("click", () => {
    const letterText = input.value.trim();
    if (!letterText) {
      input.focus();
      return;
    }

    savedLetters.push({
      stage: stages[currentStage].name,
      letter: letterText,
    });

    modal.classList.remove("active");
    modalOpen = false;
    stages[currentStage].state = "flyingToHeart";
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updatePositions();
}
