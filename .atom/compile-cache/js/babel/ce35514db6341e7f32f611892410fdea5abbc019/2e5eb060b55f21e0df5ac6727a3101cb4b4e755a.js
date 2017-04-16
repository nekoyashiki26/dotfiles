Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashIncludes = require('lodash/includes');

var _lodashIncludes2 = _interopRequireDefault(_lodashIncludes);

var _lodashTrimStart = require('lodash/trimStart');

var _lodashTrimStart2 = _interopRequireDefault(_lodashTrimStart);

var _tokenizer = require('./tokenizer');

var _structureProvider = require('./structure-provider');

var _utils = require('./utils');

'use babel';

var STRING = _tokenizer.TokenType.STRING;
var END_OBJECT = _tokenizer.TokenType.END_OBJECT;
var END_ARRAY = _tokenizer.TokenType.END_ARRAY;
var COMMA = _tokenizer.TokenType.COMMA;

var RootProvider = (function () {
  function RootProvider() {
    var providers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, RootProvider);

    this.selector = '.source.json';
    this.inclusionPriority = 1;
    this.providers = providers;
  }

  _createClass(RootProvider, [{
    key: 'getSuggestions',
    value: function getSuggestions(originalRequest) {
      var _this = this;

      var editor = originalRequest.editor;
      var bufferPosition = originalRequest.bufferPosition;
      var activatedManually = originalRequest.activatedManually;

      if (!this.checkRequest(originalRequest)) {
        return Promise.resolve([]);
      }

      if (editor.lineTextForBufferRow(bufferPosition.row).charAt(bufferPosition.column - 1) === ',' && !activatedManually) {
        return Promise.resolve([]); // hack, to prevent activation right after inserting a comma
      }

      var providers = this.getMatchingProviders(editor.buffer.file);
      if (providers.length === 0) {
        return Promise.resolve([]); // no provider no proposals
      }
      return (0, _tokenizer.tokenize)(editor.getText()).then(function (tokens) {
        return (0, _structureProvider.provideStructure)(tokens, bufferPosition);
      }).then(function (structure) {
        var request = _this.buildRequest(structure, originalRequest);
        return Promise.all(providers.map(function (provider) {
          return provider.getProposals(request);
        })).then(function (proposals) {
          return Array.prototype.concat.apply([], proposals);
        });
      });
    }
  }, {
    key: 'checkRequest',
    value: function checkRequest(request) {
      var editor = request.editor;
      var bufferPosition = request.bufferPosition;

      return Boolean(editor && editor.buffer && editor.buffer.file && editor.buffer.file.getBaseName && editor.lineTextForBufferRow && editor.getText && bufferPosition);
    }
  }, {
    key: 'buildRequest',
    value: function buildRequest(structure, originalRequest) {
      var contents = structure.contents;
      var positionInfo = structure.positionInfo;
      var tokens = structure.tokens;
      var editor = originalRequest.editor;
      var bufferPosition = originalRequest.bufferPosition;

      var shouldAddComma = function shouldAddComma(info) {
        if (!info || !info.nextToken || !tokens || tokens.length === 0) {
          return false;
        }
        if (info.nextToken && (0, _lodashIncludes2['default'])([END_ARRAY, END_OBJECT], info.nextToken.type)) {
          return false;
        }
        return !(info.nextToken && (0, _lodashIncludes2['default'])([END_ARRAY, END_OBJECT], info.nextToken.type)) && info.nextToken.type !== COMMA;
      };

      var prefix = function prefix(info) {
        if (!info || !info.editedToken) {
          return '';
        }
        var length = bufferPosition.column - info.editedToken.col + 1;
        return (0, _lodashTrimStart2['default'])(info.editedToken.src.substr(0, length), '"');
      };

      return {
        contents: contents,
        prefix: prefix(positionInfo),
        segments: positionInfo ? positionInfo.segments : null,
        token: positionInfo ? positionInfo.editedToken ? positionInfo.editedToken.src : null : null,
        isKeyPosition: Boolean(positionInfo && positionInfo.keyPosition),
        isValuePosition: Boolean(positionInfo && positionInfo.valuePosition),
        isBetweenQuotes: Boolean(positionInfo && positionInfo.editedToken && positionInfo.editedToken.type === STRING),
        shouldAddComma: Boolean(shouldAddComma(positionInfo)),
        isFileEmpty: tokens.length === 0,
        editor: editor
      };
    }
  }, {
    key: 'getMatchingProviders',
    value: function getMatchingProviders(file) {
      return this.providers.filter(function (p) {
        return (0, _utils.matches)(file, p.getFilePattern()) || p.getFilePattern() === '*';
      });
    }
  }, {
    key: 'onDidInsertSuggestion',
    value: function onDidInsertSuggestion() {
      // noop for now
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      // noop for now
    }
  }]);

  return RootProvider;
})();

