window.requestAnimationFrame(function () {
  var version = "1.0.2";
  new ApplicationManager(KeyboardInputManager, HTMLActuator, LocalStorageManager, TranslationManager, version);
});
