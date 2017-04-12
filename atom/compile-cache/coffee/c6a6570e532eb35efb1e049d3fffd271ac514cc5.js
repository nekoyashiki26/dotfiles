(function() {
  var CSON, ContextMenu, JapaneseMenu, Menu, Preferences,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CSON = require('cson');

  Menu = require('./menu');

  ContextMenu = require('./context-menu');

  Preferences = require('./preferences');

  JapaneseMenu = (function() {
    JapaneseMenu.prototype.pref = {
      done: false
    };

    function JapaneseMenu() {
      this.delay = bind(this.delay, this);
      this.defM = CSON.load(__dirname + ("/../def/menu_" + process.platform + ".cson"));
      this.defC = CSON.load(__dirname + "/../def/context.cson");
      this.defS = CSON.load(__dirname + "/../def/settings.cson");
    }

    JapaneseMenu.prototype.activate = function(state) {
      return setTimeout(this.delay, 0);
    };

    JapaneseMenu.prototype.delay = function() {
      Menu.localize(this.defM);
      ContextMenu.localize(this.defC);
      return Preferences.localize(this.defS);
    };

    return JapaneseMenu;

  })();

  module.exports = window.JapaneseMenu = new JapaneseMenu();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLW1lbnUvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrREFBQTtJQUFBOztFQUFBLElBQUEsR0FBYyxPQUFBLENBQVEsTUFBUjs7RUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0VBQ2QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUjs7RUFDZCxXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVI7O0VBRVI7MkJBRUosSUFBQSxHQUFNO01BQUMsSUFBQSxFQUFNLEtBQVA7OztJQUVPLHNCQUFBOztNQUNYLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFBLEdBQVksQ0FBQSxlQUFBLEdBQWdCLE9BQU8sQ0FBQyxRQUF4QixHQUFpQyxPQUFqQyxDQUF0QjtNQUNSLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFBLEdBQVksc0JBQXRCO01BQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQUEsR0FBWSx1QkFBdEI7SUFIRzs7MkJBS2IsUUFBQSxHQUFVLFNBQUMsS0FBRDthQUNSLFVBQUEsQ0FBVyxJQUFDLENBQUEsS0FBWixFQUFtQixDQUFuQjtJQURROzsyQkFHVixLQUFBLEdBQU8sU0FBQTtNQUNMLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBQyxDQUFBLElBQWY7TUFDQSxXQUFXLENBQUMsUUFBWixDQUFxQixJQUFDLENBQUEsSUFBdEI7YUFDQSxXQUFXLENBQUMsUUFBWixDQUFxQixJQUFDLENBQUEsSUFBdEI7SUFISzs7Ozs7O0VBTVQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBTSxDQUFDLFlBQVAsR0FBMEIsSUFBQSxZQUFBLENBQUE7QUF2QjNDIiwic291cmNlc0NvbnRlbnQiOlsiQ1NPTiAgICAgICAgPSByZXF1aXJlICdjc29uJ1xuTWVudSAgICAgICAgPSByZXF1aXJlICcuL21lbnUnXG5Db250ZXh0TWVudSA9IHJlcXVpcmUgJy4vY29udGV4dC1tZW51J1xuUHJlZmVyZW5jZXMgPSByZXF1aXJlICcuL3ByZWZlcmVuY2VzJ1xuXG5jbGFzcyBKYXBhbmVzZU1lbnVcblxuICBwcmVmOiB7ZG9uZTogZmFsc2V9XG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGRlZk0gPSBDU09OLmxvYWQgX19kaXJuYW1lICsgXCIvLi4vZGVmL21lbnVfI3twcm9jZXNzLnBsYXRmb3JtfS5jc29uXCJcbiAgICBAZGVmQyA9IENTT04ubG9hZCBfX2Rpcm5hbWUgKyBcIi8uLi9kZWYvY29udGV4dC5jc29uXCJcbiAgICBAZGVmUyA9IENTT04ubG9hZCBfX2Rpcm5hbWUgKyBcIi8uLi9kZWYvc2V0dGluZ3MuY3NvblwiXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBzZXRUaW1lb3V0KEBkZWxheSwgMClcblxuICBkZWxheTogKCkgPT5cbiAgICBNZW51LmxvY2FsaXplKEBkZWZNKVxuICAgIENvbnRleHRNZW51LmxvY2FsaXplKEBkZWZDKVxuICAgIFByZWZlcmVuY2VzLmxvY2FsaXplKEBkZWZTKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkphcGFuZXNlTWVudSA9IG5ldyBKYXBhbmVzZU1lbnUoKVxuIl19
