(function() {
  var ContextMenu, JapaneseMenu, Menu, Preferences,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Menu = require('./menu');

  ContextMenu = require('./context-menu');

  Preferences = require('./preferences');

  JapaneseMenu = (function() {
    JapaneseMenu.prototype.pref = {
      done: false
    };

    function JapaneseMenu() {
      this.delay = bind(this.delay, this);
      this.defM = require("../def/menu_" + process.platform);
      this.defC = require("../def/context");
      this.defS = require("../def/settings");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLW1lbnUvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw0Q0FBQTtJQUFBOztFQUFBLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7RUFDZCxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUNkLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUjs7RUFFUjsyQkFFSixJQUFBLEdBQU07TUFBQyxJQUFBLEVBQU0sS0FBUDs7O0lBRU8sc0JBQUE7O01BQ1gsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFBLENBQVEsY0FBQSxHQUFlLE9BQU8sQ0FBQyxRQUEvQjtNQUNSLElBQUMsQ0FBQSxJQUFELEdBQVEsT0FBQSxDQUFRLGdCQUFSO01BQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFBLENBQVEsaUJBQVI7SUFIRzs7MkJBS2IsUUFBQSxHQUFVLFNBQUMsS0FBRDthQUNSLFVBQUEsQ0FBVyxJQUFDLENBQUEsS0FBWixFQUFtQixDQUFuQjtJQURROzsyQkFHVixLQUFBLEdBQU8sU0FBQTtNQUNMLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBQyxDQUFBLElBQWY7TUFDQSxXQUFXLENBQUMsUUFBWixDQUFxQixJQUFDLENBQUEsSUFBdEI7YUFDQSxXQUFXLENBQUMsUUFBWixDQUFxQixJQUFDLENBQUEsSUFBdEI7SUFISzs7Ozs7O0VBTVQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBTSxDQUFDLFlBQVAsR0FBMEIsSUFBQSxZQUFBLENBQUE7QUF0QjNDIiwic291cmNlc0NvbnRlbnQiOlsiTWVudSAgICAgICAgPSByZXF1aXJlICcuL21lbnUnXG5Db250ZXh0TWVudSA9IHJlcXVpcmUgJy4vY29udGV4dC1tZW51J1xuUHJlZmVyZW5jZXMgPSByZXF1aXJlICcuL3ByZWZlcmVuY2VzJ1xuXG5jbGFzcyBKYXBhbmVzZU1lbnVcblxuICBwcmVmOiB7ZG9uZTogZmFsc2V9XG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGRlZk0gPSByZXF1aXJlIFwiLi4vZGVmL21lbnVfI3twcm9jZXNzLnBsYXRmb3JtfVwiXG4gICAgQGRlZkMgPSByZXF1aXJlIFwiLi4vZGVmL2NvbnRleHRcIlxuICAgIEBkZWZTID0gcmVxdWlyZSBcIi4uL2RlZi9zZXR0aW5nc1wiXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBzZXRUaW1lb3V0KEBkZWxheSwgMClcblxuICBkZWxheTogKCkgPT5cbiAgICBNZW51LmxvY2FsaXplKEBkZWZNKVxuICAgIENvbnRleHRNZW51LmxvY2FsaXplKEBkZWZDKVxuICAgIFByZWZlcmVuY2VzLmxvY2FsaXplKEBkZWZTKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkphcGFuZXNlTWVudSA9IG5ldyBKYXBhbmVzZU1lbnUoKVxuIl19
