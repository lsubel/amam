window.requestAnimationFrame(function () {
  version = "1.2.2";
  development = false;
  devlog = function(str){
    if(development)
      console.log(str);
  };
  new ApplicationManager(KeyboardInputManager, HTMLActuator, LocalStorageManager, TranslationManager, version);
});
