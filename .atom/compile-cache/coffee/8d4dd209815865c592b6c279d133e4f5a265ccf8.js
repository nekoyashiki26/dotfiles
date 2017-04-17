(function() {
  var TagListView, git;

  git = require('../git');

  TagListView = require('../views/tag-list-view');

  module.exports = function(repo) {
    return git.cmd(['tag', '-ln'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new TagListView(repo, data);
    })["catch"](function() {
      return new TagListView(repo);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXRhZ3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUjs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQ7V0FDZixHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBUixFQUF3QjtNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQXhCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2FBQWMsSUFBQSxXQUFBLENBQVksSUFBWixFQUFrQixJQUFsQjtJQUFkLENBRE4sQ0FFQSxFQUFDLEtBQUQsRUFGQSxDQUVPLFNBQUE7YUFBTyxJQUFBLFdBQUEsQ0FBWSxJQUFaO0lBQVAsQ0FGUDtFQURlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuVGFnTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy90YWctbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBnaXQuY21kKFsndGFnJywgJy1sbiddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoZGF0YSkgLT4gbmV3IFRhZ0xpc3RWaWV3KHJlcG8sIGRhdGEpXG4gIC5jYXRjaCAtPiBuZXcgVGFnTGlzdFZpZXcocmVwbylcbiJdfQ==
