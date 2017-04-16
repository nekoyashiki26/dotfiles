Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jsonSchemaProposalFactory = require('./json-schema-proposal-factory');

var _jsonSchemaResolver = require('./json-schema-resolver');

var _jsonSchema = require('./json-schema');

'use babel';

var JsonSchemaProposalProvider = (function () {
  function JsonSchemaProposalProvider(filePattern, schema) {
    _classCallCheck(this, JsonSchemaProposalProvider);

    this.filePattern = filePattern;
    this.schema = schema;
    this.proposalFactory = new _jsonSchemaProposalFactory.JsonSchemaProposalFactory();
  }

  _createClass(JsonSchemaProposalProvider, [{
    key: 'getProposals',
    value: function getProposals(request) {
      return Promise.resolve(this.proposalFactory.createProposals(request, this.schema));
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return this.filePattern;
    }
  }], [{
    key: 'createFromProvider',
    value: function createFromProvider(schemaProvider) {
      return (0, _jsonSchemaResolver.resolve)(schemaProvider.getSchemaURI()).then(function (schema) {
        return new JsonSchemaProposalProvider(schemaProvider.getFilePattern(), (0, _jsonSchema.wrap)(schema));
      });
    }
  }]);

  return JsonSchemaProposalProvider;
})();

exports.JsonSchemaProposalProvider = JsonSchemaProposalProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvanNvbi1zY2hlbWEtcHJvcG9zYWwtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7eUNBRTBDLGdDQUFnQzs7a0NBQ2xELHdCQUF3Qjs7MEJBQzNCLGVBQWU7O0FBSnBDLFdBQVcsQ0FBQTs7SUFNRSwwQkFBMEI7QUFDMUIsV0FEQSwwQkFBMEIsQ0FDekIsV0FBVyxFQUFFLE1BQU0sRUFBRTswQkFEdEIsMEJBQTBCOztBQUVuQyxRQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUM5QixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixRQUFJLENBQUMsZUFBZSxHQUFHLDBEQUErQixDQUFBO0dBQ3ZEOztlQUxVLDBCQUEwQjs7V0FPekIsc0JBQUMsT0FBTyxFQUFFO0FBQ3BCLGFBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7S0FDbkY7OztXQUVhLDBCQUFHO0FBQ2YsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFBO0tBQ3hCOzs7V0FFd0IsNEJBQUMsY0FBYyxFQUFFO0FBQ3hDLGFBQU8saUNBQVEsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtlQUFJLElBQUksMEJBQTBCLENBQ3pGLGNBQWMsQ0FBQyxjQUFjLEVBQUUsRUFDL0Isc0JBQUssTUFBTSxDQUFDLENBQ2I7T0FBQSxDQUFDLENBQUE7S0FDSDs7O1NBcEJVLDBCQUEwQiIsImZpbGUiOiIvaG9tZS95b3NoaW5vcmkvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2pzb24tc2NoZW1hLXByb3Bvc2FsLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgSnNvblNjaGVtYVByb3Bvc2FsRmFjdG9yeSB9IGZyb20gJy4vanNvbi1zY2hlbWEtcHJvcG9zYWwtZmFjdG9yeSdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICcuL2pzb24tc2NoZW1hLXJlc29sdmVyJ1xuaW1wb3J0IHsgd3JhcCB9IGZyb20gJy4vanNvbi1zY2hlbWEnXG5cbmV4cG9ydCBjbGFzcyBKc29uU2NoZW1hUHJvcG9zYWxQcm92aWRlciB7XG4gIGNvbnN0cnVjdG9yKGZpbGVQYXR0ZXJuLCBzY2hlbWEpIHtcbiAgICB0aGlzLmZpbGVQYXR0ZXJuID0gZmlsZVBhdHRlcm5cbiAgICB0aGlzLnNjaGVtYSA9IHNjaGVtYVxuICAgIHRoaXMucHJvcG9zYWxGYWN0b3J5ID0gbmV3IEpzb25TY2hlbWFQcm9wb3NhbEZhY3RvcnkoKVxuICB9XG5cbiAgZ2V0UHJvcG9zYWxzKHJlcXVlc3QpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMucHJvcG9zYWxGYWN0b3J5LmNyZWF0ZVByb3Bvc2FscyhyZXF1ZXN0LCB0aGlzLnNjaGVtYSkpXG4gIH1cblxuICBnZXRGaWxlUGF0dGVybigpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlUGF0dGVyblxuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUZyb21Qcm92aWRlcihzY2hlbWFQcm92aWRlcikge1xuICAgIHJldHVybiByZXNvbHZlKHNjaGVtYVByb3ZpZGVyLmdldFNjaGVtYVVSSSgpKS50aGVuKHNjaGVtYSA9PiBuZXcgSnNvblNjaGVtYVByb3Bvc2FsUHJvdmlkZXIoXG4gICAgICBzY2hlbWFQcm92aWRlci5nZXRGaWxlUGF0dGVybigpLFxuICAgICAgd3JhcChzY2hlbWEpXG4gICAgKSlcbiAgfVxufVxuIl19