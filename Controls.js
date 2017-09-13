// Most of this was borrowed from kontra itself just some minor tweaks for tapping
(function() {
  Game.Controls = {};

  var addEventListener = window.addEventListener;
  var pressedKeys = {};
  var pressedCallbacks = {};
  var tappedKeys = {};
  var tappedCallbacks = {};

  // Setup keymap
  var keyMap = {
    // named keys
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    20: 'capslock',
    27: 'esc',
    32: 'space',
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'insert',
    46: 'delete',
    91: 'leftwindow',
    92: 'rightwindow',
    93: 'select',
    144: 'numlock',
    145: 'scrolllock',

    // special characters
    106: '*',
    107: '+',
    109: '-',
    110: '.',
    111: '/',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: '\''
  };

  // Alpha keys
  for (var i = 0; i < 26; i++) {
    keyMap[65+i] = (10 + i).toString(36);
  }
  // Cross browser/os support for keypress
  for (var i = 0; i < 26; i++) {
    keyMap[97+i] = (10 + i).toString(36);
  }
  // Numeric keys and keypad
  // for (i = 0; i < 10; i++) {
  //   keyMap[48+i] = ''+i;
  //   keyMap[96+i] = 'numpad'+i;
  // }
  // f keys
  // for (i = 1; i < 20; i++) {
  //   keyMap[111+i] = 'f'+i;
  // }

  function keyupEventHandler(e) {
    var key = keyMap[e.keyCode];
    pressedKeys[key] = false;
    tappedKeys[key] = false;

    if(pressedCallbacks[key]) {
      pressedCallbacks[key](e);
    }
  }

  function keydownEventHandler(e) {
    var key = keyMap[e.keyCode];
    pressedKeys[key] = true;
  }

  function keypressEventHandler(e) {
    var key = keyMap[e.keyCode];
    tappedKeys[key] = true;

    if(tappedCallbacks[key]) {
      tappedCallbacks[key](e);
    }
  }

  addEventListener('keyup', keyupEventHandler);
  addEventListener('keydown', keydownEventHandler);
  addEventListener('keypress', keypressEventHandler);

  Game.Controls.keys = {
    pressed: function(key) {
      return !!pressedKeys[key];
    },
    tapped: function(key) {
      return !!tappedKeys[key];
    },
    bind: function(key, event, callback) {
      switch(event) {
        case "pressed":
          pressedCallbacks[key] = callback;
          break;
        case "tapped":
          tappedCallbacks[key] = callback;
          break;
      }
    },
    unbind: function(key, event) {
      switch(event) {
        case "pressed":
          pressedCallbacks[key] = null;
          break;
        case "tapped":
          tappedCallbacks[key] = null;
          break;
      }
    }
  };

})()