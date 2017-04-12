(function() {
  var CharaterRegexpUtil,
    slice = [].slice;

  module.exports = CharaterRegexpUtil = (function() {
    function CharaterRegexpUtil() {}

    CharaterRegexpUtil.combineRegexp = function() {
      var j, len, regexp, regexpList, regexpString, str;
      regexpList = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      regexpString = "";
      regexpString += "[";
      for (j = 0, len = regexpList.length; j < len; j++) {
        regexp = regexpList[j];
        str = regexp.source;
        if (str.length === 0) {
          continue;
        }
        if (str.startsWith("[") && str.endsWith("]")) {
          regexpString += str.substr(1, str.length - 2);
        } else {
          regexpString += str;
        }
      }
      regexpString += "]";
      return new RegExp(regexpString);
    };

    CharaterRegexpUtil.string2regexp = function() {
      var j, len, regexpString, str, strList;
      strList = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      regexpString = "";
      regexpString += "[";
      for (j = 0, len = strList.length; j < len; j++) {
        str = strList[j];
        regexpString += str;
      }
      regexpString += "]";
      return new RegExp(regexpString);
    };

    CharaterRegexpUtil.code2uchar = function(code) {
      var str;
      str = "\\u";
      if (code < 0) {
        return "";
      } else if (code < 0x10) {
        str += "000";
      } else if (code < 0x100) {
        str += "00";
      } else if (code < 0x1000) {
        str += "0";
      } else if (code < 0x10000) {

      } else if (code < 0x110000) {
        code = ((code - 0x10000) >> 10) + 0xD800;
      } else {
        return "";
      }
      str += code.toString(16).toUpperCase();
      return str;
    };

    CharaterRegexpUtil.char2uchar = function(char) {
      return this.code2uchar(char.charCodeAt(0));
    };

    CharaterRegexpUtil.range2string = function() {
      var firstCode, j, lastCode, len, range, rangeList, str;
      rangeList = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      str = "";
      for (j = 0, len = rangeList.length; j < len; j++) {
        range = rangeList[j];
        firstCode = range[0];
        lastCode = range[range.length - 1];
        if (lastCode < 0x10000 || firstCode >= 0x10000) {
          str += this.code2uchar(firstCode) + "-" + this.code2uchar(lastCode);
        } else {
          str += this.code2uchar(firstCode) + "-" + this.code2uchar(0xFFFF) + this.code2uchar(0x10000) + "-" + this.code2uchar(lastCode);
        }
      }
      return str;
    };

    CharaterRegexpUtil.range2regexp = function() {
      var rangeList;
      rangeList = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.string2regexp(this.range2string.apply(this, rangeList));
    };

    CharaterRegexpUtil.escapeAscii = function(str) {
      var escape_str, i, j, ref;
      escape_str = "";
      for (i = j = 0, ref = str.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        escape_str += this.code2uchar(str.charCodeAt(i));
      }
      return escape_str;
    };

    return CharaterRegexpUtil;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLXdyYXAvbGliL2NoYXJhY3Rlci1yZWdleHAtdXRpbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGtCQUFBO0lBQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBRUosa0JBQUMsQ0FBQSxhQUFELEdBQWdCLFNBQUE7QUFDZCxVQUFBO01BRGU7TUFDZixZQUFBLEdBQWU7TUFDZixZQUFBLElBQWdCO0FBQ2hCLFdBQUEsNENBQUE7O1FBQ0UsR0FBQSxHQUFNLE1BQU0sQ0FBQztRQUNiLElBQUcsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFqQjtBQUNFLG1CQURGOztRQUVBLElBQUcsR0FBRyxDQUFDLFVBQUosQ0FBZSxHQUFmLENBQUEsSUFBd0IsR0FBRyxDQUFDLFFBQUosQ0FBYSxHQUFiLENBQTNCO1VBQ0UsWUFBQSxJQUFnQixHQUFHLENBQUMsTUFBSixDQUFXLENBQVgsRUFBYyxHQUFHLENBQUMsTUFBSixHQUFhLENBQTNCLEVBRGxCO1NBQUEsTUFBQTtVQUdFLFlBQUEsSUFBZ0IsSUFIbEI7O0FBSkY7TUFRQSxZQUFBLElBQWdCO0FBQ2hCLGFBQVcsSUFBQSxNQUFBLENBQU8sWUFBUDtJQVpHOztJQWNoQixrQkFBQyxDQUFBLGFBQUQsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7TUFEZTtNQUNmLFlBQUEsR0FBZTtNQUNmLFlBQUEsSUFBZ0I7QUFDaEIsV0FBQSx5Q0FBQTs7UUFDRSxZQUFBLElBQWdCO0FBRGxCO01BRUEsWUFBQSxJQUFnQjtBQUNoQixhQUFXLElBQUEsTUFBQSxDQUFPLFlBQVA7SUFORzs7SUFRaEIsa0JBQUMsQ0FBQSxVQUFELEdBQWEsU0FBQyxJQUFEO0FBQ1gsVUFBQTtNQUFBLEdBQUEsR0FBTTtNQUNOLElBQUcsSUFBQSxHQUFPLENBQVY7QUFFRSxlQUFPLEdBRlQ7T0FBQSxNQUdLLElBQUcsSUFBQSxHQUFPLElBQVY7UUFDSCxHQUFBLElBQU8sTUFESjtPQUFBLE1BRUEsSUFBRyxJQUFBLEdBQU8sS0FBVjtRQUNILEdBQUEsSUFBTyxLQURKO09BQUEsTUFFQSxJQUFHLElBQUEsR0FBTyxNQUFWO1FBQ0gsR0FBQSxJQUFPLElBREo7T0FBQSxNQUVBLElBQUcsSUFBQSxHQUFPLE9BQVY7QUFBQTtPQUFBLE1BRUEsSUFBRyxJQUFBLEdBQU8sUUFBVjtRQUlILElBQUEsR0FBTyxDQUFDLENBQUMsSUFBQSxHQUFPLE9BQVIsQ0FBQSxJQUFvQixFQUFyQixDQUFBLEdBQTJCLE9BSi9CO09BQUEsTUFBQTtBQU9ILGVBQU8sR0FQSjs7TUFRTCxHQUFBLElBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxFQUFkLENBQWlCLENBQUMsV0FBbEIsQ0FBQTtBQUNQLGFBQU87SUF0Qkk7O0lBd0JiLGtCQUFDLENBQUEsVUFBRCxHQUFhLFNBQUMsSUFBRDtBQUNYLGFBQU8sSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFJLENBQUMsVUFBTCxDQUFnQixDQUFoQixDQUFaO0lBREk7O0lBR2Isa0JBQUMsQ0FBQSxZQUFELEdBQWUsU0FBQTtBQUNiLFVBQUE7TUFEYztNQUNkLEdBQUEsR0FBTTtBQUNOLFdBQUEsMkNBQUE7O1FBQ0UsU0FBQSxHQUFZLEtBQU0sQ0FBQSxDQUFBO1FBQ2xCLFFBQUEsR0FBVyxLQUFNLENBQUEsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFmO1FBQ2pCLElBQUcsUUFBQSxHQUFXLE9BQVgsSUFBc0IsU0FBQSxJQUFhLE9BQXRDO1VBQ0UsR0FBQSxJQUFPLElBQUMsQ0FBQSxVQUFELENBQVksU0FBWixDQUFBLEdBQXlCLEdBQXpCLEdBQStCLElBQUMsQ0FBQSxVQUFELENBQVksUUFBWixFQUR4QztTQUFBLE1BQUE7VUFHRSxHQUFBLElBQU8sSUFBQyxDQUFBLFVBQUQsQ0FBWSxTQUFaLENBQUEsR0FBeUIsR0FBekIsR0FBK0IsSUFBQyxDQUFBLFVBQUQsQ0FBWSxNQUFaLENBQS9CLEdBQ0wsSUFBQyxDQUFBLFVBQUQsQ0FBWSxPQUFaLENBREssR0FDa0IsR0FEbEIsR0FDd0IsSUFBQyxDQUFBLFVBQUQsQ0FBWSxRQUFaLEVBSmpDOztBQUhGO0FBUUEsYUFBTztJQVZNOztJQVlmLGtCQUFDLENBQUEsWUFBRCxHQUFlLFNBQUE7QUFDYixVQUFBO01BRGM7QUFDZCxhQUFPLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBQyxDQUFBLFlBQUQsYUFBYyxTQUFkLENBQWY7SUFETTs7SUFHZixrQkFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQ7QUFDWixVQUFBO01BQUEsVUFBQSxHQUFhO0FBQ2IsV0FBUyxtRkFBVDtRQUNFLFVBQUEsSUFBYyxJQUFDLENBQUEsVUFBRCxDQUFZLEdBQUcsQ0FBQyxVQUFKLENBQWUsQ0FBZixDQUFaO0FBRGhCO0FBRUEsYUFBTztJQUpLOzs7OztBQW5FaEIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDaGFyYXRlclJlZ2V4cFV0aWxcblxuICBAY29tYmluZVJlZ2V4cDogKHJlZ2V4cExpc3QuLi4pIC0+XG4gICAgcmVnZXhwU3RyaW5nID0gXCJcIlxuICAgIHJlZ2V4cFN0cmluZyArPSBcIltcIlxuICAgIGZvciByZWdleHAgaW4gcmVnZXhwTGlzdFxuICAgICAgc3RyID0gcmVnZXhwLnNvdXJjZVxuICAgICAgaWYgc3RyLmxlbmd0aCA9PSAwXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICBpZiBzdHIuc3RhcnRzV2l0aChcIltcIikgYW5kIHN0ci5lbmRzV2l0aChcIl1cIilcbiAgICAgICAgcmVnZXhwU3RyaW5nICs9IHN0ci5zdWJzdHIoMSwgc3RyLmxlbmd0aCAtIDIpXG4gICAgICBlbHNlXG4gICAgICAgIHJlZ2V4cFN0cmluZyArPSBzdHJcbiAgICByZWdleHBTdHJpbmcgKz0gXCJdXCJcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChyZWdleHBTdHJpbmcpXG5cbiAgQHN0cmluZzJyZWdleHA6IChzdHJMaXN0Li4uKSAtPlxuICAgIHJlZ2V4cFN0cmluZyA9IFwiXCJcbiAgICByZWdleHBTdHJpbmcgKz0gXCJbXCJcbiAgICBmb3Igc3RyIGluIHN0ckxpc3RcbiAgICAgIHJlZ2V4cFN0cmluZyArPSBzdHJcbiAgICByZWdleHBTdHJpbmcgKz0gXCJdXCJcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChyZWdleHBTdHJpbmcpXG5cbiAgQGNvZGUydWNoYXI6IChjb2RlKSAtPlxuICAgIHN0ciA9IFwiXFxcXHVcIlxuICAgIGlmIGNvZGUgPCAwXG4gICAgICAjIG5vIFVuaWNvZGUgY29kZVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIGlmIGNvZGUgPCAweDEwXG4gICAgICBzdHIgKz0gXCIwMDBcIlxuICAgIGVsc2UgaWYgY29kZSA8IDB4MTAwXG4gICAgICBzdHIgKz0gXCIwMFwiXG4gICAgZWxzZSBpZiBjb2RlIDwgMHgxMDAwXG4gICAgICBzdHIgKz0gXCIwXCJcbiAgICBlbHNlIGlmIGNvZGUgPCAweDEwMDAwXG4gICAgICAjIGRvIG5vdGhpbmdcbiAgICBlbHNlIGlmIGNvZGUgPCAweDExMDAwMFxuICAgICAgIyBvbmx5IEhpZ2ggU3Vycm9nYXRlXG4gICAgICAjIE1hdGgubG9nMigweDQwMCkgPT0gMTAgLT4gdHJ1ZVxuICAgICAgIyAoeCA+PiAxMCkgPT0gKHggLSB4ICUgMHg0MDApIC8gMHg0MDAgLT4gdHJ1ZVxuICAgICAgY29kZSA9ICgoY29kZSAtIDB4MTAwMDApID4+IDEwKSArIDB4RDgwMFxuICAgIGVsc2VcbiAgICAgICMgbm8gVW5pY29kZSBjb2RlXG4gICAgICByZXR1cm4gXCJcIlxuICAgIHN0ciArPSBjb2RlLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpXG4gICAgcmV0dXJuIHN0clxuXG4gIEBjaGFyMnVjaGFyOiAoY2hhcikgLT5cbiAgICByZXR1cm4gQGNvZGUydWNoYXIoY2hhci5jaGFyQ29kZUF0KDApKVxuXG4gIEByYW5nZTJzdHJpbmc6IChyYW5nZUxpc3QuLi4pIC0+XG4gICAgc3RyID0gXCJcIlxuICAgIGZvciByYW5nZSBpbiByYW5nZUxpc3RcbiAgICAgIGZpcnN0Q29kZSA9IHJhbmdlWzBdXG4gICAgICBsYXN0Q29kZSA9IHJhbmdlW3JhbmdlLmxlbmd0aCAtIDFdXG4gICAgICBpZiBsYXN0Q29kZSA8IDB4MTAwMDAgfHwgZmlyc3RDb2RlID49IDB4MTAwMDBcbiAgICAgICAgc3RyICs9IEBjb2RlMnVjaGFyKGZpcnN0Q29kZSkgKyBcIi1cIiArIEBjb2RlMnVjaGFyKGxhc3RDb2RlKVxuICAgICAgZWxzZVxuICAgICAgICBzdHIgKz0gQGNvZGUydWNoYXIoZmlyc3RDb2RlKSArIFwiLVwiICsgQGNvZGUydWNoYXIoMHhGRkZGKSArXG4gICAgICAgICAgQGNvZGUydWNoYXIoMHgxMDAwMCkgKyBcIi1cIiArIEBjb2RlMnVjaGFyKGxhc3RDb2RlKVxuICAgIHJldHVybiBzdHJcblxuICBAcmFuZ2UycmVnZXhwOiAocmFuZ2VMaXN0Li4uKSAtPlxuICAgIHJldHVybiBAc3RyaW5nMnJlZ2V4cChAcmFuZ2Uyc3RyaW5nKHJhbmdlTGlzdC4uLikpXG5cbiAgQGVzY2FwZUFzY2lpOiAoc3RyKSAtPlxuICAgIGVzY2FwZV9zdHIgPSBcIlwiXG4gICAgZm9yIGkgaW4gWzAuLi5zdHIubGVuZ3RoXVxuICAgICAgZXNjYXBlX3N0ciArPSBAY29kZTJ1Y2hhcihzdHIuY2hhckNvZGVBdChpKSlcbiAgICByZXR1cm4gZXNjYXBlX3N0clxuIl19
