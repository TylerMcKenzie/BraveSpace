(function() {
  function Weapon(props) {
    this.init(props)

    this.projectileLifespan = props.projectileLifespan || 1000;
    this.damage = props.damage || 10;
    this.fireDelay = props.fireDelay || 1;
    this.projectileSpeed = props.projectileSpeed || 10;
    this.numOfProjectiles = props.numOfProjectiles || 1;
    this.projectileOffX = props.projectileOffX || 0;
    this.projectileOffY = props.projectileOffY || 0;
    this.projectileColor = props.projectileColor || "red";
    this.delay = 0;
    this.acc = 0;

    var projectileProperties = {
      color: this.projectileColor,
      ttl: this.projectileLifespan,
      projectileSpeed: this.projectileSpeed,
      offX: this.projectileOffX,
      offY: this.projectileOffY
    }

    this.projectileProperties = projectileProperties;
    this.projectileProperties.x = this.x;
    this.projectileProperties.y = this.y;

    this.projectile = Game.Projectile;

  }

  Weapon.prototype = Object.create(kontra.sprite.prototype);

  Weapon.prototype.constructor = Weapon;

  Weapon.prototype.fire = function(angle) {
    var props = Object.assign({}, this.projectileProperties);

    props.angle = angle;
    props.x = this.x;
    props.y = this.y;
    props.damage = this.damage;

    var projectile = new this.projectile(props);

    return projectile;
  }

  Weapon.prototype.countDelay = function() {
    this.delay++;
  };

  Weapon.prototype.resetFireDelay = function() {
    this.delay = 0;
  };

  Weapon.prototype.canFire = function() {
    if(this.delay === this.fireDelay || this.delay === 0) {
      this.resetFireDelay();
      return true;
    }
    return false;
  };

  Game.Weapon = Weapon;
})();
