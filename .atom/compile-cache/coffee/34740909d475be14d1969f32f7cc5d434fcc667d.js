(function() {
  var $, Emitter, Git, GitGuiActionView, GitGuiCommitView, GitGuiPushView, View, path, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require('path');

  Git = require('nodegit');

  Emitter = require('atom').Emitter;

  ref1 = require('space-pen'), $ = ref1.$, View = ref1.View;

  GitGuiCommitView = require('./git-gui-commit-view');

  GitGuiPushView = require('./git-gui-push-view');

  GitGuiActionView = (function(superClass) {
    extend(GitGuiActionView, superClass);

    function GitGuiActionView() {
      return GitGuiActionView.__super__.constructor.apply(this, arguments);
    }

    GitGuiActionView.content = function() {
      return this.div({
        id: 'action-view'
      }, (function(_this) {
        return function() {
          _this.subview('gitGuiCommitView', new GitGuiCommitView());
          _this.subview('gitGuiPushView', new GitGuiPushView());
          return _this.div({
            "class": 'btn-toolbar',
            id: 'action-view-btn-group'
          }, function() {
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                "class": 'btn',
                id: 'action-view-close-button'
              }, 'Close');
              return _this.button({
                "class": 'btn',
                id: 'action-view-action-button'
              });
            });
          });
        };
      })(this));
    };

    GitGuiActionView.prototype.initialize = function() {
      this.emitter = new Emitter;
      this.gitGuiCommitView.hide();
      this.gitGuiPushView.hide();
      return $(document).ready(function() {
        return $('body').on('click', '#action-view-close-button', function() {
          $('atom-workspace-axis.horizontal').removeClass('blur');
          $('#action-view').parent().hide();
          return $('#action-view').removeClass('open');
        });
      });
    };

    GitGuiActionView.prototype.serialize = function() {};

    GitGuiActionView.prototype.destroy = function() {
      this.gitGuiCommitView.destroy();
      this.gitGuiPushView.destroy();
      return this.emitter.dispose();
    };

    GitGuiActionView.prototype.onDidCommit = function(callback) {
      return this.emitter.on('did-commit', callback);
    };

    GitGuiActionView.prototype.onDidPush = function(callback) {
      return this.emitter.on('did-push', callback);
    };

    GitGuiActionView.prototype.openCommitAction = function() {
      this.gitGuiCommitView.show();
      $('#action-view-action-button').text('Commit');
      $('#action-view-action-button').off('click');
      return $('#action-view-action-button').on('click', (function(_this) {
        return function() {
          return _this.gitGuiCommitView.commit().then(function(oid) {
            $('#action-view-close-button').click();
            $('#action-view-action-button').empty();
            $('#action-view-action-button').off('click');
            $('#commit-action').removeClass('available');
            _this.gitGuiCommitView.hide();
            _this.emitter.emit('did-commit', oid);
            return atom.notifications.addSuccess("Commit successful:", {
              description: oid.tostrS()
            });
          })["catch"](function(error) {
            return atom.notifications.addError("Commit unsuccessful:", {
              description: error
            });
          });
        };
      })(this));
    };

    GitGuiActionView.prototype.openPushAction = function(force) {
      var pathToRepo;
      pathToRepo = path.join($('#git-gui-project-list').val(), '.git');
      return Git.Repository.open(pathToRepo).then((function(_this) {
        return function(repo) {
          return repo.getCurrentBranch().then(function(ref) {
            var refSpec;
            if (force) {
              refSpec = '+' + refSpec;
            }
            refSpec = "refs/heads/" + (ref.shorthand()) + ":refs/heads/" + (ref.shorthand());
            return Git.Remote.lookup(repo, $('#git-gui-remotes-list').val()).then(function(remote) {
              var url;
              url = remote.url();
              if (url.indexOf("https") === -1) {
                return _this.openSSHPush(remote, refSpec, ref.shorthand());
              } else {
                $('#action-view-action-button').text('Push');
                $('#action-view-action-button').off('click');
                $('atom-workspace-axis.horizontal').addClass('blur');
                $('#action-view').parent().show();
                $('#action-view').addClass('open');
                _this.gitGuiPushView.show();
                return _this.openPlaintextPush(remote, refSpec, ref.shorthand());
              }
            });
          });
        };
      })(this));
    };

    GitGuiActionView.prototype.openSSHPush = function(remote, refSpec, refShorthand) {
      $('.git-gui-staging-area').toggleClass('fade-and-blur');
      $('#action-progress-indicator').css('visibility', 'visible');
      return this.gitGuiPushView.pushSSH(remote, refSpec).then((function(_this) {
        return function() {
          return _this.showPushSuccess(remote.url(), refShorthand);
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          return _this.showPushError(error);
        };
      })(this)).then(function() {
        return $('.git-gui-staging-area').removeClass('fade-and-blur');
      });
    };

    GitGuiActionView.prototype.openPlaintextPush = function(remote, refSpec, refShorthand) {
      $('#push-plaintext-options').css('display', 'block');
      return $('#action-view-action-button').on('click', (function(_this) {
        return function() {
          $('#action-view-close-button').click();
          _this.gitGuiPushView.hide();
          $('.git-gui-staging-area').addClass('fade-and-blur');
          $('#action-progress-indicator').css('visibility', 'visible');
          return _this.gitGuiPushView.pushPlainText(remote, refSpec).then(function() {
            return _this.showPushSuccess(remote.url(), refShorthand);
          })["catch"](function(error) {
            return _this.showPushError(error);
          }).then(function() {
            return $('.git-gui-staging-area').removeClass('fade-and-blur');
          });
        };
      })(this));
    };

    GitGuiActionView.prototype.showPushError = function(error) {
      $('#action-progress-indicator').css('visibility', 'hidden');
      return atom.notifications.addError("Push unsuccessful:", {
        description: error.toString()
      });
    };

    GitGuiActionView.prototype.showPushSuccess = function(url, refShorthand) {
      $('#action-view-action-button').empty();
      $('#action-view-action-button').text('');
      $('#action-view-action-button').off('click');
      $('#push-action').removeClass('available');
      $('#action-progress-indicator').css('visibility', 'hidden');
      this.emitter.emit('did-push');
      return atom.notifications.addSuccess("Push successful:", {
        detail: "To " + url + "\n\t" + refShorthand + " -> " + refShorthand
      });
    };

    return GitGuiActionView;

  })(View);

  module.exports = GitGuiActionView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1ndWkvbGliL2dpdC1ndWktYWN0aW9uLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxxRkFBQTtJQUFBOzs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsR0FBQSxHQUFNLE9BQUEsQ0FBUSxTQUFSOztFQUNMLFVBQVcsT0FBQSxDQUFRLE1BQVI7O0VBQ1osT0FBWSxPQUFBLENBQVEsV0FBUixDQUFaLEVBQUMsVUFBRCxFQUFJOztFQUNKLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSx1QkFBUjs7RUFDbkIsY0FBQSxHQUFpQixPQUFBLENBQVEscUJBQVI7O0VBRVg7Ozs7Ozs7SUFDSixnQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLEVBQUEsRUFBSSxhQUFKO09BQUwsRUFBd0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3RCLEtBQUMsQ0FBQSxPQUFELENBQVMsa0JBQVQsRUFBaUMsSUFBQSxnQkFBQSxDQUFBLENBQWpDO1VBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxnQkFBVCxFQUErQixJQUFBLGNBQUEsQ0FBQSxDQUEvQjtpQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxhQUFQO1lBQXNCLEVBQUEsRUFBSSx1QkFBMUI7V0FBTCxFQUF3RCxTQUFBO21CQUN0RCxLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFQO2FBQUwsRUFBeUIsU0FBQTtjQUN2QixLQUFDLENBQUEsTUFBRCxDQUFRO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sS0FBUDtnQkFBYyxFQUFBLEVBQUksMEJBQWxCO2VBQVIsRUFBc0QsT0FBdEQ7cUJBQ0EsS0FB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ZixlQUFBLEdBQWlCLFNBQUMsR0FBRCxFQUFNLFlBQU47TUFDZixDQUFBLENBQUUsNEJBQUYsQ0FBK0IsQ0FBQyxLQUFoQyxDQUFBO01BQ0EsQ0FBQSxDQUFFLDRCQUFGLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsRUFBckM7TUFDQSxDQUFBLENBQUUsNEJBQUYsQ0FBK0IsQ0FBQyxHQUFoQyxDQUFvQyxPQUFwQztNQUNBLENBQUEsQ0FBRSxjQUFGLENBQWlCLENBQUMsV0FBbEIsQ0FBOEIsV0FBOUI7TUFDQSxDQUFBLENBQUUsNEJBQUYsQ0FBK0IsQ0FBQyxHQUFoQyxDQUFvQyxZQUFwQyxFQUFrRCxRQUFsRDtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLFVBQWQ7YUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLGtCQUE5QixFQUFrRDtRQUFDLE1BQUEsRUFBUSxLQUFBLEdBQU0sR0FBTixHQUFVLE1BQVYsR0FBZ0IsWUFBaEIsR0FBNkIsTUFBN0IsR0FBbUMsWUFBNUM7T0FBbEQ7SUFQZTs7OztLQXhHWTs7RUFpSC9CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBeEhqQiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuR2l0ID0gcmVxdWlyZSAnbm9kZWdpdCdcbntFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVmlld30gPSByZXF1aXJlICdzcGFjZS1wZW4nXG5HaXRHdWlDb21taXRWaWV3ID0gcmVxdWlyZSAnLi9naXQtZ3VpLWNvbW1pdC12aWV3J1xuR2l0R3VpUHVzaFZpZXcgPSByZXF1aXJlICcuL2dpdC1ndWktcHVzaC12aWV3J1xuXG5jbGFzcyBHaXRHdWlBY3Rpb25WaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IGlkOiAnYWN0aW9uLXZpZXcnLCA9PlxuICAgICAgQHN1YnZpZXcgJ2dpdEd1aUNvbW1pdFZpZXcnLCBuZXcgR2l0R3VpQ29tbWl0VmlldygpXG4gICAgICBAc3VidmlldyAnZ2l0R3VpUHVzaFZpZXcnLCBuZXcgR2l0R3VpUHVzaFZpZXcoKVxuICAgICAgQGRpdiBjbGFzczogJ2J0bi10b29sYmFyJywgaWQ6ICdhY3Rpb24tdmlldy1idG4tZ3JvdXAnLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnYnRuLWdyb3VwJywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuJywgaWQ6ICdhY3Rpb24tdmlldy1jbG9zZS1idXR0b24nLCAnQ2xvc2UnXG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0bicsIGlkOiAnYWN0aW9uLXZpZXctYWN0aW9uLWJ1dHRvbidcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICBAZ2l0R3VpQ29tbWl0Vmlldy5oaWRlKClcbiAgICBAZ2l0R3VpUHVzaFZpZXcuaGlkZSgpXG4gICAgJChkb2N1bWVudCkucmVhZHkgKCkgLT5cbiAgICAgICQoJ2JvZHknKS5vbiAnY2xpY2snLCAnI2FjdGlvbi12aWV3LWNsb3NlLWJ1dHRvbicsICgpIC0+XG4gICAgICAgICQoJ2F0b20td29ya3NwYWNlLWF4aXMuaG9yaXpvbnRhbCcpLnJlbW92ZUNsYXNzICdibHVyJ1xuICAgICAgICAkKCcjYWN0aW9uLXZpZXcnKS5wYXJlbnQoKS5oaWRlKClcbiAgICAgICAgJCgnI2FjdGlvbi12aWV3JykucmVtb3ZlQ2xhc3MgJ29wZW4nXG5cbiAgc2VyaWFsaXplOiAtPlxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGdpdEd1aUNvbW1pdFZpZXcuZGVzdHJveSgpXG4gICAgQGdpdEd1aVB1c2hWaWV3LmRlc3Ryb3koKVxuICAgIEBlbWl0dGVyLmRpc3Bvc2UoKVxuXG4gIG9uRGlkQ29tbWl0OiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1jb21taXQnLCBjYWxsYmFja1xuXG4gIG9uRGlkUHVzaDogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtcHVzaCcsIGNhbGxiYWNrXG5cbiAgb3BlbkNvbW1pdEFjdGlvbjogLT5cbiAgICBAZ2l0R3VpQ29tbWl0Vmlldy5zaG93KClcbiAgICAkKCcjYWN0aW9uLXZpZXctYWN0aW9uLWJ1dHRvbicpLnRleHQgJ0NvbW1pdCdcbiAgICAkKCcjYWN0aW9uLXZpZXctYWN0aW9uLWJ1dHRvbicpLm9mZiAnY2xpY2snXG4gICAgJCgnI2FjdGlvbi12aWV3LWFjdGlvbi1idXR0b24nKS5vbiAnY2xpY2snLCAoKSA9PlxuICAgICAgQGdpdEd1aUNvbW1pdFZpZXcuY29tbWl0KClcbiAgICAgIC50aGVuIChvaWQpID0+XG4gICAgICAgICQoJyNhY3Rpb24tdmlldy1jbG9zZS1idXR0b24nKS5jbGljaygpXG4gICAgICAgICQoJyNhY3Rpb24tdmlldy1hY3Rpb24tYnV0dG9uJykuZW1wdHkoKVxuICAgICAgICAkKCcjYWN0aW9uLXZpZXctYWN0aW9uLWJ1dHRvbicpLm9mZiAnY2xpY2snXG4gICAgICAgICQoJyNjb21taXQtYWN0aW9uJykucmVtb3ZlQ2xhc3MgJ2F2YWlsYWJsZSdcbiAgICAgICAgQGdpdEd1aUNvbW1pdFZpZXcuaGlkZSgpXG4gICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jb21taXQnLCBvaWRcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MgXCJDb21taXQgc3VjY2Vzc2Z1bDpcIiwge2Rlc2NyaXB0aW9uOiBvaWQudG9zdHJTKCkgfVxuICAgICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiQ29tbWl0IHVuc3VjY2Vzc2Z1bDpcIiwge2Rlc2NyaXB0aW9uOiBlcnJvcn1cblxuICBvcGVuUHVzaEFjdGlvbjogKGZvcmNlKSAtPlxuICAgIHBhdGhUb1JlcG8gPSBwYXRoLmpvaW4gJCgnI2dpdC1ndWktcHJvamVjdC1saXN0JykudmFsKCksICcuZ2l0J1xuICAgIEdpdC5SZXBvc2l0b3J5Lm9wZW4gcGF0aFRvUmVwb1xuICAgIC50aGVuIChyZXBvKSA9PlxuICAgICAgcmVwby5nZXRDdXJyZW50QnJhbmNoKClcbiAgICAgIC50aGVuIChyZWYpID0+XG4gICAgICAgIGlmIGZvcmNlXG4gICAgICAgICAgcmVmU3BlYyA9ICcrJyArIHJlZlNwZWNcbiAgICAgICAgcmVmU3BlYyA9IFwicmVmcy9oZWFkcy8je3JlZi5zaG9ydGhhbmQoKX06cmVmcy9oZWFkcy8je3JlZi5zaG9ydGhhbmQoKX1cIlxuXG4gICAgICAgIEdpdC5SZW1vdGUubG9va3VwIHJlcG8sICQoJyNnaXQtZ3VpLXJlbW90ZXMtbGlzdCcpLnZhbCgpXG4gICAgICAgIC50aGVuIChyZW1vdGUpID0+XG4gICAgICAgICAgdXJsID0gcmVtb3RlLnVybCgpXG4gICAgICAgICAgaWYgKHVybC5pbmRleE9mKFwiaHR0cHNcIikgPT0gLSAxKVxuICAgICAgICAgICAgQG9wZW5TU0hQdXNoIHJlbW90ZSwgcmVmU3BlYywgcmVmLnNob3J0aGFuZCgpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgJCgnI2FjdGlvbi12aWV3LWFjdGlvbi1idXR0b24nKS50ZXh0ICdQdXNoJ1xuICAgICAgICAgICAgJCgnI2FjdGlvbi12aWV3LWFjdGlvbi1idXR0b24nKS5vZmYgJ2NsaWNrJ1xuICAgICAgICAgICAgJCgnYXRvbS13b3Jrc3BhY2UtYXhpcy5ob3Jpem9udGFsJykuYWRkQ2xhc3MgJ2JsdXInXG4gICAgICAgICAgICAkKCcjYWN0aW9uLXZpZXcnKS5wYXJlbnQoKS5zaG93KClcbiAgICAgICAgICAgICQoJyNhY3Rpb24tdmlldycpLmFkZENsYXNzICdvcGVuJ1xuICAgICAgICAgICAgQGdpdEd1aVB1c2hWaWV3LnNob3coKVxuICAgICAgICAgICAgQG9wZW5QbGFpbnRleHRQdXNoIHJlbW90ZSwgcmVmU3BlYywgcmVmLnNob3J0aGFuZCgpXG5cbiAgb3BlblNTSFB1c2g6IChyZW1vdGUsIHJlZlNwZWMsIHJlZlNob3J0aGFuZCkgLT5cbiAgICAkKCcuZ2l0LWd1aS1zdGFnaW5nLWFyZWEnKS50b2dnbGVDbGFzcygnZmFkZS1hbmQtYmx1cicpXG4gICAgJCgnI2FjdGlvbi1wcm9ncmVzcy1pbmRpY2F0b3InKS5jc3MgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcbiAgICBAZ2l0R3VpUHVzaFZpZXcucHVzaFNTSCByZW1vdGUsIHJlZlNwZWNcbiAgICAudGhlbiAoKSA9PlxuICAgICAgQHNob3dQdXNoU3VjY2VzcyhyZW1vdGUudXJsKCksIHJlZlNob3J0aGFuZClcbiAgICAuY2F0Y2ggKGVycm9yKSA9PlxuICAgICAgQHNob3dQdXNoRXJyb3IgZXJyb3JcbiAgICAudGhlbiAoKSAtPlxuICAgICAgJCgnLmdpdC1ndWktc3RhZ2luZy1hcmVhJykucmVtb3ZlQ2xhc3MoJ2ZhZGUtYW5kLWJsdXInKVxuXG4gIG9wZW5QbGFpbnRleHRQdXNoOiAocmVtb3RlLCByZWZTcGVjLCByZWZTaG9ydGhhbmQpIC0+XG4gICAgJCgnI3B1c2gtcGxhaW50ZXh0LW9wdGlvbnMnKS5jc3MgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgJCgnI2FjdGlvbi12aWV3LWFjdGlvbi1idXR0b24nKS5vbiAnY2xpY2snLCAoKSA9PlxuICAgICAgJCgnI2FjdGlvbi12aWV3LWNsb3NlLWJ1dHRvbicpLmNsaWNrKClcbiAgICAgIEBnaXRHdWlQdXNoVmlldy5oaWRlKClcbiAgICAgICQoJy5naXQtZ3VpLXN0YWdpbmctYXJlYScpLmFkZENsYXNzKCdmYWRlLWFuZC1ibHVyJylcbiAgICAgICQoJyNhY3Rpb24tcHJvZ3Jlc3MtaW5kaWNhdG9yJykuY3NzICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnXG4gICAgICBAZ2l0R3VpUHVzaFZpZXcucHVzaFBsYWluVGV4dCByZW1vdGUsIHJlZlNwZWNcbiAgICAgIC50aGVuICgpID0+XG4gICAgICAgIEBzaG93UHVzaFN1Y2Nlc3MocmVtb3RlLnVybCgpLCByZWZTaG9ydGhhbmQpXG4gICAgICAuY2F0Y2ggKGVycm9yKSA9PlxuICAgICAgICBAc2hvd1B1c2hFcnJvciBlcnJvclxuICAgICAgLnRoZW4gKCkgLT5cbiAgICAgICAgJCgnLmdpdC1ndWktc3RhZ2luZy1hcmVhJykucmVtb3ZlQ2xhc3MoJ2ZhZGUtYW5kLWJsdXInKVxuXG4gIHNob3dQdXNoRXJyb3I6IChlcnJvcikgLT5cbiAgICAkKCcjYWN0aW9uLXByb2dyZXNzLWluZGljYXRvcicpLmNzcyAndmlzaWJpbGl0eScsICdoaWRkZW4nXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiUHVzaCB1bnN1Y2Nlc3NmdWw6XCIsIHtkZXNjcmlwdGlvbjogZXJyb3IudG9TdHJpbmcoKSB9XG5cbiAgc2hvd1B1c2hTdWNjZXNzOiAodXJsLCByZWZTaG9ydGhhbmQpIC0+XG4gICAgJCgnI2FjdGlvbi12aWV3LWFjdGlvbi1idXR0b24nKS5lbXB0eSgpXG4gICAgJCgnI2FjdGlvbi12aWV3LWFjdGlvbi1idXR0b24nKS50ZXh0ICcnXG4gICAgJCgnI2FjdGlvbi12aWV3LWFjdGlvbi1idXR0b24nKS5vZmYgJ2NsaWNrJ1xuICAgICQoJyNwdXNoLWFjdGlvbicpLnJlbW92ZUNsYXNzICdhdmFpbGFibGUnXG4gICAgJCgnI2FjdGlvbi1wcm9ncmVzcy1pbmRpY2F0b3InKS5jc3MgJ3Zpc2liaWxpdHknLCAnaGlkZGVuJ1xuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1wdXNoJ1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiUHVzaCBzdWNjZXNzZnVsOlwiLCB7ZGV0YWlsOiBcIlRvICN7dXJsfVxcblxcdCN7cmVmU2hvcnRoYW5kfSAtPiAje3JlZlNob3J0aGFuZH1cIiB9IClcblxubW9kdWxlLmV4cG9ydHMgPSBHaXRHdWlBY3Rpb25WaWV3XG4iXX0=
