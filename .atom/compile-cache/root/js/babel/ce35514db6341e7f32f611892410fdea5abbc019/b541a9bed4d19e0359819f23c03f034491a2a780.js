Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jsonSchemaTypes = require('./json-schema-types');

var _lodashUniq = require('lodash/uniq');

var _lodashUniq2 = _interopRequireDefault(_lodashUniq);

'use babel';

var wrap = function wrap(schema) {
  var parent = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  switch ((0, _jsonSchemaTypes.schemaType)(schema)) {
    case _jsonSchemaTypes.ALL_OF_TYPE:
      return new AllOfSchema(schema, parent);
    case _jsonSchemaTypes.ANY_OF_TYPE:
      return new AnyOfSchema(schema, parent);
    case _jsonSchemaTypes.ARRAY_TYPE:
      return new ArraySchema(schema, parent);
    case _jsonSchemaTypes.BOOLEAN_TYPE:
      return new BooleanSchema(schema, parent);
    case _jsonSchemaTypes.ENUM_TYPE:
      return new EnumSchema(schema, parent);
    case _jsonSchemaTypes.NULL_TYPE:
      return new NullSchema(schema, parent);
    case _jsonSchemaTypes.NUMBER_TYPE:
      return new NumberSchema(schema, parent);
    case _jsonSchemaTypes.OBJECT_TYPE:
      return new ObjectSchema(schema, parent);
    case _jsonSchemaTypes.ONE_OF_TYPE:
      return new OneOfSchema(schema, parent);
    case _jsonSchemaTypes.STRING_TYPE:
      return new StringSchema(schema, parent);
    default:
      return new AnySchema({}, parent);
  }
};

exports.wrap = wrap;

var BaseSchema = function BaseSchema(schema, parent) {
  _classCallCheck(this, BaseSchema);

  this.schema = schema;
  this.parent = parent;
  this.description = this.schema.description;
  this.defaultValue = this.schema['default'];
};

exports.BaseSchema = BaseSchema;

var PatternProperty = function PatternProperty(pattern, schema) {
  _classCallCheck(this, PatternProperty);

  this.pattern = pattern;
  this.schema = schema;
};

exports.PatternProperty = PatternProperty;

var ObjectSchema = (function (_BaseSchema) {
  _inherits(ObjectSchema, _BaseSchema);

  function ObjectSchema(schema, parent) {
    var _this = this;

    _classCallCheck(this, ObjectSchema);

    _get(Object.getPrototypeOf(ObjectSchema.prototype), 'constructor', this).call(this, schema, parent);
    var properties = this.schema.properties || {};
    this.keys = Object.keys(properties);
    this.properties = this.keys.reduce(function (object, key) {
      object[key] = wrap(properties[key], _this);
      return object;
    }, {});
    this.patternProperties = Object.keys(this.schema.patternProperties || {}).map(function (key) {
      return [key, _this.schema.patternProperties[key]];
    }).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var pattern = _ref2[0];
      var rawSchema = _ref2[1];
      return new PatternProperty(new RegExp(pattern, 'g'), wrap(rawSchema, _this));
    });
    this.displayType = 'object';
  }

  _createClass(ObjectSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitObjectSchema(this, parameter);
    }
  }]);

  return ObjectSchema;
})(BaseSchema);

exports.ObjectSchema = ObjectSchema;

var ArraySchema = (function (_BaseSchema2) {
  _inherits(ArraySchema, _BaseSchema2);

  function ArraySchema(schema, parent) {
    _classCallCheck(this, ArraySchema);

    _get(Object.getPrototypeOf(ArraySchema.prototype), 'constructor', this).call(this, schema, parent);
    this.itemSchema = wrap(this.schema.items, this);
    this.unique = Boolean(this.schema.uniqueItems || false);
    var itemDisplayType = this.itemSchema && this.itemSchema.displayType ? this.itemSchema.displayType : 'any';
    this.displayType = (0, _lodashUniq2['default'])(itemDisplayType.split('|').map(function (t) {
      return t.trim() + '[]';
    })).join(' | ');
  }

  _createClass(ArraySchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitArraySchema(this, parameter);
    }
  }]);

  return ArraySchema;
})(BaseSchema);

