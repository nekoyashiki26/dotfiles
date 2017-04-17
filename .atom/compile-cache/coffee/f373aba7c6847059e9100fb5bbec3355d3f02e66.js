(function() {
  var CompositeDisposable, GitGuiView;

  GitGuiView = require('./git-gui-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    gitGuiView: null,
    modalPanel: null,
    subscriptions: null,
    activate: function(state) {
      this.gitGuiView = new GitGuiView(state.gitGuiViewState);
      this.modalPanel = atom.workspace.addRightPanel({
        item: this.gitGuiView,
        visible: true
      });
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'git-gui:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.modalPanel.destroy();
      this.gitGuiView.destroy();
      return this.subscriptions.dispose();
    },
    serialize: function() {
      return {
        gitGuiViewState: this.gitGuiView.serialize()
      };
    },
    toggle: function() {
      if (this.gitGuiView.isOpen()) {
        return this.gitGuiView.close();
      } else {
        return this.gitGuiView.open();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1ndWkvbGliL2dpdC1ndWkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGdCQUFSOztFQUNaLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFVBQUEsRUFBWSxJQUFaO0lBQ0EsVUFBQSxFQUFZLElBRFo7SUFFQSxhQUFBLEVBQWUsSUFGZjtJQUtBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLFVBQUEsQ0FBVyxLQUFLLENBQUMsZUFBakI7TUFDbEIsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7UUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLFVBQVA7UUFBbUIsT0FBQSxFQUFTLElBQTVCO09BQTdCO01BSWQsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTthQUdyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLGdCQUFBLEVBQWtCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ3ZFLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFEdUU7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO09BQXBDLENBQW5CO0lBVFEsQ0FMVjtJQWlCQSxVQUFBLEVBQVksU0FBQTtNQUNWLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBO01BQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUE7YUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQUhVLENBakJaO0lBc0JBLFNBQUEsRUFBVyxTQUFBO2FBQ1Q7UUFBQSxlQUFBLEVBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFBLENBQWpCOztJQURTLENBdEJYO0lBeUJBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBQSxFQUhGOztJQURNLENBekJSOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiR2l0R3VpVmlldyA9IHJlcXVpcmUgJy4vZ2l0LWd1aS12aWV3J1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBnaXRHdWlWaWV3OiBudWxsXG4gIG1vZGFsUGFuZWw6IG51bGxcbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuXG4gICMgVE9ETzogVXBkYXRlIHRoZSB3YXRjaGVkIHJlcG8gd2hlbiB0aGUgYWN0aXZlIGF0b20gcHJvamVjdCBjaGFuZ2VzLlxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBnaXRHdWlWaWV3ID0gbmV3IEdpdEd1aVZpZXcoc3RhdGUuZ2l0R3VpVmlld1N0YXRlKVxuICAgIEBtb2RhbFBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkUmlnaHRQYW5lbChpdGVtOiBAZ2l0R3VpVmlldywgdmlzaWJsZTogdHJ1ZSlcblxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhXG4gICAgIyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2dpdC1ndWk6dG9nZ2xlJzogPT5cbiAgICAgIEB0b2dnbGUoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQG1vZGFsUGFuZWwuZGVzdHJveSgpXG4gICAgQGdpdEd1aVZpZXcuZGVzdHJveSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIGdpdEd1aVZpZXdTdGF0ZTogQGdpdEd1aVZpZXcuc2VyaWFsaXplKClcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQGdpdEd1aVZpZXcuaXNPcGVuKClcbiAgICAgIEBnaXRHdWlWaWV3LmNsb3NlKClcbiAgICBlbHNlXG4gICAgICBAZ2l0R3VpVmlldy5vcGVuKClcbiJdfQ==
