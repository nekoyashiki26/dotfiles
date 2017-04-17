(function() {
  var RemoveListView, git, gitRemove, notifier, prettify;

  git = require('../git');

  notifier = require('../notifier');

  RemoveListView = require('../views/remove-list-view');

  gitRemove = function(repo, arg) {
    var currentFile, cwd, ref, showSelector;
    showSelector = (arg != null ? arg : {}).showSelector;
    cwd = repo.getWorkingDirectory();
    currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
    if ((currentFile != null) && !showSelector) {
      if (repo.isPathModified(currentFile) === false || window.confirm('Are you sure?')) {
        atom.workspace.getActivePaneItem().destroy();
        return git.cmd(['rm', '-f', '--ignore-unmatch', currentFile], {
          cwd: cwd
        }).then(function(data) {
          return notifier.addSuccess("Removed " + (prettify(data)));
        });
      }
    } else {
      return git.cmd(['rm', '-r', '-n', '--ignore-unmatch', '-f', '*'], {
        cwd: cwd
      }).then(function(data) {
        return new RemoveListView(repo, prettify(data));
      });
    }
  };

  prettify = function(data) {
    var file, i, j, len, results;
    data = data.match(/rm ('.*')/g);
    if (data) {
      results = [];
      for (i = j = 0, len = data.length; j < len; i = ++j) {
        file = data[i];
        results.push(data[i] = file.match(/rm '(.*)'/)[1]);
      }
      return results;
    } else {
      return data;
    }
  };

  module.exports = gitRemove;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXJlbW92ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVI7O0VBRWpCLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ1YsUUFBQTtJQURrQiw4QkFBRCxNQUFlO0lBQ2hDLEdBQUEsR0FBTSxJQUFJLENBQUMsbUJBQUwsQ0FBQTtJQUNOLFdBQUEsR0FBYyxJQUFJLENBQUMsVUFBTCwyREFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCO0lBQ2QsSUFBRyxxQkFBQSxJQUFpQixDQUFJLFlBQXhCO01BQ0UsSUFBRyxJQUFJLENBQUMsY0FBTCxDQUFvQixXQUFwQixDQUFBLEtBQW9DLEtBQXBDLElBQTZDLE1BQU0sQ0FBQyxPQUFQLENBQWUsZUFBZixDQUFoRDtRQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFrQyxDQUFDLE9BQW5DLENBQUE7ZUFDQSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxrQkFBYixFQUFpQyxXQUFqQyxDQUFSLEVBQXVEO1VBQUMsS0FBQSxHQUFEO1NBQXZELENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2lCQUFVLFFBQVEsQ0FBQyxVQUFULENBQW9CLFVBQUEsR0FBVSxDQUFDLFFBQUEsQ0FBUyxJQUFULENBQUQsQ0FBOUI7UUFBVixDQUROLEVBRkY7T0FERjtLQUFBLE1BQUE7YUFNRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLGtCQUFuQixFQUF1QyxJQUF2QyxFQUE2QyxHQUE3QyxDQUFSLEVBQTJEO1FBQUMsS0FBQSxHQUFEO09BQTNELENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2VBQWMsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixRQUFBLENBQVMsSUFBVCxDQUFyQjtNQUFkLENBRE4sRUFORjs7RUFIVTs7RUFZWixRQUFBLEdBQVcsU0FBQyxJQUFEO0FBQ1QsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLFlBQVg7SUFDUCxJQUFHLElBQUg7QUFDRTtXQUFBLDhDQUFBOztxQkFDRSxJQUFLLENBQUEsQ0FBQSxDQUFMLEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxXQUFYLENBQXdCLENBQUEsQ0FBQTtBQURwQztxQkFERjtLQUFBLE1BQUE7YUFJRSxLQUpGOztFQUZTOztFQVFYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBeEJqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5SZW1vdmVMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3JlbW92ZS1saXN0LXZpZXcnXG5cbmdpdFJlbW92ZSA9IChyZXBvLCB7c2hvd1NlbGVjdG9yfT17fSkgLT5cbiAgY3dkID0gcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgY3VycmVudEZpbGUgPSByZXBvLnJlbGF0aXZpemUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkpXG4gIGlmIGN1cnJlbnRGaWxlPyBhbmQgbm90IHNob3dTZWxlY3RvclxuICAgIGlmIHJlcG8uaXNQYXRoTW9kaWZpZWQoY3VycmVudEZpbGUpIGlzIGZhbHNlIG9yIHdpbmRvdy5jb25maXJtKCdBcmUgeW91IHN1cmU/JylcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkuZGVzdHJveSgpXG4gICAgICBnaXQuY21kKFsncm0nLCAnLWYnLCAnLS1pZ25vcmUtdW5tYXRjaCcsIGN1cnJlbnRGaWxlXSwge2N3ZH0pXG4gICAgICAudGhlbiAoZGF0YSkgLT4gbm90aWZpZXIuYWRkU3VjY2VzcyhcIlJlbW92ZWQgI3twcmV0dGlmeSBkYXRhfVwiKVxuICBlbHNlXG4gICAgZ2l0LmNtZChbJ3JtJywgJy1yJywgJy1uJywgJy0taWdub3JlLXVubWF0Y2gnLCAnLWYnLCAnKiddLCB7Y3dkfSlcbiAgICAudGhlbiAoZGF0YSkgLT4gbmV3IFJlbW92ZUxpc3RWaWV3KHJlcG8sIHByZXR0aWZ5KGRhdGEpKVxuXG5wcmV0dGlmeSA9IChkYXRhKSAtPlxuICBkYXRhID0gZGF0YS5tYXRjaCgvcm0gKCcuKicpL2cpXG4gIGlmIGRhdGFcbiAgICBmb3IgZmlsZSwgaSBpbiBkYXRhXG4gICAgICBkYXRhW2ldID0gZmlsZS5tYXRjaCgvcm0gJyguKiknLylbMV1cbiAgZWxzZVxuICAgIGRhdGFcblxubW9kdWxlLmV4cG9ydHMgPSBnaXRSZW1vdmVcbiJdfQ==