exports['default'] = RootProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcm9vdC1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzhCQUVxQixpQkFBaUI7Ozs7K0JBQ2hCLGtCQUFrQjs7Ozt5QkFFSixhQUFhOztpQ0FDaEIsc0JBQXNCOztxQkFDL0IsU0FBUzs7QUFQakMsV0FBVyxDQUFBOztJQVNILE1BQU0sd0JBQU4sTUFBTTtJQUFFLFVBQVUsd0JBQVYsVUFBVTtJQUFFLFNBQVMsd0JBQVQsU0FBUztJQUFFLEtBQUssd0JBQUwsS0FBSzs7SUFFdkIsWUFBWTtBQUVwQixXQUZRLFlBQVksR0FFSDtRQUFoQixTQUFTLHlEQUFHLEVBQUU7OzBCQUZQLFlBQVk7O0FBRzdCLFFBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUE7QUFDMUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7R0FDM0I7O2VBTmtCLFlBQVk7O1dBUWpCLHdCQUFDLGVBQWUsRUFBRTs7O1VBQ3ZCLE1BQU0sR0FBdUMsZUFBZSxDQUE1RCxNQUFNO1VBQUUsY0FBYyxHQUF1QixlQUFlLENBQXBELGNBQWM7VUFBRSxpQkFBaUIsR0FBSSxlQUFlLENBQXBDLGlCQUFpQjs7QUFFaEQsVUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEVBQUU7QUFDdkMsZUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO09BQzNCOztBQUVELFVBQUksTUFBTSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtBQUNuSCxlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMs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cmkvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Jvb3QtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgaW5jbHVkZXMgZnJvbSAnbG9kYXNoL2luY2x1ZGVzJ1xuaW1wb3J0IHRyaW1TdGFydCBmcm9tICdsb2Rhc2gvdHJpbVN0YXJ0J1xuXG5pbXBvcnQgeyB0b2tlbml6ZSwgVG9rZW5UeXBlIH0gZnJvbSAnLi90b2tlbml6ZXInXG5pbXBvcnQgeyBwcm92aWRlU3RydWN0dXJlIH0gZnJvbSAnLi9zdHJ1Y3R1cmUtcHJvdmlkZXInXG5pbXBvcnQgeyBtYXRjaGVzIH0gZnJvbSAnLi91dGlscydcblxuY29uc3QgeyBTVFJJTkcsIEVORF9PQkpFQ1QsIEVORF9BUlJBWSwgQ09NTUEgfSA9IFRva2VuVHlwZVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb290UHJvdmlkZXIge1xuXG4gIGNvbnN0cnVjdG9yKHByb3ZpZGVycyA9IFtdKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9ICcuc291cmNlLmpzb24nXG4gICAgdGhpcy5pbmNsdXNpb25Qcmlvcml0eSA9IDFcbiAgICB0aGlzLnByb3ZpZGVycyA9IHByb3ZpZGVyc1xuICB9XG5cbiAgZ2V0U3VnZ2VzdGlvbnMob3JpZ2luYWxSZXF1ZXN0KSB7XG4gICAgY29uc3Qge2VkaXRvciwgYnVmZmVyUG9zaXRpb24sIGFjdGl2YXRlZE1hbnVhbGx5fSA9IG9yaWdpbmFsUmVxdWVzdFxuXG4gICAgaWYgKCF0aGlzLmNoZWNrUmVxdWVzdChvcmlnaW5hbFJlcXVlc3QpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKVxuICAgIH1cblxuICAgIGlmIChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coYnVmZmVyUG9zaXRpb24ucm93KS5jaGFyQXQoYnVmZmVyUG9zaXRpb24uY29sdW1uIC0gMSkgPT09ICcsJyAmJiAhYWN0aXZhdGVkTWFudWFsbHkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pIC8vIGhhY2ssIHRvIHByZXZlbnQgYWN0aXZhdGlvbiByaWdodCBhZnRlciBpbnNlcnRpbmcgYSBjb21tYVxuICAgIH1cblxuICAgIGNvbnN0IHByb3ZpZGVycyA9IHRoaXMuZ2V0TWF0Y2hpbmdQcm92aWRlcnMoZWRpdG9yLmJ1ZmZlci5maWxlKVxuICAgIGlmIChwcm92aWRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKSAvLyBubyBwcm92aWRlciBubyBwcm9wb3NhbHNcbiAgICB9XG4gICAgcmV0dXJuIHRva2VuaXplKGVkaXRvci5nZXRUZXh0KCkpXG4gICAgICAudGhlbih0b2tlbnMgPT4gcHJvdmlkZVN0cnVjdHVyZSh0b2tlbnMsIGJ1ZmZlclBvc2l0aW9uKSlcbiAgICAgIC50aGVuKHN0cnVjdHVyZSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLmJ1aWxkUmVxdWVzdChzdHJ1Y3R1cmUsIG9yaWdpbmFsUmVxdWVzdClcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb3ZpZGVycy5tYXAocHJvdmlkZXIgPT4gcHJvdmlkZXIuZ2V0UHJvcG9zYWxzKHJlcXVlc3QpKSlcbiAgICAgICAgICAudGhlbihwcm9wb3NhbHMgPT4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgcHJvcG9zYWxzKSlcbiAgICAgIH0pXG4gIH1cblxuICBjaGVja1JlcXVlc3QocmVxdWVzdCkge1xuICAgIGNvbnN0IHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9ufSA9IHJlcXVlc3RcbiAgICByZXR1cm4gQm9vbGVhbihlZGl0b3JcbiAgICAgICYmIGVkaXRvci5idWZmZXJcbiAgICAgICYmIGVkaXRvci5idWZmZXIuZmlsZVxuICAgICAgJiYgZWRpdG9yLmJ1ZmZlci5maWxlLmdldEJhc2VOYW1lXG4gICAgICAmJiBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3dcbiAgICAgICYmIGVkaXRvci5nZXRUZXh0XG4gICAgICAmJiBidWZmZXJQb3NpdGlvbilcbiAgfVxuXG5cbiAgYnVpbGRSZXF1ZXN0KHN0cnVjdHVyZSwgb3JpZ2luYWxSZXF1ZXN0KSB7XG4gICAgY29uc3Qge2NvbnRlbnRzLCBwb3NpdGlvbkluZm8sIHRva2Vuc30gPSBzdHJ1Y3R1cmVcbiAgICBjb25zdCB7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbn0gPSBvcmlnaW5hbFJlcXVlc3RcblxuICAgIGNvbnN0IHNob3VsZEFkZENvbW1hID0gaW5mbyA9PiB7XG4gICAgICBpZiAoIWluZm8gfHwgIWluZm8ubmV4dFRva2VuIHx8ICF0b2tlbnMgfHwgdG9rZW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmIChpbmZvLm5leHRUb2tlbiAmJiBpbmNsdWRlcyhbRU5EX0FSUkFZLCBFTkRfT0JKRUNUXSwgaW5mby5uZXh0VG9rZW4udHlwZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gIShpbmZvLm5leHRUb2tlbiAmJiBpbmNsdWRlcyhbRU5EX0FSUkFZLCBFTkRfT0JKRUNUXSwgaW5mby5uZXh0VG9rZW4udHlwZSkpICYmIGluZm8ubmV4dFRva2VuLnR5cGUgIT09IENPTU1BXG4gICAgfVxuXG4gICAgY29uc3QgcHJlZml4ID0gaW5mbyA9PiB7XG4gICAgICBpZiAoIWluZm8gfHwgIWluZm8uZWRpdGVkVG9rZW4pIHtcbiAgICAgICAgcmV0dXJuICcnXG4gICAgICB9XG4gICAgICBjb25zdCBsZW5ndGggPSBidWZmZXJQb3NpdGlvbi5jb2x1bW4gLSBpbmZvLmVkaXRlZFRva2VuLmNvbCArIDFcbiAgICAgIHJldHVybiB0cmltU3RhcnQoaW5mby5lZGl0ZWRUb2tlbi5zcmMuc3Vic3RyKDAsIGxlbmd0aCksICdcIicpXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnRzLFxuICAgICAgcHJlZml4OiBwcmVmaXgocG9zaXRpb25JbmZvKSxcbiAgICAgIHNlZ21lbnRzOiBwb3NpdGlvbkluZm8gPyBwb3NpdGlvbkluZm8uc2VnbWVudHMgOiBudWxsLFxuICAgICAgdG9rZW46IHBvc2l0aW9uSW5mbyA/IChwb3NpdGlvbkluZm8uZWRpdGVkVG9rZW4pID8gcG9zaXRpb25JbmZvLmVkaXRlZFRva2VuLnNyYyA6IG51bGwgOiBudWxsLFxuICAgICAgaXNLZXlQb3NpdGlvbjogQm9vbGVhbihwb3NpdGlvbkluZm8gJiYgcG9zaXRpb25JbmZvLmtleVBvc2l0aW9uKSxcbiAgICAgIGlzVmFsdWVQb3NpdGlvbjogQm9vbGVhbihwb3NpdGlvbkluZm8gJiYgcG9zaXRpb25JbmZvLnZhbHVlUG9zaXRpb24pLFxuICAgICAgaXNCZXR3ZWVuUXVvdGVzOiBCb29sZWFuKHBvc2l0aW9uSW5mbyAmJiBwb3NpdGlvbkluZm8uZWRpdGVkVG9rZW4gJiYgcG9zaXRpb25JbmZvLmVkaXRlZFRva2VuLnR5cGUgPT09IFNUUklORyksXG4gICAgICBzaG91bGRBZGRDb21tYTogQm9vbGVhbihzaG91bGRBZGRDb21tYShwb3NpdGlvbkluZm8pKSxcbiAgICAgIGlzRmlsZUVtcHR5OiB0b2tlbnMubGVuZ3RoID09PSAwLFxuICAgICAgZWRpdG9yXG4gICAgfVxuICB9XG5cbiAgZ2V0TWF0Y2hpbmdQcm92aWRlcnMoZmlsZSkge1xuICAgIHJldHVybiB0aGlzLnByb3ZpZGVycy5maWx0ZXIocCA9PiBtYXRjaGVzKGZpbGUsIHAuZ2V0RmlsZVBhdHRlcm4oKSkgfHwgcC5nZXRGaWxlUGF0dGVybigpID09PSAnKicpXG4gIH1cblxuICBvbkRpZEluc2VydFN1Z2dlc3Rpb24oKSB7XG4gICAgLy8gbm9vcCBmb3Igbm93XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIC8vIG5vb3AgZm9yIG5vd1xuICB9XG59XG4iXX0=