exports.ArraySchema = ArraySchema;

var EnumSchema = (function (_BaseSchema3) {
  _inherits(EnumSchema, _BaseSchema3);

  function EnumSchema(schema, parent) {
    _classCallCheck(this, EnumSchema);

    _get(Object.getPrototypeOf(EnumSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.values = this.schema['enum'];
    this.displayType = 'enum';
  }

  _createClass(EnumSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitEnumSchema(this, parameter);
    }
  }]);

  return EnumSchema;
})(BaseSchema);

exports.EnumSchema = EnumSchema;

var CompositeSchema = (function (_BaseSchema4) {
  _inherits(CompositeSchema, _BaseSchema4);

  function CompositeSchema(schema, parent, keyWord) {
    var _this2 = this;

    _classCallCheck(this, CompositeSchema);

    _get(Object.getPrototypeOf(CompositeSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.schemas = schema[keyWord].map(function (s) {
      return wrap(s, _this2);
    });
    this.defaultValue = null;
    this.displayType = (0, _lodashUniq2['default'])(this.schemas.map(function (s) {
      return s.displayType;
    })).join(' | ');
  }

  return CompositeSchema;
})(BaseSchema);

exports.CompositeSchema = CompositeSchema;

var AnyOfSchema = (function (_CompositeSchema) {
  _inherits(AnyOfSchema, _CompositeSchema);

  function AnyOfSchema(schema, parent) {
    _classCallCheck(this, AnyOfSchema);

    _get(Object.getPrototypeOf(AnyOfSchema.prototype), 'constructor', this).call(this, schema, parent, 'anyOf');
  }

  _createClass(AnyOfSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitAnyOfSchema(this, parameter);
    }
  }]);

  return AnyOfSchema;
})(CompositeSchema);

exports.AnyOfSchema = AnyOfSchema;

var AllOfSchema = (function (_CompositeSchema2) {
  _inherits(AllOfSchema, _CompositeSchema2);

  function AllOfSchema(schema, parent) {
    _classCallCheck(this, AllOfSchema);

    _get(Object.getPrototypeOf(AllOfSchema.prototype), 'constructor', this).call(this, schema, parent, 'allOf');
  }

  _createClass(AllOfSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitAllOfSchema(this, parameter);
    }
  }]);

  return AllOfSchema;
})(CompositeSchema);

exports.AllOfSchema = AllOfSchema;

var OneOfSchema = (function (_CompositeSchema3) {
  _inherits(OneOfSchema, _CompositeSchema3);

  function OneOfSchema(schema, parent) {
    _classCallCheck(this, OneOfSchema);

    _get(Object.getPrototypeOf(OneOfSchema.prototype), 'constructor', this).call(this, schema, parent, 'oneOf');
  }

  _createClass(OneOfSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitOneOfSchema(this, parameter);
    }
  }]);

  return OneOfSchema;
})(CompositeSchema);

exports.OneOfSchema = OneOfSchema;

var NullSchema = (function (_BaseSchema5) {
  _inherits(NullSchema, _BaseSchema5);

  function NullSchema(schema, parent) {
    _classCallCheck(this, NullSchema);

    _get(Object.getPrototypeOf(NullSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.defaultValue = null;
    this.displayType = 'null';
  }

  _createClass(NullSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitNullSchema(this, parameter);
    }
  }]);

  return NullSchema;
})(BaseSchema);

exports.NullSchema = NullSchema;

var StringSchema = (function (_BaseSchema6) {
  _inherits(StringSchema, _BaseSchema6);

  function StringSchema(schema, parent) {
    _classCallCheck(this, StringSchema);

    _get(Object.getPrototypeOf(StringSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.displayType = 'string';
    this.defaultValue = this.defaultValue || '';
  }

  _createClass(StringSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitStringSchema(this, parameter);
    }
  }]);

  return StringSchema;
})(BaseSchema);

