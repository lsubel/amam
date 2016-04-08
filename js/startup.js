window.requestAnimationFrame(function () {
  version = "1.3.1";
  development = false;
  devlog = function(str){
    if(development)
      console.log(str);
  };
  new ApplicationManager(KeyboardInputManager, HTMLActuator, LocalStorageManager, TranslationManager, version);
});
