Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashFlatten = require('lodash/flatten');

var _lodashFlatten2 = _interopRequireDefault(_lodashFlatten);

var _jsonSchemaVisitors = require('./json-schema-visitors');

var _jsonSchema = require('./json-schema');

var _utils = require('./utils');

'use babel';

var expandedSchemas = function expandedSchemas(schema) {
  if (schema instanceof _jsonSchema.CompositeSchema) {
    var schemas = [];
    schema.accept(new _jsonSchemaVisitors.SchemaFlattenerVisitor(), schemas);
    return schemas;
  }
  return [schema];
};

var possibleTypes = function possibleTypes(schema, segments) {
  if (segments.length === 0) {
    return expandedSchemas(schema);
  }
  var visitor = new _jsonSchemaVisitors.SchemaInspectorVisitor();
  return segments.reduce(function (schemas, segment) {
    var resolvedNextSchemas = schemas.map(function (s) {
      return expandedSchemas(s);
    });
    var nextSchemas = (0, _lodashFlatten2['default'])(resolvedNextSchemas).map(function (s) {
      return s.accept(visitor, segment);
    });
    return (0, _lodashFlatten2['default'])(nextSchemas);
  }, [schema]);
};

var KeyProposalFactory = (function () {
  function KeyProposalFactory() {
    _classCallCheck(this, KeyProposalFactory);
  }

  _createClass(KeyProposalFactory, [{
    key: 'createProposals',
    value: function createProposals(request, schema) {
      var contents = request.contents;
      var segments = request.segments;

      var unwrappedContents = (0, _utils.resolveObject)(segments, contents);
      var visitor = new _jsonSchemaVisitors.KeyProposalVisitor(unwrappedContents, new _jsonSchemaVisitors.SnippetProposalVisitor());
      var possibleTpes = possibleTypes(schema, segments);
      var proposals = possibleTpes.map(function (s) {
        return s.accept(visitor, request);
      });
      return (0, _lodashFlatten2['default'])(proposals);
    }
  }]);

  return KeyProposalFactory;
})();

var ValueProposalFactory = (function () {
  function ValueProposalFactory() {
    _classCallCheck(this, ValueProposalFactory);
  }

  _createClass(ValueProposalFactory, [{
    key: 'createProposals',
    value: function createProposals(request, schema) {
      var segments = request.segments;

      var schemas = possibleTypes(schema, segments);
      var visitor = new _jsonSchemaVisitors.ValueProposalVisitor(new _jsonSchemaVisitors.SnippetProposalVisitor());
      return (0, _lodashFlatten2['default'])(schemas.map(function (s) {
        return s.accept(visitor, request);
      }));
    }
  }]);

  return ValueProposalFactory;
})();

var JsonSchemaProposalFactory = (function () {
  function JsonSchemaProposalFactory() {
    _classCallCheck(this, JsonSchemaProposalFactory);

    this.keyProposalFactory = new KeyProposalFactory();
    this.valueProposalFactory = new ValueProposalFactory();
  }

  _createClass(JsonSchemaProposalFactory, [{
    key: 'createProposals',
    value: function createProposals(request, schema) {
      var visitor = new _jsonSchemaVisitors.ValueProposalVisitor(new _jsonSchemaVisitors.SnippetProposalVisitor());

      var isKeyPosition = request.isKeyPosition;
      var isValuePosition = request.isValuePosition;
      var isFileEmpty = request.isFileEmpty;

      if (isFileEmpty) {
        return (0, _lodashFlatten2['default'])(possibleTypes(schema, []).map(function (s) {
          return s.accept(visitor, request);
        }));
      }
      if (isKeyPosition) {
        return this.keyProposalFactory.createProposals(request, schema);
      } else if (isValuePosition) {
        return this.valueProposalFactory.createProposals(request, schema);
      }
      return [];
    }
  }]);

  return JsonSchemaProposalFactory;
})();

