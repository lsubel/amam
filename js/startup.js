devlog = function(str){
  if(development)
    console.log(str);
};

var startup = function() {
  version = "1.3.4";
  development = false;
  new ApplicationManager(KeyboardInputManager, HTMLActuator, LocalStorageManager, TranslationManager, version);
};

if(window.requestAnimationFrame){
    window.requestAnimationFrame(startup);
}
else{
  window.setTimeout(0, startup);
}
