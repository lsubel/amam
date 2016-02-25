function HTMLActuator() {
  this.languageSelection = document.querySelector(".ln-selection");
}

HTMLActuator.prototype.addLanguageToMenu = function (ln, label){
  var option = document.createElement("option");
  option.setAttribute("value", ln);
  option.textContent = label;
  this.languageSelection.appendChild(option);
}
