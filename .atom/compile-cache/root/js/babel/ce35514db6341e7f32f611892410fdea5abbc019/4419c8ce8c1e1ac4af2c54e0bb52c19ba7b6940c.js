Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashFlatten = require('lodash/flatten');

var _lodashFlatten2 = _interopRequireDefault(_lodashFlatten);

var _utils = require('./utils');

var _jsonSchema = require('./json-schema');

/** Base implementation for JSON schema visitor. Applies the parameter function as all non-overwritten methods. */
'use babel';

var DefaultSchemaVisitor = (function () {
  function DefaultSchemaVisitor(defaultVisit) {
    _classCallCheck(this, DefaultSchemaVisitor);

    this.defaultVisit = defaultVisit;
  }

  /** Visitor for finding the child schemas of any schema. */

  // Complex schemas

  _createClass(DefaultSchemaVisitor, [{
    key: 'visitObjectSchema',
    value: function visitObjectSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitArraySchema',
    value: function visitArraySchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitOneOfSchema',
    value: function visitOneOfSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitAllOfSchema',
    value: function visitAllOfSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitAnyOfSchema',
    value: function visitAnyOfSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }

    // Simple schemas
  }, {
    key: 'visitEnumSchema',
    value: function visitEnumSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitStringSchema',
    value: function visitStringSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitNumberSchema',
    value: function visitNumberSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitBooleanSchema',
    value: function visitBooleanSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitNullSchema',
    value: function visitNullSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitAnySchema',
    value: function visitAnySchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }]);

  return DefaultSchemaVisitor;
})();

exports.DefaultSchemaVisitor = DefaultSchemaVisitor;

var SchemaInspectorVisitor = (function (_DefaultSchemaVisitor) {
  _inherits(SchemaInspectorVisitor, _DefaultSchemaVisitor);

  function SchemaInspectorVisitor() {
    _classCallCheck(this, SchemaInspectorVisitor);

    _get(Object.getPrototypeOf(SchemaInspectorVisitor.prototype), 'constructor', this).call(this, function () {
      return [];
    });
  }

  /** Visitor for flattening nested schemas. */

  _createClass(SchemaInspectorVisitor, [{
    key: 'visitObjectSchema',
    value: function visitObjectSchema(schema, segment) {
      var childSchema = schema.properties[segment];
      if (childSchema) {
        return [childSchema];
      }
      return schema.patternProperties.filter(function (_ref) {
        var pattern = _ref.pattern;
        return pattern.test(segment);
      }).map(function (p) {
        return p.schema;
      });
    }
  }, {
    key: 'visitArraySchema',
    value: function visitArraySchema(schema) {
      return [schema.itemSchema];
    }
  }, {
    key: 'visitOneOfSchema',
    value: function visitOneOfSchema(schema, segment) {
      var _this = this;

      return (0, _lodashFlatten2['default'])(schema.schemas.map(function (s) {
        return s.accept(_this, segment);
      }));
    }
  }, {
    key: 'visitAllOfSchema',
    value: function visitAllOfSchema(schema, segment) {
      var _this2 = this;

      return (0, _lodashFlatten2['default'])(schema.schemas.map(function (s) {
        return s.accept(_this2, segment);
      }));
    }
  }, {
    key: 'visitAnyOfSchema',
    value: function visitAnyOfSchema(schema, segment) {
      var _this3 = this;

      return (0, _lodashFlatten2['default'])(schema.schemas.map(function (s) {
        return s.accept(_this3, segment);
      }));
    }
  }]);

  return SchemaInspectorVisitor;
})(DefaultSchemaVisitor);

exports.SchemaInspectorVisitor = SchemaInspectorVisitor;

var SchemaFlattenerVisitor = (function (_DefaultSchemaVisitor2) {
  _inherits(SchemaFlattenerVisitor, _DefaultSchemaVisitor2);

  function SchemaFlattenerVisitor() {
    _classCallCheck(this, SchemaFlattenerVisitor);

    _get(Object.getPrototypeOf(SchemaFlattenerVisitor.prototype), 'constructor', this).call(this, function (schema, parameter) {
      return parameter.push(schema);
    });
  }

  /** Visitor for providing value snippets for the given schema. */

  _createClass(SchemaFlattenerVisitor, [{
    key: 'visitOneOfSchema',
    value: function visitOneOfSchema(schema, collector) {
      var _this4 = this;

      schema.schemas.forEach(function (childSchema) {
        return childSchema.accept(_this4, collector);
      });
    }
  }, {
    key: 'visitAllOfSchema',
    value: function visitAllOfSchema(schema, collector) {
      var _this5 = this;

      schema.schemas.forEach(function (childSchema) {
        return childSchema.accept(_this5, collector);
      });
    }
  }, {
    key: 'visitAnyOfSchema',
    value: function visitAnyOfSchema(schema, collector) {
      var _this6 = this;

      schema.schemas.forEach(function (childSchema) {
        return childSchema.accept(_this6, collector);
      });
    }
  }]);

  return SchemaFlattenerVisitor;
})(DefaultSchemaVisitor);

exports.SchemaFlattenerVisitor = SchemaFlattenerVisitor;

