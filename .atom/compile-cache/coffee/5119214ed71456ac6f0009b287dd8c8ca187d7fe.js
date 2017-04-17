(function() {
  var $, Git, GitGuiCommitView, TextEditorView, View, child_process, fs, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require('path');

  fs = require('fs');

  child_process = require('child_process');

  ref = require('space-pen'), $ = ref.$, View = ref.View;

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  Git = require('nodegit');

  GitGuiCommitView = (function(superClass) {
    extend(GitGuiCommitView, superClass);

    function GitGuiCommitView() {
      return GitGuiCommitView.__super__.constructor.apply(this, arguments);
    }

    GitGuiCommitView.content = function() {
      return this.div({
        "class": 'action-view-content'
      }, (function(_this) {
        return function() {
          _this.h2("Subject");
          _this.subview('subjectEditor', new TextEditorView({
            mini: true
          }));
          _this.h2("Body");
          return _this.subview('bodyEditor', new TextEditorView());
        };
      })(this));
    };

    GitGuiCommitView.prototype.initialize = function() {};

    GitGuiCommitView.prototype.destroy = function() {};

    GitGuiCommitView.prototype.commit = function() {
      var promise;
      promise = new Promise((function(_this) {
        return function(resolve, reject) {
          var commitEditMsg, msg, pathToRepo;
          pathToRepo = path.join($('#git-gui-project-list').val(), '.git');
          msg = '';
          if (_this.bodyEditor.model.isEmpty()) {
            msg = _this.subjectEditor.getText();
          } else {
            msg = _this.subjectEditor.getText() + '\n\n' + _this.bodyEditor.getText();
          }
          commitEditMsg = path.join(pathToRepo, 'COMMIT_EDITMSG');
          return fs.writeFile(commitEditMsg, msg, function(err) {
            if (err) {
              return reject(err);
            }
            return _this.commitMsgHook(commitEditMsg).then(function() {
              return Git.Repository.open(pathToRepo).then(function(repo) {
                return repo.refreshIndex().then(function(index) {
                  return index.writeTree().then(function(oid) {
                    var signature;
                    if (repo.isEmpty()) {
                      signature = Git.Signature["default"](repo);
                      return repo.createCommit('HEAD', signature, signature, msg, oid, []);
                    } else {
                      return Git.Reference.nameToId(repo, 'HEAD').then(function(head) {
                        return repo.getCommit(head).then(function(parent) {
                          signature = Git.Signature["default"](repo);
                          return repo.createCommit('HEAD', signature, signature, msg, oid, [parent]).then(function(oid) {
                            return resolve(oid);
                          });
                        });
                      });
                    }
                  });
                });
              });
            })["catch"](function(error) {
              return reject(error);
            });
          });
        };
      })(this));
      return promise;
    };

    GitGuiCommitView.prototype.commitMsgHook = function(commitEditMsg) {
      var promise;
      promise = new Promise(function(resolve, reject) {
        var commitMsgHook;
        commitMsgHook = path.join($('#git-gui-project-list').val(), '.git', 'hooks', 'commit-msg');
        return fs.exists(commitMsgHook, function(exists) {
          if (exists) {
            return child_process.exec(commitMsgHook + " " + commitEditMsg, {
              env: process.env
            }, function(error, stdout, stderr) {
              if (error) {
                return reject(stdout);
              }
              if (stderr) {
                return reject(stdout);
              }
              return resolve();
            });
          } else {
            return resolve();
          }
        });
      });
      return promise;
    };

    return GitGuiCommitView;

  })(View);

  module.exports = GitGuiCommitView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1ndWkvbGliL2dpdC1ndWktY29tbWl0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw0RUFBQTtJQUFBOzs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGVBQVI7O0VBQ2hCLE1BQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLFNBQUQsRUFBSTs7RUFDSCxpQkFBa0IsT0FBQSxDQUFRLHNCQUFSOztFQUNuQixHQUFBLEdBQU0sT0FBQSxDQUFRLFNBQVI7O0VBRUE7Ozs7Ozs7SUFDSixnQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8scUJBQVA7T0FBTCxFQUFtQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDakMsS0FBQyxDQUFBLEVBQUQsQ0FBSSxTQUFKO1VBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxlQUFULEVBQThCLElBQUEsY0FBQSxDQUFlO1lBQUEsSUFBQSxFQUFNLElBQU47V0FBZixDQUE5QjtVQUNBLEtBQUMsQ0FBQSxFQUFELENBQUksTUFBSjtpQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxjQUFBLENBQUEsQ0FBM0I7UUFKaUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DO0lBRFE7OytCQU9WLFVBQUEsR0FBWSxTQUFBLEdBQUE7OytCQUVaLE9BQUEsR0FBUyxTQUFBLEdBQUE7OytCQUVULE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLE9BQUEsR0FBYyxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNB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VixFQUF5QixTQUFDLE1BQUQ7VUFDdkIsSUFBRyxNQUFIO21CQUNFLGFBQWEsQ0FBQyxJQUFkLENBQXNCLGFBQUQsR0FBZSxHQUFmLEdBQWtCLGFBQXZDLEVBQXdEO2NBQUMsR0FBQSxFQUFLLE9BQU8sQ0FBQyxHQUFkO2FBQXhELEVBQTZFLFNBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsTUFBaEI7Y0FDM0UsSUFBRyxLQUFIO0FBQWMsdUJBQU8sTUFBQSxDQUFPLE1BQVAsRUFBckI7O2NBQ0EsSUFBRyxNQUFIO0FBQWUsdUJBQU8sTUFBQSxDQUFPLE1BQVAsRUFBdEI7O0FBQ0EscUJBQU8sT0FBQSxDQUFBO1lBSG9FLENBQTdFLEVBREY7V0FBQSxNQUFBO0FBTUUsbUJBQU8sT0FBQSxDQUFBLEVBTlQ7O1FBRHVCLENBQXpCO01BRm9CLENBQVI7QUFVZCxhQUFPO0lBWE07Ozs7S0FuRGM7O0VBZ0UvQixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQXZFakIiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMnXG5jaGlsZF9wcm9jZXNzID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcbnskLCBWaWV3fSA9IHJlcXVpcmUgJ3NwYWNlLXBlbidcbntUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbkdpdCA9IHJlcXVpcmUgJ25vZGVnaXQnXG5cbmNsYXNzIEdpdEd1aUNvbW1pdFZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICdhY3Rpb24tdmlldy1jb250ZW50JywgPT5cbiAgICAgIEBoMiBcIlN1YmplY3RcIlxuICAgICAgQHN1YnZpZXcgJ3N1YmplY3RFZGl0b3InLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgIEBoMiBcIkJvZHlcIlxuICAgICAgQHN1YnZpZXcgJ2JvZHlFZGl0b3InLCBuZXcgVGV4dEVkaXRvclZpZXcoKVxuXG4gIGluaXRpYWxpemU6IC0+XG5cbiAgZGVzdHJveTogLT5cblxuICBjb21taXQ6ICgpIC0+XG4gICAgcHJvbWlzZSA9IG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBwYXRoVG9SZXBvID0gcGF0aC5qb2luICQoJyNnaXQtZ3VpLXByb2plY3QtbGlzdCcpLnZhbCgpLCAnLmdpdCdcbiAgICAgIG1zZyA9ICcnXG4gICAgICBpZiBAYm9keUVkaXRvci5tb2RlbC5pc0VtcHR5KClcbiAgICAgICAgbXNnID0gQHN1YmplY3RFZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBlbHNlXG4gICAgICAgIG1zZyA9IEBzdWJqZWN0RWRpdG9yLmdldFRleHQoKSArICdcXG5cXG4nICsgQGJvZHlFZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBjb21taXRFZGl0TXNnID0gcGF0aC5qb2luIHBhdGhUb1JlcG8sICdDT01NSVRfRURJVE1TRydcbiAgICAgIGZzLndyaXRlRmlsZSBjb21taXRFZGl0TXNnICwgbXNnLCAoZXJyKSA9PlxuICAgICAgICBpZiBlcnIgdGhlbiByZXR1cm4gcmVqZWN0IGVyclxuICAgICAgICBAY29tbWl0TXNnSG9vayhjb21taXRFZGl0TXNnKVxuICAgICAgICAudGhlbiAoKSAtPlxuICAgICAgICAgIEdpdC5SZXBvc2l0b3J5Lm9wZW4gcGF0aFRvUmVwb1xuICAgICAgICAgIC50aGVuIChyZXBvKSAtPlxuICAgICAgICAgICAgcmVwby5yZWZyZXNoSW5kZXgoKVxuICAgICAgICAgICAgLnRoZW4gKGluZGV4KSAtPlxuICAgICAgICAgICAgICBpbmRleC53cml0ZVRyZWUoKVxuICAgICAgICAgICAgICAudGhlbiAob2lkKSAtPlxuICAgICAgICAgICAgICAgIGlmIHJlcG8uaXNFbXB0eSgpXG4gICAgICAgICAgICAgICAgICBzaWduYXR1cmUgPSBHaXQuU2lnbmF0dXJlLmRlZmF1bHQgcmVwb1xuICAgICAgICAgICAgICAgICAgcmVwby5jcmVhdGVDb21taXQgJ0hFQUQnLCBzaWduYXR1cmUsIHNpZ25hdHVyZSwgbXNnLCBvaWQsIFtdXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgR2l0LlJlZmVyZW5jZS5uYW1lVG9JZCByZXBvLCAnSEVBRCdcbiAgICAgICAgICAgICAgICAgIC50aGVuIChoZWFkKSAtPlxuICAgICAgICAgICAgICAgICAgICByZXBvLmdldENvbW1pdCBoZWFkXG4gICAgICAgICAgICAgICAgICAgIC50aGVuIChwYXJlbnQpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgc2lnbmF0dXJlID0gR2l0LlNpZ25hdHVyZS5kZWZhdWx0IHJlcG9cbiAgICAgICAgICAgICAgICAgICAgICByZXBvLmNyZWF0ZUNvbW1pdCAnSEVBRCcsIHNpZ25hdHVyZSwgc2lnbmF0dXJlLCBtc2csIG9pZCwgW3BhcmVudF1cbiAgICAgICAgICAgICAgICAgICAgICAudGhlbiAob2lkKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUgb2lkXG4gICAgICAgICAgICAgICAgICAgICAgIyAgIEdpdC5Db21taXQuY3JlYXRlV2l0aFNpZ25hdHVyZSByZXBvLCBtZXNzYWdlLCBzaWduYXR1cmUudG9TdHJpbmcoKSwgXCJOVUxMXCJcbiAgICAgICAgICAgICAgICAgICAgICAjICAgLnRoZW4gKG9pZCkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAjICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcIkNvbW1pdCBzdWNjZXNzZnVsOiAje29pZC50b3N0clMoKX1cIilcbiAgICAgICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgICAgICByZXR1cm4gcmVqZWN0IGVycm9yXG5cbiAgICByZXR1cm4gcHJvbWlzZVxuXG4gIGNvbW1pdE1zZ0hvb2s6IChjb21taXRFZGl0TXNnKSAtPlxuICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgY29tbWl0TXNnSG9vayA9IHBhdGguam9pbiAkKCcjZ2l0LWd1aS1wcm9qZWN0LWxpc3QnKS52YWwoKSwgJy5naXQnLCAnaG9va3MnLCAnY29tbWl0LW1zZydcbiAgICAgIGZzLmV4aXN0cyBjb21taXRNc2dIb29rLCAoZXhpc3RzKSAtPlxuICAgICAgICBpZiBleGlzdHNcbiAgICAgICAgICBjaGlsZF9wcm9jZXNzLmV4ZWMgXCIje2NvbW1pdE1zZ0hvb2t9ICN7Y29tbWl0RWRpdE1zZ31cIiwge2VudjogcHJvY2Vzcy5lbnZ9ICwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cbiAgICAgICAgICAgIGlmIGVycm9yIHRoZW4gcmV0dXJuIHJlamVjdCBzdGRvdXRcbiAgICAgICAgICAgIGlmIHN0ZGVyciB0aGVuIHJldHVybiByZWplY3Qgc3Rkb3V0XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgcmV0dXJuIHByb21pc2VcblxubW9kdWxlLmV4cG9ydHMgPSBHaXRHdWlDb21taXRWaWV3XG4iXX0=
