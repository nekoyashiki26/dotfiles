Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _Dictionary = require('./Dictionary');

var _JavaClassReader = require('./JavaClassReader');

var _ioUtil = require('./ioUtil');

var _ioUtil2 = _interopRequireDefault(_ioUtil);

var _javaUtil = require('./javaUtil');

var _javaUtil2 = _interopRequireDefault(_javaUtil);

'use babel';

var JavaClassLoader = (function () {
  function JavaClassLoader(javaHome) {
    _classCallCheck(this, JavaClassLoader);

    this.javaHome = javaHome;
    this.dict = new _Dictionary.Dictionary();
  }

  _createClass(JavaClassLoader, [{
    key: 'setJavaHome',
    value: function setJavaHome(javaHome) {
      this.javaHome = javaHome;
    }
  }, {
    key: 'findClass',
    value: function findClass(namePrefix) {
      return this.dict.find('class', namePrefix);
    }
  }, {
    key: 'findSuperClassName',
    value: function findSuperClassName(className) {
      var classes = this.findClass(className);
      var clazz = _lodash._.find(classes, function (c) {
        return c.className === className;
      });
      return clazz ? clazz.extend : null;
    }
  }, {
    key: 'findClassMember',
    value: function findClassMember(className, namePrefix) {
      return this.dict.find(className, namePrefix);
    }
  }, {
    key: 'touchClass',
    value: function touchClass(className) {
      var classDescs = this.findClass(className);
      if (classDescs.length) {
        this.touch(classDescs[0]);
      }
    }
  }, {
    key: 'touch',
    value: function touch(classDesc) {
      this.dict.touch(classDesc);
    }
  }, {
    key: 'loadClass',
    value: function loadClass(className, classpath, loadClassMembers) {
      var _this = this;

      console.log('autocomplete-java load class: ' + className);
      var classReader = new _JavaClassReader.JavaClassReader(loadClassMembers, true, this.javaHome);
      return classReader.readClassesByName(classpath, [className], true, function (cp, classDesc) {
        return _this._addClass(classDesc, Date.now());
      });
    }
  }, {
    key: 'loadClasses',
    value: function loadClasses(classpath, loadClassMembers, fullRefresh) {
      var _this2 = this;

      var promise = null;
      if (fullRefresh && this.fullRefreshOngoing) {
        // TODO reject promise on warning and notify about warning afterwards
        atom.notifications.addWarning('autocomplete-java:\n ' + 'Full refresh already in progress. Execute normal refresh or ' + 'try full refresh again later.', { dismissable: true });
        promise = Promise.resolve();
      } else {
        console.log('autocomplete-java load start, full refresh: ' + fullRefresh);
        if (fullRefresh) {
          this.fullRefreshOngoing = true;
          this.dict = new _Dictionary.Dictionary();
        }

        // First load basic class descriptions
        promise = this._loadClassesImpl(classpath, false, fullRefresh).then(function () {
          // Then, optionally, load also class members
          if (loadClassMembers) {
            return _this2._loadClassesImpl(classpath, true, fullRefresh);
          }
        }).then(function () {
          // Loading finished
          if (fullRefresh) {
            _this2.fullRefreshOngoing = false;
          }
          console.log('autocomplete-java load end, full refresh: ' + fullRefresh);
        });
      }
      return promise;
    }
  }, {
    key: '_loadClassesImpl',
    value: function _loadClassesImpl(classpath, loadClassMembers, fullRefresh) {
      var _this3 = this;

      var classReader = new _JavaClassReader.JavaClassReader(loadClassMembers, true, this.javaHome);

      // First load project classes
      console.log('autocomplete-java loading project classes. loadMembers: ' + loadClassMembers);
      return classReader.readAllClassesFromClasspath(classpath, !fullRefresh, function (cp, className, classMembers) {
        // Add class
        // 0 / 2 = class files have a priority over jars among suggestions
        return _this3._addClass(className, classMembers, cp.indexOf('.jar') !== -1 ? 0 : 2);
      }).then(function () {
        // Then load system libs
        return fullRefresh ? _this3._loadSystemLibsImpl(classReader) : Promise.resolve();
      });
    }
  }, {
    key: '_loadSystemLibsImpl',
    value: function _loadSystemLibsImpl(classReader) {
      var _this4 = this;

      // Read java system info
      return _ioUtil2['default'].exec('"' + classReader.javaBinDir() + 'java" -verbose', true).then(function (javaSystemInfo) {
        // Load system classes from rt.jar
        var promise = null;
        console.log('autocomplete-java loading system classes.');
        var rtJarPath = (javaSystemInfo.match(/Opened (.*jar)/) || [])[1];
        if (rtJarPath) {
          promise = classReader.readAllClassesFromJar(rtJarPath, function (cp, className, classMembers) {
            return _this4._addClass(className, classMembers, 1);
          });
        } else {
          // TODO reject promise on error and notify about error afterwards
          atom.notifications.addError('autocomplete-java:\njava rt.jar not found', { dismissable: true });
          promise = Promise.resolve();
        }
        return promise;
      });
    }
  }, {
    key: '_addClass',
    value: function _addClass(desc, lastUsed) {
      var _this5 = this;

      var simpleName = _javaUtil2['default'].getSimpleName(desc.className);
      var inverseName = _javaUtil2['default'].getInverseName(desc.className);
      var classDesc = {
        type: 'class',
        name: simpleName,
        simpleName: simpleName,
        className: desc.className,
        extend: desc.extend,
        packageName: _javaUtil2['default'].getPackageName(desc.className),
        lastUsed: lastUsed || 0,
        constructors: [],
        members: []
      };
      this.dict.remove('class', desc.className);
      this.dict.remove('class', inverseName);
      this.dict.add('class', desc.className, classDesc);
      this.dict.add('class', inverseName, classDesc);
      if (desc.members) {
        this.dict.removeCategory(desc.className);
        _lodash._.each(desc.members, function (prototype) {
          _this5._addClassMember(classDesc, prototype, lastUsed);
        });
      }
      return Promise.resolve();
    }
  }, {
    key: '_addClassMember',
    value: function _addClassMember(classDesc, member, lastUsed) {
      try {
        var simpleName = _javaUtil2['default'].getSimpleName(classDesc.className);
        var prototype = member.replace(/\).*/, ');').replace(/,\s/g, ',').trim();
        if (prototype.indexOf('{') !== -1) {
          // console.log('?? ' + prototype);
        } else {
            var type = null;
            if (prototype.indexOf(classDesc.className + '(') !== -1) {
              type = 'constructor';
            } else if (prototype.indexOf('(') !== -1) {
              type = 'method';
            } else {
              type = 'property';
            }

            var _name = type !== 'constructor' ? prototype.match(/\s([^\(\s]*)[\(;]/)[1] : classDesc.simpleName;
            var paramStr = type !== 'property' ? prototype.match(/\((.*)\)/)[1] : null;
            var key = _name + (type !== 'property' ? '(' + paramStr + ')' : '');

            var memberDesc = {
              type: type,
              name: _name,
              simpleName: simpleName,
              className: classDesc.className,
              packageName: classDesc.packageName,
              lastUsed: lastUsed || 0,
              classDesc: classDesc,
              member: {
                name: _name,
                returnType: type !== 'constructor' ? _lodash._.last(prototype.replace(/\(.*\)/, '').match(/([^\s]+)\s/g)).trim() : classDesc.className,
                visibility: this._determineVisibility(prototype),
                params: paramStr ? paramStr.split(',') : null,
                prototype: prototype
              }
            };
            if (type === 'constructor') {
              classDesc.constructors.push(memberDesc);
            } else {
              // const key = (prototype.match(/\s([^\s]*\(.*\));/) ||
              //   prototype.match(/\s([^\s]*);/))[1];
              this.dict.add(classDesc.className, key, memberDesc);
              classDesc.members.push(memberDesc);
            }
          }
      } catch (err) {
        // console.warn(err);
      }
    }
  }, {
    key: '_determineVisibility',
    value: function _determineVisibility(prototype) {
      var v = prototype.split(/\s/)[0];
      return (/public|private|protected/.test(v) ? v : 'package'
      );
    }
  }]);

  return JavaClassLoader;
})();

exports.JavaClassLoader = JavaClassLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvSmF2YUNsYXNzTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWtCLFFBQVE7OzBCQUNDLGNBQWM7OytCQUNULG1CQUFtQjs7c0JBQ2hDLFVBQVU7Ozs7d0JBQ1IsWUFBWTs7OztBQU5qQyxXQUFXLENBQUM7O0lBUUMsZUFBZTtBQUVmLFdBRkEsZUFBZSxDQUVkLFFBQVEsRUFBRTswQkFGWCxlQUFlOztBQUd4QixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixRQUFJLENBQUMsSUFBSSxHQUFHLDRCQUFnQixDQUFDO0dBQzlCOztlQUxVLGVBQWU7O1dBT2YscUJBQUMsUUFBUSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0tBQzFCOzs7V0FFUSxtQkFBQyxVQUFVLEVBQUU7QUFDcEIsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDNUM7OztXQUVpQiw0QkFBQyxTQUFTLEVBQUU7QUFDNUIsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMxQyxVQUFNLEtBQUssR0FBRyxVQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQSxDQUFDLEVBQUk7QUFDakMsZUFBTyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQztPQUNsQyxDQUFDLENBQUM7QUFDSCxhQUFPLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztLQUNwQzs7O1dBRWMseUJBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRTtBQUNyQyxhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUM5Qzs7O1dBRVMsb0JBQUMsU0FBUyxFQUFF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QUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLGFBQU8sMkJBQTBCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTO1FBQUM7S0FDM0Q7OztTQWxOVSxlQUFlIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvSmF2YUNsYXNzTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IF8gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgRGljdGlvbmFyeSB9IGZyb20gJy4vRGljdGlvbmFyeSc7XG5pbXBvcnQgeyBKYXZhQ2xhc3NSZWFkZXIgfSBmcm9tICcuL0phdmFDbGFzc1JlYWRlcic7XG5pbXBvcnQgaW9VdGlsIGZyb20gJy4vaW9VdGlsJztcbmltcG9ydCBqYXZhVXRpbCBmcm9tICcuL2phdmFVdGlsJztcblxuZXhwb3J0IGNsYXNzIEphdmFDbGFzc0xvYWRlciB7XG5cbiAgY29uc3RydWN0b3IoamF2YUhvbWUpIHtcbiAgICB0aGlzLmphdmFIb21lID0gamF2YUhvbWU7XG4gICAgdGhpcy5kaWN0ID0gbmV3IERpY3Rpb25hcnkoKTtcbiAgfVxuXG4gIHNldEphdmFIb21lKGphdmFIb21lKSB7XG4gICAgdGhpcy5qYXZhSG9tZSA9IGphdmFIb21lO1xuICB9XG5cbiAgZmluZENsYXNzKG5hbWVQcmVmaXgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWN0LmZpbmQoJ2NsYXNzJywgbmFtZVByZWZpeCk7XG4gIH1cblxuICBmaW5kU3VwZXJDbGFzc05hbWUoY2xhc3NOYW1lKSB7XG4gICAgY29uc3QgY2xhc3NlcyA9IHRoaXMuZmluZENsYXNzKGNsYXNzTmFtZSk7XG4gICAgY29uc3QgY2xhenogPSBfLmZpbmQoY2xhc3NlcywgYyA9PiB7XG4gICAgICByZXR1cm4gYy5jbGFzc05hbWUgPT09IGNsYXNzTmFtZTtcbiAgICB9KTtcbiAgICByZXR1cm4gY2xhenogPyBjbGF6ei5leHRlbmQgOiBudWxsO1xuICB9XG5cbiAgZmluZENsYXNzTWVtYmVyKGNsYXNzTmFtZSwgbmFtZVByZWZpeCkge1xuICAgIHJldHVybiB0aGlzLmRpY3QuZmluZChjbGFzc05hbWUsIG5hbWVQcmVmaXgpO1xuICB9XG5cbiAgdG91Y2hDbGFzcyhjbGFzc05hbWUpIHtcbiAgICBjb25zdCBjbGFzc0Rlc2NzID0gdGhpcy5maW5kQ2xhc3MoY2xhc3NOYW1lKTtcbiAgICBpZiAoY2xhc3NEZXNjcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMudG91Y2goY2xhc3NEZXNjc1swXSk7XG4gICAgfVxuICB9XG5cbiAgdG91Y2goY2xhc3NEZXNjKSB7XG4gICAgdGhpcy5kaWN0LnRvdWNoKGNsYXNzRGVzYyk7XG4gIH1cblxuICBsb2FkQ2xhc3MoY2xhc3NOYW1lLCBjbGFzc3BhdGgsIGxvYWRDbGFzc01lbWJlcnMpIHtcbiAgICBjb25zb2xlLmxvZygnYXV0b2NvbXBsZXRlLWphdmEgbG9hZCBjbGFzczogJyArIGNsYXNzTmFtZSk7XG4gICAgY29uc3QgY2xhc3NSZWFkZXIgPSBuZXcgSmF2YUNsYXNzUmVhZGVyKGxvYWRDbGFzc01lbWJlcnMsIHRydWUsXG4gICAgICB0aGlzLmphdmFIb21lKTtcbiAgICByZXR1cm4gY2xhc3NSZWFkZXIucmVhZENsYXNzZXNCeU5hbWUoY2xhc3NwYXRoLCBbIGNsYXNzTmFtZSBdLCB0cnVlLFxuICAgIChjcCwgY2xhc3NEZXNjKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fYWRkQ2xhc3MoY2xhc3NEZXNjLCBEYXRlLm5vdygpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWRDbGFzc2VzKGNsYXNzcGF0aCwgbG9hZENsYXNzTWVtYmVycywgZnVsbFJlZnJlc2gpIHtcbiAgICBsZXQgcHJvbWlzZSA9IG51bGw7XG4gICAgaWYgKGZ1bGxSZWZyZXNoICYmIHRoaXMuZnVsbFJlZnJlc2hPbmdvaW5nKSB7XG4gICAgICAvLyBUT0RPIHJlamVjdCBwcm9taXNlIG9uIHdhcm5pbmcgYW5kIG5vdGlmeSBhYm91dCB3YXJuaW5nIGFmdGVyd2FyZHNcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdhdXRvY29tcGxldGUtamF2YTpcXG4gJyArXG4gICAgICAgICdGdWxsIHJlZnJlc2ggYWxyZWFkeSBpbiBwcm9ncmVzcy4gRXhlY3V0ZSBub3JtYWwgcmVmcmVzaCBvciAnICtcbiAgICAgICAgJ3RyeSBmdWxsIHJlZnJlc2ggYWdhaW4gbGF0ZXIuJywgeyBkaXNtaXNzYWJsZTogdHJ1ZSB9KTtcbiAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2F1dG9jb21wbGV0ZS1qYXZhIGxvYWQgc3RhcnQsIGZ1bGwgcmVmcmVzaDogJyArIGZ1bGxSZWZyZXNoKTtcbiAgICAgIGlmIChmdWxsUmVmcmVzaCkge1xuICAgICAgICB0aGlzLmZ1bGxSZWZyZXNoT25nb2luZyA9IHRydWU7XG4gICAgICAgIHRoaXMuZGljdCA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpcnN0IGxvYWQgYmFzaWMgY2xhc3MgZGVzY3JpcHRpb25zXG4gICAgICBwcm9taXNlID0gdGhpcy5fbG9hZENsYXNzZXNJbXBsKGNsYXNzcGF0aCwgZmFsc2UsIGZ1bGxSZWZyZXNoKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyBUaGVuLCBvcHRpb25hbGx5LCBsb2FkIGFsc28gY2xhc3MgbWVtYmVyc1xuICAgICAgICBpZiAobG9hZENsYXNzTWVtYmVycykge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9sb2FkQ2xhc3Nlc0ltcGwoY2xhc3NwYXRoLCB0cnVlLCBmdWxsUmVmcmVzaCk7XG4gICAgICAgIH1cbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyBMb2FkaW5nIGZpbmlzaGVkXG4gICAgICAgIGlmIChmdWxsUmVmcmVzaCkge1xuICAgICAgICAgIHRoaXMuZnVsbFJlZnJlc2hPbmdvaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ2F1dG9jb21wbGV0ZS1qYXZhIGxvYWQgZW5kLCBmdWxsIHJlZnJlc2g6ICcgKyBmdWxsUmVmcmVzaCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBfbG9hZENsYXNzZXNJbXBsKGNsYXNzcGF0aCwgbG9hZENsYXNzTWVtYmVycywgZnVsbFJlZnJlc2gpIHtcbiAgICBjb25zdCBjbGFzc1JlYWRlciA9IG5ldyBKYXZhQ2xhc3NSZWFkZXIobG9hZENsYXNzTWVtYmVycywgdHJ1ZSxcbiAgICAgIHRoaXMuamF2YUhvbWUpO1xuXG4gICAgLy8gRmlyc3QgbG9hZCBwcm9qZWN0IGNsYXNzZXNcbiAgICBjb25zb2xlLmxvZygnYXV0b2NvbXBsZXRlLWphdmEgbG9hZGluZyBwcm9qZWN0IGNsYXNzZXMuIGxvYWRNZW1iZXJzOiAnICtcbiAgICAgIGxvYWRDbGFzc01lbWJlcnMpO1xuICAgIHJldHVybiBjbGFzc1JlYWRlci5yZWFkQWxsQ2xhc3Nlc0Zyb21DbGFzc3BhdGgoY2xhc3NwYXRoLCAhZnVsbFJlZnJlc2gsXG4gICAgKGNwLCBjbGFzc05hbWUsIGNsYXNzTWVtYmVycykgPT4ge1xuICAgICAgLy8gQWRkIGNsYXNzXG4gICAgICAvLyAwIC8gMiA9IGNsYXNzIGZpbGVzIGhhdmUgYSBwcmlvcml0eSBvdmVyIGphcnMgYW1vbmcgc3VnZ2VzdGlvbnNcbiAgICAgIHJldHVybiB0aGlzLl9hZGRDbGFzcyhjbGFzc05hbWUsIGNsYXNzTWVtYmVycyxcbiAgICAgICAgY3AuaW5kZXhPZignLmphcicpICE9PSAtMSA/IDAgOiAyKTtcbiAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgIC8vIFRoZW4gbG9hZCBzeXN0ZW0gbGlic1xuICAgICAgcmV0dXJuIGZ1bGxSZWZyZXNoID8gdGhpcy5fbG9hZFN5c3RlbUxpYnNJbXBsKGNsYXNzUmVhZGVyKSA6XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgX2xvYWRTeXN0ZW1MaWJzSW1wbChjbGFzc1JlYWRlcikge1xuICAgIC8vIFJlYWQgamF2YSBzeXN0ZW0gaW5mb1xuICAgIHJldHVybiBpb1V0aWwuZXhlYygnXCInICsgY2xhc3NSZWFkZXIuamF2YUJpbkRpcigpICsgJ2phdmFcIiAtdmVyYm9zZScsIHRydWUpXG4gICAgLnRoZW4oKGphdmFTeXN0ZW1JbmZvKSA9PiB7XG4gICAgICAvLyBMb2FkIHN5c3RlbSBjbGFzc2VzIGZyb20gcnQuamFyXG4gICAgICBsZXQgcHJvbWlzZSA9IG51bGw7XG4gICAgICBjb25zb2xlLmxvZygnYXV0b2NvbXBsZXRlLWphdmEgbG9hZGluZyBzeXN0ZW0gY2xhc3Nlcy4nKTtcbiAgICAgIGNvbnN0IHJ0SmFyUGF0aCA9IChqYXZhU3lzdGVtSW5mby5tYXRjaCgvT3BlbmVkICguKmphcikvKSB8fCBbXSlbMV07XG4gICAgICBpZiAocnRKYXJQYXRoKSB7XG4gICAgICAgIHByb21pc2UgPSBjbGFzc1JlYWRlci5yZWFkQWxsQ2xhc3Nlc0Zyb21KYXIocnRKYXJQYXRoLFxuICAgICAgICAoY3AsIGNsYXNzTmFtZSwgY2xhc3NNZW1iZXJzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENsYXNzKGNsYXNzTmFtZSwgY2xhc3NNZW1iZXJzLCAxKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPIHJlamVjdCBwcm9taXNlIG9uIGVycm9yIGFuZCBub3RpZnkgYWJvdXQgZXJyb3IgYWZ0ZXJ3YXJkc1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2F1dG9jb21wbGV0ZS1qYXZhOlxcbmphdmEgcnQuamFyIG5vdCBmb3VuZCcsXG4gICAgICAgICAgeyBkaXNtaXNzYWJsZTogdHJ1ZSB9KTtcbiAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSk7XG4gIH1cblxuICBfYWRkQ2xhc3MoZGVzYywgbGFzdFVzZWQpIHtcbiAgICBjb25zdCBzaW1wbGVOYW1lID0gamF2YVV0aWwuZ2V0U2ltcGxlTmFtZShkZXNjLmNsYXNzTmFtZSk7XG4gICAgY29uc3QgaW52ZXJzZU5hbWUgPSBqYXZhVXRpbC5nZXRJbnZlcnNlTmFtZShkZXNjLmNsYXNzTmFtZSk7XG4gICAgY29uc3QgY2xhc3NEZXNjID0ge1xuICAgICAgdHlwZTogJ2NsYXNzJyxcbiAgICAgIG5hbWU6IHNpbXBsZU5hbWUsXG4gICAgICBzaW1wbGVOYW1lOiBzaW1wbGVOYW1lLFxuICAgICAgY2xhc3NOYW1lOiBkZXNjLmNsYXNzTmFtZSxcbiAgICAgIGV4dGVuZDogZGVzYy5leHRlbmQsXG4gICAgICBwYWNrYWdlTmFtZTogamF2YVV0aWwuZ2V0UGFja2FnZU5hbWUoZGVzYy5jbGFzc05hbWUpLFxuICAgICAgbGFzdFVzZWQ6IGxhc3RVc2VkIHx8IDAsXG4gICAgICBjb25zdHJ1Y3RvcnM6IFtdLFxuICAgICAgbWVtYmVyczogW10sXG4gICAgfTtcbiAgICB0aGlzLmRpY3QucmVtb3ZlKCdjbGFzcycsIGRlc2MuY2xhc3NOYW1lKTtcbiAgICB0aGlzLmRpY3QucmVtb3ZlKCdjbGFzcycsIGludmVyc2VOYW1lKTtcbiAgICB0aGlzLmRpY3QuYWRkKCdjbGFzcycsIGRlc2MuY2xhc3NOYW1lLCBjbGFzc0Rlc2MpO1xuICAgIHRoaXMuZGljdC5hZGQoJ2NsYXNzJywgaW52ZXJzZU5hbWUsIGNsYXNzRGVzYyk7XG4gICAgaWYgKGRlc2MubWVtYmVycykge1xuICAgICAgdGhpcy5kaWN0LnJlbW92ZUNhdGVnb3J5KGRlc2MuY2xhc3NOYW1lKTtcbiAgICAgIF8uZWFjaChkZXNjLm1lbWJlcnMsIHByb3RvdHlwZSA9PiB7XG4gICAgICAgIHRoaXMuX2FkZENsYXNzTWVtYmVyKGNsYXNzRGVzYywgcHJvdG90eXBlLCBsYXN0VXNlZCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgX2FkZENsYXNzTWVtYmVyKGNsYXNzRGVzYywgbWVtYmVyLCBsYXN0VXNlZCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzaW1wbGVOYW1lID0gamF2YVV0aWwuZ2V0U2ltcGxlTmFtZShjbGFzc0Rlc2MuY2xhc3NOYW1lKTtcbiAgICAgIGNvbnN0IHByb3RvdHlwZSA9IG1lbWJlci5yZXBsYWNlKC9cXCkuKi8sICcpOycpXG4gICAgICAgIC5yZXBsYWNlKC8sXFxzL2csICcsJykudHJpbSgpO1xuICAgICAgaWYgKHByb3RvdHlwZS5pbmRleE9mKCd7JykgIT09IC0xKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCc/PyAnICsgcHJvdG90eXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB0eXBlID0gbnVsbDtcbiAgICAgICAgaWYgKHByb3RvdHlwZS5pbmRleE9mKGNsYXNzRGVzYy5jbGFzc05hbWUgKyAnKCcpICE9PSAtMSkge1xuICAgICAgICAgIHR5cGUgPSAnY29uc3RydWN0b3InO1xuICAgICAgICB9IGVsc2UgaWYgKHByb3RvdHlwZS5pbmRleE9mKCcoJykgIT09IC0xKSB7XG4gICAgICAgICAgdHlwZSA9ICdtZXRob2QnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHR5cGUgPSAncHJvcGVydHknO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IHR5cGUgIT09ICdjb25zdHJ1Y3RvcicgP1xuICAgICAgICAgIHByb3RvdHlwZS5tYXRjaCgvXFxzKFteXFwoXFxzXSopW1xcKDtdLylbMV0gOiBjbGFzc0Rlc2Muc2ltcGxlTmFtZTtcbiAgICAgICAgY29uc3QgcGFyYW1TdHIgPSB0eXBlICE9PSAncHJvcGVydHknID9cbiAgICAgICAgICBwcm90b3R5cGUubWF0Y2goL1xcKCguKilcXCkvKVsxXSA6IG51bGw7XG4gICAgICAgIGNvbnN0IGtleSA9IG5hbWUgKyAodHlwZSAhPT0gJ3Byb3BlcnR5JyA/ICcoJyArIHBhcmFtU3RyICsgJyknIDogJycpO1xuXG4gICAgICAgIGNvbnN0IG1lbWJlckRlc2MgPSB7XG4gICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIHNpbXBsZU5hbWU6IHNpbXBsZU5hbWUsXG4gICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc0Rlc2MuY2xhc3NOYW1lLFxuICAgICAgICAgIHBhY2thZ2VOYW1lOiBjbGFzc0Rlc2MucGFja2FnZU5hbWUsXG4gICAgICAgICAgbGFzdFVzZWQ6IGxhc3RVc2VkIHx8IDAsXG4gICAgICAgICAgY2xhc3NEZXNjOiBjbGFzc0Rlc2MsXG4gICAgICAgICAgbWVtYmVyOiB7XG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgcmV0dXJuVHlwZTogdHlwZSAhPT0gJ2NvbnN0cnVjdG9yJ1xuICAgICAgICAgICAgICA/IF8ubGFzdChwcm90b3R5cGUucmVwbGFjZSgvXFwoLipcXCkvLCAnJylcbiAgICAgICAgICAgICAgICAgIC5tYXRjaCgvKFteXFxzXSspXFxzL2cpKS50cmltKClcbiAgICAgICAgICAgICAgOiBjbGFzc0Rlc2MuY2xhc3NOYW1lLFxuICAgICAgICAgICAgdmlzaWJpbGl0eTogdGhpcy5fZGV0ZXJtaW5lVmlzaWJpbGl0eShwcm90b3R5cGUpLFxuICAgICAgICAgICAgcGFyYW1zOiBwYXJhbVN0ciA/IHBhcmFtU3RyLnNwbGl0KCcsJykgOiBudWxsLFxuICAgICAgICAgICAgcHJvdG90eXBlOiBwcm90b3R5cGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgICAgICBjbGFzc0Rlc2MuY29uc3RydWN0b3JzLnB1c2gobWVtYmVyRGVzYyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gY29uc3Qga2V5ID0gKHByb3RvdHlwZS5tYXRjaCgvXFxzKFteXFxzXSpcXCguKlxcKSk7LykgfHxcbiAgICAgICAgICAvLyAgIHByb3RvdHlwZS5tYXRjaCgvXFxzKFteXFxzXSopOy8pKVsxXTtcbiAgICAgICAgICB0aGlzLmRpY3QuYWRkKGNsYXNzRGVzYy5jbGFzc05hbWUsIGtleSwgbWVtYmVyRGVzYyk7XG4gICAgICAgICAgY2xhc3NEZXNjLm1lbWJlcnMucHVzaChtZW1iZXJEZXNjKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gY29uc29sZS53YXJuKGVycik7XG4gICAgfVxuICB9XG5cbiAgX2RldGVybWluZVZpc2liaWxpdHkocHJvdG90eXBlKSB7XG4gICAgY29uc3QgdiA9IHByb3RvdHlwZS5zcGxpdCgvXFxzLylbMF07XG4gICAgcmV0dXJuIC9wdWJsaWN8cHJpdmF0ZXxwcm90ZWN0ZWQvLnRlc3QodikgPyB2IDogJ3BhY2thZ2UnO1xuICB9XG5cbn1cbiJdfQ==