function HTMLActuator() {
  this.languageSelection  = document.querySelector(".ln-selection");
  this.question           = document.querySelector(".question");
  this.menuContainer      = document.querySelector(".menu-container");
  this.questionContainer  = document.querySelector(".question-container");
}

HTMLActuator.prototype.addLanguageToMenu = function (ln, label){
  var option = document.createElement("option");
  option.setAttribute("value", ln);
  option.textContent = label;
  this.languageSelection.appendChild(option);
}

HTMLActuator.prototype.setNewQuestion = function(id){
  this.question.setAttribute("ln-id", id);
}

HTMLActuator.prototype.showMenu = function(){
  this.menuContainer.classList.add("show-container");
}

HTMLActuator.prototype.hideMenu = function(){
  this.menuContainer.classList.remove("show-container");
}

HTMLActuator.prototype.showQuestion = function(){
  this.questionContainer.classList.add("show-container");
}

HTMLActuator.prototype.hideQuestion = function(){
this.questionContainer.classList.remove("show-container");
}
