(function() {
  var $, CompositeDisposable, Git, GitGuiConfigView, TextEditorView, View, fs, openpgp, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require('path');

  fs = require('fs');

  openpgp = require('openpgp');

  Git = require('nodegit');

  ref = require('space-pen'), $ = ref.$, View = ref.View;

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  GitGuiConfigView = (function(superClass) {
    extend(GitGuiConfigView, superClass);

    function GitGuiConfigView() {
      return GitGuiConfigView.__super__.constructor.apply(this, arguments);
    }

    GitGuiConfigView.content = function() {
      return this.div({
        "class": 'git-gui-settings-subview',
        id: 'config-view'
      }, (function(_this) {
        return function() {
          _this.h1({
            id: 'user'
          }, 'User');
          _this.label('Name');
          _this.subview('userName', new TextEditorView({
            mini: true
          }));
          _this.label('Email');
          _this.subview('userEmail', new TextEditorView({
            mini: true
          }));
          _this.label('Signing Key');
          return _this.div(function() {
            return _this.select({
              "class": 'input-select',
              id: 'git-gui-user-signingkey-list'
            });
          });
        };
      })(this));
    };

    GitGuiConfigView.prototype.initialize = function() {
      var pathToRepo;
      pathToRepo = path.join(atom.project.getPaths()[0], '.git');
      this.watchedConfig = fs.watch(pathToRepo, (function(_this) {
        return function(event, filename) {
          if (filename === 'config') {
            return _this.updateConfig(pathToRepo);
          }
        };
      })(this));
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.userName.model.onDidStopChanging((function(_this) {
        return function() {
          return _this.saveUserName();
        };
      })(this)));
      this.subscriptions.add(this.userEmail.model.onDidStopChanging((function(_this) {
        return function() {
          return _this.saveUserEmail();
        };
      })(this)));
      return $(document).ready((function(_this) {
        return function() {
          return $('#git-gui-user-signingkey-list').on('change', function() {
            return _this.saveUserSigningKey();
          });
        };
      })(this));
    };

    GitGuiConfigView.prototype.destroy = function() {
      this.watchedConfig.close();
      return this.subscriptions.dispose();
    };

    GitGuiConfigView.prototype.updateConfig = function(pathToRepo) {
      return Git.Repository.open(pathToRepo).then((function(_this) {
        return function(repo) {
          return repo.config().then(function(config) {
            _this.setUserName(config);
            _this.setUserEmail(config);
            return _this.setUserSigningKey(config);
          });
        };
      })(this))["catch"](function(error) {
        return console.log(error);
      });
    };

    GitGuiConfigView.prototype.setUserName = function(config) {
      return config.getStringBuf('user.name').then((function(_this) {
        return function(buf) {
          return _this.userName.setText(buf);
        };
      })(this))["catch"](function(error) {
        return console.log(error);
      });
    };

    GitGuiConfigView.prototype.setUserEmail = function(config) {
      return config.getStringBuf('user.email').then((function(_this) {
        return function(buf) {
          return _this.userEmail.setText(buf);
        };
      })(this))["catch"](function(error) {
        return console.log(error);
      });
    };

    GitGuiConfigView.prototype.setUserSigningKey = function(config) {
      $(document).ready(function() {
        var home, pubring;
        $('#git-gui-user-signingkey-list').find('option').remove().end();
        home = process.env.HOME;
        pubring = path.join(home, '.gnupg', 'secring.asc');
        return fs.exists(pubring, function(exists) {
          if (exists) {
            return fs.readFile(pubring, 'utf-8', function(err, data) {
              var i, key, keyid, keys, len, option, results, userid;
              if (err) {
                throw err;
              }
              keys = openpgp.key.readArmored(data).keys;
              results = [];
              for (i = 0, len = keys.length; i < len; i++) {
                key = keys[i];
                userid = key.getPrimaryUser().user.userId.userid;
                userid = userid.replace(/</g, '&lt');
                userid = userid.replace(/>/g, '&gt');
                keyid = key.primaryKey.getKeyId().toHex();
                option = "<option value=" + keyid + ">" + keyid + " " + userid + "</option>";
                results.push($('#git-gui-user-signingkey-list').append($(option)));
              }
              return results;
            });
          } else {
            return $('#git-gui-user-signingkey-list').hide();
          }
        });
      });
      return config.getStringBuf('user.signingkey').then(function(buf) {
        return $('#git-gui-user-signingkey-list').val(buf);
      })["catch"](function() {
        var option;
        option = '<option disabled selected value> -- select a signing key -- </option>';
        return $('#git-gui-user-signingkey-list').append($(option));
      });
    };

    GitGuiConfigView.prototype.saveUserName = function() {
      var pathToRepo;
      pathToRepo = path.join(atom.project.getPaths()[0], '.git');
      return Git.Repository.open(pathToRepo).then((function(_this) {
        return function(repo) {
          return repo.config().then(function(config) {
            return config.setString('user.name', _this.userName.getText())["catch"](function(error) {
              return console.log(error);
            });
          });
        };
      })(this))["catch"](function(error) {
        return console.log(error);
      });
    };

    GitGuiConfigView.prototype.saveUserEmail = function() {
      var pathToRepo;
      pathToRepo = path.join(atom.project.getPaths()[0], '.git');
      return Git.Repository.open(pathToRepo).then((function(_this) {
        return function(repo) {
          return repo.config().then(function(config) {
            return config.setString('user.email', _this.userEmail.getText());
          });
        };
      })(this))["catch"](function(error) {
        return console.log(error);
      });
    };

    GitGuiConfigView.prototype.saveUserSigningKey = function() {
      var pathToRepo;
      pathToRepo = path.join(atom.project.getPaths()[0], '.git');
      return Git.Repository.open(pathToRepo).then(function(repo) {
        return repo.config().then(function(config) {
          return config.setString('user.signingkey', $('#git-gui-user-signingkey-list').val()).then(function() {
            return config.setString('commit.gpgsign', 'true');
          });
        });
      })["catch"](function(error) {
        return console.log(error);
      });
    };

    return GitGuiConfigView;

  })(View);

  module.exports = GitGuiConfigView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1ndWkvbGliL2dpdC1ndWktY29uZmlnLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwyRkFBQTtJQUFBOzs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUjs7RUFDVixHQUFBLEdBQU0sT0FBQSxDQUFRLFNBQVI7O0VBQ04sTUFBWSxPQUFBLENBQVEsV0FBUixDQUFaLEVBQUMsU0FBRCxFQUFJOztFQUNILGlCQUFrQixPQUFBLENBQVEsc0JBQVI7O0VBQ2xCLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFbEI7Ozs7Ozs7SUFDSixnQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sMEJBQVA7UUFBbUMsRUFBQSxFQUFJLGFBQXZDO09BQUwsRUFBMkQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3pELEtBQUMsQ0FBQSxFQUFELENBQUk7WUFBQSxFQUFBLEVBQUksTUFBSjtXQUFKLEVBQWdCLE1BQWhCO1VBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTyxNQUFQO1VBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxVQUFULEVBQXlCLElBQUEsY0FBQSxDQUFlO1lBQUEsSUFBQSxFQUFNLElBQU47V0FBZixDQUF6QjtVQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sT0FBUDtVQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsV0FBVCxFQUEwQixJQUFBLGNBQUEsQ0FBZTtZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWYsQ0FBMUI7VUFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLGFBQVA7aUJBQ0EsS0FBQyxDQUFB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TCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxNQUF0QzthQUNiLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBZixDQUFvQixVQUFwQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtlQUNKLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLE1BQUQ7aUJBRUosTUFBTSxDQUFDLFNBQVAsQ0FBaUIsaUJBQWpCLEVBQW9DLENBQUEsQ0FBRSwrQkFBRixDQUFrQyxDQUFDLEdBQW5DLENBQUEsQ0FBcEMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFBO21CQUVKLE1BQU0sQ0FBQyxTQUFQLENBQWlCLGdCQUFqQixFQUFtQyxNQUFuQztVQUZJLENBRE47UUFGSSxDQUROO01BREksQ0FETixDQVNBLEVBQUMsS0FBRCxFQVRBLENBU08sU0FBQyxLQUFEO2VBQ0wsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaO01BREssQ0FUUDtJQUZrQjs7OztLQXRIUzs7RUFvSS9CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBNUlqQiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcydcbm9wZW5wZ3AgPSByZXF1aXJlICdvcGVucGdwJ1xuR2l0ID0gcmVxdWlyZSAnbm9kZWdpdCdcbnskLCBWaWV3fSA9IHJlcXVpcmUgJ3NwYWNlLXBlbidcbntUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbmNsYXNzIEdpdEd1aUNvbmZpZ1ZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICdnaXQtZ3VpLXNldHRpbmdzLXN1YnZpZXcnLCBpZDogJ2NvbmZpZy12aWV3JywgPT5cbiAgICAgIEBoMSBpZDogJ3VzZXInLCAnVXNlcidcbiAgICAgIEBsYWJlbCAnTmFtZSdcbiAgICAgIEBzdWJ2aWV3ICd1c2VyTmFtZScsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgQGxhYmVsICdFbWFpbCdcbiAgICAgIEBzdWJ2aWV3ICd1c2VyRW1haWwnLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgIEBsYWJlbCAnU2lnbmluZyBLZXknXG4gICAgICBAZGl2ID0+XG4gICAgICAgIEBzZWxlY3QgY2xhc3M6ICdpbnB1dC1zZWxlY3QnLCBpZDogJ2dpdC1ndWktdXNlci1zaWduaW5na2V5LWxpc3QnXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICBwYXRoVG9SZXBvID0gcGF0aC5qb2luIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLCAnLmdpdCdcbiAgICBAd2F0Y2hlZENvbmZpZyA9IGZzLndhdGNoIHBhdGhUb1JlcG8sIChldmVudCwgZmlsZW5hbWUpID0+XG4gICAgICBpZiBmaWxlbmFtZSA9PSAnY29uZmlnJ1xuICAgICAgICBAdXBkYXRlQ29uZmlnKHBhdGhUb1JlcG8pXG5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHVzZXJOYW1lLm1vZGVsLm9uRGlkU3RvcENoYW5naW5nICgpID0+XG4gICAgICBAc2F2ZVVzZXJOYW1lKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAdXNlckVtYWlsLm1vZGVsLm9uRGlkU3RvcENoYW5naW5nICgpID0+XG4gICAgICBAc2F2ZVVzZXJFbWFpbCgpXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeSAoKSA9PlxuICAgICAgJCgnI2dpdC1ndWktdXNlci1zaWduaW5na2V5LWxpc3QnKS5vbiAnY2hhbmdlJywgKCkgPT5cbiAgICAgICAgQHNhdmVVc2VyU2lnbmluZ0tleSgpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAd2F0Y2hlZENvbmZpZy5jbG9zZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgIyBUT0RPOiBHZXQgdGhlIGdsb2JhbCBjb25maWcgc2V0dGluZ3MgYXMgYSBkZWZhdWx0LlxuICAjIFRPRE86IEF2b2lkIGhhdmluZyB0byBleHBvcnQga2V5cyB0byAnc2VjcmluZy5hc2MnXG4gICMgVE9ETzogTGlzdCBvbmx5IHRoZSBrZXlzIHRoYXQgYXJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgYWN0aXZlIGB1c2VyLmVtYWlsYFxuICB1cGRhdGVDb25maWc6IChwYXRoVG9SZXBvKSAtPlxuICAgIEdpdC5SZXBvc2l0b3J5Lm9wZW4gcGF0aFRvUmVwb1xuICAgIC50aGVuIChyZXBvKSA9PlxuICAgICAgcmVwby5jb25maWcoKVxuICAgICAgLnRoZW4gKGNvbmZpZykgPT5cbiAgICAgICAgQHNldFVzZXJOYW1lIGNvbmZpZ1xuICAgICAgICBAc2V0VXNlckVtYWlsIGNvbmZpZ1xuICAgICAgICBAc2V0VXNlclNpZ25pbmdLZXkgY29uZmlnXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUubG9nIGVycm9yXG5cbiAgc2V0VXNlck5hbWU6IChjb25maWcpIC0+XG4gICAgIyBHZXQgdGhlIHVzZXIgbmFtZVxuICAgIGNvbmZpZy5nZXRTdHJpbmdCdWYgJ3VzZXIubmFtZSdcbiAgICAudGhlbiAoYnVmKSA9PlxuICAgICAgQHVzZXJOYW1lLnNldFRleHQgYnVmXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUubG9nIGVycm9yXG5cbiAgc2V0VXNlckVtYWlsOiAoY29uZmlnKSAtPlxuICAgICMgR2V0IHRoZSB1c2VyIGVtYWlsXG4gICAgY29uZmlnLmdldFN0cmluZ0J1ZiAndXNlci5lbWFpbCdcbiAgICAudGhlbiAoYnVmKSA9PlxuICAgICAgQHVzZXJFbWFpbC5zZXRUZXh0IGJ1ZlxuICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICBjb25zb2xlLmxvZyBlcnJvclxuXG4gIHNldFVzZXJTaWduaW5nS2V5OiAoY29uZmlnKSAtPlxuICAgICQoZG9jdW1lbnQpLnJlYWR5ICgpIC0+XG4gICAgICAjIENsZWFyIHRoZSBgc2VsZWN0YCBtZW51XG4gICAgICAkKCcjZ2l0LWd1aS11c2VyLXNpZ25pbmdrZXktbGlzdCcpLmZpbmQoJ29wdGlvbicpLnJlbW92ZSgpLmVuZCgpXG4gICAgICBob21lID0gcHJvY2Vzcy5lbnYuSE9NRVxuICAgICAgcHVicmluZyA9IHBhdGguam9pbihob21lLCAnLmdudXBnJywgJ3NlY3JpbmcuYXNjJylcbiAgICAgIGZzLmV4aXN0cyBwdWJyaW5nLCAoZXhpc3RzKSAtPlxuICAgICAgICBpZiBleGlzdHNcbiAgICAgICAgICBmcy5yZWFkRmlsZSBwdWJyaW5nLCAndXRmLTgnLCAoZXJyLCBkYXRhKSAtPlxuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgdGhyb3cgZXJyXG4gICAgICAgICAgICBrZXlzID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoZGF0YSkua2V5c1xuICAgICAgICAgICAgZm9yIGtleSBpbiBrZXlzXG4gICAgICAgICAgICAgIHVzZXJpZCA9IGtleS5nZXRQcmltYXJ5VXNlcigpLnVzZXIudXNlcklkLnVzZXJpZFxuICAgICAgICAgICAgICB1c2VyaWQgPSB1c2VyaWQucmVwbGFjZSgvPC9nLCAnJmx0JylcbiAgICAgICAgICAgICAgdXNlcmlkID0gdXNlcmlkLnJlcGxhY2UoLz4vZywgJyZndCcpXG4gICAgICAgICAgICAgIGtleWlkID0ga2V5LnByaW1hcnlLZXkuZ2V0S2V5SWQoKS50b0hleCgpXG4gICAgICAgICAgICAgIG9wdGlvbiA9IFwiPG9wdGlvbiB2YWx1ZT0je2tleWlkfT4je2tleWlkfSAje3VzZXJpZH08L29wdGlvbj5cIlxuICAgICAgICAgICAgICAkKCcjZ2l0LWd1aS11c2VyLXNpZ25pbmdrZXktbGlzdCcpLmFwcGVuZCAkKG9wdGlvbilcbiAgICAgICAgZWxzZVxuICAgICAgICAgICQoJyNnaXQtZ3VpLXVzZXItc2lnbmluZ2tleS1saXN0JykuaGlkZSgpXG5cbiAgICAjIEdldCB0aGUgdXNlciBzaWduaW5na2V5XG4gICAgY29uZmlnLmdldFN0cmluZ0J1ZiAndXNlci5zaWduaW5na2V5J1xuICAgIC50aGVuIChidWYpIC0+XG4gICAgICAkKCcjZ2l0LWd1aS11c2VyLXNpZ25pbmdrZXktbGlzdCcpLnZhbChidWYpXG4gICAgLmNhdGNoICgpIC0+XG4gICAgICBvcHRpb24gPSAnPG9wdGlvbiBkaXNhYmxlZCBzZWxlY3RlZCB2YWx1ZT4gLS0gc2VsZWN0IGEgc2lnbmluZyBrZXkgLS0gPC9vcHRpb24+J1xuICAgICAgJCgnI2dpdC1ndWktdXNlci1zaWduaW5na2V5LWxpc3QnKS5hcHBlbmQgJChvcHRpb24pXG5cbiAgc2F2ZVVzZXJOYW1lOiAtPlxuICAgIHBhdGhUb1JlcG8gPSBwYXRoLmpvaW4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0sICcuZ2l0J1xuICAgIEdpdC5SZXBvc2l0b3J5Lm9wZW4gcGF0aFRvUmVwb1xuICAgIC50aGVuIChyZXBvKSA9PlxuICAgICAgcmVwby5jb25maWcoKVxuICAgICAgLnRoZW4gKGNvbmZpZykgPT5cbiAgICAgICAgIyBTZXQgdGhlIHVzZXIgbmFtZVxuICAgICAgICBjb25maWcuc2V0U3RyaW5nICd1c2VyLm5hbWUnLCBAdXNlck5hbWUuZ2V0VGV4dCgpXG4gICAgICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICAgICAgY29uc29sZS5sb2cgZXJyb3JcbiAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgY29uc29sZS5sb2cgZXJyb3JcblxuICBzYXZlVXNlckVtYWlsOiAtPlxuICAgIHBhdGhUb1JlcG8gPSBwYXRoLmpvaW4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0sICcuZ2l0J1xuICAgIEdpdC5SZXBvc2l0b3J5Lm9wZW4gcGF0aFRvUmVwb1xuICAgIC50aGVuIChyZXBvKSA9PlxuICAgICAgcmVwby5jb25maWcoKVxuICAgICAgLnRoZW4gKGNvbmZpZykgPT5cbiAgICAgICAgIyBTZXQgdGhlIHVzZXIgZW1haWxcbiAgICAgICAgY29uZmlnLnNldFN0cmluZyAndXNlci5lbWFpbCcsIEB1c2VyRW1haWwuZ2V0VGV4dCgpXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUubG9nIGVycm9yXG5cbiAgc2F2ZVVzZXJTaWduaW5nS2V5OiAtPlxuICAgIHBhdGhUb1JlcG8gPSBwYXRoLmpvaW4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0sICcuZ2l0J1xuICAgIEdpdC5SZXBvc2l0b3J5Lm9wZW4gcGF0aFRvUmVwb1xuICAgIC50aGVuIChyZXBvKSAtPlxuICAgICAgcmVwby5jb25maWcoKVxuICAgICAgLnRoZW4gKGNvbmZpZykgLT5cbiAgICAgICAgIyBTZXQgdGhlIHVzZXIgc2lnbmluZ2tleVxuICAgICAgICBjb25maWcuc2V0U3RyaW5nICd1c2VyLnNpZ25pbmdrZXknLCAkKCcjZ2l0LWd1aS11c2VyLXNpZ25pbmdrZXktbGlzdCcpLnZhbCgpXG4gICAgICAgIC50aGVuICgpIC0+XG4gICAgICAgICAgIyBFbnN1cmUgdGhhdCBjb21taXRzIGFyZSBzaWduZWRcbiAgICAgICAgICBjb25maWcuc2V0U3RyaW5nICdjb21taXQuZ3Bnc2lnbicsICd0cnVlJ1xuICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICBjb25zb2xlLmxvZyBlcnJvclxuXG5tb2R1bGUuZXhwb3J0cyA9IEdpdEd1aUNvbmZpZ1ZpZXdcbiJdfQ==
