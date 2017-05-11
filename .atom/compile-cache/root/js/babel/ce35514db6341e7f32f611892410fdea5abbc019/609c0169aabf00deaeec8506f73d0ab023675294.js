Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _jsonSchemaProposalProvider = require('../../json-schema-proposal-provider');

var _compoundProvider = require('./compound-provider');

var _jsonSchemaResolver = require('../../json-schema-resolver');

var _jsonSchema = require('../../json-schema');

'use babel';

var SchemaStoreProvider = (function () {
  function SchemaStoreProvider() {
    _classCallCheck(this, SchemaStoreProvider);

    this.compoundProvier = new _compoundProvider.CompoundProposalProvider();
    this.blackList = {};
  }

  _createClass(SchemaStoreProvider, [{
    key: 'getSchemaInfos',
    value: function getSchemaInfos() {
      var _this = this;

      if (this.schemaInfos) {
        return Promise.resolve(this.schemaInfos);
      }
      return _axios2['default'].get('http://schemastore.org/api/json/catalog.json').then(function (response) {
        return response.data;
      }).then(function (data) {
        return data.schemas.filter(function (schema) {
          return Boolean(schema.fileMatch);
        });
      }).then(function (schemaInfos) {
        _this.schemaInfos = schemaInfos;
        return schemaInfos;
      });
    }
  }, {
    key: 'getProposals',
    value: function getProposals(request) {
      var _this2 = this;

      var file = request.editor.buffer.file;
      if (this.blackList[file.getBaseName()]) {
        console.warn('schemas not available');
        return Promise.resolve([]);
      }

      if (!this.compoundProvier.hasProposals(file)) {
        return this.getSchemaInfos().then(function (schemaInfos) {
          return schemaInfos.filter(function (_ref) {
            var fileMatch = _ref.fileMatch;
            return fileMatch.some(function (match) {
              return (0, _minimatch2['default'])(file.getBaseName(), match);
            });
          });
        }).then(function (matching) {
          var promises = matching.map(function (schemaInfo) {
            return (0, _jsonSchemaResolver.resolve)(schemaInfo.url).then(function (schema) {
              return new _jsonSchemaProposalProvider.JsonSchemaProposalProvider(schemaInfo.fileMatch, (0, _jsonSchema.wrap)(schema));
            });
          });
          return Promise.all(promises);
        }).then(function (providers) {
          return _this2.compoundProvier.addProviders(providers);
        }).then(function () {
          if (!_this2.compoundProvier.hasProposals(file)) {
            _this2.blackList[file.getBaseName()] = true;
          }
        }).then(function () {
          return _this2.compoundProvier.getProposals(request);
        });
      }
      return this.compoundProvier.getProposals(request);
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return '*';
    }
  }]);

  return SchemaStoreProvider;
})();

