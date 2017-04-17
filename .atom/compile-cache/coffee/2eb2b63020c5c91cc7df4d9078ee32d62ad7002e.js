(function() {
  var git;

  git = require('../git');

  module.exports = function(repos) {
    return repos.map(function(repo) {
      var cwd;
      cwd = repo.getWorkingDirectory();
      return git.cmd(['fetch', '--all'], {
        cwd: cwd
      }).then(function(message) {
        var options, repoName;
        if (atom.config.get('git-plus.experimental.autoFetchNotify')) {
          repoName = cwd.split('/').pop();
          options = {
            icon: 'repo-pull',
            detail: "In " + repoName + " repo:",
            description: message.replace(/(Fetch)ing/g, '$1ed')
          };
          return atom.notifications.addSuccess('Git-Plus', options);
        }
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWZldGNoLWFsbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFFTixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLEtBQUQ7V0FDZixLQUFLLENBQUMsR0FBTixDQUFVLFNBQUMsSUFBRDtBQUNSLFVBQUE7TUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLG1CQUFMLENBQUE7YUFDTixHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBUixFQUEyQjtRQUFDLEtBQUEsR0FBRDtPQUEzQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsT0FBRDtBQUNKLFlBQUE7UUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEIsQ0FBSDtVQUNFLFFBQUEsR0FBVyxHQUFHLENBQUMsS0FBSixDQUFVLEdBQVYsQ0FBYyxDQUFDLEdBQWYsQ0FBQTtVQUNYLE9BQUEsR0FDRTtZQUFBLElBQUEsRUFBTSxXQUFOO1lBQ0EsTUFBQSxFQUFRLEtBQUEsR0FBTSxRQUFOLEdBQWUsUUFEdkI7WUFFQSxXQUFBLEVBQWEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsYUFBaEIsRUFBK0IsTUFBL0IsQ0FGYjs7aUJBR0YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUE4QixVQUE5QixFQUEwQyxPQUExQyxFQU5GOztNQURJLENBRE47SUFGUSxDQUFWO0VBRGU7QUFGakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG9zKSAtPlxuICByZXBvcy5tYXAgKHJlcG8pIC0+XG4gICAgY3dkID0gcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgICBnaXQuY21kKFsnZmV0Y2gnLCctLWFsbCddLCB7Y3dkfSlcbiAgICAudGhlbiAobWVzc2FnZSkgLT5cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZXhwZXJpbWVudGFsLmF1dG9GZXRjaE5vdGlmeScpXG4gICAgICAgIHJlcG9OYW1lID0gY3dkLnNwbGl0KCcvJykucG9wKClcbiAgICAgICAgb3B0aW9ucyA9XG4gICAgICAgICAgaWNvbjogJ3JlcG8tcHVsbCdcbiAgICAgICAgICBkZXRhaWw6IFwiSW4gI3tyZXBvTmFtZX0gcmVwbzpcIlxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXNzYWdlLnJlcGxhY2UoLyhGZXRjaClpbmcvZywgJyQxZWQnKVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnR2l0LVBsdXMnLCBvcHRpb25zKVxuIl19
