Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashFlatten = require('lodash/flatten');

var _lodashFlatten2 = _interopRequireDefault(_lodashFlatten);

var _utils = require('../../utils');

'use babel';

var CompoundProposalProvider = (function () {
  function CompoundProposalProvider() {
    _classCallCheck(this, CompoundProposalProvider);

    this.providers = [];
  }

  _createClass(CompoundProposalProvider, [{
    key: 'addProvider',
    value: function addProvider(provider) {
      this.addProviders([provider]);
    }
  }, {
    key: 'addProviders',
    value: function addProviders(providers) {
      this.providers = this.providers.concat(providers);
    }
  }, {
    key: 'hasProposals',
    value: function hasProposals(file) {
      return this.providers.some(function (provider) {
        return (0, _utils.matches)(file, provider.getFilePattern());
      });
    }
  }, {
    key: 'getProposals',
    value: function getProposals(request) {
      var file = request.editor.buffer.file;
      return Promise.all(this.providers.filter(function (provider) {
        return (0, _utils.matches)(file, provider.getFilePattern());
      }).map(function (provider) {
        return provider.getProposals(request);
      })).then(function (results) {
        return (0, _lodashFlatten2['default'])(results);
      });
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return undefined; // not used
    }
  }]);

  return CompoundProposalProvider;
})();

exports.CompoundProposalProvider = CompoundProposalProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL3NjaGVtYXN0b3JlL2NvbXBvdW5kLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7NkJBRW9CLGdCQUFnQjs7OztxQkFDWixhQUFhOztBQUhyQyxXQUFXLENBQUE7O0lBS0Usd0JBQXdCO0FBQ3hCLFdBREEsd0JBQXdCLEdBQ3JCOzBCQURILHdCQUF3Qjs7QUFFakMsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUE7R0FDcEI7O2VBSFUsd0JBQXdCOztXQUt4QixxQkFBQyxRQUFRLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7S0FDOUI7OztXQUVXLHNCQUFDLFNBQVMsRUFBRTtBQUN0QixVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQ2xEOzs7V0FFVyxzQkFBQyxJQUFJLEVBQUU7QUFDakIsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7ZUFBSSxvQkFBUSxJQUFJLEVBQUUsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO09BQUEsQ0FBQyxDQUFBO0tBQ2pGOzs7V0FFVyxzQkFBQyxPQUFPLEVBQUU7QUFDcEIsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFBO0FBQ3ZDLGFBQU8sT0FBTyxDQUFDLEdBQUcsQ0FDaEIsSUFBSSxDQUFDLFNBQVMsQ0FDWCxNQUFNLENBQUMsVUFBQSxRQUFRO2VBQUksb0JBQVEsSUFBSSxFQUFFLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUFBLENBQUMsQ0FDNUQsR0FBRyxDQUFDLFVBQUEsUUFBUTtlQUFJLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDO09BQUEsQ0FBQyxDQUNuRCxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87ZUFBSSxnQ0FBUSxPQUFPLENBQUM7T0FBQSxDQUFDLENBQUE7S0FDcEM7OztXQUVhLDBCQUFHO0FBQ2YsYUFBTyxTQUFTLENBQUE7S0FDakI7OztTQTVCVSx3QkFBd0IiLCJmaWxlIjoiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9wcm92aWRlcnMvc2NoZW1hc3RvcmUvY29tcG91bmQtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgZmxhdHRlbiBmcm9tICdsb2Rhc2gvZmxhdHRlbidcbmltcG9ydCB7IG1hdGNoZXMgfSBmcm9tICcuLi8uLi91dGlscydcblxuZXhwb3J0IGNsYXNzIENvbXBvdW5kUHJvcG9zYWxQcm92aWRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJvdmlkZXJzID0gW11cbiAgfVxuXG4gIGFkZFByb3ZpZGVyKHByb3ZpZGVyKSB7XG4gICAgdGhpcy5hZGRQcm92aWRlcnMoW3Byb3ZpZGVyXSlcbiAgfVxuXG4gIGFkZFByb3ZpZGVycyhwcm92aWRlcnMpIHtcbiAgICB0aGlzLnByb3ZpZGVycyA9IHRoaXMucHJvdmlkZXJzLmNvbmNhdChwcm92aWRlcnMpXG4gIH1cblxuICBoYXNQcm9wb3NhbHMoZmlsZSkge1xuICAgIHJldHVybiB0aGlzLnByb3ZpZGVycy5zb21lKHByb3ZpZGVyID0+IG1hdGNoZXMoZmlsZSwgcHJvdmlkZXIuZ2V0RmlsZVBhdHRlcm4oKSkpXG4gIH1cblxuICBnZXRQcm9wb3NhbHMocmVxdWVzdCkge1xuICAgIGNvbnN0IGZpbGUgPSByZXF1ZXN0LmVkaXRvci5idWZmZXIuZmlsZVxuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgIHRoaXMucHJvdmlkZXJzXG4gICAgICAgIC5maWx0ZXIocHJvdmlkZXIgPT4gbWF0Y2hlcyhmaWxlLCBwcm92aWRlci5nZXRGaWxlUGF0dGVybigpKSlcbiAgICAgICAgLm1hcChwcm92aWRlciA9PiBwcm92aWRlci5nZXRQcm9wb3NhbHMocmVxdWVzdCkpXG4gICAgKS50aGVuKHJlc3VsdHMgPT4gZmxhdHRlbihyZXN1bHRzKSlcbiAgfVxuXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiB1bmRlZmluZWQgLy8gbm90IHVzZWRcbiAgfVxufVxuIl19