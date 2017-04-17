(function() {
  var OutputViewManager, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = function(repo) {
    var cwd;
    cwd = repo.getWorkingDirectory();
    return git.cmd(['stash', 'apply'], {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXN0YXNoLWFwcGx5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVI7O0VBRXBCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRDtBQUNmLFFBQUE7SUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLG1CQUFMLENBQUE7V0FDTixHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBUixFQUE0QjtNQUFDLEtBQUEsR0FBRDtLQUE1QixFQUFtQztNQUFBLEtBQUEsRUFBTyxJQUFQO0tBQW5DLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxHQUFEO01BQ0osSUFBdUQsR0FBQSxLQUFTLEVBQWhFO2VBQUEsaUJBQWlCLENBQUMsTUFBbEIsQ0FBQSxDQUEwQixDQUFDLFVBQTNCLENBQXNDLEdBQXRDLENBQTBDLENBQUMsTUFBM0MsQ0FBQSxFQUFBOztJQURJLENBRE4sQ0FHQSxFQUFDLEtBQUQsRUFIQSxDQUdPLFNBQUMsR0FBRDthQUNMLFFBQVEsQ0FBQyxPQUFULENBQWlCLEdBQWpCO0lBREssQ0FIUDtFQUZlO0FBSmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbk91dHB1dFZpZXdNYW5hZ2VyID0gcmVxdWlyZSAnLi4vb3V0cHV0LXZpZXctbWFuYWdlcidcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbykgLT5cbiAgY3dkID0gcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgZ2l0LmNtZChbJ3N0YXNoJywgJ2FwcGx5J10sIHtjd2R9LCBjb2xvcjogdHJ1ZSlcbiAgLnRoZW4gKG1zZykgLT5cbiAgICBPdXRwdXRWaWV3TWFuYWdlci5jcmVhdGUoKS5zZXRDb250ZW50KG1zZykuZmluaXNoKCkgaWYgbXNnIGlzbnQgJydcbiAgLmNhdGNoIChtc2cpIC0+XG4gICAgbm90aWZpZXIuYWRkSW5mbyBtc2dcbiJdfQ==
