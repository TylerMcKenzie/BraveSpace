(function() {
  function PlanetStage(planetName, stageConfig) {
    // Extend Game.State for rendering and such
    Game.State.call(this, planetName, stageConfig)

    // Environment
    this.gravity = this.gravity || 9.8;
    this.foregroundColor = this.foreGroundColor || "#d6d6d6";
    this.backgroundColor = this.backgroundColor || "#bababa";

    // Player
    this.player = Game.Player;
    this.playerBullets = [];

    // Enemies
    this.enemies = [];
    this.enemyBullets = [];

    // Camera
    this.camera = new Game.Camera(kontra.canvas.width/2, kontra.canvas.height/2, kontra.canvas.width, kontra.canvas.height);
    this.camera.follow(this.player, kontra.canvas.width/2, kontra.canvas.height/2);
  }

  PlanetStage.prototype = Object.create(Game.State.prototype);

  PlanetStage.prototype.constructor = PlanetStage;

  PlanetStage.prototype.update = function() {
  };

  PlanetStage.prototype.render = function() {
    // EnemyBullets
    for(var eB = 0; eB < this.enemyBullets.length; eB++) {
      this.enemyBullets[eB].render(this.camera.xView, this.camera.yView);
    }

    // PlayerBullets
    for(var pB = 0; pB < this.playerBullets.length; pB++) {
      this.playerBullets[pB].render(this.camera.xView, this.camera.yView);
    }

    // Enemies
    for(var e = 0; e < this.enemies.length; e++) {
      this.enemies[e].render(this.camera.xView, this.camera.yView);
    }

    // Player
    this.player.render(this.camera.xView, this.camera.yView);
  }

  Game.PlanetStage = PlanetStage;
})();
