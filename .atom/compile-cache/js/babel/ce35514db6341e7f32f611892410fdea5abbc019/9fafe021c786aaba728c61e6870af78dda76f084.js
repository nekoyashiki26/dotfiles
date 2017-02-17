Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _atom = require('atom');

var _AtomAutocompleteProvider = require('./AtomAutocompleteProvider');

var _JavaClassLoader = require('./JavaClassLoader');

var _atomJavaUtil = require('./atomJavaUtil');

var _atomJavaUtil2 = _interopRequireDefault(_atomJavaUtil);

'use babel';

var AtomAutocompletePackage = (function () {
  function AtomAutocompletePackage() {
    _classCallCheck(this, AtomAutocompletePackage);

    this.config = require('./config.json');
    this.subscriptions = undefined;
    this.provider = undefined;
    this.classLoader = undefined;
    this.classpath = null;
    this.initialized = false;
  }

  _createClass(AtomAutocompletePackage, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      this.classLoader = new _JavaClassLoader.JavaClassLoader(atom.config.get('autocomplete-java.javaHome'));
      this.provider = new _AtomAutocompleteProvider.AtomAutocompleteProvider(this.classLoader);
      this.subscriptions = new _atom.CompositeDisposable();

      // Listen for commands
      this.subscriptions.add(atom.commands.add('atom-workspace', 'autocomplete-java:organize-imports', function () {
        _this._organizeImports();
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'autocomplete-java:refresh-project', function () {
        if (_this.initialized) {
          _this._refresh(false);
        }
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'autocomplete-java:full-refresh', function () {
        if (_this.initialized) {
          _this._refresh(true);
        }
      }));

      // Listen for config changes
      // TODO refactor: bypasses provider.configure()
      this.subscriptions.add(atom.config.observe('autocomplete-java.inclusionPriority', function (val) {
        _this.provider.inclusionPriority = val;
      }));
      this.subscriptions.add(atom.config.observe('autocomplete-java.excludeLowerPriority', function (val) {
        _this.provider.excludeLowerPriority = val;
      }));
      this.subscriptions.add(atom.config.observe('autocomplete-java.foldImports', function (val) {
        _this.provider.foldImports = val;
      }));

      // Listen for buffer change
      this.subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(function (paneItem) {
        _this._onChange(paneItem);
      }));

      // Listen for file save
      atom.workspace.observeTextEditors(function (editor) {
        if (_this.subscriptions) {
          _this.subscriptions.add(editor.getBuffer().onWillSave(function () {
            _this._onSave(editor);
          }));
        }
      });

      // Start full refresh
      setTimeout(function () {
        // Refresh all classes
        _this.initialized = true;
        _this._refresh(true);
      }, 300);
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.subscriptions.dispose();
      this.provider = null;
      this.classLoader = null;
      this.subscriptions = null;
      this.classpath = null;
      this.initialized = false;
    }
  }, {
    key: 'getProvider',
    value: function getProvider() {
      return this.provider;
    }

    // Commands

  }, {
    key: '_refresh',
    value: _asyncToGenerator(function* (fullRefresh) {
      // Refresh provider settings
      // TODO observe config changes
      this.provider.configure(atom.config.get('autocomplete-java'));
      this.classLoader.setJavaHome(atom.config.get('autocomplete-java.javaHome'));

      // Load classes using classpath
      var classpath = yield this._loadClasspath();
      if (classpath) {
        this.classLoader.loadClasses(classpath, atom.config.get('autocomplete-java.loadClassMembers'), fullRefresh);
      }
    })
  }, {
    key: '_refreshClass',
    value: function _refreshClass(className, delayMillis) {
      var _this2 = this;

      setTimeout(function () {
        if (_this2.classpath) {
          _this2.classLoader.loadClass(className, _this2.classpath, atom.config.get('autocomplete-java.loadClassMembers'));
        } else {
          console.warn('autocomplete-java: classpath not set.');
        }
      }, delayMillis);
    }
  }, {
    key: '_organizeImports',
    value: function _organizeImports() {
      var editor = atom.workspace.getActiveTextEditor();
      if (this._isJavaFile(editor)) {
        _atomJavaUtil2['default'].organizeImports(editor, null, atom.config.get('autocomplete-java.foldImports'));
      }
    }
  }, {
    key: '_onChange',
    value: function _onChange(paneItem) {
      var _this3 = this;

      if (this._isJavaFile(paneItem)) {
        // Active file has changed -> fold imports
        if (atom.config.get('autocomplete-java.foldImports')) {
          _atomJavaUtil2['default'].foldImports(paneItem);
        }
        // Active file has changed -> touch every imported class
        _lodash._.each(_atomJavaUtil2['default'].getImports(paneItem), function (imp) {
          try {
            _this3.classLoader.touchClass(imp.match(/import\s*(\S*);/)[1]);
          } catch (err) {
            // console.warn(err);
          }
        });
      }
    }
  }, {
    key: '_onSave',
    value: function _onSave(editor) {
      // TODO use onDidSave for refreshing and onWillSave for organizing imports
      if (this._isJavaFile(editor)) {
        // Refresh saved class after it has been compiled
        if (atom.config.get('autocomplete-java.refreshClassOnSave')) {
          var fileMatch = editor.getPath().match(/\/([^\/]*)\.java/);
          var packageMatch = editor.getText().match(/package\s(.*);/);
          if (fileMatch && packageMatch) {
            // TODO use file watcher instead of hardcoded timeout
            var className = packageMatch[1] + '.' + fileMatch[1];
            this._refreshClass(className, 3000);
          }
        }
      }
    }

    // Util methods

  }, {
    key: '_isJavaFile',
    value: function _isJavaFile(editor) {
      return editor instanceof _atom.TextEditor && editor.getPath() && editor.getPath().match(/\.java$/);
    }

    // TODO: this is a quick hack for loading classpath. replace with
    // atom-javaenv once it has been implemented
  }, {
    key: '_loadClasspath',
    value: _asyncToGenerator(function* () {
      var _this4 = this;

      var separator = null;
      var classpathSet = new Set();
      var classpathFileName = atom.config.get('autocomplete-java.classpathFilePath');

      yield atom.workspace.scan(/^.+$/, { paths: ['*' + classpathFileName] }, function (file) {
        separator = file.filePath.indexOf(':') !== -1 ? ';' : ':';
        _lodash._.each(file.matches, function (match) {
          // NOTE: The :\ replace is a quick hack for supporting Windows
          // absolute paths e.g E:\myProject\lib
          _lodash._.each(match.matchText.replace(':\\', '+\\').split(/[\:\;]+/), function (path) {
            classpathSet.add(_this4._asAbsolutePath(file.filePath, path.replace('+\\', ':\\')));
          });
        });
      });

      var classpath = '';
      _lodash._.each([].concat(_toConsumableArray(classpathSet)), function (path) {
        classpath = classpath + path + separator;
      });
      this.classpath = classpath;
      return classpath;
    })

    // TODO: this is a quick hack for loading path. replace with atom-javaenv
    // once it has been implemented
  }, {
    key: '_asAbsolutePath',
    value: function _asAbsolutePath(currentFilePath, path) {
      var p = path;
      var dirPath = currentFilePath.match(/(.*)[\\\/]/)[1];
      var addBaseDir = false;
      // Remove ../ or ..\ from beginning
      while (/^\.\.[\\\/]/.test(p)) {
        addBaseDir = true;
        dirPath = dirPath.match(/(.*)[\\\/]/)[1];
        p = p.substring(3);
      }
      // Remove ./ or .\ from beginning
      while (/^\.[\\\/]/.test(p)) {
        addBaseDir = true;
        p = p.substring(2);
      }
      return addBaseDir ? dirPath + '/' + p : p;
    }
  }]);

  return AtomAutocompletePackage;
})();

