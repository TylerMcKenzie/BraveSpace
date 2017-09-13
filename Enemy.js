(function() {
  function Enemy(props) {
    this.init(props);

    this.direction = 0;

    this.health = this.health || Math.floor(Game.Math.random(25, 150));
    this.weapon = new Game.Weapon({
      damage: Math.floor(Game.Math.random(15, 25)),
      projectileSpeed: Math.floor(Game.Math.random(10, 15))
    });

    this.isFiring = false;
    this.lastFire = 0;
    this.fireInt = Game.Math.random(500, 1500);

    this.detectionRadius = this.detectionRadius || Math.floor(Game.Math.random(300, 500));
    this.movementSpeed = this.movementSpeed || Math.floor(Game.Math.random(1, 4));
  }

  Enemy.prototype = Object.create(kontra.sprite.prototype);

  Enemy.prototype.constructor = Enemy;

  Enemy.prototype.shootAt = function(object) {
    var angle = Game.Math.angleFrom(this, object) + 90;

    return this.weapon.fire(angle);
  };

  Enemy.prototype.attack = function(object) {
    var distance = Game.Math.distance(this, object);
    var angle = Game.Math.angleFrom(this, object)
    var dx = distance*Game.Math.cos(angle+90);
    var dy = distance*Game.Math.sin(angle+90);

    if(distance < this.detectionRadius) {
      if(distance > 200) {
        this.x -= dx/this.movementSpeed;
        this.y -= dy/this.movementSpeed;
      }
    }
  }

  Enemy.prototype.moveTo = function(x, y, duration) {
    Game.Animator.animateTo(this, x, y, duration);
  };

  Enemy.prototype.takeDamage = function(damage) {
    this.health -= damage;
  };

  Enemy.prototype.isDead = function() {
    if(this.health <= 0) {
      return true;
    }

    return false;
  };

  Enemy.prototype.dropItem = function() {
    var item = Game.Item.random();
    item.x = this.x;
    item.y = this.y;

    if(Game.Math.random() > Game.Math.random()) {
      return item;
    } else {
      return false;
    }
  }

  Game.Enemy = Enemy;
})();
