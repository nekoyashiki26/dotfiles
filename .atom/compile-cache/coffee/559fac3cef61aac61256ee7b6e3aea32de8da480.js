(function() {
  var CompositeDisposable, CursorStyleManager, Delegato, Disposable, Point, ref, swrap,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require('atom'), Point = ref.Point, Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  Delegato = require('delegato');

  swrap = require('./selection-wrapper');

  CursorStyleManager = (function() {
    CursorStyleManager.prototype.lineHeight = null;

    Delegato.includeInto(CursorStyleManager);

    CursorStyleManager.delegatesProperty('mode', 'submode', {
      toProperty: 'vimState'
    });

    function CursorStyleManager(vimState) {
      var ref1;
      this.vimState = vimState;
      this.refresh = bind(this.refresh, this);
      ref1 = this.vimState, this.editorElement = ref1.editorElement, this.editor = ref1.editor;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('editor.lineHeight', this.refresh));
      this.subscriptions.add(atom.config.observe('editor.fontSize', this.refresh));
    }

    CursorStyleManager.prototype.destroy = function() {
      var ref1;
      if ((ref1 = this.styleDisposables) != null) {
        ref1.dispose();
      }
      return this.subscriptions.dispose();
    };

    CursorStyleManager.prototype.refresh = function() {
      var cursor, cursorNode, cursorNodesById, cursorsToShow, i, j, len, len1, ref1, ref2, results;
      if (atom.inSpecMode()) {
        return;
      }
      this.lineHeight = this.editor.getLineHeightInPixels();
      if ((ref1 = this.styleDisposables) != null) {
        ref1.dispose();
      }
      if (this.mode !== 'visual') {
        return;
      }
      this.styleDisposables = new CompositeDisposable;
      if (this.submode === 'blockwise') {
        cursorsToShow = this.vimState.getBlockwiseSelections().map(function(bs) {
          return bs.getHeadSelection().cursor;
        });
      } else {
        cursorsToShow = this.editor.getCursors();
      }
      ref2 = this.editor.getCursors();
      for (i = 0, len = ref2.length; i < len; i++) {
        cursor = ref2[i];
        cursor.setVisible(indexOf.call(cursorsToShow, cursor) >= 0);
      }
      this.editorElement.component.updateSync();
      cursorNodesById = this.editorElement.component.linesComponent.cursorsComponent.cursorNodesById;
      results = [];
      for (j = 0, len1 = cursorsToShow.length; j < len1; j++) {
        cursor = cursorsToShow[j];
        if (cursorNode = cursorNodesById[cursor.id]) {
          results.push(this.styleDisposables.add(this.modifyStyle(cursor, cursorNode)));
        }
      }
      return results;
    };

    CursorStyleManager.prototype.getCursorBufferPositionToDisplay = function(selection) {
      var bufferPosition, bufferPositionToDisplay, screenPosition;
      bufferPosition = swrap(selection).getBufferPositionFor('head', {
        from: ['property']
      });
      if (this.editor.hasAtomicSoftTabs() && !selection.isReversed()) {
        screenPosition = this.editor.screenPositionForBufferPosition(bufferPosition.translate([0, +1]), {
          clipDirection: 'forward'
        });
        bufferPositionToDisplay = this.editor.bufferPositionForScreenPosition(screenPosition).translate([0, -1]);
        if (bufferPositionToDisplay.isGreaterThan(bufferPosition)) {
          bufferPosition = bufferPositionToDisplay;
        }
      }
      return this.editor.clipBufferPosition(bufferPosition);
    };

    CursorStyleManager.prototype.modifyStyle = function(cursor, domNode) {
      var bufferPosition, column, ref1, ref2, row, screenPosition, selection, style;
      selection = cursor.selection;
      bufferPosition = this.getCursorBufferPositionToDisplay(selection);
      if (this.submode === 'linewise' && this.editor.isSoftWrapped()) {
        screenPosition = this.editor.screenPositionForBufferPosition(bufferPosition);
        ref1 = screenPosition.traversalFrom(cursor.getScreenPosition()), row = ref1.row, column = ref1.column;
      } else {
        ref2 = bufferPosition.traversalFrom(cursor.getBufferPosition()), row = ref2.row, column = ref2.column;
      }
      style = domNode.style;
      if (row) {
        style.setProperty('top', (this.lineHeight * row) + "px");
      }
      if (column) {
        style.setProperty('left', column + "ch");
      }
      return new Disposable(function() {
        style.removeProperty('top');
        return style.removeProperty('left');
      });
    };

    return CursorStyleManager;

  })();

  module.exports = CursorStyleManager;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMvbGliL2N1cnNvci1zdHlsZS1tYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsZ0ZBQUE7SUFBQTs7O0VBQUEsTUFBMkMsT0FBQSxDQUFRLE1BQVIsQ0FBM0MsRUFBQyxpQkFBRCxFQUFRLDJCQUFSLEVBQW9COztFQUNwQixRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVI7O0VBQ1gsS0FBQSxHQUFRLE9BQUEsQ0FBUSxxQkFBUjs7RUFJRjtpQ0FDSixVQUFBLEdBQVk7O0lBRVosUUFBUSxDQUFDLFdBQVQsQ0FBcUIsa0JBQXJCOztJQUNBLGtCQUFDLENBQUEsaUJBQUQsQ0FBbUIsTUFBbkIsRUFBMkIsU0FBM0IsRUFBc0M7TUFBQSxVQUFBLEVBQVksVUFBWjtLQUF0Qzs7SUFFYSw0QkFBQyxRQUFEO0FBQ1gsVUFBQTtNQURZLElBQUMsQ0FBQSxXQUFEOztNQUNaLE9BQTRCLElBQUMsQ0FBQSxRQUE3QixFQUFDLElBQUMsQ0FBQSxxQkFBQSxhQUFGLEVBQWlCLElBQUMsQ0FBQSxjQUFBO01BQ2xCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixtQkFBcEIsRUFBeUMsSUFBQyxDQUFBLE9BQTFDLENBQW5CO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixpQkFBcEIsRUFBdUMsSUFBQyxDQUFBLE9BQXhDLENBQW5CO0lBSlc7O2lDQU1iLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTs7WUFBaUIsQ0FBRSxPQUFuQixDQUFBOzthQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixD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QWYsQ0FBNkIsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBN0IsQ0FBaEIsRUFBQyxjQUFELEVBQU0scUJBSlI7O01BTUEsS0FBQSxHQUFRLE9BQU8sQ0FBQztNQUNoQixJQUFzRCxHQUF0RDtRQUFBLEtBQUssQ0FBQyxXQUFOLENBQWtCLEtBQWxCLEVBQTJCLENBQUMsSUFBQyxDQUFBLFVBQUQsR0FBYyxHQUFmLENBQUEsR0FBbUIsSUFBOUMsRUFBQTs7TUFDQSxJQUE0QyxNQUE1QztRQUFBLEtBQUssQ0FBQyxXQUFOLENBQWtCLE1BQWxCLEVBQTZCLE1BQUQsR0FBUSxJQUFwQyxFQUFBOzthQUNJLElBQUEsVUFBQSxDQUFXLFNBQUE7UUFDYixLQUFLLENBQUMsY0FBTixDQUFxQixLQUFyQjtlQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCO01BRmEsQ0FBWDtJQWJPOzs7Ozs7RUFpQmYsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUE5RWpCIiwic291cmNlc0NvbnRlbnQiOlsie1BvaW50LCBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5EZWxlZ2F0byA9IHJlcXVpcmUgJ2RlbGVnYXRvJ1xuc3dyYXAgPSByZXF1aXJlICcuL3NlbGVjdGlvbi13cmFwcGVyJ1xuXG4jIERpc3BsYXkgY3Vyc29yIGluIHZpc3VhbC1tb2RlXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEN1cnNvclN0eWxlTWFuYWdlclxuICBsaW5lSGVpZ2h0OiBudWxsXG5cbiAgRGVsZWdhdG8uaW5jbHVkZUludG8odGhpcylcbiAgQGRlbGVnYXRlc1Byb3BlcnR5KCdtb2RlJywgJ3N1Ym1vZGUnLCB0b1Byb3BlcnR5OiAndmltU3RhdGUnKVxuXG4gIGNvbnN0cnVjdG9yOiAoQHZpbVN0YXRlKSAtPlxuICAgIHtAZWRpdG9yRWxlbWVudCwgQGVkaXRvcn0gPSBAdmltU3RhdGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5saW5lSGVpZ2h0JywgQHJlZnJlc2gpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5mb250U2l6ZScsIEByZWZyZXNoKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHN0eWxlRGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gIHJlZnJlc2g6ID0+XG4gICAgIyBJbnRlbnRpb25hbGx5IHNraXAgaW4gc3BlYyBtb2RlLCBzaW5jZSBub3QgYWxsIHNwZWMgaGF2ZSBET00gYXR0YWNoZWQoIGFuZCBkb24ndCB3YW50IHRvICkuXG4gICAgcmV0dXJuIGlmIGF0b20uaW5TcGVjTW9kZSgpXG4gICAgQGxpbmVIZWlnaHQgPSBAZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG5cbiAgICAjIFdlIG11c3QgZGlzcG9zZSBwcmV2aW91cyBzdHlsZSBtb2RpZmljYXRpb24gZm9yIG5vbi12aXN1YWwtbW9kZVxuICAgIEBzdHlsZURpc3Bvc2FibGVzPy5kaXNwb3NlKClcbiAgICByZXR1cm4gdW5sZXNzIEBtb2RlIGlzICd2aXN1YWwnXG5cbiAgICBAc3R5bGVEaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgaWYgQHN1Ym1vZGUgaXMgJ2Jsb2Nrd2lzZSdcbiAgICAgIGN1cnNvcnNUb1Nob3cgPSBAdmltU3RhdGUuZ2V0QmxvY2t3aXNlU2VsZWN0aW9ucygpLm1hcCAoYnMpIC0+IGJzLmdldEhlYWRTZWxlY3Rpb24oKS5jdXJzb3JcbiAgICBlbHNlXG4gICAgICBjdXJzb3JzVG9TaG93ID0gQGVkaXRvci5nZXRDdXJzb3JzKClcblxuICAgICMgSW4gYmxvY2t3aXNlLCBzaG93IG9ubHkgYmxvY2t3aXNlLWhlYWQgY3Vyc29yXG4gICAgZm9yIGN1cnNvciBpbiBAZWRpdG9yLmdldEN1cnNvcnMoKVxuICAgICAgY3Vyc29yLnNldFZpc2libGUoY3Vyc29yIGluIGN1cnNvcnNUb1Nob3cpXG5cbiAgICAjIEZJWE1FOiBpbiBvY2N1cnJlbmNlLCBpbiB2QiwgbXVsdGktc2VsZWN0aW9ucyBhcmUgYWRkZWQgZHVyaW5nIG9wZXJhdGlvbiBidXQgc2VsZWN0aW9uIGlzIGFkZGVkIGFzeW5jaHJvbm91c2x5LlxuICAgICMgV2UgbmVlZCB0byBtYWtlIHN1cmUgdGhhdCBjb3JyZXNwb25kaW5nIGN1cnNvcidzIGRvbU5vZGUgaXMgYXZhaWxhYmxlIHRvIG1vZGlmeSBpdCdzIHN0eWxlLlxuICAgIEBlZGl0b3JFbGVtZW50LmNvbXBvbmVudC51cGRhdGVTeW5jKClcblxuICAgICMgW05PVEVdIFVzaW5nIG5vbi1wdWJsaWMgQVBJXG4gICAgY3Vyc29yTm9kZXNCeUlkID0gQGVkaXRvckVsZW1lbnQuY29tcG9uZW50LmxpbmVzQ29tcG9uZW50LmN1cnNvcnNDb21wb25lbnQuY3Vyc29yTm9kZXNCeUlkXG4gICAgZm9yIGN1cnNvciBpbiBjdXJzb3JzVG9TaG93IHdoZW4gY3Vyc29yTm9kZSA9IGN1cnNvck5vZGVzQnlJZFtjdXJzb3IuaWRdXG4gICAgICBAc3R5bGVEaXNwb3NhYmxlcy5hZGQgQG1vZGlmeVN0eWxlKGN1cnNvciwgY3Vyc29yTm9kZSlcblxuICBnZXRDdXJzb3JCdWZmZXJQb3NpdGlvblRvRGlzcGxheTogKHNlbGVjdGlvbikgLT5cbiAgICBidWZmZXJQb3NpdGlvbiA9IHN3cmFwKHNlbGVjdGlvbikuZ2V0QnVmZmVyUG9zaXRpb25Gb3IoJ2hlYWQnLCBmcm9tOiBbJ3Byb3BlcnR5J10pXG4gICAgaWYgQGVkaXRvci5oYXNBdG9taWNTb2Z0VGFicygpIGFuZCBub3Qgc2VsZWN0aW9uLmlzUmV2ZXJzZWQoKVxuICAgICAgc2NyZWVuUG9zaXRpb24gPSBAZWRpdG9yLnNjcmVlblBvc2l0aW9uRm9yQnVmZmVyUG9zaXRpb24oYnVmZmVyUG9zaXRpb24udHJhbnNsYXRlKFswLCArMV0pLCBjbGlwRGlyZWN0aW9uOiAnZm9yd2FyZCcpXG4gICAgICBidWZmZXJQb3NpdGlvblRvRGlzcGxheSA9IEBlZGl0b3IuYnVmZmVyUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihzY3JlZW5Qb3NpdGlvbikudHJhbnNsYXRlKFswLCAtMV0pXG4gICAgICBpZiBidWZmZXJQb3NpdGlvblRvRGlzcGxheS5pc0dyZWF0ZXJUaGFuKGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgICBidWZmZXJQb3NpdGlvbiA9IGJ1ZmZlclBvc2l0aW9uVG9EaXNwbGF5XG5cbiAgICBAZWRpdG9yLmNsaXBCdWZmZXJQb3NpdGlvbihidWZmZXJQb3NpdGlvbilcblxuICAjIEFwcGx5IHNlbGVjdGlvbiBwcm9wZXJ0eSdzIHRyYXZlcnNhbCBmcm9tIGFjdHVhbCBjdXJzb3IgdG8gY3Vyc29yTm9kZSdzIHN0eWxlXG4gIG1vZGlmeVN0eWxlOiAoY3Vyc29yLCBkb21Ob2RlKSAtPlxuICAgIHNlbGVjdGlvbiA9IGN1cnNvci5zZWxlY3Rpb25cbiAgICBidWZmZXJQb3NpdGlvbiA9IEBnZXRDdXJzb3JCdWZmZXJQb3NpdGlvblRvRGlzcGxheShzZWxlY3Rpb24pXG5cbiAgICBpZiBAc3VibW9kZSBpcyAnbGluZXdpc2UnIGFuZCBAZWRpdG9yLmlzU29mdFdyYXBwZWQoKVxuICAgICAgc2NyZWVuUG9zaXRpb24gPSBAZWRpdG9yLnNjcmVlblBvc2l0aW9uRm9yQnVmZmVyUG9zaXRpb24oYnVmZmVyUG9zaXRpb24pXG4gICAgICB7cm93LCBjb2x1bW59ID0gc2NyZWVuUG9zaXRpb24udHJhdmVyc2FsRnJvbShjdXJzb3IuZ2V0U2NyZWVuUG9zaXRpb24oKSlcbiAgICBlbHNlXG4gICAgICB7cm93LCBjb2x1bW59ID0gYnVmZmVyUG9zaXRpb24udHJhdmVyc2FsRnJvbShjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcblxuICAgIHN0eWxlID0gZG9tTm9kZS5zdHlsZVxuICAgIHN0eWxlLnNldFByb3BlcnR5KCd0b3AnLCBcIiN7QGxpbmVIZWlnaHQgKiByb3d9cHhcIikgaWYgcm93XG4gICAgc3R5bGUuc2V0UHJvcGVydHkoJ2xlZnQnLCBcIiN7Y29sdW1ufWNoXCIpIGlmIGNvbHVtblxuICAgIG5ldyBEaXNwb3NhYmxlIC0+XG4gICAgICBzdHlsZS5yZW1vdmVQcm9wZXJ0eSgndG9wJylcbiAgICAgIHN0eWxlLnJlbW92ZVByb3BlcnR5KCdsZWZ0JylcblxubW9kdWxlLmV4cG9ydHMgPSBDdXJzb3JTdHlsZU1hbmFnZXJcbiJdfQ==
