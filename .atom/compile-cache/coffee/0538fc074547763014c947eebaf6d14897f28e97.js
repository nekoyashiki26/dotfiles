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
          file = void 0;
        }
        return git.add(repo, {
          file: file
        });
      });
    } else {
      return notifier.addInfo("No file selected to add");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvY29udGV4dC9naXQtYWRkLWNvbnRleHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsOEJBQVI7O0VBQ3ZCLEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGdCQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUE7QUFDZixRQUFBO0lBQUEsSUFBRyxJQUFBLG1EQUFpQyxDQUFFLHFCQUF0QzthQUNFLEdBQUcsQ0FBQyxjQUFKLENBQW1CLElBQW5CLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBQyxJQUFEO0FBQzVCLFlBQUE7UUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBaEI7UUFDUCxJQUFvQixJQUFBLEtBQVEsRUFBNUI7VUFBQSxJQUFBLEdBQU8sT0FBUDs7ZUFDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztVQUFDLE1BQUEsSUFBRDtTQUFkO01BSDRCLENBQTlCLEVBREY7S0FBQSxNQUFBO2FBTUUsUUFBUSxDQUFDLE9BQVQsQ0FBaUIseUJBQWpCLEVBTkY7O0VBRGU7QUFKakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb250ZXh0UGFja2FnZUZpbmRlciA9IHJlcXVpcmUgJy4uLy4uL2NvbnRleHQtcGFja2FnZS1maW5kZXInXG5naXQgPSByZXF1aXJlICcuLi8uLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uLy4uL25vdGlmaWVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IC0+XG4gIGlmIHBhdGggPSBjb250ZXh0UGFja2FnZUZpbmRlci5nZXQoKT8uc2VsZWN0ZWRQYXRoXG4gICAgZ2l0LmdldFJlcG9Gb3JQYXRoKHBhdGgpLnRoZW4gKHJlcG8pIC0+XG4gICAgICBmaWxlID0gcmVwby5yZWxhdGl2aXplKHBhdGgpXG4gICAgICBmaWxlID0gdW5kZWZpbmVkIGlmIGZpbGUgaXMgJydcbiAgICAgIGdpdC5hZGQgcmVwbywge2ZpbGV9XG4gIGVsc2VcbiAgICBub3RpZmllci5hZGRJbmZvIFwiTm8gZmlsZSBzZWxlY3RlZCB0byBhZGRcIlxuIl19
