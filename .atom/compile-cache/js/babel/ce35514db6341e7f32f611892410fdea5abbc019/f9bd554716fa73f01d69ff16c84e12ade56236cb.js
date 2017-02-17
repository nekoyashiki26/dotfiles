Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _javaUtil = require('./javaUtil');

var _javaUtil2 = _interopRequireDefault(_javaUtil);

'use babel';

var AtomJavaUtil = (function () {
  function AtomJavaUtil() {
    _classCallCheck(this, AtomJavaUtil);
  }

  _createClass(AtomJavaUtil, [{
    key: 'getCurrentPackageName',
    value: function getCurrentPackageName(editor) {
      return this._lastMatch(editor.getText(), /package ([^;]*);/);
    }
  }, {
    key: 'getCurrentClassSimpleName',
    value: function getCurrentClassSimpleName(editor) {
      return editor.getTitle().split('.')[0];
    }
  }, {
    key: 'getCurrentClassName',
    value: function getCurrentClassName(editor) {
      return this.getCurrentPackageName(editor) + '.' + this.getCurrentClassName(editor);
    }
  }, {
    key: 'getImportedClassName',
    value: function getImportedClassName(editor, classSimpleName) {
      return this._lastMatch(editor.getText(), new RegExp('import (.*' + classSimpleName + ');'));
    }
  }, {
    key: 'getPossibleClassNames',
    value: function getPossibleClassNames(editor, classSimpleName, prefix) {
      var classNames = [];
      var className = this.getImportedClassName(editor, classSimpleName);
      if (className) {
        classNames.push(className);
      } else {
        if (prefix.indexOf('.') === -1) {
          // Use package name of current file or 'java.lang'
          classNames.push(this.getCurrentPackageName(editor) + '.' + classSimpleName);
          classNames.push('java.lang.' + classSimpleName);
        } else {
          // Use the whole prefix as classname
          classNames.push(prefix);
        }
      }
      return classNames;
    }
  }, {
    key: 'getLine',
    value: function getLine(editor, bufferPosition) {
      return editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    }
  }, {
    key: 'getWord',
    value: function getWord(editor, bufferPosition, removeParenthesis) {
      var line = this.getLine(editor, bufferPosition);
      return this.getLastWord(line, removeParenthesis);
    }
  }, {
    key: 'getLastWord',
    value: function getLastWord(line, removeParenthesis) {
      var result = this._lastMatch(line, /[^\s-]+$/);
      return removeParenthesis ? result.replace(/.*\(/, '') : result;
    }
  }, {
    key: 'getPrevWord',
    value: function getPrevWord(editor, bufferPosition) {
      var words = this.getLine(editor, bufferPosition).split(/[\s\(]+/);
      return words.length >= 2 ? words[words.length - 2] : null;
    }
  }, {
    key: 'importClass',
    value: function importClass(editor, className, foldImports) {
      // Add import statement if import does not already exist.
      // But do not import if class belongs in java.lang or current package.
      var packageName = _javaUtil2['default'].getPackageName(className);
      if (!this.getImportedClassName(editor, className) && packageName !== 'java.lang' && packageName !== this.getCurrentPackageName(editor)) {
        this.organizeImports(editor, 'import ' + className + ';', foldImports);
      }
    }
  }, {
    key: 'getImports',
    value: function getImports(editor) {
      var buffer = editor.getBuffer();
      return buffer.getText().match(/import\s.*;/g) || [];
    }
  }, {
    key: 'organizeImports',
    value: function organizeImports(editor, newImport, foldImports) {
      var _this = this;

      var buffer = editor.getBuffer();
      buffer.transact(function () {
        // Get current imports
        var imports = _this.getImports(editor);
        if (newImport) {
          imports.push(newImport);
        }
        // Remove current imports
        buffer.replace(/import\s.*;[\r\n]+/g, '');
        // Add sorted imports
        buffer.insert([1, 0], '\n');
        _lodash._.each(_lodash._.sortBy(imports), function (value, index) {
          buffer.insert([index + 2, 0], value + '\n');
        });

        if (foldImports) {
          _this.foldImports(editor);
        }
      });
    }
  }, {
    key: 'foldImports',
    value: function foldImports(editor) {
      var firstRow = 0;
      var lastRow = 0;
      var buffer = editor.getBuffer();
      buffer.scan(/import\s.*;/g, function (m) {
        lastRow = m.range.end.row;
      });

      if (lastRow) {
        var pos = editor.getCursorBufferPosition();
        editor.setSelectedBufferRange([[firstRow, 0], [lastRow, 0]]);
        editor.foldSelectedLines();
        editor.setCursorBufferPosition(pos);
      }
    }
  }, {
    key: 'determineClassName',
    value: function determineClassName(editor, bufferPosition, text, prefix, suffix, prevReturnType) {
      try {
        var classNames = null;
        var isInstance = /\)$/.test(prefix);

        var classSimpleName = null;

        // Determine class name
        if (!prefix || prefix === 'this') {
          // Use this as class name
          classSimpleName = this.getCurrentClassSimpleName(editor);
          isInstance = true;
        } else if (prefix) {
          // Get class name from prefix
          // Also support '((ClassName)var)' syntax (a quick hack)
          classSimpleName = this.getWord(editor, bufferPosition).indexOf('((') !== -1 ? prefix.match(/[^\)]*/)[0] : prefix;
        }

        if (!this._isValidClassName(classSimpleName) && !/[\.\)]/.test(prefix)) {
          // Find class name by a variable name given as prefix
          // TODO traverse brackets backwards to match correct scope (with regexp)
          // TODO handle 'this.varName' correctly
          classSimpleName = this._lastMatch(editor.getTextInRange([[bufferPosition.row - 25, 0], bufferPosition]), new RegExp('([A-Z][a-zA-Z0-9_]*)(<[A-Z][a-zA-Z0-9_<>, ]*>)?\\s' + prefix + '[,;=\\s\\)]', 'g'));
          classSimpleName = classSimpleName.replace(new RegExp('\\s+' + prefix + '[,;=\\s\\)]$'), '');
          classSimpleName = classSimpleName.replace(/\<.*\>/, '');

          isInstance = true;
        }

        if (this._isValidClassName(classSimpleName)) {
          // Convert simple name to a full class name and use that
          classNames = this.getPossibleClassNames(editor, classSimpleName, prefix);
        } else {
          // Just use return type of previous snippet (a quick hack)
          // TODO determine type using classloader
          classNames = [prevReturnType];
          isInstance = true;
        }

        return { classNames: classNames, isInstance: isInstance };
      } catch (err) {
        console.error(err);
        return {};
      }
    }
  }, {
    key: '_isValidClassName',
    value: function _isValidClassName(text) {
      return (/^[A-Z][^\.\)]*$/.test(text) || /\.[A-Z][^\.\)]*$/.test(text)
      );
    }
  }, {
    key: '_lastMatch',
    value: function _lastMatch(str, regex) {
      var array = str.match(regex) || [''];
      return array[array.length - 1];
    }
  }]);

  return AtomJavaUtil;
})();

