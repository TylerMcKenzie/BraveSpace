(function() {
  // Setup the default weapon -- if this is all you get its cuz I ran out of time for more pickups
  var defaultWeapon = new Game.Weapon({
      offX: -2.5,
      offY: -30,
      width: 5,
      height: 10,
      color: "white",
      fireDelay: 10,
      projectileOffX: 2,
      projectileOffY: 2,
      damage: 20,
      render: function() { // This is this weapons custom draw/render
        this.context.save();
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.rect(this.offX, this.offY, 5, 10);
        this.context.fill();
        this.context.stroke();

        this.context.restore();
      }
    });

  function PlayerShip(props) {
    // Call kontra init for sprite
    this.init(props);

    // Set up the hitbox -- defaulted as there is only one playership
    this.hitBox = new Game.Polygon({x: props.x, y: props.y, points: props.hitBoxMatrix});

    // Rotating
    this.rotateSpeed = 2;
    this.rotation = 0;

    // Acceleration and Velocity
    this.maxSpeed = 5;
    this.acc = 0;
    this.accSpeed = 0.1;

    // Add weapon to the weapon inventory and equip it
    this.weaponInventory = [defaultWeapon];
    this.equippedWeapon = defaultWeapon;

    // Items
    this.itemInventory = [];

    // Health
    this.health = 500;
    this.maxHealth = 500;

    // Firing event for controllers
    this.isFiring = false;

    this.collidesWith = function(object) {
      // Sometimes an undefined object slips into this piece so just ignore the rest
      if(!object) {
        return;
      }

      // check if the object has this one of this hitbox's points
      for(var i = 0; i < this.hitBox.points.length; i++) {
        if(object.hitBox.hasPoint(this.hitBox.x+this.hitBox.points[i].x, this.hitBox.y+this.hitBox.points[i].y)) {
          return true;
        }
      }

      // check if this has one of the object's points
      for(var j = 0; j < object.hitBox.points.length; j ++) {
        if(this.hitBox.hasPoint(object.hitBox.x+object.hitBox.points[j].x, object.hitBox.y+object.hitBox.points[j].y)) {
          return true;
        }
      }

      // Default false
      return false;
    };

    // This is debug for hitboxes --- !!!!!!
    this.renderHitBox = function() {
      this.context.beginPath();
      this.context.strokeStyle = "red";

      for(var i = 0; i < this.hitBox.points.length; i++) {
        this.context.lineTo(this.hitBox.x+this.hitBox.points[i].x, this.hitBox.y+this.hitBox.points[i].y);
      }

      this.context.closePath();
      this.context.stroke();
      this.context.strokeStyle = "black";
    };

    // Set equipped weapon
    this.equipWeapon = function(weapon) {
      this.equippedWeapon = weapon;
    };

    // Call equipped weapons render
    this.renderWeapon = function() {
      // Weapon origin is this.x and this.y
      this.equippedWeapon.render();
    };

    // Override kontra update
    this.update = function() {
      if(Game.Controls.keys.pressed("left")) {
        // Decrease angle counter-clockwise
        this.rotation -= this.rotateSpeed;

        // Rotate the hitbox accordingly
        this.hitBox.rotate(-this.rotateSpeed);
      }

      if(Game.Controls.keys.pressed("right")) {
        // Increase angle clockwise
        this.rotation += this.rotateSpeed;

        // Rotate the hitbox accordingly
        this.hitBox.rotate(this.rotateSpeed);
      }

      if(Game.Controls.keys.pressed("up")){
        // Incread acceleration by accSpeed coefficiant
        if(this.acc < this.maxSpeed) {
          this.acc += this.accSpeed;
        }

        // Move the ship in x and y vectors by the acceleration rate
        this.x += Game.Math.sin(this.rotation) * this.acc;
        this.y += -Game.Math.cos(this.rotation) * this.acc;

        // Update hitbox to follow acceleration curve here and not before
        this.hitBox.x = this.x;
        this.hitBox.y = this.y;
      } else if(Game.Controls.keys.pressed("down")) {
        // Incread acceleration by accSpeed coefficiant
        if(this.acc > -this.maxSpeed) {
          this.acc -= this.accSpeed;
        }

        // Move the ship in x and y vectors by the acceleration rate
        this.x += Game.Math.sin(this.rotation) * this.acc;
        this.y += -Game.Math.cos(this.rotation) * this.acc;

        // Update hitbox to follow acceleration curve here and not before
        this.hitBox.x = this.x;
        this.hitBox.y = this.y;
      } else {
        // Slow down if not moving
        if(Math.ceil(this.acc) < 0) {
          this.acc += this.accSpeed
        } else if(Math.ceil(this.acc) > 0){
          this.acc -= this.accSpeed;
        } else {
          this.acc = 0;
        }

        // This will cause the ship to list after boosting
        this.x += Game.Math.sin(this.rotation) * this.acc;
        this.y += -Game.Math.cos(this.rotation) * this.acc;

        // Update hitbox to follow acceleration curve here and not before
        this.hitBox.x = this.x;
        this.hitBox.y = this.y;
      }


      // Weapon logic
      if(this.equippedWeapon) {
        var cos = Game.Math.cos(this.rotation);
        var sin = Game.Math.sin(this.rotation);

        // This is the projectile offset used for rendering the projectile in the center of the weapon's location
        var pOffX = this.equippedWeapon.projectileProperties.offX;
        var pOffY = this.equippedWeapon.projectileProperties.offY;

        // Calculated x and y off of rotation and offsets
        var x = this.equippedWeapon.offX + pOffX;
        var y = this.equippedWeapon.offY - pOffY;

        // Set equipped weapon's origin to calculated values -- was also to be for weapon locations i.e. nose, wings
        this.equippedWeapon.x = this.x + (x*cos - y*sin);
        this.equippedWeapon.y = this.y + (x*sin + y*cos);
      }

      if(Game.Controls.keys.pressed("space")) {
        // Check for equipped weapons -- can't unequip yet so is kinda redundant but safe
        if(this.equippedWeapon) {
          this.isFiring = true;
        }
      } else {
        // If not shooting don't
        this.isFiring = false;
      }
    };

    this.render = function(xView, yView) {
      // Set up incase this were to be fixed for whatever reason -- none yet
      var sx = xView || 0;
      var sy = yView || 0;

      // Save state before draw
      this.context.save();


      // Translate the origin to the ship's origin and rotate before drawing the whole ship
      this.context.translate(this.x - sx, this.y - sy);
      this.context.rotate(Game.Math.rad(this.rotation));

      // Render equipped weapon if there is one
      if(this.equippedWeapon) {
        this.renderWeapon();
      }

      // Set begining fill color
      this.context.fillStyle = this.color;

      // Draw wings
      this.context.beginPath();
      this.context.moveTo(0, -20);
      this.context.lineTo(25, 30);
      this.context.lineTo(0, (this.height/2)+5);
      this.context.lineTo(-25, 30);
      this.context.lineTo(0, -20);
      this.context.fill();
      this.context.stroke();

      // Draw Boosters
      // Left
      this.context.beginPath();
      this.context.rect(-6, (this.height/2.5), 5, 12.5);
      this.context.fill();
      this.context.stroke();

      // Right
      this.context.beginPath();
      this.context.rect(1, (this.height/2.5), 5, 12.5);
      this.context.fill();
      this.context.stroke();

      // Draw Center Rect
      this.context.beginPath();
      this.context.rect(-(this.width/2), -(this.height/2), this.width, this.height);
      this.context.fill();
      this.context.stroke();

      // Draw cockpit --

      // Draw Base
      this.context.beginPath();
      this.context.arc(0, -(this.height/2), 10, 0, Math.PI*2);
      this.context.fill();
      this.context.stroke();

      // Draw Window
      this.context.beginPath();
      this.context.fillStyle = "black";
      this.context.arc(0, -(this.height/2)-2.5, 5, Math.PI, Math.PI*2);
      this.context.fill();

      // PLAYER SHIP ORIGIN ##### DELETE LATER! ######
      // this.context.beginPath();
      // this.context.fillStyle = "red";
      // this.context.strokeRect(0-(this.width), 0-(this.height), this.width*2, this.height*2);
      // this.context.arc(0, 0, 1, 0, Math.PI*2);
      // this.context.fill();

      // Restore context so nothing else is affected
      this.context.restore();

      // ##### MORE DEBUG
      // this.renderHitBox();
    }

  }

  // Inherit proto from kontra
  PlayerShip.prototype = Object.create(kontra.sprite.prototype);

  // Maintain contructor as PlayerShip - for instance checking later
  PlayerShip.prototype.constructor = PlayerShip;

  // Determine if the ship can pick up the provided item
  PlayerShip.prototype.canPickup = function(item) {
    // Calc distance from item
    var distance = Game.Math.distance(this, item);

    // If the ship is close enough return true
    if(distance < item.pickupRadius) {
      if(item.name === "healthpack") {
        if(this.health !== this.maxHealth) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    return false
  };

  // Invoke item's effect method
  PlayerShip.prototype.pickupItem = function(item) {
    item.applyEffect(this);
  };

  // Determine if the ship can land on a landableobj - i.e. planets -- was going to do large asteroids, not enough time
  PlayerShip.prototype.canLandOn = function(landableObj) {
    var distance = Game.Math.distance(this, landableObj);

    // If within landingRadius of the obj return true
    if(distance < landableObj.landingRadius) {
      return true;
    }

    return false
  };

  // Shooting stuff dead
  PlayerShip.prototype.shoot = function() {
    // Call equipped weapon's fire method which returns a Projectile Object
    return this.equippedWeapon.fire(this.rotation);
  };

  // Update the hitbox with the current rotation direction
  PlayerShip.prototype.updateHitBoxRotation = function(dir) {
    if(dir === "left") {
      this.hitBox.rotate(-this.rotateSpeed*Math.PI/180);
    } else if(dir === "right") {
      this.hitBox.rotate(this.rotateSpeed*Math.PI/180);
    }
  };

  // Take Damage -- ouchies go here.
  PlayerShip.prototype.takeDamage = function(damage) {
    this.health -= damage;
  };

  // You are dead if you have no health
  PlayerShip.prototype.isDead = function() {
    if(this.health <= 0) {
      return true;
    }

    return false;
  };

  // Set the acc to zero to dead stop - used for collisions --- not enough time, or foresight, for cool physics
  PlayerShip.prototype.stop = function() {
    this.acc = 0;
  };

  // Set the default playership
  Game.PlayerShip = new PlayerShip({
      x: kontra.canvas.width/2,
      y: kontra.canvas.height/2,
      width: 15,
      height: 30,
      color: "white",
      hitBoxMatrix: [ { x: -12, y: -25 }, { x: 12, y: -25 }, { x: 25, y: 30 }, { x: -25, y: 30 }, { x: -12, y: -25 } ]
    });
})();
