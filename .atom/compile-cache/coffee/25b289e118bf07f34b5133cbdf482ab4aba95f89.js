(function() {
  var $, $$, AutocompleteView, CompositeDisposable, Range, SelectListView, _, ref, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable;

  ref1 = require('atom-space-pen-views'), $ = ref1.$, $$ = ref1.$$, SelectListView = ref1.SelectListView;

  module.exports = AutocompleteView = (function(superClass) {
    extend(AutocompleteView, superClass);

    function AutocompleteView() {
      return AutocompleteView.__super__.constructor.apply(this, arguments);
    }

    AutocompleteView.prototype.currentBuffer = null;

    AutocompleteView.prototype.checkpoint = null;

    AutocompleteView.prototype.wordList = null;

    AutocompleteView.prototype.wordRegex = /\w+/g;

    AutocompleteView.prototype.originalSelectionBufferRanges = null;

    AutocompleteView.prototype.originalCursorPosition = null;

    AutocompleteView.prototype.aboveCursor = false;

    AutocompleteView.prototype.initialize = function(editor) {
      this.editor = editor;
      AutocompleteView.__super__.initialize.apply(this, arguments);
      this.addClass('autocomplete popover-list');
      this.handleEvents();
      return this.setCurrentBuffer(this.editor.getBuffer());
    };

    AutocompleteView.prototype.getFilterKey = function() {
      return 'word';
    };

    AutocompleteView.prototype.viewForItem = function(arg) {
      var word;
      word = arg.word;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            return _this.span(word);
          };
        })(this));
      });
    };

    AutocompleteView.prototype.handleEvents = function() {
      this.list.on('mousewheel', function(event) {
        return event.stopPropagation();
      });
      this.editor.onDidChangePath((function(_this) {
        return function() {
          return _this.setCurrentBuffer(_this.editor.getBuffer());
        };
      })(this));
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this)));
      return this.filterEditorView.getModel().onWillInsertText((function(_this) {
        return function(arg) {
          var cancel, text;
          cancel = arg.cancel, text = arg.text;
          if (!text.match(_this.wordRegex)) {
            _this.confirmSelection();
            _this.editor.insertText(text);
            return cancel();
          }
        };
      })(this));
    };

    AutocompleteView.prototype.setCurrentBuffer = function(currentBuffer) {
      this.currentBuffer = currentBuffer;
    };

    AutocompleteView.prototype.selectItemView = function(item) {
      var match;
      AutocompleteView.__super__.selectItemView.apply(this, arguments);
      if (match = this.getSelectedItem()) {
        return this.replaceSelectedTextWithMatch(match);
      }
    };

    AutocompleteView.prototype.selectNextItemView = function() {
      AutocompleteView.__super__.selectNextItemView.apply(this, arguments);
      return false;
    };

    AutocompleteView.prototype.selectPreviousItemView = function() {
      AutocompleteView.__super__.selectPreviousItemView.apply(this, arguments);
      return false;
    };

    AutocompleteView.prototype.getCompletionsForCursorScope = function() {
      var completions, scope;
      scope = this.editor.scopeDescriptorForBufferPosition(this.editor.getCursorBufferPosition());
      completions = atom.config.getAll('editor.completions', {
        scope: scope
      });
      return _.uniq(_.flatten(_.pluck(completions, 'value')));
    };

    AutocompleteView.prototype.buildWordList = function() {
      var buffer, buffers, j, k, l, len, len1, len2, matches, ref2, ref3, word, wordHash;
      wordHash = {};
      if (atom.config.get('autocomplete.includeCompletionsFromAllBuffers')) {
        buffers = atom.project.getBuffers();
      } else {
        buffers = [this.currentBuffer];
      }
      matches = [];
      for (j = 0, len = buffers.length; j < len; j++) {
        buffer = buffers[j];
        matches.push(buffer.getText().match(this.wordRegex));
      }
      ref2 = _.flatten(matches);
      for (k = 0, len1 = ref2.length; k < len1; k++) {
        word = ref2[k];
        if (word) {
          if (wordHash[word] == null) {
            wordHash[word] = true;
          }
        }
      }
      ref3 = this.getCompletionsForCursorScope();
      for (l = 0, len2 = ref3.length; l < len2; l++) {
        word = ref3[l];
        if (word) {
          if (wordHash[word] == null) {
            wordHash[word] = true;
          }
        }
      }
      return this.wordList = Object.keys(wordHash).sort(function(word1, word2) {
        return word1.toLowerCase().localeCompare(word2.toLowerCase());
      });
    };

    AutocompleteView.prototype.confirmed = function(match) {
      this.editor.getSelections().forEach(function(selection) {
        return selection.clear();
      });
      this.cancel();
      if (!match) {
        return;
      }
      this.replaceSelectedTextWithMatch(match);
      return this.editor.getCursors().forEach(function(cursor) {
        var position;
        position = cursor.getBufferPosition();
        return cursor.setBufferPosition([position.row, position.column + match.suffix.length]);
      });
    };

    AutocompleteView.prototype.cancelled = function() {
      var ref2;
      if ((ref2 = this.overlayDecoration) != null) {
        ref2.destroy();
      }
      if (!this.editor.isDestroyed()) {
        this.editor.revertToCheckpoint(this.checkpoint);
        this.editor.setSelectedBufferRanges(this.originalSelectionBufferRanges);
        return atom.workspace.getActivePane().activate();
      }
    };

    AutocompleteView.prototype.attach = function() {
      var cursorMarker, matches;
      this.checkpoint = this.editor.createCheckpoint();
      this.aboveCursor = false;
      this.originalSelectionBufferRanges = this.editor.getSelections().map(function(selection) {
        return selection.getBufferRange();
      });
      this.originalCursorPosition = this.editor.getCursorScreenPosition();
      if (!this.allPrefixAndSuffixOfSelectionsMatch()) {
        return this.cancel();
      }
      this.buildWordList();
      matches = this.findMatchesForCurrentSelection();
      this.setItems(matches);
      if (matches.length === 1) {
        return this.confirmSelection();
      } else {
        cursorMarker = this.editor.getLastCursor().getMarker();
        return this.overlayDecoration = this.editor.decorateMarker(cursorMarker, {
          type: 'overlay',
          position: 'tail',
          item: this
        });
      }
    };

    AutocompleteView.prototype.destroy = function() {
      var ref2;
      return (ref2 = this.overlayDecoration) != null ? ref2.destroy() : void 0;
    };

    AutocompleteView.prototype.toggle = function() {
      if (this.isVisible()) {
        return this.cancel();
      } else {
        return this.attach();
      }
    };

    AutocompleteView.prototype.findMatchesForCurrentSelection = function() {
      var currentWord, j, k, len, len1, prefix, ref2, ref3, ref4, regex, results, results1, selection, suffix, word;
      selection = this.editor.getLastSelection();
      ref2 = this.prefixAndSuffixOfSelection(selection), prefix = ref2.prefix, suffix = ref2.suffix;
      if ((prefix.length + suffix.length) > 0) {
        regex = new RegExp("^" + prefix + ".+" + suffix + "$", "i");
        currentWord = prefix + this.editor.getSelectedText() + suffix;
        ref3 = this.wordList;
        results = [];
        for (j = 0, len = ref3.length; j < len; j++) {
          word = ref3[j];
          if (regex.test(word) && word !== currentWord) {
            results.push({
              prefix: prefix,
              suffix: suffix,
              word: word
            });
          }
        }
        return results;
      } else {
        ref4 = this.wordList;
        results1 = [];
        for (k = 0, len1 = ref4.length; k < len1; k++) {
          word = ref4[k];
          results1.push({
            word: word,
            prefix: prefix,
            suffix: suffix
          });
        }
        return results1;
      }
    };

    AutocompleteView.prototype.replaceSelectedTextWithMatch = function(match) {
      var newSelectedBufferRanges;
      newSelectedBufferRanges = [];
      return this.editor.transact((function(_this) {
        return function() {
          var selections;
          selections = _this.editor.getSelections();
          selections.forEach(function(selection, i) {
            var buffer, cursorPosition, infixLength, startPosition;
            startPosition = selection.getBufferRange().start;
            buffer = _this.editor.getBuffer();
            selection.deleteSelectedText();
            cursorPosition = _this.editor.getCursors()[i].getBufferPosition();
            buffer["delete"](Range.fromPointWithDelta(cursorPosition, 0, match.suffix.length));
            buffer["delete"](Range.fromPointWithDelta(cursorPosition, 0, -match.prefix.length));
            infixLength = match.word.length - match.prefix.length - match.suffix.length;
            return newSelectedBufferRanges.push([startPosition, [startPosition.row, startPosition.column + infixLength]]);
          });
          _this.editor.insertText(match.word);
          return _this.editor.setSelectedBufferRanges(newSelectedBufferRanges);
        };
      })(this));
    };

    AutocompleteView.prototype.prefixAndSuffixOfSelection = function(selection) {
      var lineRange, prefix, ref2, selectionRange, suffix;
      selectionRange = selection.getBufferRange();
      lineRange = [[selectionRange.start.row, 0], [selectionRange.end.row, this.editor.lineTextForBufferRow(selectionRange.end.row).length]];
      ref2 = ["", ""], prefix = ref2[0], suffix = ref2[1];
      this.currentBuffer.scanInRange(this.wordRegex, lineRange, function(arg) {
        var match, prefixOffset, range, stop, suffixOffset;
        match = arg.match, range = arg.range, stop = arg.stop;
        if (range.start.isGreaterThan(selectionRange.end)) {
          stop();
        }
        if (range.intersectsWith(selectionRange)) {
          prefixOffset = selectionRange.start.column - range.start.column;
          suffixOffset = selectionRange.end.column - range.end.column;
          if (range.start.isLessThan(selectionRange.start)) {
            prefix = match[0].slice(0, prefixOffset);
          }
          if (range.end.isGreaterThan(selectionRange.end)) {
            return suffix = match[0].slice(suffixOffset);
          }
        }
      });
      return {
        prefix: prefix,
        suffix: suffix
      };
    };

    AutocompleteView.prototype.allPrefixAndSuffixOfSelectionsMatch = function() {
      var prefix, ref2, suffix;
      ref2 = {}, prefix = ref2.prefix, suffix = ref2.suffix;
      return this.editor.getSelections().every((function(_this) {
        return function(selection) {
          var previousPrefix, previousSuffix, ref3, ref4;
          ref3 = [prefix, suffix], previousPrefix = ref3[0], previousSuffix = ref3[1];
          ref4 = _this.prefixAndSuffixOfSelection(selection), prefix = ref4.prefix, suffix = ref4.suffix;
          if (!((previousPrefix != null) && (previousSuffix != null))) {
            return true;
          }
          return prefix === previousPrefix && suffix === previousSuffix;
        };
      })(this));
    };

    AutocompleteView.prototype.attached = function() {
      var widestCompletion;
      this.focusFilterEditor();
      widestCompletion = parseInt(this.css('min-width')) || 0;
      this.list.find('span').each(function() {
        return widestCompletion = Math.max(widestCompletion, $(this).outerWidth());
      });
      this.list.width(widestCompletion);
      return this.width(this.list.outerWidth());
    };

    AutocompleteView.prototype.detached = function() {};

    AutocompleteView.prototype.populateList = function() {
      return AutocompleteView.__super__.populateList.apply(this, arguments);
    };

    return AutocompleteView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS9saWIvYXV0b2NvbXBsZXRlLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxpRkFBQTtJQUFBOzs7RUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUNKLE1BQWdDLE9BQUEsQ0FBUSxNQUFSLENBQWhDLEVBQUMsaUJBQUQsRUFBUTs7RUFDUixPQUEyQixPQUFBLENBQVEsc0JBQVIsQ0FBM0IsRUFBQyxVQUFELEVBQUksWUFBSixFQUFROztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7K0JBQ0osYUFBQSxHQUFlOzsrQkFDZixVQUFBLEdBQVk7OytCQUNaLFFBQUEsR0FBVTs7K0JBQ1YsU0FBQSxHQUFXOzsrQkFDWCw2QkFBQSxHQUErQjs7K0JBQy9CLHNCQUFBLEdBQXdCOzsrQkFDeEIsV0FBQSxHQUFhOzsrQkFFYixVQUFBLEdBQVksU0FBQyxNQUFEO01BQUMsSUFBQyxDQUFBLFNBQUQ7TUFDWCxrREFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSwyQkFBVjtNQUNBLElBQUMsQ0FBQSxZQUFELENBQUE7YUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbEI7SUFKVTs7K0JBTVosWUFBQSxHQUFjLFNBQUE7YUFDWjtJQURZOzsrQkFHZCxXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQURhLE9BQUQ7YUFDWixFQUFBLENBQUcsU0FBQTtlQUNELElBQUMsQ0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDRixLQUFDLENBQUEsSUFBRCxDQUFNLElBQU47VUFERTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSjtNQURDLENBQUg7SUFEVzs7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b0RBQUEsU0FBQTtJQURZOzs7O0tBN0xlO0FBTC9CIiwic291cmNlc0NvbnRlbnQiOlsiXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbntSYW5nZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gID0gcmVxdWlyZSAnYXRvbSdcbnskLCAkJCwgU2VsZWN0TGlzdFZpZXd9ICA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBBdXRvY29tcGxldGVWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgY3VycmVudEJ1ZmZlcjogbnVsbFxuICBjaGVja3BvaW50OiBudWxsXG4gIHdvcmRMaXN0OiBudWxsXG4gIHdvcmRSZWdleDogL1xcdysvZ1xuICBvcmlnaW5hbFNlbGVjdGlvbkJ1ZmZlclJhbmdlczogbnVsbFxuICBvcmlnaW5hbEN1cnNvclBvc2l0aW9uOiBudWxsXG4gIGFib3ZlQ3Vyc29yOiBmYWxzZVxuXG4gIGluaXRpYWxpemU6IChAZWRpdG9yKSAtPlxuICAgIHN1cGVyXG4gICAgQGFkZENsYXNzKCdhdXRvY29tcGxldGUgcG9wb3Zlci1saXN0JylcbiAgICBAaGFuZGxlRXZlbnRzKClcbiAgICBAc2V0Q3VycmVudEJ1ZmZlcihAZWRpdG9yLmdldEJ1ZmZlcigpKVxuXG4gIGdldEZpbHRlcktleTogLT5cbiAgICAnd29yZCdcblxuICB2aWV3Rm9ySXRlbTogKHt3b3JkfSkgLT5cbiAgICAkJCAtPlxuICAgICAgQGxpID0+XG4gICAgICAgIEBzcGFuIHdvcmRcblxuICBoYW5kbGVFdmVudHM6IC0+XG4gICAgQGxpc3Qub24gJ21vdXNld2hlZWwnLCAoZXZlbnQpIC0+IGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBAZWRpdG9yLm9uRGlkQ2hhbmdlUGF0aCA9PiBAc2V0Q3VycmVudEJ1ZmZlcihAZWRpdG9yLmdldEJ1ZmZlcigpKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkRGVzdHJveSA9PiBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICAgIEBmaWx0ZXJFZGl0b3JWaWV3LmdldE1vZGVsKCkub25XaWxsSW5zZXJ0VGV4dCAoe2NhbmNlbCwgdGV4dH0pID0+XG4gICAgICB1bmxlc3MgdGV4dC5tYXRjaChAd29yZFJlZ2V4KVxuICAgICAgICBAY29uZmlybVNlbGVjdGlvbigpXG4gICAgICAgIEBlZGl0b3IuaW5zZXJ0VGV4dCh0ZXh0KVxuICAgICAgICBjYW5jZWwoKVxuXG4gIHNldEN1cnJlbnRCdWZmZXI6IChAY3VycmVudEJ1ZmZlcikgLT5cblxuICBzZWxlY3RJdGVtVmlldzogKGl0ZW0pIC0+XG4gICAgc3VwZXJcbiAgICBpZiBtYXRjaCA9IEBnZXRTZWxlY3RlZEl0ZW0oKVxuICAgICAgQHJlcGxhY2VTZWxlY3RlZFRleHRXaXRoTWF0Y2gobWF0Y2gpXG5cbiAgc2VsZWN0TmV4dEl0ZW1WaWV3OiAtPlxuICAgIHN1cGVyXG4gICAgZmFsc2VcblxuICBzZWxlY3RQcmV2aW91c0l0ZW1WaWV3OiAtPlxuICAgIHN1cGVyXG4gICAgZmFsc2VcblxuICBnZXRDb21wbGV0aW9uc0ZvckN1cnNvclNjb3BlOiAtPlxuICAgIHNjb3BlID0gQGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihAZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpXG4gICAgY29tcGxldGlvbnMgPSBhdG9tLmNvbmZpZy5nZXRBbGwoJ2VkaXRvci5jb21wbGV0aW9ucycsIHtzY29wZX0pXG4gICAgXy51bmlxKF8uZmxhdHRlbihfLnBsdWNrKGNvbXBsZXRpb25zLCAndmFsdWUnKSkpXG5cbiAgYnVpbGRXb3JkTGlzdDogLT5cbiAgICB3b3JkSGFzaCA9IHt9XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUuaW5jbHVkZUNvbXBsZXRpb25zRnJvbUFsbEJ1ZmZlcnMnKVxuICAgICAgYnVmZmVycyA9IGF0b20ucHJvamVjdC5nZXRCdWZmZXJzKClcbiAgICBlbHNlXG4gICAgICBidWZmZXJzID0gW0BjdXJyZW50QnVmZmVyXVxuICAgIG1hdGNoZXMgPSBbXVxuICAgIG1hdGNoZXMucHVzaChidWZmZXIuZ2V0VGV4dCgpLm1hdGNoKEB3b3JkUmVnZXgpKSBmb3IgYnVmZmVyIGluIGJ1ZmZlcnNcbiAgICB3b3JkSGFzaFt3b3JkXSA/PSB0cnVlIGZvciB3b3JkIGluIF8uZmxhdHRlbihtYXRjaGVzKSB3aGVuIHdvcmRcbiAgICB3b3JkSGFzaFt3b3JkXSA/PSB0cnVlIGZvciB3b3JkIGluIEBnZXRDb21wbGV0aW9uc0ZvckN1cnNvclNjb3BlKCkgd2hlbiB3b3JkXG5cbiAgICBAd29yZExpc3QgPSBPYmplY3Qua2V5cyh3b3JkSGFzaCkuc29ydCAod29yZDEsIHdvcmQyKSAtPlxuICAgICAgd29yZDEudG9Mb3dlckNhc2UoKS5sb2NhbGVDb21wYXJlKHdvcmQyLnRvTG93ZXJDYXNlKCkpXG5cbiAgY29uZmlybWVkOiAobWF0Y2gpIC0+XG4gICAgQGVkaXRvci5nZXRTZWxlY3Rpb25zKCkuZm9yRWFjaCAoc2VsZWN0aW9uKSAtPiBzZWxlY3Rpb24uY2xlYXIoKVxuICAgIEBjYW5jZWwoKVxuICAgIHJldHVybiB1bmxlc3MgbWF0Y2hcbiAgICBAcmVwbGFjZVNlbGVjdGVkVGV4dFdpdGhNYXRjaChtYXRjaClcbiAgICBAZWRpdG9yLmdldEN1cnNvcnMoKS5mb3JFYWNoIChjdXJzb3IpIC0+XG4gICAgICBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24oW3Bvc2l0aW9uLnJvdywgcG9zaXRpb24uY29sdW1uICsgbWF0Y2guc3VmZml4Lmxlbmd0aF0pXG5cbiAgY2FuY2VsbGVkOiAtPlxuICAgIEBvdmVybGF5RGVjb3JhdGlvbj8uZGVzdHJveSgpXG5cbiAgICB1bmxlc3MgQGVkaXRvci5pc0Rlc3Ryb3llZCgpXG4gICAgICBAZWRpdG9yLnJldmVydFRvQ2hlY2twb2ludChAY2hlY2twb2ludClcblxuICAgICAgQGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhAb3JpZ2luYWxTZWxlY3Rpb25CdWZmZXJSYW5nZXMpXG5cbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpXG5cbiAgYXR0YWNoOiAtPlxuICAgIEBjaGVja3BvaW50ID0gQGVkaXRvci5jcmVhdGVDaGVja3BvaW50KClcblxuICAgIEBhYm92ZUN1cnNvciA9IGZhbHNlXG4gICAgQG9yaWdpbmFsU2VsZWN0aW9uQnVmZmVyUmFuZ2VzID0gQGVkaXRvci5nZXRTZWxlY3Rpb25zKCkubWFwIChzZWxlY3Rpb24pIC0+IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgQG9yaWdpbmFsQ3Vyc29yUG9zaXRpb24gPSBAZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKClcblxuICAgIHJldHVybiBAY2FuY2VsKCkgdW5sZXNzIEBhbGxQcmVmaXhBbmRTdWZmaXhPZlNlbGVjdGlvbnNNYXRjaCgpXG5cbiAgICBAYnVpbGRXb3JkTGlzdCgpXG4gICAgbWF0Y2hlcyA9IEBmaW5kTWF0Y2hlc0ZvckN1cnJlbnRTZWxlY3Rpb24oKVxuICAgIEBzZXRJdGVtcyhtYXRjaGVzKVxuXG4gICAgaWYgbWF0Y2hlcy5sZW5ndGggaXMgMVxuICAgICAgQGNvbmZpcm1TZWxlY3Rpb24oKVxuICAgIGVsc2VcbiAgICAgIGN1cnNvck1hcmtlciA9IEBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldE1hcmtlcigpXG4gICAgICBAb3ZlcmxheURlY29yYXRpb24gPSBAZWRpdG9yLmRlY29yYXRlTWFya2VyKGN1cnNvck1hcmtlciwgdHlwZTogJ292ZXJsYXknLCBwb3NpdGlvbjogJ3RhaWwnLCBpdGVtOiB0aGlzKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQG92ZXJsYXlEZWNvcmF0aW9uPy5kZXN0cm95KClcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQGlzVmlzaWJsZSgpXG4gICAgICBAY2FuY2VsKClcbiAgICBlbHNlXG4gICAgICBAYXR0YWNoKClcblxuICBmaW5kTWF0Y2hlc0ZvckN1cnJlbnRTZWxlY3Rpb246IC0+XG4gICAgc2VsZWN0aW9uID0gQGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKClcbiAgICB7cHJlZml4LCBzdWZmaXh9ID0gQHByZWZpeEFuZFN1ZmZpeE9mU2VsZWN0aW9uKHNlbGVjdGlvbilcblxuICAgIGlmIChwcmVmaXgubGVuZ3RoICsgc3VmZml4Lmxlbmd0aCkgPiAwXG4gICAgICByZWdleCA9IG5ldyBSZWdFeHAoXCJeI3twcmVmaXh9Lisje3N1ZmZpeH0kXCIsIFwiaVwiKVxuICAgICAgY3VycmVudFdvcmQgPSBwcmVmaXggKyBAZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpICsgc3VmZml4XG4gICAgICBmb3Igd29yZCBpbiBAd29yZExpc3Qgd2hlbiByZWdleC50ZXN0KHdvcmQpIGFuZCB3b3JkICE9IGN1cnJlbnRXb3JkXG4gICAgICAgIHtwcmVmaXgsIHN1ZmZpeCwgd29yZH1cbiAgICBlbHNlXG4gICAgICB7d29yZCwgcHJlZml4LCBzdWZmaXh9IGZvciB3b3JkIGluIEB3b3JkTGlzdFxuXG4gIHJlcGxhY2VTZWxlY3RlZFRleHRXaXRoTWF0Y2g6IChtYXRjaCkgLT5cbiAgICBuZXdTZWxlY3RlZEJ1ZmZlclJhbmdlcyA9IFtdXG4gICAgQGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgc2VsZWN0aW9ucyA9IEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICBzZWxlY3Rpb25zLmZvckVhY2ggKHNlbGVjdGlvbiwgaSkgPT5cbiAgICAgICAgc3RhcnRQb3NpdGlvbiA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLnN0YXJ0XG4gICAgICAgIGJ1ZmZlciA9IEBlZGl0b3IuZ2V0QnVmZmVyKClcblxuICAgICAgICBzZWxlY3Rpb24uZGVsZXRlU2VsZWN0ZWRUZXh0KClcbiAgICAgICAgY3Vyc29yUG9zaXRpb24gPSBAZWRpdG9yLmdldEN1cnNvcnMoKVtpXS5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICAgIGJ1ZmZlci5kZWxldGUoUmFuZ2UuZnJvbVBvaW50V2l0aERlbHRhKGN1cnNvclBvc2l0aW9uLCAwLCBtYXRjaC5zdWZmaXgubGVuZ3RoKSlcbiAgICAgICAgYnVmZmVyLmRlbGV0ZShSYW5nZS5mcm9tUG9pbnRXaXRoRGVsdGEoY3Vyc29yUG9zaXRpb24sIDAsIC1tYXRjaC5wcmVmaXgubGVuZ3RoKSlcblxuICAgICAgICBpbmZpeExlbmd0aCA9IG1hdGNoLndvcmQubGVuZ3RoIC0gbWF0Y2gucHJlZml4Lmxlbmd0aCAtIG1hdGNoLnN1ZmZpeC5sZW5ndGhcblxuICAgICAgICBuZXdTZWxlY3RlZEJ1ZmZlclJhbmdlcy5wdXNoKFtzdGFydFBvc2l0aW9uLCBbc3RhcnRQb3NpdGlvbi5yb3csIHN0YXJ0UG9zaXRpb24uY29sdW1uICsgaW5maXhMZW5ndGhdXSlcblxuICAgICAgQGVkaXRvci5pbnNlcnRUZXh0KG1hdGNoLndvcmQpXG4gICAgICBAZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKG5ld1NlbGVjdGVkQnVmZmVyUmFuZ2VzKVxuXG4gIHByZWZpeEFuZFN1ZmZpeE9mU2VsZWN0aW9uOiAoc2VsZWN0aW9uKSAtPlxuICAgIHNlbGVjdGlvblJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICBsaW5lUmFuZ2UgPSBbW3NlbGVjdGlvblJhbmdlLnN0YXJ0LnJvdywgMF0sIFtzZWxlY3Rpb25SYW5nZS5lbmQucm93LCBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHNlbGVjdGlvblJhbmdlLmVuZC5yb3cpLmxlbmd0aF1dXG4gICAgW3ByZWZpeCwgc3VmZml4XSA9IFtcIlwiLCBcIlwiXVxuXG4gICAgQGN1cnJlbnRCdWZmZXIuc2NhbkluUmFuZ2UgQHdvcmRSZWdleCwgbGluZVJhbmdlLCAoe21hdGNoLCByYW5nZSwgc3RvcH0pIC0+XG4gICAgICBzdG9wKCkgaWYgcmFuZ2Uuc3RhcnQuaXNHcmVhdGVyVGhhbihzZWxlY3Rpb25SYW5nZS5lbmQpXG5cbiAgICAgIGlmIHJhbmdlLmludGVyc2VjdHNXaXRoKHNlbGVjdGlvblJhbmdlKVxuICAgICAgICBwcmVmaXhPZmZzZXQgPSBzZWxlY3Rpb25SYW5nZS5zdGFydC5jb2x1bW4gLSByYW5nZS5zdGFydC5jb2x1bW5cbiAgICAgICAgc3VmZml4T2Zmc2V0ID0gc2VsZWN0aW9uUmFuZ2UuZW5kLmNvbHVtbiAtIHJhbmdlLmVuZC5jb2x1bW5cblxuICAgICAgICBwcmVmaXggPSBtYXRjaFswXVswLi4ucHJlZml4T2Zmc2V0XSBpZiByYW5nZS5zdGFydC5pc0xlc3NUaGFuKHNlbGVjdGlvblJhbmdlLnN0YXJ0KVxuICAgICAgICBzdWZmaXggPSBtYXRjaFswXVtzdWZmaXhPZmZzZXQuLl0gaWYgcmFuZ2UuZW5kLmlzR3JlYXRlclRoYW4oc2VsZWN0aW9uUmFuZ2UuZW5kKVxuXG4gICAge3ByZWZpeCwgc3VmZml4fVxuXG4gIGFsbFByZWZpeEFuZFN1ZmZpeE9mU2VsZWN0aW9uc01hdGNoOiAtPlxuICAgIHtwcmVmaXgsIHN1ZmZpeH0gPSB7fVxuXG4gICAgQGVkaXRvci5nZXRTZWxlY3Rpb25zKCkuZXZlcnkgKHNlbGVjdGlvbikgPT5cbiAgICAgIFtwcmV2aW91c1ByZWZpeCwgcHJldmlvdXNTdWZmaXhdID0gW3ByZWZpeCwgc3VmZml4XVxuXG4gICAgICB7cHJlZml4LCBzdWZmaXh9ID0gQHByZWZpeEFuZFN1ZmZpeE9mU2VsZWN0aW9uKHNlbGVjdGlvbilcblxuICAgICAgcmV0dXJuIHRydWUgdW5sZXNzIHByZXZpb3VzUHJlZml4PyBhbmQgcHJldmlvdXNTdWZmaXg/XG4gICAgICBwcmVmaXggaXMgcHJldmlvdXNQcmVmaXggYW5kIHN1ZmZpeCBpcyBwcmV2aW91c1N1ZmZpeFxuXG4gIGF0dGFjaGVkOiAtPlxuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgICB3aWRlc3RDb21wbGV0aW9uID0gcGFyc2VJbnQoQGNzcygnbWluLXdpZHRoJykpIG9yIDBcbiAgICBAbGlzdC5maW5kKCdzcGFuJykuZWFjaCAtPlxuICAgICAgd2lkZXN0Q29tcGxldGlvbiA9IE1hdGgubWF4KHdpZGVzdENvbXBsZXRpb24sICQodGhpcykub3V0ZXJXaWR0aCgpKVxuICAgIEBsaXN0LndpZHRoKHdpZGVzdENvbXBsZXRpb24pXG4gICAgQHdpZHRoKEBsaXN0Lm91dGVyV2lkdGgoKSlcblxuICBkZXRhY2hlZDogLT5cblxuICBwb3B1bGF0ZUxpc3Q6IC0+XG4gICAgc3VwZXJcbiJdfQ==
