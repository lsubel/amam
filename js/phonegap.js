document.addEventListener("deviceready", function(){
  devlog("Device ready");
  var link = document.querySelector(".href-sourcecode");
  link.addEventListener("click", function(evt){
      devlog("User clicked on source code URL - opening browser");
      evt.preventDefault();
      var ref = cordova.InAppBrowser.open("https://github.com/lsubel/amam", "_system", "location=yes");
  });
});
