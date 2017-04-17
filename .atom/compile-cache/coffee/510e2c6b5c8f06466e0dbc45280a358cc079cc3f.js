(function() {
  var $, $$, CherryPickSelectCommits, SelectListMultipleView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = CherryPickSelectCommits = (function(superClass) {
    extend(CherryPickSelectCommits, superClass);

    function CherryPickSelectCommits() {
      return CherryPickSelectCommits.__super__.constructor.apply(this, arguments);
    }

    CherryPickSelectCommits.prototype.initialize = function(repo, data) {
      var item;
      this.repo = repo;
      CherryPickSelectCommits.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = data.length; i < len; i++) {
          item = data[i];
          item = item.split('\n');
          results.push({
            hash: item[0],
            author: item[1],
            time: item[2],
            subject: item[3]
          });
        }
        return results;
      })());
      return this.focusFilterEditor();
    };

    CherryPickSelectCommits.prototype.getFilterKey = function() {
      return 'hash';
    };

    CherryPickSelectCommits.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-pick-button'
              }, 'Cherry-Pick!');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-pick-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    CherryPickSelectCommits.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    CherryPickSelectCommits.prototype.cancelled = function() {
      return this.hide();
    };

    CherryPickSelectCommits.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    CherryPickSelectCommits.prototype.viewForItem = function(item, matchedStr) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight inline-block pull-right',
              style: 'font-family: monospace'
            }, function() {
              if (matchedStr != null) {
                return _this.raw(matchedStr);
              } else {
                return _this.span(item.hash);
              }
            });
            _this.div({
              "class": 'text-info'
            }, item.author + ", " + item.time);
            return _this.div({
              "class": 'text-warning'
            }, item.subject);
          };
        })(this));
      });
    };

    CherryPickSelectCommits.prototype.completed = function(items) {
      var commits;
      this.cancel();
      commits = items.map(function(item) {
        return item.hash;
      });
      return git.cmd(['cherry-pick'].concat(commits), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(msg) {
        return notifier.addSuccess(msg);
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    };

    return CherryPickSelectCommits;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9jaGVycnktcGljay1zZWxlY3QtY29tbWl0cy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMEVBQUE7SUFBQTs7O0VBQUEsTUFBVSxPQUFBLENBQVEsc0JBQVIsQ0FBVixFQUFDLFNBQUQsRUFBSTs7RUFFSixHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSw2QkFBUjs7RUFFekIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztzQ0FFSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsSUFBUjtBQUNWLFVBQUE7TUFEVyxJQUFDLENBQUEsT0FBRDtNQUNYLHlEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQ7O0FBQ0U7YUFBQSxzQ0FBQTs7VUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYO3VCQUNQO1lBQUMsSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLENBQVo7WUFBZ0IsTUFBQSxFQUFRLElBQUssQ0FBQSxDQUFBLENBQTdCO1lBQWlDLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxDQUE1QztZQUFnRCxPQUFBLEVBQVMsSUFBSyxDQUFBLENBQUEsQ0FBOUQ7O0FBRkY7O1VBREY7YUFLQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQVJVOztzQ0FVWixZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7O3NDQUVkLFVBQUEsR0FBWSxTQUFBO0FBQ1YsVUFBQTtNQUFBLFVBQUEsR0FBYSxFQUFBLENBQUcsU0FBQTtlQUNkLElBQUMsQ0FBQSxHQUFELENBQUs7VUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFP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dUIsT0FBdkIsQ0FBUixFQUF5QztRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUF6QyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsR0FBRDtlQUFTLFFBQVEsQ0FBQyxVQUFULENBQW9CLEdBQXBCO01BQVQsQ0FETixDQUVBLEVBQUMsS0FBRCxFQUZBLENBRU8sU0FBQyxHQUFEO2VBQVMsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsR0FBbEI7TUFBVCxDQUZQO0lBSFM7Ozs7S0E3Q3lCO0FBUHRDIiwic291cmNlc0NvbnRlbnQiOlsieyQsICQkfSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuU2VsZWN0TGlzdE11bHRpcGxlVmlldyA9IHJlcXVpcmUgJy4vc2VsZWN0LWxpc3QtbXVsdGlwbGUtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ2hlcnJ5UGlja1NlbGVjdENvbW1pdHMgZXh0ZW5kcyBTZWxlY3RMaXN0TXVsdGlwbGVWaWV3XG5cbiAgaW5pdGlhbGl6ZTogKEByZXBvLCBkYXRhKSAtPlxuICAgIHN1cGVyXG4gICAgQHNob3coKVxuICAgIEBzZXRJdGVtcyhcbiAgICAgIGZvciBpdGVtIGluIGRhdGFcbiAgICAgICAgaXRlbSA9IGl0ZW0uc3BsaXQoJ1xcbicpXG4gICAgICAgIHtoYXNoOiBpdGVtWzBdLCBhdXRob3I6IGl0ZW1bMV0sIHRpbWU6IGl0ZW1bMl0sIHN1YmplY3Q6IGl0ZW1bM119XG4gICAgKVxuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAnaGFzaCdcblxuICBhZGRCdXR0b25zOiAtPlxuICAgIHZpZXdCdXR0b24gPSAkJCAtPlxuICAgICAgQGRpdiBjbGFzczogJ2J1dHRvbnMnLCA9PlxuICAgICAgICBAc3BhbiBjbGFzczogJ3B1bGwtbGVmdCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tZXJyb3IgaW5saW5lLWJsb2NrLXRpZ2h0IGJ0bi1jYW5jZWwtYnV0dG9uJywgJ0NhbmNlbCdcbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1zdWNjZXNzIGlubGluZS1ibG9jay10aWdodCBidG4tcGljay1idXR0b24nLCAnQ2hlcnJ5LVBpY2shJ1xuICAgIHZpZXdCdXR0b24uYXBwZW5kVG8odGhpcylcblxuICAgIEBvbiAnY2xpY2snLCAnYnV0dG9uJywgKHt0YXJnZXR9KSA9PlxuICAgICAgQGNvbXBsZXRlKCkgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tcGljay1idXR0b24nKVxuICAgICAgQGNhbmNlbCgpIGlmICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuLWNhbmNlbC1idXR0b24nKVxuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG5cbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKGl0ZW0sIG1hdGNoZWRTdHIpIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC1oaWdobGlnaHQgaW5saW5lLWJsb2NrIHB1bGwtcmlnaHQnLCBzdHlsZTogJ2ZvbnQtZmFtaWx5OiBtb25vc3BhY2UnLCA9PlxuICAgICAgICAgIGlmIG1hdGNoZWRTdHI/IHRoZW4gQHJhdyhtYXRjaGVkU3RyKSBlbHNlIEBzcGFuIGl0ZW0uaGFzaFxuICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC1pbmZvJywgXCIje2l0ZW0uYXV0aG9yfSwgI3tpdGVtLnRpbWV9XCJcbiAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtd2FybmluZycsIGl0ZW0uc3ViamVjdFxuXG4gIGNvbXBsZXRlZDogKGl0ZW1zKSAtPlxuICAgIEBjYW5jZWwoKVxuICAgIGNvbW1pdHMgPSBpdGVtcy5tYXAgKGl0ZW0pIC0+IGl0ZW0uaGFzaFxuICAgIGdpdC5jbWQoWydjaGVycnktcGljayddLmNvbmNhdChjb21taXRzKSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKG1zZykgLT4gbm90aWZpZXIuYWRkU3VjY2VzcyBtc2dcbiAgICAuY2F0Y2ggKG1zZykgLT4gbm90aWZpZXIuYWRkRXJyb3IgbXNnXG4iXX0=
