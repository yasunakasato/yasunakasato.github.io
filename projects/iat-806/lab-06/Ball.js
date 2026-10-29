class Ball {
  // Constructor initializes the ball's position, radius, and color properties
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
    this.originalColor = this.color;
    this.highlightColor = color(255, 50, 100); // Bright color when active
  }

  // Jitters the ball position slightly by adding random offsets
  move() {
    this.x += random(-2, 2);
    this.y += random(-2, 2);
  }

  // Pulsates the ball's radius slightly back and forth
  changeSize() {
    this.r += random(-0.5, 0.5);
    this.r = constrain(this.r, 10, 40);
  }

  // Renders the ball onto the canvas using its current color and radius
  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.r * 2);
  }

  // Updates the ball state by calling movement, size adjustment, and display methods
  update() {
    this.move();
    this.changeSize();
    this.show();
  }

  // Factory method that generates and returns a new Ball with random coordinates
  static createRandomBall(w, h) {
    return new Ball(random(w), random(h), random(15, 30));
  }

  // Changes the ball's color to the highlight color when active
  highlight() {
    this.color = this.highlightColor;
  }

  // Reverts the ball's color back to its original color when inactive
  deHighlight() {
    this.color = this.originalColor;
  }

  // Switches between highlight and normal state depending on the active boolean parameter
  respond(active) {
    if (active) {
      this.highlight();
    } else {
      this.deHighlight();
    }
  }

  // Determines whether a given coordinate (px, py) falls inside the bounds of the ball
  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.r;
  }

  // Checks if the ball's location overlaps with the person mask from the webcam segmentation
  isOnBody(mask) {
    if (!mask) return false;
    let val = mask.get(Math.floor(this.x), Math.floor(this.y));
    // If the alpha channel value is greater than 128, the ball is over the person
    return val[3] > 128;
  }
}
