(function() {
  var contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  module.exports = function() {
    var path, ref;
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        var file;
        file = repo.relativize(path);
        if (file === '') {
          file = '.';
        }
        return git.cmd(['reset', 'HEAD', '--', file], {
          cwd: repo.getWorkingDirectory()
        }).then(notifier.addSuccess)["catch"](notifier.addError);
      });
    } else {
      return notifier.addInfo("No file selected to unstage");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvY29udGV4dC9naXQtdW5zdGFnZS1maWxlLWNvbnRleHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsOEJBQVI7O0VBQ3ZCLEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGdCQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUE7QUFDZixRQUFBO0lBQUEsSUFBRyxJQUFBLG1EQUFpQyxDQUFFLHFCQUF0QzthQUNFLEdBQUcsQ0FBQyxjQUFKLENBQW1CLElBQW5CLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBQyxJQUFEO0FBQzVCLFlBQUE7UUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBaEI7UUFDUCxJQUFjLElBQUEsS0FBUSxFQUF0QjtVQUFBLElBQUEsR0FBTyxJQUFQOztlQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxPQUFELEVBQVUsTUFBVixFQUFrQixJQUFsQixFQUF3QixJQUF4QixDQUFSLEVBQXVDO1VBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7U0FBdkMsQ0FDQSxDQUFDLElBREQsQ0FDTSxRQUFRLENBQUMsVUFEZixDQUVBLEVBQUMsS0FBRCxFQUZBLENBRU8sUUFBUSxDQUFDLFFBRmhCO01BSDRCLENBQTlCLEVBREY7S0FBQSxNQUFBO2FBUUUsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsNkJBQWpCLEVBUkY7O0VBRGU7QUFKakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb250ZXh0UGFja2FnZUZpbmRlciA9IHJlcXVpcmUgJy4uLy4uL2NvbnRleHQtcGFja2FnZS1maW5kZXInXG5naXQgPSByZXF1aXJlICcuLi8uLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uLy4uL25vdGlmaWVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IC0+XG4gIGlmIHBhdGggPSBjb250ZXh0UGFja2FnZUZpbmRlci5nZXQoKT8uc2VsZWN0ZWRQYXRoXG4gICAgZ2l0LmdldFJlcG9Gb3JQYXRoKHBhdGgpLnRoZW4gKHJlcG8pIC0+XG4gICAgICBmaWxlID0gcmVwby5yZWxhdGl2aXplKHBhdGgpXG4gICAgICBmaWxlID0gJy4nIGlmIGZpbGUgaXMgJydcbiAgICAgIGdpdC5jbWQoWydyZXNldCcsICdIRUFEJywgJy0tJywgZmlsZV0sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbihub3RpZmllci5hZGRTdWNjZXNzKVxuICAgICAgLmNhdGNoKG5vdGlmaWVyLmFkZEVycm9yKVxuICBlbHNlXG4gICAgbm90aWZpZXIuYWRkSW5mbyBcIk5vIGZpbGUgc2VsZWN0ZWQgdG8gdW5zdGFnZVwiXG4iXX0=
