function ApplicationManager(InputManager, Actuator, StorageManager, TranslationManager, version) {
  this.inputManager = new InputManager;
  this.actuator = new Actuator;
  this.storageManager = new StorageManager(version);
  this.translationManager = new TranslationManager(this.inputManager, this.storageManager);

  this.inputManager.on("languageInitialized", this.addLanguageToMenu.bind(this));
  this.inputManager.on("allLanguageInitialized", this.allLanguageInitialized.bind(this));
  this.inputManager.on("setQuestionpackInfos", this.setQuestionpackInfos.bind(this));
  this.inputManager.on("translateUI", this.translateUI.bind(this));
  this.inputManager.on("newQuestion", this.generateNewQuestion.bind(this));
  this.inputManager.on("showMenu", this.showMenu.bind(this));
  this.inputManager.on("showQuestion", this.showQuestion.bind(this));
  this.inputManager.on("newColor", this.newBackgroundColor.bind(this));
  this.inputManager.on("setOption", this.setOption.bind(this));

  this.currentTranslation = undefined;
  this.total_number_of_questions = 0;
  this.current_question_id = 0;
  this.first_available_language = undefined;
  this.available_colors = [
    "#6C7A89", "#95a5a6", "#ABB7B7", "#BDC3C7",
    "#913D88", "#BF55EC", "#9b59b6", "#BE90D4",
    "#22A7F0", "#3498db", "#2980b9", "#3A539B",
    "#2ecc71", "#27ae60", "#1abc9c", "#16a085",
    "#f1c40f", "#f9bf3b", "#F5AB35", "#e9d460",
    "#E74C3C", "#F64747", "#e67e22", "#F2784B"
  ];

  this.translationManager.loadAvailableLanguages();
}

ApplicationManager.prototype.allLanguageInitialized = function(){
  var ln = this.storageManager.getLastUsedLanguage() || this.first_available_language;
  this.initialization(ln);
}

ApplicationManager.prototype.initialization = function(ln){
  this.translateUI(ln);
  this.generateNewQuestion();
  this.showMenu();
  this.actuator.selectLanguage(ln);
  var storedColor;
  if (this.storageManager.isSaveColor())
    storedColor = this.storageManager.getLastUsedColor()
  this.newBackgroundColor(storedColor);
}

ApplicationManager.prototype.addLanguageToMenu = function(ln) {
    // register ln in language selection element
    var label = this.translationManager.getTranslation(ln, "language");
    this.actuator.addLanguageToMenu(ln, label);
    // if it is the first entry, store it as default
    // (used if no saved ln is stored)
    if(!this.first_available_language){
      this.first_available_language = ln;
    }
}

ApplicationManager.prototype.setQuestionpackInfos = function(num) {
  this.total_number_of_questions = num;
}

ApplicationManager.prototype.translateUI = function(ln) {
  this.currentTranslation = ln;
  this.storageManager.setLastUsedLanguage(ln)
  this.translationManager.translate(ln);
}

ApplicationManager.prototype.generateNewQuestion = function() {
  // select new question
  var new_id = this.current_question_id;
  while (new_id == this.current_question_id) {
    new_id = Math.floor(Math.random() * this.total_number_of_questions);
  }
  var new_id_class = "pad.question-" + new_id;
  // show new language in the UI
  this.actuator.setNewQuestion(new_id_class);
  this.translateUI(this.currentTranslation);
}

ApplicationManager.prototype.showMenu = function() {
  this.actuator.showMenu();
  this.actuator.hideQuestion();
}

ApplicationManager.prototype.showQuestion = function() {
  this.actuator.showQuestion();
  this.actuator.hideMenu();
}

ApplicationManager.prototype.newBackgroundColor = function(color) {
  var next_color = color || this.available_colors[Math.floor(Math.random() * this.available_colors.length)];
  this.storageManager.setLastUsedColor(next_color);
  this.actuator.changeBackgroundColor(next_color);
}

ApplicationManager.prototype.setOption = function(data) {
  if (data.type == "saveColor") {
    this.storageManager.setSaveColor(data.value);
  }
}
