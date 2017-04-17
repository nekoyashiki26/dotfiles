(function() {
  var SelectUnstageFiles, git;

  git = require('../git');

  SelectUnstageFiles = require('../views/select-unstage-files-view');

  module.exports = function(repo) {
    return git.stagedFiles(repo).then(function(data) {
      return new SelectUnstageFiles(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXVuc3RhZ2UtZmlsZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sa0JBQUEsR0FBcUIsT0FBQSxDQUFRLG9DQUFSOztFQUVyQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQ7V0FDZixHQUFHLENBQUMsV0FBSixDQUFnQixJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFNBQUMsSUFBRDthQUFjLElBQUEsa0JBQUEsQ0FBbUIsSUFBbkIsRUFBeUIsSUFBekI7SUFBZCxDQUEzQjtFQURlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuU2VsZWN0VW5zdGFnZUZpbGVzID0gcmVxdWlyZSAnLi4vdmlld3Mvc2VsZWN0LXVuc3RhZ2UtZmlsZXMtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbykgLT5cbiAgZ2l0LnN0YWdlZEZpbGVzKHJlcG8pLnRoZW4gKGRhdGEpIC0+IG5ldyBTZWxlY3RVbnN0YWdlRmlsZXMocmVwbywgZGF0YSlcbiJdfQ==
