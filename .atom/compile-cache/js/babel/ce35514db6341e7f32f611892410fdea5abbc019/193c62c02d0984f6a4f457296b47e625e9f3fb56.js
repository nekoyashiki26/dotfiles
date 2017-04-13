Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _ioUtil = require('./ioUtil');

var _ioUtil2 = _interopRequireDefault(_ioUtil);

'use babel';

var walk = require('walk');

var JavaClassReader = (function () {
  function JavaClassReader(loadClassMembers, ignoreInnerClasses, javaHome) {
    _classCallCheck(this, JavaClassReader);

    this.loadClassMembers = loadClassMembers;
    this.ignoreInnerClasses = ignoreInnerClasses;
    this.javaHome = javaHome;
  }

  _createClass(JavaClassReader, [{
    key: 'readAllClassesFromClasspath',
    value: function readAllClassesFromClasspath(classpath, skipLibs, callback) {
      var _this = this;

      var serialPromise = Promise.resolve();
      // We split with ; on Windows
      var paths = classpath.split(classpath.indexOf(';') !== -1 ? ';' : ':');
      _lodash._.each(paths, function (path) {
        if (path) {
          // TODO
          serialPromise = serialPromise.then(function () {
            return _this.readAllClassesFromPath(path, skipLibs, callback);
          });
        }
      });
      return serialPromise;
    }
  }, {
    key: 'readAllClassesFromPath',
    value: function readAllClassesFromPath(path, skipLibs, callback) {
      var _this2 = this;

      var promise = null;
      if (skipLibs && (path.endsWith('.jar') || path.endsWith('*'))) {
        return Promise.resolve();
      } else if (path.endsWith('.jar')) {
        // Read classes from a jar file
        promise = this.readAllClassesFromJar(path, callback);
      } else if (path.endsWith('*')) {
        (function () {
          // List jar files and read classes from them
          var dir = path.replace('*', '');
          promise = _ioUtil2['default'].readDir(dir).then(function (names) {
            var serialPromise = Promise.resolve();
            _lodash._.each(names, function (name) {
              if (name.endsWith('.jar')) {
                // TODO
                serialPromise = serialPromise.then(function () {
                  return _this2.readAllClassesFromJar(dir + name, callback);
                });
              }
            });
            return serialPromise;
          });
        })();
      } else {
        var _ret2 = (function () {
          // Gather all class files from a directory and its subdirectories
          var classFilePaths = [];
          promise = new Promise(function (resolve) {
            var walker = walk.walk(path, function () {});
            walker.on('directories', function (root, dirStatsArray, next) {
              next();
            });
            walker.on('file', function (root, fileStats, next) {
              if (fileStats.name.endsWith('.class')) {
                var classFilePath = (root + '/' + fileStats.name).replace(path + '/', '').replace(path + '\\', '');
                classFilePaths.push(classFilePath);
              }
              next();
            });
            walker.on('errors', function (root, nodeStatsArray, next) {
              next();
            });
            walker.on('end', function () {
              resolve();
            });
          });
          // Read classes
          return {
            v: promise.then(function () {
              return _this2.readClassesByName(path, classFilePaths, true, callback);
            })
          };
        })();

        if (typeof _ret2 === 'object') return _ret2.v;
      }
      return promise;
    }
  }, {
    key: 'readAllClassesFromJar',
    value: function readAllClassesFromJar(jarPath, callback) {
      var _this3 = this;

      return _ioUtil2['default'].exec('"' + this.javaBinDir() + 'jar" tf "' + jarPath + '"').then(function (stdout) {
        var filePaths = stdout.match(new RegExp('[\\S]*\\.class', 'g'));
        return _this3.readClassesByName(jarPath, filePaths, false, callback);
      });
    }
  }, {
    key: 'readClassesByName',
    value: function readClassesByName(classpath, cNames, parseArgs, callback) {
      var _this4 = this;

      // Filter and format class names from cNames that can be either
      // class names or file paths
      var classNames = (0, _lodash._)(cNames).filter(function (className) {
        return className && (className.indexOf('$') === -1 || !_this4.ignoreInnerClasses);
      }).map(function (className) {
        return className.replace('.class', '').replace(/[\/\\]/g, '.').trim();
      }).value();

      var promise = null;
      if (this.loadClassMembers) {
        // Read class info with javap
        promise = this.readClassesByNameWithJavap(classpath, classNames, parseArgs, callback);
      } else {
        // Just do callback with class name only
        _lodash._.each(classNames, function (className) {
          callback(classpath, { className: className });
        });
        promise = Promise.resolve();
      }
      return promise;
    }
  }, {
    key: 'readClassesByNameWithJavap',
    value: function readClassesByNameWithJavap(classpath, classNamesArray, parseArgs, callback) {
      var _this5 = this;

      var serialPromise = Promise.resolve();

      // Group array in multiple arrays of limited max length
      _lodash._.each(_lodash._.chunk(classNamesArray, parseArgs ? 20 : 50), function (classNames) {
        // Read classes with javap
        serialPromise = serialPromise.then(function () {
          var classNamesStr = _lodash._.reduce(classNames, function (className, result) {
            return result + ' ' + className;
          }, '');
          return _ioUtil2['default'].exec('"' + _this5.javaBinDir() + 'javap" ' + (parseArgs ? '-verbose -private ' : ' ') + '-classpath "' + classpath + '" ' + classNamesStr, false, true).then(function (stdout) {
            _lodash._.each(stdout.match(/Compiled from [^\}]*\}/gm), function (javapClass) {
              try {
                var classDesc = _this5.parseJavapClass(javapClass, parseArgs);
                callback(classpath, classDesc);
              } catch (err) {
                console.warn(err);
              }
            });
          });
        });
      });

      return serialPromise;
    }

    // TODO: This is a quick and ugly hack. Replace with an separate
    // javap parser module
  }, {
    key: 'parseJavapClass',
    value: function parseJavapClass(javapClass, parseArgs) {
      var desc = null;

      if (!parseArgs) {
        var extend = javapClass.match(/extends ([^\s]+)/);
        desc = {
          className: javapClass.match(/(class|interface)\s(\S*)\s/)[2].replace(/\<.*/g, ''),
          extend: extend ? extend[1] : null,
          members: javapClass.match(/(\S.*);/g)
        };
      } else {
        (function () {
          desc = {
            className: null,
            extend: null,
            members: [],
            members2: []
          };

          var status = 'header';
          var parsingArgs = false;

          _lodash._.each(javapClass.split(/[\r\n]+/), function (l) {
            var line = l.trim();
            var lineIndent = l.match(/^\s*/)[0].length;

            if (status === 'header') {
              if (/class|interface/.test(line)) {
                // Parse class/interface name and extends
                var extend = javapClass.match(/extends ([^\s]+)/);
                desc.extend = extend ? extend[1] : null;
                desc.className = javapClass.match(/(class|interface)\s(\S*)\s/)[2].replace(/\<.*/g, '');
              }
              if (line.indexOf('{') !== -1) {
                // Start parsing class members
                status = 'members';
              }
            } else if (status === 'members') {
              if (lineIndent === 2) {
                // Add new member
                desc.members2.push({
                  prototype: line,
                  args: []
                });
                parsingArgs = false;
              } else if (lineIndent === 4) {
                parsingArgs = /MethodParameters/.test(line);
              } else if (lineIndent === 6 && parsingArgs && line.indexOf(' ') === -1) {
                desc.members2[desc.members2.length - 1].args.push(line);
              } else if (line === '}') {
                status = 'end';
              }
            }
          });

          _lodash._.each(desc.members2, function (member) {
            var tmp = member.prototype;

            // NOTE: quick hack for generics support
            for (var i = 0; i < 5; i++) {
              var t = tmp.replace(/<(.*),\s+(.*)>/, '&lt;$1|comma|$2&gt;');
              tmp = t;
            }

            _lodash._.each(member.args, function (arg) {
              if (tmp.indexOf(',') !== -1) {
                tmp = tmp.replace(',', ' ' + arg + '=');
              } else {
                tmp = tmp.replace(')', ' ' + arg + ')');
              }
            });
            tmp = tmp.replace(/=/g, ',');

            // NOTE: quick hack for generics support
            tmp = tmp.replace(/&lt;/g, '<');
            tmp = tmp.replace(/&gt;/g, '>');
            tmp = tmp.replace(/\|comma\|/g, ',');

            member.prototype = tmp;
            desc.members.push(tmp);
          });
        })();
      }

      return desc;
    }
  }, {
    key: 'javaBinDir',
    value: function javaBinDir() {
      var baseDir = this.javaHome || process.env.JAVA_HOME;
      if (baseDir) {
        return baseDir.replace(/[\/\\]$/, '') + '/bin/';
      }
      return '';
    }
  }]);

  return JavaClassReader;
})();

