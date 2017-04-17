(function() {
  var getCommands, git;

  git = require('./git');

  getCommands = function() {
    var GitCheckoutAllFiles, GitCheckoutBranch, GitCheckoutFile, GitCheckoutNewBranch, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteBranch, GitDiff, GitDiffAll, GitDiffBranchFiles, GitDiffBranches, GitDifftool, GitFetch, GitFetchAll, GitFetchPrune, GitInit, GitLog, GitMerge, GitOpenChangedFiles, GitPull, GitPush, GitRebase, GitRemove, GitRun, GitShow, GitStageFiles, GitStageFilesBeta, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStashSaveMessage, GitStatus, GitTags, GitUnstageFiles, commands;
    GitCheckoutNewBranch = require('./models/git-checkout-new-branch');
    GitCheckoutBranch = require('./models/git-checkout-branch');
    GitDeleteBranch = require('./models/git-delete-branch');
    GitCheckoutAllFiles = require('./models/git-checkout-all-files');
    GitCheckoutFile = require('./models/git-checkout-file');
    GitCherryPick = require('./models/git-cherry-pick');
    GitCommit = require('./models/git-commit');
    GitCommitAmend = require('./models/git-commit-amend');
    GitDiff = require('./models/git-diff');
    GitDiffBranches = require('./models/git-diff-branches');
    GitDiffBranchFiles = require('./models/git-diff-branch-files');
    GitDifftool = require('./models/git-difftool');
    GitDiffAll = require('./models/git-diff-all');
    GitFetch = require('./models/git-fetch');
    GitFetchAll = require('./models/git-fetch-all');
    GitFetchPrune = require('./models/git-fetch-prune');
    GitInit = require('./models/git-init');
    GitLog = require('./models/git-log');
    GitPull = require('./models/git-pull');
    GitPush = require('./models/git-push');
    GitRemove = require('./models/git-remove');
    GitShow = require('./models/git-show');
    GitStageFiles = require('./models/git-stage-files');
    GitStageFilesBeta = require('./models/git-stage-files-beta');
    GitStageHunk = require('./models/git-stage-hunk');
    GitStashApply = require('./models/git-stash-apply');
    GitStashDrop = require('./models/git-stash-drop');
    GitStashPop = require('./models/git-stash-pop');
    GitStashSave = require('./models/git-stash-save');
    GitStashSaveMessage = require('./models/git-stash-save-message');
    GitStatus = require('./models/git-status');
    GitTags = require('./models/git-tags');
    GitUnstageFiles = require('./models/git-unstage-files');
    GitRun = require('./models/git-run');
    GitMerge = require('./models/git-merge');
    GitRebase = require('./models/git-rebase');
    GitOpenChangedFiles = require('./models/git-open-changed-files');
    commands = [];
    git.getAllRepos().then(function(repos) {
      return commands.push([
        'git-plus:fetch-all', 'Fetch All', function() {
          return GitFetchAll(repos);
        }
      ]);
    });
    return git.getRepo().then(function(repo) {
      var currentFile, ref;
      currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
      git.refresh(repo);
      if (atom.config.get('git-plus.experimental.customCommands')) {
        commands = commands.concat(require('./service').getCustomCommands());
      }
      commands.push([
        'git-plus:add', 'Add', function() {
          return git.add(repo, {
            file: currentFile
          });
        }
      ]);
      commands.push([
        'git-plus:add-modified', 'Add Modified', function() {
          return git.add(repo, {
            update: true
          });
        }
      ]);
      commands.push([
        'git-plus:add-all', 'Add All', function() {
          return git.add(repo);
        }
      ]);
      commands.push([
        'git-plus:log', 'Log', function() {
          return GitLog(repo);
        }
      ]);
      commands.push([
        'git-plus:log-current-file', 'Log Current File', function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        }
      ]);
      commands.push([
        'git-plus:remove-current-file', 'Remove Current File', function() {
          return GitRemove(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-all-files', 'Checkout All Files', function() {
          return GitCheckoutAllFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-current-file', 'Checkout Current File', function() {
          return GitCheckoutFile(repo, {
            file: currentFile
          });
        }
      ]);
      commands.push([
        'git-plus:commit', 'Commit', function() {
          return GitCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:commit-all', 'Commit All', function() {
          return GitCommit(repo, {
            stageChanges: true
          });
        }
      ]);
      commands.push([
        'git-plus:commit-amend', 'Commit Amend', function() {
          return GitCommitAmend(repo);
        }
      ]);
      commands.push([
        'git-plus:add-and-commit', 'Add And Commit', function() {
          return git.add(repo, {
            file: currentFile
          }).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-and-commit-and-push', 'Add And Commit And Push', function() {
          return git.add(repo, {
            file: currentFile
          }).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-and-commit', 'Add All And Commit', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-commit-and-push', 'Add All, Commit And Push', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:commit-all-and-push', 'Commit All And Push', function() {
          return GitCommit(repo, {
            stageChanges: true,
            andPush: true
          });
        }
      ]);
      commands.push([
        'git-plus:checkout', 'Checkout', function() {
          return GitCheckoutBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-remote', 'Checkout Remote', function() {
          return GitCheckoutBranch(repo, {
            remote: true
          });
        }
      ]);
      commands.push([
        'git-plus:new-branch', 'Checkout New Branch', function() {
          return GitCheckoutNewBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-local-branch', 'Delete Local Branch', function() {
          return GitDeleteBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-remote-branch', 'Delete Remote Branch', function() {
          return GitDeleteBranch(repo, {
            remote: true
          });
        }
      ]);
      commands.push([
        'git-plus:cherry-pick', 'Cherry-Pick', function() {
          return GitCherryPick(repo);
        }
      ]);
      commands.push([
        'git-plus:diff', 'Diff', function() {
          return GitDiff(repo, {
            file: currentFile
          });
        }
      ]);
      if (atom.config.get('git-plus.experimental.diffBranches')) {
        commands.push([
          'git-plus:diff-branches', 'Diff branches', function() {
            return GitDiffBranches(repo);
          }
        ]);
        commands.push([
          'git-plus:diff-branch-files', 'Diff branch files', function() {
            return GitDiffBranchFiles(repo);
          }
        ]);
      }
      commands.push([
        'git-plus:difftool', 'Difftool', function() {
          return GitDifftool(repo);
        }
      ]);
      commands.push([
        'git-plus:diff-all', 'Diff All', function() {
          return GitDiffAll(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch', 'Fetch', function() {
          return GitFetch(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch-prune', 'Fetch Prune', function() {
          return GitFetchPrune(repo);
        }
      ]);
      commands.push([
        'git-plus:pull', 'Pull', function() {
          return GitPull(repo);
        }
      ]);
      commands.push([
        'git-plus:push', 'Push', function() {
          return GitPush(repo);
        }
      ]);
      commands.push([
        'git-plus:push-set-upstream', 'Push -u', function() {
          return GitPush(repo, {
            setUpstream: true
          });
        }
      ]);
      commands.push([
        'git-plus:remove', 'Remove', function() {
          return GitRemove(repo, {
            showSelector: true
          });
        }
      ]);
      commands.push([
        'git-plus:reset', 'Reset HEAD', function() {
          return git.reset(repo);
        }
      ]);
      commands.push([
        'git-plus:show', 'Show', function() {
          return GitShow(repo);
        }
      ]);
      if (atom.config.get('git-plus.experimental.stageFilesBeta')) {
        commands.push([
          'git-plus:stage-files', 'Stage Files', function() {
            return GitStageFilesBeta(repo);
          }
        ]);
      } else {
        commands.push([
          'git-plus:stage-files', 'Stage Files', function() {
            return GitStageFiles(repo);
          }
        ]);
        commands.push([
          'git-plus:unstage-files', 'Unstage Files', function() {
            return GitUnstageFiles(repo);
          }
        ]);
      }
      commands.push([
        'git-plus:stage-hunk', 'Stage Hunk', function() {
          return GitStageHunk(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save', 'Stash: Save Changes', function() {
          return GitStashSave(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save-message', 'Stash: Save Changes With Message', function() {
          return GitStashSaveMessage(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-pop', 'Stash: Apply (Pop)', function() {
          return GitStashPop(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-apply', 'Stash: Apply (Keep)', function() {
          return GitStashApply(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-delete', 'Stash: Delete (Drop)', function() {
          return GitStashDrop(repo);
        }
      ]);
      commands.push([
        'git-plus:status', 'Status', function() {
          return GitStatus(repo);
        }
      ]);
      commands.push([
        'git-plus:tags', 'Tags', function() {
          return GitTags(repo);
        }
      ]);
      commands.push([
        'git-plus:run', 'Run', function() {
          return new GitRun(repo);
        }
      ]);
      commands.push([
        'git-plus:merge', 'Merge', function() {
          return GitMerge(repo);
        }
      ]);
      commands.push([
        'git-plus:merge-remote', 'Merge Remote', function() {
          return GitMerge(repo, {
            remote: true
          });
        }
      ]);
      commands.push([
        'git-plus:merge-no-fast-forward', 'Merge without fast-forward', function() {
          return GitMerge(repo, {
            noFastForward: true
          });
        }
      ]);
      commands.push([
        'git-plus:rebase', 'Rebase', function() {
          return GitRebase(repo);
        }
      ]);
      commands.push([
        'git-plus:git-open-changed-files', 'Open Changed Files', function() {
          return GitOpenChangedFiles(repo);
        }
      ]);
      return commands;
    });
  };

  module.exports = getCommands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9naXQtcGx1cy1jb21tYW5kcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjs7RUFFTixXQUFBLEdBQWMsU0FBQTtBQUNaLFFBQUE7SUFBQSxvQkFBQSxHQUF5QixPQUFBLENBQVEsa0NBQVI7SUFDekIsaUJBQUEsR0FBeUIsT0FBQSxDQUFRLDhCQUFSO0lBQ3pCLGVBQUEsR0FBeUIsT0FBQSxDQUFRLDRCQUFSO0lBQ3pCLG1CQUFBLEdBQXlCLE9BQUEsQ0FBUSxpQ0FBUjtJQUN6QixlQUFBLEdBQXlCLE9BQUEsQ0FBUSw0QkFBUjtJQUN6QixhQUFBLEdBQXlCLE9BQUEsQ0FBUSwwQkFBUjtJQUN6QixTQUFBLEdBQXlCLE9BQUEsQ0FBUSxxQkFBUjtJQUN6QixjQUFBLEdBQXlCLE9BQUEsQ0FBUSwyQkFBUjtJQUN6QixPQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQkFBUjtJQUN6QixlQUFBLEdBQXlCLE9BQUEsQ0FBUSw0QkFBUjtJQUN6QixrQkFBQSxHQUF5QixPQUFBLENBQVEsZ0NBQVI7SUFDekIsV0FBQSxHQUF5QixPQUFBLENBQVEsdUJBQVI7SUFDekIsVUFBQSxHQUF5QixPQUFBLENBQVEsdUJBQVI7SUFDekIsUUFBQSxHQUF5QixPQUFBLENBQVEsb0JBQVI7SUFDekIsV0FBQSxHQUF5QixPQUFBLENBQVEsd0JBQVI7SUFDekIsYUFBQSxHQUF5QixPQUFBLENBQVEsMEJBQVI7SUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7SUFDekIsTUFBQSxHQUF5QixPQUFBLENBQVEsa0JBQVI7SUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7SUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7SUFDekIs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XG4gIEdpdENoZWNrb3V0TmV3QnJhbmNoICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtY2hlY2tvdXQtbmV3LWJyYW5jaCdcbiAgR2l0Q2hlY2tvdXRCcmFuY2ggICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jaGVja291dC1icmFuY2gnXG4gIEdpdERlbGV0ZUJyYW5jaCAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZGVsZXRlLWJyYW5jaCdcbiAgR2l0Q2hlY2tvdXRBbGxGaWxlcyAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jaGVja291dC1hbGwtZmlsZXMnXG4gIEdpdENoZWNrb3V0RmlsZSAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtY2hlY2tvdXQtZmlsZSdcbiAgR2l0Q2hlcnJ5UGljayAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jaGVycnktcGljaydcbiAgR2l0Q29tbWl0ICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jb21taXQnXG4gIEdpdENvbW1pdEFtZW5kICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtY29tbWl0LWFtZW5kJ1xuICBHaXREaWZmICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRpZmYnXG4gIEdpdERpZmZCcmFuY2hlcyAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZGlmZi1icmFuY2hlcydcbiAgR2l0RGlmZkJyYW5jaEZpbGVzICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kaWZmLWJyYW5jaC1maWxlcydcbiAgR2l0RGlmZnRvb2wgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kaWZmdG9vbCdcbiAgR2l0RGlmZkFsbCAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kaWZmLWFsbCdcbiAgR2l0RmV0Y2ggICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1mZXRjaCdcbiAgR2l0RmV0Y2hBbGwgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1mZXRjaC1hbGwnXG4gIEdpdEZldGNoUHJ1bmUgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZmV0Y2gtcHJ1bmUnXG4gIEdpdEluaXQgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtaW5pdCdcbiAgR2l0TG9nICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1sb2cnXG4gIEdpdFB1bGwgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtcHVsbCdcbiAgR2l0UHVzaCAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1wdXNoJ1xuICBHaXRSZW1vdmUgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXJlbW92ZSdcbiAgR2l0U2hvdyAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zaG93J1xuICBHaXRTdGFnZUZpbGVzICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YWdlLWZpbGVzJ1xuICBHaXRTdGFnZUZpbGVzQmV0YSAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YWdlLWZpbGVzLWJldGEnXG4gIEdpdFN0YWdlSHVuayAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3RhZ2UtaHVuaydcbiAgR2l0U3Rhc2hBcHBseSAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGFzaC1hcHBseSdcbiAgR2l0U3Rhc2hEcm9wICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGFzaC1kcm9wJ1xuICBHaXRTdGFzaFBvcCAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXNoLXBvcCdcbiAgR2l0U3Rhc2hTYXZlICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGFzaC1zYXZlJ1xuICBHaXRTdGFzaFNhdmVNZXNzYWdlICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXNoLXNhdmUtbWVzc2FnZSdcbiAgR2l0U3RhdHVzICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGF0dXMnXG4gIEdpdFRhZ3MgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtdGFncydcbiAgR2l0VW5zdGFnZUZpbGVzICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC11bnN0YWdlLWZpbGVzJ1xuICBHaXRSdW4gICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXJ1bidcbiAgR2l0TWVyZ2UgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1tZXJnZSdcbiAgR2l0UmViYXNlICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1yZWJhc2UnXG4gIEdpdE9wZW5DaGFuZ2VkRmlsZXMgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtb3Blbi1jaGFuZ2VkLWZpbGVzJ1xuXG4gIGNvbW1hbmRzID0gW11cbiAgZ2l0LmdldEFsbFJlcG9zKCkudGhlbiAocmVwb3MpIC0+XG4gICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmZldGNoLWFsbCcsICdGZXRjaCBBbGwnLCAtPiBHaXRGZXRjaEFsbChyZXBvcyldXG5cbiAgZ2l0LmdldFJlcG8oKVxuICAgIC50aGVuIChyZXBvKSAtPlxuICAgICAgY3VycmVudEZpbGUgPSByZXBvLnJlbGF0aXZpemUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkpXG4gICAgICBnaXQucmVmcmVzaCByZXBvXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmV4cGVyaW1lbnRhbC5jdXN0b21Db21tYW5kcycpXG4gICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KHJlcXVpcmUoJy4vc2VydmljZScpLmdldEN1c3RvbUNvbW1hbmRzKCkpXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkJywgJ0FkZCcsIC0+IGdpdC5hZGQocmVwbywgZmlsZTogY3VycmVudEZpbGUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmFkZC1tb2RpZmllZCcsICdBZGQgTW9kaWZpZWQnLCAtPiBnaXQuYWRkKHJlcG8sIHVwZGF0ZTogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLWFsbCcsICdBZGQgQWxsJywgLT4gZ2l0LmFkZChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpsb2cnLCAnTG9nJywgLT4gR2l0TG9nKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmxvZy1jdXJyZW50LWZpbGUnLCAnTG9nIEN1cnJlbnQgRmlsZScsIC0+IEdpdExvZyhyZXBvLCBvbmx5Q3VycmVudEZpbGU6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnJlbW92ZS1jdXJyZW50LWZpbGUnLCAnUmVtb3ZlIEN1cnJlbnQgRmlsZScsIC0+IEdpdFJlbW92ZShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVja291dC1hbGwtZmlsZXMnLCAnQ2hlY2tvdXQgQWxsIEZpbGVzJywgLT4gR2l0Q2hlY2tvdXRBbGxGaWxlcyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVja291dC1jdXJyZW50LWZpbGUnLCAnQ2hlY2tvdXQgQ3VycmVudCBGaWxlJywgLT4gR2l0Q2hlY2tvdXRGaWxlKHJlcG8sIGZpbGU6IGN1cnJlbnRGaWxlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjb21taXQnLCAnQ29tbWl0JywgLT4gR2l0Q29tbWl0KHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNvbW1pdC1hbGwnLCAnQ29tbWl0IEFsbCcsIC0+IEdpdENvbW1pdChyZXBvLCBzdGFnZUNoYW5nZXM6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNvbW1pdC1hbWVuZCcsICdDb21taXQgQW1lbmQnLCAtPiBHaXRDb21taXRBbWVuZChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czphZGQtYW5kLWNvbW1pdCcsICdBZGQgQW5kIENvbW1pdCcsIC0+IGdpdC5hZGQocmVwbywgZmlsZTogY3VycmVudEZpbGUpLnRoZW4gLT4gR2l0Q29tbWl0KHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmFkZC1hbmQtY29tbWl0LWFuZC1wdXNoJywgJ0FkZCBBbmQgQ29tbWl0IEFuZCBQdXNoJywgLT4gZ2l0LmFkZChyZXBvLCBmaWxlOiBjdXJyZW50RmlsZSkudGhlbiAtPiBHaXRDb21taXQocmVwbywgYW5kUHVzaDogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLWFsbC1hbmQtY29tbWl0JywgJ0FkZCBBbGwgQW5kIENvbW1pdCcsIC0+IGdpdC5hZGQocmVwbykudGhlbiAtPiBHaXRDb21taXQocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLWFsbC1jb21taXQtYW5kLXB1c2gnLCAnQWRkIEFsbCwgQ29tbWl0IEFuZCBQdXNoJywgLT4gZ2l0LmFkZChyZXBvKS50aGVuIC0+IEdpdENvbW1pdChyZXBvLCBhbmRQdXNoOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjb21taXQtYWxsLWFuZC1wdXNoJywgJ0NvbW1pdCBBbGwgQW5kIFB1c2gnLCAtPiBHaXRDb21taXQocmVwbywgc3RhZ2VDaGFuZ2VzOiB0cnVlLCBhbmRQdXNoOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVja291dCcsICdDaGVja291dCcsIC0+IEdpdENoZWNrb3V0QnJhbmNoKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNoZWNrb3V0LXJlbW90ZScsICdDaGVja291dCBSZW1vdGUnLCAtPiBHaXRDaGVja291dEJyYW5jaChyZXBvLCB7cmVtb3RlOiB0cnVlfSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6bmV3LWJyYW5jaCcsICdDaGVja291dCBOZXcgQnJhbmNoJywgLT4gR2l0Q2hlY2tvdXROZXdCcmFuY2gocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGVsZXRlLWxvY2FsLWJyYW5jaCcsICdEZWxldGUgTG9jYWwgQnJhbmNoJywgLT4gR2l0RGVsZXRlQnJhbmNoKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmRlbGV0ZS1yZW1vdGUtYnJhbmNoJywgJ0RlbGV0ZSBSZW1vdGUgQnJhbmNoJywgLT4gR2l0RGVsZXRlQnJhbmNoKHJlcG8sIHtyZW1vdGU6IHRydWV9KV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVycnktcGljaycsICdDaGVycnktUGljaycsIC0+IEdpdENoZXJyeVBpY2socmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGlmZicsICdEaWZmJywgLT4gR2l0RGlmZihyZXBvLCBmaWxlOiBjdXJyZW50RmlsZSldXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmV4cGVyaW1lbnRhbC5kaWZmQnJhbmNoZXMnKVxuICAgICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGlmZi1icmFuY2hlcycsICdEaWZmIGJyYW5jaGVzJywgLT4gR2l0RGlmZkJyYW5jaGVzKHJlcG8pXVxuICAgICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGlmZi1icmFuY2gtZmlsZXMnLCAnRGlmZiBicmFuY2ggZmlsZXMnLCAtPiBHaXREaWZmQnJhbmNoRmlsZXMocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGlmZnRvb2wnLCAnRGlmZnRvb2wnLCAtPiBHaXREaWZmdG9vbChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkaWZmLWFsbCcsICdEaWZmIEFsbCcsIC0+IEdpdERpZmZBbGwocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZmV0Y2gnLCAnRmV0Y2gnLCAtPiBHaXRGZXRjaChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpmZXRjaC1wcnVuZScsICdGZXRjaCBQcnVuZScsIC0+IEdpdEZldGNoUHJ1bmUocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cHVsbCcsICdQdWxsJywgLT4gR2l0UHVsbChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpwdXNoJywgJ1B1c2gnLCAtPiBHaXRQdXNoKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnB1c2gtc2V0LXVwc3RyZWFtJywgJ1B1c2ggLXUnLCAtPiBHaXRQdXNoKHJlcG8sIHNldFVwc3RyZWFtOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpyZW1vdmUnLCAnUmVtb3ZlJywgLT4gR2l0UmVtb3ZlKHJlcG8sIHNob3dTZWxlY3RvcjogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cmVzZXQnLCAnUmVzZXQgSEVBRCcsIC0+IGdpdC5yZXNldChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzaG93JywgJ1Nob3cnLCAtPiBHaXRTaG93KHJlcG8pXVxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5leHBlcmltZW50YWwuc3RhZ2VGaWxlc0JldGEnKVxuICAgICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3RhZ2UtZmlsZXMnLCAnU3RhZ2UgRmlsZXMnLCAtPiBHaXRTdGFnZUZpbGVzQmV0YShyZXBvKV1cbiAgICAgIGVsc2VcbiAgICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YWdlLWZpbGVzJywgJ1N0YWdlIEZpbGVzJywgLT4gR2l0U3RhZ2VGaWxlcyhyZXBvKV1cbiAgICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnVuc3RhZ2UtZmlsZXMnLCAnVW5zdGFnZSBGaWxlcycsIC0+IEdpdFVuc3RhZ2VGaWxlcyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFnZS1odW5rJywgJ1N0YWdlIEh1bmsnLCAtPiBHaXRTdGFnZUh1bmsocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3Rhc2gtc2F2ZScsICdTdGFzaDogU2F2ZSBDaGFuZ2VzJywgLT4gR2l0U3Rhc2hTYXZlKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YXNoLXNhdmUtbWVzc2FnZScsICdTdGFzaDogU2F2ZSBDaGFuZ2VzIFdpdGggTWVzc2FnZScsIC0+IEdpdFN0YXNoU2F2ZU1lc3NhZ2UocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3Rhc2gtcG9wJywgJ1N0YXNoOiBBcHBseSAoUG9wKScsIC0+IEdpdFN0YXNoUG9wKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YXNoLWFwcGx5JywgJ1N0YXNoOiBBcHBseSAoS2VlcCknLCAtPiBHaXRTdGFzaEFwcGx5KHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YXNoLWRlbGV0ZScsICdTdGFzaDogRGVsZXRlIChEcm9wKScsIC0+IEdpdFN0YXNoRHJvcChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGF0dXMnLCAnU3RhdHVzJywgLT4gR2l0U3RhdHVzKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnRhZ3MnLCAnVGFncycsIC0+IEdpdFRhZ3MocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cnVuJywgJ1J1bicsIC0+IG5ldyBHaXRSdW4ocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6bWVyZ2UnLCAnTWVyZ2UnLCAtPiBHaXRNZXJnZShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czptZXJnZS1yZW1vdGUnLCAnTWVyZ2UgUmVtb3RlJywgLT4gR2l0TWVyZ2UocmVwbywgcmVtb3RlOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czptZXJnZS1uby1mYXN0LWZvcndhcmQnLCAnTWVyZ2Ugd2l0aG91dCBmYXN0LWZvcndhcmQnLCAtPiBHaXRNZXJnZShyZXBvLCBub0Zhc3RGb3J3YXJkOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpyZWJhc2UnLCAnUmViYXNlJywgLT4gR2l0UmViYXNlKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmdpdC1vcGVuLWNoYW5nZWQtZmlsZXMnLCAnT3BlbiBDaGFuZ2VkIEZpbGVzJywgLT4gR2l0T3BlbkNoYW5nZWRGaWxlcyhyZXBvKV1cblxuICAgICAgcmV0dXJuIGNvbW1hbmRzXG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0Q29tbWFuZHNcbiJdfQ==
