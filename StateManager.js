(function() {
  function StateManager() {
    this.states = {};
    this._currentState = null;
  }

  function isState(obj) {
    if(obj instanceof Game.State) {
      return true;
    }
    return false;
  }

  StateManager.prototype.state = function(name, stateObj) {
    var state;

    if(isState(name)) {
      state = name;
    } else {
      state = new Game.State(name, stateObj);
    }

    this.states[state.name] = state;
  }

  StateManager.prototype.setCurrentState = function(stateName) {
    if(isState(stateName)) {
      this._currentState = stateName
    } else {
      var stateToSet = this.states[stateName];

      if(stateToSet) {
        this._currentState = stateToSet;
      } else {
        throw new Error("State not found.");
      }
    }
  }

  StateManager.prototype.renderCurrentState = function() {
    this._currentState.render();
  }

  StateManager.prototype.updateCurrentState = function() {
    this._currentState.update();
  }

  Game.StateManager = new StateManager();
})();

