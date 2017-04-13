Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

'use babel';

var JavaUtil = (function () {
  function JavaUtil() {
    _classCallCheck(this, JavaUtil);
  }

  _createClass(JavaUtil, [{
    key: 'getSimpleName',
    value: function getSimpleName(className) {
      return className.replace(/[a-z]*\./g, '');
    }
  }, {
    key: 'getPackageName',
    value: function getPackageName(className) {
      return className.replace('.' + this.getSimpleName(className), '');
    }
  }, {
    key: 'getInverseName',
    value: function getInverseName(className) {
      return _lodash._.reduceRight(className.split('.'), function (result, next) {
        return result + next;
      }, '');
    }
  }]);

  return JavaUtil;
})();

exports['default'] = new JavaUtil();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvamF2YVV0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7c0JBRWtCLFFBQVE7O0FBRjFCLFdBQVcsQ0FBQzs7SUFJTixRQUFRO1dBQVIsUUFBUTswQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUVDLHVCQUFDLFNBQVMsRUFBRTtBQUN2QixhQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzNDOzs7V0FFYSx3QkFBQyxTQUFTLEVBQUU7QUFDeEIsYUFBTyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ25FOzs7V0FFYSx3QkFBQyxTQUFTLEVBQUU7QUFDeEIsYUFBTyxVQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQUMsTUFBTSxFQUFFLElBQUksRUFBSztBQUMzRCxlQUFPLE1BQU0sR0FBRyxJQUFJLENBQUM7T0FDdEIsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNSOzs7U0FkRyxRQUFROzs7cUJBa0JDLElBQUksUUFBUSxFQUFFIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvamF2YVV0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgXyB9IGZyb20gJ2xvZGFzaCc7XG5cbmNsYXNzIEphdmFVdGlsIHtcblxuICBnZXRTaW1wbGVOYW1lKGNsYXNzTmFtZSkge1xuICAgIHJldHVybiBjbGFzc05hbWUucmVwbGFjZSgvW2Etel0qXFwuL2csICcnKTtcbiAgfVxuXG4gIGdldFBhY2thZ2VOYW1lKGNsYXNzTmFtZSkge1xuICAgIHJldHVybiBjbGFzc05hbWUucmVwbGFjZSgnLicgKyB0aGlzLmdldFNpbXBsZU5hbWUoY2xhc3NOYW1lKSwgJycpO1xuICB9XG5cbiAgZ2V0SW52ZXJzZU5hbWUoY2xhc3NOYW1lKSB7XG4gICAgcmV0dXJuIF8ucmVkdWNlUmlnaHQoY2xhc3NOYW1lLnNwbGl0KCcuJyksIChyZXN1bHQsIG5leHQpID0+IHtcbiAgICAgIHJldHVybiByZXN1bHQgKyBuZXh0O1xuICAgIH0sICcnKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBKYXZhVXRpbCgpO1xuIl19