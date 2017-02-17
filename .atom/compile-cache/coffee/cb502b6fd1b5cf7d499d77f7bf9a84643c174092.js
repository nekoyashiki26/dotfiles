(function() {
  var Helpers, Range, child_process, minimatch, path,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Range = require('atom').Range;

  path = require('path');

  child_process = require('child_process');

  minimatch = require('minimatch');

  Helpers = module.exports = {
    messageKey: function(message) {
      return (message.text || message.html) + '$' + message.type + '$' + (message["class"] || '') + '$' + (message.name || '') + '$' + message.filePath + '$' + (message.range ? message.range.start.column + ':' + message.range.start.row + ':' + message.range.end.column + ':' + message.range.end.row : '');
    },
    error: function(e) {
      return atom.notifications.addError(e.toString(), {
        detail: e.stack || '',
        dismissable: true
      });
    },
    shouldTriggerLinter: function(linter, onChange, scopes) {
      if (onChange && !linter.lintOnFly) {
        return false;
      }
      if (!scopes.some(function(entry) {
        return indexOf.call(linter.grammarScopes, entry) >= 0;
      })) {
        return false;
      }
      return true;
    },
    requestUpdateFrame: function(callback) {
      return setTimeout(callback, 100);
    },
    debounce: function(callback, delay) {
      var timeout;
      timeout = null;
      return function(arg) {
        clearTimeout(timeout);
        return timeout = setTimeout((function(_this) {
          return function() {
            return callback.call(_this, arg);
          };
        })(this), delay);
      };
    },
    isPathIgnored: function(filePath) {
      var i, j, len, projectPath, ref, repo;
      repo = null;
      ref = atom.project.getPaths();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        projectPath = ref[i];
        if (filePath.indexOf(projectPath + path.sep) === 0) {
          repo = atom.project.getRepositories()[i];
          break;
        }
      }
      if (repo && repo.isProjectAtRoot() && repo.isPathIgnored(filePath)) {
        return true;
      }
      return minimatch(filePath, atom.config.get('linter.ignoreMatchedFiles'));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaGVscGVycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDhDQUFBO0lBQUE7O0VBQUMsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFDVixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsYUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUjs7RUFDaEIsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSOztFQUVaLE9BQUEsR0FBVSxNQUFNLENBQUMsT0FBUCxHQUNSO0lBQUEsVUFBQSxFQUFZLFNBQUMsT0FBRDthQUNWLENBQUMsT0FBTyxDQUFDLElBQVIsSUFBZ0IsT0FBTyxDQUFDLElBQXpCLENBQUEsR0FBaUMsR0FBakMsR0FBdUMsT0FBTyxDQUFDLElBQS9DLEdBQXNELEdBQXRELEdBQTRELENBQUMsT0FBTyxFQUFDLEtBQUQsRUFBUCxJQUFpQixFQUFsQixDQUE1RCxHQUFvRixHQUFwRixHQUEwRixDQUFDLE9BQU8sQ0FBQyxJQUFSLElBQWdCLEVBQWpCLENBQTFGLEdBQWlILEdBQWpILEdBQXVILE9BQU8sQ0FBQyxRQUEvSCxHQUEwSSxHQUExSSxHQUFnSixDQUFJLE9BQU8sQ0FBQyxLQUFYLEdBQXNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQXBCLEdBQTZCLEdBQTdCLEdBQW1DLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQXZELEdBQTZELEdBQTdELEdBQW1FLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQXJGLEdBQThGLEdBQTlGLEdBQW9HLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQTVJLEdBQXFKLEVBQXRKO0lBRHRJLENBQVo7SUFFQSxLQUFBLEVBQU8sU0FBQyxDQUFEO2FBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixDQUFDLENBQUMsUUFBRixDQUFBLENBQTVCLEVBQTBDO1FBQUMsTUFBQSxFQUFRLENBQUMsQ0FBQyxLQUFGLElBQVcsRUFBcEI7UUFBd0IsV0FBQSxFQUFhLElBQXJDO09BQTFDO0lBREssQ0FGUDtJQUlBLG1CQUFBLEVBQXFCLFNBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsTUFBbkI7TUFJbkIsSUFBZ0IsUUFBQSxJQUFhLENBQUksTUFBTSxDQUFDLFNBQXhDO0FBQUEsZUFBTyxNQUFQOztNQUNBLElBQUEsQ0FBb0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxTQUFDLEtBQUQ7ZUFBVyxhQUFTLE1BQU0sQ0FBQyxhQUFoQixFQUFBLEtBQUE7TUFBWCxDQUFaLENBQXBCO0FBQUEsZUFBTyxNQUFQOztBQUNBLGFBQU87SUFOWSxDQUpyQjtJQVdBLGtCQUFBLEVBQW9CLFNBQUMsUUFBRDthQUNsQixVQUFBLENBQVcsUUFBWCxFQUFxQixHQUFyQjtJQURrQixDQVhwQjtJQWFBLFFBQUEsRUFBVSxTQUFDLFFBQUQsRUFBVyxLQUFYO0FBQ1IsVUFBQTtNQUFBLE9BQUEsR0FBVTtBQUNWLGFBQU8sU0FBQyxHQUFEO1FBQ0wsWUFBQSxDQUFhLE9BQWI7ZUFDQSxPQUFBLEdBQVUsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ25CLFFBQVEsQ0FBQyxJQUFULENBQWMsS0FBZCxFQUFvQixHQUFwQjtVQURtQjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUVSLEtBRlE7TUFGTDtJQUZDLENBYlY7SUFvQkEsYUFBQSxFQUFlLFNBQUMsUUFBRDtBQUNiLFVBQUE7TUFBQSxJQUFBLEdBQU87QUFDUDtBQUFBLFdBQUEsNkNBQUE7O1FBQ0UsSUFBRyxRQUFRLENBQUMsT0FBVCxDQUFpQixXQUFBLEdBQWMsSUFBSSxDQUFDLEdBQXBDLENBQUEsS0FBNEMsQ0FBL0M7VUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQUEsQ0FBK0IsQ0FBQSxDQUFBO0FBQ3RDLGdCQUZGOztBQURGO01BSUEsSUFBZSxJQUFBLElBQVMsSUFBSSxDQUFDLGVBQUwsQ0FBQSxDQUFULElBQW9DLElBQUksQ0FBQyxhQUFMLENBQW1CLFFBQW5CLENBQW5EO0FBQUEsZUFBTyxLQUFQOztBQUNBLGFBQU8sU0FBQSxDQUFVLFFBQVYsRUFBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQixDQUFwQjtJQVBNLENBcEJmOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsie1JhbmdlfSA9IHJlcXVpcmUoJ2F0b20nKVxucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5jaGlsZF9wcm9jZXNzID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpXG5taW5pbWF0Y2ggPSByZXF1aXJlKCdtaW5pbWF0Y2gnKVxuXG5IZWxwZXJzID0gbW9kdWxlLmV4cG9ydHMgPVxuICBtZXNzYWdlS2V5OiAobWVzc2FnZSkgLT5cbiAgICAobWVzc2FnZS50ZXh0IG9yIG1lc3NhZ2UuaHRtbCkgKyAnJCcgKyBtZXNzYWdlLnR5cGUgKyAnJCcgKyAobWVzc2FnZS5jbGFzcyBvciAnJykgKyAnJCcgKyAobWVzc2FnZS5uYW1lIG9yICcnKSArICckJyArIG1lc3NhZ2UuZmlsZVBhdGggKyAnJCcgKyAoaWYgbWVzc2FnZS5yYW5nZSB0aGVuIG1lc3NhZ2UucmFuZ2Uuc3RhcnQuY29sdW1uICsgJzonICsgbWVzc2FnZS5yYW5nZS5zdGFydC5yb3cgKyAnOicgKyBtZXNzYWdlLnJhbmdlLmVuZC5jb2x1bW4gKyAnOicgKyBtZXNzYWdlLnJhbmdlLmVuZC5yb3cgZWxzZSAnJylcbiAgZXJyb3I6IChlKSAtPlxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihlLnRvU3RyaW5nKCksIHtkZXRhaWw6IGUuc3RhY2sgb3IgJycsIGRpc21pc3NhYmxlOiB0cnVlfSlcbiAgc2hvdWxkVHJpZ2dlckxpbnRlcjogKGxpbnRlciwgb25DaGFuZ2UsIHNjb3BlcykgLT5cbiAgICAjIFRyaWdnZXIgbGludC1vbi1GbHkgbGludGVycyBvbiBib3RoIGV2ZW50cyBidXQgb24tc2F2ZSBsaW50ZXJzIG9ubHkgb24gc2F2ZVxuICAgICMgQmVjYXVzZSB3ZSB3YW50IHRvIHRyaWdnZXIgb25GbHkgbGludGVycyBvbiBzYXZlIHdoZW4gdGhlXG4gICAgIyB1c2VyIGhhcyBkaXNhYmxlZCBsaW50T25GbHkgZnJvbSBjb25maWdcbiAgICByZXR1cm4gZmFsc2UgaWYgb25DaGFuZ2UgYW5kIG5vdCBsaW50ZXIubGludE9uRmx5XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBzY29wZXMuc29tZSAoZW50cnkpIC0+IGVudHJ5IGluIGxpbnRlci5ncmFtbWFyU2NvcGVzXG4gICAgcmV0dXJuIHRydWVcbiAgcmVxdWVzdFVwZGF0ZUZyYW1lOiAoY2FsbGJhY2spIC0+XG4gICAgc2V0VGltZW91dChjYWxsYmFjaywgMTAwKVxuICBkZWJvdW5jZTogKGNhbGxiYWNrLCBkZWxheSkgLT5cbiAgICB0aW1lb3V0ID0gbnVsbFxuICAgIHJldHVybiAoYXJnKSAtPlxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PlxuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGFyZylcbiAgICAgICwgZGVsYXkpXG4gIGlzUGF0aElnbm9yZWQ6IChmaWxlUGF0aCkgLT5cbiAgICByZXBvID0gbnVsbFxuICAgIGZvciBwcm9qZWN0UGF0aCwgaSBpbiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgICAgaWYgZmlsZVBhdGguaW5kZXhPZihwcm9qZWN0UGF0aCArIHBhdGguc2VwKSBpcyAwXG4gICAgICAgIHJlcG8gPSBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKClbaV1cbiAgICAgICAgYnJlYWtcbiAgICByZXR1cm4gdHJ1ZSBpZiByZXBvIGFuZCByZXBvLmlzUHJvamVjdEF0Um9vdCgpIGFuZCByZXBvLmlzUGF0aElnbm9yZWQoZmlsZVBhdGgpXG4gICAgcmV0dXJuIG1pbmltYXRjaChmaWxlUGF0aCwgYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuaWdub3JlTWF0Y2hlZEZpbGVzJykpXG4iXX0=
