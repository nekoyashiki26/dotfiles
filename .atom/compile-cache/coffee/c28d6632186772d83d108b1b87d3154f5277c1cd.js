(function() {
  var RemoteListView, git, pull;

  git = require('../git');

  pull = require('./_pull');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo) {
    var extraArgs;
    extraArgs = atom.config.get('git-plus.remoteInteractions.pullRebase') ? ['--rebase'] : [];
    if (atom.config.get('git-plus.remoteInteractions.promptForBranch')) {
      return git.cmd(['remote'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return new RemoteListView(repo, data, {
          mode: 'pull',
          extraArgs: extraArgs
        }).result;
      });
    } else {
      return pull(repo, {
        extraArgs: extraArgs
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXB1bGwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSOztFQUNQLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQ7QUFDZixRQUFBO0lBQUEsU0FBQSxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsQ0FBSCxHQUFrRSxDQUFDLFVBQUQsQ0FBbEUsR0FBb0Y7SUFDaEcsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkNBQWhCLENBQUg7YUFDRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxDQUFSLEVBQW9CO1FBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBcEIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7ZUFDSixJQUFJLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTJCO1VBQUEsSUFBQSxFQUFNLE1BQU47VUFBYyxTQUFBLEVBQVcsU0FBekI7U0FBM0IsQ0FBOEQsQ0FBQztNQUQvRCxDQUROLEVBREY7S0FBQSxNQUFBO2FBS0UsSUFBQSxDQUFLLElBQUwsRUFBVztRQUFDLFdBQUEsU0FBRDtPQUFYLEVBTEY7O0VBRmU7QUFKakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5wdWxsID0gcmVxdWlyZSAnLi9fcHVsbCdcblJlbW90ZUxpc3RWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvcmVtb3RlLWxpc3QtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbykgLT5cbiAgZXh0cmFBcmdzID0gaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5yZW1vdGVJbnRlcmFjdGlvbnMucHVsbFJlYmFzZScpIHRoZW4gWyctLXJlYmFzZSddIGVsc2UgW11cbiAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5yZW1vdGVJbnRlcmFjdGlvbnMucHJvbXB0Rm9yQnJhbmNoJylcbiAgICBnaXQuY21kKFsncmVtb3RlJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBuZXcgUmVtb3RlTGlzdFZpZXcocmVwbywgZGF0YSwgbW9kZTogJ3B1bGwnLCBleHRyYUFyZ3M6IGV4dHJhQXJncykucmVzdWx0XG4gIGVsc2VcbiAgICBwdWxsIHJlcG8sIHtleHRyYUFyZ3N9XG4iXX0=
