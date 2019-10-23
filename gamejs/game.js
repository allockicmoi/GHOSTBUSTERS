var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth * 0.99;
canvas.height = window.innerHeight * 0.98;
var c = canvas.getContext("2d");
var size = 10;
///////////////////////////////////////////PART1 - STONEHEDGE
//calculate gradient for perlin noise
function createGradients(size) {
  var arr = [];
  // console.log(Array.isArray(arr));
  for (i = 0; i < size; i++) {
    arr.push(Math.random() * 2 - 1);
  }
  return arr;
}

//dot product and interpollation for 1d perlin
function calculateOffset(gradArray, index) {
  var lowIndex = Math.floor(index);
  var highIndex = Math.ceil(index);
  var d_low = index - lowIndex;
  var d_high = highIndex - index;
  if (lowIndex == highIndex) {
    console.log("Problem with Index, probably entered whole number");
  }
  var offset =
    gradArray[lowIndex] * (1 - d_low) + gradArray[highIndex] * (1 - d_high);

  if (offset > 1) {
    offset = 1;
  }
  if (offset < -1) {
    offset = -1;
  }
  return offset;
}
//create 4 randomized grandient arrays so each side of each rectangle has its own noise
var gradSize = 100;
var arr = createGradients(gradSize);
var arr2 = createGradients(gradSize);
var arr3 = createGradients(gradSize);
var arr4 = createGradients(gradSize);
function drawPerlinRect(
  c,
  gradSize,
  posx,
  posy,
  width,
  height,
  reductionFactor1,
  offsetMult1,
  reductionFactor2,
  offsetMult2
) {
  //calculate offset at each point and draw it
  for (i = 0; i < width; i++) {
    ypos = posy;
    ypos += calculateOffset(arr, (posx + i) / reductionFactor1) * offsetMult1;
    ypos += calculateOffset(arr, (posx + i) / reductionFactor2) * offsetMult2;
    // console.log(ypos);
    c.fillRect(posx + i, ypos, 2, 2); //print top line

    ypos =
      posy +
      height +
      calculateOffset(arr2, (posx + i) / reductionFactor1) * offsetMult1;
    ypos += calculateOffset(arr2, (posx + i) / reductionFactor2) * offsetMult2;
    // console.log(ypos);
    c.fillRect(posx + i, ypos, 2, 2); //print bottom line
  }
  for (i = 0; i < height; i++) {
    xpos =
      posx + calculateOffset(arr3, (posy + i) / reductionFactor1) * offsetMult1;
    xpos += calculateOffset(arr3, (posy + i) / reductionFactor2) * offsetMult2;
    c.fillRect(xpos, posy + i, 2, 2); //print left line
    xpos =
      posx +
      width +
      calculateOffset(arr4, (posy + i) / reductionFactor1) * offsetMult1;
    xpos += calculateOffset(arr4, (posy + i) / reductionFactor2) * offsetMult2;
    c.fillRect(xpos, posy + i, 2, 2); //print right line
  }
}

// practice function
function drawRect(c, posx, posy, width, height) {
  for (i = 0; i < width; i++) {
    c.fillRect(posx + i, posy, 2, 2);
    c.fillRect(posx + i, posy + height, 2, 2);
  }
  for (i = 0; i < height; i++) {
    c.fillRect(posx, posy + i, 2, 2);
    c.fillRect(posx + width, posy + i, 2, 2);
  }
}
// HERE WE DRAW OUR RECTANGLES TO FORM THE STONEHEDGE
drawPerlinRect(
  c,
  100,
  window.innerWidth / 2 - 130,
  window.innerHeight - 122,
  15,
  100,
  80.33333,
  6,
  20.33333,
  1
);
drawPerlinRect(
  c,
  100,
  window.innerWidth / 2 - 30,
  window.innerHeight - 122,
  15,
  100,
  80.33333,
  6,
  20.33333,
  1
);
drawPerlinRect(
  c,
  100,
  window.innerWidth / 2 - 150,
  window.innerHeight - 152,
  150,
  30,
  80.33333,
  6,
  20.33333,
  1
);
/////////////////////////////PART2-CANON
function Canon() {
  this.angle = 45;
  this.draw = function(c) {
    // draw the canon statically
    c.beginPath();
    c.arc(window.innerWidth - 150, window.innerHeight - 30, 10, 0, 2 * Math.PI);
    c.fillStyle = "black";
    c.fill();
    c.stroke();
    c.beginPath();

    c.translate(window.innerWidth - 140, window.innerHeight - 35);
    c.rotate((this.angle * Math.PI) / 180);
    c.rect(-40, -10, 50, 20);
    c.stroke();
  };
  this.update = function(c) {
    //keep printing cannon at new angle
    //console.log(this.angle);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.beginPath();

    c.arc(window.innerWidth - 150, window.innerHeight - 30, 10, 0, 2 * Math.PI);
    c.fillStyle = "black";
    c.fill();
    c.stroke();
    c.beginPath();

    c.translate(window.innerWidth - 140, window.innerHeight - 35);
    c.rotate((this.angle * Math.PI) / 180);
    c.rect(-40, -10, 50, 20);
    c.stroke();
  };
}
//create canon
var canon = new Canon();

