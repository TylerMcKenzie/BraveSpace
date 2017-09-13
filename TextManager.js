(function() {
  function TextManager() {
    this.text = [];
  }

  function isText(obj) {
    if(obj instanceof Game.Text) {
      return true;
    }

    return false;
  }

  TextManager.prototype.constructor = TextManager;

  TextManager.prototype.add = function(text) {
    if(isText(text)) {
      this.text.push(text);
    } else if(typeof text === "object") {
      var newText = new Game.Text(text);

      this.text.push(newText);
    } else {
      throw new Error("TextManager requires a Game.TextBox object or object to add.");
    }
  }

  TextManager.prototype.updateTexts = function() {
    for(var i = 0; i < this.text.length; i++) {
      if(this.text[i].isVisible) {
        this.text[i].update();
      }
    }
  }

  TextManager.prototype.renderTexts = function(xView, yView) {
    for(var i = 0; i < this.text.length; i++) {
      if(this.text[i].isVisible) {
        if(this.text[i].isFixed) {
          this.text[i].render();
        } else {
          this.text[i].render(xView, yView);
        }
      }
    }
  };

  Game.TextManager = TextManager;
})();
