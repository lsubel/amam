function HTMLActuator() {
  this.body                     = document.querySelector("body");
  this.languageSelection        = document.querySelector(".ln-selection");
  this.questionnairesSelection  = document.querySelector(".questionnaires-selection");
  this.modal                    = document.querySelector(".modal-inner");
  this.question                 = document.querySelector(".question");
  this.menuContainer            = document.querySelector(".menu-container");
  this.menuContainerFooter      = document.querySelector(".menu-container-footer");
  this.questionContainer        = document.querySelector(".question-container");
  this.questionContainerFooter  = document.querySelector(".question-container-footer");
  this.buttonStart        = document.querySelector(".button-start");
  this.buttonRandom       = document.querySelector(".button-random");
  this.buttonMenu         = document.querySelector(".button-menu");
  this.buttonDescription  = document.querySelector(".button-description");
  this.buttonReset        = document.querySelector(".button-reset");
  this.modalContent = document.querySelector(".modal-content");
  this.modalRows    = document.querySelectorAll(".modal-content-row");
  this.versionLabel = document.querySelector(".label-version");
}

HTMLActuator.prototype.addLanguageToMenu = function (ln){
  var option = document.createElement("option");
  option.setAttribute("value", ln);
  option.setAttribute("ln-id", "language." + ln);
  this.languageSelection.appendChild(option);
};

HTMLActuator.prototype.addQuestionnaireToMenu = function (questionnaire, label){
  var option = document.createElement("option");
  option.setAttribute("value", questionnaire);
  option.setAttribute("ln-id", label);
  this.questionnairesSelection.appendChild(option);
};

HTMLActuator.prototype.selectQuestionnaire = function(questionnaire){
  var entry_to_mark = document.querySelector("option[value=" + questionnaire + "]");
  this.questionnairesSelection.selectedIndex = entry_to_mark.index;
};

HTMLActuator.prototype.resetSelects = function(){
  this.resetLanguages();
  while (this.questionnairesSelection.firstChild) {
    this.questionnairesSelection.removeChild(this.questionnairesSelection.firstChild);
  }
};

HTMLActuator.prototype.resetLanguages = function(){
  while (this.languageSelection.firstChild) {
    this.languageSelection.removeChild(this.languageSelection.firstChild);
  }
};

HTMLActuator.prototype.selectLanguage = function(ln){
  var entry_to_mark = document.querySelector("option[value=" + ln + "]");
  this.languageSelection.selectedIndex = entry_to_mark.index;
};

HTMLActuator.prototype.setNewQuestion = function(id){
  this.question.setAttribute("ln-id", id);
};

HTMLActuator.prototype.showMenu = function(){
  this.menuContainer.classList.add("show-container");
  this.menuContainerFooter.classList.add("show-container");
};

HTMLActuator.prototype.hideMenu = function(){
  this.menuContainer.classList.remove("show-container");
  this.menuContainerFooter.classList.remove("show-container");
};

HTMLActuator.prototype.showQuestion = function(){
  this.questionContainer.classList.add("show-container");
  this.questionContainerFooter.classList.add("show-container");
};

HTMLActuator.prototype.hideQuestion = function(){
  this.questionContainer.classList.remove("show-container");
  this.questionContainerFooter.classList.remove("show-container");
};

HTMLActuator.prototype.showVersion = function(version){
  this.versionLabel.textContent = "Version " + version;
};

HTMLActuator.prototype.changeBackgroundColor = function(color){
  var lighten_color = LightenDarkenColor(color, 10);
  var more_ligthen_color = LightenDarkenColor(color, 30);
  var self = this;
  window.requestAnimationFrame(function(){
    self.body.style.backgroundColor   = color;
    self.modal.style.backgroundColor  = lighten_color;
    self.languageSelection.style.backgroundColor        = lighten_color;
    self.questionnairesSelection.style.backgroundColor  = lighten_color;
    self.buttonStart.style.backgroundColor              = lighten_color;
    self.buttonRandom.style.backgroundColor             = lighten_color;
    self.buttonMenu.style.backgroundColor               = lighten_color;
    self.buttonDescription.style.backgroundColor        = lighten_color;
    self.buttonReset.style.color                        = lighten_color;
    self.modalContent.style.borderBottomColor  = more_ligthen_color;
    for(var i=0; i<self.modalRows.length; i++){
      self.modalRows[i].style.borderBottomColor  = more_ligthen_color;
    }
  });
};

function LightenDarkenColor(col, amt) {

    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

}
