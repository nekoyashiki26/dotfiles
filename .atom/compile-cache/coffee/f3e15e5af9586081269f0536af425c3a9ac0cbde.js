(function() {
  var CompositeDisposable, Housekeeping, Mixin, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require("fs-plus");

  path = require("path");

  Mixin = require('mixto');

  module.exports = Housekeeping = (function(superClass) {
    extend(Housekeeping, superClass);

    function Housekeeping() {
      return Housekeeping.__super__.constructor.apply(this, arguments);
    }

    Housekeeping.prototype.initializeHousekeeping = function() {
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          _this.cancelUpdate();
          _this.destroyDecoration();
          return _this.subscriptions.dispose();
        };
      })(this)));
      if (this.repositoryForPath(this.editor.getPath())) {
        this.subscribeToRepository();
        this.subscriptions.add(this.editor.onDidStopChanging(this.notifyContentsModified));
        this.subscriptions.add(this.editor.onDidChangePath(this.notifyContentsModified));
        this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
          return function() {
            return _this.notifyChangeCursorPosition();
          };
        })(this)));
        this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
          return function() {
            return _this.subscribeToRepository();
          };
        })(this)));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:toggle-git-diff-details', (function(_this) {
          return function() {
            return _this.toggleShowDiffDetails();
          };
        })(this)));
        this.subscriptions.add(atom.commands.add(this.editorView, {
          'core:close': (function(_this) {
            return function(e) {
              return _this.closeDiffDetails();
            };
          })(this),
          'core:cancel': (function(_this) {
            return function(e) {
              return _this.closeDiffDetails();
            };
          })(this)
        }));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:undo', (function(_this) {
          return function(e) {
            if (_this.showDiffDetails) {
              return _this.undo();
            } else {
              return e.abortKeyBinding();
            }
          };
        })(this)));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:copy', (function(_this) {
          return function(e) {
            if (_this.showDiffDetails) {
              return _this.copy();
            } else {
              return e.abortKeyBinding();
            }
          };
        })(this)));
        return this.scheduleUpdate();
      } else {
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:toggle-git-diff-details', function(e) {
          return e.abortKeyBinding();
        }));
        this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:undo', function(e) {
          return e.abortKeyBinding();
        }));
        return this.subscriptions.add(atom.commands.add(this.editorView, 'git-diff-details:copy', function(e) {
          return e.abortKeyBinding();
        }));
      }
    };

    Housekeeping.prototype.repositoryForPath = function(goalPath) {
      var directory, i, j, len, ref;
      ref = atom.project.getDirectories();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        directory = ref[i];
        if (goalPath === directory.getPath() || directory.contains(goalPath)) {
          return atom.project.getRepositories()[i];
        }
      }
      return null;
    };

    Housekeeping.prototype.subscribeToRepository = function() {
      var repository;
      if (repository = this.repositoryForPath(this.editor.getPath())) {
        this.subscriptions.add(repository.onDidChangeStatuses((function(_this) {
          return function() {
            return _this.scheduleUpdate();
          };
        })(this)));
        return this.subscriptions.add(repository.onDidChangeStatus((function(_this) {
          return function(changedPath) {
            if (changedPath === _this.editor.getPath()) {
              return _this.scheduleUpdate();
            }
          };
        })(this)));
      }
    };

    Housekeeping.prototype.unsubscribeFromCursor = function() {
      var ref;
      if ((ref = this.cursorSubscription) != null) {
        ref.dispose();
      }
      return this.cursorSubscription = null;
    };

    Housekeeping.prototype.cancelUpdate = function() {
      return clearImmediate(this.immediateId);
    };

    Housekeeping.prototype.scheduleUpdate = function() {
      this.cancelUpdate();
      return this.immediateId = setImmediate(this.notifyContentsModified);
    };

    return Housekeeping;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1kaWZmLWRldGFpbHMvbGliL2hvdXNla2VlcGluZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGtEQUFBO0lBQUE7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0VBRVIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7MkJBQ3JCLHNCQUFBLEdBQXdCLFNBQUE7TUFDdEIsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxtQkFBQSxDQUFBO01BQ3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3RDLEtBQUMsQ0FBQSxZQUFELENBQUE7VUFDQSxLQUFDLENBQUEsaUJBQUQsQ0FBQTtpQkFDQSxLQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtRQUhzQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsQ0FBbkI7TUFLQSxJQUFHLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUFuQixDQUFIO1FBQ0UsSUFBQyxDQUFBLHFCQUFELENBQUE7UUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixJQUFDLENBQUEsc0JBQTNCLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsZUFBUixDQUF3QixJQUFDLENBQUEsc0JB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ckIsVUFBQTs7V0FBbUIsQ0FBRSxPQUFyQixDQUFBOzthQUNBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQjtJQUZEOzsyQkFJdkIsWUFBQSxHQUFjLFNBQUE7YUFDWixjQUFBLENBQWUsSUFBQyxDQUFBLFdBQWhCO0lBRFk7OzJCQUdkLGNBQUEsR0FBZ0IsU0FBQTtNQUNkLElBQUMsQ0FBQSxZQUFELENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLFlBQUEsQ0FBYSxJQUFDLENBQUEsc0JBQWQ7SUFGRDs7OztLQTlEMEI7QUFONUMiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuZnMgPSByZXF1aXJlIFwiZnMtcGx1c1wiXG5wYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuXG5NaXhpbiA9IHJlcXVpcmUgJ21peHRvJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEhvdXNla2VlcGluZyBleHRlbmRzIE1peGluXG4gIGluaXRpYWxpemVIb3VzZWtlZXBpbmc6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWREZXN0cm95ID0+XG4gICAgICBAY2FuY2VsVXBkYXRlKClcbiAgICAgIEBkZXN0cm95RGVjb3JhdGlvbigpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICAgIGlmIEByZXBvc2l0b3J5Rm9yUGF0aChAZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgIEBzdWJzY3JpYmVUb1JlcG9zaXRvcnkoKVxuXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQoQGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZyhAbm90aWZ5Q29udGVudHNNb2RpZmllZCkpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQoQGVkaXRvci5vbkRpZENoYW5nZVBhdGgoQG5vdGlmeUNvbnRlbnRzTW9kaWZpZWQpKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkKEBlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbig9PiBAbm90aWZ5Q2hhbmdlQ3Vyc29yUG9zaXRpb24oKSkpXG5cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocyA9PiBAc3Vic2NyaWJlVG9SZXBvc2l0b3J5KClcblxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIEBlZGl0b3JWaWV3LCAnZ2l0LWRpZmYtZGV0YWlsczp0b2dnbGUtZ2l0LWRpZmYtZGV0YWlscycsID0+XG4gICAgICAgIEB0b2dnbGVTaG93RGlmZkRldGFpbHMoKVxuXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgQGVkaXRvclZpZXcsXG4gICAgICAgICdjb3JlOmNsb3NlJzogKGUpID0+IEBjbG9zZURpZmZEZXRhaWxzKClcbiAgICAgICAgJ2NvcmU6Y2FuY2VsJzogKGUpID0+IEBjbG9zZURpZmZEZXRhaWxzKClcblxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIEBlZGl0b3JWaWV3LCAnZ2l0LWRpZmYtZGV0YWlsczp1bmRvJywgKGUpID0+XG4gICAgICAgIGlmIEBzaG93RGlmZkRldGFpbHMgdGhlbiBAdW5kbygpIGVsc2UgZS5hYm9ydEtleUJpbmRpbmcoKVxuXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgQGVkaXRvclZpZXcsICdnaXQtZGlmZi1kZXRhaWxzOmNvcHknLCAoZSkgPT5cbiAgICAgICAgaWYgQHNob3dEaWZmRGV0YWlscyB0aGVuIEBjb3B5KCkgZWxzZSBlLmFib3J0S2V5QmluZGluZygpXG5cbiAgICAgIEBzY2hlZHVsZVVwZGF0ZSgpXG4gICAgZWxzZVxuICAgICAgIyBieXBhc3MgYWxsIGtleWJpbmRpbmdzXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgQGVkaXRvclZpZXcsICdnaXQtZGlmZi1kZXRhaWxzOnRvZ2dsZS1naXQtZGlmZi1kZXRhaWxzJywgKGUpIC0+XG4gICAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIEBlZGl0b3JWaWV3LCAnZ2l0LWRpZmYtZGV0YWlsczp1bmRvJywgKGUpIC0+XG4gICAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIEBlZGl0b3JWaWV3LCAnZ2l0LWRpZmYtZGV0YWlsczpjb3B5JywgKGUpIC0+XG4gICAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICByZXBvc2l0b3J5Rm9yUGF0aDogKGdvYWxQYXRoKSAtPlxuICAgIGZvciBkaXJlY3RvcnksIGkgaW4gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClcbiAgICAgIGlmIGdvYWxQYXRoIGlzIGRpcmVjdG9yeS5nZXRQYXRoKCkgb3IgZGlyZWN0b3J5LmNvbnRhaW5zKGdvYWxQYXRoKVxuICAgICAgICByZXR1cm4gYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpW2ldXG4gICAgbnVsbFxuXG4gIHN1YnNjcmliZVRvUmVwb3NpdG9yeTogLT5cbiAgICBpZiByZXBvc2l0b3J5ID0gQHJlcG9zaXRvcnlGb3JQYXRoKEBlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIHJlcG9zaXRvcnkub25EaWRDaGFuZ2VTdGF0dXNlcyA9PlxuICAgICAgICBAc2NoZWR1bGVVcGRhdGUoKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIHJlcG9zaXRvcnkub25EaWRDaGFuZ2VTdGF0dXMgKGNoYW5nZWRQYXRoKSA9PlxuICAgICAgICBAc2NoZWR1bGVVcGRhdGUoKSBpZiBjaGFuZ2VkUGF0aCBpcyBAZWRpdG9yLmdldFBhdGgoKVxuXG4gIHVuc3Vic2NyaWJlRnJvbUN1cnNvcjogLT5cbiAgICBAY3Vyc29yU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAY3Vyc29yU3Vic2NyaXB0aW9uID0gbnVsbFxuXG4gIGNhbmNlbFVwZGF0ZTogLT5cbiAgICBjbGVhckltbWVkaWF0ZShAaW1tZWRpYXRlSWQpXG5cbiAgc2NoZWR1bGVVcGRhdGU6IC0+XG4gICAgQGNhbmNlbFVwZGF0ZSgpXG4gICAgQGltbWVkaWF0ZUlkID0gc2V0SW1tZWRpYXRlKEBub3RpZnlDb250ZW50c01vZGlmaWVkKVxuIl19
