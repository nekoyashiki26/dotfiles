Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.path = path;
exports.request = request;
exports.and = and;
exports.or = or;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashIsNumber = require('lodash/isNumber');

var _lodashIsNumber2 = _interopRequireDefault(_lodashIsNumber);

var _lodashIsString = require('lodash/isString');

var _lodashIsString2 = _interopRequireDefault(_lodashIsString);

var _lodashIsArray = require('lodash/isArray');

var _lodashIsArray2 = _interopRequireDefault(_lodashIsArray);

'use babel';

var IndexMatcher = (function () {
  function IndexMatcher(index) {
    _classCallCheck(this, IndexMatcher);

    this.index = index;
  }

  _createClass(IndexMatcher, [{
    key: 'matches',
    value: function matches(segment) {
      return (0, _lodashIsNumber2['default'])(segment) && this.index === segment;
    }
  }]);

  return IndexMatcher;
})();

var KeyMatcher = (function () {
  function KeyMatcher(key) {
    _classCallCheck(this, KeyMatcher);

    this.key = key;
  }

  _createClass(KeyMatcher, [{
    key: 'matches',
    value: function matches(segment) {
      return (0, _lodashIsString2['default'])(segment) && this.key === segment;
    }
  }]);

  return KeyMatcher;
})();

var AnyIndexMatcher = {
  matches: function matches(segment) {
    return (0, _lodashIsNumber2['default'])(segment);
  }
};

var AnyKeyMatcher = {
  matches: function matches(segment) {
    return (0, _lodashIsString2['default'])(segment);
  }
};

var AnyMatcher = {
  matches: function matches() {
    return true;
  }
};

var JsonPathMatcher = (function () {
  function JsonPathMatcher() {
    var matchers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, JsonPathMatcher);

    this.matchers = matchers;
  }

  _createClass(JsonPathMatcher, [{
    key: 'index',
    value: function index(value) {
      var matcher = null;
      if (value === undefined) {
        matcher = AnyIndexMatcher;
      } else {
        matcher = (0, _lodashIsArray2['default'])(value) ? new OrMatcher(value.map(function (v) {
          return new IndexMatcher(v);
        })) : new IndexMatcher(value);
      }
      return new JsonPathMatcher(this.matchers.concat([matcher]));
    }
  }, {
    key: 'key',
    value: function key(value) {
      var matcher = null;
      if (value === undefined) {
        matcher = AnyKeyMatcher;
      } else {
        matcher = (0, _lodashIsArray2['default'])(value) ? new OrMatcher(value.map(function (v) {
          return new KeyMatcher(v);
        })) : new KeyMatcher(value);
      }
      return new JsonPathMatcher(this.matchers.concat([matcher]));
    }
  }, {
    key: 'any',
    value: function any() {
      return new JsonPathMatcher(this.matchers.concat([AnyMatcher]));
    }
  }, {
    key: 'matches',
    value: function matches(segments) {
      if (segments.length !== this.matchers.length) {
        return false;
      }

      for (var i = 0; i < this.matchers.length; ++i) {
        if (!this.matchers[i].matches(segments[i])) {
          return false;
        }
      }

      return true;
    }
  }]);

  return JsonPathMatcher;
})();

var PathRequestMatcher = (function () {
  function PathRequestMatcher(matcher) {
    _classCallCheck(this, PathRequestMatcher);

    this.matcher = matcher;
  }

  _createClass(PathRequestMatcher, [{
    key: 'matches',
    value: function matches(_ref) {
      var segments = _ref.segments;

      return Boolean(segments) && this.matcher.matches(segments);
    }
  }]);

  return PathRequestMatcher;
})();

var KeyRequestMatcher = {
  matches: function matches(_ref2) {
    var isKeyPosition = _ref2.isKeyPosition;

    return isKeyPosition;
  }
};

var ValueRequestMatcher = {
  matches: function matches(_ref3) {
    var isValuePosition = _ref3.isValuePosition;

    return isValuePosition;
  }
};

