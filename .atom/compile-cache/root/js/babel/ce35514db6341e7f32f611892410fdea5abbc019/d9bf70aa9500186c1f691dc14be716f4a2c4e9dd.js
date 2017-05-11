Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _uriJs = require('uri-js');

var _uriJs2 = _interopRequireDefault(_uriJs);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodashTrimStart = require('lodash/trimStart');

var _lodashTrimStart2 = _interopRequireDefault(_lodashTrimStart);

var _lodashMemoize = require('lodash/memoize');

var _lodashMemoize2 = _interopRequireDefault(_lodashMemoize);

var _lodashOmit = require('lodash/omit');

var _lodashOmit2 = _interopRequireDefault(_lodashOmit);

'use babel';

var loadFileSchema = function loadFileSchema(uri) {
  return new Promise(function (resolve, reject) {
    var path = _os2['default'].platform() === 'win32' ? (0, _lodashTrimStart2['default'])(uri.path, '/') : uri.path;
    _fs2['default'].readFile(path, 'UTF-8', /* TODO think about detecting this */function (error, data) {
      if (error) {
        reject(error);
      } else {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      }
    });
  });
};

exports.loadFileSchema = loadFileSchema;
var loadHttpSchema = function loadHttpSchema(uri) {
  var url = _uriJs2['default'].serialize((0, _lodashOmit2['default'])(uri, ['fragment']));
  return _axios2['default'].get(url).then(function (response) {
    return response.data;
  });
};

exports.loadHttpSchema = loadHttpSchema;
var anySchemaLoader = function anySchemaLoader(uri) {
  switch (uri.scheme) {
    case 'file':
      return loadFileSchema(uri);
    case 'http':
      return loadHttpSchema(uri);
    default:
      throw new Error('Unknown URI format ' + JSON.stringify(uri));
  }
};

exports.anySchemaLoader = anySchemaLoader;
var loadSchema = (0, _lodashMemoize2['default'])(function (uri) {
  return anySchemaLoader(_uriJs2['default'].parse(uri));
});
exports.loadSchema = loadSchema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvanNvbi1zY2hlbWEtbG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztrQkFFZSxJQUFJOzs7O2tCQUNKLElBQUk7Ozs7cUJBQ0QsUUFBUTs7OztxQkFDUixPQUFPOzs7OytCQUNILGtCQUFrQjs7Ozs2QkFDcEIsZ0JBQWdCOzs7OzBCQUNuQixhQUFhOzs7O0FBUjlCLFdBQVcsQ0FBQTs7QUFVSixJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLENBQUcsR0FBRztTQUFJLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUNwRSxRQUFNLElBQUksR0FBRyxnQkFBRyxRQUFRLEVBQUUsS0FBSyxPQUFPLEdBQUcsa0NBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFBO0FBQzVFLG9CQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyx1Q0FBdUMsVUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFLO0FBQy9FLFVBQUksS0FBSyxFQUFFO0FBQ1QsY0FBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQ2QsTUFBTTtBQUNMLFlBQUk7QUFDRixpQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtTQUMxQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsZ0JBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNWO09BQ0Y7S0FDRixDQUFDLENBQUE7R0FDSCxDQUFDO0NBQUEsQ0FBQTs7O0FBRUssSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFHLEdBQUcsRUFBSTtBQUNuQyxNQUFNLEdBQUcsR0FBRyxtQkFBTSxTQUFTLENBQUMsNkJBQUssR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3BELFNBQU8sbUJBQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7V0FBSSxRQUFRLENBQUMsSUFBSTtHQUFBLENBQUMsQ0FBQTtDQUN0RCxDQUFBOzs7QUFFTSxJQUFNLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUcsR0FBRyxFQUFJO0FBQ3BDLFVBQVEsR0FBRyxDQUFDLE1BQU07QUFDaEIsU0FBSyxNQUFNO0FBQUUsYUFBTyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUE7QUFBQSxBQUN2QyxTQUFLLE1BQU07QUFBRSxhQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUFBLEFBQ3ZDO0FBQVMsWUFBTSxJQUFJLEtBQUsseUJBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUcsQ0FBQTtBQUFBLEdBQ3RFO0NBQ0YsQ0FBQTs7O0FBRU0sSUFBTSxVQUFVLEdBQUcsZ0NBQVEsVUFBQSxHQUFHO1NBQUksZUFBZSxDQUFDLG1CQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUFBLENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS95b3NoaW5vcml5YW1hZ3VjaGkvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2pzb24tc2NoZW1hLWxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCB1cmlKcyBmcm9tICd1cmktanMnXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5pbXBvcnQgdHJpbVN0YXJ0IGZyb20gJ2xvZGFzaC90cmltU3RhcnQnXG5pbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gvbWVtb2l6ZSdcbmltcG9ydCBvbWl0IGZyb20gJ2xvZGFzaC9vbWl0J1xuXG5leHBvcnQgY29uc3QgbG9hZEZpbGVTY2hlbWEgPSB1cmkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICBjb25zdCBwYXRoID0gb3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJyA/IHRyaW1TdGFydCh1cmkucGF0aCwgJy8nKSA6IHVyaS5wYXRoXG4gIGZzLnJlYWRGaWxlKHBhdGgsICdVVEYtOCcsIC8qIFRPRE8gdGhpbmsgYWJvdXQgZGV0ZWN0aW5nIHRoaXMgKi8oZXJyb3IsIGRhdGEpID0+IHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKGRhdGEpKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSlcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59KVxuXG5leHBvcnQgY29uc3QgbG9hZEh0dHBTY2hlbWEgPSB1cmkgPT4ge1xuICBjb25zdCB1cmwgPSB1cmlKcy5zZXJpYWxpemUob21pdCh1cmksIFsnZnJhZ21lbnQnXSkpXG4gIHJldHVybiBheGlvcy5nZXQodXJsKS50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmRhdGEpXG59XG5cbmV4cG9ydCBjb25zdCBhbnlTY2hlbWFMb2FkZXIgPSB1cmkgPT4ge1xuICBzd2l0Y2ggKHVyaS5zY2hlbWUpIHtcbiAgICBjYXNlICdmaWxlJzogcmV0dXJuIGxvYWRGaWxlU2NoZW1hKHVyaSlcbiAgICBjYXNlICdodHRwJzogcmV0dXJuIGxvYWRIdHRwU2NoZW1hKHVyaSlcbiAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gVVJJIGZvcm1hdCAke0pTT04uc3RyaW5naWZ5KHVyaSl9YClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgbG9hZFNjaGVtYSA9IG1lbW9pemUodXJpID0+IGFueVNjaGVtYUxvYWRlcih1cmlKcy5wYXJzZSh1cmkpKSlcbiJdfQ==