exports.StringSchema = StringSchema;

var NumberSchema = (function (_BaseSchema7) {
  _inherits(NumberSchema, _BaseSchema7);

  function NumberSchema(schema, parent) {
    _classCallCheck(this, NumberSchema);

    _get(Object.getPrototypeOf(NumberSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.displayType = 'number';
    this.defaultValue = this.defaultValue || 0;
  }

  _createClass(NumberSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitNumberSchema(this, parameter);
    }
  }]);

  return NumberSchema;
})(BaseSchema);

exports.NumberSchema = NumberSchema;

var BooleanSchema = (function (_BaseSchema8) {
  _inherits(BooleanSchema, _BaseSchema8);

  function BooleanSchema(schema, parent) {
    _classCallCheck(this, BooleanSchema);

    _get(Object.getPrototypeOf(BooleanSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.displayType = 'boolean';
    this.defaultValue = this.defaultValue || false;
  }

  _createClass(BooleanSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitBooleanSchema(this, parameter);
    }
  }]);

  return BooleanSchema;
})(BaseSchema);

exports.BooleanSchema = BooleanSchema;

var AnySchema = (function (_BaseSchema9) {
  _inherits(AnySchema, _BaseSchema9);

  function AnySchema(schema, parent) {
    _classCallCheck(this, AnySchema);

    _get(Object.getPrototypeOf(AnySchema.prototype), 'constructor', this).call(this, schema, parent);
    this.displayType = 'any';
    this.defaultValue = null;
  }

  _createClass(AnySchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitAnySchema(this, parameter);
    }
  }]);

  return AnySchema;
})(BaseSchema);

