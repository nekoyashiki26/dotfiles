(function() {
  var CompositeDisposable, GitPull, GitPush, Path, cleanup, commit, destroyCommitEditor, disposables, fs, getStagedFiles, getTemplate, git, notifier, prepFile, showFile, trimFile, verboseCommitsEnabled;

  Path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  GitPush = require('./git-push');

  GitPull = require('./git-pull');

  disposables = new CompositeDisposable;

  verboseCommitsEnabled = function() {
    return atom.config.get('git-plus.commits.verboseCommits');
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      if (files.length >= 1) {
        return git.cmd(['-c', 'color.ui=false', 'status'], {
          cwd: repo.getWorkingDirectory()
        });
      } else {
        return Promise.reject("Nothing to commit.");
      }
    });
  };

  getTemplate = function(filePath) {
    var e;
    if (filePath) {
      try {
        return fs.readFileSync(fs.absolute(filePath.trim())).toString().trim();
      } catch (error) {
        e = error;
        throw new Error("Your configured commit template file can't be found.");
      }
    } else {
      return '';
    }
  };

  prepFile = function(arg) {
    var commentChar, commitEditor, content, cwd, diff, filePath, indexOfComments, ref, status, template, text;
    status = arg.status, filePath = arg.filePath, diff = arg.diff, commentChar = arg.commentChar, template = arg.template;
    if (commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0) {
      text = commitEditor.getText();
      indexOfComments = text.indexOf(commentChar);
      if (indexOfComments > 0) {
        template = text.substring(0, indexOfComments - 1);
      }
    }
    cwd = Path.dirname(filePath);
    status = status.replace(/\s*\(.*\)\n/g, "\n");
    status = status.trim().replace(/\n/g, "\n" + commentChar + " ");
    content = template + "\n" + commentChar + " Please enter the commit message for your changes. Lines starting\n" + commentChar + " with '" + commentChar + "' will be ignored, and an empty message aborts the commit.\n" + commentChar + "\n" + commentChar + " " + status;
    if (diff) {
      content += "\n" + commentChar + "\n" + commentChar + " ------------------------ >8 ------------------------\n" + commentChar + " Do not touch the line above.\n" + commentChar + " Everything below will be removed.\n" + diff;
    }
    return fs.writeFileSync(filePath, content);
  };

  destroyCommitEditor = function(filePath) {
    var ref, ref1;
    if (atom.config.get('git-plus.general.openInPane')) {
      return (ref = atom.workspace.paneForURI(filePath)) != null ? ref.destroy() : void 0;
    } else {
      return (ref1 = atom.workspace.paneForURI(filePath).itemForURI(filePath)) != null ? ref1.destroy() : void 0;
    }
  };

  trimFile = function(filePath, commentChar) {
    var content, cwd, startOfComments;
    cwd = Path.dirname(filePath);
    content = fs.readFileSync(fs.absolute(filePath)).toString();
    startOfComments = content.indexOf(content.split('\n').find(function(line) {
      return line.startsWith(commentChar);
    }));
    content = content.substring(0, startOfComments);
    return fs.writeFileSync(filePath, content);
  };

  commit = function(directory, filePath) {
    return git.cmd(['commit', "--cleanup=strip", "--file=" + filePath], {
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

  cleanup = function(currentPane) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    return disposables.dispose();
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

  module.exports = function(repo, arg) {
    var andPush, commentChar, currentPane, e, filePath, init, ref, ref1, stageChanges, startCommit, template;
    ref = arg != null ? arg : {}, stageChanges = ref.stageChanges, andPush = ref.andPush;
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    currentPane = atom.workspace.getActivePane();
    commentChar = (ref1 = git.getConfig(repo, 'core.commentchar')) != null ? ref1 : '#';
    try {
      template = getTemplate(git.getConfig(repo, 'commit.template'));
    } catch (error) {
      e = error;
      notifier.addError(e.message);
      return Promise.reject(e.message);
    }
    init = function() {
      return getStagedFiles(repo).then(function(status) {
        var args;
        if (verboseCommitsEnabled()) {
          args = ['diff', '--color=never', '--staged'];
          if (atom.config.get('git-plus.diffs.wordDiff')) {
            args.push('--word-diff');
          }
          return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          }).then(function(diff) {
            return prepFile({
              status: status,
              filePath: filePath,
              diff: diff,
              commentChar: commentChar,
              template: template
            });
          });
        } else {
          return prepFile({
            status: status,
            filePath: filePath,
            commentChar: commentChar,
            template: template
          });
        }
      });
    };
    startCommit = function() {
      return showFile(filePath).then(function(textEditor) {
        disposables.dispose();
        disposables = new CompositeDisposable;
        disposables.add(textEditor.onDidSave(function() {
          if (verboseCommitsEnabled()) {
            trimFile(filePath, commentChar);
          }
          return commit(repo.getWorkingDirectory(), filePath).then(function() {
            if (andPush) {
              return GitPush(repo);
            }
          });
        }));
        return disposables.add(textEditor.onDidDestroy(function() {
          return cleanup(currentPane);
        }));
      })["catch"](notifier.addError);
    };
    if (stageChanges) {
      return git.add(repo, {
        update: true
      }).then(init).then(startCommit);
    } else {
      return init().then(function() {
        return startCommit();
      })["catch"](function(message) {
        if (typeof message.includes === "function" ? message.includes('CRLF') : void 0) {
          return startCommit();
        } else {
          return notifier.addInfo(message);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNvbW1pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDTixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUjs7RUFDVixPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVI7O0VBRVYsV0FBQSxHQUFjLElBQUk7O0VBRWxCLHFCQUFBLEdBQXdCLFNBQUE7V0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCO0VBQUg7O0VBRXhCLGNBQUEsR0FBaUIsU0FBQyxJQUFEO1dBQ2YsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEIsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixTQUFDLEtBQUQ7TUFDekIsSUFBRyxLQUFLLENBQUMsTUFBTixJQUFnQixDQUFuQjtlQUNFLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxJQUFELEVBQU8sZ0JBQVAsRUFBeUIsUUFBekIsQ0FBUixFQUE0QztVQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1NBQTVDLEVBREY7T0FBQSxNQUFBO2VBR0UsT0FBTyxDQUFDLE1BQVIsQ0FBZSxvQkFBZixFQUhGOztJQUR5QixDQUEzQjtFQURlOztFQU9qQixXQUFBLEdBQWMsU0FBQyxRQUFEO0FBQ1osUUFBQTtJQUFBLElBQUcsUUFBSDtBQUNFO2VBQ0UsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsRUFBRSxDQUFDLFFBQUgsQ0FBWSxRQUFR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LENBQWlCLE9BQWpCLEVBSEY7O01BREssQ0FEUCxFQUhGOztFQTlCZTtBQTlGakIiLCJzb3VyY2VzQ29udGVudCI6WyJQYXRoID0gcmVxdWlyZSAncGF0aCdcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuR2l0UHVzaCA9IHJlcXVpcmUgJy4vZ2l0LXB1c2gnXG5HaXRQdWxsID0gcmVxdWlyZSAnLi9naXQtcHVsbCdcblxuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG52ZXJib3NlQ29tbWl0c0VuYWJsZWQgPSAtPiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmNvbW1pdHMudmVyYm9zZUNvbW1pdHMnKVxuXG5nZXRTdGFnZWRGaWxlcyA9IChyZXBvKSAtPlxuICBnaXQuc3RhZ2VkRmlsZXMocmVwbykudGhlbiAoZmlsZXMpIC0+XG4gICAgaWYgZmlsZXMubGVuZ3RoID49IDFcbiAgICAgIGdpdC5jbWQoWyctYycsICdjb2xvci51aT1mYWxzZScsICdzdGF0dXMnXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICBlbHNlXG4gICAgICBQcm9taXNlLnJlamVjdCBcIk5vdGhpbmcgdG8gY29tbWl0LlwiXG5cbmdldFRlbXBsYXRlID0gKGZpbGVQYXRoKSAtPlxuICBpZiBmaWxlUGF0aFxuICAgIHRyeVxuICAgICAgZnMucmVhZEZpbGVTeW5jKGZzLmFic29sdXRlKGZpbGVQYXRoLnRyaW0oKSkpLnRvU3RyaW5nKCkudHJpbSgpXG4gICAgY2F0Y2ggZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91ciBjb25maWd1cmVkIGNvbW1pdCB0ZW1wbGF0ZSBmaWxlIGNhbid0IGJlIGZvdW5kLlwiKVxuICBlbHNlXG4gICAgJydcblxucHJlcEZpbGUgPSAoe3N0YXR1cywgZmlsZVBhdGgsIGRpZmYsIGNvbW1lbnRDaGFyLCB0ZW1wbGF0ZX0pIC0+XG4gIGlmIGNvbW1pdEVkaXRvciA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpPy5pdGVtRm9yVVJJKGZpbGVQYXRoKVxuICAgIHRleHQgPSBjb21taXRFZGl0b3IuZ2V0VGV4dCgpXG4gICAgaW5kZXhPZkNvbW1lbnRzID0gdGV4dC5pbmRleE9mKGNvbW1lbnRDaGFyKVxuICAgIGlmIGluZGV4T2ZDb21tZW50cyA+IDBcbiAgICAgIHRlbXBsYXRlID0gdGV4dC5zdWJzdHJpbmcoMCwgaW5kZXhPZkNvbW1lbnRzIC0gMSlcblxuICBjd2QgPSBQYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gIHN0YXR1cyA9IHN0YXR1cy5yZXBsYWNlKC9cXHMqXFwoLipcXClcXG4vZywgXCJcXG5cIilcbiAgc3RhdHVzID0gc3RhdHVzLnRyaW0oKS5yZXBsYWNlKC9cXG4vZywgXCJcXG4je2NvbW1lbnRDaGFyfSBcIilcbiAgY29udGVudCA9XG4gICAgXCJcIlwiI3t0ZW1wbGF0ZX1cbiAgICAje2NvbW1lbnRDaGFyfSBQbGVhc2UgZW50ZXIgdGhlIGNvbW1pdCBtZXNzYWdlIGZvciB5b3VyIGNoYW5nZXMuIExpbmVzIHN0YXJ0aW5nXG4gICAgI3tjb21tZW50Q2hhcn0gd2l0aCAnI3tjb21tZW50Q2hhcn0nIHdpbGwgYmUgaWdub3JlZCwgYW5kIGFuIGVtcHR5IG1lc3NhZ2UgYWJvcnRzIHRoZSBjb21taXQuXG4gICAgI3tjb21tZW50Q2hhcn1cbiAgICAje2NvbW1lbnRDaGFyfSAje3N0YXR1c31cIlwiXCJcbiAgaWYgZGlmZlxuICAgIGNvbnRlbnQgKz1cbiAgICAgIFwiXCJcIlxcbiN7Y29tbWVudENoYXJ9XG4gICAgICAje2NvbW1lbnRDaGFyfSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gPjggLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAje2NvbW1lbnRDaGFyfSBEbyBub3QgdG91Y2ggdGhlIGxpbmUgYWJvdmUuXG4gICAgICAje2NvbW1lbnRDaGFyfSBFdmVyeXRoaW5nIGJlbG93IHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAgICN7ZGlmZn1cIlwiXCJcbiAgZnMud3JpdGVGaWxlU3luYyBmaWxlUGF0aCwgY29udGVudFxuXG5kZXN0cm95Q29tbWl0RWRpdG9yID0gKGZpbGVQYXRoKSAtPlxuICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwub3BlbkluUGFuZScpXG4gICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCk/LmRlc3Ryb3koKVxuICBlbHNlXG4gICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCkuaXRlbUZvclVSSShmaWxlUGF0aCk/LmRlc3Ryb3koKVxuXG50cmltRmlsZSA9IChmaWxlUGF0aCwgY29tbWVudENoYXIpIC0+XG4gIGN3ZCA9IFBhdGguZGlybmFtZShmaWxlUGF0aClcbiAgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmcy5hYnNvbHV0ZShmaWxlUGF0aCkpLnRvU3RyaW5nKClcbiAgc3RhcnRPZkNvbW1lbnRzID0gY29udGVudC5pbmRleE9mKGNvbnRlbnQuc3BsaXQoJ1xcbicpLmZpbmQgKGxpbmUpIC0+IGxpbmUuc3RhcnRzV2l0aCBjb21tZW50Q2hhcilcbiAgY29udGVudCA9IGNvbnRlbnQuc3Vic3RyaW5nKDAsIHN0YXJ0T2ZDb21tZW50cylcbiAgZnMud3JpdGVGaWxlU3luYyBmaWxlUGF0aCwgY29udGVudFxuXG5jb21taXQgPSAoZGlyZWN0b3J5LCBmaWxlUGF0aCkgLT5cbiAgZ2l0LmNtZChbJ2NvbW1pdCcsIFwiLS1jbGVhbnVwPXN0cmlwXCIsIFwiLS1maWxlPSN7ZmlsZVBhdGh9XCJdLCBjd2Q6IGRpcmVjdG9yeSlcbiAgLnRoZW4gKGRhdGEpIC0+XG4gICAgbm90aWZpZXIuYWRkU3VjY2VzcyBkYXRhXG4gICAgZGVzdHJveUNvbW1pdEVkaXRvcihmaWxlUGF0aClcbiAgICBnaXQucmVmcmVzaCgpXG4gIC5jYXRjaCAoZGF0YSkgLT5cbiAgICBub3RpZmllci5hZGRFcnJvciBkYXRhXG4gICAgZGVzdHJveUNvbW1pdEVkaXRvcihmaWxlUGF0aClcblxuY2xlYW51cCA9IChjdXJyZW50UGFuZSkgLT5cbiAgY3VycmVudFBhbmUuYWN0aXZhdGUoKSBpZiBjdXJyZW50UGFuZS5pc0FsaXZlKClcbiAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbnNob3dGaWxlID0gKGZpbGVQYXRoKSAtPlxuICBjb21taXRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKT8uaXRlbUZvclVSSShmaWxlUGF0aClcbiAgaWYgbm90IGNvbW1pdEVkaXRvclxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICAgIHNwbGl0RGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLnNwbGl0UGFuZScpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClbXCJzcGxpdCN7c3BsaXREaXJlY3Rpb259XCJdKClcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZpbGVQYXRoXG4gIGVsc2VcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwub3BlbkluUGFuZScpXG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5hY3RpdmF0ZSgpXG4gICAgZWxzZVxuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCkuYWN0aXZhdGVJdGVtRm9yVVJJKGZpbGVQYXRoKVxuICAgIFByb21pc2UucmVzb2x2ZShjb21taXRFZGl0b3IpXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtzdGFnZUNoYW5nZXMsIGFuZFB1c2h9PXt9KSAtPlxuICBmaWxlUGF0aCA9IFBhdGguam9pbihyZXBvLmdldFBhdGgoKSwgJ0NPTU1JVF9FRElUTVNHJylcbiAgY3VycmVudFBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgY29tbWVudENoYXIgPSBnaXQuZ2V0Q29uZmlnKHJlcG8sICdjb3JlLmNvbW1lbnRjaGFyJykgPyAnIydcbiAgdHJ5XG4gICAgdGVtcGxhdGUgPSBnZXRUZW1wbGF0ZShnaXQuZ2V0Q29uZmlnKHJlcG8sICdjb21taXQudGVtcGxhdGUnKSlcbiAgY2F0Y2ggZVxuICAgIG5vdGlmaWVyLmFkZEVycm9yKGUubWVzc2FnZSlcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKVxuXG4gIGluaXQgPSAtPiBnZXRTdGFnZWRGaWxlcyhyZXBvKS50aGVuIChzdGF0dXMpIC0+XG4gICAgaWYgdmVyYm9zZUNvbW1pdHNFbmFibGVkKClcbiAgICAgIGFyZ3MgPSBbJ2RpZmYnLCAnLS1jb2xvcj1uZXZlcicsICctLXN0YWdlZCddXG4gICAgICBhcmdzLnB1c2ggJy0td29yZC1kaWZmJyBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmRpZmZzLndvcmREaWZmJylcbiAgICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIC50aGVuIChkaWZmKSAtPiBwcmVwRmlsZSB7c3RhdHVzLCBmaWxlUGF0aCwgZGlmZiwgY29tbWVudENoYXIsIHRlbXBsYXRlfVxuICAgIGVsc2VcbiAgICAgIHByZXBGaWxlIHtzdGF0dXMsIGZpbGVQYXRoLCBjb21tZW50Q2hhciwgdGVtcGxhdGV9XG4gIHN0YXJ0Q29tbWl0ID0gLT5cbiAgICBzaG93RmlsZSBmaWxlUGF0aFxuICAgIC50aGVuICh0ZXh0RWRpdG9yKSAtPlxuICAgICAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICBkaXNwb3NhYmxlcy5hZGQgdGV4dEVkaXRvci5vbkRpZFNhdmUgLT5cbiAgICAgICAgdHJpbUZpbGUoZmlsZVBhdGgsIGNvbW1lbnRDaGFyKSBpZiB2ZXJib3NlQ29tbWl0c0VuYWJsZWQoKVxuICAgICAgICBjb21taXQocmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIGZpbGVQYXRoKVxuICAgICAgICAudGhlbiAtPiBHaXRQdXNoKHJlcG8pIGlmIGFuZFB1c2hcbiAgICAgIGRpc3Bvc2FibGVzLmFkZCB0ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSAtPiBjbGVhbnVwKGN1cnJlbnRQYW5lKVxuICAgIC5jYXRjaChub3RpZmllci5hZGRFcnJvcilcblxuICBpZiBzdGFnZUNoYW5nZXNcbiAgICBnaXQuYWRkKHJlcG8sIHVwZGF0ZTogdHJ1ZSkudGhlbihpbml0KS50aGVuKHN0YXJ0Q29tbWl0KVxuICBlbHNlXG4gICAgaW5pdCgpLnRoZW4gLT4gc3RhcnRDb21taXQoKVxuICAgIC5jYXRjaCAobWVzc2FnZSkgLT5cbiAgICAgIGlmIG1lc3NhZ2UuaW5jbHVkZXM/KCdDUkxGJylcbiAgICAgICAgc3RhcnRDb21taXQoKVxuICAgICAgZWxzZVxuICAgICAgICBub3RpZmllci5hZGRJbmZvIG1lc3NhZ2VcbiJdfQ==
