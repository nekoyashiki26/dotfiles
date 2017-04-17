(function() {
  module.exports = {
    get: function() {
      var sublimeTabs, treeView;
      if (atom.packages.isPackageLoaded('tree-view')) {
        treeView = atom.packages.getLoadedPackage('tree-view');
        treeView = require(treeView.mainModulePath);
        return treeView.serialize();
      } else if (atom.packages.isPackageLoaded('sublime-tabs')) {
        sublimeTabs = atom.packages.getLoadedPackage('sublime-tabs');
        sublimeTabs = require(sublimeTabs.mainModulePath);
        return sublimeTabs.serialize();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9jb250ZXh0LXBhY2thZ2UtZmluZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxHQUFBLEVBQUssU0FBQTtBQUNILFVBQUE7TUFBQSxJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixXQUE5QixDQUFIO1FBQ0UsUUFBQSxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsV0FBL0I7UUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVEsQ0FBQyxjQUFqQjtlQUNYLFFBQVEsQ0FBQyxTQUFULENBQUEsRUFIRjtPQUFBLE1BSUssSUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsY0FBOUIsQ0FBSDtRQUNILFdBQUEsR0FBYyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLGNBQS9CO1FBQ2QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxXQUFXLENBQUMsY0FBcEI7ZUFDZCxXQUFXLENBQUMsU0FBWixDQUFBLEVBSEc7O0lBTEYsQ0FBTDs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgZ2V0OiAtPlxuICAgIGlmIGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKCd0cmVlLXZpZXcnKVxuICAgICAgdHJlZVZpZXcgPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ3RyZWUtdmlldycpXG4gICAgICB0cmVlVmlldyA9IHJlcXVpcmUodHJlZVZpZXcubWFpbk1vZHVsZVBhdGgpXG4gICAgICB0cmVlVmlldy5zZXJpYWxpemUoKVxuICAgIGVsc2UgaWYgYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQoJ3N1YmxpbWUtdGFicycpXG4gICAgICBzdWJsaW1lVGFicyA9IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZSgnc3VibGltZS10YWJzJylcbiAgICAgIHN1YmxpbWVUYWJzID0gcmVxdWlyZShzdWJsaW1lVGFicy5tYWluTW9kdWxlUGF0aClcbiAgICAgIHN1YmxpbWVUYWJzLnNlcmlhbGl6ZSgpXG4iXX0=
