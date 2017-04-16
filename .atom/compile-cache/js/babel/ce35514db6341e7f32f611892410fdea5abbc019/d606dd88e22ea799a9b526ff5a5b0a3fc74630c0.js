Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.resolveObject = resolveObject;
exports.matches = matches;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashIsObject = require('lodash/isObject');

var _lodashIsObject2 = _interopRequireDefault(_lodashIsObject);

var _lodashIsArray = require('lodash/isArray');

var _lodashIsArray2 = _interopRequireDefault(_lodashIsArray);

var _lodashIsUndefined = require('lodash/isUndefined');

var _lodashIsUndefined2 = _interopRequireDefault(_lodashIsUndefined);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

'use babel';

var ArrayTraverser = (function () {
  function ArrayTraverser() {
    var array = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var index = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];

    _classCallCheck(this, ArrayTraverser);

    this.array = array;
    this.index = index;
  }

  _createClass(ArrayTraverser, [{
    key: 'current',
    value: function current() {
      return this.array[this.index];
    }
  }, {
    key: 'next',
    value: function next() {
      if (!this.hasNext()) {
        throw new Error('no next element at ' + (this.index + 1));
      }
      this.index += 1;
      return this.array[this.index];
    }
  }, {
    key: 'peekNext',
    value: function peekNext(defaultValue) {
      return this.hasNext() ? this.array[this.index + 1] : defaultValue;
    }
  }, {
    key: 'peekPrevious',
    value: function peekPrevious(defaultValue) {
      return this.hasPrevious() ? this.array[this.index - 1] : defaultValue;
    }
  }, {
    key: 'previous',
    value: function previous() {
      if (!this.hasPrevious()) {
        throw new Error('no previous element at ' + this.index);
      }
      this.index -= 1;
      return this.array[this.index];
    }
  }, {
    key: 'hasNext',
    value: function hasNext() {
      return this.index + 1 < this.array.length;
    }
  }, {
    key: 'hasPrevious',
    value: function hasPrevious() {
      return this.index - 1 >= 0 && this.array.length !== 0;
    }
  }]);

  return ArrayTraverser;
})();

exports.ArrayTraverser = ArrayTraverser;

var PositionInfo = (function () {
  function PositionInfo() {
    var segments = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var keyPosition = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var valuePosition = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var previousToken = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
    var editedToken = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
    var nextToken = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

    _classCallCheck(this, PositionInfo);

    this.segments = segments;
    this.keyPosition = keyPosition;
    this.valuePosition = valuePosition;
    this.previousToken = previousToken;
    this.editedToken = editedToken;
    this.nextToken = nextToken;
  }

  _createClass(PositionInfo, [{
    key: 'setKeyPosition',
    value: function setKeyPosition() {
      return new PositionInfo(this.segments, true, false, this.previousToken, this.editedToken, this.nextToken);
    }
  }, {
    key: 'setValuePosition',
    value: function setValuePosition() {
      return new PositionInfo(this.segments, false, true, this.previousToken, this.editedToken, this.nextToken);
    }
  }, {
    key: 'setPreviousToken',
    value: function setPreviousToken(token) {
      return new PositionInfo(this.segments, this.keyPosition, this.valuePosition, token, this.editedToken, this.nextToken);
    }
  }, {
    key: 'setEditedToken',
    value: function setEditedToken(token) {
      return new PositionInfo(this.segments, this.keyPosition, this.valuePosition, this.previousToken, token, this.nextToken);
    }
  }, {
    key: 'setNextToken',
    value: function setNextToken(token) {
      return new PositionInfo(this.segments, this.keyPosition, this.valuePosition, this.previousToken, this.editedToken, token);
    }
  }, {
    key: 'add',
    value: function add(segment) {
      return this.addAll([segment]);
    }
  }, {
    key: 'addAll',
    value: function addAll(segments) {
      return new PositionInfo(this.segments.concat(segments), this.keyPosition, this.valuePosition, this.previousToken, this.editedToken, this.nextToken);
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      return {
        segments: this.segments,
        keyPosition: this.keyPosition,
        valuePosition: this.valuePosition,
        previousToken: this.previousToken,
        editedToken: this.editedToken,
        nextToken: this.nextToken
      };
    }
  }]);

  return PositionInfo;
})();

exports.PositionInfo = PositionInfo;

