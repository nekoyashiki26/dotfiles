(function() {
  var SelectStageFiles, git;

  git = require('../git');

  SelectStageFiles = require('../views/select-stage-files-view');

  module.exports = function(repo) {
    return git.unstagedFiles(repo, {
      showUntracked: true
    }).then(function(data) {
      return new SelectStageFiles(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXN0YWdlLWZpbGVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQ0FBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO1dBQ2YsR0FBRyxDQUFDLGFBQUosQ0FBa0IsSUFBbEIsRUFBd0I7TUFBQSxhQUFBLEVBQWUsSUFBZjtLQUF4QixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDthQUFjLElBQUEsZ0JBQUEsQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkI7SUFBZCxDQUROO0VBRGU7QUFIakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5TZWxlY3RTdGFnZUZpbGVzID0gcmVxdWlyZSAnLi4vdmlld3Mvc2VsZWN0LXN0YWdlLWZpbGVzLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIGdpdC51bnN0YWdlZEZpbGVzKHJlcG8sIHNob3dVbnRyYWNrZWQ6IHRydWUpXG4gIC50aGVuIChkYXRhKSAtPiBuZXcgU2VsZWN0U3RhZ2VGaWxlcyhyZXBvLCBkYXRhKVxuIl19
