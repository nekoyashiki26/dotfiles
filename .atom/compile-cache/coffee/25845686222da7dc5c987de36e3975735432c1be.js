(function() {
  var AtomGitDiffDetailsView, DiffDetailsDataManager, Housekeeping, Point, Range, View, _, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('atom-space-pen-views').View;

  ref = require('atom'), Range = ref.Range, Point = ref.Point;

  _ = require('underscore-plus');

  DiffDetailsDataManager = require('./data-manager');

  Housekeeping = require('./housekeeping');

  module.exports = AtomGitDiffDetailsView = (function(superClass) {
    extend(AtomGitDiffDetailsView, superClass);

    function AtomGitDiffDetailsView() {
      this.notifyContentsModified = bind(this.notifyContentsModified, this);
      return AtomGitDiffDetailsView.__super__.constructor.apply(this, arguments);
    }

    Housekeeping.includeInto(AtomGitDiffDetailsView);

    AtomGitDiffDetailsView.content = function() {
      return this.div({
        "class": "git-diff-details-outer"
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": "git-diff-details-main-panel",
            outlet: "mainPanel"
          }, function() {
            return _this.div({
              "class": "editor git-diff-editor",
              outlet: "contents"
            });
          });
        };
      })(this));
    };

    AtomGitDiffDetailsView.prototype.initialize = function(editor1) {
      this.editor = editor1;
      this.editorView = atom.views.getView(this.editor);
      this.diffDetailsDataManager = new DiffDetailsDataManager();
      this.initializeHousekeeping();
      this.preventFocusOut();
      this.diffEditor = atom.workspace.buildTextEditor({
        lineNumberGutterVisible: false,
        scrollPastEnd: false
      });
      this.contents.html(atom.views.getView(this.diffEditor));
      this.markers = [];
      this.showDiffDetails = false;
      this.lineDiffDetails = null;
      return this.updateCurrentRow();
    };

    AtomGitDiffDetailsView.prototype.preventFocusOut = function() {
      return this.mainPanel.on('mousedown', function() {
        return false;
      });
    };

    AtomGitDiffDetailsView.prototype.getActiveTextEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    AtomGitDiffDetailsView.prototype.updateCurrentRow = function() {
      var newCurrentRow, ref1, ref2;
      newCurrentRow = ((ref1 = this.getActiveTextEditor()) != null ? (ref2 = ref1.getCursorBufferPosition()) != null ? ref2.row : void 0 : void 0) + 1;
      if (newCurrentRow !== this.currentRow) {
        this.currentRow = newCurrentRow;
        return true;
      }
      return false;
    };

    AtomGitDiffDetailsView.prototype.notifyContentsModified = function() {
      if (this.editor.isDestroyed()) {
        return;
      }
      this.diffDetailsDataManager.invalidate(this.repositoryForPath(this.editor.getPath()), this.editor.getPath(), this.editor.getText());
      if (this.showDiffDetails) {
        return this.updateDiffDetailsDisplay();
      }
    };

    AtomGitDiffDetailsView.prototype.updateDiffDetails = function() {
      this.diffDetailsDataManager.invalidatePreviousSelectedHunk();
      this.updateCurrentRow();
      return this.updateDiffDetailsDisplay();
    };

    AtomGitDiffDetailsView.prototype.toggleShowDiffDetails = function() {
      this.showDiffDetails = !this.showDiffDetails;
      return this.updateDiffDetails();
    };

    AtomGitDiffDetailsView.prototype.closeDiffDetails = function() {
      this.showDiffDetails = false;
      return this.updateDiffDetails();
    };

    AtomGitDiffDetailsView.prototype.notifyChangeCursorPosition = function() {
      var currentRowChanged;
      if (this.showDiffDetails) {
        currentRowChanged = this.updateCurrentRow();
        if (currentRowChanged) {
          return this.updateDiffDetailsDisplay();
        }
      }
    };

    AtomGitDiffDetailsView.prototype.copy = function() {
      var selectedHunk;
      selectedHunk = this.diffDetailsDataManager.getSelectedHunk(this.currentRow).selectedHunk;
      if (selectedHunk != null) {
        atom.clipboard.write(selectedHunk.oldString);
        if (atom.config.get('git-diff-details.closeAfterCopy')) {
          return this.closeDiffDetails();
        }
      }
    };

    AtomGitDiffDetailsView.prototype.undo = function() {
      var buffer, selectedHunk;
      selectedHunk = this.diffDetailsDataManager.getSelectedHunk(this.currentRow).selectedHunk;
      if ((selectedHunk != null) && (buffer = this.editor.getBuffer())) {
        if (selectedHunk.kind === "m") {
          buffer.setTextInRange([[selectedHunk.start - 1, 0], [selectedHunk.end, 0]], selectedHunk.oldString);
        } else {
          buffer.insert([selectedHunk.start, 0], selectedHunk.oldString);
        }
        if (!atom.config.get('git-diff-details.keepViewToggled')) {
          return this.closeDiffDetails();
        }
      }
    };

    AtomGitDiffDetailsView.prototype.destroyDecoration = function() {
      var i, len, marker, ref1;
      ref1 = this.markers;
      for (i = 0, len = ref1.length; i < len; i++) {
        marker = ref1[i];
        marker.destroy();
      }
      return this.markers = [];
    };

    AtomGitDiffDetailsView.prototype.decorateLines = function(editor, start, end, type) {
      var marker, range;
      range = new Range(new Point(start, 0), new Point(end, 0));
      marker = editor.markBufferRange(range);
      editor.decorateMarker(marker, {
        type: 'line',
        "class": "git-diff-details-" + type
      });
      return this.markers.push(marker);
    };

    AtomGitDiffDetailsView.prototype.decorateWords = function(editor, start, words, type) {
      var i, len, marker, range, results, row, word;
      if (!words) {
        return;
      }
      results = [];
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        if (!word.changed) {
          continue;
        }
        row = start + word.offsetRow;
        range = new Range(new Point(row, word.startCol), new Point(row, word.endCol));
        marker = editor.markBufferRange(range);
        editor.decorateMarker(marker, {
          type: 'highlight',
          "class": "git-diff-details-" + type
        });
        results.push(this.markers.push(marker));
      }
      return results;
    };

    AtomGitDiffDetailsView.prototype.display = function(selectedHunk) {
      var classPostfix, marker, range, ref1;
      this.destroyDecoration();
      classPostfix = atom.config.get('git-diff-details.enableSyntaxHighlighting') ? "highlighted" : "flat";
      if (selectedHunk.kind === "m") {
        this.decorateLines(this.editor, selectedHunk.start - 1, selectedHunk.end, "new-" + classPostfix);
        if (atom.config.get('git-diff-details.showWordDiffs')) {
          this.decorateWords(this.editor, selectedHunk.start - 1, selectedHunk.newWords, "new-" + classPostfix);
        }
      }
      range = new Range(new Point(selectedHunk.end - 1, 0), new Point(selectedHunk.end - 1, 0));
      marker = this.editor.markBufferRange(range);
      this.editor.decorateMarker(marker, {
        type: 'block',
        position: 'after',
        item: this
      });
      this.markers.push(marker);
      this.diffEditor.setGrammar((ref1 = this.getActiveTextEditor()) != null ? ref1.getGrammar() : void 0);
      this.diffEditor.setText(selectedHunk.oldString.replace(/[\r\n]+$/g, ""));
      this.decorateLines(this.diffEditor, 0, selectedHunk.oldLines.length, "old-" + classPostfix);
      if (atom.config.get('git-diff-details.showWordDiffs')) {
        return this.decorateWords(this.diffEditor, 0, selectedHunk.oldWords, "old-" + classPostfix);
      }
    };

    AtomGitDiffDetailsView.prototype.updateDiffDetailsDisplay = function() {
      var isDifferent, ref1, selectedHunk;
      if (this.showDiffDetails) {
        ref1 = this.diffDetailsDataManager.getSelectedHunk(this.currentRow), selectedHunk = ref1.selectedHunk, isDifferent = ref1.isDifferent;
        if (selectedHunk != null) {
          if (!isDifferent) {
            return;
          }
          this.display(selectedHunk);
          return;
        } else {
          if (!atom.config.get('git-diff-details.keepViewToggled')) {
            this.closeDiffDetails();
          }
        }
        this.previousSelectedHunk = selectedHunk;
      }
      this.destroyDecoration();
    };

    return AtomGitDiffDetailsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1kaWZmLWRldGFpbHMvbGliL2dpdC1kaWZmLWRldGFpbHMtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHdGQUFBO0lBQUE7Ozs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUjs7RUFDVCxNQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGlCQUFELEVBQVE7O0VBQ1IsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixzQkFBQSxHQUF5QixPQUFBLENBQVEsZ0JBQVI7O0VBQ3pCLFlBQUEsR0FBZSxPQUFBLENBQVEsZ0JBQVI7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7O0lBQ3JCLFlBQVksQ0FBQyxXQUFiLENBQXlCLHNCQUF6Qjs7SUFFQSxzQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sd0JBQVA7T0FBTCxFQUFzQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3BDLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDZCQUFQO1lBQXNDLE1BQUEsRUFBUSxXQUE5QztXQUFMLEVBQWdFLFNBQUE7bUJBQzlELEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHdCQUFQO2NBQWlDLE1BQUEsRUFBUSxVQUF6QzthQUFMO1VBRDhELENBQWhFO1FBRG9DO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QztJQURROztxQ0FLVixVQUFBLEdBQVksU0FBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFNBQUQ7TUFDWCxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJ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QVosQ0FBZ0IsZ0NBQWhCLENBQUg7ZUFDRSxJQUFDLENBQUEsYUFBRCxDQUFlLElBQUMsQ0FBQSxVQUFoQixFQUE0QixDQUE1QixFQUErQixZQUFZLENBQUMsUUFBNUMsRUFBc0QsTUFBQSxHQUFPLFlBQTdELEVBREY7O0lBckJPOztxQ0F3QlQsd0JBQUEsR0FBMEIsU0FBQTtBQUN4QixVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEsZUFBSjtRQUNFLE9BQThCLElBQUMsQ0FBQSxzQkFBc0IsQ0FBQyxlQUF4QixDQUF3QyxJQUFDLENBQUEsVUFBekMsQ0FBOUIsRUFBQyxnQ0FBRCxFQUFlO1FBRWYsSUFBRyxvQkFBSDtVQUNFLElBQUEsQ0FBYyxXQUFkO0FBQUEsbUJBQUE7O1VBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxZQUFUO0FBQ0EsaUJBSEY7U0FBQSxNQUFBO1VBS0UsSUFBQSxDQUEyQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLENBQTNCO1lBQUEsSUFBQyxDQUFBLGdCQUFELENBQUEsRUFBQTtXQUxGOztRQU9BLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixhQVYxQjs7TUFZQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQWJ3Qjs7OztLQTlIMEI7QUFOdEQiLCJzb3VyY2VzQ29udGVudCI6WyJ7Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbntSYW5nZSwgUG9pbnR9ID0gcmVxdWlyZSAnYXRvbSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5EaWZmRGV0YWlsc0RhdGFNYW5hZ2VyID0gcmVxdWlyZSAnLi9kYXRhLW1hbmFnZXInXG5Ib3VzZWtlZXBpbmcgPSByZXF1aXJlICcuL2hvdXNla2VlcGluZydcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBBdG9tR2l0RGlmZkRldGFpbHNWaWV3IGV4dGVuZHMgVmlld1xuICBIb3VzZWtlZXBpbmcuaW5jbHVkZUludG8odGhpcylcblxuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiBcImdpdC1kaWZmLWRldGFpbHMtb3V0ZXJcIiwgPT5cbiAgICAgIEBkaXYgY2xhc3M6IFwiZ2l0LWRpZmYtZGV0YWlscy1tYWluLXBhbmVsXCIsIG91dGxldDogXCJtYWluUGFuZWxcIiwgPT5cbiAgICAgICAgQGRpdiBjbGFzczogXCJlZGl0b3IgZ2l0LWRpZmYtZWRpdG9yXCIsIG91dGxldDogXCJjb250ZW50c1wiXG5cbiAgaW5pdGlhbGl6ZTogKEBlZGl0b3IpIC0+XG4gICAgQGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoQGVkaXRvcilcblxuICAgIEBkaWZmRGV0YWlsc0RhdGFNYW5hZ2VyID0gbmV3IERpZmZEZXRhaWxzRGF0YU1hbmFnZXIoKVxuXG4gICAgQGluaXRpYWxpemVIb3VzZWtlZXBpbmcoKVxuICAgIEBwcmV2ZW50Rm9jdXNPdXQoKVxuXG4gICAgQGRpZmZFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3IobGluZU51bWJlckd1dHRlclZpc2libGU6IGZhbHNlLCBzY3JvbGxQYXN0RW5kOiBmYWxzZSlcbiAgICBAY29udGVudHMuaHRtbChhdG9tLnZpZXdzLmdldFZpZXcoQGRpZmZFZGl0b3IpKVxuXG4gICAgQG1hcmtlcnMgPSBbXVxuXG4gICAgQHNob3dEaWZmRGV0YWlscyA9IGZhbHNlXG4gICAgQGxpbmVEaWZmRGV0YWlscyA9IG51bGxcblxuICAgIEB1cGRhdGVDdXJyZW50Um93KClcblxuICBwcmV2ZW50Rm9jdXNPdXQ6IC0+XG4gICAgQG1haW5QYW5lbC5vbiAnbW91c2Vkb3duJywgKCkgLT5cbiAgICAgIGZhbHNlXG5cbiAgZ2V0QWN0aXZlVGV4dEVkaXRvcjogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICB1cGRhdGVDdXJyZW50Um93OiAtPlxuICAgIG5ld0N1cnJlbnRSb3cgPSBAZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpPy5yb3cgKyAxXG4gICAgaWYgbmV3Q3VycmVudFJvdyAhPSBAY3VycmVudFJvd1xuICAgICAgQGN1cnJlbnRSb3cgPSBuZXdDdXJyZW50Um93XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIG5vdGlmeUNvbnRlbnRzTW9kaWZpZWQ6ID0+XG4gICAgcmV0dXJuIGlmIEBlZGl0b3IuaXNEZXN0cm95ZWQoKVxuICAgIEBkaWZmRGV0YWlsc0RhdGFNYW5hZ2VyLmludmFsaWRhdGUoQHJlcG9zaXRvcnlGb3JQYXRoKEBlZGl0b3IuZ2V0UGF0aCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBlZGl0b3IuZ2V0UGF0aCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQGVkaXRvci5nZXRUZXh0KCkpXG4gICAgaWYgQHNob3dEaWZmRGV0YWlsc1xuICAgICAgQHVwZGF0ZURpZmZEZXRhaWxzRGlzcGxheSgpXG5cbiAgdXBkYXRlRGlmZkRldGFpbHM6IC0+XG4gICAgQGRpZmZEZXRhaWxzRGF0YU1hbmFnZXIuaW52YWxpZGF0ZVByZXZpb3VzU2VsZWN0ZWRIdW5rKClcbiAgICBAdXBkYXRlQ3VycmVudFJvdygpXG4gICAgQHVwZGF0ZURpZmZEZXRhaWxzRGlzcGxheSgpXG5cbiAgdG9nZ2xlU2hvd0RpZmZEZXRhaWxzOiAtPlxuICAgIEBzaG93RGlmZkRldGFpbHMgPSAhQHNob3dEaWZmRGV0YWlsc1xuICAgIEB1cGRhdGVEaWZmRGV0YWlscygpXG5cbiAgY2xvc2VEaWZmRGV0YWlsczogLT5cbiAgICBAc2hvd0RpZmZEZXRhaWxzID0gZmFsc2VcbiAgICBAdXBkYXRlRGlmZkRldGFpbHMoKVxuXG4gIG5vdGlmeUNoYW5nZUN1cnNvclBvc2l0aW9uOiAtPlxuICAgIGlmIEBzaG93RGlmZkRldGFpbHNcbiAgICAgIGN1cnJlbnRSb3dDaGFuZ2VkID0gQHVwZGF0ZUN1cnJlbnRSb3coKVxuICAgICAgQHVwZGF0ZURpZmZEZXRhaWxzRGlzcGxheSgpIGlmIGN1cnJlbnRSb3dDaGFuZ2VkXG5cbiAgY29weTogLT5cbiAgICB7c2VsZWN0ZWRIdW5rfSA9IEBkaWZmRGV0YWlsc0RhdGFNYW5hZ2VyLmdldFNlbGVjdGVkSHVuayhAY3VycmVudFJvdylcbiAgICBpZiBzZWxlY3RlZEh1bms/XG4gICAgICBhdG9tLmNsaXBib2FyZC53cml0ZShzZWxlY3RlZEh1bmsub2xkU3RyaW5nKVxuICAgICAgQGNsb3NlRGlmZkRldGFpbHMoKSBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1kaWZmLWRldGFpbHMuY2xvc2VBZnRlckNvcHknKVxuXG4gIHVuZG86IC0+XG4gICAge3NlbGVjdGVkSHVua30gPSBAZGlmZkRldGFpbHNEYXRhTWFuYWdlci5nZXRTZWxlY3RlZEh1bmsoQGN1cnJlbnRSb3cpXG5cbiAgICBpZiBzZWxlY3RlZEh1bms/IGFuZCBidWZmZXIgPSBAZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBpZiBzZWxlY3RlZEh1bmsua2luZCBpcyBcIm1cIlxuICAgICAgICBidWZmZXIuc2V0VGV4dEluUmFuZ2UoW1tzZWxlY3RlZEh1bmsuc3RhcnQgLSAxLCAwXSwgW3NlbGVjdGVkSHVuay5lbmQsIDBdXSwgc2VsZWN0ZWRIdW5rLm9sZFN0cmluZylcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmZmVyLmluc2VydChbc2VsZWN0ZWRIdW5rLnN0YXJ0LCAwXSwgc2VsZWN0ZWRIdW5rLm9sZFN0cmluZylcbiAgICAgIEBjbG9zZURpZmZEZXRhaWxzKCkgdW5sZXNzIGF0b20uY29uZmlnLmdldCgnZ2l0LWRpZmYtZGV0YWlscy5rZWVwVmlld1RvZ2dsZWQnKVxuXG4gIGRlc3Ryb3lEZWNvcmF0aW9uOiAtPlxuICAgIGZvciBtYXJrZXIgaW4gQG1hcmtlcnNcbiAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICBAbWFya2VycyA9IFtdXG5cbiAgZGVjb3JhdGVMaW5lczogKGVkaXRvciwgc3RhcnQsIGVuZCwgdHlwZSkgLT5cbiAgICByYW5nZSA9IG5ldyBSYW5nZShuZXcgUG9pbnQoc3RhcnQsIDApLCBuZXcgUG9pbnQoZW5kLCAwKSlcbiAgICBtYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlKVxuICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHR5cGU6ICdsaW5lJywgY2xhc3M6IFwiZ2l0LWRpZmYtZGV0YWlscy0je3R5cGV9XCIpXG4gICAgQG1hcmtlcnMucHVzaChtYXJrZXIpXG5cbiAgZGVjb3JhdGVXb3JkczogKGVkaXRvciwgc3RhcnQsIHdvcmRzLCB0eXBlKSAtPlxuICAgIHJldHVybiB1bmxlc3Mgd29yZHNcbiAgICBmb3Igd29yZCBpbiB3b3JkcyB3aGVuIHdvcmQuY2hhbmdlZFxuICAgICAgcm93ID0gc3RhcnQgKyB3b3JkLm9mZnNldFJvd1xuICAgICAgcmFuZ2UgPSBuZXcgUmFuZ2UobmV3IFBvaW50KHJvdywgd29yZC5zdGFydENvbCksIG5ldyBQb2ludChyb3csIHdvcmQuZW5kQ29sKSlcbiAgICAgIG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICBlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB0eXBlOiAnaGlnaGxpZ2h0JywgY2xhc3M6IFwiZ2l0LWRpZmYtZGV0YWlscy0je3R5cGV9XCIpXG4gICAgICBAbWFya2Vycy5wdXNoKG1hcmtlcilcblxuICBkaXNwbGF5OiAoc2VsZWN0ZWRIdW5rKSAtPlxuICAgIEBkZXN0cm95RGVjb3JhdGlvbigpXG5cbiAgICBjbGFzc1Bvc3RmaXggPVxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtZGlmZi1kZXRhaWxzLmVuYWJsZVN5bnRheEhpZ2hsaWdodGluZycpXG4gICAgICAgIFwiaGlnaGxpZ2h0ZWRcIlxuICAgICAgZWxzZSBcImZsYXRcIlxuXG4gICAgaWYgc2VsZWN0ZWRIdW5rLmtpbmQgaXMgXCJtXCJcbiAgICAgIEBkZWNvcmF0ZUxpbmVzKEBlZGl0b3IsIHNlbGVjdGVkSHVuay5zdGFydCAtIDEsIHNlbGVjdGVkSHVuay5lbmQsIFwibmV3LSN7Y2xhc3NQb3N0Zml4fVwiKVxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtZGlmZi1kZXRhaWxzLnNob3dXb3JkRGlmZnMnKVxuICAgICAgICBAZGVjb3JhdGVXb3JkcyhAZWRpdG9yLCBzZWxlY3RlZEh1bmsuc3RhcnQgLSAxLCBzZWxlY3RlZEh1bmsubmV3V29yZHMsIFwibmV3LSN7Y2xhc3NQb3N0Zml4fVwiKVxuXG4gICAgcmFuZ2UgPSBuZXcgUmFuZ2UobmV3IFBvaW50KHNlbGVjdGVkSHVuay5lbmQgLSAxLCAwKSwgbmV3IFBvaW50KHNlbGVjdGVkSHVuay5lbmQgLSAxLCAwKSlcbiAgICBtYXJrZXIgPSBAZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyYW5nZSlcbiAgICBAZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwgdHlwZTogJ2Jsb2NrJywgcG9zaXRpb246ICdhZnRlcicsIGl0ZW06IHRoaXMpXG4gICAgQG1hcmtlcnMucHVzaChtYXJrZXIpXG5cbiAgICBAZGlmZkVkaXRvci5zZXRHcmFtbWFyKEBnZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldEdyYW1tYXIoKSlcbiAgICBAZGlmZkVkaXRvci5zZXRUZXh0KHNlbGVjdGVkSHVuay5vbGRTdHJpbmcucmVwbGFjZSgvW1xcclxcbl0rJC9nLCBcIlwiKSlcbiAgICBAZGVjb3JhdGVMaW5lcyhAZGlmZkVkaXRvciwgMCwgc2VsZWN0ZWRIdW5rLm9sZExpbmVzLmxlbmd0aCwgXCJvbGQtI3tjbGFzc1Bvc3RmaXh9XCIpXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtZGlmZi1kZXRhaWxzLnNob3dXb3JkRGlmZnMnKVxuICAgICAgQGRlY29yYXRlV29yZHMoQGRpZmZFZGl0b3IsIDAsIHNlbGVjdGVkSHVuay5vbGRXb3JkcywgXCJvbGQtI3tjbGFzc1Bvc3RmaXh9XCIpXG5cbiAgdXBkYXRlRGlmZkRldGFpbHNEaXNwbGF5OiAtPlxuICAgIGlmIEBzaG93RGlmZkRldGFpbHNcbiAgICAgIHtzZWxlY3RlZEh1bmssIGlzRGlmZmVyZW50fSA9IEBkaWZmRGV0YWlsc0RhdGFNYW5hZ2VyLmdldFNlbGVjdGVkSHVuayhAY3VycmVudFJvdylcblxuICAgICAgaWYgc2VsZWN0ZWRIdW5rP1xuICAgICAgICByZXR1cm4gdW5sZXNzIGlzRGlmZmVyZW50XG4gICAgICAgIEBkaXNwbGF5KHNlbGVjdGVkSHVuaylcbiAgICAgICAgcmV0dXJuXG4gICAgICBlbHNlXG4gICAgICAgIEBjbG9zZURpZmZEZXRhaWxzKCkgdW5sZXNzIGF0b20uY29uZmlnLmdldCgnZ2l0LWRpZmYtZGV0YWlscy5rZWVwVmlld1RvZ2dsZWQnKVxuXG4gICAgICBAcHJldmlvdXNTZWxlY3RlZEh1bmsgPSBzZWxlY3RlZEh1bmtcblxuICAgIEBkZXN0cm95RGVjb3JhdGlvbigpXG4gICAgcmV0dXJuXG4iXX0=