var ValueHolder = (function () {
  function ValueHolder(value) {
    _classCallCheck(this, ValueHolder);

    this.value = value;
  }

  _createClass(ValueHolder, [{
    key: 'get',
    value: function get() {
      if (!this.hasValue()) {
        throw new Error('value is not set');
      }
      return this.value;
    }
  }, {
    key: 'getOrElse',
    value: function getOrElse(defaultValue) {
      return this.hasValue() ? this.get() : defaultValue;
    }
  }, {
    key: 'set',
    value: function set(value) {
      this.value = value;
    }
  }, {
    key: 'hasValue',
    value: function hasValue() {
      return !(0, _lodashIsUndefined2['default'])(this.value);
    }
  }]);

  return ValueHolder;
})();

exports.ValueHolder = ValueHolder;

function resolveObject(_x9, _x10) {
  var _again = true;

  _function: while (_again) {
    var segments = _x9,
        object = _x10;
    _again = false;

    if (!(0, _lodashIsObject2['default'])(object)) {
      return null;
    }
    if (segments.length === 0) {
      return object;
    }

    var _segments = _toArray(segments);

    var key = _segments[0];

    var restOfSegments = _segments.slice(1);

    _x9 = restOfSegments;
    _x10 = object[key];
    _again = true;
    _segments = key = restOfSegments = undefined;
    continue _function;
  }
}

