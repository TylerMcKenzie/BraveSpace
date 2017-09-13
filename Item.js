(function() {
  // Default item names
  var ItemNames = {
    HEALTHPACK: "healthpack",
    DAMAGEBOOST: "damageboost",
    SPEEDBOOST: "speedboost"
  };

  function Item(props) {
    // Kontra init
    this.init(props);

    this.name = this.name || "";

    // Set width and height - defaults to 20 X 20
    this.width = this.width || 20;
    this.height = this.height || 20;

    // Set pickup radius
    this.pickupRadius = this.width*2;

    this.render = function(xView, yView) {
      // Save context
      this.context.save();

      // Items are never fixed so update by offsets
      var x = this.x - xView;
      var y = this.y - yView;

      // Switch the render based on the item's name
      switch(this.name) {
        case ItemNames.HEALTHPACK:
          // Background
          this.context.beginPath();
          this.context.fillStyle = "white";
          this.context.rect(x, y, this.width, this.height);
          this.context.fill();
          this.context.closePath();

          // Cross
          this.context.beginPath();
          this.context.fillStyle = "red";
          this.context.rect(x, y+(this.height/2)-(this.height)/8, this.width, this.height/4);
          this.context.rect(x+(this.width/2)-(this.width/8), y, this.width/4, this.height);
          this.context.fill();
          this.context.closePath();

          break;
        case ItemNames.DAMAGEBOOST:
          // Background
          this.context.beginPath();
          this.context.fillStyle = "lightgrey";
          this.context.rect(x, y, this.width, this.height);
          this.context.fill();
          this.context.closePath();

          // Up Arrows
          this.context.beginPath();
          this.context.fillStyle = "red";
          // Top Arrow
          this.context.moveTo(x+this.width/2, y+this.height/4);
          this.context.lineTo(x+this.width/4, y+this.height/2);
          this.context.lineTo(x+(this.width/1.3), y+this.height/2);
          this.context.fill();

          // Bottom Arrow
          this.context.moveTo(x+this.width/2, y+this.height/2);
          this.context.lineTo(x+this.width/4, y+this.height/1.25);
          this.context.lineTo(x+(this.width/1.3), y+this.height/1.25);
          this.context.fill();
          this.context.closePath();
          break;
        case ItemNames.SPEEDBOOST:
          // Background
          this.context.beginPath();
          this.context.fillStyle = "lightgrey";
          this.context.rect(x, y, this.width, this.height);
          this.context.fill();
          this.context.closePath();

          // Arrows
          this.context.beginPath();
          this.context.fillStyle = "limegreen";

          // Left Arrow
          this.context.moveTo(x, y);
          this.context.lineTo(x+this.width/2, y+this.height/2);
          this.context.lineTo(x, y+this.height);

          // Right Arrow
          this.context.moveTo(x+this.width/2, y);
          this.context.lineTo(x+this.width, y+this.height/2);
          this.context.lineTo(x+this.width/2, y+this.height);
          this.context.fill();
          this.context.closePath();
          break;
        default:
          return;
      }

      this.context.restore();
    }
  }

  // Inheritance
  Item.prototype = Object.create(kontra.sprite.prototype);

  Item.prototype.constructor = Item;

  // Apply the affect to the given target
  Item.prototype.applyEffect = function(target) {
    switch(this.name) {
      case ItemNames.HEALTHPACK:
        var diff = target.maxHealth - target.health;

        // If the diff is less than 10 add by that - no one gets MORE that full HEALTH
        if(diff < 25) {
          target.health += diff;
        } else {
          target.health += 25;
        }
        break;
      case ItemNames.DAMAGEBOOST:
        target.equippedWeapon.damage += 5;
        break;
      case ItemNames.SPEEDBOOST:
        target.maxSpeed += 0.1;
        break;
      default:
        return;
    }
  };

  // Class function that returns a randomized item
  Item.random = function() {
    var rand = Game.Math.random();
    var itemName;

    if(rand < 0.15) {
      itemName = ItemNames.DAMAGEBOOST;
    } else if(rand > 0.25 && rand < 0.85) {
      itemName = ItemNames.HEALTHPACK;
    } else {
      itemName = ItemNames.SPEEDBOOST;
    }

    return new Item({name: itemName});
  }

  // Add Item to Game
  Game.Item = Item;
})();
