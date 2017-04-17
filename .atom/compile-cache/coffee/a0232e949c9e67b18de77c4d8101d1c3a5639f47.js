(function() {
  var CompositeDisposable, Path, cleanup, cleanupUnstagedText, commit, destroyCommitEditor, diffFiles, disposables, fs, getGitStatus, getStagedFiles, git, notifier, parse, prepFile, prettifyFileStatuses, prettifyStagedFiles, prettyifyPreviousFile, showFile,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  disposables = new CompositeDisposable;

  prettifyStagedFiles = function(data) {
    var i, mode;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var j, len, results;
      results = [];
      for (i = j = 0, len = data.length; j < len; i = j += 2) {
        mode = data[i];
        results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return results;
    })();
  };

  prettyifyPreviousFile = function(data) {
    return {
      mode: data[0],
      path: data.substring(1).trim()
    };
  };

  prettifyFileStatuses = function(files) {
    return files.map(function(arg) {
      var mode, path;
      mode = arg.mode, path = arg.path;
      switch (mode) {
        case 'M':
          return "modified:   " + path;
        case 'A':
          return "new file:   " + path;
        case 'D':
          return "deleted:   " + path;
        case 'R':
          return "renamed:   " + path;
      }
    });
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      var args;
      if (files.length >= 1) {
        args = ['diff-index', '--no-color', '--cached', 'HEAD', '--name-status', '-z'];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          return prettifyStagedFiles(data);
        });
      } else {
        return Promise.resolve([]);
      }
    });
  };

  getGitStatus = function(repo) {
    return git.cmd(['-c', 'color.ui=false', 'status'], {
      cwd: repo.getWorkingDirectory()
    });
  };

  diffFiles = function(previousFiles, currentFiles) {
    var currentPaths;
    previousFiles = previousFiles.map(function(p) {
      return prettyifyPreviousFile(p);
    });
    currentPaths = currentFiles.map(function(arg) {
      var path;
      path = arg.path;
      return path;
    });
    return previousFiles.filter(function(p) {
      var ref;
      return (ref = p.path, indexOf.call(currentPaths, ref) >= 0) === false;
    });
  };

  parse = function(prevCommit) {
    var indexOfStatus, lines, message, prevChangedFiles, prevMessage, statusRegex;
    lines = prevCommit.split(/\n/).filter(function(line) {
      return line !== '/n';
    });
    statusRegex = /(([ MADRCU?!])\s(.*))/;
    indexOfStatus = lines.findIndex(function(line) {
      return statusRegex.test(line);
    });
    prevMessage = lines.splice(0, indexOfStatus - 1);
    prevMessage.reverse();
    if (prevMessage[0] === '') {
      prevMessage.shift();
    }
    prevMessage.reverse();
    prevChangedFiles = lines.filter(function(line) {
      return line !== '';
    });
    message = prevMessage.join('\n');
    return {
      message: message,
      prevChangedFiles: prevChangedFiles
    };
  };

  cleanupUnstagedText = function(status) {
    var text, unstagedFiles;
    unstagedFiles = status.indexOf("Changes not staged for commit:");
    if (unstagedFiles >= 0) {
      text = status.substring(unstagedFiles);
      return status = (status.substring(0, unstagedFiles - 1)) + "\n" + (text.replace(/\s*\(.*\)\n/g, ""));
    } else {
      return status;
    }
  };

  prepFile = function(arg) {
    var commentChar, currentChanges, filePath, message, nothingToCommit, prevChangedFiles, replacementText, status, textToReplace;
    commentChar = arg.commentChar, message = arg.message, prevChangedFiles = arg.prevChangedFiles, status = arg.status, filePath = arg.filePath;
    status = cleanupUnstagedText(status);
    status = status.replace(/\s*\(.*\)\n/g, "\n").replace(/\n/g, "\n" + commentChar + " ");
    if (prevChangedFiles.length > 0) {
      nothingToCommit = "nothing to commit, working directory clean";
      currentChanges = "committed:\n" + commentChar;
      textToReplace = null;
      if (status.indexOf(nothingToCommit) > -1) {
        textToReplace = nothingToCommit;
      } else if (status.indexOf(currentChanges) > -1) {
        textToReplace = currentChanges;
      }
      replacementText = "committed:\n" + (prevChangedFiles.map(function(f) {
        return commentChar + "   " + f;
      }).join("\n"));
      status = status.replace(textToReplace, replacementText);
    }
    return fs.writeFileSync(filePath, message + "\n" + commentChar + " Please enter the commit message for your changes. Lines starting\n" + commentChar + " with '" + commentChar + "' will be ignored, and an empty message aborts the commit.\n" + commentChar + "\n" + commentChar + " " + status);
  };

  showFile = function(filePath) {
    var commitEditor, ref, splitDirection;
    commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0;
    if (!commitEditor) {
      if (atom.config.get('git-plus.general.openInPane')) {
        splitDirection = atom.config.get('git-plus.general.splitPane');
        atom.workspace.getActivePane()["split" + splitDirection]();
      }
      return atom.workspace.open(filePath);
    } else {
      if (atom.config.get('git-plus.general.openInPane')) {
        atom.workspace.paneForURI(filePath).activate();
      } else {
        atom.workspace.paneForURI(filePath).activateItemForURI(filePath);
      }
      return Promise.resolve(commitEditor);
    }
  };

  destroyCommitEditor = function(filePath) {
    var ref, ref1;
    if (atom.config.get('git-plus.general.openInPane')) {
      return (ref = atom.workspace.paneForURI(filePath)) != null ? ref.destroy() : void 0;
    } else {
      return (ref1 = atom.workspace.paneForURI(filePath).itemForURI(filePath)) != null ? ref1.destroy() : void 0;
    }
  };

  commit = function(directory, filePath) {
    var args;
    args = ['commit', '--amend', '--cleanup=strip', "--file=" + filePath];
    return git.cmd(args, {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor(filePath);
      return git.refresh();
    })["catch"](function(data) {
      notifier.addError(data);
      return destroyCommitEditor(filePath);
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    return disposables.dispose();
  };

  module.exports = function(repo) {
    var commentChar, currentPane, cwd, filePath, ref;
    currentPane = atom.workspace.getActivePane();
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    cwd = repo.getWorkingDirectory();
    commentChar = (ref = git.getConfig(repo, 'core.commentchar')) != null ? ref : '#';
    return git.cmd(['whatchanged', '-1', '--name-status', '--format=%B'], {
      cwd: cwd
    }).then(function(amend) {
      return parse(amend);
    }).then(function(arg) {
      var message, prevChangedFiles;
      message = arg.message, prevChangedFiles = arg.prevChangedFiles;
      return getStagedFiles(repo).then(function(files) {
        prevChangedFiles = prettifyFileStatuses(diffFiles(prevChangedFiles, files));
        return {
          message: message,
          prevChangedFiles: prevChangedFiles
        };
      });
    }).then(function(arg) {
      var message, prevChangedFiles;
      message = arg.message, prevChangedFiles = arg.prevChangedFiles;
      return getGitStatus(repo).then(function(status) {
        return prepFile({
          commentChar: commentChar,
          message: message,
          prevChangedFiles: prevChangedFiles,
          status: status,
          filePath: filePath
        });
      }).then(function() {
        return showFile(filePath);
      });
    }).then(function(textEditor) {
      disposables.add(textEditor.onDidSave(function() {
        return commit(repo.getWorkingDirectory(), filePath);
      }));
      return disposables.add(textEditor.onDidDestroy(function() {
        return cleanup(currentPane, filePath);
      }));
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNvbW1pdC1hbWVuZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDBQQUFBO0lBQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBRVgsV0FBQSxHQUFjLElBQUk7O0VBRWxCLG1CQUFBLEdBQXNCLFNBQUMsSUFBRDtBQUNwQixRQUFBO0lBQUEsSUFBYSxJQUFBLEtBQVEsRUFBckI7QUFBQSxhQUFPLEdBQVA7O0lBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFpQjs7O0FBQ25CO1dBQUEsaURBQUE7O3FCQUNIO1VBQUMsTUFBQSxJQUFEO1VBQU8sSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUFsQjs7QUFERzs7O0VBSGU7O0VBTXRCLHFCQUFBLEdBQXdCLFNBQUMsSUFBRDtXQUN0QjtNQUFBLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxDQUFYO01BQ0EsSUFBQSxFQUFNLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBZixDQUFpQixDQUFDLElBQWxCLENBQUEsQ0FETjs7RUFEc0I7O0VBSXhCLG9CQUFBLEdBQXVCLFNBQUMsS0FBRDtXQUNyQixLQUFLLENBQUMsR0FBTixDQUFVLFNBQUMsR0FBRDtBQUNSLFVBQUE7TUFEVSxpQkFBTTtBQUNoQixjQUFPLElBQVA7QUFBQSxhQUNPLEdBRFA7aUJBRUksY0FBQSxHQUFlO0FBRm5CLGFBR08sR0FIUDtpQkFJSSxjQUFBLEdBQWU7QUFK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dUJBQVM7YUFDZixjQUFBLENBQWUsSUFBZixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsS0FBRDtRQUNKLGdCQUFBLEdBQW1CLG9CQUFBLENBQXFCLFNBQUEsQ0FBVSxnQkFBVixFQUE0QixLQUE1QixDQUFyQjtlQUNuQjtVQUFDLFNBQUEsT0FBRDtVQUFVLGtCQUFBLGdCQUFWOztNQUZJLENBRE47SUFESSxDQUZOLENBT0EsQ0FBQyxJQVBELENBT00sU0FBQyxHQUFEO0FBQ0osVUFBQTtNQURNLHVCQUFTO2FBQ2YsWUFBQSxDQUFhLElBQWIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLE1BQUQ7ZUFBWSxRQUFBLENBQVM7VUFBQyxhQUFBLFdBQUQ7VUFBYyxTQUFBLE9BQWQ7VUFBdUIsa0JBQUEsZ0JBQXZCO1VBQXlDLFFBQUEsTUFBekM7VUFBaUQsVUFBQSxRQUFqRDtTQUFUO01BQVosQ0FETixDQUVBLENBQUMsSUFGRCxDQUVNLFNBQUE7ZUFBRyxRQUFBLENBQVMsUUFBVDtNQUFILENBRk47SUFESSxDQVBOLENBV0EsQ0FBQyxJQVhELENBV00sU0FBQyxVQUFEO01BQ0osV0FBVyxDQUFDLEdBQVosQ0FBZ0IsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsU0FBQTtlQUFHLE1BQUEsQ0FBTyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFQLEVBQW1DLFFBQW5DO01BQUgsQ0FBckIsQ0FBaEI7YUFDQSxXQUFXLENBQUMsR0FBWixDQUFnQixVQUFVLENBQUMsWUFBWCxDQUF3QixTQUFBO2VBQUcsT0FBQSxDQUFRLFdBQVIsRUFBcUIsUUFBckI7TUFBSCxDQUF4QixDQUFoQjtJQUZJLENBWE4sQ0FjQSxFQUFDLEtBQUQsRUFkQSxDQWNPLFNBQUMsR0FBRDthQUFTLFFBQVEsQ0FBQyxPQUFULENBQWlCLEdBQWpCO0lBQVQsQ0FkUDtFQUxlO0FBL0hqQiIsInNvdXJjZXNDb250ZW50IjpbIlBhdGggPSByZXF1aXJlICdwYXRoJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5cbmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxucHJldHRpZnlTdGFnZWRGaWxlcyA9IChkYXRhKSAtPlxuICByZXR1cm4gW10gaWYgZGF0YSBpcyAnJ1xuICBkYXRhID0gZGF0YS5zcGxpdCgvXFwwLylbLi4uLTFdXG4gIFtdID0gZm9yIG1vZGUsIGkgaW4gZGF0YSBieSAyXG4gICAge21vZGUsIHBhdGg6IGRhdGFbaSsxXSB9XG5cbnByZXR0eWlmeVByZXZpb3VzRmlsZSA9IChkYXRhKSAtPlxuICBtb2RlOiBkYXRhWzBdXG4gIHBhdGg6IGRhdGEuc3Vic3RyaW5nKDEpLnRyaW0oKVxuXG5wcmV0dGlmeUZpbGVTdGF0dXNlcyA9IChmaWxlcykgLT5cbiAgZmlsZXMubWFwICh7bW9kZSwgcGF0aH0pIC0+XG4gICAgc3dpdGNoIG1vZGVcbiAgICAgIHdoZW4gJ00nXG4gICAgICAgIFwibW9kaWZpZWQ6ICAgI3twYXRofVwiXG4gICAgICB3aGVuICdBJ1xuICAgICAgICBcIm5ldyBmaWxlOiAgICN7cGF0aH1cIlxuICAgICAgd2hlbiAnRCdcbiAgICAgICAgXCJkZWxldGVkOiAgICN7cGF0aH1cIlxuICAgICAgd2hlbiAnUidcbiAgICAgICAgXCJyZW5hbWVkOiAgICN7cGF0aH1cIlxuXG5nZXRTdGFnZWRGaWxlcyA9IChyZXBvKSAtPlxuICBnaXQuc3RhZ2VkRmlsZXMocmVwbykudGhlbiAoZmlsZXMpIC0+XG4gICAgaWYgZmlsZXMubGVuZ3RoID49IDFcbiAgICAgIGFyZ3MgPSBbJ2RpZmYtaW5kZXgnLCAnLS1uby1jb2xvcicsICctLWNhY2hlZCcsICdIRUFEJywgJy0tbmFtZS1zdGF0dXMnLCAnLXonXVxuICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgLnRoZW4gKGRhdGEpIC0+IHByZXR0aWZ5U3RhZ2VkRmlsZXMgZGF0YVxuICAgIGVsc2VcbiAgICAgIFByb21pc2UucmVzb2x2ZSBbXVxuXG5nZXRHaXRTdGF0dXMgPSAocmVwbykgLT5cbiAgZ2l0LmNtZCBbJy1jJywgJ2NvbG9yLnVpPWZhbHNlJywgJ3N0YXR1cyddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG5cbmRpZmZGaWxlcyA9IChwcmV2aW91c0ZpbGVzLCBjdXJyZW50RmlsZXMpIC0+XG4gIHByZXZpb3VzRmlsZXMgPSBwcmV2aW91c0ZpbGVzLm1hcCAocCkgLT4gcHJldHR5aWZ5UHJldmlvdXNGaWxlIHBcbiAgY3VycmVudFBhdGhzID0gY3VycmVudEZpbGVzLm1hcCAoe3BhdGh9KSAtPiBwYXRoXG4gIHByZXZpb3VzRmlsZXMuZmlsdGVyIChwKSAtPiBwLnBhdGggaW4gY3VycmVudFBhdGhzIGlzIGZhbHNlXG5cbnBhcnNlID0gKHByZXZDb21taXQpIC0+XG4gIGxpbmVzID0gcHJldkNvbW1pdC5zcGxpdCgvXFxuLykuZmlsdGVyIChsaW5lKSAtPiBsaW5lIGlzbnQgJy9uJ1xuICBzdGF0dXNSZWdleCA9IC8oKFsgTUFEUkNVPyFdKVxccyguKikpL1xuICBpbmRleE9mU3RhdHVzID0gbGluZXMuZmluZEluZGV4IChsaW5lKSAtPiBzdGF0dXNSZWdleC50ZXN0IGxpbmVcblxuICBwcmV2TWVzc2FnZSA9IGxpbmVzLnNwbGljZSAwLCBpbmRleE9mU3RhdHVzIC0gMVxuICBwcmV2TWVzc2FnZS5yZXZlcnNlKClcbiAgcHJldk1lc3NhZ2Uuc2hpZnQoKSBpZiBwcmV2TWVzc2FnZVswXSBpcyAnJ1xuICBwcmV2TWVzc2FnZS5yZXZlcnNlKClcbiAgcHJldkNoYW5nZWRGaWxlcyA9IGxpbmVzLmZpbHRlciAobGluZSkgLT4gbGluZSBpc250ICcnXG4gIG1lc3NhZ2UgPSBwcmV2TWVzc2FnZS5qb2luKCdcXG4nKVxuICB7bWVzc2FnZSwgcHJldkNoYW5nZWRGaWxlc31cblxuY2xlYW51cFVuc3RhZ2VkVGV4dCA9IChzdGF0dXMpIC0+XG4gIHVuc3RhZ2VkRmlsZXMgPSBzdGF0dXMuaW5kZXhPZiBcIkNoYW5nZXMgbm90IHN0YWdlZCBmb3IgY29tbWl0OlwiXG4gIGlmIHVuc3RhZ2VkRmlsZXMgPj0gMFxuICAgIHRleHQgPSBzdGF0dXMuc3Vic3RyaW5nIHVuc3RhZ2VkRmlsZXNcbiAgICBzdGF0dXMgPSBcIiN7c3RhdHVzLnN1YnN0cmluZygwLCB1bnN0YWdlZEZpbGVzIC0gMSl9XFxuI3t0ZXh0LnJlcGxhY2UgL1xccypcXCguKlxcKVxcbi9nLCBcIlwifVwiXG4gIGVsc2VcbiAgICBzdGF0dXNcblxucHJlcEZpbGUgPSAoe2NvbW1lbnRDaGFyLCBtZXNzYWdlLCBwcmV2Q2hhbmdlZEZpbGVzLCBzdGF0dXMsIGZpbGVQYXRofSkgLT5cbiAgICBzdGF0dXMgPSBjbGVhbnVwVW5zdGFnZWRUZXh0IHN0YXR1c1xuICAgIHN0YXR1cyA9IHN0YXR1cy5yZXBsYWNlKC9cXHMqXFwoLipcXClcXG4vZywgXCJcXG5cIikucmVwbGFjZSgvXFxuL2csIFwiXFxuI3tjb21tZW50Q2hhcn0gXCIpXG4gICAgaWYgcHJldkNoYW5nZWRGaWxlcy5sZW5ndGggPiAwXG4gICAgICBub3RoaW5nVG9Db21taXQgPSBcIm5vdGhpbmcgdG8gY29tbWl0LCB3b3JraW5nIGRpcmVjdG9yeSBjbGVhblwiXG4gICAgICBjdXJyZW50Q2hhbmdlcyA9IFwiY29tbWl0dGVkOlxcbiN7Y29tbWVudENoYXJ9XCJcbiAgICAgIHRleHRUb1JlcGxhY2UgPSBudWxsXG4gICAgICBpZiBzdGF0dXMuaW5kZXhPZihub3RoaW5nVG9Db21taXQpID4gLTFcbiAgICAgICAgdGV4dFRvUmVwbGFjZSA9IG5vdGhpbmdUb0NvbW1pdFxuICAgICAgZWxzZSBpZiBzdGF0dXMuaW5kZXhPZihjdXJyZW50Q2hhbmdlcykgPiAtMVxuICAgICAgICB0ZXh0VG9SZXBsYWNlID0gY3VycmVudENoYW5nZXNcbiAgICAgIHJlcGxhY2VtZW50VGV4dCA9XG4gICAgICAgIFwiXCJcImNvbW1pdHRlZDpcbiAgICAgICAgI3tcbiAgICAgICAgICBwcmV2Q2hhbmdlZEZpbGVzLm1hcCgoZikgLT4gXCIje2NvbW1lbnRDaGFyfSAgICN7Zn1cIikuam9pbihcIlxcblwiKVxuICAgICAgICB9XCJcIlwiXG4gICAgICBzdGF0dXMgPSBzdGF0dXMucmVwbGFjZSB0ZXh0VG9SZXBsYWNlLCByZXBsYWNlbWVudFRleHRcbiAgICBmcy53cml0ZUZpbGVTeW5jIGZpbGVQYXRoLFxuICAgICAgXCJcIlwiI3ttZXNzYWdlfVxuICAgICAgI3tjb21tZW50Q2hhcn0gUGxlYXNlIGVudGVyIHRoZSBjb21taXQgbWVzc2FnZSBmb3IgeW91ciBjaGFuZ2VzLiBMaW5lcyBzdGFydGluZ1xuICAgICAgI3tjb21tZW50Q2hhcn0gd2l0aCAnI3tjb21tZW50Q2hhcn0nIHdpbGwgYmUgaWdub3JlZCwgYW5kIGFuIGVtcHR5IG1lc3NhZ2UgYWJvcnRzIHRoZSBjb21taXQuXG4gICAgICAje2NvbW1lbnRDaGFyfVxuICAgICAgI3tjb21tZW50Q2hhcn0gI3tzdGF0dXN9XCJcIlwiXG5cbnNob3dGaWxlID0gKGZpbGVQYXRoKSAtPlxuICBjb21taXRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKT8uaXRlbUZvclVSSShmaWxlUGF0aClcbiAgaWYgbm90IGNvbW1pdEVkaXRvclxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICAgIHNwbGl0RGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLnNwbGl0UGFuZScpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClbXCJzcGxpdCN7c3BsaXREaXJlY3Rpb259XCJdKClcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZpbGVQYXRoXG4gIGVsc2VcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwub3BlbkluUGFuZScpXG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5hY3RpdmF0ZSgpXG4gICAgZWxzZVxuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCkuYWN0aXZhdGVJdGVtRm9yVVJJKGZpbGVQYXRoKVxuICAgIFByb21pc2UucmVzb2x2ZShjb21taXRFZGl0b3IpXG5cbmRlc3Ryb3lDb21taXRFZGl0b3IgPSAoZmlsZVBhdGgpIC0+XG4gIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKT8uZGVzdHJveSgpXG4gIGVsc2VcbiAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5pdGVtRm9yVVJJKGZpbGVQYXRoKT8uZGVzdHJveSgpXG5cbmNvbW1pdCA9IChkaXJlY3RvcnksIGZpbGVQYXRoKSAtPlxuICBhcmdzID0gWydjb21taXQnLCAnLS1hbWVuZCcsICctLWNsZWFudXA9c3RyaXAnLCBcIi0tZmlsZT0je2ZpbGVQYXRofVwiXVxuICBnaXQuY21kKGFyZ3MsIGN3ZDogZGlyZWN0b3J5KVxuICAudGhlbiAoZGF0YSkgLT5cbiAgICBub3RpZmllci5hZGRTdWNjZXNzIGRhdGFcbiAgICBkZXN0cm95Q29tbWl0RWRpdG9yKGZpbGVQYXRoKVxuICAgIGdpdC5yZWZyZXNoKClcbiAgLmNhdGNoIChkYXRhKSAtPlxuICAgIG5vdGlmaWVyLmFkZEVycm9yIGRhdGFcbiAgICBkZXN0cm95Q29tbWl0RWRpdG9yKGZpbGVQYXRoKVxuXG5jbGVhbnVwID0gKGN1cnJlbnRQYW5lLCBmaWxlUGF0aCkgLT5cbiAgY3VycmVudFBhbmUuYWN0aXZhdGUoKSBpZiBjdXJyZW50UGFuZS5pc0FsaXZlKClcbiAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gIGZpbGVQYXRoID0gUGF0aC5qb2luKHJlcG8uZ2V0UGF0aCgpLCAnQ09NTUlUX0VESVRNU0cnKVxuICBjd2QgPSByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuICBjb21tZW50Q2hhciA9IGdpdC5nZXRDb25maWcocmVwbywgJ2NvcmUuY29tbWVudGNoYXInKSA/ICcjJ1xuICBnaXQuY21kKFsnd2hhdGNoYW5nZWQnLCAnLTEnLCAnLS1uYW1lLXN0YXR1cycsICctLWZvcm1hdD0lQiddLCB7Y3dkfSlcbiAgLnRoZW4gKGFtZW5kKSAtPiBwYXJzZSBhbWVuZFxuICAudGhlbiAoe21lc3NhZ2UsIHByZXZDaGFuZ2VkRmlsZXN9KSAtPlxuICAgIGdldFN0YWdlZEZpbGVzKHJlcG8pXG4gICAgLnRoZW4gKGZpbGVzKSAtPlxuICAgICAgcHJldkNoYW5nZWRGaWxlcyA9IHByZXR0aWZ5RmlsZVN0YXR1c2VzKGRpZmZGaWxlcyBwcmV2Q2hhbmdlZEZpbGVzLCBmaWxlcylcbiAgICAgIHttZXNzYWdlLCBwcmV2Q2hhbmdlZEZpbGVzfVxuICAudGhlbiAoe21lc3NhZ2UsIHByZXZDaGFuZ2VkRmlsZXN9KSAtPlxuICAgIGdldEdpdFN0YXR1cyhyZXBvKVxuICAgIC50aGVuIChzdGF0dXMpIC0+IHByZXBGaWxlIHtjb21tZW50Q2hhciwgbWVzc2FnZSwgcHJldkNoYW5nZWRGaWxlcywgc3RhdHVzLCBmaWxlUGF0aH1cbiAgICAudGhlbiAtPiBzaG93RmlsZSBmaWxlUGF0aFxuICAudGhlbiAodGV4dEVkaXRvcikgLT5cbiAgICBkaXNwb3NhYmxlcy5hZGQgdGV4dEVkaXRvci5vbkRpZFNhdmUgLT4gY29tbWl0KHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpLCBmaWxlUGF0aClcbiAgICBkaXNwb3NhYmxlcy5hZGQgdGV4dEVkaXRvci5vbkRpZERlc3Ryb3kgLT4gY2xlYW51cCBjdXJyZW50UGFuZSwgZmlsZVBhdGhcbiAgLmNhdGNoIChtc2cpIC0+IG5vdGlmaWVyLmFkZEluZm8gbXNnXG4iXX0=
