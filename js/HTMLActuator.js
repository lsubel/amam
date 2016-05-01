function HTMLActuator() {
  this.body                     = document.querySelector("body");
  this.languageSelection        = document.querySelector(".ln-selection");
  this.questionnairesSelection  = document.querySelector(".questionnaires-selection");
  this.modal                    = document.querySelector(".modal-inner");
  this.question                 = document.querySelector(".question");
  this.questionList             = document.querySelector(".question-list");
  this.menuContainer            = document.querySelector(".menu-container");
  this.menuContainerFooter      = document.querySelector(".menu-container-footer");
  this.randomQuestionContainer        = document.querySelector(".random-question-container");
  this.randomQuestionContainerFooter  = document.querySelector(".random-question-container-footer");
  this.listQuestionContainer          = document.querySelector(".list-question-container");
  this.listQuestionContainerFooter    = document.querySelector(".list-question-container-footer");
  this.buttonStartRandom  = document.querySelector(".button-start-random");
  this.buttonStartList    = document.querySelector(".button-start-list");
  this.buttonRandom       = document.querySelector(".button-random");
  this.buttonMenu         = document.querySelector(".button-random-menu");
  this.buttonDescription  = document.querySelector(".button-description");
  this.buttonReset        = document.querySelector(".button-reset");
  this.modalContent = document.querySelector(".modal-content");
  this.modalRows    = document.querySelectorAll(".modal-content-row");
  this.versionLabel = document.querySelector(".label-version");
  this.authorship   = document.querySelector(".authorship");
}

HTMLActuator.prototype.addLanguageToMenu = function (ln){
  var option = document.createElement("option");
  option.setAttribute("value", ln);
  option.setAttribute("ln-id", "language." + ln);
  option.setAttribute("ui", "");
  this.languageSelection.appendChild(option);
};

HTMLActuator.prototype.addQuestionnaireToMenu = function (questionnaire, label){
  var option = document.createElement("option");
  option.setAttribute("value", questionnaire);
  option.setAttribute("ln-id", label);
  option.setAttribute("ui", "");
  this.questionnairesSelection.appendChild(option);
};

HTMLActuator.prototype.selectQuestionnaire = function(questionnaire){
  var entry_to_mark = document.querySelector("option[value=" + questionnaire + "]");
  this.questionnairesSelection.selectedIndex = entry_to_mark.index;
};

HTMLActuator.prototype.fillQuestionList = function(ln){
  while (this.questionList.firstChild) {
    this.questionList.removeChild(this.questionList.firstChild);
  }
  for(var i=0;i<ln;i++){
    var new_node = document.createElement("h5");
    new_node.setAttribute("ln-id", "pad.question-" + i);
    new_node.setAttribute("class", "question");
    this.questionList.appendChild(new_node);
  }
}

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

HTMLActuator.prototype.showRandomQuestion = function(){
  this.randomQuestionContainer.classList.add("show-container");
  this.randomQuestionContainerFooter.classList.add("show-container");
};

HTMLActuator.prototype.hideRandomQuestion = function(){
  this.randomQuestionContainer.classList.remove("show-container");
  this.randomQuestionContainerFooter.classList.remove("show-container");
};

HTMLActuator.prototype.showListQuestion = function(){
  this.listQuestionContainer.classList.add("show-container");
  this.listQuestionContainerFooter.classList.add("show-container");
};

HTMLActuator.prototype.hideListQuestion = function(){
  this.listQuestionContainer.classList.remove("show-container");
  this.listQuestionContainerFooter.classList.remove("show-container");
};

HTMLActuator.prototype.showVersion = function(version){
  this.versionLabel.textContent = "Version " + version;
};

HTMLActuator.prototype.updateAuthorship = function(authors){
  while (this.authorship.firstChild) {
    this.authorship.removeChild(this.authorship.firstChild);
  }

  if(authors){
    for(var j=0; j<authors.length;j++){
      if(j > 0 && j == (authors.length - 1)){
        var char = document.createElement("span");
        char.innerHTML = " & ";
        this.authorship.appendChild(char);
      } else if(j > 0){
        var char = document.createElement("span");
        char.innerHTML = ", ";
        this.authorship.appendChild(char);
      }
      var author = authors[j];
      var authorlink = document.createElement("a");
      if(author.name){
        authorlink.innerHTML  = author.name;
      }
      else{
        authorlink.innerHTML  = "Anonymous";
      }
      if(author.github){
        authorlink.href       = "https://github.com/" + author.github;
      }
      this.authorship.appendChild(authorlink);
    }
  }
  else{
    var anon = document.createElement("span");
    char.innerHTML = "Anonymous";
    this.authorship.appendChild(char);
  }


  for(var i=0; i<authors.length;i++){
    var author = authors[i];

    this.authorship.appendChild
  }
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
    self.buttonStartRandom.style.backgroundColor        = lighten_color;
    self.buttonStartList.style.backgroundColor        = lighten_color;
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
