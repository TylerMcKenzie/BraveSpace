(function() {
  function Polygon(props) {
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.points = props.points || [];
  }

  Polygon.prototype.hasPoint = function(x, y) {
    var collided = false;

    for(var i = 0, j = this.points.length-1; i < this.points.length; i++) {
      var x1 = this.points[i].x + this.x;
      var x2 = this.points[j].x + this.x;

      var y1 = this.points[i].y + this.y;
      var y2 = this.points[j].y + this.y;

      if((y1 > y != y2 > y) && (x < (x2-x1)*(y-y1) / (y2 - y1)+x1)) {
        collided = !collided;
      }

      j = i;
    }

    return collided;
  };

  Polygon.prototype.rotate = function(angle) {
    var cos = Game.Math.cos(angle);
    var sin = Game.Math.sin(angle);

    for(var i = 0; i < this.points.length; i++) {
      var x = this.points[i].x;
      var y = this.points[i].y;

      var rotatedX = (x*cos - y*sin);
      var rotatedY = (x*sin + y*cos);

      this.points[i] = { x: rotatedX, y: rotatedY };
    }
  };

  Polygon.prototype.scale = function(scale) {
    for(var i = 0; i < this.points.length; i++) {
      var x = this.points[i].x * scale;
      var y = this.points[i].y * scale;

      this.points[i] = { x: x, y: y };
    }
  };

  Polygon.rotateMatrix = function(angle, matrix) {
    var cos = Game.Math.cos(angle);
    var sin = Game.Math.sin(angle);

    for(var i = 0; i < matrix.length; i++) {
      var x = matrix[i].x;
      var y = matrix[i].y;

      var rotatedX = (x*cos - y*sin);
      var rotatedY = (x*sin + y*cos);

      matrix[i] = { x: rotatedX, y: rotatedY };
    }

    return matrix;
  };


  Game.Polygon = Polygon;
})()
