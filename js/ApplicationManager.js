function ApplicationManager(InputManager, Actuator, StorageManager, TranslationManager){
  this.inputManager       = new InputManager;
  this.actuator           = new Actuator;
  this.storageManager     = new StorageManager;
  this.translationManager = new TranslationManager(this.inputManager, this.storageManager);

  this.inputManager.on("languageInitialized", this.addLanguageToMenu.bind(this));
  this.inputManager.on("translateUI", this.translateUI.bind(this));
  this.inputManager.on("newQuestion", this.newQuestion.bind(this));

  this.currentTranslation        = undefined;
  this.total_number_of_questions = 36;

  this.translationManager.setupLanguages();
  
  this.translateUI("en");
}

ApplicationManager.prototype.addLanguageToMenu = function(ln){
  var label = this.translationManager.getTranslation(ln, "language");
  this.actuator.addLanguageToMenu(ln, label);
}

ApplicationManager.prototype.translateUI = function(ln){
  this.currentTranslation = ln;
  this.translationManager.translate(ln);
}

ApplicationManager.prototype.newQuestion = function(){
  var new_id = "pad.question-" + Math.round(Math.random() * this.total_number_of_questions);
  this.actuator.setNewQuestion(new_id);
  this.translateUI(this.currentTranslation);
}
