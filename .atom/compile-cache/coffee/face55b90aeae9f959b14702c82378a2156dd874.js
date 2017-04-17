(function() {
  var $, $$, EditorView, SelectListMultipleView, SelectStageFilesView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, EditorView = ref.EditorView;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageFilesView = (function(superClass) {
    var prettify;

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

    SelectStageFilesView.prototype.addButtons = function() {
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
                "class": 'btn btn-success inline-block-tight btn-remove-button'
              }, 'Remove');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-remove-button')) {
            if (window.confirm('Are you sure?')) {
              _this.complete();
            }
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
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(item);
            }
          };
        })(this));
      });
    };

    SelectStageFilesView.prototype.completed = function(items) {
      var currentFile, editor, files, item, ref1;
      files = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = items.length; j < len; j++) {
          item = items[j];
          if (item !== '') {
            results.push(item);
          }
        }
        return results;
      })();
      this.cancel();
      currentFile = this.repo.relativize((ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0);
      editor = atom.workspace.getActiveTextEditor();
      if (indexOf.call(files, currentFile) >= 0) {
        atom.views.getView(editor).remove();
      }
      return git.cmd(['rm', '-f'].concat(files), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        return notifier.addSuccess("Removed " + (prettify(data)));
      });
    };

    prettify = function(data) {
      var file, i, j, len, results;
      data = data.match(/rm ('.*')/g);
      if ((data != null ? data.length : void 0) >= 1) {
        results = [];
        for (i = j = 0, len = data.length; j < len; i = ++j) {
          file = data[i];
          results.push(data[i] = ' ' + file.match(/rm '(.*)'/)[1]);
        }
        return results;
      }
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9yZW1vdmUtbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsbUZBQUE7SUFBQTs7OztFQUFBLE1BQXNCLE9BQUEsQ0FBUSxzQkFBUixDQUF0QixFQUFDLFNBQUQsRUFBSSxXQUFKLEVBQVE7O0VBRVIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxzQkFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVI7O0VBRXpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixRQUFBOzs7Ozs7OzttQ0FBQSxVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsS0FBUjtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQ1gsc0RBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVY7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQUpVOzttQ0FNWixVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxVQUFBLEdBQWEsRUFBQSxDQUFHLFNBQUE7ZUFDZCxJQUFDLENBQUEsR0FBRCxDQUFLO1VBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUFQO1NBQUwsRUFBdUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtZQUNyQixLQUFDLENBQUEsSUFBRCxDQUFNO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFQO2FBQU4sRUFBMEIsU0FBQTtxQkFDeEIsS0FBQyxDQUFBLE1BQUQsQ0FBUTtnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG9EQUFQO2VBQVIsRUFBcUUsUUFBckU7WUFEd0IsQ0FBMUI7bUJBRUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtjQUFBLENBQUEsS0FBQSxD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QWdCLENBQW5CO0FBQ0U7YUFBQSw4Q0FBQTs7dUJBQ0UsSUFBSyxDQUFBLENBQUEsQ0FBTCxHQUFVLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLFdBQVgsQ0FBd0IsQ0FBQSxDQUFBO0FBRDFDO3VCQURGOztJQUZTOzs7O0tBaERzQjtBQVBuQyIsInNvdXJjZXNDb250ZW50IjpbInskLCAkJCwgRWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcblNlbGVjdExpc3RNdWx0aXBsZVZpZXcgPSByZXF1aXJlICcuL3NlbGVjdC1saXN0LW11bHRpcGxlLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNlbGVjdFN0YWdlRmlsZXNWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdE11bHRpcGxlVmlld1xuXG4gIGluaXRpYWxpemU6IChAcmVwbywgaXRlbXMpIC0+XG4gICAgc3VwZXJcbiAgICBAc2hvdygpXG4gICAgQHNldEl0ZW1zIGl0ZW1zXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBhZGRCdXR0b25zOiAtPlxuICAgIHZpZXdCdXR0b24gPSAkJCAtPlxuICAgICAgQGRpdiBjbGFzczogJ2J1dHRvbnMnLCA9PlxuICAgICAgICBAc3BhbiBjbGFzczogJ3B1bGwtbGVmdCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tZXJyb3IgaW5saW5lLWJsb2NrLXRpZ2h0IGJ0bi1jYW5jZWwtYnV0dG9uJywgJ0NhbmNlbCdcbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1zdWNjZXNzIGlubGluZS1ibG9jay10aWdodCBidG4tcmVtb3ZlLWJ1dHRvbicsICdSZW1vdmUnXG4gICAgdmlld0J1dHRvbi5hcHBlbmRUbyh0aGlzKVxuXG4gICAgQG9uICdjbGljaycsICdidXR0b24nLCAoe3RhcmdldH0pID0+XG4gICAgICBpZiAkKHRhcmdldCkuaGFzQ2xhc3MoJ2J0bi1yZW1vdmUtYnV0dG9uJylcbiAgICAgICAgQGNvbXBsZXRlKCkgaWYgd2luZG93LmNvbmZpcm0gJ0FyZSB5b3Ugc3VyZT8nXG4gICAgICBAY2FuY2VsKCkgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tY2FuY2VsLWJ1dHRvbicpXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPlxuICAgIEBoaWRlKClcblxuICBoaWRlOiAtPlxuICAgIEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06IChpdGVtLCBtYXRjaGVkU3RyKSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgPT5cbiAgICAgICAgaWYgbWF0Y2hlZFN0cj8gdGhlbiBAcmF3KG1hdGNoZWRTdHIpIGVsc2UgQHNwYW4gaXRlbVxuXG4gIGNvbXBsZXRlZDogKGl0ZW1zKSAtPlxuICAgIGZpbGVzID0gKGl0ZW0gZm9yIGl0ZW0gaW4gaXRlbXMgd2hlbiBpdGVtIGlzbnQgJycpXG4gICAgQGNhbmNlbCgpXG4gICAgY3VycmVudEZpbGUgPSBAcmVwby5yZWxhdGl2aXplIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpXG5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKS5yZW1vdmUoKSBpZiBjdXJyZW50RmlsZSBpbiBmaWxlc1xuICAgIGdpdC5jbWQoWydybScsICctZiddLmNvbmNhdChmaWxlcyksIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPiBub3RpZmllci5hZGRTdWNjZXNzIFwiUmVtb3ZlZCAje3ByZXR0aWZ5IGRhdGF9XCJcblxuICBwcmV0dGlmeSA9IChkYXRhKSAtPlxuICAgIGRhdGEgPSBkYXRhLm1hdGNoKC9ybSAoJy4qJykvZylcbiAgICBpZiBkYXRhPy5sZW5ndGggPj0gMVxuICAgICAgZm9yIGZpbGUsIGkgaW4gZGF0YVxuICAgICAgICBkYXRhW2ldID0gJyAnICsgZmlsZS5tYXRjaCgvcm0gJyguKiknLylbMV1cbiJdfQ==
