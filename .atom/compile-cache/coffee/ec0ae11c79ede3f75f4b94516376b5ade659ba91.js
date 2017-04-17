(function() {
  var CompositeDisposable, MinimapGitDiffBinding, repositoryForPath,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  repositoryForPath = require('./helpers').repositoryForPath;

  module.exports = MinimapGitDiffBinding = (function() {
    MinimapGitDiffBinding.prototype.active = false;

    function MinimapGitDiffBinding(minimap) {
      var repository;
      this.minimap = minimap;
      this.destroy = bind(this.destroy, this);
      this.updateDiffs = bind(this.updateDiffs, this);
      this.decorations = {};
      this.markers = null;
      this.subscriptions = new CompositeDisposable;
      if (this.minimap == null) {
        return console.warn('minimap-git-diff binding created without a minimap');
      }
      this.editor = this.minimap.getTextEditor();
      this.subscriptions.add(this.minimap.onDidDestroy(this.destroy));
      if (repository = this.getRepo()) {
        this.subscriptions.add(this.editor.getBuffer().onDidStopChanging(this.updateDiffs));
        this.subscriptions.add(repository.onDidChangeStatuses((function(_this) {
          return function() {
            return _this.scheduleUpdate();
          };
        })(this)));
        this.subscriptions.add(repository.onDidChangeStatus((function(_this) {
          return function(changedPath) {
            if (changedPath === _this.editor.getPath()) {
              return _this.scheduleUpdate();
            }
          };
        })(this)));
        this.subscriptions.add(repository.onDidDestroy((function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)));
        this.subscriptions.add(atom.config.observe('minimap-git-diff.useGutterDecoration', (function(_this) {
          return function(useGutterDecoration) {
            _this.useGutterDecoration = useGutterDecoration;
            return _this.scheduleUpdate();
          };
        })(this)));
      }
      this.scheduleUpdate();
    }

    MinimapGitDiffBinding.prototype.cancelUpdate = function() {
      return clearImmediate(this.immediateId);
    };

    MinimapGitDiffBinding.prototype.scheduleUpdate = function() {
      this.cancelUpdate();
      return this.immediateId = setImmediate(this.updateDiffs);
    };

    MinimapGitDiffBinding.prototype.updateDiffs = function() {
      this.removeDecorations();
      if (this.getPath() && (this.diffs = this.getDiffs())) {
        return this.addDecorations(this.diffs);
      }
    };

    MinimapGitDiffBinding.prototype.addDecorations = function(diffs) {
      var endRow, i, len, newLines, newStart, oldLines, oldStart, ref, results, startRow;
      results = [];
      for (i = 0, len = diffs.length; i < len; i++) {
        ref = diffs[i], oldStart = ref.oldStart, newStart = ref.newStart, oldLines = ref.oldLines, newLines = ref.newLines;
        startRow = newStart - 1;
        endRow = newStart + newLines - 2;
        if (oldLines === 0 && newLines > 0) {
          results.push(this.markRange(startRow, endRow, '.git-line-added'));
        } else if (newLines === 0 && oldLines > 0) {
          results.push(this.markRange(startRow, startRow, '.git-line-removed'));
        } else {
          results.push(this.markRange(startRow, endRow, '.git-line-modified'));
        }
      }
      return results;
    };

    MinimapGitDiffBinding.prototype.removeDecorations = function() {
      var i, len, marker, ref;
      if (this.markers == null) {
        return;
      }
      ref = this.markers;
      for (i = 0, len = ref.length; i < len; i++) {
        marker = ref[i];
        marker.destroy();
      }
      return this.markers = null;
    };

    MinimapGitDiffBinding.prototype.markRange = function(startRow, endRow, scope) {
      var marker, type;
      if (this.editor.isDestroyed()) {
        return;
      }
      marker = this.editor.markBufferRange([[startRow, 0], [endRow, 2e308]], {
        invalidate: 'never'
      });
      type = this.useGutterDecoration ? 'gutter' : 'line';
      this.minimap.decorateMarker(marker, {
        type: type,
        scope: ".minimap ." + type + " " + scope,
        plugin: 'git-diff'
      });
      if (this.markers == null) {
        this.markers = [];
      }
      return this.markers.push(marker);
    };

    MinimapGitDiffBinding.prototype.destroy = function() {
      this.removeDecorations();
      this.subscriptions.dispose();
      this.diffs = null;
      return this.minimap = null;
    };

    MinimapGitDiffBinding.prototype.getPath = function() {
      var ref;
      return (ref = this.editor.getBuffer()) != null ? ref.getPath() : void 0;
    };

    MinimapGitDiffBinding.prototype.getRepositories = function() {
      return atom.project.getRepositories().filter(function(repo) {
        return repo != null;
      });
    };

    MinimapGitDiffBinding.prototype.getRepo = function() {
      return this.repository != null ? this.repository : this.repository = repositoryForPath(this.editor.getPath());
    };

    MinimapGitDiffBinding.prototype.getDiffs = function() {
      var e, ref;
      try {
        return (ref = this.getRepo()) != null ? ref.getLineDiffs(this.getPath(), this.editor.getBuffer().getText()) : void 0;
      } catch (error) {
        e = error;
        return null;
      }
    };

    return MinimapGitDiffBinding;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAtZ2l0LWRpZmYvbGliL21pbmltYXAtZ2l0LWRpZmYtYmluZGluZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDZEQUFBO0lBQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN2QixvQkFBcUIsT0FBQSxDQUFRLFdBQVI7O0VBRXRCLE1BQU0sQ0FBQyxPQUFQLEdBQ007b0NBRUosTUFBQSxHQUFROztJQUVLLCtCQUFDLE9BQUQ7QUFDWCxVQUFBO01BRFksSUFBQyxDQUFBLFVBQUQ7OztNQUNaLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixJQUFDLENBQUEsT0FBRCxHQUFXO01BQ1gsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUVyQixJQUFPLG9CQUFQO0FBQ0UsZUFBTyxPQUFPLENBQUMsSUFBUixDQUFhLG9EQUFiLEVBRFQ7O01BR0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBQTtNQUVWLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsSUFBQyxDQUFBLE9BQXZCLENBQW5CO01BRUEsSUFBRyxVQUFBLEdBQWEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFoQjtRQUNFLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLGlCQUFwQixDQUFzQyxJQUFDLENBQUEsV0FBdkMsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsVUFBVSxDQUFDLG1CQUFYLENBQStCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ2hELEtBQUMsQ0FBQSxjQUFELENBQUE7VUFE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QSxDQUFyQyxXQURUO09BQUEsYUFBQTtRQUVNO0FBQ0osZUFBTyxLQUhUOztJQURROzs7OztBQWpGWiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57cmVwb3NpdG9yeUZvclBhdGh9ID0gcmVxdWlyZSAnLi9oZWxwZXJzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNaW5pbWFwR2l0RGlmZkJpbmRpbmdcblxuICBhY3RpdmU6IGZhbHNlXG5cbiAgY29uc3RydWN0b3I6IChAbWluaW1hcCkgLT5cbiAgICBAZGVjb3JhdGlvbnMgPSB7fVxuICAgIEBtYXJrZXJzID0gbnVsbFxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIHVubGVzcyBAbWluaW1hcD9cbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4gJ21pbmltYXAtZ2l0LWRpZmYgYmluZGluZyBjcmVhdGVkIHdpdGhvdXQgYSBtaW5pbWFwJ1xuXG4gICAgQGVkaXRvciA9IEBtaW5pbWFwLmdldFRleHRFZGl0b3IoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBtaW5pbWFwLm9uRGlkRGVzdHJveSBAZGVzdHJveVxuXG4gICAgaWYgcmVwb3NpdG9yeSA9IEBnZXRSZXBvKClcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU3RvcENoYW5naW5nIEB1cGRhdGVEaWZmc1xuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIHJlcG9zaXRvcnkub25EaWRDaGFuZ2VTdGF0dXNlcyA9PlxuICAgICAgICBAc2NoZWR1bGVVcGRhdGUoKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIHJlcG9zaXRvcnkub25EaWRDaGFuZ2VTdGF0dXMgKGNoYW5nZWRQYXRoKSA9PlxuICAgICAgICBAc2NoZWR1bGVVcGRhdGUoKSBpZiBjaGFuZ2VkUGF0aCBpcyBAZWRpdG9yLmdldFBhdGgoKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIHJlcG9zaXRvcnkub25EaWREZXN0cm95ID0+XG4gICAgICAgIEBkZXN0cm95KClcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdtaW5pbWFwLWdpdC1kaWZmLnVzZUd1dHRlckRlY29yYXRpb24nLCAoQHVzZUd1dHRlckRlY29yYXRpb24pID0+XG4gICAgICAgIEBzY2hlZHVsZVVwZGF0ZSgpXG5cbiAgICBAc2NoZWR1bGVVcGRhdGUoKVxuXG4gIGNhbmNlbFVwZGF0ZTogLT5cbiAgICBjbGVhckltbWVkaWF0ZShAaW1tZWRpYXRlSWQpXG5cbiAgc2NoZWR1bGVVcGRhdGU6IC0+XG4gICAgQGNhbmNlbFVwZGF0ZSgpXG4gICAgQGltbWVkaWF0ZUlkID0gc2V0SW1tZWRpYXRlKEB1cGRhdGVEaWZmcylcblxuICB1cGRhdGVEaWZmczogPT5cbiAgICBAcmVtb3ZlRGVjb3JhdGlvbnMoKVxuICAgIGlmIEBnZXRQYXRoKCkgYW5kIEBkaWZmcyA9IEBnZXREaWZmcygpXG4gICAgICBAYWRkRGVjb3JhdGlvbnMoQGRpZmZzKVxuXG4gIGFkZERlY29yYXRpb25zOiAoZGlmZnMpIC0+XG4gICAgZm9yIHtvbGRTdGFydCwgbmV3U3RhcnQsIG9sZExpbmVzLCBuZXdMaW5lc30gaW4gZGlmZnNcbiAgICAgIHN0YXJ0Um93ID0gbmV3U3RhcnQgLSAxXG4gICAgICBlbmRSb3cgPSBuZXdTdGFydCArIG5ld0xpbmVzIC0gMlxuICAgICAgaWYgb2xkTGluZXMgaXMgMCBhbmQgbmV3TGluZXMgPiAwXG4gICAgICAgIEBtYXJrUmFuZ2Uoc3RhcnRSb3csIGVuZFJvdywgJy5naXQtbGluZS1hZGRlZCcpXG4gICAgICBlbHNlIGlmIG5ld0xpbmVzIGlzIDAgYW5kIG9sZExpbmVzID4gMFxuICAgICAgICBAbWFya1JhbmdlKHN0YXJ0Um93LCBzdGFydFJvdywgJy5naXQtbGluZS1yZW1vdmVkJylcbiAgICAgIGVsc2VcbiAgICAgICAgQG1hcmtSYW5nZShzdGFydFJvdywgZW5kUm93LCAnLmdpdC1saW5lLW1vZGlmaWVkJylcblxuICByZW1vdmVEZWNvcmF0aW9uczogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBtYXJrZXJzP1xuICAgIG1hcmtlci5kZXN0cm95KCkgZm9yIG1hcmtlciBpbiBAbWFya2Vyc1xuICAgIEBtYXJrZXJzID0gbnVsbFxuXG4gIG1hcmtSYW5nZTogKHN0YXJ0Um93LCBlbmRSb3csIHNjb3BlKSAtPlxuICAgIHJldHVybiBpZiBAZWRpdG9yLmlzRGVzdHJveWVkKClcbiAgICBtYXJrZXIgPSBAZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShbW3N0YXJ0Um93LCAwXSwgW2VuZFJvdywgSW5maW5pdHldXSwgaW52YWxpZGF0ZTogJ25ldmVyJylcbiAgICB0eXBlID0gaWYgQHVzZUd1dHRlckRlY29yYXRpb24gdGhlbiAnZ3V0dGVyJyBlbHNlICdsaW5lJ1xuICAgIEBtaW5pbWFwLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGUsIHNjb3BlOiBcIi5taW5pbWFwIC4je3R5cGV9ICN7c2NvcGV9XCIsIHBsdWdpbjogJ2dpdC1kaWZmJ30pXG4gICAgQG1hcmtlcnMgPz0gW11cbiAgICBAbWFya2Vycy5wdXNoKG1hcmtlcilcblxuICBkZXN0cm95OiA9PlxuICAgIEByZW1vdmVEZWNvcmF0aW9ucygpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQGRpZmZzID0gbnVsbFxuICAgIEBtaW5pbWFwID0gbnVsbFxuXG4gIGdldFBhdGg6IC0+IEBlZGl0b3IuZ2V0QnVmZmVyKCk/LmdldFBhdGgoKVxuXG4gIGdldFJlcG9zaXRvcmllczogLT4gYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpLmZpbHRlciAocmVwbykgLT4gcmVwbz9cblxuICBnZXRSZXBvOiAtPiBAcmVwb3NpdG9yeSA/PSByZXBvc2l0b3J5Rm9yUGF0aChAZWRpdG9yLmdldFBhdGgoKSlcblxuICBnZXREaWZmczogLT5cbiAgICB0cnlcbiAgICAgIHJldHVybiBAZ2V0UmVwbygpPy5nZXRMaW5lRGlmZnMoQGdldFBhdGgoKSwgQGVkaXRvci5nZXRCdWZmZXIoKS5nZXRUZXh0KCkpXG4gICAgY2F0Y2ggZVxuICAgICAgcmV0dXJuIG51bGxcbiJdfQ==
