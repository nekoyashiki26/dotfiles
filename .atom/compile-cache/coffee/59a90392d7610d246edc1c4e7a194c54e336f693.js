(function() {
  var GitPush, contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  GitPush = require('../git-push');

  module.exports = function(options) {
    var path, ref;
    if (options == null) {
      options = {};
    }
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        return GitPush(repo, options);
      });
    } else {
      return notifier.addInfo("No repository found");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvY29udGV4dC9naXQtcHVzaC1jb250ZXh0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLDhCQUFSOztFQUN2QixHQUFBLEdBQU0sT0FBQSxDQUFRLFdBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxnQkFBUjs7RUFDWCxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxPQUFEO0FBQ2YsUUFBQTs7TUFEZ0IsVUFBUTs7SUFDeEIsSUFBRyxJQUFBLG1EQUFpQyxDQUFFLHFCQUF0QzthQUNFLEdBQUcsQ0FBQyxjQUFKLENBQW1CLElBQW5CLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBQyxJQUFEO2VBQVUsT0FBQSxDQUFRLElBQVIsRUFBYyxPQUFkO01BQVYsQ0FBOUIsRUFERjtLQUFBLE1BQUE7YUFHRSxRQUFRLENBQUMsT0FBVCxDQUFpQixxQkFBakIsRUFIRjs7RUFEZTtBQUxqQiIsInNvdXJjZXNDb250ZW50IjpbImNvbnRleHRQYWNrYWdlRmluZGVyID0gcmVxdWlyZSAnLi4vLi4vY29udGV4dC1wYWNrYWdlLWZpbmRlcidcbmdpdCA9IHJlcXVpcmUgJy4uLy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vLi4vbm90aWZpZXInXG5HaXRQdXNoID0gcmVxdWlyZSAnLi4vZ2l0LXB1c2gnXG5cbm1vZHVsZS5leHBvcnRzID0gKG9wdGlvbnM9e30pLT5cbiAgaWYgcGF0aCA9IGNvbnRleHRQYWNrYWdlRmluZGVyLmdldCgpPy5zZWxlY3RlZFBhdGhcbiAgICBnaXQuZ2V0UmVwb0ZvclBhdGgocGF0aCkudGhlbiAocmVwbykgLT4gR2l0UHVzaChyZXBvLCBvcHRpb25zKVxuICBlbHNlXG4gICAgbm90aWZpZXIuYWRkSW5mbyBcIk5vIHJlcG9zaXRvcnkgZm91bmRcIlxuIl19
