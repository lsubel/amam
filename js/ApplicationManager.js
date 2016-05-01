function ApplicationManager(InputManager, Actuator, StorageManager, TranslationManager) {
  // initialize components
  this.inputManager = new InputManager();
  this.actuator = new Actuator();
  this.storageManager = new StorageManager(version);
  this.translationManager = new TranslationManager(this.inputManager, this.storageManager);

  // register event handlers
  this.inputManager.on("selectQuestionnaire",                   this.selectQuestionnaire.bind(this));
  this.inputManager.on("startedQuestionnaireInitializion",      this.addQuestionnaireToMenu.bind(this));
  this.inputManager.on("startedAllQuestionnairesInitializion",  this.allQuestionnairesInitialized.bind(this));
  this.inputManager.on("languageInitialized",           this.addLanguageToMenu.bind(this));
  this.inputManager.on("allLanguageInitialized",        this.allLanguageInitialized.bind(this));
  this.inputManager.on("setQuestionnaireInfos",         this.selectQuestionnaireInfos.bind(this));
  this.inputManager.on("translateUI",                   this.translateUI.bind(this));
  this.inputManager.on("newQuestion",                   this.generateNewQuestion.bind(this));
  this.inputManager.on("newColor",                      this.newBackgroundColor.bind(this));
  this.inputManager.on("setOption",                     this.setOption.bind(this));

  this.inputManager.on("resetApplicationManager",       this.resetApplicationManager.bind(this));

  this.initializeApplicationManager();

  window.addEventListener("hashchange", this.listen.bind(this));
}

/*
 * Initialization
 */

ApplicationManager.prototype.initializeApplicationManager = function(){
  // initialize variables
  this.addedLanguages             = [];
  this.addedQuestionnaire         = [];
  this.total_number_of_questions  = {};
  this.available_languages        = {};
  this.current_question_id        = 0;
  this.currentTranslation         = undefined;
  this.first_available_language   = undefined;
  this.available_colors           = [
    "#6C7A89", "#95a5a6", "#ABB7B7", "#BDC3C7",
    "#D2527F", "#BF55EC", "#9b59b6", "#BE90D4",
    "#22A7F0", "#3498db", "#2980b9", "#3A539B",
    "#2ecc71", "#27ae60", "#1abc9c", "#16a085",
    "#f1c40f", "#f9bf3b", "#F5AB35", "#e9d460",
    "#E74C3C", "#F64747", "#e67e22", "#F2784B"
  ];

  // bootstrap
  this.first_available_questionnaire = "proust";
  this.translationManager.loadAvailableQuestionnaires();
  this.actuator.showVersion(version);
  this.extractBrowserLanguage();
};

ApplicationManager.prototype.resetApplicationManager = function(){
  this.storageManager.clear();
  this.actuator.resetSelects();
  this.initializeApplicationManager();
};

/*
 * Questionnaire related event handlers
 */

ApplicationManager.prototype.selectQuestionnaire = function(questionnaire){
  this.currentQuestionnaire = questionnaire;
  var last_used_questionnaire = this.storageManager.getLastUsedQuestionnaire();
  this.storageManager.setLastUsedQuestionnaire(questionnaire);
  this.actuator.resetLanguages();
  // add languages available for the selected questionnaire
  var lns = this.available_languages[questionnaire];
  this.addedLanguages = [];
  for(var i=0;i<lns.length;i++){
    var ln = lns[i];
    this.addLanguageToMenu(ln);
  }
  // in case the questionnaire changed, update the authorship, list and UI
  if(questionnaire != last_used_questionnaire){
    var authors = JSON.parse(this.storageManager.getAuthorshipInformation(questionnaire));
    var ln = lns.indexOf(this.currentTranslation) >= 0 ? this.currentTranslation : lns[0];
    this.actuator.updateAuthorship(authors);
    this.actuator.fillQuestionList(this.total_number_of_questions[questionnaire]);
    this.actuator.selectLanguage(ln);
    this.translateUI(ln);
  }
  // select a new question
  this.generateNewQuestion();
};

ApplicationManager.prototype.addQuestionnaireToMenu = function(questionnaire) {
    if(this.addedQuestionnaire.indexOf(questionnaire) == -1){
      this.actuator.addQuestionnaireToMenu(questionnaire, "questionnaire-" + questionnaire);
      this.addedQuestionnaire.push(questionnaire);
    }
    if(!this.first_available_questionnaire){
      this.first_available_questionnaire = questionnaire;
    }
};

ApplicationManager.prototype.allQuestionnairesInitialized = function(){
  this.currentQuestionnaire = this.storageManager.getLastUsedQuestionnaire() || this.first_available_questionnaire;
  this.translationManager.loadAvailableUILanguages();
};

/*
 * Language related methods and event handlers
 */