var RequestMatcher = (function () {
  function RequestMatcher() {
    var matchers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, RequestMatcher);

    this.matchers = matchers;
  }

  _createClass(RequestMatcher, [{
    key: 'path',
    value: function path(matcher) {
      return new RequestMatcher(this.matchers.concat([new PathRequestMatcher(matcher)]));
    }
  }, {
    key: 'value',
    value: function value() {
      return new RequestMatcher(this.matchers.concat([ValueRequestMatcher]));
    }
  }, {
    key: 'key',
    value: function key() {
      return new RequestMatcher(this.matchers.concat([KeyRequestMatcher]));
    }
  }, {
    key: 'matches',
    value: function matches(req) {
      return this.matchers.every(function (matcher) {
        return matcher.matches(req);
      });
    }
  }]);

  return RequestMatcher;
})();

var CompositeMatcher = (function () {
  function CompositeMatcher() {
    var matchers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, CompositeMatcher);

    this.matchers = matchers;
  }

  _createClass(CompositeMatcher, [{
    key: 'append',
    value: function append(matcher) {
      return this.createCompositeMatcher(this.matchers.concat([matcher]));
    }
  }, {
    key: 'prepend',
    value: function prepend(matcher) {
      return this.createCompositeMatcher([matcher].concat(this.matchers));
    }
  }]);

  return CompositeMatcher;
})();

var AndMatcher = (function (_CompositeMatcher) {
  _inherits(AndMatcher, _CompositeMatcher);

  function AndMatcher() {
    var matchers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, AndMatcher);

    _get(Object.getPrototypeOf(AndMatcher.prototype), 'constructor', this).call(this, matchers);
  }

  _createClass(AndMatcher, [{
    key: 'createCompositeMatcher',
    value: function createCompositeMatcher(matchers) {
      return new AndMatcher(matchers);
    }
  }, {
    key: 'matches',
    value: function matches(input) {
      return this.matchers.every(function (matcher) {
        return matcher.matches(input);
      });
    }
  }]);

  return AndMatcher;
})(CompositeMatcher);

var OrMatcher = (function (_CompositeMatcher2) {
  _inherits(OrMatcher, _CompositeMatcher2);

  function OrMatcher() {
    var matchers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, OrMatcher);

    _get(Object.getPrototypeOf(OrMatcher.prototype), 'constructor', this).call(this, matchers);
  }

  _createClass(OrMatcher, [{
    key: 'createCompositeMatcher',
    value: function createCompositeMatcher(matchers) {
      return new OrMatcher(matchers);
    }
  }, {
    key: 'matches',
    value: function matches(input) {
      return this.matchers.some(function (matcher) {
        return matcher.matches(input);
      });
    }
  }]);

  return OrMatcher;
})(CompositeMatcher);

function path() {
  return new JsonPathMatcher();
}

function request() {
  return new RequestMatcher();
}

function and() {
  for (var _len = arguments.length, matchers = Array(_len), _key = 0; _key < _len; _key++) {
    matchers[_key] = arguments[_key];
  }

  return new AndMatcher(matchers);
}

