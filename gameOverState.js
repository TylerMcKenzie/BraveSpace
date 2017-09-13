Game.StateManager.state("GameOver", {
  update: function() {

  },
  render: function() {
    var startX = (kontra.canvas.width/2)
    var startY = (kontra.canvas.height/2-100)
    // Game Over
    this.text.add({
      x: startX,
      y: startY - 60,
      px: "25px",
      textAlign: "center",
      text: "Game Over!"
    })

    // Thanks for Playing!
    this.text.add({
      x: startX,
      y: startY - 30,
      px: "25px",
      textAlign: "center",
      text: "Thanks for Playing!"
    })

    // Scores
    for(scoreName in Game.Store) {
      if(scoreName != "survived") {
        this.text.add({
          x: startX,
          y: startY += 30,
          px: "20px",
          textAlign: "center",
          text: scoreName.toUpperCase() + ": " + Game.Store[scoreName],
        })
      } else {
        this.text.add({
          x: startX,
          y: startY += 30,
          px: "20px",
          textAlign: "center",
          text: scoreName.toUpperCase() + ": " + Math.floor(Game.Store[scoreName]/1000)+" seconds",
        })
      }
    }
  }
})