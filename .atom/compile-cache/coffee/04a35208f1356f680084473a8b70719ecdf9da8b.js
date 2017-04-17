(function() {
  var OutputViewManager, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = function(repo) {
    var cwd;
    cwd = repo.getWorkingDirectory();
    return git.cmd(['stash', 'drop'], {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXN0YXNoLWRyb3AuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUjs7RUFFcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO0FBQ2YsUUFBQTtJQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsbUJBQUwsQ0FBQTtXQUNOLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFSLEVBQTJCO01BQUMsS0FBQSxHQUFEO0tBQTNCLEVBQWtDO01BQUEsS0FBQSxFQUFPLElBQVA7S0FBbEMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLEdBQUQ7TUFDSixJQUF1RCxHQUFBLEtBQVMsRUFBaEU7ZUFBQSxpQkFBaUIsQ0FBQyxNQUFsQixDQUFBLENBQTBCLENBQUMsVUFBM0IsQ0FBc0MsR0FBdEMsQ0FBMEMsQ0FBQyxNQUEzQyxDQUFBLEVBQUE7O0lBREksQ0FETixDQUdBLEVBQUMsS0FBRCxFQUhBLENBR08sU0FBQyxHQUFEO2FBQ0wsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsR0FBakI7SUFESyxDQUhQO0VBRmU7QUFKakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuT3V0cHV0Vmlld01hbmFnZXIgPSByZXF1aXJlICcuLi9vdXRwdXQtdmlldy1tYW5hZ2VyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBjd2QgPSByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuICBnaXQuY21kKFsnc3Rhc2gnLCAnZHJvcCddLCB7Y3dkfSwgY29sb3I6IHRydWUpXG4gIC50aGVuIChtc2cpIC0+XG4gICAgT3V0cHV0Vmlld01hbmFnZXIuY3JlYXRlKCkuc2V0Q29udGVudChtc2cpLmZpbmlzaCgpIGlmIG1zZyBpc250ICcnXG4gIC5jYXRjaCAobXNnKSAtPlxuICAgIG5vdGlmaWVyLmFkZEluZm8gbXNnXG4iXX0=
