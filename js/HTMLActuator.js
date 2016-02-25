function HTMLActuator() {
  this.languageSelection  = document.querySelector(".ln-selection");
  this.question           = document.querySelector(".question");
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
