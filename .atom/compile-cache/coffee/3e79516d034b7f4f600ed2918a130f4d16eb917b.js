(function() {
  var $$, ListView, OutputViewManager, RemoteBranchListView, SelectListView, _pull, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  _pull = require('../models/_pull');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  RemoteBranchListView = require('./remote-branch-list-view');

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data1, arg1) {
      var ref1;
      this.repo = repo;
      this.data = data1;
      ref1 = arg1 != null ? arg1 : {}, this.mode = ref1.mode, this.tag = ref1.tag, this.extraArgs = ref1.extraArgs;
      ListView.__super__.initialize.apply(this, arguments);
      if (this.tag == null) {
        this.tag = '';
      }
      if (this.extraArgs == null) {
        this.extraArgs = [];
      }
      this.show();
      this.parseData();
      return this.result = new Promise((function(_this) {
        return function(resolve1, reject1) {
          _this.resolve = resolve1;
          _this.reject = reject1;
        };
      })(this));
    };

    ListView.prototype.parseData = function() {
      var items, remotes;
      items = this.data.split("\n");
      remotes = items.filter(function(item) {
        return item !== '';
      }).map(function(item) {
        return {
          name: item
        };
      });
      if (remotes.length === 1) {
        return this.confirmed(remotes[0]);
      } else {
        this.setItems(remotes);
        return this.focusFilterEditor();
      }
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(arg1) {
      var name;
      name = arg1.name;
      return $$(function() {
        return this.li(name);
      });
    };

    ListView.prototype.pull = function(remoteName) {
      if (atom.config.get('git-plus.remoteInteractions.promptForBranch')) {
        return git.cmd(['branch', '--no-color', '-r'], {
          cwd: this.repo.getWorkingDirectory()
        }).then((function(_this) {
          return function(data) {
            return new Promise(function(resolve, reject) {
              return new RemoteBranchListView(data, remoteName, function(arg1) {
                var args, branchName, name, startMessage, view;
                name = arg1.name;
                branchName = name.substring(name.indexOf('/') + 1);
                view = OutputViewManager.create();
                startMessage = notifier.addInfo("Pulling...", {
                  dismissable: true
                });
                args = ['pull'].concat(_this.extraArgs, remoteName, branchName).filter(function(arg) {
                  return arg !== '';
                });
                return git.cmd(args, {
                  cwd: _this.repo.getWorkingDirectory()
                }, {
                  color: true
                }).then(function(data) {
                  resolve(branchName);
                  view.setContent(data).finish();
                  startMessage.dismiss();
                  return git.refresh(_this.repo);
                })["catch"](function(error) {
                  reject();
                  view.setContent(error).finish();
                  return startMessage.dismiss();
                });
              });
            });
          };
        })(this));
      } else {
        return _pull(this.repo, {
          extraArgs: this.extraArgs
        });
      }
    };

    ListView.prototype.confirmed = function(arg1) {
      var name, pullBeforePush;
      name = arg1.name;
      if (this.mode === 'pull') {
        this.pull(name);
      } else if (this.mode === 'fetch-prune') {
        this.mode = 'fetch';
        this.execute(name, '--prune');
      } else if (this.mode === 'push') {
        pullBeforePush = atom.config.get('git-plus.remoteInteractions.pullBeforePush');
        if (pullBeforePush && atom.config.get('git-plus.remoteInteractions.pullRebase')) {
          this.extraArgs = '--rebase';
        }
        if (pullBeforePush) {
          this.pull(name).then((function(_this) {
            return function(branch) {
              return _this.execute(name, null, branch);
            };
          })(this));
        } else {
          this.execute(name);
        }
      } else if (this.mode === 'push -u') {
        this.pushAndSetUpstream(name);
      } else {
        this.execute(name);
      }
      return this.cancel();
    };

    ListView.prototype.execute = function(remote, extraArgs, branch) {
      var args, message, startMessage, view;
      if (remote == null) {
        remote = '';
      }
      if (extraArgs == null) {
        extraArgs = '';
      }
      if (atom.config.get('git-plus.remoteInteractions.promptForBranch')) {
        if (branch != null) {
          view = OutputViewManager.create();
          args = [this.mode];
          if (extraArgs.length > 0) {
            args.push(extraArgs);
          }
          args = args.concat([remote, branch]);
          message = (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
          startMessage = notifier.addInfo(message, {
            dismissable: true
          });
          return git.cmd(args, {
            cwd: this.repo.getWorkingDirectory()
          }, {
            color: true
          }).then((function(_this) {
            return function(data) {
              if (data !== '') {
                view.setContent(data).finish();
              }
              startMessage.dismiss();
              return git.refresh(_this.repo);
            };
          })(this))["catch"]((function(_this) {
            return function(data) {
              if (data !== '') {
                view.setContent(data).finish();
              }
              return startMessage.dismiss();
            };
          })(this));
        } else {
          return git.cmd(['branch', '--no-color', '-r'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(data) {
              return new RemoteBranchListView(data, remote, function(arg1) {
                var branchName, name;
                name = arg1.name;
                branchName = name.substring(name.indexOf('/') + 1);
                view = OutputViewManager.create();
                startMessage = notifier.addInfo("Pushing...", {
                  dismissable: true
                });
                args = ['push'].concat(extraArgs, remote, branchName).filter(function(arg) {
                  return arg !== '';
                });
                return git.cmd(args, {
                  cwd: _this.repo.getWorkingDirectory()
                }, {
                  color: true
                }).then(function(data) {
                  view.setContent(data).finish();
                  startMessage.dismiss();
                  return git.refresh(_this.repo);
                })["catch"](function(error) {
                  view.setContent(error).finish();
                  return startMessage.dismiss();
                });
              });
            };
          })(this));
        }
      } else {
        view = OutputViewManager.create();
        args = [this.mode];
        if (extraArgs.length > 0) {
          args.push(extraArgs);
        }
        args = args.concat([remote, this.tag]).filter(function(arg) {
          return arg !== '';
        });
        message = (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
        startMessage = notifier.addInfo(message, {
          dismissable: true
        });
        return git.cmd(args, {
          cwd: this.repo.getWorkingDirectory()
        }, {
          color: true
        }).then((function(_this) {
          return function(data) {
            if (data !== '') {
              view.setContent(data).finish();
            }
            startMessage.dismiss();
            return git.refresh(_this.repo);
          };
        })(this))["catch"]((function(_this) {
          return function(data) {
            if (data !== '') {
              view.setContent(data).finish();
            }
            return startMessage.dismiss();
          };
        })(this));
      }
    };

    ListView.prototype.pushAndSetUpstream = function(remote) {
      var args, message, startMessage, view;
      if (remote == null) {
        remote = '';
      }
      view = OutputViewManager.create();
      args = ['push', '-u', remote, 'HEAD'].filter(function(arg) {
        return arg !== '';
      });
      message = "Pushing...";
      startMessage = notifier.addInfo(message, {
        dismissable: true
      });
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }, {
        color: true
      }).then(function(data) {
        if (data !== '') {
          view.setContent(data).finish();
        }
        return startMessage.dismiss();
      })["catch"]((function(_this) {
        return function(data) {
          if (data !== '') {
            view.setContent(data).finish();
          }
          return startMessage.dismiss();
        };
      })(this));
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9yZW1vdGUtbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsZ0dBQUE7SUFBQTs7O0VBQUEsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUVMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixLQUFBLEdBQVEsT0FBQSxDQUFRLGlCQUFSOztFQUNSLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVI7O0VBQ3BCLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSwyQkFBUjs7RUFFdkIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozt1QkFDSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsS0FBUixFQUFlLElBQWY7QUFDVixVQUFBO01BRFcsSUFBQyxDQUFBLE9BQUQ7TUFBTyxJQUFDLENBQUEsT0FBRDs0QkFBTyxPQUEwQixJQUF6QixJQUFDLENBQUEsWUFBQSxNQUFNLElBQUMsQ0FBQSxXQUFBLEtBQUssSUFBQyxDQUFBLGlCQUFBO01BQ3hDLDBDQUFBLFNBQUE7O1FBQ0EsSUFBQyxDQUFBLE1BQU87OztRQUNSLElBQUMsQ0FBQSxZQUFhOztNQUNkLElBQUMsQ0FBQSxJQUFELENBQUE7TUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsUUFBRCxFQUFXLE9BQVg7VUFBQyxLQUFDLENBQUEsVUFBRDtVQUFVLEtBQUMsQ0FBQSxTQUFEO1FBQVg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVI7SUFOSjs7dUJBUVosU0FBQSxHQUFXLFNBQUE7QUFDVCxV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QTtNQUNQLElBQUEsR0FBTyxDQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsTUFBZixFQUF1QixNQUF2QixDQUE4QixDQUFDLE1BQS9CLENBQXNDLFNBQUMsR0FBRDtlQUFTLEdBQUEsS0FBUztNQUFsQixDQUF0QztNQUNQLE9BQUEsR0FBVTtNQUNWLFlBQUEsR0FBZSxRQUFRLENBQUMsT0FBVCxDQUFpQixPQUFqQixFQUEwQjtRQUFBLFdBQUEsRUFBYSxJQUFiO09BQTFCO2FBQ2YsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7UUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7T0FBZCxFQUFnRDtRQUFDLEtBQUEsRUFBTyxJQUFSO09BQWhELENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO1FBQ0osSUFBRyxJQUFBLEtBQVUsRUFBYjtVQUNFLElBQUksQ0FBQyxVQUFMLENBQWdCLElBQWhCLENBQXFCLENBQUMsTUFBdEIsQ0FBQSxFQURGOztlQUVBLFlBQVksQ0FBQyxPQUFiLENBQUE7TUFISSxDQUROLENBS0EsRUFBQyxLQUFELEVBTEEsQ0FLTyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtVQUNMLElBQUcsSUFBQSxLQUFVLEVBQWI7WUFDRSxJQUFJLENBQUMsVUFBTCxDQUFnQixJQUFoQixDQUFxQixDQUFDLE1BQXRCLENBQUEsRUFERjs7aUJBRUEsWUFBWSxDQUFDLE9BQWIsQ0FBQTtRQUhLO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxQO0lBTGtCOzs7O0tBbElDO0FBVHZCIiwic291cmNlc0NvbnRlbnQiOlsieyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuX3B1bGwgPSByZXF1aXJlICcuLi9tb2RlbHMvX3B1bGwnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuT3V0cHV0Vmlld01hbmFnZXIgPSByZXF1aXJlICcuLi9vdXRwdXQtdmlldy1tYW5hZ2VyJ1xuUmVtb3RlQnJhbmNoTGlzdFZpZXcgPSByZXF1aXJlICcuL3JlbW90ZS1icmFuY2gtbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChAcmVwbywgQGRhdGEsIHtAbW9kZSwgQHRhZywgQGV4dHJhQXJnc309e30pIC0+XG4gICAgc3VwZXJcbiAgICBAdGFnID89ICcnXG4gICAgQGV4dHJhQXJncyA/PSBbXVxuICAgIEBzaG93KClcbiAgICBAcGFyc2VEYXRhKClcbiAgICBAcmVzdWx0ID0gbmV3IFByb21pc2UgKEByZXNvbHZlLCBAcmVqZWN0KSA9PlxuXG4gIHBhcnNlRGF0YTogLT5cbiAgICBpdGVtcyA9IEBkYXRhLnNwbGl0KFwiXFxuXCIpXG4gICAgcmVtb3RlcyA9IGl0ZW1zLmZpbHRlcigoaXRlbSkgLT4gaXRlbSBpc250ICcnKS5tYXAgKGl0ZW0pIC0+IHsgbmFtZTogaXRlbSB9XG4gICAgaWYgcmVtb3Rlcy5sZW5ndGggaXMgMVxuICAgICAgQGNvbmZpcm1lZCByZW1vdGVzWzBdXG4gICAgZWxzZVxuICAgICAgQHNldEl0ZW1zIHJlbW90ZXNcbiAgICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAnbmFtZSdcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPiBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoe25hbWV9KSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgbmFtZVxuXG4gIHB1bGw6IChyZW1vdGVOYW1lKSAtPlxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLnByb21wdEZvckJyYW5jaCcpXG4gICAgICBnaXQuY21kKFsnYnJhbmNoJywgJy0tbm8tY29sb3InLCAnLXInXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgICAgICBuZXcgUmVtb3RlQnJhbmNoTGlzdFZpZXcgZGF0YSwgcmVtb3RlTmFtZSwgKHtuYW1lfSkgPT5cbiAgICAgICAgICAgIGJyYW5jaE5hbWUgPSBuYW1lLnN1YnN0cmluZyhuYW1lLmluZGV4T2YoJy8nKSArIDEpXG4gICAgICAgICAgICB2aWV3ID0gT3V0cHV0Vmlld01hbmFnZXIuY3JlYXRlKClcbiAgICAgICAgICAgIHN0YXJ0TWVzc2FnZSA9IG5vdGlmaWVyLmFkZEluZm8gXCJQdWxsaW5nLi4uXCIsIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgICBhcmdzID0gWydwdWxsJ10uY29uY2F0KEBleHRyYUFyZ3MsIHJlbW90ZU5hbWUsIGJyYW5jaE5hbWUpLmZpbHRlcigoYXJnKSAtPiBhcmcgaXNudCAnJylcbiAgICAgICAgICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgICAgICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgICAgICAgcmVzb2x2ZSBicmFuY2hOYW1lXG4gICAgICAgICAgICAgIHZpZXcuc2V0Q29udGVudChkYXRhKS5maW5pc2goKVxuICAgICAgICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgICAgICAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG4gICAgICAgICAgICAuY2F0Y2ggKGVycm9yKSA9PlxuICAgICAgICAgICAgICByZWplY3QoKVxuICAgICAgICAgICAgICB2aWV3LnNldENvbnRlbnQoZXJyb3IpLmZpbmlzaCgpXG4gICAgICAgICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICBlbHNlXG4gICAgICBfcHVsbCBAcmVwbywgZXh0cmFBcmdzOiBAZXh0cmFBcmdzXG5cbiAgY29uZmlybWVkOiAoe25hbWV9KSAtPlxuICAgIGlmIEBtb2RlIGlzICdwdWxsJ1xuICAgICAgQHB1bGwgbmFtZVxuICAgIGVsc2UgaWYgQG1vZGUgaXMgJ2ZldGNoLXBydW5lJ1xuICAgICAgQG1vZGUgPSAnZmV0Y2gnXG4gICAgICBAZXhlY3V0ZSBuYW1lLCAnLS1wcnVuZSdcbiAgICBlbHNlIGlmIEBtb2RlIGlzICdwdXNoJ1xuICAgICAgcHVsbEJlZm9yZVB1c2ggPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnJlbW90ZUludGVyYWN0aW9ucy5wdWxsQmVmb3JlUHVzaCcpXG4gICAgICBAZXh0cmFBcmdzID0gJy0tcmViYXNlJyBpZiBwdWxsQmVmb3JlUHVzaCBhbmQgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5yZW1vdGVJbnRlcmFjdGlvbnMucHVsbFJlYmFzZScpXG4gICAgICBpZiBwdWxsQmVmb3JlUHVzaFxuICAgICAgICBAcHVsbChuYW1lKS50aGVuIChicmFuY2gpID0+IEBleGVjdXRlIG5hbWUsIG51bGwsIGJyYW5jaFxuICAgICAgZWxzZVxuICAgICAgICBAZXhlY3V0ZSBuYW1lXG4gICAgZWxzZSBpZiBAbW9kZSBpcyAncHVzaCAtdSdcbiAgICAgIEBwdXNoQW5kU2V0VXBzdHJlYW0gbmFtZVxuICAgIGVsc2VcbiAgICAgIEBleGVjdXRlIG5hbWVcbiAgICBAY2FuY2VsKClcblxuICBleGVjdXRlOiAocmVtb3RlPScnLCBleHRyYUFyZ3M9JycsIGJyYW5jaCkgLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnJlbW90ZUludGVyYWN0aW9ucy5wcm9tcHRGb3JCcmFuY2gnKVxuICAgICAgaWYgYnJhbmNoP1xuICAgICAgICB2aWV3ID0gT3V0cHV0Vmlld01hbmFnZXIuY3JlYXRlKClcbiAgICAgICAgYXJncyA9IFtAbW9kZV1cbiAgICAgICAgaWYgZXh0cmFBcmdzLmxlbmd0aCA+IDBcbiAgICAgICAgICBhcmdzLnB1c2ggZXh0cmFBcmdzXG4gICAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChbcmVtb3RlLCBicmFuY2hdKVxuICAgICAgICBtZXNzYWdlID0gXCIje0Btb2RlWzBdLnRvVXBwZXJDYXNlKCkrQG1vZGUuc3Vic3RyaW5nKDEpfWluZy4uLlwiXG4gICAgICAgIHN0YXJ0TWVzc2FnZSA9IG5vdGlmaWVyLmFkZEluZm8gbWVzc2FnZSwgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAgICAgLnRoZW4gKGRhdGEpID0+XG4gICAgICAgICAgaWYgZGF0YSBpc250ICcnXG4gICAgICAgICAgICB2aWV3LnNldENvbnRlbnQoZGF0YSkuZmluaXNoKClcbiAgICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiAgICAgICAgLmNhdGNoIChkYXRhKSA9PlxuICAgICAgICAgIGlmIGRhdGEgaXNudCAnJ1xuICAgICAgICAgICAgdmlldy5zZXRDb250ZW50KGRhdGEpLmZpbmlzaCgpXG4gICAgICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgICAgZWxzZVxuICAgICAgICBnaXQuY21kKFsnYnJhbmNoJywgJy0tbm8tY29sb3InLCAnLXInXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICAgIG5ldyBSZW1vdGVCcmFuY2hMaXN0VmlldyBkYXRhLCByZW1vdGUsICh7bmFtZX0pID0+XG4gICAgICAgICAgICBicmFuY2hOYW1lID0gbmFtZS5zdWJzdHJpbmcobmFtZS5pbmRleE9mKCcvJykgKyAxKVxuICAgICAgICAgICAgdmlldyA9IE91dHB1dFZpZXdNYW5hZ2VyLmNyZWF0ZSgpXG4gICAgICAgICAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIFwiUHVzaGluZy4uLlwiLCBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgICAgYXJncyA9IFsncHVzaCddLmNvbmNhdChleHRyYUFyZ3MsIHJlbW90ZSwgYnJhbmNoTmFtZSkuZmlsdGVyKChhcmcpIC0+IGFyZyBpc250ICcnKVxuICAgICAgICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAgICAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICAgICAgICB2aWV3LnNldENvbnRlbnQoZGF0YSkuZmluaXNoKClcbiAgICAgICAgICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgICAgICAgICAgICBnaXQucmVmcmVzaCBAcmVwb1xuICAgICAgICAgICAgLmNhdGNoIChlcnJvcikgPT5cbiAgICAgICAgICAgICAgdmlldy5zZXRDb250ZW50KGVycm9yKS5maW5pc2goKVxuICAgICAgICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgZWxzZVxuICAgICAgdmlldyA9IE91dHB1dFZpZXdNYW5hZ2VyLmNyZWF0ZSgpXG4gICAgICBhcmdzID0gW0Btb2RlXVxuICAgICAgaWYgZXh0cmFBcmdzLmxlbmd0aCA+IDBcbiAgICAgICAgYXJncy5wdXNoIGV4dHJhQXJnc1xuICAgICAgYXJncyA9IGFyZ3MuY29uY2F0KFtyZW1vdGUsIEB0YWddKS5maWx0ZXIoKGFyZykgLT4gYXJnIGlzbnQgJycpXG4gICAgICBtZXNzYWdlID0gXCIje0Btb2RlWzBdLnRvVXBwZXJDYXNlKCkrQG1vZGUuc3Vic3RyaW5nKDEpfWluZy4uLlwiXG4gICAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIG1lc3NhZ2UsIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpLCB7Y29sb3I6IHRydWV9KVxuICAgICAgLnRoZW4gKGRhdGEpID0+XG4gICAgICAgIGlmIGRhdGEgaXNudCAnJ1xuICAgICAgICAgIHZpZXcuc2V0Q29udGVudChkYXRhKS5maW5pc2goKVxuICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG4gICAgICAuY2F0Y2ggKGRhdGEpID0+XG4gICAgICAgIGlmIGRhdGEgaXNudCAnJ1xuICAgICAgICAgIHZpZXcuc2V0Q29udGVudChkYXRhKS5maW5pc2goKVxuICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG5cbiAgcHVzaEFuZFNldFVwc3RyZWFtOiAocmVtb3RlPScnKSAtPlxuICAgIHZpZXcgPSBPdXRwdXRWaWV3TWFuYWdlci5jcmVhdGUoKVxuICAgIGFyZ3MgPSBbJ3B1c2gnLCAnLXUnLCByZW1vdGUsICdIRUFEJ10uZmlsdGVyKChhcmcpIC0+IGFyZyBpc250ICcnKVxuICAgIG1lc3NhZ2UgPSBcIlB1c2hpbmcuLi5cIlxuICAgIHN0YXJ0TWVzc2FnZSA9IG5vdGlmaWVyLmFkZEluZm8gbWVzc2FnZSwgZGlzbWlzc2FibGU6IHRydWVcbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpLCB7Y29sb3I6IHRydWV9KVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgaWYgZGF0YSBpc250ICcnXG4gICAgICAgIHZpZXcuc2V0Q29udGVudChkYXRhKS5maW5pc2goKVxuICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgIC5jYXRjaCAoZGF0YSkgPT5cbiAgICAgIGlmIGRhdGEgaXNudCAnJ1xuICAgICAgICB2aWV3LnNldENvbnRlbnQoZGF0YSkuZmluaXNoKClcbiAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiJdfQ==
