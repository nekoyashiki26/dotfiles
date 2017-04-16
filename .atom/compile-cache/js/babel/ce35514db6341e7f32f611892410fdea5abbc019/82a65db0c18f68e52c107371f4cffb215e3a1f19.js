Object.defineProperty(exports, '__esModule', {
  value: true
});

var _matchers = require('../../matchers');

var _utils = require('../../utils');

'use babel';

var MATCHER = (0, _matchers.or)((0, _matchers.request)().value().path((0, _matchers.path)().key('files').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('exclude').index()));

var provider = {
  getFileExtensions: function getFileExtensions() {
    return ['.ts', '.tsx'];
  },

  getStorageType: function getStorageType() {
    return _utils.StorageType.BOTH;
  },

  getMatcher: function getMatcher() {
    return MATCHER;
  },

  getFilePattern: function getFilePattern() {
    return 'tsconfig.json';
  }
};

exports['default'] = provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL3RzY29uZmlnL3RzY29uZmlnLWpzb24tZmlsZXMtcHJvcG9zYWwtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozt3QkFFa0MsZ0JBQWdCOztxQkFDdEIsYUFBYTs7QUFIekMsV0FBVyxDQUFBOztBQUtYLElBQU0sT0FBTyxHQUFHLGtCQUNkLHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQ25ELHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQ3RELENBQUE7O0FBRUQsSUFBTSxRQUFRLEdBQUc7QUFDZixtQkFBaUIsRUFBQSw2QkFBRztBQUNsQixXQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0dBQ3ZCOztBQUVELGdCQUFjLEVBQUEsMEJBQUc7QUFDZixXQUFPLG1CQUFZLElBQUksQ0FBQTtHQUN4Qjs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxXQUFPLE9BQU8sQ0FBQTtHQUNmOztBQUVELGdCQUFjLEVBQUEsMEJBQUc7QUFDZixXQUFPLGVBQWUsQ0FBQTtHQUN2QjtDQUNGLENBQUE7O3FCQUVjLFFBQVEiLCJmaWxlIjoiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9wcm92aWRlcnMvdHNjb25maWcvdHNjb25maWctanNvbi1maWxlcy1wcm9wb3NhbC1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IHJlcXVlc3QsIHBhdGgsIG9yIH0gZnJvbSAnLi4vLi4vbWF0Y2hlcnMnXG5pbXBvcnQgeyBTdG9yYWdlVHlwZSB9IGZyb20gJy4uLy4uL3V0aWxzJ1xuXG5jb25zdCBNQVRDSEVSID0gb3IoXG4gIHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleSgnZmlsZXMnKS5pbmRleCgpKSxcbiAgcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KCdleGNsdWRlJykuaW5kZXgoKSlcbilcblxuY29uc3QgcHJvdmlkZXIgPSB7XG4gIGdldEZpbGVFeHRlbnNpb25zKCkge1xuICAgIHJldHVybiBbJy50cycsICcudHN4J11cbiAgfSxcblxuICBnZXRTdG9yYWdlVHlwZSgpIHtcbiAgICByZXR1cm4gU3RvcmFnZVR5cGUuQk9USFxuICB9LFxuXG4gIGdldE1hdGNoZXIoKSB7XG4gICAgcmV0dXJuIE1BVENIRVJcbiAgfSxcblxuICBnZXRGaWxlUGF0dGVybigpIHtcbiAgICByZXR1cm4gJ3RzY29uZmlnLmpzb24nXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcHJvdmlkZXJcbiJdfQ==