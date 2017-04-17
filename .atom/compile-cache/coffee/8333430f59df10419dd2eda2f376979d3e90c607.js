(function() {
  var $, $$$, BufferedProcess, Disposable, GitShow, LogListView, View, _, git, numberOfCommitsToShow, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  BufferedProcess = require('atom').BufferedProcess;

  ref = require('atom-space-pen-views'), $ = ref.$, $$$ = ref.$$$, View = ref.View;

  _ = require('underscore-plus');

  git = require('../git');

  GitShow = require('../models/git-show');

  numberOfCommitsToShow = function() {
    return atom.config.get('git-plus.logs.numberOfCommitsToShow');
  };

  module.exports = LogListView = (function(superClass) {
    extend(LogListView, superClass);

    function LogListView() {
      return LogListView.__super__.constructor.apply(this, arguments);
    }

    LogListView.content = function() {
      return this.div({
        "class": 'git-plus-log',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.table({
            id: 'git-plus-commits',
            outlet: 'commitsListView'
          });
          return _this.div({
            "class": 'show-more'
          }, function() {
            return _this.a({
              id: 'show-more'
            }, 'Show More');
          });
        };
      })(this));
    };

    LogListView.prototype.getURI = function() {
      return 'atom://git-plus:log';
    };

    LogListView.prototype.getTitle = function() {
      return 'git-plus: Log';
    };

    LogListView.prototype.initialize = function() {
      var loadMore;
      this.skipCommits = 0;
      this.finished = false;
      loadMore = _.debounce((function(_this) {
        return function() {
          if (_this.prop('scrollHeight') - _this.scrollTop() - _this.height() < 20) {
            return _this.getLog();
          }
        };
      })(this), 50);
      this.on('click', '.commit-row', (function(_this) {
        return function(arg) {
          var currentTarget;
          currentTarget = arg.currentTarget;
          return _this.showCommitLog(currentTarget.getAttribute('hash'));
        };
      })(this));
      this.on('click', '#show-more', loadMore);
      return this.scroll(loadMore);
    };

    LogListView.prototype.attached = function() {
      return this.commandSubscription = atom.commands.add(this.element, {
        'core:move-down': (function(_this) {
          return function() {
            return _this.selectNextResult();
          };
        })(this),
        'core:move-up': (function(_this) {
          return function() {
            return _this.selectPreviousResult();
          };
        })(this),
        'core:page-up': (function(_this) {
          return function() {
            return _this.selectPreviousResult(10);
          };
        })(this),
        'core:page-down': (function(_this) {
          return function() {
            return _this.selectNextResult(10);
          };
        })(this),
        'core:move-to-top': (function(_this) {
          return function() {
            return _this.selectFirstResult();
          };
        })(this),
        'core:move-to-bottom': (function(_this) {
          return function() {
            return _this.selectLastResult();
          };
        })(this),
        'core:confirm': (function(_this) {
          return function() {
            var hash;
            hash = _this.find('.selected').attr('hash');
            if (hash) {
              _this.showCommitLog(hash);
            }
            return false;
          };
        })(this)
      });
    };

    LogListView.prototype.detached = function() {
      this.commandSubscription.dispose();
      return this.commandSubscription = null;
    };

    LogListView.prototype.parseData = function(data) {
      var commits, newline, separator;
      if (data.length < 1) {
        this.finished = true;
        return;
      }
      separator = ';|';
      newline = '_.;._';
      data = data.substring(0, data.length - newline.length - 1);
      commits = data.split(newline).map(function(line) {
        var tmpData;
        if (line.trim() !== '') {
          tmpData = line.trim().split(separator);
          return {
            hashShort: tmpData[0],
            hash: tmpData[1],
            author: tmpData[2],
            email: tmpData[3],
            message: tmpData[4],
            date: tmpData[5]
          };
        }
      });
      return this.renderLog(commits);
    };

    LogListView.prototype.renderHeader = function() {
      var headerRow;
      headerRow = $$$(function() {
        return this.tr({
          "class": 'commit-header'
        }, (function(_this) {
          return function() {
            _this.td('Date');
            _this.td('Message');
            return _this.td({
              "class": 'hashShort'
            }, 'Short Hash');
          };
        })(this));
      });
      return this.commitsListView.append(headerRow);
    };

    LogListView.prototype.renderLog = function(commits) {
      commits.forEach((function(_this) {
        return function(commit) {
          return _this.renderCommit(commit);
        };
      })(this));
      return this.skipCommits += numberOfCommitsToShow();
    };

    LogListView.prototype.renderCommit = function(commit) {
      var commitRow;
      commitRow = $$$(function() {
        return this.tr({
          "class": 'commit-row',
          hash: "" + commit.hash
        }, (function(_this) {
          return function() {
            _this.td({
              "class": 'date'
            }, commit.date + " by " + commit.author);
            _this.td({
              "class": 'message'
            }, "" + commit.message);
            return _this.td({
              "class": 'hashShort'
            }, "" + commit.hashShort);
          };
        })(this));
      });
      return this.commitsListView.append(commitRow);
    };

    LogListView.prototype.showCommitLog = function(hash) {
      return GitShow(this.repo, hash, this.onlyCurrentFile ? this.currentFile : void 0);
    };

    LogListView.prototype.branchLog = function(repo) {
      this.repo = repo;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.onlyCurrentFile = false;
      this.currentFile = null;
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.currentFileLog = function(repo, currentFile) {
      this.repo = repo;
      this.currentFile = currentFile;
      this.onlyCurrentFile = true;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.getLog = function() {
      var args;
      if (this.finished) {
        return;
      }
      args = ['log', "--pretty=%h;|%H;|%aN;|%aE;|%s;|%ai_.;._", "-" + (numberOfCommitsToShow()), '--skip=' + this.skipCommits];
      if (this.onlyCurrentFile && (this.currentFile != null)) {
        args.push(this.currentFile);
      }
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(data) {
          return _this.parseData(data);
        };
      })(this));
    };

    LogListView.prototype.selectFirstResult = function() {
      this.selectResult(this.find('.commit-row:first'));
      return this.scrollToTop();
    };

    LogListView.prototype.selectLastResult = function() {
      this.selectResult(this.find('.commit-row:last'));
      return this.scrollToBottom();
    };

    LogListView.prototype.selectNextResult = function(skip) {
      var nextView, selectedView;
      if (skip == null) {
        skip = 1;
      }
      selectedView = this.find('.selected');
      if (selectedView.length < 1) {
        return this.selectFirstResult();
      }
      nextView = this.getNextResult(selectedView, skip);
      this.selectResult(nextView);
      return this.scrollTo(nextView);
    };

    LogListView.prototype.selectPreviousResult = function(skip) {
      var prevView, selectedView;
      if (skip == null) {
        skip = 1;
      }
      selectedView = this.find('.selected');
      if (selectedView.length < 1) {
        return this.selectFirstResult();
      }
      prevView = this.getPreviousResult(selectedView, skip);
      this.selectResult(prevView);
      return this.scrollTo(prevView);
    };

    LogListView.prototype.getNextResult = function(element, skip) {
      var itemIndex, items;
      if (!(element != null ? element.length : void 0)) {
        return;
      }
      items = this.find('.commit-row');
      itemIndex = items.index(element);
      return $(items[Math.min(itemIndex + skip, items.length - 1)]);
    };

    LogListView.prototype.getPreviousResult = function(element, skip) {
      var itemIndex, items;
      if (!(element != null ? element.length : void 0)) {
        return;
      }
      items = this.find('.commit-row');
      itemIndex = items.index(element);
      return $(items[Math.max(itemIndex - skip, 0)]);
    };

    LogListView.prototype.selectResult = function(resultView) {
      if (!(resultView != null ? resultView.length : void 0)) {
        return;
      }
      this.find('.selected').removeClass('selected');
      return resultView.addClass('selected');
    };

    LogListView.prototype.scrollTo = function(element) {
      var bottom, top;
      if (!(element != null ? element.length : void 0)) {
        return;
      }
      top = this.scrollTop() + element.offset().top - this.offset().top;
      bottom = top + element.outerHeight();
      if (bottom > this.scrollBottom()) {
        this.scrollBottom(bottom);
      }
      if (top < this.scrollTop()) {
        return this.scrollTop(top);
      }
    };

    return LogListView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9sb2ctbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsbUdBQUE7SUFBQTs7O0VBQUMsYUFBYyxPQUFBLENBQVEsTUFBUjs7RUFDZCxrQkFBbUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3BCLE1BQWlCLE9BQUEsQ0FBUSxzQkFBUixDQUFqQixFQUFDLFNBQUQsRUFBSSxhQUFKLEVBQVM7O0VBQ1QsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUjs7RUFFVixxQkFBQSxHQUF3QixTQUFBO1dBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFDQUFoQjtFQUFIOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sY0FBUDtRQUF1QixRQUFBLEVBQVUsQ0FBQyxDQUFsQztPQUFMLEVBQTBDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUN4QyxLQUFDLENBQUEsS0FBRCxDQUFPO1lBQUEsRUFBQSxFQUFJLGtCQUFKO1lBQXdCLE1BQUEsRUFBUSxpQkFBaEM7V0FBUDtpQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFQO1dBQUwsRUFBeUIsU0FBQTttQkFDdkIsS0FBQyxDQUFBLENBQUQsQ0FBRztjQUFBLEVBQUEsRUFBSSxXQUFKO2FBQUgsRUFBb0IsV0FBcEI7VUFEdUIsQ0FBekI7UUFGd0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENB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QUQsQ0FBQSxDQUFBLEdBQWUsT0FBTyxDQUFDLE1BQVIsQ0FBQSxDQUFnQixDQUFDLEdBQWhDLEdBQXNDLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxDQUFDO01BQ3RELE1BQUEsR0FBUyxHQUFBLEdBQU0sT0FBTyxDQUFDLFdBQVIsQ0FBQTtNQUVmLElBQXlCLE1BQUEsR0FBUyxJQUFDLENBQUEsWUFBRCxDQUFBLENBQWxDO1FBQUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxNQUFkLEVBQUE7O01BQ0EsSUFBbUIsR0FBQSxHQUFNLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBekI7ZUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEdBQVgsRUFBQTs7SUFOUTs7OztLQXpKYztBQVYxQiIsInNvdXJjZXNDb250ZW50IjpbIntEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57QnVmZmVyZWRQcm9jZXNzfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgJCQkLCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbkdpdFNob3cgPSByZXF1aXJlICcuLi9tb2RlbHMvZ2l0LXNob3cnXG5cbm51bWJlck9mQ29tbWl0c1RvU2hvdyA9IC0+IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMubG9ncy5udW1iZXJPZkNvbW1pdHNUb1Nob3cnKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBMb2dMaXN0VmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ2dpdC1wbHVzLWxvZycsIHRhYmluZGV4OiAtMSwgPT5cbiAgICAgIEB0YWJsZSBpZDogJ2dpdC1wbHVzLWNvbW1pdHMnLCBvdXRsZXQ6ICdjb21taXRzTGlzdFZpZXcnXG4gICAgICBAZGl2IGNsYXNzOiAnc2hvdy1tb3JlJywgPT5cbiAgICAgICAgQGEgaWQ6ICdzaG93LW1vcmUnLCAnU2hvdyBNb3JlJ1xuXG4gIGdldFVSSTogLT4gJ2F0b206Ly9naXQtcGx1czpsb2cnXG5cbiAgZ2V0VGl0bGU6IC0+ICdnaXQtcGx1czogTG9nJ1xuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQHNraXBDb21taXRzID0gMFxuICAgIEBmaW5pc2hlZCA9IGZhbHNlXG4gICAgbG9hZE1vcmUgPSBfLmRlYm91bmNlKCA9PlxuICAgICAgQGdldExvZygpIGlmIEBwcm9wKCdzY3JvbGxIZWlnaHQnKSAtIEBzY3JvbGxUb3AoKSAtIEBoZWlnaHQoKSA8IDIwXG4gICAgLCA1MClcbiAgICBAb24gJ2NsaWNrJywgJy5jb21taXQtcm93JywgKHtjdXJyZW50VGFyZ2V0fSkgPT5cbiAgICAgIEBzaG93Q29tbWl0TG9nIGN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdoYXNoJylcbiAgICBAb24gJ2NsaWNrJywgJyNzaG93LW1vcmUnLCBsb2FkTW9yZVxuICAgIEBzY3JvbGwobG9hZE1vcmUpXG5cbiAgYXR0YWNoZWQ6IC0+XG4gICAgQGNvbW1hbmRTdWJzY3JpcHRpb24gPSBhdG9tLmNvbW1hbmRzLmFkZCBAZWxlbWVudCxcbiAgICAgICdjb3JlOm1vdmUtZG93bic6ID0+IEBzZWxlY3ROZXh0UmVzdWx0KClcbiAgICAgICdjb3JlOm1vdmUtdXAnOiA9PiBAc2VsZWN0UHJldmlvdXNSZXN1bHQoKVxuICAgICAgJ2NvcmU6cGFnZS11cCc6ID0+IEBzZWxlY3RQcmV2aW91c1Jlc3VsdCgxMClcbiAgICAgICdjb3JlOnBhZ2UtZG93bic6ID0+IEBzZWxlY3ROZXh0UmVzdWx0KDEwKVxuICAgICAgJ2NvcmU6bW92ZS10by10b3AnOiA9PlxuICAgICAgICBAc2VsZWN0Rmlyc3RSZXN1bHQoKVxuICAgICAgJ2NvcmU6bW92ZS10by1ib3R0b20nOiA9PlxuICAgICAgICBAc2VsZWN0TGFzdFJlc3VsdCgpXG4gICAgICAnY29yZTpjb25maXJtJzogPT5cbiAgICAgICAgaGFzaCA9IEBmaW5kKCcuc2VsZWN0ZWQnKS5hdHRyKCdoYXNoJylcbiAgICAgICAgQHNob3dDb21taXRMb2cgaGFzaCBpZiBoYXNoXG4gICAgICAgIGZhbHNlXG5cbiAgZGV0YWNoZWQ6IC0+XG4gICAgQGNvbW1hbmRTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgQGNvbW1hbmRTdWJzY3JpcHRpb24gPSBudWxsXG5cbiAgcGFyc2VEYXRhOiAoZGF0YSkgLT5cbiAgICBpZiBkYXRhLmxlbmd0aCA8IDFcbiAgICAgIEBmaW5pc2hlZCA9IHRydWVcbiAgICAgIHJldHVyblxuXG4gICAgc2VwYXJhdG9yID0gJzt8J1xuICAgIG5ld2xpbmUgPSAnXy47Ll8nXG4gICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIGRhdGEubGVuZ3RoIC0gbmV3bGluZS5sZW5ndGggLSAxKVxuXG4gICAgY29tbWl0cyA9IGRhdGEuc3BsaXQobmV3bGluZSkubWFwIChsaW5lKSAtPlxuICAgICAgaWYgbGluZS50cmltKCkgaXNudCAnJ1xuICAgICAgICB0bXBEYXRhID0gbGluZS50cmltKCkuc3BsaXQoc2VwYXJhdG9yKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhhc2hTaG9ydDogdG1wRGF0YVswXVxuICAgICAgICAgIGhhc2g6IHRtcERhdGFbMV1cbiAgICAgICAgICBhdXRob3I6IHRtcERhdGFbMl1cbiAgICAgICAgICBlbWFpbDogdG1wRGF0YVszXVxuICAgICAgICAgIG1lc3NhZ2U6IHRtcERhdGFbNF1cbiAgICAgICAgICBkYXRlOiB0bXBEYXRhWzVdXG4gICAgICAgIH1cblxuICAgIEByZW5kZXJMb2cgY29tbWl0c1xuXG4gIHJlbmRlckhlYWRlcjogLT5cbiAgICBoZWFkZXJSb3cgPSAkJCQgLT5cbiAgICAgIEB0ciBjbGFzczogJ2NvbW1pdC1oZWFkZXInLCA9PlxuICAgICAgICBAdGQgJ0RhdGUnXG4gICAgICAgIEB0ZCAnTWVzc2FnZSdcbiAgICAgICAgQHRkIGNsYXNzOiAnaGFzaFNob3J0JywgJ1Nob3J0IEhhc2gnXG5cbiAgICBAY29tbWl0c0xpc3RWaWV3LmFwcGVuZChoZWFkZXJSb3cpXG5cbiAgcmVuZGVyTG9nOiAoY29tbWl0cykgLT5cbiAgICBjb21taXRzLmZvckVhY2ggKGNvbW1pdCkgPT4gQHJlbmRlckNvbW1pdCBjb21taXRcbiAgICBAc2tpcENvbW1pdHMgKz0gbnVtYmVyT2ZDb21taXRzVG9TaG93KClcblxuICByZW5kZXJDb21taXQ6IChjb21taXQpIC0+XG4gICAgY29tbWl0Um93ID0gJCQkIC0+XG4gICAgICBAdHIgY2xhc3M6ICdjb21taXQtcm93JywgaGFzaDogXCIje2NvbW1pdC5oYXNofVwiLCA9PlxuICAgICAgICBAdGQgY2xhc3M6ICdkYXRlJywgXCIje2NvbW1pdC5kYXRlfSBieSAje2NvbW1pdC5hdXRob3J9XCJcbiAgICAgICAgQHRkIGNsYXNzOiAnbWVzc2FnZScsIFwiI3tjb21taXQubWVzc2FnZX1cIlxuICAgICAgICBAdGQgY2xhc3M6ICdoYXNoU2hvcnQnLCBcIiN7Y29tbWl0Lmhhc2hTaG9ydH1cIlxuXG4gICAgQGNvbW1pdHNMaXN0Vmlldy5hcHBlbmQoY29tbWl0Um93KVxuXG4gIHNob3dDb21taXRMb2c6IChoYXNoKSAtPlxuICAgIEdpdFNob3coQHJlcG8sIGhhc2gsIEBjdXJyZW50RmlsZSBpZiBAb25seUN1cnJlbnRGaWxlKVxuXG4gIGJyYW5jaExvZzogKEByZXBvKSAtPlxuICAgIEBza2lwQ29tbWl0cyA9IDBcbiAgICBAY29tbWl0c0xpc3RWaWV3LmVtcHR5KClcbiAgICBAb25seUN1cnJlbnRGaWxlID0gZmFsc2VcbiAgICBAY3VycmVudEZpbGUgPSBudWxsXG4gICAgQHJlbmRlckhlYWRlcigpXG4gICAgQGdldExvZygpXG5cbiAgY3VycmVudEZpbGVMb2c6IChAcmVwbywgQGN1cnJlbnRGaWxlKSAtPlxuICAgIEBvbmx5Q3VycmVudEZpbGUgPSB0cnVlXG4gICAgQHNraXBDb21taXRzID0gMFxuICAgIEBjb21taXRzTGlzdFZpZXcuZW1wdHkoKVxuICAgIEByZW5kZXJIZWFkZXIoKVxuICAgIEBnZXRMb2coKVxuXG4gIGdldExvZzogLT5cbiAgICByZXR1cm4gaWYgQGZpbmlzaGVkXG5cbiAgICBhcmdzID0gWydsb2cnLCBcIi0tcHJldHR5PSVoO3wlSDt8JWFOO3wlYUU7fCVzO3wlYWlfLjsuX1wiLCBcIi0je251bWJlck9mQ29tbWl0c1RvU2hvdygpfVwiLCAnLS1za2lwPScgKyBAc2tpcENvbW1pdHNdXG4gICAgYXJncy5wdXNoIEBjdXJyZW50RmlsZSBpZiBAb25seUN1cnJlbnRGaWxlIGFuZCBAY3VycmVudEZpbGU/XG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgPT4gQHBhcnNlRGF0YSBkYXRhXG5cbiAgc2VsZWN0Rmlyc3RSZXN1bHQ6IC0+XG4gICAgQHNlbGVjdFJlc3VsdChAZmluZCgnLmNvbW1pdC1yb3c6Zmlyc3QnKSlcbiAgICBAc2Nyb2xsVG9Ub3AoKVxuXG4gIHNlbGVjdExhc3RSZXN1bHQ6IC0+XG4gICAgQHNlbGVjdFJlc3VsdChAZmluZCgnLmNvbW1pdC1yb3c6bGFzdCcpKVxuICAgIEBzY3JvbGxUb0JvdHRvbSgpXG5cbiAgc2VsZWN0TmV4dFJlc3VsdDogKHNraXAgPSAxKSAtPlxuICAgIHNlbGVjdGVkVmlldyA9IEBmaW5kKCcuc2VsZWN0ZWQnKVxuICAgIHJldHVybiBAc2VsZWN0Rmlyc3RSZXN1bHQoKSBpZiBzZWxlY3RlZFZpZXcubGVuZ3RoIDwgMVxuICAgIG5leHRWaWV3ID0gQGdldE5leHRSZXN1bHQoc2VsZWN0ZWRWaWV3LCBza2lwKVxuXG4gICAgQHNlbGVjdFJlc3VsdChuZXh0VmlldylcbiAgICBAc2Nyb2xsVG8obmV4dFZpZXcpXG5cbiAgc2VsZWN0UHJldmlvdXNSZXN1bHQ6IChza2lwID0gMSkgLT5cbiAgICBzZWxlY3RlZFZpZXcgPSBAZmluZCgnLnNlbGVjdGVkJylcbiAgICByZXR1cm4gQHNlbGVjdEZpcnN0UmVzdWx0KCkgaWYgc2VsZWN0ZWRWaWV3Lmxlbmd0aCA8IDFcbiAgICBwcmV2VmlldyA9IEBnZXRQcmV2aW91c1Jlc3VsdChzZWxlY3RlZFZpZXcsIHNraXApXG5cbiAgICBAc2VsZWN0UmVzdWx0KHByZXZWaWV3KVxuICAgIEBzY3JvbGxUbyhwcmV2VmlldylcblxuICBnZXROZXh0UmVzdWx0OiAoZWxlbWVudCwgc2tpcCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIGVsZW1lbnQ/Lmxlbmd0aFxuICAgIGl0ZW1zID0gQGZpbmQoJy5jb21taXQtcm93JylcbiAgICBpdGVtSW5kZXggPSBpdGVtcy5pbmRleChlbGVtZW50KVxuICAgICQoaXRlbXNbTWF0aC5taW4oaXRlbUluZGV4ICsgc2tpcCwgaXRlbXMubGVuZ3RoIC0gMSldKVxuXG4gIGdldFByZXZpb3VzUmVzdWx0OiAoZWxlbWVudCwgc2tpcCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIGVsZW1lbnQ/Lmxlbmd0aFxuICAgIGl0ZW1zID0gQGZpbmQoJy5jb21taXQtcm93JylcbiAgICBpdGVtSW5kZXggPSBpdGVtcy5pbmRleChlbGVtZW50KVxuICAgICQoaXRlbXNbTWF0aC5tYXgoaXRlbUluZGV4IC0gc2tpcCwgMCldKVxuXG4gIHNlbGVjdFJlc3VsdDogKHJlc3VsdFZpZXcpIC0+XG4gICAgcmV0dXJuIHVubGVzcyByZXN1bHRWaWV3Py5sZW5ndGhcbiAgICBAZmluZCgnLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJylcbiAgICByZXN1bHRWaWV3LmFkZENsYXNzKCdzZWxlY3RlZCcpXG5cbiAgc2Nyb2xsVG86IChlbGVtZW50KSAtPlxuICAgIHJldHVybiB1bmxlc3MgZWxlbWVudD8ubGVuZ3RoXG4gICAgdG9wID0gQHNjcm9sbFRvcCgpICsgZWxlbWVudC5vZmZzZXQoKS50b3AgLSBAb2Zmc2V0KCkudG9wXG4gICAgYm90dG9tID0gdG9wICsgZWxlbWVudC5vdXRlckhlaWdodCgpXG5cbiAgICBAc2Nyb2xsQm90dG9tKGJvdHRvbSkgaWYgYm90dG9tID4gQHNjcm9sbEJvdHRvbSgpXG4gICAgQHNjcm9sbFRvcCh0b3ApIGlmIHRvcCA8IEBzY3JvbGxUb3AoKVxuIl19
