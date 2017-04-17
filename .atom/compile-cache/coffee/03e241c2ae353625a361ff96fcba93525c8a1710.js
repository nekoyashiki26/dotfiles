(function() {
  var fs, path;

  fs = require("fs-plus");

  path = require("path");

  module.exports = {
    repositoryForPath: function(goalPath) {
      var directory, i, j, len, ref;
      ref = atom.project.getDirectories();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        directory = ref[i];
        if (goalPath === directory.getPath() || directory.contains(goalPath)) {
          return atom.project.getRepositories()[i];
        }
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAtZ2l0LWRpZmYvbGliL2hlbHBlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxpQkFBQSxFQUFtQixTQUFDLFFBQUQ7QUFDakIsVUFBQTtBQUFBO0FBQUEsV0FBQSw2Q0FBQTs7UUFDRSxJQUFHLFFBQUEsS0FBWSxTQUFTLENBQUMsT0FBVixDQUFBLENBQVosSUFBbUMsU0FBUyxDQUFDLFFBQVYsQ0FBbUIsUUFBbkIsQ0FBdEM7QUFDRSxpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWIsQ0FBQSxDQUErQixDQUFBLENBQUEsRUFEeEM7O0FBREY7YUFHQTtJQUppQixDQUFuQjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSBcImZzLXBsdXNcIlxucGF0aCA9IHJlcXVpcmUgXCJwYXRoXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICByZXBvc2l0b3J5Rm9yUGF0aDogKGdvYWxQYXRoKSAtPlxuICAgIGZvciBkaXJlY3RvcnksIGkgaW4gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClcbiAgICAgIGlmIGdvYWxQYXRoIGlzIGRpcmVjdG9yeS5nZXRQYXRoKCkgb3IgZGlyZWN0b3J5LmNvbnRhaW5zKGdvYWxQYXRoKVxuICAgICAgICByZXR1cm4gYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpW2ldXG4gICAgbnVsbFxuIl19
