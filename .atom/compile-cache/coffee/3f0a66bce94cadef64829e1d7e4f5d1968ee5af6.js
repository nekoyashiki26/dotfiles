(function() {
  var ActionSelectListView, ClipboardListView, match,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  match = require('fuzzaldrin').match;

  ActionSelectListView = require('@aki77/atom-select-action');

  module.exports = ClipboardListView = (function(superClass) {
    extend(ClipboardListView, superClass);

    ClipboardListView.prototype.panelClass = 'clipboard-plus';

    function ClipboardListView(clipboardItems) {
      this.clipboardItems = clipboardItems;
      this.contentForItem = bind(this.contentForItem, this);
      this.remove = bind(this.remove, this);
      this.paste = bind(this.paste, this);
      this.getItems = bind(this.getItems, this);
      ClipboardListView.__super__.constructor.call(this, {
        items: this.getItems,
        filterKey: 'text',
        actions: [
          {
            name: 'Paste',
            callback: this.paste
          }, {
            name: 'Remove',
            callback: this.remove
          }
        ]
      });
      this.registerPasteAction(this.defaultPasteAction);
    }

    ClipboardListView.prototype.getItems = function() {
      return this.clipboardItems.entries().reverse();
    };

    ClipboardListView.prototype.paste = function(item) {
      var editor;
      this.clipboardItems["delete"](item);
      atom.clipboard.write(item.text, item.metadata);
      editor = atom.workspace.getActiveTextEditor();
      return this.pasteAction(editor, item);
    };

    ClipboardListView.prototype.remove = function(item) {
      return this.clipboardItems["delete"](item);
    };

    ClipboardListView.prototype.registerPasteAction = function(fn) {
      return this.pasteAction = fn;
    };

    ClipboardListView.prototype.defaultPasteAction = function(editor, item) {
      return editor.pasteText();
    };

    ClipboardListView.prototype.contentForItem = function(arg, filterQuery) {
      var matches, text, truncateText;
      text = arg.text;
      matches = match(text, filterQuery);
      truncateText = this.truncateText;
      return function(arg1) {
        var highlighter;
        highlighter = arg1.highlighter;
        return this.li((function(_this) {
          return function() {
            return _this.div(function() {
              return _this.pre(function() {
                return highlighter(truncateText(text), matches, 0);
              });
            });
          };
        })(this));
      };
    };

    ClipboardListView.prototype.truncateText = function(text) {
      var maximumLinesNumber, newText;
      maximumLinesNumber = atom.config.get('clipboard-plus.maximumLinesNumber');
      if (maximumLinesNumber === 0) {
        return text;
      }
      if (text.split("\n").length <= maximumLinesNumber) {
        return text;
      }
      newText = text.split("\n").slice(0, maximumLinesNumber).join("\n");
      return newText + "[...]";
    };

    return ClipboardListView;

  })(ActionSelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2NsaXBib2FyZC1wbHVzL2xpYi9jbGlwYm9hcmQtbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsOENBQUE7SUFBQTs7OztFQUFDLFFBQVMsT0FBQSxDQUFRLFlBQVI7O0VBQ1Ysb0JBQUEsR0FBdUIsT0FBQSxDQUFRLDJCQUFSOztFQUV2QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Z0NBQ0osVUFBQSxHQUFZOztJQUVDLDJCQUFDLGNBQUQ7TUFBQyxJQUFDLENBQUEsaUJBQUQ7Ozs7O01BQ1osbURBQU07UUFDSixLQUFBLEVBQU8sSUFBQyxDQUFBLFFBREo7UUFFSixTQUFBLEVBQVcsTUFGUDtRQUdKLE9BQUEsRUFBUztVQUNQO1lBQ0UsSUFBQSxFQUFNLE9BRFI7WUFFRSxRQUFBLEVBQVUsSUFBQyxDQUFBLEtBRmI7V0FETyxFQUtQO1lBQ0UsSUFBQSxFQUFNLFFBRFI7WUFFRSxRQUFBLEVBQVUsSUFBQyxDQUFBLE1BRmI7V0FMTztTQUhMO09BQU47TUFlQSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsSUFBQyxDQUFBLGtCQUF0QjtJQWhCVzs7Z0NBa0JiLFFBQUEsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLGNBQWMsQ0FBQyxPQUFoQixDQUFBLENBQXlCLENBQUMsT0FBMUIsQ0FBQTtJQURROztnQ0FJVixLQUFBLEdBQU8sU0FBQyxJQUFEO0FBQ0wsVUFBQTtNQUFBLElBQUMsQ0FBQSxjQUFjLEVBQUMsTUFBRCxFQUFmLENBQXVCLElBQXZCO01BQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFmLENBQXFCLElBQUksQ0FBQyxJQUExQixFQUFnQyxJQUFJLENBQUMsUUFBckM7TUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO2FBQ1QsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBQXFCLElBQXJCO0lBSks7O2dDQU1QLE1BQUEsR0FBUSxTQUFDLElBQUQ7YUFDTixJQUFDLENBQUEsY0FBYyxFQUFDLE1BQUQsRUFBZixDQUF1QixJQUF2QjtJQURNOztnQ0FHUixtQkFBQSxHQUFxQixTQUFDLEVBQUQ7YUFDbkIsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQURJOztnQ0FHckIsa0JBQUEsR0FBb0IsU0FBQyxNQUFELEVBQVMsSUFBVDthQUNsQixNQUFNLENBQUMsU0FBUCxDQUFBO0lBRGtCOztnQ0FHcEIsY0FBQSxHQUFnQixTQUFDLEdBQUQsRUFBUyxXQUFUO0FBQ2QsVUFBQTtNQURnQixPQUFEO01BQ2YsT0FBQSxHQUFVLEtBQUEsQ0FBTSxJQUFOLEVBQVksV0FBWjtNQUNULGVBQWdCO2FBRWpCLFNBQUMsSUFBRDtBQUNFLFlBQUE7UUFEQSxjQUFEO2VBQ0MsSUFBQyxDQUFBLEVBQUQsQ0FBSSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNGLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQTtxQkFDSCxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUE7dUJBQUcsV0FBQSxDQUFZLFlBQUEsQ0FBYSxJQUFiLENBQVosRUFBZ0MsT0FBaEMsRUFBeUMsQ0FBekM7Y0FBSCxDQUFMO1lBREcsQ0FBTDtVQURFO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFKO01BREY7SUFKYzs7Z0NBU2hCLFlBQUEsR0FBYyxTQUFDLElBQUQ7QUFDWixVQUFBO01BQUEsa0JBQUEsR0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1DQUFoQjtNQUNyQixJQUFlLGtCQUFBLEtBQXNCLENBQXJDO0FBQUEsZUFBTyxLQUFQOztNQUNBLElBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWdCLENBQUMsTUFBakIsSUFBMkIsa0JBQTFDO0FBQUEsZUFBTyxLQUFQOztNQUVBLE9BQUEsR0FBVSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBZ0IsQ0FBQyxLQUFqQixDQUF1QixDQUF2QixFQUEwQixrQkFBMUIsQ0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxJQUFuRDthQUNQLE9BQUQsR0FBUztJQU5DOzs7O0tBakRnQjtBQUpoQyIsInNvdXJjZXNDb250ZW50IjpbInttYXRjaH0gPSByZXF1aXJlICdmdXp6YWxkcmluJ1xuQWN0aW9uU2VsZWN0TGlzdFZpZXcgPSByZXF1aXJlICdAYWtpNzcvYXRvbS1zZWxlY3QtYWN0aW9uJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDbGlwYm9hcmRMaXN0VmlldyBleHRlbmRzIEFjdGlvblNlbGVjdExpc3RWaWV3XG4gIHBhbmVsQ2xhc3M6ICdjbGlwYm9hcmQtcGx1cydcblxuICBjb25zdHJ1Y3RvcjogKEBjbGlwYm9hcmRJdGVtcykgLT5cbiAgICBzdXBlcih7XG4gICAgICBpdGVtczogQGdldEl0ZW1zXG4gICAgICBmaWx0ZXJLZXk6ICd0ZXh0J1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1Bhc3RlJ1xuICAgICAgICAgIGNhbGxiYWNrOiBAcGFzdGVcbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1JlbW92ZSdcbiAgICAgICAgICBjYWxsYmFjazogQHJlbW92ZVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSlcblxuICAgIEByZWdpc3RlclBhc3RlQWN0aW9uKEBkZWZhdWx0UGFzdGVBY3Rpb24pXG5cbiAgZ2V0SXRlbXM6ID0+XG4gICAgQGNsaXBib2FyZEl0ZW1zLmVudHJpZXMoKS5yZXZlcnNlKClcblxuICAjIEluc2VydCBpdGVtIGluIGNsaXBib2FyZEl0ZW1zIGFuZCBzZXQgaXRlbSB0byB0aGUgaGVhZFxuICBwYXN0ZTogKGl0ZW0pID0+XG4gICAgQGNsaXBib2FyZEl0ZW1zLmRlbGV0ZShpdGVtKVxuICAgIGF0b20uY2xpcGJvYXJkLndyaXRlKGl0ZW0udGV4dCwgaXRlbS5tZXRhZGF0YSlcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAcGFzdGVBY3Rpb24oZWRpdG9yLCBpdGVtKVxuXG4gIHJlbW92ZTogKGl0ZW0pID0+XG4gICAgQGNsaXBib2FyZEl0ZW1zLmRlbGV0ZShpdGVtKVxuXG4gIHJlZ2lzdGVyUGFzdGVBY3Rpb246IChmbikgLT5cbiAgICBAcGFzdGVBY3Rpb24gPSBmblxuXG4gIGRlZmF1bHRQYXN0ZUFjdGlvbjogKGVkaXRvciwgaXRlbSkgLT5cbiAgICBlZGl0b3IucGFzdGVUZXh0KClcblxuICBjb250ZW50Rm9ySXRlbTogKHt0ZXh0fSwgZmlsdGVyUXVlcnkpID0+XG4gICAgbWF0Y2hlcyA9IG1hdGNoKHRleHQsIGZpbHRlclF1ZXJ5KVxuICAgIHt0cnVuY2F0ZVRleHR9ID0gdGhpc1xuXG4gICAgKHtoaWdobGlnaHRlcn0pIC0+XG4gICAgICBAbGkgPT5cbiAgICAgICAgQGRpdiA9PlxuICAgICAgICAgIEBwcmUgLT4gaGlnaGxpZ2h0ZXIodHJ1bmNhdGVUZXh0KHRleHQpLCBtYXRjaGVzLCAwKVxuXG4gIHRydW5jYXRlVGV4dDogKHRleHQpIC0+XG4gICAgbWF4aW11bUxpbmVzTnVtYmVyID0gYXRvbS5jb25maWcuZ2V0KCdjbGlwYm9hcmQtcGx1cy5tYXhpbXVtTGluZXNOdW1iZXInKVxuICAgIHJldHVybiB0ZXh0IGlmIG1heGltdW1MaW5lc051bWJlciBpcyAwXG4gICAgcmV0dXJuIHRleHQgaWYgdGV4dC5zcGxpdChcIlxcblwiKS5sZW5ndGggPD0gbWF4aW11bUxpbmVzTnVtYmVyXG5cbiAgICBuZXdUZXh0ID0gdGV4dC5zcGxpdChcIlxcblwiKS5zbGljZSgwLCBtYXhpbXVtTGluZXNOdW1iZXIpLmpvaW4oXCJcXG5cIilcbiAgICBcIiN7bmV3VGV4dH1bLi4uXVwiXG4iXX0=
