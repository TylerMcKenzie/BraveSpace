(function() {
  function Rectangle(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;

    this.xMax = (this.x + this.width);
    this.yMax = (this.y + this.height);
  }

  Rectangle.prototype.contructor = Rectangle;

  Rectangle.prototype.set = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width || this.width;
    this.height = height || this.height;

    this.xMax = (this.x + this.width);
    this.yMax = (this.y + this.height);
  };

  Rectangle.prototype.isWithinRect = function(rect) {
    return (rect.x <= this.x &&
          rect.xMax >= this.xMax &&
          rect.y <= this.y &&
          rect.yMax >= this.yMax);
  };

  Rectangle.prototype.overlapsRect = function(rect) {
    return (this.x < rect.xMax &&
          rect.x < this.xMax &&
          this.y < rect.yMax &&
          rect.y < this.yMax);
  };

  Game.Rectangle = Rectangle;
})()