exports.AnySchema = AnySchema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvanNvbi1zY2hlbWEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsrQkFFeUoscUJBQXFCOzswQkFDN0osYUFBYTs7OztBQUg5QixXQUFXLENBQUE7O0FBS0osSUFBTSxJQUFJLEdBQUcsU0FBUCxJQUFJLENBQUksTUFBTSxFQUFvQjtNQUFsQixNQUFNLHlEQUFHLElBQUk7O0FBQ3hDLFVBQVEsaUNBQVcsTUFBTSxDQUFDO0FBQ3hCO0FBQWtCLGFBQU8sSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQUEsQUFDeEQ7QUFBa0IsYUFBTyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFBQSxBQUN4RDtBQUFpQixhQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUFBLEFBQ3ZEO0FBQW1CLGFBQU8sSUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQUEsQUFDM0Q7QUFBZ0IsYUFBTyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFBQSxBQUNyRDtBQUFnQixhQUFPLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUFBLEFBQ3JEO0FBQWtCLGFBQU8sSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQUEsQUFDekQ7QUFBa0IsYUFBTyxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFBQSxBQUN6RDtBQUFrQixhQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUFBLEFBQ3hEO0FBQWtCLGFBQU8sSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0s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QUMsQ0FBQTtLQUMvQzs7O1NBVFUsU0FBUztHQUFTLFVBQVUiLCJmaWxlIjoiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9qc29uLXNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IHNjaGVtYVR5cGUsIEFMTF9PRl9UWVBFLCBBTllfT0ZfVFlQRSwgQVJSQVlfVFlQRSwgQk9PTEVBTl9UWVBFLCBFTlVNX1RZUEUsIE5VTExfVFlQRSwgTlVNQkVSX1RZUEUsIE9CSkVDVF9UWVBFLCBPTkVfT0ZfVFlQRSwgU1RSSU5HX1RZUEUgfSBmcm9tICcuL2pzb24tc2NoZW1hLXR5cGVzJ1xuaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoL3VuaXEnXG5cbmV4cG9ydCBjb25zdCB3cmFwID0gKHNjaGVtYSwgcGFyZW50ID0gbnVsbCkgPT4ge1xuICBzd2l0Y2ggKHNjaGVtYVR5cGUoc2NoZW1hKSkge1xuICAgIGNhc2UgQUxMX09GX1RZUEU6IHJldHVybiBuZXcgQWxsT2ZTY2hlbWEoc2NoZW1hLCBwYXJlbnQpXG4gICAgY2FzZSBBTllfT0ZfVFlQRTogcmV0dXJuIG5ldyBBbnlPZlNjaGVtYShzY2hlbWEsIHBhcmVudClcbiAgICBjYXNlIEFSUkFZX1RZUEU6IHJldHVybiBuZXcgQXJyYXlTY2hlbWEoc2NoZW1hLCBwYXJlbnQpXG4gICAgY2FzZSBCT09MRUFOX1RZUEU6IHJldHVybiBuZXcgQm9vbGVhblNjaGVtYShzY2hlbWEsIHBhcmVudClcbiAgICBjYXNlIEVOVU1fVFlQRTogcmV0dXJuIG5ldyBFbnVtU2NoZW1hKHNjaGVtYSwgcGFyZW50KVxuICAgIGNhc2UgTlVMTF9UWVBFOiByZXR1cm4gbmV3IE51bGxTY2hlbWEoc2NoZW1hLCBwYXJlbnQpXG4gICAgY2FzZSBOVU1CRVJfVFlQRTogcmV0dXJuIG5ldyBOdW1iZXJTY2hlbWEoc2NoZW1hLCBwYXJlbnQpXG4gICAgY2FzZSBPQkpFQ1RfVFlQRTogcmV0dXJuIG5ldyBPYmplY3RTY2hlbWEoc2NoZW1hLCBwYXJlbnQpXG4gICAgY2FzZSBPTkVfT0ZfVFlQRTogcmV0dXJuIG5ldyBPbmVPZlNjaGVtYShzY2hlbWEsIHBhcmVudClcbiAgICBjYXNlIFNUUklOR19UWVBFOiByZXR1cm4gbmV3IFN0cmluZ1NjaGVtYShzY2hlbWEsIHBhcmVudClcbiAgICBkZWZhdWx0OiByZXR1cm4gbmV3IEFueVNjaGVtYSh7fSwgcGFyZW50KVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCYXNlU2NoZW1hIHtcbiAgY29uc3RydWN0b3Ioc2NoZW1hLCBwYXJlbnQpIHtcbiAgICB0aGlzLnNjaGVtYSA9IHNjaGVtYVxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuc2NoZW1hLmRlc2NyaXB0aW9uXG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSB0aGlzLnNjaGVtYVsnZGVmYXVsdCddXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBhdHRlcm5Qcm9wZXJ0eSB7XG4gIGNvbnN0cnVjdG9yKHBhdHRlcm4sIHNjaGVtYSkge1xuICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm5cbiAgICB0aGlzLnNjaGVtYSA9IHNjaGVtYVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPYmplY3RTY2hlbWEgZXh0ZW5kcyBCYXNlU2NoZW1hIHtcbiAgY29uc3RydWN0b3Ioc2NoZW1hLCBwYXJlbnQpIHtcbiAgICBzdXBlcihzY2hlbWEsIHBhcmVudClcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5zY2hlbWEucHJvcGVydGllcyB8fCB7fVxuICAgIHRoaXMua2V5cyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpXG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gdGhpcy5rZXlzLnJlZHVjZSgob2JqZWN0LCBrZXkpID0+IHtcbiAgICAgIG9iamVjdFtrZXldID0gd3JhcChwcm9wZXJ0aWVzW2tleV0sIHRoaXMpXG4gICAgICByZXR1cm4gb2JqZWN0XG4gICAgfSwge30pXG4gICAgdGhpcy5wYXR0ZXJuUHJvcGVydGllcyA9IE9iamVjdC5rZXlzKHRoaXMuc2NoZW1hLnBhdHRlcm5Qcm9wZXJ0aWVzIHx8IHt9KVxuICAgICAgLm1hcChrZXkgPT4gW2tleSwgdGhpcy5zY2hlbWEucGF0dGVyblByb3BlcnRpZXNba2V5XV0pXG4gICAgICAubWFwKChbcGF0dGVybiwgcmF3U2NoZW1hXSkgPT4gbmV3IFBhdHRlcm5Qcm9wZXJ0eShuZXcgUmVnRXhwKHBhdHRlcm4sICdnJyksIHdyYXAocmF3U2NoZW1hLCB0aGlzKSkpXG4gICAgdGhpcy5kaXNwbGF5VHlwZSA9ICdvYmplY3QnXG4gIH1cblxuICBhY2NlcHQodmlzaXRvciwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRPYmplY3RTY2hlbWEodGhpcywgcGFyYW1ldGVyKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJheVNjaGVtYSBleHRlbmRzIEJhc2VTY2hlbWEge1xuICBjb25zdHJ1Y3RvcihzY2hlbWEsIHBhcmVudCkge1xuICAgIHN1cGVyKHNjaGVtYSwgcGFyZW50KVxuICAgIHRoaXMuaXRlbVNjaGVtYSA9IHdyYXAodGhpcy5zY2hlbWEuaXRlbXMsIHRoaXMpXG4gICAgdGhpcy51bmlxdWUgPSBCb29sZWFuKHRoaXMuc2NoZW1hLnVuaXF1ZUl0ZW1zIHx8IGZhbHNlKVxuICAgIGNvbnN0IGl0ZW1EaXNwbGF5VHlwZSA9IHRoaXMuaXRlbVNjaGVtYSAmJiB0aGlzLml0ZW1TY2hlbWEuZGlzcGxheVR5cGUgPyB0aGlzLml0ZW1TY2hlbWEuZGlzcGxheVR5cGUgOiAnYW55J1xuICAgIHRoaXMuZGlzcGxheVR5cGUgPSB1bmlxKGl0ZW1EaXNwbGF5VHlwZS5zcGxpdCgnfCcpLm1hcCh0ID0+IGAke3QudHJpbSgpfVtdYCkpLmpvaW4oJyB8ICcpXG4gIH1cblxuICBhY2NlcHQodmlzaXRvciwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBcnJheVNjaGVtYSh0aGlzLCBwYXJhbWV0ZXIpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVudW1TY2hlbWEgZXh0ZW5kcyBCYXNlU2NoZW1hIHtcbiAgY29uc3RydWN0b3Ioc2NoZW1hLCBwYXJlbnQpIHtcbiAgICBzdXBlcihzY2hlbWEsIHBhcmVudClcbiAgICB0aGlzLnZhbHVlcyA9IHRoaXMuc2NoZW1hLmVudW1cbiAgICB0aGlzLmRpc3BsYXlUeXBlID0gJ2VudW0nXG4gIH1cblxuICBhY2NlcHQodmlzaXRvciwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbnVtU2NoZW1hKHRoaXMsIHBhcmFtZXRlcilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcG9zaXRlU2NoZW1hIGV4dGVuZHMgQmFzZVNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHNjaGVtYSwgcGFyZW50LCBrZXlXb3JkKSB7XG4gICAgc3VwZXIoc2NoZW1hLCBwYXJlbnQpXG4gICAgdGhpcy5zY2hlbWFzID0gc2NoZW1hW2tleVdvcmRdLm1hcChzID0+IHdyYXAocywgdGhpcykpXG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBudWxsXG4gICAgdGhpcy5kaXNwbGF5VHlwZSA9IHVuaXEodGhpcy5zY2hlbWFzLm1hcChzID0+IHMuZGlzcGxheVR5cGUpKS5qb2luKCcgfCAnKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBbnlPZlNjaGVtYSBleHRlbmRzIENvbXBvc2l0ZVNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHNjaGVtYSwgcGFyZW50KSB7XG4gICAgc3VwZXIoc2NoZW1hLCBwYXJlbnQsICdhbnlPZicpXG4gIH1cblxuICBhY2NlcHQodmlzaXRvciwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBbnlPZlNjaGVtYSh0aGlzLCBwYXJhbWV0ZXIpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFsbE9mU2NoZW1hIGV4dGVuZHMgQ29tcG9zaXRlU2NoZW1hIHtcbiAgY29uc3RydWN0b3Ioc2NoZW1hLCBwYXJlbnQpIHtcbiAgICBzdXBlcihzY2hlbWEsIHBhcmVudCwgJ2FsbE9mJylcbiAgfVxuXG4gIGFjY2VwdCh2aXNpdG9yLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEFsbE9mU2NoZW1hKHRoaXMsIHBhcmFtZXRlcilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgT25lT2ZTY2hlbWEgZXh0ZW5kcyBDb21wb3NpdGVTY2hlbWEge1xuICBjb25zdHJ1Y3RvcihzY2hlbWEsIHBhcmVudCkge1xuICAgIHN1cGVyKHNjaGVtYSwgcGFyZW50LCAnb25lT2YnKVxuICB9XG5cbiAgYWNjZXB0KHZpc2l0b3IsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0T25lT2ZTY2hlbWEodGhpcywgcGFyYW1ldGVyKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOdWxsU2NoZW1hIGV4dGVuZHMgQmFzZVNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHNjaGVtYSwgcGFyZW50KSB7XG4gICAgc3VwZXIoc2NoZW1hLCBwYXJlbnQpXG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBudWxsXG4gICAgdGhpcy5kaXNwbGF5VHlwZSA9ICdudWxsJ1xuICB9XG5cbiAgYWNjZXB0KHZpc2l0b3IsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TnVsbFNjaGVtYSh0aGlzLCBwYXJhbWV0ZXIpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cmluZ1NjaGVtYSBleHRlbmRzIEJhc2VTY2hlbWEge1xuICBjb25zdHJ1Y3RvcihzY2hlbWEsIHBhcmVudCkge1xuICAgIHN1cGVyKHNjaGVtYSwgcGFyZW50KVxuICAgIHRoaXMuZGlzcGxheVR5cGUgPSAnc3RyaW5nJ1xuICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gdGhpcy5kZWZhdWx0VmFsdWUgfHwgJydcbiAgfVxuXG4gIGFjY2VwdCh2aXNpdG9yLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFN0cmluZ1NjaGVtYSh0aGlzLCBwYXJhbWV0ZXIpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bWJlclNjaGVtYSBleHRlbmRzIEJhc2VTY2hlbWEge1xuICBjb25zdHJ1Y3RvcihzY2hlbWEsIHBhcmVudCkge1xuICAgIHN1cGVyKHNjaGVtYSwgcGFyZW50KVxuICAgIHRoaXMuZGlzcGxheVR5cGUgPSAnbnVtYmVyJ1xuICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gdGhpcy5kZWZhdWx0VmFsdWUgfHwgMFxuICB9XG5cbiAgYWNjZXB0KHZpc2l0b3IsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TnVtYmVyU2NoZW1hKHRoaXMsIHBhcmFtZXRlcilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQm9vbGVhblNjaGVtYSBleHRlbmRzIEJhc2VTY2hlbWEge1xuICBjb25zdHJ1Y3RvcihzY2hlbWEsIHBhcmVudCkge1xuICAgIHN1cGVyKHNjaGVtYSwgcGFyZW50KVxuICAgIHRoaXMuZGlzcGxheVR5cGUgPSAnYm9vbGVhbidcbiAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IHRoaXMuZGVmYXVsdFZhbHVlIHx8IGZhbHNlXG4gIH1cblxuICBhY2NlcHQodmlzaXRvciwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRCb29sZWFuU2NoZW1hKHRoaXMsIHBhcmFtZXRlcilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQW55U2NoZW1hIGV4dGVuZHMgQmFzZVNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHNjaGVtYSwgcGFyZW50KSB7XG4gICAgc3VwZXIoc2NoZW1hLCBwYXJlbnQpXG4gICAgdGhpcy5kaXNwbGF5VHlwZSA9ICdhbnknXG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBudWxsXG4gIH1cblxuICBhY2NlcHQodmlzaXRvciwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBbnlTY2hlbWEodGhpcywgcGFyYW1ldGVyKVxuICB9XG59XG4iXX0=