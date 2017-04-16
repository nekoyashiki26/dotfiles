Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashStartsWith = require('lodash/startsWith');

var _lodashStartsWith2 = _interopRequireDefault(_lodashStartsWith);

var _matchers = require('../../matchers');

var _npmPackageLookup = require('npm-package-lookup');

'use babel';

var PRESETS = 'presets';
var BABEL_PRESET = 'babel-preset-';

var PRESET_MATCHER = (0, _matchers.request)().value().path((0, _matchers.path)().key(PRESETS).index());

var BabelRCPresetsProposalProvider = (function () {
  function BabelRCPresetsProposalProvider() {
    _classCallCheck(this, BabelRCPresetsProposalProvider);
  }

  _createClass(BabelRCPresetsProposalProvider, [{
    key: 'getProposals',
    value: function getProposals(req) {
      var _this = this;

      var contents = req.contents;
      var prefix = req.prefix;
      var isBetweenQuotes = req.isBetweenQuotes;
      var shouldAddComma = req.shouldAddComma;

      if (PRESET_MATCHER.matches(_matchers.request)) {
        var _ret = (function () {
          var presets = contents[PRESETS] || [];
          var results = (0, _npmPackageLookup.search)(_this.calculateSearchKeyword(prefix));
          return {
            v: results.then(function (names) {
              return names.filter(function (name) {
                return presets.indexOf(name.replace(BABEL_PRESET, '')) < 0;
              }).map(function (presetName) {
                var name = presetName.replace(BABEL_PRESET, '');
                var proposal = _defineProperty({
                  displayText: name,
                  rightLabel: 'preset',
                  type: 'preset',
                  description: name + ' babel preset. Required dependency in package.json: ' + presetName
                }, isBetweenQuotes ? 'text' : 'snippet', isBetweenQuotes ? name : '"' + name + '"' + (shouldAddComma ? ',' : ''));
                return proposal;
              });
            })
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }
      return Promise.resolve([]);
    }
  }, {
    key: 'calculateSearchKeyword',
    value: function calculateSearchKeyword(prefix) {
      if ((0, _lodashStartsWith2['default'])(BABEL_PRESET, prefix)) {
        return BABEL_PRESET;
      } else if ((0, _lodashStartsWith2['default'])(prefix, BABEL_PRESET)) {
        return prefix;
      }
      return BABEL_PRESET + prefix;
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return '.babelrc';
    }
  }]);

  return BabelRCPresetsProposalProvider;
})();

exports['default'] = BabelRCPresetsProposalProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL2JhYmVscmMvYmFiZWxyYy1wcmVzZXRzLXByb3Bvc2FsLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztnQ0FFdUIsbUJBQW1COzs7O3dCQUNaLGdCQUFnQjs7Z0NBQ3ZCLG9CQUFvQjs7QUFKM0MsV0FBVyxDQUFBOztBQU1YLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQTtBQUN6QixJQUFNLFlBQVksR0FBRyxlQUFlLENBQUE7O0FBRXBDLElBQU0sY0FBYyxHQUFHLHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7O0lBRXJELDhCQUE4QjtXQUE5Qiw4QkFBOEI7MEJBQTlCLDhCQUE4Qjs7O2VBQTlCLDhCQUE4Qjs7V0FDckMsc0JBQUMsR0FBRyxFQUFFOzs7VUFDVCxRQUFRLEdBQTZDLEdBQUcsQ0FBeEQsUUFBUTtVQUFFLE1BQU0sR0FBcUMsR0FBRyxDQUE5QyxNQUFNO1VBQUUsZUFBZSxHQUFvQixHQUFHLENBQXRDLGVBQWU7VUFBRSxjQUFjLEdBQUksR0FBRyxDQUFyQixjQUFjOztBQUN4RCxVQUFJLGNBQWMsQ0FBQyxPQUFPLG1CQUFTLEVBQUU7O0FBQ25DLGNBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDdkMsY0FBTSxPQUFPLEdBQUcsOEJBQU8sTUFBSyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0FBQzNEO2VBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFBLEtBQUs7cUJBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUk7dUJBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7ZUFBQSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsVUFBVSxFQUFJO0FBQ3ZILG9CQUFNLElBQUksR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNqRCxvQkFBTSxRQUFRO0FBQ1osNkJBQVcsRUFBRSxJQUFJO0FBQ2pCLDRCQUFVLEVBQUUsUUFBUTtBQUNwQixzQkFBSSxFQUFFLFFBQVE7QUFDZCw2QkFBVyxFQUFLLElBQUksNERBQXVELFVBQVUsQUFBRTttQkFDdEYsZUFBZSxHQUFHLE1BQU0sR0FBRyxTQUFTLEVBQUcsZUFBZSxHQUFHLElBQUksU0FBUSxJQUFJLFVBQU0sY0FBYyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUEsQUFBRSxDQUM1RyxDQUFBO0FBQ0QsdUJBQU8sUUFBUSxDQUFBO2VBQ2hCLENBQUM7YUFBQSxDQUFDO1lBQUE7Ozs7T0FDSjtBQUNELGFBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUMzQjs7O1dBRXFCLGdDQUFDLE1BQU0sRUFBRTtBQUM3QixVQUFJLG1DQUFXLFlBQVksRUFBRSxNQUFNLENBQUMsRUFBRTtBQUNwQyxlQUFPLFlBQVksQ0FBQTtPQUNwQixNQUFNLElBQUksbUNBQVcsTUFBTSxFQUFFLFlBQVksQ0FBQyxFQUFFO0FBQzNDLGVBQU8sTUFBTSxDQUFBO09BQ2Q7QUFDRCxhQUFPLFlBQVksR0FBRyxNQUFNLENBQUE7S0FFN0I7OztXQUVhLDBCQUFHO0FBQ2YsYUFBTyxVQUFVLENBQUE7S0FDbEI7OztTQWpDa0IsOEJBQThCOzs7cUJBQTlCLDhCQUE4QiIsImZpbGUiOiIvaG9tZS95b3NoaW5vcmkvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9iYWJlbHJjL2JhYmVscmMtcHJlc2V0cy1wcm9wb3NhbC1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBzdGFydHNXaXRoIGZyb20gJ2xvZGFzaC9zdGFydHNXaXRoJ1xuaW1wb3J0IHsgcGF0aCwgcmVxdWVzdCB9IGZyb20gJy4uLy4uL21hdGNoZXJzJ1xuaW1wb3J0IHsgc2VhcmNoIH0gZnJvbSAnbnBtLXBhY2thZ2UtbG9va3VwJ1xuXG5jb25zdCBQUkVTRVRTID0gJ3ByZXNldHMnXG5jb25zdCBCQUJFTF9QUkVTRVQgPSAnYmFiZWwtcHJlc2V0LSdcblxuY29uc3QgUFJFU0VUX01BVENIRVIgPSByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoUFJFU0VUUykuaW5kZXgoKSlcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFiZWxSQ1ByZXNldHNQcm9wb3NhbFByb3ZpZGVyIHtcbiAgZ2V0UHJvcG9zYWxzKHJlcSkge1xuICAgIGNvbnN0IHtjb250ZW50cywgcHJlZml4LCBpc0JldHdlZW5RdW90ZXMsIHNob3VsZEFkZENvbW1hfSA9IHJlcVxuICAgIGlmIChQUkVTRVRfTUFUQ0hFUi5tYXRjaGVzKHJlcXVlc3QpKSB7XG4gICAgICBjb25zdCBwcmVzZXRzID0gY29udGVudHNbUFJFU0VUU10gfHwgW11cbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBzZWFyY2godGhpcy5jYWxjdWxhdGVTZWFyY2hLZXl3b3JkKHByZWZpeCkpXG4gICAgICByZXR1cm4gcmVzdWx0cy50aGVuKG5hbWVzID0+IG5hbWVzLmZpbHRlcihuYW1lID0+IHByZXNldHMuaW5kZXhPZihuYW1lLnJlcGxhY2UoQkFCRUxfUFJFU0VULCAnJykpIDwgMCkubWFwKHByZXNldE5hbWUgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gcHJlc2V0TmFtZS5yZXBsYWNlKEJBQkVMX1BSRVNFVCwgJycpXG4gICAgICAgIGNvbnN0IHByb3Bvc2FsID0ge1xuICAgICAgICAgIGRpc3BsYXlUZXh0OiBuYW1lLFxuICAgICAgICAgIHJpZ2h0TGFiZWw6ICdwcmVzZXQnLFxuICAgICAgICAgIHR5cGU6ICdwcmVzZXQnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBgJHtuYW1lfSBiYWJlbCBwcmVzZXQuIFJlcXVpcmVkIGRlcGVuZGVuY3kgaW4gcGFja2FnZS5qc29uOiAke3ByZXNldE5hbWV9YCxcbiAgICAgICAgICBbaXNCZXR3ZWVuUXVvdGVzID8gJ3RleHQnIDogJ3NuaXBwZXQnXTogaXNCZXR3ZWVuUXVvdGVzID8gbmFtZSA6IGBcIiR7IG5hbWUgfVwiJHsgc2hvdWxkQWRkQ29tbWEgPyAnLCcgOiAnJ31gXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb3Bvc2FsXG4gICAgICB9KSlcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSlcbiAgfVxuXG4gIGNhbGN1bGF0ZVNlYXJjaEtleXdvcmQocHJlZml4KSB7XG4gICAgaWYgKHN0YXJ0c1dpdGgoQkFCRUxfUFJFU0VULCBwcmVmaXgpKSB7XG4gICAgICByZXR1cm4gQkFCRUxfUFJFU0VUXG4gICAgfSBlbHNlIGlmIChzdGFydHNXaXRoKHByZWZpeCwgQkFCRUxfUFJFU0VUKSkge1xuICAgICAgcmV0dXJuIHByZWZpeFxuICAgIH0gXG4gICAgcmV0dXJuIEJBQkVMX1BSRVNFVCArIHByZWZpeFxuICAgIFxuICB9XG5cbiAgZ2V0RmlsZVBhdHRlcm4oKSB7XG4gICAgcmV0dXJuICcuYmFiZWxyYydcbiAgfVxufVxuIl19