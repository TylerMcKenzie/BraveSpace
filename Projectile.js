(function() {
  function Projectile(props) {
    this.init(props);

    var hitBoxMatrix = props.projectileShape || [{x: -2, y: -2}, {x: 2, y: -2}, {x: 2, y: 2}, {x: -2, y: 2}, {x: -2, y: -2}];

    if(!props.projectileShape) {
      this.offX = 2;
      this.offY = 2;
    } else {
      this.offX = props.offX;
      this.offY = props.offY;
    }

    this.hitBox = new Game.Polygon({x: props.x, y: props.y, points: hitBoxMatrix});

    this.update = function() {
      if(this.ttl > 0) {
        this.hitBox.x = this.x;
        this.hitBox.y = this.y;

        this.x += Game.Math.sin(this.angle) * this.projectileSpeed;
        this.y += -Game.Math.cos(this.angle) * this.projectileSpeed;

        this.ttl -= 1;
      }
    };

    this.collidesWith = function(object) {
      for(var i = 0; i < this.hitBox.points.length; i++) {
        if(object.hitBox.hasPoint(this.hitBox.x+this.hitBox.points[i].x, this.hitBox.y+this.hitBox.points[i].y)) {
          return true;
        }
      }

      for(var j = 0; j < object.hitBox.points.length; j ++) {
        if(this.hitBox.hasPoint(object.hitBox.x+object.hitBox.points[j].x, object.hitBox.y+object.hitBox.points[j].y)) {
          return true;
        }
      }

      return false;
    }

    this.render = function(xView, yView) {
      if(this.isAlive()) {
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(this.x - xView, this.y - yView, 2, 0, Math.PI*2);
        this.context.closePath();
        this.context.fill();
        this.context.restore();
      }
    }
  }

  Projectile.prototype = Object.create(kontra.sprite.prototype);

  Projectile.prototype.constructor = Projectile;

  Projectile.prototype.rotate = function(angle) {
    this.hitBox.rotate(this.angle);
  };

  Projectile.prototype.kill = function() {
    this.ttl = 0;
  };

  Game.Projectile = Projectile;
})();
