(function() {
  function EnemyShip(props) {
    Game.Enemy.call(this, props);

    this.radius = Math.floor(Game.Math.random(20, 30));

    this.innerColor = "rgb(" + Math.floor(Game.Math.random(256)) + ", " + Math.floor(Game.Math.random(256)) + ", " + Math.floor(Game.Math.random(256)) + ")";
    this.outerColor = "rgb(" + Math.floor(Game.Math.random(256)) + ", " + Math.floor(Game.Math.random(256)) + ", " + Math.floor(Game.Math.random(256)) + ")";

    this.isFollowing = false;

    this.direction = Game.Math.random(-360, 360);
    this.directionUpdateInt = Game.Math.random(1000, 4000);
    this.lastDirectionUpdate = 0;

    this.update = function() {
      var now = performance.now();

      if(this.following) {
        this.isFollowing = true;

        this.direction = Game.Math.angleFrom(this, this.following) + 90;
      }

      if(!this.isFollowing) {
        if(now - this.lastDirectionUpdate > this.directionUpdateInt) {
          this.direction += Game.Math.random(-90, 90);

          this.lastDirectionUpdate = now;
          this.directionUpdateInt = Game.Math.random(500, 1500);
        }
      }

      if(this.isFollowing && Game.Math.distance(this, this.following) > 100) {
        this.x += Game.Math.sin(this.direction)*this.movementSpeed;
        this.y += -Game.Math.cos(this.direction)*this.movementSpeed;
      }

      if(now - this.lastFire > this.fireInt) {
        this.isFiring = true;
        this.lastFire = now;
        this.fireInt = Game.Math.random(1000, 2000)
      } else {
        this.isFiring = false
      }

      this.weapon.x = this.x;
      this.weapon.y = this.y;
    }

    this.render = function(xView, yView) {
      var xView = xView || 0;
      var yView = yView || 0;


      this.context.save();
      // outer circle
      this.context.beginPath();
      this.context.fillStyle = this.outerColor;
      this.context.arc(this.x - xView, this.y - yView, this.radius, 0, Math.PI*2);
      this.context.fill();
      this.context.stroke();

      // inner circle
      this.context.beginPath();
      this.context.fillStyle = this.innerColor;
      this.context.arc(this.x - xView, this.y - yView, this.radius/2, 0, Math.PI*2);
      this.context.fill();
      this.context.stroke();
      this.context.restore();
    }
  }

  EnemyShip.prototype = Object.create(Game.Enemy.prototype);

  EnemyShip.prototype.follow = function(target) {
    this.following = target
  };

  EnemyShip.prototype.isHitBy = function(object) {
    var distance = Game.Math.distance(this, object);

    if(distance < this.radius) {
      return true;
    }

    return false;
  };

  Game.EnemyShip = EnemyShip;
})();
