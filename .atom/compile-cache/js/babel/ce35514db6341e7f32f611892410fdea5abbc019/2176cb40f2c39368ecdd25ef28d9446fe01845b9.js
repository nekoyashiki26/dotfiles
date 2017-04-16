Object.defineProperty(exports, '__esModule', {
  value: true
});

var _matchers = require('../../matchers');

var _utils = require('../../utils');

'use babel';

var MATCHER = (0, _matchers.or)((0, _matchers.request)().value().path((0, _matchers.path)().key('autoload').key('classmap').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('autoload').key('files').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('autoload-dev').key('classmap').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('autoload-dev').key('files').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('include-path').index()));

var provider = {
  getFileExtensions: function getFileExtensions() {
    return ['.php'];
  },

  getStorageType: function getStorageType() {
    return _utils.StorageType.BOTH;
  },

  getMatcher: function getMatcher() {
    return MATCHER;
  },

  getFilePattern: function getFilePattern() {
    return 'composer.json';
  }
};

exports['default'] = provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL2NvbXBvc2VyL2NvbXBvc2VyLWpzb24tcGhwLWZpbGUtb3ItZm9sZGVyLXByb3Bvc2FsLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7d0JBRWtDLGdCQUFnQjs7cUJBQ3RCLGFBQWE7O0FBSHpDLFdBQVcsQ0FBQTs7QUFLWCxJQUFNLE9BQU8sR0FBRyxrQkFDZCx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFDdEUsd0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQ25FLHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUMxRSx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFDdkUsd0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FDM0QsQ0FBQTs7QUFFRCxJQUFNLFFBQVEsR0FBRztBQUNmLG1CQUFpQixFQUFBLDZCQUFHO0FBQ2xCLFdBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtHQUNoQjs7QUFFRCxnQkFBYyxFQUFBLDBCQUFHO0FBQ2YsV0FBTyxtQkFBWSxJQUFJLENBQUE7R0FDeEI7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsV0FBTyxPQUFPLENBQUE7R0FDZjs7QUFFRCxnQkFBYyxFQUFBLDBCQUFHO0FBQ2YsV0FBTyxlQUFlLENBQUE7R0FDdkI7Q0FDRixDQUFBOztxQkFFYyxRQUFRIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL2NvbXBvc2VyL2NvbXBvc2VyLWpzb24tcGhwLWZpbGUtb3ItZm9sZGVyLXByb3Bvc2FsLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgcmVxdWVzdCwgcGF0aCwgb3IgfSBmcm9tICcuLi8uLi9tYXRjaGVycydcbmltcG9ydCB7IFN0b3JhZ2VUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbHMnXG5cbmNvbnN0IE1BVENIRVIgPSBvcihcbiAgcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KCdhdXRvbG9hZCcpLmtleSgnY2xhc3NtYXAnKS5pbmRleCgpKSxcbiAgcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KCdhdXRvbG9hZCcpLmtleSgnZmlsZXMnKS5pbmRleCgpKSxcbiAgcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KCdhdXRvbG9hZC1kZXYnKS5rZXkoJ2NsYXNzbWFwJykuaW5kZXgoKSksXG4gIHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleSgnYXV0b2xvYWQtZGV2Jykua2V5KCdmaWxlcycpLmluZGV4KCkpLFxuICByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoJ2luY2x1ZGUtcGF0aCcpLmluZGV4KCkpXG4pXG5cbmNvbnN0IHByb3ZpZGVyID0ge1xuICBnZXRGaWxlRXh0ZW5zaW9ucygpIHtcbiAgICByZXR1cm4gWycucGhwJ11cbiAgfSxcblxuICBnZXRTdG9yYWdlVHlwZSgpIHtcbiAgICByZXR1cm4gU3RvcmFnZVR5cGUuQk9USFxuICB9LFxuXG4gIGdldE1hdGNoZXIoKSB7XG4gICAgcmV0dXJuIE1BVENIRVJcbiAgfSxcblxuICBnZXRGaWxlUGF0dGVybigpIHtcbiAgICByZXR1cm4gJ2NvbXBvc2VyLmpzb24nXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcHJvdmlkZXJcbiJdfQ==