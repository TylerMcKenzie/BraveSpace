(function() {
  function State(name, stateObj) {
    this.name = name;

    this.text = new Game.TextManager();
    this.graphics = new Game.GraphicManager();

    for(prop in stateObj) {
      if(prop !== "render" || prop !== "update") {
        this[prop] = stateObj[prop];
      }
    }

    if(this.init) {
      this.init();
    }

    this.update = function() {
      stateObj.update.call(this);

      this.text.updateTexts();
      this.graphics.updateGraphics();
    }

    this.render = function() {
      stateObj.render.call(this);

      if(this.camera) {
        this.text.renderTexts(this.camera.xView, this.camera.yView);
        this.graphics.renderGraphics(this.camera.xView, this.camera.yView);
      } else {
        this.text.renderTexts();
        this.graphics.renderGraphics()
      }
    }
  }

  Game.State = State;
})();
