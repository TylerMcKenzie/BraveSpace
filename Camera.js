(function() {
  var AXIS = {
    NONE: "none",
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    BOTH: "both"
  };

  function Camera(xView, yView, canvasW, canvasH, worldW, worldH) {
    // X and Y coordinates of the viewPort
    this.xView = xView || 0;
    this.yView = yView || 0;

    // Width and Height of the viewPort
    this.wView = canvasW;
    this.hView = canvasH;

    // Width and Height of the worldBounds
    if(worldW && worldH) {
      this.worldW = worldW
      this.worldW = worldH
    }

    // Deadzone
    this.xDeadZone = 0;
    this.yDeadZone = 0;

    // Allow Camera to move in vertical and horizontal axis
    this.axis = AXIS.BOTH;

    // Object to follow
    this.followed = null;

    // ViewPort object
    this.viewPort = new Game.Rectangle(this.xView, this.yView, this.wView, this.hView);

    // Size of the world the ViewPort can travel in
    if(this.worldW && this.worldH) {
      this.worldBounds = new Game.Rectangle(this.xView, this.yView, this.wView, this.hView, this.worldW, this.worldH);
    }
  }

  Camera.prototype.constructor = Camera;

  // Tell the camera what object to follow
  Camera.prototype.follow = function(object, xDeadZone, yDeadZone) {
    this.followed = object;
    this.xDeadZone = xDeadZone || 0;
    this.yDeadZone = yDeadZone || 0;

    // Updates the location of the camera so there is no initial jitter on render.
    this.update();
  };

  // Set the maximum x and y the Camera can travel to
  Camera.prototype.setWorldBounds = function(width, height) {
    this.worldBounds.x = width;
    this.worldBounds.y = height;
  };

  Camera.prototype.setAxis = function(axis) {
    if(axis === AXIS.HORIZONTAL) {
      this.axis = AXIS.HORIZONTAL;
    } else if(axis === AXIS.VERTICAL) {
      this.axis = AXIS.VERTICAL;
    } else if(axis === AXIS.BOTH) {
      this.axis = AXIS.BOTH;
    } else {
      this.axis = AXIS.NONE;
    }
  };

  Camera.prototype.update = function() {
    if(this.followed != null) {

      // HORIZONTAL movement if not both
      if( this.axis === AXIS.HORIZONTAL || this.axis === AXIS.BOTH) {
        if(this.followed.x - this.xView + this.xDeadZone > this.wView) {
          this.xView = this.followed.x - (this.wView - this.xDeadZone);
        } else if(this.followed.x - this.xDeadZone < this.xView) {
          this.xView = this.followed.x - this.xDeadZone;
        }
      }

      // VERTICAL movement if not both
      if(this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
        if(this.followed.y - this.yView + this.yDeadZone > this.hView) {
          this.yView = this.followed.y - (this.hView - this.yDeadZone);
        } else if(this.followed.y - this.yDeadZone < this.yView) {
          this.yView = this.followed.y - this.yDeadZone;
        }
      }

      this.viewPort.set(this.xView, this.yView);

      // don't let camera leaves the world's boundary - used for planets stages
      if(this.worldBounds) {
        if(!this.viewPort.withinRect(this.worldBounds)) {
          if(this.viewPort.x < this.worldBounds.x) {
            this.xView = this.worldBounds.x;
          }

          if(this.viewPort.y < this.worldBounds.y) {
            this.yView = this.worldBounds.y;
          }

          if(this.viewPort.xMax > this.worldBounds.xMax) {
            this.xView = this.worldBounds.xMax - this.wView;
          }

          if(this.viewPort.yMax > this.worldBounds.yMax) {
            this.yView = this.worldBounds.yMax - this.hView;
          }
        }
      }
    }
  };

  Game.Camera = Camera;
})();
