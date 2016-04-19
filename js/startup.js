devlog = function(str){
  if(development)
    console.log(str);
};

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
             window.setTimeout(callback, 0);
        };
})();

var startup = function() {
  version = "1.3.4";
  development = false;
  new ApplicationManager(KeyboardInputManager, HTMLActuator, LocalStorageManager, TranslationManager, version);
};

window.requestAnimationFrame(startup);