exports['default'] = SchemaStoreProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL3NjaGVtYXN0b3JlL3NjaGVtYXN0b3JlLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7eUJBRXNCLFdBQVc7Ozs7cUJBQ2YsT0FBTzs7OzswQ0FFa0IscUNBQXFDOztnQ0FDdkMscUJBQXFCOztrQ0FDdEMsNEJBQTRCOzswQkFDL0IsbUJBQW1COztBQVJ4QyxXQUFXLENBQUE7O0lBVVUsbUJBQW1CO0FBQzNCLFdBRFEsbUJBQW1CLEdBQ3hCOzBCQURLLG1CQUFtQjs7QUFFcEMsUUFBSSxDQUFDLGVBQWUsR0FBRyxnREFBOEIsQ0FBQTtBQUNyRCxRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQTtHQUNwQjs7ZUFKa0IsbUJBQW1COztXQU14QiwwQkFBRzs7O0FBQ2YsVUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3BCLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7T0FDekM7QUFDRCxhQUFPLG1CQUFNLEdBQUcsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUM3RCxJQUFJLENBQUMsVUFBQSxRQUFRO2VBQUksUUFBUSxDQUFDLElBQUk7T0FBQSxDQUFDLENBQy9CLElBQUksQ0FBQyxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLE1BQU07aUJBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7U0FBQSxDQUFDO09BQUEsQ0FBQyxDQUN0RSxJQUFJLENBQUMsVUFBQSxXQUFXLEVBQUk7QUFDbkIsY0FBSyxXQUFXLEdBQUcsV0FBVyxDQUFBO0FBQzlCLGVBQU8sV0FBVyxDQUFBO09BQ25CLENBQUMsQ0FBQTtLQUNMOzs7V0FFVyxzQkFBQyxPQUFPLEVBQUU7OztBQUNwQixVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUE7QUFDdkMsVUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFO0FBQ3RDLGVBQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNyQyxlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDM0I7O0FBRUQsVUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzVDLGVBQU8sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUN6QixJQUFJLENBQUMsVUFBQSxXQUFXO2lCQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFhO2dCQUFYLFNBQVMsR0FBWCxJQUFhLENBQVgsU0FBUzttQkFBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsS0FBSztxQkFBSSw0QkFBVSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsS0FBSyxDQUFDO2FBQUEsQ0FBQztXQUFBLENBQUM7U0FBQSxDQUFDLENBQ3pILElBQUksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNoQixjQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsVUFBVTttQkFBSSxpQ0FBUSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtxQkFBSSwyREFDakYsVUFBVSxDQUFDLFNBQVMsRUFDcEIsc0JBQUssTUFBTSxDQUFDLENBQ2I7YUFBQSxDQUFDO1dBQUEsQ0FBQyxDQUFBO0FBQ0gsaUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUM3QixDQUFDLENBQ0QsSUFBSSxDQUFDLFVBQUEsU0FBUztpQkFBSSxPQUFLLGVBQWUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO1NBQUEsQ0FBQyxDQUMvRCxJQUFJLENBQUMsWUFBTTtBQUNWLGNBQUksQ0FBQyxPQUFLLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDNUMsbUJBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQTtXQUMxQztTQUNGLENBQUMsQ0FDRCxJQUFJLENBQUM7aUJBQU0sT0FBSyxlQUFlLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztTQUFBLENBQUMsQ0FBQTtPQUMxRDtBQUNELGFBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDbEQ7OztXQUVhLDBCQUFHO0FBQ2YsYUFBTyxHQUFHLENBQUE7S0FDWDs7O1NBakRrQixtQkFBbUI7OztxQkFBbkIsbUJBQW1CIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL3NjaGVtYXN0b3JlL3NjaGVtYXN0b3JlLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5cbmltcG9ydCB7IEpzb25TY2hlbWFQcm9wb3NhbFByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vanNvbi1zY2hlbWEtcHJvcG9zYWwtcHJvdmlkZXInXG5pbXBvcnQgeyBDb21wb3VuZFByb3Bvc2FsUHJvdmlkZXIgfSBmcm9tICcuL2NvbXBvdW5kLXByb3ZpZGVyJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJy4uLy4uL2pzb24tc2NoZW1hLXJlc29sdmVyJ1xuaW1wb3J0IHsgd3JhcCB9IGZyb20gJy4uLy4uL2pzb24tc2NoZW1hJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlbWFTdG9yZVByb3ZpZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb21wb3VuZFByb3ZpZXIgPSBuZXcgQ29tcG91bmRQcm9wb3NhbFByb3ZpZGVyKClcbiAgICB0aGlzLmJsYWNrTGlzdCA9IHt9XG4gIH1cblxuICBnZXRTY2hlbWFJbmZvcygpIHtcbiAgICBpZiAodGhpcy5zY2hlbWFJbmZvcykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnNjaGVtYUluZm9zKVxuICAgIH1cbiAgICByZXR1cm4gYXhpb3MuZ2V0KCdodHRwOi8vc2NoZW1hc3RvcmUub3JnL2FwaS9qc29uL2NhdGFsb2cuanNvbicpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5kYXRhKVxuICAgICAgLnRoZW4oZGF0YSA9PiBkYXRhLnNjaGVtYXMuZmlsdGVyKHNjaGVtYSA9PiBCb29sZWFuKHNjaGVtYS5maWxlTWF0Y2gpKSlcbiAgICAgIC50aGVuKHNjaGVtYUluZm9zID0+IHtcbiAgICAgICAgdGhpcy5zY2hlbWFJbmZvcyA9IHNjaGVtYUluZm9zXG4gICAgICAgIHJldHVybiBzY2hlbWFJbmZvc1xuICAgICAgfSlcbiAgfVxuXG4gIGdldFByb3Bvc2FscyhyZXF1ZXN0KSB7XG4gICAgY29uc3QgZmlsZSA9IHJlcXVlc3QuZWRpdG9yLmJ1ZmZlci5maWxlXG4gICAgaWYgKHRoaXMuYmxhY2tMaXN0W2ZpbGUuZ2V0QmFzZU5hbWUoKV0pIHtcbiAgICAgIGNvbnNvbGUud2Fybignc2NoZW1hcyBub3QgYXZhaWxhYmxlJylcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNvbXBvdW5kUHJvdmllci5oYXNQcm9wb3NhbHMoZmlsZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFNjaGVtYUluZm9zKClcbiAgICAgICAgLnRoZW4oc2NoZW1hSW5mb3MgPT4gc2NoZW1hSW5mb3MuZmlsdGVyKCh7IGZpbGVNYXRjaCB9KSA9PiBmaWxlTWF0Y2guc29tZShtYXRjaCA9PiBtaW5pbWF0Y2goZmlsZS5nZXRCYXNlTmFtZSgpLCBtYXRjaCkpKSlcbiAgICAgICAgLnRoZW4obWF0Y2hpbmcgPT4ge1xuICAgICAgICAgIGNvbnN0IHByb21pc2VzID0gbWF0Y2hpbmcubWFwKHNjaGVtYUluZm8gPT4gcmVzb2x2ZShzY2hlbWFJbmZvLnVybCkudGhlbihzY2hlbWEgPT4gbmV3IEpzb25TY2hlbWFQcm9wb3NhbFByb3ZpZGVyKFxuICAgICAgICAgICAgc2NoZW1hSW5mby5maWxlTWF0Y2gsXG4gICAgICAgICAgICB3cmFwKHNjaGVtYSlcbiAgICAgICAgICApKSlcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHByb3ZpZGVycyA9PiB0aGlzLmNvbXBvdW5kUHJvdmllci5hZGRQcm92aWRlcnMocHJvdmlkZXJzKSlcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5jb21wb3VuZFByb3ZpZXIuaGFzUHJvcG9zYWxzKGZpbGUpKSB7XG4gICAgICAgICAgICB0aGlzLmJsYWNrTGlzdFtmaWxlLmdldEJhc2VOYW1lKCldID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5jb21wb3VuZFByb3ZpZXIuZ2V0UHJvcG9zYWxzKHJlcXVlc3QpKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb21wb3VuZFByb3ZpZXIuZ2V0UHJvcG9zYWxzKHJlcXVlc3QpXG4gIH1cblxuICBnZXRGaWxlUGF0dGVybigpIHtcbiAgICByZXR1cm4gJyonXG4gIH1cbn1cbiJdfQ==