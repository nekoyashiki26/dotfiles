(function() {
  var Menu;

  Menu = (function() {
    function Menu() {}

    Menu.localize = function(defM) {
      this.updateMenu(atom.menu.template, defM.Menu);
      return atom.menu.update();
    };

    Menu.updateMenu = function(menuList, def) {
      var i, key, len, menu, results, set;
      if (!def) {
        return;
      }
      results = [];
      for (i = 0, len = menuList.length; i < len; i++) {
        menu = menuList[i];
        if (!menu.label) {
          continue;
        }
        key = menu.label;
        set = def[key];
        if (!set) {
          continue;
        }
        if (set != null) {
          menu.label = set.value;
        }
        if (menu.submenu != null) {
          results.push(this.updateMenu(menu.submenu, set.submenu));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return Menu;

  })();

  module.exports = Menu;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLW1lbnUvbGliL21lbnUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTTs7O0lBRUosSUFBQyxDQUFBLFFBQUQsR0FBVyxTQUFDLElBQUQ7TUFDVCxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBdEIsRUFBZ0MsSUFBSSxDQUFDLElBQXJDO2FBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFWLENBQUE7SUFGUzs7SUFJWCxJQUFDLENBQUEsVUFBRCxHQUFhLFNBQUMsUUFBRCxFQUFXLEdBQVg7QUFDWCxVQUFBO01BQUEsSUFBVSxDQUFJLEdBQWQ7QUFBQSxlQUFBOztBQUNBO1dBQUEsMENBQUE7O1FBQ0UsSUFBWSxDQUFJLElBQUksQ0FBQyxLQUFyQjtBQUFBLG1CQUFBOztRQUNBLEdBQUEsR0FBTSxJQUFJLENBQUM7UUFDWCxHQUFBLEdBQU0sR0FBSSxDQUFBLEdBQUE7UUFDVixJQUFZLENBQUksR0FBaEI7QUFBQSxtQkFBQTs7UUFDQSxJQUEwQixXQUExQjtVQUFBLElBQUksQ0FBQyxLQUFMLEdBQWEsR0FBRyxDQUFDLE1BQWpCOztRQUNBLElBQUcsb0JBQUg7dUJBQ0UsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFJLENBQUMsT0FBakIsRUFBMEIsR0FBRyxDQUFDLE9BQTlCLEdBREY7U0FBQSxNQUFBOytCQUFBOztBQU5GOztJQUZXOzs7Ozs7RUFXZixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQWpCakIiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNZW51XG5cbiAgQGxvY2FsaXplOiAoZGVmTSkgLT5cbiAgICBAdXBkYXRlTWVudShhdG9tLm1lbnUudGVtcGxhdGUsIGRlZk0uTWVudSlcbiAgICBhdG9tLm1lbnUudXBkYXRlKClcblxuICBAdXBkYXRlTWVudTogKG1lbnVMaXN0LCBkZWYpIC0+XG4gICAgcmV0dXJuIGlmIG5vdCBkZWZcbiAgICBmb3IgbWVudSBpbiBtZW51TGlzdFxuICAgICAgY29udGludWUgaWYgbm90IG1lbnUubGFiZWxcbiAgICAgIGtleSA9IG1lbnUubGFiZWxcbiAgICAgIHNldCA9IGRlZltrZXldXG4gICAgICBjb250aW51ZSBpZiBub3Qgc2V0XG4gICAgICBtZW51LmxhYmVsID0gc2V0LnZhbHVlIGlmIHNldD9cbiAgICAgIGlmIG1lbnUuc3VibWVudT9cbiAgICAgICAgQHVwZGF0ZU1lbnUobWVudS5zdWJtZW51LCBzZXQuc3VibWVudSlcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51XG4iXX0=