exports.JavaClassReader = JavaClassReader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvSmF2YUNsYXNzUmVhZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWtCLFFBQVE7O3NCQUNQLFVBQVU7Ozs7QUFIN0IsV0FBVyxDQUFDOztBQUlaLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7SUFFaEIsZUFBZTtBQUVmLFdBRkEsZUFBZSxDQUVkLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRTswQkFGakQsZUFBZTs7QUFHeEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0FBQ3pDLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztBQUM3QyxRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztHQUMxQjs7ZUFOVSxlQUFlOztXQVFDLHFDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFOzs7QUFDekQsVUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUV0QyxVQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3pFLGdCQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsVUFBQSxJQUFJLEVBQUk7QUFDcEIsWUFBSSxJQUFJLEVBQUU7O0FBRVIsdUJBQWEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDdkMsbUJBQU8sTUFBSyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1dBQzlELENBQUMsQ0FBQztTQUNKO09BQ0YsQ0FBQyxDQUFDO0FBQ0gsYUFBTyxhQUFhLENBQUM7S0FDdEI7OztXQUVxQixnQ0FBQyxJQUFJLEVBQUUs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QUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLGVBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNoQyxlQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXJDLGtCQUFNLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUN2QixnQkFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDeEIsQ0FBQyxDQUFDOztPQUNKOztBQUVELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVTLHNCQUFHO0FBQ1gsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztBQUN2RCxVQUFJLE9BQU8sRUFBRTtBQUNYLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDO09BQ2pEO0FBQ0QsYUFBTyxFQUFFLENBQUM7S0FDWDs7O1NBNU9VLGVBQWUiLCJmaWxlIjoiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhL2xpYi9KYXZhQ2xhc3NSZWFkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgXyB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgaW9VdGlsIGZyb20gJy4vaW9VdGlsJztcbmNvbnN0IHdhbGsgPSByZXF1aXJlKCd3YWxrJyk7XG5cbmV4cG9ydCBjbGFzcyBKYXZhQ2xhc3NSZWFkZXIge1xuXG4gIGNvbnN0cnVjdG9yKGxvYWRDbGFzc01lbWJlcnMsIGlnbm9yZUlubmVyQ2xhc3NlcywgamF2YUhvbWUpIHtcbiAgICB0aGlzLmxvYWRDbGFzc01lbWJlcnMgPSBsb2FkQ2xhc3NNZW1iZXJzO1xuICAgIHRoaXMuaWdub3JlSW5uZXJDbGFzc2VzID0gaWdub3JlSW5uZXJDbGFzc2VzO1xuICAgIHRoaXMuamF2YUhvbWUgPSBqYXZhSG9tZTtcbiAgfVxuXG4gIHJlYWRBbGxDbGFzc2VzRnJvbUNsYXNzcGF0aChjbGFzc3BhdGgsIHNraXBMaWJzLCBjYWxsYmFjaykge1xuICAgIGxldCBzZXJpYWxQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgLy8gV2Ugc3BsaXQgd2l0aCA7IG9uIFdpbmRvd3NcbiAgICBjb25zdCBwYXRocyA9IGNsYXNzcGF0aC5zcGxpdChjbGFzc3BhdGguaW5kZXhPZignOycpICE9PSAtMSA/ICc7JyA6ICc6Jyk7XG4gICAgXy5lYWNoKHBhdGhzLCBwYXRoID0+IHtcbiAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgc2VyaWFsUHJvbWlzZSA9IHNlcmlhbFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVhZEFsbENsYXNzZXNGcm9tUGF0aChwYXRoLCBza2lwTGlicywgY2FsbGJhY2spO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc2VyaWFsUHJvbWlzZTtcbiAgfVxuXG4gIHJlYWRBbGxDbGFzc2VzRnJvbVBhdGgocGF0aCwgc2tpcExpYnMsIGNhbGxiYWNrKSB7XG4gICAgbGV0IHByb21pc2UgPSBudWxsO1xuICAgIGlmIChza2lwTGlicyAmJiAocGF0aC5lbmRzV2l0aCgnLmphcicpIHx8IHBhdGguZW5kc1dpdGgoJyonKSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9IGVsc2UgaWYgKHBhdGguZW5kc1dpdGgoJy5qYXInKSkge1xuICAgICAgLy8gUmVhZCBjbGFzc2VzIGZyb20gYSBqYXIgZmlsZVxuICAgICAgcHJvbWlzZSA9IHRoaXMucmVhZEFsbENsYXNzZXNGcm9tSmFyKHBhdGgsIGNhbGxiYWNrKTtcbiAgICB9IGVsc2UgaWYgKHBhdGguZW5kc1dpdGgoJyonKSkge1xuICAgICAgLy8gTGlzdCBqYXIgZmlsZXMgYW5kIHJlYWQgY2xhc3NlcyBmcm9tIHRoZW1cbiAgICAgIGNvbnN0IGRpciA9IHBhdGgucmVwbGFjZSgnKicsICcnKTtcbiAgICAgIHByb21pc2UgPSBpb1V0aWwucmVhZERpcihkaXIpLnRoZW4obmFtZXMgPT4ge1xuICAgICAgICBsZXQgc2VyaWFsUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBfLmVhY2gobmFtZXMsIG5hbWUgPT4ge1xuICAgICAgICAgIGlmIChuYW1lLmVuZHNXaXRoKCcuamFyJykpIHtcbiAgICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgICAgIHNlcmlhbFByb21pc2UgPSBzZXJpYWxQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkQWxsQ2xhc3Nlc0Zyb21KYXIoZGlyICsgbmFtZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHNlcmlhbFByb21pc2U7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gR2F0aGVyIGFsbCBjbGFzcyBmaWxlcyBmcm9tIGEgZGlyZWN0b3J5IGFuZCBpdHMgc3ViZGlyZWN0b3JpZXNcbiAgICAgIGNvbnN0IGNsYXNzRmlsZVBhdGhzID0gW107XG4gICAgICBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY29uc3Qgd2Fsa2VyID0gd2Fsay53YWxrKHBhdGgsICgpID0+IHsgfSk7XG4gICAgICAgIHdhbGtlci5vbignZGlyZWN0b3JpZXMnLCAocm9vdCwgZGlyU3RhdHNBcnJheSwgbmV4dCkgPT4ge1xuICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHdhbGtlci5vbignZmlsZScsIChyb290LCBmaWxlU3RhdHMsIG5leHQpID0+IHtcbiAgICAgICAgICBpZiAoZmlsZVN0YXRzLm5hbWUuZW5kc1dpdGgoJy5jbGFzcycpKSB7XG4gICAgICAgICAgICBjb25zdCBjbGFzc0ZpbGVQYXRoID0gKHJvb3QgKyAnLycgKyBmaWxlU3RhdHMubmFtZSlcbiAgICAgICAgICAgICAgLnJlcGxhY2UocGF0aCArICcvJywgJycpLnJlcGxhY2UocGF0aCArICdcXFxcJywgJycpO1xuICAgICAgICAgICAgY2xhc3NGaWxlUGF0aHMucHVzaChjbGFzc0ZpbGVQYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgd2Fsa2VyLm9uKCdlcnJvcnMnLCAocm9vdCwgbm9kZVN0YXRzQXJyYXksIG5leHQpID0+IHtcbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB3YWxrZXIub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICAvLyBSZWFkIGNsYXNzZXNcbiAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWFkQ2xhc3Nlc0J5TmFtZShwYXRoLCBjbGFzc0ZpbGVQYXRocywgdHJ1ZSwgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgcmVhZEFsbENsYXNzZXNGcm9tSmFyKGphclBhdGgsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGlvVXRpbC5leGVjKCdcIicgKyB0aGlzLmphdmFCaW5EaXIoKSArICdqYXJcIiB0ZiBcIicgKyBqYXJQYXRoICsgJ1wiJylcbiAgICAudGhlbihzdGRvdXQgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGhzID0gc3Rkb3V0Lm1hdGNoKG5ldyBSZWdFeHAoJ1tcXFxcU10qXFxcXC5jbGFzcycsICdnJykpO1xuICAgICAgcmV0dXJuIHRoaXMucmVhZENsYXNzZXNCeU5hbWUoamFyUGF0aCwgZmlsZVBhdGhzLCBmYWxzZSwgY2FsbGJhY2spO1xuICAgIH0pO1xuICB9XG5cbiAgcmVhZENsYXNzZXNCeU5hbWUoY2xhc3NwYXRoLCBjTmFtZXMsIHBhcnNlQXJncywgY2FsbGJhY2spIHtcbiAgICAvLyBGaWx0ZXIgYW5kIGZvcm1hdCBjbGFzcyBuYW1lcyBmcm9tIGNOYW1lcyB0aGF0IGNhbiBiZSBlaXRoZXJcbiAgICAvLyBjbGFzcyBuYW1lcyBvciBmaWxlIHBhdGhzXG4gICAgY29uc3QgY2xhc3NOYW1lcyA9IF8oY05hbWVzKS5maWx0ZXIoKGNsYXNzTmFtZSkgPT4ge1xuICAgICAgcmV0dXJuIGNsYXNzTmFtZSAmJiAoY2xhc3NOYW1lLmluZGV4T2YoJyQnKSA9PT0gLTEgfHxcbiAgICAgICAgIXRoaXMuaWdub3JlSW5uZXJDbGFzc2VzKTtcbiAgICB9KS5tYXAoKGNsYXNzTmFtZSkgPT4ge1xuICAgICAgcmV0dXJuIGNsYXNzTmFtZS5yZXBsYWNlKCcuY2xhc3MnLCAnJykucmVwbGFjZSgvW1xcL1xcXFxdL2csICcuJykudHJpbSgpO1xuICAgIH0pLnZhbHVlKCk7XG5cbiAgICBsZXQgcHJvbWlzZSA9IG51bGw7XG4gICAgaWYgKHRoaXMubG9hZENsYXNzTWVtYmVycykge1xuICAgICAgLy8gUmVhZCBjbGFzcyBpbmZvIHdpdGggamF2YXBcbiAgICAgIHByb21pc2UgPSB0aGlzLnJlYWRDbGFzc2VzQnlOYW1lV2l0aEphdmFwKFxuICAgICAgICBjbGFzc3BhdGgsIGNsYXNzTmFtZXMsIHBhcnNlQXJncywgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBKdXN0IGRvIGNhbGxiYWNrIHdpdGggY2xhc3MgbmFtZSBvbmx5XG4gICAgICBfLmVhY2goY2xhc3NOYW1lcywgKGNsYXNzTmFtZSkgPT4ge1xuICAgICAgICBjYWxsYmFjayhjbGFzc3BhdGgsIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICByZWFkQ2xhc3Nlc0J5TmFtZVdpdGhKYXZhcChjbGFzc3BhdGgsIGNsYXNzTmFtZXNBcnJheSwgcGFyc2VBcmdzLCBjYWxsYmFjaykge1xuICAgIGxldCBzZXJpYWxQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgICAvLyBHcm91cCBhcnJheSBpbiBtdWx0aXBsZSBhcnJheXMgb2YgbGltaXRlZCBtYXggbGVuZ3RoXG4gICAgXy5lYWNoKF8uY2h1bmsoY2xhc3NOYW1lc0FycmF5LCBwYXJzZUFyZ3MgPyAyMCA6IDUwKSwgY2xhc3NOYW1lcyA9PiB7XG4gICAgICAvLyBSZWFkIGNsYXNzZXMgd2l0aCBqYXZhcFxuICAgICAgc2VyaWFsUHJvbWlzZSA9IHNlcmlhbFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZXNTdHIgPSBfLnJlZHVjZShjbGFzc05hbWVzLCAoY2xhc3NOYW1lLCByZXN1bHQpID0+IHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0ICsgJyAnICsgY2xhc3NOYW1lO1xuICAgICAgICB9LCAnJyk7XG4gICAgICAgIHJldHVybiBpb1V0aWwuZXhlYygnXCInICsgdGhpcy5qYXZhQmluRGlyKClcbiAgICAgICAgICArICdqYXZhcFwiICdcbiAgICAgICAgICArIChwYXJzZUFyZ3MgPyAnLXZlcmJvc2UgLXByaXZhdGUgJyA6ICcgJylcbiAgICAgICAgICArICctY2xhc3NwYXRoIFwiJ1xuICAgICAgICAgICsgY2xhc3NwYXRoICsgJ1wiICcgKyBjbGFzc05hbWVzU3RyLCBmYWxzZSwgdHJ1ZSlcbiAgICAgICAgLnRoZW4oc3Rkb3V0ID0+IHtcbiAgICAgICAgICBfLmVhY2goc3Rkb3V0Lm1hdGNoKC9Db21waWxlZCBmcm9tIFteXFx9XSpcXH0vZ20pLCBqYXZhcENsYXNzID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNsYXNzRGVzYyA9IHRoaXMucGFyc2VKYXZhcENsYXNzKGphdmFwQ2xhc3MsIHBhcnNlQXJncyk7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGNsYXNzcGF0aCwgY2xhc3NEZXNjKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZXJpYWxQcm9taXNlO1xuICB9XG5cbiAgLy8gVE9ETzogVGhpcyBpcyBhIHF1aWNrIGFuZCB1Z2x5IGhhY2suIFJlcGxhY2Ugd2l0aCBhbiBzZXBhcmF0ZVxuICAvLyBqYXZhcCBwYXJzZXIgbW9kdWxlXG4gIHBhcnNlSmF2YXBDbGFzcyhqYXZhcENsYXNzLCBwYXJzZUFyZ3MpIHtcbiAgICBsZXQgZGVzYyA9IG51bGw7XG5cbiAgICBpZiAoIXBhcnNlQXJncykge1xuICAgICAgY29uc3QgZXh0ZW5kID0gamF2YXBDbGFzcy5tYXRjaCgvZXh0ZW5kcyAoW15cXHNdKykvKTtcbiAgICAgIGRlc2MgPSB7XG4gICAgICAgIGNsYXNzTmFtZTogamF2YXBDbGFzcy5tYXRjaCgvKGNsYXNzfGludGVyZmFjZSlcXHMoXFxTKilcXHMvKVsyXVxuICAgICAgICAgIC5yZXBsYWNlKC9cXDwuKi9nLCAnJyksXG4gICAgICAgIGV4dGVuZDogZXh0ZW5kID8gZXh0ZW5kWzFdIDogbnVsbCxcbiAgICAgICAgbWVtYmVyczogamF2YXBDbGFzcy5tYXRjaCgvKFxcUy4qKTsvZyksXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXNjID0ge1xuICAgICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgICAgIGV4dGVuZDogbnVsbCxcbiAgICAgICAgbWVtYmVyczogW10sXG4gICAgICAgIG1lbWJlcnMyOiBbXSxcbiAgICAgIH07XG5cbiAgICAgIGxldCBzdGF0dXMgPSAnaGVhZGVyJztcbiAgICAgIGxldCBwYXJzaW5nQXJncyA9IGZhbHNlO1xuXG4gICAgICBfLmVhY2goamF2YXBDbGFzcy5zcGxpdCgvW1xcclxcbl0rLyksIGwgPT4ge1xuICAgICAgICBjb25zdCBsaW5lID0gbC50cmltKCk7XG4gICAgICAgIGNvbnN0IGxpbmVJbmRlbnQgPSBsLm1hdGNoKC9eXFxzKi8pWzBdLmxlbmd0aDtcblxuICAgICAgICBpZiAoc3RhdHVzID09PSAnaGVhZGVyJykge1xuICAgICAgICAgIGlmICgvY2xhc3N8aW50ZXJmYWNlLy50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgICAvLyBQYXJzZSBjbGFzcy9pbnRlcmZhY2UgbmFtZSBhbmQgZXh0ZW5kc1xuICAgICAgICAgICAgY29uc3QgZXh0ZW5kID0gamF2YXBDbGFzcy5tYXRjaCgvZXh0ZW5kcyAoW15cXHNdKykvKTtcbiAgICAgICAgICAgIGRlc2MuZXh0ZW5kID0gZXh0ZW5kID8gZXh0ZW5kWzFdIDogbnVsbDtcbiAgICAgICAgICAgIGRlc2MuY2xhc3NOYW1lID0gamF2YXBDbGFzcy5tYXRjaCgvKGNsYXNzfGludGVyZmFjZSlcXHMoXFxTKilcXHMvKVsyXVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFw8LiovZywgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCd7JykgIT09IC0xKSB7XG4gICAgICAgICAgICAvLyBTdGFydCBwYXJzaW5nIGNsYXNzIG1lbWJlcnNcbiAgICAgICAgICAgIHN0YXR1cyA9ICdtZW1iZXJzJztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSAnbWVtYmVycycpIHtcbiAgICAgICAgICBpZiAobGluZUluZGVudCA9PT0gMikge1xuICAgICAgICAgICAgLy8gQWRkIG5ldyBtZW1iZXJcbiAgICAgICAgICAgIGRlc2MubWVtYmVyczIucHVzaCh7XG4gICAgICAgICAgICAgIHByb3RvdHlwZTogbGluZSxcbiAgICAgICAgICAgICAgYXJnczogW10sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHBhcnNpbmdBcmdzID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIGlmIChsaW5lSW5kZW50ID09PSA0KSB7XG4gICAgICAgICAgICBwYXJzaW5nQXJncyA9IC9NZXRob2RQYXJhbWV0ZXJzLy50ZXN0KGxpbmUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGluZUluZGVudCA9PT0gNiAmJiBwYXJzaW5nQXJncyAmJlxuICAgICAgICAgICAgICBsaW5lLmluZGV4T2YoJyAnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGRlc2MubWVtYmVyczJbZGVzYy5tZW1iZXJzMi5sZW5ndGggLSAxXS5hcmdzLnB1c2gobGluZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChsaW5lID09PSAnfScpIHtcbiAgICAgICAgICAgIHN0YXR1cyA9ICdlbmQnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIF8uZWFjaChkZXNjLm1lbWJlcnMyLCBtZW1iZXIgPT4ge1xuICAgICAgICBsZXQgdG1wID0gbWVtYmVyLnByb3RvdHlwZTtcblxuICAgICAgICAvLyBOT1RFOiBxdWljayBoYWNrIGZvciBnZW5lcmljcyBzdXBwb3J0XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgdCA9IHRtcC5yZXBsYWNlKC88KC4qKSxcXHMrKC4qKT4vLCAnJmx0OyQxfGNvbW1hfCQyJmd0OycpO1xuICAgICAgICAgIHRtcCA9IHQ7XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2gobWVtYmVyLmFyZ3MsIGFyZyA9PiB7XG4gICAgICAgICAgaWYgKHRtcC5pbmRleE9mKCcsJykgIT09IC0xKSB7XG4gICAgICAgICAgICB0bXAgPSB0bXAucmVwbGFjZSgnLCcsICcgJyArIGFyZyArICc9Jyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRtcCA9IHRtcC5yZXBsYWNlKCcpJywgJyAnICsgYXJnICsgJyknKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0bXAgPSB0bXAucmVwbGFjZSgvPS9nLCAnLCcpO1xuXG4gICAgICAgIC8vIE5PVEU6IHF1aWNrIGhhY2sgZm9yIGdlbmVyaWNzIHN1cHBvcnRcbiAgICAgICAgdG1wID0gdG1wLnJlcGxhY2UoLyZsdDsvZywgJzwnKTtcbiAgICAgICAgdG1wID0gdG1wLnJlcGxhY2UoLyZndDsvZywgJz4nKTtcbiAgICAgICAgdG1wID0gdG1wLnJlcGxhY2UoL1xcfGNvbW1hXFx8L2csICcsJyk7XG5cbiAgICAgICAgbWVtYmVyLnByb3RvdHlwZSA9IHRtcDtcbiAgICAgICAgZGVzYy5tZW1iZXJzLnB1c2godG1wKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBkZXNjO1xuICB9XG5cbiAgamF2YUJpbkRpcigpIHtcbiAgICBjb25zdCBiYXNlRGlyID0gdGhpcy5qYXZhSG9tZSB8fCBwcm9jZXNzLmVudi5KQVZBX0hPTUU7XG4gICAgaWYgKGJhc2VEaXIpIHtcbiAgICAgIHJldHVybiBiYXNlRGlyLnJlcGxhY2UoL1tcXC9cXFxcXSQvLCAnJykgKyAnL2Jpbi8nO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxufVxuIl19