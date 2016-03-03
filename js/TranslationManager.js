function TranslationManager(inputManager, storageManager) {
  this.storage      = storageManager;
  this.inputManager = inputManager;

  this.number_of_languages = 0;
}

TranslationManager.prototype.loadAvailableQuestionnaires = function(){
  var self = this;
  var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
  request.onreadystatechange = function() {
		if (request.readyState == 4) {
			request.onreadystatechange = undefined;
      var json_parsed               = JSON.parse(request.responseText);
			var available_questionnaires  = json_parsed.questionnaires;
      var number_of_questionnaires  = available_questionnaires.length;
      // initialize the available languages
      for(var i=0; i < number_of_questionnaires; i++){
        self.initializeQuestionnaires(available_questionnaires[i]);
      }
      self.inputManager.emit("allQuestionnairesInitialized");
		}
	};
  request.overrideMimeType('text/json');
  request.open("GET", "questionnaire.txt", true);
  request.send();
}

TranslationManager.prototype.initializeQuestionnaires = function(questionnaire){
  this.loadAvailableLanguages(questionnaire);
  this.inputManager.emit("questionnaireInitialized", questionnaire);
}

TranslationManager.prototype.loadAvailableUILanguages = function(){
  var self = this;
  var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
  request.onreadystatechange = function() {
		if (request.readyState == 4) {
			request.onreadystatechange = undefined;
      var json_parsed           = JSON.parse(request.responseText);
			var available_languages   = json_parsed.languages;
      var numberofquestions     = json_parsed.numberofquestions;
      var number_of_languages   = available_languages.length;
      self.addAvailableLanguageCounter(number_of_languages);
      // hand over question package related information to the ApplicationManager
      self.inputManager.emit("setQuestionpackInfos", numberofquestions);
      // initialize the available languages
      for(var i=0; i < number_of_languages; i++){
        self.initializeLanguage("ui", available_languages[i]);
      }
		}
	};
  request.overrideMimeType('text/json');
  request.open("GET", "locales" + "/" + "ui" + "/" + "languages.txt", true);
  request.send();
}

TranslationManager.prototype.loadAvailableLanguages = function(catalogue){
  var self = this;
  var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
  request.onreadystatechange = function() {
		if (request.readyState == 4) {
			request.onreadystatechange = undefined;
      var json_parsed           = JSON.parse(request.responseText);
			var available_languages   = json_parsed.languages;
      var numberofquestions     = json_parsed.numberofquestions;
      var number_of_languages   = available_languages.length;
      self.addAvailableLanguageCounter(number_of_languages);
      // hand over question package related information to the ApplicationManager
      self.inputManager.emit("setQuestionpackInfos", numberofquestions);
      // initialize the available languages
      for(var i=0; i < number_of_languages; i++){
        self.initializeLanguage(catalogue, available_languages[i]);
      }
		}
	};
  request.overrideMimeType('text/json');
  request.open("GET", "locales" + "/" + catalogue + "/" + "languages.txt", true);
  request.send();
}

TranslationManager.prototype.addAvailableLanguageCounter = function(value){
  this.number_of_languages = this.number_of_languages + value;
}

TranslationManager.prototype.decreaseAvailableLanguageCounter = function(){
  this.number_of_languages = this.number_of_languages - 1;
  if(this.number_of_languages == 0){
    this.inputManager.emit("allLanguageInitialized");
  }
}

TranslationManager.prototype.initializeLanguage = function(catalogue, language){
  // if the language is already initialized, abort
  if(this.isLanguageSupported(language)){
    this.inputManager.emit("languageInitialized", language);
    this.decreaseAvailableLanguageCounter();
    return;
  }
  // load the language
  var self = this;
  var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
  request.onreadystatechange = function() {
		if (request.readyState == 4) {
			request.onreadystatechange = undefined;
      // check whether data were loaded
      if(!request.responseText || request.responseText == ""){
        throw "Exception: could not read the content of '" + language + ".json'.";
      }
      // check whether the language matches the requested one
			var language_obj   = JSON.parse(request.responseText);
      if(language !== language_obj.ln){
        throw "IllegalStateException: when reading '" + language + ".json', the content is marked as '" + language_obj.ln + "'.";
      }
      var questionnaire_key = "questionnaire-" + catalogue;
      self.setTranslation(language, questionnaire_key, language_obj[questionnaire_key]);
      // write the translations to the local storage
      var language_translations = language_obj.translations;
      var language_keys  = Object.keys(language_translations);
      for(var i in language_keys){
        self.setTranslation(language, language_keys[i], language_translations[language_keys[i]]);
      }
      self.setLanguageSupported(language);
      self.inputManager.emit("languageInitialized", language);
      self.decreaseAvailableLanguageCounter();
		}
	};
  request.overrideMimeType('text/json');
  request.open("GET", "locales" + "/" + catalogue + "/" + language + ".ln", true);
  request.send();
}

TranslationManager.prototype.setLanguageSupported = function(language){
  this.storage.setItem("languageinitialized_" + language, "supported");
}

TranslationManager.prototype.isLanguageSupported = function(language){
  return this.storage.getItem("languageinitialized_" + language) == "supported";
}

TranslationManager.prototype.setTranslation = function(language, id, translation){
  this.storage.setItem(language + "_" + id, translation);
}

TranslationManager.prototype.getTranslation = function(language, id){
  return this.storage.getItem(language + "_" + id) || ("MISSING TRANSLATION: " + id);
}

TranslationManager.prototype.translate = function(ln, element){
  element = element || document.documentElement;
  var children = this.getTranslatableChildren(element);
  for(var i=0, n=children.length; i < n; i++) {
    this.translateNode(ln, children[i])
  }
  this.translateNode(ln, element)
  document.querySelector("html").lang = ln;
  this.inputManager.emit("translated", ln);
}

TranslationManager.prototype.getTranslatableChildren = function(element) {
  if(!document.querySelectorAll) {
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
  return element.querySelectorAll('*[ln-id]')
};

TranslationManager.prototype.translateNode = function(ln, element){
  var translation_id = element.getAttribute("ln-id");
  if(!translation_id)
    return;
  var translated_str = this.getTranslation(ln, translation_id);
  element.textContent = translated_str;
}
