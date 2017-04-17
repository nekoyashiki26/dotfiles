(function() {
  var $$, ListView, OutputViewManager, SelectListView, fs, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs-plus');

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  OutputViewManager = require('../output-view-manager');

  notifier = require('../notifier');

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data1, args) {
      this.repo = repo;
      this.data = data1;
      this.args = args != null ? args : [];
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
      this.merge(name.match(/\*?(.*)/)[1]);
      return this.cancel();
    };

    ListView.prototype.merge = function(branch) {
      var mergeArg;
      mergeArg = ['merge'].concat(this.args).concat([branch]);
      return git.cmd(mergeArg, {
        cwd: this.repo.getWorkingDirectory()
      }, {
        color: true
      }).then((function(_this) {
        return function(data) {
          OutputViewManager.create().setContent(data).finish();
          atom.workspace.getTextEditors().forEach(function(editor) {
            return fs.exists(editor.getPath(), function(exist) {
              if (!exist) {
                return editor.destroy();
              }
            });
          });
          return git.refresh(_this.repo);
        };
      })(this))["catch"](function(msg) {
        return notifier.addError(msg);
      });
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9tZXJnZS1saXN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx1RUFBQTtJQUFBOzs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVI7O0VBQ3BCLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O3VCQUNKLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBUSxLQUFSLEVBQWUsSUFBZjtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLE9BQUQ7TUFBTyxJQUFDLENBQUEsc0JBQUQsT0FBTTtNQUMvQiwwQ0FBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7SUFIVTs7dUJBS1osU0FBQSxHQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLElBQVo7TUFDUixRQUFBLEdBQVc7QUFDWCxXQUFBLHVDQUFBOztRQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsRUFBb0IsRUFBcEI7UUFDUCxJQUFPLElBQUEsS0FBUSxFQUFmO1VBQ0UsUUFBUSxDQUFDLElBQVQsQ0FBYztZQUFDLElBQUEsRUFBTSxJQUFQO1dBQWQsRUFERjs7QUFGRjtNQUlBLElBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBUlM7O3VCQVVYLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7dUJBRWQsSUFBQSxHQUFNLFNBQUE7O1FBQ0osSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7YUFDQSxJQUFDLENBQUEsbUJBQUQsQ0FBQTtJQUhJOzt1QkFLTixTQUFBLEdBQVcsU0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELENBQUE7SUFBSDs7dUJBRVgsSUFBQSxHQUFNLFNBQUE7QUFDSixVQUFBOytDQUFNLENBQUUsT0FBUixDQUFBO0lBREk7O3VCQUdOLFdBQUEsR0FBYSxTQUFDLEdBQUQ7QUFDWCxVQUFBO01BRGEsT0FBRDtNQUNaLE9BQUEsR0FBVTtNQUNWLElBQUcsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsR0FBaEIsQ0FBSDtRQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQVg7UUFDUCxPQUFBLEdBQVUsS0FGWjs7YUFHQSxFQUFBLENBQUcsU0FBQTtlQUNELElBQUMsQ0FBQSxFQUFELENBQUksSUFBSixFQUFVLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ1IsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDthQUFMLEVBQTBCLFNBQUE7Y0FDeEIsSUFBb0IsT0FBcEI7dUJBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTSxTQUFOLEVBQUE7O1lBRHdCLENBQTFCO1VBRFE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVY7TUFEQyxDQUFIO0lBTFc7O3VCQVViLFNBQUEsR0FBVyxTQUFDLEdBQUQ7QUFDVCxVQUFBO01BRFcsT0FBRDtNQUNWLElBQUMsQ0FBQSxLQUFELENBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxTQUFYLENBQXNCLENBQUEsQ0FBQSxDQUE3QjthQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7SUFGUzs7dUJBSVgsS0FBQSxHQUFPLFNBQUMsTUFBRDtBQUNMLFVBQUE7TUFBQSxRQUFBLEdBQVcsQ0FBQyxPQUFELENBQVMsQ0FBQyxNQUFWLENBQWlCLElBQUMsQ0FBQSxJQUFsQixDQUF1QixDQUFDLE1BQXhCLENBQStCLENBQUMsTUFBRCxDQUEvQjthQUNYLEdBQUcsQ0FBQyxHQUFKLENBQVEsUUFBUixFQUFrQjtRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUFsQixFQUFvRDtRQUFDLEtBQUEsRUFBTyxJQUFSO09BQXBELENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7VUFDSixpQkFBaUIsQ0FBQyxNQUFsQixDQUFBLENBQTBCLENBQUMsVUFBM0IsQ0FBc0MsSUFBdEMsQ0FBMkMsQ0FBQyxNQUE1QyxDQUFBO1VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQUEsQ0FBK0IsQ0FBQyxPQUFoQyxDQUF3QyxTQUFDLE1BQUQ7bUJBQ3RDLEVBQUUsQ0FBQyxNQUFILENBQVUsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFWLEVBQTRCLFNBQUMsS0FBRDtjQUFXLElBQW9CLENBQUksS0FBeEI7dUJBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBQSxFQUFBOztZQUFYLENBQTVCO1VBRHNDLENBQXhDO2lCQUVBLEdBQUcsQ0FBQyxPQUFKLENBQVksS0FBQyxDQUFBLElBQWI7UUFKSTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixDQU1BLEVBQUMsS0FBRCxFQU5BLENBTU8sU0FBQyxHQUFEO2VBQ0wsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsR0FBbEI7TUFESyxDQU5QO0lBRks7Ozs7S0ExQ2M7QUFQdkIiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG57JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuT3V0cHV0Vmlld01hbmFnZXIgPSByZXF1aXJlICcuLi9vdXRwdXQtdmlldy1tYW5hZ2VyJ1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICBpbml0aWFsaXplOiAoQHJlcG8sIEBkYXRhLCBAYXJncz1bXSkgLT5cbiAgICBzdXBlclxuICAgIEBzaG93KClcbiAgICBAcGFyc2VEYXRhKClcblxuICBwYXJzZURhdGE6IC0+XG4gICAgaXRlbXMgPSBAZGF0YS5zcGxpdChcIlxcblwiKVxuICAgIGJyYW5jaGVzID0gW11cbiAgICBmb3IgaXRlbSBpbiBpdGVtc1xuICAgICAgaXRlbSA9IGl0ZW0ucmVwbGFjZSgvXFxzL2csICcnKVxuICAgICAgdW5sZXNzIGl0ZW0gaXMgJydcbiAgICAgICAgYnJhbmNoZXMucHVzaCB7bmFtZTogaXRlbX1cbiAgICBAc2V0SXRlbXMgYnJhbmNoZXNcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIGdldEZpbHRlcktleTogLT4gJ25hbWUnXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT5cbiAgICBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoe25hbWV9KSAtPlxuICAgIGN1cnJlbnQgPSBmYWxzZVxuICAgIGlmIG5hbWUuc3RhcnRzV2l0aCBcIipcIlxuICAgICAgbmFtZSA9IG5hbWUuc2xpY2UoMSlcbiAgICAgIGN1cnJlbnQgPSB0cnVlXG4gICAgJCQgLT5cbiAgICAgIEBsaSBuYW1lLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgQHNwYW4oJ0N1cnJlbnQnKSBpZiBjdXJyZW50XG5cbiAgY29uZmlybWVkOiAoe25hbWV9KSAtPlxuICAgIEBtZXJnZSBuYW1lLm1hdGNoKC9cXCo/KC4qKS8pWzFdXG4gICAgQGNhbmNlbCgpXG5cbiAgbWVyZ2U6IChicmFuY2gpIC0+XG4gICAgbWVyZ2VBcmcgPSBbJ21lcmdlJ10uY29uY2F0KEBhcmdzKS5jb25jYXQgW2JyYW5jaF1cbiAgICBnaXQuY21kKG1lcmdlQXJnLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgIE91dHB1dFZpZXdNYW5hZ2VyLmNyZWF0ZSgpLnNldENvbnRlbnQoZGF0YSkuZmluaXNoKClcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaCAoZWRpdG9yKSAtPlxuICAgICAgICBmcy5leGlzdHMgZWRpdG9yLmdldFBhdGgoKSwgKGV4aXN0KSAtPiBlZGl0b3IuZGVzdHJveSgpIGlmIG5vdCBleGlzdFxuICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiAgICAuY2F0Y2ggKG1zZykgLT5cbiAgICAgIG5vdGlmaWVyLmFkZEVycm9yIG1zZ1xuIl19
