(function() {
  var GitCommit, contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  GitCommit = require('../git-commit');

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
        }).then(function() {
          return GitCommit(repo);
        });
      })["catch"](function(error) {
        console.log(error);
        return notifier.addError('There was an error executing Add + Commit');
      });
    } else {
      return notifier.addInfo("No file selected to add and commit");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvY29udGV4dC9naXQtYWRkLWFuZC1jb21taXQtY29udGV4dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSw4QkFBUjs7RUFDdkIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxXQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsZ0JBQVI7O0VBQ1gsU0FBQSxHQUFZLE9BQUEsQ0FBUSxlQUFSOztFQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUE7QUFDZixRQUFBO0lBQUEsSUFBRyxJQUFBLG1EQUFpQyxDQUFFLHFCQUF0QzthQUNFLEdBQUcsQ0FBQyxjQUFKLENBQW1CLElBQW5CLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO0FBQ0osWUFBQTtRQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsVUFBTCxDQUFnQixJQUFoQjtRQUNQLElBQW9CLElBQUEsS0FBUSxFQUE1QjtVQUFBLElBQUEsR0FBTyxPQUFQOztlQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO1VBQUMsTUFBQSxJQUFEO1NBQWQsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixTQUFBO2lCQUFHLFNBQUEsQ0FBVSxJQUFWO1FBQUgsQ0FBM0I7TUFISSxDQUROLENBS0EsRUFBQyxLQUFELEVBTEEsQ0FLTyxTQUFDLEtBQUQ7UUFDTCxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVo7ZUFDQSxRQUFRLENBQUMsUUFBVCxDQUFrQiwyQ0FBbEI7TUFGSyxDQUxQLEVBREY7S0FBQSxNQUFBO2FBVUUsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsb0NBQWpCLEVBVkY7O0VBRGU7QUFMakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb250ZXh0UGFja2FnZUZpbmRlciA9IHJlcXVpcmUgJy4uLy4uL2NvbnRleHQtcGFja2FnZS1maW5kZXInXG5naXQgPSByZXF1aXJlICcuLi8uLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uLy4uL25vdGlmaWVyJ1xuR2l0Q29tbWl0ID0gcmVxdWlyZSAnLi4vZ2l0LWNvbW1pdCdcblxubW9kdWxlLmV4cG9ydHMgPSAtPlxuICBpZiBwYXRoID0gY29udGV4dFBhY2thZ2VGaW5kZXIuZ2V0KCk/LnNlbGVjdGVkUGF0aFxuICAgIGdpdC5nZXRSZXBvRm9yUGF0aChwYXRoKVxuICAgIC50aGVuIChyZXBvKSAtPlxuICAgICAgZmlsZSA9IHJlcG8ucmVsYXRpdml6ZShwYXRoKVxuICAgICAgZmlsZSA9IHVuZGVmaW5lZCBpZiBmaWxlIGlzICcnXG4gICAgICBnaXQuYWRkKHJlcG8sIHtmaWxlfSkudGhlbiAtPiBHaXRDb21taXQocmVwbylcbiAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgY29uc29sZS5sb2cgZXJyb3JcbiAgICAgIG5vdGlmaWVyLmFkZEVycm9yICdUaGVyZSB3YXMgYW4gZXJyb3IgZXhlY3V0aW5nIEFkZCArIENvbW1pdCdcbiAgZWxzZVxuICAgIG5vdGlmaWVyLmFkZEluZm8gXCJObyBmaWxlIHNlbGVjdGVkIHRvIGFkZCBhbmQgY29tbWl0XCJcbiJdfQ==
