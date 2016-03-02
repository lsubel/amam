window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager(inputManager) {
  var supported = this.localStorageSupported();
  this.storage      = supported ? window.localStorage : window.fakeStorage;
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
  this.storage.clear;
}

// Best score getters/setters
LocalStorageManager.prototype.getItem = function (key) {
  return this.storage.getItem(key);
};

LocalStorageManager.prototype.setItem = function (key, value) {
  this.storage.setItem(key, value);
};

LocalStorageManager.prototype.setSaveColor = function(value) {
  this.setItem("saveColor", value);
}

LocalStorageManager.prototype.isSaveColor = function() {
  return this.storage.getItem("saveColor") == "true";
}

LocalStorageManager.prototype.setLastUsedColor = function(value) {
  this.setItem("lastUsedColor", value);
}

LocalStorageManager.prototype.getLastUsedColor = function() {
  return this.storage.getItem("lastUsedColor");
}

LocalStorageManager.prototype.setLastUsedLanguage = function(value) {
  this.setItem("lastUsedLanguage", value);
}

LocalStorageManager.prototype.getLastUsedLanguage = function() {
  return this.storage.getItem("lastUsedLanguage");
}
