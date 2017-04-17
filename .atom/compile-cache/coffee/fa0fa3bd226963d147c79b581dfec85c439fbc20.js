(function() {
  var GitDiff, contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  GitDiff = require('../git-diff');

  module.exports = function() {
    var path, ref;
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        var file;
        if (path === repo.getWorkingDirectory()) {
          file = path;
        } else {
          file = repo.relativize(path);
        }
        if (file === '') {
          file = void 0;
        }
        return GitDiff(repo, {
          file: file
        });
      });
    } else {
      return notifier.addInfo("No file selected to diff");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvY29udGV4dC9naXQtZGlmZi1jb250ZXh0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLDhCQUFSOztFQUN2QixHQUFBLEdBQU0sT0FBQSxDQUFRLFdBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxnQkFBUjs7RUFDWCxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQTtBQUNmLFFBQUE7SUFBQSxJQUFHLElBQUEsbURBQWlDLENBQUUscUJBQXRDO2FBQ0UsR0FBRyxDQUFDLGNBQUosQ0FBbUIsSUFBbkIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUFDLElBQUQ7QUFDNUIsWUFBQTtRQUFBLElBQUcsSUFBQSxLQUFRLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQVg7VUFDRSxJQUFBLEdBQU8sS0FEVDtTQUFBLE1BQUE7VUFHRSxJQUFBLEdBQU8sSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBaEIsRUFIVDs7UUFJQSxJQUFvQixJQUFBLEtBQVEsRUFBNUI7VUFBQSxJQUFBLEdBQU8sT0FBUDs7ZUFDQSxPQUFBLENBQVEsSUFBUixFQUFjO1VBQUMsTUFBQSxJQUFEO1NBQWQ7TUFONEIsQ0FBOUIsRUFERjtLQUFBLE1BQUE7YUFTRSxRQUFRLENBQUMsT0FBVCxDQUFpQiwwQkFBakIsRUFURjs7RUFEZTtBQUxqQiIsInNvdXJjZXNDb250ZW50IjpbImNvbnRleHRQYWNrYWdlRmluZGVyID0gcmVxdWlyZSAnLi4vLi4vY29udGV4dC1wYWNrYWdlLWZpbmRlcidcbmdpdCA9IHJlcXVpcmUgJy4uLy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vLi4vbm90aWZpZXInXG5HaXREaWZmID0gcmVxdWlyZSAnLi4vZ2l0LWRpZmYnXG5cbm1vZHVsZS5leHBvcnRzID0gLT5cbiAgaWYgcGF0aCA9IGNvbnRleHRQYWNrYWdlRmluZGVyLmdldCgpPy5zZWxlY3RlZFBhdGhcbiAgICBnaXQuZ2V0UmVwb0ZvclBhdGgocGF0aCkudGhlbiAocmVwbykgLT5cbiAgICAgIGlmIHBhdGggaXMgcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgICAgICAgZmlsZSA9IHBhdGhcbiAgICAgIGVsc2VcbiAgICAgICAgZmlsZSA9IHJlcG8ucmVsYXRpdml6ZShwYXRoKVxuICAgICAgZmlsZSA9IHVuZGVmaW5lZCBpZiBmaWxlIGlzICcnXG4gICAgICBHaXREaWZmIHJlcG8sIHtmaWxlfVxuICBlbHNlXG4gICAgbm90aWZpZXIuYWRkSW5mbyBcIk5vIGZpbGUgc2VsZWN0ZWQgdG8gZGlmZlwiXG4iXX0=
