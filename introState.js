Game.StateManager.state("Intro", {
  init: function() {
    var centerX = kontra.canvas.width/2;
    var centerY = kontra.canvas.height/2;
    var startX = centerX;
    var startY = centerY - 50;
    var fontSize = "20px";
    var textAlign = "center";

    this.text.add({
      x: startX,
      y: startY,
      px: fontSize,
      textAlign: textAlign,
      text: "You were once a space pilot, who was performing a"
    });

    this.text.add({
      x: startX,
      y: startY += 35,
      px: fontSize,
      textAlign: textAlign,
      text: "routine exploration mission near the edge"
    });

    this.text.add({
      x: startX,
      y: startY +=35,
      px: fontSize,
      textAlign: textAlign,
      text: "of the Milky Way when suddenly, you were sucked into a wormhole "
    });

    this.text.add({
      x: startX,
      y: startY +=35,
      px: fontSize,
      textAlign: textAlign,
      text: "and displaced to an unknown location in the universe."
    });

    this.text.add({
      x: startX,
      y: startY +=35,
      px: fontSize,
      textAlign: textAlign,
      text: "This is your story."
    });

    this.text.add({
      x: startX,
      y: (centerY*2)-30,
      px: fontSize,
      textAlign: textAlign,
      text: "Press (enter) to start."
    });
  },
  update: function() {
    if(Game.Controls.keys.tapped("enter")) {
      Game.StateManager.setCurrentState("Space");
    }
  },
  render: function() {
  }
});