function Projectile() {
  //OUR PROJECTILE OBJECTS
  this.gravity = 3;
  this.initialforce = 60;
  this.xforce = 0;
  this.yforce = 0;
  this.xpos = 0;
  this.ypos = 0;
  this.draw = function(c) {
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.beginPath();
    this.xforce = //calculate x displacement from angle
      -Math.cos((canon.angle * 2 * Math.PI) / 360) * this.initialforce;
    this.yforce = //y displacement
      -Math.sin((canon.angle * 2 * Math.PI) / 360) * this.initialforce;
    this.xpos =
      window.innerWidth -
      140 +
      Math.cos((canon.angle * 2 * Math.PI) / 360) * -70;
    this.ypos =
      window.innerHeight -
      30 +
      Math.sin((canon.angle * 2 * Math.PI) / 360) * -70;
    c.arc(this.xpos, this.ypos, 10, 0, 2 * Math.PI);
    c.fillStyle = "red";
    c.fill();
    c.stroke();
  };
  this.handleCollision = function(c) {
    //handles collisions with the stonehedge only (this function at least)
    if (
      this.xpos + this.xforce > window.innerWidth / 2 - 150 &&
      this.xpos + this.xforce < window.innerWidth / 2 &&
      this.ypos + this.yforce > window.innerHeight - 150 &&
      this.ypos < window.innerHeight - 150
    ) {
      console.log("detected top collision");
      this.yforce = -0.8 * this.yforce;
    } else if (
      this.xpos + this.xforce < window.innerWidth / 2 &&
      this.xpos > window.innerWidth / 2 &&
      this.ypos + this.yforce > window.innerHeight - 150
    ) {
      console.log("detected side collision");
      this.xforce = -0.8 * this.xforce;
    }
  };
  this.handleGhostCol = function(c) {
    //handle collisions with moving ghosts using a collisionMap
    if (
      this.xpos < window.innerWidth - 20 &&
      this.xpos > 0 &&
      this.ypos < window.innerHeight - 50 &&
      this.ypos > 0
    ) {
      if (
        collisionMap[Math.floor(this.ypos + this.yforce)][
          Math.floor(this.xpos)
        ] != null
      ) {
        console.log("FOUND COLLISION");
        if (
          collisionMap[Math.floor(this.ypos + this.yforce)][
            Math.floor(this.xpos)
          ] != null
        ) {
          //above the object - collide from top
          ghost =
            collisionMap[Math.floor(this.ypos + this.yforce)][
              Math.floor(this.xpos)
            ];
          ghost.points[4].x += this.xforce;
          ghost.points[4].y += this.yforce;
          this.xpos = -1000;
          this.ypos = 1000;
        } else {
          //above the object - collide from right side
          ghost =
            collisionMap[Math.floor(this.ypos + this.yforce)][
              Math.floor(this.xpos)
            ];
          ghost.points[7].x += this.xforce;
          ghost.points[7].y += this.yforce;
          this.xpos = -1000;
          this.ypos = 1000;
        }
      }
    }
  };
  this.update = function(c) {
    this.xpos += this.xforce;
    this.ypos += this.yforce;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.beginPath();
    c.arc(this.xpos, this.ypos, 10, 0, 2 * Math.PI);
    c.fillStyle = "red";
    c.fill();
    c.stroke();
    this.yforce += this.gravity;
    if (this.ypos < window.innerHeight - 200) {
      this.xforce += wind;
    }
    this.handleCollision(c);
    this.handleGhostCol(c);
  };
}
bullets = [];
window.addEventListener("keydown", moveCannon);
function moveCannon(e) {
  switch (e.keyCode) {
    case 37:
      console.log("left");
      // left key pressed
      break;
    case 38:
      console.log("up");
      if (canon.angle < 90) {
        canon.angle += 1;
      }
      break;
    case 39:
      // right key pressed
      console.log("right");
      break;
    case 40:
      // down key pressed
      console.log("down");
      if (canon.angle > 0) {
        canon.angle -= 1;
      }
      break;
    case 32:
      // space key pressed
      console.log("space");
      var bullet = new Projectile();
      bullet.draw(c);
      bullets.push(bullet);
      break;
  }
}

