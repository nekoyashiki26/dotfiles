(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    subscriptions: null,
    namespace: null,
    config: {
      useVimModePlus: {
        description: 'Use vim-mode-plus',
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('vim-mode-clipboard-plus.useVimModePlus', (function(_this) {
        return function(value) {
          _this.namespace = value ? 'vim-mode-plus' : 'vim-mode';
          return atom.config.set(_this.namespace + ".useClipboardAsDefaultRegister", true);
        };
      })(this)));
      return this.installPackageDependencies();
    },
    deactivate: function() {
      var ref;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      this.subscriptions = null;
      return this.namespace = null;
    },
    consumeClipboardPlus: function(arg) {
      var registerPasteAction;
      registerPasteAction = arg.registerPasteAction;
      return registerPasteAction((function(_this) {
        return function(editor, item) {
          var editorElement;
          editorElement = atom.views.getView(editor);
          return atom.commands.dispatch(editorElement, _this.namespace + ":put-after");
        };
      })(this));
    },
    installPackageDependencies: function() {
      var message, notification;
      if (atom.packages.getLoadedPackage('clipboard-plus')) {
        return;
      }
      message = 'vim-mode-clipboard-plus: Some dependencies not found. Running "apm install" on these for you. Please wait for a success confirmation!';
      notification = atom.notifications.addInfo(message, {
        dismissable: true
      });
      return require('atom-package-dependencies').install(function() {
        atom.notifications.addSuccess('vim-mode-clipboard-plus: Dependencies installed correctly.', {
          dismissable: true
        });
        notification.dismiss();
        return atom.packages.activatePackage('clipboard-plus');
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLWNsaXBib2FyZC1wbHVzL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsYUFBQSxFQUFlLElBQWY7SUFDQSxTQUFBLEVBQVcsSUFEWDtJQUdBLE1BQUEsRUFDRTtNQUFBLGNBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSxtQkFBYjtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUZUO09BREY7S0FKRjtJQVNBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHdDQUFwQixFQUE4RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtVQUMvRSxLQUFDLENBQUEsU0FBRCxHQUFnQixLQUFILEdBQWMsZUFBZCxHQUFtQztpQkFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQW1CLEtBQUMsQ0FBQSxTQUFGLEdBQVksZ0NBQTlCLEVBQStELElBQS9EO1FBRitFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5RCxDQUFuQjthQUtBLElBQUMsQ0FBQSwwQkFBRCxDQUFBO0lBUFEsQ0FUVjtJQWtCQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7O1dBQWMsQ0FBRSxPQUFoQixDQUFBOztNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCO2FBQ2pCLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFISCxDQWxCWjtJQXVCQSxvQkFBQSxFQUFzQixTQUFDLEdBQUQ7QUFDcEIsVUFBQTtNQURzQixzQkFBRDthQUNyQixtQkFBQSxDQUFvQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRCxFQUFTLElBQVQ7QUFDbEIsY0FBQTtVQUFBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CO2lCQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBeUMsS0FBQyxDQUFBLFNBQUYsR0FBWSxZQUFwRDtRQUZrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEI7SUFEb0IsQ0F2QnRCO0lBNkJBLDBCQUFBLEVBQTRCLFNBQUE7QUFDMUIsVUFBQTtNQUFBLElBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixnQkFBL0IsQ0FBVjtBQUFBLGVBQUE7O01BQ0EsT0FBQSxHQUFVO01BQ1YsWUFBQSxHQUFlLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsT0FBM0IsRUFBb0M7UUFBRSxXQUFBLEVBQWEsSUFBZjtPQUFwQzthQUNmLE9BQUEsQ0FBUSwyQkFBUixDQUFvQyxDQUFDLE9BQXJDLENBQTZDLFNBQUE7UUFDM0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUE4Qiw0REFBOUIsRUFBNEY7VUFBQSxXQUFBLEVBQWEsSUFBYjtTQUE1RjtRQUNBLFlBQVksQ0FBQyxPQUFiLENBQUE7ZUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZ0JBQTlCO01BSDJDLENBQTdDO0lBSjBCLENBN0I1Qjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBuYW1lc3BhY2U6IG51bGxcblxuICBjb25maWc6XG4gICAgdXNlVmltTW9kZVBsdXM6XG4gICAgICBkZXNjcmlwdGlvbjogJ1VzZSB2aW0tbW9kZS1wbHVzJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgndmltLW1vZGUtY2xpcGJvYXJkLXBsdXMudXNlVmltTW9kZVBsdXMnLCAodmFsdWUpID0+XG4gICAgICBAbmFtZXNwYWNlID0gaWYgdmFsdWUgdGhlbiAndmltLW1vZGUtcGx1cycgZWxzZSAndmltLW1vZGUnXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCIje0BuYW1lc3BhY2V9LnVzZUNsaXBib2FyZEFzRGVmYXVsdFJlZ2lzdGVyXCIsIHRydWUpXG4gICAgKSlcblxuICAgIEBpbnN0YWxsUGFja2FnZURlcGVuZGVuY2llcygpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgQG5hbWVzcGFjZSA9IG51bGxcblxuICBjb25zdW1lQ2xpcGJvYXJkUGx1czogKHtyZWdpc3RlclBhc3RlQWN0aW9ufSkgLT5cbiAgICByZWdpc3RlclBhc3RlQWN0aW9uKChlZGl0b3IsIGl0ZW0pID0+XG4gICAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCIje0BuYW1lc3BhY2V9OnB1dC1hZnRlclwiKVxuICAgIClcblxuICBpbnN0YWxsUGFja2FnZURlcGVuZGVuY2llczogLT5cbiAgICByZXR1cm4gaWYgYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdjbGlwYm9hcmQtcGx1cycpXG4gICAgbWVzc2FnZSA9ICd2aW0tbW9kZS1jbGlwYm9hcmQtcGx1czogU29tZSBkZXBlbmRlbmNpZXMgbm90IGZvdW5kLiBSdW5uaW5nIFwiYXBtIGluc3RhbGxcIiBvbiB0aGVzZSBmb3IgeW91LiBQbGVhc2Ugd2FpdCBmb3IgYSBzdWNjZXNzIGNvbmZpcm1hdGlvbiEnXG4gICAgbm90aWZpY2F0aW9uID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8obWVzc2FnZSwgeyBkaXNtaXNzYWJsZTogdHJ1ZSB9KVxuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBlbmRlbmNpZXMnKS5pbnN0YWxsIC0+XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygndmltLW1vZGUtY2xpcGJvYXJkLXBsdXM6IERlcGVuZGVuY2llcyBpbnN0YWxsZWQgY29ycmVjdGx5LicsIGRpc21pc3NhYmxlOiB0cnVlKVxuICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKVxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2NsaXBib2FyZC1wbHVzJylcbiJdfQ==
