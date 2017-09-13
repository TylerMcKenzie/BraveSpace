(function() {
  // Game's crude animator
  Game.Animator = {
    animateTo: function(obj, x, y, duration) {
      var start = performance.now();

      var startX = obj.x;
      var startY = obj.y;

      requestAnimationFrame(function moveTo(time) {
        var timeFraction = (time - start) / duration;

        if(timeFraction > 1) timeFraction = 1;

        obj.x = startX + (timeFraction * x);
        obj.y = startY + (timeFraction * y);

        if(timeFraction < 1) {
          requestAnimationFrame(moveTo);
        }
      });
    }
  }
})()