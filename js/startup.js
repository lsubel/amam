window.requestAnimationFrame(function () {
  var version = "1.0.3";
  new ApplicationManager(KeyboardInputManager, HTMLActuator, LocalStorageManager, TranslationManager, version);
});
