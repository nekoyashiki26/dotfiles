(function() {
  var GitPull, contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  GitPull = require('../git-pull');

  module.exports = function() {
    var path, ref;
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        return GitPull(repo);
      });
    } else {
      return notifier.addInfo("No repository found");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvY29udGV4dC9naXQtcHVsbC1jb250ZXh0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLDhCQUFSOztFQUN2QixHQUFBLEdBQU0sT0FBQSxDQUFRLFdBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxnQkFBUjs7RUFDWCxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQTtBQUNmLFFBQUE7SUFBQSxJQUFHLElBQUEsbURBQWlDLENBQUUscUJBQXRDO2FBQ0UsR0FBRyxDQUFDLGNBQUosQ0FBbUIsSUFBbkIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUFDLElBQUQ7ZUFBVSxPQUFBLENBQVEsSUFBUjtNQUFWLENBQTlCLEVBREY7S0FBQSxNQUFBO2FBR0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIscUJBQWpCLEVBSEY7O0VBRGU7QUFMakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb250ZXh0UGFja2FnZUZpbmRlciA9IHJlcXVpcmUgJy4uLy4uL2NvbnRleHQtcGFja2FnZS1maW5kZXInXG5naXQgPSByZXF1aXJlICcuLi8uLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uLy4uL25vdGlmaWVyJ1xuR2l0UHVsbCA9IHJlcXVpcmUgJy4uL2dpdC1wdWxsJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IC0+XG4gIGlmIHBhdGggPSBjb250ZXh0UGFja2FnZUZpbmRlci5nZXQoKT8uc2VsZWN0ZWRQYXRoXG4gICAgZ2l0LmdldFJlcG9Gb3JQYXRoKHBhdGgpLnRoZW4gKHJlcG8pIC0+IEdpdFB1bGwocmVwbylcbiAgZWxzZVxuICAgIG5vdGlmaWVyLmFkZEluZm8gXCJObyByZXBvc2l0b3J5IGZvdW5kXCJcbiJdfQ==
