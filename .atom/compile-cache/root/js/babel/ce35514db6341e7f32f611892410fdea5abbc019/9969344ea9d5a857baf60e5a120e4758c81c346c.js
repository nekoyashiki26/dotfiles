Object.defineProperty(exports, '__esModule', {
  value: true
});

var _matchers = require('../../matchers');

var _utils = require('../../utils');

'use babel';

var MATCHER = (0, _matchers.or)((0, _matchers.request)().value().path((0, _matchers.path)().key('bin').index()));

var provider = {
  getFileExtensions: function getFileExtensions() {
    return null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL2NvbXBvc2VyL2NvbXBvc2VyLWpzb24tYW55LWZpbGUtcHJvcG9zYWwtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozt3QkFFa0MsZ0JBQWdCOztxQkFDdEIsYUFBYTs7QUFIekMsV0FBVyxDQUFBOztBQUtYLElBQU0sT0FBTyxHQUFHLGtCQUNkLHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQ2xELENBQUE7O0FBR0QsSUFBTSxRQUFRLEdBQUc7QUFDZixtQkFBaUIsRUFBQSw2QkFBRztBQUNsQixXQUFPLElBQUksQ0FBQTtHQUNaOztBQUVELGdCQUFjLEVBQUEsMEJBQUc7QUFDZixXQUFPLG1CQUFZLElBQUksQ0FBQTtHQUN4Qjs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxXQUFPLE9BQU8sQ0FBQTtHQUNmOztBQUVELGdCQUFjLEVBQUEsMEJBQUc7QUFDZixXQUFPLGVBQWUsQ0FBQTtHQUN2QjtDQUNGLENBQUE7O3FCQUVjLFFBQVEiLCJmaWxlIjoiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9wcm92aWRlcnMvY29tcG9zZXIvY29tcG9zZXItanNvbi1hbnktZmlsZS1wcm9wb3NhbC1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IHJlcXVlc3QsIHBhdGgsIG9yIH0gZnJvbSAnLi4vLi4vbWF0Y2hlcnMnXG5pbXBvcnQgeyBTdG9yYWdlVHlwZSB9IGZyb20gJy4uLy4uL3V0aWxzJ1xuXG5jb25zdCBNQVRDSEVSID0gb3IoXG4gIHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleSgnYmluJykuaW5kZXgoKSlcbilcblxuXG5jb25zdCBwcm92aWRlciA9IHtcbiAgZ2V0RmlsZUV4dGVuc2lvbnMoKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfSxcblxuICBnZXRTdG9yYWdlVHlwZSgpIHtcbiAgICByZXR1cm4gU3RvcmFnZVR5cGUuQk9USFxuICB9LFxuXG4gIGdldE1hdGNoZXIoKSB7XG4gICAgcmV0dXJuIE1BVENIRVJcbiAgfSxcblxuICBnZXRGaWxlUGF0dGVybigpIHtcbiAgICByZXR1cm4gJ2NvbXBvc2VyLmpzb24nXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcHJvdmlkZXJcbiJdfQ==