(function() {
  var CompositeDisposable, Emitter, HighlightedAreaView, MarkerLayer, Range, StatusBarView, _, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter, MarkerLayer = ref.MarkerLayer;

  _ = require('underscore-plus');

  StatusBarView = require('./status-bar-view');

  module.exports = HighlightedAreaView = (function() {
    function HighlightedAreaView() {
      this.listenForStatusBarChange = bind(this.listenForStatusBarChange, this);
      this.removeStatusBar = bind(this.removeStatusBar, this);
      this.setupStatusBar = bind(this.setupStatusBar, this);
      this.removeMarkers = bind(this.removeMarkers, this);
      this.handleSelection = bind(this.handleSelection, this);
      this.debouncedHandleSelection = bind(this.debouncedHandleSelection, this);
      this.setStatusBar = bind(this.setStatusBar, this);
      this.enable = bind(this.enable, this);
      this.disable = bind(this.disable, this);
      this.onDidRemoveAllMarkers = bind(this.onDidRemoveAllMarkers, this);
      this.onDidAddSelectedMarker = bind(this.onDidAddSelectedMarker, this);
      this.onDidAddMarker = bind(this.onDidAddMarker, this);
      this.destroy = bind(this.destroy, this);
      this.emitter = new Emitter;
      this.markerLayers = [];
      this.resultCount = 0;
      this.enable();
      this.listenForTimeoutChange();
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.debouncedHandleSelection();
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.subscribeToActiveTextEditor();
      this.listenForStatusBarChange();
    }

    HighlightedAreaView.prototype.destroy = function() {
      var ref1, ref2, ref3;
      clearTimeout(this.handleSelectionTimeout);
      this.activeItemSubscription.dispose();
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.statusBarView) != null) {
        ref2.removeElement();
      }
      if ((ref3 = this.statusBarTile) != null) {
        ref3.destroy();
      }
      return this.statusBarTile = null;
    };

    HighlightedAreaView.prototype.onDidAddMarker = function(callback) {
      return this.emitter.on('did-add-marker', callback);
    };

    HighlightedAreaView.prototype.onDidAddSelectedMarker = function(callback) {
      return this.emitter.on('did-add-selected-marker', callback);
    };

    HighlightedAreaView.prototype.onDidRemoveAllMarkers = function(callback) {
      return this.emitter.on('did-remove-marker-layer', callback);
    };

    HighlightedAreaView.prototype.disable = function() {
      this.disabled = true;
      return this.removeMarkers();
    };

    HighlightedAreaView.prototype.enable = function() {
      this.disabled = false;
      return this.debouncedHandleSelection();
    };

    HighlightedAreaView.prototype.setStatusBar = function(statusBar) {
      this.statusBar = statusBar;
      return this.setupStatusBar();
    };

    HighlightedAreaView.prototype.debouncedHandleSelection = function() {
      clearTimeout(this.handleSelectionTimeout);
      return this.handleSelectionTimeout = setTimeout((function(_this) {
        return function() {
          return _this.handleSelection();
        };
      })(this), atom.config.get('highlight-selected.timeout'));
    };

    HighlightedAreaView.prototype.listenForTimeoutChange = function() {
      return atom.config.onDidChange('highlight-selected.timeout', (function(_this) {
        return function() {
          return _this.debouncedHandleSelection();
        };
      })(this));
    };

    HighlightedAreaView.prototype.subscribeToActiveTextEditor = function() {
      var editor, ref1;
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.selectionSubscription = new CompositeDisposable;
      this.selectionSubscription.add(editor.onDidAddSelection(this.debouncedHandleSelection));
      this.selectionSubscription.add(editor.onDidChangeSelectionRange(this.debouncedHandleSelection));
      return this.handleSelection();
    };

    HighlightedAreaView.prototype.getActiveEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightedAreaView.prototype.getActiveEditors = function() {
      return atom.workspace.getPanes().map(function(pane) {
        var activeItem;
        activeItem = pane.activeItem;
        if (activeItem && activeItem.constructor.name === 'TextEditor') {
          return activeItem;
        }
      });
    };

    HighlightedAreaView.prototype.handleSelection = function() {
      var editor, range, ref1, ref2, regex, regexFlags, regexSearch, result, text;
      this.removeMarkers();
      if (this.disabled) {
        return;
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      if (editor.getLastSelection().isEmpty()) {
        return;
      }
      if (!this.isWordSelected(editor.getLastSelection())) {
        return;
      }
      this.selections = editor.getSelections();
      text = _.escapeRegExp(this.selections[0].getText());
      regex = new RegExp("\\S*\\w*\\b", 'gi');
      result = regex.exec(text);
      if (result == null) {
        return;
      }
      if (result[0].length < atom.config.get('highlight-selected.minimumLength') || result.index !== 0 || result[0] !== result.input) {
        return;
      }
      regexFlags = 'g';
      if (atom.config.get('highlight-selected.ignoreCase')) {
        regexFlags = 'gi';
      }
      range = [[0, 0], editor.getEofBufferPosition()];
      this.ranges = [];
      regexSearch = result[0];
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        if (regexSearch.indexOf("\$") !== -1 && ((ref1 = editor.getGrammar()) != null ? ref1.name : void 0) === 'PHP') {
          regexSearch = regexSearch.replace("\$", "\$\\b");
        } else {
          regexSearch = "\\b" + regexSearch;
        }
        regexSearch = regexSearch + "\\b";
      }
      this.resultCount = 0;
      if (atom.config.get('highlight-selected.highlightInPanes')) {
        this.getActiveEditors().forEach((function(_this) {
          return function(editor) {
            return _this.highlightSelectionInEditor(editor, regexSearch, regexFlags, range);
          };
        })(this));
      } else {
        this.highlightSelectionInEditor(editor, regexSearch, regexFlags, range);
      }
      return (ref2 = this.statusBarElement) != null ? ref2.updateCount(this.resultCount) : void 0;
    };

    HighlightedAreaView.prototype.highlightSelectionInEditor = function(editor, regexSearch, regexFlags, range) {
      var markerLayer, markerLayerForHiddenMarkers;
      markerLayer = editor != null ? editor.addMarkerLayer() : void 0;
      if (markerLayer == null) {
        return;
      }
      markerLayerForHiddenMarkers = editor.addMarkerLayer();
      this.markerLayers.push(markerLayer);
      this.markerLayers.push(markerLayerForHiddenMarkers);
      editor.scanInBufferRange(new RegExp(regexSearch, regexFlags), range, (function(_this) {
        return function(result) {
          var marker;
          _this.resultCount += 1;
          if (_this.showHighlightOnSelectedWord(result.range, _this.selections)) {
            marker = markerLayerForHiddenMarkers.markBufferRange(result.range);
            return _this.emitter.emit('did-add-selected-marker', marker);
          } else {
            marker = markerLayer.markBufferRange(result.range);
            return _this.emitter.emit('did-add-marker', marker);
          }
        };
      })(this));
      return editor.decorateMarkerLayer(markerLayer, {
        type: 'highlight',
        "class": this.makeClasses()
      });
    };

    HighlightedAreaView.prototype.makeClasses = function() {
      var className;
      className = 'highlight-selected';
      if (atom.config.get('highlight-selected.lightTheme')) {
        className += ' light-theme';
      }
      if (atom.config.get('highlight-selected.highlightBackground')) {
        className += ' background';
      }
      return className;
    };

    HighlightedAreaView.prototype.showHighlightOnSelectedWord = function(range, selections) {
      var i, len, outcome, selection, selectionRange;
      if (!atom.config.get('highlight-selected.hideHighlightOnSelectedWord')) {
        return false;
      }
      outcome = false;
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        selectionRange = selection.getBufferRange();
        outcome = (range.start.column === selectionRange.start.column) && (range.start.row === selectionRange.start.row) && (range.end.column === selectionRange.end.column) && (range.end.row === selectionRange.end.row);
        if (outcome) {
          break;
        }
      }
      return outcome;
    };

    HighlightedAreaView.prototype.removeMarkers = function() {
      var ref1;
      this.markerLayers.forEach(function(markerLayer) {
        return markerLayer.destroy();
      });
      this.markerLayers = [];
      if ((ref1 = this.statusBarElement) != null) {
        ref1.updateCount(0);
      }
      return this.emitter.emit('did-remove-marker-layer');
    };

    HighlightedAreaView.prototype.isWordSelected = function(selection) {
      var lineRange, nonWordCharacterToTheLeft, nonWordCharacterToTheRight, selectionRange;
      if (selection.getBufferRange().isSingleLine()) {
        selectionRange = selection.getBufferRange();
        lineRange = this.getActiveEditor().bufferRangeForBufferRow(selectionRange.start.row);
        nonWordCharacterToTheLeft = _.isEqual(selectionRange.start, lineRange.start) || this.isNonWordCharacterToTheLeft(selection);
        nonWordCharacterToTheRight = _.isEqual(selectionRange.end, lineRange.end) || this.isNonWordCharacterToTheRight(selection);
        return nonWordCharacterToTheLeft && nonWordCharacterToTheRight;
      } else {
        return false;
      }
    };

    HighlightedAreaView.prototype.isNonWordCharacter = function(character) {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp("[ \t" + (_.escapeRegExp(nonWordCharacters)) + "]").test(character);
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheLeft = function(selection) {
      var range, selectionStart;
      selectionStart = selection.getBufferRange().start;
      range = Range.fromPointWithDelta(selectionStart, 0, -1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheRight = function(selection) {
      var range, selectionEnd;
      selectionEnd = selection.getBufferRange().end;
      range = Range.fromPointWithDelta(selectionEnd, 0, 1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.setupStatusBar = function() {
      if (this.statusBarElement != null) {
        return;
      }
      if (!atom.config.get('highlight-selected.showInStatusBar')) {
        return;
      }
      this.statusBarElement = new StatusBarView();
      return this.statusBarTile = this.statusBar.addLeftTile({
        item: this.statusBarElement.getElement(),
        priority: 100
      });
    };

    HighlightedAreaView.prototype.removeStatusBar = function() {
      var ref1;
      if (this.statusBarElement == null) {
        return;
      }
      if ((ref1 = this.statusBarTile) != null) {
        ref1.destroy();
      }
      this.statusBarTile = null;
      return this.statusBarElement = null;
    };

    HighlightedAreaView.prototype.listenForStatusBarChange = function() {
      return atom.config.onDidChange('highlight-selected.showInStatusBar', (function(_this) {
        return function(changed) {
          if (changed.newValue) {
            return _this.setupStatusBar();
          } else {
            return _this.removeStatusBar();
          }
        };
      })(this));
    };

    return HighlightedAreaView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1zZWxlY3RlZC9saWIvaGlnaGxpZ2h0ZWQtYXJlYS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNEZBQUE7SUFBQTs7RUFBQSxNQUFxRCxPQUFBLENBQVEsTUFBUixDQUFyRCxFQUFDLGlCQUFELEVBQVEsNkNBQVIsRUFBNkIscUJBQTdCLEVBQXNDOztFQUN0QyxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUNKLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSOztFQUVoQixNQUFNLENBQUMsT0FBUCxHQUNNO0lBRVMsNkJBQUE7Ozs7Ozs7Ozs7Ozs7O01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxJQUFDLENBQUEsc0JBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNqRSxLQUFDLENBQUEsd0JBQUQsQ0FBQTtpQkFDQSxLQUFDLENBQUEsMkJBQUQsQ0FBQTtRQUZpRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekM7TUFHMUIsSUFBQyxDQUFBLDJCQUFELENBQUE7TUFDQSxJQUFDLENBQUEsd0JBQUQsQ0FBQTtJQVZXOztrQ0FZYixPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxZQUFBLENBQWEsSUFBQyxDQUFBLHNCQUFkO01BQ0EsSUFBQyxDQUFBLHNCQUFzQixDQUFDLE9BQXhCLENBQUE7O1lBQ3NCLENBQUUsT0FBeEIsQ0FBQTs7O1lBQ2MsQ0FBRSxhQUFoQixDQUFBOzs7WUFDYyxDQUFF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O0FBQUEsZUFBQTs7TUFDQSxJQUFBLENBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQUFkO0FBQUEsZUFBQTs7TUFDQSxJQUFDLENBQUEsZ0JBQUQsR0FBd0IsSUFBQSxhQUFBLENBQUE7YUFDeEIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxXQUFYLENBQ2Y7UUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLGdCQUFnQixDQUFDLFVBQWxCLENBQUEsQ0FBTjtRQUFzQyxRQUFBLEVBQVUsR0FBaEQ7T0FEZTtJQUpIOztrQ0FPaEIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsVUFBQTtNQUFBLElBQWMsNkJBQWQ7QUFBQSxlQUFBOzs7WUFDYyxDQUFFLE9BQWhCLENBQUE7O01BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7YUFDakIsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBSkw7O2tDQU1qQix3QkFBQSxHQUEwQixTQUFBO2FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3QixvQ0FBeEIsRUFBOEQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7VUFDNUQsSUFBRyxPQUFPLENBQUMsUUFBWDttQkFDRSxLQUFDLENBQUEsY0FBRCxDQUFBLEVBREY7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxlQUFELENBQUEsRUFIRjs7UUFENEQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlEO0lBRHdCOzs7OztBQS9ONUIiLCJzb3VyY2VzQ29udGVudCI6WyJ7UmFuZ2UsIENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIsIE1hcmtlckxheWVyfSA9IHJlcXVpcmUgJ2F0b20nXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuU3RhdHVzQmFyVmlldyA9IHJlcXVpcmUgJy4vc3RhdHVzLWJhci12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBIaWdobGlnaHRlZEFyZWFWaWV3XG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEBtYXJrZXJMYXllcnMgPSBbXVxuICAgIEByZXN1bHRDb3VudCA9IDBcbiAgICBAZW5hYmxlKClcbiAgICBAbGlzdGVuRm9yVGltZW91dENoYW5nZSgpXG4gICAgQGFjdGl2ZUl0ZW1TdWJzY3JpcHRpb24gPSBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtID0+XG4gICAgICBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uKClcbiAgICAgIEBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBsaXN0ZW5Gb3JTdGF0dXNCYXJDaGFuZ2UoKVxuXG4gIGRlc3Ryb3k6ID0+XG4gICAgY2xlYXJUaW1lb3V0KEBoYW5kbGVTZWxlY3Rpb25UaW1lb3V0KVxuICAgIEBhY3RpdmVJdGVtU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBzdGF0dXNCYXJWaWV3Py5yZW1vdmVFbGVtZW50KClcbiAgICBAc3RhdHVzQmFyVGlsZT8uZGVzdHJveSgpXG4gICAgQHN0YXR1c0JhclRpbGUgPSBudWxsXG5cbiAgb25EaWRBZGRNYXJrZXI6IChjYWxsYmFjaykgPT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWFkZC1tYXJrZXInLCBjYWxsYmFja1xuXG4gIG9uRGlkQWRkU2VsZWN0ZWRNYXJrZXI6IChjYWxsYmFjaykgPT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWFkZC1zZWxlY3RlZC1tYXJrZXInLCBjYWxsYmFja1xuXG4gIG9uRGlkUmVtb3ZlQWxsTWFya2VyczogKGNhbGxiYWNrKSA9PlxuICAgIEBlbWl0dGVyLm9uICdkaWQtcmVtb3ZlLW1hcmtlci1sYXllcicsIGNhbGxiYWNrXG5cbiAgZGlzYWJsZTogPT5cbiAgICBAZGlzYWJsZWQgPSB0cnVlXG4gICAgQHJlbW92ZU1hcmtlcnMoKVxuXG4gIGVuYWJsZTogPT5cbiAgICBAZGlzYWJsZWQgPSBmYWxzZVxuICAgIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb24oKVxuXG4gIHNldFN0YXR1c0JhcjogKHN0YXR1c0JhcikgPT5cbiAgICBAc3RhdHVzQmFyID0gc3RhdHVzQmFyXG4gICAgQHNldHVwU3RhdHVzQmFyKClcblxuICBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb246ID0+XG4gICAgY2xlYXJUaW1lb3V0KEBoYW5kbGVTZWxlY3Rpb25UaW1lb3V0KVxuICAgIEBoYW5kbGVTZWxlY3Rpb25UaW1lb3V0ID0gc2V0VGltZW91dCA9PlxuICAgICAgQGhhbmRsZVNlbGVjdGlvbigpXG4gICAgLCBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC50aW1lb3V0JylcblxuICBsaXN0ZW5Gb3JUaW1lb3V0Q2hhbmdlOiAtPlxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdoaWdobGlnaHQtc2VsZWN0ZWQudGltZW91dCcsID0+XG4gICAgICBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uKClcblxuICBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3I6IC0+XG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG5cbiAgICBlZGl0b3IgPSBAZ2V0QWN0aXZlRWRpdG9yKClcbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvclxuXG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uLmFkZChcbiAgICAgIGVkaXRvci5vbkRpZEFkZFNlbGVjdGlvbiBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uXG4gICAgKVxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24uYWRkKFxuICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UgQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvblxuICAgIClcbiAgICBAaGFuZGxlU2VsZWN0aW9uKClcblxuICBnZXRBY3RpdmVFZGl0b3I6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgZ2V0QWN0aXZlRWRpdG9yczogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpLm1hcCAocGFuZSkgLT5cbiAgICAgIGFjdGl2ZUl0ZW0gPSBwYW5lLmFjdGl2ZUl0ZW1cbiAgICAgIGFjdGl2ZUl0ZW0gaWYgYWN0aXZlSXRlbSBhbmQgYWN0aXZlSXRlbS5jb25zdHJ1Y3Rvci5uYW1lID09ICdUZXh0RWRpdG9yJ1xuXG4gIGhhbmRsZVNlbGVjdGlvbjogPT5cbiAgICBAcmVtb3ZlTWFya2VycygpXG5cbiAgICByZXR1cm4gaWYgQGRpc2FibGVkXG5cbiAgICBlZGl0b3IgPSBAZ2V0QWN0aXZlRWRpdG9yKClcblxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yXG4gICAgcmV0dXJuIGlmIGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuaXNFbXB0eSgpXG4gICAgcmV0dXJuIHVubGVzcyBAaXNXb3JkU2VsZWN0ZWQoZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKSlcblxuICAgIEBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuXG4gICAgdGV4dCA9IF8uZXNjYXBlUmVnRXhwKEBzZWxlY3Rpb25zWzBdLmdldFRleHQoKSlcbiAgICByZWdleCA9IG5ldyBSZWdFeHAoXCJcXFxcUypcXFxcdypcXFxcYlwiLCAnZ2knKVxuICAgIHJlc3VsdCA9IHJlZ2V4LmV4ZWModGV4dClcblxuICAgIHJldHVybiB1bmxlc3MgcmVzdWx0P1xuICAgIHJldHVybiBpZiByZXN1bHRbMF0ubGVuZ3RoIDwgYXRvbS5jb25maWcuZ2V0KFxuICAgICAgJ2hpZ2hsaWdodC1zZWxlY3RlZC5taW5pbXVtTGVuZ3RoJykgb3JcbiAgICAgICAgICAgICAgcmVzdWx0LmluZGV4IGlzbnQgMCBvclxuICAgICAgICAgICAgICByZXN1bHRbMF0gaXNudCByZXN1bHQuaW5wdXRcblxuICAgIHJlZ2V4RmxhZ3MgPSAnZydcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5pZ25vcmVDYXNlJylcbiAgICAgIHJlZ2V4RmxhZ3MgPSAnZ2knXG5cbiAgICByYW5nZSA9ICBbWzAsIDBdLCBlZGl0b3IuZ2V0RW9mQnVmZmVyUG9zaXRpb24oKV1cblxuICAgIEByYW5nZXMgPSBbXVxuICAgIHJlZ2V4U2VhcmNoID0gcmVzdWx0WzBdXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5vbmx5SGlnaGxpZ2h0V2hvbGVXb3JkcycpXG4gICAgICBpZiByZWdleFNlYXJjaC5pbmRleE9mKFwiXFwkXCIpIGlzbnQgLTEgXFxcbiAgICAgIGFuZCBlZGl0b3IuZ2V0R3JhbW1hcigpPy5uYW1lIGlzICdQSFAnXG4gICAgICAgIHJlZ2V4U2VhcmNoID0gcmVnZXhTZWFyY2gucmVwbGFjZShcIlxcJFwiLCBcIlxcJFxcXFxiXCIpXG4gICAgICBlbHNlXG4gICAgICAgIHJlZ2V4U2VhcmNoID0gIFwiXFxcXGJcIiArIHJlZ2V4U2VhcmNoXG4gICAgICByZWdleFNlYXJjaCA9IHJlZ2V4U2VhcmNoICsgXCJcXFxcYlwiXG5cbiAgICBAcmVzdWx0Q291bnQgPSAwXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuaGlnaGxpZ2h0SW5QYW5lcycpXG4gICAgICBAZ2V0QWN0aXZlRWRpdG9ycygpLmZvckVhY2ggKGVkaXRvcikgPT5cbiAgICAgICAgQGhpZ2hsaWdodFNlbGVjdGlvbkluRWRpdG9yKGVkaXRvciwgcmVnZXhTZWFyY2gsIHJlZ2V4RmxhZ3MsIHJhbmdlKVxuICAgIGVsc2VcbiAgICAgIEBoaWdobGlnaHRTZWxlY3Rpb25JbkVkaXRvcihlZGl0b3IsIHJlZ2V4U2VhcmNoLCByZWdleEZsYWdzLCByYW5nZSlcblxuICAgIEBzdGF0dXNCYXJFbGVtZW50Py51cGRhdGVDb3VudChAcmVzdWx0Q291bnQpXG5cbiAgaGlnaGxpZ2h0U2VsZWN0aW9uSW5FZGl0b3I6IChlZGl0b3IsIHJlZ2V4U2VhcmNoLCByZWdleEZsYWdzLCByYW5nZSkgLT5cbiAgICBtYXJrZXJMYXllciA9IGVkaXRvcj8uYWRkTWFya2VyTGF5ZXIoKVxuICAgIHJldHVybiB1bmxlc3MgbWFya2VyTGF5ZXI/XG4gICAgbWFya2VyTGF5ZXJGb3JIaWRkZW5NYXJrZXJzID0gZWRpdG9yLmFkZE1hcmtlckxheWVyKClcbiAgICBAbWFya2VyTGF5ZXJzLnB1c2gobWFya2VyTGF5ZXIpXG4gICAgQG1hcmtlckxheWVycy5wdXNoKG1hcmtlckxheWVyRm9ySGlkZGVuTWFya2VycylcbiAgICBlZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UgbmV3IFJlZ0V4cChyZWdleFNlYXJjaCwgcmVnZXhGbGFncyksIHJhbmdlLFxuICAgICAgKHJlc3VsdCkgPT5cbiAgICAgICAgQHJlc3VsdENvdW50ICs9IDFcbiAgICAgICAgaWYgQHNob3dIaWdobGlnaHRPblNlbGVjdGVkV29yZChyZXN1bHQucmFuZ2UsIEBzZWxlY3Rpb25zKVxuICAgICAgICAgIG1hcmtlciA9IG1hcmtlckxheWVyRm9ySGlkZGVuTWFya2Vycy5tYXJrQnVmZmVyUmFuZ2UocmVzdWx0LnJhbmdlKVxuICAgICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1hZGQtc2VsZWN0ZWQtbWFya2VyJywgbWFya2VyXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtYXJrZXIgPSBtYXJrZXJMYXllci5tYXJrQnVmZmVyUmFuZ2UocmVzdWx0LnJhbmdlKVxuICAgICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1hZGQtbWFya2VyJywgbWFya2VyXG4gICAgZWRpdG9yLmRlY29yYXRlTWFya2VyTGF5ZXIobWFya2VyTGF5ZXIsIHtcbiAgICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgICAgY2xhc3M6IEBtYWtlQ2xhc3NlcygpXG4gICAgfSlcblxuICBtYWtlQ2xhc3NlczogLT5cbiAgICBjbGFzc05hbWUgPSAnaGlnaGxpZ2h0LXNlbGVjdGVkJ1xuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmxpZ2h0VGhlbWUnKVxuICAgICAgY2xhc3NOYW1lICs9ICcgbGlnaHQtdGhlbWUnXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5oaWdobGlnaHRCYWNrZ3JvdW5kJylcbiAgICAgIGNsYXNzTmFtZSArPSAnIGJhY2tncm91bmQnXG4gICAgY2xhc3NOYW1lXG5cbiAgc2hvd0hpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkOiAocmFuZ2UsIHNlbGVjdGlvbnMpIC0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAnaGlnaGxpZ2h0LXNlbGVjdGVkLmhpZGVIaWdobGlnaHRPblNlbGVjdGVkV29yZCcpXG4gICAgb3V0Y29tZSA9IGZhbHNlXG4gICAgZm9yIHNlbGVjdGlvbiBpbiBzZWxlY3Rpb25zXG4gICAgICBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBvdXRjb21lID0gKHJhbmdlLnN0YXJ0LmNvbHVtbiBpcyBzZWxlY3Rpb25SYW5nZS5zdGFydC5jb2x1bW4pIGFuZFxuICAgICAgICAgICAgICAgIChyYW5nZS5zdGFydC5yb3cgaXMgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQucm93KSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2UuZW5kLmNvbHVtbiBpcyBzZWxlY3Rpb25SYW5nZS5lbmQuY29sdW1uKSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2UuZW5kLnJvdyBpcyBzZWxlY3Rpb25SYW5nZS5lbmQucm93KVxuICAgICAgYnJlYWsgaWYgb3V0Y29tZVxuICAgIG91dGNvbWVcblxuICByZW1vdmVNYXJrZXJzOiA9PlxuICAgIEBtYXJrZXJMYXllcnMuZm9yRWFjaCAobWFya2VyTGF5ZXIpIC0+XG4gICAgICBtYXJrZXJMYXllci5kZXN0cm95KClcbiAgICBAbWFya2VyTGF5ZXJzID0gW11cbiAgICBAc3RhdHVzQmFyRWxlbWVudD8udXBkYXRlQ291bnQoMClcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtcmVtb3ZlLW1hcmtlci1sYXllcidcblxuICBpc1dvcmRTZWxlY3RlZDogKHNlbGVjdGlvbikgLT5cbiAgICBpZiBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5pc1NpbmdsZUxpbmUoKVxuICAgICAgc2VsZWN0aW9uUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgbGluZVJhbmdlID0gQGdldEFjdGl2ZUVkaXRvcigpLmJ1ZmZlclJhbmdlRm9yQnVmZmVyUm93KFxuICAgICAgICBzZWxlY3Rpb25SYW5nZS5zdGFydC5yb3cpXG4gICAgICBub25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0ID1cbiAgICAgICAgXy5pc0VxdWFsKHNlbGVjdGlvblJhbmdlLnN0YXJ0LCBsaW5lUmFuZ2Uuc3RhcnQpIG9yXG4gICAgICAgIEBpc05vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQoc2VsZWN0aW9uKVxuICAgICAgbm9uV29yZENoYXJhY3RlclRvVGhlUmlnaHQgPVxuICAgICAgICBfLmlzRXF1YWwoc2VsZWN0aW9uUmFuZ2UuZW5kLCBsaW5lUmFuZ2UuZW5kKSBvclxuICAgICAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodChzZWxlY3Rpb24pXG5cbiAgICAgIG5vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQgYW5kIG5vbldvcmRDaGFyYWN0ZXJUb1RoZVJpZ2h0XG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuICBpc05vbldvcmRDaGFyYWN0ZXI6IChjaGFyYWN0ZXIpIC0+XG4gICAgbm9uV29yZENoYXJhY3RlcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5ub25Xb3JkQ2hhcmFjdGVycycpXG4gICAgbmV3IFJlZ0V4cChcIlsgXFx0I3tfLmVzY2FwZVJlZ0V4cChub25Xb3JkQ2hhcmFjdGVycyl9XVwiKS50ZXN0KGNoYXJhY3RlcilcblxuICBpc05vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQ6IChzZWxlY3Rpb24pIC0+XG4gICAgc2VsZWN0aW9uU3RhcnQgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5zdGFydFxuICAgIHJhbmdlID0gUmFuZ2UuZnJvbVBvaW50V2l0aERlbHRhKHNlbGVjdGlvblN0YXJ0LCAwLCAtMSlcbiAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyKEBnZXRBY3RpdmVFZGl0b3IoKS5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSkpXG5cbiAgaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodDogKHNlbGVjdGlvbikgLT5cbiAgICBzZWxlY3Rpb25FbmQgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5lbmRcbiAgICByYW5nZSA9IFJhbmdlLmZyb21Qb2ludFdpdGhEZWx0YShzZWxlY3Rpb25FbmQsIDAsIDEpXG4gICAgQGlzTm9uV29yZENoYXJhY3RlcihAZ2V0QWN0aXZlRWRpdG9yKCkuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpKVxuXG4gIHNldHVwU3RhdHVzQmFyOiA9PlxuICAgIHJldHVybiBpZiBAc3RhdHVzQmFyRWxlbWVudD9cbiAgICByZXR1cm4gdW5sZXNzIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLnNob3dJblN0YXR1c0JhcicpXG4gICAgQHN0YXR1c0JhckVsZW1lbnQgPSBuZXcgU3RhdHVzQmFyVmlldygpXG4gICAgQHN0YXR1c0JhclRpbGUgPSBAc3RhdHVzQmFyLmFkZExlZnRUaWxlKFxuICAgICAgaXRlbTogQHN0YXR1c0JhckVsZW1lbnQuZ2V0RWxlbWVudCgpLCBwcmlvcml0eTogMTAwKVxuXG4gIHJlbW92ZVN0YXR1c0JhcjogPT5cbiAgICByZXR1cm4gdW5sZXNzIEBzdGF0dXNCYXJFbGVtZW50P1xuICAgIEBzdGF0dXNCYXJUaWxlPy5kZXN0cm95KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9IG51bGxcbiAgICBAc3RhdHVzQmFyRWxlbWVudCA9IG51bGxcblxuICBsaXN0ZW5Gb3JTdGF0dXNCYXJDaGFuZ2U6ID0+XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2hpZ2hsaWdodC1zZWxlY3RlZC5zaG93SW5TdGF0dXNCYXInLCAoY2hhbmdlZCkgPT5cbiAgICAgIGlmIGNoYW5nZWQubmV3VmFsdWVcbiAgICAgICAgQHNldHVwU3RhdHVzQmFyKClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlbW92ZVN0YXR1c0JhcigpXG4iXX0=
