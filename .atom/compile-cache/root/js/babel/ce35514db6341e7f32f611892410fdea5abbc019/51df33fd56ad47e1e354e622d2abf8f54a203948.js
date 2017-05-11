Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashTrimStart = require('lodash/trimStart');

var _lodashTrimStart2 = _interopRequireDefault(_lodashTrimStart);

var _lodashStartsWith = require('lodash/startsWith');

var _lodashStartsWith2 = _interopRequireDefault(_lodashStartsWith);

'use babel';

function createDependencyProposal(request, dependency) {
  var isBetweenQuotes = request.isBetweenQuotes;
  var shouldAddComma = request.shouldAddComma;

  var proposal = {};
  proposal.displayText = dependency.name;
  proposal.rightLabel = 'dependency';
  proposal.type = 'property';
  proposal.description = dependency.description;
  if (isBetweenQuotes) {
    proposal.text = dependency.name;
  } else {
    proposal.snippet = '"' + dependency.name + '": "$1"' + (shouldAddComma ? ',' : '');
  }
  return proposal;
}

function createVersionProposal(request, version) {
  var isBetweenQuotes = request.isBetweenQuotes;
  var shouldAddComma = request.shouldAddComma;
  var prefix = request.prefix;

  var proposal = {};
  proposal.displayText = version;
  proposal.rightLabel = 'version';
  proposal.type = 'value';
  proposal.replacementPrefix = (0, _lodashTrimStart2['default'])(prefix, '~^<>="');
  if (isBetweenQuotes) {
    proposal.text = version;
  } else {
    proposal.snippet = '"' + version + '"' + (shouldAddComma ? ',' : '');
  }
  return proposal;
}

var SemverDependencyProposalProvider = (function () {
  function SemverDependencyProposalProvider(config) {
    _classCallCheck(this, SemverDependencyProposalProvider);

    this.config = config;
  }

  _createClass(SemverDependencyProposalProvider, [{
    key: 'getProposals',
    value: function getProposals(request) {
      if (this.config.dependencyRequestMatcher().matches(request)) {
        return this.getDependencyKeysProposals(request);
      }
      if (this.config.versionRequestMatcher().matches(request)) {
        return this.getDependencyVersionsProposals(request);
      }
      return Promise.resolve([]);
    }
  }, {
    key: 'getDependencyKeysProposals',
    value: function getDependencyKeysProposals(request) {
      var prefix = request.prefix;

      var dependencyFilter = this.config.getDependencyFilter(request);
      return this.config.search(prefix).then(function (packages) {
        return packages.filter(function (dependency) {
          return dependencyFilter(dependency.name);
        }).map(function (dependency) {
          return createDependencyProposal(request, dependency);
        });
      });
    }
  }, {
    key: 'getDependencyVersionsProposals',
    value: function getDependencyVersionsProposals(request) {
      var segments = request.segments;
      var prefix = request.prefix;

      var _segments = _slicedToArray(segments, 2);

      var packageName = _segments[1];

      var trimmedPrefix = (0, _lodashTrimStart2['default'])(prefix, '~^<>="');
      return this.config.versions(packageName.toString()).then(function (versions) {
        return versions.filter(function (version) {
          return (0, _lodashStartsWith2['default'])(version, trimmedPrefix);
        }).map(function (version) {
          return createVersionProposal(request, version);
        });
      });
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return this.config.getFilePattern();
    }
  }]);

  return SemverDependencyProposalProvider;
})();

