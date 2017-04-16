Object.defineProperty(exports, '__esModule', {
  value: true
});

var _matchers = require('../../matchers');

var _utils = require('../../utils');

'use babel';

var MATCHER = (0, _matchers.or)((0, _matchers.request)().value().path((0, _matchers.path)().key('files').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('man').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('man')));

var provider = {
  getFileExtensions: function getFileExtensions() {
    return null; // any file is OK
  },

  getStorageType: function getStorageType() {
    return _utils.StorageType.BOTH;
  },

  getMatcher: function getMatcher() {
    return MATCHER;
  },

  getFilePattern: function getFilePattern() {
    return 'package.json';
  }
};

exports['default'] = provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL3BhY2thZ2UvcGFja2FnZS1qc29uLWZpbGVzLXByb3Bvc2FsLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7d0JBRWtDLGdCQUFnQjs7cUJBQ3RCLGFBQWE7O0FBSHpDLFdBQVcsQ0FBQTs7QUFLWCxJQUFNLE9BQU8sR0FBRyxrQkFDZCx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUNuRCx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUNqRCx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUMxQyxDQUFBOztBQUVELElBQU0sUUFBUSxHQUFHO0FBQ2YsbUJBQWlCLEVBQUEsNkJBQUc7QUFDbEIsV0FBTyxJQUFJLENBQUE7R0FDWjs7QUFFRCxnQkFBYyxFQUFBLDBCQUFHO0FBQ2YsV0FBTyxtQkFBWSxJQUFJLENBQUE7R0FDeEI7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsV0FBTyxPQUFPLENBQUE7R0FDZjs7QUFFRCxnQkFBYyxFQUFBLDBCQUFHO0FBQ2YsV0FBTyxjQUFjLENBQUE7R0FDdEI7Q0FDRixDQUFBOztxQkFFYyxRQUFRIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL3BhY2thZ2UvcGFja2FnZS1qc29uLWZpbGVzLXByb3Bvc2FsLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgcmVxdWVzdCwgcGF0aCwgb3IgfSBmcm9tICcuLi8uLi9tYXRjaGVycydcbmltcG9ydCB7IFN0b3JhZ2VUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbHMnXG5cbmNvbnN0IE1BVENIRVIgPSBvcihcbiAgcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KCdmaWxlcycpLmluZGV4KCkpLFxuICByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoJ21hbicpLmluZGV4KCkpLFxuICByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoJ21hbicpKVxuKVxuXG5jb25zdCBwcm92aWRlciA9IHtcbiAgZ2V0RmlsZUV4dGVuc2lvbnMoKSB7XG4gICAgcmV0dXJuIG51bGwgLy8gYW55IGZpbGUgaXMgT0tcbiAgfSxcblxuICBnZXRTdG9yYWdlVHlwZSgpIHtcbiAgICByZXR1cm4gU3RvcmFnZVR5cGUuQk9USFxuICB9LFxuXG4gIGdldE1hdGNoZXIoKSB7XG4gICAgcmV0dXJuIE1BVENIRVJcbiAgfSxcblxuICBnZXRGaWxlUGF0dGVybigpIHtcbiAgICByZXR1cm4gJ3BhY2thZ2UuanNvbidcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBwcm92aWRlclxuIl19