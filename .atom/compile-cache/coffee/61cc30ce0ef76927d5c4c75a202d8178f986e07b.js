(function() {
  var UnicodeUtil,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = UnicodeUtil = (function() {
    var j, k, results, results1;

    function UnicodeUtil() {}

    UnicodeUtil.unicode = require('./unicode');

    UnicodeUtil.highSurrogateRange = (function() {
      results = [];
      for (j = 0xD800; j <= 56319; j++){ results.push(j); }
      return results;
    }).apply(this);

    UnicodeUtil.lowSurrogateRange = (function() {
      results1 = [];
      for (k = 0xDC00; k <= 57343; k++){ results1.push(k); }
      return results1;
    }).apply(this);

    UnicodeUtil.getBlockName = function(str) {
      var block, charCode, l, len, ref;
      charCode = this.unicodeCharCodeAt(str);
      ref = this.unicode;
      for (l = 0, len = ref.length; l < len; l++) {
        block = ref[l];
        if (indexOf.call(block[0], charCode) >= 0) {
          return block[1];
        }
      }
      return null;
    };

    UnicodeUtil.getRangeListByName = function(name) {
      var block, l, len, rangeList, ref;
      rangeList = new Array();
      if (!String.prototype.includes) {
        String.prototype.includes = function() {
          'use strict';
          return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
      }
      ref = this.unicode;
      for (l = 0, len = ref.length; l < len; l++) {
        block = ref[l];
        if (block[1].includes(name)) {
          rangeList = rangeList.concat([block[0]]);
        }
      }
      return rangeList;
    };

    UnicodeUtil.unicodeCharCodeAt = function(str, index) {
      var charCode, charCodeHigh, charCodeLow, i, l, ref, ref1, surrogateCount;
      if (index == null) {
        index = 0;
      }
      surrogateCount = 0;
      for (i = l = 0, ref = index; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        if (ref1 = str.charCodeAt(i + surrogateCount), indexOf.call(this.highSurrogateRange, ref1) >= 0) {
          surrogateCount += 1;
        }
      }
      index += surrogateCount;
      charCode = str.charCodeAt(index);
      if (indexOf.call(this.highSurrogateRange, charCode) >= 0) {
        charCodeHigh = charCode;
        charCodeLow = str.charCodeAt(index + 1);
        if (indexOf.call(this.lowSurrogateRange, charCodeLow) >= 0) {
          charCode = 0x10000 + (charCodeHigh - 0xD800) * 0x400 + charCodeLow - 0xDC00;
        }
      }
      return charCode;
    };

    return UnicodeUtil;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLXdyYXAvbGliL3VuaWNvZGUtdXRpbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLFdBQUE7SUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osUUFBQTs7OztJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVcsT0FBQSxDQUFRLFdBQVI7O0lBR1gsV0FBQyxDQUFBLGtCQUFELEdBQXNCOzs7Ozs7SUFDdEIsV0FBQyxDQUFBLGlCQUFELEdBQXFCOzs7Ozs7SUFFckIsV0FBQyxDQUFBLFlBQUQsR0FBZSxTQUFDLEdBQUQ7QUFDYixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixHQUFuQjtBQUNYO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxJQUFHLGFBQVksS0FBTSxDQUFBLENBQUEsQ0FBbEIsRUFBQSxRQUFBLE1BQUg7QUFDRSxpQkFBTyxLQUFNLENBQUEsQ0FBQSxFQURmOztBQURGO0FBR0EsYUFBTztJQUxNOztJQU9mLFdBQUMsQ0FBQSxrQkFBRCxHQUFxQixTQUFDLElBQUQ7QUFDbkIsVUFBQTtNQUFBLFNBQUEsR0FBZ0IsSUFBQSxLQUFBLENBQUE7TUFDaEIsSUFBRyxDQUFDLE1BQU0sQ0FBQSxTQUFFLENBQUEsUUFBWjtRQUVFLE1BQU0sQ0FBQSxTQUFFLENBQUEsUUFBUixHQUFtQixTQUFBO1VBQ2pCO2lCQUNBLE1BQU0sQ0FBQSxTQUFFLENBQUEsT0FBTyxDQUFDLEtBQWhCLENBQXNCLElBQXRCLEVBQTRCLFNBQTVCLENBQUEsS0FBMEMsQ0FBQztRQUYxQixFQUZyQjs7QUFLQTtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsSUFBRyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBVCxDQUFrQixJQUFsQixDQUFIO1VBQ0UsU0FBQSxHQUFZLFNBQVMsQ0FBQyxNQUFWLENBQWlCLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBUCxDQUFqQixFQURkOztBQURGO0FBR0EsYUFBTztJQVZZOztJQVlyQixXQUFDLENBQUEsaUJBQUQsR0FBb0IsU0FBQyxHQUFELEVBQU0sS0FBTjtBQUNsQixVQUFBOztRQUR3QixRQUFROztNQUNoQyxjQUFBLEdBQWlCO0FBQ2pCLFdBQVMsOEVBQVQ7UUFDRSxXQUFHLEdBQUcsQ0FBQyxVQUFKLENBQWUsQ0FBQSxHQUFJLGNBQW5CLENBQUEsRUFBQSxhQUFzQyxJQUFDLENBQUEsa0JBQXZDLEVBQUEsSUFBQSxNQUFIO1VBQ0UsY0FBQSxJQUFrQixFQURwQjs7QUFERjtNQUdBLEtBQUEsSUFBUztNQUNULFFBQUEsR0FBVyxHQUFHLENBQUMsVUFBSixDQUFlLEtBQWY7TUFFWCxJQUFHLGFBQVksSUFBQyxDQUFBLGtCQUFiLEVBQUEsUUFBQSxNQUFIO1FBQ0UsWUFBQSxHQUFlO1FBQ2YsV0FBQSxHQUFjLEdBQUcsQ0FBQyxVQUFKLENBQWUsS0FBQSxHQUFRLENBQXZCO1FBQ2QsSUFBRyxhQUFlLElBQUMsQ0FBQSxpQkFBaEIsRUFBQSxXQUFBLE1BQUg7VUFDRSxRQUFBLEdBQVcsT0FBQSxHQUNBLENBQUMsWUFBQSxHQUFlLE1BQWhCLENBQUEsR0FBMEIsS0FEMUIsR0FFQSxXQUZBLEdBRWMsT0FIM0I7U0FIRjs7QUFPQSxhQUFPO0lBZlc7Ozs7O0FBM0J0QiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFVuaWNvZGVVdGlsXG4gIEB1bmljb2RlID0gcmVxdWlyZSgnLi91bmljb2RlJylcblxuICAjIFN1cnJvZ2F0ZSBDaGFycmFjdGVyIFJhbmdlXG4gIEBoaWdoU3Vycm9nYXRlUmFuZ2UgPSBbMHhEODAwLi4weERCRkZdXG4gIEBsb3dTdXJyb2dhdGVSYW5nZSA9IFsweERDMDAuLjB4REZGRl1cblxuICBAZ2V0QmxvY2tOYW1lOiAoc3RyKSAtPlxuICAgIGNoYXJDb2RlID0gQHVuaWNvZGVDaGFyQ29kZUF0KHN0cilcbiAgICBmb3IgYmxvY2sgaW4gQHVuaWNvZGVcbiAgICAgIGlmIGNoYXJDb2RlIGluIGJsb2NrWzBdXG4gICAgICAgIHJldHVybiBibG9ja1sxXVxuICAgIHJldHVybiBudWxsXG5cbiAgQGdldFJhbmdlTGlzdEJ5TmFtZTogKG5hbWUpIC0+XG4gICAgcmFuZ2VMaXN0ID0gbmV3IEFycmF5KClcbiAgICBpZiAhU3RyaW5nOjppbmNsdWRlc1xuICAgICAgIyBjb25zb2xlLmxvZyhcIlN0cmluZzo6aW5jbHVkZXMgaXMgdW5kZWZpbmVkXCIpXG4gICAgICBTdHJpbmc6OmluY2x1ZGVzID0gLT5cbiAgICAgICAgJ3VzZSBzdHJpY3QnXG4gICAgICAgIFN0cmluZzo6aW5kZXhPZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpICE9IC0xXG4gICAgZm9yIGJsb2NrIGluIEB1bmljb2RlXG4gICAgICBpZiBibG9ja1sxXS5pbmNsdWRlcyhuYW1lKVxuICAgICAgICByYW5nZUxpc3QgPSByYW5nZUxpc3QuY29uY2F0KFtibG9ja1swXV0pXG4gICAgcmV0dXJuIHJhbmdlTGlzdFxuXG4gIEB1bmljb2RlQ2hhckNvZGVBdDogKHN0ciwgaW5kZXggPSAwKSAtPlxuICAgIHN1cnJvZ2F0ZUNvdW50ID0gMFxuICAgIGZvciBpIGluIFswLi4uaW5kZXhdXG4gICAgICBpZiBzdHIuY2hhckNvZGVBdChpICsgc3Vycm9nYXRlQ291bnQpIGluIEBoaWdoU3Vycm9nYXRlUmFuZ2VcbiAgICAgICAgc3Vycm9nYXRlQ291bnQgKz0gMVxuICAgIGluZGV4ICs9IHN1cnJvZ2F0ZUNvdW50XG4gICAgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpbmRleClcbiAgICAjIFN1cnJvZ2V0ZSBwYWlyXG4gICAgaWYgY2hhckNvZGUgaW4gQGhpZ2hTdXJyb2dhdGVSYW5nZVxuICAgICAgY2hhckNvZGVIaWdoID0gY2hhckNvZGVcbiAgICAgIGNoYXJDb2RlTG93ID0gc3RyLmNoYXJDb2RlQXQoaW5kZXggKyAxKVxuICAgICAgaWYgY2hhckNvZGVMb3cgaW4gQGxvd1N1cnJvZ2F0ZVJhbmdlXG4gICAgICAgIGNoYXJDb2RlID0gMHgxMDAwMCArXG4gICAgICAgICAgICAgICAgICAgKGNoYXJDb2RlSGlnaCAtIDB4RDgwMCkgKiAweDQwMCArXG4gICAgICAgICAgICAgICAgICAgY2hhckNvZGVMb3cgLSAweERDMDBcbiAgICByZXR1cm4gY2hhckNvZGVcbiJdfQ==