var SnippetProposalVisitor = (function (_DefaultSchemaVisitor3) {
  _inherits(SnippetProposalVisitor, _DefaultSchemaVisitor3);

  function SnippetProposalVisitor() {
    _classCallCheck(this, SnippetProposalVisitor);

    _get(Object.getPrototypeOf(SnippetProposalVisitor.prototype), 'constructor', this).call(this, function () {
      return SnippetProposalVisitor.DEFAULT;
    });
  }

  _createClass(SnippetProposalVisitor, [{
    key: 'comma',
    value: function comma(request) {
      return request.shouldAddComma ? ',' : '';
    }
  }, {
    key: 'visitStringLike',
    value: function visitStringLike(schema, request) {
      var isBetweenQuotes = request.isBetweenQuotes;

      var q = isBetweenQuotes ? '' : '"';
      return q + '${1:' + (schema.defaultValue || '') + '}' + q + this.comma(request);
    }
  }, {
    key: 'visitStringSchema',
    value: function visitStringSchema(schema, request) {
      return this.visitStringLike(schema, request);
    }
  }, {
    key: 'visitNumberSchema',
    value: function visitNumberSchema(schema, request) {
      return request.isBetweenQuotes ? this.defaultVisit(schema, request) : '${1:' + (schema.defaultValue || '0') + '}' + this.comma(request);
    }
  }, {
    key: 'visitBooleanSchema',
    value: function visitBooleanSchema(schema, request) {
      return request.isBetweenQuotes ? this.defaultVisit(schema, request) : '${1:' + (schema.defaultValue || 'false') + '}' + this.comma(request);
    }
  }, {
    key: 'visitNullSchema',
    value: function visitNullSchema(schema, request) {
      return request.isBetweenQuotes ? this.defaultVisit(schema, request) : '${1:null}' + this.comma(request);
    }
  }, {
    key: 'visitEnumSchema',
    value: function visitEnumSchema(schema, request) {
      return this.visitStringLike(schema, request);
    }
  }, {
    key: 'visitArraySchema',
    value: function visitArraySchema(schema, request) {
      return request.isBetweenQuotes ? this.defaultVisit(schema, request) : '[$1]' + this.comma(request);
    }
  }, {
    key: 'visitObjectSchema',
    value: function visitObjectSchema(schema, request) {
      return request.isBetweenQuotes ? this.defaultVisit(schema, request) : '{$1}' + this.comma(request);
    }
  }]);

  return SnippetProposalVisitor;
})(DefaultSchemaVisitor);

exports.SnippetProposalVisitor = SnippetProposalVisitor;

SnippetProposalVisitor.DEFAULT = '$1';

/** Visitor for providing an array of IProposal s for any schema. */

var ValueProposalVisitor = (function (_DefaultSchemaVisitor4) {
  _inherits(ValueProposalVisitor, _DefaultSchemaVisitor4);

  function ValueProposalVisitor(snippetVisitor) {
    _classCallCheck(this, ValueProposalVisitor);

    _get(Object.getPrototypeOf(ValueProposalVisitor.prototype), 'constructor', this).call(this, function () {
      return [];
    });
    this.snippetVisitor = snippetVisitor;
  }

  /** Visitor for providing an array of IProposal, when editing key position */

  _createClass(ValueProposalVisitor, [{
    key: 'createBaseProposalFor',
    value: function createBaseProposalFor(schema) {
      return {
        description: schema.description,
        rightLabel: schema.displayType,
        type: 'value'
      };
    }
  }, {
    key: 'visitObjectSchema',
    value: function visitObjectSchema(schema, request) {
      var proposal = this.createBaseProposalFor(schema);
      proposal.displayText = '{}';
      proposal.snippet = schema.accept(this.snippetVisitor, request);
      return [proposal];
    }
  }, {
    key: 'visitArraySchema',
    value: function visitArraySchema(schema, request) {
      var proposal = this.createBaseProposalFor(schema);
      proposal.displayText = '[]';
      proposal.snippet = schema.accept(this.snippetVisitor, request);
      return [proposal];
    }
  }, {
    key: 'visitStringSchema',
    value: function visitStringSchema(schema, request) {
      if (request.isBetweenQuotes) {
        return [];
      }
      var proposal = this.createBaseProposalFor(schema);
      proposal.displayText = schema.defaultValue ? '"' + schema.defaultValue + '"' : '""';
      proposal.snippet = schema.accept(this.snippetVisitor, request);
      return [proposal];
    }
  }, {
    key: 'visitNumberSchema',
    value: function visitNumberSchema(schema, request) {
      if (request.isBetweenQuotes) {
        return [];
      }
      var proposal = this.createBaseProposalFor(schema);
      proposal.displayText = schema.defaultValue ? '' + schema.defaultValue : '0';
      proposal.snippet = schema.accept(this.snippetVisitor, request);
      return [proposal];
    }
  }, {
    key: 'visitBooleanSchema',
    value: function visitBooleanSchema(schema, request) {
      var _this7 = this;

      if (request.isBetweenQuotes) {
        return [];
      }
      return [true, false].map(function (bool) {
        var proposal = _this7.createBaseProposalFor(schema);
        proposal.displayText = bool ? 'true' : 'false';
        proposal.snippet = proposal.displayText + '${1}' + _this7.snippetVisitor.comma(request);
        return proposal;
      });
    }
  }, {
    key: 'visitNullSchema',
    value: function visitNullSchema(schema, request) {
      if (request.isBetweenQuotes) {
        return [];
      }
      var proposal = this.createBaseProposalFor(schema);
      proposal.displayText = schema.defaultValue ? '' + schema.defaultValue : 'null';
      proposal.snippet = schema.accept(this.snippetVisitor, request);
      return [proposal];
    }
  }, {
    key: 'visitEnumSchema',
    value: function visitEnumSchema(schema, request) {
      var _this8 = this;

      var segments = request.segments;
      var contents = request.contents;

      var possibleValues = schema.values;

      if (schema.parent instanceof _jsonSchema.ArraySchema && schema.parent.hasUniqueItems()) {
        (function () {
          var alreadyPresentValues = (0, _utils.resolveObject)(segments.slice(0, segments.length - 1), contents) || [];
          possibleValues = possibleValues.filter(function (value) {
            return alreadyPresentValues.indexOf(value) < 0;
          });
        })();
      }

      return possibleValues.map(function (enumValue) {
        var proposal = _this8.createBaseProposalFor(schema);
        proposal.displayText = enumValue;
        if (request.isBetweenQuotes) {
          proposal.text = enumValue;
        } else {
          proposal.snippet = '"' + enumValue + '${1}"' + _this8.snippetVisitor.comma(request);
        }
        return proposal;
      });
    }
  }, {
    key: 'visitCompositeSchema',
    value: function visitCompositeSchema(schema, request) {
      var _this9 = this;

      return (0, _lodashFlatten2['default'])(schema.schemas.filter(function (s) {
        return !(s instanceof _jsonSchema.AnyOfSchema);
      }).map(function (s) {
        return s.accept(_this9, request).filter(function (r) {
          return r.snippet !== SnippetProposalVisitor.DEFAULT;
        });
      }));
    }
  }, {
    key: 'visitAllOfSchema',
    value: function visitAllOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }, {
    key: 'visitAnyOfSchema',
    value: function visitAnyOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }, {
    key: 'visitOneOfSchema',
    value: function visitOneOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }]);

  return ValueProposalVisitor;
})(DefaultSchemaVisitor);