function or() {
  for (var _len2 = arguments.length, matchers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    matchers[_key2] = arguments[_key2];
  }

  return new OrMatcher(matchers);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvbWF0Y2hlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFFcUIsaUJBQWlCOzs7OzhCQUNqQixpQkFBaUI7Ozs7NkJBQ2xCLGdCQUFnQjs7OztBQUpwQyxXQUFXLENBQUE7O0lBTUwsWUFBWTtBQUNMLFdBRFAsWUFBWSxDQUNKLEtBQUssRUFBRTswQkFEZixZQUFZOztBQUVkLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0dBQ25COztlQUhHLFlBQVk7O1dBS1QsaUJBQUMsT0FBTyxFQUFFO0FBQ2YsYUFBTyxpQ0FBUyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLE9BQU8sQ0FBQTtLQUNuRDs7O1NBUEcsWUFBWTs7O0lBVVosVUFBVTtBQUNILFdBRFAsVUFBVSxDQUNGLEdBQUcsRUFBRTswQkFEYixVQUFVOztBQUVaLFFBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO0dBQ2Y7O2VBSEcsVUFBVTs7V0FLUCxpQkFBQyxPQUFPLEVBQUU7QUFDZixhQUFPLGlDQUFTLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssT0FBTyxDQUFBO0tBQ2pEOzs7U0FQRyxVQUFVOzs7QUFVaEIsSUFBTSxlQUFlLEdBQUc7QUFDdEIsU0FBTyxFQUFBLGlCQUFDLE9BQU8sRUFBRTtBQUNmLFdBQU8saUNBQVMsT0FBTyxDQUFDLENBQUE7R0FDekI7Q0FDRixDQUFBOztBQUVELElBQU0sYUFBYSxHQUFHO0FBQ3BCLFNBQU8sRUFBQSxpQkFBQyxPQUFPLEVBQUU7QUFDZixXQUFPLGlDQUFTLE9BQU8sQ0FBQyxDQUFBO0dBQ3pCO0NBQ0YsQ0FBQTs7QUFFRCxJQUFNLFVBQVUsR0FBRztBQUNqQixTQUFPLEVBQUEsbUJBQUc7QUFDUixXQUFPLElBQUksQ0FBQTtHQUNa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QU8sSUFBSSxlQUFlLEVBQUUsQ0FBQTtDQUM3Qjs7QUFFTSxTQUFTLE9BQU8sR0FBRztBQUN4QixTQUFPLElBQUksY0FBYyxFQUFFLENBQUE7Q0FDNUI7O0FBRU0sU0FBUyxHQUFHLEdBQWM7b0NBQVYsUUFBUTtBQUFSLFlBQVE7OztBQUM3QixTQUFPLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0NBQ2hDOztBQUVNLFNBQVMsRUFBRSxHQUFjO3FDQUFWLFFBQVE7QUFBUixZQUFROzs7QUFDNUIsU0FBTyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtDQUMvQiIsImZpbGUiOiIvaG9tZS95b3NoaW5vcml5YW1hZ3VjaGkvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL21hdGNoZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGlzTnVtYmVyIGZyb20gJ2xvZGFzaC9pc051bWJlcidcbmltcG9ydCBpc1N0cmluZyBmcm9tICdsb2Rhc2gvaXNTdHJpbmcnXG5pbXBvcnQgaXNBcnJheSBmcm9tICdsb2Rhc2gvaXNBcnJheSdcblxuY2xhc3MgSW5kZXhNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IoaW5kZXgpIHtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXhcbiAgfVxuXG4gIG1hdGNoZXMoc2VnbWVudCkge1xuICAgIHJldHVybiBpc051bWJlcihzZWdtZW50KSAmJiB0aGlzLmluZGV4ID09PSBzZWdtZW50XG4gIH1cbn1cblxuY2xhc3MgS2V5TWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKGtleSkge1xuICAgIHRoaXMua2V5ID0ga2V5XG4gIH1cblxuICBtYXRjaGVzKHNlZ21lbnQpIHtcbiAgICByZXR1cm4gaXNTdHJpbmcoc2VnbWVudCkgJiYgdGhpcy5rZXkgPT09IHNlZ21lbnRcbiAgfVxufVxuXG5jb25zdCBBbnlJbmRleE1hdGNoZXIgPSB7XG4gIG1hdGNoZXMoc2VnbWVudCkge1xuICAgIHJldHVybiBpc051bWJlcihzZWdtZW50KVxuICB9XG59XG5cbmNvbnN0IEFueUtleU1hdGNoZXIgPSB7XG4gIG1hdGNoZXMoc2VnbWVudCkge1xuICAgIHJldHVybiBpc1N0cmluZyhzZWdtZW50KVxuICB9XG59XG5cbmNvbnN0IEFueU1hdGNoZXIgPSB7XG4gIG1hdGNoZXMoKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxufVxuXG5jbGFzcyBKc29uUGF0aE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvcihtYXRjaGVycyA9IFtdKSB7XG4gICAgdGhpcy5tYXRjaGVycyA9IG1hdGNoZXJzXG4gIH1cblxuICBpbmRleCh2YWx1ZSkge1xuICAgIGxldCBtYXRjaGVyID0gbnVsbFxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBtYXRjaGVyID0gQW55SW5kZXhNYXRjaGVyXG4gICAgfSBlbHNlIHtcbiAgICAgIG1hdGNoZXIgPSBpc0FycmF5KHZhbHVlKVxuICAgICAgICA/IG5ldyBPck1hdGNoZXIodmFsdWUubWFwKHYgPT4gbmV3IEluZGV4TWF0Y2hlcih2KSkpXG4gICAgICAgIDogbmV3IEluZGV4TWF0Y2hlcih2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBKc29uUGF0aE1hdGNoZXIodGhpcy5tYXRjaGVycy5jb25jYXQoW21hdGNoZXJdKSlcbiAgfVxuXG4gIGtleSh2YWx1ZSkge1xuICAgIGxldCBtYXRjaGVyID0gbnVsbFxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBtYXRjaGVyID0gQW55S2V5TWF0Y2hlclxuICAgIH0gZWxzZSB7XG4gICAgICBtYXRjaGVyID0gaXNBcnJheSh2YWx1ZSlcbiAgICAgICAgPyBuZXcgT3JNYXRjaGVyKHZhbHVlLm1hcCh2ID0+IG5ldyBLZXlNYXRjaGVyKHYpKSlcbiAgICAgICAgOiBuZXcgS2V5TWF0Y2hlcih2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBKc29uUGF0aE1hdGNoZXIodGhpcy5tYXRjaGVycy5jb25jYXQoW21hdGNoZXJdKSlcbiAgfVxuXG4gIGFueSgpIHtcbiAgICByZXR1cm4gbmV3IEpzb25QYXRoTWF0Y2hlcih0aGlzLm1hdGNoZXJzLmNvbmNhdChbQW55TWF0Y2hlcl0pKVxuICB9XG5cbiAgbWF0Y2hlcyhzZWdtZW50cykge1xuICAgIGlmIChzZWdtZW50cy5sZW5ndGggIT09IHRoaXMubWF0Y2hlcnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWF0Y2hlcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmICghdGhpcy5tYXRjaGVyc1tpXS5tYXRjaGVzKHNlZ21lbnRzW2ldKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG5cbmNsYXNzIFBhdGhSZXF1ZXN0TWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKG1hdGNoZXIpIHtcbiAgICB0aGlzLm1hdGNoZXIgPSBtYXRjaGVyXG4gIH1cblxuICBtYXRjaGVzKHtzZWdtZW50c30pIHtcbiAgICByZXR1cm4gQm9vbGVhbihzZWdtZW50cykgJiYgdGhpcy5tYXRjaGVyLm1hdGNoZXMoc2VnbWVudHMpXG4gIH1cbn1cblxuY29uc3QgS2V5UmVxdWVzdE1hdGNoZXIgPSB7XG4gIG1hdGNoZXMoe2lzS2V5UG9zaXRpb259KSB7XG4gICAgcmV0dXJuIGlzS2V5UG9zaXRpb25cbiAgfVxufVxuXG5jb25zdCBWYWx1ZVJlcXVlc3RNYXRjaGVyID0ge1xuICBtYXRjaGVzKHtpc1ZhbHVlUG9zaXRpb259KSB7XG4gICAgcmV0dXJuIGlzVmFsdWVQb3NpdGlvblxuICB9XG59XG5cbmNsYXNzIFJlcXVlc3RNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IobWF0Y2hlcnMgPSBbXSkge1xuICAgIHRoaXMubWF0Y2hlcnMgPSBtYXRjaGVyc1xuICB9XG5cbiAgcGF0aChtYXRjaGVyKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0TWF0Y2hlcih0aGlzLm1hdGNoZXJzLmNvbmNhdChbbmV3IFBhdGhSZXF1ZXN0TWF0Y2hlcihtYXRjaGVyKV0pKVxuICB9XG5cbiAgdmFsdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0TWF0Y2hlcih0aGlzLm1hdGNoZXJzLmNvbmNhdChbVmFsdWVSZXF1ZXN0TWF0Y2hlcl0pKVxuICB9XG5cbiAga2V5KCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdE1hdGNoZXIodGhpcy5tYXRjaGVycy5jb25jYXQoW0tleVJlcXVlc3RNYXRjaGVyXSkpXG4gIH1cblxuICBtYXRjaGVzKHJlcSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXJzLmV2ZXJ5KG1hdGNoZXIgPT4gbWF0Y2hlci5tYXRjaGVzKHJlcSkpXG4gIH1cbn1cblxuY2xhc3MgQ29tcG9zaXRlTWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKG1hdGNoZXJzID0gW10pIHtcbiAgICB0aGlzLm1hdGNoZXJzID0gbWF0Y2hlcnNcbiAgfVxuXG4gIGFwcGVuZChtYXRjaGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlQ29tcG9zaXRlTWF0Y2hlcih0aGlzLm1hdGNoZXJzLmNvbmNhdChbbWF0Y2hlcl0pKVxuICB9XG5cbiAgcHJlcGVuZChtYXRjaGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlQ29tcG9zaXRlTWF0Y2hlcihbbWF0Y2hlcl0uY29uY2F0KHRoaXMubWF0Y2hlcnMpKVxuICB9XG59XG5cblxuY2xhc3MgQW5kTWF0Y2hlciBleHRlbmRzIENvbXBvc2l0ZU1hdGNoZXIge1xuICBjb25zdHJ1Y3RvcihtYXRjaGVycyA9IFtdKSB7XG4gICAgc3VwZXIobWF0Y2hlcnMpXG4gIH1cblxuICBjcmVhdGVDb21wb3NpdGVNYXRjaGVyKG1hdGNoZXJzKSB7XG4gICAgcmV0dXJuIG5ldyBBbmRNYXRjaGVyKG1hdGNoZXJzKVxuICB9XG5cbiAgbWF0Y2hlcyhpbnB1dCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXJzLmV2ZXJ5KG1hdGNoZXIgPT4gbWF0Y2hlci5tYXRjaGVzKGlucHV0KSlcbiAgfVxufVxuXG5jbGFzcyBPck1hdGNoZXIgZXh0ZW5kcyBDb21wb3NpdGVNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IobWF0Y2hlcnMgPSBbXSkge1xuICAgIHN1cGVyKG1hdGNoZXJzKVxuICB9XG5cbiAgY3JlYXRlQ29tcG9zaXRlTWF0Y2hlcihtYXRjaGVycykge1xuICAgIHJldHVybiBuZXcgT3JNYXRjaGVyKG1hdGNoZXJzKVxuICB9XG5cbiAgbWF0Y2hlcyhpbnB1dCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXJzLnNvbWUobWF0Y2hlciA9PiBtYXRjaGVyLm1hdGNoZXMoaW5wdXQpKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRoKCkge1xuICByZXR1cm4gbmV3IEpzb25QYXRoTWF0Y2hlcigpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0KCkge1xuICByZXR1cm4gbmV3IFJlcXVlc3RNYXRjaGVyKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFuZCguLi5tYXRjaGVycykge1xuICByZXR1cm4gbmV3IEFuZE1hdGNoZXIobWF0Y2hlcnMpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvciguLi5tYXRjaGVycykge1xuICByZXR1cm4gbmV3IE9yTWF0Y2hlcihtYXRjaGVycylcbn1cbiJdfQ==