var wind = 2;
//canon.draw(c);
function Cloud(x, y) {
  //Draw our cloud objects at given location
  this.x = x;
  this.y = y;
  this.update = function(c) {
    if (this.x > window.innerWidth - 20) {
      this.x = 20;
    }
    if (this.x < 20) {
      this.x = window.innerWidth - 20;
    }
    offx = [-50, -20, 10];
    offy = [50, 100];
    offx.forEach(x => {
      offy.forEach(y => {
        c.beginPath();
        c.arc(this.x + x, this.y + y, 30, 0, 2 * Math.PI);
        c.fillStyle = "blue";
        c.fill();
        c.stroke();
      });
    });

    this.x += wind;
  };
}

var cloud = new Cloud(100, 100);
var cloud2 = new Cloud(500, 100);
var windTime = 0;
function ManageWind(force) {
  //randomize wind function
  var d = new Date();
  var t = d.getTime();
  if (t > windTime + 2000) {
    //
    var rand = Math.random() * force - force / 2;
    wind = rand;
    //console.log(wind);
    windTime = t;
  }
}
var distance = function(p1, p2) {
  var a = p2.x - p1.x;
  var b = p2.y - p1.y;
  return Math.sqrt(a * a + b * b);
};

function Ghost(offx, offy) {
  // function to create ghost at position
  this.points = [];
  this.sticks = [];
  this.points.push({
    //add all points
    x: offx,
    y: offy,
    oldx: offx,
    oldy: offy
  });
  this.points.push({
    x: offx + 30,
    y: offy + 10,
    oldx: offx + 30,
    oldy: offy + 10
  });
  this.points.push({
    x: offx + 50,
    y: offy + 10,
    oldx: offx + 50,
    oldy: offy + 10
  });
  this.points.push({
    x: offx + 20,
    y: offy - 20,
    oldx: offx + 20,
    oldy: offy - 20
  });
  // points.push({
  //   x: 140,
  //   y: 100,
  //   oldx: 140,
  //   oldy: 100
  // });
  this.points.push({
    x: offx + 60,
    y: offy - 20,
    oldx: offx + 60,
    oldy: offy - 20
  });
  this.points.push({
    x: offx + 80,
    y: offy,
    oldx: offx + 80,
    oldy: offy
  });
  this.points.push({
    x: offx,
    y: offy + 40,
    oldx: offx,
    oldy: offy + 40
  });
  this.points.push({
    x: offx + 80,
    y: offy + 40,
    oldx: offx + 80,
    oldy: offy + 40
  });
  this.points.push({
    x: offx,
    y: offy + 70,
    oldx: offx,
    oldy: offy + 70
  });
  this.points.push({
    x: offx + 30,
    y: offy + 70,
    oldx: offx + 30,
    oldy: offy + 70
  });
  this.points.push({
    x: offx + 50,
    y: offy + 70,
    oldx: offx + 50,
    oldy: offy + 70
  });
  this.points.push({
    x: offx + 80,
    y: offy + 70,
    oldx: offx + 80,
    oldy: offy + 70
  });
  this.points.push({
    x: offx + 65,
    y: offy + 100,
    oldx: offx + 65,
    oldy: offy + 100
  });
  this.points.push({
    x: offx + 40,
    y: offy + 100,
    oldx: offx + 40,
    oldy: offy + 100
  });
  this.points.push({
    x: offx + 15,
    y: offy + 100,
    oldx: offx + 15,
    oldy: offy + 100
  });

  this.sticks.push({
    //adding all constraints
    p1: this.points[0],
    p2: this.points[3],
    length: distance(this.points[0], this.points[3]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[3],
    p2: this.points[4],
    length: distance(this.points[3], this.points[4]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[4],
    p2: this.points[5],
    length: distance(this.points[4], this.points[5]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[0],
    p2: this.points[5],
    length: distance(this.points[0], this.points[5]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[0],
    p2: this.points[6],
    length: distance(this.points[0], this.points[6]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[6],
    p2: this.points[7],
    length: distance(this.points[6], this.points[7]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[5],
    p2: this.points[7],
    length: distance(this.points[5], this.points[7]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[7],
    p2: this.points[11],
    length: distance(this.points[7], this.points[11]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[11],
    p2: this.points[12],
    length: distance(this.points[11], this.points[12]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[10],
    p2: this.points[12],
    length: distance(this.points[10], this.points[12]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[10],
    p2: this.points[13],
    length: distance(this.points[10], this.points[13]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[9],
    p2: this.points[13],
    length: distance(this.points[9], this.points[13]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[9],
    p2: this.points[14],
    length: distance(this.points[9], this.points[14]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[8],
    p2: this.points[14],
    length: distance(this.points[8], this.points[14]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[6],
    p2: this.points[8],
    length: distance(this.points[6], this.points[8]),
    display: 1
  });
  this.sticks.push({
    p1: this.points[8],
    p2: this.points[9],
    length: distance(this.points[9], this.points[8]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[9],
    p2: this.points[10],
    length: distance(this.points[9], this.points[10]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[10],
    p2: this.points[11],
    length: distance(this.points[10], this.points[11]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[1],
    p2: this.points[2],
    length: distance(this.points[1], this.points[2]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[0],
    p2: this.points[1],
    length: distance(this.points[1], this.points[0]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[2],
    p2: this.points[5],
    length: distance(this.points[2], this.points[5]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[2],
    p2: this.points[7],
    length: distance(this.points[2], this.points[7]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[1],
    p2: this.points[6],
    length: distance(this.points[1], this.points[6]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[4],
    p2: this.points[7],
    length: distance(this.points[4], this.points[7]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[3],
    p2: this.points[6],
    length: distance(this.points[3], this.points[6]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[11],
    p2: this.points[6],
    length: distance(this.points[11], this.points[6]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[11],
    p2: this.points[6],
    length: distance(this.points[11], this.points[6]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[8],
    p2: this.points[7],
    length: distance(this.points[7], this.points[8]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[13],
    p2: this.points[12],
    length: distance(this.points[12], this.points[13]),
    display: 0
  });
  this.sticks.push({
    p1: this.points[14],
    p2: this.points[13],
    length: distance(this.points[14], this.points[13]),
    display: 0
  });
  this.update = function(c) {
    this.movePts();
    for (var i = 0; i < 1; i++) {
      this.updatePoints(c);
      this.updateSticks(c);
    }
    this.updateColMap(c);
    this.renderPoints(c);
    this.renderSticks(c);
    //console.log(points);
  };
  this.updateColMap = function(c) {
    //register ghosts in collision map
    if (
      this.points[0].x < window.innerWidth - 200 &&
      this.points[1].y < innerHeight - 100
    ) {
      for (var i = this.points[0].y - 20; i < this.points[0].y + 100; i++) {
        for (var j = this.points[0].x; j < this.points[0].x + 50; j++) {
          collisionMap[Math.floor(i)][Math.floor(j)] = this;
          //   console.log(collisionMap);
          //   console.log(i);
          //   console.log(j);
        }
      }
    }
  };
  this.movePts = function(c) {
    //move ghost up and around the stonehedge
    if (
      this.points[0].y > window.innerHeight - 150 &&
      this.points[0].x < window.innerWidth / 2 - 150
    ) {
      //console.log("11111");
      for (var i = 0; i < this.points.length; i++) {
        this.points[i].y -= 0.1;
      }
    } else if (this.points[0].x < window.innerWidth / 2 - 250) {
      //console.log("22222");

      for (var i = 0; i < this.points.length; i++) {
        this.points[i].y = this.points[i].oldy;
        this.points[i].x += 0.1;
      }
    } else if (
      this.points[0].x > window.innerWidth / 2 - 250 &&
      this.points[0].y > window.innerHeight - 300 &&
      this.points[0].x < window.innerWidth / 2 - 150
    ) {
      ///console.log("3333333");
      for (var i = 0; i < this.points.length; i++) {
        this.points[i].x = this.points[i].oldx;
        this.points[i].y -= 0.1;
      }
    } else if (
      this.points[0].x > window.innerWidth / 2 - 250 &&
      this.points[0].y < window.innerHeight - 300 &&
      this.points[0].x < window.innerWidth / 2 + 150
    ) {
      //console.log("44444");

      for (var i = 0; i < this.points.length; i++) {
        this.points[i].y = this.points[i].oldy;
        this.points[i].x += 0.1;
      }
    } else if (
      this.points[0].x < window.innerWidth / 2 + 250 &&
      this.points[0].y < window.innerHeight - 150
    ) {
      // console.log("55555");
      for (var i = 0; i < this.points.length; i++) {
        this.points[i].x = this.points[i].oldx;
        this.points[i].y += 0.1;
      }
    } else if (
      this.points[0].x < window.innerWidth / 2 + 250 &&
      this.points[0].y > window.innerHeight - 150
    ) {
      //console.log("6666");
      for (var i = 0; i < this.points.length; i++) {
        this.points[i].y = this.points[i].oldy;
        this.points[i].x += 0.1;
      }
    }
  };
  this.updateSticks = function(c) {
    // update our constraints
    for (var i = 0; i < this.sticks.length; i++) {
      var stick = this.sticks[i];
      var dx = stick.p2.x - stick.p1.x;
      var dy = stick.p2.y - stick.p1.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var diff = stick.length - dist;
      var weight = diff / dist / 2;
      stick.p1.x -= dx * weight;
      stick.p1.y -= dy * weight;
      stick.p2.x += dx * weight;
      stick.p2.y += dy * weight;
    }
  };
  this.updatePoints = function(c) {
    //  update our points
    for (var index = 0; index < this.points.length; index++) {
      var point = this.points[index];
      //console.log(point);
      var xforce = point.x - point.oldx;
      var yforce = point.y - point.oldy;
      point.oldx = point.x;
      point.oldy = point.y;
      point.x += xforce;
      point.y += yforce;
    }
  };
  this.renderSticks = function(c) {
    // render visible sticks
    for (let index = 0; index < this.sticks.length; index++) {
      const stick = this.sticks[index];
      if (stick.display == 1) {
        c.beginPath();
        c.moveTo(stick.p1.x, stick.p1.y);
        c.lineTo(stick.p2.x, stick.p2.y);
        c.fillStyle = "red";
        c.fill();
        c.stroke();
      }
    }
  };
  this.renderPoints = function(c) {
    //render points
    for (let index = 0; index < this.points.length; index++) {
      var point = this.points[index];

      c.beginPath();
      c.arc(point.x, point.y, 5, 0, 2 * Math.PI, false);

      c.fillStyle = "pink";
      c.fill();
      c.stroke();
    }
  };
}
var ghosts = []; // our array with all our active ghosts
for (var i = 0; i < 4; i++) {
  //initialize with 4 ghosts and random postion
  ghosts.push(
    new Ghost(
      Math.random() * (window.innerWidth / 2 - 200),
      window.innerHeight + i * 800
    )
  );
}
function ManageGhosts() {
  //our ghost manager will de-spawn and respawn ghosts
  for (var i = 0; i < 4; i++) {
    //console.log(ghosts[i].points[0].x);
    if (ghosts[i].points[0].x > 0.8 * window.innerWidth) {
      ghosts[i] = new Ghost(
        Math.random() * (window.innerWidth / 2 - 200),
        window.innerHeight + i * 800
      );
    }
  }
}
function initColMap() {
  // initiate collision array
  var matrix = new Array(Math.floor(1.2 * window.innerHeight));
  for (var i = 0; i < matrix.length; i++) {
    matrix[i] = new Array(Math.floor(1.2 * window.innerWidth));
  }
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[0].length; j++) {
      matrix[i][j] = null;
    }
  }
  return matrix;
}
var collisionMap = initColMap();

function animate() {
  //our animate function
  //console.log("working?");
  requestAnimationFrame(animate);

  ManageWind(6); //randomize wind
  collisionMap = initColMap();

  c.setTransform(1, 0, 0, 1, 0, 0);

  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  c.beginPath(); //draw flat surface profile
  c.moveTo(0, window.innerHeight - 40);
  c.lineTo(window.innerWidth, window.innerHeight - 40);
  c.fillStyle = "red";
  c.fill();
  c.stroke();
  c.beginPath();
  ManageGhosts(); //update our ghosts
  ghosts.forEach(ghost => {
    ghost.update(c);
  });

  var isEmpty = 1;
  for (var i = 0; i < collisionMap.length; i++) {
    for (var j = 0; j < collisionMap[0].length; j++) {
      if (collisionMap[i][j] != null) {
        isEmpty = 0;
      }
    }
  }
  bullets.forEach(bullet => {
    // update our bullets (also runs collision detection)
    bullet.update(c);
  });
  console.log(isEmpty);
  //console.log(collisionMap);
  c.fillStyle = "black";
  drawPerlinRect(
    //redraw our stonehedge
    c,
    100,
    window.innerWidth / 2 - 130,
    window.innerHeight - 122,
    15,
    100,
    80.33333,
    6,
    20.33333,
    1
  );
  drawPerlinRect(
    c,
    100,
    window.innerWidth / 2 - 30,
    window.innerHeight - 122,
    15,
    100,
    80.33333,
    6,
    20.33333,
    1
  );
  drawPerlinRect(
    c,
    100,
    window.innerWidth / 2 - 150,
    window.innerHeight - 152,
    150,
    30,
    80.33333,
    6,
    20.33333,
    1
  );
  cloud.update(c); //draw clouds
  cloud2.update(c);
  c.beginPath(); //draw canon
  canon.update(c);
  c.stroke();
}
animate();
