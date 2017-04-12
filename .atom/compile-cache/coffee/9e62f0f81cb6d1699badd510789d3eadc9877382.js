(function() {
  var ActivatePowerMode, CompositeDisposable, configSchema, powerEditor;

  CompositeDisposable = require("atom").CompositeDisposable;

  configSchema = require("./config-schema");

  powerEditor = require("./power-editor");

  module.exports = ActivatePowerMode = {
    config: configSchema,
    subscriptions: null,
    active: false,
    powerEditor: powerEditor,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:toggle": (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        "activate-power-mode:enable": (function(_this) {
          return function() {
            return _this.enable();
          };
        })(this),
        "activate-power-mode:disable": (function(_this) {
          return function() {
            return _this.disable();
          };
        })(this),
        "activate-power-mode:reset-max-combo": (function(_this) {
          return function() {
            return _this.powerEditor.getCombo().resetMaxStreak();
          };
        })(this)
      }));
      if (this.getConfig("autoToggle")) {
        return this.toggle();
      }
    },
    deactivate: function() {
      var ref;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      this.active = false;
      return this.powerEditor.disable();
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode." + config);
    },
    toggle: function() {
      if (this.active) {
        return this.disable();
      } else {
        return this.enable();
      }
    },
    enable: function() {
      this.active = true;
      return this.powerEditor.enable();
    },
    disable: function() {
      this.active = false;
      return this.powerEditor.disable();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2FjdGl2YXRlLXBvd2VyLW1vZGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVI7O0VBQ2YsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUjs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUFpQixpQkFBQSxHQUNmO0lBQUEsTUFBQSxFQUFRLFlBQVI7SUFDQSxhQUFBLEVBQWUsSUFEZjtJQUVBLE1BQUEsRUFBUSxLQUZSO0lBR0EsV0FBQSxFQUFhLFdBSGI7SUFLQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUVyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtRQUFBLDRCQUFBLEVBQThCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QjtRQUNBLDRCQUFBLEVBQThCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUQ5QjtRQUVBLDZCQUFBLEVBQStCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUYvQjtRQUdBLHFDQUFBLEVBQXVDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ3JDLEtBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBLENBQXVCLENBQUMsY0FBeEIsQ0FBQTtVQURxQztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIdkM7T0FEaUIsQ0FBbkI7TUFPQSxJQUFHLElBQUMsQ0FBQSxTQUFELENBQVcsWUFBWCxDQUFIO2VBQ0UsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURGOztJQVZRLENBTFY7SUFrQkEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBOztXQUFjLENBQUUsT0FBaEIsQ0FBQTs7TUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7SUFIVSxDQWxCWjtJQXVCQSxTQUFBLEVBQVcsU0FBQyxNQUFEO2FBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFBLEdBQXVCLE1BQXZDO0lBRFMsQ0F2Qlg7SUEwQkEsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFHLElBQUMsQ0FBQSxNQUFKO2VBQWdCLElBQUMsQ0FBQSxPQUFELENBQUEsRUFBaEI7T0FBQSxNQUFBO2VBQWdDLElBQUMsQ0FBQSxNQUFELENBQUEsRUFBaEM7O0lBRE0sQ0ExQlI7SUE2QkEsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQUE7SUFGTSxDQTdCUjtJQWlDQSxPQUFBLEVBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxNQUFELEdBQVU7YUFDVixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTtJQUZPLENBakNUOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxuXG5jb25maWdTY2hlbWEgPSByZXF1aXJlIFwiLi9jb25maWctc2NoZW1hXCJcbnBvd2VyRWRpdG9yID0gcmVxdWlyZSBcIi4vcG93ZXItZWRpdG9yXCJcblxubW9kdWxlLmV4cG9ydHMgPSBBY3RpdmF0ZVBvd2VyTW9kZSA9XG4gIGNvbmZpZzogY29uZmlnU2NoZW1hXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgYWN0aXZlOiBmYWxzZVxuICBwb3dlckVkaXRvcjogcG93ZXJFZGl0b3JcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsXG4gICAgICBcImFjdGl2YXRlLXBvd2VyLW1vZGU6dG9nZ2xlXCI6ID0+IEB0b2dnbGUoKVxuICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlOmVuYWJsZVwiOiA9PiBAZW5hYmxlKClcbiAgICAgIFwiYWN0aXZhdGUtcG93ZXItbW9kZTpkaXNhYmxlXCI6ID0+IEBkaXNhYmxlKClcbiAgICAgIFwiYWN0aXZhdGUtcG93ZXItbW9kZTpyZXNldC1tYXgtY29tYm9cIjogPT5cbiAgICAgICAgQHBvd2VyRWRpdG9yLmdldENvbWJvKCkucmVzZXRNYXhTdHJlYWsoKVxuXG4gICAgaWYgQGdldENvbmZpZyBcImF1dG9Ub2dnbGVcIlxuICAgICAgQHRvZ2dsZSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGFjdGl2ZSA9IGZhbHNlXG4gICAgQHBvd2VyRWRpdG9yLmRpc2FibGUoKVxuXG4gIGdldENvbmZpZzogKGNvbmZpZykgLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQgXCJhY3RpdmF0ZS1wb3dlci1tb2RlLiN7Y29uZmlnfVwiXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGlmIEBhY3RpdmUgdGhlbiBAZGlzYWJsZSgpIGVsc2UgQGVuYWJsZSgpXG5cbiAgZW5hYmxlOiAtPlxuICAgIEBhY3RpdmUgPSB0cnVlXG4gICAgQHBvd2VyRWRpdG9yLmVuYWJsZSgpXG5cbiAgZGlzYWJsZTogLT5cbiAgICBAYWN0aXZlID0gZmFsc2VcbiAgICBAcG93ZXJFZGl0b3IuZGlzYWJsZSgpXG4iXX0=
