(function() {
  var CompositeDisposable, HighlightLineModel;

  CompositeDisposable = require("atom").CompositeDisposable;

  HighlightLineModel = require('./highlight-line-model');

  module.exports = {
    config: {
      enableBackgroundColor: {
        type: 'boolean',
        "default": true
      },
      hideHighlightOnSelect: {
        type: 'boolean',
        "default": false
      },
      enableUnderline: {
        type: 'boolean',
        "default": false
      },
      enableSelectionBorder: {
        type: 'boolean',
        "default": false
      },
      underline: {
        type: 'string',
        "default": 'solid',
        "enum": ['solid', 'dotted', 'dashed']
      }
    },
    line: null,
    subscriptions: null,
    activate: function() {
      this.line = new HighlightLineModel();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-background': (function(_this) {
          return function() {
            return _this.toggleHighlight();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-hide-highlight-on-select': (function(_this) {
          return function() {
            return _this.toggleHideHighlightOnSelect();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-underline': (function(_this) {
          return function() {
            return _this.toggleUnderline();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-selection-borders': (function(_this) {
          return function() {
            return _this.toggleSelectionBorders();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.line.destroy();
      this.subscriptions.dispose();
      return this.subscriptions = null;
    },
    toggleHighlight: function() {
      var current;
      current = atom.config.get('highlight-line.enableBackgroundColor');
      return atom.config.set('highlight-line.enableBackgroundColor', !current);
    },
    toggleHideHighlightOnSelect: function() {
      var current;
      current = atom.config.get('highlight-line.hideHighlightOnSelect');
      return atom.config.set('highlight-line.hideHighlightOnSelect', !current);
    },
    toggleUnderline: function() {
      var current;
      current = atom.config.get('highlight-line.enableUnderline');
      return atom.config.set('highlight-line.enableUnderline', !current);
    },
    toggleSelectionBorders: function() {
      var current;
      current = atom.config.get('highlight-line.enableSelectionBorder');
      return atom.config.set('highlight-line.enableSelectionBorder', !current);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1saW5lL2xpYi9oaWdobGlnaHQtbGluZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSOztFQUVyQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEscUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BREY7TUFHQSxxQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FKRjtNQU1BLGVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BUEY7TUFTQSxxQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FWRjtNQVlBLFNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxPQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxRQUFWLEVBQW9CLFFBQXBCLENBRk47T0FiRjtLQURGO0lBaUJBLElBQUEsRUFBTSxJQWpCTjtJQWtCQSxhQUFBLEVBQWUsSUFsQmY7SUFvQkEsUUFBQSxFQUFVLFNBQUE7TUFDUixJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsa0JBQUEsQ0FBQTtNQUdaLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDZjtRQUFBLGtDQUFBLEVBQW9DLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQztPQURlLENBQW5CO01BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDZjtRQUFBLGdEQUFBLEVBQ0EsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsMkJBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURBO09BRGUsQ0FBbkI7TUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNmO1FBQUEsaUNBQUEsRUFBbUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsZUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DO09BRGUsQ0FBbkI7YUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNmO1FBQUEseUNBQUEsRUFBMkMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsc0JBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQztPQURlLENBQW5CO0lBZFEsQ0FwQlY7SUFxQ0EsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQTtNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO2FBQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFMUCxDQXJDWjtJQTRDQSxlQUFBLEVBQWlCLFNBQUE7QUFDZixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEI7YUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLEVBQXdELENBQUksT0FBNUQ7SUFGZSxDQTVDakI7SUFnREEsMkJBQUEsRUFBNkIsU0FBQTtBQUMzQixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEI7YUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLEVBQXdELENBQUksT0FBNUQ7SUFGMkIsQ0FoRDdCO0lBb0RBLGVBQUEsRUFBaUIsU0FBQTtBQUNmLFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQjthQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFBa0QsQ0FBSSxPQUF0RDtJQUZlLENBcERqQjtJQXdEQSxzQkFBQSxFQUF3QixTQUFBO0FBQ3RCLFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQjthQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsRUFBd0QsQ0FBSSxPQUE1RDtJQUZzQixDQXhEeEI7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5IaWdobGlnaHRMaW5lTW9kZWwgPSByZXF1aXJlICcuL2hpZ2hsaWdodC1saW5lLW1vZGVsJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBlbmFibGVCYWNrZ3JvdW5kQ29sb3I6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBoaWRlSGlnaGxpZ2h0T25TZWxlY3Q6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgZW5hYmxlVW5kZXJsaW5lOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGVuYWJsZVNlbGVjdGlvbkJvcmRlcjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB1bmRlcmxpbmU6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ3NvbGlkJ1xuICAgICAgZW51bTogWydzb2xpZCcsICdkb3R0ZWQnLCAnZGFzaGVkJ11cbiAgbGluZTogbnVsbFxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgQGxpbmUgPSBuZXcgSGlnaGxpZ2h0TGluZU1vZGVsKClcblxuICAgICMgU2V0dXAgdG8gdXNlIHRoZSBuZXcgY29tcG9zaXRlIGRpc3Bvc2FibGVzIEFQSSBmb3IgcmVnaXN0ZXJpbmcgY29tbWFuZHNcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIEFkZCB0aGUgY29tbWFuZHNcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLFxuICAgICAgICAnaGlnaGxpZ2h0LWxpbmU6dG9nZ2xlLWJhY2tncm91bmQnOiA9PiBAdG9nZ2xlSGlnaGxpZ2h0KClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLFxuICAgICAgICAnaGlnaGxpZ2h0LWxpbmU6dG9nZ2xlLWhpZGUtaGlnaGxpZ2h0LW9uLXNlbGVjdCc6IFxcXG4gICAgICAgID0+IEB0b2dnbGVIaWRlSGlnaGxpZ2h0T25TZWxlY3QoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsXG4gICAgICAgICdoaWdobGlnaHQtbGluZTp0b2dnbGUtdW5kZXJsaW5lJzogPT4gQHRvZ2dsZVVuZGVybGluZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIixcbiAgICAgICAgJ2hpZ2hsaWdodC1saW5lOnRvZ2dsZS1zZWxlY3Rpb24tYm9yZGVycyc6ID0+IEB0b2dnbGVTZWxlY3Rpb25Cb3JkZXJzKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBsaW5lLmRlc3Ryb3koKVxuXG4gICAgIyBEZXN0cm95IHRoZSBzdWJzY3JpcHRpb25zIGFzIHdlbGxcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG51bGxcblxuICB0b2dnbGVIaWdobGlnaHQ6IC0+XG4gICAgY3VycmVudCA9IGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LWxpbmUuZW5hYmxlQmFja2dyb3VuZENvbG9yJylcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2hpZ2hsaWdodC1saW5lLmVuYWJsZUJhY2tncm91bmRDb2xvcicsIG5vdCBjdXJyZW50KVxuXG4gIHRvZ2dsZUhpZGVIaWdobGlnaHRPblNlbGVjdDogLT5cbiAgICBjdXJyZW50ID0gYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtbGluZS5oaWRlSGlnaGxpZ2h0T25TZWxlY3QnKVxuICAgIGF0b20uY29uZmlnLnNldCgnaGlnaGxpZ2h0LWxpbmUuaGlkZUhpZ2hsaWdodE9uU2VsZWN0Jywgbm90IGN1cnJlbnQpXG5cbiAgdG9nZ2xlVW5kZXJsaW5lOiAtPlxuICAgIGN1cnJlbnQgPSBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1saW5lLmVuYWJsZVVuZGVybGluZScpXG4gICAgYXRvbS5jb25maWcuc2V0KCdoaWdobGlnaHQtbGluZS5lbmFibGVVbmRlcmxpbmUnLCBub3QgY3VycmVudClcblxuICB0b2dnbGVTZWxlY3Rpb25Cb3JkZXJzOiAtPlxuICAgIGN1cnJlbnQgPSBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1saW5lLmVuYWJsZVNlbGVjdGlvbkJvcmRlcicpXG4gICAgYXRvbS5jb25maWcuc2V0KCdoaWdobGlnaHQtbGluZS5lbmFibGVTZWxlY3Rpb25Cb3JkZXInLCBub3QgY3VycmVudClcbiJdfQ==
