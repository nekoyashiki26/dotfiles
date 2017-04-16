Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashStartsWith = require('lodash/startsWith');

var _lodashStartsWith2 = _interopRequireDefault(_lodashStartsWith);

var _matchers = require('../../matchers');

var _npmPackageLookup = require('npm-package-lookup');

'use babel';

var PLUGINS = 'plugins';
var BABEL_PLUGIN = 'babel-plugin-';

var PRESET_MATCHER = (0, _matchers.request)().value().path((0, _matchers.path)().key(PLUGINS).index());

var BabelRCPluginsProposalProvider = (function () {
  function BabelRCPluginsProposalProvider() {
    _classCallCheck(this, BabelRCPluginsProposalProvider);
  }

  _createClass(BabelRCPluginsProposalProvider, [{
    key: 'getProposals',
    value: function getProposals(req) {
      var _this = this;

      var contents = req.contents;
      var prefix = req.prefix;
      var isBetweenQuotes = req.isBetweenQuotes;
      var shouldAddComma = req.shouldAddComma;

      if (PRESET_MATCHER.matches(req)) {
        var _ret = (function () {
          var plugins = contents[PLUGINS] || [];
          var results = (0, _npmPackageLookup.search)(_this.calculateSearchKeyword(prefix));
          return {
            v: results.then(function (names) {
              return names.filter(function (name) {
                return plugins.indexOf(name.replace(BABEL_PLUGIN, '')) < 0;
              }).map(function (pluginName) {
                var name = pluginName.replace(BABEL_PLUGIN, '');
                var proposal = {};
                proposal.displayText = name;
                proposal.rightLabel = 'plugin';
                proposal.type = 'plugin';
                proposal.description = name + ' babel plugin. Required dependency in package.json: ' + pluginName;
                if (isBetweenQuotes) {
                  proposal.text = name;
                } else {
                  proposal.snippet = '"' + name + '"' + (shouldAddComma ? ',' : '');
                }
                return proposal;
              });
            })
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }
      return Promise.resolve([]);
    }
  }, {
    key: 'calculateSearchKeyword',
    value: function calculateSearchKeyword(prefix) {
      if ((0, _lodashStartsWith2['default'])(BABEL_PLUGIN, prefix)) {
        return BABEL_PLUGIN;
      } else if ((0, _lodashStartsWith2['default'])(prefix, BABEL_PLUGIN)) {
        return prefix;
      }
      return BABEL_PLUGIN + prefix;
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return '.babelrc';
    }
  }]);

  return BabelRCPluginsProposalProvider;
})();

exports['default'] = BabelRCPluginsProposalProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL2JhYmVscmMvYmFiZWxyYy1wbHVnaW5zLXByb3Bvc2FsLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Z0NBRXVCLG1CQUFtQjs7Ozt3QkFFWixnQkFBZ0I7O2dDQUN2QixvQkFBb0I7O0FBTDNDLFdBQVcsQ0FBQTs7QUFPWCxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUE7QUFDekIsSUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFBOztBQUVwQyxJQUFNLGNBQWMsR0FBRyx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBOztJQUVyRCw4QkFBOEI7V0FBOUIsOEJBQThCOzBCQUE5Qiw4QkFBOEI7OztlQUE5Qiw4QkFBOEI7O1dBQ3JDLHNCQUFDLEdBQUcsRUFBRTs7O1VBQ1IsUUFBUSxHQUE2QyxHQUFHLENBQXhELFFBQVE7VUFBRSxNQUFNLEdBQXFDLEdBQUcsQ0FBOUMsTUFBTTtVQUFFLGVBQWUsR0FBb0IsR0FBRyxDQUF0QyxlQUFlO1VBQUUsY0FBYyxHQUFJLEdBQUcsQ0FBckIsY0FBYzs7QUFDekQsVUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFOztBQUMvQixjQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ3ZDLGNBQU0sT0FBTyxHQUFHLDhCQUFPLE1BQUssc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUMzRDtlQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQSxLQUFLO3FCQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJO3VCQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDO2VBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUN2SCxvQkFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDakQsb0JBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNuQix3QkFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7QUFDM0Isd0JBQVEsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFBO0FBQzlCLHdCQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQTtBQUN4Qix3QkFBUSxDQUFDLFdBQVcsR0FBTSxJQUFJLDREQUF1RCxVQUFVLEFBQUUsQ0FBQTtBQUNqRyxvQkFBSSxlQUFlLEVBQUU7QUFDbkIsMEJBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO2lCQUNyQixNQUFNO0FBQ0wsMEJBQVEsQ0FBQyxPQUFPLFNBQU8sSUFBSSxVQUFJLGNBQWMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFBLEFBQUUsQ0FBQTtpQkFDM0Q7QUFDRCx1QkFBTyxRQUFRLENBQUE7ZUFDaEIsQ0FBQzthQUFBLENBQUM7WUFBQTs7OztPQUNKO0FBQ0QsYUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0tBQzNCOzs7V0FFcUIsZ0NBQUMsTUFBTSxFQUFFO0FBQzdCLFVBQUksbUNBQVcsWUFBWSxFQUFFLE1BQU0sQ0FBQyxFQUFFO0FBQ3BDLGVBQU8sWUFBWSxDQUFBO09BQ3BCLE1BQU0sSUFBSSxtQ0FBVyxNQUFNLEVBQUUsWUFBWSxDQUFDLEVBQUU7QUFDM0MsZUFBTyxNQUFNLENBQUE7T0FDZDtBQUNELGFBQU8sWUFBWSxHQUFHLE1BQU0sQ0FBQTtLQUU3Qjs7O1dBRWEsMEJBQUc7QUFDZixhQUFPLFVBQVUsQ0FBQTtLQUNsQjs7O1NBcENrQiw4QkFBOEI7OztxQkFBOUIsOEJBQThCIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL2JhYmVscmMvYmFiZWxyYy1wbHVnaW5zLXByb3Bvc2FsLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHN0YXJ0c1dpdGggZnJvbSAnbG9kYXNoL3N0YXJ0c1dpdGgnXG5cbmltcG9ydCB7IHBhdGgsIHJlcXVlc3QgfSBmcm9tICcuLi8uLi9tYXRjaGVycydcbmltcG9ydCB7IHNlYXJjaCB9IGZyb20gJ25wbS1wYWNrYWdlLWxvb2t1cCdcblxuY29uc3QgUExVR0lOUyA9ICdwbHVnaW5zJ1xuY29uc3QgQkFCRUxfUExVR0lOID0gJ2JhYmVsLXBsdWdpbi0nXG5cbmNvbnN0IFBSRVNFVF9NQVRDSEVSID0gcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KFBMVUdJTlMpLmluZGV4KCkpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhYmVsUkNQbHVnaW5zUHJvcG9zYWxQcm92aWRlciB7XG4gIGdldFByb3Bvc2FscyhyZXEpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRzLCBwcmVmaXgsIGlzQmV0d2VlblF1b3Rlcywgc2hvdWxkQWRkQ29tbWF9ID0gcmVxXG4gICAgaWYgKFBSRVNFVF9NQVRDSEVSLm1hdGNoZXMocmVxKSkge1xuICAgICAgY29uc3QgcGx1Z2lucyA9IGNvbnRlbnRzW1BMVUdJTlNdIHx8IFtdXG4gICAgICBjb25zdCByZXN1bHRzID0gc2VhcmNoKHRoaXMuY2FsY3VsYXRlU2VhcmNoS2V5d29yZChwcmVmaXgpKVxuICAgICAgcmV0dXJuIHJlc3VsdHMudGhlbihuYW1lcyA9PiBuYW1lcy5maWx0ZXIobmFtZSA9PiBwbHVnaW5zLmluZGV4T2YobmFtZS5yZXBsYWNlKEJBQkVMX1BMVUdJTiwgJycpKSA8IDApLm1hcChwbHVnaW5OYW1lID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHBsdWdpbk5hbWUucmVwbGFjZShCQUJFTF9QTFVHSU4sICcnKVxuICAgICAgICBjb25zdCBwcm9wb3NhbCA9IHt9XG4gICAgICAgIHByb3Bvc2FsLmRpc3BsYXlUZXh0ID0gbmFtZVxuICAgICAgICBwcm9wb3NhbC5yaWdodExhYmVsID0gJ3BsdWdpbidcbiAgICAgICAgcHJvcG9zYWwudHlwZSA9ICdwbHVnaW4nXG4gICAgICAgIHByb3Bvc2FsLmRlc2NyaXB0aW9uID0gYCR7bmFtZX0gYmFiZWwgcGx1Z2luLiBSZXF1aXJlZCBkZXBlbmRlbmN5IGluIHBhY2thZ2UuanNvbjogJHtwbHVnaW5OYW1lfWBcbiAgICAgICAgaWYgKGlzQmV0d2VlblF1b3Rlcykge1xuICAgICAgICAgIHByb3Bvc2FsLnRleHQgPSBuYW1lXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvcG9zYWwuc25pcHBldCA9IGBcIiR7bmFtZX1cIiR7c2hvdWxkQWRkQ29tbWEgPyAnLCcgOiAnJ31gXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb3Bvc2FsXG4gICAgICB9KSlcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSlcbiAgfVxuXG4gIGNhbGN1bGF0ZVNlYXJjaEtleXdvcmQocHJlZml4KSB7XG4gICAgaWYgKHN0YXJ0c1dpdGgoQkFCRUxfUExVR0lOLCBwcmVmaXgpKSB7XG4gICAgICByZXR1cm4gQkFCRUxfUExVR0lOXG4gICAgfSBlbHNlIGlmIChzdGFydHNXaXRoKHByZWZpeCwgQkFCRUxfUExVR0lOKSkge1xuICAgICAgcmV0dXJuIHByZWZpeFxuICAgIH1cbiAgICByZXR1cm4gQkFCRUxfUExVR0lOICsgcHJlZml4XG5cbiAgfVxuXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiAnLmJhYmVscmMnXG4gIH1cbn1cbiJdfQ==