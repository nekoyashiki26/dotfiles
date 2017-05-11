(function() {
  var ClipboardItems, ClipboardListView, CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  ClipboardListView = null;

  ClipboardItems = require('./clipboard-items');

  module.exports = {
    subscription: null,
    clipboardListView: null,
    config: {
      limit: {
        order: 1,
        description: 'limit of the history count',
        type: 'integer',
        "default": 50,
        minimum: 2,
        maximum: 500
      },
      unique: {
        order: 2,
        description: 'remove duplicate',
        type: 'boolean',
        "default": true
      },
      minimumTextLength: {
        order: 3,
        type: 'integer',
        "default": 3,
        minimum: 1,
        maximum: 10
      },
      maximumTextLength: {
        order: 4,
        type: 'integer',
        "default": 1000,
        minimum: 10,
        maximum: 5000
      },
      maximumLinesNumber: {
        order: 5,
        type: 'integer',
        "default": 5,
        minimum: 0,
        maximum: 20,
        description: 'Max number of lines displayed per history.If zero (disabled), don\'t truncate candidate, show all.'
      }
    },
    activate: function(state) {
      this.clipboardItems = new ClipboardItems(state.clipboardItemsState);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'clipboard-plus:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'clipboard-plus:clear': (function(_this) {
          return function() {
            return _this.clipboardItems.clear();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.config.onDidChange('clipboard-plus.useSimpleView', (function(_this) {
        return function() {
          return _this.destroyView();
        };
      })(this)));
    },
    deactivate: function() {
      var ref, ref1;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      this.subscriptions = null;
      if ((ref1 = this.clipboardItems) != null) {
        ref1.destroy();
      }
      this.clipboardItems = null;
      return this.destroyView();
    },
    serialize: function() {
      return {
        clipboardItemsState: this.clipboardItems.serialize()
      };
    },
    toggle: function() {
      return this.getView().toggle();
    },
    provide: function() {
      var view;
      view = this.getView();
      return {
        registerPasteAction: view.registerPasteAction.bind(view)
      };
    },
    getView: function() {
      if (ClipboardListView == null) {
        ClipboardListView = require('./clipboard-list-view');
      }
      return this.clipboardListView != null ? this.clipboardListView : this.clipboardListView = new ClipboardListView(this.clipboardItems);
    },
    destroyView: function() {
      var ref;
      if ((ref = this.clipboardListView) != null) {
        ref.destroy();
      }
      return this.clipboardListView = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2NsaXBib2FyZC1wbHVzL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixpQkFBQSxHQUFvQjs7RUFDcEIsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxZQUFBLEVBQWMsSUFBZDtJQUNBLGlCQUFBLEVBQW1CLElBRG5CO0lBR0EsTUFBQSxFQUNFO01BQUEsS0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLENBQVA7UUFDQSxXQUFBLEVBQWEsNEJBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFIVDtRQUlBLE9BQUEsRUFBUyxDQUpUO1FBS0EsT0FBQSxFQUFTLEdBTFQ7T0FERjtNQU9BLE1BQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxDQUFQO1FBQ0EsV0FBQSxFQUFhLGtCQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7T0FSRjtNQVlBLGlCQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sQ0FBUDtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUZUO1FBR0EsT0FBQSxFQUFTLENBSFQ7UUFJQSxPQUFBLEVBQVMsRUFKVDtPQWJGO01Ba0JBLGlCQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sQ0FBUDtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUZUO1FBR0EsT0FBQSxFQUFTLEVBSFQ7UUFJQSxPQUFBLEVBQVMsSUFKVDtPQW5CRjtNQXdCQSxrQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLENBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FGVDtRQUdBLE9BQUEsRUFBUyxDQUhUO1FBSUEsT0FBQSxFQUFTLEVBSlQ7UUFLQSxXQUFBLEVBQWEsb0dBTGI7T0F6QkY7S0FKRjtJQW9DQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLGNBQUQsR0FBc0IsSUFBQSxjQUFBLENBQWUsS0FBSyxDQUFDLG1CQUFyQjtNQUV0QixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ2pCO1FBQUEsdUJBQUEsRUFBeUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCO1FBQ0Esc0JBQUEsRUFBd0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsY0FBYyxDQUFDLEtBQWhCLENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEeEI7T0FEaUIsQ0FBbkI7YUFJQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLDhCQUF4QixFQUF3RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3pFLEtBQUMsQ0FBQSxXQUFELENBQUE7UUFEeUU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhELENBQW5CO0lBUlEsQ0FwQ1Y7SUFnREEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBOztXQUFjLENBQUUsT0FBaEIsQ0FBQTs7TUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjs7WUFDRixDQUFFLE9BQWpCLENBQUE7O01BQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0I7YUFDbEIsSUFBQyxDQUFBLFdBQUQsQ0FBQTtJQUxVLENBaERaO0lBdURBLFNBQUEsRUFBVyxTQUFBO2FBQ1Q7UUFBQSxtQkFBQSxFQUFxQixJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLENBQUEsQ0FBckI7O0lBRFMsQ0F2RFg7SUEwREEsTUFBQSxFQUFRLFNBQUE7YUFDTixJQUFDLENBQUEsT0FBRCxDQUFBLENBQVUsQ0FBQyxNQUFYLENBQUE7SUFETSxDQTFEUjtJQTZEQSxPQUFBLEVBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE9BQUQsQ0FBQTthQUNQO1FBQ0UsbUJBQUEsRUFBcUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQXpCLENBQThCLElBQTlCLENBRHZCOztJQUZPLENBN0RUO0lBbUVBLE9BQUEsRUFBUyxTQUFBOztRQUNQLG9CQUFxQixPQUFBLENBQVEsdUJBQVI7OzhDQUNyQixJQUFDLENBQUEsb0JBQUQsSUFBQyxDQUFBLG9CQUF5QixJQUFBLGlCQUFBLENBQWtCLElBQUMsQ0FBQSxjQUFuQjtJQUZuQixDQW5FVDtJQXVFQSxXQUFBLEVBQWEsU0FBQTtBQUNYLFVBQUE7O1dBQWtCLENBQUUsT0FBcEIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFGVixDQXZFYjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5DbGlwYm9hcmRMaXN0VmlldyA9IG51bGxcbkNsaXBib2FyZEl0ZW1zID0gcmVxdWlyZSAnLi9jbGlwYm9hcmQtaXRlbXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3Vic2NyaXB0aW9uOiBudWxsXG4gIGNsaXBib2FyZExpc3RWaWV3OiBudWxsXG5cbiAgY29uZmlnOlxuICAgIGxpbWl0OlxuICAgICAgb3JkZXI6IDFcbiAgICAgIGRlc2NyaXB0aW9uOiAnbGltaXQgb2YgdGhlIGhpc3RvcnkgY291bnQnXG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDUwXG4gICAgICBtaW5pbXVtOiAyXG4gICAgICBtYXhpbXVtOiA1MDBcbiAgICB1bmlxdWU6XG4gICAgICBvcmRlcjogMlxuICAgICAgZGVzY3JpcHRpb246ICdyZW1vdmUgZHVwbGljYXRlJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgbWluaW11bVRleHRMZW5ndGg6XG4gICAgICBvcmRlcjogM1xuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAzXG4gICAgICBtaW5pbXVtOiAxXG4gICAgICBtYXhpbXVtOiAxMFxuICAgIG1heGltdW1UZXh0TGVuZ3RoOlxuICAgICAgb3JkZXI6IDRcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMTAwMFxuICAgICAgbWluaW11bTogMTBcbiAgICAgIG1heGltdW06IDUwMDBcbiAgICBtYXhpbXVtTGluZXNOdW1iZXI6XG4gICAgICBvcmRlcjogNVxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiA1XG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBtYXhpbXVtOiAyMFxuICAgICAgZGVzY3JpcHRpb246ICdNYXggbnVtYmVyIG9mIGxpbmVzIGRpc3BsYXllZCBwZXIgaGlzdG9yeS5JZiB6ZXJvIChkaXNhYmxlZCksIGRvblxcJ3QgdHJ1bmNhdGUgY2FuZGlkYXRlLCBzaG93IGFsbC4nXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAY2xpcGJvYXJkSXRlbXMgPSBuZXcgQ2xpcGJvYXJkSXRlbXMoc3RhdGUuY2xpcGJvYXJkSXRlbXNTdGF0ZSlcblxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLFxuICAgICAgJ2NsaXBib2FyZC1wbHVzOnRvZ2dsZSc6ID0+IEB0b2dnbGUoKVxuICAgICAgJ2NsaXBib2FyZC1wbHVzOmNsZWFyJzogPT4gQGNsaXBib2FyZEl0ZW1zLmNsZWFyKClcbiAgICApKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnY2xpcGJvYXJkLXBsdXMudXNlU2ltcGxlVmlldycsID0+XG4gICAgICBAZGVzdHJveVZpZXcoKVxuICAgICkpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgQGNsaXBib2FyZEl0ZW1zPy5kZXN0cm95KClcbiAgICBAY2xpcGJvYXJkSXRlbXMgPSBudWxsXG4gICAgQGRlc3Ryb3lWaWV3KClcblxuICBzZXJpYWxpemU6IC0+XG4gICAgY2xpcGJvYXJkSXRlbXNTdGF0ZTogQGNsaXBib2FyZEl0ZW1zLnNlcmlhbGl6ZSgpXG5cbiAgdG9nZ2xlOiAtPlxuICAgIEBnZXRWaWV3KCkudG9nZ2xlKClcblxuICBwcm92aWRlOiAtPlxuICAgIHZpZXcgPSBAZ2V0VmlldygpXG4gICAge1xuICAgICAgcmVnaXN0ZXJQYXN0ZUFjdGlvbjogdmlldy5yZWdpc3RlclBhc3RlQWN0aW9uLmJpbmQodmlldylcbiAgICB9XG5cbiAgZ2V0VmlldzogLT5cbiAgICBDbGlwYm9hcmRMaXN0VmlldyA/PSByZXF1aXJlICcuL2NsaXBib2FyZC1saXN0LXZpZXcnXG4gICAgQGNsaXBib2FyZExpc3RWaWV3ID89IG5ldyBDbGlwYm9hcmRMaXN0VmlldyhAY2xpcGJvYXJkSXRlbXMpXG5cbiAgZGVzdHJveVZpZXc6IC0+XG4gICAgQGNsaXBib2FyZExpc3RWaWV3Py5kZXN0cm95KClcbiAgICBAY2xpcGJvYXJkTGlzdFZpZXcgPSBudWxsXG4iXX0=
