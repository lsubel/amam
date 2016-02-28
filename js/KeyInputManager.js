function KeyboardInputManager() {
  this.events = {};

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);
  button.addEventListener("click", fn.bind(this));
  button.addEventListener(this.eventTouchend, fn.bind(this));
};

KeyboardInputManager.prototype.listen = function(){
  var languageSelection = document.getElementsByClassName("ln-selection")[0];
  languageSelection.addEventListener("change", this.selectTranslation.bind(this));
  var colorSaveOption = document.getElementById("cbsavecolor");
  colorSaveOption.addEventListener("change", this.setOption.bind(this));

  this.bindButtonPress(".button-random", this.newQuestion);
  this.bindButtonPress(".button-menu", this.showMenu);
  this.bindButtonPress(".button-start", this.showQuestion);
  this.bindButtonPress(".button-newcolor", this.newColor);
};

KeyboardInputManager.prototype.selectTranslation = function(event){
  var ln = event.target.value;
  this.emit("translateUI", ln)
}

KeyboardInputManager.prototype.newQuestion = function(event){
  event.preventDefault();
  this.emit("newQuestion");
};

KeyboardInputManager.prototype.showMenu = function(event){
  event.preventDefault();
  this.emit("showMenu");
};

KeyboardInputManager.prototype.showQuestion = function(event){
  event.preventDefault();
  this.emit("showQuestion");
};

KeyboardInputManager.prototype.newColor = function(event){
  event.preventDefault();
  this.emit("newColor");
}

KeyboardInputManager.prototype.setOption = function(event){
  var data = {};
  data.type   = "saveColor";
  data.value  = event.target.checked;
  event.preventDefault();
  this.emit("setOption", data);
}
