(function() {
  var GitCheckoutFile, contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  GitCheckoutFile = require('../git-checkout-file');

  module.exports = function() {
    var path, ref;
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        return atom.confirm({
          message: "Are you sure you want to reset " + (repo.relativize(path)) + " to HEAD",
          buttons: {
            Yes: function() {
              return GitCheckoutFile(repo, {
                file: repo.relativize(path)
              });
            },
            No: function() {}
          }
        });
      });
    } else {
      return notifier.addInfo("No file selected to checkout");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvY29udGV4dC9naXQtY2hlY2tvdXQtZmlsZS1jb250ZXh0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLDhCQUFSOztFQUN2QixHQUFBLEdBQU0sT0FBQSxDQUFRLFdBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxnQkFBUjs7RUFDWCxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxzQkFBUjs7RUFFbEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQTtBQUNmLFFBQUE7SUFBQSxJQUFHLElBQUEsbURBQWlDLENBQUUscUJBQXRDO2FBQ0UsR0FBRyxDQUFDLGNBQUosQ0FBbUIsSUFBbkIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUFDLElBQUQ7ZUFDNUIsSUFBSSxDQUFDLE9BQUwsQ0FDRTtVQUFBLE9BQUEsRUFBUyxpQ0FBQSxHQUFpQyxDQUFDLElBQUksQ0FBQyxVQUFMLENBQWdCLElBQWhCLENBQUQsQ0FBakMsR0FBd0QsVUFBakU7VUFDQSxPQUFBLEVBQ0U7WUFBQSxHQUFBLEVBQUssU0FBQTtxQkFBRyxlQUFBLENBQWdCLElBQWhCLEVBQXNCO2dCQUFBLElBQUEsRUFBTSxJQUFJLENBQUMsVUFBTCxDQUFnQixJQUFoQixDQUFOO2VBQXRCO1lBQUgsQ0FBTDtZQUNBLEVBQUEsRUFBSyxTQUFBLEdBQUEsQ0FETDtXQUZGO1NBREY7TUFENEIsQ0FBOUIsRUFERjtLQUFBLE1BQUE7YUFRRSxRQUFRLENBQUMsT0FBVCxDQUFpQiw4QkFBakIsRUFSRjs7RUFEZTtBQUxqQiIsInNvdXJjZXNDb250ZW50IjpbImNvbnRleHRQYWNrYWdlRmluZGVyID0gcmVxdWlyZSAnLi4vLi4vY29udGV4dC1wYWNrYWdlLWZpbmRlcidcbmdpdCA9IHJlcXVpcmUgJy4uLy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vLi4vbm90aWZpZXInXG5HaXRDaGVja291dEZpbGUgPSByZXF1aXJlICcuLi9naXQtY2hlY2tvdXQtZmlsZSdcblxubW9kdWxlLmV4cG9ydHMgPSAtPlxuICBpZiBwYXRoID0gY29udGV4dFBhY2thZ2VGaW5kZXIuZ2V0KCk/LnNlbGVjdGVkUGF0aFxuICAgIGdpdC5nZXRSZXBvRm9yUGF0aChwYXRoKS50aGVuIChyZXBvKSAtPlxuICAgICAgYXRvbS5jb25maXJtXG4gICAgICAgIG1lc3NhZ2U6IFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlc2V0ICN7cmVwby5yZWxhdGl2aXplKHBhdGgpfSB0byBIRUFEXCJcbiAgICAgICAgYnV0dG9uczpcbiAgICAgICAgICBZZXM6IC0+IEdpdENoZWNrb3V0RmlsZSByZXBvLCBmaWxlOiByZXBvLnJlbGF0aXZpemUocGF0aClcbiAgICAgICAgICBObzogIC0+XG4gIGVsc2VcbiAgICBub3RpZmllci5hZGRJbmZvIFwiTm8gZmlsZSBzZWxlY3RlZCB0byBjaGVja291dFwiXG4iXX0=
