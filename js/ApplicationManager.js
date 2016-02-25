function ApplicationManager(InputManager, Actuator, StorageManager, TranslationManager){
  this.inputManager       = new InputManager;
  this.actuator           = new Actuator;
  this.storageManager     = new StorageManager;
  this.translationManager = new TranslationManager(this.inputManager, this.storageManager);

  this.inputManager.on("languageInitialized", this.addLanguageToMenu.bind(this));
  this.inputManager.on("translateUI", this.translateUI.bind(this));
  this.inputManager.on("newQuestion", this.generateNewQuestion.bind(this));
  this.inputManager.on("showMenu", this.showMenu.bind(this));
  this.inputManager.on("showQuestion", this.showQuestion.bind(this));

  this.currentTranslation        = undefined;
  this.total_number_of_questions = 36;
  this.current_question_id = 0;

  this.translationManager.setupLanguages();

  this.translateUI("en");

  this.generateNewQuestion();
  this.showMenu();
}

ApplicationManager.prototype.addLanguageToMenu = function(ln){
  var label = this.translationManager.getTranslation(ln, "language");
  this.actuator.addLanguageToMenu(ln, label);
}

ApplicationManager.prototype.translateUI = function(ln){
  this.currentTranslation = ln;
  this.translationManager.translate(ln);
}

ApplicationManager.prototype.generateNewQuestion = function(){
  var new_id = this.current_question_id;
  while(new_id == this.current_question_id){
    new_id = Math.floor(Math.random() * this.total_number_of_questions);
  }
  var new_id_class = "pad.question-" + new_id;
  this.actuator.setNewQuestion(new_id_class);
  this.translateUI(this.currentTranslation);
}

ApplicationManager.prototype.showMenu = function(){
  this.actuator.showMenu();
  this.actuator.hideQuestion();
}

ApplicationManager.prototype.showQuestion = function(){
  this.actuator.showQuestion();
  this.actuator.hideMenu();
}
