(function() {
  var GitDiffTool, contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  GitDiffTool = require('../git-difftool');

  module.exports = function() {
    var path, ref;
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        return GitDiffTool(repo, {
          file: repo.relativize(path)
        });
      });
    } else {
      return notifier.addInfo("No file selected to diff");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvY29udGV4dC9naXQtZGlmZnRvb2wtY29udGV4dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSw4QkFBUjs7RUFDdkIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxXQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsZ0JBQVI7O0VBQ1gsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUjs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBO0FBQ2YsUUFBQTtJQUFBLElBQUcsSUFBQSxtREFBaUMsQ0FBRSxxQkFBdEM7YUFDRSxHQUFHLENBQUMsY0FBSixDQUFtQixJQUFuQixDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQUMsSUFBRDtlQUM1QixXQUFBLENBQVksSUFBWixFQUFrQjtVQUFBLElBQUEsRUFBTSxJQUFJLENBQUMsVUFBTCxDQUFnQixJQUFoQixDQUFOO1NBQWxCO01BRDRCLENBQTlCLEVBREY7S0FBQSxNQUFBO2FBSUUsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsMEJBQWpCLEVBSkY7O0VBRGU7QUFMakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb250ZXh0UGFja2FnZUZpbmRlciA9IHJlcXVpcmUgJy4uLy4uL2NvbnRleHQtcGFja2FnZS1maW5kZXInXG5naXQgPSByZXF1aXJlICcuLi8uLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uLy4uL25vdGlmaWVyJ1xuR2l0RGlmZlRvb2wgPSByZXF1aXJlICcuLi9naXQtZGlmZnRvb2wnXG5cbm1vZHVsZS5leHBvcnRzID0gLT5cbiAgaWYgcGF0aCA9IGNvbnRleHRQYWNrYWdlRmluZGVyLmdldCgpPy5zZWxlY3RlZFBhdGhcbiAgICBnaXQuZ2V0UmVwb0ZvclBhdGgocGF0aCkudGhlbiAocmVwbykgLT5cbiAgICAgIEdpdERpZmZUb29sIHJlcG8sIGZpbGU6IHJlcG8ucmVsYXRpdml6ZShwYXRoKVxuICBlbHNlXG4gICAgbm90aWZpZXIuYWRkSW5mbyBcIk5vIGZpbGUgc2VsZWN0ZWQgdG8gZGlmZlwiXG4iXX0=
