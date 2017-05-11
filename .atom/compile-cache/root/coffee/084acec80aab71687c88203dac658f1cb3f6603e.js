(function() {
  var CharacterRegexpUtil, JapaneseWrapManager, UnicodeUtil;

  UnicodeUtil = require("./unicode-util");

  CharacterRegexpUtil = require("./character-regexp-util");

  module.exports = JapaneseWrapManager = (function() {
    JapaneseWrapManager.characterClasses = require("./character-classes");

    function JapaneseWrapManager() {
      var configName, configNameList, i, len, name;
      this.setupCharRegexp();
      configNameList = ['characterWidth.greekAndCoptic', 'characterWidth.cyrillic', 'lineBreakingRule.halfwidthKatakana', 'lineBreakingRule.ideographicSpaceAsWihteSpace'];
      for (i = 0, len = configNameList.length; i < len; i++) {
        name = configNameList[i];
        configName = 'japanese-wrap.' + name;
        atom.config.observe(configName, (function(_this) {
          return function(newValue) {
            return _this.setupCharRegexp();
          };
        })(this));
      }
      this.lineBreakingRuleJapanese = atom.config.get('japanese-wrap.lineBreakingRule.japanese');
      atom.config.observe('japanese-wrap.lineBreakingRule.japanese', (function(_this) {
        return function(newValue) {
          return _this.lineBreakingRuleJapanese = newValue;
        };
      })(this));
    }

    JapaneseWrapManager.prototype.setupCharRegexp = function() {
      var cyrillic_size, greek_size, halfWidthCharList, hankaku, notEndingCharList, notStartingCharList;
      if (atom.config.get('japanese-wrap.lineBreakingRule.ideographicSpaceAsWihteSpace')) {
        this.whitespaceCharRegexp = /\s/;
      } else {
        this.whitespaceCharRegexp = /[\t\n\v\f\r \u00a0\u2000-\u200b\u2028\u2029]/;
      }
      hankaku = atom.config.get('japanese-wrap.lineBreakingRule.halfwidthKatakana');
      greek_size = atom.config.get('japanese-wrap.characterWidth.greekAndCoptic');
      cyrillic_size = atom.config.get('japanese-wrap.characterWidth.cyrillic');
      this.wordCharRegexp = CharacterRegexpUtil.string2regexp(JapaneseWrapManager.characterClasses["Western characters"]);
      notStartingCharList = [JapaneseWrapManager.characterClasses["Closing brackets"], JapaneseWrapManager.characterClasses["Hyphens"], JapaneseWrapManager.characterClasses["Dividing punctuation marks"], JapaneseWrapManager.characterClasses["Middle dots"], JapaneseWrapManager.characterClasses["Full stops"], JapaneseWrapManager.characterClasses["Commas"], JapaneseWrapManager.characterClasses["Iteration marks"], JapaneseWrapManager.characterClasses["Prolonged sound mark"], JapaneseWrapManager.characterClasses["Small kana"], CharacterRegexpUtil.range2string(UnicodeUtil.lowSurrogateRange)];
      if (hankaku) {
        notStartingCharList.push(JapaneseWrapManager.characterClasses["Closing brackets HANKAKU"], JapaneseWrapManager.characterClasses["Middle dots HANKAKU"], JapaneseWrapManager.characterClasses["Full stops HANKAKU"], JapaneseWrapManager.characterClasses["Commas HANKAKU"], JapaneseWrapManager.characterClasses["Prolonged sound mark HANKAKU"], JapaneseWrapManager.characterClasses["Small kana HANKAKU"]);
      }
      this.notStartingCharRexgep = CharacterRegexpUtil.string2regexp.apply(CharacterRegexpUtil, notStartingCharList);
      notEndingCharList = [JapaneseWrapManager.characterClasses["Opening brackets"], CharacterRegexpUtil.range2string(UnicodeUtil.highSurrogateRange)];
      if (hankaku) {
        notEndingCharList.push(JapaneseWrapManager.characterClasses["Opening brackets HANKAKU"]);
      }
      this.notEndingCharRegexp = CharacterRegexpUtil.string2regexp.apply(CharacterRegexpUtil, notEndingCharList);
      this.zeroWidthCharRegexp = CharacterRegexpUtil.string2regexp("\\u200B-\\u200F", CharacterRegexpUtil.range2string(UnicodeUtil.lowSurrogateRange), "\\uFEFF", CharacterRegexpUtil.range2string.apply(CharacterRegexpUtil, UnicodeUtil.getRangeListByName("Combining")), "゙゚");
      halfWidthCharList = [CharacterRegexpUtil.range2string.apply(CharacterRegexpUtil, UnicodeUtil.getRangeListByName("Latin")), "\\u2000-\\u200A", "\\u2122", "\\uFF61-\\uFFDC"];
      if (greek_size === 1) {
        halfWidthCharList.push(CharacterRegexpUtil.range2string.apply(CharacterRegexpUtil, UnicodeUtil.getRangeListByName("Greek")));
      }
      if (cyrillic_size === 1) {
        halfWidthCharList.push(CharacterRegexpUtil.range2string.apply(CharacterRegexpUtil, UnicodeUtil.getRangeListByName("Cyrillic")));
      }
      return this.halfWidthCharRegexp = CharacterRegexpUtil.string2regexp.apply(CharacterRegexpUtil, halfWidthCharList);
    };

    JapaneseWrapManager.prototype.overwriteFindWrapColumn = function(displayBuffer) {
      var firstTokenizedLine, tokenizedLineClass;
      firstTokenizedLine = displayBuffer.tokenizedBuffer.tokenizedLineForRow(0);
      if (firstTokenizedLine == null) {
        console.log("displayBuffer has no line.");
        return;
      }
      tokenizedLineClass = firstTokenizedLine.__proto__;
      if (tokenizedLineClass.japaneseWrapManager == null) {
        tokenizedLineClass.japaneseWrapManager = this;
        tokenizedLineClass.originalFindWrapColumn = tokenizedLineClass.findWrapColumn;
        return tokenizedLineClass.findWrapColumn = function(maxColumn) {
          if (!((this.text.length * 2) > maxColumn)) {
            return;
          }
          return this.japaneseWrapManager.findJapaneseWrapColumn(this.text, maxColumn);
        };
      }
    };

    JapaneseWrapManager.prototype.restoreFindWrapColumn = function(displayBuffer) {
      var firstTokenizedLine, tokenizedLineClass;
      firstTokenizedLine = displayBuffer.tokenizedBuffer.tokenizedLineForRow(0);
      if (firstTokenizedLine == null) {
        console.log("displayBuffer has no line.");
        return;
      }
      tokenizedLineClass = firstTokenizedLine.__proto__;
      if (tokenizedLineClass.japaneseWrapManager != null) {
        tokenizedLineClass.findWrapColumn = tokenizedLineClass.originalFindWrapColumn;
        tokenizedLineClass.originalFindWrapColumn = void 0;
        return tokenizedLineClass.japaneseWrapManager = void 0;
      }
    };

    JapaneseWrapManager.prototype.findJapaneseWrapColumn = function(line, softWrapColumn) {
      var column, cutable, i, j, k, ref, ref1, ref2, ref3, size, wrapColumn;
      if (!(softWrapColumn != null) || softWrapColumn < 1) {
        return;
      }
      size = 0;
      for (wrapColumn = i = 0, ref = line.length; 0 <= ref ? i < ref : i > ref; wrapColumn = 0 <= ref ? ++i : --i) {
        if (this.zeroWidthCharRegexp.test(line[wrapColumn])) {
          continue;
        } else if (this.halfWidthCharRegexp.test(line[wrapColumn])) {
          size = size + 1;
        } else {
          size = size + 2;
        }
        if (size > softWrapColumn) {
          if (this.lineBreakingRuleJapanese) {
            column = this.searchBackwardNotEndingColumn(line, wrapColumn);
            if (column != null) {
              return column;
            }
            column = this.searchForwardWhitespaceCutableColumn(line, wrapColumn);
            if (column == null) {
              cutable = false;
            } else if (column === wrapColumn) {
              cutable = true;
            } else {
              return column;
            }
            return this.searchBackwardCutableColumn(line, wrapColumn, cutable, this.wordCharRegexp.test(line[wrapColumn]));
          } else {
            if (this.wordCharRegexp.test(line[wrapColumn])) {
              for (column = j = ref1 = wrapColumn; ref1 <= 0 ? j <= 0 : j >= 0; column = ref1 <= 0 ? ++j : --j) {
                if (!this.wordCharRegexp.test(line[column])) {
                  return column + 1;
                }
              }
              return wrapColumn;
            } else {
              for (column = k = ref2 = wrapColumn, ref3 = line.length; ref2 <= ref3 ? k <= ref3 : k >= ref3; column = ref2 <= ref3 ? ++k : --k) {
                if (!this.whitespaceCharRegexp.test(line[column])) {
                  return column;
                }
              }
              return line.length;
            }
          }
        }
      }
    };

    JapaneseWrapManager.prototype.searchBackwardNotEndingColumn = function(line, wrapColumn) {
      var column, foundNotEndingColumn, i, ref;
      foundNotEndingColumn = null;
      for (column = i = ref = wrapColumn - 1; ref <= 0 ? i <= 0 : i >= 0; column = ref <= 0 ? ++i : --i) {
        if (this.whitespaceCharRegexp.test(line[column])) {
          continue;
        } else if (this.notEndingCharRegexp.test(line[column])) {
          foundNotEndingColumn = column;
        } else {
          return foundNotEndingColumn;
        }
      }
    };

    JapaneseWrapManager.prototype.searchForwardWhitespaceCutableColumn = function(line, wrapColumn) {
      var column, i, ref, ref1;
      for (column = i = ref = wrapColumn, ref1 = line.length; ref <= ref1 ? i < ref1 : i > ref1; column = ref <= ref1 ? ++i : --i) {
        if (!this.whitespaceCharRegexp.test(line[column])) {
          if (this.notStartingCharRexgep.test(line[column])) {
            return null;
          } else {
            return column;
          }
        }
      }
      return line.length;
    };

    JapaneseWrapManager.prototype.searchBackwardCutableColumn = function(line, wrapColumn, cutable, preWord) {
      var column, i, preColumn, ref;
      for (column = i = ref = wrapColumn - 1; ref <= 0 ? i <= 0 : i >= 0; column = ref <= 0 ? ++i : --i) {
        if (this.whitespaceCharRegexp.test(line[column])) {
          if (cutable || preWord) {
            preColumn = this.searchBackwardNotEndingColumn(line, column);
            if (preColumn != null) {
              preColumn;
            } else {
              return column + 1;
            }
          }
        } else if (this.notEndingCharRegexp.test(line[column])) {
          cutable = true;
          if (this.wordCharRegexp.test(line[column])) {
            preWord = true;
          } else {
            preWord = false;
          }
        } else if (this.notStartingCharRexgep.test(line[column])) {
          if (cutable || preWord) {
            return column + 1;
          } else {
            cutable = false;
            if (this.wordCharRegexp.test(line[column])) {
              preWord = true;
            } else {
              preWord = false;
            }
          }
        } else if (this.wordCharRegexp.test(line[column])) {
          if ((!preWord) && cutable) {
            return column + 1;
          } else {
            preWord = true;
          }
        } else {
          if (cutable || preWord) {
            return column + 1;
          } else {
            cutable = true;
            preWord = false;
          }
        }
      }
      return wrapColumn;
    };

    return JapaneseWrapManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLXdyYXAvbGliL2phcGFuZXNlLXdyYXAtbWFuYWdlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBQ2QsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSOztFQUV0QixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ0osbUJBQUMsQ0FBQSxnQkFBRCxHQUFvQixPQUFBLENBQVEscUJBQVI7O0lBRVAsNkJBQUE7QUFDWCxVQUFBO01BQUEsSUFBQyxDQUFBLGVBQUQsQ0FBQTtNQUVBLGNBQUEsR0FBaUIsQ0FLZiwrQkFMZSxFQU1mLHlCQU5lLEVBUWYsb0NBUmUsRUFTZiwrQ0FUZTtBQVdqQixXQUFBLGdEQUFBOztRQUNFLFVBQUEsR0FBYSxnQkFBQSxHQUFtQjtRQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsVUFBcEIsRUFBZ0MsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxRQUFEO21CQUM5QixLQUFDLENBQUEsZUFBRCxDQUFBO1VBRDhCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQztBQUZGO01BSUEsSUFBQyxDQUFBLHdCQUFELEdBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlDQUFoQjtNQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQix5Q0FBcEIsRUFDSSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsUUFBRDtpQkFDRSxLQUFDLENBQUEsd0JBQUQsR0FBNEI7UUFEOUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREo7SUFwQlc7O2tDQXdCYixlQUFBLEdBQWlCLFNBQUE7QUFHZixVQUFBO01BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFD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QSxDQUExQixDQUFIO2NBQ0UsT0FBQSxHQUFVLEtBRFo7YUFBQSxNQUFBO2NBR0UsT0FBQSxHQUFVLE1BSFo7YUFKRjtXQURHO1NBQUEsTUFTQSxJQUFHLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsSUFBSyxDQUFBLE1BQUEsQ0FBMUIsQ0FBSDtVQUNILElBQUcsQ0FBQyxDQUFFLE9BQUgsQ0FBQSxJQUFnQixPQUFuQjtBQUNFLG1CQUFPLE1BQUEsR0FBUyxFQURsQjtXQUFBLE1BQUE7WUFHRSxPQUFBLEdBQVUsS0FIWjtXQURHO1NBQUEsTUFBQTtVQU1ILElBQUcsT0FBQSxJQUFXLE9BQWQ7QUFDRSxtQkFBTyxNQUFBLEdBQVMsRUFEbEI7V0FBQSxNQUFBO1lBR0UsT0FBQSxHQUFVO1lBQ1YsT0FBQSxHQUFVLE1BSlo7V0FORzs7QUF2QlA7QUFrQ0EsYUFBTztJQW5Db0I7Ozs7O0FBblAvQiIsInNvdXJjZXNDb250ZW50IjpbIlVuaWNvZGVVdGlsID0gcmVxdWlyZSBcIi4vdW5pY29kZS11dGlsXCJcbkNoYXJhY3RlclJlZ2V4cFV0aWwgPSByZXF1aXJlIFwiLi9jaGFyYWN0ZXItcmVnZXhwLXV0aWxcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBKYXBhbmVzZVdyYXBNYW5hZ2VyXG4gIEBjaGFyYWN0ZXJDbGFzc2VzID0gcmVxdWlyZSBcIi4vY2hhcmFjdGVyLWNsYXNzZXNcIlxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBzZXR1cENoYXJSZWdleHAoKVxuXG4gICAgY29uZmlnTmFtZUxpc3QgPSBbXG4gICAgICAjJ+WFqOinkuWPpeiqreeCueOBtuOCieS4i+OBkicsXG4gICAgICAjJ+WNiuinkuWPpeiqreeCueOBtuOCieS4i+OBkicsXG4gICAgICAjJ+WFqOinkuODlOODquOCquODiS/jgrPjg7Pjg57jgbbjgonkuIvjgZInLFxuICAgICAgIyfljYrop5Ljg5Tjg6rjgqrjg4kv44Kz44Oz44Oe44G244KJ5LiL44GSJyxcbiAgICAgICdjaGFyYWN0ZXJXaWR0aC5ncmVla0FuZENvcHRpYycsXG4gICAgICAnY2hhcmFjdGVyV2lkdGguY3lyaWxsaWMnLFxuICAgICAgIyAnQVNDSUnmloflrZfjgpLnpoHliYflh6bnkIbjgavlkKvjgoHjgosnLFxuICAgICAgJ2xpbmVCcmVha2luZ1J1bGUuaGFsZndpZHRoS2F0YWthbmEnLFxuICAgICAgJ2xpbmVCcmVha2luZ1J1bGUuaWRlb2dyYXBoaWNTcGFjZUFzV2lodGVTcGFjZScsXG4gICAgXVxuICAgIGZvciBuYW1lIGluIGNvbmZpZ05hbWVMaXN0XG4gICAgICBjb25maWdOYW1lID0gJ2phcGFuZXNlLXdyYXAuJyArIG5hbWVcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUgY29uZmlnTmFtZSwgKG5ld1ZhbHVlKSA9PlxuICAgICAgICBAc2V0dXBDaGFyUmVnZXhwKClcbiAgICBAbGluZUJyZWFraW5nUnVsZUphcGFuZXNlID1cbiAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdqYXBhbmVzZS13cmFwLmxpbmVCcmVha2luZ1J1bGUuamFwYW5lc2UnKVxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ2phcGFuZXNlLXdyYXAubGluZUJyZWFraW5nUnVsZS5qYXBhbmVzZScsXG4gICAgICAgIChuZXdWYWx1ZSkgPT5cbiAgICAgICAgICBAbGluZUJyZWFraW5nUnVsZUphcGFuZXNlID0gbmV3VmFsdWVcblxuICBzZXR1cENoYXJSZWdleHA6IC0+XG4gICAgIyBkZWJ1Z1xuICAgICNjb25zb2xlLmxvZyhcInJ1biBzZXR1cENoYXJSZWdleHBcIilcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2phcGFuZXNlLXdyYXAubGluZUJyZWFraW5nUnVsZS5pZGVvZ3JhcGhpY1NwYWNlQXNXaWh0ZVNwYWNlJylcbiAgICAgIEB3aGl0ZXNwYWNlQ2hhclJlZ2V4cCA9IC9cXHMvXG4gICAgZWxzZVxuICAgICAgIyBOb3QgaW5jdWRlICfjgIAnKFUrMzAwMClcbiAgICAgIEB3aGl0ZXNwYWNlQ2hhclJlZ2V4cCA9IC9bXFx0XFxuXFx2XFxmXFxyIFxcdTAwYTBcXHUyMDAwLVxcdTIwMGJcXHUyMDI4XFx1MjAyOV0vXG5cbiAgICAjYXNjaWkgPSBhdG9tLmNvbmZpZy5nZXQoJ2phcGFuZXNlLXdyYXAuQVNDSUnmloflrZfjgpLnpoHliYflh6bnkIbjgavlkKvjgoHjgosnKVxuICAgIGhhbmtha3UgPSBhdG9tLmNvbmZpZy5nZXQoJ2phcGFuZXNlLXdyYXAubGluZUJyZWFraW5nUnVsZS5oYWxmd2lkdGhLYXRha2FuYScpXG4gICAgZ3JlZWtfc2l6ZSA9IGF0b20uY29uZmlnLmdldCgnamFwYW5lc2Utd3JhcC5jaGFyYWN0ZXJXaWR0aC5ncmVla0FuZENvcHRpYycpXG4gICAgY3lyaWxsaWNfc2l6ZSA9IGF0b20uY29uZmlnLmdldCgnamFwYW5lc2Utd3JhcC5jaGFyYWN0ZXJXaWR0aC5jeXJpbGxpYycpXG5cbiAgICAjIHdvcmQgY2hhcmF0ZXJcbiAgICBAd29yZENoYXJSZWdleHAgPSBDaGFyYWN0ZXJSZWdleHBVdGlsLnN0cmluZzJyZWdleHAoXG4gICAgICAgIEphcGFuZXNlV3JhcE1hbmFnZXIuY2hhcmFjdGVyQ2xhc3Nlc1tcIldlc3Rlcm4gY2hhcmFjdGVyc1wiXSlcblxuICAgICMgQ2hhcmFjdGVycyBOb3QgU3RhcnRpbmcgYSBMaW5lIGFuZCBMb3cgU3Vycm9nYXRlXG4gICAgIyBUT0RPOiBhZGQg5r+B6Z+zL+WNiua/gemfs1xuICAgICMgVE9ETzogYWRkIGNvbWJpbmVcbiAgICBub3RTdGFydGluZ0NoYXJMaXN0ID0gW1xuICAgICAgSmFwYW5lc2VXcmFwTWFuYWdlci5jaGFyYWN0ZXJDbGFzc2VzW1wiQ2xvc2luZyBicmFja2V0c1wiXSxcbiAgICAgIEphcGFuZXNlV3JhcE1hbmFnZXIuY2hhcmFjdGVyQ2xhc3Nlc1tcIkh5cGhlbnNcIl0sXG4gICAgICBKYXBhbmVzZVdyYXBNYW5hZ2VyLmNoYXJhY3RlckNsYXNzZXNbXCJEaXZpZGluZyBwdW5jdHVhdGlvbiBtYXJrc1wiXSxcbiAgICAgIEphcGFuZXNlV3JhcE1hbmFnZXIuY2hhcmFjdGVyQ2xhc3Nlc1tcIk1pZGRsZSBkb3RzXCJdLFxuICAgICAgSmFwYW5lc2VXcmFwTWFuYWdlci5jaGFyYWN0ZXJDbGFzc2VzW1wiRnVsbCBzdG9wc1wiXSxcbiAgICAgIEphcGFuZXNlV3JhcE1hbmFnZXIuY2hhcmFjdGVyQ2xhc3Nlc1tcIkNvbW1hc1wiXSxcbiAgICAgIEphcGFuZXNlV3JhcE1hbmFnZXIuY2hhcmFjdGVyQ2xhc3Nlc1tcIkl0ZXJhdGlvbiBtYXJrc1wiXSxcbiAgICAgIEphcGFuZXNlV3JhcE1hbmFnZXIuY2hhcmFjdGVyQ2xhc3Nlc1tcIlByb2xvbmdlZCBzb3VuZCBtYXJrXCJdLFxuICAgICAgSmFwYW5lc2VXcmFwTWFuYWdlci5jaGFyYWN0ZXJDbGFzc2VzW1wiU21hbGwga2FuYVwiXSxcbiAgICAgIENoYXJhY3RlclJlZ2V4cFV0aWwucmFuZ2Uyc3RyaW5nKFVuaWNvZGVVdGlsLmxvd1N1cnJvZ2F0ZVJhbmdlKSxcbiAgICBdXG4gICAgIyBUT0RPXG4gICAgI2lmIGFzY2lpXG4gICAgIyAgbm90U3RhcnRpbmdDaGFyTGlzdC5wdXNoKFxuICAgICMgICAgQ2hhcmFjdGVyUmVnZXhwVXRpbC5lc2NhcGVBc2NpaShcbiAgICAjICAgICAgSmFwYW5lc2VXcmFwTWFuYWdlci5jaGFyYWN0ZXJDbGFzc2VzW1wiQ2xvc2luZyBicmFja2V0cyBBU0NJSVwiXSksXG4gICAgIyAgICBDaGFyYWN0ZXJSZWdleHBVdGlsLmVzY2FwZUFzY2lpKFxuICAgICMgICAgICBKYXBhbmVzZVdyYXBNYW5hZ2VyLmNoYXJhY3RlckNsYXNzZXNbXCJEaXZpZGluZyBwdW5jdHVhdGlvbiBtYXJrcyBBU0NJSVwiXSksXG4gICAgIyAgICBDaGFyYWN0ZXJSZWdleHBVdGlsLmVzY2FwZUFzY2lpKFxuICAgICMgICAgICBKYXBhbmVzZVdyYXBNYW5hZ2VyLmNoYXJhY3RlckNsYXNzZXNbXCJGdWxsIHN0b3BzIEFTQ0lJXCJdKSxcbiAgICAjICAgIENoYXJhY3RlclJlZ2V4cFV0aWwuZXNjYXBlQXNjaWkoXG4gICAgIyAgICAgIEphcGFuZXNlV3JhcE1hbmFnZXIuY2hhcmFjdGVyQ2xhc3Nlc1tcIkNvbW1hcyBBU0NJSVwiXSksXG4gICAgIyAgKVxuICAgIGlmIGhhbmtha3VcbiAgICAgIG5vdFN0YXJ0aW5nQ2hhckxpc3QucHVzaChcbiAgICAgICAgSmFwYW5lc2VXcmFwTWFuYWdlci5jaGFyYWN0ZXJDbGFzc2VzW1wiQ2xvc2luZyBicmFja2V0cyBIQU5LQUtVXCJdLFxuICAgICAgICBKYXBhbmVzZVdyYXBNYW5hZ2VyLmNoYXJhY3RlckNsYXNzZXNbXCJNaWRkbGUgZG90cyBIQU5LQUtVXCJdLFxuICAgICAgICBKYXBhbmVzZVdyYXBNYW5hZ2VyLmNoYXJhY3RlckNsYXNzZXNbXCJGdWxsIHN0b3BzIEhBTktBS1VcIl0sXG4gICAgICAgIEphcGFuZXNlV3JhcE1hbmFnZXIuY2hhcmFjdGVyQ2xhc3Nlc1tcIkNvbW1hcyBIQU5LQUtVXCJdLFxuICAgICAgICBKYXBhbmVzZVdyYXBNYW5hZ2VyLmNoYXJhY3RlckNsYXNzZXNbXCJQcm9sb25nZWQgc291bmQgbWFyayBIQU5LQUtVXCJdLFxuICAgICAgICBKYXBhbmVzZVdyYXBNYW5hZ2VyLmNoYXJhY3RlckNsYXNzZXNbXCJTbWFsbCBrYW5hIEhBTktBS1VcIl0sXG4gICAgICApXG4gICAgQG5vdFN0YXJ0aW5nQ2hhclJleGdlcCA9XG4gICAgICAgIENoYXJhY3RlclJlZ2V4cFV0aWwuc3RyaW5nMnJlZ2V4cChub3RTdGFydGluZ0NoYXJMaXN0Li4uKVxuXG4gICAgIyBDaGFyYWN0ZXJzIE5vdCBFbmRpbmcgYSBMaW5lIGFuZCBIaWdoIFN1cnJvZ2F0ZVxuICAgIG5vdEVuZGluZ0NoYXJMaXN0ID0gW1xuICAgICAgSmFwYW5lc2VXcmFwTWFuYWdlci5jaGFyYWN0ZXJDbGFzc2VzW1wiT3BlbmluZyBicmFja2V0c1wiXSxcbiAgICAgIENoYXJhY3RlclJlZ2V4cFV0aWwucmFuZ2Uyc3RyaW5nKFVuaWNvZGVVdGlsLmhpZ2hTdXJyb2dhdGVSYW5nZSksXG4gICAgXVxuICAgICMgVE9ET1xuICAgICNpZiBhc2NpaVxuICAgICMgIG5vdEVuZGluZ0NoYXJMaXN0LnB1c2goXG4gICAgIyAgICBDaGFyYWN0ZXJSZWdleHBVdGlsLmVzY2FwZUFzY2lpKFxuICAgICMgICAgICBKYXBhbmVzZVdyYXBNYW5hZ2VyLmNoYXJhY3RlckNsYXNzZXNbXCJPcGVuaW5nIGJyYWNrZXRzIEFTQ0lJXCJdKSxcbiAgICAjICApXG4gICAgaWYgaGFua2FrdVxuICAgICAgbm90RW5kaW5nQ2hhckxpc3QucHVzaChcbiAgICAgICAgSmFwYW5lc2VXcmFwTWFuYWdlci5jaGFyYWN0ZXJDbGFzc2VzW1wiT3BlbmluZyBicmFja2V0cyBIQU5LQUtVXCJdLFxuICAgICAgKVxuICAgIEBub3RFbmRpbmdDaGFyUmVnZXhwID1cbiAgICAgICAgQ2hhcmFjdGVyUmVnZXhwVXRpbC5zdHJpbmcycmVnZXhwKG5vdEVuZGluZ0NoYXJMaXN0Li4uKVxuXG4gICAgIyBDaGFyYWN0ZXIgV2lkdGhcbiAgICBAemVyb1dpZHRoQ2hhclJlZ2V4cCA9IENoYXJhY3RlclJlZ2V4cFV0aWwuc3RyaW5nMnJlZ2V4cChcbiAgICAgICAgXCJcXFxcdTIwMEItXFxcXHUyMDBGXCIsXG4gICAgICAgIENoYXJhY3RlclJlZ2V4cFV0aWwucmFuZ2Uyc3RyaW5nKFVuaWNvZGVVdGlsLmxvd1N1cnJvZ2F0ZVJhbmdlKSxcbiAgICAgICAgXCJcXFxcdUZFRkZcIixcbiAgICAgICAgQ2hhcmFjdGVyUmVnZXhwVXRpbC5yYW5nZTJzdHJpbmcoXG4gICAgICAgICAgICBVbmljb2RlVXRpbC5nZXRSYW5nZUxpc3RCeU5hbWUoXCJDb21iaW5pbmdcIikuLi4pLFxuICAgICAgICBcIuOCmeOCmlwiLCAjIFUrMzA5OSwgVSszMDlBXG4gICAgKVxuXG4gICAgaGFsZldpZHRoQ2hhckxpc3QgPSBbXG4gICAgICBDaGFyYWN0ZXJSZWdleHBVdGlsLnJhbmdlMnN0cmluZyhcbiAgICAgICAgICBVbmljb2RlVXRpbC5nZXRSYW5nZUxpc3RCeU5hbWUoXCJMYXRpblwiKS4uLiksXG4gICAgICBcIlxcXFx1MjAwMC1cXFxcdTIwMEFcIixcbiAgICAgIFwiXFxcXHUyMTIyXCIsXG4gICAgICBcIlxcXFx1RkY2MS1cXFxcdUZGRENcIixcbiAgICBdXG4gICAgaWYgZ3JlZWtfc2l6ZSA9PSAxXG4gICAgICBoYWxmV2lkdGhDaGFyTGlzdC5wdXNoKENoYXJhY3RlclJlZ2V4cFV0aWwucmFuZ2Uyc3RyaW5nKFxuICAgICAgICAgIFVuaWNvZGVVdGlsLmdldFJhbmdlTGlzdEJ5TmFtZShcIkdyZWVrXCIpLi4uKSlcbiAgICBpZiBjeXJpbGxpY19zaXplID09IDFcbiAgICAgIGhhbGZXaWR0aENoYXJMaXN0LnB1c2goQ2hhcmFjdGVyUmVnZXhwVXRpbC5yYW5nZTJzdHJpbmcoXG4gICAgICAgICAgVW5pY29kZVV0aWwuZ2V0UmFuZ2VMaXN0QnlOYW1lKFwiQ3lyaWxsaWNcIikuLi4pKVxuICAgIEBoYWxmV2lkdGhDaGFyUmVnZXhwID1cbiAgICAgICAgQ2hhcmFjdGVyUmVnZXhwVXRpbC5zdHJpbmcycmVnZXhwKGhhbGZXaWR0aENoYXJMaXN0Li4uKVxuICAgICMgL1tcXHUwMDAwLVxcdTAzNkZcXHUyMDAwLVxcdTIwMDBBXFx1MjEyMlxcdUQ4MDAtXFx1RDgzRl0vXG4gICAgIyBAZnVsbFdpZHRoQ2hhciA9IC9bXlxcdTAwMDAtXFx1MDM2RlxcdUZGNjEtXFx1RkZEQ10vXG5cbiAgICAjIExpbmUgQWRqdXN0bWVudCBieSBIYW5naW5nIFB1bmN0dWF0aW9uXG4gICAgIyBUT0RPOiAwLjIuMS4uLlxuICAgICNAaGFuZ2luZ1B1bmN0dWF0aW9uQ2hhclJlZ2V4cCA9IENoYXJhY3RlclJlZ2V4cFV0aWwuc3RyaW5nMnJlZ2V4cChcbiAgICAjICAgIEphcGFuZXNlV3JhcE1hbmFnZXIuY2hhcmFjdGVyQ2xhc3Nlc1tcIkZ1bGwgc3RvcHNcIl0sXG4gICAgIyAgICBKYXBhbmVzZVdyYXBNYW5hZ2VyLmNoYXJhY3RlckNsYXNzZXNbXCJDb21tYXNcIl0pXG5cbiAgIyBvdmVyd3JpdGUgZmluZFdyYXBDb2x1bW4oKVxuICBvdmVyd3JpdGVGaW5kV3JhcENvbHVtbjogKGRpc3BsYXlCdWZmZXIpIC0+XG4gICAgIyBkaXNwbGF5QnVmZmVyIGhhcyBvbmUgbGluZSBhdCBsZWFzdCwgc28gbGluZTowIHNob3VsZCBleGlzdC5cbiAgICBmaXJzdFRva2VuaXplZExpbmUgPSBkaXNwbGF5QnVmZmVyLnRva2VuaXplZEJ1ZmZlci50b2tlbml6ZWRMaW5lRm9yUm93KDApXG4gICAgdW5sZXNzIGZpcnN0VG9rZW5pemVkTGluZT9cbiAgICAgIGNvbnNvbGUubG9nKFwiZGlzcGxheUJ1ZmZlciBoYXMgbm8gbGluZS5cIilcbiAgICAgIHJldHVyblxuXG4gICAgIyB0b2tlbml6ZWRMaW5lQ2xhc3MgPSBmaXJzdFRva2VuaXplZExpbmUuY29uc3RydWN0b3I6OlxuICAgIHRva2VuaXplZExpbmVDbGFzcyA9IGZpcnN0VG9rZW5pemVkTGluZS5fX3Byb3RvX19cblxuICAgIHVubGVzcyB0b2tlbml6ZWRMaW5lQ2xhc3MuamFwYW5lc2VXcmFwTWFuYWdlcj9cbiAgICAgIHRva2VuaXplZExpbmVDbGFzcy5qYXBhbmVzZVdyYXBNYW5hZ2VyID0gQFxuICAgICAgdG9rZW5pemVkTGluZUNsYXNzLm9yaWdpbmFsRmluZFdyYXBDb2x1bW4gPVxuICAgICAgICAgIHRva2VuaXplZExpbmVDbGFzcy5maW5kV3JhcENvbHVtblxuICAgICAgdG9rZW5pemVkTGluZUNsYXNzLmZpbmRXcmFwQ29sdW1uID0gKG1heENvbHVtbikgLT5cbiAgICAgICAgIyBJZiBhbGwgY2hhcmFjdGVycyBhcmUgZnVsbCB3aWR0aCwgdGhlIHdpZHRoIGlzIHR3aWNlIHRoZSBsZW5ndGguXG4gICAgICAgIHJldHVybiB1bmxlc3MgKEB0ZXh0Lmxlbmd0aCAqIDIpID4gbWF4Q29sdW1uXG4gICAgICAgIHJldHVybiBAamFwYW5lc2VXcmFwTWFuYWdlci5maW5kSmFwYW5lc2VXcmFwQ29sdW1uKEB0ZXh0LCBtYXhDb2x1bW4pXG5cbiAgIyByZXN0b3JlIGZpbmRXcmFwQ29sdW1uKClcbiAgcmVzdG9yZUZpbmRXcmFwQ29sdW1uOiAoZGlzcGxheUJ1ZmZlcikgLT5cbiAgICAjIGRpc3BsYXlCdWZmZXIgaGFzIG9uZSBsaW5lIGF0IGxlYXN0LCBzbyBsaW5lOjAgc2hvdWxkIGV4aXN0LlxuICAgIGZpcnN0VG9rZW5pemVkTGluZSA9IGRpc3BsYXlCdWZmZXIudG9rZW5pemVkQnVmZmVyLnRva2VuaXplZExpbmVGb3JSb3coMClcbiAgICB1bmxlc3MgZmlyc3RUb2tlbml6ZWRMaW5lP1xuICAgICAgY29uc29sZS5sb2coXCJkaXNwbGF5QnVmZmVyIGhhcyBubyBsaW5lLlwiKVxuICAgICAgcmV0dXJuXG5cbiAgICAjIHRva2VuaXplZExpbmVDbGFzcyA9IGZpcnN0VG9rZW5pemVkTGluZS5jb25zdHJ1Y3Rvcjo6XG4gICAgdG9rZW5pemVkTGluZUNsYXNzID0gZmlyc3RUb2tlbml6ZWRMaW5lLl9fcHJvdG9fX1xuXG4gICAgaWYgdG9rZW5pemVkTGluZUNsYXNzLmphcGFuZXNlV3JhcE1hbmFnZXI/XG4gICAgICB0b2tlbml6ZWRMaW5lQ2xhc3MuZmluZFdyYXBDb2x1bW4gPVxuICAgICAgICAgIHRva2VuaXplZExpbmVDbGFzcy5vcmlnaW5hbEZpbmRXcmFwQ29sdW1uXG4gICAgICB0b2tlbml6ZWRMaW5lQ2xhc3Mub3JpZ2luYWxGaW5kV3JhcENvbHVtbiA9IHVuZGVmaW5lZFxuICAgICAgdG9rZW5pemVkTGluZUNsYXNzLmphcGFuZXNlV3JhcE1hbmFnZXIgPSB1bmRlZmluZWRcblxuICAjIEphcGFuZXNlIFdyYXAgQ29sdW1uXG4gIGZpbmRKYXBhbmVzZVdyYXBDb2x1bW46IChsaW5lLCBzb2Z0V3JhcENvbHVtbikgLT5cbiAgICAjIGZvciBkZWJ1Z1xuICAgICMgY29uc29sZS5sb2coXCIje3NvZnRXcmFwQ29sdW1ufToje2xpbmV9XCIpXG4gICAgcmV0dXJuIGlmICEoc29mdFdyYXBDb2x1bW4/KSBvciBzb2Z0V3JhcENvbHVtbiA8IDFcbiAgICBzaXplID0gMFxuICAgIGZvciB3cmFwQ29sdW1uIGluIFswLi4ubGluZS5sZW5ndGhdXG4gICAgICBpZiBAemVyb1dpZHRoQ2hhclJlZ2V4cC50ZXN0KGxpbmVbd3JhcENvbHVtbl0pXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICBlbHNlIGlmIEBoYWxmV2lkdGhDaGFyUmVnZXhwLnRlc3QobGluZVt3cmFwQ29sdW1uXSlcbiAgICAgICAgc2l6ZSA9IHNpemUgKyAxXG4gICAgICBlbHNlXG4gICAgICAgIHNpemUgPSBzaXplICsgMlxuXG4gICAgICBpZiBzaXplID4gc29mdFdyYXBDb2x1bW5cbiAgICAgICAgaWYgQGxpbmVCcmVha2luZ1J1bGVKYXBhbmVzZVxuICAgICAgICAgIGNvbHVtbiA9IEBzZWFyY2hCYWNrd2FyZE5vdEVuZGluZ0NvbHVtbihsaW5lLCB3cmFwQ29sdW1uKVxuICAgICAgICAgIGlmIGNvbHVtbj9cbiAgICAgICAgICAgIHJldHVybiBjb2x1bW5cblxuICAgICAgICAgIGNvbHVtbiA9IEBzZWFyY2hGb3J3YXJkV2hpdGVzcGFjZUN1dGFibGVDb2x1bW4obGluZSwgd3JhcENvbHVtbilcbiAgICAgICAgICBpZiBub3QgY29sdW1uP1xuICAgICAgICAgICAgY3V0YWJsZSA9IGZhbHNlXG4gICAgICAgICAgZWxzZSBpZiBjb2x1bW4gPT0gd3JhcENvbHVtblxuICAgICAgICAgICAgY3V0YWJsZSA9IHRydWVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gY29sdW1uXG5cbiAgICAgICAgICByZXR1cm4gQHNlYXJjaEJhY2t3YXJkQ3V0YWJsZUNvbHVtbihcbiAgICAgICAgICAgICAgbGluZSxcbiAgICAgICAgICAgICAgd3JhcENvbHVtbixcbiAgICAgICAgICAgICAgY3V0YWJsZSxcbiAgICAgICAgICAgICAgQHdvcmRDaGFyUmVnZXhwLnRlc3QobGluZVt3cmFwQ29sdW1uXSkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBAd29yZENoYXJSZWdleHAudGVzdChsaW5lW3dyYXBDb2x1bW5dKVxuICAgICAgICAgICAgIyBzZWFyY2ggYmFja3dhcmQgZm9yIHRoZSBzdGFydCBvZiB0aGUgd29yZCBvbiB0aGUgYm91bmRhcnlcbiAgICAgICAgICAgIGZvciBjb2x1bW4gaW4gW3dyYXBDb2x1bW4uLjBdXG4gICAgICAgICAgICAgIHJldHVybiBjb2x1bW4gKyAxIHVubGVzcyBAd29yZENoYXJSZWdleHAudGVzdChsaW5lW2NvbHVtbl0pXG4gICAgICAgICAgICByZXR1cm4gd3JhcENvbHVtblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICMgc2VhcmNoIGZvcndhcmQgZm9yIHRoZSBzdGFydCBvZiBhIHdvcmQgcGFzdCB0aGUgYm91bmRhcnlcbiAgICAgICAgICAgIGZvciBjb2x1bW4gaW4gW3dyYXBDb2x1bW4uLmxpbmUubGVuZ3RoXVxuICAgICAgICAgICAgICByZXR1cm4gY29sdW1uIHVubGVzcyBAd2hpdGVzcGFjZUNoYXJSZWdleHAudGVzdChsaW5lW2NvbHVtbl0pXG4gICAgICAgICAgICByZXR1cm4gbGluZS5sZW5ndGhcbiAgICByZXR1cm5cblxuICBzZWFyY2hCYWNrd2FyZE5vdEVuZGluZ0NvbHVtbjogKGxpbmUsIHdyYXBDb2x1bW4pIC0+XG4gICAgZm91bmROb3RFbmRpbmdDb2x1bW4gPSBudWxsXG4gICAgZm9yIGNvbHVtbiBpbiBbKHdyYXBDb2x1bW4gLSAxKS4uMF1cbiAgICAgIGlmIEB3aGl0ZXNwYWNlQ2hhclJlZ2V4cC50ZXN0KGxpbmVbY29sdW1uXSlcbiAgICAgICAgY29udGludWVcbiAgICAgIGVsc2UgaWYgQG5vdEVuZGluZ0NoYXJSZWdleHAudGVzdChsaW5lW2NvbHVtbl0pXG4gICAgICAgIGZvdW5kTm90RW5kaW5nQ29sdW1uID0gY29sdW1uXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBmb3VuZE5vdEVuZGluZ0NvbHVtblxuICAgIHJldHVyblxuXG4gIHNlYXJjaEZvcndhcmRXaGl0ZXNwYWNlQ3V0YWJsZUNvbHVtbjogKGxpbmUsIHdyYXBDb2x1bW4pIC0+XG4gICAgZm9yIGNvbHVtbiBpbiBbd3JhcENvbHVtbi4uLmxpbmUubGVuZ3RoXVxuICAgICAgdW5sZXNzIEB3aGl0ZXNwYWNlQ2hhclJlZ2V4cC50ZXN0KGxpbmVbY29sdW1uXSlcbiAgICAgICAgaWYgQG5vdFN0YXJ0aW5nQ2hhclJleGdlcC50ZXN0KGxpbmVbY29sdW1uXSlcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGNvbHVtblxuICAgIHJldHVybiBsaW5lLmxlbmd0aFxuXG4gIHNlYXJjaEJhY2t3YXJkQ3V0YWJsZUNvbHVtbjogKGxpbmUsIHdyYXBDb2x1bW4sIGN1dGFibGUsIHByZVdvcmQpIC0+XG4gICAgZm9yIGNvbHVtbiBpbiBbKHdyYXBDb2x1bW4gLSAxKS4uMF1cbiAgICAgIGlmIEB3aGl0ZXNwYWNlQ2hhclJlZ2V4cC50ZXN0KGxpbmVbY29sdW1uXSlcbiAgICAgICAgaWYgY3V0YWJsZSBvciBwcmVXb3JkXG4gICAgICAgICAgcHJlQ29sdW1uID0gQHNlYXJjaEJhY2t3YXJkTm90RW5kaW5nQ29sdW1uKGxpbmUsIGNvbHVtbilcbiAgICAgICAgICBpZiBwcmVDb2x1bW4/XG4gICAgICAgICAgICBwcmVDb2x1bW5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gY29sdW1uICsgMVxuICAgICAgZWxzZSBpZiBAbm90RW5kaW5nQ2hhclJlZ2V4cC50ZXN0KGxpbmVbY29sdW1uXSlcbiAgICAgICAgY3V0YWJsZSA9IHRydWVcbiAgICAgICAgaWYgQHdvcmRDaGFyUmVnZXhwLnRlc3QobGluZVtjb2x1bW5dKVxuICAgICAgICAgIHByZVdvcmQgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwcmVXb3JkID0gZmFsc2VcbiAgICAgIGVsc2UgaWYgQG5vdFN0YXJ0aW5nQ2hhclJleGdlcC50ZXN0KGxpbmVbY29sdW1uXSlcbiAgICAgICAgaWYgY3V0YWJsZSBvciBwcmVXb3JkXG4gICAgICAgICAgcmV0dXJuIGNvbHVtbiArIDFcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGN1dGFibGUgPSBmYWxzZVxuICAgICAgICAgIGlmIEB3b3JkQ2hhclJlZ2V4cC50ZXN0KGxpbmVbY29sdW1uXSlcbiAgICAgICAgICAgIHByZVdvcmQgPSB0cnVlXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcHJlV29yZCA9IGZhbHNlXG4gICAgICBlbHNlIGlmIEB3b3JkQ2hhclJlZ2V4cC50ZXN0KGxpbmVbY29sdW1uXSlcbiAgICAgICAgaWYgKCEgcHJlV29yZCkgYW5kIGN1dGFibGVcbiAgICAgICAgICByZXR1cm4gY29sdW1uICsgMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcHJlV29yZCA9IHRydWVcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgY3V0YWJsZSBvciBwcmVXb3JkXG4gICAgICAgICAgcmV0dXJuIGNvbHVtbiArIDFcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGN1dGFibGUgPSB0cnVlXG4gICAgICAgICAgcHJlV29yZCA9IGZhbHNlXG4gICAgcmV0dXJuIHdyYXBDb2x1bW5cbiJdfQ==
