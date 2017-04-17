(function() {
  var MergeListView, git;

  git = require('../git');

  MergeListView = require('../views/merge-list-view');

  module.exports = function(repo, arg) {
    var args, extraArgs, noFastForward, ref, remote;
    ref = arg != null ? arg : {}, remote = ref.remote, noFastForward = ref.noFastForward;
    extraArgs = noFastForward ? ['--no-ff'] : [];
    args = ['branch', '--no-color'];
    if (remote) {
      args.push('-r');
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new MergeListView(repo, data, extraArgs);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LW1lcmdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLDBCQUFSOztFQUVoQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ2YsUUFBQTt3QkFEc0IsTUFBd0IsSUFBdkIscUJBQVE7SUFDL0IsU0FBQSxHQUFlLGFBQUgsR0FBc0IsQ0FBQyxTQUFELENBQXRCLEdBQXVDO0lBQ25ELElBQUEsR0FBTyxDQUFDLFFBQUQsRUFBVyxZQUFYO0lBQ1AsSUFBa0IsTUFBbEI7TUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsRUFBQTs7V0FDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFBYyxJQUFBLGFBQUEsQ0FBYyxJQUFkLEVBQW9CLElBQXBCLEVBQTBCLFNBQTFCO0lBQWQsQ0FETjtFQUplO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuTWVyZ2VMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL21lcmdlLWxpc3QtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywge3JlbW90ZSwgbm9GYXN0Rm9yd2FyZH09e30pIC0+XG4gIGV4dHJhQXJncyA9IGlmIG5vRmFzdEZvcndhcmQgdGhlbiBbJy0tbm8tZmYnXSBlbHNlIFtdXG4gIGFyZ3MgPSBbJ2JyYW5jaCcsICctLW5vLWNvbG9yJ11cbiAgYXJncy5wdXNoICctcicgaWYgcmVtb3RlXG4gIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+IG5ldyBNZXJnZUxpc3RWaWV3KHJlcG8sIGRhdGEsIGV4dHJhQXJncylcbiJdfQ==
