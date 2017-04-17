(function() {
  var $, Git, GitGuiDiffView, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('space-pen'), $ = ref.$, View = ref.View;

  Git = require('nodegit');

  GitGuiDiffView = (function(superClass) {
    extend(GitGuiDiffView, superClass);

    function GitGuiDiffView() {
      return GitGuiDiffView.__super__.constructor.apply(this, arguments);
    }

    GitGuiDiffView.prototype.selectedLines = [];

    GitGuiDiffView.content = function() {
      return this.div({
        "class": 'git-gui-diff-view'
      }, (function(_this) {
        return function() {
          _this.button({
            "class": 'btn',
            click: 'close'
          }, 'Close');
          return _this.div({
            id: 'diff-text'
          });
        };
      })(this));
    };

    GitGuiDiffView.prototype.initialize = function() {
      return $(document).ready((function(_this) {
        return function() {
          return $('body').on('click', '.git-gui-diff-view-hunk-line.status-added, .git-gui-diff-view-hunk-line.status-removed', function(e) {
            var index, line;
            line = $(e.target).data('line');
            if ($(e.target).hasClass('staged')) {
              $(e.target).removeClass('staged');
              index = _this.selectedLines.indexOf(line);
              if (index > -1) {
                return _this.selectedLines.splice(index, 1);
              }
            } else {
              $(e.target).addClass('staged');
              return _this.selectedLines.push(line);
            }
          });
        };
      })(this));
    };

    GitGuiDiffView.prototype.serialize = function() {};

    GitGuiDiffView.prototype.destroy = function() {};

    GitGuiDiffView.prototype.close = function() {
      var pathToRepo;
      $('#diff-text').empty();
      $('.git-gui').removeClass('expanded');
      $('.git-gui-overlay').removeClass('fade-and-blur');
      $('.git-gui-diff-view').removeClass('open');
      if (this.selectedLines.length > 0) {
        pathToRepo = $('#git-gui-project-list').find(':selected').data('repo');
        return Git.Repository.open(pathToRepo).then((function(_this) {
          return function(repo) {
            return repo.stageLines(_this.filename, _this.selectedLines, false).then(function() {
              _this.parentView.gitGuiStagingAreaView.updateStatus(_this.filename);
              atom.notifications.addInfo("Staged " + _this.selectedLines.length + " lines");
              return _this.selectedLines.length = 0;
            })["catch"](function(error) {
              return console.log(error);
            });
          };
        })(this));
      }
    };

    GitGuiDiffView.prototype.setDiffText = function(filename, diff) {
      this.filename = filename;
      $('#diff-text').empty();
      return diff.patches().then((function(_this) {
        return function(patches) {
          var i, len, patch, pathPatch, results;
          pathPatch = patches.filter(function(patch) {
            return patch.newFile().path() === filename;
          });
          results = [];
          for (i = 0, len = pathPatch.length; i < len; i++) {
            patch = pathPatch[i];
            results.push(patch.hunks().then(function(hunks) {
              var hunk, j, len1, results1;
              results1 = [];
              for (j = 0, len1 = hunks.length; j < len1; j++) {
                hunk = hunks[j];
                results1.push(_this.makeHunkDiv(patch, hunk).then(function(hunkDiv) {
                  return $('#diff-text').append(hunkDiv);
                }));
              }
              return results1;
            }));
          }
          return results;
        };
      })(this))["catch"](function(error) {
        return console.log(error);
      });
    };

    GitGuiDiffView.prototype.makeHunkDiv = function(patch, hunk) {
      var promise;
      promise = new Promise(function(resolve, reject) {
        var hunkDiv;
        hunkDiv = $("<div class='git-gui-diff-view-hunk'></div>");
        return hunk.lines().then(function(lines) {
          var hunkDivText, hunkLine, hunkLineText, i, len, line, results;
          hunkDivText = 'diff ' + patch.oldFile().path() + ' ' + patch.newFile().path() + '\n';
          hunkDivText += hunk.header();
          $(hunkDiv).text(hunkDivText);
          results = [];
          for (i = 0, len = lines.length; i < len; i++) {
            line = lines[i];
            hunkLine = $("<div class='git-gui-diff-view-hunk-line'></div>");
            hunkLineText = String.fromCharCode(line.origin()) + line.content();
            $(hunkLine).text(hunkLineText);
            if (String.fromCharCode(line.origin()) === '+') {
              $(hunkLine).addClass('status status-added');
              $(hunkLine).data('line', line);
            }
            if (String.fromCharCode(line.origin()) === '-') {
              $(hunkLine).addClass('status status-removed');
              $(hunkLine).data('line', line);
            }
            results.push($(hunkDiv).append(hunkLine));
          }
          return results;
        })["catch"](function(error) {
          return reject(error);
        }).done(function() {
          return resolve(hunkDiv);
        });
      });
      return promise;
    };

    GitGuiDiffView.prototype.stageLine = function() {};

    return GitGuiDiffView;

  })(View);

  module.exports = GitGuiDiffView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1ndWkvbGliL2dpdC1ndWktZGlmZi12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsaUNBQUE7SUFBQTs7O0VBQUEsTUFBWSxPQUFBLENBQVEsV0FBUixDQUFaLEVBQUMsU0FBRCxFQUFJOztFQUNKLEdBQUEsR0FBTSxPQUFBLENBQVEsU0FBUjs7RUFFQTs7Ozs7Ozs2QkFDSixhQUFBLEdBQWU7O0lBRWYsY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sbUJBQVA7T0FBTCxFQUFpQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDL0IsS0FBQyxDQUFBLE1BQUQsQ0FBUTtZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sS0FBUDtZQUFjLEtBQUEsRUFBTyxPQUFyQjtXQUFSLEVBQXNDLE9BQXRDO2lCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxFQUFBLEVBQUksV0FBSjtXQUFMO1FBRitCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQztJQURROzs2QkFLVixVQUFBLEdBQVksU0FBQTthQUNWLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxLQUFaLENBQWtCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDaEIsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLHdGQUF0QixFQUFnSCxTQUFDLENBQUQ7QUFDOUcsZ0JBQUE7WUFBQSxJQUFBLEdBQU8sQ0FBQSxDQUFFLENBQUMsQ0FBQyxNQUFKLENBQVcsQ0FBQyxJQUFaLENBQWlCLE1BQWpCO1lBQ1AsSUFBRyxDQUFBLENBQUUsQ0FBQyxDQUFDLE1BQUosQ0FBVyxDQUFDLFFBQVosQ0FBcUIsUUFBckIs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VyxDQUFDLFFBQVosQ0FBcUIscUJBQXJCO2NBQ0EsQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLElBQVosQ0FBaUIsTUFBakIsRUFBeUIsSUFBekIsRUFGRjs7WUFHQSxJQUFHLE1BQU0sQ0FBQyxZQUFQLENBQW9CLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBcEIsQ0FBQSxLQUFzQyxHQUF6QztjQUNFLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxRQUFaLENBQXFCLHVCQUFyQjtjQUNBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxJQUFaLENBQWlCLE1BQWpCLEVBQXlCLElBQXpCLEVBRkY7O3lCQUdBLENBQUEsQ0FBRSxPQUFGLENBQVUsQ0FBQyxNQUFYLENBQWtCLFFBQWxCO0FBVkY7O1FBSkksQ0FETixDQWdCQSxFQUFDLEtBQUQsRUFoQkEsQ0FnQk8sU0FBQyxLQUFEO0FBQ0wsaUJBQU8sTUFBQSxDQUFPLEtBQVA7UUFERixDQWhCUCxDQWtCQSxDQUFDLElBbEJELENBa0JNLFNBQUE7QUFDSixpQkFBTyxPQUFBLENBQVEsT0FBUjtRQURILENBbEJOO01BRm9CLENBQVI7QUFzQmQsYUFBTztJQXZCSTs7NkJBeUJiLFNBQUEsR0FBVyxTQUFBLEdBQUE7Ozs7S0FwRmdCOztFQXNGN0IsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUF6RmpCIiwic291cmNlc0NvbnRlbnQiOlsieyQsIFZpZXd9ID0gcmVxdWlyZSAnc3BhY2UtcGVuJ1xuR2l0ID0gcmVxdWlyZSAnbm9kZWdpdCdcblxuY2xhc3MgR2l0R3VpRGlmZlZpZXcgZXh0ZW5kcyBWaWV3XG4gIHNlbGVjdGVkTGluZXM6IFtdXG5cbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ2dpdC1ndWktZGlmZi12aWV3JywgPT5cbiAgICAgIEBidXR0b24gY2xhc3M6ICdidG4nLCBjbGljazogJ2Nsb3NlJywgJ0Nsb3NlJ1xuICAgICAgQGRpdiBpZDogJ2RpZmYtdGV4dCdcblxuICBpbml0aWFsaXplOiAtPlxuICAgICQoZG9jdW1lbnQpLnJlYWR5ICgpID0+XG4gICAgICAkKCdib2R5Jykub24gJ2NsaWNrJywgJy5naXQtZ3VpLWRpZmYtdmlldy1odW5rLWxpbmUuc3RhdHVzLWFkZGVkLCAuZ2l0LWd1aS1kaWZmLXZpZXctaHVuay1saW5lLnN0YXR1cy1yZW1vdmVkJywgKGUpID0+XG4gICAgICAgIGxpbmUgPSAkKGUudGFyZ2V0KS5kYXRhICdsaW5lJ1xuICAgICAgICBpZiAkKGUudGFyZ2V0KS5oYXNDbGFzcygnc3RhZ2VkJylcbiAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnc3RhZ2VkJylcbiAgICAgICAgICBpbmRleCA9IEBzZWxlY3RlZExpbmVzLmluZGV4T2YobGluZSlcbiAgICAgICAgICBpZiBpbmRleCA+IC0gMVxuICAgICAgICAgICAgQHNlbGVjdGVkTGluZXMuc3BsaWNlIGluZGV4LCAxXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnc3RhZ2VkJylcbiAgICAgICAgICBAc2VsZWN0ZWRMaW5lcy5wdXNoIGxpbmVcblxuICBzZXJpYWxpemU6IC0+XG5cbiAgZGVzdHJveTogLT5cblxuICBjbG9zZTogLT5cbiAgICAkKCcjZGlmZi10ZXh0JykuZW1wdHkoKVxuICAgICQoJy5naXQtZ3VpJykucmVtb3ZlQ2xhc3MgJ2V4cGFuZGVkJ1xuICAgICQoJy5naXQtZ3VpLW92ZXJsYXknKS5yZW1vdmVDbGFzcyAnZmFkZS1hbmQtYmx1cidcbiAgICAkKCcuZ2l0LWd1aS1kaWZmLXZpZXcnKS5yZW1vdmVDbGFzcyAnb3BlbidcbiAgICBpZiBAc2VsZWN0ZWRMaW5lcy5sZW5ndGggPiAwXG4gICAgICBwYXRoVG9SZXBvID0gJCgnI2dpdC1ndWktcHJvamVjdC1saXN0JykuZmluZCgnOnNlbGVjdGVkJykuZGF0YSgncmVwbycpXG4gICAgICBHaXQuUmVwb3NpdG9yeS5vcGVuIHBhdGhUb1JlcG9cbiAgICAgIC50aGVuIChyZXBvKSA9PlxuICAgICAgICByZXBvLnN0YWdlTGluZXMoQGZpbGVuYW1lLCBAc2VsZWN0ZWRMaW5lcywgZmFsc2UpXG4gICAgICAgIC50aGVuICgpID0+XG4gICAgICAgICAgQHBhcmVudFZpZXcuZ2l0R3VpU3RhZ2luZ0FyZWFWaWV3LnVwZGF0ZVN0YXR1cyBAZmlsZW5hbWVcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhcIlN0YWdlZCAje0BzZWxlY3RlZExpbmVzLmxlbmd0aH0gbGluZXNcIilcbiAgICAgICAgICBAc2VsZWN0ZWRMaW5lcy5sZW5ndGggPSAwXG4gICAgICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICAgICAgY29uc29sZS5sb2cgZXJyb3JcblxuICBzZXREaWZmVGV4dDogKGZpbGVuYW1lLCBkaWZmKSAtPlxuICAgIEBmaWxlbmFtZSA9IGZpbGVuYW1lXG4gICAgJCgnI2RpZmYtdGV4dCcpLmVtcHR5KClcbiAgICBkaWZmLnBhdGNoZXMoKVxuICAgIC50aGVuIChwYXRjaGVzKSA9PlxuICAgICAgcGF0aFBhdGNoID0gcGF0Y2hlcy5maWx0ZXIgKHBhdGNoKSAtPlxuICAgICAgICByZXR1cm4gcGF0Y2gubmV3RmlsZSgpLnBhdGgoKSA9PSBmaWxlbmFtZVxuICAgICAgZm9yIHBhdGNoIGluIHBhdGhQYXRjaFxuICAgICAgICBwYXRjaC5odW5rcygpXG4gICAgICAgIC50aGVuIChodW5rcykgPT5cbiAgICAgICAgICBmb3IgaHVuayBpbiBodW5rc1xuICAgICAgICAgICAgQG1ha2VIdW5rRGl2IHBhdGNoLCBodW5rXG4gICAgICAgICAgICAudGhlbiAoaHVua0RpdikgLT5cbiAgICAgICAgICAgICAgJCgnI2RpZmYtdGV4dCcpLmFwcGVuZCBodW5rRGl2XG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUubG9nIGVycm9yXG5cbiAgbWFrZUh1bmtEaXY6IChwYXRjaCwgaHVuaykgLT5cbiAgICBwcm9taXNlID0gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIGh1bmtEaXYgPSAkKFwiPGRpdiBjbGFzcz0nZ2l0LWd1aS1kaWZmLXZpZXctaHVuayc+PC9kaXY+XCIpXG4gICAgICBodW5rLmxpbmVzKClcbiAgICAgIC50aGVuIChsaW5lcykgLT5cbiAgICAgICAgaHVua0RpdlRleHQgPSAnZGlmZiAnICsgcGF0Y2gub2xkRmlsZSgpLnBhdGgoKSArICcgJyArIHBhdGNoLm5ld0ZpbGUoKS5wYXRoKCkgKyAnXFxuJ1xuICAgICAgICBodW5rRGl2VGV4dCArPSBodW5rLmhlYWRlcigpXG4gICAgICAgICQoaHVua0RpdikudGV4dCBodW5rRGl2VGV4dFxuICAgICAgICBmb3IgbGluZSBpbiBsaW5lc1xuICAgICAgICAgIGh1bmtMaW5lID0gJChcIjxkaXYgY2xhc3M9J2dpdC1ndWktZGlmZi12aWV3LWh1bmstbGluZSc+PC9kaXY+XCIpXG4gICAgICAgICAgaHVua0xpbmVUZXh0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShsaW5lLm9yaWdpbigpKSArIGxpbmUuY29udGVudCgpXG4gICAgICAgICAgJChodW5rTGluZSkudGV4dCBodW5rTGluZVRleHRcbiAgICAgICAgICBpZiBTdHJpbmcuZnJvbUNoYXJDb2RlKGxpbmUub3JpZ2luKCkpID09ICcrJ1xuICAgICAgICAgICAgJChodW5rTGluZSkuYWRkQ2xhc3MgJ3N0YXR1cyBzdGF0dXMtYWRkZWQnXG4gICAgICAgICAgICAkKGh1bmtMaW5lKS5kYXRhICdsaW5lJywgbGluZVxuICAgICAgICAgIGlmIFN0cmluZy5mcm9tQ2hhckNvZGUobGluZS5vcmlnaW4oKSkgPT0gJy0nXG4gICAgICAgICAgICAkKGh1bmtMaW5lKS5hZGRDbGFzcyAnc3RhdHVzIHN0YXR1cy1yZW1vdmVkJ1xuICAgICAgICAgICAgJChodW5rTGluZSkuZGF0YSAnbGluZScsIGxpbmVcbiAgICAgICAgICAkKGh1bmtEaXYpLmFwcGVuZCBodW5rTGluZVxuICAgICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgICAgcmV0dXJuIHJlamVjdCBlcnJvclxuICAgICAgLmRvbmUgKCkgLT5cbiAgICAgICAgcmV0dXJuIHJlc29sdmUgaHVua0RpdlxuICAgIHJldHVybiBwcm9taXNlXG5cbiAgc3RhZ2VMaW5lOiAoKSAtPlxuXG5tb2R1bGUuZXhwb3J0cyA9IEdpdEd1aURpZmZWaWV3XG4iXX0=
