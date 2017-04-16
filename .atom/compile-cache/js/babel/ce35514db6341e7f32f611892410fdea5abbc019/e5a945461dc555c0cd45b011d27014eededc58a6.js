Object.defineProperty(exports, '__esModule', {
  value: true
});

var _matchers = require('../../matchers');

var _utils = require('../../utils');

'use babel';

var MATCHER = (0, _matchers.request)().value().path((0, _matchers.path)().key('directories').key());

var provider = {
  getFileExtensions: function getFileExtensions() {
    return null;
  },

  getStorageType: function getStorageType() {
    return _utils.StorageType.FOLDER;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL3BhY2thZ2UvcGFja2FnZS1qc29uLWRpcmVjdG9yaWVzLXByb3Bvc2FsLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7d0JBRThCLGdCQUFnQjs7cUJBQ2xCLGFBQWE7O0FBSHpDLFdBQVcsQ0FBQTs7QUFLWCxJQUFNLE9BQU8sR0FBRyx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBOztBQUV2RSxJQUFNLFFBQVEsR0FBRztBQUNmLG1CQUFpQixFQUFBLDZCQUFHO0FBQ2xCLFdBQU8sSUFBSSxDQUFBO0dBQ1o7O0FBRUQsZ0JBQWMsRUFBQSwwQkFBRztBQUNmLFdBQU8sbUJBQVksTUFBTSxDQUFBO0dBQzFCOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFdBQU8sT0FBTyxDQUFBO0dBQ2Y7O0FBRUQsZ0JBQWMsRUFBQSwwQkFBRztBQUNmLFdBQU8sY0FBYyxDQUFBO0dBQ3RCO0NBQ0YsQ0FBQTs7cUJBRWMsUUFBUSIsImZpbGUiOiIvaG9tZS95b3NoaW5vcmkvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9wYWNrYWdlL3BhY2thZ2UtanNvbi1kaXJlY3Rvcmllcy1wcm9wb3NhbC1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IHJlcXVlc3QsIHBhdGggfSBmcm9tICcuLi8uLi9tYXRjaGVycydcbmltcG9ydCB7IFN0b3JhZ2VUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbHMnXG5cbmNvbnN0IE1BVENIRVIgPSByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoJ2RpcmVjdG9yaWVzJykua2V5KCkpXG5cbmNvbnN0IHByb3ZpZGVyID0ge1xuICBnZXRGaWxlRXh0ZW5zaW9ucygpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9LFxuXG4gIGdldFN0b3JhZ2VUeXBlKCkge1xuICAgIHJldHVybiBTdG9yYWdlVHlwZS5GT0xERVJcbiAgfSxcblxuICBnZXRNYXRjaGVyKCkge1xuICAgIHJldHVybiBNQVRDSEVSXG4gIH0sXG5cbiAgZ2V0RmlsZVBhdHRlcm4oKSB7XG4gICAgcmV0dXJuICdwYWNrYWdlLmpzb24nXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcHJvdmlkZXJcbiJdfQ==