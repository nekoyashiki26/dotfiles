(function() {
  var $$, ListView, OutputViewManager, SelectListView, fs, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs-plus');

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      ListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    ListView.prototype.parseData = function() {
      var branches, i, item, items, len;
      items = this.data.split("\n");
      branches = [];
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        item = item.replace(/\s/g, '');
        if (item !== '') {
          branches.push({
            name: item
          });
        }
      }
      this.setItems(branches);
      return this.focusFilterEditor();
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(arg) {
      var current, name;
      name = arg.name;
      current = false;
      if (name.startsWith("*")) {
        name = name.slice(1);
        current = true;
      }
      return $$(function() {
        return this.li(name, (function(_this) {
          return function() {
            return _this.div({
              "class": 'pull-right'
            }, function() {
              if (current) {
                return _this.span('Current');
              }
            });
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(arg) {
      var name;
      name = arg.name;
      this.rebase(name.match(/\*?(.*)/)[1]);
      return this.cancel();
    };

    ListView.prototype.rebase = function(branch) {
      return git.cmd(['rebase', branch], {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(msg) {
          OutputViewManager.create().setContent(msg).finish();
          atom.workspace.getTextEditors().forEach(function(editor) {
            return fs.exists(editor.getPath(), function(exist) {
              if (!exist) {
                return editor.destroy();
              }
            });
          });
          return git.refresh(_this.repo);
        };
      })(this))["catch"]((function(_this) {
        return function(msg) {
          notifier.addError(msg);
          return git.refresh(_this.repo);
        };
      })(this));
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9yZWJhc2UtbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsdUVBQUE7SUFBQTs7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFDTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUjs7RUFFcEIsTUFBTSxDQUFDLE9BQVAsR0FDUTs7Ozs7Ozt1QkFDSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsSUFBUjtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLE9BQUQ7TUFDbEIsMENBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO0lBSFU7O3VCQUtaLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFaO01BQ1IsUUFBQSxHQUFXO0FBQ1gsV0FBQSx1Q0FBQTs7UUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCO1FBQ1AsSUFBTyxJQUFBLEtBQVEsRUFBZjtVQUNFLFFBQVEsQ0FBQyxJQUFULENBQWM7WUFBQyxJQUFBLEVBQU0sSUFBUDtXQUFkLEVBREY7O0FBRkY7TUFJQSxJQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQVJTOzt1QkFVWCxZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7O3VCQUVkLElBQUEsR0FBTSxTQUFBOztRQUNKLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFELENBQUE7SUFISTs7dUJBS04sU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7O3VCQUVYLElBQUEsR0FBTSxTQUFBO0FBQ0osVUFBQTsrQ0FBTSxDQUFFLE9BQVIsQ0FBQTtJQURJOzt1QkFHTixXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQURhLE9BQUQ7TUFDWixPQUFBLEdBQVU7TUFDVixJQUFHLElBQUksQ0FBQyxVQUFMLENBQWdCLEdBQWhCLENBQUg7UUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYO1FBQ1AsT0FBQSxHQUFVLEtBRlo7O2FBR0EsRUFBQSxDQUFHLFNBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJLElBQUosRUFBVSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNSLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7YUFBTCxFQUEwQixTQUFBO2NBQ3hCLElBQW9CLE9BQXBCO3VCQUFBLEtBQUMsQ0FBQSxJQUFELENBQU0sU0FBTixFQUFBOztZQUR3QixDQUExQjtVQURRO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFWO01BREMsQ0FBSDtJQUxXOzt1QkFVYixTQUFBLEdBQVcsU0FBQyxHQUFEO0FBQ1QsVUFBQTtNQURXLE9BQUQ7TUFDVixJQUFDLENBQUEsTUFBRCxDQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsU0FBWCxDQUFzQixDQUFBLENBQUEsQ0FBOUI7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRlM7O3VCQUlYLE1BQUEsR0FBUSxTQUFDLE1BQUQ7YUFDTixHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxFQUFXLE1BQVgsQ0FBUixFQUE0QjtRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUE1QixDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO1VBQ0osaUJBQWlCLENBQUMsTUFBbEIsQ0FBQSxDQUEwQixDQUFDLFVBQTNCLENBQXNDLEdBQXRDLENBQTBDLENBQUMsTUFBM0MsQ0FBQTtVQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUFBLENBQStCLENBQUMsT0FBaEMsQ0FBd0MsU0FBQyxNQUFEO21CQUN0QyxFQUFFLENBQUMsTUFBSCxDQUFVLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBVixFQUE0QixTQUFDLEtBQUQ7Y0FBVyxJQUFvQixDQUFJLEtBQXhCO3VCQUFBLE1BQU0sQ0FBQyxPQUFQLENBQUEsRUFBQTs7WUFBWCxDQUE1QjtVQURzQyxDQUF4QztpQkFFQSxHQUFHLENBQUMsT0FBSixDQUFZLEtBQUMsQ0FBQSxJQUFiO1FBSkk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE4sQ0FNQSxFQUFDLEtBQUQsRUFOQSxDQU1PLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO1VBQ0wsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsR0FBbEI7aUJBQ0EsR0FBRyxDQUFDLE9BQUosQ0FBWSxLQUFDLENBQUEsSUFBYjtRQUZLO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5QO0lBRE07Ozs7S0ExQ2E7QUFQekIiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG57JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbk91dHB1dFZpZXdNYW5hZ2VyID0gcmVxdWlyZSAnLi4vb3V0cHV0LXZpZXctbWFuYWdlcidcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjbGFzcyBMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gICAgaW5pdGlhbGl6ZTogKEByZXBvLCBAZGF0YSkgLT5cbiAgICAgIHN1cGVyXG4gICAgICBAc2hvdygpXG4gICAgICBAcGFyc2VEYXRhKClcblxuICAgIHBhcnNlRGF0YTogLT5cbiAgICAgIGl0ZW1zID0gQGRhdGEuc3BsaXQoXCJcXG5cIilcbiAgICAgIGJyYW5jaGVzID0gW11cbiAgICAgIGZvciBpdGVtIGluIGl0ZW1zXG4gICAgICAgIGl0ZW0gPSBpdGVtLnJlcGxhY2UoL1xccy9nLCAnJylcbiAgICAgICAgdW5sZXNzIGl0ZW0gaXMgJydcbiAgICAgICAgICBicmFuY2hlcy5wdXNoIHtuYW1lOiBpdGVtfVxuICAgICAgQHNldEl0ZW1zIGJyYW5jaGVzXG4gICAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gICAgZ2V0RmlsdGVyS2V5OiAtPiAnbmFtZSdcblxuICAgIHNob3c6IC0+XG4gICAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgICAgQHBhbmVsLnNob3coKVxuICAgICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gICAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgICBoaWRlOiAtPlxuICAgICAgQHBhbmVsPy5kZXN0cm95KClcblxuICAgIHZpZXdGb3JJdGVtOiAoe25hbWV9KSAtPlxuICAgICAgY3VycmVudCA9IGZhbHNlXG4gICAgICBpZiBuYW1lLnN0YXJ0c1dpdGggXCIqXCJcbiAgICAgICAgbmFtZSA9IG5hbWUuc2xpY2UoMSlcbiAgICAgICAgY3VycmVudCA9IHRydWVcbiAgICAgICQkIC0+XG4gICAgICAgIEBsaSBuYW1lLCA9PlxuICAgICAgICAgIEBkaXYgY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICAgIEBzcGFuKCdDdXJyZW50JykgaWYgY3VycmVudFxuXG4gICAgY29uZmlybWVkOiAoe25hbWV9KSAtPlxuICAgICAgQHJlYmFzZSBuYW1lLm1hdGNoKC9cXCo/KC4qKS8pWzFdXG4gICAgICBAY2FuY2VsKClcblxuICAgIHJlYmFzZTogKGJyYW5jaCkgLT5cbiAgICAgIGdpdC5jbWQoWydyZWJhc2UnLCBicmFuY2hdLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIC50aGVuIChtc2cpID0+XG4gICAgICAgIE91dHB1dFZpZXdNYW5hZ2VyLmNyZWF0ZSgpLnNldENvbnRlbnQobXNnKS5maW5pc2goKVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2ggKGVkaXRvcikgLT5cbiAgICAgICAgICBmcy5leGlzdHMgZWRpdG9yLmdldFBhdGgoKSwgKGV4aXN0KSAtPiBlZGl0b3IuZGVzdHJveSgpIGlmIG5vdCBleGlzdFxuICAgICAgICBnaXQucmVmcmVzaCBAcmVwb1xuICAgICAgLmNhdGNoIChtc2cpID0+XG4gICAgICAgIG5vdGlmaWVyLmFkZEVycm9yIG1zZ1xuICAgICAgICBnaXQucmVmcmVzaCBAcmVwb1xuIl19
