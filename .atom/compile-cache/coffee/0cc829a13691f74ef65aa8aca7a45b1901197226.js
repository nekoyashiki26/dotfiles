(function() {
  var CompositeDisposable, Disposable, MinimapGitDiff, MinimapGitDiffBinding, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  MinimapGitDiffBinding = null;

  MinimapGitDiff = (function() {
    MinimapGitDiff.prototype.config = {
      useGutterDecoration: {
        type: 'boolean',
        "default": false,
        description: 'When enabled the gif diffs will be displayed as thin vertical lines on the left side of the minimap.'
      }
    };

    MinimapGitDiff.prototype.pluginActive = false;

    function MinimapGitDiff() {
      this.destroyBindings = bind(this.destroyBindings, this);
      this.createBindings = bind(this.createBindings, this);
      this.activateBinding = bind(this.activateBinding, this);
      this.subscriptions = new CompositeDisposable;
    }

    MinimapGitDiff.prototype.isActive = function() {
      return this.pluginActive;
    };

    MinimapGitDiff.prototype.activate = function() {
      return this.bindings = new WeakMap;
    };

    MinimapGitDiff.prototype.consumeMinimapServiceV1 = function(minimap1) {
      this.minimap = minimap1;
      return this.minimap.registerPlugin('git-diff', this);
    };

    MinimapGitDiff.prototype.deactivate = function() {
      this.destroyBindings();
      return this.minimap = null;
    };

    MinimapGitDiff.prototype.activatePlugin = function() {
      var e;
      if (this.pluginActive) {
        return;
      }
      try {
        this.activateBinding();
        this.pluginActive = true;
        this.subscriptions.add(this.minimap.onDidActivate(this.activateBinding));
        return this.subscriptions.add(this.minimap.onDidDeactivate(this.destroyBindings));
      } catch (error) {
        e = error;
        return console.log(e);
      }
    };

    MinimapGitDiff.prototype.deactivatePlugin = function() {
      if (!this.pluginActive) {
        return;
      }
      this.pluginActive = false;
      this.subscriptions.dispose();
      return this.destroyBindings();
    };

    MinimapGitDiff.prototype.activateBinding = function() {
      if (this.getRepositories().length > 0) {
        this.createBindings();
      }
      return this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          if (_this.getRepositories().length > 0) {
            return _this.createBindings();
          } else {
            return _this.destroyBindings();
          }
        };
      })(this)));
    };

    MinimapGitDiff.prototype.createBindings = function() {
      MinimapGitDiffBinding || (MinimapGitDiffBinding = require('./minimap-git-diff-binding'));
      return this.subscriptions.add(this.minimap.observeMinimaps((function(_this) {
        return function(o) {
          var binding, editor, minimap, ref1;
          minimap = (ref1 = o.view) != null ? ref1 : o;
          editor = minimap.getTextEditor();
          if (editor == null) {
            return;
          }
          binding = new MinimapGitDiffBinding(minimap);
          return _this.bindings.set(minimap, binding);
        };
      })(this)));
    };

    MinimapGitDiff.prototype.getRepositories = function() {
      return atom.project.getRepositories().filter(function(repo) {
        return repo != null;
      });
    };

    MinimapGitDiff.prototype.destroyBindings = function() {
      if (!((this.minimap != null) && (this.minimap.editorsMinimaps != null))) {
        return;
      }
      return this.minimap.editorsMinimaps.forEach((function(_this) {
        return function(minimap) {
          var ref1;
          if ((ref1 = _this.bindings.get(minimap)) != null) {
            ref1.destroy();
          }
          return _this.bindings["delete"](minimap);
        };
      })(this));
    };

    return MinimapGitDiff;

  })();

  module.exports = new MinimapGitDiff;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAtZ2l0LWRpZmYvbGliL21pbmltYXAtZ2l0LWRpZmYuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwyRUFBQTtJQUFBOztFQUFBLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsNkNBQUQsRUFBc0I7O0VBRXRCLHFCQUFBLEdBQXdCOztFQUVsQjs2QkFFSixNQUFBLEdBQ0U7TUFBQSxtQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsc0dBRmI7T0FERjs7OzZCQUtGLFlBQUEsR0FBYzs7SUFDRCx3QkFBQTs7OztNQUNYLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7SUFEVjs7NkJBR2IsUUFBQSxHQUFVLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSjs7NkJBRVYsUUFBQSxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsUUFBRCxHQUFZLElBQUk7SUFEUjs7NkJBR1YsdUJBQUEsR0FBeUIsU0FBQyxRQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7YUFDeEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLElBQXBDO0lBRHVCOzs2QkFHekIsVUFBQSxHQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsZUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUZEOzs2QkFJWixjQUFBLEdBQWdCLFNBQUE7QUFDZCxVQUFBO01BQUEsSUFBVSxJQUFDLENBQUEsWUFBWDtBQUFBLGVBQUE7O0FBRUE7UUFDRSxJQUFDLENBQUEsZUFBRCxDQUFBO1FBQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7UUFFaEIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUF1QixJQUFDLENBQUEsZUFBeEIsQ0FBbkI7ZUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxlQUFULENBQXlCLElBQUMsQ0FBQSxlQUExQixDQUFuQixFQUxGO09BQUEsYUFBQTtRQU1NO2VBQ0osT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFaLEVBUEY7O0lBSGM7OzZCQVloQixnQkFBQSxHQUFrQixTQUFBO01BQ2hCLElBQUEsQ0FBYyxJQUFDLENBQUEsWUFBZjtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7YUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBO0lBTGdCOzs2QkFPbEIsZUFBQSxHQUFpQixTQUFBO01BQ2YsSUFBcUIsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFrQixDQUFDLE1BQW5CLEdBQTRCLENBQWpEO1FBQUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxFQUFBOzthQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFiLENBQThCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUUvQyxJQUFHLEtBQUMsQ0FBQSxlQUFELENBQUEsQ0FBa0IsQ0FBQyxNQUFuQixHQUE0QixDQUEvQjttQkFDRSxLQUFDLENBQUEsY0FBRCxDQUFBLEVBREY7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxlQUFELENBQUEsRUFIRjs7UUFGK0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBQW5CO0lBSGU7OzZCQVVqQixjQUFBLEdBQWdCLFNBQUE7TUFDZCwwQkFBQSx3QkFBMEIsT0FBQSxDQUFRLDRCQUFSO2FBRTFCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLGVBQVQsQ0FBeUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7QUFDMUMsY0FBQTtVQUFBLE9BQUEsb0NBQW1CO1VBQ25CLE1BQUEsR0FBUyxPQUFPLENBQUMsYUFBUixDQUFBO1VBRVQsSUFBYyxjQUFkO0FBQUEsbUJBQUE7O1VBRUEsT0FBQSxHQUFjLElBQUEscUJBQUEsQ0FBc0IsT0FBdEI7aUJBQ2QsS0FBQyxDQUFBLFFBQVEsQ0FBQyxHQUFWLENBQWMsT0FBZCxFQUF1QixPQUF2QjtRQVAwQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekIsQ0FBbkI7SUFIYzs7NkJBWWhCLGVBQUEsR0FBaUIsU0FBQTthQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUFBLENBQThCLENBQUMsTUFBL0IsQ0FBc0MsU0FBQyxJQUFEO2VBQVU7TUFBVixDQUF0QztJQUFIOzs2QkFFakIsZUFBQSxHQUFpQixTQUFBO01BQ2YsSUFBQSxDQUFBLENBQWMsc0JBQUEsSUFBYyxzQ0FBNUIsQ0FBQTtBQUFBLGVBQUE7O2FBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBekIsQ0FBaUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7QUFDL0IsY0FBQTs7Z0JBQXNCLENBQUUsT0FBeEIsQ0FBQTs7aUJBQ0EsS0FBQyxDQUFBLFFBQVEsRUFBQyxNQUFELEVBQVQsQ0FBaUIsT0FBakI7UUFGK0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDO0lBRmU7Ozs7OztFQU1uQixNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFJO0FBN0VyQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbk1pbmltYXBHaXREaWZmQmluZGluZyA9IG51bGxcblxuY2xhc3MgTWluaW1hcEdpdERpZmZcblxuICBjb25maWc6XG4gICAgdXNlR3V0dGVyRGVjb3JhdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBlbmFibGVkIHRoZSBnaWYgZGlmZnMgd2lsbCBiZSBkaXNwbGF5ZWQgYXMgdGhpbiB2ZXJ0aWNhbCBsaW5lcyBvbiB0aGUgbGVmdCBzaWRlIG9mIHRoZSBtaW5pbWFwLidcblxuICBwbHVnaW5BY3RpdmU6IGZhbHNlXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICBpc0FjdGl2ZTogLT4gQHBsdWdpbkFjdGl2ZVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBiaW5kaW5ncyA9IG5ldyBXZWFrTWFwXG5cbiAgY29uc3VtZU1pbmltYXBTZXJ2aWNlVjE6IChAbWluaW1hcCkgLT5cbiAgICBAbWluaW1hcC5yZWdpc3RlclBsdWdpbiAnZ2l0LWRpZmYnLCB0aGlzXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAZGVzdHJveUJpbmRpbmdzKClcbiAgICBAbWluaW1hcCA9IG51bGxcblxuICBhY3RpdmF0ZVBsdWdpbjogLT5cbiAgICByZXR1cm4gaWYgQHBsdWdpbkFjdGl2ZVxuXG4gICAgdHJ5XG4gICAgICBAYWN0aXZhdGVCaW5kaW5nKClcbiAgICAgIEBwbHVnaW5BY3RpdmUgPSB0cnVlXG5cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAbWluaW1hcC5vbkRpZEFjdGl2YXRlIEBhY3RpdmF0ZUJpbmRpbmdcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAbWluaW1hcC5vbkRpZERlYWN0aXZhdGUgQGRlc3Ryb3lCaW5kaW5nc1xuICAgIGNhdGNoIGVcbiAgICAgIGNvbnNvbGUubG9nIGVcblxuICBkZWFjdGl2YXRlUGx1Z2luOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQHBsdWdpbkFjdGl2ZVxuXG4gICAgQHBsdWdpbkFjdGl2ZSA9IGZhbHNlXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQGRlc3Ryb3lCaW5kaW5ncygpXG5cbiAgYWN0aXZhdGVCaW5kaW5nOiA9PlxuICAgIEBjcmVhdGVCaW5kaW5ncygpIGlmIEBnZXRSZXBvc2l0b3JpZXMoKS5sZW5ndGggPiAwXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMgPT5cblxuICAgICAgaWYgQGdldFJlcG9zaXRvcmllcygpLmxlbmd0aCA+IDBcbiAgICAgICAgQGNyZWF0ZUJpbmRpbmdzKClcbiAgICAgIGVsc2VcbiAgICAgICAgQGRlc3Ryb3lCaW5kaW5ncygpXG5cbiAgY3JlYXRlQmluZGluZ3M6ID0+XG4gICAgTWluaW1hcEdpdERpZmZCaW5kaW5nIHx8PSByZXF1aXJlICcuL21pbmltYXAtZ2l0LWRpZmYtYmluZGluZydcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAbWluaW1hcC5vYnNlcnZlTWluaW1hcHMgKG8pID0+XG4gICAgICBtaW5pbWFwID0gby52aWV3ID8gb1xuICAgICAgZWRpdG9yID0gbWluaW1hcC5nZXRUZXh0RWRpdG9yKClcblxuICAgICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG5cbiAgICAgIGJpbmRpbmcgPSBuZXcgTWluaW1hcEdpdERpZmZCaW5kaW5nIG1pbmltYXBcbiAgICAgIEBiaW5kaW5ncy5zZXQobWluaW1hcCwgYmluZGluZylcblxuICBnZXRSZXBvc2l0b3JpZXM6IC0+IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKS5maWx0ZXIgKHJlcG8pIC0+IHJlcG8/XG5cbiAgZGVzdHJveUJpbmRpbmdzOiA9PlxuICAgIHJldHVybiB1bmxlc3MgQG1pbmltYXA/IGFuZCBAbWluaW1hcC5lZGl0b3JzTWluaW1hcHM/XG4gICAgQG1pbmltYXAuZWRpdG9yc01pbmltYXBzLmZvckVhY2ggKG1pbmltYXApID0+XG4gICAgICBAYmluZGluZ3MuZ2V0KG1pbmltYXApPy5kZXN0cm95KClcbiAgICAgIEBiaW5kaW5ncy5kZWxldGUobWluaW1hcClcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgTWluaW1hcEdpdERpZmZcbiJdfQ==
