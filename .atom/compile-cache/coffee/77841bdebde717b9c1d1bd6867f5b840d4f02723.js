(function() {
  var $, Emitter, Git, GitGuiStagingAreaView, View, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require('path');

  ref = require('space-pen'), $ = ref.$, View = ref.View;

  Git = require('nodegit');

  Emitter = require('atom').Emitter;

  GitGuiStagingAreaView = (function(superClass) {
    extend(GitGuiStagingAreaView, superClass);

    function GitGuiStagingAreaView() {
      return GitGuiStagingAreaView.__super__.constructor.apply(this, arguments);
    }

    GitGuiStagingAreaView.content = function() {
      return this.div({
        "class": 'git-gui-staging-area'
      }, (function(_this) {
        return function() {
          return _this.ol({
            "class": 'list-group',
            id: 'status-list'
          });
        };
      })(this));
    };

    GitGuiStagingAreaView.prototype.initialize = function() {
      this.emitter = new Emitter;
      return $(document).ready((function(_this) {
        return function() {
          $('#status-list').on('click', '#staging-area-file', function(e) {
            var filename, pathToRepo;
            filename = $(e.target).data('file');
            pathToRepo = $('#git-gui-project-list').find(':selected').data('repo');
            return Git.Repository.open(pathToRepo).then(function(repo) {
              return repo.refreshIndex().then(function(index) {
                if ($(e.target).data('staged')) {
                  return repo.getHeadCommit().then(function(commit) {
                    return Git.Reset["default"](repo, commit, filename).then(function() {
                      index.write();
                      return _this.updateStatus(filename);
                    });
                  });
                } else if ($(e.target).data('removed')) {
                  return index.removeByPath(filename).then(function() {
                    index.write();
                    return _this.updateStatus(filename);
                  });
                } else {
                  return index.addByPath(filename).then(function() {
                    index.write();
                    return _this.updateStatus(filename);
                  });
                }
              });
            })["catch"](function(error) {
              return console.log(error);
            });
          });
          $('#status-list').on('click', '#staging-area-file-diff', function(e) {
            var filename, pathToRepo;
            $('.git-gui-overlay').addClass('fade-and-blur');
            $('.git-gui.open').toggleClass('expanded');
            $('.git-gui-diff-view').toggleClass('open');
            filename = $(e.target).data("file");
            pathToRepo = $('#git-gui-project-list').find(':selected').data('repo');
            return Git.Repository.open(pathToRepo).then(function(repo) {
              return repo.getHeadCommit().then(function(commit) {
                return repo.getTree(commit.treeId()).then(function(tree) {
                  return repo.refreshIndex().then(function(index) {
                    if ($(e.target).data('staged')) {
                      return Git.Diff.treeToIndex(repo, tree, index, null).then(function(diff) {
                        return _this.parentView.gitGuiDiffView.setDiffText(filename, diff);
                      });
                    } else {
                      return Git.Diff.treeToWorkdir(repo, tree, index, null).then(function(diff) {
                        return _this.parentView.gitGuiDiffView.setDiffText(filename, diff);
                      });
                    }
                  });
                });
              });
            })["catch"](function(error) {
              return console.log(error);
            });
          });
          return $('#status-list').on('click', '#staging-area-file-remove', function(e) {
            var filename;
            filename = $(e.target).data("file");
            return atom.confirm({
              message: "Remove changes?",
              detailedMessage: "This will remove the changes made to:\n\t " + filename,
              buttons: {
                Ok: function() {
                  var pathToRepo;
                  filename = $(e.target).data("file");
                  pathToRepo = $('#git-gui-project-list').find(':selected').data('repo');
                  return Git.Repository.open(pathToRepo).then(function(repo) {
                    return repo.getHeadCommit().then(function(commit) {
                      var checkoutOptions;
                      checkoutOptions = new Git.CheckoutOptions();
                      checkoutOptions.paths = [filename];
                      return Git.Reset.reset(repo, commit, Git.Reset.TYPE.HARD, checkoutOptions).then(function() {
                        return _this.updateStatuses();
                      });
                    });
                  })["catch"](function(error) {
                    return console.log(error);
                  });
                },
                Cancel: function() {}
              }
            });
          });
        };
      })(this));
    };

    GitGuiStagingAreaView.prototype.serialize = function() {};

    GitGuiStagingAreaView.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    GitGuiStagingAreaView.prototype.onDidUpdateStatus = function(callback) {
      return this.emitter.on('did-update-status', callback);
    };

    GitGuiStagingAreaView.prototype.updateStatus = function(filePath) {
      var file, pathToRepo;
      pathToRepo = $('#git-gui-project-list').find(':selected').data('repo');
      file = atom.project.relativizePath(filePath)[1];
      return Git.Repository.open(pathToRepo).then((function(_this) {
        return function(repo) {
          var li, status;
          status = Git.Status.file(repo, file);
          li = _this.makeStatusListItem(file, status);
          if ($("[id='" + file + "']").length) {
            if (li) {
              $("[id='" + file + "']").html($(li).children());
            } else {
              $("[id='" + file + "']").remove();
            }
          } else {
            $('#status-list').append(li);
          }
          return _this.emitter.emit('did-update-status');
        };
      })(this))["catch"](function(error) {
        return console.log(error);
      });
    };

    GitGuiStagingAreaView.prototype.updateStatuses = function() {
      var pathToRepo;
      $('#status-list').empty();
      pathToRepo = path.join($('#git-gui-project-list').val(), '.git');
      return Git.Repository.open(pathToRepo).then((function(_this) {
        return function(repo) {
          return repo.getStatus().then(function(statuses) {
            var file, i, len, li, status;
            if (statuses.length > 0) {
              for (i = 0, len = statuses.length; i < len; i++) {
                file = statuses[i];
                status = Git.Status.file(repo, file.path());
                li = _this.makeStatusListItem(file.path(), status);
                if (li) {
                  $('#status-list').append(li);
                }
              }
            }
            return _this.emitter.emit('did-update-status');
          });
        };
      })(this))["catch"](function(error) {
        return console.log(error);
      });
    };

    GitGuiStagingAreaView.prototype.makeStatusListItem = function(filePath, status) {
      var diffSpan, fileSpan, indexSpan, li, removeSpan, statusSpan;
      li = $("<li class='list-item git-gui-status-list-item' id='" + filePath + "'></li");
      statusSpan = $("<span class='status icon'></span>");
      indexSpan = $("<span class='status status-added icon icon-check'></span>");
      fileSpan = $("<span id='staging-area-file' data-file='" + filePath + "' data-staged='false' data-removed='false'>" + filePath + "</span>");
      removeSpan = $("<span class='icon icon-trashcan' id='staging-area-file-remove' data-file='" + filePath + "'></span>");
      diffSpan = $("<span class='icon icon-diff' id='staging-area-file-diff' data-file='" + filePath + "' data-staged='false'></span>");
      li.append(statusSpan);
      li.append(indexSpan);
      li.append(fileSpan);
      indexSpan.css('opacity', 0);
      switch (status) {
        case Git.Status.STATUS.INDEX_NEW:
          $(fileSpan).data('staged', true);
          $(diffSpan).data('staged', true);
          statusSpan.addClass('status-added icon-diff-added');
          indexSpan.css('opacity', 1);
          break;
        case Git.Status.STATUS.WT_NEW:
          statusSpan.addClass('status-added icon-diff-added');
          break;
        case Git.Status.STATUS.INDEX_MODIFIED:
          li.append(diffSpan);
          li.append(removeSpan);
          $(fileSpan).data('staged', true);
          $(diffSpan).data('staged', true);
          statusSpan.addClass('status-modified icon-diff-modified');
          indexSpan.css('opacity', 1);
          break;
        case Git.Status.STATUS.WT_MODIFIED:
          li.append(diffSpan);
          li.append(removeSpan);
          statusSpan.addClass('status-modified icon-diff-modified');
          break;
        case Git.Status.STATUS.INDEX_NEW + Git.Status.STATUS.WT_MODIFIED:
        case Git.Status.STATUS.INDEX_MODIFIED + Git.Status.STATUS.WT_MODIFIED:
          li.append(diffSpan);
          li.append(removeSpan);
          $(fileSpan).data('staged', true);
          $(diffSpan).data('staged', true);
          statusSpan.addClass('status-modified icon-diff-modified');
          indexSpan.removeClass('status-added');
          indexSpan.addClass('status-modified');
          indexSpan.css('opacity', 1);
          break;
        case Git.Status.STATUS.INDEX_NEW + Git.Status.STATUS.WT_DELETED:
        case Git.Status.STATUS.INDEX_MODIFIED + Git.Status.STATUS.WT_DELETED:
          li.append(diffSpan);
          li.append(removeSpan);
          $(fileSpan).data('removed', true);
          $(diffSpan).data('staged', true);
          statusSpan.addClass('status-modified icon-diff-modified');
          indexSpan.removeClass('status-added');
          indexSpan.addClass('status-removed');
          indexSpan.css('opacity', 1);
          break;
        case Git.Status.STATUS.INDEX_DELETED:
          li.append(removeSpan);
          $(fileSpan).data('staged', true);
          $(diffSpan).data('staged', true);
          statusSpan.addClass('status-removed icon-diff-removed');
          indexSpan.css('opacity', 1);
          break;
        case Git.Status.STATUS.WT_DELETED:
          li.append(removeSpan);
          statusSpan.addClass('status-removed icon-diff-removed');
          $(fileSpan).data('removed', true);
          break;
        case Git.Status.STATUS.INDEX_RENAMED:
          $(fileSpan).data('staged', true);
          $(diffSpan).data('staged', true);
          statusSpan.addClass('status-renamed icon-diff-renamed');
          indexSpan.css('opacity', 1);
          break;
        case Git.Status.STATUS.WT_RENAMED:
          statusSpan.addClass('status-renamed icon-diff-renamed');
          break;
        case Git.Status.STATUS.IGNORED:
          statusSpan.addClass('status-ignored icon-diff-ignored');
          break;
        case Git.Status.STATUS.CURRENT:
          return null;
        default:
          console.log("Unmatched status " + status);
      }
      return li;
    };

    return GitGuiStagingAreaView;

  })(View);

  module.exports = GitGuiStagingAreaView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1ndWkvbGliL2dpdC1ndWktc3RhZ2luZy1hcmVhLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx1REFBQTtJQUFBOzs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBWSxPQUFBLENBQVEsV0FBUixDQUFaLEVBQUMsU0FBRCxFQUFJOztFQUNKLEdBQUEsR0FBTSxPQUFBLENBQVEsU0FBUjs7RUFDTCxVQUFXLE9BQUEsQ0FBUSxNQUFSOztFQUVOOzs7Ozs7O0lBQ0oscUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHNCQUFQO09BQUwsRUFBb0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNsQyxLQUFDLENBQUEsRUFBRCxDQUFJO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQUFQO1lBQXFCLEVBQUEsRUFBSSxhQUF6QjtXQUFKO1FBRGtDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQztJQURROztvQ0FJVixVQUFBLEdBQVksU0FBQTtNQUNWLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSTthQUVmLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxLQUFaLENBQWtCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNoQixDQUFBLENBQUUsY0FBRixDQUFpQixDQUFDLEVBQWxCLENBQXFCLE9BQXJCLEVBQThCLG9CQUE5QixFQUFvRCxTQUFDLENBQUQ7QUFDbEQsZ0JBQUE7WUFBQSxRQUFBLEdBQVcsQ0FBQSxDQUFFLENBQUMsQ0FBQyxNQUFKLENBQVcsQ0FBQyxJQUFaLENBQWlCLE1BQWpCO1lBQ1gsVUFBQSxHQUFhLENBQUEsQ0FBRSx1QkFBRixDQUEwQixDQUFD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U0FBZCxFQUF5QixDQUF6QjtBQUpHO0FBL0NQLGFBb0RPLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBcER6QjtVQXFESSxVQUFVLENBQUMsUUFBWCxDQUFvQixrQ0FBcEI7QUFERztBQXBEUCxhQXNETyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQXREekI7VUF1REksVUFBVSxDQUFDLFFBQVgsQ0FBb0Isa0NBQXBCO0FBREc7QUF0RFAsYUF3RE8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0F4RHpCO0FBeURJLGlCQUFPO0FBekRYO1VBMkRJLE9BQU8sQ0FBQyxHQUFSLENBQVksbUJBQUEsR0FBb0IsTUFBaEM7QUEzREo7QUE0REEsYUFBTztJQXpFVzs7OztLQWpJYzs7RUE0TXBDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBak5qQiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xueyQsIFZpZXd9ID0gcmVxdWlyZSAnc3BhY2UtcGVuJ1xuR2l0ID0gcmVxdWlyZSAnbm9kZWdpdCdcbntFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nXG5cbmNsYXNzIEdpdEd1aVN0YWdpbmdBcmVhVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ2dpdC1ndWktc3RhZ2luZy1hcmVhJywgPT5cbiAgICAgIEBvbCBjbGFzczogJ2xpc3QtZ3JvdXAnLCBpZDogJ3N0YXR1cy1saXN0J1xuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuXG4gICAgJChkb2N1bWVudCkucmVhZHkgKCkgPT5cbiAgICAgICQoJyNzdGF0dXMtbGlzdCcpLm9uICdjbGljaycsICcjc3RhZ2luZy1hcmVhLWZpbGUnLCAoZSkgPT5cbiAgICAgICAgZmlsZW5hbWUgPSAkKGUudGFyZ2V0KS5kYXRhICdmaWxlJ1xuICAgICAgICBwYXRoVG9SZXBvID0gJCgnI2dpdC1ndWktcHJvamVjdC1saXN0JykuZmluZCgnOnNlbGVjdGVkJykuZGF0YSgncmVwbycpXG4gICAgICAgIEdpdC5SZXBvc2l0b3J5Lm9wZW4gcGF0aFRvUmVwb1xuICAgICAgICAudGhlbiAocmVwbykgPT5cbiAgICAgICAgICByZXBvLnJlZnJlc2hJbmRleCgpXG4gICAgICAgICAgLnRoZW4gKGluZGV4KSA9PlxuICAgICAgICAgICAgIyBSZXNldCB0aGUgZmlsZSBpZiBzdGFnZWRcbiAgICAgICAgICAgIGlmICQoZS50YXJnZXQpLmRhdGEgJ3N0YWdlZCdcbiAgICAgICAgICAgICAgcmVwby5nZXRIZWFkQ29tbWl0KClcbiAgICAgICAgICAgICAgLnRoZW4gKGNvbW1pdCkgPT5cbiAgICAgICAgICAgICAgICBHaXQuUmVzZXQuZGVmYXVsdCByZXBvLCBjb21taXQsIGZpbGVuYW1lXG4gICAgICAgICAgICAgICAgLnRoZW4gKCkgPT5cbiAgICAgICAgICAgICAgICAgIGluZGV4LndyaXRlKClcbiAgICAgICAgICAgICAgICAgIEB1cGRhdGVTdGF0dXMgZmlsZW5hbWVcbiAgICAgICAgICAgICMgUmVtb3ZlIHRoZSBmaWxlXG4gICAgICAgICAgICBlbHNlIGlmICQoZS50YXJnZXQpLmRhdGEgJ3JlbW92ZWQnXG4gICAgICAgICAgICAgIGluZGV4LnJlbW92ZUJ5UGF0aCBmaWxlbmFtZVxuICAgICAgICAgICAgICAudGhlbiAoKSA9PlxuICAgICAgICAgICAgICAgIGluZGV4LndyaXRlKClcbiAgICAgICAgICAgICAgICBAdXBkYXRlU3RhdHVzIGZpbGVuYW1lXG4gICAgICAgICAgICAjIEFkZCB0aGUgZmlsZSB0byB0aGUgaW5kZXhcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgaW5kZXguYWRkQnlQYXRoIGZpbGVuYW1lXG4gICAgICAgICAgICAgIC50aGVuICgpID0+XG4gICAgICAgICAgICAgICAgaW5kZXgud3JpdGUoKVxuICAgICAgICAgICAgICAgIEB1cGRhdGVTdGF0dXMgZmlsZW5hbWVcbiAgICAgICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgICAgICBjb25zb2xlLmxvZyBlcnJvclxuXG4gICAgICAkKCcjc3RhdHVzLWxpc3QnKS5vbiAnY2xpY2snLCAnI3N0YWdpbmctYXJlYS1maWxlLWRpZmYnLCAoZSkgPT5cbiAgICAgICAgJCgnLmdpdC1ndWktb3ZlcmxheScpLmFkZENsYXNzICdmYWRlLWFuZC1ibHVyJ1xuICAgICAgICAkKCcuZ2l0LWd1aS5vcGVuJykudG9nZ2xlQ2xhc3MgJ2V4cGFuZGVkJ1xuICAgICAgICAkKCcuZ2l0LWd1aS1kaWZmLXZpZXcnKS50b2dnbGVDbGFzcyAnb3BlbidcbiAgICAgICAgZmlsZW5hbWUgPSAkKGUudGFyZ2V0KS5kYXRhKFwiZmlsZVwiKVxuICAgICAgICBwYXRoVG9SZXBvID0gJCgnI2dpdC1ndWktcHJvamVjdC1saXN0JykuZmluZCgnOnNlbGVjdGVkJykuZGF0YSgncmVwbycpXG4gICAgICAgIEdpdC5SZXBvc2l0b3J5Lm9wZW4gcGF0aFRvUmVwb1xuICAgICAgICAudGhlbiAocmVwbykgPT5cbiAgICAgICAgICByZXBvLmdldEhlYWRDb21taXQoKVxuICAgICAgICAgIC50aGVuIChjb21taXQpID0+XG4gICAgICAgICAgICByZXBvLmdldFRyZWUoY29tbWl0LnRyZWVJZCgpKVxuICAgICAgICAgICAgLnRoZW4gKHRyZWUpID0+XG4gICAgICAgICAgICAgIHJlcG8ucmVmcmVzaEluZGV4KClcbiAgICAgICAgICAgICAgLnRoZW4gKGluZGV4KSA9PlxuICAgICAgICAgICAgICAgIGlmICQoZS50YXJnZXQpLmRhdGEoJ3N0YWdlZCcpXG4gICAgICAgICAgICAgICAgICBHaXQuRGlmZi50cmVlVG9JbmRleChyZXBvLCB0cmVlLCBpbmRleCwgbnVsbClcbiAgICAgICAgICAgICAgICAgIC50aGVuIChkaWZmKSA9PlxuICAgICAgICAgICAgICAgICAgICBAcGFyZW50Vmlldy5naXRHdWlEaWZmVmlldy5zZXREaWZmVGV4dCBmaWxlbmFtZSwgZGlmZlxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgIEdpdC5EaWZmLnRyZWVUb1dvcmtkaXIocmVwbywgdHJlZSwgaW5kZXgsIG51bGwpXG4gICAgICAgICAgICAgICAgICAudGhlbiAoZGlmZikgPT5cbiAgICAgICAgICAgICAgICAgICAgQHBhcmVudFZpZXcuZ2l0R3VpRGlmZlZpZXcuc2V0RGlmZlRleHQgZmlsZW5hbWUsIGRpZmZcbiAgICAgICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgICAgICBjb25zb2xlLmxvZyBlcnJvclxuXG4gICAgICAkKCcjc3RhdHVzLWxpc3QnKS5vbiAnY2xpY2snLCAnI3N0YWdpbmctYXJlYS1maWxlLXJlbW92ZScsIChlKSA9PlxuICAgICAgICBmaWxlbmFtZSA9ICQoZS50YXJnZXQpLmRhdGEoXCJmaWxlXCIpXG4gICAgICAgIGF0b20uY29uZmlybVxuICAgICAgICAgIG1lc3NhZ2U6IFwiUmVtb3ZlIGNoYW5nZXM/XCJcbiAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiVGhpcyB3aWxsIHJlbW92ZSB0aGUgY2hhbmdlcyBtYWRlIHRvOlxcblxcdCAje2ZpbGVuYW1lfVwiXG4gICAgICAgICAgYnV0dG9uczpcbiAgICAgICAgICAgIE9rOiA9PlxuICAgICAgICAgICAgICBmaWxlbmFtZSA9ICQoZS50YXJnZXQpLmRhdGEoXCJmaWxlXCIpXG4gICAgICAgICAgICAgIHBhdGhUb1JlcG8gPSAkKCcjZ2l0LWd1aS1wcm9qZWN0LWxpc3QnKS5maW5kKCc6c2VsZWN0ZWQnKS5kYXRhKCdyZXBvJylcbiAgICAgICAgICAgICAgR2l0LlJlcG9zaXRvcnkub3BlbiBwYXRoVG9SZXBvXG4gICAgICAgICAgICAgIC50aGVuIChyZXBvKSA9PlxuICAgICAgICAgICAgICAgIHJlcG8uZ2V0SGVhZENvbW1pdCgpXG4gICAgICAgICAgICAgICAgLnRoZW4gKGNvbW1pdCkgPT5cbiAgICAgICAgICAgICAgICAgIGNoZWNrb3V0T3B0aW9ucyA9IG5ldyBHaXQuQ2hlY2tvdXRPcHRpb25zKClcbiAgICAgICAgICAgICAgICAgIGNoZWNrb3V0T3B0aW9ucy5wYXRocyA9IFtmaWxlbmFtZV1cbiAgICAgICAgICAgICAgICAgIEdpdC5SZXNldC5yZXNldChyZXBvLCBjb21taXQsIEdpdC5SZXNldC5UWVBFLkhBUkQsIGNoZWNrb3V0T3B0aW9ucylcbiAgICAgICAgICAgICAgICAgIC50aGVuICgpID0+XG4gICAgICAgICAgICAgICAgICAgIEB1cGRhdGVTdGF0dXNlcygpXG4gICAgICAgICAgICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cgZXJyb3JcbiAgICAgICAgICAgIENhbmNlbDogLT5cblxuICBzZXJpYWxpemU6IC0+XG5cbiAgZGVzdHJveTogLT5cbiAgICBAZW1pdHRlci5kaXNwb3NlKClcblxuICBvbkRpZFVwZGF0ZVN0YXR1czogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtdXBkYXRlLXN0YXR1cycsIGNhbGxiYWNrXG5cbiAgdXBkYXRlU3RhdHVzOiAoZmlsZVBhdGgpIC0+XG4gICAgcGF0aFRvUmVwbyA9ICQoJyNnaXQtZ3VpLXByb2plY3QtbGlzdCcpLmZpbmQoJzpzZWxlY3RlZCcpLmRhdGEoJ3JlcG8nKVxuICAgIGZpbGUgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzFdXG4gICAgR2l0LlJlcG9zaXRvcnkub3BlbiBwYXRoVG9SZXBvXG4gICAgLnRoZW4gKHJlcG8pID0+XG4gICAgICBzdGF0dXMgPSBHaXQuU3RhdHVzLmZpbGUgcmVwbywgZmlsZVxuICAgICAgbGkgPSBAbWFrZVN0YXR1c0xpc3RJdGVtIGZpbGUsIHN0YXR1c1xuICAgICAgaWYgJChcIltpZD0nI3tmaWxlfSddXCIpLmxlbmd0aFxuICAgICAgICBpZiBsaVxuICAgICAgICAgICQoXCJbaWQ9JyN7ZmlsZX0nXVwiKS5odG1sICQobGkpLmNoaWxkcmVuKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICQoXCJbaWQ9JyN7ZmlsZX0nXVwiKS5yZW1vdmUoKVxuICAgICAgZWxzZVxuICAgICAgICAkKCcjc3RhdHVzLWxpc3QnKS5hcHBlbmQgbGlcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC11cGRhdGUtc3RhdHVzJ1xuICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICBjb25zb2xlLmxvZyBlcnJvclxuXG4gIHVwZGF0ZVN0YXR1c2VzOiAtPlxuICAgICQoJyNzdGF0dXMtbGlzdCcpLmVtcHR5KClcbiAgICBwYXRoVG9SZXBvID0gcGF0aC5qb2luICQoJyNnaXQtZ3VpLXByb2plY3QtbGlzdCcpLnZhbCgpLCAnLmdpdCdcbiAgICBHaXQuUmVwb3NpdG9yeS5vcGVuIHBhdGhUb1JlcG9cbiAgICAudGhlbiAocmVwbykgPT5cbiAgICAgIHJlcG8uZ2V0U3RhdHVzKClcbiAgICAgIC50aGVuIChzdGF0dXNlcykgPT5cbiAgICAgICAgaWYgc3RhdHVzZXMubGVuZ3RoID4gMFxuICAgICAgICAgIGZvciBmaWxlIGluIHN0YXR1c2VzXG4gICAgICAgICAgICBzdGF0dXMgPSBHaXQuU3RhdHVzLmZpbGUgcmVwbywgZmlsZS5wYXRoKClcbiAgICAgICAgICAgIGxpID0gQG1ha2VTdGF0dXNMaXN0SXRlbSBmaWxlLnBhdGgoKSwgc3RhdHVzXG4gICAgICAgICAgICBpZiBsaVxuICAgICAgICAgICAgICAkKCcjc3RhdHVzLWxpc3QnKS5hcHBlbmQgbGlcbiAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1zdGF0dXMnXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUubG9nIGVycm9yXG5cbiAgbWFrZVN0YXR1c0xpc3RJdGVtOiAoZmlsZVBhdGgsIHN0YXR1cykgLT5cbiAgICBsaSA9ICQoXCI8bGkgY2xhc3M9J2xpc3QtaXRlbSBnaXQtZ3VpLXN0YXR1cy1saXN0LWl0ZW0nIGlkPScje2ZpbGVQYXRofSc+PC9saVwiKVxuICAgIHN0YXR1c1NwYW4gPSAkKFwiPHNwYW4gY2xhc3M9J3N0YXR1cyBpY29uJz48L3NwYW4+XCIpXG4gICAgaW5kZXhTcGFuID0gJChcIjxzcGFuIGNsYXNzPSdzdGF0dXMgc3RhdHVzLWFkZGVkIGljb24gaWNvbi1jaGVjayc+PC9zcGFuPlwiKVxuICAgIGZpbGVTcGFuID0gJChcIjxzcGFuIGlkPSdzdGFnaW5nLWFyZWEtZmlsZScgZGF0YS1maWxlPScje2ZpbGVQYXRofScgZGF0YS1zdGFnZWQ9J2ZhbHNlJyBkYXRhLXJlbW92ZWQ9J2ZhbHNlJz4je2ZpbGVQYXRofTwvc3Bhbj5cIilcbiAgICByZW1vdmVTcGFuID0gJChcIjxzcGFuIGNsYXNzPSdpY29uIGljb24tdHJhc2hjYW4nIGlkPSdzdGFnaW5nLWFyZWEtZmlsZS1yZW1vdmUnIGRhdGEtZmlsZT0nI3tmaWxlUGF0aH0nPjwvc3Bhbj5cIilcbiAgICBkaWZmU3BhbiA9ICQoXCI8c3BhbiBjbGFzcz0naWNvbiBpY29uLWRpZmYnIGlkPSdzdGFnaW5nLWFyZWEtZmlsZS1kaWZmJyBkYXRhLWZpbGU9JyN7ZmlsZVBhdGh9JyBkYXRhLXN0YWdlZD0nZmFsc2UnPjwvc3Bhbj5cIilcblxuICAgIGxpLmFwcGVuZCBzdGF0dXNTcGFuXG4gICAgbGkuYXBwZW5kIGluZGV4U3BhblxuICAgIGxpLmFwcGVuZCBmaWxlU3BhblxuXG4gICAgaW5kZXhTcGFuLmNzcyAnb3BhY2l0eScsIDBcbiAgICBzd2l0Y2ggc3RhdHVzXG4gICAgICB3aGVuIEdpdC5TdGF0dXMuU1RBVFVTLklOREVYX05FV1xuICAgICAgICAkKGZpbGVTcGFuKS5kYXRhICdzdGFnZWQnLCB0cnVlXG4gICAgICAgICQoZGlmZlNwYW4pLmRhdGEgJ3N0YWdlZCcsIHRydWVcbiAgICAgICAgc3RhdHVzU3Bhbi5hZGRDbGFzcyAnc3RhdHVzLWFkZGVkIGljb24tZGlmZi1hZGRlZCdcbiAgICAgICAgaW5kZXhTcGFuLmNzcyAnb3BhY2l0eScsIDFcbiAgICAgIHdoZW4gR2l0LlN0YXR1cy5TVEFUVVMuV1RfTkVXXG4gICAgICAgIHN0YXR1c1NwYW4uYWRkQ2xhc3MgJ3N0YXR1cy1hZGRlZCBpY29uLWRpZmYtYWRkZWQnXG4gICAgICB3aGVuIEdpdC5TdGF0dXMuU1RBVFVTLklOREVYX01PRElGSUVEXG4gICAgICAgIGxpLmFwcGVuZCBkaWZmU3BhblxuICAgICAgICBsaS5hcHBlbmQgcmVtb3ZlU3BhblxuICAgICAgICAkKGZpbGVTcGFuKS5kYXRhICdzdGFnZWQnLCB0cnVlXG4gICAgICAgICQoZGlmZlNwYW4pLmRhdGEgJ3N0YWdlZCcsIHRydWVcbiAgICAgICAgc3RhdHVzU3Bhbi5hZGRDbGFzcyAnc3RhdHVzLW1vZGlmaWVkIGljb24tZGlmZi1tb2RpZmllZCdcbiAgICAgICAgaW5kZXhTcGFuLmNzcyAnb3BhY2l0eScsIDFcbiAgICAgIHdoZW4gR2l0LlN0YXR1cy5TVEFUVVMuV1RfTU9ESUZJRURcbiAgICAgICAgbGkuYXBwZW5kIGRpZmZTcGFuXG4gICAgICAgIGxpLmFwcGVuZCByZW1vdmVTcGFuXG4gICAgICAgIHN0YXR1c1NwYW4uYWRkQ2xhc3MgJ3N0YXR1cy1tb2RpZmllZCBpY29uLWRpZmYtbW9kaWZpZWQnXG4gICAgICB3aGVuIEdpdC5TdGF0dXMuU1RBVFVTLklOREVYX05FVyArIEdpdC5TdGF0dXMuU1RBVFVTLldUX01PRElGSUVELCBHaXQuU3RhdHVzLlNUQVRVUy5JTkRFWF9NT0RJRklFRCArIEdpdC5TdGF0dXMuU1RBVFVTLldUX01PRElGSUVEXG4gICAgICAgIGxpLmFwcGVuZCBkaWZmU3BhblxuICAgICAgICBsaS5hcHBlbmQgcmVtb3ZlU3BhblxuICAgICAgICAkKGZpbGVTcGFuKS5kYXRhICdzdGFnZWQnLCB0cnVlXG4gICAgICAgICQoZGlmZlNwYW4pLmRhdGEgJ3N0YWdlZCcsIHRydWVcbiAgICAgICAgc3RhdHVzU3Bhbi5hZGRDbGFzcyAnc3RhdHVzLW1vZGlmaWVkIGljb24tZGlmZi1tb2RpZmllZCdcbiAgICAgICAgaW5kZXhTcGFuLnJlbW92ZUNsYXNzICdzdGF0dXMtYWRkZWQnXG4gICAgICAgIGluZGV4U3Bhbi5hZGRDbGFzcyAnc3RhdHVzLW1vZGlmaWVkJ1xuICAgICAgICBpbmRleFNwYW4uY3NzICdvcGFjaXR5JywgMVxuICAgICAgd2hlbiBHaXQuU3RhdHVzLlNUQVRVUy5JTkRFWF9ORVcgKyBHaXQuU3RhdHVzLlNUQVRVUy5XVF9ERUxFVEVELCBHaXQuU3RhdHVzLlNUQVRVUy5JTkRFWF9NT0RJRklFRCArIEdpdC5TdGF0dXMuU1RBVFVTLldUX0RFTEVURURcbiAgICAgICAgbGkuYXBwZW5kIGRpZmZTcGFuXG4gICAgICAgIGxpLmFwcGVuZCByZW1vdmVTcGFuXG4gICAgICAgICQoZmlsZVNwYW4pLmRhdGEgJ3JlbW92ZWQnLCB0cnVlXG4gICAgICAgICQoZGlmZlNwYW4pLmRhdGEgJ3N0YWdlZCcsIHRydWVcbiAgICAgICAgc3RhdHVzU3Bhbi5hZGRDbGFzcyAnc3RhdHVzLW1vZGlmaWVkIGljb24tZGlmZi1tb2RpZmllZCdcbiAgICAgICAgaW5kZXhTcGFuLnJlbW92ZUNsYXNzICdzdGF0dXMtYWRkZWQnXG4gICAgICAgIGluZGV4U3Bhbi5hZGRDbGFzcyAnc3RhdHVzLXJlbW92ZWQnXG4gICAgICAgIGluZGV4U3Bhbi5jc3MgJ29wYWNpdHknLCAxXG4gICAgICB3aGVuIEdpdC5TdGF0dXMuU1RBVFVTLklOREVYX0RFTEVURURcbiAgICAgICAgbGkuYXBwZW5kIHJlbW92ZVNwYW5cbiAgICAgICAgJChmaWxlU3BhbikuZGF0YSAnc3RhZ2VkJywgdHJ1ZVxuICAgICAgICAkKGRpZmZTcGFuKS5kYXRhICdzdGFnZWQnLCB0cnVlXG4gICAgICAgIHN0YXR1c1NwYW4uYWRkQ2xhc3MgJ3N0YXR1cy1yZW1vdmVkIGljb24tZGlmZi1yZW1vdmVkJ1xuICAgICAgICBpbmRleFNwYW4uY3NzICdvcGFjaXR5JywgMVxuICAgICAgd2hlbiBHaXQuU3RhdHVzLlNUQVRVUy5XVF9ERUxFVEVEXG4gICAgICAgIGxpLmFwcGVuZCByZW1vdmVTcGFuXG4gICAgICAgIHN0YXR1c1NwYW4uYWRkQ2xhc3MgJ3N0YXR1cy1yZW1vdmVkIGljb24tZGlmZi1yZW1vdmVkJ1xuICAgICAgICAkKGZpbGVTcGFuKS5kYXRhICdyZW1vdmVkJywgdHJ1ZVxuICAgICAgd2hlbiBHaXQuU3RhdHVzLlNUQVRVUy5JTkRFWF9SRU5BTUVEXG4gICAgICAgICQoZmlsZVNwYW4pLmRhdGEgJ3N0YWdlZCcsIHRydWVcbiAgICAgICAgJChkaWZmU3BhbikuZGF0YSAnc3RhZ2VkJywgdHJ1ZVxuICAgICAgICBzdGF0dXNTcGFuLmFkZENsYXNzICdzdGF0dXMtcmVuYW1lZCBpY29uLWRpZmYtcmVuYW1lZCdcbiAgICAgICAgaW5kZXhTcGFuLmNzcyAnb3BhY2l0eScsIDFcbiAgICAgIHdoZW4gR2l0LlN0YXR1cy5TVEFUVVMuV1RfUkVOQU1FRFxuICAgICAgICBzdGF0dXNTcGFuLmFkZENsYXNzICdzdGF0dXMtcmVuYW1lZCBpY29uLWRpZmYtcmVuYW1lZCdcbiAgICAgIHdoZW4gR2l0LlN0YXR1cy5TVEFUVVMuSUdOT1JFRFxuICAgICAgICBzdGF0dXNTcGFuLmFkZENsYXNzICdzdGF0dXMtaWdub3JlZCBpY29uLWRpZmYtaWdub3JlZCdcbiAgICAgIHdoZW4gR2l0LlN0YXR1cy5TVEFUVVMuQ1VSUkVOVFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyBcIlVubWF0Y2hlZCBzdGF0dXMgI3tzdGF0dXN9XCJcbiAgICByZXR1cm4gbGlcblxubW9kdWxlLmV4cG9ydHMgPSBHaXRHdWlTdGFnaW5nQXJlYVZpZXdcbiJdfQ==
