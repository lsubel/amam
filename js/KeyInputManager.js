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

KeyboardInputManager.prototype.listen = function(){
  var self = this;
  var languageSelection = document.getElementsByClassName("ln-selection")[0];
  languageSelection.addEventListener("change", function(event){
    var ln = event.target.value;
    self.emit("translateUI", ln)
  });
}
