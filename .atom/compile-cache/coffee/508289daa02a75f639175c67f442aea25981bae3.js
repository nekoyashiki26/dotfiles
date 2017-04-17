(function() {
  var $, CompositeDisposable, Git, GitGuiActionBarView, GitGuiActionView, GitGuiConfigView, GitGuiDiffView, GitGuiStagingAreaView, GitGuiView, View, chokidar, path, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  chokidar = require('chokidar');

  CompositeDisposable = require('atom').CompositeDisposable;

  ref1 = require('space-pen'), $ = ref1.$, View = ref1.View;

  GitGuiActionBarView = require('./git-gui-action-bar-view');

  GitGuiActionView = require('./git-gui-action-view');

  GitGuiStagingAreaView = require('./git-gui-staging-area-view');

  GitGuiDiffView = require('./git-gui-diff-view');

  GitGuiConfigView = require('./git-gui-config-view');

  Git = require('nodegit');

  GitGuiView = (function(superClass) {
    extend(GitGuiView, superClass);

    function GitGuiView() {
      return GitGuiView.__super__.constructor.apply(this, arguments);
    }

    GitGuiView.prototype.gitGuiActionBarView = null;

    GitGuiView.prototype.gitGuiStagingAreaView = null;

    GitGuiView.prototype.gitGuiActionView = null;

    GitGuiView.prototype.gitGuiDiffView = null;

    GitGuiView.prototype.modalPanel = null;

    GitGuiView.content = function() {
      return this.div({
        "class": 'git-gui'
      }, (function(_this) {
        return function() {
          _this.subview('gitGuiDiffView', new GitGuiDiffView());
          _this.div({
            "class": 'git-gui-settings',
            id: 'settings'
          }, function() {
            return _this.div({
              "class": 'git-gui-settings-content'
            }, function() {
              return _this.subview('gitGuiConfigView', new GitGuiConfigView());
            });
          });
          return _this.div({
            "class": 'git-gui-overlay'
          }, function() {
            _this.div({
              "class": 'action-progress',
              id: 'action-progress-indicator'
            }, function() {
              return _this.span({
                "class": 'loading loading-spinner-small inline-block'
              });
            });
            _this.subview('gitGuiActionBarView', new GitGuiActionBarView());
            _this.div({
              id: 'options'
            }, function() {
              _this.div({
                "class": 'git-gui-option-item'
              }, function() {
                _this.span({
                  "class": 'icon',
                  id: 'repo'
                });
                return _this.select({
                  "class": 'input-select',
                  id: 'git-gui-project-list'
                });
              });
              _this.div({
                "class": 'git-gui-option-item'
              }, function() {
                _this.span({
                  "class": 'icon',
                  id: 'remotes'
                });
                return _this.select({
                  "class": 'input-select',
                  id: 'git-gui-remotes-list'
                });
              });
              return _this.div({
                "class": 'git-gui-option-item'
              }, function() {
                _this.span({
                  "class": 'icon',
                  id: 'branch'
                });
                return _this.select({
                  "class": 'input-select',
                  id: 'git-gui-branch-list'
                });
              });
            });
            _this.div({
              "class": 'git-gui-log',
              id: 'log'
            });
            return _this.subview('gitGuiStagingAreaView', new GitGuiStagingAreaView());
          });
        };
      })(this));
    };

    GitGuiView.prototype.initialize = function() {
      this.gitGuiActionView = new GitGuiActionView();
      this.gitGuiActionView.parentView = this;
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.gitGuiActionView,
        visible: false
      });
      this.watcher = chokidar.watch(atom.project.getPaths()[0], {
        ignored: /\.git*/
      }).on('change', (function(_this) {
        return function(path) {
          return _this.gitGuiStagingAreaView.updateStatus(path);
        };
      })(this));
      $(document).ready((function(_this) {
        return function() {
          var localGroup, remoteGroup;
          $('#git-gui-project-list').on('change', function() {
            _this.watcher.close();
            _this.watcher = chokidar.watch($('#git-gui-project-list').val(), {
              ignored: /\.git*/
            }).on('change', function(path) {
              return _this.gitGuiStagingAreaView.updateStatus(path);
            });
            _this.updateAll();
            return _this.selectedProject = $('#git-gui-project-list').val();
          });
          localGroup = "<optgroup id='git-gui-branch-list-branch' label='Branch'></optgroup>";
          remoteGroup = "<optgroup id='git-gui-branch-list-remote' label='Remote'></optgroup>";
          $('#git-gui-branch-list').append($(localGroup));
          $('#git-gui-branch-list').append($(remoteGroup));
          $('#git-gui-branch-list').on('change', function() {
            return _this.checkout();
          });
          return $('#log').on('scroll', function() {
            if ($('#log').scrollTop() + $('#log').innerHeight() >= $('#log')[0].scrollHeight) {
              return _this.gitGuiActionBarView.updateLog();
            }
          });
        };
      })(this));
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function(projectPaths) {
          return _this.updateProjects(projectPaths);
        };
      })(this)));
      this.subscriptions.add(this.gitGuiStagingAreaView.onDidUpdateStatus((function(_this) {
        return function() {
          return _this.gitGuiActionBarView.update();
        };
      })(this)));
      this.subscriptions.add(this.gitGuiActionView.onDidCommit((function(_this) {
        return function() {
          return _this.updateAll();
        };
      })(this)));
      return this.subscriptions.add(this.gitGuiActionView.onDidPush((function(_this) {
        return function() {
          return _this.updateAll();
        };
      })(this)));
    };

    GitGuiView.prototype.serialize = function() {};

    GitGuiView.prototype.destroy = function() {
      this.gitGuiActionBarView.destroy();
      this.gitGuiActionView.destroy();
      this.gitGuiStagingAreaView.destroy();
      this.gitGuiDiffView.destroy();
      this.subscriptions.dispose();
      return this.watcher.close();
    };

    GitGuiView.prototype.updateProjects = function(projectPaths) {
      var i, len, option, projectPath, ref2;
      $('#git-gui-project-list').find('option').remove().end();
      for (i = 0, len = projectPaths.length; i < len; i++) {
        projectPath = projectPaths[i];
        option = "<option value=" + projectPath + " data-repo='" + (path.join(projectPath, '.git')) + "'>" + (path.basename(projectPath)) + "</option>";
        $('#git-gui-project-list').append(option);
      }
      if (this.selectedProject && (ref2 = this.selectedProject, indexOf.call(atom.project.getPaths(), ref2) >= 0)) {
        return $('#git-gui-project-list').val(this.selectedProject);
      } else {
        $('#git-gui-project-list').prop('selectedIndex', 0);
        return this.selectedProject = $('#git-gui-project-list').val();
      }
    };

    GitGuiView.prototype.updateAll = function() {
      var pathToRepo;
      pathToRepo = path.join($('#git-gui-project-list').val(), '.git');
      this.gitGuiStagingAreaView.updateStatuses();
      this.updateBranches(pathToRepo);
      this.gitGuiConfigView.updateConfig(pathToRepo);
      return this.gitGuiActionView.gitGuiPushView.updateRemotes(pathToRepo);
    };

    GitGuiView.prototype.open = function() {
      if ($('.git-gui').hasClass('open')) {
        return;
      }
      this.updateProjects(atom.project.getPaths());
      this.updateAll();
      return $('.git-gui').addClass('open');
    };

    GitGuiView.prototype.close = function() {
      if (!$('.git-gui').hasClass('open')) {
        return;
      }
      return $('.git-gui').removeClass('open');
    };

    GitGuiView.prototype.isOpen = function() {
      if ($('.git-gui').hasClass('open')) {
        return true;
      }
      return false;
    };

    GitGuiView.prototype.updateBranches = function(pathToRepo) {
      return $(document).ready(function() {
        $('#git-gui-branch-list-branch').find('option').remove().end();
        $('#git-gui-branch-list-remote').find('option').remove().end();
        return Git.Repository.open(pathToRepo).then(function(repo) {
          return repo.getReferences(Git.Reference.TYPE.OID).then(function(refs) {
            var i, len, option, ref;
            for (i = 0, len = refs.length; i < len; i++) {
              ref = refs[i];
              if (ref.isTag()) {
                return;
              }
              option = "<option value='" + (ref.name()) + "'>" + (ref.shorthand()) + "</option>";
              if (ref.isBranch()) {
                $('#git-gui-branch-list-branch').append($(option));
              } else if (ref.isRemote()) {
                $('#git-gui-branch-list-remote').append($(option));
              }
              if (ref.isHead()) {
                this.currentRef = ref.name();
                $('#git-gui-branch-list').val(this.currentRef);
              }
            }
          });
        })["catch"](function(error) {
          return console.log(error);
        });
      });
    };

    GitGuiView.prototype.checkout = function() {
      var pathToRepo;
      pathToRepo = $('#git-gui-project-list').find(':selected').data('repo');
      return Git.Repository.open(pathToRepo).then((function(_this) {
        return function(repo) {
          return repo.getReference($('#git-gui-branch-list').val()).then(function(ref) {
            if (ref.isBranch()) {
              return _this.checkoutBranch(repo, ref);
            } else if (ref.isRemote()) {
              return _this.checkoutRemote(repo, ref);
            }
          });
        };
      })(this)).done((function(_this) {
        return function() {
          return _this.updateBranches(pathToRepo);
        };
      })(this));
    };

    GitGuiView.prototype.checkoutBranch = function(repo, ref) {
      var checkoutOptions;
      checkoutOptions = new Git.CheckoutOptions();
      return repo.checkoutBranch(ref, checkoutOptions).then(function() {
        return atom.notifications.addSuccess("Branch checkout successful:", {
          description: ref.shorthand()
        });
      })["catch"](function(error) {
        console.log(error);
        return atom.notifications.addError("Branch checkout unsuccessful:", {
          description: error.toString()
        });
      });
    };

    GitGuiView.prototype.checkoutRemote = function(repo, ref) {
      return Git.Commit.lookup(repo, ref.target()).then(function(commit) {
        var name;
        name = path.basename(ref.shorthand());
        return Git.Branch.create(repo, name, commit, false).then(function(branch) {
          return Git.Branch.setUpstream(branch, ref.shorthand()).then(function() {
            var checkoutOptions;
            checkoutOptions = new Git.CheckoutOptions();
            return repo.checkoutBranch(branch, checkoutOptions).then(function() {
              return atom.notifications.addSuccess("Branch checkout successful:", {
                description: ref.shorthand()
              });
            });
          });
        })["catch"](function(error) {
          console.log(error);
          return atom.notifications.addError("Branch checkout unsuccessful:", {
            description: error.toString()
          });
        });
      });
    };

    return GitGuiView;

  })(View);

  module.exports = GitGuiView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1ndWkvbGliL2dpdC1ndWktdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG1LQUFBO0lBQUE7Ozs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSOztFQUNWLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsT0FBWSxPQUFBLENBQVEsV0FBUixDQUFaLEVBQUMsVUFBRCxFQUFJOztFQUNKLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSwyQkFBUjs7RUFDdEIsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHVCQUFSOztFQUNuQixxQkFBQSxHQUF3QixPQUFBLENBQVEsNkJBQVI7O0VBQ3hCLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHFCQUFSOztFQUNqQixnQkFBQSxHQUFtQixPQUFBLENBQVEsdUJBQVI7O0VBQ25CLEdBQUEsR0FBTSxPQUFBLENBQVEsU0FBUjs7RUFFQTs7Ozs7Ozt5QkFDSixtQkFBQSxHQUFxQjs7eUJBQ3JCLHFCQUFBLEdBQXVCOzt5QkFDdkIsZ0JBQUEsR0FBa0I7O3lCQUNsQixjQUFBLEdBQWdCOzt5QkFDaEIsVUFBQSxHQUFZOztJQUVaLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFNBQVA7T0FBTCxFQUF1QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDckIsS0FBQyxDQUFBLE9BQUQsQ0FBUyxnQkFBVCxFQUErQixJQUFBLGNBQUEsQ0FBQSxDQUEvQjtVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGtCQUFQO1lBQTJCLEVBQUEsRUFBSSxVQUEvQjtXQUFMLEVBQWdELFNBQUE7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WCxDQUF1QixNQUF2QixFQUErQixHQUFHLENBQUMsU0FBSixDQUFBLENBQS9CLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQTtBQUNKLGdCQUFBO1lBQUEsZUFBQSxHQUFzQixJQUFBLEdBQUcsQ0FBQyxlQUFKLENBQUE7bUJBQ3RCLElBQUksQ0FBQyxjQUFMLENBQW9CLE1BQXBCLEVBQTRCLGVBQTVCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQTtxQkFDSixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLDZCQUE5QixFQUE2RDtnQkFBQyxXQUFBLEVBQWEsR0FBRyxDQUFDLFNBQUosQ0FBQSxDQUFkO2VBQTdEO1lBREksQ0FETjtVQUZJLENBRE47UUFESSxDQUROLENBUUEsRUFBQyxLQUFELEVBUkEsQ0FRTyxTQUFDLEtBQUQ7VUFDTCxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVo7aUJBQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QiwrQkFBNUIsRUFBNkQ7WUFBQyxXQUFBLEVBQWEsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFkO1dBQTdEO1FBRkssQ0FSUDtNQUZJLENBRE47SUFEYzs7OztLQS9LTzs7RUErTHpCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBMU1qQiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuY2hva2lkYXIgPSByZXF1aXJlICdjaG9raWRhcidcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVmlld30gPSByZXF1aXJlICdzcGFjZS1wZW4nXG5HaXRHdWlBY3Rpb25CYXJWaWV3ID0gcmVxdWlyZSAnLi9naXQtZ3VpLWFjdGlvbi1iYXItdmlldydcbkdpdEd1aUFjdGlvblZpZXcgPSByZXF1aXJlICcuL2dpdC1ndWktYWN0aW9uLXZpZXcnXG5HaXRHdWlTdGFnaW5nQXJlYVZpZXcgPSByZXF1aXJlICcuL2dpdC1ndWktc3RhZ2luZy1hcmVhLXZpZXcnXG5HaXRHdWlEaWZmVmlldyA9IHJlcXVpcmUgJy4vZ2l0LWd1aS1kaWZmLXZpZXcnXG5HaXRHdWlDb25maWdWaWV3ID0gcmVxdWlyZSAnLi9naXQtZ3VpLWNvbmZpZy12aWV3J1xuR2l0ID0gcmVxdWlyZSAnbm9kZWdpdCdcblxuY2xhc3MgR2l0R3VpVmlldyBleHRlbmRzIFZpZXdcbiAgZ2l0R3VpQWN0aW9uQmFyVmlldzogbnVsbFxuICBnaXRHdWlTdGFnaW5nQXJlYVZpZXc6IG51bGxcbiAgZ2l0R3VpQWN0aW9uVmlldzogbnVsbFxuICBnaXRHdWlEaWZmVmlldzogbnVsbFxuICBtb2RhbFBhbmVsOiBudWxsXG5cbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ2dpdC1ndWknLCA9PlxuICAgICAgQHN1YnZpZXcgJ2dpdEd1aURpZmZWaWV3JywgbmV3IEdpdEd1aURpZmZWaWV3KClcbiAgICAgIEBkaXYgY2xhc3M6ICdnaXQtZ3VpLXNldHRpbmdzJywgaWQ6ICdzZXR0aW5ncycsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdnaXQtZ3VpLXNldHRpbmdzLWNvbnRlbnQnLCA9PlxuICAgICAgICAgIEBzdWJ2aWV3ICdnaXRHdWlDb25maWdWaWV3JywgbmV3IEdpdEd1aUNvbmZpZ1ZpZXcoKVxuICAgICAgQGRpdiBjbGFzczogJ2dpdC1ndWktb3ZlcmxheScsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdhY3Rpb24tcHJvZ3Jlc3MnLCBpZDogJ2FjdGlvbi1wcm9ncmVzcy1pbmRpY2F0b3InLCA9PlxuICAgICAgICAgIEBzcGFuIGNsYXNzOiAnbG9hZGluZyBsb2FkaW5nLXNwaW5uZXItc21hbGwgaW5saW5lLWJsb2NrJ1xuICAgICAgICBAc3VidmlldyAnZ2l0R3VpQWN0aW9uQmFyVmlldycsIG5ldyBHaXRHdWlBY3Rpb25CYXJWaWV3KClcbiAgICAgICAgQGRpdiBpZDogJ29wdGlvbnMnLCA9PlxuICAgICAgICAgIEBkaXYgY2xhc3M6ICdnaXQtZ3VpLW9wdGlvbi1pdGVtJywgPT5cbiAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaWNvbicsIGlkOiAncmVwbydcbiAgICAgICAgICAgIEBzZWxlY3QgY2xhc3M6ICdpbnB1dC1zZWxlY3QnLCBpZDogJ2dpdC1ndWktcHJvamVjdC1saXN0J1xuICAgICAgICAgIEBkaXYgY2xhc3M6ICdnaXQtZ3VpLW9wdGlvbi1pdGVtJywgPT5cbiAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaWNvbicsIGlkOiAncmVtb3RlcydcbiAgICAgICAgICAgIEBzZWxlY3QgY2xhc3M6ICdpbnB1dC1zZWxlY3QnLCBpZDogJ2dpdC1ndWktcmVtb3Rlcy1saXN0J1xuICAgICAgICAgIEBkaXYgY2xhc3M6ICdnaXQtZ3VpLW9wdGlvbi1pdGVtJywgPT5cbiAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaWNvbicsIGlkOiAnYnJhbmNoJ1xuICAgICAgICAgICAgQHNlbGVjdCBjbGFzczogJ2lucHV0LXNlbGVjdCcsIGlkOiAnZ2l0LWd1aS1icmFuY2gtbGlzdCdcbiAgICAgICAgQGRpdiBjbGFzczogJ2dpdC1ndWktbG9nJywgaWQ6ICdsb2cnXG4gICAgICAgIEBzdWJ2aWV3ICdnaXRHdWlTdGFnaW5nQXJlYVZpZXcnLCBuZXcgR2l0R3VpU3RhZ2luZ0FyZWFWaWV3KClcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBnaXRHdWlBY3Rpb25WaWV3ID0gbmV3IEdpdEd1aUFjdGlvblZpZXcoKVxuICAgIEBnaXRHdWlBY3Rpb25WaWV3LnBhcmVudFZpZXcgPSB0aGlzXG4gICAgQG1vZGFsUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsXG4gICAgICBpdGVtOiBAZ2l0R3VpQWN0aW9uVmlldyxcbiAgICAgIHZpc2libGU6IGZhbHNlXG5cbiAgICBAd2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLCB7aWdub3JlZDogL1xcLmdpdCovfSApXG4gICAgLm9uICdjaGFuZ2UnLCAocGF0aCkgPT5cbiAgICAgIEBnaXRHdWlTdGFnaW5nQXJlYVZpZXcudXBkYXRlU3RhdHVzIHBhdGhcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5ICgpID0+XG4gICAgICAkKCcjZ2l0LWd1aS1wcm9qZWN0LWxpc3QnKS5vbiAnY2hhbmdlJywgKCkgPT5cbiAgICAgICAgQHdhdGNoZXIuY2xvc2UoKVxuICAgICAgICBAd2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKCQoJyNnaXQtZ3VpLXByb2plY3QtbGlzdCcpLnZhbCgpLCB7aWdub3JlZDogL1xcLmdpdCovfSApXG4gICAgICAgIC5vbiAnY2hhbmdlJywgKHBhdGgpID0+XG4gICAgICAgICAgQGdpdEd1aVN0YWdpbmdBcmVhVmlldy51cGRhdGVTdGF0dXMgcGF0aFxuXG4gICAgICAgIEB1cGRhdGVBbGwoKVxuICAgICAgICBAc2VsZWN0ZWRQcm9qZWN0ID0gJCgnI2dpdC1ndWktcHJvamVjdC1saXN0JykudmFsKClcblxuICAgICAgbG9jYWxHcm91cCA9IFwiPG9wdGdyb3VwIGlkPSdnaXQtZ3VpLWJyYW5jaC1saXN0LWJyYW5jaCcgbGFiZWw9J0JyYW5jaCc+PC9vcHRncm91cD5cIlxuICAgICAgcmVtb3RlR3JvdXAgPSBcIjxvcHRncm91cCBpZD0nZ2l0LWd1aS1icmFuY2gtbGlzdC1yZW1vdGUnIGxhYmVsPSdSZW1vdGUnPjwvb3B0Z3JvdXA+XCJcbiAgICAgICQoJyNnaXQtZ3VpLWJyYW5jaC1saXN0JykuYXBwZW5kICQobG9jYWxHcm91cClcbiAgICAgICQoJyNnaXQtZ3VpLWJyYW5jaC1saXN0JykuYXBwZW5kICQocmVtb3RlR3JvdXApXG5cbiAgICAgICQoJyNnaXQtZ3VpLWJyYW5jaC1saXN0Jykub24gJ2NoYW5nZScsICgpID0+XG4gICAgICAgIEBjaGVja291dCgpXG5cbiAgICAgICQoJyNsb2cnKS5vbiAnc2Nyb2xsJywgKCkgPT5cbiAgICAgICAgaWYoJCgnI2xvZycpLnNjcm9sbFRvcCgpICsgJCgnI2xvZycpLmlubmVySGVpZ2h0KCkgPj0gJCgnI2xvZycpWzBdLnNjcm9sbEhlaWdodClcbiAgICAgICAgICBAZ2l0R3VpQWN0aW9uQmFyVmlldy51cGRhdGVMb2coKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzIChwcm9qZWN0UGF0aHMpID0+XG4gICAgICBAdXBkYXRlUHJvamVjdHMocHJvamVjdFBhdGhzKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBnaXRHdWlTdGFnaW5nQXJlYVZpZXcub25EaWRVcGRhdGVTdGF0dXMgKCkgPT5cbiAgICAgIEBnaXRHdWlBY3Rpb25CYXJWaWV3LnVwZGF0ZSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGdpdEd1aUFjdGlvblZpZXcub25EaWRDb21taXQgKCkgPT5cbiAgICAgIEB1cGRhdGVBbGwoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBnaXRHdWlBY3Rpb25WaWV3Lm9uRGlkUHVzaCAoKSA9PlxuICAgICAgQHVwZGF0ZUFsbCgpXG5cbiAgc2VyaWFsaXplOiAtPlxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGdpdEd1aUFjdGlvbkJhclZpZXcuZGVzdHJveSgpXG4gICAgQGdpdEd1aUFjdGlvblZpZXcuZGVzdHJveSgpXG4gICAgQGdpdEd1aVN0YWdpbmdBcmVhVmlldy5kZXN0cm95KClcbiAgICBAZ2l0R3VpRGlmZlZpZXcuZGVzdHJveSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQHdhdGNoZXIuY2xvc2UoKVxuXG4gICMgVE9ETzoga2VlcCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvblxuICB1cGRhdGVQcm9qZWN0czogKHByb2plY3RQYXRocykgLT5cbiAgICAkKCcjZ2l0LWd1aS1wcm9qZWN0LWxpc3QnKS5maW5kKCdvcHRpb24nKS5yZW1vdmUoKS5lbmQoKVxuICAgIGZvciBwcm9qZWN0UGF0aCBpbiBwcm9qZWN0UGF0aHNcbiAgICAgIG9wdGlvbiA9IFwiPG9wdGlvbiB2YWx1ZT0je3Byb2plY3RQYXRofSBkYXRhLXJlcG89JyN7cGF0aC5qb2luIHByb2plY3RQYXRoLCAnLmdpdCd9Jz4je3BhdGguYmFzZW5hbWUgcHJvamVjdFBhdGh9PC9vcHRpb24+XCJcbiAgICAgICQoJyNnaXQtZ3VpLXByb2plY3QtbGlzdCcpLmFwcGVuZCBvcHRpb25cbiAgICBpZiBAc2VsZWN0ZWRQcm9qZWN0IGFuZCBAc2VsZWN0ZWRQcm9qZWN0IGluIGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gICAgICAkKCcjZ2l0LWd1aS1wcm9qZWN0LWxpc3QnKS52YWwoQHNlbGVjdGVkUHJvamVjdClcbiAgICBlbHNlXG4gICAgICAkKCcjZ2l0LWd1aS1wcm9qZWN0LWxpc3QnKS5wcm9wKCdzZWxlY3RlZEluZGV4JywgMClcbiAgICAgIEBzZWxlY3RlZFByb2plY3QgPSAkKCcjZ2l0LWd1aS1wcm9qZWN0LWxpc3QnKS52YWwoKVxuXG4gICMgVE9ETzogVGhpcyBpcyB0aGUgb25seSB0aW1lIHRoYXQgdGhlIHJlcG8gYW5kIGNvbmZpZyB2aWV3cyBhcmUgdXBkYXRlZCxcbiAgIyAgICAgICB0aGV5IG5lZWQgYSBtb3JlIGR5bmFtaWMgd2F5IG9mIHVwZGF0aW5nLlxuICB1cGRhdGVBbGw6IC0+XG4gICAgcGF0aFRvUmVwbyA9IHBhdGguam9pbiAkKCcjZ2l0LWd1aS1wcm9qZWN0LWxpc3QnKS52YWwoKSwgJy5naXQnXG4gICAgQGdpdEd1aVN0YWdpbmdBcmVhVmlldy51cGRhdGVTdGF0dXNlcygpXG4gICAgQHVwZGF0ZUJyYW5jaGVzKHBhdGhUb1JlcG8pXG4gICAgQGdpdEd1aUNvbmZpZ1ZpZXcudXBkYXRlQ29uZmlnKHBhdGhUb1JlcG8pXG4gICAgQGdpdEd1aUFjdGlvblZpZXcuZ2l0R3VpUHVzaFZpZXcudXBkYXRlUmVtb3RlcyhwYXRoVG9SZXBvKVxuXG4gIG9wZW46IC0+XG4gICAgaWYgJCgnLmdpdC1ndWknKS5oYXNDbGFzcyAnb3BlbidcbiAgICAgIHJldHVyblxuICAgIEB1cGRhdGVQcm9qZWN0cyBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgIEB1cGRhdGVBbGwoKVxuICAgICQoJy5naXQtZ3VpJykuYWRkQ2xhc3MgJ29wZW4nXG5cbiAgY2xvc2U6IC0+XG4gICAgaWYgISAkKCcuZ2l0LWd1aScpLmhhc0NsYXNzICdvcGVuJ1xuICAgICAgcmV0dXJuXG4gICAgJCgnLmdpdC1ndWknKS5yZW1vdmVDbGFzcyAnb3BlbidcblxuICBpc09wZW46IC0+XG4gICAgaWYgJCgnLmdpdC1ndWknKS5oYXNDbGFzcyAnb3BlbidcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgdXBkYXRlQnJhbmNoZXM6IChwYXRoVG9SZXBvKSAtPlxuICAgICQoZG9jdW1lbnQpLnJlYWR5ICgpIC0+XG4gICAgICAjIENsZWFyIHRoZSBgc2VsZWN0YCBtZW51XG4gICAgICAkKCcjZ2l0LWd1aS1icmFuY2gtbGlzdC1icmFuY2gnKS5maW5kKCdvcHRpb24nKS5yZW1vdmUoKS5lbmQoKVxuICAgICAgJCgnI2dpdC1ndWktYnJhbmNoLWxpc3QtcmVtb3RlJykuZmluZCgnb3B0aW9uJykucmVtb3ZlKCkuZW5kKClcbiAgICAgIEdpdC5SZXBvc2l0b3J5Lm9wZW4gcGF0aFRvUmVwb1xuICAgICAgLnRoZW4gKHJlcG8pIC0+XG4gICAgICAgICMgVXNlIGBUWVBFLk9JRGAgc28gdGhhdCB3aGF0ZXZlciBgSEVBRGAgcG9pbnRzIHRvIGlzIG5vdCBkdXBsaWNhdGVkIGluIHRoZSBicmFuY2ggbGlzdFxuICAgICAgICByZXBvLmdldFJlZmVyZW5jZXMoR2l0LlJlZmVyZW5jZS5UWVBFLk9JRClcbiAgICAgICAgLnRoZW4gKHJlZnMpIC0+XG4gICAgICAgICAgZm9yIHJlZiBpbiByZWZzXG4gICAgICAgICAgICBpZiByZWYuaXNUYWcoKVxuICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgb3B0aW9uID0gXCI8b3B0aW9uIHZhbHVlPScje3JlZi5uYW1lKCl9Jz4je3JlZi5zaG9ydGhhbmQoKX08L29wdGlvbj5cIlxuXG4gICAgICAgICAgICBpZiByZWYuaXNCcmFuY2goKVxuICAgICAgICAgICAgICAkKCcjZ2l0LWd1aS1icmFuY2gtbGlzdC1icmFuY2gnKS5hcHBlbmQgJChvcHRpb24pXG4gICAgICAgICAgICBlbHNlIGlmIHJlZi5pc1JlbW90ZSgpXG4gICAgICAgICAgICAgICQoJyNnaXQtZ3VpLWJyYW5jaC1saXN0LXJlbW90ZScpLmFwcGVuZCAkKG9wdGlvbilcblxuICAgICAgICAgICAgaWYgcmVmLmlzSGVhZCgpXG4gICAgICAgICAgICAgIEBjdXJyZW50UmVmID0gcmVmLm5hbWUoKVxuICAgICAgICAgICAgICAkKCcjZ2l0LWd1aS1icmFuY2gtbGlzdCcpLnZhbChAY3VycmVudFJlZilcbiAgICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICAgIGNvbnNvbGUubG9nIGVycm9yXG5cbiAgY2hlY2tvdXQ6IC0+XG4gICAgcGF0aFRvUmVwbyA9ICQoJyNnaXQtZ3VpLXByb2plY3QtbGlzdCcpLmZpbmQoJzpzZWxlY3RlZCcpLmRhdGEoJ3JlcG8nKVxuICAgIEdpdC5SZXBvc2l0b3J5Lm9wZW4gcGF0aFRvUmVwb1xuICAgIC50aGVuIChyZXBvKSA9PlxuICAgICAgcmVwby5nZXRSZWZlcmVuY2UgJCgnI2dpdC1ndWktYnJhbmNoLWxpc3QnKS52YWwoKVxuICAgICAgLnRoZW4gKHJlZikgPT5cbiAgICAgICAgaWYgcmVmLmlzQnJhbmNoKClcbiAgICAgICAgICBAY2hlY2tvdXRCcmFuY2ggcmVwbywgcmVmXG4gICAgICAgIGVsc2UgaWYgcmVmLmlzUmVtb3RlKClcbiAgICAgICAgICBAY2hlY2tvdXRSZW1vdGUgcmVwbywgcmVmXG4gICAgLmRvbmUgKCkgPT5cbiAgICAgICMgRW5zdXJlIGFueSBjaGFuZ2VzIGFyZSByZWZsZWN0ZWQgaW4gdGhlIGJyYW5jaCBsaXN0XG4gICAgICBAdXBkYXRlQnJhbmNoZXMgcGF0aFRvUmVwb1xuXG4gIGNoZWNrb3V0QnJhbmNoOiAocmVwbywgcmVmKSAtPlxuICAgIGNoZWNrb3V0T3B0aW9ucyA9IG5ldyBHaXQuQ2hlY2tvdXRPcHRpb25zKClcbiAgICByZXBvLmNoZWNrb3V0QnJhbmNoIHJlZiwgY2hlY2tvdXRPcHRpb25zXG4gICAgLnRoZW4gKCkgLT5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzIFwiQnJhbmNoIGNoZWNrb3V0IHN1Y2Nlc3NmdWw6XCIsIHtkZXNjcmlwdGlvbjogcmVmLnNob3J0aGFuZCgpIH1cbiAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgY29uc29sZS5sb2cgZXJyb3JcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkJyYW5jaCBjaGVja291dCB1bnN1Y2Nlc3NmdWw6XCIsIHtkZXNjcmlwdGlvbjogZXJyb3IudG9TdHJpbmcoKSB9XG5cbiAgY2hlY2tvdXRSZW1vdGU6IChyZXBvLCByZWYpIC0+XG4gICAgR2l0LkNvbW1pdC5sb29rdXAgcmVwbywgcmVmLnRhcmdldCgpXG4gICAgLnRoZW4gKGNvbW1pdCkgLT5cbiAgICAgIG5hbWUgPSBwYXRoLmJhc2VuYW1lIHJlZi5zaG9ydGhhbmQoKVxuICAgICAgR2l0LkJyYW5jaC5jcmVhdGUgcmVwbywgbmFtZSwgY29tbWl0LCBmYWxzZVxuICAgICAgLnRoZW4gKGJyYW5jaCkgLT5cbiAgICAgICAgR2l0LkJyYW5jaC5zZXRVcHN0cmVhbSBicmFuY2gsIHJlZi5zaG9ydGhhbmQoKVxuICAgICAgICAudGhlbiAoKSAtPlxuICAgICAgICAgIGNoZWNrb3V0T3B0aW9ucyA9IG5ldyBHaXQuQ2hlY2tvdXRPcHRpb25zKClcbiAgICAgICAgICByZXBvLmNoZWNrb3V0QnJhbmNoIGJyYW5jaCwgY2hlY2tvdXRPcHRpb25zXG4gICAgICAgICAgLnRoZW4gKCkgLT5cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzIFwiQnJhbmNoIGNoZWNrb3V0IHN1Y2Nlc3NmdWw6XCIsIHtkZXNjcmlwdGlvbjogcmVmLnNob3J0aGFuZCgpIH1cbiAgICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICAgIGNvbnNvbGUubG9nIGVycm9yXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkJyYW5jaCBjaGVja291dCB1bnN1Y2Nlc3NmdWw6XCIsIHtkZXNjcmlwdGlvbjogZXJyb3IudG9TdHJpbmcoKSB9XG5cbm1vZHVsZS5leHBvcnRzID0gR2l0R3VpVmlld1xuIl19
