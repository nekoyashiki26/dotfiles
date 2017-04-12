(function() {
  var random;

  random = require("lodash.random");

  module.exports = {
    shake: function(editorElement) {
      var max, min, x, y;
      min = this.getConfig("minIntensity");
      max = this.getConfig("maxIntensity");
      x = this.shakeIntensity(min, max);
      y = this.shakeIntensity(min, max);
      editorElement.style.top = y + "px";
      editorElement.style.left = x + "px";
      return setTimeout(function() {
        editorElement.style.top = "";
        return editorElement.style.left = "";
      }, 75);
    },
    shakeIntensity: function(min, max) {
      var direction;
      direction = Math.random() > 0.5 ? -1 : 1;
      return random(min, max, true) * direction;
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode.screenShake." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3NjcmVlbi1zaGFrZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsS0FBQSxFQUFPLFNBQUMsYUFBRDtBQUNMLFVBQUE7TUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLFNBQUQsQ0FBVyxjQUFYO01BQ04sR0FBQSxHQUFNLElBQUMsQ0FBQSxTQUFELENBQVcsY0FBWDtNQUVOLENBQUEsR0FBSSxJQUFDLENBQUEsY0FBRCxDQUFnQixHQUFoQixFQUFxQixHQUFyQjtNQUNKLENBQUEsR0FBSSxJQUFDLENBQUEsY0FBRCxDQUFnQixHQUFoQixFQUFxQixHQUFyQjtNQUVKLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBcEIsR0FBNkIsQ0FBRCxHQUFHO01BQy9CLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBcEIsR0FBOEIsQ0FBRCxHQUFHO2FBRWhDLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFwQixHQUEwQjtlQUMxQixhQUFhLENBQUMsS0FBSyxDQUFDLElBQXBCLEdBQTJCO01BRmxCLENBQVgsRUFHRSxFQUhGO0lBVkssQ0FBUDtJQWVBLGNBQUEsRUFBZ0IsU0FBQyxHQUFELEVBQU0sR0FBTjtBQUNkLFVBQUE7TUFBQSxTQUFBLEdBQWUsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLEdBQW5CLEdBQTRCLENBQUMsQ0FBN0IsR0FBb0M7YUFDaEQsTUFBQSxDQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLElBQWpCLENBQUEsR0FBeUI7SUFGWCxDQWZoQjtJQW1CQSxTQUFBLEVBQVcsU0FBQyxNQUFEO2FBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFBLEdBQW1DLE1BQW5EO0lBRFMsQ0FuQlg7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJyYW5kb20gPSByZXF1aXJlIFwibG9kYXNoLnJhbmRvbVwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc2hha2U6IChlZGl0b3JFbGVtZW50KSAtPlxuICAgIG1pbiA9IEBnZXRDb25maWcgXCJtaW5JbnRlbnNpdHlcIlxuICAgIG1heCA9IEBnZXRDb25maWcgXCJtYXhJbnRlbnNpdHlcIlxuXG4gICAgeCA9IEBzaGFrZUludGVuc2l0eSBtaW4sIG1heFxuICAgIHkgPSBAc2hha2VJbnRlbnNpdHkgbWluLCBtYXhcblxuICAgIGVkaXRvckVsZW1lbnQuc3R5bGUudG9wID0gXCIje3l9cHhcIlxuICAgIGVkaXRvckVsZW1lbnQuc3R5bGUubGVmdCA9IFwiI3t4fXB4XCJcblxuICAgIHNldFRpbWVvdXQgLT5cbiAgICAgIGVkaXRvckVsZW1lbnQuc3R5bGUudG9wID0gXCJcIlxuICAgICAgZWRpdG9yRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIlxuICAgICwgNzVcblxuICBzaGFrZUludGVuc2l0eTogKG1pbiwgbWF4KSAtPlxuICAgIGRpcmVjdGlvbiA9IGlmIE1hdGgucmFuZG9tKCkgPiAwLjUgdGhlbiAtMSBlbHNlIDFcbiAgICByYW5kb20obWluLCBtYXgsIHRydWUpICogZGlyZWN0aW9uXG5cbiAgZ2V0Q29uZmlnOiAoY29uZmlnKSAtPlxuICAgIGF0b20uY29uZmlnLmdldCBcImFjdGl2YXRlLXBvd2VyLW1vZGUuc2NyZWVuU2hha2UuI3tjb25maWd9XCJcbiJdfQ==
