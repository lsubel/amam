/*
 * Fake storage in case the application is executing in an environment without local storage
 */

window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    this._data[id] = String(val);
    return this._data[id];
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    this._data = {};
    return this._data;
  }
};

function LocalStorageManager(version) {
  var supported     = this.localStorageSupported();
  this.storage      = supported ? window.localStorage : window.fakeStorage;
  // reset the storage either in development mode
  // or the app received a version update
  if(development || this.getVersion() < version){
    this.clear();
    this.setVersion(version);
  }
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

LocalStorageManager.prototype.clear = function(){
  this.storage.clear();
  devlog("Reset local storage");
};

/*
 * General and specific getter and setter
 */

LocalStorageManager.prototype.getItem = function (key) {
  return this.storage.getItem(key);
};

LocalStorageManager.prototype.setItem = function (key, value) {
  this.storage.setItem(key, value);
};

LocalStorageManager.prototype.setSaveColor = function(value) {
  this.setItem("saveColor", value);
};

LocalStorageManager.prototype.isSaveColor = function() {
  return this.storage.getItem("saveColor") == "true";
};

LocalStorageManager.prototype.setLastUsedColor = function(value) {
  this.setItem("lastUsedColor", value);
};

LocalStorageManager.prototype.getLastUsedColor = function() {
  return this.storage.getItem("lastUsedColor");
};

LocalStorageManager.prototype.setLastUsedLanguage = function(value) {
  this.setItem("lastUsedLanguage", value);
};

LocalStorageManager.prototype.getLastUsedLanguage = function() {
  return this.storage.getItem("lastUsedLanguage");
};

LocalStorageManager.prototype.setVersion = function(value) {
  this.setItem("version", value);
};

LocalStorageManager.prototype.getVersion = function() {
  return this.storage.getItem("version") || "";
};

LocalStorageManager.prototype.setLastUsedQuestionnaire = function(value) {
  this.setItem("lastUsedQuestionnaire", value);
};

LocalStorageManager.prototype.getLastUsedQuestionnaire = function() {
  return this.storage.getItem("lastUsedQuestionnaire");
};

LocalStorageManager.prototype.setAuthorshipInformation = function(questionnaire, authorship) {
  this.setItem("authorship_" + questionnaire, authorship);
};

LocalStorageManager.prototype.getAuthorshipInformation = function(questionnaire) {
  return this.storage.getItem("authorship_" + questionnaire);
};
