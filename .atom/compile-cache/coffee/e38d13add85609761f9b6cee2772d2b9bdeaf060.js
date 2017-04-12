(function() {
  var path;

  path = require("path");

  module.exports = {
    play: function() {
      var audio, pathtoaudio;
      if ((this.getConfig("audioclip")) === "customAudioclip") {
        pathtoaudio = this.getConfig("customAudioclip");
      } else {
        pathtoaudio = path.join(__dirname, this.getConfig("audioclip"));
      }
      audio = new Audio(pathtoaudio);
      audio.currentTime = 0;
      audio.volume = this.getConfig("volume");
      return audio.play();
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode.playAudio." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsYXktYXVkaW8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLElBQUEsRUFBTSxTQUFBO0FBQ0osVUFBQTtNQUFBLElBQUcsQ0FBQyxJQUFDLENBQUEsU0FBRCxDQUFXLFdBQVgsQ0FBRCxDQUFBLEtBQTRCLGlCQUEvQjtRQUNFLFdBQUEsR0FBYyxJQUFDLENBQUEsU0FBRCxDQUFXLGlCQUFYLEVBRGhCO09BQUEsTUFBQTtRQUdFLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsSUFBQyxDQUFBLFNBQUQsQ0FBVyxXQUFYLENBQXJCLEVBSGhCOztNQUlBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxXQUFOO01BQ1osS0FBSyxDQUFDLFdBQU4sR0FBb0I7TUFDcEIsS0FBSyxDQUFDLE1BQU4sR0FBZSxJQUFDLENBQUEsU0FBRCxDQUFXLFFBQVg7YUFDZixLQUFLLENBQUMsSUFBTixDQUFBO0lBUkksQ0FBTjtJQVVBLFNBQUEsRUFBVyxTQUFDLE1BQUQ7YUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQUEsR0FBaUMsTUFBakQ7SUFEUyxDQVZYOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgXCJwYXRoXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBwbGF5OiAtPlxuICAgIGlmIChAZ2V0Q29uZmlnIFwiYXVkaW9jbGlwXCIpIGlzIFwiY3VzdG9tQXVkaW9jbGlwXCJcbiAgICAgIHBhdGh0b2F1ZGlvID0gQGdldENvbmZpZyBcImN1c3RvbUF1ZGlvY2xpcFwiXG4gICAgZWxzZVxuICAgICAgcGF0aHRvYXVkaW8gPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBAZ2V0Q29uZmlnIFwiYXVkaW9jbGlwXCIpXG4gICAgYXVkaW8gPSBuZXcgQXVkaW8ocGF0aHRvYXVkaW8pXG4gICAgYXVkaW8uY3VycmVudFRpbWUgPSAwXG4gICAgYXVkaW8udm9sdW1lID0gQGdldENvbmZpZyBcInZvbHVtZVwiXG4gICAgYXVkaW8ucGxheSgpXG5cbiAgZ2V0Q29uZmlnOiAoY29uZmlnKSAtPlxuICAgIGF0b20uY29uZmlnLmdldCBcImFjdGl2YXRlLXBvd2VyLW1vZGUucGxheUF1ZGlvLiN7Y29uZmlnfVwiXG4iXX0=
