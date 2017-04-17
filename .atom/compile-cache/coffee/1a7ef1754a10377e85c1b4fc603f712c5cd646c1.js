(function() {
  var OutputViewManager, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = function(repo) {
    var cwd;
    cwd = repo.getWorkingDirectory();
    return git.cmd(['stash', 'pop'], {
      cwd: cwd
    }, {
      color: true
    }).then(function(msg) {
      if (msg !== '') {
        return OutputViewManager.create().setContent(msg).finish();
      }
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXN0YXNoLXBvcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSOztFQUVwQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQ7QUFDZixRQUFBO0lBQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxtQkFBTCxDQUFBO1dBQ04sR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLE9BQUQsRUFBVSxLQUFWLENBQVIsRUFBMEI7TUFBQyxLQUFBLEdBQUQ7S0FBMUIsRUFBaUM7TUFBQSxLQUFBLEVBQU8sSUFBUDtLQUFqQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsR0FBRDtNQUNKLElBQXVELEdBQUEsS0FBUyxFQUFoRTtlQUFBLGlCQUFpQixDQUFDLE1BQWxCLENBQUEsQ0FBMEIsQ0FBQyxVQUEzQixDQUFzQyxHQUF0QyxDQUEwQyxDQUFDLE1BQTNDLENBQUEsRUFBQTs7SUFESSxDQUROLENBR0EsRUFBQyxLQUFELEVBSEEsQ0FHTyxTQUFDLEdBQUQ7YUFDTCxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQjtJQURLLENBSFA7RUFGZTtBQUpqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5PdXRwdXRWaWV3TWFuYWdlciA9IHJlcXVpcmUgJy4uL291dHB1dC12aWV3LW1hbmFnZXInXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIGN3ZCA9IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gIGdpdC5jbWQoWydzdGFzaCcsICdwb3AnXSwge2N3ZH0sIGNvbG9yOiB0cnVlKVxuICAudGhlbiAobXNnKSAtPlxuICAgIE91dHB1dFZpZXdNYW5hZ2VyLmNyZWF0ZSgpLnNldENvbnRlbnQobXNnKS5maW5pc2goKSBpZiBtc2cgaXNudCAnJ1xuICAuY2F0Y2ggKG1zZykgLT5cbiAgICBub3RpZmllci5hZGRJbmZvIG1zZ1xuIl19
