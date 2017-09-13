Game.StateManager.setCurrentState("Intro");

// Create the GameLoop
var GameLoop = Game.gameLoop({
  update: function() {
    // Update Current State using statemanager
    Game.StateManager.updateCurrentState();
  },
  render: function() {
    // Draw Background
    kontra.context.fillStyle = "#272727";
    kontra.context.fillRect(0, 0, kontra.canvas.width, kontra.canvas.height);

    // Render Current State using statemanager
    Game.StateManager.renderCurrentState();
  }
});

// Start Loop
GameLoop.start();
