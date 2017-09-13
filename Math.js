(function() {
  var GameMath = {
    cos: function(angle) {
      var rad = this.rad(angle);

      return Math.cos(rad);
    },
    sin: function(angle) {
      var rad = this.rad(angle);

      return Math.sin(rad);
    },
    rad: function(angle) {
      // Convert to rad
      return angle*Math.PI/180;
    },
    deg: function(rad) {
      // Convert to degrees
      return rad*180/Math.PI;
    },
    random: function(min, max) {
      // If one parameter assume 0 is min and 'min' is max
      if(min && !max) {
        return Math.random()*(min);
      } else if(min && max) {
        return Math.random()*(max - min) + min;
      } else {
        return Math.random();
      }
    },
    distance: function(obj1, obj2) {
      var dx = obj2.x - obj1.x;
      var dy = obj2.y - obj1.y;

      var distance = Math.sqrt(dx*dx + dy*dy);

      return distance;
    },
    angleFrom: function(obj1, obj2) {
      var dx = obj2.x - obj1.x;
      var dy = obj2.y - obj1.y;

      var theta = Math.atan2(dy, dx);

      // Convert to degrees
      theta *= 180 / Math.PI ;

      return theta;
    }
  }

  Game.Math = GameMath;
})()

