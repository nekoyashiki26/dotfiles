(function() {
  var $, Git, GitGuiActionBarView, View, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Git = require('nodegit');

  ref1 = require('space-pen'), $ = ref1.$, View = ref1.View;

  GitGuiActionBarView = (function(superClass) {
    extend(GitGuiActionBarView, superClass);

    function GitGuiActionBarView() {
      return GitGuiActionBarView.__super__.constructor.apply(this, arguments);
    }

    GitGuiActionBarView.prototype.startIndex = 0;

    GitGuiActionBarView.prototype.endIndex = 10;

    GitGuiActionBarView.content = function() {
      return this.div({
        "class": 'git-gui-action-bar'
      }, (function(_this) {
        return function() {
          return _this.ul({
            "class": 'list-group git-gui-action-bar-list'
          }, function() {
            _this.li({
              "class": 'list-item'
            }, function() {
              return _this.a({
                "class": 'icon',
                id: 'commit-action'
              });
            });
            _this.li({
              "class": 'list-item'
            }, function() {
              return _this.a({
                "class": 'icon',
                id: 'push-action'
              });
            });
            _this.li({
              "class": 'list-item'
            }, function() {
              return _this.a({
                "class": 'icon',
                id: 'pull-action'
              });
            });
            _this.li({
              "class": 'list-item'
            }, function() {
              return _this.a({
                "class": 'icon',
                id: 'log-action'
              });
            });
            return _this.li({
              "class": 'list-item'
            }, function() {
              return _this.a({
                "class": 'icon',
                id: 'settings-action'
              });
            });
          });
        };
      })(this));
    };

    GitGuiActionBarView.prototype.initialize = function() {
      return $(document).ready((function(_this) {
        return function() {
          $('#log-action').addClass('available');
          $('#settings-action').addClass('available');
          $('body').on('mouseenter', '#push-action', function() {
            $('body').on('keydown', function(e) {
              if (e.which === 16) {
                if (!$('#push-action').hasClass('force')) {
                  return $('#push-action').addClass('force');
                }
              }
            });
            return $('body').on('keyup', function(e) {
              if (e.which === 16) {
                if ($('#push-action').hasClass('force')) {
                  return $('#push-action').removeClass('force');
                }
              }
            });
          });
          $('body').on('mouseleave', '#push-action', function() {
            if ($('#push-action').hasClass('force')) {
              $('#push-action').removeClass('force');
            }
            $('body').off('keydown');
            return $('body').off('keyup');
          });
          $('body').on('click', '#commit-action', function() {
            $('atom-workspace-axis.horizontal').toggleClass('blur');
            $('#action-view').parent().show();
            $('#action-view').addClass('open');
            return _this.parentView.gitGuiActionView.openCommitAction();
          });
          $('body').on('click', '#push-action', function() {
            if ($('#push-action').hasClass('force')) {
              return atom.confirm({
                message: "Force push?",
                detailedMessage: "This will overwrite changes to the remote.",
                buttons: {
                  Ok: function() {
                    return _this.parentView.gitGuiActionView.openPushAction(true);
                  },
                  Cancel: function() {}
                }
              });
            } else {
              return _this.parentView.gitGuiActionView.openPushAction(false);
            }
          });
          $('body').on('click', '#pull-action', function() {
            $('atom-workspace-axis.horizontal').toggleClass('blur');
            $('#action-view').parent().show();
            return $('#action-view').addClass('open');
          });
          $('body').on('click', '#log-action', function() {
            if ($('#log').hasClass('open')) {
              $('.git-gui-staging-area').removeClass('fade-and-blur');
              $('#settings-action').addClass('available');
              $('#log').removeClass('open');
              $('#log').empty();
              _this.startIndex = 0;
              return _this.endIndex = 10;
            } else {
              _this.updateLog();
              $('.git-gui-staging-area').addClass('fade-and-blur');
              $('#settings-action').removeClass('available');
              return $('#log').addClass('open');
            }
          });
          return $('body').on('click', '#settings-action', function() {
            if ($('#settings').hasClass('open')) {
              $('#settings').removeClass('open');
              $('#log-action').addClass('available');
            } else {
              $('#settings').addClass('open');
              $('#log-action').removeClass('available');
            }
            return $('.git-gui-staging-area').toggleClass('fade-and-blur');
          });
        };
      })(this));
    };

    GitGuiActionBarView.prototype.serialize = function() {};

    GitGuiActionBarView.prototype.destroy = function() {};

    GitGuiActionBarView.prototype.update = function() {
      var pathToRepo;
      pathToRepo = $('#git-gui-project-list').find(':selected').data('repo');
      return Git.Repository.open(pathToRepo).then((function(_this) {
        return function(repo) {
          _this.updateCommitAction(repo);
          return _this.updatePushAction(repo);
        };
      })(this))["catch"](function(error) {
        atom.notifications.addError("" + error);
        return console.log(error);
      });
    };

    GitGuiActionBarView.prototype.updateCommitAction = function(repo) {
      var statusOptions;
      statusOptions = new Git.StatusOptions();
      return Git.StatusList.create(repo, statusOptions).then(function(statusList) {
        return (function() {
          var entry, i, j, ref2, status;
          $('#commit-action').removeClass('available');
          for (i = j = 0, ref2 = statusList.entrycount(); 0 <= ref2 ? j < ref2 : j > ref2; i = 0 <= ref2 ? ++j : --j) {
            entry = Git.Status.byIndex(statusList, i);
            status = entry.status();
            switch (status) {
              case Git.Status.STATUS.INDEX_NEW:
              case Git.Status.STATUS.INDEX_MODIFIED:
              case Git.Status.STATUS.INDEX_NEW + Git.Status.STATUS.INDEX_MODIFIED:
              case Git.Status.STATUS.INDEX_DELETED:
              case Git.Status.STATUS.INDEX_RENAMED:
              case Git.Status.STATUS.INDEX_MODIFIED + Git.Status.STATUS.WT_MODIFIED:
                $('#commit-action').addClass('available');
                return;
            }
          }
        })();
      })["catch"](function(error) {
        atom.notifications.addError("" + error);
        return console.log(error);
      });
    };

    GitGuiActionBarView.prototype.updatePushAction = function(repo) {
      if (repo.isEmpty()) {
        return;
      }
      return Git.Remote.list(repo).then(function(remotes) {
        if (remotes.length !== 0) {
          return repo.getCurrentBranch().then(function(ref) {
            return Git.Reference.nameToId(repo, ref.name()).then(function(local) {
              return Git.Reference.nameToId(repo, "refs/remotes/origin/" + (ref.shorthand())).then(function(upstream) {
                return Git.Graph.aheadBehind(repo, local, upstream).then(function(aheadbehind) {
                  if (aheadbehind.ahead) {
                    $('#push-action').addClass('available');
                  } else {
                    $('#push-action').removeClass('available');
                  }
                  if (aheadbehind.behind) {
                    return $('#pull-action').addClass('available');
                  } else {
                    return $('#pull-action').removeClass('available');
                  }
                });
              });
            });
          });
        }
      })["catch"](function(error) {
        atom.notifications.addError("" + error);
        return console.log(error);
      });
    };

    GitGuiActionBarView.prototype.updateLog = function() {
      var pathToRepo;
      pathToRepo = $('#git-gui-project-list').find(':selected').data('repo');
      return Git.Repository.open(pathToRepo).then((function(_this) {
        return function(repo) {
          return repo.getHeadCommit().then(function(commit) {
            var history, promise;
            if (commit === null) {
              return;
            }
            history = commit.history(Git.Revwalk.SORT.Time);
            promise = new Promise(function(resolve, reject) {
              history.on("end", resolve);
              return history.on("error", reject);
            });
            history.start();
            return promise.then(function(commits) {
              var authorDiv, commitDiv, dateDiv, div, endIndex, i, j, messageDiv, ref2, ref3, results;
              if (_this.startIndex > commits.length) {
                return;
              }
              endIndex = _this.endIndex > commits.length ? commits.length : _this.endIndex;
              results = [];
              for (i = j = ref2 = _this.startIndex, ref3 = endIndex; ref2 <= ref3 ? j < ref3 : j > ref3; i = ref2 <= ref3 ? ++j : --j) {
                _this.startIndex += 1;
                _this.endIndex += 1;
                div = $('<div></div>');
                commitDiv = $("<div>Commit: " + (commits[i].sha()) + "</div>");
                authorDiv = $("<div>Author: " + (commits[i].author().name()) + " &lt" + (commits[i].author().email()) + "&gt</div>");
                dateDiv = $("<div>Date: " + (commits[i].date()) + "</div>");
                messageDiv = $("<div>\n\t" + (commits[i].message()) + "\n\n</div>");
                div.append(commitDiv);
                div.append(authorDiv);
                div.append(dateDiv);
                div.append(messageDiv);
                results.push($('#log').append(div));
              }
              return results;
            });
          });
        };
      })(this))["catch"](function(error) {
        atom.notifications.addError("" + error);
        return console.log(error);
      });
    };

    return GitGuiActionBarView;

  })(View);

  module.exports = GitGuiActionBarView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1ndWkvbGliL2dpdC1ndWktYWN0aW9uLWJhci12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsdUNBQUE7SUFBQTs7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxTQUFSOztFQUNOLE9BQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLFVBQUQsRUFBSTs7RUFFRTs7Ozs7OztrQ0FDSixVQUFBLEdBQVk7O2tDQUNaLFFBQUEsR0FBVTs7SUFDVixtQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sb0JBQVA7T0FBTCxFQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2hDLEtBQUMsQ0FBQSxFQUFELENBQUk7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG9DQUFQO1dBQUosRUFBaUQsU0FBQTtZQUMvQyxLQUFDLENBQUEsRUFBRCxDQUFJO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFQO2FBQUosRUFBd0IsU0FBQTtxQkFDdEIsS0FBQyxDQUFBLENBQUQsQ0FBRztnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLE1BQVA7Z0JBQWUsRUFBQSxFQUFJLGVBQW5CO2VBQUg7WUFEc0IsQ0FBeEI7WUFFQSxLQUFDLENBQUEsRUFBRCxDQUFJO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFQO2FBQUosRUFBd0IsU0FBQTtxQkFDdEIsS0FBQyxDQUFBLENBQUQsQ0FBRztnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLE1BQVA7Z0JBQWUsRUFBQSxFQUFJLGFBQW5CO2VBQUg7WUFEc0IsQ0FBeEI7WUFFQSxLQUFDLENBQUEsRUFBRCxDQUFJO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFQO2FB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Q0FBRCxDQUFoRCxHQUE2RSxXQUEvRTtnQkFDWixPQUFBLEdBQVUsQ0FBQSxDQUFFLGFBQUEsR0FBYSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFYLENBQUEsQ0FBRCxDQUFiLEdBQWdDLFFBQWxDO2dCQUNWLFVBQUEsR0FBYSxDQUFBLENBQUUsV0FBQSxHQUFXLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQVgsQ0FBQSxDQUFELENBQVgsR0FBaUMsWUFBbkM7Z0JBQ2IsR0FBRyxDQUFDLE1BQUosQ0FBVyxTQUFYO2dCQUNBLEdBQUcsQ0FBQyxNQUFKLENBQVcsU0FBWDtnQkFDQSxHQUFHLENBQUMsTUFBSixDQUFXLE9BQVg7Z0JBQ0EsR0FBRyxDQUFDLE1BQUosQ0FBVyxVQUFYOzZCQUNBLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxNQUFWLENBQWlCLEdBQWpCO0FBWkY7O1lBSlcsQ0FBYjtVQVJJLENBRE47UUFESTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixDQTRCQSxFQUFDLEtBQUQsRUE1QkEsQ0E0Qk8sU0FBQyxLQUFEO1FBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixFQUFBLEdBQUcsS0FBL0I7ZUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVo7TUFGSyxDQTVCUDtJQUZTOzs7O0tBM0pxQjs7RUE2TGxDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBaE1qQiIsInNvdXJjZXNDb250ZW50IjpbIkdpdCA9IHJlcXVpcmUgJ25vZGVnaXQnXG57JCwgVmlld30gPSByZXF1aXJlICdzcGFjZS1wZW4nXG5cbmNsYXNzIEdpdEd1aUFjdGlvbkJhclZpZXcgZXh0ZW5kcyBWaWV3XG4gIHN0YXJ0SW5kZXg6IDBcbiAgZW5kSW5kZXg6IDEwXG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICdnaXQtZ3VpLWFjdGlvbi1iYXInLCA9PlxuICAgICAgQHVsIGNsYXNzOiAnbGlzdC1ncm91cCBnaXQtZ3VpLWFjdGlvbi1iYXItbGlzdCcsID0+XG4gICAgICAgIEBsaSBjbGFzczogJ2xpc3QtaXRlbScsID0+XG4gICAgICAgICAgQGEgY2xhc3M6ICdpY29uJywgaWQ6ICdjb21taXQtYWN0aW9uJ1xuICAgICAgICBAbGkgY2xhc3M6ICdsaXN0LWl0ZW0nLCA9PlxuICAgICAgICAgIEBhIGNsYXNzOiAnaWNvbicsIGlkOiAncHVzaC1hY3Rpb24nXG4gICAgICAgIEBsaSBjbGFzczogJ2xpc3QtaXRlbScsID0+XG4gICAgICAgICAgQGEgY2xhc3M6ICdpY29uJywgaWQ6ICdwdWxsLWFjdGlvbidcbiAgICAgICAgQGxpIGNsYXNzOiAnbGlzdC1pdGVtJywgPT5cbiAgICAgICAgICBAYSBjbGFzczogJ2ljb24nLCBpZDogJ2xvZy1hY3Rpb24nXG4gICAgICAgIEBsaSBjbGFzczogJ2xpc3QtaXRlbScsID0+XG4gICAgICAgICAgQGEgY2xhc3M6ICdpY29uJywgaWQ6ICdzZXR0aW5ncy1hY3Rpb24nXG5cbiAgIyBUT0RPOiBBZGQgYW4gYGFtZW5kYCBvcHRpb24gZm9yIGBjb21taXRgXG4gICMgVE9ETzogQWRkIGFuIGBtZXJnZWAgb3B0aW9uIGZvciBgcHVsbGBcbiAgaW5pdGlhbGl6ZTogLT5cbiAgICAkKGRvY3VtZW50KS5yZWFkeSAoKSA9PlxuICAgICAgIyBUT0RPOiBjaGVjayBpZiBsb2cgaXMgYXZhaWxhYmxlIHZpYSBudW1iZXIgb2YgY29tbWl0cyBtYWRlXG4gICAgICAkKCcjbG9nLWFjdGlvbicpLmFkZENsYXNzKCdhdmFpbGFibGUnKVxuICAgICAgJCgnI3NldHRpbmdzLWFjdGlvbicpLmFkZENsYXNzKCdhdmFpbGFibGUnKVxuXG4gICAgICAkKCdib2R5Jykub24gJ21vdXNlZW50ZXInLCAnI3B1c2gtYWN0aW9uJywgKCkgLT5cbiAgICAgICAgJCgnYm9keScpLm9uICdrZXlkb3duJywgKGUpIC0+XG4gICAgICAgICAgaWYgZS53aGljaCA9PSAxNlxuICAgICAgICAgICAgaWYgISAkKCcjcHVzaC1hY3Rpb24nKS5oYXNDbGFzcygnZm9yY2UnKVxuICAgICAgICAgICAgICAkKCcjcHVzaC1hY3Rpb24nKS5hZGRDbGFzcyAnZm9yY2UnXG5cbiAgICAgICAgJCgnYm9keScpLm9uICdrZXl1cCcsIChlKSAtPlxuICAgICAgICAgIGlmIGUud2hpY2ggPT0gMTZcbiAgICAgICAgICAgIGlmICQoJyNwdXNoLWFjdGlvbicpLmhhc0NsYXNzKCdmb3JjZScpXG4gICAgICAgICAgICAgICQoJyNwdXNoLWFjdGlvbicpLnJlbW92ZUNsYXNzICdmb3JjZSdcblxuICAgICAgJCgnYm9keScpLm9uICdtb3VzZWxlYXZlJywgJyNwdXNoLWFjdGlvbicsICgpIC0+XG4gICAgICAgIGlmICQoJyNwdXNoLWFjdGlvbicpLmhhc0NsYXNzKCdmb3JjZScpXG4gICAgICAgICAgJCgnI3B1c2gtYWN0aW9uJykucmVtb3ZlQ2xhc3MgJ2ZvcmNlJ1xuICAgICAgICAkKCdib2R5Jykub2ZmICdrZXlkb3duJ1xuICAgICAgICAkKCdib2R5Jykub2ZmICdrZXl1cCdcblxuICAgICAgJCgnYm9keScpLm9uICdjbGljaycsICcjY29tbWl0LWFjdGlvbicsICgpID0+XG4gICAgICAgICQoJ2F0b20td29ya3NwYWNlLWF4aXMuaG9yaXpvbnRhbCcpLnRvZ2dsZUNsYXNzICdibHVyJ1xuICAgICAgICAkKCcjYWN0aW9uLXZpZXcnKS5wYXJlbnQoKS5zaG93KClcbiAgICAgICAgJCgnI2FjdGlvbi12aWV3JykuYWRkQ2xhc3MgJ29wZW4nXG4gICAgICAgIEBwYXJlbnRWaWV3LmdpdEd1aUFjdGlvblZpZXcub3BlbkNvbW1pdEFjdGlvbigpXG5cbiAgICAgICQoJ2JvZHknKS5vbiAnY2xpY2snLCAnI3B1c2gtYWN0aW9uJywgKCkgPT5cbiAgICAgICAgaWYgJCgnI3B1c2gtYWN0aW9uJykuaGFzQ2xhc3MoJ2ZvcmNlJylcbiAgICAgICAgICBhdG9tLmNvbmZpcm1cbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRm9yY2UgcHVzaD9cIlxuICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIlRoaXMgd2lsbCBvdmVyd3JpdGUgY2hhbmdlcyB0byB0aGUgcmVtb3RlLlwiXG4gICAgICAgICAgICBidXR0b25zOlxuICAgICAgICAgICAgICBPazogPT5cbiAgICAgICAgICAgICAgICBAcGFyZW50Vmlldy5naXRHdWlBY3Rpb25WaWV3Lm9wZW5QdXNoQWN0aW9uKHRydWUpXG4gICAgICAgICAgICAgIENhbmNlbDogLT5cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBwYXJlbnRWaWV3LmdpdEd1aUFjdGlvblZpZXcub3BlblB1c2hBY3Rpb24oZmFsc2UpXG5cbiAgICAgICQoJ2JvZHknKS5vbiAnY2xpY2snLCAnI3B1bGwtYWN0aW9uJywgKCkgLT5cbiAgICAgICAgJCgnYXRvbS13b3Jrc3BhY2UtYXhpcy5ob3Jpem9udGFsJykudG9nZ2xlQ2xhc3MgJ2JsdXInXG4gICAgICAgICQoJyNhY3Rpb24tdmlldycpLnBhcmVudCgpLnNob3coKVxuICAgICAgICAkKCcjYWN0aW9uLXZpZXcnKS5hZGRDbGFzcyAnb3BlbidcbiAgICAgICAgIyBAcGFyZW50Vmlldy5naXRHdWlBY3Rpb25WaWV3Lm9wZW5QdWxsQWN0aW9uKClcblxuICAgICAgJCgnYm9keScpLm9uICdjbGljaycsICcjbG9nLWFjdGlvbicsICgpID0+XG4gICAgICAgIGlmICQoJyNsb2cnKS5oYXNDbGFzcygnb3BlbicpXG4gICAgICAgICAgJCgnLmdpdC1ndWktc3RhZ2luZy1hcmVhJykucmVtb3ZlQ2xhc3MoJ2ZhZGUtYW5kLWJsdXInKVxuICAgICAgICAgICQoJyNzZXR0aW5ncy1hY3Rpb24nKS5hZGRDbGFzcygnYXZhaWxhYmxlJylcbiAgICAgICAgICAkKCcjbG9nJykucmVtb3ZlQ2xhc3MoJ29wZW4nKVxuICAgICAgICAgICQoJyNsb2cnKS5lbXB0eSgpXG4gICAgICAgICAgQHN0YXJ0SW5kZXggPSAwXG4gICAgICAgICAgQGVuZEluZGV4ID0gMTBcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEB1cGRhdGVMb2coKVxuICAgICAgICAgICQoJy5naXQtZ3VpLXN0YWdpbmctYXJlYScpLmFkZENsYXNzKCdmYWRlLWFuZC1ibHVyJylcbiAgICAgICAgICAkKCcjc2V0dGluZ3MtYWN0aW9uJykucmVtb3ZlQ2xhc3MoJ2F2YWlsYWJsZScpXG4gICAgICAgICAgJCgnI2xvZycpLmFkZENsYXNzKCdvcGVuJylcblxuICAgICAgJCgnYm9keScpLm9uICdjbGljaycsICcjc2V0dGluZ3MtYWN0aW9uJywgKCkgLT5cbiAgICAgICAgaWYgJCgnI3NldHRpbmdzJykuaGFzQ2xhc3MoJ29wZW4nKVxuICAgICAgICAgICQoJyNzZXR0aW5ncycpLnJlbW92ZUNsYXNzKCdvcGVuJylcbiAgICAgICAgICAkKCcjbG9nLWFjdGlvbicpLmFkZENsYXNzKCdhdmFpbGFibGUnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJCgnI3NldHRpbmdzJykuYWRkQ2xhc3MoJ29wZW4nKVxuICAgICAgICAgICQoJyNsb2ctYWN0aW9uJykucmVtb3ZlQ2xhc3MoJ2F2YWlsYWJsZScpXG5cbiAgICAgICAgJCgnLmdpdC1ndWktc3RhZ2luZy1hcmVhJykudG9nZ2xlQ2xhc3MoJ2ZhZGUtYW5kLWJsdXInKVxuXG4gIHNlcmlhbGl6ZTogLT5cblxuICBkZXN0cm95OiAtPlxuXG4gIHVwZGF0ZTogLT5cbiAgICBwYXRoVG9SZXBvID0gJCgnI2dpdC1ndWktcHJvamVjdC1saXN0JykuZmluZCgnOnNlbGVjdGVkJykuZGF0YSgncmVwbycpXG4gICAgR2l0LlJlcG9zaXRvcnkub3BlbiBwYXRoVG9SZXBvXG4gICAgLnRoZW4gKHJlcG8pID0+XG4gICAgICBAdXBkYXRlQ29tbWl0QWN0aW9uIHJlcG9cbiAgICAgIEB1cGRhdGVQdXNoQWN0aW9uIHJlcG9cbiAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiI3tlcnJvcn1cIlxuICAgICAgY29uc29sZS5sb2cgZXJyb3JcblxuICB1cGRhdGVDb21taXRBY3Rpb246IChyZXBvKSAtPlxuICAgIHN0YXR1c09wdGlvbnMgPSBuZXcgR2l0LlN0YXR1c09wdGlvbnMoKVxuICAgIEdpdC5TdGF0dXNMaXN0LmNyZWF0ZSByZXBvLCBzdGF0dXNPcHRpb25zXG4gICAgLnRoZW4gKHN0YXR1c0xpc3QpIC0+XG4gICAgICBkbyAoKSAtPlxuICAgICAgICAkKCcjY29tbWl0LWFjdGlvbicpLnJlbW92ZUNsYXNzICdhdmFpbGFibGUnXG4gICAgICAgIGZvciBpIGluIFswLi4uc3RhdHVzTGlzdC5lbnRyeWNvdW50KCkgXVxuICAgICAgICAgIGVudHJ5ID0gR2l0LlN0YXR1cy5ieUluZGV4KHN0YXR1c0xpc3QsIGkpXG4gICAgICAgICAgc3RhdHVzID0gZW50cnkuc3RhdHVzKClcbiAgICAgICAgICBzd2l0Y2ggc3RhdHVzXG4gICAgICAgICAgICB3aGVuIEdpdC5TdGF0dXMuU1RBVFVTLklOREVYX05FVywgXFxcbiAgICAgICAgICAgICAgICAgR2l0LlN0YXR1cy5TVEFUVVMuSU5ERVhfTU9ESUZJRUQsIFxcXG4gICAgICAgICAgICAgICAgIEdpdC5TdGF0dXMuU1RBVFVTLklOREVYX05FVyArIEdpdC5TdGF0dXMuU1RBVFVTLklOREVYX01PRElGSUVELCBcXFxuICAgICAgICAgICAgICAgICBHaXQuU3RhdHVzLlNUQVRVUy5JTkRFWF9ERUxFVEVELCBcXFxuICAgICAgICAgICAgICAgICBHaXQuU3RhdHVzLlNUQVRVUy5JTkRFWF9SRU5BTUVELCBcXFxuICAgICAgICAgICAgICAgICBHaXQuU3RhdHVzLlNUQVRVUy5JTkRFWF9NT0RJRklFRCArIEdpdC5TdGF0dXMuU1RBVFVTLldUX01PRElGSUVEXG4gICAgICAgICAgICAgICQoJyNjb21taXQtYWN0aW9uJykuYWRkQ2xhc3MgJ2F2YWlsYWJsZSdcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIiN7ZXJyb3J9XCJcbiAgICAgIGNvbnNvbGUubG9nIGVycm9yXG5cbiAgdXBkYXRlUHVzaEFjdGlvbjogKHJlcG8pIC0+XG4gICAgaWYgcmVwby5pc0VtcHR5KClcbiAgICAgIHJldHVyblxuICAgIEdpdC5SZW1vdGUubGlzdChyZXBvKVxuICAgIC50aGVuIChyZW1vdGVzKSAtPlxuICAgICAgaWYgcmVtb3Rlcy5sZW5ndGggIT0gMFxuICAgICAgICByZXBvLmdldEN1cnJlbnRCcmFuY2goKVxuICAgICAgICAudGhlbiAocmVmKSAtPlxuICAgICAgICAgIEdpdC5SZWZlcmVuY2UubmFtZVRvSWQgcmVwbywgcmVmLm5hbWUoKVxuICAgICAgICAgIC50aGVuIChsb2NhbCkgLT5cbiAgICAgICAgICAgICMgVE9ETzogQ29uc2lkZXIgdGhlIGNhc2Ugd2hlbiBhIHVzZXIgd2FudHMgdG8gZ2V0IHRoZSBhaGVhZC9iZWhpbmRcbiAgICAgICAgICAgICMgICAgICAgY291bnQgZnJvbSBhIHJlbW90ZSBvdGhlciB0aGFuIG9yaWdpbi5cbiAgICAgICAgICAgIEdpdC5SZWZlcmVuY2UubmFtZVRvSWQgcmVwbywgXCJyZWZzL3JlbW90ZXMvb3JpZ2luLyN7cmVmLnNob3J0aGFuZCgpfVwiXG4gICAgICAgICAgICAudGhlbiAodXBzdHJlYW0pIC0+XG4gICAgICAgICAgICAgIEdpdC5HcmFwaC5haGVhZEJlaGluZChyZXBvLCBsb2NhbCwgdXBzdHJlYW0pXG4gICAgICAgICAgICAgIC50aGVuIChhaGVhZGJlaGluZCkgLT5cbiAgICAgICAgICAgICAgICBpZiBhaGVhZGJlaGluZC5haGVhZFxuICAgICAgICAgICAgICAgICAgJCgnI3B1c2gtYWN0aW9uJykuYWRkQ2xhc3MgJ2F2YWlsYWJsZSdcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAkKCcjcHVzaC1hY3Rpb24nKS5yZW1vdmVDbGFzcyAnYXZhaWxhYmxlJ1xuICAgICAgICAgICAgICAgIGlmIGFoZWFkYmVoaW5kLmJlaGluZFxuICAgICAgICAgICAgICAgICAgJCgnI3B1bGwtYWN0aW9uJykuYWRkQ2xhc3MgJ2F2YWlsYWJsZSdcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAkKCcjcHVsbC1hY3Rpb24nKS5yZW1vdmVDbGFzcyAnYXZhaWxhYmxlJ1xuICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCIje2Vycm9yfVwiXG4gICAgICBjb25zb2xlLmxvZyBlcnJvclxuXG4gIHVwZGF0ZUxvZzogKCkgLT5cbiAgICBwYXRoVG9SZXBvID0gJCgnI2dpdC1ndWktcHJvamVjdC1saXN0JykuZmluZCgnOnNlbGVjdGVkJykuZGF0YSgncmVwbycpXG4gICAgR2l0LlJlcG9zaXRvcnkub3BlbiBwYXRoVG9SZXBvXG4gICAgLnRoZW4gKHJlcG8pID0+XG4gICAgICByZXBvLmdldEhlYWRDb21taXQoKVxuICAgICAgLnRoZW4gKGNvbW1pdCkgPT5cbiAgICAgICAgaWYgY29tbWl0ID09IG51bGxcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgaGlzdG9yeSA9IGNvbW1pdC5oaXN0b3J5IEdpdC5SZXZ3YWxrLlNPUlQuVGltZVxuICAgICAgICBwcm9taXNlID0gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgICAgICBoaXN0b3J5Lm9uIFwiZW5kXCIsIHJlc29sdmVcbiAgICAgICAgICBoaXN0b3J5Lm9uIFwiZXJyb3JcIiwgcmVqZWN0XG4gICAgICAgIGhpc3Rvcnkuc3RhcnQoKVxuICAgICAgICBwcm9taXNlLnRoZW4gKGNvbW1pdHMpID0+XG4gICAgICAgICAgaWYgQHN0YXJ0SW5kZXggPiBjb21taXRzLmxlbmd0aFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgZW5kSW5kZXggPSBpZiBAZW5kSW5kZXggPiBjb21taXRzLmxlbmd0aCB0aGVuIGNvbW1pdHMubGVuZ3RoIGVsc2UgQGVuZEluZGV4XG4gICAgICAgICAgZm9yIGkgaW4gW0BzdGFydEluZGV4Li4uZW5kSW5kZXhdXG4gICAgICAgICAgICBAc3RhcnRJbmRleCArPSAxXG4gICAgICAgICAgICBAZW5kSW5kZXggKz0gMVxuICAgICAgICAgICAgZGl2ID0gJCgnPGRpdj48L2Rpdj4nKVxuICAgICAgICAgICAgY29tbWl0RGl2ID0gJChcIjxkaXY+Q29tbWl0OiAje2NvbW1pdHNbaV0uc2hhKCl9PC9kaXY+XCIpXG4gICAgICAgICAgICBhdXRob3JEaXYgPSAkKFwiPGRpdj5BdXRob3I6ICN7Y29tbWl0c1tpXS5hdXRob3IoKS5uYW1lKCl9ICZsdCN7Y29tbWl0c1tpXS5hdXRob3IoKS5lbWFpbCgpfSZndDwvZGl2PlwiKVxuICAgICAgICAgICAgZGF0ZURpdiA9ICQoXCI8ZGl2PkRhdGU6ICN7Y29tbWl0c1tpXS5kYXRlKCl9PC9kaXY+XCIpXG4gICAgICAgICAgICBtZXNzYWdlRGl2ID0gJChcIjxkaXY+XFxuXFx0I3tjb21taXRzW2ldLm1lc3NhZ2UoKX1cXG5cXG48L2Rpdj5cIilcbiAgICAgICAgICAgIGRpdi5hcHBlbmQgY29tbWl0RGl2XG4gICAgICAgICAgICBkaXYuYXBwZW5kIGF1dGhvckRpdlxuICAgICAgICAgICAgZGl2LmFwcGVuZCBkYXRlRGl2XG4gICAgICAgICAgICBkaXYuYXBwZW5kIG1lc3NhZ2VEaXZcbiAgICAgICAgICAgICQoJyNsb2cnKS5hcHBlbmQgZGl2XG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIiN7ZXJyb3J9XCJcbiAgICAgIGNvbnNvbGUubG9nIGVycm9yXG5cbm1vZHVsZS5leHBvcnRzID0gR2l0R3VpQWN0aW9uQmFyVmlld1xuIl19
