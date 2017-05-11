Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashIsEmpty = require('lodash/isEmpty');

var _lodashIsEmpty2 = _interopRequireDefault(_lodashIsEmpty);

var _lodashTrimStart = require('lodash/trimStart');

var _lodashTrimStart2 = _interopRequireDefault(_lodashTrimStart);

var _lodashStartsWith = require('lodash/startsWith');

var _lodashStartsWith2 = _interopRequireDefault(_lodashStartsWith);

var _lodashLast = require('lodash/last');

var _lodashLast2 = _interopRequireDefault(_lodashLast);

var _lodashSortBy = require('lodash/sortBy');

var _lodashSortBy2 = _interopRequireDefault(_lodashSortBy);

var _lodashIncludes = require('lodash/includes');

var _lodashIncludes2 = _interopRequireDefault(_lodashIncludes);

var _utils = require('./utils');

var _path = require('path');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';

var SLASHES = /\\|\//; // slash (/) or backslash (\)

function directoryExists(path) {
  try {
    return _fs2['default'].statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

function listPaths(dir, storageType, fileExtensions) {
  return new Promise(function (resolve, reject) {
    _fs2['default'].readdir(dir, function (error, paths) {
      if (error) {
        reject(error);
      } else {
        var fileInfos = paths.map(function (path) {
          var stats = _fs2['default'].statSync(dir + _path.sep + path); // TODO is it worth asyncing?
          return {
            name: path,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory()
          };
        }).filter(function (file) {
          switch (storageType) {
            case _utils.StorageType.FILE:
              return file.isFile && (!fileExtensions || (0, _lodashIncludes2['default'])(fileExtensions, (0, _path.extname)(file.name)));
            case _utils.StorageType.FOLDER:
              return file.isDirectory;
            default:
              {
                return file.isDirectory || !fileExtensions || (0, _lodashIncludes2['default'])(fileExtensions, (0, _path.extname)(file.name));
              }
          }
        });
        resolve(fileInfos);
      }
    });
  });
}

function containerName(root, segments) {
  // Empty prefix or segments, search in the root folder.
  if ((0, _lodashIsEmpty2['default'])(segments)) {
    return root;
  }
  // Last character is some kind of slash.
  if ((0, _lodashIsEmpty2['default'])((0, _lodashLast2['default'])(segments))) {
    // this means, the last segment was (or should be) a directory.
    var path = root + _path.sep + (0, _lodashTrimStart2['default'])(segments.join(_path.sep), '/\\');
    if (directoryExists(path)) {
      return path;
    }
  } else {
    // Last segment is not a slash, meaning we don't need, what the user typed until the last slash.
    var lastIsPartialFile = root + _path.sep + (0, _lodashTrimStart2['default'])(segments.slice(0, segments.length - 1).join(_path.sep), '/\\');
    if (directoryExists(lastIsPartialFile)) {
      return lastIsPartialFile;
    }
  }
  // User wants completions for non existing directory.
  return null;
}

function prepareFiles(files, request, basePath, segments) {
  var filteredFiles = (0, _lodashIsEmpty2['default'])((0, _lodashLast2['default'])(segments)) ? files : files.filter(function (file) {
    return (0, _lodashStartsWith2['default'])(file.name, (0, _lodashLast2['default'])(segments));
  });
  return (0, _lodashSortBy2['default'])(filteredFiles, function (f) {
    return f.isDirectory ? 0 : 1;
  });
}

function createProposal(file, request, basePath, segments) {
  var proposal = {};
  var text = (function () {
    var proposalText = file.name;
    if (segments.length === 0) {
      proposalText = file.name;
    } else if ((0, _lodashLast2['default'])(segments).length === 0) {
      proposalText = segments.join('/') + file.name;
    } else {
      var withoutPartial = segments.slice(0, segments.length - 1);
      if (withoutPartial.length === 0) {
        proposalText = file.name;
      } else {
        proposalText = segments.slice(0, segments.length - 1).join('/') + '/' + file.name;
      }
    }
    return proposalText + (file.isDirectory ? '/' : '');
  })();

  proposal.replacementPrefix = request.prefix;
  proposal.displayText = file.name;
  proposal.rightLabel = file.isDirectory ? 'folder' : 'file';
  if (request.isBetweenQuotes) {
    proposal.text = text;
  } else {
    proposal.snippet = '"' + text + '$1"';
  }
  proposal.type = proposal.rightLabel;
  return proposal;
}

var FileProposalProvider = (function () {
  function FileProposalProvider(configuration) {
    _classCallCheck(this, FileProposalProvider);

    this.configuration = configuration;
  }

  _createClass(FileProposalProvider, [{
    key: 'getProposals',
    value: function getProposals(request) {
      if (!request.isBetweenQuotes || !this.configuration.getMatcher().matches(request)) {
        return Promise.resolve([]);
      }
      var dir = request.editor.getBuffer().file.getParent().path;
      var prefix = request.prefix;

      var segments = prefix.split(SLASHES);
      var searchDir = containerName(dir, segments);

      if (searchDir === null) {
        return Promise.resolve([]);
      }

      return listPaths(searchDir, this.configuration.getStorageType(), this.configuration.getFileExtensions()).then(function (results) {
        return prepareFiles(results, request, dir, segments).map(function (file) {
          return createProposal(file, request, dir, segments);
        });
      });
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return this.configuration.getFilePattern();
    }
  }]);

  return FileProposalProvider;
})();

exports.FileProposalProvider = FileProposalProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvZmlsZS1wcm9wb3NhbC1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzZCQUVvQixnQkFBZ0I7Ozs7K0JBQ2Qsa0JBQWtCOzs7O2dDQUNqQixtQkFBbUI7Ozs7MEJBQ3pCLGFBQWE7Ozs7NEJBQ1gsZUFBZTs7Ozs4QkFDYixpQkFBaUI7Ozs7cUJBRVYsU0FBUzs7b0JBQ1IsTUFBTTs7a0JBQ3BCLElBQUk7Ozs7QUFYbkIsV0FBVyxDQUFBOztBQWFYLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQTs7QUFFdkIsU0FBUyxlQUFlLENBQUMsSUFBSSxFQUFFO0FBQzdCLE1BQUk7QUFDRixXQUFPLGdCQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtHQUN2QyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsV0FBTyxLQUFLLENBQUE7R0FDYjtDQUNGOztBQUVELFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFO0FBQ25ELFNBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLG9CQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsVUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFLO0FBQ2hDLFVBQUksS0FBSyxFQUFFO0FBQ1QsY0FBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQ2QsTUFBTTtBQUNMLFlBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDbEMsY0FBTSxLQUFLLEdBQUcsZ0JBQUcsUUFBUSxDQUFDLEdBQUcsWUFBTSxHQUFHLElBQUksQ0FBQyxDQUFBO0FBQzNDLGlCQUFPO0FBQ0wsZ0JBQUksRUFBRSxJQUFJO0FBQ1Ysa0JBQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxF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QUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2pGLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtPQUMzQjtBQUNELFVBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQTtVQUNyRCxNQUFNLEdBQUksT0FBTyxDQUFqQixNQUFNOztBQUNiLFVBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDdEMsVUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFFOUMsVUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO0FBQ3RCLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtPQUMzQjs7QUFFRCxhQUFPLFNBQVMsQ0FDZCxTQUFTLEVBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsRUFDbkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxDQUN2QyxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87ZUFBSSxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQzVELEdBQUcsQ0FBQyxVQUFBLElBQUk7aUJBQUksY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQztTQUFBLENBQUM7T0FBQSxDQUFDLENBQUE7S0FDOUQ7OztXQUVhLDBCQUFHO0FBQ2YsYUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxDQUFBO0tBQzNDOzs7U0E3QlUsb0JBQW9CIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvZmlsZS1wcm9wb3NhbC1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBpc0VtcHR5IGZyb20gJ2xvZGFzaC9pc0VtcHR5J1xuaW1wb3J0IHRyaW1TdGFydCBmcm9tICdsb2Rhc2gvdHJpbVN0YXJ0J1xuaW1wb3J0IHN0YXJ0c1dpdGggZnJvbSAnbG9kYXNoL3N0YXJ0c1dpdGgnXG5pbXBvcnQgbGFzdCBmcm9tICdsb2Rhc2gvbGFzdCdcbmltcG9ydCBzb3J0QnkgZnJvbSAnbG9kYXNoL3NvcnRCeSdcbmltcG9ydCBpbmNsdWRlcyBmcm9tICdsb2Rhc2gvaW5jbHVkZXMnXG5cbmltcG9ydCB7IFN0b3JhZ2VUeXBlIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCB7IHNlcCwgZXh0bmFtZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5cbmNvbnN0IFNMQVNIRVMgPSAvXFxcXHxcXC8vIC8vIHNsYXNoICgvKSBvciBiYWNrc2xhc2ggKFxcKVxuXG5mdW5jdGlvbiBkaXJlY3RvcnlFeGlzdHMocGF0aCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcy5zdGF0U3luYyhwYXRoKS5pc0RpcmVjdG9yeSgpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBsaXN0UGF0aHMoZGlyLCBzdG9yYWdlVHlwZSwgZmlsZUV4dGVuc2lvbnMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBmcy5yZWFkZGlyKGRpciwgKGVycm9yLCBwYXRocykgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGZpbGVJbmZvcyA9IHBhdGhzLm1hcChwYXRoID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0cyA9IGZzLnN0YXRTeW5jKGRpciArIHNlcCArIHBhdGgpIC8vIFRPRE8gaXMgaXQgd29ydGggYXN5bmNpbmc/XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IHBhdGgsXG4gICAgICAgICAgICBpc0ZpbGU6IHN0YXRzLmlzRmlsZSgpLFxuICAgICAgICAgICAgaXNEaXJlY3Rvcnk6IHN0YXRzLmlzRGlyZWN0b3J5KClcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZpbHRlcihmaWxlID0+IHtcbiAgICAgICAgICBzd2l0Y2ggKHN0b3JhZ2VUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIFN0b3JhZ2VUeXBlLkZJTEU6XG4gICAgICAgICAgICAgIHJldHVybiBmaWxlLmlzRmlsZSAmJiAoIWZpbGVFeHRlbnNpb25zIHx8IGluY2x1ZGVzKGZpbGVFeHRlbnNpb25zLCBleHRuYW1lKGZpbGUubmFtZSkpKVxuICAgICAgICAgICAgY2FzZSBTdG9yYWdlVHlwZS5GT0xERVI6XG4gICAgICAgICAgICAgIHJldHVybiBmaWxlLmlzRGlyZWN0b3J5XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWxlLmlzRGlyZWN0b3J5IHx8ICFmaWxlRXh0ZW5zaW9ucyB8fCBpbmNsdWRlcyhmaWxlRXh0ZW5zaW9ucywgZXh0bmFtZShmaWxlLm5hbWUpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmVzb2x2ZShmaWxlSW5mb3MpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gY29udGFpbmVyTmFtZShyb290LCBzZWdtZW50cykge1xuICAvLyBFbXB0eSBwcmVmaXggb3Igc2VnbWVudHMsIHNlYXJjaCBpbiB0aGUgcm9vdCBmb2xkZXIuXG4gIGlmIChpc0VtcHR5KHNlZ21lbnRzKSkge1xuICAgIHJldHVybiByb290XG4gIH1cbiAgLy8gTGFzdCBjaGFyYWN0ZXIgaXMgc29tZSBraW5kIG9mIHNsYXNoLlxuICBpZiAoaXNFbXB0eShsYXN0KHNlZ21lbnRzKSkpIHtcbiAgICAvLyB0aGlzIG1lYW5zLCB0aGUgbGFzdCBzZWdtZW50IHdhcyAob3Igc2hvdWxkIGJlKSBhIGRpcmVjdG9yeS5cbiAgICBjb25zdCBwYXRoID0gcm9vdCArIHNlcCArIHRyaW1TdGFydChzZWdtZW50cy5qb2luKHNlcCksICcvXFxcXCcpXG4gICAgaWYgKGRpcmVjdG9yeUV4aXN0cyhwYXRoKSkge1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gTGFzdCBzZWdtZW50IGlzIG5vdCBhIHNsYXNoLCBtZWFuaW5nIHdlIGRvbid0IG5lZWQsIHdoYXQgdGhlIHVzZXIgdHlwZWQgdW50aWwgdGhlIGxhc3Qgc2xhc2guXG4gICAgY29uc3QgbGFzdElzUGFydGlhbEZpbGUgPSByb290ICsgc2VwICsgdHJpbVN0YXJ0KHNlZ21lbnRzLnNsaWNlKDAsIHNlZ21lbnRzLmxlbmd0aCAtIDEpLmpvaW4oc2VwKSwgJy9cXFxcJylcbiAgICBpZiAoZGlyZWN0b3J5RXhpc3RzKGxhc3RJc1BhcnRpYWxGaWxlKSkge1xuICAgICAgcmV0dXJuIGxhc3RJc1BhcnRpYWxGaWxlXG4gICAgfVxuICB9XG4gIC8vIFVzZXIgd2FudHMgY29tcGxldGlvbnMgZm9yIG5vbiBleGlzdGluZyBkaXJlY3RvcnkuXG4gIHJldHVybiBudWxsXG59XG5cbmZ1bmN0aW9uIHByZXBhcmVGaWxlcyhmaWxlcywgcmVxdWVzdCwgYmFzZVBhdGgsIHNlZ21lbnRzKSB7XG4gIGNvbnN0IGZpbHRlcmVkRmlsZXMgPSBpc0VtcHR5KGxhc3Qoc2VnbWVudHMpKVxuICAgID8gZmlsZXNcbiAgICA6IGZpbGVzLmZpbHRlcihmaWxlID0+IHN0YXJ0c1dpdGgoZmlsZS5uYW1lLCBsYXN0KHNlZ21lbnRzKSkpXG4gIHJldHVybiBzb3J0QnkoZmlsdGVyZWRGaWxlcywgZiA9PiBmLmlzRGlyZWN0b3J5ID8gMCA6IDEpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVByb3Bvc2FsKGZpbGUsIHJlcXVlc3QsIGJhc2VQYXRoLCBzZWdtZW50cykge1xuICBjb25zdCBwcm9wb3NhbCA9IHt9XG4gIGNvbnN0IHRleHQgPSAoKCkgPT4ge1xuICAgIGxldCBwcm9wb3NhbFRleHQgPSBmaWxlLm5hbWVcbiAgICBpZiAoc2VnbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBwcm9wb3NhbFRleHQgPSBmaWxlLm5hbWVcbiAgICB9IGVsc2UgaWYgKGxhc3Qoc2VnbWVudHMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcHJvcG9zYWxUZXh0ID0gc2VnbWVudHMuam9pbignLycpICsgZmlsZS5uYW1lXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHdpdGhvdXRQYXJ0aWFsID0gc2VnbWVudHMuc2xpY2UoMCwgc2VnbWVudHMubGVuZ3RoIC0gMSlcbiAgICAgIGlmICh3aXRob3V0UGFydGlhbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcHJvcG9zYWxUZXh0ID0gZmlsZS5uYW1lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9wb3NhbFRleHQgPSBgJHtzZWdtZW50cy5zbGljZSgwLCBzZWdtZW50cy5sZW5ndGggLSAxKS5qb2luKCcvJyl9LyR7ZmlsZS5uYW1lfWBcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3Bvc2FsVGV4dCArIChmaWxlLmlzRGlyZWN0b3J5ID8gJy8nIDogJycpXG4gIH0pKClcblxuICBwcm9wb3NhbC5yZXBsYWNlbWVudFByZWZpeCA9IHJlcXVlc3QucHJlZml4XG4gIHByb3Bvc2FsLmRpc3BsYXlUZXh0ID0gZmlsZS5uYW1lXG4gIHByb3Bvc2FsLnJpZ2h0TGFiZWwgPSBmaWxlLmlzRGlyZWN0b3J5ID8gJ2ZvbGRlcicgOiAnZmlsZSdcbiAgaWYgKHJlcXVlc3QuaXNCZXR3ZWVuUXVvdGVzKSB7XG4gICAgcHJvcG9zYWwudGV4dCA9IHRleHRcbiAgfSBlbHNlIHtcbiAgICBwcm9wb3NhbC5zbmlwcGV0ID0gYFwiJHt0ZXh0fSQxXCJgXG4gIH1cbiAgcHJvcG9zYWwudHlwZSA9IHByb3Bvc2FsLnJpZ2h0TGFiZWxcbiAgcmV0dXJuIHByb3Bvc2FsXG59XG5cbmV4cG9ydCBjbGFzcyBGaWxlUHJvcG9zYWxQcm92aWRlciB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb25cbiAgfVxuXG4gIGdldFByb3Bvc2FscyhyZXF1ZXN0KSB7XG4gICAgaWYgKCFyZXF1ZXN0LmlzQmV0d2VlblF1b3RlcyB8fCAhdGhpcy5jb25maWd1cmF0aW9uLmdldE1hdGNoZXIoKS5tYXRjaGVzKHJlcXVlc3QpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKVxuICAgIH1cbiAgICBjb25zdCBkaXIgPSByZXF1ZXN0LmVkaXRvci5nZXRCdWZmZXIoKS5maWxlLmdldFBhcmVudCgpLnBhdGhcbiAgICBjb25zdCB7cHJlZml4fSA9IHJlcXVlc3RcbiAgICBjb25zdCBzZWdtZW50cyA9IHByZWZpeC5zcGxpdChTTEFTSEVTKVxuICAgIGNvbnN0IHNlYXJjaERpciA9IGNvbnRhaW5lck5hbWUoZGlyLCBzZWdtZW50cylcblxuICAgIGlmIChzZWFyY2hEaXIgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pXG4gICAgfVxuXG4gICAgcmV0dXJuIGxpc3RQYXRocyhcbiAgICAgIHNlYXJjaERpcixcbiAgICAgIHRoaXMuY29uZmlndXJhdGlvbi5nZXRTdG9yYWdlVHlwZSgpLFxuICAgICAgdGhpcy5jb25maWd1cmF0aW9uLmdldEZpbGVFeHRlbnNpb25zKClcbiAgICApLnRoZW4ocmVzdWx0cyA9PiBwcmVwYXJlRmlsZXMocmVzdWx0cywgcmVxdWVzdCwgZGlyLCBzZWdtZW50cylcbiAgICAgIC5tYXAoZmlsZSA9PiBjcmVhdGVQcm9wb3NhbChmaWxlLCByZXF1ZXN0LCBkaXIsIHNlZ21lbnRzKSkpXG4gIH1cblxuICBnZXRGaWxlUGF0dGVybigpIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uLmdldEZpbGVQYXR0ZXJuKClcbiAgfVxufVxuIl19