function doMatches(pattern, file) {
  var path = pattern.indexOf('/') > -1 ? file.getRealPathSync() : file.getBaseName();
  var search = process.platform === 'win32' ? pattern.replace(/\//g, '\\') : pattern;
  return (0, _minimatch2['default'])(path, search);
}

function matches(file, patterns) {
  return (0, _lodashIsArray2['default'])(patterns) ? patterns.some(function (pattern) {
    return doMatches(pattern, file);
  }) : doMatches(patterns, file);
}

var StorageType = {
  FILE: 'FILE',
  FOLDER: 'FOLDER',
  BOTH: 'BOTH'
};
exports.StorageType = StorageType;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzhCQUVxQixpQkFBaUI7Ozs7NkJBQ2xCLGdCQUFnQjs7OztpQ0FDWixvQkFBb0I7Ozs7eUJBRXRCLFdBQVc7Ozs7QUFOakMsV0FBVyxDQUFBOztJQVFFLGNBQWM7QUFFZCxXQUZBLGNBQWMsR0FFVztRQUF4QixLQUFLLHlEQUFHLEVBQUU7UUFBRSxLQUFLLHlEQUFHLENBQUMsQ0FBQzs7MEJBRnZCLGNBQWM7O0FBR3ZCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0dBQ25COztlQUxVLGNBQWM7O1dBT2xCLG1CQUFHO0FBQ1IsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUM5Qjs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO0FBQ25CLGNBQU0sSUFBSSxLQUFLLDBCQUF1QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQSxDQUFHLENBQUE7T0FDeEQ7QUFDRCxVQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQTtBQUNmLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDOUI7OztXQUVPLGtCQUFDLFlBQVksRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFBO0tBQ2xFOzs7V0FFVyxzQkFBQyxZQUFZLEVBQUU7QUFDekIsYUFBTyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUss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TTtDQUNiLENBQUEiLCJmaWxlIjoiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBpc09iamVjdCBmcm9tICdsb2Rhc2gvaXNPYmplY3QnXG5pbXBvcnQgaXNBcnJheSBmcm9tICdsb2Rhc2gvaXNBcnJheSdcbmltcG9ydCBpc1VuZGVmaW5lZCBmcm9tICdsb2Rhc2gvaXNVbmRlZmluZWQnXG5cbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJ1xuXG5leHBvcnQgY2xhc3MgQXJyYXlUcmF2ZXJzZXIge1xuXG4gIGNvbnN0cnVjdG9yKGFycmF5ID0gW10sIGluZGV4ID0gLTEpIHtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXlcbiAgICB0aGlzLmluZGV4ID0gaW5kZXhcbiAgfVxuXG4gIGN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJyYXlbdGhpcy5pbmRleF1cbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgaWYgKCF0aGlzLmhhc05leHQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBubyBuZXh0IGVsZW1lbnQgYXQgJHt0aGlzLmluZGV4ICsgMX1gKVxuICAgIH1cbiAgICB0aGlzLmluZGV4ICs9IDFcbiAgICByZXR1cm4gdGhpcy5hcnJheVt0aGlzLmluZGV4XVxuICB9XG5cbiAgcGVla05leHQoZGVmYXVsdFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzTmV4dCgpID8gdGhpcy5hcnJheVt0aGlzLmluZGV4ICsgMV0gOiBkZWZhdWx0VmFsdWVcbiAgfVxuXG4gIHBlZWtQcmV2aW91cyhkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXNQcmV2aW91cygpID8gdGhpcy5hcnJheVt0aGlzLmluZGV4IC0gMV0gOiBkZWZhdWx0VmFsdWVcbiAgfVxuXG4gIHByZXZpb3VzKCkge1xuICAgIGlmICghdGhpcy5oYXNQcmV2aW91cygpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG5vIHByZXZpb3VzIGVsZW1lbnQgYXQgJHt0aGlzLmluZGV4fWApXG4gICAgfVxuICAgIHRoaXMuaW5kZXggLT0gMVxuICAgIHJldHVybiB0aGlzLmFycmF5W3RoaXMuaW5kZXhdXG4gIH1cblxuICBoYXNOZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmluZGV4ICsgMSA8IHRoaXMuYXJyYXkubGVuZ3RoXG4gIH1cblxuICBoYXNQcmV2aW91cygpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleCAtIDEgPj0gMCAmJiB0aGlzLmFycmF5Lmxlbmd0aCAhPT0gMFxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbkluZm8ge1xuICBjb25zdHJ1Y3RvcihzZWdtZW50cyA9IFtdLFxuICAgIGtleVBvc2l0aW9uID0gZmFsc2UsXG4gICAgdmFsdWVQb3NpdGlvbiA9IGZhbHNlLFxuICAgIHByZXZpb3VzVG9rZW4gPSBudWxsLFxuICAgIGVkaXRlZFRva2VuID0gbnVsbCxcbiAgICBuZXh0VG9rZW4gPSBudWxsXG4gICkge1xuICAgIHRoaXMuc2VnbWVudHMgPSBzZWdtZW50c1xuICAgIHRoaXMua2V5UG9zaXRpb24gPSBrZXlQb3NpdGlvblxuICAgIHRoaXMudmFsdWVQb3NpdGlvbiA9IHZhbHVlUG9zaXRpb25cbiAgICB0aGlzLnByZXZpb3VzVG9rZW4gPSBwcmV2aW91c1Rva2VuXG4gICAgdGhpcy5lZGl0ZWRUb2tlbiA9IGVkaXRlZFRva2VuXG4gICAgdGhpcy5uZXh0VG9rZW4gPSBuZXh0VG9rZW5cbiAgfVxuXG4gIHNldEtleVBvc2l0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb25JbmZvKHRoaXMuc2VnbWVudHMsIHRydWUsIGZhbHNlLCB0aGlzLnByZXZpb3VzVG9rZW4sIHRoaXMuZWRpdGVkVG9rZW4sIHRoaXMubmV4dFRva2VuKVxuICB9XG5cbiAgc2V0VmFsdWVQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uSW5mbyh0aGlzLnNlZ21lbnRzLCBmYWxzZSwgdHJ1ZSwgdGhpcy5wcmV2aW91c1Rva2VuLCB0aGlzLmVkaXRlZFRva2VuLCB0aGlzLm5leHRUb2tlbilcbiAgfVxuXG4gIHNldFByZXZpb3VzVG9rZW4odG9rZW4pIHtcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uSW5mbyh0aGlzLnNlZ21lbnRzLCB0aGlzLmtleVBvc2l0aW9uLCB0aGlzLnZhbHVlUG9zaXRpb24sIHRva2VuLCB0aGlzLmVkaXRlZFRva2VuLCB0aGlzLm5leHRUb2tlbilcbiAgfVxuXG4gIHNldEVkaXRlZFRva2VuKHRva2VuKSB7XG4gICAgcmV0dXJuIG5ldyBQb3NpdGlvbkluZm8odGhpcy5zZWdtZW50cywgdGhpcy5rZXlQb3NpdGlvbiwgdGhpcy52YWx1ZVBvc2l0aW9uLCB0aGlzLnByZXZpb3VzVG9rZW4sIHRva2VuLCB0aGlzLm5leHRUb2tlbilcbiAgfVxuXG4gIHNldE5leHRUb2tlbih0b2tlbikge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb25JbmZvKHRoaXMuc2VnbWVudHMsIHRoaXMua2V5UG9zaXRpb24sIHRoaXMudmFsdWVQb3NpdGlvbiwgdGhpcy5wcmV2aW91c1Rva2VuLCB0aGlzLmVkaXRlZFRva2VuLCB0b2tlbilcbiAgfVxuXG4gIGFkZChzZWdtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkQWxsKFtzZWdtZW50XSlcbiAgfVxuXG4gIGFkZEFsbChzZWdtZW50cykge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb25JbmZvKFxuICAgICAgdGhpcy5zZWdtZW50cy5jb25jYXQoc2VnbWVudHMpLFxuICAgICAgdGhpcy5rZXlQb3NpdGlvbixcbiAgICAgIHRoaXMudmFsdWVQb3NpdGlvbixcbiAgICAgIHRoaXMucHJldmlvdXNUb2tlbixcbiAgICAgIHRoaXMuZWRpdGVkVG9rZW4sXG4gICAgICB0aGlzLm5leHRUb2tlblxuICAgIClcbiAgfVxuXG4gIHRvT2JqZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICBzZWdtZW50czogdGhpcy5zZWdtZW50cyxcbiAgICAgIGtleVBvc2l0aW9uOiB0aGlzLmtleVBvc2l0aW9uLFxuICAgICAgdmFsdWVQb3NpdGlvbjogdGhpcy52YWx1ZVBvc2l0aW9uLFxuICAgICAgcHJldmlvdXNUb2tlbjogdGhpcy5wcmV2aW91c1Rva2VuLFxuICAgICAgZWRpdGVkVG9rZW46IHRoaXMuZWRpdGVkVG9rZW4sXG4gICAgICBuZXh0VG9rZW46IHRoaXMubmV4dFRva2VuXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWYWx1ZUhvbGRlciB7XG4gIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gIH1cblxuICBnZXQoKSB7XG4gICAgaWYgKCF0aGlzLmhhc1ZhbHVlKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndmFsdWUgaXMgbm90IHNldCcpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnZhbHVlXG4gIH1cblxuICBnZXRPckVsc2UoZGVmYXVsdFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzVmFsdWUoKSA/IHRoaXMuZ2V0KCkgOiBkZWZhdWx0VmFsdWVcbiAgfVxuXG4gIHNldCh2YWx1ZSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICB9XG5cbiAgaGFzVmFsdWUoKSB7XG4gICAgcmV0dXJuICFpc1VuZGVmaW5lZCh0aGlzLnZhbHVlKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlT2JqZWN0KHNlZ21lbnRzLCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBpZiAoc2VnbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9iamVjdFxuICB9XG4gIGNvbnN0IFtrZXksIC4uLnJlc3RPZlNlZ21lbnRzXSA9IHNlZ21lbnRzXG4gIHJldHVybiByZXNvbHZlT2JqZWN0KHJlc3RPZlNlZ21lbnRzLCBvYmplY3Rba2V5XSlcbn1cblxuZnVuY3Rpb24gZG9NYXRjaGVzKHBhdHRlcm4sIGZpbGUpIHtcbiAgY29uc3QgcGF0aCA9IHBhdHRlcm4uaW5kZXhPZignLycpID4gLTEgPyBmaWxlLmdldFJlYWxQYXRoU3luYygpIDogZmlsZS5nZXRCYXNlTmFtZSgpXG4gIGNvbnN0IHNlYXJjaCA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgPyBwYXR0ZXJuLnJlcGxhY2UoL1xcLy9nLCAnXFxcXCcpIDogcGF0dGVyblxuICByZXR1cm4gbWluaW1hdGNoKHBhdGgsIHNlYXJjaClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoZXMoZmlsZSwgcGF0dGVybnMpIHtcbiAgcmV0dXJuIGlzQXJyYXkocGF0dGVybnMpID8gcGF0dGVybnMuc29tZShwYXR0ZXJuID0+IGRvTWF0Y2hlcyhwYXR0ZXJuLCBmaWxlKSkgOiBkb01hdGNoZXMocGF0dGVybnMsIGZpbGUpXG59XG5cbmV4cG9ydCBjb25zdCBTdG9yYWdlVHlwZSA9IHtcbiAgRklMRTogJ0ZJTEUnLFxuICBGT0xERVI6ICdGT0xERVInLFxuICBCT1RIOiAnQk9USCdcbn1cblxuIl19