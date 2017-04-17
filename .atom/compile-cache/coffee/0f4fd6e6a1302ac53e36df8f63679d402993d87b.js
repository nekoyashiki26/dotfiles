(function() {
  var $, CompositeDisposable, GitAddAndCommitContext, GitAddContext, GitCheckoutAllFiles, GitCheckoutBranch, GitCheckoutFile, GitCheckoutFileContext, GitCheckoutNewBranch, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteBranch, GitDiff, GitDiffAll, GitDiffBranchFiles, GitDiffBranchFilesContext, GitDiffBranches, GitDiffBranchesContext, GitDiffContext, GitDifftool, GitDifftoolContext, GitFetch, GitFetchAll, GitFetchPrune, GitInit, GitLog, GitMerge, GitOpenChangedFiles, GitPaletteView, GitPull, GitPullContext, GitPush, GitPushContext, GitRebase, GitRemove, GitRun, GitShow, GitStageFiles, GitStageFilesBeta, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStashSaveMessage, GitStatus, GitTags, GitUnstageFileContext, GitUnstageFiles, OutputViewManager, baseLineGrammar, baseWordGrammar, configurations, contextMenu, currentFile, diffGrammars, getWorkspaceRepos, git, onPathsChanged, setDiffGrammar;

  CompositeDisposable = require('atom').CompositeDisposable;

  $ = require('atom-space-pen-views').$;

  git = require('./git');

  configurations = require('./config');

  contextMenu = require('./context-menu');

  OutputViewManager = require('./output-view-manager');

  GitPaletteView = require('./views/git-palette-view');

  GitAddContext = require('./models/context/git-add-context');

  GitDiffContext = require('./models/context/git-diff-context');

  GitAddAndCommitContext = require('./models/context/git-add-and-commit-context');

  GitCheckoutNewBranch = require('./models/git-checkout-new-branch');

  GitCheckoutBranch = require('./models/git-checkout-branch');

  GitDeleteBranch = require('./models/git-delete-branch');

  GitCheckoutAllFiles = require('./models/git-checkout-all-files');

  GitCheckoutFile = require('./models/git-checkout-file');

  GitCheckoutFileContext = require('./models/context/git-checkout-file-context');

  GitCherryPick = require('./models/git-cherry-pick');

  GitCommit = require('./models/git-commit');

  GitCommitAmend = require('./models/git-commit-amend');

  GitDiff = require('./models/git-diff');

  GitDiffBranches = require('./models/git-diff-branches');

  GitDiffBranchesContext = require('./models/context/git-diff-branches-context');

  GitDiffBranchFiles = require('./models/git-diff-branch-files');

  GitDiffBranchFilesContext = require('./models/context/git-diff-branch-files-context');

  GitDifftool = require('./models/git-difftool');

  GitDifftoolContext = require('./models/context/git-difftool-context');

  GitDiffAll = require('./models/git-diff-all');

  GitFetch = require('./models/git-fetch');

  GitFetchAll = require('./models/git-fetch-all');

  GitFetchPrune = require('./models/git-fetch-prune.coffee');

  GitInit = require('./models/git-init');

  GitLog = require('./models/git-log');

  GitPull = require('./models/git-pull');

  GitPullContext = require('./models/context/git-pull-context');

  GitPush = require('./models/git-push');

  GitPushContext = require('./models/context/git-push-context');

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

  GitUnstageFileContext = require('./models/context/git-unstage-file-context');

  GitRun = require('./models/git-run');

  GitMerge = require('./models/git-merge');

  GitRebase = require('./models/git-rebase');

  GitOpenChangedFiles = require('./models/git-open-changed-files');

  diffGrammars = require('./grammars/diff.js');

  baseWordGrammar = __dirname + '/grammars/word-diff.json';

  baseLineGrammar = __dirname + '/grammars/line-diff.json';

  currentFile = function(repo) {
    var ref;
    return repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
  };

  setDiffGrammar = function() {
    var baseGrammar, diffGrammar, enableSyntaxHighlighting, grammar, wordDiff;
    while (atom.grammars.grammarForScopeName('source.diff')) {
      atom.grammars.removeGrammarForScopeName('source.diff');
    }
    enableSyntaxHighlighting = atom.config.get('git-plus.diffs.syntaxHighlighting');
    wordDiff = atom.config.get('git-plus.diffs.wordDiff');
    diffGrammar = null;
    baseGrammar = null;
    if (wordDiff) {
      diffGrammar = diffGrammars.wordGrammar;
      baseGrammar = baseWordGrammar;
    } else {
      diffGrammar = diffGrammars.lineGrammar;
      baseGrammar = baseLineGrammar;
    }
    if (enableSyntaxHighlighting) {
      return atom.grammars.addGrammar(diffGrammar);
    } else {
      grammar = atom.grammars.readGrammarSync(baseGrammar);
      grammar.packageName = 'git-plus';
      return atom.grammars.addGrammar(grammar);
    }
  };

  getWorkspaceRepos = function() {
    return atom.project.getRepositories().filter(function(r) {
      return r != null;
    });
  };

  onPathsChanged = function(gp) {
    if (typeof gp.deactivate === "function") {
      gp.deactivate();
    }
    if (typeof gp.activate === "function") {
      gp.activate();
    }
    if (gp.statusBar) {
      return typeof gp.consumeStatusBar === "function" ? gp.consumeStatusBar(gp.statusBar) : void 0;
    }
  };

  module.exports = {
    config: configurations,
    subscriptions: null,
    workspace: document.querySelector('atom-workspace'),
    provideService: function() {
      return require('./service');
    },
    activate: function(state) {
      var repos;
      setDiffGrammar();
      this.subscriptions = new CompositeDisposable;
      repos = getWorkspaceRepos();
      if (atom.project.getDirectories().length === 0) {
        atom.project.onDidChangePaths((function(_this) {
          return function(paths) {
            return onPathsChanged(_this);
          };
        })(this));
      }
      if (repos.length === 0 && atom.project.getDirectories().length > 0) {
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:init', (function(_this) {
          return function() {
            return GitInit().then(_this.activate);
          };
        })(this)));
      }
      if (repos.length > 0) {
        atom.project.onDidChangePaths((function(_this) {
          return function(paths) {
            return onPathsChanged(_this);
          };
        })(this));
        contextMenu();
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:menu', function() {
          return new GitPaletteView();
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add', function() {
          return git.getRepo().then(function(repo) {
            return git.add(repo, {
              file: currentFile(repo)
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-modified', function() {
          return git.getRepo().then(function(repo) {
            return git.add(repo, {
              update: true
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all', function() {
          return git.getRepo().then(function(repo) {
            return git.add(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit', function() {
          return git.getRepo().then(function(repo) {
            return GitCommit(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit-all', function() {
          return git.getRepo().then(function(repo) {
            return GitCommit(repo, {
              stageChanges: true
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit-amend', function() {
          return git.getRepo().then(function(repo) {
            return new GitCommitAmend(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-and-commit', function() {
          return git.getRepo().then(function(repo) {
            return git.add(repo, {
              file: currentFile(repo)
            }).then(function() {
              return GitCommit(repo);
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-and-commit-and-push', function() {
          return git.getRepo().then(function(repo) {
            return git.add(repo, {
              file: currentFile(repo)
            }).then(function() {
              return GitCommit(repo, {
                andPush: true
              });
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all-and-commit', function() {
          return git.getRepo().then(function(repo) {
            return git.add(repo).then(function() {
              return GitCommit(repo);
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all-commit-and-push', function() {
          return git.getRepo().then(function(repo) {
            return git.add(repo).then(function() {
              return GitCommit(repo, {
                andPush: true
              });
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit-all-and-push', function() {
          return git.getRepo().then(function(repo) {
            return GitCommit(repo, {
              stageChanges: true,
              andPush: true
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout', function() {
          return git.getRepo().then(function(repo) {
            return GitCheckoutBranch(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-remote', function() {
          return git.getRepo().then(function(repo) {
            return GitCheckoutBranch(repo, {
              remote: true
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-current-file', function() {
          return git.getRepo().then(function(repo) {
            return GitCheckoutFile(repo, {
              file: currentFile(repo)
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-all-files', function() {
          return git.getRepo().then(function(repo) {
            return GitCheckoutAllFiles(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:new-branch', function() {
          return git.getRepo().then(function(repo) {
            return GitCheckoutNewBranch(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:delete-local-branch', function() {
          return git.getRepo().then(function(repo) {
            return GitDeleteBranch(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:delete-remote-branch', function() {
          return git.getRepo().then(function(repo) {
            return GitDeleteBranch(repo, {
              remote: true
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:cherry-pick', function() {
          return git.getRepo().then(function(repo) {
            return GitCherryPick(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:diff', function() {
          return git.getRepo().then(function(repo) {
            return GitDiff(repo, {
              file: currentFile(repo)
            });
          });
        }));
        if (atom.config.get('git-plus.experimental.diffBranches')) {
          this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:diff-branches', function() {
            return git.getRepo().then(function(repo) {
              return GitDiffBranches(repo);
            });
          }));
          this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:diff-branch-files', function() {
            return git.getRepo().then(function(repo) {
              return GitDiffBranchFiles(repo);
            });
          }));
        }
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:difftool', function() {
          return git.getRepo().then(function(repo) {
            return GitDifftool(repo, {
              file: currentFile(repo)
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:diff-all', function() {
          return git.getRepo().then(function(repo) {
            return GitDiffAll(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:fetch', function() {
          return git.getRepo().then(function(repo) {
            return GitFetch(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:fetch-all', function() {
          return git.getAllRepos().then(function(repos) {
            return GitFetchAll(repos);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:fetch-prune', function() {
          return git.getRepo().then(function(repo) {
            return GitFetchPrune(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:pull', function() {
          return git.getRepo().then(function(repo) {
            return GitPull(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:push', function() {
          return git.getRepo().then(function(repo) {
            return GitPush(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:push-set-upstream', function() {
          return git.getRepo().then(function(repo) {
            return GitPush(repo, {
              setUpstream: true
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:remove', function() {
          return git.getRepo().then(function(repo) {
            return GitRemove(repo, {
              showSelector: true
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:remove-current-file', function() {
          return git.getRepo().then(function(repo) {
            return GitRemove(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:reset', function() {
          return git.getRepo().then(function(repo) {
            return git.reset(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:show', function() {
          return git.getRepo().then(function(repo) {
            return GitShow(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:log', function() {
          return git.getRepo().then(function(repo) {
            return GitLog(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:log-current-file', function() {
          return git.getRepo().then(function(repo) {
            return GitLog(repo, {
              onlyCurrentFile: true
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stage-hunk', function() {
          return git.getRepo().then(function(repo) {
            return GitStageHunk(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-save', function() {
          return git.getRepo().then(function(repo) {
            return GitStashSave(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-save-message', function() {
          return git.getRepo().then(function(repo) {
            return GitStashSaveMessage(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-pop', function() {
          return git.getRepo().then(function(repo) {
            return GitStashPop(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-apply', function() {
          return git.getRepo().then(function(repo) {
            return GitStashApply(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-delete', function() {
          return git.getRepo().then(function(repo) {
            return GitStashDrop(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:status', function() {
          return git.getRepo().then(function(repo) {
            return GitStatus(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:tags', function() {
          return git.getRepo().then(function(repo) {
            return GitTags(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:run', function() {
          return git.getRepo().then(function(repo) {
            return new GitRun(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:merge', function() {
          return git.getRepo().then(function(repo) {
            return GitMerge(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:merge-remote', function() {
          return git.getRepo().then(function(repo) {
            return GitMerge(repo, {
              remote: true
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:merge-no-fast-forward', function() {
          return git.getRepo().then(function(repo) {
            return GitMerge(repo, {
              noFastForward: true
            });
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:rebase', function() {
          return git.getRepo().then(function(repo) {
            return GitRebase(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:git-open-changed-files', function() {
          return git.getRepo().then(function(repo) {
            return GitOpenChangedFiles(repo);
          });
        }));
        this.subscriptions.add(atom.commands.add('.tree-view', 'git-plus-context:add', function() {
          return GitAddContext();
        }));
        this.subscriptions.add(atom.commands.add('.tree-view', 'git-plus-context:add-and-commit', function() {
          return GitAddAndCommitContext();
        }));
        this.subscriptions.add(atom.commands.add('.tree-view', 'git-plus-context:checkout-file', function() {
          return GitCheckoutFileContext();
        }));
        this.subscriptions.add(atom.commands.add('.tree-view', 'git-plus-context:diff', function() {
          return GitDiffContext();
        }));
        this.subscriptions.add(atom.commands.add('.tree-view', 'git-plus-context:diff-branches', GitDiffBranchesContext));
        this.subscriptions.add(atom.commands.add('.tree-view', 'git-plus-context:diff-branch-files', GitDiffBranchFilesContext));
        this.subscriptions.add(atom.commands.add('.tree-view', 'git-plus-context:difftool', function() {
          return GitDifftoolContext();
        }));
        this.subscriptions.add(atom.commands.add('.tree-view', 'git-plus-context:pull', function() {
          return GitPullContext();
        }));
        this.subscriptions.add(atom.commands.add('.tree-view', 'git-plus-context:push', function() {
          return GitPushContext();
        }));
        this.subscriptions.add(atom.commands.add('.tree-view', 'git-plus-context:push-set-upstream', function() {
          return GitPushContext({
            setUpstream: true
          });
        }));
        this.subscriptions.add(atom.commands.add('.tree-view', 'git-plus-context:unstage-file', function() {
          return GitUnstageFileContext();
        }));
        this.subscriptions.add(atom.config.observe('git-plus.diffs.syntaxHighlighting', setDiffGrammar));
        this.subscriptions.add(atom.config.observe('git-plus.diffs.wordDiff', setDiffGrammar));
        if (atom.config.get('git-plus.experimental.stageFilesBeta')) {
          this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stage-files', function() {
            return git.getRepo().then(GitStageFilesBeta);
          }));
        } else {
          this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:unstage-files', function() {
            return git.getRepo().then(GitUnstageFiles);
          }));
          this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stage-files', function() {
            return git.getRepo().then(GitStageFiles);
          }));
        }
        this.subscriptions.add(atom.config.onDidChange('git-plus.experimental.stageFilesBeta', (function(_this) {
          return function() {
            _this.subscriptions.dispose();
            return _this.activate();
          };
        })(this)));
        return this.subscriptions.add(atom.config.observe('git-plus.experimental.autoFetch', (function(_this) {
          return function(interval) {
            return _this.autoFetch(interval);
          };
        })(this)));
      }
    },
    deactivate: function() {
      var ref;
      this.subscriptions.dispose();
      if ((ref = this.statusBarTile) != null) {
        ref.destroy();
      }
      return clearInterval(this.autoFetchInterval);
    },
    autoFetch: function(interval) {
      var fetch, fetchIntervalMs;
      clearInterval(this.autoFetchInterval);
      if (fetchIntervalMs = (interval * 60) * 1000) {
        fetch = (function(_this) {
          return function() {
            return atom.commands.dispatch(_this.workspace, 'git-plus:fetch-all');
          };
        })(this);
        return this.autoFetchInterval = setInterval(fetch, fetchIntervalMs);
      }
    },
    consumeAutosave: function(arg) {
      var dontSaveIf;
      dontSaveIf = arg.dontSaveIf;
      return dontSaveIf(function(paneItem) {
        return paneItem.getPath().includes('COMMIT_EDITMSG');
      });
    },
    consumeStatusBar: function(statusBar1) {
      this.statusBar = statusBar1;
      if (getWorkspaceRepos().length > 0) {
        this.setupBranchesMenuToggle(this.statusBar);
        if (atom.config.get('git-plus.general.enableStatusBarIcon')) {
          return this.setupOutputViewToggle(this.statusBar);
        }
      }
    },
    setupOutputViewToggle: function(statusBar) {
      var div, icon, link;
      div = document.createElement('div');
      div.classList.add('inline-block');
      icon = document.createElement('span');
      icon.textContent = 'git+';
      link = document.createElement('a');
      link.appendChild(icon);
      link.onclick = function(e) {
        return OutputViewManager.getView().toggle();
      };
      atom.tooltips.add(div, {
        title: "Toggle Git-Plus Output Console"
      });
      div.appendChild(link);
      return this.statusBarTile = statusBar.addRightTile({
        item: div,
        priority: 0
      });
    },
    setupBranchesMenuToggle: function(statusBar) {
      return statusBar.getRightTiles().some((function(_this) {
        return function(arg) {
          var item, ref;
          item = arg.item;
          if (item != null ? (ref = item.classList) != null ? typeof ref.contains === "function" ? ref.contains('git-view') : void 0 : void 0 : void 0) {
            $(item).find('.git-branch').on('click', function(e) {
              var keys, newBranchKey, pressed, ref1, ref2;
              keys = (ref1 = atom.config.getSchema('git-plus').properties.general) != null ? (ref2 = ref1.properties.newBranchKey) != null ? ref2["enum"] : void 0 : void 0;
              newBranchKey = atom.config.get('git-plus.general').newBranchKey;
              pressed = function(key) {
                return e[key + "Key"];
              };
              if (pressed(newBranchKey)) {
                return atom.commands.dispatch(_this.workspace, 'git-plus:new-branch');
              } else if (!(keys.some(pressed))) {
                return atom.commands.dispatch(_this.workspace, 'git-plus:checkout');
              }
            });
            return true;
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9naXQtcGx1cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF3QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsSUFBd0IsT0FBQSxDQUFRLHNCQUFSOztFQUN6QixHQUFBLEdBQXlCLE9BQUEsQ0FBUSxPQUFSOztFQUN6QixjQUFBLEdBQXlCLE9BQUEsQ0FBUSxVQUFSOztFQUN6QixXQUFBLEdBQXlCLE9BQUEsQ0FBUSxnQkFBUjs7RUFDekIsaUJBQUEsR0FBeUIsT0FBQSxDQUFRLHVCQUFSOztFQUN6QixjQUFBLEdBQXlCLE9BQUEsQ0FBUSwwQkFBUjs7RUFDekIsYUFBQSxHQUF5QixPQUFBLENBQVEsa0NBQVI7O0VBQ3pCLGNBQUEsR0FBeUIsT0FBQSxDQUFRLG1DQUFSOztFQUN6QixzQkFBQSxHQUF5QixPQUFBLENBQVEsNkNBQVI7O0VBQ3pCLG9CQUFBLEdBQXlCLE9BQUEsQ0FBUSxrQ0FBUjs7RUFDekIsaUJBQUEsR0FBeUIsT0FBQSxDQUFRLDhCQUFSOztFQUN6QixlQUFBLEdBQXlCLE9BQUEsQ0FBUSw0QkFBUjs7RUFDekIsbUJBQUEsR0FBeUIsT0FBQSxDQUFRLGlDQUFSOztFQUN6QixlQUFBLEdBQXlCLE9BQUEsQ0FBUSw0QkFBUjs7RUFDekIsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLDRDQUFSOztFQUN6QixhQUFBLEdBQXlCLE9BQUEsQ0FBUSwwQkFBUjs7RUFDekIsU0FBQSxHQUF5QixPQUFBLENBQVEscUJBQVI7O0VBQ3pCLGNBQUEsR0FBeUIsT0FBQSxDQUFRLDJCQUFSOztFQUN6QixPQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQkFBUjs7RUFDekIsZUFBQSxHQUF5QixPQUFBLENBQVEsNEJBQVI7O0VBQ3pCLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSw0Q0FBUjs7RUFDekIsa0JBQUEsR0FBeUIsT0FBQSxDQUFRLGdDQUFSOztFQUN6Qix5QkFBQSxHQUFnQyxPQUFBLENBQVEsZ0RBQVI7O0VBQ2hDLFdBQUEsR0FBeUIsT0FBQSxDQUFRLHVCQUFSOztFQUN6QixrQkFBQSxHQUF5QixPQUFBLENBQVEsdUNBQVI7O0VBQ3pCLFVBQUEsR0FBeUIsT0FBQSxDQUFRLHVCQUFSOztFQUN6QixRQUFBLEdBQXlCLE9BQUEsQ0FBUSxvQkFBUjs7RUFDekIsV0FBQSxHQUF5QixPQUFBLENBQVEsd0JBQVI7O0VBQ3pCLGFBQUEsR0FBeUIsT0FBQSxDQUFRLGlDQUFSOztFQUN6QixPQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQkFBUjs7RUFDekIsTUFBQSxHQUF5QixPQUFBLENBQVEsa0JBQVI7O0VBQ3pCLE9BQUEsR0FBeUIsT0FBQSxDQUFRLG1CQUFSOztFQUN6QixjQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQ0FBUjs7RUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7O0VBQ3pCLGNBQUEsR0FBeUIsT0FBQSxDQUFRLG1DQUFSOztFQUN6QixTQUFBLEdBQXlCLE9BQUEsQ0FBUSxxQkFBUjs7RUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7O0VBQ3pCLGFBQUEsR0FBeUIsT0FBQSxDQUFRLDBCQUFSOztFQUN6QixpQkFBQSxHQUF5QixPQUFBLENBQVEsK0JBQVI7O0VBQ3pCLFlBQUEsR0FBeUIsT0FBQSxDQUFRLHlCQUFSOztFQUN6QixhQUFBLEdBQXlCLE9BQUEsQ0FBUSwwQkFBUjs7RUFDekIsWUFBQSxHQUF5QixPQUFBLENBQVEseUJBQVI7O0VBQ3pCLFdBQUEsR0FBeUIsT0FBQSxDQUFRLHdCQUFSOztFQUN6QixZQUFBLEdBQXlCLE9BQUEsQ0FBUSx5QkFBUjs7RUFDekIsbUJBQUEsR0FBeUIsT0FBQSxDQUFRLGlDQUFSOztFQUN6QixTQUFBLEdBQXlCLE9BQUEsQ0FBUSxxQkFBUjs7RUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7O0VBQ3pCLGVBQUEsR0FBeUIsT0FBQSxDQUFRLDRCQUFSOztFQUN6QixxQkFBQSxHQUF5QixPQUFBLENBQVEsMkNBQVI7O0VBQ3pCLE1BQUEsR0FBeUIsT0FBQSxDQUFRLGtCQUFSOztFQUN6QixRQUFBLEdBQXlCLE9BQUEsQ0FBUSxvQkFBUjs7RUFDekIsU0FBQSxHQUF5QixPQUFBLENBQVEscUJBQVI7O0VBQ3pCLG1CQUFBLEdBQXlCLE9BQUEsQ0FBUSxpQ0FBUjs7RUFDekIsWUFBQSxHQUF5QixPQUFBLENBQVEsb0JBQVI7O0VBRXpCLGVBQUEsR0FBa0IsU0FBQSxHQUFZOztFQUM5QixlQUFBLEdBQWtCLFNBQUEsR0FBWTs7RUFFOUIsV0FBQSxHQUFjLFNBQUMsSUFBRDtBQUNaLFFBQUE7V0FBQSxJQUFJLENBQUMsVUFBTCwyREFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCO0VBRFk7O0VBR2QsY0FBQSxHQUFpQixTQUFBO0FBQ2YsUUFBQTtBQUFBLFdBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxhQUFsQyxDQUFOO01BQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyx5QkFBZCxDQUF3QyxhQUF4QztJQURGO0lBR0Esd0JBQUEsR0FBMkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1DQUFoQjtJQUMzQixRQUFBLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQjtJQUNYLFdBQUEsR0FBYztJQUNkLFdBQUEsR0FBYztJQUVkLElBQUcsUUFBSDtNQUNFLFdBQUEsR0FBYyxZQUFZLENBQUM7TUFDM0IsV0FBQSxHQUFjLGdCQUZoQjtLQUFBLE1BQUE7TUFJRSxXQUFBLEdBQWMsWUFBWSxDQUFDO01BQzNCLFdBQUEsR0FBYyxnQkFMaEI7O0lBT0EsSUFBRyx3QkFBSDthQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBZCxDQUF5QixXQUF6QixFQURGO0tBQUEsTUFBQTtNQUdFLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsV0FBOUI7TUFDVixPQUFPLENBQUMsV0FBUixHQUFzQjthQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQWQsQ0FBeUIsT0FBekIsRUFMRjs7RUFoQmU7O0VBdUJqQixpQkFBQSxHQUFvQixTQUFBO1dBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQUEsQ0FBOEIsQ0FBQyxNQUEvQixDQUFzQyxTQUFDLENBQUQ7YUFBTztJQUFQLENBQXRDO0VBQUg7O0VBRXBCLGNBQUEsR0FBaUIsU0FBQyxFQUFEOztNQUNmLEVBQUUsQ0FBQzs7O01BQ0gsRUFBRSxDQUFDOztJQUNILElBQXNDLEVBQUUsQ0FBQyxTQUF6Qzt5REFBQSxFQUFFLENBQUMsaUJBQWtCLEVBQUUsQ0FBQyxvQkFBeEI7O0VBSGU7O0VBS2pCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQVEsY0FBUjtJQUVBLGFBQUEsRUFBZSxJQUZmO0lBSUEsU0FBQSxFQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QixDQUpYO0lBTUEsY0FBQSxFQUFnQixTQUFBO2FBQUcsT0FBQSxDQUFRLFdBQVI7SUFBSCxDQU5oQjtJQVFBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFDUixVQUFBO01BQUEsY0FBQSxDQUFBO01BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixLQUFBLEdBQVEsaUJBQUEsQ0FBQTtNQUNSLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQUEsQ0FBNkIsQ0FBQyxNQUE5QixLQUF3QyxDQUEzQztRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWIsQ0FBOEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxLQUFEO21CQUFXLGNBQUEsQ0FBZSxLQUFmO1VBQVg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLEVBREY7O01BRUEsSUFBRyxLQUFLLENBQUMsTUFBTixLQUFnQixDQUFoQixJQUFzQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBQSxDQUE2QixDQUFDLE1BQTlCLEdBQXVDLENBQWhFO1FBQ0UsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsZUFBcEMsRUFBcUQsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxPQUFBLENBQUEsQ0FBUyxDQUFDLElBQVYsQ0FBZSxLQUFDLENBQUEsUUFBaEI7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckQsQ0FBbkIsRUFERjs7TUFFQSxJQUFHLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBbEI7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFiLENBQThCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsS0FBRDttQkFBVyxjQUFBLENBQWUsS0FBZjtVQUFYO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QjtRQUNBLFdBQUEsQ0FBQTtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGVBQXBDLEVBQXFELFNBQUE7aUJBQU8sSUFBQSxjQUFBLENBQUE7UUFBUCxDQUFyRCxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGNBQXBDLEVBQW9ELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7Y0FBQSxJQUFBLEVBQU0sV0FBQSxDQUFZLElBQVosQ0FBTjthQUFkO1VBQVYsQ0FBbkI7UUFBSCxDQUFwRCxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLHVCQUFwQyxFQUE2RCxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO2NBQUEsTUFBQSxFQUFRLElBQVI7YUFBZDtVQUFWLENBQW5CO1FBQUgsQ0FBN0QsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxrQkFBcEMsRUFBd0QsU0FBQTtpQkFBRyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDttQkFBVSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVI7VUFBVixDQUFuQjtRQUFILENBQXhELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsaUJBQXBDLEVBQXVELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsU0FBQSxDQUFVLElBQVY7VUFBVixDQUFuQjtRQUFILENBQXZELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MscUJBQXBDLEVBQTJELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsU0FBQSxDQUFVLElBQVYsRUFBZ0I7Y0FBQSxZQUFBLEVBQWMsSUFBZDthQUFoQjtVQUFWLENBQW5CO1FBQUgsQ0FBM0QsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyx1QkFBcEMsRUFBNkQsU0FBQTtpQkFBRyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDttQkFBYyxJQUFBLGNBQUEsQ0FBZSxJQUFmO1VBQWQsQ0FBbkI7UUFBSCxDQUE3RCxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLHlCQUFwQyxFQUErRCxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO2NBQUEsSUFBQSxFQUFNLFdBQUEsQ0FBWSxJQUFaLENBQU47YUFBZCxDQUFzQyxDQUFDLElBQXZDLENBQTRDLFNBQUE7cUJBQUcsU0FBQSxDQUFVLElBQVY7WUFBSCxDQUE1QztVQUFWLENBQW5CO1FBQUgsQ0FBL0QsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxrQ0FBcEMsRUFBd0UsU0FBQTtpQkFBRyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDttQkFBVSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztjQUFBLElBQUEsRUFBTSxXQUFBLENBQVksSUFBWixDQUFOO2FBQWQsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxTQUFBO3FCQUFHLFNBQUEsQ0FBVSxJQUFWLEVBQWdCO2dCQUFBLE9BQUEsRUFBUyxJQUFUO2VBQWhCO1lBQUgsQ0FBNUM7VUFBVixDQUFuQjtRQUFILENBQXhFLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsNkJBQXBDLEVBQW1FLFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUE7cUJBQUcsU0FBQSxDQUFVLElBQVY7WUFBSCxDQUFuQjtVQUFWLENBQW5CO1FBQUgsQ0FBbkUsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxrQ0FBcEMsRUFBd0UsU0FBQTtpQkFBRyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDttQkFBVSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQTtxQkFBRyxTQUFBLENBQVUsSUFBVixFQUFnQjtnQkFBQSxPQUFBLEVBQVMsSUFBVDtlQUFoQjtZQUFILENBQW5CO1VBQVYsQ0FBbkI7UUFBSCxDQUF4RSxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLDhCQUFwQyxFQUFvRSxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLFNBQUEsQ0FBVSxJQUFWLEVBQWdCO2NBQUEsWUFBQSxFQUFjLElBQWQ7Y0FBb0IsT0FBQSxFQUFTLElBQTdCO2FBQWhCO1VBQVYsQ0FBbkI7UUFBSCxDQUFwRSxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLG1CQUFwQyxFQUF5RCxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLGlCQUFBLENBQWtCLElBQWxCO1VBQVYsQ0FBbkI7UUFBSCxDQUF6RCxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLDBCQUFwQyxFQUFnRSxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLGlCQUFBLENBQWtCLElBQWxCLEVBQXdCO2NBQUMsTUFBQSxFQUFRLElBQVQ7YUFBeEI7VUFBVixDQUFuQjtRQUFILENBQWhFLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsZ0NBQXBDLEVBQXNFLFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsZUFBQSxDQUFnQixJQUFoQixFQUFzQjtjQUFBLElBQUEsRUFBTSxXQUFBLENBQVksSUFBWixDQUFOO2FBQXRCO1VBQVYsQ0FBbkI7UUFBSCxDQUF0RSxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLDZCQUFwQyxFQUFtRSxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLG1CQUFBLENBQW9CLElBQXBCO1VBQVYsQ0FBbkI7UUFBSCxDQUFuRSxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLHFCQUFwQyxFQUEyRCxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLG9CQUFBLENBQXFCLElBQXJCO1VBQVYsQ0FBbkI7UUFBSCxDQUEzRCxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLDhCQUFwQyxFQUFvRSxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLGVBQUEsQ0FBZ0IsSUFBaEI7VUFBVixDQUFuQjtRQUFILENBQXBFLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsK0JBQXBDLEVBQXFFLFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsZUFBQSxDQUFnQixJQUFoQixFQUFzQjtjQUFDLE1BQUEsRUFBUSxJQUFUO2FBQXRCO1VBQVYsQ0FBbkI7UUFBSCxDQUFyRSxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLHNCQUFwQyxFQUE0RCxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLGFBQUEsQ0FBYyxJQUFkO1VBQVYsQ0FBbkI7UUFBSCxDQUE1RCxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGVBQXBDLEVBQXFELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsT0FBQSxDQUFRLElBQVIsRUFBYztjQUFBLElBQUEsRUFBTSxXQUFBLENBQVksSUFBWixDQUFOO2FBQWQ7VUFBVixDQUFuQjtRQUFILENBQXJELENBQW5CO1FBQ0EsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCLENBQUg7VUFDRSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyx3QkFBcEMsRUFBOEQsU0FBQTttQkFBRyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDtxQkFBVSxlQUFBLENBQWdCLElBQWhCO1lBQVYsQ0FBbkI7VUFBSCxDQUE5RCxDQUFuQjtVQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLDRCQUFwQyxFQUFrRSxTQUFBO21CQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO3FCQUFVLGtCQUFBLENBQW1CLElBQW5CO1lBQVYsQ0FBbkI7VUFBSCxDQUFsRSxDQUFuQixFQUZGOztRQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLG1CQUFwQyxFQUF5RCxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLFdBQUEsQ0FBWSxJQUFaLEVBQWtCO2NBQUEsSUFBQSxFQUFNLFdBQUEsQ0FBWSxJQUFaLENBQU47YUFBbEI7VUFBVixDQUFuQjtRQUFILENBQXpELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsbUJBQXBDLEVBQXlELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsVUFBQSxDQUFXLElBQVg7VUFBVixDQUFuQjtRQUFILENBQXpELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsZ0JBQXBDLEVBQXNELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsUUFBQSxDQUFTLElBQVQ7VUFBVixDQUFuQjtRQUFILENBQXRELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msb0JBQXBDLEVBQTBELFNBQUE7aUJBQUcsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQUFpQixDQUFDLElBQWxCLENBQXVCLFNBQUMsS0FBRDttQkFBVyxXQUFBLENBQVksS0FBWjtVQUFYLENBQXZCO1FBQUgsQ0FBMUQsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxzQkFBcEMsRUFBNEQsU0FBQTtpQkFBRyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDttQkFBVSxhQUFBLENBQWMsSUFBZDtVQUFWLENBQW5CO1FBQUgsQ0FBNUQsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxlQUFwQyxFQUFxRCxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLE9BQUEsQ0FBUSxJQUFSO1VBQVYsQ0FBbkI7UUFBSCxDQUFyRCxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGVBQXBDLEVBQXFELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsT0FBQSxDQUFRLElBQVI7VUFBVixDQUFuQjtRQUFILENBQXJELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsNEJBQXBDLEVBQWtFLFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsT0FBQSxDQUFRLElBQVIsRUFBYztjQUFBLFdBQUEsRUFBYSxJQUFiO2FBQWQ7VUFBVixDQUFuQjtRQUFILENBQWxFLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsaUJBQXBDLEVBQXVELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsU0FBQSxDQUFVLElBQVYsRUFBZ0I7Y0FBQSxZQUFBLEVBQWMsSUFBZDthQUFoQjtVQUFWLENBQW5CO1FBQUgsQ0FBdkQsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyw4QkFBcEMsRUFBb0UsU0FBQTtpQkFBRyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDttQkFBVSxTQUFBLENBQVUsSUFBVjtVQUFWLENBQW5CO1FBQUgsQ0FBcEUsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxnQkFBcEMsRUFBc0QsU0FBQTtpQkFBRyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDttQkFBVSxHQUFHLENBQUMsS0FBSixDQUFVLElBQVY7VUFBVixDQUFuQjtRQUFILENBQXRELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsZUFBcEMsRUFBcUQsU0FBQTtpQkFBRyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDttQkFBVSxPQUFBLENBQVEsSUFBUjtVQUFWLENBQW5CO1FBQUgsQ0FBckQsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxjQUFwQyxFQUFvRCxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLE1BQUEsQ0FBTyxJQUFQO1VBQVYsQ0FBbkI7UUFBSCxDQUFwRCxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLDJCQUFwQyxFQUFpRSxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFVLE1BQUEsQ0FBTyxJQUFQLEVBQWE7Y0FBQSxlQUFBLEVBQWlCLElBQWpCO2FBQWI7VUFBVixDQUFuQjtRQUFILENBQWpFLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MscUJBQXBDLEVBQTJELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsWUFBQSxDQUFhLElBQWI7VUFBVixDQUFuQjtRQUFILENBQTNELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MscUJBQXBDLEVBQTJELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsWUFBQSxDQUFhLElBQWI7VUFBVixDQUFuQjtRQUFILENBQTNELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsNkJBQXBDLEVBQW1FLFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsbUJBQUEsQ0FBb0IsSUFBcEI7VUFBVixDQUFuQjtRQUFILENBQW5FLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msb0JBQXBDLEVBQTBELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsV0FBQSxDQUFZLElBQVo7VUFBVixDQUFuQjtRQUFILENBQTFELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msc0JBQXBDLEVBQTRELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsYUFBQSxDQUFjLElBQWQ7VUFBVixDQUFuQjtRQUFILENBQTVELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsdUJBQXBDLEVBQTZELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsWUFBQSxDQUFhLElBQWI7VUFBVixDQUFuQjtRQUFILENBQTdELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsaUJBQXBDLEVBQXVELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsU0FBQSxDQUFVLElBQVY7VUFBVixDQUFuQjtRQUFILENBQXZELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsZUFBcEMsRUFBcUQsU0FBQTtpQkFBRyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDttQkFBVSxPQUFBLENBQVEsSUFBUjtVQUFWLENBQW5CO1FBQUgsQ0FBckQsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxjQUFwQyxFQUFvRCxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO21CQUFjLElBQUEsTUFBQSxDQUFPLElBQVA7VUFBZCxDQUFuQjtRQUFILENBQXBELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsZ0JBQXBDLEVBQXNELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsUUFBQSxDQUFTLElBQVQ7VUFBVixDQUFuQjtRQUFILENBQXRELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsdUJBQXBDLEVBQTZELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsUUFBQSxDQUFTLElBQVQsRUFBZTtjQUFBLE1BQUEsRUFBUSxJQUFSO2FBQWY7VUFBVixDQUFuQjtRQUFILENBQTdELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsZ0NBQXBDLEVBQXNFLFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsUUFBQSxDQUFTLElBQVQsRUFBZTtjQUFBLGFBQUEsRUFBZSxJQUFmO2FBQWY7VUFBVixDQUFuQjtRQUFILENBQXRFLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsaUJBQXBDLEVBQXVELFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsU0FBQSxDQUFVLElBQVY7VUFBVixDQUFuQjtRQUFILENBQXZELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsaUNBQXBDLEVBQXVFLFNBQUE7aUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7bUJBQVUsbUJBQUEsQ0FBb0IsSUFBcEI7VUFBVixDQUFuQjtRQUFILENBQXZFLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixZQUFsQixFQUFnQyxzQkFBaEMsRUFBd0QsU0FBQTtpQkFBRyxhQUFBLENBQUE7UUFBSCxDQUF4RCxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsWUFBbEIsRUFBZ0MsaUNBQWhDLEVBQW1FLFNBQUE7aUJBQUcsc0JBQUEsQ0FBQTtRQUFILENBQW5FLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixZQUFsQixFQUFnQyxnQ0FBaEMsRUFBa0UsU0FBQTtpQkFBRyxzQkFBQSxDQUFBO1FBQUgsQ0FBbEUsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLFlBQWxCLEVBQWdDLHVCQUFoQyxFQUF5RCxTQUFBO2lCQUFHLGNBQUEsQ0FBQTtRQUFILENBQXpELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixZQUFsQixFQUFnQyxnQ0FBaEMsRUFBa0Usc0JBQWxFLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixZQUFsQixFQUFnQyxvQ0FBaEMsRUFBc0UseUJBQXRFLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixZQUFsQixFQUFnQywyQkFBaEMsRUFBNkQsU0FBQTtpQkFBRyxrQkFBQSxDQUFBO1FBQUgsQ0FBN0QsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLFlBQWxCLEVBQWdDLHVCQUFoQyxFQUF5RCxTQUFBO2lCQUFHLGNBQUEsQ0FBQTtRQUFILENBQXpELENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixZQUFsQixFQUFnQyx1QkFBaEMsRUFBeUQsU0FBQTtpQkFBRyxjQUFBLENBQUE7UUFBSCxDQUF6RCxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsWUFBbEIsRUFBZ0Msb0NBQWhDLEVBQXNFLFNBQUE7aUJBQUcsY0FBQSxDQUFlO1lBQUEsV0FBQSxFQUFhLElBQWI7V0FBZjtRQUFILENBQXRFLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixZQUFsQixFQUFnQywrQkFBaEMsRUFBaUUsU0FBQTtpQkFBRyxxQkFBQSxDQUFBO1FBQUgsQ0FBakUsQ0FBbkI7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG1DQUFwQixFQUF5RCxjQUF6RCxDQUFuQjtRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IseUJBQXBCLEVBQStDLGNBQS9DLENBQW5CO1FBQ0EsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBQUg7VUFDRSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxzQkFBcEMsRUFBNEQsU0FBQTttQkFBRyxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLGlCQUFuQjtVQUFILENBQTVELENBQW5CLEVBREY7U0FBQSxNQUFBO1VBR0UsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msd0JBQXBDLEVBQThELFNBQUE7bUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixlQUFuQjtVQUFILENBQTlELENBQW5CO1VBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msc0JBQXBDLEVBQTRELFNBQUE7bUJBQUcsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixhQUFuQjtVQUFILENBQTVELENBQW5CLEVBSkY7O1FBS0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3QixzQ0FBeEIsRUFBZ0UsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtZQUNqRixLQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTttQkFDQSxLQUFDLENBQUEsUUFBRCxDQUFBO1VBRmlGO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRSxDQUFuQjtlQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsaUNBQXBCLEVBQXVELENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsUUFBRDttQkFBYyxLQUFDLENBQUEsU0FBRCxDQUFXLFFBQVg7VUFBZDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkQsQ0FBbkIsRUE1RUY7O0lBUlEsQ0FSVjtJQThGQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTs7V0FDYyxDQUFFLE9BQWhCLENBQUE7O2FBQ0EsYUFBQSxDQUFjLElBQUMsQ0FBQSxpQkFBZjtJQUhVLENBOUZaO0lBbUdBLFNBQUEsRUFBVyxTQUFDLFFBQUQ7QUFDVCxVQUFBO01BQUEsYUFBQSxDQUFjLElBQUMsQ0FBQSxpQkFBZjtNQUNBLElBQUcsZUFBQSxHQUFrQixDQUFDLFFBQUEsR0FBVyxFQUFaLENBQUEsR0FBa0IsSUFBdkM7UUFDRSxLQUFBLEdBQVEsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsS0FBQyxDQUFBLFNBQXhCLEVBQW1DLG9CQUFuQztVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtlQUNSLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixXQUFBLENBQVksS0FBWixFQUFtQixlQUFuQixFQUZ2Qjs7SUFGUyxDQW5HWDtJQXlHQSxlQUFBLEVBQWlCLFNBQUMsR0FBRDtBQUNmLFVBQUE7TUFEaUIsYUFBRDthQUNoQixVQUFBLENBQVcsU0FBQyxRQUFEO2VBQWMsUUFBUSxDQUFDLE9BQVQsQ0FBQSxDQUFrQixDQUFDLFFBQW5CLENBQTRCLGdCQUE1QjtNQUFkLENBQVg7SUFEZSxDQXpHakI7SUE0R0EsZ0JBQUEsRUFBa0IsU0FBQyxVQUFEO01BQUMsSUFBQyxDQUFBLFlBQUQ7TUFDakIsSUFBRyxpQkFBQSxDQUFBLENBQW1CLENBQUMsTUFBcEIsR0FBNkIsQ0FBaEM7UUFDRSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsSUFBQyxDQUFBLFNBQTFCO1FBQ0EsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBQUg7aUJBQ0UsSUFBQyxDQUFBLHFCQUFELENBQXVCLElBQUMsQ0FBQSxTQUF4QixFQURGO1NBRkY7O0lBRGdCLENBNUdsQjtJQWtIQSxxQkFBQSxFQUF1QixTQUFDLFNBQUQ7QUFDckIsVUFBQTtNQUFBLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNOLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixjQUFsQjtNQUNBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QjtNQUNQLElBQUksQ0FBQyxXQUFMLEdBQW1CO01BQ25CLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixHQUF2QjtNQUNQLElBQUksQ0FBQyxXQUFMLENBQWlCLElBQWpCO01BQ0EsSUFBSSxDQUFDLE9BQUwsR0FBZSxTQUFDLENBQUQ7ZUFBTyxpQkFBaUIsQ0FBQyxPQUFsQixDQUFBLENBQTJCLENBQUMsTUFBNUIsQ0FBQTtNQUFQO01BQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLEdBQWxCLEVBQXVCO1FBQUUsS0FBQSxFQUFPLGdDQUFUO09BQXZCO01BQ0EsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEI7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixTQUFTLENBQUMsWUFBVixDQUF1QjtRQUFBLElBQUEsRUFBTSxHQUFOO1FBQVcsUUFBQSxFQUFVLENBQXJCO09BQXZCO0lBVkksQ0FsSHZCO0lBOEhBLHVCQUFBLEVBQXlCLFNBQUMsU0FBRDthQUN2QixTQUFTLENBQUMsYUFBVixDQUFBLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7QUFDN0IsY0FBQTtVQUQrQixPQUFEO1VBQzlCLDRGQUFrQixDQUFFLFNBQVUsc0NBQTlCO1lBQ0UsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxhQUFiLENBQTJCLENBQUMsRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0MsU0FBQyxDQUFEO0FBQ3RDLGtCQUFBO2NBQUEsSUFBQSwrSEFBb0YsRUFBRSxJQUFGO2NBQ25GLGVBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQkFBaEI7Y0FDakIsT0FBQSxHQUFVLFNBQUMsR0FBRDt1QkFBUyxDQUFFLENBQUcsR0FBRCxHQUFLLEtBQVA7Y0FBWDtjQUNWLElBQUcsT0FBQSxDQUFRLFlBQVIsQ0FBSDt1QkFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsS0FBQyxDQUFBLFNBQXhCLEVBQW1DLHFCQUFuQyxFQURGO2VBQUEsTUFFSyxJQUFBLENBQU0sQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FBRCxDQUFOO3VCQUNILElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixLQUFDLENBQUEsU0FBeEIsRUFBbUMsbUJBQW5DLEVBREc7O1lBTmlDLENBQXhDO0FBUUEsbUJBQU8sS0FUVDs7UUFENkI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9CO0lBRHVCLENBOUh6Qjs7QUE3RkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gID0gcmVxdWlyZSAnYXRvbSdcbnskfSAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbmdpdCAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL2dpdCdcbmNvbmZpZ3VyYXRpb25zICAgICAgICAgPSByZXF1aXJlICcuL2NvbmZpZydcbmNvbnRleHRNZW51ICAgICAgICAgICAgPSByZXF1aXJlICcuL2NvbnRleHQtbWVudSdcbk91dHB1dFZpZXdNYW5hZ2VyICAgICAgPSByZXF1aXJlICcuL291dHB1dC12aWV3LW1hbmFnZXInXG5HaXRQYWxldHRlVmlldyAgICAgICAgID0gcmVxdWlyZSAnLi92aWV3cy9naXQtcGFsZXR0ZS12aWV3J1xuR2l0QWRkQ29udGV4dCAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2NvbnRleHQvZ2l0LWFkZC1jb250ZXh0J1xuR2l0RGlmZkNvbnRleHQgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2NvbnRleHQvZ2l0LWRpZmYtY29udGV4dCdcbkdpdEFkZEFuZENvbW1pdENvbnRleHQgPSByZXF1aXJlICcuL21vZGVscy9jb250ZXh0L2dpdC1hZGQtYW5kLWNvbW1pdC1jb250ZXh0J1xuR2l0Q2hlY2tvdXROZXdCcmFuY2ggICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jaGVja291dC1uZXctYnJhbmNoJ1xuR2l0Q2hlY2tvdXRCcmFuY2ggICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jaGVja291dC1icmFuY2gnXG5HaXREZWxldGVCcmFuY2ggICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRlbGV0ZS1icmFuY2gnXG5HaXRDaGVja291dEFsbEZpbGVzICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWNoZWNrb3V0LWFsbC1maWxlcydcbkdpdENoZWNrb3V0RmlsZSAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtY2hlY2tvdXQtZmlsZSdcbkdpdENoZWNrb3V0RmlsZUNvbnRleHQgPSByZXF1aXJlICcuL21vZGVscy9jb250ZXh0L2dpdC1jaGVja291dC1maWxlLWNvbnRleHQnXG5HaXRDaGVycnlQaWNrICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWNoZXJyeS1waWNrJ1xuR2l0Q29tbWl0ICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jb21taXQnXG5HaXRDb21taXRBbWVuZCAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWNvbW1pdC1hbWVuZCdcbkdpdERpZmYgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZGlmZidcbkdpdERpZmZCcmFuY2hlcyAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZGlmZi1icmFuY2hlcydcbkdpdERpZmZCcmFuY2hlc0NvbnRleHQgPSByZXF1aXJlICcuL21vZGVscy9jb250ZXh0L2dpdC1kaWZmLWJyYW5jaGVzLWNvbnRleHQnXG5HaXREaWZmQnJhbmNoRmlsZXMgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRpZmYtYnJhbmNoLWZpbGVzJ1xuR2l0RGlmZkJyYW5jaEZpbGVzQ29udGV4dCAgICAgPSByZXF1aXJlICcuL21vZGVscy9jb250ZXh0L2dpdC1kaWZmLWJyYW5jaC1maWxlcy1jb250ZXh0J1xuR2l0RGlmZnRvb2wgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kaWZmdG9vbCdcbkdpdERpZmZ0b29sQ29udGV4dCAgICAgPSByZXF1aXJlICcuL21vZGVscy9jb250ZXh0L2dpdC1kaWZmdG9vbC1jb250ZXh0J1xuR2l0RGlmZkFsbCAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kaWZmLWFsbCdcbkdpdEZldGNoICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZmV0Y2gnXG5HaXRGZXRjaEFsbCAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWZldGNoLWFsbCdcbkdpdEZldGNoUHJ1bmUgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZmV0Y2gtcHJ1bmUuY29mZmVlJ1xuR2l0SW5pdCAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1pbml0J1xuR2l0TG9nICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1sb2cnXG5HaXRQdWxsICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXB1bGwnXG5HaXRQdWxsQ29udGV4dCAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvY29udGV4dC9naXQtcHVsbC1jb250ZXh0J1xuR2l0UHVzaCAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1wdXNoJ1xuR2l0UHVzaENvbnRleHQgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2NvbnRleHQvZ2l0LXB1c2gtY29udGV4dCdcbkdpdFJlbW92ZSAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtcmVtb3ZlJ1xuR2l0U2hvdyAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zaG93J1xuR2l0U3RhZ2VGaWxlcyAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGFnZS1maWxlcydcbkdpdFN0YWdlRmlsZXNCZXRhICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3RhZ2UtZmlsZXMtYmV0YSdcbkdpdFN0YWdlSHVuayAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3RhZ2UtaHVuaydcbkdpdFN0YXNoQXBwbHkgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtYXBwbHknXG5HaXRTdGFzaERyb3AgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXNoLWRyb3AnXG5HaXRTdGFzaFBvcCAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXNoLXBvcCdcbkdpdFN0YXNoU2F2ZSAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtc2F2ZSdcbkdpdFN0YXNoU2F2ZU1lc3NhZ2UgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtc2F2ZS1tZXNzYWdlJ1xuR2l0U3RhdHVzICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGF0dXMnXG5HaXRUYWdzICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXRhZ3MnXG5HaXRVbnN0YWdlRmlsZXMgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXVuc3RhZ2UtZmlsZXMnXG5HaXRVbnN0YWdlRmlsZUNvbnRleHQgID0gcmVxdWlyZSAnLi9tb2RlbHMvY29udGV4dC9naXQtdW5zdGFnZS1maWxlLWNvbnRleHQnXG5HaXRSdW4gICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXJ1bidcbkdpdE1lcmdlICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtbWVyZ2UnXG5HaXRSZWJhc2UgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXJlYmFzZSdcbkdpdE9wZW5DaGFuZ2VkRmlsZXMgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtb3Blbi1jaGFuZ2VkLWZpbGVzJ1xuZGlmZkdyYW1tYXJzICAgICAgICAgICA9IHJlcXVpcmUgJy4vZ3JhbW1hcnMvZGlmZi5qcydcblxuYmFzZVdvcmRHcmFtbWFyID0gX19kaXJuYW1lICsgJy9ncmFtbWFycy93b3JkLWRpZmYuanNvbidcbmJhc2VMaW5lR3JhbW1hciA9IF9fZGlybmFtZSArICcvZ3JhbW1hcnMvbGluZS1kaWZmLmpzb24nXG5cbmN1cnJlbnRGaWxlID0gKHJlcG8pIC0+XG4gIHJlcG8ucmVsYXRpdml6ZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKSlcblxuc2V0RGlmZkdyYW1tYXIgPSAtPlxuICB3aGlsZSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUgJ3NvdXJjZS5kaWZmJ1xuICAgIGF0b20uZ3JhbW1hcnMucmVtb3ZlR3JhbW1hckZvclNjb3BlTmFtZSAnc291cmNlLmRpZmYnXG5cbiAgZW5hYmxlU3ludGF4SGlnaGxpZ2h0aW5nID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5kaWZmcy5zeW50YXhIaWdobGlnaHRpbmcnKVxuICB3b3JkRGlmZiA9IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZGlmZnMud29yZERpZmYnKVxuICBkaWZmR3JhbW1hciA9IG51bGxcbiAgYmFzZUdyYW1tYXIgPSBudWxsXG5cbiAgaWYgd29yZERpZmZcbiAgICBkaWZmR3JhbW1hciA9IGRpZmZHcmFtbWFycy53b3JkR3JhbW1hclxuICAgIGJhc2VHcmFtbWFyID0gYmFzZVdvcmRHcmFtbWFyXG4gIGVsc2VcbiAgICBkaWZmR3JhbW1hciA9IGRpZmZHcmFtbWFycy5saW5lR3JhbW1hclxuICAgIGJhc2VHcmFtbWFyID0gYmFzZUxpbmVHcmFtbWFyXG5cbiAgaWYgZW5hYmxlU3ludGF4SGlnaGxpZ2h0aW5nXG4gICAgYXRvbS5ncmFtbWFycy5hZGRHcmFtbWFyIGRpZmZHcmFtbWFyXG4gIGVsc2VcbiAgICBncmFtbWFyID0gYXRvbS5ncmFtbWFycy5yZWFkR3JhbW1hclN5bmMgYmFzZUdyYW1tYXJcbiAgICBncmFtbWFyLnBhY2thZ2VOYW1lID0gJ2dpdC1wbHVzJ1xuICAgIGF0b20uZ3JhbW1hcnMuYWRkR3JhbW1hciBncmFtbWFyXG5cbmdldFdvcmtzcGFjZVJlcG9zID0gLT4gYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpLmZpbHRlciAocikgLT4gcj9cblxub25QYXRoc0NoYW5nZWQgPSAoZ3ApIC0+XG4gIGdwLmRlYWN0aXZhdGU/KClcbiAgZ3AuYWN0aXZhdGU/KClcbiAgZ3AuY29uc3VtZVN0YXR1c0Jhcj8oZ3Auc3RhdHVzQmFyKSBpZiBncC5zdGF0dXNCYXJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6IGNvbmZpZ3VyYXRpb25zXG5cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuXG4gIHdvcmtzcGFjZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYXRvbS13b3Jrc3BhY2UnKVxuXG4gIHByb3ZpZGVTZXJ2aWNlOiAtPiByZXF1aXJlICcuL3NlcnZpY2UnXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBzZXREaWZmR3JhbW1hcigpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHJlcG9zID0gZ2V0V29ya3NwYWNlUmVwb3MoKVxuICAgIGlmIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpLmxlbmd0aCBpcyAwXG4gICAgICBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocyAocGF0aHMpID0+IG9uUGF0aHNDaGFuZ2VkKHRoaXMpXG4gICAgaWYgcmVwb3MubGVuZ3RoIGlzIDAgYW5kIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpLmxlbmd0aCA+IDBcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6aW5pdCcsID0+IEdpdEluaXQoKS50aGVuKEBhY3RpdmF0ZSlcbiAgICBpZiByZXBvcy5sZW5ndGggPiAwXG4gICAgICBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocyAocGF0aHMpID0+IG9uUGF0aHNDaGFuZ2VkKHRoaXMpXG4gICAgICBjb250ZXh0TWVudSgpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOm1lbnUnLCAtPiBuZXcgR2l0UGFsZXR0ZVZpZXcoKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czphZGQnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IGdpdC5hZGQocmVwbywgZmlsZTogY3VycmVudEZpbGUocmVwbykpKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czphZGQtbW9kaWZpZWQnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IGdpdC5hZGQocmVwbywgdXBkYXRlOiB0cnVlKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6YWRkLWFsbCcsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gZ2l0LmFkZChyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6Y29tbWl0JywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRDb21taXQocmVwbykpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmNvbW1pdC1hbGwnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IEdpdENvbW1pdChyZXBvLCBzdGFnZUNoYW5nZXM6IHRydWUpKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpjb21taXQtYW1lbmQnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IG5ldyBHaXRDb21taXRBbWVuZChyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6YWRkLWFuZC1jb21taXQnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IGdpdC5hZGQocmVwbywgZmlsZTogY3VycmVudEZpbGUocmVwbykpLnRoZW4gLT4gR2l0Q29tbWl0KHJlcG8pKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czphZGQtYW5kLWNvbW1pdC1hbmQtcHVzaCcsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gZ2l0LmFkZChyZXBvLCBmaWxlOiBjdXJyZW50RmlsZShyZXBvKSkudGhlbiAtPiBHaXRDb21taXQocmVwbywgYW5kUHVzaDogdHJ1ZSkpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmFkZC1hbGwtYW5kLWNvbW1pdCcsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gZ2l0LmFkZChyZXBvKS50aGVuIC0+IEdpdENvbW1pdChyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6YWRkLWFsbC1jb21taXQtYW5kLXB1c2gnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IGdpdC5hZGQocmVwbykudGhlbiAtPiBHaXRDb21taXQocmVwbywgYW5kUHVzaDogdHJ1ZSkpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmNvbW1pdC1hbGwtYW5kLXB1c2gnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IEdpdENvbW1pdChyZXBvLCBzdGFnZUNoYW5nZXM6IHRydWUsIGFuZFB1c2g6IHRydWUpKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpjaGVja291dCcsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0Q2hlY2tvdXRCcmFuY2gocmVwbykpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmNoZWNrb3V0LXJlbW90ZScsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0Q2hlY2tvdXRCcmFuY2gocmVwbywge3JlbW90ZTogdHJ1ZX0pKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpjaGVja291dC1jdXJyZW50LWZpbGUnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IEdpdENoZWNrb3V0RmlsZShyZXBvLCBmaWxlOiBjdXJyZW50RmlsZShyZXBvKSkpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmNoZWNrb3V0LWFsbC1maWxlcycsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0Q2hlY2tvdXRBbGxGaWxlcyhyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6bmV3LWJyYW5jaCcsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0Q2hlY2tvdXROZXdCcmFuY2gocmVwbykpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmRlbGV0ZS1sb2NhbC1icmFuY2gnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IEdpdERlbGV0ZUJyYW5jaChyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6ZGVsZXRlLXJlbW90ZS1icmFuY2gnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IEdpdERlbGV0ZUJyYW5jaChyZXBvLCB7cmVtb3RlOiB0cnVlfSkpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmNoZXJyeS1waWNrJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRDaGVycnlQaWNrKHJlcG8pKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpkaWZmJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXREaWZmKHJlcG8sIGZpbGU6IGN1cnJlbnRGaWxlKHJlcG8pKSlcbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZXhwZXJpbWVudGFsLmRpZmZCcmFuY2hlcycpXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6ZGlmZi1icmFuY2hlcycsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0RGlmZkJyYW5jaGVzKHJlcG8pKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmRpZmYtYnJhbmNoLWZpbGVzJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXREaWZmQnJhbmNoRmlsZXMocmVwbykpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmRpZmZ0b29sJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXREaWZmdG9vbChyZXBvLCBmaWxlOiBjdXJyZW50RmlsZShyZXBvKSkpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmRpZmYtYWxsJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXREaWZmQWxsKHJlcG8pKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpmZXRjaCcsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0RmV0Y2gocmVwbykpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmZldGNoLWFsbCcsIC0+IGdpdC5nZXRBbGxSZXBvcygpLnRoZW4oKHJlcG9zKSAtPiBHaXRGZXRjaEFsbChyZXBvcykpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmZldGNoLXBydW5lJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRGZXRjaFBydW5lKHJlcG8pKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpwdWxsJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRQdWxsKHJlcG8pKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpwdXNoJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRQdXNoKHJlcG8pKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpwdXNoLXNldC11cHN0cmVhbScsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0UHVzaChyZXBvLCBzZXRVcHN0cmVhbTogdHJ1ZSkpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOnJlbW92ZScsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0UmVtb3ZlKHJlcG8sIHNob3dTZWxlY3RvcjogdHJ1ZSkpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOnJlbW92ZS1jdXJyZW50LWZpbGUnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IEdpdFJlbW92ZShyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6cmVzZXQnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IGdpdC5yZXNldChyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6c2hvdycsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0U2hvdyhyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6bG9nJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRMb2cocmVwbykpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOmxvZy1jdXJyZW50LWZpbGUnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IEdpdExvZyhyZXBvLCBvbmx5Q3VycmVudEZpbGU6IHRydWUpKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpzdGFnZS1odW5rJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRTdGFnZUh1bmsocmVwbykpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOnN0YXNoLXNhdmUnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IEdpdFN0YXNoU2F2ZShyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6c3Rhc2gtc2F2ZS1tZXNzYWdlJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRTdGFzaFNhdmVNZXNzYWdlKHJlcG8pKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpzdGFzaC1wb3AnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IEdpdFN0YXNoUG9wKHJlcG8pKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpzdGFzaC1hcHBseScsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0U3Rhc2hBcHBseShyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6c3Rhc2gtZGVsZXRlJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRTdGFzaERyb3AocmVwbykpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOnN0YXR1cycsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0U3RhdHVzKHJlcG8pKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czp0YWdzJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRUYWdzKHJlcG8pKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpydW4nLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IG5ldyBHaXRSdW4ocmVwbykpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOm1lcmdlJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRNZXJnZShyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6bWVyZ2UtcmVtb3RlJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKChyZXBvKSAtPiBHaXRNZXJnZShyZXBvLCByZW1vdGU6IHRydWUpKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czptZXJnZS1uby1mYXN0LWZvcndhcmQnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IEdpdE1lcmdlKHJlcG8sIG5vRmFzdEZvcndhcmQ6IHRydWUpKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnaXQtcGx1czpyZWJhc2UnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oKHJlcG8pIC0+IEdpdFJlYmFzZShyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ2l0LXBsdXM6Z2l0LW9wZW4tY2hhbmdlZC1maWxlcycsIC0+IGdpdC5nZXRSZXBvKCkudGhlbigocmVwbykgLT4gR2l0T3BlbkNoYW5nZWRGaWxlcyhyZXBvKSlcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnLnRyZWUtdmlldycsICdnaXQtcGx1cy1jb250ZXh0OmFkZCcsIC0+IEdpdEFkZENvbnRleHQoKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICcudHJlZS12aWV3JywgJ2dpdC1wbHVzLWNvbnRleHQ6YWRkLWFuZC1jb21taXQnLCAtPiBHaXRBZGRBbmRDb21taXRDb250ZXh0KClcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnLnRyZWUtdmlldycsICdnaXQtcGx1cy1jb250ZXh0OmNoZWNrb3V0LWZpbGUnLCAtPiBHaXRDaGVja291dEZpbGVDb250ZXh0KClcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnLnRyZWUtdmlldycsICdnaXQtcGx1cy1jb250ZXh0OmRpZmYnLCAtPiBHaXREaWZmQ29udGV4dCgpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcnLCAnZ2l0LXBsdXMtY29udGV4dDpkaWZmLWJyYW5jaGVzJywgR2l0RGlmZkJyYW5jaGVzQ29udGV4dFxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICcudHJlZS12aWV3JywgJ2dpdC1wbHVzLWNvbnRleHQ6ZGlmZi1icmFuY2gtZmlsZXMnLCBHaXREaWZmQnJhbmNoRmlsZXNDb250ZXh0XG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcnLCAnZ2l0LXBsdXMtY29udGV4dDpkaWZmdG9vbCcsIC0+IEdpdERpZmZ0b29sQ29udGV4dCgpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcnLCAnZ2l0LXBsdXMtY29udGV4dDpwdWxsJywgLT4gR2l0UHVsbENvbnRleHQoKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICcudHJlZS12aWV3JywgJ2dpdC1wbHVzLWNvbnRleHQ6cHVzaCcsIC0+IEdpdFB1c2hDb250ZXh0KClcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnLnRyZWUtdmlldycsICdnaXQtcGx1cy1jb250ZXh0OnB1c2gtc2V0LXVwc3RyZWFtJywgLT4gR2l0UHVzaENvbnRleHQoc2V0VXBzdHJlYW06IHRydWUpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcnLCAnZ2l0LXBsdXMtY29udGV4dDp1bnN0YWdlLWZpbGUnLCAtPiBHaXRVbnN0YWdlRmlsZUNvbnRleHQoKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2dpdC1wbHVzLmRpZmZzLnN5bnRheEhpZ2hsaWdodGluZycsIHNldERpZmZHcmFtbWFyXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAnZ2l0LXBsdXMuZGlmZnMud29yZERpZmYnLCBzZXREaWZmR3JhbW1hclxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5leHBlcmltZW50YWwuc3RhZ2VGaWxlc0JldGEnKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOnN0YWdlLWZpbGVzJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKEdpdFN0YWdlRmlsZXNCZXRhKVxuICAgICAgZWxzZVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOnVuc3RhZ2UtZmlsZXMnLCAtPiBnaXQuZ2V0UmVwbygpLnRoZW4oR2l0VW5zdGFnZUZpbGVzKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1wbHVzOnN0YWdlLWZpbGVzJywgLT4gZ2l0LmdldFJlcG8oKS50aGVuKEdpdFN0YWdlRmlsZXMpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2dpdC1wbHVzLmV4cGVyaW1lbnRhbC5zdGFnZUZpbGVzQmV0YScsID0+XG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgICBAYWN0aXZhdGUoKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2dpdC1wbHVzLmV4cGVyaW1lbnRhbC5hdXRvRmV0Y2gnLCAoaW50ZXJ2YWwpID0+IEBhdXRvRmV0Y2goaW50ZXJ2YWwpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAc3RhdHVzQmFyVGlsZT8uZGVzdHJveSgpXG4gICAgY2xlYXJJbnRlcnZhbCBAYXV0b0ZldGNoSW50ZXJ2YWxcblxuICBhdXRvRmV0Y2g6IChpbnRlcnZhbCkgLT5cbiAgICBjbGVhckludGVydmFsIEBhdXRvRmV0Y2hJbnRlcnZhbFxuICAgIGlmIGZldGNoSW50ZXJ2YWxNcyA9IChpbnRlcnZhbCAqIDYwKSAqIDEwMDBcbiAgICAgIGZldGNoID0gPT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaChAd29ya3NwYWNlLCAnZ2l0LXBsdXM6ZmV0Y2gtYWxsJylcbiAgICAgIEBhdXRvRmV0Y2hJbnRlcnZhbCA9IHNldEludGVydmFsKGZldGNoLCBmZXRjaEludGVydmFsTXMpXG5cbiAgY29uc3VtZUF1dG9zYXZlOiAoe2RvbnRTYXZlSWZ9KSAtPlxuICAgIGRvbnRTYXZlSWYgKHBhbmVJdGVtKSAtPiBwYW5lSXRlbS5nZXRQYXRoKCkuaW5jbHVkZXMgJ0NPTU1JVF9FRElUTVNHJ1xuXG4gIGNvbnN1bWVTdGF0dXNCYXI6IChAc3RhdHVzQmFyKSAtPlxuICAgIGlmIGdldFdvcmtzcGFjZVJlcG9zKCkubGVuZ3RoID4gMFxuICAgICAgQHNldHVwQnJhbmNoZXNNZW51VG9nZ2xlIEBzdGF0dXNCYXJcbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCAnZ2l0LXBsdXMuZ2VuZXJhbC5lbmFibGVTdGF0dXNCYXJJY29uJ1xuICAgICAgICBAc2V0dXBPdXRwdXRWaWV3VG9nZ2xlIEBzdGF0dXNCYXJcblxuICBzZXR1cE91dHB1dFZpZXdUb2dnbGU6IChzdGF0dXNCYXIpIC0+XG4gICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkICdpbmxpbmUtYmxvY2snXG4gICAgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ3NwYW4nXG4gICAgaWNvbi50ZXh0Q29udGVudCA9ICdnaXQrJ1xuICAgIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdhJ1xuICAgIGxpbmsuYXBwZW5kQ2hpbGQgaWNvblxuICAgIGxpbmsub25jbGljayA9IChlKSAtPiBPdXRwdXRWaWV3TWFuYWdlci5nZXRWaWV3KCkudG9nZ2xlKClcbiAgICBhdG9tLnRvb2x0aXBzLmFkZCBkaXYsIHsgdGl0bGU6IFwiVG9nZ2xlIEdpdC1QbHVzIE91dHB1dCBDb25zb2xlXCJ9XG4gICAgZGl2LmFwcGVuZENoaWxkIGxpbmtcbiAgICBAc3RhdHVzQmFyVGlsZSA9IHN0YXR1c0Jhci5hZGRSaWdodFRpbGUgaXRlbTogZGl2LCBwcmlvcml0eTogMFxuXG4gIHNldHVwQnJhbmNoZXNNZW51VG9nZ2xlOiAoc3RhdHVzQmFyKSAtPlxuICAgIHN0YXR1c0Jhci5nZXRSaWdodFRpbGVzKCkuc29tZSAoe2l0ZW19KSA9PlxuICAgICAgaWYgaXRlbT8uY2xhc3NMaXN0Py5jb250YWlucz8gJ2dpdC12aWV3J1xuICAgICAgICAkKGl0ZW0pLmZpbmQoJy5naXQtYnJhbmNoJykub24gJ2NsaWNrJywgKGUpID0+XG4gICAgICAgICAga2V5cyA9IGF0b20uY29uZmlnLmdldFNjaGVtYSgnZ2l0LXBsdXMnKS5wcm9wZXJ0aWVzLmdlbmVyYWw/LnByb3BlcnRpZXMubmV3QnJhbmNoS2V5Py5lbnVtXG4gICAgICAgICAge25ld0JyYW5jaEtleX0gPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwnKVxuICAgICAgICAgIHByZXNzZWQgPSAoa2V5KSAtPiBlW1wiI3trZXl9S2V5XCJdXG4gICAgICAgICAgaWYgcHJlc3NlZCBuZXdCcmFuY2hLZXlcbiAgICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goQHdvcmtzcGFjZSwgJ2dpdC1wbHVzOm5ldy1icmFuY2gnKVxuICAgICAgICAgIGVsc2UgdW5sZXNzKGtleXMuc29tZSBwcmVzc2VkKVxuICAgICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChAd29ya3NwYWNlLCAnZ2l0LXBsdXM6Y2hlY2tvdXQnKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuIl19