exports['default'] = new AtomAutocompletePackage();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvYXRvbUF1dG9jb21wbGV0ZVBhY2thZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRWtCLFFBQVE7O29CQUNDLE1BQU07O3dDQUVRLDRCQUE0Qjs7K0JBQ3JDLG1CQUFtQjs7NEJBQzFCLGdCQUFnQjs7OztBQVB6QyxXQUFXLENBQUM7O0lBU04sdUJBQXVCO0FBRWhCLFdBRlAsdUJBQXVCLEdBRWI7MEJBRlYsdUJBQXVCOztBQUd6QixRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN2QyxRQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztBQUMvQixRQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztBQUMxQixRQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUM3QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QixRQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztHQUMxQjs7ZUFURyx1QkFBdUI7O1dBV25CLG9CQUFHOzs7QUFDVCxVQUFJLENBQUMsV0FBVyxHQUFHLHFDQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLFFBQVEsR0FBRyx1REFBNkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQy9ELFVBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7OztBQUcvQyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsb0NBQW9DLEVBQ3hFLFlBQU07QUFDSixjQUFLLGdCQUFnQixFQUFFLENBQUM7T0FDekIsQ0FBQyxDQUNILENBQUM7QUFDRixVQUFJLENBQUMsYUFBYSxDQUFDLEdB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ZUFBZSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRCxVQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7O0FBRXZCLGFBQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1QixrQkFBVSxHQUFHLElBQUksQ0FBQztBQUNsQixlQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxTQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNwQjs7QUFFRCxhQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDMUIsa0JBQVUsR0FBRyxJQUFJLENBQUM7QUFDbEIsU0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDcEI7QUFDRCxhQUFPLFVBQVUsR0FBRyxPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDM0M7OztTQTFORyx1QkFBdUI7OztxQkE4TmQsSUFBSSx1QkFBdUIsRUFBRSIsImZpbGUiOiIvaG9tZS95b3NoaW5vcmkvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWphdmEvbGliL2F0b21BdXRvY29tcGxldGVQYWNrYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IF8gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgQXRvbUF1dG9jb21wbGV0ZVByb3ZpZGVyIH0gZnJvbSAnLi9BdG9tQXV0b2NvbXBsZXRlUHJvdmlkZXInO1xuaW1wb3J0IHsgSmF2YUNsYXNzTG9hZGVyIH0gZnJvbSAnLi9KYXZhQ2xhc3NMb2FkZXInO1xuaW1wb3J0IGF0b21KYXZhVXRpbCBmcm9tICcuL2F0b21KYXZhVXRpbCc7XG5cbmNsYXNzIEF0b21BdXRvY29tcGxldGVQYWNrYWdlIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnLmpzb24nKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5wcm92aWRlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNsYXNzTG9hZGVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY2xhc3NwYXRoID0gbnVsbDtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmNsYXNzTG9hZGVyID0gbmV3IEphdmFDbGFzc0xvYWRlcihcbiAgICAgIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWphdmEuamF2YUhvbWUnKSk7XG4gICAgdGhpcy5wcm92aWRlciA9IG5ldyBBdG9tQXV0b2NvbXBsZXRlUHJvdmlkZXIodGhpcy5jbGFzc0xvYWRlcik7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIC8vIExpc3RlbiBmb3IgY29tbWFuZHNcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2F1dG9jb21wbGV0ZS1qYXZhOm9yZ2FuaXplLWltcG9ydHMnLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLl9vcmdhbml6ZUltcG9ydHMoKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2F1dG9jb21wbGV0ZS1qYXZhOnJlZnJlc2gtcHJvamVjdCcsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgdGhpcy5fcmVmcmVzaChmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2F1dG9jb21wbGV0ZS1qYXZhOmZ1bGwtcmVmcmVzaCcsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgdGhpcy5fcmVmcmVzaCh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gTGlzdGVuIGZvciBjb25maWcgY2hhbmdlc1xuICAgIC8vIFRPRE8gcmVmYWN0b3I6IGJ5cGFzc2VzIHByb3ZpZGVyLmNvbmZpZ3VyZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2F1dG9jb21wbGV0ZS1qYXZhLmluY2x1c2lvblByaW9yaXR5JywgKHZhbCkgPT4ge1xuICAgICAgICB0aGlzLnByb3ZpZGVyLmluY2x1c2lvblByaW9yaXR5ID0gdmFsO1xuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdXRvY29tcGxldGUtamF2YS5leGNsdWRlTG93ZXJQcmlvcml0eScsICh2YWwpID0+IHtcbiAgICAgICAgdGhpcy5wcm92aWRlci5leGNsdWRlTG93ZXJQcmlvcml0eSA9IHZhbDtcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYXV0b2NvbXBsZXRlLWphdmEuZm9sZEltcG9ydHMnLCAodmFsKSA9PiB7XG4gICAgICAgIHRoaXMucHJvdmlkZXIuZm9sZEltcG9ydHMgPSB2YWw7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIGJ1ZmZlciBjaGFuZ2VcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWRTdG9wQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbSgocGFuZUl0ZW0pID0+IHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UocGFuZUl0ZW0pO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gTGlzdGVuIGZvciBmaWxlIHNhdmVcbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcbiAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChlZGl0b3IuZ2V0QnVmZmVyKCkub25XaWxsU2F2ZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fb25TYXZlKGVkaXRvcik7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFN0YXJ0IGZ1bGwgcmVmcmVzaFxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gUmVmcmVzaCBhbGwgY2xhc3Nlc1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICB0aGlzLl9yZWZyZXNoKHRydWUpO1xuICAgIH0sIDMwMCk7XG4gIH1cblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5wcm92aWRlciA9IG51bGw7XG4gICAgdGhpcy5jbGFzc0xvYWRlciA9IG51bGw7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzcGF0aCA9IG51bGw7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0UHJvdmlkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXI7XG4gIH1cblxuICAvLyBDb21tYW5kc1xuXG4gIGFzeW5jIF9yZWZyZXNoKGZ1bGxSZWZyZXNoKSB7XG4gICAgLy8gUmVmcmVzaCBwcm92aWRlciBzZXR0aW5nc1xuICAgIC8vIFRPRE8gb2JzZXJ2ZSBjb25maWcgY2hhbmdlc1xuICAgIHRoaXMucHJvdmlkZXIuY29uZmlndXJlKGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWphdmEnKSk7XG4gICAgdGhpcy5jbGFzc0xvYWRlci5zZXRKYXZhSG9tZShhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1qYXZhLmphdmFIb21lJykpO1xuXG4gICAgLy8gTG9hZCBjbGFzc2VzIHVzaW5nIGNsYXNzcGF0aFxuICAgIGNvbnN0IGNsYXNzcGF0aCA9IGF3YWl0IHRoaXMuX2xvYWRDbGFzc3BhdGgoKTtcbiAgICBpZiAoY2xhc3NwYXRoKSB7XG4gICAgICB0aGlzLmNsYXNzTG9hZGVyLmxvYWRDbGFzc2VzKGNsYXNzcGF0aCxcbiAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtamF2YS5sb2FkQ2xhc3NNZW1iZXJzJyksIGZ1bGxSZWZyZXNoKTtcbiAgICB9XG4gIH1cblxuICBfcmVmcmVzaENsYXNzKGNsYXNzTmFtZSwgZGVsYXlNaWxsaXMpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmNsYXNzcGF0aCkge1xuICAgICAgICB0aGlzLmNsYXNzTG9hZGVyLmxvYWRDbGFzcyhjbGFzc05hbWUsIHRoaXMuY2xhc3NwYXRoLFxuICAgICAgICAgIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWphdmEubG9hZENsYXNzTWVtYmVycycpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybignYXV0b2NvbXBsZXRlLWphdmE6IGNsYXNzcGF0aCBub3Qgc2V0LicpO1xuICAgICAgfVxuICAgIH0sIGRlbGF5TWlsbGlzKTtcbiAgfVxuXG4gIF9vcmdhbml6ZUltcG9ydHMoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGlmICh0aGlzLl9pc0phdmFGaWxlKGVkaXRvcikpIHtcbiAgICAgIGF0b21KYXZhVXRpbC5vcmdhbml6ZUltcG9ydHMoZWRpdG9yLCBudWxsLFxuICAgICAgICBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1qYXZhLmZvbGRJbXBvcnRzJykpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkNoYW5nZShwYW5lSXRlbSkge1xuICAgIGlmICh0aGlzLl9pc0phdmFGaWxlKHBhbmVJdGVtKSkge1xuICAgICAgLy8gQWN0aXZlIGZpbGUgaGFzIGNoYW5nZWQgLT4gZm9sZCBpbXBvcnRzXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtamF2YS5mb2xkSW1wb3J0cycpKSB7XG4gICAgICAgIGF0b21KYXZhVXRpbC5mb2xkSW1wb3J0cyhwYW5lSXRlbSk7XG4gICAgICB9XG4gICAgICAvLyBBY3RpdmUgZmlsZSBoYXMgY2hhbmdlZCAtPiB0b3VjaCBldmVyeSBpbXBvcnRlZCBjbGFzc1xuICAgICAgXy5lYWNoKGF0b21KYXZhVXRpbC5nZXRJbXBvcnRzKHBhbmVJdGVtKSwgaW1wID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLmNsYXNzTG9hZGVyLnRvdWNoQ2xhc3MoaW1wLm1hdGNoKC9pbXBvcnRcXHMqKFxcUyopOy8pWzFdKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgLy8gY29uc29sZS53YXJuKGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9vblNhdmUoZWRpdG9yKSB7XG4gICAgLy8gVE9ETyB1c2Ugb25EaWRTYXZlIGZvciByZWZyZXNoaW5nIGFuZCBvbldpbGxTYXZlIGZvciBvcmdhbml6aW5nIGltcG9ydHNcbiAgICBpZiAodGhpcy5faXNKYXZhRmlsZShlZGl0b3IpKSB7XG4gICAgICAvLyBSZWZyZXNoIHNhdmVkIGNsYXNzIGFmdGVyIGl0IGhhcyBiZWVuIGNvbXBpbGVkXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtamF2YS5yZWZyZXNoQ2xhc3NPblNhdmUnKSkge1xuICAgICAgICBjb25zdCBmaWxlTWF0Y2ggPSBlZGl0b3IuZ2V0UGF0aCgpLm1hdGNoKC9cXC8oW15cXC9dKilcXC5qYXZhLyk7XG4gICAgICAgIGNvbnN0IHBhY2thZ2VNYXRjaCA9IGVkaXRvci5nZXRUZXh0KCkubWF0Y2goL3BhY2thZ2VcXHMoLiopOy8pO1xuICAgICAgICBpZiAoZmlsZU1hdGNoICYmIHBhY2thZ2VNYXRjaCkge1xuICAgICAgICAgIC8vIFRPRE8gdXNlIGZpbGUgd2F0Y2hlciBpbnN0ZWFkIG9mIGhhcmRjb2RlZCB0aW1lb3V0XG4gICAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gcGFja2FnZU1hdGNoWzFdICsgJy4nICsgZmlsZU1hdGNoWzFdO1xuICAgICAgICAgIHRoaXMuX3JlZnJlc2hDbGFzcyhjbGFzc05hbWUsIDMwMDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gVXRpbCBtZXRob2RzXG5cbiAgX2lzSmF2YUZpbGUoZWRpdG9yKSB7XG4gICAgcmV0dXJuIGVkaXRvciBpbnN0YW5jZW9mIFRleHRFZGl0b3IgJiYgZWRpdG9yLmdldFBhdGgoKSAmJlxuICAgICAgZWRpdG9yLmdldFBhdGgoKS5tYXRjaCgvXFwuamF2YSQvKTtcbiAgfVxuXG4gIC8vIFRPRE86IHRoaXMgaXMgYSBxdWljayBoYWNrIGZvciBsb2FkaW5nIGNsYXNzcGF0aC4gcmVwbGFjZSB3aXRoXG4gIC8vIGF0b20tamF2YWVudiBvbmNlIGl0IGhhcyBiZWVuIGltcGxlbWVudGVkXG4gIGFzeW5jIF9sb2FkQ2xhc3NwYXRoKCkge1xuICAgIGxldCBzZXBhcmF0b3IgPSBudWxsO1xuICAgIGNvbnN0IGNsYXNzcGF0aFNldCA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBjbGFzc3BhdGhGaWxlTmFtZSA9XG4gICAgICBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1qYXZhLmNsYXNzcGF0aEZpbGVQYXRoJyk7XG5cbiAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5zY2FuKC9eLiskLywgeyBwYXRoczogWycqJyArIGNsYXNzcGF0aEZpbGVOYW1lXSB9LFxuICAgIGZpbGUgPT4ge1xuICAgICAgc2VwYXJhdG9yID0gZmlsZS5maWxlUGF0aC5pbmRleE9mKCc6JykgIT09IC0xID8gJzsnIDogJzonO1xuICAgICAgXy5lYWNoKGZpbGUubWF0Y2hlcywgbWF0Y2ggPT4ge1xuICAgICAgICAvLyBOT1RFOiBUaGUgOlxcIHJlcGxhY2UgaXMgYSBxdWljayBoYWNrIGZvciBzdXBwb3J0aW5nIFdpbmRvd3NcbiAgICAgICAgLy8gYWJzb2x1dGUgcGF0aHMgZS5nIEU6XFxteVByb2plY3RcXGxpYlxuICAgICAgICBfLmVhY2gobWF0Y2gubWF0Y2hUZXh0LnJlcGxhY2UoJzpcXFxcJywgJytcXFxcJykuc3BsaXQoL1tcXDpcXDtdKy8pLCBwYXRoID0+IHtcbiAgICAgICAgICBjbGFzc3BhdGhTZXQuYWRkKHRoaXMuX2FzQWJzb2x1dGVQYXRoKGZpbGUuZmlsZVBhdGgsXG4gICAgICAgICAgICBwYXRoLnJlcGxhY2UoJytcXFxcJywgJzpcXFxcJykpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGxldCBjbGFzc3BhdGggPSAnJztcbiAgICBfLmVhY2goWy4uLmNsYXNzcGF0aFNldF0sIHBhdGggPT4ge1xuICAgICAgY2xhc3NwYXRoID0gY2xhc3NwYXRoICsgcGF0aCArIHNlcGFyYXRvcjtcbiAgICB9KTtcbiAgICB0aGlzLmNsYXNzcGF0aCA9IGNsYXNzcGF0aDtcbiAgICByZXR1cm4gY2xhc3NwYXRoO1xuICB9XG5cbiAgLy8gVE9ETzogdGhpcyBpcyBhIHF1aWNrIGhhY2sgZm9yIGxvYWRpbmcgcGF0aC4gcmVwbGFjZSB3aXRoIGF0b20tamF2YWVudlxuICAvLyBvbmNlIGl0IGhhcyBiZWVuIGltcGxlbWVudGVkXG4gIF9hc0Fic29sdXRlUGF0aChjdXJyZW50RmlsZVBhdGgsIHBhdGgpIHtcbiAgICBsZXQgcCA9IHBhdGg7XG4gICAgbGV0IGRpclBhdGggPSBjdXJyZW50RmlsZVBhdGgubWF0Y2goLyguKilbXFxcXFxcL10vKVsxXTtcbiAgICBsZXQgYWRkQmFzZURpciA9IGZhbHNlO1xuICAgIC8vIFJlbW92ZSAuLi8gb3IgLi5cXCBmcm9tIGJlZ2lubmluZ1xuICAgIHdoaWxlICgvXlxcLlxcLltcXFxcXFwvXS8udGVzdChwKSkge1xuICAgICAgYWRkQmFzZURpciA9IHRydWU7XG4gICAgICBkaXJQYXRoID0gZGlyUGF0aC5tYXRjaCgvKC4qKVtcXFxcXFwvXS8pWzFdO1xuICAgICAgcCA9IHAuc3Vic3RyaW5nKDMpO1xuICAgIH1cbiAgICAvLyBSZW1vdmUgLi8gb3IgLlxcIGZyb20gYmVnaW5uaW5nXG4gICAgd2hpbGUgKC9eXFwuW1xcXFxcXC9dLy50ZXN0KHApKSB7XG4gICAgICBhZGRCYXNlRGlyID0gdHJ1ZTtcbiAgICAgIHAgPSBwLnN1YnN0cmluZygyKTtcbiAgICB9XG4gICAgcmV0dXJuIGFkZEJhc2VEaXIgPyBkaXJQYXRoICsgJy8nICsgcCA6IHA7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQXRvbUF1dG9jb21wbGV0ZVBhY2thZ2UoKTtcbiJdfQ==