exports.SemverDependencyProposalProvider = SemverDependencyProposalProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvc2VtdmVyLWRlcGVuZGVuY3ktcHJvcG9zYWwtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OytCQUVzQixrQkFBa0I7Ozs7Z0NBQ2pCLG1CQUFtQjs7OztBQUgxQyxXQUFXLENBQUE7O0FBS1gsU0FBUyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFO01BQzlDLGVBQWUsR0FBb0IsT0FBTyxDQUExQyxlQUFlO01BQUUsY0FBYyxHQUFJLE9BQU8sQ0FBekIsY0FBYzs7QUFDdEMsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFVBQVEsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQTtBQUN0QyxVQUFRLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQTtBQUNsQyxVQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQTtBQUMxQixVQUFRLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUE7QUFDN0MsTUFBSSxlQUFlLEVBQUU7QUFDbkIsWUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFBO0dBQ2hDLE1BQU07QUFDTCxZQUFRLENBQUMsT0FBTyxTQUFPLFVBQVUsQ0FBQyxJQUFJLGdCQUFVLGNBQWMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFBLEFBQUUsQ0FBQTtHQUM1RTtBQUNELFNBQU8sUUFBUSxDQUFBO0NBQ2hCOztBQUVELFNBQVMscUJBQXFCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRTtNQUN4QyxlQUFlLEdBQTRCLE9BQU8sQ0FBbEQsZUFBZTtNQUFFLGNBQWMsR0FBWSxPQUFPLENBQWpDLGNBQWM7TUFBRSxNQUFNLEdBQUksT0FBTyxDQUFqQixNQUFNOztBQUM5QyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbkIsVUFBUSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUE7QUFDOUIsVUFBUSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUE7QUFDL0IsVUFBUSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUE7QUFDdkIsVUFBUSxDQUFDLGlCQUFpQixHQUFHLGtDQUFVLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUN4RCxNQUFJLGVBQWUsRUFBRTtBQUNuQixZQUFRLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQTtHQUN4QixNQUFNO0FBQ0wsWUFBUSxDQUFDLE9BQU8sU0FBTyxPQUFPLFVBQUksY0FBYyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUEsQUFBRSxDQUFBO0dBQzlEO0FBQ0QsU0FBTyxRQUFRLENBQUE7Q0FDaEI7O0lBR1ksZ0NBQWdDO0FBRWhDLFdBRkEsZ0NBQWdDLENBRS9CLE1BQU0sRUFBRTswQkFGVCxnQ0FBZ0M7O0FBR3pDLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0dBQ3JCOztlQUpVLGdDQUFnQzs7V0FNL0Isc0JBQUMsT0FBTyxFQUFFO0FBQ3BCLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUMzRCxlQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtPQUNoRDtBQUNELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN4RCxlQUFPLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtPQUNwRDtBQUNELGFBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUMzQjs7O1dBRXlCLG9DQUFDLE9BQU8sRUFBRTtVQUMzQixNQUFNLEdBQUksT0FBTyxDQUFqQixNQUFNOztBQUNiLFVBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNqRSxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7ZUFDN0MsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLFVBQVU7aUJBQUksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztTQUFBLENBQUMsQ0FDN0QsR0FBRyxDQUFDLFVBQUEsVUFBVTtpQkFBSSx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO1NBQUEsQ0FBQztPQUFBLENBQ3BFLENBQUE7S0FDRjs7O1dBRTZCLHdDQUFDLE9BQU8sRUFBRTtVQUMvQixRQUFRLEdBQVksT0FBTyxDQUEzQixRQUFRO1VBQUUsTUFBTSxHQUFJLE9BQU8sQ0FBakIsTUFBTTs7cUNBQ0MsUUFBUTs7VUFBdkIsV0FBVzs7QUFDcEIsVUFBTSxhQUFhLEdBQUcsa0NBQVUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQ2pELGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUTtlQUMvRCxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUEsT0FBTztpQkFBSSxtQ0FBVyxPQUFPLEVBQUUsYUFBYSxDQUFDO1NBQUEsQ0FBQyxDQUMzRCxHQUFHLENBQUMsVUFBQSxPQUFPO2lCQUFJLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7U0FBQSxDQUFDO09BQUEsQ0FDM0QsQ0FBQTtLQUNGOzs7V0FFYSwwQkFBRztBQUNmLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQTtLQUNwQzs7O1NBckNVLGdDQUFnQyIsImZpbGUiOiIvaG9tZS95b3NoaW5vcml5YW1hZ3VjaGkvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3NlbXZlci1kZXBlbmRlbmN5LXByb3Bvc2FsLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHRyaW1TdGFydCBmcm9tICdsb2Rhc2gvdHJpbVN0YXJ0J1xuaW1wb3J0IHN0YXJ0c1dpdGggZnJvbSAnbG9kYXNoL3N0YXJ0c1dpdGgnXG5cbmZ1bmN0aW9uIGNyZWF0ZURlcGVuZGVuY3lQcm9wb3NhbChyZXF1ZXN0LCBkZXBlbmRlbmN5KSB7XG4gIGNvbnN0IHtpc0JldHdlZW5RdW90ZXMsIHNob3VsZEFkZENvbW1hfSA9IHJlcXVlc3RcbiAgY29uc3QgcHJvcG9zYWwgPSB7fVxuICBwcm9wb3NhbC5kaXNwbGF5VGV4dCA9IGRlcGVuZGVuY3kubmFtZVxuICBwcm9wb3NhbC5yaWdodExhYmVsID0gJ2RlcGVuZGVuY3knXG4gIHByb3Bvc2FsLnR5cGUgPSAncHJvcGVydHknXG4gIHByb3Bvc2FsLmRlc2NyaXB0aW9uID0gZGVwZW5kZW5jeS5kZXNjcmlwdGlvblxuICBpZiAoaXNCZXR3ZWVuUXVvdGVzKSB7XG4gICAgcHJvcG9zYWwudGV4dCA9IGRlcGVuZGVuY3kubmFtZVxuICB9IGVsc2Uge1xuICAgIHByb3Bvc2FsLnNuaXBwZXQgPSBgXCIke2RlcGVuZGVuY3kubmFtZX1cIjogXCIkMVwiJHtzaG91bGRBZGRDb21tYSA/ICcsJyA6ICcnfWBcbiAgfVxuICByZXR1cm4gcHJvcG9zYWxcbn1cblxuZnVuY3Rpb24gY3JlYXRlVmVyc2lvblByb3Bvc2FsKHJlcXVlc3QsIHZlcnNpb24pIHtcbiAgY29uc3Qge2lzQmV0d2VlblF1b3Rlcywgc2hvdWxkQWRkQ29tbWEsIHByZWZpeH0gPSByZXF1ZXN0XG4gIGNvbnN0IHByb3Bvc2FsID0ge31cbiAgcHJvcG9zYWwuZGlzcGxheVRleHQgPSB2ZXJzaW9uXG4gIHByb3Bvc2FsLnJpZ2h0TGFiZWwgPSAndmVyc2lvbidcbiAgcHJvcG9zYWwudHlwZSA9ICd2YWx1ZSdcbiAgcHJvcG9zYWwucmVwbGFjZW1lbnRQcmVmaXggPSB0cmltU3RhcnQocHJlZml4LCAnfl48Pj1cIicpXG4gIGlmIChpc0JldHdlZW5RdW90ZXMpIHtcbiAgICBwcm9wb3NhbC50ZXh0ID0gdmVyc2lvblxuICB9IGVsc2Uge1xuICAgIHByb3Bvc2FsLnNuaXBwZXQgPSBgXCIke3ZlcnNpb259XCIke3Nob3VsZEFkZENvbW1hID8gJywnIDogJyd9YFxuICB9XG4gIHJldHVybiBwcm9wb3NhbFxufVxuXG5cbmV4cG9ydCBjbGFzcyBTZW12ZXJEZXBlbmRlbmN5UHJvcG9zYWxQcm92aWRlciB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWdcbiAgfVxuXG4gIGdldFByb3Bvc2FscyhyZXF1ZXN0KSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLmRlcGVuZGVuY3lSZXF1ZXN0TWF0Y2hlcigpLm1hdGNoZXMocmVxdWVzdCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldERlcGVuZGVuY3lLZXlzUHJvcG9zYWxzKHJlcXVlc3QpXG4gICAgfVxuICAgIGlmICh0aGlzLmNvbmZpZy52ZXJzaW9uUmVxdWVzdE1hdGNoZXIoKS5tYXRjaGVzKHJlcXVlc3QpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZXBlbmRlbmN5VmVyc2lvbnNQcm9wb3NhbHMocmVxdWVzdClcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSlcbiAgfVxuXG4gIGdldERlcGVuZGVuY3lLZXlzUHJvcG9zYWxzKHJlcXVlc3QpIHtcbiAgICBjb25zdCB7cHJlZml4fSA9IHJlcXVlc3RcbiAgICBjb25zdCBkZXBlbmRlbmN5RmlsdGVyID0gdGhpcy5jb25maWcuZ2V0RGVwZW5kZW5jeUZpbHRlcihyZXF1ZXN0KVxuICAgIHJldHVybiB0aGlzLmNvbmZpZy5zZWFyY2gocHJlZml4KS50aGVuKHBhY2thZ2VzID0+XG4gICAgICBwYWNrYWdlcy5maWx0ZXIoZGVwZW5kZW5jeSA9PiBkZXBlbmRlbmN5RmlsdGVyKGRlcGVuZGVuY3kubmFtZSkpXG4gICAgICAgIC5tYXAoZGVwZW5kZW5jeSA9PiBjcmVhdGVEZXBlbmRlbmN5UHJvcG9zYWwocmVxdWVzdCwgZGVwZW5kZW5jeSkpXG4gICAgKVxuICB9XG5cbiAgZ2V0RGVwZW5kZW5jeVZlcnNpb25zUHJvcG9zYWxzKHJlcXVlc3QpIHtcbiAgICBjb25zdCB7c2VnbWVudHMsIHByZWZpeH0gPSByZXF1ZXN0XG4gICAgY29uc3QgWywgcGFja2FnZU5hbWVdID0gc2VnbWVudHNcbiAgICBjb25zdCB0cmltbWVkUHJlZml4ID0gdHJpbVN0YXJ0KHByZWZpeCwgJ35ePD49XCInKVxuICAgIHJldHVybiB0aGlzLmNvbmZpZy52ZXJzaW9ucyhwYWNrYWdlTmFtZS50b1N0cmluZygpKS50aGVuKHZlcnNpb25zID0+XG4gICAgICB2ZXJzaW9ucy5maWx0ZXIodmVyc2lvbiA9PiBzdGFydHNXaXRoKHZlcnNpb24sIHRyaW1tZWRQcmVmaXgpKVxuICAgICAgICAubWFwKHZlcnNpb24gPT4gY3JlYXRlVmVyc2lvblByb3Bvc2FsKHJlcXVlc3QsIHZlcnNpb24pKVxuICAgIClcbiAgfVxuXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5nZXRGaWxlUGF0dGVybigpXG4gIH1cbn1cbiJdfQ==