devlog = function(str){
  if(console && console.log)
    console.log(str);
};

devdebug = function(str){
  if(console && console.debug)
    console.debug(str);
};

var startup = function() {
  version = "1.5.0";
  development = false;
  new ApplicationManager(KeyboardInputManager, HTMLActuator, LocalStorageManager, TranslationManager, version);
};

window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
             window.setTimeout(callback, 0);
        };
})();

window.requestAnimationFrame(startup);
