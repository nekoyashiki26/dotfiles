(function() {
  var OutputViewManager, fs, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  fs = require('fs-plus');

  module.exports = function(repo, arg) {
    var file, isFolder, ref, tool;
    file = (arg != null ? arg : {}).file;
    if (file == null) {
      file = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
    }
    isFolder = fs.isDirectorySync(file);
    if (!file) {
      return notifier.addInfo("No open file. Select 'Diff All'.");
    }
    if (!(tool = git.getConfig(repo, 'diff.tool'))) {
      return notifier.addInfo("You don't have a difftool configured.");
    } else {
      return git.cmd(['diff-index', 'HEAD', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        var args, diffIndex, diffsForCurrentFile, includeStagedDiff;
        diffIndex = data.split('\0');
        includeStagedDiff = atom.config.get('git-plus.diffs.includeStagedDiff');
        if (isFolder) {
          args = ['difftool', '-d', '--no-prompt'];
          if (includeStagedDiff) {
            args.push('HEAD');
          }
          args.push(file);
          git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          })["catch"](function(msg) {
            return OutputViewManager.create().setContent(msg).finish();
          });
          return;
        }
        diffsForCurrentFile = diffIndex.map(function(line, i) {
          var path, staged;
          if (i % 2 === 0) {
            staged = !/^0{40}$/.test(diffIndex[i].split(' ')[3]);
            path = diffIndex[i + 1];
            if (path === file && (!staged || includeStagedDiff)) {
              return true;
            }
          } else {
            return void 0;
          }
        });
        if (diffsForCurrentFile.filter(function(diff) {
          return diff != null;
        })[0] != null) {
          args = ['difftool', '--no-prompt'];
          if (includeStagedDiff) {
            args.push('HEAD');
          }
          args.push(file);
          return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          })["catch"](function(msg) {
            return OutputViewManager.create().setContent(msg).finish();
          });
        } else {
          return notifier.addInfo('Nothing to show.');
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWRpZmZ0b29sLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVI7O0VBQ3BCLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ2YsUUFBQTtJQUR1QixzQkFBRCxNQUFPOztNQUM3QixPQUFRLElBQUksQ0FBQyxVQUFMLDJEQUFvRCxDQUFFLE9BQXRDLENBQUEsVUFBaEI7O0lBQ1IsUUFBQSxHQUFXLEVBQUUsQ0FBQyxlQUFILENBQW1CLElBQW5CO0lBRVgsSUFBRyxDQUFJLElBQVA7QUFDRSxhQUFPLFFBQVEsQ0FBQyxPQUFULENBQWlCLGtDQUFqQixFQURUOztJQUtBLElBQUEsQ0FBTyxDQUFBLElBQUEsR0FBTyxHQUFHLENBQUMsU0FBSixDQUFjLElBQWQsRUFBb0IsV0FBcEIsQ0FBUCxDQUFQO2FBQ0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsdUNBQWpCLEVBREY7S0FBQSxNQUFBO2FBR0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFlBQUQsRUFBZSxNQUFmLEVBQXVCLElBQXZCLENBQVIsRUFBc0M7UUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUF0QyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtBQUNKLFlBQUE7UUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYO1FBQ1osaUJBQUEsR0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQjtRQUVwQixJQUFHLFFBQUg7VUFDRSxJQUFBLEdBQU8sQ0FBQyxVQUFELEVBQWEsSUFBYixFQUFtQixhQUFuQjtVQUNQLElBQW9CLGlCQUFwQjtZQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixFQUFBOztVQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVjtVQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO1lBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7V0FBZCxDQUNBLEVBQUMsS0FBRCxFQURBLENBQ08sU0FBQyxHQUFEO21CQUFTLGlCQUFpQixDQUFDLE1BQWxCLENBQUEsQ0FBMEIsQ0FBQyxVQUEzQixDQUFzQyxHQUF0QyxDQUEwQyxDQUFDLE1BQTNDLENBQUE7VUFBVCxDQURQO0FBRUEsaUJBTkY7O1FBUUEsbUJBQUEsR0FBc0IsU0FBUyxDQUFDLEdBQVYsQ0FBYyxTQUFDLElBQUQsRUFBTyxDQUFQO0FBQ2xDLGNBQUE7VUFBQSxJQUFHLENBQUEsR0FBSSxDQUFKLEtBQVMsQ0FBWjtZQUNFLE1BQUEsR0FBUyxDQUFJLFNBQVMsQ0FBQyxJQUFWLENBQWUsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBd0IsQ0FBQSxDQUFBLENBQXZDO1lBQ2IsSUFBQSxHQUFPLFNBQVUsQ0FBQSxDQUFBLEdBQUUsQ0FBRjtZQUNqQixJQUFRLElBQUEsS0FBUSxJQUFSLElBQWlCLENBQUMsQ0FBQyxNQUFELElBQVcsaUJBQVosQ0FBekI7cUJBQUEsS0FBQTthQUhGO1dBQUEsTUFBQTttQkFLRSxPQUxGOztRQURrQyxDQUFkO1FBUXRCLElBQUc7O3FCQUFIO1VBQ0UsSUFBQSxHQUFPLENBQUMsVUFBRCxFQUFhLGFBQWI7VUFDUCxJQUFvQixpQkFBcEI7WUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsRUFBQTs7VUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVY7aUJBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7WUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtXQUFkLENBQ0EsRUFBQyxLQUFELEVBREEsQ0FDTyxTQUFDLEdBQUQ7bUJBQVMsaUJBQWlCLENBQUMsTUFBbEIsQ0FBQSxDQUEwQixDQUFDLFVBQTNCLENBQXNDLEdBQXRDLENBQTBDLENBQUMsTUFBM0MsQ0FBQTtVQUFULENBRFAsRUFKRjtTQUFBLE1BQUE7aUJBT0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsa0JBQWpCLEVBUEY7O01BcEJJLENBRE4sRUFIRjs7RUFUZTtBQUxqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5PdXRwdXRWaWV3TWFuYWdlciA9IHJlcXVpcmUgJy4uL291dHB1dC12aWV3LW1hbmFnZXInXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtmaWxlfT17fSkgLT5cbiAgZmlsZSA/PSByZXBvLnJlbGF0aXZpemUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkpXG4gIGlzRm9sZGVyID0gZnMuaXNEaXJlY3RvcnlTeW5jIGZpbGVcblxuICBpZiBub3QgZmlsZVxuICAgIHJldHVybiBub3RpZmllci5hZGRJbmZvIFwiTm8gb3BlbiBmaWxlLiBTZWxlY3QgJ0RpZmYgQWxsJy5cIlxuXG4gICMgV2UgcGFyc2UgdGhlIG91dHB1dCBvZiBnaXQgZGlmZi1pbmRleCB0byBoYW5kbGUgdGhlIGNhc2Ugb2YgYSBzdGFnZWQgZmlsZVxuICAjIHdoZW4gZ2l0LXBsdXMuZGlmZnMuaW5jbHVkZVN0YWdlZERpZmYgaXMgc2V0IHRvIGZhbHNlLlxuICB1bmxlc3MgdG9vbCA9IGdpdC5nZXRDb25maWcocmVwbywgJ2RpZmYudG9vbCcpXG4gICAgbm90aWZpZXIuYWRkSW5mbyBcIllvdSBkb24ndCBoYXZlIGEgZGlmZnRvb2wgY29uZmlndXJlZC5cIlxuICBlbHNlXG4gICAgZ2l0LmNtZChbJ2RpZmYtaW5kZXgnLCAnSEVBRCcsICcteiddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgZGlmZkluZGV4ID0gZGF0YS5zcGxpdCgnXFwwJylcbiAgICAgIGluY2x1ZGVTdGFnZWREaWZmID0gYXRvbS5jb25maWcuZ2V0ICdnaXQtcGx1cy5kaWZmcy5pbmNsdWRlU3RhZ2VkRGlmZidcblxuICAgICAgaWYgaXNGb2xkZXJcbiAgICAgICAgYXJncyA9IFsnZGlmZnRvb2wnLCAnLWQnLCAnLS1uby1wcm9tcHQnXVxuICAgICAgICBhcmdzLnB1c2ggJ0hFQUQnIGlmIGluY2x1ZGVTdGFnZWREaWZmXG4gICAgICAgIGFyZ3MucHVzaCBmaWxlXG4gICAgICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgICAgLmNhdGNoIChtc2cpIC0+IE91dHB1dFZpZXdNYW5hZ2VyLmNyZWF0ZSgpLnNldENvbnRlbnQobXNnKS5maW5pc2goKVxuICAgICAgICByZXR1cm5cblxuICAgICAgZGlmZnNGb3JDdXJyZW50RmlsZSA9IGRpZmZJbmRleC5tYXAgKGxpbmUsIGkpIC0+XG4gICAgICAgIGlmIGkgJSAyIGlzIDBcbiAgICAgICAgICBzdGFnZWQgPSBub3QgL14wezQwfSQvLnRlc3QoZGlmZkluZGV4W2ldLnNwbGl0KCcgJylbM10pO1xuICAgICAgICAgIHBhdGggPSBkaWZmSW5kZXhbaSsxXVxuICAgICAgICAgIHRydWUgaWYgcGF0aCBpcyBmaWxlIGFuZCAoIXN0YWdlZCBvciBpbmNsdWRlU3RhZ2VkRGlmZilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHVuZGVmaW5lZFxuXG4gICAgICBpZiBkaWZmc0ZvckN1cnJlbnRGaWxlLmZpbHRlcigoZGlmZikgLT4gZGlmZj8pWzBdP1xuICAgICAgICBhcmdzID0gWydkaWZmdG9vbCcsICctLW5vLXByb21wdCddXG4gICAgICAgIGFyZ3MucHVzaCAnSEVBRCcgaWYgaW5jbHVkZVN0YWdlZERpZmZcbiAgICAgICAgYXJncy5wdXNoIGZpbGVcbiAgICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgICAuY2F0Y2ggKG1zZykgLT4gT3V0cHV0Vmlld01hbmFnZXIuY3JlYXRlKCkuc2V0Q29udGVudChtc2cpLmZpbmlzaCgpXG4gICAgICBlbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZEluZm8gJ05vdGhpbmcgdG8gc2hvdy4nXG4iXX0=
