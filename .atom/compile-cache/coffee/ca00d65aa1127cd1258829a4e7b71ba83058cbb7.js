(function() {
  var ArgumentsSplitter, Disposable, Point, Range, _, addClassList, adjustIndentWithKeepingLayout, assertWithException, buildWordPatternByCursor, collectRangeInBufferRow, debug, detectScopeStartPositionForScope, ensureEndsWithNewLineForBufferRow, expandRangeToWhiteSpaces, findRangeContainsPoint, findRangeInBufferRow, forEachPaneAxis, fs, getAncestors, getBeginningOfWordBufferPosition, getBufferRangeForRowRange, getBufferRows, getCodeFoldRowRanges, getCodeFoldRowRangesContainesForRow, getEndOfLineForBufferRow, getEndOfWordBufferPosition, getFirstCharacterPositionForBufferRow, getFirstVisibleScreenRow, getIndentLevelForBufferRow, getIndex, getKeyBindingForCommand, getLargestFoldRangeContainsBufferRow, getLastVisibleScreenRow, getLeftCharacterForBufferPosition, getLineTextToBufferPosition, getNonWordCharactersForCursor, getPackage, getRangeByTranslatePointAndClip, getRightCharacterForBufferPosition, getScopesForTokenizedLine, getSubwordPatternAtBufferPosition, getTextInScreenRange, getTokenizedLineForRow, getTraversalForText, getValidVimBufferRow, getValidVimScreenRow, getVimEofBufferPosition, getVimEofScreenPosition, getVimLastBufferRow, getVimLastScreenRow, getVisibleBufferRange, getVisibleEditors, getWordBufferRangeAndKindAtBufferPosition, getWordBufferRangeAtBufferPosition, getWordPatternAtBufferPosition, haveSomeNonEmptySelection, humanizeBufferRange, include, insertTextAtBufferPosition, isEmpty, isEmptyRow, isEndsWithNewLineForBufferRow, isEscapedCharRange, isFunctionScope, isIncludeFunctionScopeForRow, isLeadingWhiteSpaceRange, isLinewiseRange, isNotEmpty, isNotLeadingWhiteSpaceRange, isNotSingleLineRange, isSingleLineRange, isSingleLineText, limitNumber, matchScopes, modifyClassList, moveCursor, moveCursorDownBuffer, moveCursorDownScreen, moveCursorLeft, moveCursorRight, moveCursorToFirstCharacterAtRow, moveCursorToNextNonWhitespace, moveCursorUpBuffer, moveCursorUpScreen, negateFunction, pointIsAtEndOfLine, pointIsAtEndOfLineAtNonEmptyRow, pointIsAtVimEndOfFile, pointIsOnWhiteSpace, rangeContainsPointWithEndExclusive, ref, removeClassList, replaceDecorationClassBy, saveEditorState, scanEditor, scanEditorInDirection, scanForScopeStart, searchByProjectFind, setBufferColumn, setBufferRow, settings, shouldPreventWrapLine, shrinkRangeEndToBeforeNewLine, smartScrollToBufferPosition, sortRanges, splitAndJoinBy, splitArguments, splitTextByNewLine, toggleCaseForCharacter, toggleClassList, translatePointAndClip, traverseTextFromPoint, trimRange,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs-plus');

  settings = require('./settings');

  ref = require('atom'), Disposable = ref.Disposable, Range = ref.Range, Point = ref.Point;

  _ = require('underscore-plus');

  assertWithException = function(condition, message, fn) {
    return atom.assert(condition, message, function(error) {
      throw new Error(error.message);
    });
  };

  getAncestors = function(obj) {
    var ancestors, current, ref1;
    ancestors = [];
    current = obj;
    while (true) {
      ancestors.push(current);
      current = (ref1 = current.__super__) != null ? ref1.constructor : void 0;
      if (!current) {
        break;
      }
    }
    return ancestors;
  };

  getKeyBindingForCommand = function(command, arg) {
    var j, keymap, keymapPath, keymaps, keystrokes, len, packageName, results, selector;
    packageName = arg.packageName;
    results = null;
    keymaps = atom.keymaps.getKeyBindings();
    if (packageName != null) {
      keymapPath = atom.packages.getActivePackage(packageName).getKeymapPaths().pop();
      keymaps = keymaps.filter(function(arg1) {
        var source;
        source = arg1.source;
        return source === keymapPath;
      });
    }
    for (j = 0, len = keymaps.length; j < len; j++) {
      keymap = keymaps[j];
      if (!(keymap.command === command)) {
        continue;
      }
      keystrokes = keymap.keystrokes, selector = keymap.selector;
      keystrokes = keystrokes.replace(/shift-/, '');
      (results != null ? results : results = []).push({
        keystrokes: keystrokes,
        selector: selector
      });
    }
    return results;
  };

  include = function(klass, module) {
    var key, results1, value;
    results1 = [];
    for (key in module) {
      value = module[key];
      results1.push(klass.prototype[key] = value);
    }
    return results1;
  };

  debug = function() {
    var filePath, messages;
    messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (!settings.get('debug')) {
      return;
    }
    switch (settings.get('debugOutput')) {
      case 'console':
        return console.log.apply(console, messages);
      case 'file':
        filePath = fs.normalize(settings.get('debugOutputFilePath'));
        if (fs.existsSync(filePath)) {
          return fs.appendFileSync(filePath, messages + "\n");
        }
    }
  };

  saveEditorState = function(editor) {
    var editorElement, foldStartRows, scrollTop;
    editorElement = editor.element;
    scrollTop = editorElement.getScrollTop();
    foldStartRows = editor.displayLayer.foldsMarkerLayer.findMarkers({}).map(function(m) {
      return m.getStartPosition().row;
    });
    return function() {
      var j, len, ref1, row;
      ref1 = foldStartRows.reverse();
      for (j = 0, len = ref1.length; j < len; j++) {
        row = ref1[j];
        if (!editor.isFoldedAtBufferRow(row)) {
          editor.foldBufferRow(row);
        }
      }
      return editorElement.setScrollTop(scrollTop);
    };
  };

  isLinewiseRange = function(arg) {
    var end, ref1, start;
    start = arg.start, end = arg.end;
    return (start.row !== end.row) && ((start.column === (ref1 = end.column) && ref1 === 0));
  };

  isEndsWithNewLineForBufferRow = function(editor, row) {
    var end, ref1, start;
    ref1 = editor.bufferRangeForBufferRow(row, {
      includeNewline: true
    }), start = ref1.start, end = ref1.end;
    return start.row !== end.row;
  };

  haveSomeNonEmptySelection = function(editor) {
    return editor.getSelections().some(isNotEmpty);
  };

  sortRanges = function(collection) {
    return collection.sort(function(a, b) {
      return a.compare(b);
    });
  };

  getIndex = function(index, list) {
    var length;
    length = list.length;
    if (length === 0) {
      return -1;
    } else {
      index = index % length;
      if (index >= 0) {
        return index;
      } else {
        return length + index;
      }
    }
  };

  getVisibleBufferRange = function(editor) {
    var endRow, ref1, startRow;
    ref1 = editor.element.getVisibleRowRange(), startRow = ref1[0], endRow = ref1[1];
    if (!((startRow != null) && (endRow != null))) {
      return null;
    }
    startRow = editor.bufferRowForScreenRow(startRow);
    endRow = editor.bufferRowForScreenRow(endRow);
    return new Range([startRow, 0], [endRow, 2e308]);
  };

  getVisibleEditors = function() {
    var editor, j, len, pane, ref1, results1;
    ref1 = atom.workspace.getPanes();
    results1 = [];
    for (j = 0, len = ref1.length; j < len; j++) {
      pane = ref1[j];
      if (editor = pane.getActiveEditor()) {
        results1.push(editor);
      }
    }
    return results1;
  };

  getEndOfLineForBufferRow = function(editor, row) {
    return editor.bufferRangeForBufferRow(row).end;
  };

  pointIsAtEndOfLine = function(editor, point) {
    point = Point.fromObject(point);
    return getEndOfLineForBufferRow(editor, point.row).isEqual(point);
  };

  pointIsOnWhiteSpace = function(editor, point) {
    var char;
    char = getRightCharacterForBufferPosition(editor, point);
    return !/\S/.test(char);
  };

  pointIsAtEndOfLineAtNonEmptyRow = function(editor, point) {
    point = Point.fromObject(point);
    return point.column !== 0 && pointIsAtEndOfLine(editor, point);
  };

  pointIsAtVimEndOfFile = function(editor, point) {
    return getVimEofBufferPosition(editor).isEqual(point);
  };

  isEmptyRow = function(editor, row) {
    return editor.bufferRangeForBufferRow(row).isEmpty();
  };

  getRightCharacterForBufferPosition = function(editor, point, amount) {
    if (amount == null) {
      amount = 1;
    }
    return editor.getTextInBufferRange(Range.fromPointWithDelta(point, 0, amount));
  };

  getLeftCharacterForBufferPosition = function(editor, point, amount) {
    if (amount == null) {
      amount = 1;
    }
    return editor.getTextInBufferRange(Range.fromPointWithDelta(point, 0, -amount));
  };

  getTextInScreenRange = function(editor, screenRange) {
    var bufferRange;
    bufferRange = editor.bufferRangeForScreenRange(screenRange);
    return editor.getTextInBufferRange(bufferRange);
  };

  getNonWordCharactersForCursor = function(cursor) {
    var scope;
    if (cursor.getNonWordCharacters != null) {
      return cursor.getNonWordCharacters();
    } else {
      scope = cursor.getScopeDescriptor().getScopesArray();
      return atom.config.get('editor.nonWordCharacters', {
        scope: scope
      });
    }
  };

  moveCursorToNextNonWhitespace = function(cursor) {
    var editor, originalPoint, point, vimEof;
    originalPoint = cursor.getBufferPosition();
    editor = cursor.editor;
    vimEof = getVimEofBufferPosition(editor);
    while (pointIsOnWhiteSpace(editor, point = cursor.getBufferPosition()) && !point.isGreaterThanOrEqual(vimEof)) {
      cursor.moveRight();
    }
    return !originalPoint.isEqual(cursor.getBufferPosition());
  };

  getBufferRows = function(editor, arg) {
    var direction, endRow, j, k, ref1, ref2, results1, results2, startRow;
    startRow = arg.startRow, direction = arg.direction;
    switch (direction) {
      case 'previous':
        if (startRow <= 0) {
          return [];
        } else {
          return (function() {
            results1 = [];
            for (var j = ref1 = startRow - 1; ref1 <= 0 ? j <= 0 : j >= 0; ref1 <= 0 ? j++ : j--){ results1.push(j); }
            return results1;
          }).apply(this);
        }
        break;
      case 'next':
        endRow = getVimLastBufferRow(editor);
        if (startRow >= endRow) {
          return [];
        } else {
          return (function() {
            results2 = [];
            for (var k = ref2 = startRow + 1; ref2 <= endRow ? k <= endRow : k >= endRow; ref2 <= endRow ? k++ : k--){ results2.push(k); }
            return results2;
          }).apply(this);
        }
    }
  };

  getVimEofBufferPosition = function(editor) {
    var eof;
    eof = editor.getEofBufferPosition();
    if ((eof.row === 0) || (eof.column > 0)) {
      return eof;
    } else {
      return getEndOfLineForBufferRow(editor, eof.row - 1);
    }
  };

  getVimEofScreenPosition = function(editor) {
    return editor.screenPositionForBufferPosition(getVimEofBufferPosition(editor));
  };

  getVimLastBufferRow = function(editor) {
    return getVimEofBufferPosition(editor).row;
  };

  getVimLastScreenRow = function(editor) {
    return getVimEofScreenPosition(editor).row;
  };

  getFirstVisibleScreenRow = function(editor) {
    return editor.element.getFirstVisibleScreenRow();
  };

  getLastVisibleScreenRow = function(editor) {
    return editor.element.getLastVisibleScreenRow();
  };

  getFirstCharacterPositionForBufferRow = function(editor, row) {
    var range, ref1;
    range = findRangeInBufferRow(editor, /\S/, row);
    return (ref1 = range != null ? range.start : void 0) != null ? ref1 : new Point(row, 0);
  };

  trimRange = function(editor, scanRange) {
    var end, pattern, ref1, setEnd, setStart, start;
    pattern = /\S/;
    ref1 = [], start = ref1[0], end = ref1[1];
    setStart = function(arg) {
      var range;
      range = arg.range;
      return start = range.start, range;
    };
    setEnd = function(arg) {
      var range;
      range = arg.range;
      return end = range.end, range;
    };
    editor.scanInBufferRange(pattern, scanRange, setStart);
    if (start != null) {
      editor.backwardsScanInBufferRange(pattern, scanRange, setEnd);
    }
    if ((start != null) && (end != null)) {
      return new Range(start, end);
    } else {
      return scanRange;
    }
  };

  setBufferRow = function(cursor, row, options) {
    var column, ref1;
    column = (ref1 = cursor.goalColumn) != null ? ref1 : cursor.getBufferColumn();
    cursor.setBufferPosition([row, column], options);
    return cursor.goalColumn = column;
  };

  setBufferColumn = function(cursor, column) {
    return cursor.setBufferPosition([cursor.getBufferRow(), column]);
  };

  moveCursor = function(cursor, arg, fn) {
    var goalColumn, preserveGoalColumn;
    preserveGoalColumn = arg.preserveGoalColumn;
    goalColumn = cursor.goalColumn;
    fn(cursor);
    if (preserveGoalColumn && (goalColumn != null)) {
      return cursor.goalColumn = goalColumn;
    }
  };

  shouldPreventWrapLine = function(cursor) {
    var column, ref1, row, tabLength, text;
    ref1 = cursor.getBufferPosition(), row = ref1.row, column = ref1.column;
    if (atom.config.get('editor.softTabs')) {
      tabLength = atom.config.get('editor.tabLength');
      if ((0 < column && column < tabLength)) {
        text = cursor.editor.getTextInBufferRange([[row, 0], [row, tabLength]]);
        return /^\s+$/.test(text);
      } else {
        return false;
      }
    }
  };

  moveCursorLeft = function(cursor, options) {
    var allowWrap, motion, needSpecialCareToPreventWrapLine;
    if (options == null) {
      options = {};
    }
    allowWrap = options.allowWrap, needSpecialCareToPreventWrapLine = options.needSpecialCareToPreventWrapLine;
    delete options.allowWrap;
    if (needSpecialCareToPreventWrapLine) {
      if (shouldPreventWrapLine(cursor)) {
        return;
      }
    }
    if (!cursor.isAtBeginningOfLine() || allowWrap) {
      motion = function(cursor) {
        return cursor.moveLeft();
      };
      return moveCursor(cursor, options, motion);
    }
  };

  moveCursorRight = function(cursor, options) {
    var allowWrap, motion;
    if (options == null) {
      options = {};
    }
    allowWrap = options.allowWrap;
    delete options.allowWrap;
    if (!cursor.isAtEndOfLine() || allowWrap) {
      motion = function(cursor) {
        return cursor.moveRight();
      };
      return moveCursor(cursor, options, motion);
    }
  };

  moveCursorUpScreen = function(cursor, options) {
    var motion;
    if (options == null) {
      options = {};
    }
    if (cursor.getScreenRow() !== 0) {
      motion = function(cursor) {
        return cursor.moveUp();
      };
      return moveCursor(cursor, options, motion);
    }
  };

  moveCursorDownScreen = function(cursor, options) {
    var motion;
    if (options == null) {
      options = {};
    }
    if (getVimLastScreenRow(cursor.editor) !== cursor.getScreenRow()) {
      motion = function(cursor) {
        return cursor.moveDown();
      };
      return moveCursor(cursor, options, motion);
    }
  };

  moveCursorDownBuffer = function(cursor) {
    var point;
    point = cursor.getBufferPosition();
    if (getVimLastBufferRow(cursor.editor) !== point.row) {
      return cursor.setBufferPosition(point.translate([+1, 0]));
    }
  };

  moveCursorUpBuffer = function(cursor) {
    var point;
    point = cursor.getBufferPosition();
    if (point.row !== 0) {
      return cursor.setBufferPosition(point.translate([-1, 0]));
    }
  };

  moveCursorToFirstCharacterAtRow = function(cursor, row) {
    cursor.setBufferPosition([row, 0]);
    return cursor.moveToFirstCharacterOfLine();
  };

  getValidVimBufferRow = function(editor, row) {
    return limitNumber(row, {
      min: 0,
      max: getVimLastBufferRow(editor)
    });
  };

  getValidVimScreenRow = function(editor, row) {
    return limitNumber(row, {
      min: 0,
      max: getVimLastScreenRow(editor)
    });
  };

  getLineTextToBufferPosition = function(editor, arg, arg1) {
    var column, exclusive, row;
    row = arg.row, column = arg.column;
    exclusive = (arg1 != null ? arg1 : {}).exclusive;
    if (exclusive != null ? exclusive : true) {
      return editor.lineTextForBufferRow(row).slice(0, column);
    } else {
      return editor.lineTextForBufferRow(row).slice(0, +column + 1 || 9e9);
    }
  };

  getIndentLevelForBufferRow = function(editor, row) {
    return editor.indentLevelForLine(editor.lineTextForBufferRow(row));
  };

  getCodeFoldRowRanges = function(editor) {
    var j, ref1, results1;
    return (function() {
      results1 = [];
      for (var j = 0, ref1 = editor.getLastBufferRow(); 0 <= ref1 ? j <= ref1 : j >= ref1; 0 <= ref1 ? j++ : j--){ results1.push(j); }
      return results1;
    }).apply(this).map(function(row) {
      return editor.languageMode.rowRangeForCodeFoldAtBufferRow(row);
    }).filter(function(rowRange) {
      return (rowRange != null) && (rowRange[0] != null) && (rowRange[1] != null);
    });
  };

  getCodeFoldRowRangesContainesForRow = function(editor, bufferRow, arg) {
    var includeStartRow;
    includeStartRow = (arg != null ? arg : {}).includeStartRow;
    if (includeStartRow == null) {
      includeStartRow = true;
    }
    return getCodeFoldRowRanges(editor).filter(function(arg1) {
      var endRow, startRow;
      startRow = arg1[0], endRow = arg1[1];
      if (includeStartRow) {
        return (startRow <= bufferRow && bufferRow <= endRow);
      } else {
        return (startRow < bufferRow && bufferRow <= endRow);
      }
    });
  };

  getBufferRangeForRowRange = function(editor, rowRange) {
    var endRange, ref1, startRange;
    ref1 = rowRange.map(function(row) {
      return editor.bufferRangeForBufferRow(row, {
        includeNewline: true
      });
    }), startRange = ref1[0], endRange = ref1[1];
    return startRange.union(endRange);
  };

  getTokenizedLineForRow = function(editor, row) {
    return editor.tokenizedBuffer.tokenizedLineForRow(row);
  };

  getScopesForTokenizedLine = function(line) {
    var j, len, ref1, results1, tag;
    ref1 = line.tags;
    results1 = [];
    for (j = 0, len = ref1.length; j < len; j++) {
      tag = ref1[j];
      if (tag < 0 && (tag % 2 === -1)) {
        results1.push(atom.grammars.scopeForId(tag));
      }
    }
    return results1;
  };

  scanForScopeStart = function(editor, fromPoint, direction, fn) {
    var column, continueScan, isValidToken, j, k, l, len, len1, len2, position, ref1, result, results, row, scanRows, scope, stop, tag, tokenIterator, tokenizedLine;
    fromPoint = Point.fromObject(fromPoint);
    scanRows = (function() {
      var j, k, ref1, ref2, ref3, results1, results2;
      switch (direction) {
        case 'forward':
          return (function() {
            results1 = [];
            for (var j = ref1 = fromPoint.row, ref2 = editor.getLastBufferRow(); ref1 <= ref2 ? j <= ref2 : j >= ref2; ref1 <= ref2 ? j++ : j--){ results1.push(j); }
            return results1;
          }).apply(this);
        case 'backward':
          return (function() {
            results2 = [];
            for (var k = ref3 = fromPoint.row; ref3 <= 0 ? k <= 0 : k >= 0; ref3 <= 0 ? k++ : k--){ results2.push(k); }
            return results2;
          }).apply(this);
      }
    })();
    continueScan = true;
    stop = function() {
      return continueScan = false;
    };
    isValidToken = (function() {
      switch (direction) {
        case 'forward':
          return function(arg) {
            var position;
            position = arg.position;
            return position.isGreaterThan(fromPoint);
          };
        case 'backward':
          return function(arg) {
            var position;
            position = arg.position;
            return position.isLessThan(fromPoint);
          };
      }
    })();
    for (j = 0, len = scanRows.length; j < len; j++) {
      row = scanRows[j];
      if (!(tokenizedLine = getTokenizedLineForRow(editor, row))) {
        continue;
      }
      column = 0;
      results = [];
      tokenIterator = tokenizedLine.getTokenIterator();
      ref1 = tokenizedLine.tags;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        tag = ref1[k];
        tokenIterator.next();
        if (tag < 0) {
          scope = atom.grammars.scopeForId(tag);
          if ((tag % 2) === 0) {
            null;
          } else {
            position = new Point(row, column);
            results.push({
              scope: scope,
              position: position,
              stop: stop
            });
          }
        } else {
          column += tag;
        }
      }
      results = results.filter(isValidToken);
      if (direction === 'backward') {
        results.reverse();
      }
      for (l = 0, len2 = results.length; l < len2; l++) {
        result = results[l];
        fn(result);
        if (!continueScan) {
          return;
        }
      }
      if (!continueScan) {
        return;
      }
    }
  };

  detectScopeStartPositionForScope = function(editor, fromPoint, direction, scope) {
    var point;
    point = null;
    scanForScopeStart(editor, fromPoint, direction, function(info) {
      if (info.scope.search(scope) >= 0) {
        info.stop();
        return point = info.position;
      }
    });
    return point;
  };

  isIncludeFunctionScopeForRow = function(editor, row) {
    var tokenizedLine;
    if (tokenizedLine = getTokenizedLineForRow(editor, row)) {
      return getScopesForTokenizedLine(tokenizedLine).some(function(scope) {
        return isFunctionScope(editor, scope);
      });
    } else {
      return false;
    }
  };

  isFunctionScope = function(editor, scope) {
    var pattern, scopes;
    switch (editor.getGrammar().scopeName) {
      case 'source.go':
      case 'source.elixir':
        scopes = ['entity.name.function'];
        break;
      case 'source.ruby':
        scopes = ['meta.function.', 'meta.class.', 'meta.module.'];
        break;
      default:
        scopes = ['meta.function.', 'meta.class.'];
    }
    pattern = new RegExp('^' + scopes.map(_.escapeRegExp).join('|'));
    return pattern.test(scope);
  };

  smartScrollToBufferPosition = function(editor, point) {
    var center, editorAreaHeight, editorElement, onePageDown, onePageUp, target;
    editorElement = editor.element;
    editorAreaHeight = editor.getLineHeightInPixels() * (editor.getRowsPerPage() - 1);
    onePageUp = editorElement.getScrollTop() - editorAreaHeight;
    onePageDown = editorElement.getScrollBottom() + editorAreaHeight;
    target = editorElement.pixelPositionForBufferPosition(point).top;
    center = (onePageDown < target) || (target < onePageUp);
    return editor.scrollToBufferPosition(point, {
      center: center
    });
  };

  matchScopes = function(editorElement, scopes) {
    var className, classNames, classes, containsCount, j, k, len, len1;
    classes = scopes.map(function(scope) {
      return scope.split('.');
    });
    for (j = 0, len = classes.length; j < len; j++) {
      classNames = classes[j];
      containsCount = 0;
      for (k = 0, len1 = classNames.length; k < len1; k++) {
        className = classNames[k];
        if (editorElement.classList.contains(className)) {
          containsCount += 1;
        }
      }
      if (containsCount === classNames.length) {
        return true;
      }
    }
    return false;
  };

  isSingleLineText = function(text) {
    return text.split(/\n|\r\n/).length === 1;
  };

  getWordBufferRangeAndKindAtBufferPosition = function(editor, point, options) {
    var characterAtPoint, cursor, kind, nonWordCharacters, nonWordRegex, range, ref1, singleNonWordChar, source, wordRegex;
    if (options == null) {
      options = {};
    }
    singleNonWordChar = options.singleNonWordChar, wordRegex = options.wordRegex, nonWordCharacters = options.nonWordCharacters, cursor = options.cursor;
    if ((wordRegex == null) || (nonWordCharacters == null)) {
      if (cursor == null) {
        cursor = editor.getLastCursor();
      }
      ref1 = _.extend(options, buildWordPatternByCursor(cursor, options)), wordRegex = ref1.wordRegex, nonWordCharacters = ref1.nonWordCharacters;
    }
    if (singleNonWordChar == null) {
      singleNonWordChar = true;
    }
    characterAtPoint = getRightCharacterForBufferPosition(editor, point);
    nonWordRegex = new RegExp("[" + (_.escapeRegExp(nonWordCharacters)) + "]+");
    if (/\s/.test(characterAtPoint)) {
      source = "[\t ]+";
      kind = 'white-space';
      wordRegex = new RegExp(source);
    } else if (nonWordRegex.test(characterAtPoint) && !wordRegex.test(characterAtPoint)) {
      kind = 'non-word';
      if (singleNonWordChar) {
        source = _.escapeRegExp(characterAtPoint);
        wordRegex = new RegExp(source);
      } else {
        wordRegex = nonWordRegex;
      }
    } else {
      kind = 'word';
    }
    range = getWordBufferRangeAtBufferPosition(editor, point, {
      wordRegex: wordRegex
    });
    return {
      kind: kind,
      range: range
    };
  };

  getWordPatternAtBufferPosition = function(editor, point, options) {
    var boundarizeForWord, endBoundary, kind, pattern, range, ref1, ref2, startBoundary, text;
    if (options == null) {
      options = {};
    }
    boundarizeForWord = (ref1 = options.boundarizeForWord) != null ? ref1 : true;
    delete options.boundarizeForWord;
    ref2 = getWordBufferRangeAndKindAtBufferPosition(editor, point, options), range = ref2.range, kind = ref2.kind;
    text = editor.getTextInBufferRange(range);
    pattern = _.escapeRegExp(text);
    if (kind === 'word' && boundarizeForWord) {
      startBoundary = /^\w/.test(text) ? "\\b" : '';
      endBoundary = /\w$/.test(text) ? "\\b" : '';
      pattern = startBoundary + pattern + endBoundary;
    }
    return new RegExp(pattern, 'g');
  };

  getSubwordPatternAtBufferPosition = function(editor, point, options) {
    if (options == null) {
      options = {};
    }
    options = {
      wordRegex: editor.getLastCursor().subwordRegExp(),
      boundarizeForWord: false
    };
    return getWordPatternAtBufferPosition(editor, point, options);
  };

  buildWordPatternByCursor = function(cursor, arg) {
    var nonWordCharacters, wordRegex;
    wordRegex = arg.wordRegex;
    nonWordCharacters = getNonWordCharactersForCursor(cursor);
    if (wordRegex == null) {
      wordRegex = new RegExp("^[\t ]*$|[^\\s" + (_.escapeRegExp(nonWordCharacters)) + "]+");
    }
    return {
      wordRegex: wordRegex,
      nonWordCharacters: nonWordCharacters
    };
  };

  getBeginningOfWordBufferPosition = function(editor, point, arg) {
    var found, scanRange, wordRegex;
    wordRegex = (arg != null ? arg : {}).wordRegex;
    scanRange = [[point.row, 0], point];
    found = null;
    editor.backwardsScanInBufferRange(wordRegex, scanRange, function(arg1) {
      var matchText, range, stop;
      range = arg1.range, matchText = arg1.matchText, stop = arg1.stop;
      if (matchText === '' && range.start.column !== 0) {
        return;
      }
      if (range.start.isLessThan(point)) {
        if (range.end.isGreaterThanOrEqual(point)) {
          found = range.start;
        }
        return stop();
      }
    });
    return found != null ? found : point;
  };

  getEndOfWordBufferPosition = function(editor, point, arg) {
    var found, scanRange, wordRegex;
    wordRegex = (arg != null ? arg : {}).wordRegex;
    scanRange = [point, [point.row, 2e308]];
    found = null;
    editor.scanInBufferRange(wordRegex, scanRange, function(arg1) {
      var matchText, range, stop;
      range = arg1.range, matchText = arg1.matchText, stop = arg1.stop;
      if (matchText === '' && range.start.column !== 0) {
        return;
      }
      if (range.end.isGreaterThan(point)) {
        if (range.start.isLessThanOrEqual(point)) {
          found = range.end;
        }
        return stop();
      }
    });
    return found != null ? found : point;
  };

  getWordBufferRangeAtBufferPosition = function(editor, position, options) {
    var endPosition, startPosition;
    if (options == null) {
      options = {};
    }
    endPosition = getEndOfWordBufferPosition(editor, position, options);
    startPosition = getBeginningOfWordBufferPosition(editor, endPosition, options);
    return new Range(startPosition, endPosition);
  };

  shrinkRangeEndToBeforeNewLine = function(range) {
    var end, endRow, start;
    start = range.start, end = range.end;
    if (end.column === 0) {
      endRow = limitNumber(end.row - 1, {
        min: start.row
      });
      return new Range(start, [endRow, 2e308]);
    } else {
      return range;
    }
  };

  scanEditor = function(editor, pattern) {
    var ranges;
    ranges = [];
    editor.scan(pattern, function(arg) {
      var range;
      range = arg.range;
      return ranges.push(range);
    });
    return ranges;
  };

  collectRangeInBufferRow = function(editor, row, pattern) {
    var ranges, scanRange;
    ranges = [];
    scanRange = editor.bufferRangeForBufferRow(row);
    editor.scanInBufferRange(pattern, scanRange, function(arg) {
      var range;
      range = arg.range;
      return ranges.push(range);
    });
    return ranges;
  };

  findRangeInBufferRow = function(editor, pattern, row, arg) {
    var direction, range, scanFunctionName, scanRange;
    direction = (arg != null ? arg : {}).direction;
    if (direction === 'backward') {
      scanFunctionName = 'backwardsScanInBufferRange';
    } else {
      scanFunctionName = 'scanInBufferRange';
    }
    range = null;
    scanRange = editor.bufferRangeForBufferRow(row);
    editor[scanFunctionName](pattern, scanRange, function(event) {
      return range = event.range;
    });
    return range;
  };

  getLargestFoldRangeContainsBufferRow = function(editor, row) {
    var end, endPoint, j, len, marker, markers, ref1, ref2, start, startPoint;
    markers = editor.displayLayer.foldsMarkerLayer.findMarkers({
      intersectsRow: row
    });
    startPoint = null;
    endPoint = null;
    ref1 = markers != null ? markers : [];
    for (j = 0, len = ref1.length; j < len; j++) {
      marker = ref1[j];
      ref2 = marker.getRange(), start = ref2.start, end = ref2.end;
      if (!startPoint) {
        startPoint = start;
        endPoint = end;
        continue;
      }
      if (start.isLessThan(startPoint)) {
        startPoint = start;
        endPoint = end;
      }
    }
    if ((startPoint != null) && (endPoint != null)) {
      return new Range(startPoint, endPoint);
    }
  };

  translatePointAndClip = function(editor, point, direction) {
    var dontClip, eol, newRow, screenPoint;
    point = Point.fromObject(point);
    dontClip = false;
    switch (direction) {
      case 'forward':
        point = point.translate([0, +1]);
        eol = editor.bufferRangeForBufferRow(point.row).end;
        if (point.isEqual(eol)) {
          dontClip = true;
        } else if (point.isGreaterThan(eol)) {
          dontClip = true;
          point = new Point(point.row + 1, 0);
        }
        point = Point.min(point, editor.getEofBufferPosition());
        break;
      case 'backward':
        point = point.translate([0, -1]);
        if (point.column < 0) {
          dontClip = true;
          newRow = point.row - 1;
          eol = editor.bufferRangeForBufferRow(newRow).end;
          point = new Point(newRow, eol.column);
        }
        point = Point.max(point, Point.ZERO);
    }
    if (dontClip) {
      return point;
    } else {
      screenPoint = editor.screenPositionForBufferPosition(point, {
        clipDirection: direction
      });
      return editor.bufferPositionForScreenPosition(screenPoint);
    }
  };

  getRangeByTranslatePointAndClip = function(editor, range, which, direction) {
    var newPoint;
    newPoint = translatePointAndClip(editor, range[which], direction);
    switch (which) {
      case 'start':
        return new Range(newPoint, range.end);
      case 'end':
        return new Range(range.start, newPoint);
    }
  };

  getPackage = function(name, fn) {
    return new Promise(function(resolve) {
      var disposable, pkg;
      if (atom.packages.isPackageActive(name)) {
        pkg = atom.packages.getActivePackage(name);
        return resolve(pkg);
      } else {
        return disposable = atom.packages.onDidActivatePackage(function(pkg) {
          if (pkg.name === name) {
            disposable.dispose();
            return resolve(pkg);
          }
        });
      }
    });
  };

  searchByProjectFind = function(editor, text) {
    atom.commands.dispatch(editor.element, 'project-find:show');
    return getPackage('find-and-replace').then(function(pkg) {
      var projectFindView;
      projectFindView = pkg.mainModule.projectFindView;
      if (projectFindView != null) {
        projectFindView.findEditor.setText(text);
        return projectFindView.confirm();
      }
    });
  };

  limitNumber = function(number, arg) {
    var max, min, ref1;
    ref1 = arg != null ? arg : {}, max = ref1.max, min = ref1.min;
    if (max != null) {
      number = Math.min(number, max);
    }
    if (min != null) {
      number = Math.max(number, min);
    }
    return number;
  };

  findRangeContainsPoint = function(ranges, point) {
    var j, len, range;
    for (j = 0, len = ranges.length; j < len; j++) {
      range = ranges[j];
      if (range.containsPoint(point)) {
        return range;
      }
    }
    return null;
  };

  negateFunction = function(fn) {
    return function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return !fn.apply(null, args);
    };
  };

  isEmpty = function(target) {
    return target.isEmpty();
  };

  isNotEmpty = negateFunction(isEmpty);

  isSingleLineRange = function(range) {
    return range.isSingleLine();
  };

  isNotSingleLineRange = negateFunction(isSingleLineRange);

  isLeadingWhiteSpaceRange = function(editor, range) {
    return /^[\t ]*$/.test(editor.getTextInBufferRange(range));
  };

  isNotLeadingWhiteSpaceRange = negateFunction(isLeadingWhiteSpaceRange);

  isEscapedCharRange = function(editor, range) {
    var chars;
    range = Range.fromObject(range);
    chars = getLeftCharacterForBufferPosition(editor, range.start, 2);
    return chars.endsWith('\\') && !chars.endsWith('\\\\');
  };

  insertTextAtBufferPosition = function(editor, point, text) {
    return editor.setTextInBufferRange([point, point], text);
  };

  ensureEndsWithNewLineForBufferRow = function(editor, row) {
    var eol;
    if (!isEndsWithNewLineForBufferRow(editor, row)) {
      eol = getEndOfLineForBufferRow(editor, row);
      return insertTextAtBufferPosition(editor, eol, "\n");
    }
  };

  forEachPaneAxis = function(fn, base) {
    var child, j, len, ref1, results1;
    if (base == null) {
      base = atom.workspace.getActivePane().getContainer().getRoot();
    }
    if (base.children != null) {
      fn(base);
      ref1 = base.children;
      results1 = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        child = ref1[j];
        results1.push(forEachPaneAxis(fn, child));
      }
      return results1;
    }
  };

  modifyClassList = function() {
    var action, classNames, element, ref1;
    action = arguments[0], element = arguments[1], classNames = 3 <= arguments.length ? slice.call(arguments, 2) : [];
    return (ref1 = element.classList)[action].apply(ref1, classNames);
  };

  addClassList = modifyClassList.bind(null, 'add');

  removeClassList = modifyClassList.bind(null, 'remove');

  toggleClassList = modifyClassList.bind(null, 'toggle');

  toggleCaseForCharacter = function(char) {
    var charLower;
    charLower = char.toLowerCase();
    if (charLower === char) {
      return char.toUpperCase();
    } else {
      return charLower;
    }
  };

  splitTextByNewLine = function(text) {
    if (text.endsWith("\n")) {
      return text.trimRight().split(/\r?\n/g);
    } else {
      return text.split(/\r?\n/g);
    }
  };

  replaceDecorationClassBy = function(fn, decoration) {
    var props;
    props = decoration.getProperties();
    return decoration.setProperties(_.defaults({
      "class": fn(props["class"])
    }, props));
  };

  humanizeBufferRange = function(editor, range) {
    var end, newEnd, newStart, start;
    if (isSingleLineRange(range) || isLinewiseRange(range)) {
      return range;
    }
    start = range.start, end = range.end;
    if (pointIsAtEndOfLine(editor, start)) {
      newStart = start.traverse([1, 0]);
    }
    if (pointIsAtEndOfLine(editor, end)) {
      newEnd = end.traverse([1, 0]);
    }
    if ((newStart != null) || (newEnd != null)) {
      return new Range(newStart != null ? newStart : start, newEnd != null ? newEnd : end);
    } else {
      return range;
    }
  };

  expandRangeToWhiteSpaces = function(editor, range) {
    var end, newEnd, newStart, scanRange, start;
    start = range.start, end = range.end;
    newEnd = null;
    scanRange = [end, getEndOfLineForBufferRow(editor, end.row)];
    editor.scanInBufferRange(/\S/, scanRange, function(arg) {
      var range;
      range = arg.range;
      return newEnd = range.start;
    });
    if (newEnd != null ? newEnd.isGreaterThan(end) : void 0) {
      return new Range(start, newEnd);
    }
    newStart = null;
    scanRange = [[start.row, 0], range.start];
    editor.backwardsScanInBufferRange(/\S/, scanRange, function(arg) {
      var range;
      range = arg.range;
      return newStart = range.end;
    });
    if (newStart != null ? newStart.isLessThan(start) : void 0) {
      return new Range(newStart, end);
    }
    return range;
  };

  splitAndJoinBy = function(text, pattern, fn) {
    var end, flags, i, item, items, j, k, leadingSpaces, len, len1, ref1, ref2, ref3, regexp, result, segment, separator, separators, start, trailingSpaces;
    leadingSpaces = trailingSpaces = '';
    start = text.search(/\S/);
    end = text.search(/\s*$/);
    leadingSpaces = trailingSpaces = '';
    if (start !== -1) {
      leadingSpaces = text.slice(0, start);
    }
    if (end !== -1) {
      trailingSpaces = text.slice(end);
    }
    text = text.slice(start, end);
    flags = 'g';
    if (pattern.ignoreCase) {
      flags += 'i';
    }
    regexp = new RegExp("(" + pattern.source + ")", flags);
    items = [];
    separators = [];
    ref1 = text.split(regexp);
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      segment = ref1[i];
      if (i % 2 === 0) {
        items.push(segment);
      } else {
        separators.push(segment);
      }
    }
    separators.push('');
    items = fn(items);
    result = '';
    ref2 = _.zip(items, separators);
    for (k = 0, len1 = ref2.length; k < len1; k++) {
      ref3 = ref2[k], item = ref3[0], separator = ref3[1];
      result += item + separator;
    }
    return leadingSpaces + result + trailingSpaces;
  };

  ArgumentsSplitter = (function() {
    function ArgumentsSplitter() {
      this.allTokens = [];
      this.currentSection = null;
    }

    ArgumentsSplitter.prototype.settlePending = function() {
      if (this.pendingToken) {
        this.allTokens.push({
          text: this.pendingToken,
          type: this.currentSection
        });
        return this.pendingToken = '';
      }
    };

    ArgumentsSplitter.prototype.changeSection = function(newSection) {
      if (this.currentSection !== newSection) {
        if (this.currentSection) {
          this.settlePending();
        }
        return this.currentSection = newSection;
      }
    };

    return ArgumentsSplitter;

  })();

  splitArguments = function(text, joinSpaceSeparatedToken) {
    var allTokens, changeSection, char, closeCharToOpenChar, closePairChars, currentSection, escapeChar, inQuote, isEscaped, j, lastArg, len, newAllTokens, openPairChars, pairStack, pendingToken, quoteChars, ref1, ref2, ref3, separatorChars, settlePending, token;
    if (joinSpaceSeparatedToken == null) {
      joinSpaceSeparatedToken = true;
    }
    separatorChars = "\t, \r\n";
    quoteChars = "\"'`";
    closeCharToOpenChar = {
      ")": "(",
      "}": "{",
      "]": "["
    };
    closePairChars = _.keys(closeCharToOpenChar).join('');
    openPairChars = _.values(closeCharToOpenChar).join('');
    escapeChar = "\\";
    pendingToken = '';
    inQuote = false;
    isEscaped = false;
    allTokens = [];
    currentSection = null;
    settlePending = function() {
      if (pendingToken) {
        allTokens.push({
          text: pendingToken,
          type: currentSection
        });
        return pendingToken = '';
      }
    };
    changeSection = function(newSection) {
      if (currentSection !== newSection) {
        if (currentSection) {
          settlePending();
        }
        return currentSection = newSection;
      }
    };
    pairStack = [];
    for (j = 0, len = text.length; j < len; j++) {
      char = text[j];
      if ((pairStack.length === 0) && (indexOf.call(separatorChars, char) >= 0)) {
        changeSection('separator');
      } else {
        changeSection('argument');
        if (isEscaped) {
          isEscaped = false;
        } else if (char === escapeChar) {
          isEscaped = true;
        } else if (inQuote) {
          if ((indexOf.call(quoteChars, char) >= 0) && _.last(pairStack) === char) {
            pairStack.pop();
            inQuote = false;
          }
        } else if (indexOf.call(quoteChars, char) >= 0) {
          inQuote = true;
          pairStack.push(char);
        } else if (indexOf.call(openPairChars, char) >= 0) {
          pairStack.push(char);
        } else if (indexOf.call(closePairChars, char) >= 0) {
          if (_.last(pairStack) === closeCharToOpenChar[char]) {
            pairStack.pop();
          }
        }
      }
      pendingToken += char;
    }
    settlePending();
    if (joinSpaceSeparatedToken && allTokens.some(function(arg) {
      var text, type;
      type = arg.type, text = arg.text;
      return type === 'separator' && indexOf.call(text, ',') >= 0;
    })) {
      newAllTokens = [];
      while (allTokens.length) {
        token = allTokens.shift();
        switch (token.type) {
          case 'argument':
            newAllTokens.push(token);
            break;
          case 'separator':
            if (indexOf.call(token.text, ',') >= 0) {
              newAllTokens.push(token);
            } else {
              lastArg = (ref1 = newAllTokens.pop()) != null ? ref1 : {
                text: '',
                'argument': 'argument'
              };
              lastArg.text += token.text + ((ref2 = (ref3 = allTokens.shift()) != null ? ref3.text : void 0) != null ? ref2 : '');
              newAllTokens.push(lastArg);
            }
        }
      }
      allTokens = newAllTokens;
    }
    return allTokens;
  };

  scanEditorInDirection = function(editor, direction, pattern, options, fn) {
    var allowNextLine, from, scanFunction, scanRange;
    if (options == null) {
      options = {};
    }
    allowNextLine = options.allowNextLine, from = options.from, scanRange = options.scanRange;
    if ((from == null) && (scanRange == null)) {
      throw new Error("You must either of 'from' or 'scanRange' options");
    }
    if (scanRange) {
      allowNextLine = true;
    } else {
      if (allowNextLine == null) {
        allowNextLine = true;
      }
    }
    if (from != null) {
      from = Point.fromObject(from);
    }
    switch (direction) {
      case 'forward':
        if (scanRange == null) {
          scanRange = new Range(from, getVimEofBufferPosition(editor));
        }
        scanFunction = 'scanInBufferRange';
        break;
      case 'backward':
        if (scanRange == null) {
          scanRange = new Range([0, 0], from);
        }
        scanFunction = 'backwardsScanInBufferRange';
    }
    return editor[scanFunction](pattern, scanRange, function(event) {
      if (!allowNextLine && event.range.start.row !== from.row) {
        event.stop();
        return;
      }
      return fn(event);
    });
  };

  adjustIndentWithKeepingLayout = function(editor, range) {
    var actualLevel, deltaToSuggestedLevel, j, k, len, minLevel, newLevel, ref1, ref2, ref3, results1, row, rowAndActualLevels, suggestedLevel;
    suggestedLevel = editor.suggestedIndentForBufferRow(range.start.row);
    minLevel = null;
    rowAndActualLevels = [];
    for (row = j = ref1 = range.start.row, ref2 = range.end.row; ref1 <= ref2 ? j < ref2 : j > ref2; row = ref1 <= ref2 ? ++j : --j) {
      actualLevel = getIndentLevelForBufferRow(editor, row);
      rowAndActualLevels.push([row, actualLevel]);
      if (!isEmptyRow(editor, row)) {
        minLevel = Math.min(minLevel != null ? minLevel : 2e308, actualLevel);
      }
    }
    if ((minLevel != null) && (deltaToSuggestedLevel = suggestedLevel - minLevel)) {
      results1 = [];
      for (k = 0, len = rowAndActualLevels.length; k < len; k++) {
        ref3 = rowAndActualLevels[k], row = ref3[0], actualLevel = ref3[1];
        newLevel = actualLevel + deltaToSuggestedLevel;
        results1.push(editor.setIndentationForBufferRow(row, newLevel));
      }
      return results1;
    }
  };

  rangeContainsPointWithEndExclusive = function(range, point) {
    return range.start.isLessThanOrEqual(point) && range.end.isGreaterThan(point);
  };

  traverseTextFromPoint = function(point, text) {
    return point.traverse(getTraversalForText(text));
  };

  getTraversalForText = function(text) {
    var char, column, j, len, row;
    row = 0;
    column = 0;
    for (j = 0, len = text.length; j < len; j++) {
      char = text[j];
      if (char === "\n") {
        row++;
        column = 0;
      } else {
        column++;
      }
    }
    return [row, column];
  };

  module.exports = {
    assertWithException: assertWithException,
    getAncestors: getAncestors,
    getKeyBindingForCommand: getKeyBindingForCommand,
    include: include,
    debug: debug,
    saveEditorState: saveEditorState,
    isLinewiseRange: isLinewiseRange,
    haveSomeNonEmptySelection: haveSomeNonEmptySelection,
    sortRanges: sortRanges,
    getIndex: getIndex,
    getVisibleBufferRange: getVisibleBufferRange,
    getVisibleEditors: getVisibleEditors,
    pointIsAtEndOfLine: pointIsAtEndOfLine,
    pointIsOnWhiteSpace: pointIsOnWhiteSpace,
    pointIsAtEndOfLineAtNonEmptyRow: pointIsAtEndOfLineAtNonEmptyRow,
    pointIsAtVimEndOfFile: pointIsAtVimEndOfFile,
    getVimEofBufferPosition: getVimEofBufferPosition,
    getVimEofScreenPosition: getVimEofScreenPosition,
    getVimLastBufferRow: getVimLastBufferRow,
    getVimLastScreenRow: getVimLastScreenRow,
    setBufferRow: setBufferRow,
    setBufferColumn: setBufferColumn,
    moveCursorLeft: moveCursorLeft,
    moveCursorRight: moveCursorRight,
    moveCursorUpScreen: moveCursorUpScreen,
    moveCursorDownScreen: moveCursorDownScreen,
    getEndOfLineForBufferRow: getEndOfLineForBufferRow,
    getFirstVisibleScreenRow: getFirstVisibleScreenRow,
    getLastVisibleScreenRow: getLastVisibleScreenRow,
    getValidVimBufferRow: getValidVimBufferRow,
    getValidVimScreenRow: getValidVimScreenRow,
    moveCursorToFirstCharacterAtRow: moveCursorToFirstCharacterAtRow,
    getLineTextToBufferPosition: getLineTextToBufferPosition,
    getIndentLevelForBufferRow: getIndentLevelForBufferRow,
    getTextInScreenRange: getTextInScreenRange,
    moveCursorToNextNonWhitespace: moveCursorToNextNonWhitespace,
    isEmptyRow: isEmptyRow,
    getCodeFoldRowRanges: getCodeFoldRowRanges,
    getCodeFoldRowRangesContainesForRow: getCodeFoldRowRangesContainesForRow,
    getBufferRangeForRowRange: getBufferRangeForRowRange,
    trimRange: trimRange,
    getFirstCharacterPositionForBufferRow: getFirstCharacterPositionForBufferRow,
    isIncludeFunctionScopeForRow: isIncludeFunctionScopeForRow,
    detectScopeStartPositionForScope: detectScopeStartPositionForScope,
    getBufferRows: getBufferRows,
    smartScrollToBufferPosition: smartScrollToBufferPosition,
    matchScopes: matchScopes,
    moveCursorDownBuffer: moveCursorDownBuffer,
    moveCursorUpBuffer: moveCursorUpBuffer,
    isSingleLineText: isSingleLineText,
    getWordBufferRangeAtBufferPosition: getWordBufferRangeAtBufferPosition,
    getWordBufferRangeAndKindAtBufferPosition: getWordBufferRangeAndKindAtBufferPosition,
    getWordPatternAtBufferPosition: getWordPatternAtBufferPosition,
    getSubwordPatternAtBufferPosition: getSubwordPatternAtBufferPosition,
    getNonWordCharactersForCursor: getNonWordCharactersForCursor,
    shrinkRangeEndToBeforeNewLine: shrinkRangeEndToBeforeNewLine,
    scanEditor: scanEditor,
    collectRangeInBufferRow: collectRangeInBufferRow,
    findRangeInBufferRow: findRangeInBufferRow,
    getLargestFoldRangeContainsBufferRow: getLargestFoldRangeContainsBufferRow,
    translatePointAndClip: translatePointAndClip,
    getRangeByTranslatePointAndClip: getRangeByTranslatePointAndClip,
    getPackage: getPackage,
    searchByProjectFind: searchByProjectFind,
    limitNumber: limitNumber,
    findRangeContainsPoint: findRangeContainsPoint,
    isEmpty: isEmpty,
    isNotEmpty: isNotEmpty,
    isSingleLineRange: isSingleLineRange,
    isNotSingleLineRange: isNotSingleLineRange,
    insertTextAtBufferPosition: insertTextAtBufferPosition,
    ensureEndsWithNewLineForBufferRow: ensureEndsWithNewLineForBufferRow,
    isLeadingWhiteSpaceRange: isLeadingWhiteSpaceRange,
    isNotLeadingWhiteSpaceRange: isNotLeadingWhiteSpaceRange,
    isEscapedCharRange: isEscapedCharRange,
    forEachPaneAxis: forEachPaneAxis,
    addClassList: addClassList,
    removeClassList: removeClassList,
    toggleClassList: toggleClassList,
    toggleCaseForCharacter: toggleCaseForCharacter,
    splitTextByNewLine: splitTextByNewLine,
    replaceDecorationClassBy: replaceDecorationClassBy,
    humanizeBufferRange: humanizeBufferRange,
    expandRangeToWhiteSpaces: expandRangeToWhiteSpaces,
    splitAndJoinBy: splitAndJoinBy,
    splitArguments: splitArguments,
    scanEditorInDirection: scanEditorInDirection,
    adjustIndentWithKeepingLayout: adjustIndentWithKeepingLayout,
    rangeContainsPointWithEndExclusive: rangeContainsPointWithEndExclusive,
    traverseTextFromPoint: traverseTextFromPoint
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMvbGliL3V0aWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsODZFQUFBO0lBQUE7OztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0VBRVgsTUFBNkIsT0FBQSxDQUFRLE1BQVIsQ0FBN0IsRUFBQywyQkFBRCxFQUFhLGlCQUFiLEVBQW9COztFQUNwQixDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUVKLG1CQUFBLEdBQXNCLFNBQUMsU0FBRCxFQUFZLE9BQVosRUFBcUIsRUFBckI7V0FDcEIsSUFBSSxDQUFDLE1BQUwsQ0FBWSxTQUFaLEVBQXVCLE9BQXZCLEVBQWdDLFNBQUMsS0FBRDtBQUM5QixZQUFVLElBQUEsS0FBQSxDQUFNLEtBQUssQ0FBQyxPQUFaO0lBRG9CLENBQWhDO0VBRG9COztFQUl0QixZQUFBLEdBQWUsU0FBQyxHQUFEO0FBQ2IsUUFBQTtJQUFBLFNBQUEsR0FBWTtJQUNaLE9BQUEsR0FBVTtBQUNWLFdBQUEsSUFBQTtNQUNFLFNBQVMsQ0FBQyxJQUFWLENBQWUsT0FBZjtNQUNBLE9BQUEsNENBQTJCLENBQUU7TUFDN0IsSUFBQSxDQUFhLE9BQWI7QUFBQSxjQUFBOztJQUhGO1dBSUE7RUFQYTs7RUFTZix1QkFBQSxHQUEwQixTQUFDLE9BQUQsRUFBVSxHQUFWO0FBQ3hCLFFBQUE7SUFEbUMsY0FBRDtJQUNsQyxPQUFBLEdBQVU7SUFDVixPQUFBLEdBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQUE7SUFDVixJQUFHLG1CQUFIO01BQ0UsVUFBQSxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsV0FBL0IsQ0FBMkMsQ0FBQyxjQUE1QyxDQUFBLENBQTRELENB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O0lBMEVmLDZCQUFBLDJCQTFFZTtJQTJFZixvQkFBQSxrQkEzRWU7SUE2RWYsaUJBQUEsZUE3RWU7SUE4RWYsY0FBQSxZQTlFZTtJQStFZixpQkFBQSxlQS9FZTtJQWdGZixpQkFBQSxlQWhGZTtJQWlGZix3QkFBQSxzQkFqRmU7SUFrRmYsb0JBQUEsa0JBbEZlO0lBbUZmLDBCQUFBLHdCQW5GZTtJQW9GZixxQkFBQSxtQkFwRmU7SUFxRmYsMEJBQUEsd0JBckZlO0lBc0ZmLGdCQUFBLGNBdEZlO0lBdUZmLGdCQUFBLGNBdkZlO0lBd0ZmLHVCQUFBLHFCQXhGZTtJQXlGZiwrQkFBQSw2QkF6RmU7SUEwRmYsb0NBQUEsa0NBMUZlO0lBMkZmLHVCQUFBLHFCQTNGZTs7QUE5NkJqQiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMtcGx1cydcbnNldHRpbmdzID0gcmVxdWlyZSAnLi9zZXR0aW5ncydcblxue0Rpc3Bvc2FibGUsIFJhbmdlLCBQb2ludH0gPSByZXF1aXJlICdhdG9tJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcblxuYXNzZXJ0V2l0aEV4Y2VwdGlvbiA9IChjb25kaXRpb24sIG1lc3NhZ2UsIGZuKSAtPlxuICBhdG9tLmFzc2VydCBjb25kaXRpb24sIG1lc3NhZ2UsIChlcnJvcikgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSlcblxuZ2V0QW5jZXN0b3JzID0gKG9iaikgLT5cbiAgYW5jZXN0b3JzID0gW11cbiAgY3VycmVudCA9IG9ialxuICBsb29wXG4gICAgYW5jZXN0b3JzLnB1c2goY3VycmVudClcbiAgICBjdXJyZW50ID0gY3VycmVudC5fX3N1cGVyX18/LmNvbnN0cnVjdG9yXG4gICAgYnJlYWsgdW5sZXNzIGN1cnJlbnRcbiAgYW5jZXN0b3JzXG5cbmdldEtleUJpbmRpbmdGb3JDb21tYW5kID0gKGNvbW1hbmQsIHtwYWNrYWdlTmFtZX0pIC0+XG4gIHJlc3VsdHMgPSBudWxsXG4gIGtleW1hcHMgPSBhdG9tLmtleW1hcHMuZ2V0S2V5QmluZGluZ3MoKVxuICBpZiBwYWNrYWdlTmFtZT9cbiAgICBrZXltYXBQYXRoID0gYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKHBhY2thZ2VOYW1lKS5nZXRLZXltYXBQYXRocygpLnBvcCgpXG4gICAga2V5bWFwcyA9IGtleW1hcHMuZmlsdGVyKCh7c291cmNlfSkgLT4gc291cmNlIGlzIGtleW1hcFBhdGgpXG5cbiAgZm9yIGtleW1hcCBpbiBrZXltYXBzIHdoZW4ga2V5bWFwLmNvbW1hbmQgaXMgY29tbWFuZFxuICAgIHtrZXlzdHJva2VzLCBzZWxlY3Rvcn0gPSBrZXltYXBcbiAgICBrZXlzdHJva2VzID0ga2V5c3Ryb2tlcy5yZXBsYWNlKC9zaGlmdC0vLCAnJylcbiAgICAocmVzdWx0cyA/PSBbXSkucHVzaCh7a2V5c3Ryb2tlcywgc2VsZWN0b3J9KVxuICByZXN1bHRzXG5cbiMgSW5jbHVkZSBtb2R1bGUob2JqZWN0IHdoaWNoIG5vcm1hbHkgcHJvdmlkZXMgc2V0IG9mIG1ldGhvZHMpIHRvIGtsYXNzXG5pbmNsdWRlID0gKGtsYXNzLCBtb2R1bGUpIC0+XG4gIGZvciBrZXksIHZhbHVlIG9mIG1vZHVsZVxuICAgIGtsYXNzOjpba2V5XSA9IHZhbHVlXG5cbmRlYnVnID0gKG1lc3NhZ2VzLi4uKSAtPlxuICByZXR1cm4gdW5sZXNzIHNldHRpbmdzLmdldCgnZGVidWcnKVxuICBzd2l0Y2ggc2V0dGluZ3MuZ2V0KCdkZWJ1Z091dHB1dCcpXG4gICAgd2hlbiAnY29uc29sZSdcbiAgICAgIGNvbnNvbGUubG9nIG1lc3NhZ2VzLi4uXG4gICAgd2hlbiAnZmlsZSdcbiAgICAgIGZpbGVQYXRoID0gZnMubm9ybWFsaXplIHNldHRpbmdzLmdldCgnZGVidWdPdXRwdXRGaWxlUGF0aCcpXG4gICAgICBpZiBmcy5leGlzdHNTeW5jKGZpbGVQYXRoKVxuICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyBmaWxlUGF0aCwgbWVzc2FnZXMgKyBcIlxcblwiXG5cbiMgUmV0dXJuIGZ1bmN0aW9uIHRvIHJlc3RvcmUgZWRpdG9yJ3Mgc2Nyb2xsVG9wIGFuZCBmb2xkIHN0YXRlLlxuc2F2ZUVkaXRvclN0YXRlID0gKGVkaXRvcikgLT5cbiAgZWRpdG9yRWxlbWVudCA9IGVkaXRvci5lbGVtZW50XG4gIHNjcm9sbFRvcCA9IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKClcblxuICBmb2xkU3RhcnRSb3dzID0gZWRpdG9yLmRpc3BsYXlMYXllci5mb2xkc01hcmtlckxheWVyLmZpbmRNYXJrZXJzKHt9KS5tYXAgKG0pIC0+IG0uZ2V0U3RhcnRQb3NpdGlvbigpLnJvd1xuICAtPlxuICAgIGZvciByb3cgaW4gZm9sZFN0YXJ0Um93cy5yZXZlcnNlKCkgd2hlbiBub3QgZWRpdG9yLmlzRm9sZGVkQXRCdWZmZXJSb3cocm93KVxuICAgICAgZWRpdG9yLmZvbGRCdWZmZXJSb3cocm93KVxuICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcClcblxuaXNMaW5ld2lzZVJhbmdlID0gKHtzdGFydCwgZW5kfSkgLT5cbiAgKHN0YXJ0LnJvdyBpc250IGVuZC5yb3cpIGFuZCAoc3RhcnQuY29sdW1uIGlzIGVuZC5jb2x1bW4gaXMgMClcblxuaXNFbmRzV2l0aE5ld0xpbmVGb3JCdWZmZXJSb3cgPSAoZWRpdG9yLCByb3cpIC0+XG4gIHtzdGFydCwgZW5kfSA9IGVkaXRvci5idWZmZXJSYW5nZUZvckJ1ZmZlclJvdyhyb3csIGluY2x1ZGVOZXdsaW5lOiB0cnVlKVxuICBzdGFydC5yb3cgaXNudCBlbmQucm93XG5cbmhhdmVTb21lTm9uRW1wdHlTZWxlY3Rpb24gPSAoZWRpdG9yKSAtPlxuICBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpLnNvbWUoaXNOb3RFbXB0eSlcblxuc29ydFJhbmdlcyA9IChjb2xsZWN0aW9uKSAtPlxuICBjb2xsZWN0aW9uLnNvcnQgKGEsIGIpIC0+IGEuY29tcGFyZShiKVxuXG4jIFJldHVybiBhZGp1c3RlZCBpbmRleCBmaXQgd2hpdGluIGdpdmVuIGxpc3QncyBsZW5ndGhcbiMgcmV0dXJuIC0xIGlmIGxpc3QgaXMgZW1wdHkuXG5nZXRJbmRleCA9IChpbmRleCwgbGlzdCkgLT5cbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGhcbiAgaWYgbGVuZ3RoIGlzIDBcbiAgICAtMVxuICBlbHNlXG4gICAgaW5kZXggPSBpbmRleCAlIGxlbmd0aFxuICAgIGlmIGluZGV4ID49IDBcbiAgICAgIGluZGV4XG4gICAgZWxzZVxuICAgICAgbGVuZ3RoICsgaW5kZXhcblxuIyBOT1RFOiBlbmRSb3cgYmVjb21lIHVuZGVmaW5lZCBpZiBAZWRpdG9yRWxlbWVudCBpcyBub3QgeWV0IGF0dGFjaGVkLlxuIyBlLmcuIEJlZ2luZyBjYWxsZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgb3BlbiBmaWxlLlxuZ2V0VmlzaWJsZUJ1ZmZlclJhbmdlID0gKGVkaXRvcikgLT5cbiAgW3N0YXJ0Um93LCBlbmRSb3ddID0gZWRpdG9yLmVsZW1lbnQuZ2V0VmlzaWJsZVJvd1JhbmdlKClcbiAgcmV0dXJuIG51bGwgdW5sZXNzIChzdGFydFJvdz8gYW5kIGVuZFJvdz8pXG4gIHN0YXJ0Um93ID0gZWRpdG9yLmJ1ZmZlclJvd0ZvclNjcmVlblJvdyhzdGFydFJvdylcbiAgZW5kUm93ID0gZWRpdG9yLmJ1ZmZlclJvd0ZvclNjcmVlblJvdyhlbmRSb3cpXG4gIG5ldyBSYW5nZShbc3RhcnRSb3csIDBdLCBbZW5kUm93LCBJbmZpbml0eV0pXG5cbmdldFZpc2libGVFZGl0b3JzID0gLT5cbiAgKGVkaXRvciBmb3IgcGFuZSBpbiBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpIHdoZW4gZWRpdG9yID0gcGFuZS5nZXRBY3RpdmVFZGl0b3IoKSlcblxuZ2V0RW5kT2ZMaW5lRm9yQnVmZmVyUm93ID0gKGVkaXRvciwgcm93KSAtPlxuICBlZGl0b3IuYnVmZmVyUmFuZ2VGb3JCdWZmZXJSb3cocm93KS5lbmRcblxuIyBQb2ludCB1dGlsXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBvaW50SXNBdEVuZE9mTGluZSA9IChlZGl0b3IsIHBvaW50KSAtPlxuICBwb2ludCA9IFBvaW50LmZyb21PYmplY3QocG9pbnQpXG4gIGdldEVuZE9mTGluZUZvckJ1ZmZlclJvdyhlZGl0b3IsIHBvaW50LnJvdykuaXNFcXVhbChwb2ludClcblxucG9pbnRJc09uV2hpdGVTcGFjZSA9IChlZGl0b3IsIHBvaW50KSAtPlxuICBjaGFyID0gZ2V0UmlnaHRDaGFyYWN0ZXJGb3JCdWZmZXJQb3NpdGlvbihlZGl0b3IsIHBvaW50KVxuICBub3QgL1xcUy8udGVzdChjaGFyKVxuXG5wb2ludElzQXRFbmRPZkxpbmVBdE5vbkVtcHR5Um93ID0gKGVkaXRvciwgcG9pbnQpIC0+XG4gIHBvaW50ID0gUG9pbnQuZnJvbU9iamVjdChwb2ludClcbiAgcG9pbnQuY29sdW1uIGlzbnQgMCBhbmQgcG9pbnRJc0F0RW5kT2ZMaW5lKGVkaXRvciwgcG9pbnQpXG5cbnBvaW50SXNBdFZpbUVuZE9mRmlsZSA9IChlZGl0b3IsIHBvaW50KSAtPlxuICBnZXRWaW1Fb2ZCdWZmZXJQb3NpdGlvbihlZGl0b3IpLmlzRXF1YWwocG9pbnQpXG5cbmlzRW1wdHlSb3cgPSAoZWRpdG9yLCByb3cpIC0+XG4gIGVkaXRvci5idWZmZXJSYW5nZUZvckJ1ZmZlclJvdyhyb3cpLmlzRW1wdHkoKVxuXG5nZXRSaWdodENoYXJhY3RlckZvckJ1ZmZlclBvc2l0aW9uID0gKGVkaXRvciwgcG9pbnQsIGFtb3VudD0xKSAtPlxuICBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoUmFuZ2UuZnJvbVBvaW50V2l0aERlbHRhKHBvaW50LCAwLCBhbW91bnQpKVxuXG5nZXRMZWZ0Q2hhcmFjdGVyRm9yQnVmZmVyUG9zaXRpb24gPSAoZWRpdG9yLCBwb2ludCwgYW1vdW50PTEpIC0+XG4gIGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShSYW5nZS5mcm9tUG9pbnRXaXRoRGVsdGEocG9pbnQsIDAsIC1hbW91bnQpKVxuXG5nZXRUZXh0SW5TY3JlZW5SYW5nZSA9IChlZGl0b3IsIHNjcmVlblJhbmdlKSAtPlxuICBidWZmZXJSYW5nZSA9IGVkaXRvci5idWZmZXJSYW5nZUZvclNjcmVlblJhbmdlKHNjcmVlblJhbmdlKVxuICBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoYnVmZmVyUmFuZ2UpXG5cbmdldE5vbldvcmRDaGFyYWN0ZXJzRm9yQ3Vyc29yID0gKGN1cnNvcikgLT5cbiAgIyBBdG9tIDEuMTEuMC1iZXRhNSBoYXZlIHRoaXMgZXhwZXJpbWVudGFsIG1ldGhvZC5cbiAgaWYgY3Vyc29yLmdldE5vbldvcmRDaGFyYWN0ZXJzP1xuICAgIGN1cnNvci5nZXROb25Xb3JkQ2hhcmFjdGVycygpXG4gIGVsc2VcbiAgICBzY29wZSA9IGN1cnNvci5nZXRTY29wZURlc2NyaXB0b3IoKS5nZXRTY29wZXNBcnJheSgpXG4gICAgYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Iubm9uV29yZENoYXJhY3RlcnMnLCB7c2NvcGV9KVxuXG4jIEZJWE1FOiByZW1vdmUgdGhpc1xuIyByZXR1cm4gdHJ1ZSBpZiBtb3ZlZFxubW92ZUN1cnNvclRvTmV4dE5vbldoaXRlc3BhY2UgPSAoY3Vyc29yKSAtPlxuICBvcmlnaW5hbFBvaW50ID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgZWRpdG9yID0gY3Vyc29yLmVkaXRvclxuICB2aW1Fb2YgPSBnZXRWaW1Fb2ZCdWZmZXJQb3NpdGlvbihlZGl0b3IpXG5cbiAgd2hpbGUgcG9pbnRJc09uV2hpdGVTcGFjZShlZGl0b3IsIHBvaW50ID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkpIGFuZCBub3QgcG9pbnQuaXNHcmVhdGVyVGhhbk9yRXF1YWwodmltRW9mKVxuICAgIGN1cnNvci5tb3ZlUmlnaHQoKVxuICBub3Qgb3JpZ2luYWxQb2ludC5pc0VxdWFsKGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpKVxuXG5nZXRCdWZmZXJSb3dzID0gKGVkaXRvciwge3N0YXJ0Um93LCBkaXJlY3Rpb259KSAtPlxuICBzd2l0Y2ggZGlyZWN0aW9uXG4gICAgd2hlbiAncHJldmlvdXMnXG4gICAgICBpZiBzdGFydFJvdyA8PSAwXG4gICAgICAgIFtdXG4gICAgICBlbHNlXG4gICAgICAgIFsoc3RhcnRSb3cgLSAxKS4uMF1cbiAgICB3aGVuICduZXh0J1xuICAgICAgZW5kUm93ID0gZ2V0VmltTGFzdEJ1ZmZlclJvdyhlZGl0b3IpXG4gICAgICBpZiBzdGFydFJvdyA+PSBlbmRSb3dcbiAgICAgICAgW11cbiAgICAgIGVsc2VcbiAgICAgICAgWyhzdGFydFJvdyArIDEpLi5lbmRSb3ddXG5cbiMgUmV0dXJuIFZpbSdzIEVPRiBwb3NpdGlvbiByYXRoZXIgdGhhbiBBdG9tJ3MgRU9GIHBvc2l0aW9uLlxuIyBUaGlzIGZ1bmN0aW9uIGNoYW5nZSBtZWFuaW5nIG9mIEVPRiBmcm9tIG5hdGl2ZSBUZXh0RWRpdG9yOjpnZXRFb2ZCdWZmZXJQb3NpdGlvbigpXG4jIEF0b20gaXMgc3BlY2lhbChzdHJhbmdlKSBmb3IgY3Vyc29yIGNhbiBwYXN0IHZlcnkgbGFzdCBuZXdsaW5lIGNoYXJhY3Rlci5cbiMgQmVjYXVzZSBvZiB0aGlzLCBBdG9tJ3MgRU9GIHBvc2l0aW9uIGlzIFthY3R1YWxMYXN0Um93KzEsIDBdIHByb3ZpZGVkIGxhc3Qtbm9uLWJsYW5rLXJvd1xuIyBlbmRzIHdpdGggbmV3bGluZSBjaGFyLlxuIyBCdXQgaW4gVmltLCBjdXJvciBjYW4gTk9UIHBhc3QgbGFzdCBuZXdsaW5lLiBFT0YgaXMgbmV4dCBwb3NpdGlvbiBvZiB2ZXJ5IGxhc3QgY2hhcmFjdGVyLlxuZ2V0VmltRW9mQnVmZmVyUG9zaXRpb24gPSAoZWRpdG9yKSAtPlxuICBlb2YgPSBlZGl0b3IuZ2V0RW9mQnVmZmVyUG9zaXRpb24oKVxuICBpZiAoZW9mLnJvdyBpcyAwKSBvciAoZW9mLmNvbHVtbiA+IDApXG4gICAgZW9mXG4gIGVsc2VcbiAgICBnZXRFbmRPZkxpbmVGb3JCdWZmZXJSb3coZWRpdG9yLCBlb2Yucm93IC0gMSlcblxuZ2V0VmltRW9mU2NyZWVuUG9zaXRpb24gPSAoZWRpdG9yKSAtPlxuICBlZGl0b3Iuc2NyZWVuUG9zaXRpb25Gb3JCdWZmZXJQb3NpdGlvbihnZXRWaW1Fb2ZCdWZmZXJQb3NpdGlvbihlZGl0b3IpKVxuXG5nZXRWaW1MYXN0QnVmZmVyUm93ID0gKGVkaXRvcikgLT4gZ2V0VmltRW9mQnVmZmVyUG9zaXRpb24oZWRpdG9yKS5yb3dcbmdldFZpbUxhc3RTY3JlZW5Sb3cgPSAoZWRpdG9yKSAtPiBnZXRWaW1Fb2ZTY3JlZW5Qb3NpdGlvbihlZGl0b3IpLnJvd1xuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93ID0gKGVkaXRvcikgLT4gZWRpdG9yLmVsZW1lbnQuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KClcbmdldExhc3RWaXNpYmxlU2NyZWVuUm93ID0gKGVkaXRvcikgLT4gZWRpdG9yLmVsZW1lbnQuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKVxuXG5nZXRGaXJzdENoYXJhY3RlclBvc2l0aW9uRm9yQnVmZmVyUm93ID0gKGVkaXRvciwgcm93KSAtPlxuICByYW5nZSA9IGZpbmRSYW5nZUluQnVmZmVyUm93KGVkaXRvciwgL1xcUy8sIHJvdylcbiAgcmFuZ2U/LnN0YXJ0ID8gbmV3IFBvaW50KHJvdywgMClcblxudHJpbVJhbmdlID0gKGVkaXRvciwgc2NhblJhbmdlKSAtPlxuICBwYXR0ZXJuID0gL1xcUy9cbiAgW3N0YXJ0LCBlbmRdID0gW11cbiAgc2V0U3RhcnQgPSAoe3JhbmdlfSkgLT4ge3N0YXJ0fSA9IHJhbmdlXG4gIHNldEVuZCA9ICh7cmFuZ2V9KSAtPiB7ZW5kfSA9IHJhbmdlXG4gIGVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZShwYXR0ZXJuLCBzY2FuUmFuZ2UsIHNldFN0YXJ0KVxuICBlZGl0b3IuYmFja3dhcmRzU2NhbkluQnVmZmVyUmFuZ2UocGF0dGVybiwgc2NhblJhbmdlLCBzZXRFbmQpIGlmIHN0YXJ0P1xuICBpZiBzdGFydD8gYW5kIGVuZD9cbiAgICBuZXcgUmFuZ2Uoc3RhcnQsIGVuZClcbiAgZWxzZVxuICAgIHNjYW5SYW5nZVxuXG4jIEN1cnNvciBtb3Rpb24gd3JhcHBlclxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEp1c3QgdXBkYXRlIGJ1ZmZlclJvdyB3aXRoIGtlZXBpbmcgY29sdW1uIGJ5IHJlc3BlY3RpbmcgZ29hbENvbHVtblxuc2V0QnVmZmVyUm93ID0gKGN1cnNvciwgcm93LCBvcHRpb25zKSAtPlxuICBjb2x1bW4gPSBjdXJzb3IuZ29hbENvbHVtbiA/IGN1cnNvci5nZXRCdWZmZXJDb2x1bW4oKVxuICBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24oW3JvdywgY29sdW1uXSwgb3B0aW9ucylcbiAgY3Vyc29yLmdvYWxDb2x1bW4gPSBjb2x1bW5cblxuc2V0QnVmZmVyQ29sdW1uID0gKGN1cnNvciwgY29sdW1uKSAtPlxuICBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24oW2N1cnNvci5nZXRCdWZmZXJSb3coKSwgY29sdW1uXSlcblxubW92ZUN1cnNvciA9IChjdXJzb3IsIHtwcmVzZXJ2ZUdvYWxDb2x1bW59LCBmbikgLT5cbiAge2dvYWxDb2x1bW59ID0gY3Vyc29yXG4gIGZuKGN1cnNvcilcbiAgaWYgcHJlc2VydmVHb2FsQ29sdW1uIGFuZCBnb2FsQ29sdW1uP1xuICAgIGN1cnNvci5nb2FsQ29sdW1uID0gZ29hbENvbHVtblxuXG4jIFdvcmthcm91bmQgaXNzdWUgZm9yIHQ5bWQvdmltLW1vZGUtcGx1cyMyMjYgYW5kIGF0b20vYXRvbSMzMTc0XG4jIEkgY2Fubm90IGRlcGVuZCBjdXJzb3IncyBjb2x1bW4gc2luY2UgaXRzIGNsYWltIDAgYW5kIGNsaXBwaW5nIGVtbXVsYXRpb24gZG9uJ3RcbiMgcmV0dXJuIHdyYXBwZWQgbGluZSwgYnV0IEl0IGFjdHVhbGx5IHdyYXAsIHNvIEkgbmVlZCB0byBkbyB2ZXJ5IGRpcnR5IHdvcmsgdG9cbiMgcHJlZGljdCB3cmFwIGh1cmlzdGljYWxseS5cbnNob3VsZFByZXZlbnRXcmFwTGluZSA9IChjdXJzb3IpIC0+XG4gIHtyb3csIGNvbHVtbn0gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5zb2Z0VGFicycpXG4gICAgdGFiTGVuZ3RoID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3IudGFiTGVuZ3RoJylcbiAgICBpZiAwIDwgY29sdW1uIDwgdGFiTGVuZ3RoXG4gICAgICB0ZXh0ID0gY3Vyc29yLmVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbW3JvdywgMF0sIFtyb3csIHRhYkxlbmd0aF1dKVxuICAgICAgL15cXHMrJC8udGVzdCh0ZXh0KVxuICAgIGVsc2VcbiAgICAgIGZhbHNlXG5cbiMgb3B0aW9uczpcbiMgICBhbGxvd1dyYXA6IHRvIGNvbnRyb2xsIGFsbG93IHdyYXBcbiMgICBwcmVzZXJ2ZUdvYWxDb2x1bW46IHByZXNlcnZlIG9yaWdpbmFsIGdvYWxDb2x1bW5cbm1vdmVDdXJzb3JMZWZ0ID0gKGN1cnNvciwgb3B0aW9ucz17fSkgLT5cbiAge2FsbG93V3JhcCwgbmVlZFNwZWNpYWxDYXJlVG9QcmV2ZW50V3JhcExpbmV9ID0gb3B0aW9uc1xuICBkZWxldGUgb3B0aW9ucy5hbGxvd1dyYXBcbiAgaWYgbmVlZFNwZWNpYWxDYXJlVG9QcmV2ZW50V3JhcExpbmVcbiAgICByZXR1cm4gaWYgc2hvdWxkUHJldmVudFdyYXBMaW5lKGN1cnNvcilcblxuICBpZiBub3QgY3Vyc29yLmlzQXRCZWdpbm5pbmdPZkxpbmUoKSBvciBhbGxvd1dyYXBcbiAgICBtb3Rpb24gPSAoY3Vyc29yKSAtPiBjdXJzb3IubW92ZUxlZnQoKVxuICAgIG1vdmVDdXJzb3IoY3Vyc29yLCBvcHRpb25zLCBtb3Rpb24pXG5cbm1vdmVDdXJzb3JSaWdodCA9IChjdXJzb3IsIG9wdGlvbnM9e30pIC0+XG4gIHthbGxvd1dyYXB9ID0gb3B0aW9uc1xuICBkZWxldGUgb3B0aW9ucy5hbGxvd1dyYXBcbiAgaWYgbm90IGN1cnNvci5pc0F0RW5kT2ZMaW5lKCkgb3IgYWxsb3dXcmFwXG4gICAgbW90aW9uID0gKGN1cnNvcikgLT4gY3Vyc29yLm1vdmVSaWdodCgpXG4gICAgbW92ZUN1cnNvcihjdXJzb3IsIG9wdGlvbnMsIG1vdGlvbilcblxubW92ZUN1cnNvclVwU2NyZWVuID0gKGN1cnNvciwgb3B0aW9ucz17fSkgLT5cbiAgdW5sZXNzIGN1cnNvci5nZXRTY3JlZW5Sb3coKSBpcyAwXG4gICAgbW90aW9uID0gKGN1cnNvcikgLT4gY3Vyc29yLm1vdmVVcCgpXG4gICAgbW92ZUN1cnNvcihjdXJzb3IsIG9wdGlvbnMsIG1vdGlvbilcblxubW92ZUN1cnNvckRvd25TY3JlZW4gPSAoY3Vyc29yLCBvcHRpb25zPXt9KSAtPlxuICB1bmxlc3MgZ2V0VmltTGFzdFNjcmVlblJvdyhjdXJzb3IuZWRpdG9yKSBpcyBjdXJzb3IuZ2V0U2NyZWVuUm93KClcbiAgICBtb3Rpb24gPSAoY3Vyc29yKSAtPiBjdXJzb3IubW92ZURvd24oKVxuICAgIG1vdmVDdXJzb3IoY3Vyc29yLCBvcHRpb25zLCBtb3Rpb24pXG5cbiMgRklYTUVcbm1vdmVDdXJzb3JEb3duQnVmZmVyID0gKGN1cnNvcikgLT5cbiAgcG9pbnQgPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICB1bmxlc3MgZ2V0VmltTGFzdEJ1ZmZlclJvdyhjdXJzb3IuZWRpdG9yKSBpcyBwb2ludC5yb3dcbiAgICBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24ocG9pbnQudHJhbnNsYXRlKFsrMSwgMF0pKVxuXG4jIEZJWE1FXG5tb3ZlQ3Vyc29yVXBCdWZmZXIgPSAoY3Vyc29yKSAtPlxuICBwb2ludCA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gIHVubGVzcyBwb2ludC5yb3cgaXMgMFxuICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihwb2ludC50cmFuc2xhdGUoWy0xLCAwXSkpXG5cbm1vdmVDdXJzb3JUb0ZpcnN0Q2hhcmFjdGVyQXRSb3cgPSAoY3Vyc29yLCByb3cpIC0+XG4gIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihbcm93LCAwXSlcbiAgY3Vyc29yLm1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lKClcblxuZ2V0VmFsaWRWaW1CdWZmZXJSb3cgPSAoZWRpdG9yLCByb3cpIC0+IGxpbWl0TnVtYmVyKHJvdywgbWluOiAwLCBtYXg6IGdldFZpbUxhc3RCdWZmZXJSb3coZWRpdG9yKSlcblxuZ2V0VmFsaWRWaW1TY3JlZW5Sb3cgPSAoZWRpdG9yLCByb3cpIC0+IGxpbWl0TnVtYmVyKHJvdywgbWluOiAwLCBtYXg6IGdldFZpbUxhc3RTY3JlZW5Sb3coZWRpdG9yKSlcblxuIyBCeSBkZWZhdWx0IG5vdCBpbmNsdWRlIGNvbHVtblxuZ2V0TGluZVRleHRUb0J1ZmZlclBvc2l0aW9uID0gKGVkaXRvciwge3JvdywgY29sdW1ufSwge2V4Y2x1c2l2ZX09e30pIC0+XG4gIGlmIGV4Y2x1c2l2ZSA/IHRydWVcbiAgICBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93KVswLi4uY29sdW1uXVxuICBlbHNlXG4gICAgZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdylbMC4uY29sdW1uXVxuXG5nZXRJbmRlbnRMZXZlbEZvckJ1ZmZlclJvdyA9IChlZGl0b3IsIHJvdykgLT5cbiAgZWRpdG9yLmluZGVudExldmVsRm9yTGluZShlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93KSlcblxuZ2V0Q29kZUZvbGRSb3dSYW5nZXMgPSAoZWRpdG9yKSAtPlxuICBbMC4uZWRpdG9yLmdldExhc3RCdWZmZXJSb3coKV1cbiAgICAubWFwIChyb3cpIC0+XG4gICAgICBlZGl0b3IubGFuZ3VhZ2VNb2RlLnJvd1JhbmdlRm9yQ29kZUZvbGRBdEJ1ZmZlclJvdyhyb3cpXG4gICAgLmZpbHRlciAocm93UmFuZ2UpIC0+XG4gICAgICByb3dSYW5nZT8gYW5kIHJvd1JhbmdlWzBdPyBhbmQgcm93UmFuZ2VbMV0/XG5cbiMgVXNlZCBpbiB2bXAtamFzbWluZS1pbmNyZWFzZS1mb2N1c1xuZ2V0Q29kZUZvbGRSb3dSYW5nZXNDb250YWluZXNGb3JSb3cgPSAoZWRpdG9yLCBidWZmZXJSb3csIHtpbmNsdWRlU3RhcnRSb3d9PXt9KSAtPlxuICBpbmNsdWRlU3RhcnRSb3cgPz0gdHJ1ZVxuICBnZXRDb2RlRm9sZFJvd1JhbmdlcyhlZGl0b3IpLmZpbHRlciAoW3N0YXJ0Um93LCBlbmRSb3ddKSAtPlxuICAgIGlmIGluY2x1ZGVTdGFydFJvd1xuICAgICAgc3RhcnRSb3cgPD0gYnVmZmVyUm93IDw9IGVuZFJvd1xuICAgIGVsc2VcbiAgICAgIHN0YXJ0Um93IDwgYnVmZmVyUm93IDw9IGVuZFJvd1xuXG5nZXRCdWZmZXJSYW5nZUZvclJvd1JhbmdlID0gKGVkaXRvciwgcm93UmFuZ2UpIC0+XG4gIFtzdGFydFJhbmdlLCBlbmRSYW5nZV0gPSByb3dSYW5nZS5tYXAgKHJvdykgLT5cbiAgICBlZGl0b3IuYnVmZmVyUmFuZ2VGb3JCdWZmZXJSb3cocm93LCBpbmNsdWRlTmV3bGluZTogdHJ1ZSlcbiAgc3RhcnRSYW5nZS51bmlvbihlbmRSYW5nZSlcblxuZ2V0VG9rZW5pemVkTGluZUZvclJvdyA9IChlZGl0b3IsIHJvdykgLT5cbiAgZWRpdG9yLnRva2VuaXplZEJ1ZmZlci50b2tlbml6ZWRMaW5lRm9yUm93KHJvdylcblxuZ2V0U2NvcGVzRm9yVG9rZW5pemVkTGluZSA9IChsaW5lKSAtPlxuICBmb3IgdGFnIGluIGxpbmUudGFncyB3aGVuIHRhZyA8IDAgYW5kICh0YWcgJSAyIGlzIC0xKVxuICAgIGF0b20uZ3JhbW1hcnMuc2NvcGVGb3JJZCh0YWcpXG5cbnNjYW5Gb3JTY29wZVN0YXJ0ID0gKGVkaXRvciwgZnJvbVBvaW50LCBkaXJlY3Rpb24sIGZuKSAtPlxuICBmcm9tUG9pbnQgPSBQb2ludC5mcm9tT2JqZWN0KGZyb21Qb2ludClcbiAgc2NhblJvd3MgPSBzd2l0Y2ggZGlyZWN0aW9uXG4gICAgd2hlbiAnZm9yd2FyZCcgdGhlbiBbKGZyb21Qb2ludC5yb3cpLi5lZGl0b3IuZ2V0TGFzdEJ1ZmZlclJvdygpXVxuICAgIHdoZW4gJ2JhY2t3YXJkJyB0aGVuIFsoZnJvbVBvaW50LnJvdykuLjBdXG5cbiAgY29udGludWVTY2FuID0gdHJ1ZVxuICBzdG9wID0gLT5cbiAgICBjb250aW51ZVNjYW4gPSBmYWxzZVxuXG4gIGlzVmFsaWRUb2tlbiA9IHN3aXRjaCBkaXJlY3Rpb25cbiAgICB3aGVuICdmb3J3YXJkJyB0aGVuICh7cG9zaXRpb259KSAtPiBwb3NpdGlvbi5pc0dyZWF0ZXJUaGFuKGZyb21Qb2ludClcbiAgICB3aGVuICdiYWNrd2FyZCcgdGhlbiAoe3Bvc2l0aW9ufSkgLT4gcG9zaXRpb24uaXNMZXNzVGhhbihmcm9tUG9pbnQpXG5cbiAgZm9yIHJvdyBpbiBzY2FuUm93cyB3aGVuIHRva2VuaXplZExpbmUgPSBnZXRUb2tlbml6ZWRMaW5lRm9yUm93KGVkaXRvciwgcm93KVxuICAgIGNvbHVtbiA9IDBcbiAgICByZXN1bHRzID0gW11cblxuICAgIHRva2VuSXRlcmF0b3IgPSB0b2tlbml6ZWRMaW5lLmdldFRva2VuSXRlcmF0b3IoKVxuICAgIGZvciB0YWcgaW4gdG9rZW5pemVkTGluZS50YWdzXG4gICAgICB0b2tlbkl0ZXJhdG9yLm5leHQoKVxuICAgICAgaWYgdGFnIDwgMCAjIE5lZ2F0aXZlOiBzdGFydC9zdG9wIHRva2VuXG4gICAgICAgIHNjb3BlID0gYXRvbS5ncmFtbWFycy5zY29wZUZvcklkKHRhZylcbiAgICAgICAgaWYgKHRhZyAlIDIpIGlzIDAgIyBFdmVuOiBzY29wZSBzdG9wXG4gICAgICAgICAgbnVsbFxuICAgICAgICBlbHNlICMgT2RkOiBzY29wZSBzdGFydFxuICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFBvaW50KHJvdywgY29sdW1uKVxuICAgICAgICAgIHJlc3VsdHMucHVzaCB7c2NvcGUsIHBvc2l0aW9uLCBzdG9wfVxuICAgICAgZWxzZVxuICAgICAgICBjb2x1bW4gKz0gdGFnXG5cbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXNWYWxpZFRva2VuKVxuICAgIHJlc3VsdHMucmV2ZXJzZSgpIGlmIGRpcmVjdGlvbiBpcyAnYmFja3dhcmQnXG4gICAgZm9yIHJlc3VsdCBpbiByZXN1bHRzXG4gICAgICBmbihyZXN1bHQpXG4gICAgICByZXR1cm4gdW5sZXNzIGNvbnRpbnVlU2NhblxuICAgIHJldHVybiB1bmxlc3MgY29udGludWVTY2FuXG5cbmRldGVjdFNjb3BlU3RhcnRQb3NpdGlvbkZvclNjb3BlID0gKGVkaXRvciwgZnJvbVBvaW50LCBkaXJlY3Rpb24sIHNjb3BlKSAtPlxuICBwb2ludCA9IG51bGxcbiAgc2NhbkZvclNjb3BlU3RhcnQgZWRpdG9yLCBmcm9tUG9pbnQsIGRpcmVjdGlvbiwgKGluZm8pIC0+XG4gICAgaWYgaW5mby5zY29wZS5zZWFyY2goc2NvcGUpID49IDBcbiAgICAgIGluZm8uc3RvcCgpXG4gICAgICBwb2ludCA9IGluZm8ucG9zaXRpb25cbiAgcG9pbnRcblxuaXNJbmNsdWRlRnVuY3Rpb25TY29wZUZvclJvdyA9IChlZGl0b3IsIHJvdykgLT5cbiAgIyBbRklYTUVdIEJ1ZyBvZiB1cHN0cmVhbT9cbiAgIyBTb21ldGltZSB0b2tlbml6ZWRMaW5lcyBsZW5ndGggaXMgbGVzcyB0aGFuIGxhc3QgYnVmZmVyIHJvdy5cbiAgIyBTbyB0b2tlbml6ZWRMaW5lIGlzIG5vdCBhY2Nlc3NpYmxlIGV2ZW4gaWYgdmFsaWQgcm93LlxuICAjIEluIHRoYXQgY2FzZSBJIHNpbXBseSByZXR1cm4gZW1wdHkgQXJyYXkuXG4gIGlmIHRva2VuaXplZExpbmUgPSBnZXRUb2tlbml6ZWRMaW5lRm9yUm93KGVkaXRvciwgcm93KVxuICAgIGdldFNjb3Blc0ZvclRva2VuaXplZExpbmUodG9rZW5pemVkTGluZSkuc29tZSAoc2NvcGUpIC0+XG4gICAgICBpc0Z1bmN0aW9uU2NvcGUoZWRpdG9yLCBzY29wZSlcbiAgZWxzZVxuICAgIGZhbHNlXG5cbiMgW0ZJWE1FXSB2ZXJ5IHJvdWdoIHN0YXRlLCBuZWVkIGltcHJvdmVtZW50LlxuaXNGdW5jdGlvblNjb3BlID0gKGVkaXRvciwgc2NvcGUpIC0+XG4gIHN3aXRjaCBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZVxuICAgIHdoZW4gJ3NvdXJjZS5nbycsICdzb3VyY2UuZWxpeGlyJ1xuICAgICAgc2NvcGVzID0gWydlbnRpdHkubmFtZS5mdW5jdGlvbiddXG4gICAgd2hlbiAnc291cmNlLnJ1YnknXG4gICAgICBzY29wZXMgPSBbJ21ldGEuZnVuY3Rpb24uJywgJ21ldGEuY2xhc3MuJywgJ21ldGEubW9kdWxlLiddXG4gICAgZWxzZVxuICAgICAgc2NvcGVzID0gWydtZXRhLmZ1bmN0aW9uLicsICdtZXRhLmNsYXNzLiddXG4gIHBhdHRlcm4gPSBuZXcgUmVnRXhwKCdeJyArIHNjb3Blcy5tYXAoXy5lc2NhcGVSZWdFeHApLmpvaW4oJ3wnKSlcbiAgcGF0dGVybi50ZXN0KHNjb3BlKVxuXG4jIFNjcm9sbCB0byBidWZmZXJQb3NpdGlvbiB3aXRoIG1pbmltdW0gYW1vdW50IHRvIGtlZXAgb3JpZ2luYWwgdmlzaWJsZSBhcmVhLlxuIyBJZiB0YXJnZXQgcG9zaXRpb24gd29uJ3QgZml0IHdpdGhpbiBvbmVQYWdlVXAgb3Igb25lUGFnZURvd24sIGl0IGNlbnRlciB0YXJnZXQgcG9pbnQuXG5zbWFydFNjcm9sbFRvQnVmZmVyUG9zaXRpb24gPSAoZWRpdG9yLCBwb2ludCkgLT5cbiAgZWRpdG9yRWxlbWVudCA9IGVkaXRvci5lbGVtZW50XG4gIGVkaXRvckFyZWFIZWlnaHQgPSBlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKCkgKiAoZWRpdG9yLmdldFJvd3NQZXJQYWdlKCkgLSAxKVxuICBvbmVQYWdlVXAgPSBlZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpIC0gZWRpdG9yQXJlYUhlaWdodCAjIE5vIG5lZWQgdG8gbGltaXQgdG8gbWluPTBcbiAgb25lUGFnZURvd24gPSBlZGl0b3JFbGVtZW50LmdldFNjcm9sbEJvdHRvbSgpICsgZWRpdG9yQXJlYUhlaWdodFxuICB0YXJnZXQgPSBlZGl0b3JFbGVtZW50LnBpeGVsUG9zaXRpb25Gb3JCdWZmZXJQb3NpdGlvbihwb2ludCkudG9wXG5cbiAgY2VudGVyID0gKG9uZVBhZ2VEb3duIDwgdGFyZ2V0KSBvciAodGFyZ2V0IDwgb25lUGFnZVVwKVxuICBlZGl0b3Iuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbihwb2ludCwge2NlbnRlcn0pXG5cbm1hdGNoU2NvcGVzID0gKGVkaXRvckVsZW1lbnQsIHNjb3BlcykgLT5cbiAgY2xhc3NlcyA9IHNjb3Blcy5tYXAgKHNjb3BlKSAtPiBzY29wZS5zcGxpdCgnLicpXG5cbiAgZm9yIGNsYXNzTmFtZXMgaW4gY2xhc3Nlc1xuICAgIGNvbnRhaW5zQ291bnQgPSAwXG4gICAgZm9yIGNsYXNzTmFtZSBpbiBjbGFzc05hbWVzXG4gICAgICBjb250YWluc0NvdW50ICs9IDEgaWYgZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKVxuICAgIHJldHVybiB0cnVlIGlmIGNvbnRhaW5zQ291bnQgaXMgY2xhc3NOYW1lcy5sZW5ndGhcbiAgZmFsc2VcblxuaXNTaW5nbGVMaW5lVGV4dCA9ICh0ZXh0KSAtPlxuICB0ZXh0LnNwbGl0KC9cXG58XFxyXFxuLykubGVuZ3RoIGlzIDFcblxuIyBSZXR1cm4gYnVmZmVyUmFuZ2UgYW5kIGtpbmQgWyd3aGl0ZS1zcGFjZScsICdub24td29yZCcsICd3b3JkJ11cbiNcbiMgVGhpcyBmdW5jdGlvbiBtb2RpZnkgd29yZFJlZ2V4IHNvIHRoYXQgaXQgZmVlbCBOQVRVUkFMIGluIFZpbSdzIG5vcm1hbCBtb2RlLlxuIyBJbiBub3JtYWwtbW9kZSwgY3Vyc29yIGlzIHJhY3RhbmdsZShub3QgcGlwZSh8KSBjaGFyKS5cbiMgQ3Vyc29yIGlzIGxpa2UgT04gd29yZCByYXRoZXIgdGhhbiBCRVRXRUVOIHdvcmQuXG4jIFRoZSBtb2RpZmljYXRpb24gaXMgdGFpbG9yZCBsaWtlIHRoaXNcbiMgICAtIE9OIHdoaXRlLXNwYWNlOiBJbmNsdWRzIG9ubHkgd2hpdGUtc3BhY2VzLlxuIyAgIC0gT04gbm9uLXdvcmQ6IEluY2x1ZHMgb25seSBub24gd29yZCBjaGFyKD1leGNsdWRlcyBub3JtYWwgd29yZCBjaGFyKS5cbiNcbiMgVmFsaWQgb3B0aW9uc1xuIyAgLSB3b3JkUmVnZXg6IGluc3RhbmNlIG9mIFJlZ0V4cFxuIyAgLSBub25Xb3JkQ2hhcmFjdGVyczogc3RyaW5nXG5nZXRXb3JkQnVmZmVyUmFuZ2VBbmRLaW5kQXRCdWZmZXJQb3NpdGlvbiA9IChlZGl0b3IsIHBvaW50LCBvcHRpb25zPXt9KSAtPlxuICB7c2luZ2xlTm9uV29yZENoYXIsIHdvcmRSZWdleCwgbm9uV29yZENoYXJhY3RlcnMsIGN1cnNvcn0gPSBvcHRpb25zXG4gIGlmIG5vdCB3b3JkUmVnZXg/IG9yIG5vdCBub25Xb3JkQ2hhcmFjdGVycz8gIyBDb21wbGVtZW50IGZyb20gY3Vyc29yXG4gICAgY3Vyc29yID89IGVkaXRvci5nZXRMYXN0Q3Vyc29yKClcbiAgICB7d29yZFJlZ2V4LCBub25Xb3JkQ2hhcmFjdGVyc30gPSBfLmV4dGVuZChvcHRpb25zLCBidWlsZFdvcmRQYXR0ZXJuQnlDdXJzb3IoY3Vyc29yLCBvcHRpb25zKSlcbiAgc2luZ2xlTm9uV29yZENoYXIgPz0gdHJ1ZVxuXG4gIGNoYXJhY3RlckF0UG9pbnQgPSBnZXRSaWdodENoYXJhY3RlckZvckJ1ZmZlclBvc2l0aW9uKGVkaXRvciwgcG9pbnQpXG4gIG5vbldvcmRSZWdleCA9IG5ldyBSZWdFeHAoXCJbI3tfLmVzY2FwZVJlZ0V4cChub25Xb3JkQ2hhcmFjdGVycyl9XStcIilcblxuICBpZiAvXFxzLy50ZXN0KGNoYXJhY3RlckF0UG9pbnQpXG4gICAgc291cmNlID0gXCJbXFx0IF0rXCJcbiAgICBraW5kID0gJ3doaXRlLXNwYWNlJ1xuICAgIHdvcmRSZWdleCA9IG5ldyBSZWdFeHAoc291cmNlKVxuICBlbHNlIGlmIG5vbldvcmRSZWdleC50ZXN0KGNoYXJhY3RlckF0UG9pbnQpIGFuZCBub3Qgd29yZFJlZ2V4LnRlc3QoY2hhcmFjdGVyQXRQb2ludClcbiAgICBraW5kID0gJ25vbi13b3JkJ1xuICAgIGlmIHNpbmdsZU5vbldvcmRDaGFyXG4gICAgICBzb3VyY2UgPSBfLmVzY2FwZVJlZ0V4cChjaGFyYWN0ZXJBdFBvaW50KVxuICAgICAgd29yZFJlZ2V4ID0gbmV3IFJlZ0V4cChzb3VyY2UpXG4gICAgZWxzZVxuICAgICAgd29yZFJlZ2V4ID0gbm9uV29yZFJlZ2V4XG4gIGVsc2VcbiAgICBraW5kID0gJ3dvcmQnXG5cbiAgcmFuZ2UgPSBnZXRXb3JkQnVmZmVyUmFuZ2VBdEJ1ZmZlclBvc2l0aW9uKGVkaXRvciwgcG9pbnQsIHt3b3JkUmVnZXh9KVxuICB7a2luZCwgcmFuZ2V9XG5cbmdldFdvcmRQYXR0ZXJuQXRCdWZmZXJQb3NpdGlvbiA9IChlZGl0b3IsIHBvaW50LCBvcHRpb25zPXt9KSAtPlxuICBib3VuZGFyaXplRm9yV29yZCA9IG9wdGlvbnMuYm91bmRhcml6ZUZvcldvcmQgPyB0cnVlXG4gIGRlbGV0ZSBvcHRpb25zLmJvdW5kYXJpemVGb3JXb3JkXG4gIHtyYW5nZSwga2luZH0gPSBnZXRXb3JkQnVmZmVyUmFuZ2VBbmRLaW5kQXRCdWZmZXJQb3NpdGlvbihlZGl0b3IsIHBvaW50LCBvcHRpb25zKVxuICB0ZXh0ID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuICBwYXR0ZXJuID0gXy5lc2NhcGVSZWdFeHAodGV4dClcblxuICBpZiBraW5kIGlzICd3b3JkJyBhbmQgYm91bmRhcml6ZUZvcldvcmRcbiAgICAjIFNldCB3b3JkLWJvdW5kYXJ5KCBcXGIgKSBhbmNob3Igb25seSB3aGVuIGl0J3MgZWZmZWN0aXZlICM2ODlcbiAgICBzdGFydEJvdW5kYXJ5ID0gaWYgL15cXHcvLnRlc3QodGV4dCkgdGhlbiBcIlxcXFxiXCIgZWxzZSAnJ1xuICAgIGVuZEJvdW5kYXJ5ID0gaWYgL1xcdyQvLnRlc3QodGV4dCkgdGhlbiBcIlxcXFxiXCIgZWxzZSAnJ1xuICAgIHBhdHRlcm4gPSBzdGFydEJvdW5kYXJ5ICsgcGF0dGVybiArIGVuZEJvdW5kYXJ5XG4gIG5ldyBSZWdFeHAocGF0dGVybiwgJ2cnKVxuXG5nZXRTdWJ3b3JkUGF0dGVybkF0QnVmZmVyUG9zaXRpb24gPSAoZWRpdG9yLCBwb2ludCwgb3B0aW9ucz17fSkgLT5cbiAgb3B0aW9ucyA9IHt3b3JkUmVnZXg6IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuc3Vid29yZFJlZ0V4cCgpLCBib3VuZGFyaXplRm9yV29yZDogZmFsc2V9XG4gIGdldFdvcmRQYXR0ZXJuQXRCdWZmZXJQb3NpdGlvbihlZGl0b3IsIHBvaW50LCBvcHRpb25zKVxuXG4jIFJldHVybiBvcHRpb25zIHVzZWQgZm9yIGdldFdvcmRCdWZmZXJSYW5nZUF0QnVmZmVyUG9zaXRpb25cbmJ1aWxkV29yZFBhdHRlcm5CeUN1cnNvciA9IChjdXJzb3IsIHt3b3JkUmVnZXh9KSAtPlxuICBub25Xb3JkQ2hhcmFjdGVycyA9IGdldE5vbldvcmRDaGFyYWN0ZXJzRm9yQ3Vyc29yKGN1cnNvcilcbiAgd29yZFJlZ2V4ID89IG5ldyBSZWdFeHAoXCJeW1xcdCBdKiR8W15cXFxccyN7Xy5lc2NhcGVSZWdFeHAobm9uV29yZENoYXJhY3RlcnMpfV0rXCIpXG4gIHt3b3JkUmVnZXgsIG5vbldvcmRDaGFyYWN0ZXJzfVxuXG5nZXRCZWdpbm5pbmdPZldvcmRCdWZmZXJQb3NpdGlvbiA9IChlZGl0b3IsIHBvaW50LCB7d29yZFJlZ2V4fT17fSkgLT5cbiAgc2NhblJhbmdlID0gW1twb2ludC5yb3csIDBdLCBwb2ludF1cblxuICBmb3VuZCA9IG51bGxcbiAgZWRpdG9yLmJhY2t3YXJkc1NjYW5JbkJ1ZmZlclJhbmdlIHdvcmRSZWdleCwgc2NhblJhbmdlLCAoe3JhbmdlLCBtYXRjaFRleHQsIHN0b3B9KSAtPlxuICAgIHJldHVybiBpZiBtYXRjaFRleHQgaXMgJycgYW5kIHJhbmdlLnN0YXJ0LmNvbHVtbiBpc250IDBcblxuICAgIGlmIHJhbmdlLnN0YXJ0LmlzTGVzc1RoYW4ocG9pbnQpXG4gICAgICBpZiByYW5nZS5lbmQuaXNHcmVhdGVyVGhhbk9yRXF1YWwocG9pbnQpXG4gICAgICAgIGZvdW5kID0gcmFuZ2Uuc3RhcnRcbiAgICAgIHN0b3AoKVxuXG4gIGZvdW5kID8gcG9pbnRcblxuZ2V0RW5kT2ZXb3JkQnVmZmVyUG9zaXRpb24gPSAoZWRpdG9yLCBwb2ludCwge3dvcmRSZWdleH09e30pIC0+XG4gIHNjYW5SYW5nZSA9IFtwb2ludCwgW3BvaW50LnJvdywgSW5maW5pdHldXVxuXG4gIGZvdW5kID0gbnVsbFxuICBlZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2Ugd29yZFJlZ2V4LCBzY2FuUmFuZ2UsICh7cmFuZ2UsIG1hdGNoVGV4dCwgc3RvcH0pIC0+XG4gICAgcmV0dXJuIGlmIG1hdGNoVGV4dCBpcyAnJyBhbmQgcmFuZ2Uuc3RhcnQuY29sdW1uIGlzbnQgMFxuXG4gICAgaWYgcmFuZ2UuZW5kLmlzR3JlYXRlclRoYW4ocG9pbnQpXG4gICAgICBpZiByYW5nZS5zdGFydC5pc0xlc3NUaGFuT3JFcXVhbChwb2ludClcbiAgICAgICAgZm91bmQgPSByYW5nZS5lbmRcbiAgICAgIHN0b3AoKVxuXG4gIGZvdW5kID8gcG9pbnRcblxuZ2V0V29yZEJ1ZmZlclJhbmdlQXRCdWZmZXJQb3NpdGlvbiA9IChlZGl0b3IsIHBvc2l0aW9uLCBvcHRpb25zPXt9KSAtPlxuICBlbmRQb3NpdGlvbiA9IGdldEVuZE9mV29yZEJ1ZmZlclBvc2l0aW9uKGVkaXRvciwgcG9zaXRpb24sIG9wdGlvbnMpXG4gIHN0YXJ0UG9zaXRpb24gPSBnZXRCZWdpbm5pbmdPZldvcmRCdWZmZXJQb3NpdGlvbihlZGl0b3IsIGVuZFBvc2l0aW9uLCBvcHRpb25zKVxuICBuZXcgUmFuZ2Uoc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24pXG5cbiMgV2hlbiByYW5nZSBpcyBsaW5ld2lzZSByYW5nZSwgcmFuZ2UgZW5kIGhhdmUgY29sdW1uIDAgb2YgTkVYVCByb3cuXG4jIFdoaWNoIGlzIHZlcnkgdW5pbnR1aXRpdmUgYW5kIHVud2FudGVkIHJlc3VsdC5cbnNocmlua1JhbmdlRW5kVG9CZWZvcmVOZXdMaW5lID0gKHJhbmdlKSAtPlxuICB7c3RhcnQsIGVuZH0gPSByYW5nZVxuICBpZiBlbmQuY29sdW1uIGlzIDBcbiAgICBlbmRSb3cgPSBsaW1pdE51bWJlcihlbmQucm93IC0gMSwgbWluOiBzdGFydC5yb3cpXG4gICAgbmV3IFJhbmdlKHN0YXJ0LCBbZW5kUm93LCBJbmZpbml0eV0pXG4gIGVsc2VcbiAgICByYW5nZVxuXG5zY2FuRWRpdG9yID0gKGVkaXRvciwgcGF0dGVybikgLT5cbiAgcmFuZ2VzID0gW11cbiAgZWRpdG9yLnNjYW4gcGF0dGVybiwgKHtyYW5nZX0pIC0+XG4gICAgcmFuZ2VzLnB1c2gocmFuZ2UpXG4gIHJhbmdlc1xuXG5jb2xsZWN0UmFuZ2VJbkJ1ZmZlclJvdyA9IChlZGl0b3IsIHJvdywgcGF0dGVybikgLT5cbiAgcmFuZ2VzID0gW11cbiAgc2NhblJhbmdlID0gZWRpdG9yLmJ1ZmZlclJhbmdlRm9yQnVmZmVyUm93KHJvdylcbiAgZWRpdG9yLnNjYW5JbkJ1ZmZlclJhbmdlIHBhdHRlcm4sIHNjYW5SYW5nZSwgKHtyYW5nZX0pIC0+XG4gICAgcmFuZ2VzLnB1c2gocmFuZ2UpXG4gIHJhbmdlc1xuXG5maW5kUmFuZ2VJbkJ1ZmZlclJvdyA9IChlZGl0b3IsIHBhdHRlcm4sIHJvdywge2RpcmVjdGlvbn09e30pIC0+XG4gIGlmIGRpcmVjdGlvbiBpcyAnYmFja3dhcmQnXG4gICAgc2NhbkZ1bmN0aW9uTmFtZSA9ICdiYWNrd2FyZHNTY2FuSW5CdWZmZXJSYW5nZSdcbiAgZWxzZVxuICAgIHNjYW5GdW5jdGlvbk5hbWUgPSAnc2NhbkluQnVmZmVyUmFuZ2UnXG5cbiAgcmFuZ2UgPSBudWxsXG4gIHNjYW5SYW5nZSA9IGVkaXRvci5idWZmZXJSYW5nZUZvckJ1ZmZlclJvdyhyb3cpXG4gIGVkaXRvcltzY2FuRnVuY3Rpb25OYW1lXSBwYXR0ZXJuLCBzY2FuUmFuZ2UsIChldmVudCkgLT4gcmFuZ2UgPSBldmVudC5yYW5nZVxuICByYW5nZVxuXG5nZXRMYXJnZXN0Rm9sZFJhbmdlQ29udGFpbnNCdWZmZXJSb3cgPSAoZWRpdG9yLCByb3cpIC0+XG4gIG1hcmtlcnMgPSBlZGl0b3IuZGlzcGxheUxheWVyLmZvbGRzTWFya2VyTGF5ZXIuZmluZE1hcmtlcnMoaW50ZXJzZWN0c1Jvdzogcm93KVxuXG4gIHN0YXJ0UG9pbnQgPSBudWxsXG4gIGVuZFBvaW50ID0gbnVsbFxuXG4gIGZvciBtYXJrZXIgaW4gbWFya2VycyA/IFtdXG4gICAge3N0YXJ0LCBlbmR9ID0gbWFya2VyLmdldFJhbmdlKClcbiAgICB1bmxlc3Mgc3RhcnRQb2ludFxuICAgICAgc3RhcnRQb2ludCA9IHN0YXJ0XG4gICAgICBlbmRQb2ludCA9IGVuZFxuICAgICAgY29udGludWVcblxuICAgIGlmIHN0YXJ0LmlzTGVzc1RoYW4oc3RhcnRQb2ludClcbiAgICAgIHN0YXJ0UG9pbnQgPSBzdGFydFxuICAgICAgZW5kUG9pbnQgPSBlbmRcblxuICBpZiBzdGFydFBvaW50PyBhbmQgZW5kUG9pbnQ/XG4gICAgbmV3IFJhbmdlKHN0YXJ0UG9pbnQsIGVuZFBvaW50KVxuXG4jIHRha2UgYnVmZmVyUG9zaXRpb25cbnRyYW5zbGF0ZVBvaW50QW5kQ2xpcCA9IChlZGl0b3IsIHBvaW50LCBkaXJlY3Rpb24pIC0+XG4gIHBvaW50ID0gUG9pbnQuZnJvbU9iamVjdChwb2ludClcblxuICBkb250Q2xpcCA9IGZhbHNlXG4gIHN3aXRjaCBkaXJlY3Rpb25cbiAgICB3aGVuICdmb3J3YXJkJ1xuICAgICAgcG9pbnQgPSBwb2ludC50cmFuc2xhdGUoWzAsICsxXSlcbiAgICAgIGVvbCA9IGVkaXRvci5idWZmZXJSYW5nZUZvckJ1ZmZlclJvdyhwb2ludC5yb3cpLmVuZFxuXG4gICAgICBpZiBwb2ludC5pc0VxdWFsKGVvbClcbiAgICAgICAgZG9udENsaXAgPSB0cnVlXG4gICAgICBlbHNlIGlmIHBvaW50LmlzR3JlYXRlclRoYW4oZW9sKVxuICAgICAgICBkb250Q2xpcCA9IHRydWVcbiAgICAgICAgcG9pbnQgPSBuZXcgUG9pbnQocG9pbnQucm93ICsgMSwgMCkgIyBtb3ZlIHBvaW50IHRvIG5ldy1saW5lIHNlbGVjdGVkIHBvaW50XG5cbiAgICAgIHBvaW50ID0gUG9pbnQubWluKHBvaW50LCBlZGl0b3IuZ2V0RW9mQnVmZmVyUG9zaXRpb24oKSlcblxuICAgIHdoZW4gJ2JhY2t3YXJkJ1xuICAgICAgcG9pbnQgPSBwb2ludC50cmFuc2xhdGUoWzAsIC0xXSlcblxuICAgICAgaWYgcG9pbnQuY29sdW1uIDwgMFxuICAgICAgICBkb250Q2xpcCA9IHRydWVcbiAgICAgICAgbmV3Um93ID0gcG9pbnQucm93IC0gMVxuICAgICAgICBlb2wgPSBlZGl0b3IuYnVmZmVyUmFuZ2VGb3JCdWZmZXJSb3cobmV3Um93KS5lbmRcbiAgICAgICAgcG9pbnQgPSBuZXcgUG9pbnQobmV3Um93LCBlb2wuY29sdW1uKVxuXG4gICAgICBwb2ludCA9IFBvaW50Lm1heChwb2ludCwgUG9pbnQuWkVSTylcblxuICBpZiBkb250Q2xpcFxuICAgIHBvaW50XG4gIGVsc2VcbiAgICBzY3JlZW5Qb2ludCA9IGVkaXRvci5zY3JlZW5Qb3NpdGlvbkZvckJ1ZmZlclBvc2l0aW9uKHBvaW50LCBjbGlwRGlyZWN0aW9uOiBkaXJlY3Rpb24pXG4gICAgZWRpdG9yLmJ1ZmZlclBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oc2NyZWVuUG9pbnQpXG5cbmdldFJhbmdlQnlUcmFuc2xhdGVQb2ludEFuZENsaXAgPSAoZWRpdG9yLCByYW5nZSwgd2hpY2gsIGRpcmVjdGlvbikgLT5cbiAgbmV3UG9pbnQgPSB0cmFuc2xhdGVQb2ludEFuZENsaXAoZWRpdG9yLCByYW5nZVt3aGljaF0sIGRpcmVjdGlvbilcbiAgc3dpdGNoIHdoaWNoXG4gICAgd2hlbiAnc3RhcnQnXG4gICAgICBuZXcgUmFuZ2UobmV3UG9pbnQsIHJhbmdlLmVuZClcbiAgICB3aGVuICdlbmQnXG4gICAgICBuZXcgUmFuZ2UocmFuZ2Uuc3RhcnQsIG5ld1BvaW50KVxuXG5nZXRQYWNrYWdlID0gKG5hbWUsIGZuKSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgLT5cbiAgICBpZiBhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZShuYW1lKVxuICAgICAgcGtnID0gYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKG5hbWUpXG4gICAgICByZXNvbHZlKHBrZylcbiAgICBlbHNlXG4gICAgICBkaXNwb3NhYmxlID0gYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlUGFja2FnZSAocGtnKSAtPlxuICAgICAgICBpZiBwa2cubmFtZSBpcyBuYW1lXG4gICAgICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICAgICAgICByZXNvbHZlKHBrZylcblxuc2VhcmNoQnlQcm9qZWN0RmluZCA9IChlZGl0b3IsIHRleHQpIC0+XG4gIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yLmVsZW1lbnQsICdwcm9qZWN0LWZpbmQ6c2hvdycpXG4gIGdldFBhY2thZ2UoJ2ZpbmQtYW5kLXJlcGxhY2UnKS50aGVuIChwa2cpIC0+XG4gICAge3Byb2plY3RGaW5kVmlld30gPSBwa2cubWFpbk1vZHVsZVxuICAgIGlmIHByb2plY3RGaW5kVmlldz9cbiAgICAgIHByb2plY3RGaW5kVmlldy5maW5kRWRpdG9yLnNldFRleHQodGV4dClcbiAgICAgIHByb2plY3RGaW5kVmlldy5jb25maXJtKClcblxubGltaXROdW1iZXIgPSAobnVtYmVyLCB7bWF4LCBtaW59PXt9KSAtPlxuICBudW1iZXIgPSBNYXRoLm1pbihudW1iZXIsIG1heCkgaWYgbWF4P1xuICBudW1iZXIgPSBNYXRoLm1heChudW1iZXIsIG1pbikgaWYgbWluP1xuICBudW1iZXJcblxuZmluZFJhbmdlQ29udGFpbnNQb2ludCA9IChyYW5nZXMsIHBvaW50KSAtPlxuICBmb3IgcmFuZ2UgaW4gcmFuZ2VzIHdoZW4gcmFuZ2UuY29udGFpbnNQb2ludChwb2ludClcbiAgICByZXR1cm4gcmFuZ2VcbiAgbnVsbFxuXG5uZWdhdGVGdW5jdGlvbiA9IChmbikgLT5cbiAgKGFyZ3MuLi4pIC0+XG4gICAgbm90IGZuKGFyZ3MuLi4pXG5cbmlzRW1wdHkgPSAodGFyZ2V0KSAtPiB0YXJnZXQuaXNFbXB0eSgpXG5pc05vdEVtcHR5ID0gbmVnYXRlRnVuY3Rpb24oaXNFbXB0eSlcblxuaXNTaW5nbGVMaW5lUmFuZ2UgPSAocmFuZ2UpIC0+IHJhbmdlLmlzU2luZ2xlTGluZSgpXG5pc05vdFNpbmdsZUxpbmVSYW5nZSA9IG5lZ2F0ZUZ1bmN0aW9uKGlzU2luZ2xlTGluZVJhbmdlKVxuXG5pc0xlYWRpbmdXaGl0ZVNwYWNlUmFuZ2UgPSAoZWRpdG9yLCByYW5nZSkgLT4gL15bXFx0IF0qJC8udGVzdChlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpKVxuaXNOb3RMZWFkaW5nV2hpdGVTcGFjZVJhbmdlID0gbmVnYXRlRnVuY3Rpb24oaXNMZWFkaW5nV2hpdGVTcGFjZVJhbmdlKVxuXG5pc0VzY2FwZWRDaGFyUmFuZ2UgPSAoZWRpdG9yLCByYW5nZSkgLT5cbiAgcmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KHJhbmdlKVxuICBjaGFycyA9IGdldExlZnRDaGFyYWN0ZXJGb3JCdWZmZXJQb3NpdGlvbihlZGl0b3IsIHJhbmdlLnN0YXJ0LCAyKVxuICBjaGFycy5lbmRzV2l0aCgnXFxcXCcpIGFuZCBub3QgY2hhcnMuZW5kc1dpdGgoJ1xcXFxcXFxcJylcblxuaW5zZXJ0VGV4dEF0QnVmZmVyUG9zaXRpb24gPSAoZWRpdG9yLCBwb2ludCwgdGV4dCkgLT5cbiAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFtwb2ludCwgcG9pbnRdLCB0ZXh0KVxuXG5lbnN1cmVFbmRzV2l0aE5ld0xpbmVGb3JCdWZmZXJSb3cgPSAoZWRpdG9yLCByb3cpIC0+XG4gIHVubGVzcyBpc0VuZHNXaXRoTmV3TGluZUZvckJ1ZmZlclJvdyhlZGl0b3IsIHJvdylcbiAgICBlb2wgPSBnZXRFbmRPZkxpbmVGb3JCdWZmZXJSb3coZWRpdG9yLCByb3cpXG4gICAgaW5zZXJ0VGV4dEF0QnVmZmVyUG9zaXRpb24oZWRpdG9yLCBlb2wsIFwiXFxuXCIpXG5cbmZvckVhY2hQYW5lQXhpcyA9IChmbiwgYmFzZSkgLT5cbiAgYmFzZSA/PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0Q29udGFpbmVyKCkuZ2V0Um9vdCgpXG4gIGlmIGJhc2UuY2hpbGRyZW4/XG4gICAgZm4oYmFzZSlcblxuICAgIGZvciBjaGlsZCBpbiBiYXNlLmNoaWxkcmVuXG4gICAgICBmb3JFYWNoUGFuZUF4aXMoZm4sIGNoaWxkKVxuXG5tb2RpZnlDbGFzc0xpc3QgPSAoYWN0aW9uLCBlbGVtZW50LCBjbGFzc05hbWVzLi4uKSAtPlxuICBlbGVtZW50LmNsYXNzTGlzdFthY3Rpb25dKGNsYXNzTmFtZXMuLi4pXG5cbmFkZENsYXNzTGlzdCA9IG1vZGlmeUNsYXNzTGlzdC5iaW5kKG51bGwsICdhZGQnKVxucmVtb3ZlQ2xhc3NMaXN0ID0gbW9kaWZ5Q2xhc3NMaXN0LmJpbmQobnVsbCwgJ3JlbW92ZScpXG50b2dnbGVDbGFzc0xpc3QgPSBtb2RpZnlDbGFzc0xpc3QuYmluZChudWxsLCAndG9nZ2xlJylcblxudG9nZ2xlQ2FzZUZvckNoYXJhY3RlciA9IChjaGFyKSAtPlxuICBjaGFyTG93ZXIgPSBjaGFyLnRvTG93ZXJDYXNlKClcbiAgaWYgY2hhckxvd2VyIGlzIGNoYXJcbiAgICBjaGFyLnRvVXBwZXJDYXNlKClcbiAgZWxzZVxuICAgIGNoYXJMb3dlclxuXG5zcGxpdFRleHRCeU5ld0xpbmUgPSAodGV4dCkgLT5cbiAgaWYgdGV4dC5lbmRzV2l0aChcIlxcblwiKVxuICAgIHRleHQudHJpbVJpZ2h0KCkuc3BsaXQoL1xccj9cXG4vZylcbiAgZWxzZVxuICAgIHRleHQuc3BsaXQoL1xccj9cXG4vZylcblxucmVwbGFjZURlY29yYXRpb25DbGFzc0J5ID0gKGZuLCBkZWNvcmF0aW9uKSAtPlxuICBwcm9wcyA9IGRlY29yYXRpb24uZ2V0UHJvcGVydGllcygpXG4gIGRlY29yYXRpb24uc2V0UHJvcGVydGllcyhfLmRlZmF1bHRzKHtjbGFzczogZm4ocHJvcHMuY2xhc3MpfSwgcHJvcHMpKVxuXG4jIE1vZGlmeSByYW5nZSB1c2VkIGZvciB1bmRvL3JlZG8gZmxhc2ggaGlnaGxpZ2h0IHRvIG1ha2UgaXQgZmVlbCBuYXR1cmFsbHkgZm9yIGh1bWFuLlxuIyAgLSBUcmltIHN0YXJ0aW5nIG5ldyBsaW5lKFwiXFxuXCIpXG4jICAgICBcIlxcbmFiY1wiIC0+IFwiYWJjXCJcbiMgIC0gSWYgcmFuZ2UuZW5kIGlzIEVPTCBleHRlbmQgcmFuZ2UgdG8gZmlyc3QgY29sdW1uIG9mIG5leHQgbGluZS5cbiMgICAgIFwiYWJjXCIgLT4gXCJhYmNcXG5cIlxuIyBlLmcuXG4jIC0gd2hlbiAnYycgaXMgYXRFT0w6IFwiXFxuYWJjXCIgLT4gXCJhYmNcXG5cIlxuIyAtIHdoZW4gJ2MnIGlzIE5PVCBhdEVPTDogXCJcXG5hYmNcIiAtPiBcImFiY1wiXG4jXG4jIFNvIGFsd2F5cyB0cmltIGluaXRpYWwgXCJcXG5cIiBwYXJ0IHJhbmdlIGJlY2F1c2UgZmxhc2hpbmcgdHJhaWxpbmcgbGluZSBpcyBjb3VudGVyaW50dWl0aXZlLlxuaHVtYW5pemVCdWZmZXJSYW5nZSA9IChlZGl0b3IsIHJhbmdlKSAtPlxuICBpZiBpc1NpbmdsZUxpbmVSYW5nZShyYW5nZSkgb3IgaXNMaW5ld2lzZVJhbmdlKHJhbmdlKVxuICAgIHJldHVybiByYW5nZVxuXG4gIHtzdGFydCwgZW5kfSA9IHJhbmdlXG4gIGlmIHBvaW50SXNBdEVuZE9mTGluZShlZGl0b3IsIHN0YXJ0KVxuICAgIG5ld1N0YXJ0ID0gc3RhcnQudHJhdmVyc2UoWzEsIDBdKVxuXG4gIGlmIHBvaW50SXNBdEVuZE9mTGluZShlZGl0b3IsIGVuZClcbiAgICBuZXdFbmQgPSBlbmQudHJhdmVyc2UoWzEsIDBdKVxuXG4gIGlmIG5ld1N0YXJ0PyBvciBuZXdFbmQ/XG4gICAgbmV3IFJhbmdlKG5ld1N0YXJ0ID8gc3RhcnQsIG5ld0VuZCA/IGVuZClcbiAgZWxzZVxuICAgIHJhbmdlXG5cbiMgRXhwYW5kIHJhbmdlIHRvIHdoaXRlIHNwYWNlXG4jICAxLiBFeHBhbmQgdG8gZm9yd2FyZCBkaXJlY3Rpb24sIGlmIHN1Y2VlZCByZXR1cm4gbmV3IHJhbmdlLlxuIyAgMi4gRXhwYW5kIHRvIGJhY2t3YXJkIGRpcmVjdGlvbiwgaWYgc3VjY2VlZCByZXR1cm4gbmV3IHJhbmdlLlxuIyAgMy4gV2hlbiBmYWlsZCB0byBleHBhbmQgZWl0aGVyIGRpcmVjdGlvbiwgcmV0dXJuIG9yaWdpbmFsIHJhbmdlLlxuZXhwYW5kUmFuZ2VUb1doaXRlU3BhY2VzID0gKGVkaXRvciwgcmFuZ2UpIC0+XG4gIHtzdGFydCwgZW5kfSA9IHJhbmdlXG5cbiAgbmV3RW5kID0gbnVsbFxuICBzY2FuUmFuZ2UgPSBbZW5kLCBnZXRFbmRPZkxpbmVGb3JCdWZmZXJSb3coZWRpdG9yLCBlbmQucm93KV1cbiAgZWRpdG9yLnNjYW5JbkJ1ZmZlclJhbmdlIC9cXFMvLCBzY2FuUmFuZ2UsICh7cmFuZ2V9KSAtPiBuZXdFbmQgPSByYW5nZS5zdGFydFxuXG4gIGlmIG5ld0VuZD8uaXNHcmVhdGVyVGhhbihlbmQpXG4gICAgcmV0dXJuIG5ldyBSYW5nZShzdGFydCwgbmV3RW5kKVxuXG4gIG5ld1N0YXJ0ID0gbnVsbFxuICBzY2FuUmFuZ2UgPSBbW3N0YXJ0LnJvdywgMF0sIHJhbmdlLnN0YXJ0XVxuICBlZGl0b3IuYmFja3dhcmRzU2NhbkluQnVmZmVyUmFuZ2UgL1xcUy8sIHNjYW5SYW5nZSwgKHtyYW5nZX0pIC0+IG5ld1N0YXJ0ID0gcmFuZ2UuZW5kXG5cbiAgaWYgbmV3U3RhcnQ/LmlzTGVzc1RoYW4oc3RhcnQpXG4gICAgcmV0dXJuIG5ldyBSYW5nZShuZXdTdGFydCwgZW5kKVxuXG4gIHJldHVybiByYW5nZSAjIGZhbGxiYWNrXG5cbiMgU3BsaXQgYW5kIGpvaW4gYWZ0ZXIgbXV0YXRlIGl0ZW0gYnkgY2FsbGJhY2sgd2l0aCBrZWVwIG9yaWdpbmFsIHNlcGFyYXRvciB1bmNoYW5nZWQuXG4jXG4jIDEuIFRyaW0gbGVhZGluZyBhbmQgdHJhaW5saW5nIHdoaXRlIHNwYWNlcyBhbmQgcmVtZW1iZXJcbiMgMS4gU3BsaXQgdGV4dCB3aXRoIGdpdmVuIHBhdHRlcm4gYW5kIHJlbWVtYmVyIG9yaWdpbmFsIHNlcGFyYXRvcnMuXG4jIDIuIENoYW5nZSBvcmRlciBieSBjYWxsYmFja1xuIyAzLiBKb2luIHdpdGggb3JpZ2luYWwgc3BlYXJhdG9yIGFuZCBjb25jYXQgd2l0aCByZW1lbWJlcmVkIGxlYWRpbmcgYW5kIHRyYWlubGluZyB3aGl0ZSBzcGFjZXMuXG4jXG5zcGxpdEFuZEpvaW5CeSA9ICh0ZXh0LCBwYXR0ZXJuLCBmbikgLT5cbiAgbGVhZGluZ1NwYWNlcyA9IHRyYWlsaW5nU3BhY2VzID0gJydcbiAgc3RhcnQgPSB0ZXh0LnNlYXJjaCgvXFxTLylcbiAgZW5kID0gdGV4dC5zZWFyY2goL1xccyokLylcbiAgbGVhZGluZ1NwYWNlcyA9IHRyYWlsaW5nU3BhY2VzID0gJydcbiAgbGVhZGluZ1NwYWNlcyA9IHRleHRbMC4uLnN0YXJ0XSBpZiBzdGFydCBpc250IC0xXG4gIHRyYWlsaW5nU3BhY2VzID0gdGV4dFtlbmQuLi5dIGlmIGVuZCBpc250IC0xXG4gIHRleHQgPSB0ZXh0W3N0YXJ0Li4uZW5kXVxuXG4gIGZsYWdzID0gJ2cnXG4gIGZsYWdzICs9ICdpJyBpZiBwYXR0ZXJuLmlnbm9yZUNhc2VcbiAgcmVnZXhwID0gbmV3IFJlZ0V4cChcIigje3BhdHRlcm4uc291cmNlfSlcIiwgZmxhZ3MpXG4gICMgZS5nLlxuICAjIFdoZW4gdGV4dCA9IFwiYSwgYiwgY1wiLCBwYXR0ZXJuID0gLyw/XFxzKy9cbiAgIyAgIGl0ZW1zID0gWydhJywgJ2InLCAnYyddLCBzcGVhcmF0b3JzID0gWycsICcsICcsICddXG4gICMgV2hlbiB0ZXh0ID0gXCJhIGJcXG4gY1wiLCBwYXR0ZXJuID0gLyw/XFxzKy9cbiAgIyAgIGl0ZW1zID0gWydhJywgJ2InLCAnYyddLCBzcGVhcmF0b3JzID0gWycgJywgJ1xcbiAnXVxuICBpdGVtcyA9IFtdXG4gIHNlcGFyYXRvcnMgPSBbXVxuICBmb3Igc2VnbWVudCwgaSBpbiB0ZXh0LnNwbGl0KHJlZ2V4cClcbiAgICBpZiBpICUgMiBpcyAwXG4gICAgICBpdGVtcy5wdXNoKHNlZ21lbnQpXG4gICAgZWxzZVxuICAgICAgc2VwYXJhdG9ycy5wdXNoKHNlZ21lbnQpXG4gIHNlcGFyYXRvcnMucHVzaCgnJylcbiAgaXRlbXMgPSBmbihpdGVtcylcbiAgcmVzdWx0ID0gJydcbiAgZm9yIFtpdGVtLCBzZXBhcmF0b3JdIGluIF8uemlwKGl0ZW1zLCBzZXBhcmF0b3JzKVxuICAgIHJlc3VsdCArPSBpdGVtICsgc2VwYXJhdG9yXG4gIGxlYWRpbmdTcGFjZXMgKyByZXN1bHQgKyB0cmFpbGluZ1NwYWNlc1xuXG5jbGFzcyBBcmd1bWVudHNTcGxpdHRlclxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAYWxsVG9rZW5zID0gW11cbiAgICBAY3VycmVudFNlY3Rpb24gPSBudWxsXG5cbiAgc2V0dGxlUGVuZGluZzogLT5cbiAgICBpZiBAcGVuZGluZ1Rva2VuXG4gICAgICBAYWxsVG9rZW5zLnB1c2goe3RleHQ6IEBwZW5kaW5nVG9rZW4sIHR5cGU6IEBjdXJyZW50U2VjdGlvbn0pXG4gICAgICBAcGVuZGluZ1Rva2VuID0gJydcblxuICBjaGFuZ2VTZWN0aW9uOiAobmV3U2VjdGlvbikgLT5cbiAgICBpZiBAY3VycmVudFNlY3Rpb24gaXNudCBuZXdTZWN0aW9uXG4gICAgICBAc2V0dGxlUGVuZGluZygpIGlmIEBjdXJyZW50U2VjdGlvblxuICAgICAgQGN1cnJlbnRTZWN0aW9uID0gbmV3U2VjdGlvblxuXG5zcGxpdEFyZ3VtZW50cyA9ICh0ZXh0LCBqb2luU3BhY2VTZXBhcmF0ZWRUb2tlbikgLT5cbiAgam9pblNwYWNlU2VwYXJhdGVkVG9rZW4gPz0gdHJ1ZVxuICBzZXBhcmF0b3JDaGFycyA9IFwiXFx0LCBcXHJcXG5cIlxuICBxdW90ZUNoYXJzID0gXCJcXFwiJ2BcIlxuICBjbG9zZUNoYXJUb09wZW5DaGFyID0ge1xuICAgIFwiKVwiOiBcIihcIlxuICAgIFwifVwiOiBcIntcIlxuICAgIFwiXVwiOiBcIltcIlxuICB9XG4gIGNsb3NlUGFpckNoYXJzID0gXy5rZXlzKGNsb3NlQ2hhclRvT3BlbkNoYXIpLmpvaW4oJycpXG4gIG9wZW5QYWlyQ2hhcnMgPSBfLnZhbHVlcyhjbG9zZUNoYXJUb09wZW5DaGFyKS5qb2luKCcnKVxuICBlc2NhcGVDaGFyID0gXCJcXFxcXCJcblxuICBwZW5kaW5nVG9rZW4gPSAnJ1xuICBpblF1b3RlID0gZmFsc2VcbiAgaXNFc2NhcGVkID0gZmFsc2VcbiAgIyBQYXJzZSB0ZXh0IGFzIGxpc3Qgb2YgdG9rZW5zIHdoaWNoIGlzIGNvbW1tYSBzZXBhcmF0ZWQgb3Igd2hpdGUgc3BhY2Ugc2VwYXJhdGVkLlxuICAjIGUuZy4gJ2EsIGZ1bjEoYiwgYyksIGQnID0+IFsnYScsICdmdW4xKGIsIGMpLCAnZCddXG4gICMgTm90IHBlcmZlY3QuIGJ1dCBmYXIgYmV0dGVyIHRoYW4gc2ltcGxlIHN0cmluZyBzcGxpdCBieSByZWdleCBwYXR0ZXJuLlxuICBhbGxUb2tlbnMgPSBbXVxuICBjdXJyZW50U2VjdGlvbiA9IG51bGxcblxuICBzZXR0bGVQZW5kaW5nID0gLT5cbiAgICBpZiBwZW5kaW5nVG9rZW5cbiAgICAgIGFsbFRva2Vucy5wdXNoKHt0ZXh0OiBwZW5kaW5nVG9rZW4sIHR5cGU6IGN1cnJlbnRTZWN0aW9ufSlcbiAgICAgIHBlbmRpbmdUb2tlbiA9ICcnXG5cbiAgY2hhbmdlU2VjdGlvbiA9IChuZXdTZWN0aW9uKSAtPlxuICAgIGlmIGN1cnJlbnRTZWN0aW9uIGlzbnQgbmV3U2VjdGlvblxuICAgICAgc2V0dGxlUGVuZGluZygpIGlmIGN1cnJlbnRTZWN0aW9uXG4gICAgICBjdXJyZW50U2VjdGlvbiA9IG5ld1NlY3Rpb25cblxuICBwYWlyU3RhY2sgPSBbXVxuICBmb3IgY2hhciBpbiB0ZXh0XG4gICAgaWYgKHBhaXJTdGFjay5sZW5ndGggaXMgMCkgYW5kIChjaGFyIGluIHNlcGFyYXRvckNoYXJzKVxuICAgICAgY2hhbmdlU2VjdGlvbignc2VwYXJhdG9yJylcbiAgICBlbHNlXG4gICAgICBjaGFuZ2VTZWN0aW9uKCdhcmd1bWVudCcpXG4gICAgICBpZiBpc0VzY2FwZWRcbiAgICAgICAgaXNFc2NhcGVkID0gZmFsc2VcbiAgICAgIGVsc2UgaWYgY2hhciBpcyBlc2NhcGVDaGFyXG4gICAgICAgIGlzRXNjYXBlZCA9IHRydWVcbiAgICAgIGVsc2UgaWYgaW5RdW90ZVxuICAgICAgICBpZiAoY2hhciBpbiBxdW90ZUNoYXJzKSBhbmQgXy5sYXN0KHBhaXJTdGFjaykgaXMgY2hhclxuICAgICAgICAgIHBhaXJTdGFjay5wb3AoKVxuICAgICAgICAgIGluUXVvdGUgPSBmYWxzZVxuICAgICAgZWxzZSBpZiBjaGFyIGluIHF1b3RlQ2hhcnNcbiAgICAgICAgaW5RdW90ZSA9IHRydWVcbiAgICAgICAgcGFpclN0YWNrLnB1c2goY2hhcilcbiAgICAgIGVsc2UgaWYgY2hhciBpbiBvcGVuUGFpckNoYXJzXG4gICAgICAgIHBhaXJTdGFjay5wdXNoKGNoYXIpXG4gICAgICBlbHNlIGlmIGNoYXIgaW4gY2xvc2VQYWlyQ2hhcnNcbiAgICAgICAgcGFpclN0YWNrLnBvcCgpIGlmIF8ubGFzdChwYWlyU3RhY2spIGlzIGNsb3NlQ2hhclRvT3BlbkNoYXJbY2hhcl1cblxuICAgIHBlbmRpbmdUb2tlbiArPSBjaGFyXG4gIHNldHRsZVBlbmRpbmcoKVxuXG4gIGlmIGpvaW5TcGFjZVNlcGFyYXRlZFRva2VuIGFuZCBhbGxUb2tlbnMuc29tZSgoe3R5cGUsIHRleHR9KSAtPiB0eXBlIGlzICdzZXBhcmF0b3InIGFuZCAnLCcgaW4gdGV4dClcbiAgICAjIFdoZW4gc29tZSBzZXBhcmF0b3IgY29udGFpbnMgYCxgIHRyZWF0IHdoaXRlLXNwYWNlIHNlcGFyYXRvciBpcyBqdXN0IHBhcnQgb2YgdG9rZW4uXG4gICAgIyBTbyB3ZSBtb3ZlIHdoaXRlLXNwYWNlIG9ubHkgc3BhcmF0b3IgaW50byB0b2tlbnMgYnkgam9pbmluZyBtaXMtc2VwYXJhdG9lZCB0b2tlbnMuXG4gICAgbmV3QWxsVG9rZW5zID0gW11cbiAgICB3aGlsZSBhbGxUb2tlbnMubGVuZ3RoXG4gICAgICB0b2tlbiA9IGFsbFRva2Vucy5zaGlmdCgpXG4gICAgICBzd2l0Y2ggdG9rZW4udHlwZVxuICAgICAgICB3aGVuICdhcmd1bWVudCdcbiAgICAgICAgICBuZXdBbGxUb2tlbnMucHVzaCh0b2tlbilcbiAgICAgICAgd2hlbiAnc2VwYXJhdG9yJ1xuICAgICAgICAgIGlmICcsJyBpbiB0b2tlbi50ZXh0XG4gICAgICAgICAgICBuZXdBbGxUb2tlbnMucHVzaCh0b2tlbilcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIDEuIENvbmNhdG5hdGUgd2hpdGUtc3BhY2Utc2VwYXJhdG9yIGFuZCBuZXh0LWFyZ3VtZW50XG4gICAgICAgICAgICAjIDIuIFRoZW4gam9pbiBpbnRvIGxhdGVzdCBhcmd1bWVudFxuICAgICAgICAgICAgbGFzdEFyZyA9IG5ld0FsbFRva2Vucy5wb3AoKSA/IHt0ZXh0OiAnJywgJ2FyZ3VtZW50J31cbiAgICAgICAgICAgIGxhc3RBcmcudGV4dCArPSB0b2tlbi50ZXh0ICsgKGFsbFRva2Vucy5zaGlmdCgpPy50ZXh0ID8gJycpICMgY29uY2F0IHdpdGggbmV4dC1hcmd1bWVudFxuICAgICAgICAgICAgbmV3QWxsVG9rZW5zLnB1c2gobGFzdEFyZylcbiAgICBhbGxUb2tlbnMgPSBuZXdBbGxUb2tlbnNcbiAgYWxsVG9rZW5zXG5cbnNjYW5FZGl0b3JJbkRpcmVjdGlvbiA9IChlZGl0b3IsIGRpcmVjdGlvbiwgcGF0dGVybiwgb3B0aW9ucz17fSwgZm4pIC0+XG4gIHthbGxvd05leHRMaW5lLCBmcm9tLCBzY2FuUmFuZ2V9ID0gb3B0aW9uc1xuICBpZiBub3QgZnJvbT8gYW5kIG5vdCBzY2FuUmFuZ2U/XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgZWl0aGVyIG9mICdmcm9tJyBvciAnc2NhblJhbmdlJyBvcHRpb25zXCIpXG5cbiAgaWYgc2NhblJhbmdlXG4gICAgYWxsb3dOZXh0TGluZSA9IHRydWVcbiAgZWxzZVxuICAgIGFsbG93TmV4dExpbmUgPz0gdHJ1ZVxuICBmcm9tID0gUG9pbnQuZnJvbU9iamVjdChmcm9tKSBpZiBmcm9tP1xuICBzd2l0Y2ggZGlyZWN0aW9uXG4gICAgd2hlbiAnZm9yd2FyZCdcbiAgICAgIHNjYW5SYW5nZSA/PSBuZXcgUmFuZ2UoZnJvbSwgZ2V0VmltRW9mQnVmZmVyUG9zaXRpb24oZWRpdG9yKSlcbiAgICAgIHNjYW5GdW5jdGlvbiA9ICdzY2FuSW5CdWZmZXJSYW5nZSdcbiAgICB3aGVuICdiYWNrd2FyZCdcbiAgICAgIHNjYW5SYW5nZSA/PSBuZXcgUmFuZ2UoWzAsIDBdLCBmcm9tKVxuICAgICAgc2NhbkZ1bmN0aW9uID0gJ2JhY2t3YXJkc1NjYW5JbkJ1ZmZlclJhbmdlJ1xuXG4gIGVkaXRvcltzY2FuRnVuY3Rpb25dIHBhdHRlcm4sIHNjYW5SYW5nZSwgKGV2ZW50KSAtPlxuICAgIGlmIG5vdCBhbGxvd05leHRMaW5lIGFuZCBldmVudC5yYW5nZS5zdGFydC5yb3cgaXNudCBmcm9tLnJvd1xuICAgICAgZXZlbnQuc3RvcCgpXG4gICAgICByZXR1cm5cbiAgICBmbihldmVudClcblxuYWRqdXN0SW5kZW50V2l0aEtlZXBpbmdMYXlvdXQgPSAoZWRpdG9yLCByYW5nZSkgLT5cbiAgIyBBZGp1c3QgaW5kZW50TGV2ZWwgd2l0aCBrZWVwaW5nIG9yaWdpbmFsIGxheW91dCBvZiBwYXN0aW5nIHRleHQuXG4gICMgU3VnZ2VzdGVkIGluZGVudCBsZXZlbCBvZiByYW5nZS5zdGFydC5yb3cgaXMgY29ycmVjdCBhcyBsb25nIGFzIHJhbmdlLnN0YXJ0LnJvdyBoYXZlIG1pbmltdW0gaW5kZW50IGxldmVsLlxuICAjIEJ1dCB3aGVuIHdlIHBhc3RlIGZvbGxvd2luZyBhbHJlYWR5IGluZGVudGVkIHRocmVlIGxpbmUgdGV4dCwgd2UgaGF2ZSB0byBhZGp1c3QgaW5kZW50IGxldmVsXG4gICMgIHNvIHRoYXQgYHZhckZvcnR5VHdvYCBsaW5lIGhhdmUgc3VnZ2VzdGVkSW5kZW50TGV2ZWwuXG4gICNcbiAgIyAgICAgICAgdmFyT25lOiB2YWx1ZSAjIHN1Z2dlc3RlZEluZGVudExldmVsIGlzIGRldGVybWluZWQgYnkgdGhpcyBsaW5lXG4gICMgICB2YXJGb3J0eVR3bzogdmFsdWUgIyBXZSBuZWVkIHRvIG1ha2UgZmluYWwgaW5kZW50IGxldmVsIG9mIHRoaXMgcm93IHRvIGJlIHN1Z2dlc3RlZEluZGVudExldmVsLlxuICAjICAgICAgdmFyVGhyZWU6IHZhbHVlXG4gICNcbiAgIyBTbyB3aGF0IHdlIGFyZSBkb2luZyBoZXJlIGlzIGFwcGx5IHN1Z2dlc3RlZEluZGVudExldmVsIHdpdGggZml4aW5nIGlzc3VlIGFib3ZlLlxuICAjIDEuIERldGVybWluZSBtaW5pbXVtIGluZGVudCBsZXZlbCBhbW9uZyBwYXN0ZWQgcmFuZ2UoPSByYW5nZSApIGV4Y2x1ZGluZyBlbXB0eSByb3dcbiAgIyAyLiBUaGVuIHVwZGF0ZSBpbmRlbnRMZXZlbCBvZiBlYWNoIHJvd3MgdG8gZmluYWwgaW5kZW50TGV2ZWwgb2YgbWluaW11bS1pbmRlbnRlZCByb3cgaGF2ZSBzdWdnZXN0ZWRJbmRlbnRMZXZlbC5cbiAgc3VnZ2VzdGVkTGV2ZWwgPSBlZGl0b3Iuc3VnZ2VzdGVkSW5kZW50Rm9yQnVmZmVyUm93KHJhbmdlLnN0YXJ0LnJvdylcbiAgbWluTGV2ZWwgPSBudWxsXG4gIHJvd0FuZEFjdHVhbExldmVscyA9IFtdXG4gIGZvciByb3cgaW4gW3JhbmdlLnN0YXJ0LnJvdy4uLnJhbmdlLmVuZC5yb3ddXG4gICAgYWN0dWFsTGV2ZWwgPSBnZXRJbmRlbnRMZXZlbEZvckJ1ZmZlclJvdyhlZGl0b3IsIHJvdylcbiAgICByb3dBbmRBY3R1YWxMZXZlbHMucHVzaChbcm93LCBhY3R1YWxMZXZlbF0pXG4gICAgdW5sZXNzIGlzRW1wdHlSb3coZWRpdG9yLCByb3cpXG4gICAgICBtaW5MZXZlbCA9IE1hdGgubWluKG1pbkxldmVsID8gSW5maW5pdHksIGFjdHVhbExldmVsKVxuXG4gIGlmIG1pbkxldmVsPyBhbmQgKGRlbHRhVG9TdWdnZXN0ZWRMZXZlbCA9IHN1Z2dlc3RlZExldmVsIC0gbWluTGV2ZWwpXG4gICAgZm9yIFtyb3csIGFjdHVhbExldmVsXSBpbiByb3dBbmRBY3R1YWxMZXZlbHNcbiAgICAgIG5ld0xldmVsID0gYWN0dWFsTGV2ZWwgKyBkZWx0YVRvU3VnZ2VzdGVkTGV2ZWxcbiAgICAgIGVkaXRvci5zZXRJbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhyb3csIG5ld0xldmVsKVxuXG4jIENoZWNrIHBvaW50IGNvbnRhaW5tZW50IHdpdGggZW5kIHBvc2l0aW9uIGV4Y2x1c2l2ZVxucmFuZ2VDb250YWluc1BvaW50V2l0aEVuZEV4Y2x1c2l2ZSA9IChyYW5nZSwgcG9pbnQpIC0+XG4gIHJhbmdlLnN0YXJ0LmlzTGVzc1RoYW5PckVxdWFsKHBvaW50KSBhbmRcbiAgICByYW5nZS5lbmQuaXNHcmVhdGVyVGhhbihwb2ludClcblxudHJhdmVyc2VUZXh0RnJvbVBvaW50ID0gKHBvaW50LCB0ZXh0KSAtPlxuICBwb2ludC50cmF2ZXJzZShnZXRUcmF2ZXJzYWxGb3JUZXh0KHRleHQpKVxuXG5nZXRUcmF2ZXJzYWxGb3JUZXh0ID0gKHRleHQpIC0+XG4gIHJvdyA9IDBcbiAgY29sdW1uID0gMFxuICBmb3IgY2hhciBpbiB0ZXh0XG4gICAgaWYgY2hhciBpcyBcIlxcblwiXG4gICAgICByb3crK1xuICAgICAgY29sdW1uID0gMFxuICAgIGVsc2VcbiAgICAgIGNvbHVtbisrXG4gIFtyb3csIGNvbHVtbl1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzc2VydFdpdGhFeGNlcHRpb25cbiAgZ2V0QW5jZXN0b3JzXG4gIGdldEtleUJpbmRpbmdGb3JDb21tYW5kXG4gIGluY2x1ZGVcbiAgZGVidWdcbiAgc2F2ZUVkaXRvclN0YXRlXG4gIGlzTGluZXdpc2VSYW5nZVxuICBoYXZlU29tZU5vbkVtcHR5U2VsZWN0aW9uXG4gIHNvcnRSYW5nZXNcbiAgZ2V0SW5kZXhcbiAgZ2V0VmlzaWJsZUJ1ZmZlclJhbmdlXG4gIGdldFZpc2libGVFZGl0b3JzXG4gIHBvaW50SXNBdEVuZE9mTGluZVxuICBwb2ludElzT25XaGl0ZVNwYWNlXG4gIHBvaW50SXNBdEVuZE9mTGluZUF0Tm9uRW1wdHlSb3dcbiAgcG9pbnRJc0F0VmltRW5kT2ZGaWxlXG4gIGdldFZpbUVvZkJ1ZmZlclBvc2l0aW9uXG4gIGdldFZpbUVvZlNjcmVlblBvc2l0aW9uXG4gIGdldFZpbUxhc3RCdWZmZXJSb3dcbiAgZ2V0VmltTGFzdFNjcmVlblJvd1xuICBzZXRCdWZmZXJSb3dcbiAgc2V0QnVmZmVyQ29sdW1uXG4gIG1vdmVDdXJzb3JMZWZ0XG4gIG1vdmVDdXJzb3JSaWdodFxuICBtb3ZlQ3Vyc29yVXBTY3JlZW5cbiAgbW92ZUN1cnNvckRvd25TY3JlZW5cbiAgZ2V0RW5kT2ZMaW5lRm9yQnVmZmVyUm93XG4gIGdldEZpcnN0VmlzaWJsZVNjcmVlblJvd1xuICBnZXRMYXN0VmlzaWJsZVNjcmVlblJvd1xuICBnZXRWYWxpZFZpbUJ1ZmZlclJvd1xuICBnZXRWYWxpZFZpbVNjcmVlblJvd1xuICBtb3ZlQ3Vyc29yVG9GaXJzdENoYXJhY3RlckF0Um93XG4gIGdldExpbmVUZXh0VG9CdWZmZXJQb3NpdGlvblxuICBnZXRJbmRlbnRMZXZlbEZvckJ1ZmZlclJvd1xuICBnZXRUZXh0SW5TY3JlZW5SYW5nZVxuICBtb3ZlQ3Vyc29yVG9OZXh0Tm9uV2hpdGVzcGFjZVxuICBpc0VtcHR5Um93XG4gIGdldENvZGVGb2xkUm93UmFuZ2VzXG4gIGdldENvZGVGb2xkUm93UmFuZ2VzQ29udGFpbmVzRm9yUm93XG4gIGdldEJ1ZmZlclJhbmdlRm9yUm93UmFuZ2VcbiAgdHJpbVJhbmdlXG4gIGdldEZpcnN0Q2hhcmFjdGVyUG9zaXRpb25Gb3JCdWZmZXJSb3dcbiAgaXNJbmNsdWRlRnVuY3Rpb25TY29wZUZvclJvd1xuICBkZXRlY3RTY29wZVN0YXJ0UG9zaXRpb25Gb3JTY29wZVxuICBnZXRCdWZmZXJSb3dzXG4gIHNtYXJ0U2Nyb2xsVG9CdWZmZXJQb3NpdGlvblxuICBtYXRjaFNjb3Blc1xuICBtb3ZlQ3Vyc29yRG93bkJ1ZmZlclxuICBtb3ZlQ3Vyc29yVXBCdWZmZXJcbiAgaXNTaW5nbGVMaW5lVGV4dFxuICBnZXRXb3JkQnVmZmVyUmFuZ2VBdEJ1ZmZlclBvc2l0aW9uXG4gIGdldFdvcmRCdWZmZXJSYW5nZUFuZEtpbmRBdEJ1ZmZlclBvc2l0aW9uXG4gIGdldFdvcmRQYXR0ZXJuQXRCdWZmZXJQb3NpdGlvblxuICBnZXRTdWJ3b3JkUGF0dGVybkF0QnVmZmVyUG9zaXRpb25cbiAgZ2V0Tm9uV29yZENoYXJhY3RlcnNGb3JDdXJzb3JcbiAgc2hyaW5rUmFuZ2VFbmRUb0JlZm9yZU5ld0xpbmVcbiAgc2NhbkVkaXRvclxuICBjb2xsZWN0UmFuZ2VJbkJ1ZmZlclJvd1xuICBmaW5kUmFuZ2VJbkJ1ZmZlclJvd1xuICBnZXRMYXJnZXN0Rm9sZFJhbmdlQ29udGFpbnNCdWZmZXJSb3dcbiAgdHJhbnNsYXRlUG9pbnRBbmRDbGlwXG4gIGdldFJhbmdlQnlUcmFuc2xhdGVQb2ludEFuZENsaXBcbiAgZ2V0UGFja2FnZVxuICBzZWFyY2hCeVByb2plY3RGaW5kXG4gIGxpbWl0TnVtYmVyXG4gIGZpbmRSYW5nZUNvbnRhaW5zUG9pbnRcblxuICBpc0VtcHR5LCBpc05vdEVtcHR5XG4gIGlzU2luZ2xlTGluZVJhbmdlLCBpc05vdFNpbmdsZUxpbmVSYW5nZVxuXG4gIGluc2VydFRleHRBdEJ1ZmZlclBvc2l0aW9uXG4gIGVuc3VyZUVuZHNXaXRoTmV3TGluZUZvckJ1ZmZlclJvd1xuICBpc0xlYWRpbmdXaGl0ZVNwYWNlUmFuZ2VcbiAgaXNOb3RMZWFkaW5nV2hpdGVTcGFjZVJhbmdlXG4gIGlzRXNjYXBlZENoYXJSYW5nZVxuXG4gIGZvckVhY2hQYW5lQXhpc1xuICBhZGRDbGFzc0xpc3RcbiAgcmVtb3ZlQ2xhc3NMaXN0XG4gIHRvZ2dsZUNsYXNzTGlzdFxuICB0b2dnbGVDYXNlRm9yQ2hhcmFjdGVyXG4gIHNwbGl0VGV4dEJ5TmV3TGluZVxuICByZXBsYWNlRGVjb3JhdGlvbkNsYXNzQnlcbiAgaHVtYW5pemVCdWZmZXJSYW5nZVxuICBleHBhbmRSYW5nZVRvV2hpdGVTcGFjZXNcbiAgc3BsaXRBbmRKb2luQnlcbiAgc3BsaXRBcmd1bWVudHNcbiAgc2NhbkVkaXRvckluRGlyZWN0aW9uXG4gIGFkanVzdEluZGVudFdpdGhLZWVwaW5nTGF5b3V0XG4gIHJhbmdlQ29udGFpbnNQb2ludFdpdGhFbmRFeGNsdXNpdmVcbiAgdHJhdmVyc2VUZXh0RnJvbVBvaW50XG59XG4iXX0=
