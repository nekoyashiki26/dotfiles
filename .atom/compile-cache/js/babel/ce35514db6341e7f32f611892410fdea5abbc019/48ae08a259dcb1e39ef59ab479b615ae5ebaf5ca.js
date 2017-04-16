Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _uriJs = require('uri-js');

var _uriJs2 = _interopRequireDefault(_uriJs);

var _lodashIsNil = require('lodash/isNil');

var _lodashIsNil2 = _interopRequireDefault(_lodashIsNil);

var _lodashIsEmpty = require('lodash/isEmpty');

var _lodashIsEmpty2 = _interopRequireDefault(_lodashIsEmpty);

var _lodashAssign = require('lodash/assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var _lodashClone = require('lodash/clone');

var _lodashClone2 = _interopRequireDefault(_lodashClone);

var _lodashIsArray = require('lodash/isArray');

var _lodashIsArray2 = _interopRequireDefault(_lodashIsArray);

var _lodashValues = require('lodash/values');

var _lodashValues2 = _interopRequireDefault(_lodashValues);

var _jsonSchemaLoader = require('./json-schema-loader');

var _jsonSchemaTypes = require('./json-schema-types');

'use babel';

var updateSchema = function updateSchema(node) {
  return function (schema) {
    // mutation, not pretty
    delete node['$ref'];
    (0, _lodashAssign2['default'])(node, schema);
  };
};

var resolveInSameDocument = function resolveInSameDocument(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var schema = _x,
        segments = _x2;
    _again = false;

    if ((0, _lodashIsEmpty2['default'])(segments)) {
      return schema;
    }

    var _segments = _toArray(segments);

    var key = _segments[0];

    var tail = _segments.slice(1);

    if (key === '#') {
      _x = schema;
      _x2 = tail;
      _again = true;
      _segments = key = tail = undefined;
      continue _function;
    }
    var subSchema = schema[key];
    _x = subSchema;
    _x2 = tail;
    _again = true;
    _segments = key = tail = subSchema = undefined;
    continue _function;
  }
};

var resolveDocument = function resolveDocument(_x3, _x4) {
  var _again2 = true;

  _function2: while (_again2) {
    var root = _x3,
        node = _x4;
    _again2 = false;
    var $ref = node.$ref;

    if ((0, _lodashIsNil2['default'])($ref)) {
      return Promise.resolve(root);
    }

    var uri = _uriJs2['default'].parse($ref);

    if (uri.reference === 'same-document') {
      updateSchema(node)(resolveInSameDocument(root, $ref.split('/')));
      _x3 = root;
      _x4 = node;
      _again2 = true;
      $ref = uri = undefined;
      continue _function2;
    }

    return (0, _jsonSchemaLoader.loadSchema)($ref).then(function (schema) {
      return resolveInSameDocument(schema, (uri.fragment || '').split('/'));
    }).then(updateSchema(node)).then(function () {
      return node.$ref ? resolveDocument(root, node) : null;
    });
  }
};

var findChildNodes = function findChildNodes(node) {
  // mutation, not pretty but has to be done somewhere
  if ((0, _lodashIsArray2['default'])(node.type)) {
    var childSchemas = node.type.map(function (type) {
      return (0, _lodashAssign2['default'])((0, _lodashClone2['default'])(node), { type: type });
    });
    delete node['type'];
    node.oneOf = childSchemas;
  }

  switch ((0, _jsonSchemaTypes.schemaType)(node)) {
    case _jsonSchemaTypes.ALL_OF_TYPE:
      return node.allOf;
    case _jsonSchemaTypes.ANY_OF_TYPE:
      return node.anyOf;
    case _jsonSchemaTypes.ONE_OF_TYPE:
      return node.oneOf;
    case _jsonSchemaTypes.OBJECT_TYPE:
      return (0, _lodashValues2['default'])(node.properties || {});
    case _jsonSchemaTypes.ARRAY_TYPE:
      return [node.items || {}];
    default:
      return [];
  }
};

var traverseResolve = function traverseResolve(root, node) {
  var resolvedNode = node.$ref ? resolveDocument(root, node) : Promise.resolve();
  return resolvedNode.then(function () {
    var childNodes = findChildNodes(node);
    var childResolvePromises = childNodes.map(function (childNode) {
      return traverseResolve(root, childNode);
    });
    return Promise.all(childResolvePromises);
  });
};