exports['default'] = new AtomJavaUtil();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvYXRvbUphdmFVdGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWtCLFFBQVE7O3dCQUNMLFlBQVk7Ozs7QUFIakMsV0FBVyxDQUFDOztJQUtOLFlBQVk7V0FBWixZQUFZOzBCQUFaLFlBQVk7OztlQUFaLFlBQVk7O1dBRUssK0JBQUMsTUFBTSxFQUFFO0FBQzVCLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztLQUM5RDs7O1dBRXdCLG1DQUFDLE1BQU0sRUFBRTtBQUNoQyxhQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEM7OztXQUVrQiw2QkFBQyxNQUFNLEVBQUU7QUFDMUIsYUFBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUMzQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDdEM7OztXQUVtQiw4QkFBQyxNQUFNLEVBQUUsZUFBZSxFQUFFO0FBQzVDLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQ3JDLElBQUksTUFBTSxDQUFDLFlBQVksR0FBRyxlQUFlLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUN0RDs7O1dBRW9CLCtCQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFO0FBQ3JELFVBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUN0QixVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JFLFVBQUksU0FBUyxFQUFFO0FBQ2Isa0JBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFD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Q0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUV4RCxvQkFBVSxHQUFHLElBQUksQ0FBQztTQUNuQjs7QUFFRCxZQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsRUFBRTs7QUFFM0Msb0JBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFDN0QsTUFBTSxDQUFDLENBQUM7U0FDWCxNQUFNOzs7QUFHTCxvQkFBVSxHQUFHLENBQUUsY0FBYyxDQUFFLENBQUM7QUFDaEMsb0JBQVUsR0FBRyxJQUFJLENBQUM7U0FDbkI7O0FBRUQsZUFBTyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxDQUFDO09BQ25DLENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDWixlQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLGVBQU8sRUFBRSxDQUFDO09BQ1g7S0FDRjs7O1dBRWdCLDJCQUFDLElBQUksRUFBRTtBQUN0QixhQUFPLGtCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQUM7S0FDdEU7OztXQUVTLG9CQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDckIsVUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLGFBQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDaEM7OztTQTdLRyxZQUFZOzs7cUJBaUxILElBQUksWUFBWSxFQUFFIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvYXRvbUphdmFVdGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IF8gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGphdmFVdGlsIGZyb20gJy4vamF2YVV0aWwnO1xuXG5jbGFzcyBBdG9tSmF2YVV0aWwge1xuXG4gIGdldEN1cnJlbnRQYWNrYWdlTmFtZShlZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdE1hdGNoKGVkaXRvci5nZXRUZXh0KCksIC9wYWNrYWdlIChbXjtdKik7Lyk7XG4gIH1cblxuICBnZXRDdXJyZW50Q2xhc3NTaW1wbGVOYW1lKGVkaXRvcikge1xuICAgIHJldHVybiBlZGl0b3IuZ2V0VGl0bGUoKS5zcGxpdCgnLicpWzBdO1xuICB9XG5cbiAgZ2V0Q3VycmVudENsYXNzTmFtZShlZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDdXJyZW50UGFja2FnZU5hbWUoZWRpdG9yKSArICcuJ1xuICAgICAgKyB0aGlzLmdldEN1cnJlbnRDbGFzc05hbWUoZWRpdG9yKTtcbiAgfVxuXG4gIGdldEltcG9ydGVkQ2xhc3NOYW1lKGVkaXRvciwgY2xhc3NTaW1wbGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RNYXRjaChlZGl0b3IuZ2V0VGV4dCgpLFxuICAgICAgbmV3IFJlZ0V4cCgnaW1wb3J0ICguKicgKyBjbGFzc1NpbXBsZU5hbWUgKyAnKTsnKSk7XG4gIH1cblxuICBnZXRQb3NzaWJsZUNsYXNzTmFtZXMoZWRpdG9yLCBjbGFzc1NpbXBsZU5hbWUsIHByZWZpeCkge1xuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBbXTtcbiAgICBjb25zdCBjbGFzc05hbWUgPSB0aGlzLmdldEltcG9ydGVkQ2xhc3NOYW1lKGVkaXRvciwgY2xhc3NTaW1wbGVOYW1lKTtcbiAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICBjbGFzc05hbWVzLnB1c2goY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByZWZpeC5pbmRleE9mKCcuJykgPT09IC0xKSB7XG4gICAgICAgIC8vIFVzZSBwYWNrYWdlIG5hbWUgb2YgY3VycmVudCBmaWxlIG9yICdqYXZhLmxhbmcnXG4gICAgICAgIGNsYXNzTmFtZXMucHVzaCh0aGlzLmdldEN1cnJlbnRQYWNrYWdlTmFtZShlZGl0b3IpICtcbiAgICAgICAgICAnLicgKyBjbGFzc1NpbXBsZU5hbWUpO1xuICAgICAgICBjbGFzc05hbWVzLnB1c2goJ2phdmEubGFuZy4nICsgY2xhc3NTaW1wbGVOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFVzZSB0aGUgd2hvbGUgcHJlZml4IGFzIGNsYXNzbmFtZVxuICAgICAgICBjbGFzc05hbWVzLnB1c2gocHJlZml4KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNsYXNzTmFtZXM7XG4gIH1cblxuICBnZXRMaW5lKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIHtcbiAgICByZXR1cm4gZWRpdG9yLmdldFRleHRJblJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93LCAwXSwgYnVmZmVyUG9zaXRpb25dKTtcbiAgfVxuXG4gIGdldFdvcmQoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcmVtb3ZlUGFyZW50aGVzaXMpIHtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5nZXRMaW5lKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pO1xuICAgIHJldHVybiB0aGlzLmdldExhc3RXb3JkKGxpbmUsIHJlbW92ZVBhcmVudGhlc2lzKTtcbiAgfVxuXG4gIGdldExhc3RXb3JkKGxpbmUsIHJlbW92ZVBhcmVudGhlc2lzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fbGFzdE1hdGNoKGxpbmUsIC9bXlxccy1dKyQvKTtcbiAgICByZXR1cm4gcmVtb3ZlUGFyZW50aGVzaXMgPyByZXN1bHQucmVwbGFjZSgvLipcXCgvLCAnJykgOiByZXN1bHQ7XG4gIH1cblxuICBnZXRQcmV2V29yZChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSB7XG4gICAgY29uc3Qgd29yZHMgPSB0aGlzLmdldExpbmUoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikuc3BsaXQoL1tcXHNcXChdKy8pO1xuICAgIHJldHVybiB3b3Jkcy5sZW5ndGggPj0gMiA/IHdvcmRzW3dvcmRzLmxlbmd0aCAtIDJdIDogbnVsbDtcbiAgfVxuXG4gIGltcG9ydENsYXNzKGVkaXRvciwgY2xhc3NOYW1lLCBmb2xkSW1wb3J0cykge1xuICAgIC8vIEFkZCBpbXBvcnQgc3RhdGVtZW50IGlmIGltcG9ydCBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0LlxuICAgIC8vIEJ1dCBkbyBub3QgaW1wb3J0IGlmIGNsYXNzIGJlbG9uZ3MgaW4gamF2YS5sYW5nIG9yIGN1cnJlbnQgcGFja2FnZS5cbiAgICBjb25zdCBwYWNrYWdlTmFtZSA9IGphdmFVdGlsLmdldFBhY2thZ2VOYW1lKGNsYXNzTmFtZSk7XG4gICAgaWYgKCF0aGlzLmdldEltcG9ydGVkQ2xhc3NOYW1lKGVkaXRvciwgY2xhc3NOYW1lKSAmJlxuICAgICAgICBwYWNrYWdlTmFtZSAhPT0gJ2phdmEubGFuZycgJiZcbiAgICAgICAgcGFja2FnZU5hbWUgIT09IHRoaXMuZ2V0Q3VycmVudFBhY2thZ2VOYW1lKGVkaXRvcikpIHtcbiAgICAgIHRoaXMub3JnYW5pemVJbXBvcnRzKGVkaXRvciwgJ2ltcG9ydCAnICsgY2xhc3NOYW1lICsgJzsnLCBmb2xkSW1wb3J0cyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0SW1wb3J0cyhlZGl0b3IpIHtcbiAgICBjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG4gICAgcmV0dXJuIGJ1ZmZlci5nZXRUZXh0KCkubWF0Y2goL2ltcG9ydFxccy4qOy9nKSB8fCBbXTtcbiAgfVxuXG4gIG9yZ2FuaXplSW1wb3J0cyhlZGl0b3IsIG5ld0ltcG9ydCwgZm9sZEltcG9ydHMpIHtcbiAgICBjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG4gICAgYnVmZmVyLnRyYW5zYWN0KCgpID0+IHtcbiAgICAgIC8vIEdldCBjdXJyZW50IGltcG9ydHNcbiAgICAgIGNvbnN0IGltcG9ydHMgPSB0aGlzLmdldEltcG9ydHMoZWRpdG9yKTtcbiAgICAgIGlmIChuZXdJbXBvcnQpIHtcbiAgICAgICAgaW1wb3J0cy5wdXNoKG5ld0ltcG9ydCk7XG4gICAgICB9XG4gICAgICAvLyBSZW1vdmUgY3VycmVudCBpbXBvcnRzXG4gICAgICBidWZmZXIucmVwbGFjZSgvaW1wb3J0XFxzLio7W1xcclxcbl0rL2csICcnKTtcbiAgICAgIC8vIEFkZCBzb3J0ZWQgaW1wb3J0c1xuICAgICAgYnVmZmVyLmluc2VydChbMSwgMF0sICdcXG4nKTtcbiAgICAgIF8uZWFjaChfLnNvcnRCeShpbXBvcnRzKSwgKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICBidWZmZXIuaW5zZXJ0KFtpbmRleCArIDIsIDBdLCB2YWx1ZSArICdcXG4nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZm9sZEltcG9ydHMpIHtcbiAgICAgICAgdGhpcy5mb2xkSW1wb3J0cyhlZGl0b3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZm9sZEltcG9ydHMoZWRpdG9yKSB7XG4gICAgY29uc3QgZmlyc3RSb3cgPSAwO1xuICAgIGxldCBsYXN0Um93ID0gMDtcbiAgICBjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG4gICAgYnVmZmVyLnNjYW4oL2ltcG9ydFxccy4qOy9nLCAobSkgPT4ge1xuICAgICAgbGFzdFJvdyA9IG0ucmFuZ2UuZW5kLnJvdztcbiAgICB9KTtcblxuICAgIGlmIChsYXN0Um93KSB7XG4gICAgICBjb25zdCBwb3MgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKTtcbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKFtbZmlyc3RSb3csIDBdLCBbbGFzdFJvdywgMF1dKTtcbiAgICAgIGVkaXRvci5mb2xkU2VsZWN0ZWRMaW5lcygpO1xuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvcyk7XG4gICAgfVxuICB9XG5cbiAgZGV0ZXJtaW5lQ2xhc3NOYW1lKGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIHRleHQsIHByZWZpeCwgc3VmZml4LFxuICAgICAgcHJldlJldHVyblR5cGUpIHtcbiAgICB0cnkge1xuICAgICAgbGV0IGNsYXNzTmFtZXMgPSBudWxsO1xuICAgICAgbGV0IGlzSW5zdGFuY2UgPSAvXFwpJC8udGVzdChwcmVmaXgpO1xuXG4gICAgICBsZXQgY2xhc3NTaW1wbGVOYW1lID0gbnVsbDtcblxuICAgICAgLy8gRGV0ZXJtaW5lIGNsYXNzIG5hbWVcbiAgICAgIGlmICghcHJlZml4IHx8IHByZWZpeCA9PT0gJ3RoaXMnKSB7XG4gICAgICAgIC8vIFVzZSB0aGlzIGFzIGNsYXNzIG5hbWVcbiAgICAgICAgY2xhc3NTaW1wbGVOYW1lID0gdGhpcy5nZXRDdXJyZW50Q2xhc3NTaW1wbGVOYW1lKGVkaXRvcik7XG4gICAgICAgIGlzSW5zdGFuY2UgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChwcmVmaXgpIHtcbiAgICAgICAgLy8gR2V0IGNsYXNzIG5hbWUgZnJvbSBwcmVmaXhcbiAgICAgICAgLy8gQWxzbyBzdXBwb3J0ICcoKENsYXNzTmFtZSl2YXIpJyBzeW50YXggKGEgcXVpY2sgaGFjaylcbiAgICAgICAgY2xhc3NTaW1wbGVOYW1lID0gdGhpcy5nZXRXb3JkKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICAgICAgLmluZGV4T2YoJygoJykgIT09IC0xID8gcHJlZml4Lm1hdGNoKC9bXlxcKV0qLylbMF0gOiBwcmVmaXg7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5faXNWYWxpZENsYXNzTmFtZShjbGFzc1NpbXBsZU5hbWUpICYmXG4gICAgICAgICAgIS9bXFwuXFwpXS8udGVzdChwcmVmaXgpKSB7XG4gICAgICAgIC8vIEZpbmQgY2xhc3MgbmFtZSBieSBhIHZhcmlhYmxlIG5hbWUgZ2l2ZW4gYXMgcHJlZml4XG4gICAgICAgIC8vIFRPRE8gdHJhdmVyc2UgYnJhY2tldHMgYmFja3dhcmRzIHRvIG1hdGNoIGNvcnJlY3Qgc2NvcGUgKHdpdGggcmVnZXhwKVxuICAgICAgICAvLyBUT0RPIGhhbmRsZSAndGhpcy52YXJOYW1lJyBjb3JyZWN0bHlcbiAgICAgICAgY2xhc3NTaW1wbGVOYW1lID0gdGhpcy5fbGFzdE1hdGNoKFxuICAgICAgICAgIGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdyAtIDI1LCAwXSwgYnVmZmVyUG9zaXRpb25dKSxcbiAgICAgICAgICBuZXcgUmVnRXhwKCcoW0EtWl1bYS16QS1aMC05X10qKSg8W0EtWl1bYS16QS1aMC05Xzw+LCBdKj4pP1xcXFxzJyArXG4gICAgICAgICAgICBwcmVmaXggKyAnWyw7PVxcXFxzXFxcXCldJywgJ2cnKSk7XG4gICAgICAgIGNsYXNzU2ltcGxlTmFtZSA9IGNsYXNzU2ltcGxlTmFtZS5yZXBsYWNlKFxuICAgICAgICAgIG5ldyBSZWdFeHAoJ1xcXFxzKycgKyBwcmVmaXggKyAnWyw7PVxcXFxzXFxcXCldJCcpLCAnJyk7XG4gICAgICAgIGNsYXNzU2ltcGxlTmFtZSA9IGNsYXNzU2ltcGxlTmFtZS5yZXBsYWNlKC9cXDwuKlxcPi8sICcnKTtcblxuICAgICAgICBpc0luc3RhbmNlID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2lzVmFsaWRDbGFzc05hbWUoY2xhc3NTaW1wbGVOYW1lKSkge1xuICAgICAgICAvLyBDb252ZXJ0IHNpbXBsZSBuYW1lIHRvIGEgZnVsbCBjbGFzcyBuYW1lIGFuZCB1c2UgdGhhdFxuICAgICAgICBjbGFzc05hbWVzID0gdGhpcy5nZXRQb3NzaWJsZUNsYXNzTmFtZXMoZWRpdG9yLCBjbGFzc1NpbXBsZU5hbWUsXG4gICAgICAgICAgcHJlZml4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEp1c3QgdXNlIHJldHVybiB0eXBlIG9mIHByZXZpb3VzIHNuaXBwZXQgKGEgcXVpY2sgaGFjaylcbiAgICAgICAgLy8gVE9ETyBkZXRlcm1pbmUgdHlwZSB1c2luZyBjbGFzc2xvYWRlclxuICAgICAgICBjbGFzc05hbWVzID0gWyBwcmV2UmV0dXJuVHlwZSBdO1xuICAgICAgICBpc0luc3RhbmNlID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgY2xhc3NOYW1lcywgaXNJbnN0YW5jZSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIF9pc1ZhbGlkQ2xhc3NOYW1lKHRleHQpIHtcbiAgICByZXR1cm4gL15bQS1aXVteXFwuXFwpXSokLy50ZXN0KHRleHQpIHx8IC9cXC5bQS1aXVteXFwuXFwpXSokLy50ZXN0KHRleHQpO1xuICB9XG5cbiAgX2xhc3RNYXRjaChzdHIsIHJlZ2V4KSB7XG4gICAgY29uc3QgYXJyYXkgPSBzdHIubWF0Y2gocmVnZXgpIHx8IFsnJ107XG4gICAgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEF0b21KYXZhVXRpbCgpO1xuIl19