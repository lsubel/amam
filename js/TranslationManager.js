function TranslationManager(inputManager, storageManager) {
  this.storage      = storageManager;
  this.inputManager = inputManager;

  this.number_of_languages = 0;
}

// load local json file and hand over the result to function fn
TranslationManager.prototype.loadLocalContent = function(filename, fn){
  var self = this;
  var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
  request.onreadystatechange = function(){
    if (this.readyState == 4) {
      this.onreadystatechange = undefined;
      devdebug("Local content file '" + filename + "' was found.");
      fn.apply(this, [this]);
    }
  };
  request.overrideMimeType('text/json');
  request.open("GET", filename, true);
  request.send();
  devdebug("Loading local content file '" + filename + "'.");
}

/*
 * Load all questionnaires available
 */

TranslationManager.prototype.loadAvailableQuestionnaires = function(){
  var self = this;
  this.loadLocalContent("questionnaire.txt", function(xhr) {
    var json_parsed               = JSON.parse(xhr.responseText);
		var available_questionnaires  = json_parsed.questionnaires;
    var number_of_questionnaires  = available_questionnaires.length;
    // initialize the available languages
    for(var i=0; i < number_of_questionnaires; i++){
      self.initializeQuestionnaires(available_questionnaires[i]);
    }
    self.inputManager.emit("startedAllQuestionnairesInitializion");
	});
};

TranslationManager.prototype.initializeQuestionnaires = function(questionnaire){
  this.loadAvailableLanguages(questionnaire);
  this.inputManager.emit("startedQuestionnaireInitializion", questionnaire);
};

TranslationManager.prototype.getQuestionnaireKey = function(questionnaire){
    return "questionnaire-" + questionnaire;
}

/*
 * Initialize a single translation set
 */

TranslationManager.prototype.loadAvailableUILanguages = function(){
  var self = this;
  this.loadLocalContent("locales" + "/" + "ui" + "/" + "languages.txt", function(xhr){
    var json_parsed           = JSON.parse(xhr.responseText);
    var available_languages   = json_parsed.languages;
    var numberofquestions     = json_parsed.numberofquestions;
    var number_of_languages   = available_languages.length;
    self.addAvailableLanguageCounter(number_of_languages);
    // hand over question package related information to the ApplicationManager
    self.inputManager.emit("setQuestionnaireInfos");
    // initialize the available languages
    for(var i=0; i < number_of_languages; i++){
      self.initializeLanguage("ui", available_languages[i]);
    }
  });
};

TranslationManager.prototype.loadAvailableLanguages = function(questionnaire){
  var self = this;
  this.loadLocalContent("locales" + "/" + questionnaire + "/" + "languages.txt", function(xhr){
    var json_parsed           = JSON.parse(xhr.responseText);
    var available_languages   = json_parsed.languages;
    var numberofquestions     = json_parsed.numberofquestions;
    var number_of_languages   = available_languages.length;
    var default_title         = json_parsed.defaulttitle;
    var authorship            = json_parsed.authorship;
    self.addAvailableLanguageCounter(number_of_languages);
    // hand over question package related information to the ApplicationManager
    self.inputManager.emit("setQuestionnaireInfos", {
      "available_languages": available_languages,
      "number_of_questions": numberofquestions,
      "questionnaire": questionnaire,
    });
    // initialize the available languages
    for(var i=0; i < number_of_languages; i++){
      self.initializeLanguage(questionnaire, available_languages[i]);
    }
    // save the authorship information in all available languages
    self.storage.setAuthorshipInformation(questionnaire, JSON.stringify(authorship));
    // save the default title
    self.setTranslation("default", null, self.getQuestionnaireKey(questionnaire), "(No translation) " + default_title);
  });
};

TranslationManager.prototype.addAvailableLanguageCounter = function(value){
  this.number_of_languages = this.number_of_languages + value;
};

