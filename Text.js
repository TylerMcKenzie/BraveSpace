(function() {
  function Text(props) {
    this.init(props);

    this.text = this.text || '';

    this.px = this.px || "15px";
    this.fontFamily = this.fontFamily || "sans-serif";
    this.fillStyle = this.fillStyle || "white";
    this.strokeStyle = this.strokeStyle || "white";
    this.textAlign = this.textAlign || "start";

    if(this.isFixed === false) {
      this.isFixed = this.isFixed;
    } else {
      this.isFixed = true;
    }

    this.isVisible = true;

    if(props.visibility === "hidden") {
      this.isVisible = false;
    }
  }

  Text.prototype = Object.create(kontra.sprite.prototype);

  Text.prototype.constructor = Text;

  Text.prototype.font = function() {
    var font = this.px + " " + this.fontFamily;

    return font;
  }

  Text.prototype.render = function(xView, yView) {
    var xView = xView || 0;
    var yView = yView || 0;

    this.context.save();
    this.context.font = this.font();
    this.context.fillStyle = this.fillStyle;
    this.context.strokeStyle = this.strokeStyle;
    this.context.textAlign = this.textAlign;
    this.context.fillText(this.text, this.x - xView, this.y - yView);
    this.context.restore();
  };

  Text.prototype.update = function() {

  };

  Text.prototype.show = function() {
    this.isVisible = true;
  }

  Text.prototype.hide = function() {
    this.isVisible = false;
  }

  Game.Text = Text;
})();