var resolve = function resolve(uri) {
  return (0, _jsonSchemaLoader.loadSchema)(uri).then(function (root) {
    return traverseResolve(root, root).then(function () {
      return root;
    });
  });
};
exports.resolve = resolve;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvanNvbi1zY2hlbWEtcmVzb2x2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7cUJBRWtCLFFBQVE7Ozs7MkJBQ1IsY0FBYzs7Ozs2QkFDWixnQkFBZ0I7Ozs7NEJBQ2pCLGVBQWU7Ozs7MkJBQ2hCLGNBQWM7Ozs7NkJBQ1osZ0JBQWdCOzs7OzRCQUNqQixlQUFlOzs7O2dDQUVQLHNCQUFzQjs7K0JBQzBDLHFCQUFxQjs7QUFYaEgsV0FBVyxDQUFBOztBQWFYLElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFHLElBQUk7U0FBSSxVQUFBLE1BQU0sRUFBSTs7QUFFckMsV0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbkIsbUNBQU8sSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0dBQ3JCO0NBQUEsQ0FBQTs7QUFFRCxJQUFNLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQjs7OzRCQUF5QjtRQUFyQixNQUFNO1FBQUUsUUFBUTs7O0FBQzdDLFFBQUksZ0NBQVEsUUFBUSxDQUFDLEVBQUU7QUFDckIsYUFBTyxNQUFNLENBQUE7S0FDZDs7NkJBQ3NCLFFBQVE7O1FBQXhCLEdBQUc7O1FBQUssSUFBSTs7QUFDbkIsUUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFO1dBQ2MsTUFBTTtZQUFFLElBQUk7O2tCQUZwQyxHQUFHLEdBQUssSUFBSTs7S0FHbEI7QUFDRCxRQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDQSxTQUFTO1VBQUUsSUFBSTs7Z0JBTHJDLEdBQUcsR0FBSyxJQUFJLEdBSWIsU0FBUzs7R0FFaEI7Q0FBQSxDQUFBOztBQUVELElBQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWU7Ozs4QkFBbUI7UUFBZixJQUFJO1FBQUUsSUFBSTs7UUFDekIsSUFBSSxHQUFLLElBQUksQ0FBYixJQUFJOztB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SSxDQUFDLENBQUMsSUFBSSxDQUFDO2FBQU0sSUFBSTtLQUFBLENBQUM7R0FBQSxDQUFDO0NBQUEsQ0FBQSIsImZpbGUiOiIvaG9tZS95b3NoaW5vcmkvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2pzb24tc2NoZW1hLXJlc29sdmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHVyaUpzIGZyb20gJ3VyaS1qcydcbmltcG9ydCBpc05pbCBmcm9tICdsb2Rhc2gvaXNOaWwnXG5pbXBvcnQgaXNFbXB0eSBmcm9tICdsb2Rhc2gvaXNFbXB0eSdcbmltcG9ydCBhc3NpZ24gZnJvbSAnbG9kYXNoL2Fzc2lnbidcbmltcG9ydCBjbG9uZSBmcm9tICdsb2Rhc2gvY2xvbmUnXG5pbXBvcnQgaXNBcnJheSBmcm9tICdsb2Rhc2gvaXNBcnJheSdcbmltcG9ydCB2YWx1ZXMgZnJvbSAnbG9kYXNoL3ZhbHVlcydcblxuaW1wb3J0IHsgbG9hZFNjaGVtYSB9IGZyb20gJy4vanNvbi1zY2hlbWEtbG9hZGVyJ1xuaW1wb3J0IHsgc2NoZW1hVHlwZSwgQUxMX09GX1RZUEUsIEFOWV9PRl9UWVBFLCBPTkVfT0ZfVFlQRSwgT0JKRUNUX1RZUEUsIEFSUkFZX1RZUEUgfSBmcm9tICcuL2pzb24tc2NoZW1hLXR5cGVzJ1xuXG5jb25zdCB1cGRhdGVTY2hlbWEgPSBub2RlID0+IHNjaGVtYSA9PiB7XG4gIC8vIG11dGF0aW9uLCBub3QgcHJldHR5XG4gIGRlbGV0ZSBub2RlWyckcmVmJ11cbiAgYXNzaWduKG5vZGUsIHNjaGVtYSlcbn1cblxuY29uc3QgcmVzb2x2ZUluU2FtZURvY3VtZW50ID0gKHNjaGVtYSwgc2VnbWVudHMpID0+IHtcbiAgaWYgKGlzRW1wdHkoc2VnbWVudHMpKSB7XG4gICAgcmV0dXJuIHNjaGVtYVxuICB9XG4gIGNvbnN0IFtrZXksIC4uLnRhaWxdID0gc2VnbWVudHNcbiAgaWYgKGtleSA9PT0gJyMnKSB7XG4gICAgcmV0dXJuIHJlc29sdmVJblNhbWVEb2N1bWVudChzY2hlbWEsIHRhaWwpXG4gIH1cbiAgY29uc3Qgc3ViU2NoZW1hID0gc2NoZW1hW2tleV1cbiAgcmV0dXJuIHJlc29sdmVJblNhbWVEb2N1bWVudChzdWJTY2hlbWEsIHRhaWwpXG59XG5cbmNvbnN0IHJlc29sdmVEb2N1bWVudCA9IChyb290LCBub2RlKSA9PiB7XG4gIGNvbnN0IHsgJHJlZiB9ID0gbm9kZVxuXG4gIGlmIChpc05pbCgkcmVmKSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocm9vdClcbiAgfVxuXG4gIGNvbnN0IHVyaSA9IHVyaUpzLnBhcnNlKCRyZWYpXG5cbiAgaWYgKHVyaS5yZWZlcmVuY2UgPT09ICdzYW1lLWRvY3VtZW50Jykge1xuICAgIHVwZGF0ZVNjaGVtYShub2RlKShyZXNvbHZlSW5TYW1lRG9jdW1lbnQocm9vdCwgJHJlZi5zcGxpdCgnLycpKSlcbiAgICByZXR1cm4gcmVzb2x2ZURvY3VtZW50KHJvb3QsIG5vZGUpXG4gIH1cblxuICByZXR1cm4gbG9hZFNjaGVtYSgkcmVmKVxuICAgIC50aGVuKHNjaGVtYSA9PiByZXNvbHZlSW5TYW1lRG9jdW1lbnQoc2NoZW1hLCAodXJpLmZyYWdtZW50IHx8ICcnKS5zcGxpdCgnLycpKSlcbiAgICAudGhlbih1cGRhdGVTY2hlbWEobm9kZSkpXG4gICAgLnRoZW4oKCkgPT4gbm9kZS4kcmVmID8gcmVzb2x2ZURvY3VtZW50KHJvb3QsIG5vZGUpIDogbnVsbClcbn1cblxuY29uc3QgZmluZENoaWxkTm9kZXMgPSBub2RlID0+IHtcbiAgLy8gbXV0YXRpb24sIG5vdCBwcmV0dHkgYnV0IGhhcyB0byBiZSBkb25lIHNvbWV3aGVyZVxuICBpZiAoaXNBcnJheShub2RlLnR5cGUpKSB7XG4gICAgY29uc3QgY2hpbGRTY2hlbWFzID0gbm9kZS50eXBlLm1hcCh0eXBlID0+IGFzc2lnbihjbG9uZShub2RlKSwgeyB0eXBlIH0pKVxuICAgIGRlbGV0ZSBub2RlWyd0eXBlJ11cbiAgICBub2RlLm9uZU9mID0gY2hpbGRTY2hlbWFzXG4gIH1cblxuICBzd2l0Y2ggKHNjaGVtYVR5cGUobm9kZSkpIHtcbiAgICBjYXNlIEFMTF9PRl9UWVBFOiByZXR1cm4gbm9kZS5hbGxPZlxuICAgIGNhc2UgQU5ZX09GX1RZUEU6IHJldHVybiBub2RlLmFueU9mXG4gICAgY2FzZSBPTkVfT0ZfVFlQRTogcmV0dXJuIG5vZGUub25lT2ZcbiAgICBjYXNlIE9CSkVDVF9UWVBFOiByZXR1cm4gdmFsdWVzKG5vZGUucHJvcGVydGllcyB8fCB7fSlcbiAgICBjYXNlIEFSUkFZX1RZUEU6IHJldHVybiBbbm9kZS5pdGVtcyB8fCB7fV1cbiAgICBkZWZhdWx0OiByZXR1cm4gW11cbiAgfVxufVxuXG5jb25zdCB0cmF2ZXJzZVJlc29sdmUgPSAocm9vdCwgbm9kZSkgPT4ge1xuICBjb25zdCByZXNvbHZlZE5vZGUgPSAobm9kZS4kcmVmID8gcmVzb2x2ZURvY3VtZW50KHJvb3QsIG5vZGUpIDogUHJvbWlzZS5yZXNvbHZlKCkpXG4gIHJldHVybiByZXNvbHZlZE5vZGUudGhlbigoKSA9PiB7XG4gICAgY29uc3QgY2hpbGROb2RlcyA9IGZpbmRDaGlsZE5vZGVzKG5vZGUpXG4gICAgY29uc3QgY2hpbGRSZXNvbHZlUHJvbWlzZXMgPSBjaGlsZE5vZGVzLm1hcChjaGlsZE5vZGUgPT4gdHJhdmVyc2VSZXNvbHZlKHJvb3QsIGNoaWxkTm9kZSkpXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGNoaWxkUmVzb2x2ZVByb21pc2VzKVxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgcmVzb2x2ZSA9IHVyaSA9PiBsb2FkU2NoZW1hKHVyaSlcbiAgLnRoZW4ocm9vdCA9PiB0cmF2ZXJzZVJlc29sdmUocm9vdCwgcm9vdCkudGhlbigoKSA9PiByb290KSlcblxuIl19