exports.ValueProposalVisitor = ValueProposalVisitor;

var KeyProposalVisitor = (function (_DefaultSchemaVisitor5) {
  _inherits(KeyProposalVisitor, _DefaultSchemaVisitor5);

  function KeyProposalVisitor(unwrappedContents, snippetVisitor) {
    _classCallCheck(this, KeyProposalVisitor);

    _get(Object.getPrototypeOf(KeyProposalVisitor.prototype), 'constructor', this).call(this, function () {
      return [];
    });
    this.unwrappedContents = unwrappedContents;
    this.snippetVisitor = snippetVisitor;
  }

  _createClass(KeyProposalVisitor, [{
    key: 'visitObjectSchema',
    value: function visitObjectSchema(schema, request) {
      var _this10 = this;

      var prefix = request.prefix;
      var isBetweenQuotes = request.isBetweenQuotes;

      return schema.keys.filter(function (key) {
        return !_this10.unwrappedContents || key.indexOf(prefix) >= 0 && !_this10.unwrappedContents.hasOwnProperty(key);
      }).map(function (key) {
        var valueSchema = schema.properties[key];
        var proposal = {};

        proposal.description = valueSchema.description;
        proposal.type = 'property';
        proposal.displayText = key;
        proposal.rightLabel = valueSchema.displayType;
        if (isBetweenQuotes) {
          proposal.text = key;
        } else {
          var value = schema.properties[key].accept(_this10.snippetVisitor, request);
          proposal.snippet = '"' + key + '": ' + value;
        }
        return proposal;
      });
    }
  }, {
    key: 'visitCompositeSchema',
    value: function visitCompositeSchema(schema, request) {
      var _this11 = this;

      var proposals = schema.schemas.filter(function (s) {
        return s instanceof _jsonSchema.ObjectSchema;
      }).map(function (s) {
        return s.accept(_this11, request);
      });
      return (0, _lodashFlatten2['default'])(proposals);
    }
  }, {
    key: 'visitAllOfSchema',
    value: function visitAllOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }, {
    key: 'visitAnyOfSchema',
    value: function visitAnyOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }, {
    key: 'visitOneOfSchema',
    value: function visitOneOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }]);

  return KeyProposalVisitor;
})(DefaultSchemaVisitor);

