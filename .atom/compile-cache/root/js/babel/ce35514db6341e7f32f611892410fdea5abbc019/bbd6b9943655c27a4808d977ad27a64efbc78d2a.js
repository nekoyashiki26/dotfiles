Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _lodashAssign = require('lodash/assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var _npmPackageLookup = require('npm-package-lookup');

var _matchers = require('../../matchers');

'use babel';

var DEPENDENCY_PROPERTIES = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
var KEY_MATCHER = (0, _matchers.request)().key().path((0, _matchers.path)().key(DEPENDENCY_PROPERTIES));
var VALUE_MATCHER = (0, _matchers.request)().value().path((0, _matchers.path)().key(DEPENDENCY_PROPERTIES).key());

exports['default'] = {
  versions: function versions(name) {
    return (0, _npmPackageLookup.versions)(name, { sort: 'DESC', stable: true });
  },

  search: function search(prefix) {
    return (0, _npmPackageLookup.search)(prefix).then(function (results) {
      return results.map(function (name) {
        return { name: name };
      });
    });
  },

  dependencyRequestMatcher: function dependencyRequestMatcher() {
    return KEY_MATCHER;
  },

  versionRequestMatcher: function versionRequestMatcher() {
    return VALUE_MATCHER;
  },

  getFilePattern: function getFilePattern() {
    return 'package.json';
  },

  isAvailable: function isAvailable() {
    return false;
  },

  getDependencyFilter: function getDependencyFilter(req) {
    var contents = req.contents;

    if (!contents) {
      return function () {
        return true;
      };
    }
    var objects = DEPENDENCY_PROPERTIES.map(function (prop) {
      return contents[prop] || {};
    });
    var merged = _lodashAssign2['default'].apply(undefined, _toConsumableArray(objects)) || {};
    return function (dependency) {
      return !merged.hasOwnProperty(dependency);
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL3BhY2thZ2UvcGFja2FnZS1qc29uLWRlcGVuZGVuY3ktY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzRCQUVtQixlQUFlOzs7O2dDQUNELG9CQUFvQjs7d0JBRXZCLGdCQUFnQjs7QUFMOUMsV0FBVyxDQUFBOztBQU9YLElBQU0scUJBQXFCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsc0JBQXNCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTtBQUM3RyxJQUFNLFdBQVcsR0FBRyx3QkFBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUE7QUFDM0UsSUFBTSxhQUFhLEdBQUcsd0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBOztxQkFFdEU7QUFDYixVQUFRLEVBQUEsa0JBQUMsSUFBSSxFQUFFO0FBQ2IsV0FBTyxnQ0FBUyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0dBQ3REOztBQUVELFFBQU0sRUFBQSxnQkFBQyxNQUFNLEVBQUU7QUFDYixXQUFPLDhCQUFPLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87YUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtlQUFLLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRTtPQUFDLENBQUM7S0FBQSxDQUFDLENBQUE7R0FDdkU7O0FBRUQsMEJBQXdCLEVBQUEsb0NBQUc7QUFDekIsV0FBTyxXQUFXLENBQUE7R0FDbkI7O0FBRUQsdUJBQXFCLEVBQUEsaUNBQUc7QUFDdEIsV0FBTyxhQUFhLENBQUE7R0FDckI7O0FBRUQsZ0JBQWMsRUFBQSwwQkFBRztBQUNmLFdBQU8sY0FBYyxDQUFBO0dBQ3RCOztBQUVELGFBQVcsRUFBQSx1QkFBRztBQUNaLFdBQU8sS0FBSyxDQUFBO0dBQ2I7O0FBRUQscUJBQW1CLEVBQUEsNkJBQUMsR0FBRyxFQUFFO1FBQ2hCLFFBQVEsR0FBSSxHQUFHLENBQWYsUUFBUTs7QUFDZixRQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsYUFBTztlQUFNLElBQUk7T0FBQSxDQUFBO0tBQ2xCO0FBQ0QsUUFBTSxPQUFPLEdBQUcscUJBQXFCLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTthQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0tBQUEsQ0FBQyxDQUFBO0FBQ3ZFLFFBQU0sTUFBTSxHQUFHLDhEQUFVLE9BQU8sRUFBQyxJQUFJLEVBQUUsQ0FBQTtBQUN2QyxXQUFPLFVBQUEsVUFBVTthQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUM7S0FBQSxDQUFBO0dBQ3hEO0NBQ0YiLCJmaWxlIjoiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9wcm92aWRlcnMvcGFja2FnZS9wYWNrYWdlLWpzb24tZGVwZW5kZW5jeS1jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgYXNzaWduIGZyb20gJ2xvZGFzaC9hc3NpZ24nXG5pbXBvcnQgeyBzZWFyY2gsIHZlcnNpb25zIH0gZnJvbSAnbnBtLXBhY2thZ2UtbG9va3VwJ1xuXG5pbXBvcnQgeyBwYXRoLCByZXF1ZXN0IH0gZnJvbSAnLi4vLi4vbWF0Y2hlcnMnXG5cbmNvbnN0IERFUEVOREVOQ1lfUFJPUEVSVElFUyA9IFsnZGVwZW5kZW5jaWVzJywgJ2RldkRlcGVuZGVuY2llcycsICdvcHRpb25hbERlcGVuZGVuY2llcycsICdwZWVyRGVwZW5kZW5jaWVzJ11cbmNvbnN0IEtFWV9NQVRDSEVSID0gcmVxdWVzdCgpLmtleSgpLnBhdGgocGF0aCgpLmtleShERVBFTkRFTkNZX1BST1BFUlRJRVMpKVxuY29uc3QgVkFMVUVfTUFUQ0hFUiA9IHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleShERVBFTkRFTkNZX1BST1BFUlRJRVMpLmtleSgpKVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHZlcnNpb25zKG5hbWUpIHtcbiAgICByZXR1cm4gdmVyc2lvbnMobmFtZSwgeyBzb3J0OiAnREVTQycsIHN0YWJsZTogdHJ1ZSB9KVxuICB9LFxuXG4gIHNlYXJjaChwcmVmaXgpIHtcbiAgICByZXR1cm4gc2VhcmNoKHByZWZpeCkudGhlbihyZXN1bHRzID0+IHJlc3VsdHMubWFwKG5hbWUgPT4gKHsgbmFtZSB9KSkpXG4gIH0sXG5cbiAgZGVwZW5kZW5jeVJlcXVlc3RNYXRjaGVyKCkge1xuICAgIHJldHVybiBLRVlfTUFUQ0hFUlxuICB9LFxuXG4gIHZlcnNpb25SZXF1ZXN0TWF0Y2hlcigpIHtcbiAgICByZXR1cm4gVkFMVUVfTUFUQ0hFUlxuICB9LFxuXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiAncGFja2FnZS5qc29uJ1xuICB9LFxuXG4gIGlzQXZhaWxhYmxlKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9LFxuXG4gIGdldERlcGVuZGVuY3lGaWx0ZXIocmVxKSB7XG4gICAgY29uc3Qge2NvbnRlbnRzfSA9IHJlcVxuICAgIGlmICghY29udGVudHMpIHtcbiAgICAgIHJldHVybiAoKSA9PiB0cnVlXG4gICAgfVxuICAgIGNvbnN0IG9iamVjdHMgPSBERVBFTkRFTkNZX1BST1BFUlRJRVMubWFwKHByb3AgPT4gY29udGVudHNbcHJvcF0gfHwge30pXG4gICAgY29uc3QgbWVyZ2VkID0gYXNzaWduKC4uLm9iamVjdHMpIHx8IHt9XG4gICAgcmV0dXJuIGRlcGVuZGVuY3kgPT4gIW1lcmdlZC5oYXNPd25Qcm9wZXJ0eShkZXBlbmRlbmN5KVxuICB9XG59XG4iXX0=