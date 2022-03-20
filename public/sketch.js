let system; // Particle system for balls
let fondo = 400;
let ancho = 400;
let alto = 400;
//let cam;
let bsize = 0; //ball size
let showcaja = true;
let stop = false;
let font,
  fontsize = 20;
let luzx = 0;
let luzy = 0;
let luzz = 0;
let btono = 0;
let bcolor;
var p;
var p2;
var p3;
let colorPicker;

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont("assets/SourceSansPro-Regular.otf.woff");
}

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  canvas.position(0, 0);
  system = new ParticleSystem(createVector(0, 0));
  angleMode(DEGREES);
  colorMode(RGB);

  //cam = createCamera();

  slider = createSlider(5, 40, 20);
  slider.position(10, 10);
  slider.style("width", "80px");
  p = createP("Ball Size");
  p.style("font-size", "20px");
  p.style("color", "white");
  p.position(110, 0);

  slider2 = createSlider(1, 10, 1);
  slider2.position(10, 40);
  slider2.style("width", "80px");
  p2 = createElement("p", "Ball Number");
  p2.style("font-size", "20px");
  p2.style("color", "white");
  p2.position(110, 20);

  slider3 = createSlider(1, 100, 10);
  slider3.position(10, 70);
  slider3.style("width", "80px");
  p3 = createP("Ball Rate");
  p3.style("font-size", "20px");
  p3.style("color", "white");
  p3.position(110, 40);

  slider4 = createSlider(0, 255, 0);
  slider4.position(10, height - 40);
  slider4.style("width", "80px");

  slider5 = createSlider(0, 255, 100);
  slider5.position(10, height - 70);
  slider5.style("width", "80px");

  slider6 = createSlider(0, 255, 0);
  slider6.position(10, height - 100);
  slider6.style("width", "80px");

  button = createButton("Box");
  button.position(width / 2, 10);
  button.mousePressed(togglecaja);
  button.style("background-color", color(255, 204, 0));
  button2 = createButton("Stop");
  button2.position(width / 2 + 100, 10);
  button2.mousePressed(togglestop);
  button2.style("background-color", color(0, 204, 255));

  colorPicker = createColorPicker("#ed225d");
  colorPicker.position(width - 100, 10);

  textFont(font);
  textSize(fontsize);   
  textAlign(LEFT);
}

function draw() {
  //background(154, 225, 255);
  background(slider4.value());
  ambientLight(slider5.value());
  directionalLight(255, 255, 255, 1, 1, 0);

  noStroke();

  p.html("Ball Size: " + slider.value());
  p2.html("Ball Number: " + slider2.value());
  p3.html("Ball Rate: " + slider3.value());

  //translate(0, 0, mouseX);
  orbitControl();

  caja();

  // Add balls
  if (frameCount % slider3.value() === 0) {
    if (stop == false) {
      bsize = slider.value();
      //btono = slider6.value();
      bcolor = colorPicker.color();
      system.addParticle(slider2.value());
    }
  }
  system.run();
}

// A simple Particle class
let Particle = function (position) {
  this.acceleration = createVector(0, 0.05, 0); // gravity acceleration
  this.velocity = createVector(0, 0, 0); //just fall down
  this.position = createVector(
    random(-ancho / 2, ancho / 2),
    -alto / 2,
    random(-fondo / 2, fondo / 2)
  );

  this.size = bsize;
  this.lifespan = 255;

  this.color = bcolor;

  /*   this.colx = int(map(this.position.x + ancho / 2, 0, fondo, 0, 255));
  this.coly = int(map(this.position.z + fondo / 2, 0, fondo, 0, 255));
  this.colz = btono; */
  //console.log('x: ' + this.colx + ' z: ' + this.colz);
};

Particle.prototype.run = function () {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function () {
  if (this.position.y < alto / 2 - 10) {
    // while not touch bottom
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }
  this.lifespan -= 1;
};

// Method to display
Particle.prototype.display = function () {
  push();
  noStroke();
  translate(this.position.x, this.position.y, this.position.z);

  //fill(this.color);
  //ambientMaterial(this.colorx, this.colorz, this.colorz);
  shininess(20);
  /*   specularColor(this.colx, this.coly, this.colz);
  specularMaterial(this.colx, this.coly, this.colz); */
  specularColor(this.color);
  specularMaterial(this.color);

  if (this.splash == 1) {
    //fill(255);
    shininess(20);
    specularColor(255);
    specularMaterial(255);
  }
  sphere(this.size);
  pop();
};

// Is the particle still alive?
Particle.prototype.isDead = function () {
  //return this.lifespan < 0;
  if (this.lifespan < 0) {
    this.splash = 1;
    this.display();
    return true;
  } else {
    return false;
  }
};

let ParticleSystem = function (position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function (count) {
  for (let i = 0; i < count; i++) {
    this.particles.push(new Particle(this.origin));
  }
};

ParticleSystem.prototype.run = function () {
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};

function togglecaja() {
  if (showcaja == true) {
    showcaja = false;
  } else {
    showcaja = true;
  }
}

function togglestop() {
  if (stop == true) {
    stop = false;
  } else {
    stop = true;
  }
}

function caja() {
  if (showcaja == false) {
    return;
  }

  //pointLight(0, 255, 255, 0, 1, 0);
  pointLight(255, 255, 255, luzx, luzy, luzz);

  /* Limites de la escena */
  push();
  f2 = fondo / 2;
  a2 = ancho / 2;
  h2 = alto / 2;
  stroke(100, 0, 0);
  line(-a2, -h2, f2, -a2, h2, f2);
  line(-a2, -h2, -f2, -a2, h2, -f2);
  line(a2, -h2, f2, a2, h2, f2);
  line(a2, -h2, -f2, a2, h2, -f2);
  pop();

  /* Suelo y techo de la escena */
  push();
  shininess(100);
  specularColor(100, 0, 0);
  specularMaterial(100, 0, 0);
  translate(0, alto / 2, 0);
  rotateX(90);
  plane(ancho, fondo);
  pop();

  push();
  shininess(100);
  specularColor(0, 0, 100);
  specularMaterial(0, 0, 100);
  translate(0, -alto / 2, 0);
  rotateX(90);
  plane(ancho, fondo);
  pop();

  push();
  //translate(0, -alto / 2 - 20, fondo / 2);
  text("TOP", -20, -alto / 2 - 20, -fondo / 2);
  pop();

  if (keyIsPressed === true) {
    if (keyCode === LEFT_ARROW) {
      luzx = luzx - 2;
    } else if (keyCode === RIGHT_ARROW) {
      luzx = luzx + 2;
    }
    if (keyCode === UP_ARROW) {
      luzy = luzy - 2;
    } else if (keyCode === DOWN_ARROW) {
      luzy = luzy + 2;
    }
    if (keyCode === 87) {
      luzz = luzz - 2;
    } else if (keyCode === 83) {
      luzz = luzz + 2;
    }
  }
  push();
  fill(255);
  translate(luzx, luzy, luzz);
  sphere(2); // al centro de la escena
  pop();
}
