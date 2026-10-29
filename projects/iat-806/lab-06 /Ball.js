class Ball {
  constructor(x, y, c, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.originalColor = c;
    this.highlightColor = color(255, 100, 200);
    this.color = c;
  }

  // Runs movement, size changes, and draws the ball
  update() {
    this.move(2);
    this.changeSize(0.5);
    this.show();
  }

  // Jitters the position slightly
  move(byHowMuch) {
    this.x += random(-byHowMuch, byHowMuch);
    this.y += random(-byHowMuch, byHowMuch);
  }

  // Jitters the radius slightly
  changeSize(byHowMuch) {
    this.r += random(-byHowMuch, byHowMuch);
    this.r = max(2, this.r); // Keeps the ball from disappearing
  }

  // Draws the ball on the canvas
  show() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.r * 2);
  }

  // Changes color when active
  highlight() {
    this.color = this.highlightColor;
  }

  // Resets color when inactive
  deHighlight() {
    this.color = this.originalColor;
  }

  // Decides whether to highlight based on state
  respond(active) {
    if (active) {
      this.highlight();
    } else {
      this.deHighlight();
    }
  }

  // Returns true if mouse is inside the ball
  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.r;
  }

  // Checks if the ball is over the webcam body mask
  isOnBody(mask) {
    if (!mask) return false;
    let posColor = mask.get(this.x, this.y);
    return posColor[3] > 0; // Check alpha channel
  }

  // Factory method to create a random ball
  static createRandomBall() {
    let ballX = random(width);
    let ballY = random(height);
    let ballColor = color(random(100, 200), 50, random(150, 250));
    let ballR = 20;
    return new Ball(ballX, ballY, ballColor, ballR);
  }
}
