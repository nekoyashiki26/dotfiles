Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _atomJavaUtil = require('./atomJavaUtil');

var _atomJavaUtil2 = _interopRequireDefault(_atomJavaUtil);

var _javaUtil = require('./javaUtil');

var _javaUtil2 = _interopRequireDefault(_javaUtil);

'use babel';

var AtomAutocompleteProvider = (function () {
  function AtomAutocompleteProvider(classLoader) {
    _classCallCheck(this, AtomAutocompleteProvider);

    this.classLoader = classLoader;

    // settings for autocomplete-plus
    this.selector = '.source.java';
    this.disableForSelector = '.source.java .comment';
  }

  _createClass(AtomAutocompleteProvider, [{
    key: 'configure',
    value: function configure(config) {
      // settings for autocomplete-plus
      this.inclusionPriority = config.inclusionPriority;
      this.excludeLowerPriority = config.excludeLowerPriority;
      this.foldImports = config.foldImports;
    }

    // autocomplete-plus
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var _this = this;

      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var origPrefix = _ref.prefix;

      // text: 'package.Class.me', prefix: 'package.Class', suffix: 'me'
      // text: 'package.Cla', prefix: 'package', suffix: 'Cla'
      // text: 'Cla', prefix: '', suffix: 'Cla'
      // line: 'new Cla', text: 'Cla', prevWord: 'new'
      var line = _atomJavaUtil2['default'].getLine(editor, bufferPosition);
      var prevWord = _atomJavaUtil2['default'].getPrevWord(editor, bufferPosition);
      var text = _atomJavaUtil2['default'].getWord(editor, bufferPosition, true).replace('@', '');
      var prefix = text.substring(0, text.lastIndexOf('.'));
      var suffix = origPrefix.replace('.', '');
      var couldBeClass = /^[A-Z]/.test(suffix) || prefix;
      var isInstance = false;

      var results = null;
      if (couldBeClass) {
        var classes = this.classLoader.findClass(text);
        if (prevWord === 'new' && classes && classes.length) {
          // Class constructor suggestions
          results = [];
          _lodash._.each(classes, function (classDesc) {
            _lodash._.each(classDesc.constructors, function (constructor) {
              results.push(constructor);
            });
          });
        } else {
          // Class suggestions
          results = classes;
        }
      }

      if (!results || !results.length) {
        // Find member of a class
        // TODO ugly. refactor.
        var stat = _atomJavaUtil2['default'].determineClassName(editor, bufferPosition, text, prefix, suffix, this.prevReturnType);
        isInstance = stat.isInstance;
        _lodash._.every(stat.classNames, function (className) {
          // methods of this class
          results = _this.classLoader.findClassMember(className, suffix) || [];
          // methods of extending classes
          var superClass = _this.classLoader.findSuperClassName(className);
          while (superClass) {
            var r = _this.classLoader.findClassMember(superClass, suffix);
            if (r) {
              var _results;

              (_results = results).push.apply(_results, _toConsumableArray(r));
            }
            superClass = _this.classLoader.findSuperClassName(superClass);
          }
          return !results.length;
        });
      }

      // Autocomplete-plus filters all duplicates. This is a workaround for that.
      var duplicateWorkaround = {};

      // Map results to autocomplete-plus suggestions
      return _lodash._.map(results, function (desc) {
        var snippet = _this._createSnippet(desc, line, prefix, !isInstance && desc.type !== 'constructor');
        if (!duplicateWorkaround[snippet]) {
          duplicateWorkaround[snippet] = 1;
        }
        var counter = duplicateWorkaround[snippet]++;
        var typeName = couldBeClass ? desc.className : desc.simpleName;
        return {
          snippet: snippet + (counter > 1 ? ' (' + counter + ')' : ''),
          replacementPrefix: isInstance ? suffix : text,
          leftLabel: desc.member ? _this._getFormattedReturnType(desc.member) : typeName,
          type: desc.type !== 'constructor' ? desc.type : 'method',
          desc: desc
        };
      });
    }
  }, {
    key: '_getFormattedReturnType',
    value: function _getFormattedReturnType(member) {
      return member.visibility + ' ' + _javaUtil2['default'].getSimpleName(member.returnType);
    }
  }, {
    key: '_createSnippet',
    value: function _createSnippet(desc, line, prefix, addMemberClass) {
      // TODO use full class name in case of a name conflict
      // Use full class name in case of class import or method with long prefix
      var useFullClassName = desc.type === 'class' ? /^import/.test(line) : prefix.indexOf('.') !== -1;
      var text = useFullClassName ? desc.className : desc.simpleName;
      if (desc.member) {
        text = (addMemberClass ? '${1:' + text + '}.' : '') + this._createMemberSnippet(desc.member, desc.type);
      }
      return text;
    }
  }, {
    key: '_createMemberSnippet',
    value: function _createMemberSnippet(member, type) {
      var snippet = null;
      if (!member.params) {
        snippet = type === 'property' ? member.name : member.name + '()';
      } else {
        (function () {
          var index = 2;
          var params = _lodash._.map(member.params, function (param) {
            return '${' + index++ + ':' + _javaUtil2['default'].getSimpleName(param) + '}';
          });
          snippet = _lodash._.reduce(params, function (result, param) {
            return result + param + ', ';
          }, member.name + '(').replace(/, $/, ')');
          snippet = snippet + '${' + index + ':}';
        })();
      }
      return snippet;
    }

    // autocomplete-plus
  }, {
    key: 'onDidInsertSuggestion',
    value: function onDidInsertSuggestion(_ref2) {
      var editor = _ref2.editor;
      var suggestion = _ref2.suggestion;

      if (suggestion.type === 'class') {
        // Add import statement if simple class name was used as a completion text
        if (suggestion.snippet.indexOf('.') === -1) {
          _atomJavaUtil2['default'].importClass(editor, suggestion.desc.className, this.foldImports);
        }
      } else if (suggestion.desc.member) {
        // Save snippet return type for later use (type determination)
        this.prevReturnType = suggestion.desc.member.returnType;
      }
      this.classLoader.touch(suggestion.desc);
    }
  }]);

  return AtomAutocompleteProvider;
})();

