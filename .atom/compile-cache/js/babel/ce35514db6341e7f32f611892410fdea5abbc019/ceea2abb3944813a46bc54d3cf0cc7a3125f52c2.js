'use babel';

var fs = require('fs-plus');
var git = require('../git');
var notifier = require('../notifier');
var BranchListView = require('../views/branch-list-view');

module.exports = function (repo) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? { remote: false } : arguments[1];

  var args = options.remote ? ['branch', '-r', '--no-color'] : ['branch', '--no-color'];
  return git.cmd(args, { cwd: repo.getWorkingDirectory() }).then(function (data) {
    return new BranchListView(data, function (_ref) {
      var name = _ref.name;

      var args = options.remote ? ['checkout', name, '--track'] : ['checkout', name];
      git.cmd(args, { cwd: repo.getWorkingDirectory() }).then(function (message) {
        notifier.addSuccess(message);
        atom.workspace.getTextEditors().forEach(function (editor) {
          try {
            var path = editor.getPath();
            console.log('Git-plus: editor.getPath() returned \'' + path + '\'');
            if (path && path.toString) {
              fs.exists(path.toString(), function (exists) {
                if (!exists) editor.destroy();
              });
            }
          } catch (error) {
            notifier.addWarning("There was an error closing windows for non-existing files after the checkout. Please check the dev console.");
            console.info("Git-plus: please take a screenshot of what has been printed in the console and add it to the issue on github at https://github.com/akonwi/git-plus/issues/139", error);
          }
        });
        git.refresh(repo);
      })['catch'](notifier.addError);
    });
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jaGVja291dC1icmFuY2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOztBQUVYLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUM3QixJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDN0IsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ3ZDLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFBOztBQUUzRCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQUMsSUFBSSxFQUE4QjtNQUE1QixPQUFPLHlEQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQzs7QUFDN0MsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDdkYsU0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBQyxDQUFDLENBQ3RELElBQUksQ0FBQyxVQUFBLElBQUksRUFBSTtBQUNaLFdBQU8sSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLFVBQUMsSUFBTSxFQUFLO1VBQVYsSUFBSSxHQUFMLElBQU0sQ0FBTCxJQUFJOztBQUNwQyxVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNoRixTQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBQyxDQUFDLENBQy9DLElBQUksQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUNmLGdCQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzVCLFlBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ2hELGNBQUk7QUFDRixnQkFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzdCLG1CQUFPLENBQUMsR0FBRyw0Q0FBeUMsSUFBSSxRQUFJLENBQUE7QUFDNUQsZ0JBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDekIsZ0JBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQUMsb0JBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO2VBQUMsQ0FBQyxDQUFBO2FBQ3RFO1dBQ0YsQ0FDRCxPQUFPLEtBQUssRUFBRTtBQUNaLG9CQUFRLENBQUMsVUFBVSxDQUFDLDZHQUE2RyxDQUFDLENBQUE7QUFDbEksbUJBQU8sQ0FBQyxJQUFJLENBQUMsK0pBQStKLEVBQUUsS0FBSyxDQUFDLENBQUE7V0FDckw7U0FDRixDQUFDLENBQUE7QUFDRixXQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO09BQ2xCLENBQUMsU0FDSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUMxQixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFBIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jaGVja291dC1icmFuY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzLXBsdXMnKVxuY29uc3QgZ2l0ID0gcmVxdWlyZSgnLi4vZ2l0JylcbmNvbnN0IG5vdGlmaWVyID0gcmVxdWlyZSgnLi4vbm90aWZpZXInKVxuY29uc3QgQnJhbmNoTGlzdFZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9icmFuY2gtbGlzdC12aWV3JylcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywgb3B0aW9ucz17cmVtb3RlOiBmYWxzZX0pID0+IHtcbiAgY29uc3QgYXJncyA9IG9wdGlvbnMucmVtb3RlID8gWydicmFuY2gnLCAnLXInLCAnLS1uby1jb2xvciddIDogWydicmFuY2gnLCAnLS1uby1jb2xvciddXG4gIHJldHVybiBnaXQuY21kKGFyZ3MsIHtjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpfSlcbiAgLnRoZW4oZGF0YSA9PiB7XG4gICAgcmV0dXJuIG5ldyBCcmFuY2hMaXN0VmlldyhkYXRhLCAoe25hbWV9KSA9PiB7XG4gICAgICBjb25zdCBhcmdzID0gb3B0aW9ucy5yZW1vdGUgPyBbJ2NoZWNrb3V0JywgbmFtZSwgJy0tdHJhY2snXSA6IFsnY2hlY2tvdXQnLCBuYW1lXVxuICAgICAgZ2l0LmNtZChhcmdzLCB7Y3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKX0pXG4gICAgICAudGhlbihtZXNzYWdlID0+IHtcbiAgICAgICAgbm90aWZpZXIuYWRkU3VjY2VzcyhtZXNzYWdlKVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2goZWRpdG9yID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBHaXQtcGx1czogZWRpdG9yLmdldFBhdGgoKSByZXR1cm5lZCAnJHtwYXRofSdgKVxuICAgICAgICAgICAgaWYgKHBhdGggJiYgcGF0aC50b1N0cmluZykge1xuICAgICAgICAgICAgICBmcy5leGlzdHMocGF0aC50b1N0cmluZygpLCBleGlzdHMgPT4ge2lmICghZXhpc3RzKSBlZGl0b3IuZGVzdHJveSgpfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBub3RpZmllci5hZGRXYXJuaW5nKFwiVGhlcmUgd2FzIGFuIGVycm9yIGNsb3Npbmcgd2luZG93cyBmb3Igbm9uLWV4aXN0aW5nIGZpbGVzIGFmdGVyIHRoZSBjaGVja291dC4gUGxlYXNlIGNoZWNrIHRoZSBkZXYgY29uc29sZS5cIilcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIkdpdC1wbHVzOiBwbGVhc2UgdGFrZSBhIHNjcmVlbnNob3Qgb2Ygd2hhdCBoYXMgYmVlbiBwcmludGVkIGluIHRoZSBjb25zb2xlIGFuZCBhZGQgaXQgdG8gdGhlIGlzc3VlIG9uIGdpdGh1YiBhdCBodHRwczovL2dpdGh1Yi5jb20vYWtvbndpL2dpdC1wbHVzL2lzc3Vlcy8xMzlcIiwgZXJyb3IpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBnaXQucmVmcmVzaChyZXBvKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChub3RpZmllci5hZGRFcnJvcilcbiAgICB9KVxuICB9KVxufVxuIl19