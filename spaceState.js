Game.StateManager.state('Space', {
  init: function() {
    Game.Store.enemiesKilled = 0;
    Game.Store.asteroidsDestroyed = 0;
    Game.Store.itemsPickedup = 0;
    Game.Store.survived = 0;

    // Spawning Radius
    this.spawnRadiusMin = kontra.canvas.width+kontra.canvas.height-(kontra.canvas.height/4);
    this.spawnRadiusMax = kontra.canvas.width+kontra.canvas.height;

    // List of spawnable objects in the game
    // Each includes their last spawn time, min and max intervals, as well as the current time till next available spawn
    this.spawnObjects = {
      asteroid: {
        lastSpawn: 0,
        minSpawnInt: 5,
        maxSpawnInt: 10,
        spawnInt: this.generateSpawnDelay(5, 10)
      },
      planet: {
        lastSpawn: 0,
        minSpawnInt: 30,
        maxSpawnInt: 60,
        spawnInt: this.generateSpawnDelay(30, 60)
      },
      enemy: {
        lastSpawn: 0,
        minSpawnInt: 10,
        maxSpawnInt: 40,
        spawnInt: this.generateSpawnDelay(10, 40)
      },
      item: {
        lastSpawn: 0,
        minSpawnInt: 30,
        maxSpawnInt: 45,
        spawnInt: this.generateSpawnDelay(30, 45)
      }
    };

    // Enemies
    this.enemyShips = [];

    // Asteroids
    this.asteroids = [];

    // Planets
    this.planets = [];

    // Player's Ship
    this.playerShip = Game.PlayerShip;

    this.playerShipHealthGraphic = new Game.Graphic({
      x: 10,
      y: 10,
      isFixed: false,
      data: {
        playerHealth: this.playerShip.health,
        maxPlayerHealth: this.playerShip.maxHealth
      },
      updateHealthBar: function(newHealth) {
        this.data.playerHealth = newHealth
        if(this.data.playerHealth <= 0) {
          this.data.playerHealth = 0;
        }
      },
      drawFunc: function() {
        this.context.save();
        this.context.fillStyle = "red";
        this.context.fillRect(this.x, this.y, 200*(this.data.playerHealth/this.data.maxPlayerHealth), 10);
        this.context.restore();
      }
    });
    this.graphics.add(this.playerShipHealthGraphic);

    // Items
    this.items = [];

    // Bullets
    this.playerBullets = [];
    this.enemyBullets = [];

    // Set up state's camera to follow player
    this.camera = new Game.Camera(kontra.canvas.width/2, kontra.canvas.height/2, kontra.canvas.width, kontra.canvas.height);
    this.camera.follow(this.playerShip, kontra.canvas.width/2, kontra.canvas.height/2);

    // Setup stars background

    var starVectors = [];
    var numOfStars = 200;

    for(var i = 0; i < numOfStars; i++) {
      var star = {};
      star.x = Game.Math.random(kontra.canvas.width);
      star.y = Game.Math.random(kontra.canvas.height);
      star.radius = Game.Math.random(1.2);

      starVectors.push(star);
    }

    this.stars = kontra.sprite({
      starVectors: starVectors,
      update: function(xView, yView) {
        for(var i = 0; i < this.starVectors.length; i++) {
          if(this.starVectors[i].x > xView + kontra.canvas.width) {
            this.starVectors[i].x = xView;
          } else if(this.starVectors[i].x < xView) {
            this.starVectors[i].x = xView + kontra.canvas.width;
          }

          if(this.starVectors[i].y > yView + kontra.canvas.height) {
            this.starVectors[i].y = yView;
          } else if(this.starVectors[i].y < yView) {
            this.starVectors[i].y = yView + kontra.canvas.height;
          }
        }
      },
      render: function(xView, yView) {
        var x = xView || 0;
        var y = yView || 0;
        this.context.save();
        this.context.fillStyle = "white";

        for(var i = 0; i < this.starVectors.length; i++) {
          this.context.beginPath();
          this.context.arc(this.starVectors[i].x - xView, this.starVectors[i].y - yView, this.starVectors[i].radius, 0, Math.PI*2);
          this.context.fill();
          this.context.closePath();
        }
        this.context.restore();
      }
    })
  },
  update: function() {
    // Keep camera updated to playe pos
    this.camera.update();

    // Update stars with camera xView and yView
    this.stars.update(this.camera.xView, this.camera.yView);

    // Planets
    for(var p = 0; p < this.planets.length; p++) {
      this.planets[p].update();

      // Check if planet is in range to land on
      if(this.playerShip.canLandOn(this.planets[p])) {
        // Land if l is tapped
        // if(Game.Controls.keys.tapped("l")) {
        //   Game.StateManager.setCurrentState(this.planets[p].stage);
        // }
      }
    }

    // Player Bullets
    for(var i = 0; i < this.playerBullets.length; i++) {
      // If bullet is not alive remove it from the array
      this.playerBullets[i].update();

      // Remove "dead" bullets
      if(!this.playerBullets[i].isAlive()) {
        this.playerBullets.splice(i, 1);
        i--;
      }
    }

    // Items
    for(var j = 0; j < this.items.length; j++) {
      this.items[j].update();

      if(this.playerShip.canPickup(this.items[j])) {
        // Pickup item if the player can pick it up
        this.playerShip.pickupItem(this.items[j]);

        Game.Store.itemsPickedup++;

        // If the item was a healthpack update the healthbar -- open cuz i was thinking about armor --
        this.playerShipHealthGraphic.updateHealthBar(this.playerShip.health);

        // The item was picked up so remove it from the render list
        this.items.splice(j, 1);
        j--;
      }
    }

    // Asteroids
    for(var a = 0; a < this.asteroids.length; a++) {
      this.asteroids[a].update();

      // If there are bullets check for collision
      if(this.playerBullets.length) {
        for(var b = 0; b < this.playerBullets.length; b++) {
          // Player Bullet Collision
          if(this.playerBullets[b].collidesWith(this.asteroids[a])) {
            // Damage asteroid
            this.asteroids[a].takeDamage(this.playerBullets[b].damage);

            // Remove collided bullet
            this.playerBullets[b].kill();
          }
        }
      }

      // Remove or split destroyed asteroids
      if(this.asteroids[a].destroyed()) {
        // If asteroid can split split, split it
        if(this.asteroids[a].canSplit()) {
          for(var subA = 0; subA < this.asteroids[a].numberOfSplits; subA++) {
            // Copy the asteroid props
            var subAsteroidProps = Object.assign({}, this.asteroids[a]);

            // Create another asteroid from copied props
            var subAsteroid = new Game.Asteroid(subAsteroidProps);

            // Set new asteroid's origin to parent asteroid
            subAsteroid.hitBox.x = this.asteroids[a].hitBox.x;
            subAsteroid.hitBox.y = this.asteroids[a].hitBox.y;

            // Scale the asteroid by how many there are
            subAsteroid.scale(1/this.asteroids[a].numberOfSplits);

            // Add asteroid to asteroid array
            this.asteroids.push(subAsteroid);
          }

          // Drop Item
          var droppedItem = this.asteroids[a].dropItem();

          if(droppedItem) {
            this.items.push(droppedItem);
          }

          // Destroy the asteroid
          this.asteroids.splice(a, 1);
          // a--;
        } else {
          // Drop Item
          var droppedItem = this.asteroids[a].dropItem();

          if(droppedItem) {
            this.items.push(droppedItem);
          }

          // Destroy the asteroid
          this.asteroids.splice(a, 1);
          a--;
        }

        Game.Store.asteroidsDestroyed++;
      }

      // Check for asteroid collision
      if(this.playerShip.collidesWith(this.asteroids[a])) {
        // Take damage
        this.playerShip.takeDamage(this.asteroids[a].damage)
        this.asteroids[a].takeDamage(50);

        var playerDeflectionAngle = Game.Math.angleFrom(this.playerShip, this.asteroids[a].hitBox) + 180;
        var playerCos = Game.Math.cos(playerDeflectionAngle);
        var playerSin = Game.Math.sin(playerDeflectionAngle);

        // Stop the ship acc
        this.playerShip.stop();
        // Move the player away from the asteroid (ran out of time to refactor for accurate physics)
        Game.Animator.animateTo(this.playerShip, this.asteroids[a].damage*playerCos, this.asteroids[a].damage*playerSin, 100);

        // Update the health graphic
        this.playerShipHealthGraphic.updateHealthBar(this.playerShip.health);
      }
    }

    // Enemies
    for(var e = 0; e < this.enemyShips.length; e++) {
      this.enemyShips[e].update();

      if(Game.Math.distance(this.enemyShips[e], this.playerShip) < this.enemyShips[e].detectionRadius) {
        this.enemyShips[e].follow(this.playerShip);

        if(this.enemyShips[e].isFiring) {
          var enemyB = this.enemyShips[e].shootAt(this.playerShip);

          this.enemyBullets.push(enemyB);
        }
      }

      if(this.playerBullets.length) {
        for(var i = 0; i < this.playerBullets.length; i++) {
          if(this.enemyShips[e].isHitBy(this.playerBullets[i])) {
            this.enemyShips[e].takeDamage(this.playerBullets[i].damage);

            this.playerBullets[i].kill();
          }
        }
      }

      if(this.enemyShips[e].isDead()) {
        Game.Store.enemiesKilled++;

        var droppedItem = this.enemyShips[e].dropItem()

        if(droppedItem) {
          this.items.push(droppedItem)
        }

        this.enemyShips.splice(e, 1);
        e--;
      }
    }

    // Enemy bullets
    for(var eB = 0; eB < this.enemyBullets.length; eB++) {
      this.enemyBullets[eB].update();

      if(this.enemyBullets[eB].collidesWith(this.playerShip)) {
        this.playerShip.takeDamage(this.enemyBullets[eB].damage);

        this.enemyBullets[eB].kill();

        this.playerShipHealthGraphic.updateHealthBar(this.playerShip.health);
      }

      if(!this.enemyBullets[eB].isAlive()) {
        this.enemyBullets.splice(eB, 1);
        eB--;
      }
    }

    // Update PlayerShip
    this.playerShip.update();

    // Player shooting
    if(this.playerShip.isFiring) {
      if(this.playerShip.equippedWeapon.canFire()) {
        // Get bullet projectile from playerShip and add it to bullet list
        var bullet = this.playerShip.shoot();

        // Add to player bullet array
        this.playerBullets.push(bullet)

        // Count fire delay
        this.playerShip.equippedWeapon.countDelay();
      } else {
        // Count fire delay
        this.playerShip.equippedWeapon.countDelay();
      }
    } else {
      // Reset weapon delay
      this.playerShip.equippedWeapon.resetFireDelay();
    }

    if(this.playerShip.isDead()) {
      Game.Store.survived = Math.floor(performance.now());
      Game.StateManager.setCurrentState("GameOver");
    }

    // Spawn new Enemies, Asteroids, Items, and Planets
    var now = performance.now();
    for(spawnable in this.spawnObjects) {
      if(now - this.spawnObjects[spawnable].lastSpawn >= this.spawnObjects[spawnable].spawnInt) {
        // Spawn Something
        this.spawn(spawnable);

        // Reset spawn interval and capture lastspawn
        this.spawnObjects[spawnable].lastSpawn = now;
        this.spawnObjects[spawnable].spawnInt = this.generateSpawnDelay(this.spawnObjects[spawnable].minSpawnInt, this.spawnObjects[spawnable].maxSpawnInt);
      }
    }
  },
  render: function() {
    // Draw stars
    this.stars.render(this.camera.xView, this.camera.yView);

    // Planet Render
    for(var p = 0; p < this.planets.length; p++) {
      this.planets[p].render(this.camera.xView, this.camera.yView);
    }

    // PlayerBullet Render
    for(var b = 0; b < this.playerBullets.length; b++) {
      this.playerBullets[b].render(this.camera.xView, this.camera.yView);
    }

    // EnemyBullet Render
    for(var eB = 0; eB < this.enemyBullets.length; eB++) {
      this.enemyBullets[eB].render(this.camera.xView, this.camera.yView);
    }

    // Asteroid render
    for(var a = 0; a < this.asteroids.length; a++) {
      this.asteroids[a].render(this.camera.xView, this.camera.yView);
    }

    // Enemies
    for(var e = 0; e < this.enemyShips.length; e++) {
      this.enemyShips[e].render(this.camera.xView, this.camera.yView);
    }

    // Items
    for(var j = 0; j < this.items.length; j++) {
      this.items[j].render(this.camera.xView, this.camera.yView);
    }

    // Render Playership
    this.playerShip.render(this.camera.xView, this.camera.yView);
  },
  addAsteroid: function() {
    var numOfAsteroids = Math.floor(Game.Math.random(1, 5));

    for(var i = 0; i < numOfAsteroids; i++) {
      var spawnVector = this.generateSpawnVector();
      var asteroid = new Game.Asteroid({x: spawnVector.x, y: spawnVector.y});

      this.asteroids.push(asteroid);
    }
  },
  addEnemy: function() {
    var spawnVector = this.generateSpawnVector();
    var enemy = new Game.EnemyShip({x: spawnVector.x, y: spawnVector.y});

    this.enemyShips.push(enemy);
  },
  addPlanet: function() {
    var spawnVector = this.generateSpawnVector();
    var planet = new Game.Planet({x: spawnVector.x, y: spawnVector.y});
    var canSpawn = false;

    if(this.planets.length) {
      // Check for planets in the vicinity of the new planet --keeps them from overlapping
      for(var i = 0; i < this.planets.length; i++) {
        if(Game.Math.distance(planet, this.planets[i]) < this.planets[i].radius*3) {
          canSpawn = false;
          break;
        } else {
          canSpawn = true;
        }
      }
    } else {
      canSpawn = true;
    }

    if(canSpawn) {
      this.planets.push(planet);
    }
  },
  addItem: function() {
    var spawnVector = this.generateSpawnVector();
    var item = Game.Item.random();
    item.x = spawnVector.x;
    item.y = spawnVector.y;

    this.items.push(item);
  },
  spawn: function(spawnName) {
    // Control switch for spawning objects -crude but saves me lines
    switch(spawnName) {
      case "asteroid":
        this.addAsteroid();
        break;
      case "planet":
        this.addPlanet();
        break;
      case "enemy":
        this.addEnemy();
        break;
      case "item":
        this.addItem();
        break;
      default:
        break;
    }
  },
  generateSpawnVector: function() {
    var vector = {};
    // Generate Random Vector
    var angle = Game.Math.random(-360, 360);
    // Generate magnitude based off min and max spawn radius
    var magnitude = Game.Math.random(this.spawnRadiusMin, this.spawnRadiusMax);

    // Update the radius's origin to the current camera location
    vector.x = this.camera.xView+(Game.Math.cos(angle)*magnitude);
    vector.y = this.camera.yView+(Game.Math.sin(angle)*magnitude);

    // Return the random vector
    return vector;
  },
  generateSpawnDelay: function(minSec, maxSec) {
    return Game.Math.random(minSec*1000, maxSec*1000);
  }
});