exports.AtomAutocompleteProvider = AtomAutocompleteProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvQXRvbUF1dG9jb21wbGV0ZVByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFa0IsUUFBUTs7NEJBQ0QsZ0JBQWdCOzs7O3dCQUNwQixZQUFZOzs7O0FBSmpDLFdBQVcsQ0FBQzs7SUFNQyx3QkFBd0I7QUFFeEIsV0FGQSx3QkFBd0IsQ0FFdkIsV0FBVyxFQUFFOzBCQUZkLHdCQUF3Qjs7QUFHakMsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7OztBQUcvQixRQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQztBQUMvQixRQUFJLENBQUMsa0JBQWtCLEdBQUcsdUJBQXVCLENBQUM7R0FDbkQ7O2VBUlUsd0JBQXdCOztXQVUxQixtQkFBQyxNQUFNLEVBQUU7O0FBRWhCLFVBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUM7QUFDbEQsVUFBSSxDQUFDLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztBQUN4RCxVQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7S0FDdkM7Ozs7O1dBR2Esd0JBQUMsSUFBNEMsRUFBRTs7O1VBQTdDLE1BQU0sR0FBUCxJQUE0QyxDQUEzQyxNQUFNO1VBQUUsY0FBYyxHQUF2QixJQUE0QyxDQUFuQyxjQUFjO1VBQVUsVUFBVSxHQUEzQyxJQUE0QyxDQUFuQixNQUFNOzs7Ozs7QUFLNUMsVUFBTSxJQUFJLEdBQUcsMEJBQWEsT0FBTyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztBQUMxRCxVQUFNLFFBQVEsR0FBRywwQkFBYSxXQUFXLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ2xFLFVBQU0sSUFBSSxHQUFHLDBCQUFhLE9BQU8sQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUM5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LE9BQU8sRUFBRTs7QUFFL0IsWUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMxQyxvQ0FBYSxXQUFXLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUN4RCxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDckI7T0FDRixNQUFNLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7O0FBRWpDLFlBQUksQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO09BQ3pEO0FBQ0QsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3pDOzs7U0EvSVUsd0JBQXdCIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvQXRvbUF1dG9jb21wbGV0ZVByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IF8gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGF0b21KYXZhVXRpbCBmcm9tICcuL2F0b21KYXZhVXRpbCc7XG5pbXBvcnQgamF2YVV0aWwgZnJvbSAnLi9qYXZhVXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBBdG9tQXV0b2NvbXBsZXRlUHJvdmlkZXIge1xuXG4gIGNvbnN0cnVjdG9yKGNsYXNzTG9hZGVyKSB7XG4gICAgdGhpcy5jbGFzc0xvYWRlciA9IGNsYXNzTG9hZGVyO1xuXG4gICAgLy8gc2V0dGluZ3MgZm9yIGF1dG9jb21wbGV0ZS1wbHVzXG4gICAgdGhpcy5zZWxlY3RvciA9ICcuc291cmNlLmphdmEnO1xuICAgIHRoaXMuZGlzYWJsZUZvclNlbGVjdG9yID0gJy5zb3VyY2UuamF2YSAuY29tbWVudCc7XG4gIH1cblxuICBjb25maWd1cmUoY29uZmlnKSB7XG4gICAgLy8gc2V0dGluZ3MgZm9yIGF1dG9jb21wbGV0ZS1wbHVzXG4gICAgdGhpcy5pbmNsdXNpb25Qcmlvcml0eSA9IGNvbmZpZy5pbmNsdXNpb25Qcmlvcml0eTtcbiAgICB0aGlzLmV4Y2x1ZGVMb3dlclByaW9yaXR5ID0gY29uZmlnLmV4Y2x1ZGVMb3dlclByaW9yaXR5O1xuICAgIHRoaXMuZm9sZEltcG9ydHMgPSBjb25maWcuZm9sZEltcG9ydHM7XG4gIH1cblxuICAvLyBhdXRvY29tcGxldGUtcGx1c1xuICBnZXRTdWdnZXN0aW9ucyh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4OiBvcmlnUHJlZml4fSkge1xuICAgIC8vIHRleHQ6ICdwYWNrYWdlLkNsYXNzLm1lJywgcHJlZml4OiAncGFja2FnZS5DbGFzcycsIHN1ZmZpeDogJ21lJ1xuICAgIC8vIHRleHQ6ICdwYWNrYWdlLkNsYScsIHByZWZpeDogJ3BhY2thZ2UnLCBzdWZmaXg6ICdDbGEnXG4gICAgLy8gdGV4dDogJ0NsYScsIHByZWZpeDogJycsIHN1ZmZpeDogJ0NsYSdcbiAgICAvLyBsaW5lOiAnbmV3IENsYScsIHRleHQ6ICdDbGEnLCBwcmV2V29yZDogJ25ldydcbiAgICBjb25zdCBsaW5lID0gYXRvbUphdmFVdGlsLmdldExpbmUoZWRpdG9yLCBidWZmZXJQb3NpdGlvbik7XG4gICAgY29uc3QgcHJldldvcmQgPSBhdG9tSmF2YVV0aWwuZ2V0UHJldldvcmQoZWRpdG9yLCBidWZmZXJQb3NpdGlvbik7XG4gICAgY29uc3QgdGV4dCA9IGF0b21KYXZhVXRpbC5nZXRXb3JkKGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIHRydWUpXG4gICAgLnJlcGxhY2UoJ0AnLCAnJyk7XG4gICAgY29uc3QgcHJlZml4ID0gdGV4dC5zdWJzdHJpbmcoMCwgdGV4dC5sYXN0SW5kZXhPZignLicpKTtcbiAgICBjb25zdCBzdWZmaXggPSBvcmlnUHJlZml4LnJlcGxhY2UoJy4nLCAnJyk7XG4gICAgY29uc3QgY291bGRCZUNsYXNzID0gL15bQS1aXS8udGVzdChzdWZmaXgpIHx8IHByZWZpeDtcbiAgICBsZXQgaXNJbnN0YW5jZSA9IGZhbHNlO1xuXG4gICAgbGV0IHJlc3VsdHMgPSBudWxsO1xuICAgIGlmIChjb3VsZEJlQ2xhc3MpIHtcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLmNsYXNzTG9hZGVyLmZpbmRDbGFzcyh0ZXh0KTtcbiAgICAgIGlmIChwcmV2V29yZCA9PT0gJ25ldycgJiYgY2xhc3NlcyAmJiBjbGFzc2VzLmxlbmd0aCkge1xuICAgICAgICAvLyBDbGFzcyBjb25zdHJ1Y3RvciBzdWdnZXN0aW9uc1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIF8uZWFjaChjbGFzc2VzLCBjbGFzc0Rlc2MgPT4ge1xuICAgICAgICAgIF8uZWFjaChjbGFzc0Rlc2MuY29uc3RydWN0b3JzLCBjb25zdHJ1Y3RvciA9PiB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goY29uc3RydWN0b3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENsYXNzIHN1Z2dlc3Rpb25zXG4gICAgICAgIHJlc3VsdHMgPSBjbGFzc2VzO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgoIXJlc3VsdHMgfHwgIXJlc3VsdHMubGVuZ3RoKSkge1xuICAgICAgLy8gRmluZCBtZW1iZXIgb2YgYSBjbGFzc1xuICAgICAgLy8gVE9ETyB1Z2x5LiByZWZhY3Rvci5cbiAgICAgIGNvbnN0IHN0YXQgPSBhdG9tSmF2YVV0aWwuZGV0ZXJtaW5lQ2xhc3NOYW1lKGVkaXRvciwgYnVmZmVyUG9zaXRpb24sXG4gICAgICAgIHRleHQsIHByZWZpeCwgc3VmZml4LCB0aGlzLnByZXZSZXR1cm5UeXBlKTtcbiAgICAgIGlzSW5zdGFuY2UgPSBzdGF0LmlzSW5zdGFuY2U7XG4gICAgICBfLmV2ZXJ5KHN0YXQuY2xhc3NOYW1lcywgY2xhc3NOYW1lID0+IHtcbiAgICAgICAgLy8gbWV0aG9kcyBvZiB0aGlzIGNsYXNzXG4gICAgICAgIHJlc3VsdHMgPSB0aGlzLmNsYXNzTG9hZGVyLmZpbmRDbGFzc01lbWJlcihjbGFzc05hbWUsIHN1ZmZpeCkgfHwgW107XG4gICAgICAgIC8vIG1ldGhvZHMgb2YgZXh0ZW5kaW5nIGNsYXNzZXNcbiAgICAgICAgbGV0IHN1cGVyQ2xhc3MgPSB0aGlzLmNsYXNzTG9hZGVyLmZpbmRTdXBlckNsYXNzTmFtZShjbGFzc05hbWUpO1xuICAgICAgICB3aGlsZSAoc3VwZXJDbGFzcykge1xuICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLmNsYXNzTG9hZGVyLmZpbmRDbGFzc01lbWJlcihzdXBlckNsYXNzLCBzdWZmaXgpO1xuICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goLi4ucik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN1cGVyQ2xhc3MgPSB0aGlzLmNsYXNzTG9hZGVyLmZpbmRTdXBlckNsYXNzTmFtZShzdXBlckNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIXJlc3VsdHMubGVuZ3RoO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQXV0b2NvbXBsZXRlLXBsdXMgZmlsdGVycyBhbGwgZHVwbGljYXRlcy4gVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIHRoYXQuXG4gICAgY29uc3QgZHVwbGljYXRlV29ya2Fyb3VuZCA9IHt9O1xuXG4gICAgLy8gTWFwIHJlc3VsdHMgdG8gYXV0b2NvbXBsZXRlLXBsdXMgc3VnZ2VzdGlvbnNcbiAgICByZXR1cm4gXy5tYXAocmVzdWx0cywgKGRlc2MpID0+IHtcbiAgICAgIGNvbnN0IHNuaXBwZXQgPSB0aGlzLl9jcmVhdGVTbmlwcGV0KGRlc2MsIGxpbmUsIHByZWZpeCxcbiAgICAgICAgIWlzSW5zdGFuY2UgJiYgZGVzYy50eXBlICE9PSAnY29uc3RydWN0b3InKTtcbiAgICAgIGlmICghZHVwbGljYXRlV29ya2Fyb3VuZFtzbmlwcGV0XSkge1xuICAgICAgICBkdXBsaWNhdGVXb3JrYXJvdW5kW3NuaXBwZXRdID0gMTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvdW50ZXIgPSBkdXBsaWNhdGVXb3JrYXJvdW5kW3NuaXBwZXRdKys7XG4gICAgICBjb25zdCB0eXBlTmFtZSA9IChjb3VsZEJlQ2xhc3MgPyBkZXNjLmNsYXNzTmFtZSA6IGRlc2Muc2ltcGxlTmFtZSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzbmlwcGV0OiBzbmlwcGV0ICsgKGNvdW50ZXIgPiAxID8gJyAoJyArIGNvdW50ZXIgKyAnKScgOiAnJyksXG4gICAgICAgIHJlcGxhY2VtZW50UHJlZml4OiBpc0luc3RhbmNlID8gc3VmZml4IDogdGV4dCxcbiAgICAgICAgbGVmdExhYmVsOiBkZXNjLm1lbWJlclxuICAgICAgICA/IHRoaXMuX2dldEZvcm1hdHRlZFJldHVyblR5cGUoZGVzYy5tZW1iZXIpXG4gICAgICAgIDogdHlwZU5hbWUsXG4gICAgICAgIHR5cGU6IGRlc2MudHlwZSAhPT0gJ2NvbnN0cnVjdG9yJyA/IGRlc2MudHlwZSA6ICdtZXRob2QnLFxuICAgICAgICBkZXNjOiBkZXNjLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIF9nZXRGb3JtYXR0ZWRSZXR1cm5UeXBlKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXIudmlzaWJpbGl0eSArICcgJyArIGphdmFVdGlsLmdldFNpbXBsZU5hbWUobWVtYmVyLnJldHVyblR5cGUpO1xuICB9XG5cbiAgX2NyZWF0ZVNuaXBwZXQoZGVzYywgbGluZSwgcHJlZml4LCBhZGRNZW1iZXJDbGFzcykge1xuICAgIC8vIFRPRE8gdXNlIGZ1bGwgY2xhc3MgbmFtZSBpbiBjYXNlIG9mIGEgbmFtZSBjb25mbGljdFxuICAgIC8vIFVzZSBmdWxsIGNsYXNzIG5hbWUgaW4gY2FzZSBvZiBjbGFzcyBpbXBvcnQgb3IgbWV0aG9kIHdpdGggbG9uZyBwcmVmaXhcbiAgICBjb25zdCB1c2VGdWxsQ2xhc3NOYW1lID1cbiAgICAgIGRlc2MudHlwZSA9PT0gJ2NsYXNzJyA/IC9eaW1wb3J0Ly50ZXN0KGxpbmUpIDogcHJlZml4LmluZGV4T2YoJy4nKSAhPT0gLTE7XG4gICAgbGV0IHRleHQgPSB1c2VGdWxsQ2xhc3NOYW1lID8gZGVzYy5jbGFzc05hbWUgOiBkZXNjLnNpbXBsZU5hbWU7XG4gICAgaWYgKGRlc2MubWVtYmVyKSB7XG4gICAgICB0ZXh0ID0gKGFkZE1lbWJlckNsYXNzID8gJyR7MTonICsgdGV4dCArICd9LicgOiAnJykgK1xuICAgICAgICB0aGlzLl9jcmVhdGVNZW1iZXJTbmlwcGV0KGRlc2MubWVtYmVyLCBkZXNjLnR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIF9jcmVhdGVNZW1iZXJTbmlwcGV0KG1lbWJlciwgdHlwZSkge1xuICAgIGxldCBzbmlwcGV0ID0gbnVsbDtcbiAgICBpZiAoIW1lbWJlci5wYXJhbXMpIHtcbiAgICAgIHNuaXBwZXQgPSAodHlwZSA9PT0gJ3Byb3BlcnR5JylcbiAgICAgICAgPyBtZW1iZXIubmFtZSA6IG1lbWJlci5uYW1lICsgJygpJztcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGluZGV4ID0gMjtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IF8ubWFwKG1lbWJlci5wYXJhbXMsIChwYXJhbSkgPT4ge1xuICAgICAgICByZXR1cm4gJyR7JyArIChpbmRleCsrKSArICc6JyArIGphdmFVdGlsLmdldFNpbXBsZU5hbWUocGFyYW0pICsgJ30nO1xuICAgICAgfSk7XG4gICAgICBzbmlwcGV0ID0gXy5yZWR1Y2UocGFyYW1zLCAocmVzdWx0LCBwYXJhbSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzdWx0ICsgcGFyYW0gKyAnLCAnO1xuICAgICAgfSwgbWVtYmVyLm5hbWUgKyAnKCcpLnJlcGxhY2UoLywgJC8sICcpJyk7XG4gICAgICBzbmlwcGV0ID0gc25pcHBldCArICckeycgKyBpbmRleCArICc6fSc7XG4gICAgfVxuICAgIHJldHVybiBzbmlwcGV0O1xuICB9XG5cbiAgLy8gYXV0b2NvbXBsZXRlLXBsdXNcbiAgb25EaWRJbnNlcnRTdWdnZXN0aW9uKHtlZGl0b3IsIHN1Z2dlc3Rpb259KSB7XG4gICAgaWYgKHN1Z2dlc3Rpb24udHlwZSA9PT0gJ2NsYXNzJykge1xuICAgICAgLy8gQWRkIGltcG9ydCBzdGF0ZW1lbnQgaWYgc2ltcGxlIGNsYXNzIG5hbWUgd2FzIHVzZWQgYXMgYSBjb21wbGV0aW9uIHRleHRcbiAgICAgIGlmIChzdWdnZXN0aW9uLnNuaXBwZXQuaW5kZXhPZignLicpID09PSAtMSkge1xuICAgICAgICBhdG9tSmF2YVV0aWwuaW1wb3J0Q2xhc3MoZWRpdG9yLCBzdWdnZXN0aW9uLmRlc2MuY2xhc3NOYW1lLFxuICAgICAgICAgIHRoaXMuZm9sZEltcG9ydHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3VnZ2VzdGlvbi5kZXNjLm1lbWJlcikge1xuICAgICAgLy8gU2F2ZSBzbmlwcGV0IHJldHVybiB0eXBlIGZvciBsYXRlciB1c2UgKHR5cGUgZGV0ZXJtaW5hdGlvbilcbiAgICAgIHRoaXMucHJldlJldHVyblR5cGUgPSBzdWdnZXN0aW9uLmRlc2MubWVtYmVyLnJldHVyblR5cGU7XG4gICAgfVxuICAgIHRoaXMuY2xhc3NMb2FkZXIudG91Y2goc3VnZ2VzdGlvbi5kZXNjKTtcbiAgfVxuXG59XG4iXX0=