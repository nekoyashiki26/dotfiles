(function() {
  var $$, GitShow, RemoteListView, SelectListView, TagView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  GitShow = require('../models/git-show');

  notifier = require('../notifier');

  RemoteListView = require('../views/remote-list-view');

  module.exports = TagView = (function(superClass) {
    extend(TagView, superClass);

    function TagView() {
      return TagView.__super__.constructor.apply(this, arguments);
    }

    TagView.prototype.initialize = function(repo, tag1) {
      this.repo = repo;
      this.tag = tag1;
      TagView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagView.prototype.parseData = function() {
      var items;
      items = [];
      items.push({
        tag: this.tag,
        cmd: 'Show',
        description: 'git show'
      });
      items.push({
        tag: this.tag,
        cmd: 'Push',
        description: 'git push [remote]'
      });
      items.push({
        tag: this.tag,
        cmd: 'Checkout',
        description: 'git checkout'
      });
      items.push({
        tag: this.tag,
        cmd: 'Verify',
        description: 'git tag --verify'
      });
      items.push({
        tag: this.tag,
        cmd: 'Delete',
        description: 'git tag --delete'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagView.prototype.cancelled = function() {
      return this.hide();
    };

    TagView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    TagView.prototype.viewForItem = function(arg) {
      var cmd, description, tag;
      tag = arg.tag, cmd = arg.cmd, description = arg.description;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, cmd);
            return _this.div({
              "class": 'text-warning'
            }, description + " " + tag);
          };
        })(this));
      });
    };

    TagView.prototype.getFilterKey = function() {
      return 'cmd';
    };

    TagView.prototype.confirmed = function(arg) {
      var args, cmd, tag;
      tag = arg.tag, cmd = arg.cmd;
      this.cancel();
      switch (cmd) {
        case 'Show':
          GitShow(this.repo, tag);
          break;
        case 'Push':
          git.cmd(['remote'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(data) {
              return new RemoteListView(_this.repo, data, {
                mode: 'push',
                tag: _this.tag
              });
            };
          })(this));
          break;
        case 'Checkout':
          args = ['checkout', tag];
          break;
        case 'Verify':
          args = ['tag', '--verify', tag];
          break;
        case 'Delete':
          args = ['tag', '--delete', tag];
      }
      if (args != null) {
        return git.cmd(args, {
          cwd: this.repo.getWorkingDirectory()
        }).then(function(data) {
          return notifier.addSuccess(data);
        })["catch"](function(msg) {
          return notifier.addWarning(msg);
        });
      }
    };

    return TagView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy90YWctdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHdFQUFBO0lBQUE7OztFQUFBLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFFTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUjs7RUFDVixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7c0JBQ0osVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLElBQVI7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxNQUFEO01BQ2xCLHlDQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtJQUhVOztzQkFLWixTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxLQUFBLEdBQVE7TUFDUixLQUFLLENBQUMsSUFBTixDQUFXO1FBQUMsR0FBQSxFQUFLLElBQUMsQ0FBQSxHQUFQO1FBQVksR0FBQSxFQUFLLE1BQWpCO1FBQXlCLFdBQUEsRUFBYSxVQUF0QztPQUFYO01BQ0EsS0FBSyxDQUFDLElBQU4sQ0FBVztRQUFDLEdBQUEsRUFBSyxJQUFDLENBQUEsR0FBUDtRQUFZLEdBQUEsRUFBSyxNQUFqQjtRQUF5QixXQUFBLEVBQWEsbUJBQXRDO09BQVg7TUFDQSxLQUFLLENBQUMsSUFBTixDQUFXO1FBQUMsR0FBQSxFQUFLLElBQUMsQ0FBQSxHQUFQO1FBQVksR0FBQSxFQUFLLFVBQWpCO1FBQTZCLFdBQUEsRUFBYSxjQUExQztPQUFYO01BQ0EsS0FB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LFVBQVQsQ0FBb0IsR0FBcEI7UUFBVCxDQUZQLEVBREY7O0lBZlM7Ozs7S0FsQ1M7QUFSdEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5HaXRTaG93ID0gcmVxdWlyZSAnLi4vbW9kZWxzL2dpdC1zaG93J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcblJlbW90ZUxpc3RWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvcmVtb3RlLWxpc3QtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVGFnVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChAcmVwbywgQHRhZykgLT5cbiAgICBzdXBlclxuICAgIEBzaG93KClcbiAgICBAcGFyc2VEYXRhKClcblxuICBwYXJzZURhdGE6IC0+XG4gICAgaXRlbXMgPSBbXVxuICAgIGl0ZW1zLnB1c2gge3RhZzogQHRhZywgY21kOiAnU2hvdycsIGRlc2NyaXB0aW9uOiAnZ2l0IHNob3cnfVxuICAgIGl0ZW1zLnB1c2gge3RhZzogQHRhZywgY21kOiAnUHVzaCcsIGRlc2NyaXB0aW9uOiAnZ2l0IHB1c2ggW3JlbW90ZV0nfVxuICAgIGl0ZW1zLnB1c2gge3RhZzogQHRhZywgY21kOiAnQ2hlY2tvdXQnLCBkZXNjcmlwdGlvbjogJ2dpdCBjaGVja291dCd9XG4gICAgaXRlbXMucHVzaCB7dGFnOiBAdGFnLCBjbWQ6ICdWZXJpZnknLCBkZXNjcmlwdGlvbjogJ2dpdCB0YWcgLS12ZXJpZnknfVxuICAgIGl0ZW1zLnB1c2gge3RhZzogQHRhZywgY21kOiAnRGVsZXRlJywgZGVzY3JpcHRpb246ICdnaXQgdGFnIC0tZGVsZXRlJ31cblxuICAgIEBzZXRJdGVtcyBpdGVtc1xuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKHt0YWcsIGNtZCwgZGVzY3JpcHRpb259KSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtaGlnaGxpZ2h0JywgY21kXG4gICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LXdhcm5pbmcnLCBcIiN7ZGVzY3JpcHRpb259ICN7dGFnfVwiXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAnY21kJ1xuXG4gIGNvbmZpcm1lZDogKHt0YWcsIGNtZH0pIC0+XG4gICAgQGNhbmNlbCgpXG4gICAgc3dpdGNoIGNtZFxuICAgICAgd2hlbiAnU2hvdydcbiAgICAgICAgR2l0U2hvdyhAcmVwbywgdGFnKVxuICAgICAgd2hlbiAnUHVzaCdcbiAgICAgICAgZ2l0LmNtZChbJ3JlbW90ZSddLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgICAgLnRoZW4gKGRhdGEpID0+IG5ldyBSZW1vdGVMaXN0VmlldyhAcmVwbywgZGF0YSwgbW9kZTogJ3B1c2gnLCB0YWc6IEB0YWcpXG4gICAgICB3aGVuICdDaGVja291dCdcbiAgICAgICAgYXJncyA9IFsnY2hlY2tvdXQnLCB0YWddXG4gICAgICB3aGVuICdWZXJpZnknXG4gICAgICAgIGFyZ3MgPSBbJ3RhZycsICctLXZlcmlmeScsIHRhZ11cbiAgICAgIHdoZW4gJ0RlbGV0ZSdcbiAgICAgICAgYXJncyA9IFsndGFnJywgJy0tZGVsZXRlJywgdGFnXVxuXG4gICAgaWYgYXJncz9cbiAgICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAoZGF0YSkgLT4gbm90aWZpZXIuYWRkU3VjY2VzcyBkYXRhXG4gICAgICAuY2F0Y2ggKG1zZykgLT4gbm90aWZpZXIuYWRkV2FybmluZyBtc2dcbiJdfQ==
