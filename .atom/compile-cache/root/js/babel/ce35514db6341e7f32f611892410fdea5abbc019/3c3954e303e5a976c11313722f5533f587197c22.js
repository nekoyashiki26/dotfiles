Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _lodashAssign = require('lodash/assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var _lodashTrimStart = require('lodash/trimStart');

var _lodashTrimStart2 = _interopRequireDefault(_lodashTrimStart);

var _matchers = require('../../matchers');

var _packagistPackageLookup = require('packagist-package-lookup');

'use babel';

var DEPENDENCY_PROPERTIES = ['require', 'require-dev'];

var KEY_MATCHER = (0, _matchers.request)().key().path((0, _matchers.path)().key(DEPENDENCY_PROPERTIES));
var VALUE_MATCHER = (0, _matchers.request)().value().path((0, _matchers.path)().key(DEPENDENCY_PROPERTIES).key());

exports['default'] = {
  search: _packagistPackageLookup.searchByName,
  versions: function versions(name) {
    return (0, _packagistPackageLookup.versions)(name, { sort: 'DESC', stable: true }).then(function (vers) {
      return vers.map(function (v) {
        return (0, _lodashTrimStart2['default'])(v, 'v');
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
    return 'composer.json';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL2NvbXBvc2VyL2NvbXBvc2VyLWpzb24tZGVwZW5kZW5jeS1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7NEJBRW1CLGVBQWU7Ozs7K0JBQ1osa0JBQWtCOzs7O3dCQUVWLGdCQUFnQjs7c0NBRVAsMEJBQTBCOztBQVBqRSxXQUFXLENBQUE7O0FBU1gsSUFBTSxxQkFBcUIsR0FBRyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQTs7QUFFeEQsSUFBTSxXQUFXLEdBQUcsd0JBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFBO0FBQzNFLElBQU0sYUFBYSxHQUFHLHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTs7cUJBRXRFO0FBQ2IsUUFBTSxzQ0FBYztBQUNwQixVQUFRLEVBQUEsa0JBQUMsSUFBSSxFQUFFO0FBQ2IsV0FBTyxzQ0FBUyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7YUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztlQUFJLGtDQUFVLENBQUMsRUFBRSxHQUFHLENBQUM7T0FBQSxDQUFDO0tBQUEsQ0FBQyxDQUFBO0dBQ3JHO0FBQ0QsMEJBQXdCLEVBQUEsb0NBQUc7QUFDekIsV0FBTyxXQUFXLENBQUE7R0FDbkI7QUFDRCx1QkFBcUIsRUFBQSxpQ0FBRztBQUN0QixXQUFPLGFBQWEsQ0FBQTtHQUNyQjtBQUNELGdCQUFjLEVBQUEsMEJBQUc7QUFDZixXQUFPLGVBQWUsQ0FBQTtHQUN2QjtBQUNELHFCQUFtQixFQUFBLDZCQUFDLEdBQUcsRUFBRTtRQUNoQixRQUFRLEdBQUksR0FBRyxDQUFmLFFBQVE7O0FBQ2YsUUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGFBQU87ZUFBTSxJQUFJO09BQUEsQ0FBQTtLQUNsQjtBQUNELFFBQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7YUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtLQUFBLENBQUMsQ0FBQTtBQUN2RSxRQUFNLE1BQU0sR0FBRyw4REFBVSxPQUFPLEVBQUMsSUFBSSxFQUFFLENBQUE7QUFDdkMsV0FBTyxVQUFBLFVBQVU7YUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDO0tBQUEsQ0FBQTtHQUN4RDtDQUNGIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL2NvbXBvc2VyL2NvbXBvc2VyLWpzb24tZGVwZW5kZW5jeS1jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgYXNzaWduIGZyb20gJ2xvZGFzaC9hc3NpZ24nXG5pbXBvcnQgdHJpbVN0YXJ0IGZyb20gJ2xvZGFzaC90cmltU3RhcnQnXG5cbmltcG9ydCB7IHBhdGgsIHJlcXVlc3QgfSBmcm9tICcuLi8uLi9tYXRjaGVycydcblxuaW1wb3J0IHsgc2VhcmNoQnlOYW1lLCB2ZXJzaW9ucyB9IGZyb20gJ3BhY2thZ2lzdC1wYWNrYWdlLWxvb2t1cCdcblxuY29uc3QgREVQRU5ERU5DWV9QUk9QRVJUSUVTID0gWydyZXF1aXJlJywgJ3JlcXVpcmUtZGV2J11cblxuY29uc3QgS0VZX01BVENIRVIgPSByZXF1ZXN0KCkua2V5KCkucGF0aChwYXRoKCkua2V5KERFUEVOREVOQ1lfUFJPUEVSVElFUykpXG5jb25zdCBWQUxVRV9NQVRDSEVSID0gcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KERFUEVOREVOQ1lfUFJPUEVSVElFUykua2V5KCkpXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2VhcmNoOiBzZWFyY2hCeU5hbWUsXG4gIHZlcnNpb25zKG5hbWUpIHtcbiAgICByZXR1cm4gdmVyc2lvbnMobmFtZSwgeyBzb3J0OiAnREVTQycsIHN0YWJsZTogdHJ1ZSB9KS50aGVuKHZlcnMgPT4gdmVycy5tYXAodiA9PiB0cmltU3RhcnQodiwgJ3YnKSkpXG4gIH0sXG4gIGRlcGVuZGVuY3lSZXF1ZXN0TWF0Y2hlcigpIHtcbiAgICByZXR1cm4gS0VZX01BVENIRVJcbiAgfSxcbiAgdmVyc2lvblJlcXVlc3RNYXRjaGVyKCkge1xuICAgIHJldHVybiBWQUxVRV9NQVRDSEVSXG4gIH0sXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiAnY29tcG9zZXIuanNvbidcbiAgfSxcbiAgZ2V0RGVwZW5kZW5jeUZpbHRlcihyZXEpIHtcbiAgICBjb25zdCB7Y29udGVudHN9ID0gcmVxXG4gICAgaWYgKCFjb250ZW50cykge1xuICAgICAgcmV0dXJuICgpID0+IHRydWVcbiAgICB9XG4gICAgY29uc3Qgb2JqZWN0cyA9IERFUEVOREVOQ1lfUFJPUEVSVElFUy5tYXAocHJvcCA9PiBjb250ZW50c1twcm9wXSB8fCB7fSlcbiAgICBjb25zdCBtZXJnZWQgPSBhc3NpZ24oLi4ub2JqZWN0cykgfHwge31cbiAgICByZXR1cm4gZGVwZW5kZW5jeSA9PiAhbWVyZ2VkLmhhc093blByb3BlcnR5KGRlcGVuZGVuY3kpXG4gIH1cbn1cbiJdfQ==