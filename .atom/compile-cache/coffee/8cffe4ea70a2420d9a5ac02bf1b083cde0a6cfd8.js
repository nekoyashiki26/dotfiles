
/* global atom */

(function() {
  var $, CompositeDisposable, JumpyView, Point, Range, View, _, a, c1, c2, i, j, k, keys, l, len, len1, len2, len3, len4, len5, lowerCharacters, m, n, ref, ref1, upperCharacters,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Point = ref.Point, Range = ref.Range;

  ref1 = require('space-pen'), View = ref1.View, $ = ref1.$;

  _ = require('lodash');

  lowerCharacters = (function() {
    var i, ref2, ref3, results;
    results = [];
    for (a = i = ref2 = 'a'.charCodeAt(), ref3 = 'z'.charCodeAt(); ref2 <= ref3 ? i <= ref3 : i >= ref3; a = ref2 <= ref3 ? ++i : --i) {
      results.push(String.fromCharCode(a));
    }
    return results;
  })();

  upperCharacters = (function() {
    var i, ref2, ref3, results;
    results = [];
    for (a = i = ref2 = 'A'.charCodeAt(), ref3 = 'Z'.charCodeAt(); ref2 <= ref3 ? i <= ref3 : i >= ref3; a = ref2 <= ref3 ? ++i : --i) {
      results.push(String.fromCharCode(a));
    }
    return results;
  })();

  keys = [];

  for (i = 0, len = lowerCharacters.length; i < len; i++) {
    c1 = lowerCharacters[i];
    for (j = 0, len1 = lowerCharacters.length; j < len1; j++) {
      c2 = lowerCharacters[j];
      keys.push(c1 + c2);
    }
  }

  for (k = 0, len2 = upperCharacters.length; k < len2; k++) {
    c1 = upperCharacters[k];
    for (l = 0, len3 = lowerCharacters.length; l < len3; l++) {
      c2 = lowerCharacters[l];
      keys.push(c1 + c2);
    }
  }

  for (m = 0, len4 = lowerCharacters.length; m < len4; m++) {
    c1 = lowerCharacters[m];
    for (n = 0, len5 = upperCharacters.length; n < len5; n++) {
      c2 = upperCharacters[n];
      keys.push(c1 + c2);
    }
  }

  JumpyView = (function(superClass) {
    extend(JumpyView, superClass);

    function JumpyView() {
      this.clearJumpModeHandler = bind(this.clearJumpModeHandler, this);
      return JumpyView.__super__.constructor.apply(this, arguments);
    }

    JumpyView.content = function() {
      return this.div('');
    };

    JumpyView.prototype.initialize = function() {
      var c, characterSet, commands, fn, len6, len7, o, p, ref2, ref3;
      this.disposables = new CompositeDisposable();
      this.decorations = [];
      this.commands = new CompositeDisposable();
      this.commands.add(atom.commands.add('atom-workspace', {
        'jumpy:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'jumpy:reset': (function(_this) {
          return function() {
            return _this.reset();
          };
        })(this),
        'jumpy:clear': (function(_this) {
          return function() {
            return _this.clearJumpMode();
          };
        })(this)
      }));
      commands = {};
      ref2 = [lowerCharacters, upperCharacters];
      for (o = 0, len6 = ref2.length; o < len6; o++) {
        characterSet = ref2[o];
        fn = (function(_this) {
          return function(c) {
            return commands['jumpy:' + c] = function() {
              return _this.getKey(c);
            };
          };
        })(this);
        for (p = 0, len7 = characterSet.length; p < len7; p++) {
          c = characterSet[p];
          fn(c);
        }
      }
      this.commands.add(atom.commands.add('atom-workspace', commands));
      this.backedUpKeyBindings = _.clone(atom.keymaps.keyBindings);
      this.workspaceElement = atom.views.getView(atom.workspace);
      this.statusBar = document.querySelector('status-bar');
      if ((ref3 = this.statusBar) != null) {
        ref3.addLeftTile({
          item: $('<div id="status-bar-jumpy" class="inline-block"></div>'),
          priority: -1
        });
      }
      return this.statusBarJumpy = document.getElementById('status-bar-jumpy');
    };

    JumpyView.prototype.getKey = function(character) {
      var isMatchOfCurrentLabels, labelPosition, ref2, ref3, ref4, ref5;
      if ((ref2 = this.statusBarJumpy) != null) {
        ref2.classList.remove('no-match');
      }
      isMatchOfCurrentLabels = (function(_this) {
        return function(character, labelPosition) {
          var found;
          found = false;
          _this.disposables.add(atom.workspace.observeTextEditors(function(editor) {
            var decoration, editorView, element, len6, o, ref3;
            editorView = atom.views.getView(editor);
            if ($(editorView).is(':not(:visible)')) {
              return;
            }
            ref3 = _this.decorations;
            for (o = 0, len6 = ref3.length; o < len6; o++) {
              decoration = ref3[o];
              element = decoration.getProperties().item;
              if (element.textContent[labelPosition] === character) {
                found = true;
                return false;
              }
            }
          }));
          return found;
        };
      })(this);
      labelPosition = (!this.firstChar ? 0 : 1);
      if (!isMatchOfCurrentLabels(character, labelPosition)) {
        if ((ref3 = this.statusBarJumpy) != null) {
          ref3.classList.add('no-match');
        }
        if ((ref4 = this.statusBarJumpyStatus) != null) {
          ref4.innerHTML = 'No match!';
        }
        return;
      }
      if (!this.firstChar) {
        this.firstChar = character;
        if ((ref5 = this.statusBarJumpyStatus) != null) {
          ref5.innerHTML = this.firstChar;
        }
        this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            var decoration, editorView, element, len6, o, ref6, results;
            editorView = atom.views.getView(editor);
            if ($(editorView).is(':not(:visible)')) {
              return;
            }
            ref6 = _this.decorations;
            results = [];
            for (o = 0, len6 = ref6.length; o < len6; o++) {
              decoration = ref6[o];
              element = decoration.getProperties().item;
              if (element.textContent.indexOf(_this.firstChar) !== 0) {
                results.push(element.classList.add('irrelevant'));
              } else {
                results.push(void 0);
              }
            }
            return results;
          };
        })(this)));
      } else if (!this.secondChar) {
        this.secondChar = character;
      }
      if (this.secondChar) {
        this.jump();
        return this.clearJumpMode();
      }
    };

    JumpyView.prototype.clearKeys = function() {
      this.firstChar = null;
      return this.secondChar = null;
    };

    JumpyView.prototype.reset = function() {
      var decoration, len6, o, ref2, ref3, ref4;
      this.clearKeys();
      ref2 = this.decorations;
      for (o = 0, len6 = ref2.length; o < len6; o++) {
        decoration = ref2[o];
        decoration.getProperties().item.classList.remove('irrelevant');
      }
      if ((ref3 = this.statusBarJumpy) != null) {
        ref3.classList.remove('no-match');
      }
      return (ref4 = this.statusBarJumpyStatus) != null ? ref4.innerHTML = 'Jump Mode!' : void 0;
    };

    JumpyView.prototype.getFilteredJumpyKeys = function() {
      return atom.keymaps.keyBindings.filter(function(keymap) {
        if (typeof keymap.command === 'string') {
          return keymap.command.includes('jumpy');
        }
      });
    };

    JumpyView.prototype.turnOffSlowKeys = function() {
      return atom.keymaps.keyBindings = this.getFilteredJumpyKeys();
    };

    JumpyView.prototype.toggle = function() {
      var fontSize, highContrast, nextKeys, ref2, ref3, wordsPattern;
      this.clearJumpMode();
      this.cleared = false;
      wordsPattern = new RegExp(atom.config.get('jumpy.matchPattern'), 'g');
      fontSize = atom.config.get('jumpy.fontSize');
      if (isNaN(fontSize) || fontSize > 1) {
        fontSize = .75;
      }
      fontSize = (fontSize * 100) + '%';
      highContrast = atom.config.get('jumpy.highContrast');
      this.turnOffSlowKeys();
      if ((ref2 = this.statusBarJumpy) != null) {
        ref2.classList.remove('no-match');
      }
      if ((ref3 = this.statusBarJumpy) != null) {
        ref3.innerHTML = 'Jumpy: <span class="status">Jump Mode!</span>';
      }
      this.statusBarJumpyStatus = document.querySelector('#status-bar-jumpy .status');
      this.allPositions = {};
      nextKeys = _.clone(keys);
      return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var $editorView, column, drawLabels, editorView, firstVisibleRow, getVisibleColumnRange, lastVisibleRow, lineContents, lineNumber, maxColumn, minColumn, o, ref4, ref5, ref6, rows, word;
          editorView = atom.views.getView(editor);
          $editorView = $(editorView);
          if ($editorView.is(':not(:visible)')) {
            return;
          }
          editorView.classList.add('jumpy-jump-mode');
          getVisibleColumnRange = function(editorView) {
            var charWidth, maxColumn, minColumn;
            charWidth = editorView.getDefaultCharacterWidth();
            minColumn = (editorView.getScrollLeft() / charWidth) - 1;
            maxColumn = editorView.getScrollRight() / charWidth;
            return [minColumn, maxColumn];
          };
          drawLabels = function(lineNumber, column) {
            var decoration, keyLabel, labelElement, marker, position;
            if (!nextKeys.length) {
              return;
            }
            keyLabel = nextKeys.shift();
            position = {
              row: lineNumber,
              column: column
            };
            _this.allPositions[keyLabel] = {
              editor: editor.id,
              position: position
            };
            marker = editor.markScreenRange(new Range(new Point(lineNumber, column), new Point(lineNumber, column)), {
              invalidate: 'touch'
            });
            labelElement = document.createElement('div');
            labelElement.textContent = keyLabel;
            labelElement.style.fontSize = fontSize;
            labelElement.classList.add('jumpy-label');
            if (highContrast) {
              labelElement.classList.add('high-contrast');
            }
            decoration = editor.decorateMarker(marker, {
              type: 'overlay',
              item: labelElement,
              position: 'head'
            });
            return _this.decorations.push(decoration);
          };
          ref4 = getVisibleColumnRange(editorView), minColumn = ref4[0], maxColumn = ref4[1];
          rows = editor.getVisibleRowRange();
          if (rows) {
            firstVisibleRow = rows[0], lastVisibleRow = rows[1];
            for (lineNumber = o = ref5 = firstVisibleRow, ref6 = lastVisibleRow; ref5 <= ref6 ? o < ref6 : o > ref6; lineNumber = ref5 <= ref6 ? ++o : --o) {
              lineContents = editor.lineTextForScreenRow(lineNumber);
              if (editor.isFoldedAtScreenRow(lineNumber)) {
                drawLabels(lineNumber, 0);
              } else {
                while ((word = wordsPattern.exec(lineContents)) !== null) {
                  column = word.index;
                  if (column > minColumn && column < maxColumn) {
                    drawLabels(lineNumber, column);
                  }
                }
              }
            }
          }
          return _this.initializeClearEvents(editorView);
        };
      })(this)));
    };

    JumpyView.prototype.clearJumpModeHandler = function() {
      return this.clearJumpMode();
    };

    JumpyView.prototype.initializeClearEvents = function(editorView) {
      var e, len6, o, ref2, results;
      this.disposables.add(editorView.onDidChangeScrollTop((function(_this) {
        return function() {
          return _this.clearJumpModeHandler();
        };
      })(this)));
      this.disposables.add(editorView.onDidChangeScrollLeft((function(_this) {
        return function() {
          return _this.clearJumpModeHandler();
        };
      })(this)));
      ref2 = ['blur', 'click'];
      results = [];
      for (o = 0, len6 = ref2.length; o < len6; o++) {
        e = ref2[o];
        results.push(editorView.addEventListener(e, this.clearJumpModeHandler, true));
      }
      return results;
    };

    JumpyView.prototype.clearJumpMode = function() {
      var clearAllMarkers, ref2, ref3;
      clearAllMarkers = (function(_this) {
        return function() {
          var decoration, len6, o, ref2;
          ref2 = _this.decorations;
          for (o = 0, len6 = ref2.length; o < len6; o++) {
            decoration = ref2[o];
            decoration.getMarker().destroy();
          }
          return _this.decorations = [];
        };
      })(this);
      if (this.cleared) {
        return;
      }
      this.cleared = true;
      this.clearKeys();
      if ((ref2 = this.statusBarJumpy) != null) {
        ref2.innerHTML = '';
      }
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var e, editorView, len6, o, ref3, results;
          editorView = atom.views.getView(editor);
          editorView.classList.remove('jumpy-jump-mode');
          ref3 = ['blur', 'click'];
          results = [];
          for (o = 0, len6 = ref3.length; o < len6; o++) {
            e = ref3[o];
            results.push(editorView.removeEventListener(e, _this.clearJumpModeHandler, true));
          }
          return results;
        };
      })(this)));
      atom.keymaps.keyBindings = this.backedUpKeyBindings;
      clearAllMarkers();
      if ((ref3 = this.disposables) != null) {
        ref3.dispose();
      }
      return this.detach();
    };

    JumpyView.prototype.jump = function() {
      var location;
      location = this.findLocation();
      if (location === null) {
        return;
      }
      return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(currentEditor) {
          var editorView, isSelected, isVisualMode, pane;
          editorView = atom.views.getView(currentEditor);
          if (currentEditor.id !== location.editor) {
            return;
          }
          pane = atom.workspace.paneForItem(currentEditor);
          pane.activate();
          isVisualMode = editorView.classList.contains('visual-mode');
          isSelected = currentEditor.getSelections().length === 1 && currentEditor.getSelectedText() !== '';
          if (isVisualMode || isSelected) {
            currentEditor.selectToScreenPosition(location.position);
          } else {
            currentEditor.setCursorScreenPosition(location.position);
          }
          if (atom.config.get('jumpy.useHomingBeaconEffectOnJumps')) {
            return _this.drawBeacon(currentEditor, location);
          }
        };
      })(this)));
    };

    JumpyView.prototype.drawBeacon = function(editor, location) {
      var beacon, marker, range;
      range = Range(location.position, location.position);
      marker = editor.markScreenRange(range, {
        invalidate: 'never'
      });
      beacon = document.createElement('span');
      beacon.classList.add('beacon');
      editor.decorateMarker(marker, {
        item: beacon,
        type: 'overlay'
      });
      return setTimeout(function() {
        return marker.destroy();
      }, 150);
    };

    JumpyView.prototype.findLocation = function() {
      var label;
      label = "" + this.firstChar + this.secondChar;
      if (label in this.allPositions) {
        return this.allPositions[label];
      }
      return null;
    };

    JumpyView.prototype.serialize = function() {};

    JumpyView.prototype.destroy = function() {
      var ref2;
      if ((ref2 = this.commands) != null) {
        ref2.dispose();
      }
      return this.clearJumpMode();
    };

    return JumpyView;

  })(View);

  module.exports = JumpyView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2p1bXB5L2xpYi9qdW1weS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBSUE7O0FBQUE7QUFBQSxNQUFBLDJLQUFBO0lBQUE7Ozs7RUFDQSxNQUFzQyxPQUFBLENBQVEsTUFBUixDQUF0QyxFQUFDLDZDQUFELEVBQXNCLGlCQUF0QixFQUE2Qjs7RUFDN0IsT0FBWSxPQUFBLENBQVEsV0FBUixDQUFaLEVBQUMsZ0JBQUQsRUFBTzs7RUFDUCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBRUosZUFBQTs7QUFDSztTQUFnQyw0SEFBaEM7bUJBQUEsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsQ0FBcEI7QUFBQTs7OztFQUNMLGVBQUE7O0FBQ0s7U0FBZ0MsNEhBQWhDO21CQUFBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLENBQXBCO0FBQUE7Ozs7RUFDTCxJQUFBLEdBQU87O0FBS1AsT0FBQSxpREFBQTs7QUFDSSxTQUFBLG1EQUFBOztNQUNJLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBQSxHQUFLLEVBQWY7QUFESjtBQURKOztBQUdBLE9BQUEsbURBQUE7O0FBQ0ksU0FBQSxtREFBQTs7TUFDSSxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUEsR0FBSyxFQUFmO0FBREo7QUFESjs7QUFHQSxPQUFBLG1EQUFBOztBQUNJLFNBQUEsbURBQUE7O01BQ0ksSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFBLEdBQUssRUFBZjtBQURKO0FBREo7O0VBSU07Ozs7Ozs7O0lBRUYsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ04sSUFBQyxDQUFBLEdBQUQsQ0FBSyxFQUFMO0lBRE07O3dCQUdWLFVBQUEsR0FBWSxTQUFBO0FBQ1IsVUFBQTtNQUFBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsbUJBQUEsQ0FBQTtNQUNuQixJQUFDLENBQUEsV0FBRCxHQUFl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UyxDQUFDLEdBQWpCLENBQXFCLFFBQXJCO01BQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsRUFDSTtRQUFBLElBQUEsRUFBTSxNQUFOO1FBQ0EsSUFBQSxFQUFNLFNBRE47T0FESjthQUdBLFVBQUEsQ0FBVyxTQUFBO2VBQ1AsTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQURPLENBQVgsRUFFRSxHQUZGO0lBUlE7O3dCQVlaLFlBQUEsR0FBYyxTQUFBO0FBQ1YsVUFBQTtNQUFBLEtBQUEsR0FBUSxFQUFBLEdBQUcsSUFBQyxDQUFBLFNBQUosR0FBZ0IsSUFBQyxDQUFBO01BQ3pCLElBQUcsS0FBQSxJQUFTLElBQUMsQ0FBQSxZQUFiO0FBQ0ksZUFBTyxJQUFDLENBQUEsWUFBYSxDQUFBLEtBQUEsRUFEekI7O0FBR0EsYUFBTztJQUxHOzt3QkFRZCxTQUFBLEdBQVcsU0FBQSxHQUFBOzt3QkFHWCxPQUFBLEdBQVMsU0FBQTtBQUNMLFVBQUE7O1lBQVMsQ0FBRSxPQUFYLENBQUE7O2FBQ0EsSUFBQyxDQUFBLGFBQUQsQ0FBQTtJQUZLOzs7O0tBeFFXOztFQTRReEIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFwU2pCIiwic291cmNlc0NvbnRlbnQiOlsiIyBUT0RPOiBNZXJnZSBpbiBAam9obmdlb3JnZXdyaWdodCdzIGNvZGUgZm9yIHRyZWV2aWV3XG4jIFRPRE86IE1lcmdlIGluIEB3aWxsZGFkeSdzIGNvZGUgZm9yIGJldHRlciBhY2N1cmFjeS5cbiMgVE9ETzogUmVtb3ZlIHNwYWNlLXBlbj9cblxuIyMjIGdsb2JhbCBhdG9tICMjI1xue0NvbXBvc2l0ZURpc3Bvc2FibGUsIFBvaW50LCBSYW5nZX0gPSByZXF1aXJlICdhdG9tJ1xue1ZpZXcsICR9ID0gcmVxdWlyZSAnc3BhY2UtcGVuJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxubG93ZXJDaGFyYWN0ZXJzID1cbiAgICAoU3RyaW5nLmZyb21DaGFyQ29kZShhKSBmb3IgYSBpbiBbJ2EnLmNoYXJDb2RlQXQoKS4uJ3onLmNoYXJDb2RlQXQoKV0pXG51cHBlckNoYXJhY3RlcnMgPVxuICAgIChTdHJpbmcuZnJvbUNoYXJDb2RlKGEpIGZvciBhIGluIFsnQScuY2hhckNvZGVBdCgpLi4nWicuY2hhckNvZGVBdCgpXSlcbmtleXMgPSBbXVxuXG4jIEEgbGl0dGxlIHVnbHkuXG4jIEkgdXNlZCBpdGVydG9vbHMucGVybXV0YXRpb24gaW4gcHl0aG9uLlxuIyBDb3VsZG4ndCBmaW5kIGEgZ29vZCBvbmUgaW4gbnBtLiAgRG9uJ3Qgd29ycnkgdGhpcyB0YWtlcyA8IDFtcyBvbmNlLlxuZm9yIGMxIGluIGxvd2VyQ2hhcmFjdGVyc1xuICAgIGZvciBjMiBpbiBsb3dlckNoYXJhY3RlcnNcbiAgICAgICAga2V5cy5wdXNoIGMxICsgYzJcbmZvciBjMSBpbiB1cHBlckNoYXJhY3RlcnNcbiAgICBmb3IgYzIgaW4gbG93ZXJDaGFyYWN0ZXJzXG4gICAgICAgIGtleXMucHVzaCBjMSArIGMyXG5mb3IgYzEgaW4gbG93ZXJDaGFyYWN0ZXJzXG4gICAgZm9yIGMyIGluIHVwcGVyQ2hhcmFjdGVyc1xuICAgICAgICBrZXlzLnB1c2ggYzEgKyBjMlxuXG5jbGFzcyBKdW1weVZpZXcgZXh0ZW5kcyBWaWV3XG5cbiAgICBAY29udGVudDogLT5cbiAgICAgICAgQGRpdiAnJ1xuXG4gICAgaW5pdGlhbGl6ZTogKCkgLT5cbiAgICAgICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgICBAZGVjb3JhdGlvbnMgPSBbXVxuICAgICAgICBAY29tbWFuZHMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAgICAgQGNvbW1hbmRzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgICAgICAgJ2p1bXB5OnRvZ2dsZSc6ID0+IEB0b2dnbGUoKVxuICAgICAgICAgICAgJ2p1bXB5OnJlc2V0JzogPT4gQHJlc2V0KClcbiAgICAgICAgICAgICdqdW1weTpjbGVhcic6ID0+IEBjbGVhckp1bXBNb2RlKClcblxuICAgICAgICBjb21tYW5kcyA9IHt9XG4gICAgICAgIGZvciBjaGFyYWN0ZXJTZXQgaW4gW2xvd2VyQ2hhcmFjdGVycywgdXBwZXJDaGFyYWN0ZXJzXVxuICAgICAgICAgICAgZm9yIGMgaW4gY2hhcmFjdGVyU2V0XG4gICAgICAgICAgICAgICAgZG8gKGMpID0+IGNvbW1hbmRzWydqdW1weTonICsgY10gPSA9PiBAZ2V0S2V5KGMpXG4gICAgICAgIEBjb21tYW5kcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgY29tbWFuZHNcblxuICAgICAgICAjIFRPRE86IGNvbnNpZGVyIG1vdmluZyB0aGlzIGludG8gdG9nZ2xlIGZvciBuZXcgYmluZGluZ3MuXG4gICAgICAgIEBiYWNrZWRVcEtleUJpbmRpbmdzID0gXy5jbG9uZSBhdG9tLmtleW1hcHMua2V5QmluZGluZ3NcblxuICAgICAgICBAd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICAgICAgQHN0YXR1c0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IgJ3N0YXR1cy1iYXInXG4gICAgICAgIEBzdGF0dXNCYXI/LmFkZExlZnRUaWxlXG4gICAgICAgICAgICBpdGVtOiAkKCc8ZGl2IGlkPVwic3RhdHVzLWJhci1qdW1weVwiIGNsYXNzPVwiaW5saW5lLWJsb2NrXCI+PC9kaXY+JylcbiAgICAgICAgICAgIHByaW9yaXR5OiAtMVxuICAgICAgICBAc3RhdHVzQmFySnVtcHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAnc3RhdHVzLWJhci1qdW1weSdcblxuICAgIGdldEtleTogKGNoYXJhY3RlcikgLT5cbiAgICAgICAgQHN0YXR1c0Jhckp1bXB5Py5jbGFzc0xpc3QucmVtb3ZlICduby1tYXRjaCdcblxuICAgICAgICBpc01hdGNoT2ZDdXJyZW50TGFiZWxzID0gKGNoYXJhY3RlciwgbGFiZWxQb3NpdGlvbikgPT5cbiAgICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICAgICAgICAgICAgZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmICQoZWRpdG9yVmlldykuaXMgJzpub3QoOnZpc2libGUpJ1xuXG4gICAgICAgICAgICAgICAgZm9yIGRlY29yYXRpb24gaW4gQGRlY29yYXRpb25zXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBkZWNvcmF0aW9uLmdldFByb3BlcnRpZXMoKS5pdGVtXG4gICAgICAgICAgICAgICAgICAgIGlmIGVsZW1lbnQudGV4dENvbnRlbnRbbGFiZWxQb3NpdGlvbl0gPT0gY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kXG5cbiAgICAgICAgIyBBc3NlcnQ6IGxhYmVsUG9zaXRpb24gd2lsbCBzdGFydCBhdCAwIVxuICAgICAgICBsYWJlbFBvc2l0aW9uID0gKGlmIG5vdCBAZmlyc3RDaGFyIHRoZW4gMCBlbHNlIDEpXG4gICAgICAgIGlmICFpc01hdGNoT2ZDdXJyZW50TGFiZWxzIGNoYXJhY3RlciwgbGFiZWxQb3NpdGlvblxuICAgICAgICAgICAgQHN0YXR1c0Jhckp1bXB5Py5jbGFzc0xpc3QuYWRkICduby1tYXRjaCdcbiAgICAgICAgICAgIEBzdGF0dXNCYXJKdW1weVN0YXR1cz8uaW5uZXJIVE1MID0gJ05vIG1hdGNoISdcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmIG5vdCBAZmlyc3RDaGFyXG4gICAgICAgICAgICBAZmlyc3RDaGFyID0gY2hhcmFjdGVyXG4gICAgICAgICAgICBAc3RhdHVzQmFySnVtcHlTdGF0dXM/LmlubmVySFRNTCA9IEBmaXJzdENoYXJcbiAgICAgICAgICAgICMgVE9ETzogUmVmYWN0b3IgdGhpcyBzbyBub3QgMiBjYWxscyB0byBvYnNlcnZlVGV4dEVkaXRvcnNcbiAgICAgICAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICAgICAgICAgICAgZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmICQoZWRpdG9yVmlldykuaXMgJzpub3QoOnZpc2libGUpJ1xuXG4gICAgICAgICAgICAgICAgZm9yIGRlY29yYXRpb24gaW4gQGRlY29yYXRpb25zXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBkZWNvcmF0aW9uLmdldFByb3BlcnRpZXMoKS5pdGVtXG4gICAgICAgICAgICAgICAgICAgIGlmIGVsZW1lbnQudGV4dENvbnRlbnQuaW5kZXhPZihAZmlyc3RDaGFyKSAhPSAwXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQgJ2lycmVsZXZhbnQnXG4gICAgICAgIGVsc2UgaWYgbm90IEBzZWNvbmRDaGFyXG4gICAgICAgICAgICBAc2Vjb25kQ2hhciA9IGNoYXJhY3RlclxuXG4gICAgICAgIGlmIEBzZWNvbmRDaGFyXG4gICAgICAgICAgICBAanVtcCgpICMgSnVtcCBmaXJzdC4gIEN1cnJlbnRseSBuZWVkIHRoZSBwbGFjZW1lbnQgb2YgdGhlIGxhYmVscy5cbiAgICAgICAgICAgIEBjbGVhckp1bXBNb2RlKClcblxuICAgIGNsZWFyS2V5czogLT5cbiAgICAgICAgQGZpcnN0Q2hhciA9IG51bGxcbiAgICAgICAgQHNlY29uZENoYXIgPSBudWxsXG5cbiAgICByZXNldDogLT5cbiAgICAgICAgQGNsZWFyS2V5cygpXG4gICAgICAgIGZvciBkZWNvcmF0aW9uIGluIEBkZWNvcmF0aW9uc1xuICAgICAgICAgICAgZGVjb3JhdGlvbi5nZXRQcm9wZXJ0aWVzKCkuaXRlbS5jbGFzc0xpc3QucmVtb3ZlICdpcnJlbGV2YW50J1xuICAgICAgICBAc3RhdHVzQmFySnVtcHk/LmNsYXNzTGlzdC5yZW1vdmUgJ25vLW1hdGNoJ1xuICAgICAgICBAc3RhdHVzQmFySnVtcHlTdGF0dXM/LmlubmVySFRNTCA9ICdKdW1wIE1vZGUhJ1xuXG4gICAgZ2V0RmlsdGVyZWRKdW1weUtleXM6IC0+XG4gICAgICAgIGF0b20ua2V5bWFwcy5rZXlCaW5kaW5ncy5maWx0ZXIgKGtleW1hcCkgLT5cbiAgICAgICAgICAgIGtleW1hcC5jb21tYW5kLmluY2x1ZGVzICdqdW1weScgaWYgdHlwZW9mIGtleW1hcC5jb21tYW5kIGlzICdzdHJpbmcnXG5cbiAgICB0dXJuT2ZmU2xvd0tleXM6IC0+XG4gICAgICAgIGF0b20ua2V5bWFwcy5rZXlCaW5kaW5ncyA9IEBnZXRGaWx0ZXJlZEp1bXB5S2V5cygpXG5cbiAgICB0b2dnbGU6IC0+XG4gICAgICAgIEBjbGVhckp1bXBNb2RlKClcblxuICAgICAgICAjIFNldCBkaXJ0eSBmb3IgQGNsZWFySnVtcE1vZGVcbiAgICAgICAgQGNsZWFyZWQgPSBmYWxzZVxuXG4gICAgICAgICMgVE9ETzogQ2FuIHRoZSBmb2xsb3dpbmcgZmV3IGxpbmVzIGJlIHNpbmdsZXRvbidkIHVwPyBpZS4gaW5zdGFuY2UgdmFyP1xuICAgICAgICB3b3Jkc1BhdHRlcm4gPSBuZXcgUmVnRXhwIChhdG9tLmNvbmZpZy5nZXQgJ2p1bXB5Lm1hdGNoUGF0dGVybicpLCAnZydcbiAgICAgICAgZm9udFNpemUgPSBhdG9tLmNvbmZpZy5nZXQgJ2p1bXB5LmZvbnRTaXplJ1xuICAgICAgICBmb250U2l6ZSA9IC43NSBpZiBpc05hTihmb250U2l6ZSkgb3IgZm9udFNpemUgPiAxXG4gICAgICAgIGZvbnRTaXplID0gKGZvbnRTaXplICogMTAwKSArICclJ1xuICAgICAgICBoaWdoQ29udHJhc3QgPSBhdG9tLmNvbmZpZy5nZXQgJ2p1bXB5LmhpZ2hDb250cmFzdCdcblxuICAgICAgICBAdHVybk9mZlNsb3dLZXlzKClcbiAgICAgICAgQHN0YXR1c0Jhckp1bXB5Py5jbGFzc0xpc3QucmVtb3ZlICduby1tYXRjaCdcbiAgICAgICAgQHN0YXR1c0Jhckp1bXB5Py5pbm5lckhUTUwgPVxuICAgICAgICAgICAgJ0p1bXB5OiA8c3BhbiBjbGFzcz1cInN0YXR1c1wiPkp1bXAgTW9kZSE8L3NwYW4+J1xuICAgICAgICBAc3RhdHVzQmFySnVtcHlTdGF0dXMgPVxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciAnI3N0YXR1cy1iYXItanVtcHkgLnN0YXR1cydcblxuICAgICAgICBAYWxsUG9zaXRpb25zID0ge31cbiAgICAgICAgbmV4dEtleXMgPSBfLmNsb25lIGtleXNcbiAgICAgICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgICAgICAgIGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgICAgICAgICAgJGVkaXRvclZpZXcgPSAkKGVkaXRvclZpZXcpXG4gICAgICAgICAgICByZXR1cm4gaWYgJGVkaXRvclZpZXcuaXMgJzpub3QoOnZpc2libGUpJ1xuXG4gICAgICAgICAgICAjICdqdW1weS1qdW1wLW1vZGUgaXMgZm9yIGtleW1hcHMgYW5kIHV0aWxpemVkIGJ5IHRlc3RzXG4gICAgICAgICAgICBlZGl0b3JWaWV3LmNsYXNzTGlzdC5hZGQgJ2p1bXB5LWp1bXAtbW9kZSdcblxuICAgICAgICAgICAgZ2V0VmlzaWJsZUNvbHVtblJhbmdlID0gKGVkaXRvclZpZXcpIC0+XG4gICAgICAgICAgICAgICAgY2hhcldpZHRoID0gZWRpdG9yVmlldy5nZXREZWZhdWx0Q2hhcmFjdGVyV2lkdGgoKVxuICAgICAgICAgICAgICAgICMgRllJOiBhc3NlcnRzOlxuICAgICAgICAgICAgICAgICMgbnVtYmVyT2ZWaXNpYmxlQ29sdW1ucyA9IGVkaXRvclZpZXcuZ2V0V2lkdGgoKSAvIGNoYXJXaWR0aFxuICAgICAgICAgICAgICAgIG1pbkNvbHVtbiA9IChlZGl0b3JWaWV3LmdldFNjcm9sbExlZnQoKSAvIGNoYXJXaWR0aCkgLSAxXG4gICAgICAgICAgICAgICAgbWF4Q29sdW1uID0gZWRpdG9yVmlldy5nZXRTY3JvbGxSaWdodCgpIC8gY2hhcldpZHRoXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICBtaW5Db2x1bW5cbiAgICAgICAgICAgICAgICAgICAgbWF4Q29sdW1uXG4gICAgICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICBkcmF3TGFiZWxzID0gKGxpbmVOdW1iZXIsIGNvbHVtbikgPT5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIG5leHRLZXlzLmxlbmd0aFxuXG4gICAgICAgICAgICAgICAga2V5TGFiZWwgPSBuZXh0S2V5cy5zaGlmdCgpXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSB7cm93OiBsaW5lTnVtYmVyLCBjb2x1bW46IGNvbHVtbn1cbiAgICAgICAgICAgICAgICAjIGNyZWF0ZXMgYSByZWZlcmVuY2U6XG4gICAgICAgICAgICAgICAgQGFsbFBvc2l0aW9uc1trZXlMYWJlbF0gPVxuICAgICAgICAgICAgICAgICAgICBlZGl0b3I6IGVkaXRvci5pZFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb25cblxuICAgICAgICAgICAgICAgIG1hcmtlciA9IGVkaXRvci5tYXJrU2NyZWVuUmFuZ2UgbmV3IFJhbmdlKFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQobGluZU51bWJlciwgY29sdW1uKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KGxpbmVOdW1iZXIsIGNvbHVtbikpLFxuICAgICAgICAgICAgICAgICAgICBpbnZhbGlkYXRlOiAndG91Y2gnXG5cbiAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC50ZXh0Q29udGVudCA9IGtleUxhYmVsXG4gICAgICAgICAgICAgICAgbGFiZWxFbGVtZW50LnN0eWxlLmZvbnRTaXplID0gZm9udFNpemVcbiAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuY2xhc3NMaXN0LmFkZCAnanVtcHktbGFiZWwnXG4gICAgICAgICAgICAgICAgaWYgaGlnaENvbnRyYXN0XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5jbGFzc0xpc3QuYWRkICdoaWdoLWNvbnRyYXN0J1xuXG4gICAgICAgICAgICAgICAgZGVjb3JhdGlvbiA9IGVkaXRvci5kZWNvcmF0ZU1hcmtlciBtYXJrZXIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvdmVybGF5J1xuICAgICAgICAgICAgICAgICAgICBpdGVtOiBsYWJlbEVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdoZWFkJ1xuICAgICAgICAgICAgICAgIEBkZWNvcmF0aW9ucy5wdXNoIGRlY29yYXRpb25cblxuICAgICAgICAgICAgW21pbkNvbHVtbiwgbWF4Q29sdW1uXSA9IGdldFZpc2libGVDb2x1bW5SYW5nZSBlZGl0b3JWaWV3XG4gICAgICAgICAgICByb3dzID0gZWRpdG9yLmdldFZpc2libGVSb3dSYW5nZSgpXG4gICAgICAgICAgICBpZiByb3dzXG4gICAgICAgICAgICAgICAgW2ZpcnN0VmlzaWJsZVJvdywgbGFzdFZpc2libGVSb3ddID0gcm93c1xuICAgICAgICAgICAgICAgICMgVE9ETzogUmlnaHQgbm93IHRoZXJlIGFyZSBpc3N1ZXMgd2l0aCBsYXN0VmlzYmxlUm93XG4gICAgICAgICAgICAgICAgZm9yIGxpbmVOdW1iZXIgaW4gW2ZpcnN0VmlzaWJsZVJvdy4uLmxhc3RWaXNpYmxlUm93XVxuICAgICAgICAgICAgICAgICAgICBsaW5lQ29udGVudHMgPSBlZGl0b3IubGluZVRleHRGb3JTY3JlZW5Sb3cobGluZU51bWJlcilcbiAgICAgICAgICAgICAgICAgICAgaWYgZWRpdG9yLmlzRm9sZGVkQXRTY3JlZW5Sb3cobGluZU51bWJlcilcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYXdMYWJlbHMgbGluZU51bWJlciwgMFxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKHdvcmQgPSB3b3Jkc1BhdHRlcm4uZXhlYyhsaW5lQ29udGVudHMpKSAhPSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbiA9IHdvcmQuaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIERvIG5vdCBkbyBhbnl0aGluZy4uLiBtYXJrZXJzIGV0Yy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIGlmIHRoZSBjb2x1bW5zIGFyZSBvdXQgb2YgYm91bmRzLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgY29sdW1uID4gbWluQ29sdW1uICYmIGNvbHVtbiA8IG1heENvbHVtblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcmF3TGFiZWxzIGxpbmVOdW1iZXIsIGNvbHVtblxuXG4gICAgICAgICAgICBAaW5pdGlhbGl6ZUNsZWFyRXZlbnRzKGVkaXRvclZpZXcpXG5cbiAgICBjbGVhckp1bXBNb2RlSGFuZGxlcjogPT5cbiAgICAgICAgQGNsZWFySnVtcE1vZGUoKVxuXG4gICAgaW5pdGlhbGl6ZUNsZWFyRXZlbnRzOiAoZWRpdG9yVmlldykgLT5cbiAgICAgICAgQGRpc3Bvc2FibGVzLmFkZCBlZGl0b3JWaWV3Lm9uRGlkQ2hhbmdlU2Nyb2xsVG9wID0+XG4gICAgICAgICAgICBAY2xlYXJKdW1wTW9kZUhhbmRsZXIoKVxuICAgICAgICBAZGlzcG9zYWJsZXMuYWRkIGVkaXRvclZpZXcub25EaWRDaGFuZ2VTY3JvbGxMZWZ0ID0+XG4gICAgICAgICAgICBAY2xlYXJKdW1wTW9kZUhhbmRsZXIoKVxuXG4gICAgICAgIGZvciBlIGluIFsnYmx1cicsICdjbGljayddXG4gICAgICAgICAgICBlZGl0b3JWaWV3LmFkZEV2ZW50TGlzdGVuZXIgZSwgQGNsZWFySnVtcE1vZGVIYW5kbGVyLCB0cnVlXG5cbiAgICBjbGVhckp1bXBNb2RlOiAtPlxuICAgICAgICBjbGVhckFsbE1hcmtlcnMgPSA9PlxuICAgICAgICAgICAgZm9yIGRlY29yYXRpb24gaW4gQGRlY29yYXRpb25zXG4gICAgICAgICAgICAgICAgZGVjb3JhdGlvbi5nZXRNYXJrZXIoKS5kZXN0cm95KClcbiAgICAgICAgICAgIEBkZWNvcmF0aW9ucyA9IFtdICMgVmVyeSBpbXBvcnRhbnQgZm9yIEdDLlxuICAgICAgICAgICAgIyBWZXJpZmlhYmxlIGluIERldiBUb29scyAtPiBUaW1lbGluZSAtPiBOb2Rlcy5cblxuICAgICAgICBpZiBAY2xlYXJlZFxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgQGNsZWFyZWQgPSB0cnVlXG4gICAgICAgIEBjbGVhcktleXMoKVxuICAgICAgICBAc3RhdHVzQmFySnVtcHk/LmlubmVySFRNTCA9ICcnXG4gICAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICAgICAgICBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcblxuICAgICAgICAgICAgZWRpdG9yVmlldy5jbGFzc0xpc3QucmVtb3ZlICdqdW1weS1qdW1wLW1vZGUnXG4gICAgICAgICAgICBmb3IgZSBpbiBbJ2JsdXInLCAnY2xpY2snXVxuICAgICAgICAgICAgICAgIGVkaXRvclZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lciBlLCBAY2xlYXJKdW1wTW9kZUhhbmRsZXIsIHRydWVcbiAgICAgICAgYXRvbS5rZXltYXBzLmtleUJpbmRpbmdzID0gQGJhY2tlZFVwS2V5QmluZGluZ3NcbiAgICAgICAgY2xlYXJBbGxNYXJrZXJzKClcbiAgICAgICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcbiAgICAgICAgQGRldGFjaCgpXG5cbiAgICBqdW1wOiAtPlxuICAgICAgICBsb2NhdGlvbiA9IEBmaW5kTG9jYXRpb24oKVxuICAgICAgICBpZiBsb2NhdGlvbiA9PSBudWxsXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGN1cnJlbnRFZGl0b3IpID0+XG4gICAgICAgICAgICBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGN1cnJlbnRFZGl0b3IpXG5cbiAgICAgICAgICAgICMgUHJldmVudCBvdGhlciBlZGl0b3JzIGZyb20ganVtcGluZyBjdXJzb3JzIGFzIHdlbGxcbiAgICAgICAgICAgICMgVE9ETzogbWFrZSBhIHRlc3QgZm9yIHRoaXMgcmV0dXJuIGlmXG4gICAgICAgICAgICByZXR1cm4gaWYgY3VycmVudEVkaXRvci5pZCAhPSBsb2NhdGlvbi5lZGl0b3JcblxuICAgICAgICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGN1cnJlbnRFZGl0b3IpXG4gICAgICAgICAgICBwYW5lLmFjdGl2YXRlKClcblxuICAgICAgICAgICAgaXNWaXN1YWxNb2RlID0gZWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMgJ3Zpc3VhbC1tb2RlJ1xuICAgICAgICAgICAgaXNTZWxlY3RlZCA9IChjdXJyZW50RWRpdG9yLmdldFNlbGVjdGlvbnMoKS5sZW5ndGggPT0gMSAmJlxuICAgICAgICAgICAgICAgIGN1cnJlbnRFZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkgIT0gJycpXG4gICAgICAgICAgICBpZiAoaXNWaXN1YWxNb2RlIHx8IGlzU2VsZWN0ZWQpXG4gICAgICAgICAgICAgICAgY3VycmVudEVkaXRvci5zZWxlY3RUb1NjcmVlblBvc2l0aW9uIGxvY2F0aW9uLnBvc2l0aW9uXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY3VycmVudEVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbiBsb2NhdGlvbi5wb3NpdGlvblxuXG4gICAgICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQgJ2p1bXB5LnVzZUhvbWluZ0JlYWNvbkVmZmVjdE9uSnVtcHMnXG4gICAgICAgICAgICAgICAgQGRyYXdCZWFjb24gY3VycmVudEVkaXRvciwgbG9jYXRpb25cblxuICAgIGRyYXdCZWFjb246IChlZGl0b3IsIGxvY2F0aW9uKSAtPlxuICAgICAgICByYW5nZSA9IFJhbmdlIGxvY2F0aW9uLnBvc2l0aW9uLCBsb2NhdGlvbi5wb3NpdGlvblxuICAgICAgICBtYXJrZXIgPSBlZGl0b3IubWFya1NjcmVlblJhbmdlIHJhbmdlLCBpbnZhbGlkYXRlOiAnbmV2ZXInXG4gICAgICAgIGJlYWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ3NwYW4nXG4gICAgICAgIGJlYWNvbi5jbGFzc0xpc3QuYWRkICdiZWFjb24nXG4gICAgICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlciBtYXJrZXIsXG4gICAgICAgICAgICBpdGVtOiBiZWFjb24sXG4gICAgICAgICAgICB0eXBlOiAnb3ZlcmxheSdcbiAgICAgICAgc2V0VGltZW91dCAtPlxuICAgICAgICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgICAsIDE1MFxuXG4gICAgZmluZExvY2F0aW9uOiAtPlxuICAgICAgICBsYWJlbCA9IFwiI3tAZmlyc3RDaGFyfSN7QHNlY29uZENoYXJ9XCJcbiAgICAgICAgaWYgbGFiZWwgb2YgQGFsbFBvc2l0aW9uc1xuICAgICAgICAgICAgcmV0dXJuIEBhbGxQb3NpdGlvbnNbbGFiZWxdXG5cbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICMgUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgcmV0cmlldmVkIHdoZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWRcbiAgICBzZXJpYWxpemU6IC0+XG5cbiAgICAjIFRlYXIgZG93biBhbnkgc3RhdGUgYW5kIGRldGFjaFxuICAgIGRlc3Ryb3k6IC0+XG4gICAgICAgIEBjb21tYW5kcz8uZGlzcG9zZSgpXG4gICAgICAgIEBjbGVhckp1bXBNb2RlKClcblxubW9kdWxlLmV4cG9ydHMgPSBKdW1weVZpZXdcbiJdfQ==
