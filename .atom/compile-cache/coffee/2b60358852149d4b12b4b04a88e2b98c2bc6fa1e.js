(function() {
  var BranchListView, DiffBranchFilesView, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('../views/branch-list-view');

  DiffBranchFilesView = require('../views/diff-branch-files-view');

  module.exports = function(repo, filePath) {
    return git.cmd(['branch', '--no-color'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(branches) {
      return new BranchListView(branches, function(arg) {
        var args, branchName, name;
        name = arg.name;
        branchName = name;
        args = ['diff', '--name-status', repo.branch, branchName];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(diffData) {
          return new DiffBranchFilesView(repo, diffData, branchName, filePath);
        })["catch"](notifier.addError);
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWRpZmYtYnJhbmNoLWZpbGVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUjs7RUFDakIsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLGlDQUFSOztFQUV0QixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxRQUFQO1dBQ2YsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFFBQUQsRUFBVyxZQUFYLENBQVIsRUFBa0M7TUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFsQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsUUFBRDthQUNBLElBQUEsY0FBQSxDQUFlLFFBQWYsRUFBeUIsU0FBQyxHQUFEO0FBQzNCLFlBQUE7UUFENkIsT0FBRDtRQUM1QixVQUFBLEdBQWE7UUFDYixJQUFBLEdBQU8sQ0FBQyxNQUFELEVBQVMsZUFBVCxFQUEwQixJQUFJLENBQUMsTUFBL0IsRUFBdUMsVUFBdkM7ZUFDUCxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztVQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1NBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLFFBQUQ7aUJBQ0EsSUFBQSxtQkFBQSxDQUFvQixJQUFwQixFQUEwQixRQUExQixFQUFvQyxVQUFwQyxFQUFnRCxRQUFoRDtRQURBLENBRE4sQ0FHQSxFQUFDLEtBQUQsRUFIQSxDQUdPLFFBQVEsQ0FBQyxRQUhoQjtNQUgyQixDQUF6QjtJQURBLENBRE47RUFEZTtBQUxqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5CcmFuY2hMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL2JyYW5jaC1saXN0LXZpZXcnXG5EaWZmQnJhbmNoRmlsZXNWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvZGlmZi1icmFuY2gtZmlsZXMtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywgZmlsZVBhdGgpIC0+XG4gIGdpdC5jbWQoWydicmFuY2gnLCAnLS1uby1jb2xvciddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoYnJhbmNoZXMpIC0+XG4gICAgbmV3IEJyYW5jaExpc3RWaWV3IGJyYW5jaGVzLCAoe25hbWV9KSAtPlxuICAgICAgYnJhbmNoTmFtZSA9IG5hbWVcbiAgICAgIGFyZ3MgPSBbJ2RpZmYnLCAnLS1uYW1lLXN0YXR1cycsIHJlcG8uYnJhbmNoLCBicmFuY2hOYW1lXVxuICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgLnRoZW4gKGRpZmZEYXRhKSAtPlxuICAgICAgICBuZXcgRGlmZkJyYW5jaEZpbGVzVmlldyhyZXBvLCBkaWZmRGF0YSwgYnJhbmNoTmFtZSwgZmlsZVBhdGgpXG4gICAgICAuY2F0Y2ggbm90aWZpZXIuYWRkRXJyb3JcbiJdfQ==
