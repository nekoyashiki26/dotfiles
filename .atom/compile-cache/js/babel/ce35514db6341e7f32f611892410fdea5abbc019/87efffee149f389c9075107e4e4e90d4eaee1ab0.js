Object.defineProperty(exports, '__esModule', {
  value: true
});

var _matchers = require('../../matchers');

var _utils = require('../../utils');

'use babel';

var MATCHER = (0, _matchers.or)((0, _matchers.request)().value().path((0, _matchers.path)().key('ignore').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('ignore')), (0, _matchers.request)().value().path((0, _matchers.path)().key('main').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('main')));

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
    return 'bower.json';
  }
};

exports['default'] = provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL2Jvd2VyL2Jvd2VyLWpzb24tZmlsZXMtcHJvcG9zYWwtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozt3QkFFa0MsZ0JBQWdCOztxQkFDdEIsYUFBYTs7QUFIekMsV0FBVyxDQUFBOztBQUtYLElBQU0sT0FBTyxHQUFHLGtCQUNkLHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQ3BELHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQzVDLHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQ2xELHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQzNDLENBQUE7O0FBRUQsSUFBTSxRQUFRLEdBQUc7QUFDZixtQkFBaUIsRUFBQSw2QkFBRztBQUNsQixXQUFPLElBQUksQ0FBQTtHQUNaOztBQUVELGdCQUFjLEVBQUEsMEJBQUc7QUFDZixXQUFPLG1CQUFZLElBQUksQ0FBQTtHQUN4Qjs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxXQUFPLE9BQU8sQ0FBQTtHQUNmOztBQUVELGdCQUFjLEVBQUEsMEJBQUc7QUFDZixXQUFPLFlBQVksQ0FBQTtHQUNwQjtDQUNGLENBQUE7O3FCQUVjLFFBQVEiLCJmaWxlIjoiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9wcm92aWRlcnMvYm93ZXIvYm93ZXItanNvbi1maWxlcy1wcm9wb3NhbC1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IHJlcXVlc3QsIHBhdGgsIG9yIH0gZnJvbSAnLi4vLi4vbWF0Y2hlcnMnXG5pbXBvcnQgeyBTdG9yYWdlVHlwZSB9IGZyb20gJy4uLy4uL3V0aWxzJ1xuXG5jb25zdCBNQVRDSEVSID0gb3IoXG4gIHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleSgnaWdub3JlJykuaW5kZXgoKSksXG4gIHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleSgnaWdub3JlJykpLFxuICByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoJ21haW4nKS5pbmRleCgpKSxcbiAgcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KCdtYWluJykpXG4pXG5cbmNvbnN0IHByb3ZpZGVyID0ge1xuICBnZXRGaWxlRXh0ZW5zaW9ucygpIHtcbiAgICByZXR1cm4gbnVsbCAvLyBhbnkgZmlsZSBpcyBPS1xuICB9LFxuXG4gIGdldFN0b3JhZ2VUeXBlKCkge1xuICAgIHJldHVybiBTdG9yYWdlVHlwZS5CT1RIXG4gIH0sXG5cbiAgZ2V0TWF0Y2hlcigpIHtcbiAgICByZXR1cm4gTUFUQ0hFUlxuICB9LFxuXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiAnYm93ZXIuanNvbidcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBwcm92aWRlclxuIl19