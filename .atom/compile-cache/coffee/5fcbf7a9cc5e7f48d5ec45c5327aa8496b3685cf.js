(function() {
  var RemoteListView, git;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo, arg) {
    var setUpstream;
    setUpstream = (arg != null ? arg : {}).setUpstream;
    return git.cmd(['remote'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      var mode;
      mode = setUpstream ? 'push -u' : 'push';
      return new RemoteListView(repo, data, {
        mode: mode
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXB1c2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDZixRQUFBO0lBRHVCLDZCQUFELE1BQWM7V0FDcEMsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFFBQUQsQ0FBUixFQUFvQjtNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQXBCLENBQW9ELENBQUMsSUFBckQsQ0FBMEQsU0FBQyxJQUFEO0FBQ3hELFVBQUE7TUFBQSxJQUFBLEdBQVUsV0FBSCxHQUFvQixTQUFwQixHQUFtQzthQUN0QyxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTJCO1FBQUMsTUFBQSxJQUFEO09BQTNCO0lBRm9ELENBQTFEO0VBRGU7QUFIakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5SZW1vdGVMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3JlbW90ZS1saXN0LXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtzZXRVcHN0cmVhbX09e30pIC0+XG4gIGdpdC5jbWQoWydyZW1vdGUnXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSkudGhlbiAoZGF0YSkgLT5cbiAgICBtb2RlID0gaWYgc2V0VXBzdHJlYW0gdGhlbiAncHVzaCAtdScgZWxzZSAncHVzaCdcbiAgICBuZXcgUmVtb3RlTGlzdFZpZXcocmVwbywgZGF0YSwge21vZGV9KVxuIl19
