(function() {
  function Graphic(props) {
    // Kontra init
    this.init(props);

    // determine if fixed or independent of the camera
    if(this.isFixed === false) {
      this.isFixed = this.isFixed;
    } else {
      this.isFixed = true;
    }

    // Set visible on construct
    this.isVisible = true;

    // Adjust visibility when present
    if(props.visibility === "hidden") {
      this.isVisible = false;
    }

    // init will give draw function which if not fixed is updated by the camera's offsets
    this.render = function(xView, yView) {
      var xView = xView || 0;
      var yView = yView || 0;

      this.drawFunc(xView, yView);
    }
  }

  Graphic.prototype = Object.create(kontra.sprite.prototype);

  Graphic.prototype.contructor = Graphic;

  Graphic.prototype.show = function() {
    this.isVisible = true;
  }

  Graphic.prototype.hide = function() {
    this.isVisible = false;
  }

  Game.Graphic = Graphic;
})();
