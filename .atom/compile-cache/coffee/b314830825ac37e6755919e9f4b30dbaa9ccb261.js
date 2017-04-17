(function() {
  var $, $$, SelectListMultipleView, SelectStageFilesView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageFilesView = (function(superClass) {
    extend(SelectStageFilesView, superClass);

    function SelectStageFilesView() {
      return SelectStageFilesView.__super__.constructor.apply(this, arguments);
    }

    SelectStageFilesView.prototype.initialize = function(repo, items) {
      this.repo = repo;
      SelectStageFilesView.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    SelectStageFilesView.prototype.getFilterKey = function() {
      return 'path';
    };

    SelectStageFilesView.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'select-list-buttons'
        }, (function(_this) {
          return function() {
            _this.div(function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.div(function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-stage-button'
              }, 'Stage');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-stage-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageFilesView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageFilesView.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageFilesView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    SelectStageFilesView.prototype.viewForItem = function(item, matchedStr) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'pull-right'
            }, function() {
              return _this.span({
                "class": 'inline-block highlight'
              }, item.mode);
            });
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(item.path);
            }
          };
        })(this));
      });
    };

    SelectStageFilesView.prototype.completed = function(items) {
      var files, item;
      files = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = items.length; i < len; i++) {
          item = items[i];
          results.push(item.path);
        }
        return results;
      })();
      this.cancel();
      return git.cmd(['add', '-f'].concat(files), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        if (data === '') {
          return notifier.addSuccess('File(s) staged successfully');
        } else {
          return notifier.addSuccess(data);
        }
      });
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9zZWxlY3Qtc3RhZ2UtZmlsZXMtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHVFQUFBO0lBQUE7OztFQUFBLE1BQVUsT0FBQSxDQUFRLHNCQUFSLENBQVYsRUFBQyxTQUFELEVBQUk7O0VBRUosR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxzQkFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVI7O0VBRXpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7bUNBRUosVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLEtBQVI7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUNYLHNEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFKVTs7bUNBTVosWUFBQSxHQUFjLFNBQUE7YUFBRztJQUFIOzttQ0FFZCxVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxVQUFBLEdBQWEsRUFBQSxDQUFHLFNBQUE7ZUFDZCxJQUFDLENBQUEsR0FBRCxDQUFLO1VBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxxQkFBUDtTQUFMLEVBQW1DLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDakMsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBO3FCQUNILEtBQUMsQ0FBQSxNQUFELENBQVE7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxvREFBUDtlQUFSLEVBQXFFLFFBQXJFO1lBREcsQ0FBTDttQkFFQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUE7cUJBQ0gsS0FBQyxDQUFBLE1BQUQsQ0FBUTtnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHFEQUFQO2VBQVIsRUFBc0UsT0FBdEU7WUFERyxDQUFMO1VBSGlDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQztNQURjLENBQUg7TUFNYixVQUFVLENBQUMsUUFBWCxDQUFvQixJQUFwQjthQUVBLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLFFBQWIsRUFBdUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7QUFDckIsY0FBQTtVQUR1QixTQUFEO1VBQ3RCLElBQWUsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLFFBQVYsQ0FBbUIsa0JBQW5CLENBQWY7WUFBQSxLQUFDLENBQUEsUUFBRCxDQUFBLEVBQUE7O1VBQ0EsSUFBYSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsUUFBVixDQUFtQixtQkFBbkIsQ0FBYjttQkFBQSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUE7O1FBRnFCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QjtJQVRVOzttQ0FhWixJQUFBLEdBQU0sU0FBQTs7UUFDSixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTthQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO0lBSEk7O21DQUtOLFNBQUEsR0FBVyxTQUFBO2FBQUcsSUFBQyxDQUFBLElBQUQsQ0FBQTtJQUFIOzttQ0FFWCxJQUFBLEdBQU0sU0FBQTtBQUFHLFVBQUE7K0NBQU0sQ0FBRSxPQUFSLENBQUE7SUFBSDs7bUNBRU4sV0FBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLFVBQVA7YUFDWCxFQUFBLENBQUcsU0FBQTtlQUNELElBQUMsQ0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtZQUNGLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7YUFBTCxFQUEwQixTQUFBO3FCQUN4QixLQUFDLENBQUEsSUFBRCxDQUFNO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sd0JBQVA7ZUFBTixFQUF1QyxJQUFJLENBQUMsSUFBNUM7WUFEd0IsQ0FBMUI7WUFFQSxJQUFHLGtCQUFIO3FCQUFvQixLQUFDLENBQUEsR0FBRCxDQUFLLFVBQUwsRUFBcEI7YUFBQSxNQUFBO3FCQUEwQyxLQUFDLENBQUEsSUFBRCxDQUFNLElBQUksQ0FBQyxJQUFYLEVBQTFDOztVQUhFO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFKO01BREMsQ0FBSDtJQURXOzttQ0FPYixTQUFBLEdBQVcsU0FBQyxLQUFEO0FBQ1QsVUFBQTtNQUFBLEtBQUE7O0FBQVM7YUFBQSx1Q0FBQTs7dUJBQUEsSUFBSSxDQUFDO0FBQUw7OztNQUNULElBQUMsQ0FBQSxNQUFELENBQUE7YUFDQSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsS0FBRCxFQUFRLElBQVIsQ0FBYSxDQUFDLE1BQWQsQ0FBcUIsS0FBckIsQ0FBUixFQUFxQztRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUFyQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtRQUNKLElBQUcsSUFBQSxLQUFRLEVBQVg7aUJBQ0UsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsNkJBQXBCLEVBREY7U0FBQSxNQUFBO2lCQUdFLFFBQVEsQ0FBQyxVQUFULENBQW9CLElBQXBCLEVBSEY7O01BREksQ0FETjtJQUhTOzs7O0tBdkNzQjtBQVBuQyIsInNvdXJjZXNDb250ZW50IjpbInskLCAkJH0gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcblNlbGVjdExpc3RNdWx0aXBsZVZpZXcgPSByZXF1aXJlICcuL3NlbGVjdC1saXN0LW11bHRpcGxlLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNlbGVjdFN0YWdlRmlsZXNWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdE11bHRpcGxlVmlld1xuXG4gIGluaXRpYWxpemU6IChAcmVwbywgaXRlbXMpIC0+XG4gICAgc3VwZXJcbiAgICBAc2hvdygpXG4gICAgQHNldEl0ZW1zIGl0ZW1zXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBnZXRGaWx0ZXJLZXk6IC0+ICdwYXRoJ1xuXG4gIGFkZEJ1dHRvbnM6IC0+XG4gICAgdmlld0J1dHRvbiA9ICQkIC0+XG4gICAgICBAZGl2IGNsYXNzOiAnc2VsZWN0LWxpc3QtYnV0dG9ucycsID0+XG4gICAgICAgIEBkaXYgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1lcnJvciBpbmxpbmUtYmxvY2stdGlnaHQgYnRuLWNhbmNlbC1idXR0b24nLCAnQ2FuY2VsJ1xuICAgICAgICBAZGl2ID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tc3VjY2VzcyBpbmxpbmUtYmxvY2stdGlnaHQgYnRuLXN0YWdlLWJ1dHRvbicsICdTdGFnZSdcbiAgICB2aWV3QnV0dG9uLmFwcGVuZFRvKHRoaXMpXG5cbiAgICBAb24gJ2NsaWNrJywgJ2J1dHRvbicsICh7dGFyZ2V0fSkgPT5cbiAgICAgIEBjb21wbGV0ZSgpIGlmICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuLXN0YWdlLWJ1dHRvbicpXG4gICAgICBAY2FuY2VsKCkgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tY2FuY2VsLWJ1dHRvbicpXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKGl0ZW0sIG1hdGNoZWRTdHIpIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgQHNwYW4gY2xhc3M6ICdpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0JywgaXRlbS5tb2RlXG4gICAgICAgIGlmIG1hdGNoZWRTdHI/IHRoZW4gQHJhdyhtYXRjaGVkU3RyKSBlbHNlIEBzcGFuIGl0ZW0ucGF0aFxuXG4gIGNvbXBsZXRlZDogKGl0ZW1zKSAtPlxuICAgIGZpbGVzID0gKGl0ZW0ucGF0aCBmb3IgaXRlbSBpbiBpdGVtcylcbiAgICBAY2FuY2VsKClcbiAgICBnaXQuY21kKFsnYWRkJywgJy1mJ10uY29uY2F0KGZpbGVzKSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBpZiBkYXRhIGlzICcnXG4gICAgICAgIG5vdGlmaWVyLmFkZFN1Y2Nlc3MgJ0ZpbGUocykgc3RhZ2VkIHN1Y2Nlc3NmdWxseSdcbiAgICAgIGVsc2VcbiAgICAgICAgbm90aWZpZXIuYWRkU3VjY2VzcyBkYXRhXG4iXX0=
