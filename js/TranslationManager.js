function TranslationManager(inputManager, storageManager) {
  this.storage      = storageManager;
  this.inputManager = inputManager;
  this.storage.clear(); // TODO deactivate later
}

TranslationManager.prototype.setupLanguages = function(firstlen){
  var self = this;
  var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
  request.onreadystatechange = function() {
		if (request.readyState == 4) {
			request.onreadystatechange = undefined;
			var available_languages   = JSON.parse(request.responseText);
      if(firstlen){
        self.initializeLanguage(firstlen);
      }
      for(var i=0; i<available_languages.languages.length;i++){
        if(!firstlen || firstlen != available_languages.languages[i]){
          self.initializeLanguage(available_languages.languages[i]);
        }
      }
		}
	};
  request.overrideMimeType('text/json');
  request.open("GET", "languages.txt", true);
  request.send();
}

TranslationManager.prototype.initializeLanguage = function(language){
  if(this.isLanguageSupported(language)){
    this.inputManager.emit("languageInitialized", language);
    return;
  }

  var self = this;
  var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
  request.onreadystatechange = function() {
		if (request.readyState == 4) {
			request.onreadystatechange = undefined;
      if(!request.responseText || request.responseText == ""){
        throw "Exception: could not read the content of '" + language + ".json'.";
      }
			var language_obj   = JSON.parse(request.responseText);
      if(language !== language_obj.ln){
        throw "IllegalStateException: when reading '" + language + ".json', the content is marked as '" + language_obj.ln + "'.";
      }
      var language_translations = language_obj.translations;
      var language_keys  = Object.keys(language_translations);
      for(var i in language_keys){
        self.setTranslation(language, language_keys[i], language_translations[language_keys[i]]);
      }
      self.setLanguageSupported(language);
      self.inputManager.emit("languageInitialized", language);
		}
	};
  request.overrideMimeType('text/json');
  request.open("GET", "locales/" + language + ".ln", true);
  request.send();
}

TranslationManager.prototype.setLanguageSupported = function(language){
  return this.storage.setItem("languageinitialized_" + language, "supported");
}

TranslationManager.prototype.isLanguageSupported = function(language){
  return this.storage.getItem("languageinitialized_" + language) == "supported";
}

TranslationManager.prototype.getTranslation = function(language, id){
  return this.storage.getItem(language + "_" + id) || ("MISSING TRANSLATION: " + id);
}

TranslationManager.prototype.setTranslation = function(language, id, translation){
  this.storage.setItem(language + "_" + id, translation);
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
