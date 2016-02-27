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

  this.currentTranslation         = undefined;
  this.total_number_of_questions  = 36;
  this.current_question_id        = 0;
  this.initialized                = false;
  this.available_colors           = [
    "#6C7A89", "#95a5a6", "#ABB7B7", "#BDC3C7",
    "#913D88", "#BF55EC", "#9b59b6", "#BE90D4",
    "#22A7F0", "#3498db", "#2980b9", "#3A539B",
    "#00B16A", "#27ae60", "#1abc9c", "#16a085",
    "#f1c40f", "#f9bf3b", "#F5AB35", "#e9d460",
    "#E74C3C", "#F64747", "#e67e22", "#F2784B"
  ];

  this.translationManager.setupLanguages();
}

ApplicationManager.prototype.addLanguageToMenu = function(ln){
  var label = this.translationManager.getTranslation(ln, "language");
  this.actuator.addLanguageToMenu(ln, label);
  if(!this.initialized){
    this.translateUI(ln);
    this.generateNewQuestion();
    this.showMenu();
    this.newBackgroundColor();
    this.initialized = true;
  }
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

ApplicationManager.prototype.newBackgroundColor = function(){
  var next_color = this.available_colors[Math.floor(Math.random() * this.available_colors.length)];
  this.actuator.changeBackgroundColor(next_color);
}
