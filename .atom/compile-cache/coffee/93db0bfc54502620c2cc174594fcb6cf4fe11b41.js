(function() {
  var CompositeDisposable, DotinstallPane, DotinstallPaneView;

  DotinstallPaneView = require('./dotinstall-pane-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = DotinstallPane = {
    dotinstallPaneView: null,
    leftPanel: null,
    subscriptions: null,
    DOMAIN: 'dotinstall.com',
    activate: function(state) {
      this.dotinstallPaneView = new DotinstallPaneView(state.dotinstallPaneViewState);
      this.leftPanel = atom.workspace.addLeftPanel({
        item: this.dotinstallPaneView.getElement(),
        visible: false,
        priority: 0
      });
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'dotinstall-pane:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'dotinstall-pane:reload': (function(_this) {
          return function() {
            return _this.reload();
          };
        })(this),
        'dotinstall-pane:search': (function(_this) {
          return function() {
            return _this.search();
          };
        })(this),
        'dotinstall-pane:play': (function(_this) {
          return function() {
            return _this.play();
          };
        })(this),
        'dotinstall-pane:forwardTo': (function(_this) {
          return function() {
            return _this.forwardTo();
          };
        })(this),
        'dotinstall-pane:rewindTo': (function(_this) {
          return function() {
            return _this.rewindTo();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.leftPanel.destroy();
      this.subscriptions.dispose();
      return this.dotinstallPaneView.destroy();
    },
    serialize: function() {
      return {
        dotinstallPaneViewState: this.dotinstallPaneView.serialize()
      };
    },
    toggle: function() {
      if (this.leftPanel.isVisible()) {
        return this.leftPanel.hide();
      } else {
        this.leftPanel.show();
        return this.dotinstallPaneView.fitHeight();
      }
    },
    reload: function() {
      return this.dotinstallPaneView.reload();
    },
    search: function() {
      var e, q, url;
      e = atom.workspace.getActiveTextEditor();
      if (e == null) {
        return;
      }
      if (e.getSelectedText().length > 0) {
        q = encodeURIComponent(e.getSelectedText());
        url = "http://" + this.DOMAIN + "/search?q=" + q;
        if (!this.leftPanel.isVisible()) {
          this.leftPanel.show();
        }
        return this.dotinstallPaneView.webview.src = url;
      }
    },
    play: function() {
      return this.dotinstallPaneView.webview.executeJavaScript('Dotinstall.videoController.playOrPause()');
    },
    forwardTo: function() {
      return this.dotinstallPaneView.webview.executeJavaScript('Dotinstall.videoController.forwardTo(5)');
    },
    rewindTo: function() {
      return this.dotinstallPaneView.webview.executeJavaScript('Dotinstall.videoController.rewindTo(5)');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RvdGluc3RhbGwtcGFuZS9saWIvZG90aW5zdGFsbC1wYW5lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSOztFQUNwQixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGNBQUEsR0FDZjtJQUFBLGtCQUFBLEVBQW9CLElBQXBCO0lBQ0EsU0FBQSxFQUFXLElBRFg7SUFFQSxhQUFBLEVBQWUsSUFGZjtJQUdBLE1BQUEsRUFBUSxnQkFIUjtJQUtBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsa0JBQUQsR0FBMEIsSUFBQSxrQkFBQSxDQUFtQixLQUFLLENBQUMsdUJBQXpCO01BQzFCLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFmLENBQ1Q7UUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLGtCQUFrQixDQUFDLFVBQXBCLENBQUEsQ0FBTjtRQUNBLE9BQUEsRUFBUyxLQURUO1FBRUEsUUFBQSxFQUFVLENBRlY7T0FEUztNQU9iLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFDckQsd0JBQUEsRUFBMEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRDJCO1FBRXJELHdCQUFBLEVBQTBCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUYyQjtRQUdyRCx3QkFBQSxFQUEwQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIMkI7UUFJckQsc0JBQUEsRUFBd0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsSUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSjZCO1FBS3JELDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFNBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUx3QjtRQU1yRCwwQkFBQSxFQUE0QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FOeUI7T0FBcEMsQ0FBbkI7SUFaUSxDQUxWO0lBMEJBLFVBQUEsRUFBWSxTQUFBO01BQ1YsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFYLENBQUE7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTthQUNBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxPQUFwQixDQUFBO0lBSFUsQ0ExQlo7SUErQkEsU0FBQSxFQUFXLFNBQUE7YUFDVDtRQUFBLHVCQUFBLEVBQXlCLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxTQUFwQixDQUFBLENBQXpCOztJQURTLENBL0JYO0lBa0NBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQUEsRUFERjtPQUFBLE1BQUE7UUFHRSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBQTtlQUNBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxTQUFwQixDQUFBLEVBSkY7O0lBRE0sQ0FsQ1I7SUF5Q0EsTUFBQSxFQUFRLFNBQUE7YUFDTixJQUFDLENBQUEsa0JBQWtCLENBQUMsTUFBcEIsQ0FBQTtJQURNLENBekNSO0lBNENBLE1BQUEsRUFBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFFSixJQUFjLFNBQWQ7QUFBQSxlQUFBOztNQUVBLElBQUcsQ0FBQyxDQUFDLGVBQUYsQ0FBQSxDQUFtQixDQUFDLE1BQXBCLEdBQTZCLENBQWhDO1FBQ0UsQ0FBQSxHQUFJLGtCQUFBLENBQW1CLENBQUMsQ0FBQyxlQUFGLENBQUEsQ0FBbkI7UUFDSixHQUFBLEdBQU0sU0FBQSxHQUFVLElBQUMsQ0FBQSxNQUFYLEdBQWtCLFlBQWxCLEdBQThCO1FBQ3BDLElBQUEsQ0FBeUIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQUEsQ0FBekI7VUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBQSxFQUFBOztlQUNBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsR0FBNUIsR0FBa0MsSUFKcEM7O0lBTE0sQ0E1Q1I7SUF1REEsSUFBQSxFQUFNLFNBQUE7YUFDSixJQUFDLENBQUEsa0JBQWtCLENBQUMsT0FBTyxDQUFDLGlCQUE1QixDQUE4QywwQ0FBOUM7SUFESSxDQXZETjtJQTBEQSxTQUFBLEVBQVcsU0FBQTthQUNULElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsaUJBQTVCLENBQThDLHlDQUE5QztJQURTLENBMURYO0lBNkRBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxpQkFBNUIsQ0FBOEMsd0NBQTlDO0lBRFEsQ0E3RFY7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJEb3RpbnN0YWxsUGFuZVZpZXcgPSByZXF1aXJlICcuL2RvdGluc3RhbGwtcGFuZS12aWV3J1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBEb3RpbnN0YWxsUGFuZSA9XG4gIGRvdGluc3RhbGxQYW5lVmlldzogbnVsbFxuICBsZWZ0UGFuZWw6IG51bGxcbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBET01BSU46ICdkb3RpbnN0YWxsLmNvbSdcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBkb3RpbnN0YWxsUGFuZVZpZXcgPSBuZXcgRG90aW5zdGFsbFBhbmVWaWV3KHN0YXRlLmRvdGluc3RhbGxQYW5lVmlld1N0YXRlKVxuICAgIEBsZWZ0UGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRMZWZ0UGFuZWwoXG4gICAgICAgIGl0ZW06IEBkb3RpbnN0YWxsUGFuZVZpZXcuZ2V0RWxlbWVudCgpLFxuICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgcHJpb3JpdHk6IDBcbiAgICApXG5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2RvdGluc3RhbGwtcGFuZTp0b2dnbGUnOiA9PiBAdG9nZ2xlKClcbiAgICAgICdkb3RpbnN0YWxsLXBhbmU6cmVsb2FkJzogPT4gQHJlbG9hZCgpXG4gICAgICAnZG90aW5zdGFsbC1wYW5lOnNlYXJjaCc6ID0+IEBzZWFyY2goKVxuICAgICAgJ2RvdGluc3RhbGwtcGFuZTpwbGF5JzogPT4gQHBsYXkoKVxuICAgICAgJ2RvdGluc3RhbGwtcGFuZTpmb3J3YXJkVG8nOiA9PiBAZm9yd2FyZFRvKClcbiAgICAgICdkb3RpbnN0YWxsLXBhbmU6cmV3aW5kVG8nOiA9PiBAcmV3aW5kVG8oKVxuICAgIH1cblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBsZWZ0UGFuZWwuZGVzdHJveSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQGRvdGluc3RhbGxQYW5lVmlldy5kZXN0cm95KClcblxuICBzZXJpYWxpemU6IC0+XG4gICAgZG90aW5zdGFsbFBhbmVWaWV3U3RhdGU6IEBkb3RpbnN0YWxsUGFuZVZpZXcuc2VyaWFsaXplKClcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQGxlZnRQYW5lbC5pc1Zpc2libGUoKVxuICAgICAgQGxlZnRQYW5lbC5oaWRlKClcbiAgICBlbHNlXG4gICAgICBAbGVmdFBhbmVsLnNob3coKVxuICAgICAgQGRvdGluc3RhbGxQYW5lVmlldy5maXRIZWlnaHQoKVxuXG4gIHJlbG9hZDogLT5cbiAgICBAZG90aW5zdGFsbFBhbmVWaWV3LnJlbG9hZCgpXG5cbiAgc2VhcmNoOiAtPlxuICAgIGUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIHJldHVybiB1bmxlc3MgZT9cblxuICAgIGlmIGUuZ2V0U2VsZWN0ZWRUZXh0KCkubGVuZ3RoID4gMFxuICAgICAgcSA9IGVuY29kZVVSSUNvbXBvbmVudChlLmdldFNlbGVjdGVkVGV4dCgpKVxuICAgICAgdXJsID0gXCJodHRwOi8vI3tARE9NQUlOfS9zZWFyY2g/cT0je3F9XCJcbiAgICAgIEBsZWZ0UGFuZWwuc2hvdygpIHVubGVzcyBAbGVmdFBhbmVsLmlzVmlzaWJsZSgpXG4gICAgICBAZG90aW5zdGFsbFBhbmVWaWV3LndlYnZpZXcuc3JjID0gdXJsXG5cbiAgcGxheTogLT5cbiAgICBAZG90aW5zdGFsbFBhbmVWaWV3LndlYnZpZXcuZXhlY3V0ZUphdmFTY3JpcHQgJ0RvdGluc3RhbGwudmlkZW9Db250cm9sbGVyLnBsYXlPclBhdXNlKCknXG5cbiAgZm9yd2FyZFRvOiAtPlxuICAgIEBkb3RpbnN0YWxsUGFuZVZpZXcud2Vidmlldy5leGVjdXRlSmF2YVNjcmlwdCAnRG90aW5zdGFsbC52aWRlb0NvbnRyb2xsZXIuZm9yd2FyZFRvKDUpJ1xuXG4gIHJld2luZFRvOiAtPlxuICAgIEBkb3RpbnN0YWxsUGFuZVZpZXcud2Vidmlldy5leGVjdXRlSmF2YVNjcmlwdCAnRG90aW5zdGFsbC52aWRlb0NvbnRyb2xsZXIucmV3aW5kVG8oNSknXG4iXX0=
