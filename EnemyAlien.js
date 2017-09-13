(function() {
  function EnemyAlien(props) {
    Game.Enemy.call(this, props);

  }

  EnemyAlien.prototype = Object.create(Game.Enemy.prototype);

  Game.EnemyAlien = EnemyAlien;
})();
