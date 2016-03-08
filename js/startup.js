window.requestAnimationFrame(function () {
  version = "1.2.0";
  development = true;
  devlog = function(str){
    if(development)
      console.log(str);
  }
  new ApplicationManager(KeyboardInputManager, HTMLActuator, LocalStorageManager, TranslationManager, version);
});
