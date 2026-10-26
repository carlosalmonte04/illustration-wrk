// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Stochastic Tree with angles fluctuating with Perlin noise
// Nature of Code, Chapter 8

// Perlin noise offset
let yoff = 0;
// Random seed to control randomness while drawing the tree
let seed = 5;


function setup() {
  const canvas = createCanvas(360, 240);
  canvas.parent('tree');
}

function draw() {
  background(150, 208, 230);
  fill('#FC7A5B');

  // stroke('#8A97FF');
  translate(width/2, height);
  yoff += 0.005;
  randomSeed(seed);
  branch(50, 0);

  // Draw the second tree slightly translated to the right and up, following the first one
  translate(2, height*0.22);
  fill(255);
  // stroke('#8A97FF');
  randomSeed(seed - 2); // Use the same seed for the same movement
  branch(50, 0);
}


function mousePressed() {
  // New tree starts with new noise offset and new random seed
  yoff = random(1000);
  seed = millis();
}


function branch(h, xoff) {
  // thickness of the branch is mapped to its length
  let sw = map(h, 2, 100, 1, 5);

  noStroke();
  rect(0, 0, 5, -h, sw);
  
  stroke('#8A97FF');
  strokeWeight(1);
  line(0, 0, 0, -h);
  line(5, 5, 5, -h);

  // Move along to end
  translate(0, -h);

  if (h * 0.7 < 4) {
    stroke('rgb(255, 209, 208)');
    line(0, 0, 5, -h);
  }
  // Each branch will be 2/3rds the size of the previous one
  h *= 0.7;

  // Move along through noise space
  xoff += 0.1;

  if (h > 4) {
    // Random number of branches
    let n = floor(random(1, 5));
    for (let i = 0; i < n; i++) {

      // Here the angle is controlled by perlin noise
      // This is a totally arbitrary way to do it, try others!
      let theta = map(noise(xoff+i, yoff), 0, 1, -PI/2, PI/2);
      if (n % 2 == 0) theta *= -1;

      push();      // Save the current state of transformation (i.e. where are we now)
      rotate(theta);     // Rotate by theta
      branch(h, xoff);   // Ok, now call myself to branch again
      pop();       // Whenever we get back here, we "pop" in order to restore the previous matrix state
    }
  }
}
