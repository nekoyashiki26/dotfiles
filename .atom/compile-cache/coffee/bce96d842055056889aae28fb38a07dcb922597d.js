(function() {
  var OutputViewManager, emptyOrUndefined, getUpstream, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  emptyOrUndefined = function(thing) {
    return thing !== '' && thing !== void 0;
  };

  getUpstream = function(repo) {
    var branch, branchInfo, ref, remote;
    branchInfo = (ref = repo.getUpstreamBranch()) != null ? ref.substring('refs/remotes/'.length).split('/') : void 0;
    if (!branchInfo) {
      return null;
    }
    remote = branchInfo[0];
    branch = branchInfo.slice(1).join('/');
    return [remote, branch];
  };

  module.exports = function(repo, arg) {
    var args, extraArgs, startMessage, upstream, view;
    extraArgs = (arg != null ? arg : {}).extraArgs;
    if (upstream = getUpstream(repo)) {
      if (extraArgs == null) {
        extraArgs = [];
      }
      view = OutputViewManager.create();
      startMessage = notifier.addInfo("Pulling...", {
        dismissable: true
      });
      args = ['pull'].concat(extraArgs).concat(upstream).filter(emptyOrUndefined);
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }, {
        color: true
      }).then(function(data) {
        view.setContent(data).finish();
        return startMessage.dismiss();
      })["catch"](function(error) {
        view.setContent(error).finish();
        return startMessage.dismiss();
      });
    } else {
      return notifier.addInfo('The current branch is not tracking from upstream');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvX3B1bGwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUjs7RUFFcEIsZ0JBQUEsR0FBbUIsU0FBQyxLQUFEO1dBQVcsS0FBQSxLQUFXLEVBQVgsSUFBa0IsS0FBQSxLQUFXO0VBQXhDOztFQUVuQixXQUFBLEdBQWMsU0FBQyxJQUFEO0FBQ1osUUFBQTtJQUFBLFVBQUEsaURBQXFDLENBQUUsU0FBMUIsQ0FBb0MsZUFBZSxDQUFDLE1BQXBELENBQTJELENBQUMsS0FBNUQsQ0FBa0UsR0FBbEU7SUFDYixJQUFlLENBQUksVUFBbkI7QUFBQSxhQUFPLEtBQVA7O0lBQ0EsTUFBQSxHQUFTLFVBQVcsQ0FBQSxDQUFBO0lBQ3BCLE1BQUEsR0FBUyxVQUFVLENBQUMsS0FBWCxDQUFpQixDQUFqQixDQUFtQixDQUFDLElBQXBCLENBQXlCLEdBQXpCO1dBQ1QsQ0FBQyxNQUFELEVBQVMsTUFBVDtFQUxZOztFQU9kLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDZixRQUFBO0lBRHVCLDJCQUFELE1BQVk7SUFDbEMsSUFBRyxRQUFBLEdBQVcsV0FBQSxDQUFZLElBQVosQ0FBZDs7UUFDRSxZQUFhOztNQUNiLElBQUEsR0FBTyxpQkFBaUIsQ0FBQyxNQUFsQixDQUFBO01BQ1AsWUFBQSxHQUFlLFFBQVEsQ0FBQyxPQUFULENBQWlCLFlBQWpCLEVBQStCO1FBQUEsV0FBQSxFQUFhLElBQWI7T0FBL0I7TUFDZixJQUFBLEdBQU8sQ0FBQyxNQUFELENBQVEsQ0FBQyxNQUFULENBQWdCLFNBQWhCLENBQTBCLENBQUMsTUFBM0IsQ0FBa0MsUUFBbEMsQ0FBMkMsQ0FBQyxNQUE1QyxDQUFtRCxnQkFBbkQ7YUFDUCxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQWQsRUFBK0M7UUFBQyxLQUFBLEVBQU8sSUFBUjtPQUEvQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtRQUNKLElBQUksQ0FBQyxVQUFMLENBQWdCLElBQWhCLENBQXFCLENBQUMsTUFBdEIsQ0FBQTtlQUNBLFlBQVksQ0FBQyxPQUFiLENBQUE7TUFGSSxDQUROLENBSUEsRUFBQyxLQUFELEVBSkEsQ0FJTyxTQUFDLEtBQUQ7UUFDTCxJQUFJLENBQUMsVUFBTCxDQUFnQixLQUFoQixDQUFzQixDQUFDLE1BQXZCLENBQUE7ZUFDQSxZQUFZLENBQUMsT0FBYixDQUFBO01BRkssQ0FKUCxFQUxGO0tBQUEsTUFBQTthQWFFLFFBQVEsQ0FBQyxPQUFULENBQWlCLGtEQUFqQixFQWJGOztFQURlO0FBYmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbk91dHB1dFZpZXdNYW5hZ2VyID0gcmVxdWlyZSAnLi4vb3V0cHV0LXZpZXctbWFuYWdlcidcblxuZW1wdHlPclVuZGVmaW5lZCA9ICh0aGluZykgLT4gdGhpbmcgaXNudCAnJyBhbmQgdGhpbmcgaXNudCB1bmRlZmluZWRcblxuZ2V0VXBzdHJlYW0gPSAocmVwbykgLT5cbiAgYnJhbmNoSW5mbyA9IHJlcG8uZ2V0VXBzdHJlYW1CcmFuY2goKT8uc3Vic3RyaW5nKCdyZWZzL3JlbW90ZXMvJy5sZW5ndGgpLnNwbGl0KCcvJylcbiAgcmV0dXJuIG51bGwgaWYgbm90IGJyYW5jaEluZm9cbiAgcmVtb3RlID0gYnJhbmNoSW5mb1swXVxuICBicmFuY2ggPSBicmFuY2hJbmZvLnNsaWNlKDEpLmpvaW4oJy8nKVxuICBbcmVtb3RlLCBicmFuY2hdXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtleHRyYUFyZ3N9PXt9KSAtPlxuICBpZiB1cHN0cmVhbSA9IGdldFVwc3RyZWFtKHJlcG8pXG4gICAgZXh0cmFBcmdzID89IFtdXG4gICAgdmlldyA9IE91dHB1dFZpZXdNYW5hZ2VyLmNyZWF0ZSgpXG4gICAgc3RhcnRNZXNzYWdlID0gbm90aWZpZXIuYWRkSW5mbyBcIlB1bGxpbmcuLi5cIiwgZGlzbWlzc2FibGU6IHRydWVcbiAgICBhcmdzID0gWydwdWxsJ10uY29uY2F0KGV4dHJhQXJncykuY29uY2F0KHVwc3RyZWFtKS5maWx0ZXIoZW1wdHlPclVuZGVmaW5lZClcbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICB2aWV3LnNldENvbnRlbnQoZGF0YSkuZmluaXNoKClcbiAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgdmlldy5zZXRDb250ZW50KGVycm9yKS5maW5pc2goKVxuICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICBlbHNlXG4gICAgbm90aWZpZXIuYWRkSW5mbyAnVGhlIGN1cnJlbnQgYnJhbmNoIGlzIG5vdCB0cmFja2luZyBmcm9tIHVwc3RyZWFtJ1xuIl19
