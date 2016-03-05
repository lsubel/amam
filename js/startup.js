window.requestAnimationFrame(function () {
  var version = "1.0.4";
  development = false;
  devlog = function(str){
    if(development)
      console.log(str);
  }
  new ApplicationManager(KeyboardInputManager, HTMLActuator, LocalStorageManager, TranslationManager, version);
});
