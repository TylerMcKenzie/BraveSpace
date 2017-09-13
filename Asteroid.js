(function() {
  function Asteroid(props) {
    // Kontra init
    this.init(props);

    // Set radius or randomize between default values
    this.radius = props.radius || (Game.Math.random(10, 60));

    // Custom set matrix or random - determines the shape of the asteroid
    var hitBoxMatrix = props.hitBoxMatrix || props.points || this.generateRandomHitBoxMatrix();

    // Asteroid HitBox
    this.hitBox = new Game.Polygon({x: props.x, y: props.y, points: hitBoxMatrix});

    // Direction the Asteroid rotates at
    this.rotationSpeed = (Game.Math.random(-2, 2));

    // Angle to travel in
    this.direction = (Game.Math.random(-360, 360));

    // Speed to travel at
    // Generally random, can be inherited
    this.speed = props.speed || (Game.Math.random(5));

    // Set maxHealth - used for splitting - or set random based on size of the asteroid
    var maxHealth = props.maxHealth || this.radius*Game.Math.random(2, 10);
    this.maxHealth = maxHealth;
    // Initialize health at max
    this.health = maxHealth;

    // Determine the number of times it can split
    this.numberOfSplits = Math.floor(this.radius/20);

    // Set damage to radius cuz before it REALLY KILLED YOU
    this.damage = this.radius;

    this.update = function() {
      // Rotate
      this.hitBox.rotate(this.rotationSpeed);

      // Travel in x and y vel
      this.hitBox.x += Game.Math.sin(this.direction) * this.speed;
      this.hitBox.y += Game.Math.cos(this.direction) * this.speed;
    }

    this.render = function(xView, yView) {
      // Save the context
      this.context.save();

      // Start path
      this.context.beginPath();
      // Set stroke to the darkish grey
      this.context.strokeStyle = "#d6d6d6";

      // draw a line to each of the hitbox's points drawing the shape
      for(var i = 0; i < this.hitBox.points.length; i++) {
        this.context.lineTo(this.hitBox.x+this.hitBox.points[i].x - xView, this.hitBox.y+this.hitBox.points[i].y - yView);
      }

      // Close path
      this.context.closePath();

      // Fill so the asteroids are easier to see on the background
      this.context.fillStyle = "#272727";
      this.context.fill();
      this.context.stroke();

      this.context.restore();
    }
  }

  // Prototype inheritance
  Asteroid.prototype = Object.create(kontra.sprite.prototype);

  // Maintain constructor - used by the managers
  Asteroid.prototype.contructor = Asteroid;

  // Scale the asteroid - used by splitting
  Asteroid.prototype.scale = function(scale) {
    // scale radius
    this.radius *= scale;

    // update health
    this.health *= scale;

    // update hitbox
    this.hitBox.scale(scale);
  };

  // Take Damage
  Asteroid.prototype.takeDamage = function(damage) {
    this.health -= damage;
  };

  // Is destroyed
  Asteroid.prototype.destroyed = function() {
    if(this.health <= 0) {
      return true;
    }

    return false;
  };

  // Randomly determine if it will split or not
  Asteroid.prototype.canSplit = function() {
    if(this.numberOfSplits > 1) {
      return true;
    }

    return false;
  };

  // Randomize points based off the radius set
  Asteroid.prototype.generateRandomHitBoxMatrix = function(radius) {
    // Set points - inherited on split - random max of 16 for mild performance
    var numOfPoints = this.numOfPoints || Math.floor(Game.Math.random(7, 16));
    var points = [];
    var angle = 0;
    var angleStep = 360/numOfPoints;

    for(var i = 0; i < numOfPoints; i++) {
      var vector = {};
      var randomRadius = this.radius - Math.floor(Game.Math.random(-this.radius/2, this.radius/2));

      vector.x = Game.Math.cos(angle) * randomRadius;
      vector.y = Game.Math.sin(angle) * randomRadius;

      points.push(vector);

      angle += angleStep;
    }

    return points
  };

  // Determine Randomly when to drop a random item - things sure are random here
  Asteroid.prototype.dropItem = function() {
    var item = Game.Item.random();

    item.x = this.hitBox.x;
    item.y = this.hitBox.y;

    if(Game.Math.random() > Game.Math.random()) {
      return item;
    } else {
      return false;
    }

  };

  // Set Game Asteroid
  Game.Asteroid = Asteroid;
})();