ApplicationManager.prototype.extractBrowserLanguage = function(){
  var res = [];
  // method one: check whether navigator languages is available
  if(navigator && navigator.languages){
    var languages = navigator.languages;
    for(var i=0;i<languages.length;i++){
      var ln = languages[i];
      if(ln.indexOf("-") >= 0){
        ln = ln.substr(0, ln.indexOf("-"));
      }
      if(res.indexOf(ln) == -1){
        res.push(ln);
      }
    }
  }
  // method two: parse the userAgent by RegEx
  else if(navigator && navigator.userAgent){
    var subln = navigator.userAgent.match(/[a-z]{2}-[a-z]{2}/);
    var ln2 = subln[0].substr(-2, 2);
    res.push(ln2);
  }
  this.browser_languages = res;
};

ApplicationManager.prototype.allLanguageInitialized = function(){
  var ln = this.storageManager.getLastUsedLanguage();
  if(!ln){
    for(var i=0;i < this.browser_languages.length; i++){
      var tmp_ln = this.browser_languages[i];
      if(this.translationManager.isLanguageSupported(tmp_ln)){
        ln = tmp_ln;
        break;
      }
    }
  }
  if(!ln){
    ln = this.first_available_language;
  }
  var questionnaire = this.storageManager.getLastUsedQuestionnaire() || this.first_available_questionnaire;
  this.bootstrapUI(questionnaire, ln);
};

ApplicationManager.prototype.bootstrapUI = function(questionnaire, ln){
  this.actuator.fillQuestionList(this.total_number_of_questions[questionnaire]);
  var authors = JSON.parse(this.storageManager.getAuthorshipInformation(questionnaire));
  this.actuator.updateAuthorship(authors);
  this.translateUI(ln);
  this.generateNewQuestion();
  this.listen();
  this.actuator.selectQuestionnaire(questionnaire);
  this.actuator.selectLanguage(ln);
  var storedColor;
  if (this.storageManager.isSaveColor()){
    storedColor = this.storageManager.getLastUsedColor();
  }
  this.newBackgroundColor(storedColor);
};

ApplicationManager.prototype.addLanguageToMenu = function(ln) {
    if(this.addedLanguages.indexOf(ln) == -1){
      // register ln in language selection element
      this.actuator.addLanguageToMenu(ln);
      this.addedLanguages.push(ln);
    }
    // if it is the first entry, store it as default
    // (used if no saved ln is stored)
    if(!this.first_available_language){
      this.first_available_language = ln;
    }
};

ApplicationManager.prototype.selectQuestionnaireInfos = function(data) {
  if(data){
    var available_languages = data.available_languages;
    var questionnaire       = data.questionnaire;
    var num_of_question     = data.number_of_questions;
    if(data.number_of_questions){
      this.total_number_of_questions[questionnaire] = num_of_question;
      this.available_languages[questionnaire]       = available_languages;
    }
  }
};

ApplicationManager.prototype.generateNewQuestion = function() {
  var questionnaire = this.currentQuestionnaire;
  // select new question
  var new_id = this.current_question_id || 0;
  while (new_id == this.current_question_id) {
    new_id = Math.floor(Math.random() * this.total_number_of_questions[questionnaire]);
  }
  this.current_question_id = new_id;
  var new_id_class = "pad.question-" + new_id;
  // show new language in the UI
  devlog("Showing question with id '" + new_id + "'")
  this.actuator.setNewQuestion(new_id_class);
  this.translateUI(this.currentTranslation);
};

/*
 * UI related event handlers
 */

 ApplicationManager.prototype.listen = function() {
    switch(location.hash){
    case "#random":
      this.showRandomQuestion();
      break;
    case "#list":
      this.showListQuestion();
      break;
    case "#!":
    case "":
      this.showMenu();
      break;
    case "#popup-description":
      break;
    default:
      console.log("UnknownHashException: " + location.hash);
    }
  };

 ApplicationManager.prototype.translateUI = function(ln) {
   var questionnaire = this.currentQuestionnaire;
   this.currentTranslation = ln;
   this.storageManager.setLastUsedLanguage(ln);
   this.translationManager.translate(questionnaire, ln);
 };

ApplicationManager.prototype.showMenu = function() {
  this.actuator.showMenu();
  this.actuator.hideListQuestion();
  this.actuator.hideRandomQuestion();
};

ApplicationManager.prototype.showRandomQuestion = function() {
  this.actuator.showRandomQuestion();
  this.actuator.hideListQuestion();
  this.actuator.hideMenu();
};

ApplicationManager.prototype.showListQuestion = function() {
  this.actuator.hideRandomQuestion();
  this.actuator.showListQuestion();
  this.actuator.hideMenu();
};


ApplicationManager.prototype.newBackgroundColor = function(color) {
  var next_color = color || this.available_colors[Math.floor(Math.random() * this.available_colors.length)];
  this.storageManager.setLastUsedColor(next_color);
  this.actuator.changeBackgroundColor(next_color);
};

ApplicationManager.prototype.setOption = function(data) {
  if (data.type == "saveColor") {
    this.storageManager.setSaveColor(data.value);
  }
};