exports.KeyProposalVisitor = KeyProposalVisitor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvanNvbi1zY2hlbWEtdmlzaXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRW9CLGdCQUFnQjs7OztxQkFDTixTQUFTOzswQkFDZ0IsZUFBZTs7O0FBSnRFLFdBQVcsQ0FBQTs7SUFPRSxvQkFBb0I7QUFDcEIsV0FEQSxvQkFBb0IsQ0FDbkIsWUFBWSxFQUFFOzBCQURmLG9CQUFvQjs7QUFFN0IsUUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUE7R0FDakM7Ozs7OztlQUhVLG9CQUFvQjs7V0FLZCwyQkFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQ25DLGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7S0FDNUM7OztXQUNlLDBCQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUU7QUFDbEMsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtLQUM1Qzs7O1dBQ2UsMEJBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRTtBQUNsQyxhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0tBQzVDOzs7V0FDZSwwQkFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQ2xDLGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7S0FDNUM7OztXQUNlLDBCQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUU7QUFDbEMsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtLQUM1Qzs7Ozs7V0FHYyx5QkFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQ2pDLGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENB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c2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvanNvbi1zY2hlbWEtdmlzaXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgZmxhdHRlbiBmcm9tICdsb2Rhc2gvZmxhdHRlbidcbmltcG9ydCB7IHJlc29sdmVPYmplY3QgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IHsgQXJyYXlTY2hlbWEsIE9iamVjdFNjaGVtYSwgQW55T2ZTY2hlbWEgfSBmcm9tICcuL2pzb24tc2NoZW1hJ1xuXG4vKiogQmFzZSBpbXBsZW1lbnRhdGlvbiBmb3IgSlNPTiBzY2hlbWEgdmlzaXRvci4gQXBwbGllcyB0aGUgcGFyYW1ldGVyIGZ1bmN0aW9uIGFzIGFsbCBub24tb3ZlcndyaXR0ZW4gbWV0aG9kcy4gKi9cbmV4cG9ydCBjbGFzcyBEZWZhdWx0U2NoZW1hVmlzaXRvciB7XG4gIGNvbnN0cnVjdG9yKGRlZmF1bHRWaXNpdCkge1xuICAgIHRoaXMuZGVmYXVsdFZpc2l0ID0gZGVmYXVsdFZpc2l0XG4gIH1cbiAgLy8gQ29tcGxleCBzY2hlbWFzXG4gIHZpc2l0T2JqZWN0U2NoZW1hKHNjaGVtYSwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFZpc2l0KHNjaGVtYSwgcGFyYW1ldGVyKVxuICB9XG4gIHZpc2l0QXJyYXlTY2hlbWEoc2NoZW1hLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCBwYXJhbWV0ZXIpXG4gIH1cbiAgdmlzaXRPbmVPZlNjaGVtYShzY2hlbWEsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHBhcmFtZXRlcilcbiAgfVxuICB2aXNpdEFsbE9mU2NoZW1hKHNjaGVtYSwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFZpc2l0KHNjaGVtYSwgcGFyYW1ldGVyKVxuICB9XG4gIHZpc2l0QW55T2ZTY2hlbWEoc2NoZW1hLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCBwYXJhbWV0ZXIpXG4gIH1cblxuICAvLyBTaW1wbGUgc2NoZW1hc1xuICB2aXNpdEVudW1TY2hlbWEoc2NoZW1hLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCBwYXJhbWV0ZXIpXG4gIH1cbiAgdmlzaXRTdHJpbmdTY2hlbWEoc2NoZW1hLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCBwYXJhbWV0ZXIpXG4gIH1cbiAgdmlzaXROdW1iZXJTY2hlbWEoc2NoZW1hLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCBwYXJhbWV0ZXIpXG4gIH1cbiAgdmlzaXRCb29sZWFuU2NoZW1hKHNjaGVtYSwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFZpc2l0KHNjaGVtYSwgcGFyYW1ldGVyKVxuICB9XG4gIHZpc2l0TnVsbFNjaGVtYShzY2hlbWEsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHBhcmFtZXRlcilcbiAgfVxuICB2aXNpdEFueVNjaGVtYShzY2hlbWEsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHBhcmFtZXRlcilcbiAgfVxufVxuXG4vKiogVmlzaXRvciBmb3IgZmluZGluZyB0aGUgY2hpbGQgc2NoZW1hcyBvZiBhbnkgc2NoZW1hLiAqL1xuZXhwb3J0IGNsYXNzIFNjaGVtYUluc3BlY3RvclZpc2l0b3IgZXh0ZW5kcyBEZWZhdWx0U2NoZW1hVmlzaXRvciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKCkgPT4gW10pXG4gIH1cblxuICB2aXNpdE9iamVjdFNjaGVtYShzY2hlbWEsIHNlZ21lbnQpIHtcbiAgICBjb25zdCBjaGlsZFNjaGVtYSA9IHNjaGVtYS5wcm9wZXJ0aWVzW3NlZ21lbnRdXG4gICAgaWYgKGNoaWxkU2NoZW1hKSB7XG4gICAgICByZXR1cm4gW2NoaWxkU2NoZW1hXVxuICAgIH1cbiAgICByZXR1cm4gc2NoZW1hLnBhdHRlcm5Qcm9wZXJ0aWVzXG4gICAgICAuZmlsdGVyKCh7IHBhdHRlcm4gfSkgPT4gcGF0dGVybi50ZXN0KHNlZ21lbnQpKVxuICAgICAgLm1hcChwID0+IHAuc2NoZW1hKVxuICB9XG5cbiAgdmlzaXRBcnJheVNjaGVtYShzY2hlbWEpIHtcbiAgICByZXR1cm4gW3NjaGVtYS5pdGVtU2NoZW1hXVxuICB9XG5cbiAgdmlzaXRPbmVPZlNjaGVtYShzY2hlbWEsIHNlZ21lbnQpIHtcbiAgICByZXR1cm4gZmxhdHRlbihzY2hlbWEuc2NoZW1hcy5tYXAocyA9PiBzLmFjY2VwdCh0aGlzLCBzZWdtZW50KSkpXG4gIH1cblxuICB2aXNpdEFsbE9mU2NoZW1hKHNjaGVtYSwgc2VnbWVudCkge1xuICAgIHJldHVybiBmbGF0dGVuKHNjaGVtYS5zY2hlbWFzLm1hcChzID0+IHMuYWNjZXB0KHRoaXMsIHNlZ21lbnQpKSlcbiAgfVxuXG4gIHZpc2l0QW55T2ZTY2hlbWEoc2NoZW1hLCBzZWdtZW50KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oc2NoZW1hLnNjaGVtYXMubWFwKHMgPT4gcy5hY2NlcHQodGhpcywgc2VnbWVudCkpKVxuICB9XG59XG5cbi8qKiBWaXNpdG9yIGZvciBmbGF0dGVuaW5nIG5lc3RlZCBzY2hlbWFzLiAqL1xuZXhwb3J0IGNsYXNzIFNjaGVtYUZsYXR0ZW5lclZpc2l0b3IgZXh0ZW5kcyBEZWZhdWx0U2NoZW1hVmlzaXRvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKChzY2hlbWEsIHBhcmFtZXRlcikgPT4gcGFyYW1ldGVyLnB1c2goc2NoZW1hKSlcbiAgfVxuXG4gIHZpc2l0T25lT2ZTY2hlbWEoc2NoZW1hLCBjb2xsZWN0b3IpIHtcbiAgICBzY2hlbWEuc2NoZW1hcy5mb3JFYWNoKGNoaWxkU2NoZW1hID0+IGNoaWxkU2NoZW1hLmFjY2VwdCh0aGlzLCBjb2xsZWN0b3IpKVxuICB9XG5cbiAgdmlzaXRBbGxPZlNjaGVtYShzY2hlbWEsIGNvbGxlY3Rvcikge1xuICAgIHNjaGVtYS5zY2hlbWFzLmZvckVhY2goY2hpbGRTY2hlbWEgPT4gY2hpbGRTY2hlbWEuYWNjZXB0KHRoaXMsIGNvbGxlY3RvcikpXG4gIH1cblxuICB2aXNpdEFueU9mU2NoZW1hKHNjaGVtYSwgY29sbGVjdG9yKSB7XG4gICAgc2NoZW1hLnNjaGVtYXMuZm9yRWFjaChjaGlsZFNjaGVtYSA9PiBjaGlsZFNjaGVtYS5hY2NlcHQodGhpcywgY29sbGVjdG9yKSlcbiAgfVxufVxuXG4vKiogVmlzaXRvciBmb3IgcHJvdmlkaW5nIHZhbHVlIHNuaXBwZXRzIGZvciB0aGUgZ2l2ZW4gc2NoZW1hLiAqL1xuZXhwb3J0IGNsYXNzIFNuaXBwZXRQcm9wb3NhbFZpc2l0b3IgZXh0ZW5kcyBEZWZhdWx0U2NoZW1hVmlzaXRvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCgpID0+IFNuaXBwZXRQcm9wb3NhbFZpc2l0b3IuREVGQVVMVClcbiAgfVxuXG4gIGNvbW1hKHJlcXVlc3QpIHtcbiAgICByZXR1cm4gcmVxdWVzdC5zaG91bGRBZGRDb21tYSA/ICcsJyA6ICcnXG4gIH1cblxuICB2aXNpdFN0cmluZ0xpa2Uoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgY29uc3QgeyBpc0JldHdlZW5RdW90ZXMgfSA9IHJlcXVlc3RcbiAgICBjb25zdCBxID0gaXNCZXR3ZWVuUXVvdGVzID8gJycgOiAnXCInXG4gICAgcmV0dXJuIGAke3F9XFwkezE6JHtzY2hlbWEuZGVmYXVsdFZhbHVlIHx8ICcnfX0ke3F9JHt0aGlzLmNvbW1hKHJlcXVlc3QpfWBcbiAgfVxuXG4gIHZpc2l0U3RyaW5nU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIHJldHVybiB0aGlzLnZpc2l0U3RyaW5nTGlrZShzY2hlbWEsIHJlcXVlc3QpXG4gIH1cblxuICB2aXNpdE51bWJlclNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICByZXR1cm4gcmVxdWVzdC5pc0JldHdlZW5RdW90ZXNcbiAgICAgID8gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCByZXF1ZXN0KVxuICAgICAgOiBgXFwkezE6JHtzY2hlbWEuZGVmYXVsdFZhbHVlIHx8ICcwJ319JHt0aGlzLmNvbW1hKHJlcXVlc3QpfWBcbiAgfVxuXG4gIHZpc2l0Qm9vbGVhblNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICByZXR1cm4gcmVxdWVzdC5pc0JldHdlZW5RdW90ZXNcbiAgICAgID8gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCByZXF1ZXN0KVxuICAgICAgOiBgXFwkezE6JHtzY2hlbWEuZGVmYXVsdFZhbHVlIHx8ICdmYWxzZSd9fSR7dGhpcy5jb21tYShyZXF1ZXN0KX1gXG4gIH1cblxuICB2aXNpdE51bGxTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgcmV0dXJuIHJlcXVlc3QuaXNCZXR3ZWVuUXVvdGVzXG4gICAgICA/IHRoaXMuZGVmYXVsdFZpc2l0KHNjaGVtYSwgcmVxdWVzdClcbiAgICAgIDogYFxcJHsxOm51bGx9JHt0aGlzLmNvbW1hKHJlcXVlc3QpfWBcbiAgfVxuXG4gIHZpc2l0RW51bVNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICByZXR1cm4gdGhpcy52aXNpdFN0cmluZ0xpa2Uoc2NoZW1hLCByZXF1ZXN0KVxuICB9XG5cbiAgdmlzaXRBcnJheVNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICByZXR1cm4gcmVxdWVzdC5pc0JldHdlZW5RdW90ZXNcbiAgICAgID8gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCByZXF1ZXN0KVxuICAgICAgOiBgWyQxXSR7dGhpcy5jb21tYShyZXF1ZXN0KX1gXG4gIH1cblxuICB2aXNpdE9iamVjdFNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICByZXR1cm4gcmVxdWVzdC5pc0JldHdlZW5RdW90ZXNcbiAgICAgID8gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCByZXF1ZXN0KVxuICAgICAgOiBgeyQxfSR7dGhpcy5jb21tYShyZXF1ZXN0KX1gXG4gIH1cbn1cblxuU25pcHBldFByb3Bvc2FsVmlzaXRvci5ERUZBVUxUID0gJyQxJ1xuXG4vKiogVmlzaXRvciBmb3IgcHJvdmlkaW5nIGFuIGFycmF5IG9mIElQcm9wb3NhbCBzIGZvciBhbnkgc2NoZW1hLiAqL1xuZXhwb3J0IGNsYXNzIFZhbHVlUHJvcG9zYWxWaXNpdG9yIGV4dGVuZHMgRGVmYXVsdFNjaGVtYVZpc2l0b3Ige1xuXG4gIGNvbnN0cnVjdG9yKHNuaXBwZXRWaXNpdG9yKSB7XG4gICAgc3VwZXIoKCkgPT4gW10pXG4gICAgdGhpcy5zbmlwcGV0VmlzaXRvciA9IHNuaXBwZXRWaXNpdG9yXG4gIH1cblxuICBjcmVhdGVCYXNlUHJvcG9zYWxGb3Ioc2NoZW1hKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBzY2hlbWEuZGVzY3JpcHRpb24sXG4gICAgICByaWdodExhYmVsOiBzY2hlbWEuZGlzcGxheVR5cGUsXG4gICAgICB0eXBlOiAndmFsdWUnXG4gICAgfVxuICB9XG5cbiAgdmlzaXRPYmplY3RTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgY29uc3QgcHJvcG9zYWwgPSB0aGlzLmNyZWF0ZUJhc2VQcm9wb3NhbEZvcihzY2hlbWEpXG4gICAgcHJvcG9zYWwuZGlzcGxheVRleHQgPSAne30nXG4gICAgcHJvcG9zYWwuc25pcHBldCA9IHNjaGVtYS5hY2NlcHQodGhpcy5zbmlwcGV0VmlzaXRvciwgcmVxdWVzdClcbiAgICByZXR1cm4gW3Byb3Bvc2FsXVxuICB9XG5cbiAgdmlzaXRBcnJheVNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICBjb25zdCBwcm9wb3NhbCA9IHRoaXMuY3JlYXRlQmFzZVByb3Bvc2FsRm9yKHNjaGVtYSlcbiAgICBwcm9wb3NhbC5kaXNwbGF5VGV4dCA9ICdbXSdcbiAgICBwcm9wb3NhbC5zbmlwcGV0ID0gc2NoZW1hLmFjY2VwdCh0aGlzLnNuaXBwZXRWaXNpdG9yLCByZXF1ZXN0KVxuICAgIHJldHVybiBbcHJvcG9zYWxdXG4gIH1cblxuICB2aXNpdFN0cmluZ1NjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICBpZiAocmVxdWVzdC5pc0JldHdlZW5RdW90ZXMpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICBjb25zdCBwcm9wb3NhbCA9IHRoaXMuY3JlYXRlQmFzZVByb3Bvc2FsRm9yKHNjaGVtYSlcbiAgICBwcm9wb3NhbC5kaXNwbGF5VGV4dCA9IHNjaGVtYS5kZWZhdWx0VmFsdWUgPyBgXCIke3NjaGVtYS5kZWZhdWx0VmFsdWV9XCJgIDogJ1wiXCInXG4gICAgcHJvcG9zYWwuc25pcHBldCA9IHNjaGVtYS5hY2NlcHQodGhpcy5zbmlwcGV0VmlzaXRvciwgcmVxdWVzdClcbiAgICByZXR1cm4gW3Byb3Bvc2FsXVxuICB9XG5cbiAgdmlzaXROdW1iZXJTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgaWYgKHJlcXVlc3QuaXNCZXR3ZWVuUXVvdGVzKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgY29uc3QgcHJvcG9zYWwgPSB0aGlzLmNyZWF0ZUJhc2VQcm9wb3NhbEZvcihzY2hlbWEpXG4gICAgcHJvcG9zYWwuZGlzcGxheVRleHQgPSBzY2hlbWEuZGVmYXVsdFZhbHVlID8gYCR7c2NoZW1hLmRlZmF1bHRWYWx1ZX1gIDogJzAnXG4gICAgcHJvcG9zYWwuc25pcHBldCA9IHNjaGVtYS5hY2NlcHQodGhpcy5zbmlwcGV0VmlzaXRvciwgcmVxdWVzdClcbiAgICByZXR1cm4gW3Byb3Bvc2FsXVxuICB9XG5cbiAgdmlzaXRCb29sZWFuU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIGlmIChyZXF1ZXN0LmlzQmV0d2VlblF1b3Rlcykge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIHJldHVybiBbdHJ1ZSwgZmFsc2VdLm1hcChib29sID0+IHtcbiAgICAgIGNvbnN0IHByb3Bvc2FsID0gdGhpcy5jcmVhdGVCYXNlUHJvcG9zYWxGb3Ioc2NoZW1hKVxuICAgICAgcHJvcG9zYWwuZGlzcGxheVRleHQgPSBib29sID8gJ3RydWUnIDogJ2ZhbHNlJ1xuICAgICAgcHJvcG9zYWwuc25pcHBldCA9IGAke3Byb3Bvc2FsLmRpc3BsYXlUZXh0fVxcJHsxfSR7dGhpcy5zbmlwcGV0VmlzaXRvci5jb21tYShyZXF1ZXN0KX1gXG4gICAgICByZXR1cm4gcHJvcG9zYWxcbiAgICB9KVxuICB9XG5cbiAgdmlzaXROdWxsU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIGlmIChyZXF1ZXN0LmlzQmV0d2VlblF1b3Rlcykge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIGNvbnN0IHByb3Bvc2FsID0gdGhpcy5jcmVhdGVCYXNlUHJvcG9zYWxGb3Ioc2NoZW1hKVxuICAgIHByb3Bvc2FsLmRpc3BsYXlUZXh0ID0gc2NoZW1hLmRlZmF1bHRWYWx1ZSA/IGAke3NjaGVtYS5kZWZhdWx0VmFsdWV9YCA6ICdudWxsJ1xuICAgIHByb3Bvc2FsLnNuaXBwZXQgPSBzY2hlbWEuYWNjZXB0KHRoaXMuc25pcHBldFZpc2l0b3IsIHJlcXVlc3QpXG4gICAgcmV0dXJuIFtwcm9wb3NhbF1cbiAgfVxuXG4gIHZpc2l0RW51bVNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICBjb25zdCB7IHNlZ21lbnRzLCBjb250ZW50cyB9ID0gcmVxdWVzdFxuICAgIGxldCBwb3NzaWJsZVZhbHVlcyA9IHNjaGVtYS52YWx1ZXNcblxuICAgIGlmICgoc2NoZW1hLnBhcmVudCBpbnN0YW5jZW9mIEFycmF5U2NoZW1hKSAmJiBzY2hlbWEucGFyZW50Lmhhc1VuaXF1ZUl0ZW1zKCkpIHtcbiAgICAgIGNvbnN0IGFscmVhZHlQcmVzZW50VmFsdWVzID0gcmVzb2x2ZU9iamVjdChzZWdtZW50cy5zbGljZSgwLCBzZWdtZW50cy5sZW5ndGggLSAxKSwgY29udGVudHMpIHx8IFtdXG4gICAgICBwb3NzaWJsZVZhbHVlcyA9IHBvc3NpYmxlVmFsdWVzLmZpbHRlcih2YWx1ZSA9PiBhbHJlYWR5UHJlc2VudFZhbHVlcy5pbmRleE9mKHZhbHVlKSA8IDApXG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc3NpYmxlVmFsdWVzLm1hcChlbnVtVmFsdWUgPT4ge1xuICAgICAgY29uc3QgcHJvcG9zYWwgPSB0aGlzLmNyZWF0ZUJhc2VQcm9wb3NhbEZvcihzY2hlbWEpXG4gICAgICBwcm9wb3NhbC5kaXNwbGF5VGV4dCA9IGVudW1WYWx1ZVxuICAgICAgaWYgKHJlcXVlc3QuaXNCZXR3ZWVuUXVvdGVzKSB7XG4gICAgICAgIHByb3Bvc2FsLnRleHQgPSBlbnVtVmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb3Bvc2FsLnNuaXBwZXQgPSBgXCIke2VudW1WYWx1ZX1cXCR7MX1cIiR7dGhpcy5zbmlwcGV0VmlzaXRvci5jb21tYShyZXF1ZXN0KX1gXG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvcG9zYWxcbiAgICB9KVxuICB9XG5cbiAgdmlzaXRDb21wb3NpdGVTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oc2NoZW1hLnNjaGVtYXNcbiAgICAgIC5maWx0ZXIocyA9PiAhKHMgaW5zdGFuY2VvZiBBbnlPZlNjaGVtYSkpXG4gICAgICAubWFwKHMgPT4gcy5hY2NlcHQodGhpcywgcmVxdWVzdCkuZmlsdGVyKHIgPT4gci5zbmlwcGV0ICE9PSBTbmlwcGV0UHJvcG9zYWxWaXNpdG9yLkRFRkFVTFQpKVxuICAgIClcbiAgfVxuXG4gIHZpc2l0QWxsT2ZTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDb21wb3NpdGVTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KVxuICB9XG5cbiAgdmlzaXRBbnlPZlNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICByZXR1cm4gdGhpcy52aXNpdENvbXBvc2l0ZVNjaGVtYShzY2hlbWEsIHJlcXVlc3QpXG4gIH1cblxuICB2aXNpdE9uZU9mU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q29tcG9zaXRlU2NoZW1hKHNjaGVtYSwgcmVxdWVzdClcbiAgfVxufVxuXG4vKiogVmlzaXRvciBmb3IgcHJvdmlkaW5nIGFuIGFycmF5IG9mIElQcm9wb3NhbCwgd2hlbiBlZGl0aW5nIGtleSBwb3NpdGlvbiAqL1xuZXhwb3J0IGNsYXNzIEtleVByb3Bvc2FsVmlzaXRvciBleHRlbmRzIERlZmF1bHRTY2hlbWFWaXNpdG9yIHtcblxuICBjb25zdHJ1Y3Rvcih1bndyYXBwZWRDb250ZW50cywgc25pcHBldFZpc2l0b3IpIHtcbiAgICBzdXBlcigoKCkgPT4gW10pKVxuICAgIHRoaXMudW53cmFwcGVkQ29udGVudHMgPSB1bndyYXBwZWRDb250ZW50c1xuICAgIHRoaXMuc25pcHBldFZpc2l0b3IgPSBzbmlwcGV0VmlzaXRvclxuICB9XG5cbiAgdmlzaXRPYmplY3RTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgY29uc3QgeyBwcmVmaXgsIGlzQmV0d2VlblF1b3RlcyB9ID0gcmVxdWVzdFxuICAgIHJldHVybiBzY2hlbWEua2V5c1xuICAgICAgLmZpbHRlcihrZXkgPT4gIXRoaXMudW53cmFwcGVkQ29udGVudHMgfHwgKGtleS5pbmRleE9mKHByZWZpeCkgPj0gMCAmJiAhdGhpcy51bndyYXBwZWRDb250ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSlcbiAgICAgIC5tYXAoa2V5ID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWVTY2hlbWEgPSBzY2hlbWEucHJvcGVydGllc1trZXldXG4gICAgICAgIGNvbnN0IHByb3Bvc2FsID0ge31cblxuICAgICAgICBwcm9wb3NhbC5kZXNjcmlwdGlvbiA9IHZhbHVlU2NoZW1hLmRlc2NyaXB0aW9uXG4gICAgICAgIHByb3Bvc2FsLnR5cGUgPSAncHJvcGVydHknXG4gICAgICAgIHByb3Bvc2FsLmRpc3BsYXlUZXh0ID0ga2V5XG4gICAgICAgIHByb3Bvc2FsLnJpZ2h0TGFiZWwgPSB2YWx1ZVNjaGVtYS5kaXNwbGF5VHlwZVxuICAgICAgICBpZiAoaXNCZXR3ZWVuUXVvdGVzKSB7XG4gICAgICAgICAgcHJvcG9zYWwudGV4dCA9IGtleVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2NoZW1hLnByb3BlcnRpZXNba2V5XS5hY2NlcHQodGhpcy5zbmlwcGV0VmlzaXRvciwgcmVxdWVzdClcbiAgICAgICAgICBwcm9wb3NhbC5zbmlwcGV0ID0gYFwiJHtrZXl9XCI6ICR7dmFsdWV9YFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wb3NhbFxuICAgICAgfSlcbiAgfVxuXG4gIHZpc2l0Q29tcG9zaXRlU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIGNvbnN0IHByb3Bvc2FscyA9IHNjaGVtYS5zY2hlbWFzXG4gICAgICAuZmlsdGVyKHMgPT4gcyBpbnN0YW5jZW9mIE9iamVjdFNjaGVtYSlcbiAgICAgIC5tYXAocyA9PiBzLmFjY2VwdCh0aGlzLCByZXF1ZXN0KSlcbiAgICByZXR1cm4gZmxhdHRlbihwcm9wb3NhbHMpXG4gIH1cblxuICB2aXNpdEFsbE9mU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q29tcG9zaXRlU2NoZW1hKHNjaGVtYSwgcmVxdWVzdClcbiAgfVxuXG4gIHZpc2l0QW55T2ZTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDb21wb3NpdGVTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KVxuICB9XG5cbiAgdmlzaXRPbmVPZlNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICByZXR1cm4gdGhpcy52aXNpdENvbXBvc2l0ZVNjaGVtYShzY2hlbWEsIHJlcXVlc3QpXG4gIH1cbn1cbiJdfQ==