TranslationManager.prototype.decreaseAvailableLanguageCounter = function(){
  this.number_of_languages = this.number_of_languages - 1;
  if(this.number_of_languages === 0){
    this.inputManager.emit("allLanguageInitialized");
  }
};

TranslationManager.prototype.initializeLanguage = function(questionnaire, language){
  // if the language is already initialized, abort
  if(this.isLanguageSupported(language)){
    this.inputManager.emit("languageInitialized", language);
    this.decreaseAvailableLanguageCounter();
    return;
  }
  // load the language
  var self = this;
  this.loadLocalContent("locales" + "/" + questionnaire + "/" + language + ".ln", function(xhr){
    devlog("New language file was received: " + xhr.responseURL);
    // check whether data were loaded
    if(!xhr.responseText || xhr.responseText === ""){
      throw "Exception: could not read the content of '" + language + ".json'.";
    }
    // check whether the language matches the requested one
    var language_obj   = JSON.parse(xhr.responseText);
    if(language !== language_obj.ln){
      throw "IllegalStateException: when reading '" + language + ".ln', the content is marked as '" + language_obj.ln + "'.";
    }
    var questionnaire_key = self.getQuestionnaireKey(questionnaire);
    self.setTranslation("ui", language, questionnaire_key, language_obj[questionnaire_key]);
    // write the translations to the local storage
    var language_translations = language_obj.translations;
    var language_keys  = Object.keys(language_translations);
    for(var i in language_keys){
      self.setTranslation(questionnaire, language, language_keys[i], language_translations[language_keys[i]]);
    }
    self.setLanguageSupported(language);
    self.inputManager.emit("languageInitialized", language);
    self.decreaseAvailableLanguageCounter();
  });
};

/*
 * Getter and setter for translations
 */

TranslationManager.prototype.setTranslation = function(questionnaire, language, id, translation){
  var key = "";
  if(questionnaire){
    key += questionnaire + "_";
  }
  if(language){
    key += language + "_";
  }
  key += id;
  this.storage.setItem(key , translation);
};

TranslationManager.prototype.getTranslation = function(questionnaire, language, id){
  if(questionnaire && language && id){
    var res = this.storage.getItem(questionnaire + "_" + language + "_" + id);
    if(!res){
      res = this.storage.getItem("default" + "_" + id);
    }
    return res;
  }
  else{
    return ("MISSING TRANSLATION: " + questionnaire + ", " + language + ", " + id);
  }
};

TranslationManager.prototype.setLanguageSupported = function(language){
  this.storage.setItem("languageinitialized_" + language, "supported");
};

TranslationManager.prototype.isLanguageSupported = function(language){
  return this.storage.getItem("languageinitialized_" + language) == "supported";
};

/*
 * Translation methods to be invoked by inside and other modules
 */

TranslationManager.prototype.translate = function(questionnaire, ln, element){
  element = element || document.documentElement;
  var children = this.getTranslatableChildren(element);
  for(var i=0, n=children.length; i < n; i++){
    this.translateNode(questionnaire, ln, children[i]);
  }
  this.translateNode(questionnaire, ln, element);
  document.querySelector("html").lang = ln;
  this.inputManager.emit("translated", ln);
};

TranslationManager.prototype.getTranslatableChildren = function(element) {
  if(document.querySelectorAll) {
    return element.querySelectorAll('*[ln-id]');
  }
  else{
    if (!element)
      return [];
    var nodes = element.getElementsByTagName('*');
    var l10nElements = [];
    for (var i=0, n=nodes.length; i < n; i++) {
      if (nodes[i].getAttribute('ln-id'))
        l10nElements.push(nodes[i]);
    }
    return l10nElements;
  }
};

TranslationManager.prototype.translateNode = function(questionnaire, ln, element){
  var translation_id = element.getAttribute("ln-id");
  if(!translation_id)
    return;
  if(element.hasAttribute("ui"))
    questionnaire = "ui";
  var translated_str = this.getTranslation(questionnaire, ln, translation_id);
  element.textContent = translated_str;
};
