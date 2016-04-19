devlog = function(str){
  if(development)
    console.log(str);
};

var startup = function() {
  version = "1.3.4";
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
