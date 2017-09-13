(function() {
  function Planet(props) {
    // Kontra init
    this.init(props);

    this.name = "PlanetName1";

    // Set radius or randomize
    this.radius = props.radius || Game.Math.random(200, 600);

    // Set landing radius
    this.landingRadius = this.radius + 50;

    // generate stage which the ship will "land" on
    this.stage = this.generatePlanetStage();

    this.update = function() {

    }

    // Planet's a circle nothing fancy
    this.render = function(xView, yView) {
      this.context.save();
      this.context.beginPath()
      this.context.strokeStyle = "#d6d6d6";
      this.context.arc(this.x-xView, this.y-yView, this.radius, 0, Math.PI*2);

      this.context.closePath();
      this.context.fillStyle = "#272727";
      this.context.fill();
      this.context.stroke();

      this.context.restore();
    }

  }

  Planet.prototype = Object.create(kontra.sprite.prototype);

  Planet.prototype.constructor = Planet;

  // Generate a randomized stage that will be the planet's surface
  Planet.prototype.generatePlanetStage = function() {
    var stage = new Game.PlanetStage(this.name, {});
    // console.log(stage)
    return stage;
  };

  // Add Planet to Game
  Game.Planet = Planet;
})()

