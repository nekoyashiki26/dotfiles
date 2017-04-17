(function() {
  var DiffDetailsDataManager, JsDiff;

  JsDiff = require('diff');

  module.exports = DiffDetailsDataManager = (function() {
    function DiffDetailsDataManager() {
      this.invalidate();
    }

    DiffDetailsDataManager.prototype.liesBetween = function(hunk, row) {
      return (hunk.start <= row && row <= hunk.end);
    };

    DiffDetailsDataManager.prototype.isDifferentHunk = function() {
      if ((this.previousSelectedHunk != null) && (this.previousSelectedHunk.start != null) && (this.selectedHunk != null) && (this.selectedHunk.start != null)) {
        return this.selectedHunk.start !== this.previousSelectedHunk.start;
      }
      return true;
    };

    DiffDetailsDataManager.prototype.getSelectedHunk = function(currentRow) {
      var isDifferent;
      if ((this.selectedHunk == null) || this.selectedHunkInvalidated || !this.liesBetween(this.selectedHunk, currentRow)) {
        this.updateLineDiffDetails();
        this.updateSelectedHunk(currentRow);
      }
      this.selectedHunkInvalidated = false;
      isDifferent = this.isDifferentHunk();
      this.previousSelectedHunk = this.selectedHunk;
      return {
        selectedHunk: this.selectedHunk,
        isDifferent: isDifferent
      };
    };

    DiffDetailsDataManager.prototype.updateSelectedHunk = function(currentRow) {
      var hunk, j, len, ref, results;
      this.selectedHunk = null;
      if (this.lineDiffDetails != null) {
        ref = this.lineDiffDetails;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          hunk = ref[j];
          if (this.liesBetween(hunk, currentRow)) {
            this.selectedHunk = hunk;
            break;
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    DiffDetailsDataManager.prototype.updateLineDiffDetails = function() {
      if ((this.lineDiffDetails == null) || this.lineDiffDetailsInvalidated) {
        this.prepareLineDiffDetails(this.repo, this.path, this.text);
        if (this.lineDiffDetails) {
          this.prepareWordDiffs(this.lineDiffDetails);
        }
      }
      this.lineDiffDetailsInvalidated = false;
      return this.lineDiffDetails;
    };

    DiffDetailsDataManager.prototype.prepareLineDiffDetails = function(repo, path, text) {
      var hunk, j, kind, len, line, newEnd, newLineNumber, newLines, newStart, oldLineNumber, oldLines, oldStart, options, rawLineDiffDetails, ref, results;
      this.lineDiffDetails = null;
      repo = repo.getRepo(path);
      options = {
        ignoreEolWhitespace: process.platform === 'win32'
      };
      rawLineDiffDetails = repo.getLineDiffDetails(repo.relativize(path), text, options);
      if (rawLineDiffDetails == null) {
        return;
      }
      this.lineDiffDetails = [];
      hunk = null;
      results = [];
      for (j = 0, len = rawLineDiffDetails.length; j < len; j++) {
        ref = rawLineDiffDetails[j], oldStart = ref.oldStart, newStart = ref.newStart, oldLines = ref.oldLines, newLines = ref.newLines, oldLineNumber = ref.oldLineNumber, newLineNumber = ref.newLineNumber, line = ref.line;
        if (!(oldLines === 0 && newLines > 0)) {
          if ((hunk == null) || (newStart !== hunk.start)) {
            newEnd = null;
            kind = null;
            if (newLines === 0 && oldLines > 0) {
              newEnd = newStart;
              kind = "d";
            } else {
              newEnd = newStart + newLines - 1;
              kind = "m";
            }
            hunk = {
              start: newStart,
              end: newEnd,
              oldLines: [],
              newLines: [],
              newString: "",
              oldString: "",
              kind: kind
            };
            this.lineDiffDetails.push(hunk);
          }
          if (newLineNumber >= 0) {
            hunk.newLines.push(line);
            results.push(hunk.newString += line);
          } else {
            hunk.oldLines.push(line);
            results.push(hunk.oldString += line);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    DiffDetailsDataManager.prototype.prepareWordDiffs = function(lineDiffDetails) {
      var diff, hunk, i, j, len, newCol, oldCol, results, word;
      results = [];
      for (j = 0, len = lineDiffDetails.length; j < len; j++) {
        hunk = lineDiffDetails[j];
        if (hunk.kind !== "m" || hunk.newLines.length !== hunk.oldLines.length) {
          continue;
        }
        hunk.newWords = [];
        hunk.oldWords = [];
        results.push((function() {
          var k, ref, results1;
          results1 = [];
          for (i = k = 0, ref = hunk.newLines.length; k < ref; i = k += 1) {
            newCol = oldCol = 0;
            diff = JsDiff.diffWordsWithSpace(hunk.oldLines[i], hunk.newLines[i]);
            results1.push((function() {
              var l, len1, results2;
              results2 = [];
              for (l = 0, len1 = diff.length; l < len1; l++) {
                word = diff[l];
                word.offsetRow = i;
                if (word.added) {
                  word.changed = true;
                  word.startCol = newCol;
                  newCol += word.value.length;
                  word.endCol = newCol;
                  results2.push(hunk.newWords.push(word));
                } else if (word.removed) {
                  word.changed = true;
                  word.startCol = oldCol;
                  oldCol += word.value.length;
                  word.endCol = oldCol;
                  results2.push(hunk.oldWords.push(word));
                } else {
                  newCol += word.value.length;
                  oldCol += word.value.length;
                  hunk.newWords.push(word);
                  results2.push(hunk.oldWords.push(word));
                }
              }
              return results2;
            })());
          }
          return results1;
        })());
      }
      return results;
    };

    DiffDetailsDataManager.prototype.invalidate = function(repo1, path1, text1) {
      this.repo = repo1;
      this.path = path1;
      this.text = text1;
      this.selectedHunkInvalidated = true;
      this.lineDiffDetailsInvalidated = true;
      return this.invalidatePreviousSelectedHunk();
    };

    DiffDetailsDataManager.prototype.invalidatePreviousSelectedHunk = function() {
      return this.previousSelectedHunk = null;
    };

    return DiffDetailsDataManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1kaWZmLWRldGFpbHMvbGliL2RhdGEtbWFuYWdlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsTUFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUF1QjtJQUNSLGdDQUFBO01BQ1gsSUFBQyxDQUFBLFVBQUQsQ0FBQTtJQURXOztxQ0FHYixXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sR0FBUDthQUNYLENBQUEsSUFBSSxDQUFDLEtBQUwsSUFBYyxHQUFkLElBQWMsR0FBZCxJQUFxQixJQUFJLENBQUMsR0FBMUI7SUFEVzs7cUNBR2IsZUFBQSxHQUFpQixTQUFBO01BQ2YsSUFBRyxtQ0FBQSxJQUEyQix5Q0FBM0IsSUFBNEQsMkJBQTVELElBQStFLGlDQUFsRjtBQUNFLGVBQU8sSUFBQyxDQUFBLFlBQVksQ0FBQyxLQUFkLEtBQXVCLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxNQUR0RDs7QUFFQSxhQUFPO0lBSFE7O3FDQUtqQixlQUFBLEdBQWlCLFNBQUMsVUFBRDtBQUNmLFVBQUE7TUFBQSxJQUFJLDJCQUFELElBQW1CLElBQUMsQ0FBQSx1QkFBcEIsSUFBK0MsQ0FBQyxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxZQUFkLEVBQTRCLFVBQTVCLENBQW5EO1FBQ0UsSUFBQyxDQUFBLHFCQUFELENBQUE7UUFDQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsVUFBcEIsRUFGRjs7TUFJQSxJQUFDLENBQUEsdUJBQUQsR0FBMkI7TUFFM0IsV0FBQSxHQUFjLElBQUMsQ0FBQSxlQUFELENBQUE7TUFFZCxJQUFDLENBQUEsb0JBQUQsR0FBd0IsSUFBQyxDQUFBO2FBRXpCO1FBQUMsWUFBQSxFQUFjLElBQUMsQ0FBQSxZQUFoQjtRQUE4QixhQUFBLFdB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LEVBQVEsS0FBUixFQUFlLEtBQWY7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLE9BQUQ7TUFDekIsSUFBQyxDQUFBLHVCQUFELEdBQTJCO01BQzNCLElBQUMsQ0FBQSwwQkFBRCxHQUE4QjthQUM5QixJQUFDLENBQUEsOEJBQUQsQ0FBQTtJQUhVOztxQ0FLWiw4QkFBQSxHQUFnQyxTQUFBO2FBQzlCLElBQUMsQ0FBQSxvQkFBRCxHQUF3QjtJQURNOzs7OztBQXpIbEMiLCJzb3VyY2VzQ29udGVudCI6WyJKc0RpZmYgPSByZXF1aXJlKCdkaWZmJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEaWZmRGV0YWlsc0RhdGFNYW5hZ2VyXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBpbnZhbGlkYXRlKClcblxuICBsaWVzQmV0d2VlbjogKGh1bmssIHJvdykgLT5cbiAgICBodW5rLnN0YXJ0IDw9IHJvdyA8PSBodW5rLmVuZFxuXG4gIGlzRGlmZmVyZW50SHVuazogLT5cbiAgICBpZiBAcHJldmlvdXNTZWxlY3RlZEh1bms/IGFuZCBAcHJldmlvdXNTZWxlY3RlZEh1bmsuc3RhcnQ/IGFuZCBAc2VsZWN0ZWRIdW5rPyBhbmQgQHNlbGVjdGVkSHVuay5zdGFydD9cbiAgICAgIHJldHVybiBAc2VsZWN0ZWRIdW5rLnN0YXJ0ICE9IEBwcmV2aW91c1NlbGVjdGVkSHVuay5zdGFydFxuICAgIHJldHVybiB0cnVlXG5cbiAgZ2V0U2VsZWN0ZWRIdW5rOiAoY3VycmVudFJvdykgLT5cbiAgICBpZiAhQHNlbGVjdGVkSHVuaz8gb3IgQHNlbGVjdGVkSHVua0ludmFsaWRhdGVkIG9yICFAbGllc0JldHdlZW4oQHNlbGVjdGVkSHVuaywgY3VycmVudFJvdylcbiAgICAgIEB1cGRhdGVMaW5lRGlmZkRldGFpbHMoKVxuICAgICAgQHVwZGF0ZVNlbGVjdGVkSHVuayhjdXJyZW50Um93KVxuXG4gICAgQHNlbGVjdGVkSHVua0ludmFsaWRhdGVkID0gZmFsc2VcblxuICAgIGlzRGlmZmVyZW50ID0gQGlzRGlmZmVyZW50SHVuaygpXG5cbiAgICBAcHJldmlvdXNTZWxlY3RlZEh1bmsgPSBAc2VsZWN0ZWRIdW5rXG5cbiAgICB7c2VsZWN0ZWRIdW5rOiBAc2VsZWN0ZWRIdW5rLCBpc0RpZmZlcmVudH1cblxuICB1cGRhdGVTZWxlY3RlZEh1bms6IChjdXJyZW50Um93KSAtPlxuICAgIEBzZWxlY3RlZEh1bmsgPSBudWxsXG5cbiAgICBpZiBAbGluZURpZmZEZXRhaWxzP1xuICAgICAgZm9yIGh1bmsgaW4gQGxpbmVEaWZmRGV0YWlsc1xuICAgICAgICBpZiBAbGllc0JldHdlZW4oaHVuaywgY3VycmVudFJvdylcbiAgICAgICAgICBAc2VsZWN0ZWRIdW5rID0gaHVua1xuICAgICAgICAgIGJyZWFrXG5cbiAgdXBkYXRlTGluZURpZmZEZXRhaWxzOiAtPlxuICAgIGlmICFAbGluZURpZmZEZXRhaWxzPyBvciBAbGluZURpZmZEZXRhaWxzSW52YWxpZGF0ZWRcbiAgICAgIEBwcmVwYXJlTGluZURpZmZEZXRhaWxzKEByZXBvLCBAcGF0aCwgQHRleHQpXG4gICAgICBAcHJlcGFyZVdvcmREaWZmcyhAbGluZURpZmZEZXRhaWxzKSBpZiBAbGluZURpZmZEZXRhaWxzXG5cbiAgICBAbGluZURpZmZEZXRhaWxzSW52YWxpZGF0ZWQgPSBmYWxzZVxuICAgIEBsaW5lRGlmZkRldGFpbHNcblxuICBwcmVwYXJlTGluZURpZmZEZXRhaWxzOiAocmVwbywgcGF0aCwgdGV4dCkgLT5cbiAgICBAbGluZURpZmZEZXRhaWxzID0gbnVsbFxuXG4gICAgcmVwbyA9IHJlcG8uZ2V0UmVwbyhwYXRoKVxuXG4gICAgb3B0aW9ucyA9IGlnbm9yZUVvbFdoaXRlc3BhY2U6IHByb2Nlc3MucGxhdGZvcm0gaXMgJ3dpbjMyJ1xuXG4gICAgcmF3TGluZURpZmZEZXRhaWxzID0gcmVwby5nZXRMaW5lRGlmZkRldGFpbHMocmVwby5yZWxhdGl2aXplKHBhdGgpLCB0ZXh0LCBvcHRpb25zKVxuXG4gICAgcmV0dXJuIHVubGVzcyByYXdMaW5lRGlmZkRldGFpbHM/XG5cbiAgICBAbGluZURpZmZEZXRhaWxzID0gW11cbiAgICBodW5rID0gbnVsbFxuXG4gICAgZm9yIHtvbGRTdGFydCwgbmV3U3RhcnQsIG9sZExpbmVzLCBuZXdMaW5lcywgb2xkTGluZU51bWJlciwgbmV3TGluZU51bWJlciwgbGluZX0gaW4gcmF3TGluZURpZmZEZXRhaWxzXG4gICAgICAjIHByb2Nlc3MgbW9kaWZpY2F0aW9ucyBhbmQgZGVsZXRpb25zIG9ubHlcbiAgICAgIHVubGVzcyBvbGRMaW5lcyBpcyAwIGFuZCBuZXdMaW5lcyA+IDBcbiAgICAgICAgIyBjcmVhdGUgYSBuZXcgaHVuayBlbnRyeSBpZiB0aGUgaHVuayBzdGFydCBvZiB0aGUgcHJldmlvdXMgbGluZVxuICAgICAgICAjIGlzIGRpZmZlcmVudCB0byB0aGUgY3VycmVudFxuICAgICAgICBpZiBub3QgaHVuaz8gb3IgKG5ld1N0YXJ0IGlzbnQgaHVuay5zdGFydClcbiAgICAgICAgICBuZXdFbmQgPSBudWxsXG4gICAgICAgICAga2luZCA9IG51bGxcbiAgICAgICAgICBpZiBuZXdMaW5lcyBpcyAwIGFuZCBvbGRMaW5lcyA+IDBcbiAgICAgICAgICAgIG5ld0VuZCA9IG5ld1N0YXJ0XG4gICAgICAgICAgICBraW5kID0gXCJkXCJcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXdFbmQgPSBuZXdTdGFydCArIG5ld0xpbmVzIC0gMVxuICAgICAgICAgICAga2luZCA9IFwibVwiXG5cbiAgICAgICAgICBodW5rID0ge1xuICAgICAgICAgICAgc3RhcnQ6IG5ld1N0YXJ0LCBlbmQ6IG5ld0VuZCxcbiAgICAgICAgICAgIG9sZExpbmVzOiBbXSwgbmV3TGluZXM6IFtdLFxuICAgICAgICAgICAgbmV3U3RyaW5nOiBcIlwiLCBvbGRTdHJpbmc6IFwiXCJcbiAgICAgICAgICAgIGtpbmRcbiAgICAgICAgICB9XG4gICAgICAgICAgQGxpbmVEaWZmRGV0YWlscy5wdXNoKGh1bmspXG5cbiAgICAgICAgaWYgbmV3TGluZU51bWJlciA+PSAwXG4gICAgICAgICAgaHVuay5uZXdMaW5lcy5wdXNoKGxpbmUpXG4gICAgICAgICAgaHVuay5uZXdTdHJpbmcgKz0gbGluZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaHVuay5vbGRMaW5lcy5wdXNoKGxpbmUpXG4gICAgICAgICAgaHVuay5vbGRTdHJpbmcgKz0gbGluZVxuXG4gIHByZXBhcmVXb3JkRGlmZnM6IChsaW5lRGlmZkRldGFpbHMpIC0+XG4gICAgZm9yIGh1bmsgaW4gbGluZURpZmZEZXRhaWxzXG4gICAgICBjb250aW51ZSBpZiBodW5rLmtpbmQgaXNudCBcIm1cIiBvciBodW5rLm5ld0xpbmVzLmxlbmd0aCAhPSBodW5rLm9sZExpbmVzLmxlbmd0aFxuICAgICAgaHVuay5uZXdXb3JkcyA9IFtdXG4gICAgICBodW5rLm9sZFdvcmRzID0gW11cbiAgICAgIGZvciBpIGluIFswLi4uaHVuay5uZXdMaW5lcy5sZW5ndGhdIGJ5IDFcbiAgICAgICAgbmV3Q29sID0gb2xkQ29sID0gMFxuICAgICAgICBkaWZmID0gSnNEaWZmLmRpZmZXb3Jkc1dpdGhTcGFjZShodW5rLm9sZExpbmVzW2ldLCBodW5rLm5ld0xpbmVzW2ldKVxuICAgICAgICBmb3Igd29yZCBpbiBkaWZmXG4gICAgICAgICAgd29yZC5vZmZzZXRSb3cgPSBpXG4gICAgICAgICAgaWYgd29yZC5hZGRlZFxuICAgICAgICAgICAgd29yZC5jaGFuZ2VkID0gdHJ1ZVxuICAgICAgICAgICAgd29yZC5zdGFydENvbCA9IG5ld0NvbFxuICAgICAgICAgICAgbmV3Q29sICs9IHdvcmQudmFsdWUubGVuZ3RoXG4gICAgICAgICAgICB3b3JkLmVuZENvbCA9IG5ld0NvbFxuICAgICAgICAgICAgaHVuay5uZXdXb3Jkcy5wdXNoKHdvcmQpXG4gICAgICAgICAgZWxzZSBpZiB3b3JkLnJlbW92ZWRcbiAgICAgICAgICAgIHdvcmQuY2hhbmdlZCA9IHRydWVcbiAgICAgICAgICAgIHdvcmQuc3RhcnRDb2wgPSBvbGRDb2xcbiAgICAgICAgICAgIG9sZENvbCArPSB3b3JkLnZhbHVlLmxlbmd0aFxuICAgICAgICAgICAgd29yZC5lbmRDb2wgPSBvbGRDb2xcbiAgICAgICAgICAgIGh1bmsub2xkV29yZHMucHVzaCh3b3JkKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ld0NvbCArPSB3b3JkLnZhbHVlLmxlbmd0aFxuICAgICAgICAgICAgb2xkQ29sICs9IHdvcmQudmFsdWUubGVuZ3RoXG4gICAgICAgICAgICBodW5rLm5ld1dvcmRzLnB1c2god29yZClcbiAgICAgICAgICAgIGh1bmsub2xkV29yZHMucHVzaCh3b3JkKVxuXG4gIGludmFsaWRhdGU6IChAcmVwbywgQHBhdGgsIEB0ZXh0KSAtPlxuICAgIEBzZWxlY3RlZEh1bmtJbnZhbGlkYXRlZCA9IHRydWVcbiAgICBAbGluZURpZmZEZXRhaWxzSW52YWxpZGF0ZWQgPSB0cnVlXG4gICAgQGludmFsaWRhdGVQcmV2aW91c1NlbGVjdGVkSHVuaygpXG5cbiAgaW52YWxpZGF0ZVByZXZpb3VzU2VsZWN0ZWRIdW5rOiAtPlxuICAgIEBwcmV2aW91c1NlbGVjdGVkSHVuayA9IG51bGxcbiJdfQ==
