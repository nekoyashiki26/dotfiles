(function() {
  var $, Git, GitGuiPushView, TextEditorView, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('space-pen'), $ = ref.$, View = ref.View;

  Git = require('nodegit');

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  GitGuiPushView = (function(superClass) {
    extend(GitGuiPushView, superClass);

    function GitGuiPushView() {
      return GitGuiPushView.__super__.constructor.apply(this, arguments);
    }

    GitGuiPushView.content = function() {
      return this.div({
        "class": 'action-view-content'
      }, (function(_this) {
        return function() {
          return _this.div({
            id: 'push-plaintext-options'
          }, function() {
            _this.h2("Username");
            _this.subview('userName', new TextEditorView({
              mini: true
            }));
            _this.h2("Password");
            return _this.subview('userPassword', new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    GitGuiPushView.prototype.initialize = function() {};

    GitGuiPushView.prototype.destroy = function() {};

    GitGuiPushView.prototype.updateRemotes = function(pathToRepo) {
      $('#git-gui-remotes-list').find('option').remove().end();
      return Git.Repository.open(pathToRepo).then(function(repo) {
        return Git.Remote.list(repo).then(function(remotes) {
          var i, len, option, remote, results;
          results = [];
          for (i = 0, len = remotes.length; i < len; i++) {
            remote = remotes[i];
            option = "<option value=" + remote + ">" + remote + "</option>";
            results.push($('#git-gui-remotes-list').append($(option)));
          }
          return results;
        });
      });
    };

    GitGuiPushView.prototype.pushPlainText = function(remote, refSpec) {
      var promise;
      promise = new Promise((function(_this) {
        return function(resolve, reject) {
          var attempt;
          attempt = true;
          return remote.push([refSpec], {
            callbacks: {
              certificateCheck: function() {
                return 1;
              },
              credentials: function() {
                if (attempt) {
                  attempt = false;
                  return Git.Cred.userpassPlaintextNew(_this.userName.getText(), _this.userPassword.getText());
                } else {
                  return Git.Cred.defaultNew();
                }
              },
              transferProgress: function(stats) {
                return console.log(stats);
              }
            }
          }).then(function() {
            return resolve();
          })["catch"](function(error) {
            return reject(error);
          });
        };
      })(this));
      return promise;
    };

    GitGuiPushView.prototype.pushSSH = function(remote, refSpec) {
      var promise;
      promise = new Promise(function(resolve, reject) {
        var attempt;
        attempt = true;
        return remote.push([refSpec], {
          callbacks: {
            certificateCheck: function() {
              return 1;
            },
            credentials: function(url, userName) {
              if (attempt) {
                attempt = false;
                return Git.Cred.sshKeyFromAgent(userName);
              } else {
                return Git.Cred.defaultNew();
              }
            },
            transferProgress: function(stats) {
              return console.log(stats);
            }
          }
        }).then(function() {
          return resolve();
        })["catch"](function(error) {
          return reject(error);
        });
      });
      return promise;
    };

    return GitGuiPushView;

  })(View);

  module.exports = GitGuiPushView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1ndWkvbGliL2dpdC1ndWktcHVzaC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsaURBQUE7SUFBQTs7O0VBQUEsTUFBWSxPQUFBLENBQVEsV0FBUixDQUFaLEVBQUMsU0FBRCxFQUFJOztFQUNKLEdBQUEsR0FBTSxPQUFBLENBQVEsU0FBUjs7RUFDTCxpQkFBa0IsT0FBQSxDQUFRLHNCQUFSOztFQUViOzs7Ozs7O0lBQ0osY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8scUJBQVA7T0FBTCxFQUFtQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2pDLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxFQUFBLEVBQUksd0JBQUo7V0FBTCxFQUFtQyxTQUFBO1lBQ2pDLEtBQUMsQ0FBQSxFQUFELENBQUksVUFBSjtZQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsVUFBVCxFQUF5QixJQUFBLGNBQUEsQ0FBZTtjQUFBLElBQUEsRUFBTSxJQUFOO2FBQWYsQ0FBekI7WUFDQSxLQUFDLENBQUEsRUFBRCxDQUFJLFVBQUo7bUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxjQUFULEVBQTZCLElBQUEsY0FBQSxDQUFlO2NBQUEsSUFBQSxFQUFNLElBQU47YUFBZixDQUE3QjtVQUppQyxDQUFuQztRQURpQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkM7SUFEUTs7NkJBUVYsVUFBQSxHQUFZLFNBQUEsR0FBQTs7NkJBRVosT0FBQSxHQUFTLFNBQUEsR0FBQTs7NkJBRVQsYUFBQSxHQUFlLFNBQUMsVUFBRDtNQUViLENBQUEsQ0FBRSx1QkFBRixDQUEwQixDQUFDLElBQTNCLENBQWdDLFFBQWhDLENBQXlD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RWpCIiwic291cmNlc0NvbnRlbnQiOlsieyQsIFZpZXd9ID0gcmVxdWlyZSAnc3BhY2UtcGVuJ1xuR2l0ID0gcmVxdWlyZSAnbm9kZWdpdCdcbntUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuY2xhc3MgR2l0R3VpUHVzaFZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICdhY3Rpb24tdmlldy1jb250ZW50JywgPT5cbiAgICAgIEBkaXYgaWQ6ICdwdXNoLXBsYWludGV4dC1vcHRpb25zJywgPT5cbiAgICAgICAgQGgyIFwiVXNlcm5hbWVcIlxuICAgICAgICBAc3VidmlldyAndXNlck5hbWUnLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgICAgQGgyIFwiUGFzc3dvcmRcIlxuICAgICAgICBAc3VidmlldyAndXNlclBhc3N3b3JkJywgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG5cbiAgaW5pdGlhbGl6ZTogLT5cblxuICBkZXN0cm95OiAtPlxuXG4gIHVwZGF0ZVJlbW90ZXM6IChwYXRoVG9SZXBvKSAtPlxuICAgICMgQ2xlYXIgdGhlIGBzZWxlY3RgIG1lbnVcbiAgICAkKCcjZ2l0LWd1aS1yZW1vdGVzLWxpc3QnKS5maW5kKCdvcHRpb24nKS5yZW1vdmUoKS5lbmQoKVxuICAgIEdpdC5SZXBvc2l0b3J5Lm9wZW4gcGF0aFRvUmVwb1xuICAgIC50aGVuIChyZXBvKSAtPlxuICAgICAgR2l0LlJlbW90ZS5saXN0IHJlcG9cbiAgICAgIC50aGVuIChyZW1vdGVzKSAtPlxuICAgICAgICBmb3IgcmVtb3RlIGluIHJlbW90ZXNcbiAgICAgICAgICBvcHRpb24gPSBcIjxvcHRpb24gdmFsdWU9I3tyZW1vdGV9PiN7cmVtb3RlfTwvb3B0aW9uPlwiXG4gICAgICAgICAgJCgnI2dpdC1ndWktcmVtb3Rlcy1saXN0JykuYXBwZW5kICQob3B0aW9uKVxuXG4gIHB1c2hQbGFpblRleHQ6IChyZW1vdGUsIHJlZlNwZWMpIC0+XG4gICAgcHJvbWlzZSA9IG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBhdHRlbXB0ID0gdHJ1ZVxuICAgICAgcmVtb3RlLnB1c2ggW3JlZlNwZWNdLFxuICAgICAgICBjYWxsYmFja3M6XG4gICAgICAgICAgY2VydGlmaWNhdGVDaGVjazogKCkgLT5cbiAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgY3JlZGVudGlhbHM6ICgpID0+XG4gICAgICAgICAgICBpZiBhdHRlbXB0XG4gICAgICAgICAgICAgIGF0dGVtcHQgPSBmYWxzZVxuICAgICAgICAgICAgICByZXR1cm4gR2l0LkNyZWQudXNlcnBhc3NQbGFpbnRleHROZXcgQHVzZXJOYW1lLmdldFRleHQoKSwgQHVzZXJQYXNzd29yZC5nZXRUZXh0KClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgcmV0dXJuIEdpdC5DcmVkLmRlZmF1bHROZXcoKVxuICAgICAgICAgIHRyYW5zZmVyUHJvZ3Jlc3M6IChzdGF0cykgLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nIHN0YXRzXG4gICAgICAudGhlbiAoKSAtPlxuICAgICAgICByZXNvbHZlKClcbiAgICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICAgIHJlamVjdCBlcnJvclxuICAgIHJldHVybiBwcm9taXNlXG5cbiAgcHVzaFNTSDogKHJlbW90ZSwgcmVmU3BlYykgLT5cbiAgICBwcm9taXNlID0gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIGF0dGVtcHQgPSB0cnVlXG4gICAgICByZW1vdGUucHVzaCBbcmVmU3BlY10sXG4gICAgICAgIGNhbGxiYWNrczpcbiAgICAgICAgICBjZXJ0aWZpY2F0ZUNoZWNrOiAoKSAtPlxuICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICBjcmVkZW50aWFsczogKHVybCwgdXNlck5hbWUpIC0+XG4gICAgICAgICAgICBpZiBhdHRlbXB0XG4gICAgICAgICAgICAgIGF0dGVtcHQgPSBmYWxzZVxuICAgICAgICAgICAgICByZXR1cm4gR2l0LkNyZWQuc3NoS2V5RnJvbUFnZW50KHVzZXJOYW1lKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICByZXR1cm4gR2l0LkNyZWQuZGVmYXVsdE5ldygpXG4gICAgICAgICAgdHJhbnNmZXJQcm9ncmVzczogKHN0YXRzKSAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgc3RhdHNcbiAgICAgIC50aGVuICgpIC0+XG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgICAgcmVqZWN0IGVycm9yXG4gICAgcmV0dXJuIHByb21pc2VcblxubW9kdWxlLmV4cG9ydHMgPSBHaXRHdWlQdXNoVmlld1xuIl19
