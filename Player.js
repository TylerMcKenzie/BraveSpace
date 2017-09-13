(function() {
  var defaultWeapon = new Game.Weapon({});

  function Player(props) {
    this.init(props);
    this.inventory = [];
    this.speed = 4;
    this.facing = "right";
    this.equippedWeapon = defaultWeapon;

    this.update = function() {
      if(kontra.keys.pressed("left")) {
        this.moveLeft();
      }

      if(kontra.keys.pressed("right")) {
        this.moveRight();
      }

      if(kontra.keys.pressed("space")) {
        // this.jump();
      }
    }

    this.render = function(xView, yView) {
      var x = this.x - xView;
      var y = this.y - yView;
      // Save previous context state to prevent malformation
      this.context.save();

      this.context.fillStyle = this.color;

      // Draw Body
      this.context.beginPath();
      this.context.rect(x-(this.width/2), y+5, this.width, this.height);
      this.context.fill();
      this.context.stroke();

      // Draw Head
      this.context.beginPath();
      this.context.arc(x, y-5, this.width, 0, 2*Math.PI);
      this.context.fill();
      this.context.stroke();

      // Draw Visor
      this.context.fillStyle = "black";

      // Check player direction to draw visor
      if(this.facing === "right") {
        // Black half circle facing right
        this.context.beginPath();
        this.context.arc(x, y-4, this.width-3, Math.PI*1.5, Math.PI*0.5);
        this.context.fill();

        // White bottom half circle
        this.context.fillStyle = "white";
        this.context.beginPath();
        this.context.arc(x, y-4, this.width-2, Math.PI*2, Math.PI);
        this.context.fill();

        // Draw Backpack left side
        this.context.beginPath();
        this.context.rect(x-(this.width/2)-5, y+10, 5, 10);
        this.context.fill();
        this.context.stroke();
      }

      if(this.facing === "left") {
        // Draw half circle facing left
        this.context.beginPath();
        this.context.arc(x, y-4, this.width-3, -Math.PI*1.5, -Math.PI*0.5);
        this.context.fill();

        // White bottom half circle
        this.context.fillStyle = "white";
        this.context.beginPath();
        this.context.arc(x, y-4, this.width-2, Math.PI*2, Math.PI);
        this.context.fill();

        // Draw Backpack right side
        this.context.beginPath();
        this.context.rect(x+(this.width/2), y+10, 5, 10);
        this.context.fill();
        this.context.stroke();
      }

      // PLAYER ORIGIN ##### DELETE LATER! ######
      // this.context.fillStyle = "red";
      // this.context.beginPath();
      // this.context.arc(x, y, 1, 0, Math.PI*2);
      // this.context.fill();

      // Restore context state
      this.context.restore();
    };

  }

  Player.prototype = Object.create(kontra.sprite.prototype);

  Player.prototype.moveLeft = function() {
    // Set facing direction for render
    this.facing = "left";

    // Decrease x to move left
    this.x -= this.speed;
  };

  Player.prototype.moveRight = function() {
    // Set facing direction for render
    this.facing = "right";

    // Increase x to move right
    this.x += this.speed;
  };

  Player.prototype.jump = function() {};


  Player.prototype.equipWeapon = function(weapon) {
    this.equippedWeapon = weapon;
  };

  Game.Player = new Player({
                            x: (kontra.canvas.width/2)-10,
                            y: (kontra.canvas.height/2)-10,
                            width: 15,
                            height: 20,
                            color: 'white'
                          });

})();

