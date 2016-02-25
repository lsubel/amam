function ApplicationManager(InputManager, Actuator, StorageManager, TranslationManager){
  this.inputManager       = new InputManager;
  this.actuator           = new Actuator;
  this.storageManager     = new StorageManager;
  this.translationManager = new TranslationManager(this.inputManager, this.storageManager);

  this.inputManager.on("languageInitialized", this.addLanguageToMenu.bind(this));
  this.inputManager.on("translateUI", this.translateUI.bind(this));

  this.translationManager.setupLanguages();
  this.translationManager.translate("en");

  this.total_number_of_questions = 36;
}

ApplicationManager.prototype.addLanguageToMenu = function(ln){
  var label = this.translationManager.getTranslation(ln, "language");
  this.actuator.addLanguageToMenu(ln, label);
}

ApplicationManager.prototype.translateUI = function(ln){
  this.translationManager.translate(ln);
}

ApplicationManager.prototype.newQuestion = function(){
  var new_id = "pad.question-" + Math.abs(Math.random() * this.total_number_of_questions);
  this.actuator.setNewQuestion(new_id);
  this.translationManager.translate(ln);
}
