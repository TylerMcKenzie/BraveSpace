(function() {
  // This manages all the graphics inside it
  function GraphicManager() {
    this.graphics = [];
  }

  function isGraphic(obj) {
    if(obj instanceof Game.Graphic) {
      return true;
    }

    return false
  }

  GraphicManager.prototype.constructor = GraphicManager;

  // If a the object passed is not a graphic make a new Graphic from that object or error out
  GraphicManager.prototype.add = function(graphic) {
    if(isGraphic(graphic)) {
      this.graphics.push(graphic);
    } else if(typeof graphic === "object") {
      var newGraphic = new Game.Graphic(graphic);

      this.graphics.push(newGraphic);
    } else {
      throw new Error("Paramater was not Game.Graphic or graphic property object.");
    }
  }

  // Loop through and update all the visible graphics on the screen - performance
  GraphicManager.prototype.updateGraphics = function() {
    for(var i = 0; i < this.graphics.length; i++) {
      if(this.graphics[i].isVisible) {
        this.graphics[i].update()
      }
    }
  }

  // Loop through and render all the visible graphics on the screen - performance
  // If it is not fixed render by the given offsets
  GraphicManager.prototype.renderGraphics = function(xView, yView) {
    for(var i = 0; i < this.graphics.length; i++) {
      if(this.graphics[i].isVisible) {
        if(this.graphics[i].isFixed) {
          this.graphics[i].render();
        } else {
          this.graphics[i].render(xView, yView);
        }
      }
    }
  };

  // Add GraphicManager to the Game
  Game.GraphicManager = GraphicManager;
})();