exports.JsonSchemaProposalFactory = JsonSchemaProposalFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvanNvbi1zY2hlbWEtcHJvcG9zYWwtZmFjdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzZCQUVvQixnQkFBZ0I7Ozs7a0NBRTZGLHdCQUF3Qjs7MEJBQ3pILGVBQWU7O3FCQUNqQixTQUFTOztBQU52QyxXQUFXLENBQUE7O0FBUVgsSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFHLE1BQU0sRUFBSTtBQUNoQyxNQUFJLE1BQU0sdUNBQTJCLEVBQUU7QUFDckMsUUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFVBQU0sQ0FBQyxNQUFNLENBQUMsZ0RBQTRCLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDcEQsV0FBTyxPQUFPLENBQUE7R0FDZjtBQUNELFNBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtDQUNoQixDQUFBOztBQUVELElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxNQUFNLEVBQUUsUUFBUSxFQUFLO0FBQzFDLE1BQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDekIsV0FBTyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7R0FDL0I7QUFDRCxNQUFNLE9BQU8sR0FBRyxnREFBNEIsQ0FBQTtBQUM1QyxTQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFLO0FBQzNDLFFBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7YUFBSSxlQUFlLENBQUMsQ0FBQyxDQUFDO0tBQUEsQ0FBQyxDQUFBO0FBQ2hFLFFBQU0sV0FBVyxHQUFHLGdDQUFRLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzthQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztLQUFBLENBQUMsQ0FBQTtBQUNyRixXQUFPLGdDQUFRLFdBQVcsQ0FBQyxDQUFBO0dBQzVCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQ2IsQ0FBQTs7SUFHSyxrQkFBa0I7V0FBbEIsa0JBQWtCOzBCQUFsQixrQkFBa0I7OztlQUFsQixrQkFBa0I7O1dBQ1AseUJBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtVQUN2QixRQUFRLEdBQWUsT0FBTyxDQUE5QixRQUFRO1VBQUUsUUFBUSxHQUFLLE9BQU8sQ0FBcEIsUUFBUTs7QUFDMUIsVUFBTSxpQkFBaUIsR0FBRywwQkFBYyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDM0QsVUFBTSxPQUFPLEdBQUcsMkNBQXVCLGlCQUFpQixFQUFFLGdEQUE0QixDQUFDLENBQUE7QUFDdkYsVUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUNwRCxVQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztlQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztPQUFBLENBQUMsQ0FBQTtBQUNuRSxhQUFPLGdDQUFRLFNBQVMsQ0FBQyxDQUFBO0tBQzFCOzs7U0FSRyxrQkFBa0I7OztJQVdsQixvQkFBb0I7V0FBcEIsb0JBQW9COzBCQUFwQixvQkFBb0I7OztlQUFwQixvQkFBb0I7O1dBQ1QseUJBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtVQUN2QixRQUFRLEdBQUssT0FBTyxDQUFwQixRQUFROztBQUNoQixVQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQy9DLFVBQU0sT0FBTyxHQUFHLDZDQUF5QixnREFBNEIsQ0FBQyxDQUFBO0FBQ3RFLGFBQU8sZ0NBQVEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7ZUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7T0FBQSxDQUFDLENBQUMsQ0FBQTtLQUM3RDs7O1NBTkcsb0JBQW9COzs7SUFTYix5QkFBeUI7QUFDekIsV0FEQSx5QkFBeUIsR0FDdEI7MEJBREgseUJBQXlCOztBQUVsQyxRQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFBO0FBQ2xELFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUE7R0FDdkQ7O2VBSlUseUJBQXlCOztXQU1yQix5QkFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9CLFVBQU0sT0FBTyxHQUFHLDZDQUF5QixnREFBNEIsQ0FBQyxDQUFBOztVQUU5RCxhQUFhLEdBQW1DLE9BQU8sQ0FBdkQsYUFBYTtVQUFFLGVBQWUsR0FBa0IsT0FBTyxDQUF4QyxlQUFlO1VBQUUsV0FBVyxHQUFLLE9BQU8sQ0FBdkIsV0FBVzs7QUFDbkQsVUFBSSxXQUFXLEVBQUU7QUFDZixlQUFPLGdDQUFRLGFBQWEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztpQkFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7U0FBQSxDQUFDLENBQUMsQ0FBQTtPQUMvRTtBQUNELFVBQUksYUFBYSxFQUFFO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7T0FDaEUsTUFBTSxJQUFJLGVBQWUsRUFBRTtBQUMxQixlQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO09BQ2xFO0FBQ0QsYUFBTyxFQUFFLENBQUE7S0FDVjs7O1NBbkJVLHlCQUF5QiIsImZpbGUiOiIvaG9tZS95b3NoaW5vcml5YW1hZ3VjaGkvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2pzb24tc2NoZW1hLXByb3Bvc2FsLWZhY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgZmxhdHRlbiBmcm9tICdsb2Rhc2gvZmxhdHRlbidcblxuaW1wb3J0IHsgS2V5UHJvcG9zYWxWaXNpdG9yLCBWYWx1ZVByb3Bvc2FsVmlzaXRvciwgU25pcHBldFByb3Bvc2FsVmlzaXRvciwgU2NoZW1hRmxhdHRlbmVyVmlzaXRvciwgU2NoZW1hSW5zcGVjdG9yVmlzaXRvciB9IGZyb20gJy4vanNvbi1zY2hlbWEtdmlzaXRvcnMnXG5pbXBvcnQgeyBDb21wb3NpdGVTY2hlbWEgfSBmcm9tICcuL2pzb24tc2NoZW1hJ1xuaW1wb3J0IHsgcmVzb2x2ZU9iamVjdCB9IGZyb20gJy4vdXRpbHMnXG5cbmNvbnN0IGV4cGFuZGVkU2NoZW1hcyA9IHNjaGVtYSA9PiB7XG4gIGlmIChzY2hlbWEgaW5zdGFuY2VvZiBDb21wb3NpdGVTY2hlbWEpIHtcbiAgICBjb25zdCBzY2hlbWFzID0gW11cbiAgICBzY2hlbWEuYWNjZXB0KG5ldyBTY2hlbWFGbGF0dGVuZXJWaXNpdG9yKCksIHNjaGVtYXMpXG4gICAgcmV0dXJuIHNjaGVtYXNcbiAgfVxuICByZXR1cm4gW3NjaGVtYV1cbn1cblxuY29uc3QgcG9zc2libGVUeXBlcyA9IChzY2hlbWEsIHNlZ21lbnRzKSA9PiB7XG4gIGlmIChzZWdtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZXhwYW5kZWRTY2hlbWFzKHNjaGVtYSlcbiAgfVxuICBjb25zdCB2aXNpdG9yID0gbmV3IFNjaGVtYUluc3BlY3RvclZpc2l0b3IoKVxuICByZXR1cm4gc2VnbWVudHMucmVkdWNlKChzY2hlbWFzLCBzZWdtZW50KSA9PiB7XG4gICAgY29uc3QgcmVzb2x2ZWROZXh0U2NoZW1hcyA9IHNjaGVtYXMubWFwKHMgPT4gZXhwYW5kZWRTY2hlbWFzKHMpKVxuICAgIGNvbnN0IG5leHRTY2hlbWFzID0gZmxhdHRlbihyZXNvbHZlZE5leHRTY2hlbWFzKS5tYXAocyA9PiBzLmFjY2VwdCh2aXNpdG9yLCBzZWdtZW50KSlcbiAgICByZXR1cm4gZmxhdHRlbihuZXh0U2NoZW1hcylcbiAgfSwgW3NjaGVtYV0pXG59XG5cblxuY2xhc3MgS2V5UHJvcG9zYWxGYWN0b3J5IHtcbiAgY3JlYXRlUHJvcG9zYWxzKHJlcXVlc3QsIHNjaGVtYSkge1xuICAgIGNvbnN0IHsgY29udGVudHMsIHNlZ21lbnRzIH0gPSByZXF1ZXN0XG4gICAgY29uc3QgdW53cmFwcGVkQ29udGVudHMgPSByZXNvbHZlT2JqZWN0KHNlZ21lbnRzLCBjb250ZW50cylcbiAgICBjb25zdCB2aXNpdG9yID0gbmV3IEtleVByb3Bvc2FsVmlzaXRvcih1bndyYXBwZWRDb250ZW50cywgbmV3IFNuaXBwZXRQcm9wb3NhbFZpc2l0b3IoKSlcbiAgICBjb25zdCBwb3NzaWJsZVRwZXMgPSBwb3NzaWJsZVR5cGVzKHNjaGVtYSwgc2VnbWVudHMpXG4gICAgY29uc3QgcHJvcG9zYWxzID0gcG9zc2libGVUcGVzLm1hcChzID0+IHMuYWNjZXB0KHZpc2l0b3IsIHJlcXVlc3QpKVxuICAgIHJldHVybiBmbGF0dGVuKHByb3Bvc2FscylcbiAgfVxufVxuXG5jbGFzcyBWYWx1ZVByb3Bvc2FsRmFjdG9yeSB7XG4gIGNyZWF0ZVByb3Bvc2FscyhyZXF1ZXN0LCBzY2hlbWEpIHtcbiAgICBjb25zdCB7IHNlZ21lbnRzIH0gPSByZXF1ZXN0XG4gICAgY29uc3Qgc2NoZW1hcyA9IHBvc3NpYmxlVHlwZXMoc2NoZW1hLCBzZWdtZW50cylcbiAgICBjb25zdCB2aXNpdG9yID0gbmV3IFZhbHVlUHJvcG9zYWxWaXNpdG9yKG5ldyBTbmlwcGV0UHJvcG9zYWxWaXNpdG9yKCkpXG4gICAgcmV0dXJuIGZsYXR0ZW4oc2NoZW1hcy5tYXAocyA9PiBzLmFjY2VwdCh2aXNpdG9yLCByZXF1ZXN0KSkpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEpzb25TY2hlbWFQcm9wb3NhbEZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleVByb3Bvc2FsRmFjdG9yeSA9IG5ldyBLZXlQcm9wb3NhbEZhY3RvcnkoKVxuICAgIHRoaXMudmFsdWVQcm9wb3NhbEZhY3RvcnkgPSBuZXcgVmFsdWVQcm9wb3NhbEZhY3RvcnkoKVxuICB9XG5cbiAgY3JlYXRlUHJvcG9zYWxzKHJlcXVlc3QsIHNjaGVtYSkge1xuICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgVmFsdWVQcm9wb3NhbFZpc2l0b3IobmV3IFNuaXBwZXRQcm9wb3NhbFZpc2l0b3IoKSlcblxuICAgIGNvbnN0IHsgaXNLZXlQb3NpdGlvbiwgaXNWYWx1ZVBvc2l0aW9uLCBpc0ZpbGVFbXB0eSB9ID0gcmVxdWVzdFxuICAgIGlmIChpc0ZpbGVFbXB0eSkge1xuICAgICAgcmV0dXJuIGZsYXR0ZW4ocG9zc2libGVUeXBlcyhzY2hlbWEsIFtdKS5tYXAocyA9PiBzLmFjY2VwdCh2aXNpdG9yLCByZXF1ZXN0KSkpXG4gICAgfVxuICAgIGlmIChpc0tleVBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5rZXlQcm9wb3NhbEZhY3RvcnkuY3JlYXRlUHJvcG9zYWxzKHJlcXVlc3QsIHNjaGVtYSlcbiAgICB9IGVsc2UgaWYgKGlzVmFsdWVQb3NpdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVQcm9wb3NhbEZhY3RvcnkuY3JlYXRlUHJvcG9zYWxzKHJlcXVlc3QsIHNjaGVtYSlcbiAgICB9XG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cbiJdfQ==