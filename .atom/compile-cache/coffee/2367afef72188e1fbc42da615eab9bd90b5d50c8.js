(function() {
  var AutoFlow, AutoIndent, Base, BufferedProcess, CamelCase, ChangeOrder, ChangeSurround, ChangeSurroundAnyPair, ChangeSurroundAnyPairAllowForwarding, CompactSpaces, ConvertToHardTab, ConvertToSoftTab, DashCase, DecodeUriComponent, DeleteSurround, DeleteSurroundAnyPair, DeleteSurroundAnyPairAllowForwarding, EncodeUriComponent, Indent, Join, JoinBase, JoinByInput, JoinByInputWithKeepingSpace, JoinWithKeepingSpace, LowerCase, MapSurround, Operator, Outdent, PascalCase, Range, RemoveLeadingWhiteSpaces, Replace, ReplaceCharacter, ReplaceWithRegister, Reverse, ReverseInnerAnyPair, Rotate, RotateBackwards, SnakeCase, Sort, SortByNumber, SortCaseInsensitively, SplitArguments, SplitArgumentsOfInnerAnyPair, SplitArgumentsWithRemoveSeparator, SplitByCharacter, SplitString, SplitStringWithKeepingSplitter, Surround, SurroundBase, SurroundSmartWord, SurroundWord, SwapWithRegister, TitleCase, ToggleCase, ToggleCaseAndMoveRight, ToggleLineComments, TransformSmartWordBySelectList, TransformString, TransformStringByExternalCommand, TransformStringBySelectList, TransformWordBySelectList, TrimString, UpperCase, _, adjustIndentWithKeepingLayout, getIndentLevelForBufferRow, isLinewiseRange, isSingleLineText, limitNumber, ref, ref1, splitArguments, splitTextByNewLine, swrap, toggleCaseForCharacter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice;

  _ = require('underscore-plus');

  ref = require('atom'), BufferedProcess = ref.BufferedProcess, Range = ref.Range;

  ref1 = require('./utils'), isSingleLineText = ref1.isSingleLineText, isLinewiseRange = ref1.isLinewiseRange, limitNumber = ref1.limitNumber, toggleCaseForCharacter = ref1.toggleCaseForCharacter, splitTextByNewLine = ref1.splitTextByNewLine, splitArguments = ref1.splitArguments, getIndentLevelForBufferRow = ref1.getIndentLevelForBufferRow, adjustIndentWithKeepingLayout = ref1.adjustIndentWithKeepingLayout;

  swrap = require('./selection-wrapper');

  Base = require('./base');

  Operator = Base.getClass('Operator');

  TransformString = (function(superClass) {
    extend(TransformString, superClass);

    function TransformString() {
      return TransformString.__super__.constructor.apply(this, arguments);
    }

    TransformString.extend(false);

    TransformString.prototype.trackChange = true;

    TransformString.prototype.stayOptionName = 'stayOnTransformString';

    TransformString.prototype.autoIndent = false;

    TransformString.prototype.autoIndentNewline = false;

    TransformString.prototype.autoIndentAfterInsertText = false;

    TransformString.stringTransformers = [];

    TransformString.registerToSelectList = function() {
      return this.stringTransformers.push(this);
    };

    TransformString.prototype.mutateSelection = function(selection) {
      var range, startRow, startRowIndentLevel, text;
      if (text = this.getNewText(selection.getText(), selection)) {
        if (this.autoIndentAfterInsertText) {
          startRow = selection.getBufferRange().start.row;
          startRowIndentLevel = getIndentLevelForBufferRow(this.editor, startRow);
        }
        range = selection.insertText(text, {
          autoIndent: this.autoIndent,
          autoIndentNewline: this.autoIndentNewline
        });
        if (this.autoIndentAfterInsertText) {
          if (this.target.isLinewise()) {
            range = range.translate([0, 0], [-1, 0]);
          }
          this.editor.setIndentationForBufferRow(range.start.row, startRowIndentLevel);
          this.editor.setIndentationForBufferRow(range.end.row, startRowIndentLevel);
          return adjustIndentWithKeepingLayout(this.editor, range.translate([1, 0], [0, 0]));
        }
      }
    };

    return TransformString;

  })(Operator);

  ToggleCase = (function(superClass) {
    extend(ToggleCase, superClass);

    function ToggleCase() {
      return ToggleCase.__super__.constructor.apply(this, arguments);
    }

    ToggleCase.extend();

    ToggleCase.registerToSelectList();

    ToggleCase.description = "`Hello World` -> `hELLO wORLD`";

    ToggleCase.prototype.displayName = 'Toggle ~';

    ToggleCase.prototype.getNewText = function(text) {
      return text.replace(/./g, toggleCaseForCharacter);
    };

    return ToggleCase;

  })(TransformString);

  ToggleCaseAndMoveRight = (function(superClass) {
    extend(ToggleCaseAndMoveRight, superClass);

    function ToggleCaseAndMoveRight() {
      return ToggleCaseAndMoveRight.__super__.constructor.apply(this, arguments);
    }

    ToggleCaseAndMoveRight.extend();

    ToggleCaseAndMoveRight.prototype.flashTarget = false;

    ToggleCaseAndMoveRight.prototype.restorePositions = false;

    ToggleCaseAndMoveRight.prototype.target = 'MoveRight';

    return ToggleCaseAndMoveRight;

  })(ToggleCase);

  UpperCase = (function(superClass) {
    extend(UpperCase, superClass);

    function UpperCase() {
      return UpperCase.__super__.constructor.apply(this, arguments);
    }

    UpperCase.extend();

    UpperCase.registerToSelectList();

    UpperCase.description = "`Hello World` -> `HELLO WORLD`";

    UpperCase.prototype.displayName = 'Upper';

    UpperCase.prototype.getNewText = function(text) {
      return text.toUpperCase();
    };

    return UpperCase;

  })(TransformString);

  LowerCase = (function(superClass) {
    extend(LowerCase, superClass);

    function LowerCase() {
      return LowerCase.__super__.constructor.apply(this, arguments);
    }

    LowerCase.extend();

    LowerCase.registerToSelectList();

    LowerCase.description = "`Hello World` -> `hello world`";

    LowerCase.prototype.displayName = 'Lower';

    LowerCase.prototype.getNewText = function(text) {
      return text.toLowerCase();
    };

    return LowerCase;

  })(TransformString);

  Replace = (function(superClass) {
    extend(Replace, superClass);

    function Replace() {
      return Replace.__super__.constructor.apply(this, arguments);
    }

    Replace.extend();

    Replace.registerToSelectList();

    Replace.prototype.flashCheckpoint = 'did-select-occurrence';

    Replace.prototype.input = null;

    Replace.prototype.requireInput = true;

    Replace.prototype.autoIndentNewline = true;

    Replace.prototype.supportEarlySelect = true;

    Replace.prototype.initialize = function() {
      this.onDidSelectTarget((function(_this) {
        return function() {
          return _this.focusInput(1, true);
        };
      })(this));
      return Replace.__super__.initialize.apply(this, arguments);
    };

    Replace.prototype.getNewText = function(text) {
      var input;
      if (this.target.is('MoveRightBufferColumn') && text.length !== this.getCount()) {
        return;
      }
      input = this.input || "\n";
      if (input === "\n") {
        this.restorePositions = false;
      }
      return text.replace(/./g, input);
    };

    return Replace;

  })(TransformString);

  ReplaceCharacter = (function(superClass) {
    extend(ReplaceCharacter, superClass);

    function ReplaceCharacter() {
      return ReplaceCharacter.__super__.constructor.apply(this, arguments);
    }

    ReplaceCharacter.extend();

    ReplaceCharacter.prototype.target = "MoveRightBufferColumn";

    return ReplaceCharacter;

  })(Replace);

  SplitByCharacter = (function(superClass) {
    extend(SplitByCharacter, superClass);

    function SplitByCharacter() {
      return SplitByCharacter.__super__.constructor.apply(this, arguments);
    }

    SplitByCharacter.extend();

    SplitByCharacter.registerToSelectList();

    SplitByCharacter.prototype.getNewText = function(text) {
      return text.split('').join(' ');
    };

    return SplitByCharacter;

  })(TransformString);

  CamelCase = (function(superClass) {
    extend(CamelCase, superClass);

    function CamelCase() {
      return CamelCase.__super__.constructor.apply(this, arguments);
    }

    CamelCase.extend();

    CamelCase.registerToSelectList();

    CamelCase.prototype.displayName = 'Camelize';

    CamelCase.description = "`hello-world` -> `helloWorld`";

    CamelCase.prototype.getNewText = function(text) {
      return _.camelize(text);
    };

    return CamelCase;

  })(TransformString);

  SnakeCase = (function(superClass) {
    extend(SnakeCase, superClass);

    function SnakeCase() {
      return SnakeCase.__super__.constructor.apply(this, arguments);
    }

    SnakeCase.extend();

    SnakeCase.registerToSelectList();

    SnakeCase.description = "`HelloWorld` -> `hello_world`";

    SnakeCase.prototype.displayName = 'Underscore _';

    SnakeCase.prototype.getNewText = function(text) {
      return _.underscore(text);
    };

    return SnakeCase;

  })(TransformString);

  PascalCase = (function(superClass) {
    extend(PascalCase, superClass);

    function PascalCase() {
      return PascalCase.__super__.constructor.apply(this, arguments);
    }

    PascalCase.extend();

    PascalCase.registerToSelectList();

    PascalCase.description = "`hello_world` -> `HelloWorld`";

    PascalCase.prototype.displayName = 'Pascalize';

    PascalCase.prototype.getNewText = function(text) {
      return _.capitalize(_.camelize(text));
    };

    return PascalCase;

  })(TransformString);

  DashCase = (function(superClass) {
    extend(DashCase, superClass);

    function DashCase() {
      return DashCase.__super__.constructor.apply(this, arguments);
    }

    DashCase.extend();

    DashCase.registerToSelectList();

    DashCase.prototype.displayName = 'Dasherize -';

    DashCase.description = "HelloWorld -> hello-world";

    DashCase.prototype.getNewText = function(text) {
      return _.dasherize(text);
    };

    return DashCase;

  })(TransformString);

  TitleCase = (function(superClass) {
    extend(TitleCase, superClass);

    function TitleCase() {
      return TitleCase.__super__.constructor.apply(this, arguments);
    }

    TitleCase.extend();

    TitleCase.registerToSelectList();

    TitleCase.description = "`HelloWorld` -> `Hello World`";

    TitleCase.prototype.displayName = 'Titlize';

    TitleCase.prototype.getNewText = function(text) {
      return _.humanizeEventName(_.dasherize(text));
    };

    return TitleCase;

  })(TransformString);

  EncodeUriComponent = (function(superClass) {
    extend(EncodeUriComponent, superClass);

    function EncodeUriComponent() {
      return EncodeUriComponent.__super__.constructor.apply(this, arguments);
    }

    EncodeUriComponent.extend();

    EncodeUriComponent.registerToSelectList();

    EncodeUriComponent.description = "`Hello World` -> `Hello%20World`";

    EncodeUriComponent.prototype.displayName = 'Encode URI Component %';

    EncodeUriComponent.prototype.getNewText = function(text) {
      return encodeURIComponent(text);
    };

    return EncodeUriComponent;

  })(TransformString);

  DecodeUriComponent = (function(superClass) {
    extend(DecodeUriComponent, superClass);

    function DecodeUriComponent() {
      return DecodeUriComponent.__super__.constructor.apply(this, arguments);
    }

    DecodeUriComponent.extend();

    DecodeUriComponent.registerToSelectList();

    DecodeUriComponent.description = "`Hello%20World` -> `Hello World`";

    DecodeUriComponent.prototype.displayName = 'Decode URI Component %%';

    DecodeUriComponent.prototype.getNewText = function(text) {
      return decodeURIComponent(text);
    };

    return DecodeUriComponent;

  })(TransformString);

  TrimString = (function(superClass) {
    extend(TrimString, superClass);

    function TrimString() {
      return TrimString.__super__.constructor.apply(this, arguments);
    }

    TrimString.extend();

    TrimString.registerToSelectList();

    TrimString.description = "` hello ` -> `hello`";

    TrimString.prototype.displayName = 'Trim string';

    TrimString.prototype.getNewText = function(text) {
      return text.trim();
    };

    return TrimString;

  })(TransformString);

  CompactSpaces = (function(superClass) {
    extend(CompactSpaces, superClass);

    function CompactSpaces() {
      return CompactSpaces.__super__.constructor.apply(this, arguments);
    }

    CompactSpaces.extend();

    CompactSpaces.registerToSelectList();

    CompactSpaces.description = "`  a    b    c` -> `a b c`";

    CompactSpaces.prototype.displayName = 'Compact space';

    CompactSpaces.prototype.getNewText = function(text) {
      if (text.match(/^[ ]+$/)) {
        return ' ';
      } else {
        return text.replace(/^(\s*)(.*?)(\s*)$/gm, function(m, leading, middle, trailing) {
          return leading + middle.split(/[ \t]+/).join(' ') + trailing;
        });
      }
    };

    return CompactSpaces;

  })(TransformString);

  RemoveLeadingWhiteSpaces = (function(superClass) {
    extend(RemoveLeadingWhiteSpaces, superClass);

    function RemoveLeadingWhiteSpaces() {
      return RemoveLeadingWhiteSpaces.__super__.constructor.apply(this, arguments);
    }

    RemoveLeadingWhiteSpaces.extend();

    RemoveLeadingWhiteSpaces.registerToSelectList();

    RemoveLeadingWhiteSpaces.prototype.wise = 'linewise';

    RemoveLeadingWhiteSpaces.description = "`  a b c` -> `a b c`";

    RemoveLeadingWhiteSpaces.prototype.getNewText = function(text, selection) {
      var trimLeft;
      trimLeft = function(text) {
        return text.trimLeft();
      };
      return splitTextByNewLine(text).map(trimLeft).join("\n") + "\n";
    };

    return RemoveLeadingWhiteSpaces;

  })(TransformString);

  ConvertToSoftTab = (function(superClass) {
    extend(ConvertToSoftTab, superClass);

    function ConvertToSoftTab() {
      return ConvertToSoftTab.__super__.constructor.apply(this, arguments);
    }

    ConvertToSoftTab.extend();

    ConvertToSoftTab.registerToSelectList();

    ConvertToSoftTab.prototype.displayName = 'Soft Tab';

    ConvertToSoftTab.prototype.wise = 'linewise';

    ConvertToSoftTab.prototype.mutateSelection = function(selection) {
      return this.scanForward(/\t/g, {
        scanRange: selection.getBufferRange()
      }, (function(_this) {
        return function(arg) {
          var length, range, replace;
          range = arg.range, replace = arg.replace;
          length = _this.editor.screenRangeForBufferRange(range).getExtent().column;
          return replace(" ".repeat(length));
        };
      })(this));
    };

    return ConvertToSoftTab;

  })(TransformString);

  ConvertToHardTab = (function(superClass) {
    extend(ConvertToHardTab, superClass);

    function ConvertToHardTab() {
      return ConvertToHardTab.__super__.constructor.apply(this, arguments);
    }

    ConvertToHardTab.extend();

    ConvertToHardTab.registerToSelectList();

    ConvertToHardTab.prototype.displayName = 'Hard Tab';

    ConvertToHardTab.prototype.mutateSelection = function(selection) {
      var tabLength;
      tabLength = this.editor.getTabLength();
      return this.scanForward(/[ \t]+/g, {
        scanRange: selection.getBufferRange()
      }, (function(_this) {
        return function(arg) {
          var end, endColumn, newText, nextTabStop, range, ref2, remainder, replace, start, startColumn;
          range = arg.range, replace = arg.replace;
          ref2 = _this.editor.screenRangeForBufferRange(range), start = ref2.start, end = ref2.end;
          startColumn = start.column;
          endColumn = end.column;
          newText = '';
          while (true) {
            remainder = modulo(startColumn, tabLength);
            nextTabStop = startColumn + (remainder === 0 ? tabLength : remainder);
            if (nextTabStop > endColumn) {
              newText += " ".repeat(endColumn - startColumn);
            } else {
              newText += "\t";
            }
            startColumn = nextTabStop;
            if (startColumn >= endColumn) {
              break;
            }
          }
          return replace(newText);
        };
      })(this));
    };

    return ConvertToHardTab;

  })(TransformString);

  TransformStringByExternalCommand = (function(superClass) {
    extend(TransformStringByExternalCommand, superClass);

    function TransformStringByExternalCommand() {
      return TransformStringByExternalCommand.__super__.constructor.apply(this, arguments);
    }

    TransformStringByExternalCommand.extend(false);

    TransformStringByExternalCommand.prototype.autoIndent = true;

    TransformStringByExternalCommand.prototype.command = '';

    TransformStringByExternalCommand.prototype.args = [];

    TransformStringByExternalCommand.prototype.stdoutBySelection = null;

    TransformStringByExternalCommand.prototype.execute = function() {
      this.normalizeSelectionsIfNecessary();
      if (this.selectTarget()) {
        return new Promise((function(_this) {
          return function(resolve) {
            return _this.collect(resolve);
          };
        })(this)).then((function(_this) {
          return function() {
            var i, len, ref2, selection, text;
            ref2 = _this.editor.getSelections();
            for (i = 0, len = ref2.length; i < len; i++) {
              selection = ref2[i];
              text = _this.getNewText(selection.getText(), selection);
              selection.insertText(text, {
                autoIndent: _this.autoIndent
              });
            }
            _this.restoreCursorPositionsIfNecessary();
            return _this.activateMode(_this.finalMode, _this.finalSubmode);
          };
        })(this));
      }
    };

    TransformStringByExternalCommand.prototype.collect = function(resolve) {
      var args, command, fn1, i, len, processFinished, processRunning, ref2, ref3, ref4, selection;
      this.stdoutBySelection = new Map;
      processRunning = processFinished = 0;
      ref2 = this.editor.getSelections();
      fn1 = (function(_this) {
        return function(selection) {
          var exit, stdin, stdout;
          stdin = _this.getStdin(selection);
          stdout = function(output) {
            return _this.stdoutBySelection.set(selection, output);
          };
          exit = function(code) {
            processFinished++;
            if (processRunning === processFinished) {
              return resolve();
            }
          };
          return _this.runExternalCommand({
            command: command,
            args: args,
            stdout: stdout,
            exit: exit,
            stdin: stdin
          });
        };
      })(this);
      for (i = 0, len = ref2.length; i < len; i++) {
        selection = ref2[i];
        ref4 = (ref3 = this.getCommand(selection)) != null ? ref3 : {}, command = ref4.command, args = ref4.args;
        if (!((command != null) && (args != null))) {
          return;
        }
        processRunning++;
        fn1(selection);
      }
    };

    TransformStringByExternalCommand.prototype.runExternalCommand = function(options) {
      var bufferedProcess, stdin;
      stdin = options.stdin;
      delete options.stdin;
      bufferedProcess = new BufferedProcess(options);
      bufferedProcess.onWillThrowError((function(_this) {
        return function(arg) {
          var commandName, error, handle;
          error = arg.error, handle = arg.handle;
          if (error.code === 'ENOENT' && error.syscall.indexOf('spawn') === 0) {
            commandName = _this.constructor.getCommandName();
            console.log(commandName + ": Failed to spawn command " + error.path + ".");
            handle();
          }
          return _this.cancelOperation();
        };
      })(this));
      if (stdin) {
        bufferedProcess.process.stdin.write(stdin);
        return bufferedProcess.process.stdin.end();
      }
    };

    TransformStringByExternalCommand.prototype.getNewText = function(text, selection) {
      var ref2;
      return (ref2 = this.getStdout(selection)) != null ? ref2 : text;
    };

    TransformStringByExternalCommand.prototype.getCommand = function(selection) {
      return {
        command: this.command,
        args: this.args
      };
    };

    TransformStringByExternalCommand.prototype.getStdin = function(selection) {
      return selection.getText();
    };

    TransformStringByExternalCommand.prototype.getStdout = function(selection) {
      return this.stdoutBySelection.get(selection);
    };

    return TransformStringByExternalCommand;

  })(TransformString);

  TransformStringBySelectList = (function(superClass) {
    extend(TransformStringBySelectList, superClass);

    function TransformStringBySelectList() {
      return TransformStringBySelectList.__super__.constructor.apply(this, arguments);
    }

    TransformStringBySelectList.extend();

    TransformStringBySelectList.description = "Interactively choose string transformation operator from select-list";

    TransformStringBySelectList.selectListItems = null;

    TransformStringBySelectList.prototype.requireInput = true;

    TransformStringBySelectList.prototype.getItems = function() {
      var base;
      return (base = this.constructor).selectListItems != null ? base.selectListItems : base.selectListItems = this.constructor.stringTransformers.map(function(klass) {
        var displayName;
        if (klass.prototype.hasOwnProperty('displayName')) {
          displayName = klass.prototype.displayName;
        } else {
          displayName = _.humanizeEventName(_.dasherize(klass.name));
        }
        return {
          name: klass,
          displayName: displayName
        };
      });
    };

    TransformStringBySelectList.prototype.initialize = function() {
      TransformStringBySelectList.__super__.initialize.apply(this, arguments);
      this.vimState.onDidConfirmSelectList((function(_this) {
        return function(item) {
          var transformer;
          transformer = item.name;
          if (transformer.prototype.target != null) {
            _this.target = transformer.prototype.target;
          }
          _this.vimState.reset();
          if (_this.target != null) {
            return _this.vimState.operationStack.run(transformer, {
              target: _this.target
            });
          } else {
            return _this.vimState.operationStack.run(transformer);
          }
        };
      })(this));
      return this.focusSelectList({
        items: this.getItems()
      });
    };

    TransformStringBySelectList.prototype.execute = function() {
      throw new Error(this.name + " should not be executed");
    };

    return TransformStringBySelectList;

  })(TransformString);

  TransformWordBySelectList = (function(superClass) {
    extend(TransformWordBySelectList, superClass);

    function TransformWordBySelectList() {
      return TransformWordBySelectList.__super__.constructor.apply(this, arguments);
    }

    TransformWordBySelectList.extend();

    TransformWordBySelectList.prototype.target = "InnerWord";

    return TransformWordBySelectList;

  })(TransformStringBySelectList);

  TransformSmartWordBySelectList = (function(superClass) {
    extend(TransformSmartWordBySelectList, superClass);

    function TransformSmartWordBySelectList() {
      return TransformSmartWordBySelectList.__super__.constructor.apply(this, arguments);
    }

    TransformSmartWordBySelectList.extend();

    TransformSmartWordBySelectList.description = "Transform InnerSmartWord by `transform-string-by-select-list`";

    TransformSmartWordBySelectList.prototype.target = "InnerSmartWord";

    return TransformSmartWordBySelectList;

  })(TransformStringBySelectList);

  ReplaceWithRegister = (function(superClass) {
    extend(ReplaceWithRegister, superClass);

    function ReplaceWithRegister() {
      return ReplaceWithRegister.__super__.constructor.apply(this, arguments);
    }

    ReplaceWithRegister.extend();

    ReplaceWithRegister.description = "Replace target with specified register value";

    ReplaceWithRegister.prototype.getNewText = function(text) {
      return this.vimState.register.getText();
    };

    return ReplaceWithRegister;

  })(TransformString);

  SwapWithRegister = (function(superClass) {
    extend(SwapWithRegister, superClass);

    function SwapWithRegister() {
      return SwapWithRegister.__super__.constructor.apply(this, arguments);
    }

    SwapWithRegister.extend();

    SwapWithRegister.description = "Swap register value with target";

    SwapWithRegister.prototype.getNewText = function(text, selection) {
      var newText;
      newText = this.vimState.register.getText();
      this.setTextToRegister(text, selection);
      return newText;
    };

    return SwapWithRegister;

  })(TransformString);

  Indent = (function(superClass) {
    extend(Indent, superClass);

    function Indent() {
      return Indent.__super__.constructor.apply(this, arguments);
    }

    Indent.extend();

    Indent.prototype.stayByMarker = true;

    Indent.prototype.setToFirstCharacterOnLinewise = true;

    Indent.prototype.wise = 'linewise';

    Indent.prototype.mutateSelection = function(selection) {
      var count, oldText;
      if (this.target.is('CurrentSelection')) {
        oldText = null;
        count = limitNumber(this.getCount(), {
          max: 100
        });
        return this.countTimes(count, (function(_this) {
          return function(arg) {
            var stop;
            stop = arg.stop;
            oldText = selection.getText();
            _this.indent(selection);
            if (selection.getText() === oldText) {
              return stop();
            }
          };
        })(this));
      } else {
        return this.indent(selection);
      }
    };

    Indent.prototype.indent = function(selection) {
      return selection.indentSelectedRows();
    };

    return Indent;

  })(TransformString);

  Outdent = (function(superClass) {
    extend(Outdent, superClass);

    function Outdent() {
      return Outdent.__super__.constructor.apply(this, arguments);
    }

    Outdent.extend();

    Outdent.prototype.indent = function(selection) {
      return selection.outdentSelectedRows();
    };

    return Outdent;

  })(Indent);

  AutoIndent = (function(superClass) {
    extend(AutoIndent, superClass);

    function AutoIndent() {
      return AutoIndent.__super__.constructor.apply(this, arguments);
    }

    AutoIndent.extend();

    AutoIndent.prototype.indent = function(selection) {
      return selection.autoIndentSelectedRows();
    };

    return AutoIndent;

  })(Indent);

  ToggleLineComments = (function(superClass) {
    extend(ToggleLineComments, superClass);

    function ToggleLineComments() {
      return ToggleLineComments.__super__.constructor.apply(this, arguments);
    }

    ToggleLineComments.extend();

    ToggleLineComments.prototype.stayByMarker = true;

    ToggleLineComments.prototype.wise = 'linewise';

    ToggleLineComments.prototype.mutateSelection = function(selection) {
      return selection.toggleLineComments();
    };

    return ToggleLineComments;

  })(TransformString);

  AutoFlow = (function(superClass) {
    extend(AutoFlow, superClass);

    function AutoFlow() {
      return AutoFlow.__super__.constructor.apply(this, arguments);
    }

    AutoFlow.extend();

    AutoFlow.prototype.mutateSelection = function(selection) {
      return atom.commands.dispatch(this.editorElement, 'autoflow:reflow-selection');
    };

    return AutoFlow;

  })(TransformString);

  SurroundBase = (function(superClass) {
    extend(SurroundBase, superClass);

    function SurroundBase() {
      return SurroundBase.__super__.constructor.apply(this, arguments);
    }

    SurroundBase.extend(false);

    SurroundBase.prototype.pairs = [['[', ']'], ['(', ')'], ['{', '}'], ['<', '>']];

    SurroundBase.prototype.pairCharsAllowForwarding = '[](){}';

    SurroundBase.prototype.input = null;

    SurroundBase.prototype.requireInput = true;

    SurroundBase.prototype.supportEarlySelect = true;

    SurroundBase.prototype.focusInputForSurroundChar = function() {
      var inputUI;
      inputUI = this.newInputUI();
      inputUI.onDidConfirm(this.onConfirmSurroundChar.bind(this));
      inputUI.onDidCancel(this.cancelOperation.bind(this));
      return inputUI.focus(1, true);
    };

    SurroundBase.prototype.focusInputForTargetPairChar = function() {
      var inputUI;
      inputUI = this.newInputUI();
      inputUI.onDidConfirm(this.onConfirmTargetPairChar.bind(this));
      inputUI.onDidCancel(this.cancelOperation.bind(this));
      return inputUI.focus();
    };

    SurroundBase.prototype.getPair = function(char) {
      var pair;
      if (pair = _.detect(this.pairs, function(pair) {
        return indexOf.call(pair, char) >= 0;
      })) {
        return pair;
      } else {
        return [char, char];
      }
    };

    SurroundBase.prototype.surround = function(text, char, options) {
      var close, keepLayout, open, ref2, ref3;
      if (options == null) {
        options = {};
      }
      keepLayout = (ref2 = options.keepLayout) != null ? ref2 : false;
      ref3 = this.getPair(char), open = ref3[0], close = ref3[1];
      if ((!keepLayout) && text.endsWith("\n")) {
        this.autoIndentAfterInsertText = true;
        open += "\n";
        close += "\n";
      }
      if (indexOf.call(this.getConfig('charactersToAddSpaceOnSurround'), char) >= 0 && isSingleLineText(text)) {
        text = ' ' + text + ' ';
      }
      return open + text + close;
    };

    SurroundBase.prototype.deleteSurround = function(text) {
      var close, i, innerText, open;
      open = text[0], innerText = 3 <= text.length ? slice.call(text, 1, i = text.length - 1) : (i = 1, []), close = text[i++];
      innerText = innerText.join('');
      if (isSingleLineText(text) && (open !== close)) {
        return innerText.trim();
      } else {
        return innerText;
      }
    };

    SurroundBase.prototype.onConfirmSurroundChar = function(input1) {
      this.input = input1;
      return this.processOperation();
    };

    SurroundBase.prototype.onConfirmTargetPairChar = function(char) {
      return this.setTarget(this["new"]('APair', {
        pair: this.getPair(char)
      }));
    };

    return SurroundBase;

  })(TransformString);

  Surround = (function(superClass) {
    extend(Surround, superClass);

    function Surround() {
      return Surround.__super__.constructor.apply(this, arguments);
    }

    Surround.extend();

    Surround.description = "Surround target by specified character like `(`, `[`, `\"`";

    Surround.prototype.initialize = function() {
      this.onDidSelectTarget(this.focusInputForSurroundChar.bind(this));
      return Surround.__super__.initialize.apply(this, arguments);
    };

    Surround.prototype.getNewText = function(text) {
      return this.surround(text, this.input);
    };

    return Surround;

  })(SurroundBase);

  SurroundWord = (function(superClass) {
    extend(SurroundWord, superClass);

    function SurroundWord() {
      return SurroundWord.__super__.constructor.apply(this, arguments);
    }

    SurroundWord.extend();

    SurroundWord.description = "Surround **word**";

    SurroundWord.prototype.target = 'InnerWord';

    return SurroundWord;

  })(Surround);

  SurroundSmartWord = (function(superClass) {
    extend(SurroundSmartWord, superClass);

    function SurroundSmartWord() {
      return SurroundSmartWord.__super__.constructor.apply(this, arguments);
    }

    SurroundSmartWord.extend();

    SurroundSmartWord.description = "Surround **smart-word**";

    SurroundSmartWord.prototype.target = 'InnerSmartWord';

    return SurroundSmartWord;

  })(Surround);

  MapSurround = (function(superClass) {
    extend(MapSurround, superClass);

    function MapSurround() {
      return MapSurround.__super__.constructor.apply(this, arguments);
    }

    MapSurround.extend();

    MapSurround.description = "Surround each word(`/\w+/`) within target";

    MapSurround.prototype.occurrence = true;

    MapSurround.prototype.patternForOccurrence = /\w+/g;

    return MapSurround;

  })(Surround);

  DeleteSurround = (function(superClass) {
    extend(DeleteSurround, superClass);

    function DeleteSurround() {
      return DeleteSurround.__super__.constructor.apply(this, arguments);
    }

    DeleteSurround.extend();

    DeleteSurround.description = "Delete specified surround character like `(`, `[`, `\"`";

    DeleteSurround.prototype.initialize = function() {
      if (this.target == null) {
        this.focusInputForTargetPairChar();
      }
      return DeleteSurround.__super__.initialize.apply(this, arguments);
    };

    DeleteSurround.prototype.onConfirmTargetPairChar = function(input) {
      DeleteSurround.__super__.onConfirmTargetPairChar.apply(this, arguments);
      this.input = input;
      return this.processOperation();
    };

    DeleteSurround.prototype.getNewText = function(text) {
      return this.deleteSurround(text);
    };

    return DeleteSurround;

  })(SurroundBase);

  DeleteSurroundAnyPair = (function(superClass) {
    extend(DeleteSurroundAnyPair, superClass);

    function DeleteSurroundAnyPair() {
      return DeleteSurroundAnyPair.__super__.constructor.apply(this, arguments);
    }

    DeleteSurroundAnyPair.extend();

    DeleteSurroundAnyPair.description = "Delete surround character by auto-detect paired char from cursor enclosed pair";

    DeleteSurroundAnyPair.prototype.target = 'AAnyPair';

    DeleteSurroundAnyPair.prototype.requireInput = false;

    return DeleteSurroundAnyPair;

  })(DeleteSurround);

  DeleteSurroundAnyPairAllowForwarding = (function(superClass) {
    extend(DeleteSurroundAnyPairAllowForwarding, superClass);

    function DeleteSurroundAnyPairAllowForwarding() {
      return DeleteSurroundAnyPairAllowForwarding.__super__.constructor.apply(this, arguments);
    }

    DeleteSurroundAnyPairAllowForwarding.extend();

    DeleteSurroundAnyPairAllowForwarding.description = "Delete surround character by auto-detect paired char from cursor enclosed pair and forwarding pair within same line";

    DeleteSurroundAnyPairAllowForwarding.prototype.target = 'AAnyPairAllowForwarding';

    return DeleteSurroundAnyPairAllowForwarding;

  })(DeleteSurroundAnyPair);

  ChangeSurround = (function(superClass) {
    extend(ChangeSurround, superClass);

    function ChangeSurround() {
      return ChangeSurround.__super__.constructor.apply(this, arguments);
    }

    ChangeSurround.extend();

    ChangeSurround.description = "Change surround character, specify both from and to pair char";

    ChangeSurround.prototype.showDeleteCharOnHover = function() {
      var char;
      char = this.editor.getSelectedText()[0];
      return this.vimState.hover.set(char, this.vimState.getOriginalCursorPosition());
    };

    ChangeSurround.prototype.initialize = function() {
      if (this.target != null) {
        this.onDidFailSelectTarget(this.abort.bind(this));
      } else {
        this.onDidFailSelectTarget(this.cancelOperation.bind(this));
        this.focusInputForTargetPairChar();
      }
      ChangeSurround.__super__.initialize.apply(this, arguments);
      return this.onDidSelectTarget((function(_this) {
        return function() {
          _this.showDeleteCharOnHover();
          return _this.focusInputForSurroundChar();
        };
      })(this));
    };

    ChangeSurround.prototype.getNewText = function(text) {
      var innerText;
      innerText = this.deleteSurround(text);
      return this.surround(innerText, this.input, {
        keepLayout: true
      });
    };

    return ChangeSurround;

  })(SurroundBase);

  ChangeSurroundAnyPair = (function(superClass) {
    extend(ChangeSurroundAnyPair, superClass);

    function ChangeSurroundAnyPair() {
      return ChangeSurroundAnyPair.__super__.constructor.apply(this, arguments);
    }

    ChangeSurroundAnyPair.extend();

    ChangeSurroundAnyPair.description = "Change surround character, from char is auto-detected";

    ChangeSurroundAnyPair.prototype.target = "AAnyPair";

    return ChangeSurroundAnyPair;

  })(ChangeSurround);

  ChangeSurroundAnyPairAllowForwarding = (function(superClass) {
    extend(ChangeSurroundAnyPairAllowForwarding, superClass);

    function ChangeSurroundAnyPairAllowForwarding() {
      return ChangeSurroundAnyPairAllowForwarding.__super__.constructor.apply(this, arguments);
    }

    ChangeSurroundAnyPairAllowForwarding.extend();

    ChangeSurroundAnyPairAllowForwarding.description = "Change surround character, from char is auto-detected from enclosed and forwarding area";

    ChangeSurroundAnyPairAllowForwarding.prototype.target = "AAnyPairAllowForwarding";

    return ChangeSurroundAnyPairAllowForwarding;

  })(ChangeSurroundAnyPair);

  Join = (function(superClass) {
    extend(Join, superClass);

    function Join() {
      return Join.__super__.constructor.apply(this, arguments);
    }

    Join.extend();

    Join.prototype.target = "MoveToRelativeLine";

    Join.prototype.flashTarget = false;

    Join.prototype.restorePositions = false;

    Join.prototype.mutateSelection = function(selection) {
      var end, range;
      if (isLinewiseRange(range = selection.getBufferRange())) {
        selection.setBufferRange(range.translate([0, 0], [-1, 2e308]));
      }
      selection.joinLines();
      end = selection.getBufferRange().end;
      return selection.cursor.setBufferPosition(end.translate([0, -1]));
    };

    return Join;

  })(TransformString);

  JoinBase = (function(superClass) {
    extend(JoinBase, superClass);

    function JoinBase() {
      return JoinBase.__super__.constructor.apply(this, arguments);
    }

    JoinBase.extend(false);

    JoinBase.prototype.wise = 'linewise';

    JoinBase.prototype.trim = false;

    JoinBase.prototype.target = "MoveToRelativeLineMinimumOne";

    JoinBase.prototype.initialize = function() {
      if (this.requireInput) {
        this.focusInput(10);
      }
      return JoinBase.__super__.initialize.apply(this, arguments);
    };

    JoinBase.prototype.getNewText = function(text) {
      var pattern;
      if (this.trim) {
        pattern = /\r?\n[ \t]*/g;
      } else {
        pattern = /\r?\n/g;
      }
      return text.trimRight().replace(pattern, this.input) + "\n";
    };

    return JoinBase;

  })(TransformString);

  JoinWithKeepingSpace = (function(superClass) {
    extend(JoinWithKeepingSpace, superClass);

    function JoinWithKeepingSpace() {
      return JoinWithKeepingSpace.__super__.constructor.apply(this, arguments);
    }

    JoinWithKeepingSpace.extend();

    JoinWithKeepingSpace.registerToSelectList();

    JoinWithKeepingSpace.prototype.input = '';

    return JoinWithKeepingSpace;

  })(JoinBase);

  JoinByInput = (function(superClass) {
    extend(JoinByInput, superClass);

    function JoinByInput() {
      return JoinByInput.__super__.constructor.apply(this, arguments);
    }

    JoinByInput.extend();

    JoinByInput.registerToSelectList();

    JoinByInput.description = "Transform multi-line to single-line by with specified separator character";

    JoinByInput.prototype.requireInput = true;

    JoinByInput.prototype.trim = true;

    return JoinByInput;

  })(JoinBase);

  JoinByInputWithKeepingSpace = (function(superClass) {
    extend(JoinByInputWithKeepingSpace, superClass);

    function JoinByInputWithKeepingSpace() {
      return JoinByInputWithKeepingSpace.__super__.constructor.apply(this, arguments);
    }

    JoinByInputWithKeepingSpace.extend();

    JoinByInputWithKeepingSpace.registerToSelectList();

    JoinByInputWithKeepingSpace.description = "Join lines without padding space between each line";

    JoinByInputWithKeepingSpace.prototype.trim = false;

    return JoinByInputWithKeepingSpace;

  })(JoinByInput);

  SplitString = (function(superClass) {
    extend(SplitString, superClass);

    function SplitString() {
      return SplitString.__super__.constructor.apply(this, arguments);
    }

    SplitString.extend();

    SplitString.registerToSelectList();

    SplitString.description = "Split single-line into multi-line by splitting specified separator chars";

    SplitString.prototype.requireInput = true;

    SplitString.prototype.input = null;

    SplitString.prototype.target = "MoveToRelativeLine";

    SplitString.prototype.keepSplitter = false;

    SplitString.prototype.initialize = function() {
      this.onDidSetTarget((function(_this) {
        return function() {
          return _this.focusInput(10);
        };
      })(this));
      return SplitString.__super__.initialize.apply(this, arguments);
    };

    SplitString.prototype.getNewText = function(text) {
      var input, lineSeparator, regex;
      input = this.input || "\\n";
      regex = RegExp("" + (_.escapeRegExp(input)), "g");
      if (this.keepSplitter) {
        lineSeparator = this.input + "\n";
      } else {
        lineSeparator = "\n";
      }
      return text.replace(regex, lineSeparator);
    };

    return SplitString;

  })(TransformString);

  SplitStringWithKeepingSplitter = (function(superClass) {
    extend(SplitStringWithKeepingSplitter, superClass);

    function SplitStringWithKeepingSplitter() {
      return SplitStringWithKeepingSplitter.__super__.constructor.apply(this, arguments);
    }

    SplitStringWithKeepingSplitter.extend();

    SplitStringWithKeepingSplitter.registerToSelectList();

    SplitStringWithKeepingSplitter.prototype.keepSplitter = true;

    return SplitStringWithKeepingSplitter;

  })(SplitString);

  SplitArguments = (function(superClass) {
    extend(SplitArguments, superClass);

    function SplitArguments() {
      return SplitArguments.__super__.constructor.apply(this, arguments);
    }

    SplitArguments.extend();

    SplitArguments.registerToSelectList();

    SplitArguments.prototype.keepSeparator = true;

    SplitArguments.prototype.autoIndentAfterInsertText = true;

    SplitArguments.prototype.getNewText = function(text) {
      var allTokens, newText, ref2, type;
      allTokens = splitArguments(text.trim());
      newText = '';
      while (allTokens.length) {
        ref2 = allTokens.shift(), text = ref2.text, type = ref2.type;
        if (type === 'separator') {
          if (this.keepSeparator) {
            text = text.trim() + "\n";
          } else {
            text = "\n";
          }
        }
        newText += text;
      }
      return "\n" + newText + "\n";
    };

    return SplitArguments;

  })(TransformString);

  SplitArgumentsWithRemoveSeparator = (function(superClass) {
    extend(SplitArgumentsWithRemoveSeparator, superClass);

    function SplitArgumentsWithRemoveSeparator() {
      return SplitArgumentsWithRemoveSeparator.__super__.constructor.apply(this, arguments);
    }

    SplitArgumentsWithRemoveSeparator.extend();

    SplitArgumentsWithRemoveSeparator.registerToSelectList();

    SplitArgumentsWithRemoveSeparator.prototype.keepSeparator = false;

    return SplitArgumentsWithRemoveSeparator;

  })(SplitArguments);

  SplitArgumentsOfInnerAnyPair = (function(superClass) {
    extend(SplitArgumentsOfInnerAnyPair, superClass);

    function SplitArgumentsOfInnerAnyPair() {
      return SplitArgumentsOfInnerAnyPair.__super__.constructor.apply(this, arguments);
    }

    SplitArgumentsOfInnerAnyPair.extend();

    SplitArgumentsOfInnerAnyPair.registerToSelectList();

    SplitArgumentsOfInnerAnyPair.prototype.target = "InnerAnyPair";

    return SplitArgumentsOfInnerAnyPair;

  })(SplitArguments);

  ChangeOrder = (function(superClass) {
    extend(ChangeOrder, superClass);

    function ChangeOrder() {
      return ChangeOrder.__super__.constructor.apply(this, arguments);
    }

    ChangeOrder.extend(false);

    ChangeOrder.prototype.getNewText = function(text) {
      if (this.target.isLinewise()) {
        return this.getNewList(splitTextByNewLine(text)).join("\n") + "\n";
      } else {
        return this.sortArgumentsInTextBy(text, (function(_this) {
          return function(args) {
            return _this.getNewList(args);
          };
        })(this));
      }
    };

    ChangeOrder.prototype.sortArgumentsInTextBy = function(text, fn) {
      var allTokens, args, end, leadingSpaces, newArgs, newText, ref2, start, trailingSpaces, type;
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
      allTokens = splitArguments(text);
      args = allTokens.filter(function(token) {
        return token.type === 'argument';
      }).map(function(token) {
        return token.text;
      });
      newArgs = fn(args);
      newText = '';
      while (allTokens.length) {
        ref2 = allTokens.shift(), text = ref2.text, type = ref2.type;
        newText += (function() {
          switch (type) {
            case 'separator':
              return text;
            case 'argument':
              return newArgs.shift();
          }
        })();
      }
      return leadingSpaces + newText + trailingSpaces;
    };

    return ChangeOrder;

  })(TransformString);

  Reverse = (function(superClass) {
    extend(Reverse, superClass);

    function Reverse() {
      return Reverse.__super__.constructor.apply(this, arguments);
    }

    Reverse.extend();

    Reverse.registerToSelectList();

    Reverse.prototype.getNewList = function(rows) {
      return rows.reverse();
    };

    return Reverse;

  })(ChangeOrder);

  ReverseInnerAnyPair = (function(superClass) {
    extend(ReverseInnerAnyPair, superClass);

    function ReverseInnerAnyPair() {
      return ReverseInnerAnyPair.__super__.constructor.apply(this, arguments);
    }

    ReverseInnerAnyPair.extend();

    ReverseInnerAnyPair.prototype.target = "InnerAnyPair";

    return ReverseInnerAnyPair;

  })(Reverse);

  Rotate = (function(superClass) {
    extend(Rotate, superClass);

    function Rotate() {
      return Rotate.__super__.constructor.apply(this, arguments);
    }

    Rotate.extend();

    Rotate.registerToSelectList();

    Rotate.prototype.getNewList = function(rows) {
      rows.unshift(rows.pop());
      return rows;
    };

    return Rotate;

  })(ChangeOrder);

  RotateBackwards = (function(superClass) {
    extend(RotateBackwards, superClass);

    function RotateBackwards() {
      return RotateBackwards.__super__.constructor.apply(this, arguments);
    }

    RotateBackwards.extend();

    RotateBackwards.registerToSelectList();

    RotateBackwards.prototype.getNewList = function(rows) {
      rows.push(rows.shift());
      return rows;
    };

    return RotateBackwards;

  })(ChangeOrder);

  Sort = (function(superClass) {
    extend(Sort, superClass);

    function Sort() {
      return Sort.__super__.constructor.apply(this, arguments);
    }

    Sort.extend();

    Sort.registerToSelectList();

    Sort.description = "Sort alphabetically";

    Sort.prototype.getNewList = function(rows) {
      return rows.sort();
    };

    return Sort;

  })(ChangeOrder);

  SortCaseInsensitively = (function(superClass) {
    extend(SortCaseInsensitively, superClass);

    function SortCaseInsensitively() {
      return SortCaseInsensitively.__super__.constructor.apply(this, arguments);
    }

    SortCaseInsensitively.extend();

    SortCaseInsensitively.registerToSelectList();

    SortCaseInsensitively.description = "Sort alphabetically with case insensitively";

    SortCaseInsensitively.prototype.getNewList = function(rows) {
      return rows.sort(function(rowA, rowB) {
        return rowA.localeCompare(rowB, {
          sensitivity: 'base'
        });
      });
    };

    return SortCaseInsensitively;

  })(ChangeOrder);

  SortByNumber = (function(superClass) {
    extend(SortByNumber, superClass);

    function SortByNumber() {
      return SortByNumber.__super__.constructor.apply(this, arguments);
    }

    SortByNumber.extend();

    SortByNumber.registerToSelectList();

    SortByNumber.description = "Sort numerically";

    SortByNumber.prototype.getNewList = function(rows) {
      return _.sortBy(rows, function(row) {
        return Number.parseInt(row) || 2e308;
      });
    };

    return SortByNumber;

  })(ChangeOrder);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMvbGliL29wZXJhdG9yLXRyYW5zZm9ybS1zdHJpbmcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwyd0NBQUE7SUFBQTs7Ozs7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixNQUEyQixPQUFBLENBQVEsTUFBUixDQUEzQixFQUFDLHFDQUFELEVBQWtCOztFQUVsQixPQVNJLE9BQUEsQ0FBUSxTQUFSLENBVEosRUFDRSx3Q0FERixFQUVFLHNDQUZGLEVBR0UsOEJBSEYsRUFJRSxvREFKRixFQUtFLDRDQUxGLEVBTUUsb0NBTkYsRUFPRSw0REFQRixFQVFFOztFQUVGLEtBQUEsR0FBUSxPQUFBLENBQVEscUJBQVI7O0VBQ1IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztFQUNQLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBTCxDQUFjLFVBQWQ7O0VBSUw7Ozs7Ozs7SUFDSixlQUFDLENBQUEsTUFBRCxDQUFRLEtBQVI7OzhCQUNBLFdBQUEsR0FBYTs7OEJBQ2IsY0FBQSxHQUFnQjs7OEJBQ2hCLFVBQUEsR0FBWTs7OEJBQ1osaUJBQUEsR0FBbUI7OzhCQUNuQix5QkFBQSxHQUEyQjs7SUFDM0IsZUFBQyxDQUFBLGtCQUFELEdBQXFCOztJQUVyQixlQUFDLENBQUEsb0JBQUQsR0FBdUIsU0FBQTthQUNyQixJQUFDLENBQUEsa0JBQWtCLENBQUMsSUFBcEIsQ0FBeUIsSUFBekI7SUFEcUI7OzhCQUd2QixlQUFBLEdBQWlCLFNBQUMsU0FBRDtBQUNmLFVBQUE7TUFBQSxJQUFHLElBQUEsR0FBTyxJQUFDLENBQUEsVUFBRCxDQUFZLFNBQVMsQ0FBQyxPQUFWLENBQUEsQ0FBWixFQUFpQyxTQUFqQyxDQUFWO1FBQ0UsSUFBRyxJQUFDLENBQUEseUJBQUo7VUFDRSxRQUFBLEdBQVcsU0FBUyxDQUFDLGNBQVYsQ0FBQSxDQUEwQixDQUFDLEtBQUssQ0FBQztVQUM1QyxtQkFBQSxHQUFzQiwwQkFBQSxDQUEyQixJQUFDLENBQUEsTUFBNUIsRUFBb0MsUUFBcEMsRUFGeEI7O1FBR0EsS0FBQSxHQUFRLFNBQVMsQ0FBQyxVQUFWLENBQXFCLElBQXJCLEVBQTJCO1VBQUUsWUFBRCxJQUFDLENBQUEsVUFBRjtVQUFlLG1CQUFELElBQUMsQ0FBQSxpQkFBZjtTQUEzQjtRQUNSLElBQUcsSUFBQyxDQUFBLHlCQUFKO1VBRUUsSUFBNEMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQUEsQ0FBNUM7WUFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFoQixFQUF3QixDQUFDLENBQUMsQ0FBRixFQUFLLENBQUwsQ0FBeEIsRUFBUjs7VUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLDBCQUFSLENBQW1DLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBL0MsRUFBb0QsbUJBQXBEO1VBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQywwQkFBUixDQUFtQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQTdDLEVBQWtELG1CQUFsRDtpQkFFQSw2QkFBQSxDQUE4QixJQUFDLENBQUEsTUFBL0IsRUFBdUMsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFoQixFQUF3QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXhCLENBQXZDLEVBTkY7U0FMRjs7SUFEZTs7OztLQVpXOztFQTBCeEI7Ozs7Ozs7SUFDSixVQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLFVBQUMsQ0FBQSxvQkFBRCxDQUFBOztJQUNBLFVBQUMsQ0FBQSxXQUFELEdBQWM7O3lCQUNkLFdBQUEsR0FBYTs7eUJBRWIsVUFBQSxHQUFZLFNBQUMsSUFBRDthQUNWLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixFQUFtQixzQkFBbkI7SUFEVTs7OztLQU5XOztFQVNuQjs7Ozs7OztJQUNKLHNCQUFDLENBQUEsTUFBRCxDQUFBOztxQ0FDQSxXQUFBLEdBQWE7O3FDQUNiLGdCQUFBLEdBQWtCOztxQ0FDbEIsTUFBQSxHQUFROzs7O0tBSjJCOztFQU0vQjs7Ozs7OztJQUNKLFNBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EsU0FBQyxDQUFBLG9CQUFELENBQUE7O0lBQ0EsU0FBQyxDQUFBLFdBQUQsR0FBYzs7d0JBQ2QsV0FBQSxHQUFhOzt3QkFDYixVQUFBLEdBQVksU0FBQyxJQUFEO2FBQ1YsSUFBSSxDQUFDLFdBQUwsQ0FBQTtJQURVOzs7O0tBTFU7O0VBUWxCOzs7Ozs7O0lBQ0osU0FBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSxTQUFDLENBQUEsb0JBQUQsQ0FBQTs7SUFDQSxTQUFDLENBQUEsV0FBRCxHQUFjOzt3QkFDZCxXQUFBLEdBQWE7O3dCQUNiLFVBQUEsR0FBWSxTQUFDLElBQUQ7YUFDVixJQUFJLENBQUMsV0FBTCxDQUFBO0lBRFU7Ozs7S0FMVTs7RUFVbEI7Ozs7Ozs7SUFDSixPQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLE9BQUMsQ0FBQSxvQkFBRCxDQUFBOztzQkFDQSxlQUFBLEdBQWlCOztzQkFDakIsS0FBQSxHQUFPOztzQkFDUCxZQUFBLEdBQWM7O3NCQUNkLGlCQUFBLEdBQW1COztzQkFDbkIsa0JBQUEsR0FBb0I7O3NCQUVwQixVQUFBLEdBQVksU0FBQTtNQUNWLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2pCLEtBQUMsQ0FBQSxVQUFELENBQVksQ0FBWixFQUFlLElBQWY7UUFEaUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CO2FBRUEseUNBQUEsU0FBQTtJQUhVOztzQkFLWixVQUFBLEdBQVksU0FBQyxJQUFEO0FBQ1YsVUFBQTtNQUFBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVcsdUJBQVgsQ0FBQSxJQUF3QyxJQUFJLENBQUMsTUFBTCxLQUFpQixJQUFDLENBQUEsUUFBRCxDQUFBLENBQTVEO0FBQ0UsZUFERjs7TUFHQSxLQUFBLEdBQVEsSUFBQyxDQUFBLEtBQUQsSUFBVTtNQUNsQixJQUFHLEtBQUEsS0FBUyxJQUFaO1FBQ0UsSUFBQyxDQUFBLGdCQUFELEdBQW9CLE1BRHRCOzthQUVBLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixFQUFtQixLQUFuQjtJQVBVOzs7O0tBZFE7O0VBdUJoQjs7Ozs7OztJQUNKLGdCQUFDLENBQUEsTUFBRCxDQUFBOzsrQkFDQSxNQUFBLEdBQVE7Ozs7S0FGcUI7O0VBTXpCOzs7Ozs7O0lBQ0osZ0JBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EsZ0JBQUMsQ0FBQSxvQkFBRCxDQUFBOzsrQkFDQSxVQUFBLEdBQVksU0FBQyxJQUFEO2FBQ1YsSUFBSSxDQUFDLEtBQUwsQ0FBVyxFQUFYLENBQWMsQ0FBQyxJQUFmLENBQW9CLEdBQXBCO0lBRFU7Ozs7S0FIaUI7O0VBTXpCOzs7Ozs7O0lBQ0osU0FBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSxTQUFDLENBQUEsb0JBQUQsQ0FBQTs7d0JBQ0EsV0FBQSxHQUFhOztJQUNiLFNBQUMsQ0FBQSxXQUFELEdBQWM7O3dCQUNkLFVBQUEsR0FBWSxTQUFDLElBQUQ7YUFDVixDQUFDLENBQUMsUUFBRixDQUFXLElBQVg7SUFEVTs7OztLQUxVOztFQVFsQjs7Ozs7OztJQUNKLFNBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EsU0FBQyxDQUFBLG9CQUFELENBQUE7O0lBQ0EsU0FBQyxDQUFBLFdBQUQsR0FBYzs7d0JBQ2QsV0FBQSxHQUFhOzt3QkFDYixVQUFBLEdBQVksU0FBQyxJQUFEO2FBQ1YsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxJQUFiO0lBRFU7Ozs7S0FMVTs7RUFRbEI7Ozs7Ozs7SUFDSixVQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLFVBQUMsQ0FBQSxvQkFBRCxDQUFBOztJQUNBLFVBQUMsQ0FBQSxXQUFELEdBQWM7O3lCQUNkLFdBQUEsR0FBYTs7eUJBQ2IsVUFBQSxHQUFZLFNBQUMsSUFBRDthQUNWLENBQUMsQ0FBQyxVQUFGLENBQWEsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxJQUFYLENBQWI7SUFEVTs7OztLQUxXOztFQVFuQjs7Ozs7OztJQUNKLFFBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EsUUFBQyxDQUFBLG9CQUFELENBQUE7O3VCQUNBLFdBQUEsR0FBYTs7SUFDYixRQUFDLENBQUEsV0FBRCxHQUFjOzt1QkFDZCxVQUFBLEdBQVksU0FBQyxJQUFEO2FBQ1YsQ0FBQyxDQUFDLFNBQUYsQ0FBWSxJQUFaO0lBRFU7Ozs7S0FMUzs7RUFRakI7Ozs7Ozs7SUFDSixTQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLFNBQUMsQ0FBQSxvQkFBRCxDQUFBOztJQUNBLFNBQUMsQ0FBQSxXQUFELEdBQWM7O3dCQUNkLFdBQUEsR0FBYTs7d0JBQ2IsVUFBQSxHQUFZLFNBQUMsSUFBRDthQUNWLENBQUMsQ0FBQyxpQkFBRixDQUFvQixDQUFDLENBQUMsU0FBRixDQUFZLElBQVosQ0FBcEI7SUFEVTs7OztLQUxVOztFQVFsQjs7Ozs7OztJQUNKLGtCQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLGtCQUFDLENBQUEsb0JBQUQsQ0FBQTs7SUFDQSxrQkFBQyxDQUFBLFdBQUQsR0FBYzs7aUNBQ2QsV0FBQSxHQUFhOztpQ0FDYixVQUFBLEdBQVksU0FBQyxJQUFEO2FBQ1Ysa0JBQUEsQ0FBbUIsSUFBbkI7SUFEVTs7OztLQUxtQjs7RUFRM0I7Ozs7Ozs7SUFDSixrQkFBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSxrQkFBQyxDQUFBLG9CQUFELENBQUE7O0lBQ0Esa0JBQUMsQ0FBQSxXQUFELEdBQWM7O2lDQUNkLFdBQUEsR0FBYTs7aUNBQ2IsVUFBQSxHQUFZLFNBQUMsSUFBRDthQUNWLGtCQUFBLENBQW1CLElBQW5CO0lBRFU7Ozs7S0FMbUI7O0VBUTNCOzs7Ozs7O0lBQ0osVUFBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSxVQUFDLENBQUEsb0JBQUQsQ0FBQTs7SUFDQSxVQUFDLENBQUEsV0FBRCxHQUFjOzt5QkFDZCxXQUFBLEdBQWE7O3lCQUNiLFVBQUEsR0FBWSxTQUFDLElBQUQ7YUFDVixJQUFJLENBQUMsSUFBTCxDQUFBO0lBRFU7Ozs7S0FMVzs7RUFRbkI7Ozs7Ozs7SUFDSixhQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLGFBQUMsQ0FBQSxvQkFBRCxDQUFBOztJQUNBLGFBQUMsQ0FBQSxXQUFELEdBQWM7OzRCQUNkLFdBQUEsR0FBYTs7NEJBQ2IsVUFBQSxHQUFZLFNBQUMsSUFBRDtNQUNWLElBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxRQUFYLENBQUg7ZUFDRSxJQURGO09BQUEsTUFBQTtlQUlFLElBQUksQ0FBQyxPQUFMLENBQWEscUJBQWIsRUFBb0MsU0FBQyxDQUFELEVBQUksT0FBSixFQUFhLE1BQWIsRUFBcUIsUUFBckI7aUJBQ2xDLE9BQUEsR0FBVSxNQUFNLENBQUMsS0FBUCxDQUFhLFFBQWIsQ0FBc0IsQ0FBQyxJQUF2QixDQUE0QixHQUE1QixDQUFWLEdBQTZDO1FBRFgsQ0FBcEMsRUFKRjs7SUFEVTs7OztLQUxjOztFQWF0Qjs7Ozs7OztJQUNKLHdCQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLHdCQUFDLENBQUEsb0JBQUQsQ0FBQTs7dUNBQ0EsSUFBQSxHQUFNOztJQUNOLHdCQUFDLENBQUEsV0FBRCxHQUFjOzt1Q0FDZCxVQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sU0FBUDtBQUNWLFVBQUE7TUFBQSxRQUFBLEdBQVcsU0FBQyxJQUFEO2VBQVUsSUFBSSxDQUFDLFFBQUwsQ0FBQTtNQUFWO2FBQ1gsa0JBQUEsQ0FBbUIsSUFBbkIsQ0FBd0IsQ0FBQyxHQUF6QixDQUE2QixRQUE3QixDQUFzQyxDQUFDLElBQXZDLENBQTRDLElBQTVDLENBQUEsR0FBb0Q7SUFGMUM7Ozs7S0FMeUI7O0VBU2pDOzs7Ozs7O0lBQ0osZ0JBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EsZ0JBQUMsQ0FBQSxvQkFBRCxDQUFBOzsrQkFDQSxXQUFBLEdBQWE7OytCQUNiLElBQUEsR0FBTTs7K0JBRU4sZUFBQSxHQUFpQixTQUFDLFNBQUQ7YUFDZixJQUFDLENBQUEsV0FBRCxDQUFhLEtBQWIsRUFBb0I7UUFBQyxTQUFBLEVBQVcsU0FBUyxDQUFDLGNBQVYsQ0FBQSxDQUFaO09BQXBCLEVBQTZELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBRzNELGNBQUE7VUFINkQsbUJBQU87VUFHcEUsTUFBQSxHQUFTLEtBQUMsQ0FBQSxNQUFNLENBQUMseUJBQVIsQ0FBa0MsS0FBbEMsQ0FBd0MsQ0FBQyxTQUF6QyxDQUFBLENBQW9ELENBQUM7aUJBQzlELE9BQUEsQ0FBUSxHQUFHLENBQUMsTUFBSixDQUFXLE1BQVgsQ0FBUjtRQUoyRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0Q7SUFEZTs7OztLQU5ZOztFQWF6Qjs7Ozs7OztJQUNKLGdCQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLGdCQUFDLENBQUEsb0JBQUQsQ0FBQTs7K0JBQ0EsV0FBQSxHQUFhOzsrQkFFYixlQUFBLEdBQWlCLFNBQUMsU0FBRDtBQUNmLFVBQUE7TUFBQSxTQUFBLEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQUE7YUFDWixJQUFDLENBQUEsV0FBRCxDQUFhLFNBQWIsRUFBd0I7UUFBQyxTQUFBLEVBQVcsU0FBUyxDQUFDLGNBQVYsQ0FBQSxDQUFaO09BQXhCLEVBQWlFLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQy9ELGNBQUE7VUFEaUUsbUJBQU87VUFDeEUsT0FBZSxLQUFDLENBQUEsTUFBTSxDQUFDLHlCQUFSLENBQWtDLEtBQWxDLENBQWYsRUFBQyxrQkFBRCxFQUFRO1VBQ1IsV0FBQSxHQUFjLEtBQUssQ0FBQztVQUNwQixTQUFBLEdBQVksR0FBRyxDQUFDO1VBSWhCLE9BQUEsR0FBVTtBQUNWLGlCQUFBLElBQUE7WUFDRSxTQUFBLFVBQVksYUFBZTtZQUMzQixXQUFBLEdBQWMsV0FBQSxHQUFjLENBQUksU0FBQSxLQUFhLENBQWhCLEdBQXVCLFNBQXZCLEdBQXNDLFNBQXZDO1lBQzVCLElBQUcsV0FBQSxHQUFjLFNBQWpCO2NBQ0UsT0FBQSxJQUFXLEdBQUcsQ0FBQyxNQUFKLENBQVcsU0FBQSxHQUFZLFdBQXZCLEVBRGI7YUFBQSxNQUFBO2NBR0UsT0FBQSxJQUFXLEtBSGI7O1lBSUEsV0FBQSxHQUFjO1lBQ2QsSUFBUyxXQUFBLElBQWUsU0FBeEI7QUFBQSxvQkFBQTs7VUFSRjtpQkFVQSxPQUFBLENBQVEsT0FBUjtRQWxCK0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpFO0lBRmU7Ozs7S0FMWTs7RUE0QnpCOzs7Ozs7O0lBQ0osZ0NBQUMsQ0FBQSxNQUFELENBQVEsS0FBUjs7K0NBQ0EsVUFBQSxHQUFZOzsrQ0FDWixPQUFBLEdBQVM7OytDQUNULElBQUEsR0FBTTs7K0NBQ04saUJBQUEsR0FBbUI7OytDQUVuQixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSw4QkFBRCxDQUFBO01BQ0EsSUFBRyxJQUFDLENBQUEsWUFBRCxDQUFBLENBQUg7ZUFDTSxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLE9BQUQ7bUJBQ1YsS0FBQyxDQUFBLE9BQUQsQ0FBUyxPQUFUO1VBRFU7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVIsQ0FFSixDQUFDLElBRkcsQ0FFRSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQ0osZ0JBQUE7QUFBQTtBQUFBLGlCQUFBLHNDQUFBOztjQUNFLElBQUEsR0FBTyxLQUFDLENBQUEsVUFBRCxDQUFZLFNBQVMsQ0FBQyxPQUFWLENBQUEsQ0FBWixFQUFpQyxTQUFqQztjQUNQLFNBQVMsQ0FBQyxVQUFWLENBQXFCLElBQXJCLEVBQTJCO2dCQUFFLFlBQUQsS0FBQyxDQUFBLFVBQUY7ZUFBM0I7QUFGRjtZQUdBLEtBQUMsQ0FBQSxpQ0FBRCxDQUFBO21CQUNBLEtBQUMsQ0FBQSxZQUFELENBQWMsS0FBQyxDQUFBLFNBQWYsRUFBMEIsS0FBQyxDQUFBLFlBQTNCO1VBTEk7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRkYsRUFETjs7SUFGTzs7K0NBWVQsT0FBQSxHQUFTLFNBQUMsT0FBRDtBQUNQLFVBQUE7TUFBQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSTtNQUN6QixjQUFBLEdBQWlCLGVBQUEsR0FBa0I7QUFDbkM7WUFJSyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsU0FBRDtBQUNELGNBQUE7VUFBQSxLQUFBLEdBQVEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO1VBQ1IsTUFBQSxHQUFTLFNBQUMsTUFBRDttQkFDUCxLQUFDLENBQUEsaUJBQWlCLENBQUMsR0FBbkIsQ0FBdUIsU0FBdkIsRUFBa0MsTUFBbEM7VUFETztVQUVULElBQUEsR0FBTyxTQUFDLElBQUQ7WUFDTCxlQUFBO1lBQ0EsSUFBYyxjQUFBLEtBQWtCLGVBQWhDO3FCQUFBLE9BQUEsQ0FBQSxFQUFBOztVQUZLO2lCQUdQLEtBQUMsQ0FBQSxrQkFBRCxDQUFvQjtZQUFDLFNBQUEsT0FBRDtZQUFVLE1BQUEsSUFBVjtZQUFnQixRQUFBLE1BQWhCO1lBQXdCLE1BQUEsSUFBeEI7WUFBOEIsT0FBQSxLQUE5QjtXQUFwQjtRQVBDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtBQUpMLFdBQUEsc0NBQUE7O1FBQ0UsNERBQTJDLEVBQTNDLEVBQUMsc0JBQUQsRUFBVTtRQUNWLElBQUEsQ0FBYyxDQUFDLGlCQUFBLElBQWEsY0FBZCxDQUFkO0FBQUEsaUJBQUE7O1FBQ0EsY0FBQTtZQUNJO0FBSk47SUFITzs7K0NBZ0JULGtCQUFBLEdBQW9CLFNBQUMsT0FBRDtBQUNsQixVQUFBO01BQUEsS0FBQSxHQUFRLE9BQU8sQ0FBQztNQUNoQixPQUFPLE9BQU8sQ0FBQztNQUNmLGVBQUEsR0FBc0IsSUFBQSxlQUFBLENBQWdCLE9BQWhCO01BQ3RCLGVBQWUsQ0FBQyxnQkFBaEIsQ0FBaUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7QUFFL0IsY0FBQTtVQUZpQyxtQkFBTztVQUV4QyxJQUFHLEtBQUssQ0FBQyxJQUFOLEtBQWMsUUFBZCxJQUEyQixLQUFLLENBQUMsT0FBTyxDQUFDLE9BQWQsQ0FBc0IsT0FBdEIsQ0FBQSxLQUFrQyxDQUFoRTtZQUNFLFdBQUEsR0FBYyxLQUFDLENBQUEsV0FBVyxDQUFDLGNBQWIsQ0FBQTtZQUNkLE9BQU8sQ0FBQyxHQUFSLENBQWUsV0FBRCxHQUFhLDRCQUFiLEdBQXlDLEtBQUssQ0FBQyxJQUEvQyxHQUFvRCxHQUFsRTtZQUNBLE1BQUEsQ0FBQSxFQUhGOztpQkFJQSxLQUFDLENBQUEsZUFBRCxDQUFBO1FBTitCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQztNQVFBLElBQUcsS0FBSDtRQUNFLGVBQWUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQTlCLENBQW9DLEtBQXBDO2VBQ0EsZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBOUIsQ0FBQSxFQUZGOztJQVprQjs7K0NBZ0JwQixVQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sU0FBUDtBQUNWLFVBQUE7aUVBQXdCO0lBRGQ7OytDQUlaLFVBQUEsR0FBWSxTQUFDLFNBQUQ7YUFBZTtRQUFFLFNBQUQsSUFBQyxDQUFBLE9BQUY7UUFBWSxNQUFELElBQUMsQ0FBQSxJQUFaOztJQUFmOzsrQ0FDWixRQUFBLEdBQVUsU0FBQyxTQUFEO2FBQWUsU0FBUyxDQUFDLE9BQVYsQ0FBQTtJQUFmOzsrQ0FDVixTQUFBLEdBQVcsU0FBQyxTQUFEO2FBQWUsSUFBQyxDQUFBLGlCQUFpQixDQUFDLEdBQW5CLENBQXVCLFNBQXZCO0lBQWY7Ozs7S0F6RGtDOztFQTREekM7Ozs7Ozs7SUFDSiwyQkFBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSwyQkFBQyxDQUFBLFdBQUQsR0FBYzs7SUFDZCwyQkFBQyxDQUFBLGVBQUQsR0FBa0I7OzBDQUNsQixZQUFBLEdBQWM7OzBDQUVkLFFBQUEsR0FBVSxTQUFBO0FBQ1IsVUFBQTtxRUFBWSxDQUFDLHNCQUFELENBQUMsa0JBQW1CLElBQUMsQ0FBQSxXQUFXLENBQUMsa0JBQWtCLENBQUMsR0FBaEMsQ0FBb0MsU0FBQyxLQUFEO0FBQ2xFLFlBQUE7UUFBQSxJQUFHLEtBQUssQ0FBQSxTQUFFLENBQUEsY0FBUCxDQUFzQixhQUF0QixDQUFIO1VBQ0UsV0FBQSxHQUFjLEtBQUssQ0FBQSxTQUFFLENBQUEsWUFEdkI7U0FBQSxNQUFBO1VBR0UsV0FBQSxHQUFjLENBQUMsQ0FBQyxpQkFBRixDQUFvQixDQUFDLENBQUMsU0FBRixDQUFZLEtBQUssQ0FBQyxJQUFsQixDQUFwQixFQUhoQjs7ZUFJQTtVQUFDLElBQUEsRUFBTSxLQUFQO1VBQWMsYUFBQSxXQUFkOztNQUxrRSxDQUFwQztJQUR4Qjs7MENBUVYsVUFBQSxHQUFZLFNBQUE7TUFDViw2REFBQSxTQUFBO01BRUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxzQkFBVixDQUFpQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtBQUMvQixjQUFBO1VBQUEsV0FBQSxHQUFjLElBQUksQ0FBQztVQUNuQixJQUFpQyxvQ0FBakM7WUFBQSxLQUFDLENBQUEsTUFBRCxHQUFVLFdBQVcsQ0FBQSxTQUFFLENBQUEsT0FBdkI7O1VBQ0EsS0FBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQUE7VUFDQSxJQUFHLG9CQUFIO21CQUNFLEtBQUMsQ0FBQSxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQXpCLENBQTZCLFdBQTdCLEVBQTBDO2NBQUUsUUFBRCxLQUFDLENBQUEsTUFBRjthQUExQyxFQURGO1dBQUEsTUFBQTttQkFHRSxLQUFDLENBQUEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUF6QixDQUE2QixXQUE3QixFQUhGOztRQUorQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakM7YUFTQSxJQUFDLENBQUEsZUFBRCxDQUFpQjtRQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsUUFBRCxDQUFBLENBQVA7T0FBakI7SUFaVTs7MENBY1osT0FBQSxHQUFTLFNBQUE7QUFFUCxZQUFVLElBQUEsS0FBQSxDQUFTLElBQUMsQ0FBQSxJQUFGLEdBQU8seUJBQWY7SUFGSDs7OztLQTVCK0I7O0VBZ0NwQzs7Ozs7OztJQUNKLHlCQUFDLENBQUEsTUFBRCxDQUFBOzt3Q0FDQSxNQUFBLEdBQVE7Ozs7S0FGOEI7O0VBSWxDOzs7Ozs7O0lBQ0osOEJBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EsOEJBQUMsQ0FBQSxXQUFELEdBQWM7OzZDQUNkLE1BQUEsR0FBUTs7OztLQUhtQzs7RUFNdkM7Ozs7Ozs7SUFDSixtQkFBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSxtQkFBQyxDQUFBLFdBQUQsR0FBYzs7a0NBQ2QsVUFBQSxHQUFZLFNBQUMsSUFBRDthQUNWLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQW5CLENBQUE7SUFEVTs7OztLQUhvQjs7RUFPNUI7Ozs7Ozs7SUFDSixnQkFBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSxnQkFBQyxDQUFBLFdBQUQsR0FBYzs7K0JBQ2QsVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLFNBQVA7QUFDVixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQW5CLENBQUE7TUFDVixJQUFDLENBQUEsaUJBQUQsQ0FBbUIsSUFBbkIsRUFBeUIsU0FBekI7YUFDQTtJQUhVOzs7O0tBSGlCOztFQVV6Qjs7Ozs7OztJQUNKLE1BQUMsQ0FBQSxNQUFELENBQUE7O3FCQUNBLFlBQUEsR0FBYzs7cUJBQ2QsNkJBQUEsR0FBK0I7O3FCQUMvQixJQUFBLEdBQU07O3FCQUVOLGVBQUEsR0FBaUIsU0FBQyxTQUFEO0FBRWYsVUFBQTtNQUFBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVcsa0JBQVgsQ0FBSDtRQUNFLE9BQUEsR0FBVTtRQUVWLEtBQUEsR0FBUSxXQUFBLENBQVksSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFaLEVBQXlCO1VBQUEsR0FBQSxFQUFLLEdBQUw7U0FBekI7ZUFDUixJQUFDLENBQUEsVUFBRCxDQUFZLEtBQVosRUFBbUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxHQUFEO0FBQ2pCLGdCQUFBO1lBRG1CLE9BQUQ7WUFDbEIsT0FBQSxHQUFVLFNBQVMsQ0FBQyxPQUFWLENBQUE7WUFDVixLQUFDLENBQUEsTUFBRCxDQUFRLFNBQVI7WUFDQSxJQUFVLFNBQVMsQ0FBQyxPQUFWLENBQUEsQ0FBQSxLQUF1QixPQUFqQztxQkFBQSxJQUFBLENBQUEsRUFBQTs7VUFIaUI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CLEVBSkY7T0FBQSxNQUFBO2VBU0UsSUFBQyxDQUFBLE1BQUQsQ0FBUSxTQUFSLEVBVEY7O0lBRmU7O3FCQWFqQixNQUFBLEdBQVEsU0FBQyxTQUFEO2FBQ04sU0FBUyxDQUFDLGtCQUFWLENBQUE7SUFETTs7OztLQW5CVzs7RUFzQmY7Ozs7Ozs7SUFDSixPQUFDLENBQUEsTUFBRCxDQUFBOztzQkFDQSxNQUFBLEdBQVEsU0FBQyxTQUFEO2FBQ04sU0FBUyxDQUFDLG1CQUFWLENBQUE7SUFETTs7OztLQUZZOztFQUtoQjs7Ozs7OztJQUNKLFVBQUMsQ0FBQSxNQUFELENBQUE7O3lCQUNBLE1BQUEsR0FBUSxTQUFDLFNBQUQ7YUFDTixTQUFTLENBQUMsc0JBQVYsQ0FBQTtJQURNOzs7O0tBRmU7O0VBS25COzs7Ozs7O0lBQ0osa0JBQUMsQ0FBQSxNQUFELENBQUE7O2lDQUNBLFlBQUEsR0FBYzs7aUNBQ2QsSUFBQSxHQUFNOztpQ0FDTixlQUFBLEdBQWlCLFNBQUMsU0FBRDthQUNmLFNBQVMsQ0FBQyxrQkFBVixDQUFBO0lBRGU7Ozs7S0FKYzs7RUFPM0I7Ozs7Ozs7SUFDSixRQUFDLENBQUEsTUFBRCxDQUFBOzt1QkFDQSxlQUFBLEdBQWlCLFNBQUMsU0FBRDthQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUFDLENBQUEsYUFBeEIsRUFBdUMsMkJBQXZDO0lBRGU7Ozs7S0FGSTs7RUFPakI7Ozs7Ozs7SUFDSixZQUFDLENBQUEsTUFBRCxDQUFRLEtBQVI7OzJCQUNBLEtBQUEsR0FBTyxDQUNMLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FESyxFQUVMLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FGSyxFQUdMLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FISyxFQUlMLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FKSzs7MkJBTVAsd0JBQUEsR0FBMEI7OzJCQUMxQixLQUFBLEdBQU87OzJCQUNQLFlBQUEsR0FBYzs7MkJBQ2Qsa0JBQUEsR0FBb0I7OzJCQUVwQix5QkFBQSxHQUEyQixTQUFBO0FBQ3pCLFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLFVBQUQsQ0FBQTtNQUNWLE9BQU8sQ0FBQyxZQUFSLENBQXFCLElBQUMsQ0FBQSxxQkFBcUIsQ0FBQyxJQUF2QixDQUE0QixJQUE1QixDQUFyQjtNQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLElBQUMsQ0FBQSxlQUFlLENBQUMsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBcEI7YUFDQSxPQUFPLENBQUMsS0FBUixDQUFjLENBQWQsRUFBaUIsSUFBakI7SUFKeUI7OzJCQU0zQiwyQkFBQSxHQUE2QixTQUFBO0FBQzNCLFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLFVBQUQsQ0FBQTtNQUNWLE9BQU8sQ0FBQyxZQUFSLENBQXFCLElBQUMsQ0FBQSx1QkFBdUIsQ0FBQyxJQUF6QixDQUE4QixJQUE5QixDQUFyQjtNQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLElBQUMsQ0FBQSxlQUFlLENBQUMsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBcEI7YUFDQSxPQUFPLENBQUMsS0FBUixDQUFBO0lBSjJCOzsyQkFNN0IsT0FBQSxHQUFTLFNBQUMsSUFBRDtBQUNQLFVBQUE7TUFBQSxJQUFHLElBQUEsR0FBTyxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxLQUFWLEVBQWlCLFNBQUMsSUFBRDtlQUFVLGFBQVEsSUFBUixFQUFBLElBQUE7TUFBVixDQUFqQixDQUFWO2VBQ0UsS0FERjtPQUFBLE1BQUE7ZUFHRSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBSEY7O0lBRE87OzJCQU1ULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsT0FBYjtBQUNSLFVBQUE7O1FBRHFCLFVBQVE7O01BQzdCLFVBQUEsZ0RBQWtDO01BQ2xDLE9BQWdCLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxDQUFoQixFQUFDLGNBQUQsRUFBTztNQUNQLElBQUcsQ0FBQyxDQUFJLFVBQUwsQ0FBQSxJQUFxQixJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsQ0FBeEI7UUFDRSxJQUFDLENBQUEseUJBQUQsR0FBNkI7UUFDN0IsSUFBQSxJQUFRO1FBQ1IsS0FBQSxJQUFTLEtBSFg7O01BS0EsSUFBRyxhQUFRLElBQUMsQ0FBQSxTQUFELENBQVcsZ0NBQVgsQ0FBUixFQUFBLElBQUEsTUFBQSxJQUF5RCxnQkFBQSxDQUFpQixJQUFqQixDQUE1RDtRQUNFLElBQUEsR0FBTyxHQUFBLEdBQU0sSUFBTixHQUFhLElBRHRCOzthQUdBLElBQUEsR0FBTyxJQUFQLEdBQWM7SUFYTjs7MkJBYVYsY0FBQSxHQUFnQixTQUFDLElBQUQ7QUFDZCxVQUFBO01BQUMsY0FBRCxFQUFPLHFGQUFQLEVBQXFCO01BQ3JCLFNBQUEsR0FBWSxTQUFTLENBQUMsSUFBVixDQUFlLEVBQWY7TUFDWixJQUFHLGdCQUFBLENBQWlCLElBQWpCLENBQUEsSUFBMkIsQ0FBQyxJQUFBLEtBQVUsS0FBWCxDQUE5QjtlQUNFLFNBQVMsQ0FBQyxJQUFWLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxVQUhGOztJQUhjOzsyQkFRaEIscUJBQUEsR0FBdUIsU0FBQyxNQUFEO01BQUMsSUFBQyxDQUFBLFFBQUQ7YUFDdEIsSUFBQyxDQUFBLGdCQUFELENBQUE7SUFEcUI7OzJCQUd2Qix1QkFBQSxHQUF5QixTQUFDLElBQUQ7YUFDdkIsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLEVBQUEsR0FBQSxFQUFELENBQUssT0FBTCxFQUFjO1FBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxDQUFOO09BQWQsQ0FBWDtJQUR1Qjs7OztLQXZEQTs7RUEwRHJCOzs7Ozs7O0lBQ0osUUFBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSxRQUFDLENBQUEsV0FBRCxHQUFjOzt1QkFFZCxVQUFBLEdBQVksU0FBQTtNQUNWLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixJQUFDLENBQUEseUJBQXlCLENBQUMsSUFBM0IsQ0FBZ0MsSUFBaEMsQ0FBbkI7YUFDQSwwQ0FBQSxTQUFBO0lBRlU7O3VCQUlaLFVBQUEsR0FBWSxTQUFDLElBQUQ7YUFDVixJQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFBZ0IsSUFBQyxDQUFBLEtBQWpCO0lBRFU7Ozs7S0FSUzs7RUFXakI7Ozs7Ozs7SUFDSixZQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLFlBQUMsQ0FBQSxXQUFELEdBQWM7OzJCQUNkLE1BQUEsR0FBUTs7OztLQUhpQjs7RUFLckI7Ozs7Ozs7SUFDSixpQkFBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSxpQkFBQyxDQUFBLFdBQUQsR0FBYzs7Z0NBQ2QsTUFBQSxHQUFROzs7O0tBSHNCOztFQUsxQjs7Ozs7OztJQUNKLFdBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EsV0FBQyxDQUFBLFdBQUQsR0FBYzs7MEJBQ2QsVUFBQSxHQUFZOzswQkFDWixvQkFBQSxHQUFzQjs7OztLQUpFOztFQVFwQjs7Ozs7OztJQUNKLGNBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EsY0FBQyxDQUFBLFdBQUQsR0FBYzs7NkJBRWQsVUFBQSxHQUFZLFNBQUE7TUFDVixJQUFzQyxtQkFBdEM7UUFBQSxJQUFDLENBQUEsMkJBQUQsQ0FBQSxFQUFBOzthQUNBLGdEQUFBLFNBQUE7SUFGVTs7NkJBSVosdUJBQUEsR0FBeUIsU0FBQyxLQUFEO01BQ3ZCLDZEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTO2FBQ1QsSUFBQyxDQUFBLGdCQUFELENBQUE7SUFIdUI7OzZCQUt6QixVQUFBLEdBQVksU0FBQyxJQUFEO2FBQ1YsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEI7SUFEVTs7OztLQWJlOztFQWdCdkI7Ozs7Ozs7SUFDSixxQkFBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSxxQkFBQyxDQUFBLFdBQUQsR0FBYzs7b0NBQ2QsTUFBQSxHQUFROztvQ0FDUixZQUFBLEdBQWM7Ozs7S0FKb0I7O0VBTTlCOzs7Ozs7O0lBQ0osb0NBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0Esb0NBQUMsQ0FBQSxXQUFELEdBQWM7O21EQUNkLE1BQUEsR0FBUTs7OztLQUh5Qzs7RUFPN0M7Ozs7Ozs7SUFDSixjQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLGNBQUMsQ0FBQSxXQUFELEdBQWM7OzZCQUVkLHFCQUFBLEdBQXVCLFNBQUE7QUFDckIsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLGVBQVIsQ0FBQSxDQUEwQixDQUFBLENBQUE7YUFDakMsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBaEIsQ0FBb0IsSUFBcEIsRUFBMEIsSUFBQyxDQUFBLFFBQVEsQ0FBQyx5QkFBVixDQUFBLENBQTFCO0lBRnFCOzs2QkFJdkIsVUFBQSxHQUFZLFNBQUE7TUFDVixJQUFHLG1CQUFIO1FBQ0UsSUFBQyxDQUFBLHFCQUFELENBQXVCLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBdkIsRUFERjtPQUFBLE1BQUE7UUFHRSxJQUFDLENBQUEscUJBQUQsQ0FBdUIsSUFBQyxDQUFBLGVBQWUsQ0FBQyxJQUFqQixDQUFzQixJQUF0QixDQUF2QjtRQUNBLElBQUMsQ0FBQSwyQkFBRCxDQUFBLEVBSkY7O01BS0EsZ0RBQUEsU0FBQTthQUVBLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDakIsS0FBQyxDQUFBLHFCQUFELENBQUE7aUJBQ0EsS0FBQyxDQUFBLHlCQUFELENBQUE7UUFGaUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CO0lBUlU7OzZCQVlaLFVBQUEsR0FBWSxTQUFDLElBQUQ7QUFDVixVQUFBO01BQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCO2FBQ1osSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWLEVBQXFCLElBQUMsQ0FBQSxLQUF0QixFQUE2QjtRQUFBLFVBQUEsRUFBWSxJQUFaO09BQTdCO0lBRlU7Ozs7S0FwQmU7O0VBd0J2Qjs7Ozs7OztJQUNKLHFCQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLHFCQUFDLENBQUEsV0FBRCxHQUFjOztvQ0FDZCxNQUFBLEdBQVE7Ozs7S0FIMEI7O0VBSzlCOzs7Ozs7O0lBQ0osb0NBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0Esb0NBQUMsQ0FBQSxXQUFELEdBQWM7O21EQUNkLE1BQUEsR0FBUTs7OztLQUh5Qzs7RUFTN0M7Ozs7Ozs7SUFDSixJQUFDLENBQUEsTUFBRCxDQUFBOzttQkFDQSxNQUFBLEdBQVE7O21CQUNSLFdBQUEsR0FBYTs7bUJBQ2IsZ0JBQUEsR0FBa0I7O21CQUVsQixlQUFBLEdBQWlCLFNBQUMsU0FBRDtBQUNmLFVBQUE7TUFBQSxJQUFHLGVBQUEsQ0FBZ0IsS0FBQSxHQUFRLFNBQVMsQ0FBQyxjQUFWLENBQUEsQ0FBeEIsQ0FBSDtRQUNFLFNBQVMsQ0FBQyxjQUFWLENBQXlCLEtBQUssQ0FBQyxTQUFOLENBQWdCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBaEIsRUFBd0IsQ0FBQyxDQUFDLENBQUYsRUFBSyxLQUFMLENBQXhCLENBQXpCLEVBREY7O01BRUEsU0FBUyxDQUFDLFNBQVYsQ0FBQTtNQUNBLEdBQUEsR0FBTSxTQUFTLENBQUMsY0FBVixDQUFBLENBQTBCLENBQUM7YUFDakMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBakIsQ0FBbUMsR0FBRyxDQUFDLFNBQUosQ0FBYyxDQUFDLENBQUQsRUFBSSxDQUFDLENBQUwsQ0FBZCxDQUFuQztJQUxlOzs7O0tBTkE7O0VBYWI7Ozs7Ozs7SUFDSixRQUFDLENBQUEsTUFBRCxDQUFRLEtBQVI7O3VCQUNBLElBQUEsR0FBTTs7dUJBQ04sSUFBQSxHQUFNOzt1QkFDTixNQUFBLEdBQVE7O3VCQUVSLFVBQUEsR0FBWSxTQUFBO01BQ1YsSUFBbUIsSUFBQyxDQUFBLFlBQXBCO1FBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBWSxFQUFaLEVBQUE7O2FBQ0EsMENBQUEsU0FBQTtJQUZVOzt1QkFJWixVQUFBLEdBQVksU0FBQyxJQUFEO0FBQ1YsVUFBQTtNQUFBLElBQUcsSUFBQyxDQUFBLElBQUo7UUFDRSxPQUFBLEdBQVUsZUFEWjtPQUFBLE1BQUE7UUFHRSxPQUFBLEdBQVUsU0FIWjs7YUFJQSxJQUFJLENBQUMsU0FBTCxDQUFBLENBQWdCLENBQUMsT0FBakIsQ0FBeUIsT0FBekIsRUFBa0MsSUFBQyxDQUFBLEtBQW5DLENBQUEsR0FBNEM7SUFMbEM7Ozs7S0FWUzs7RUFpQmpCOzs7Ozs7O0lBQ0osb0JBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0Esb0JBQUMsQ0FBQSxvQkFBRCxDQUFBOzttQ0FDQSxLQUFBLEdBQU87Ozs7S0FIMEI7O0VBSzdCOzs7Ozs7O0lBQ0osV0FBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSxXQUFDLENBQUEsb0JBQUQsQ0FBQTs7SUFDQSxXQUFDLENBQUEsV0FBRCxHQUFjOzswQkFDZCxZQUFBLEdBQWM7OzBCQUNkLElBQUEsR0FBTTs7OztLQUxrQjs7RUFPcEI7Ozs7Ozs7SUFDSiwyQkFBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSwyQkFBQyxDQUFBLG9CQUFELENBQUE7O0lBQ0EsMkJBQUMsQ0FBQSxXQUFELEdBQWM7OzBDQUNkLElBQUEsR0FBTTs7OztLQUprQzs7RUFRcEM7Ozs7Ozs7SUFDSixXQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLFdBQUMsQ0FBQSxvQkFBRCxDQUFBOztJQUNBLFdBQUMsQ0FBQSxXQUFELEdBQWM7OzBCQUNkLFlBQUEsR0FBYzs7MEJBQ2QsS0FBQSxHQUFPOzswQkFDUCxNQUFBLEdBQVE7OzBCQUNSLFlBQUEsR0FBYzs7MEJBRWQsVUFBQSxHQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsY0FBRCxDQUFnQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2QsS0FBQyxDQUFBLFVBQUQsQ0FBWSxFQUFaO1FBRGM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO2FBRUEsNkNBQUEsU0FBQTtJQUhVOzswQkFLWixVQUFBLEdBQVksU0FBQyxJQUFEO0FBQ1YsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsS0FBRCxJQUFVO01BQ2xCLEtBQUEsR0FBUSxNQUFBLENBQUEsRUFBQSxHQUFJLENBQUMsQ0FBQyxDQUFDLFlBQUYsQ0FBZSxLQUFmLENBQUQsQ0FBSixFQUE4QixHQUE5QjtNQUNSLElBQUcsSUFBQyxDQUFBLFlBQUo7UUFDRSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FEM0I7T0FBQSxNQUFBO1FBR0UsYUFBQSxHQUFnQixLQUhsQjs7YUFJQSxJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsRUFBb0IsYUFBcEI7SUFQVTs7OztLQWRZOztFQXVCcEI7Ozs7Ozs7SUFDSiw4QkFBQyxDQUFBLE1BQUQsQ0FBQTs7SUFDQSw4QkFBQyxDQUFBLG9CQUFELENBQUE7OzZDQUNBLFlBQUEsR0FBYzs7OztLQUg2Qjs7RUFLdkM7Ozs7Ozs7SUFDSixjQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLGNBQUMsQ0FBQSxvQkFBRCxDQUFBOzs2QkFDQSxhQUFBLEdBQWU7OzZCQUNmLHlCQUFBLEdBQTJCOzs2QkFFM0IsVUFBQSxHQUFZLFNBQUMsSUFBRDtBQUNWLFVBQUE7TUFBQSxTQUFBLEdBQVksY0FBQSxDQUFlLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBZjtNQUNaLE9BQUEsR0FBVTtBQUNWLGFBQU0sU0FBUyxDQUFDLE1BQWhCO1FBQ0UsT0FBZSxTQUFTLENBQUMsS0FBVixDQUFBLENBQWYsRUFBQyxnQkFBRCxFQUFPO1FBQ1AsSUFBRyxJQUFBLEtBQVEsV0FBWDtVQUNFLElBQUcsSUFBQyxDQUFBLGFBQUo7WUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFBLEdBQWMsS0FEdkI7V0FBQSxNQUFBO1lBR0UsSUFBQSxHQUFPLEtBSFQ7V0FERjs7UUFLQSxPQUFBLElBQVc7TUFQYjthQVFBLElBQUEsR0FBTyxPQUFQLEdBQWlCO0lBWFA7Ozs7S0FOZTs7RUFtQnZCOzs7Ozs7O0lBQ0osaUNBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EsaUNBQUMsQ0FBQSxvQkFBRCxDQUFBOztnREFDQSxhQUFBLEdBQWU7Ozs7S0FIK0I7O0VBSzFDOzs7Ozs7O0lBQ0osNEJBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EsNEJBQUMsQ0FBQSxvQkFBRCxDQUFBOzsyQ0FDQSxNQUFBLEdBQVE7Ozs7S0FIaUM7O0VBS3JDOzs7Ozs7O0lBQ0osV0FBQyxDQUFBLE1BQUQsQ0FBUSxLQUFSOzswQkFDQSxVQUFBLEdBQVksU0FBQyxJQUFEO01BQ1YsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLFVBQUQsQ0FBWSxrQkFBQSxDQUFtQixJQUFuQixDQUFaLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsSUFBM0MsQ0FBQSxHQUFtRCxLQURyRDtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEscUJBQUQsQ0FBdUIsSUFBdkIsRUFBNkIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxJQUFEO21CQUFVLEtBQUMsQ0FBQSxVQUFELENBQVksSUFBWjtVQUFWO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QixFQUhGOztJQURVOzswQkFNWixxQkFBQSxHQUF1QixTQUFDLElBQUQsRUFBTyxFQUFQO0FBQ3JCLFVBQUE7TUFBQSxhQUFBLEdBQWdCLGNBQUEsR0FBaUI7TUFDakMsS0FBQSxHQUFRLElBQUksQ0FBQyxNQUFMLENBQVksSUFBWjtNQUNSLEdBQUEsR0FBTSxJQUFJLENBQUMsTUFBTCxDQUFZLE1BQVo7TUFDTixhQUFBLEdBQWdCLGNBQUEsR0FBaUI7TUFDakMsSUFBbUMsS0FBQSxLQUFXLENBQUMsQ0FBL0M7UUFBQSxhQUFBLEdBQWdCLElBQUssaUJBQXJCOztNQUNBLElBQWlDLEdBQUEsS0FBUyxDQUFDLENBQTNDO1FBQUEsY0FBQSxHQUFpQixJQUFLLFlBQXRCOztNQUNBLElBQUEsR0FBTyxJQUFLO01BRVosU0FBQSxHQUFZLGNBQUEsQ0FBZSxJQUFmO01BQ1osSUFBQSxHQUFPLFNBQ0wsQ0FBQyxNQURJLENBQ0csU0FBQyxLQUFEO2VBQVcsS0FBSyxDQUFDLElBQU4sS0FBYztNQUF6QixDQURILENBRUwsQ0FBQyxHQUZJLENBRUEsU0FBQyxLQUFEO2VBQVcsS0FBSyxDQUFDO01BQWpCLENBRkE7TUFHUCxPQUFBLEdBQVUsRUFBQSxDQUFHLElBQUg7TUFFVixPQUFBLEdBQVU7QUFDVixhQUFNLFNBQVMsQ0FBQyxNQUFoQjtRQUNFLE9BQWUsU0FBUyxDQUFDLEtBQVYsQ0FBQSxDQUFmLEVBQUMsZ0JBQUQsRUFBTztRQUNQLE9BQUE7QUFBVyxrQkFBTyxJQUFQO0FBQUEsaUJBQ0osV0FESTtxQkFDYTtBQURiLGlCQUVKLFVBRkk7cUJBRVksT0FBTyxDQUFDLEtBQVIsQ0FBQTtBQUZaOztNQUZiO2FBS0EsYUFBQSxHQUFnQixPQUFoQixHQUEwQjtJQXJCTDs7OztLQVJDOztFQStCcEI7Ozs7Ozs7SUFDSixPQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLE9BQUMsQ0FBQSxvQkFBRCxDQUFBOztzQkFDQSxVQUFBLEdBQVksU0FBQyxJQUFEO2FBQ1YsSUFBSSxDQUFDLE9BQUwsQ0FBQTtJQURVOzs7O0tBSFE7O0VBTWhCOzs7Ozs7O0lBQ0osbUJBQUMsQ0FBQSxNQUFELENBQUE7O2tDQUNBLE1BQUEsR0FBUTs7OztLQUZ3Qjs7RUFJNUI7Ozs7Ozs7SUFDSixNQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLE1BQUMsQ0FBQSxvQkFBRCxDQUFBOztxQkFDQSxVQUFBLEdBQVksU0FBQyxJQUFEO01BQ1YsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsR0FBTCxDQUFBLENBQWI7YUFDQTtJQUZVOzs7O0tBSE87O0VBT2Y7Ozs7Ozs7SUFDSixlQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLGVBQUMsQ0FBQSxvQkFBRCxDQUFBOzs4QkFDQSxVQUFBLEdBQVksU0FBQyxJQUFEO01BQ1YsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsS0FBTCxDQUFBLENBQVY7YUFDQTtJQUZVOzs7O0tBSGdCOztFQU94Qjs7Ozs7OztJQUNKLElBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EsSUFBQyxDQUFBLG9CQUFELENBQUE7O0lBQ0EsSUFBQyxDQUFBLFdBQUQsR0FBYzs7bUJBQ2QsVUFBQSxHQUFZLFNBQUMsSUFBRDthQUNWLElBQUksQ0FBQyxJQUFMLENBQUE7SUFEVTs7OztLQUpLOztFQU9iOzs7Ozs7O0lBQ0oscUJBQUMsQ0FBQSxNQUFELENBQUE7O0lBQ0EscUJBQUMsQ0FBQSxvQkFBRCxDQUFBOztJQUNBLHFCQUFDLENBQUEsV0FBRCxHQUFjOztvQ0FDZCxVQUFBLEdBQVksU0FBQyxJQUFEO2FBQ1YsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFDLElBQUQsRUFBTyxJQUFQO2VBQ1IsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsSUFBbkIsRUFBeUI7VUFBQSxXQUFBLEVBQWEsTUFBYjtTQUF6QjtNQURRLENBQVY7SUFEVTs7OztLQUpzQjs7RUFROUI7Ozs7Ozs7SUFDSixZQUFDLENBQUEsTUFBRCxDQUFBOztJQUNBLFlBQUMsQ0FBQSxvQkFBRCxDQUFBOztJQUNBLFlBQUMsQ0FBQSxXQUFELEdBQWM7OzJCQUNkLFVBQUEsR0FBWSxTQUFDLElBQUQ7YUFDVixDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxTQUFDLEdBQUQ7ZUFDYixNQUFNLENBQUMsUUFBUCxDQUFnQixHQUFoQixDQUFBLElBQXdCO01BRFgsQ0FBZjtJQURVOzs7O0tBSmE7QUFodUIzQiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG57QnVmZmVyZWRQcm9jZXNzLCBSYW5nZX0gPSByZXF1aXJlICdhdG9tJ1xuXG57XG4gIGlzU2luZ2xlTGluZVRleHRcbiAgaXNMaW5ld2lzZVJhbmdlXG4gIGxpbWl0TnVtYmVyXG4gIHRvZ2dsZUNhc2VGb3JDaGFyYWN0ZXJcbiAgc3BsaXRUZXh0QnlOZXdMaW5lXG4gIHNwbGl0QXJndW1lbnRzXG4gIGdldEluZGVudExldmVsRm9yQnVmZmVyUm93XG4gIGFkanVzdEluZGVudFdpdGhLZWVwaW5nTGF5b3V0XG59ID0gcmVxdWlyZSAnLi91dGlscydcbnN3cmFwID0gcmVxdWlyZSAnLi9zZWxlY3Rpb24td3JhcHBlcidcbkJhc2UgPSByZXF1aXJlICcuL2Jhc2UnXG5PcGVyYXRvciA9IEJhc2UuZ2V0Q2xhc3MoJ09wZXJhdG9yJylcblxuIyBUcmFuc2Zvcm1TdHJpbmdcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIFRyYW5zZm9ybVN0cmluZyBleHRlbmRzIE9wZXJhdG9yXG4gIEBleHRlbmQoZmFsc2UpXG4gIHRyYWNrQ2hhbmdlOiB0cnVlXG4gIHN0YXlPcHRpb25OYW1lOiAnc3RheU9uVHJhbnNmb3JtU3RyaW5nJ1xuICBhdXRvSW5kZW50OiBmYWxzZVxuICBhdXRvSW5kZW50TmV3bGluZTogZmFsc2VcbiAgYXV0b0luZGVudEFmdGVySW5zZXJ0VGV4dDogZmFsc2VcbiAgQHN0cmluZ1RyYW5zZm9ybWVyczogW11cblxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3Q6IC0+XG4gICAgQHN0cmluZ1RyYW5zZm9ybWVycy5wdXNoKHRoaXMpXG5cbiAgbXV0YXRlU2VsZWN0aW9uOiAoc2VsZWN0aW9uKSAtPlxuICAgIGlmIHRleHQgPSBAZ2V0TmV3VGV4dChzZWxlY3Rpb24uZ2V0VGV4dCgpLCBzZWxlY3Rpb24pXG4gICAgICBpZiBAYXV0b0luZGVudEFmdGVySW5zZXJ0VGV4dFxuICAgICAgICBzdGFydFJvdyA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLnN0YXJ0LnJvd1xuICAgICAgICBzdGFydFJvd0luZGVudExldmVsID0gZ2V0SW5kZW50TGV2ZWxGb3JCdWZmZXJSb3coQGVkaXRvciwgc3RhcnRSb3cpXG4gICAgICByYW5nZSA9IHNlbGVjdGlvbi5pbnNlcnRUZXh0KHRleHQsIHtAYXV0b0luZGVudCwgQGF1dG9JbmRlbnROZXdsaW5lfSlcbiAgICAgIGlmIEBhdXRvSW5kZW50QWZ0ZXJJbnNlcnRUZXh0XG4gICAgICAgICMgQ3VycmVudGx5IHVzZWQgYnkgU3BsaXRBcmd1bWVudHMgYW5kIFN1cnJvdW5kKCBsaW5ld2lzZSB0YXJnZXQgb25seSApXG4gICAgICAgIHJhbmdlID0gcmFuZ2UudHJhbnNsYXRlKFswLCAwXSwgWy0xLCAwXSkgaWYgQHRhcmdldC5pc0xpbmV3aXNlKClcbiAgICAgICAgQGVkaXRvci5zZXRJbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhyYW5nZS5zdGFydC5yb3csIHN0YXJ0Um93SW5kZW50TGV2ZWwpXG4gICAgICAgIEBlZGl0b3Iuc2V0SW5kZW50YXRpb25Gb3JCdWZmZXJSb3cocmFuZ2UuZW5kLnJvdywgc3RhcnRSb3dJbmRlbnRMZXZlbClcbiAgICAgICAgIyBBZGp1c3QgaW5uZXIgcmFuZ2UsIGVuZC5yb3cgaXMgYWxyZWFkeSggaWYgbmVlZGVkICkgdHJhbnNsYXRlZCBzbyBubyBuZWVkIHRvIHJlLXRyYW5zbGF0ZS5cbiAgICAgICAgYWRqdXN0SW5kZW50V2l0aEtlZXBpbmdMYXlvdXQoQGVkaXRvciwgcmFuZ2UudHJhbnNsYXRlKFsxLCAwXSwgWzAsIDBdKSlcblxuY2xhc3MgVG9nZ2xlQ2FzZSBleHRlbmRzIFRyYW5zZm9ybVN0cmluZ1xuICBAZXh0ZW5kKClcbiAgQHJlZ2lzdGVyVG9TZWxlY3RMaXN0KClcbiAgQGRlc2NyaXB0aW9uOiBcImBIZWxsbyBXb3JsZGAgLT4gYGhFTExPIHdPUkxEYFwiXG4gIGRpc3BsYXlOYW1lOiAnVG9nZ2xlIH4nXG5cbiAgZ2V0TmV3VGV4dDogKHRleHQpIC0+XG4gICAgdGV4dC5yZXBsYWNlKC8uL2csIHRvZ2dsZUNhc2VGb3JDaGFyYWN0ZXIpXG5cbmNsYXNzIFRvZ2dsZUNhc2VBbmRNb3ZlUmlnaHQgZXh0ZW5kcyBUb2dnbGVDYXNlXG4gIEBleHRlbmQoKVxuICBmbGFzaFRhcmdldDogZmFsc2VcbiAgcmVzdG9yZVBvc2l0aW9uczogZmFsc2VcbiAgdGFyZ2V0OiAnTW92ZVJpZ2h0J1xuXG5jbGFzcyBVcHBlckNhc2UgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmdcbiAgQGV4dGVuZCgpXG4gIEByZWdpc3RlclRvU2VsZWN0TGlzdCgpXG4gIEBkZXNjcmlwdGlvbjogXCJgSGVsbG8gV29ybGRgIC0+IGBIRUxMTyBXT1JMRGBcIlxuICBkaXNwbGF5TmFtZTogJ1VwcGVyJ1xuICBnZXROZXdUZXh0OiAodGV4dCkgLT5cbiAgICB0ZXh0LnRvVXBwZXJDYXNlKClcblxuY2xhc3MgTG93ZXJDYXNlIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBAZGVzY3JpcHRpb246IFwiYEhlbGxvIFdvcmxkYCAtPiBgaGVsbG8gd29ybGRgXCJcbiAgZGlzcGxheU5hbWU6ICdMb3dlcidcbiAgZ2V0TmV3VGV4dDogKHRleHQpIC0+XG4gICAgdGV4dC50b0xvd2VyQ2FzZSgpXG5cbiMgUmVwbGFjZVxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBSZXBsYWNlIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBmbGFzaENoZWNrcG9pbnQ6ICdkaWQtc2VsZWN0LW9jY3VycmVuY2UnXG4gIGlucHV0OiBudWxsXG4gIHJlcXVpcmVJbnB1dDogdHJ1ZVxuICBhdXRvSW5kZW50TmV3bGluZTogdHJ1ZVxuICBzdXBwb3J0RWFybHlTZWxlY3Q6IHRydWVcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBvbkRpZFNlbGVjdFRhcmdldCA9PlxuICAgICAgQGZvY3VzSW5wdXQoMSwgdHJ1ZSlcbiAgICBzdXBlclxuXG4gIGdldE5ld1RleHQ6ICh0ZXh0KSAtPlxuICAgIGlmIEB0YXJnZXQuaXMoJ01vdmVSaWdodEJ1ZmZlckNvbHVtbicpIGFuZCB0ZXh0Lmxlbmd0aCBpc250IEBnZXRDb3VudCgpXG4gICAgICByZXR1cm5cblxuICAgIGlucHV0ID0gQGlucHV0IG9yIFwiXFxuXCJcbiAgICBpZiBpbnB1dCBpcyBcIlxcblwiXG4gICAgICBAcmVzdG9yZVBvc2l0aW9ucyA9IGZhbHNlXG4gICAgdGV4dC5yZXBsYWNlKC8uL2csIGlucHV0KVxuXG5jbGFzcyBSZXBsYWNlQ2hhcmFjdGVyIGV4dGVuZHMgUmVwbGFjZVxuICBAZXh0ZW5kKClcbiAgdGFyZ2V0OiBcIk1vdmVSaWdodEJ1ZmZlckNvbHVtblwiXG5cbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBEVVAgbWVhbmluZyB3aXRoIFNwbGl0U3RyaW5nIG5lZWQgY29uc29saWRhdGUuXG5jbGFzcyBTcGxpdEJ5Q2hhcmFjdGVyIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBnZXROZXdUZXh0OiAodGV4dCkgLT5cbiAgICB0ZXh0LnNwbGl0KCcnKS5qb2luKCcgJylcblxuY2xhc3MgQ2FtZWxDYXNlIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBkaXNwbGF5TmFtZTogJ0NhbWVsaXplJ1xuICBAZGVzY3JpcHRpb246IFwiYGhlbGxvLXdvcmxkYCAtPiBgaGVsbG9Xb3JsZGBcIlxuICBnZXROZXdUZXh0OiAodGV4dCkgLT5cbiAgICBfLmNhbWVsaXplKHRleHQpXG5cbmNsYXNzIFNuYWtlQ2FzZSBleHRlbmRzIFRyYW5zZm9ybVN0cmluZ1xuICBAZXh0ZW5kKClcbiAgQHJlZ2lzdGVyVG9TZWxlY3RMaXN0KClcbiAgQGRlc2NyaXB0aW9uOiBcImBIZWxsb1dvcmxkYCAtPiBgaGVsbG9fd29ybGRgXCJcbiAgZGlzcGxheU5hbWU6ICdVbmRlcnNjb3JlIF8nXG4gIGdldE5ld1RleHQ6ICh0ZXh0KSAtPlxuICAgIF8udW5kZXJzY29yZSh0ZXh0KVxuXG5jbGFzcyBQYXNjYWxDYXNlIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBAZGVzY3JpcHRpb246IFwiYGhlbGxvX3dvcmxkYCAtPiBgSGVsbG9Xb3JsZGBcIlxuICBkaXNwbGF5TmFtZTogJ1Bhc2NhbGl6ZSdcbiAgZ2V0TmV3VGV4dDogKHRleHQpIC0+XG4gICAgXy5jYXBpdGFsaXplKF8uY2FtZWxpemUodGV4dCkpXG5cbmNsYXNzIERhc2hDYXNlIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBkaXNwbGF5TmFtZTogJ0Rhc2hlcml6ZSAtJ1xuICBAZGVzY3JpcHRpb246IFwiSGVsbG9Xb3JsZCAtPiBoZWxsby13b3JsZFwiXG4gIGdldE5ld1RleHQ6ICh0ZXh0KSAtPlxuICAgIF8uZGFzaGVyaXplKHRleHQpXG5cbmNsYXNzIFRpdGxlQ2FzZSBleHRlbmRzIFRyYW5zZm9ybVN0cmluZ1xuICBAZXh0ZW5kKClcbiAgQHJlZ2lzdGVyVG9TZWxlY3RMaXN0KClcbiAgQGRlc2NyaXB0aW9uOiBcImBIZWxsb1dvcmxkYCAtPiBgSGVsbG8gV29ybGRgXCJcbiAgZGlzcGxheU5hbWU6ICdUaXRsaXplJ1xuICBnZXROZXdUZXh0OiAodGV4dCkgLT5cbiAgICBfLmh1bWFuaXplRXZlbnROYW1lKF8uZGFzaGVyaXplKHRleHQpKVxuXG5jbGFzcyBFbmNvZGVVcmlDb21wb25lbnQgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmdcbiAgQGV4dGVuZCgpXG4gIEByZWdpc3RlclRvU2VsZWN0TGlzdCgpXG4gIEBkZXNjcmlwdGlvbjogXCJgSGVsbG8gV29ybGRgIC0+IGBIZWxsbyUyMFdvcmxkYFwiXG4gIGRpc3BsYXlOYW1lOiAnRW5jb2RlIFVSSSBDb21wb25lbnQgJSdcbiAgZ2V0TmV3VGV4dDogKHRleHQpIC0+XG4gICAgZW5jb2RlVVJJQ29tcG9uZW50KHRleHQpXG5cbmNsYXNzIERlY29kZVVyaUNvbXBvbmVudCBleHRlbmRzIFRyYW5zZm9ybVN0cmluZ1xuICBAZXh0ZW5kKClcbiAgQHJlZ2lzdGVyVG9TZWxlY3RMaXN0KClcbiAgQGRlc2NyaXB0aW9uOiBcImBIZWxsbyUyMFdvcmxkYCAtPiBgSGVsbG8gV29ybGRgXCJcbiAgZGlzcGxheU5hbWU6ICdEZWNvZGUgVVJJIENvbXBvbmVudCAlJSdcbiAgZ2V0TmV3VGV4dDogKHRleHQpIC0+XG4gICAgZGVjb2RlVVJJQ29tcG9uZW50KHRleHQpXG5cbmNsYXNzIFRyaW1TdHJpbmcgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmdcbiAgQGV4dGVuZCgpXG4gIEByZWdpc3RlclRvU2VsZWN0TGlzdCgpXG4gIEBkZXNjcmlwdGlvbjogXCJgIGhlbGxvIGAgLT4gYGhlbGxvYFwiXG4gIGRpc3BsYXlOYW1lOiAnVHJpbSBzdHJpbmcnXG4gIGdldE5ld1RleHQ6ICh0ZXh0KSAtPlxuICAgIHRleHQudHJpbSgpXG5cbmNsYXNzIENvbXBhY3RTcGFjZXMgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmdcbiAgQGV4dGVuZCgpXG4gIEByZWdpc3RlclRvU2VsZWN0TGlzdCgpXG4gIEBkZXNjcmlwdGlvbjogXCJgICBhICAgIGIgICAgY2AgLT4gYGEgYiBjYFwiXG4gIGRpc3BsYXlOYW1lOiAnQ29tcGFjdCBzcGFjZSdcbiAgZ2V0TmV3VGV4dDogKHRleHQpIC0+XG4gICAgaWYgdGV4dC5tYXRjaCgvXlsgXSskLylcbiAgICAgICcgJ1xuICAgIGVsc2VcbiAgICAgICMgRG9uJ3QgY29tcGFjdCBmb3IgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGUgc3BhY2VzLlxuICAgICAgdGV4dC5yZXBsYWNlIC9eKFxccyopKC4qPykoXFxzKikkL2dtLCAobSwgbGVhZGluZywgbWlkZGxlLCB0cmFpbGluZykgLT5cbiAgICAgICAgbGVhZGluZyArIG1pZGRsZS5zcGxpdCgvWyBcXHRdKy8pLmpvaW4oJyAnKSArIHRyYWlsaW5nXG5cbmNsYXNzIFJlbW92ZUxlYWRpbmdXaGl0ZVNwYWNlcyBleHRlbmRzIFRyYW5zZm9ybVN0cmluZ1xuICBAZXh0ZW5kKClcbiAgQHJlZ2lzdGVyVG9TZWxlY3RMaXN0KClcbiAgd2lzZTogJ2xpbmV3aXNlJ1xuICBAZGVzY3JpcHRpb246IFwiYCAgYSBiIGNgIC0+IGBhIGIgY2BcIlxuICBnZXROZXdUZXh0OiAodGV4dCwgc2VsZWN0aW9uKSAtPlxuICAgIHRyaW1MZWZ0ID0gKHRleHQpIC0+IHRleHQudHJpbUxlZnQoKVxuICAgIHNwbGl0VGV4dEJ5TmV3TGluZSh0ZXh0KS5tYXAodHJpbUxlZnQpLmpvaW4oXCJcXG5cIikgKyBcIlxcblwiXG5cbmNsYXNzIENvbnZlcnRUb1NvZnRUYWIgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmdcbiAgQGV4dGVuZCgpXG4gIEByZWdpc3RlclRvU2VsZWN0TGlzdCgpXG4gIGRpc3BsYXlOYW1lOiAnU29mdCBUYWInXG4gIHdpc2U6ICdsaW5ld2lzZSdcblxuICBtdXRhdGVTZWxlY3Rpb246IChzZWxlY3Rpb24pIC0+XG4gICAgQHNjYW5Gb3J3YXJkIC9cXHQvZywge3NjYW5SYW5nZTogc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCl9LCAoe3JhbmdlLCByZXBsYWNlfSkgPT5cbiAgICAgICMgUmVwbGFjZSBcXHQgdG8gc3BhY2VzIHdoaWNoIGxlbmd0aCBpcyB2YXJ5IGRlcGVuZGluZyBvbiB0YWJTdG9wIGFuZCB0YWJMZW5naHRcbiAgICAgICMgU28gd2UgZGlyZWN0bHkgY29uc3VsdCBpdCdzIHNjcmVlbiByZXByZXNlbnRpbmcgbGVuZ3RoLlxuICAgICAgbGVuZ3RoID0gQGVkaXRvci5zY3JlZW5SYW5nZUZvckJ1ZmZlclJhbmdlKHJhbmdlKS5nZXRFeHRlbnQoKS5jb2x1bW5cbiAgICAgIHJlcGxhY2UoXCIgXCIucmVwZWF0KGxlbmd0aCkpXG5cbmNsYXNzIENvbnZlcnRUb0hhcmRUYWIgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmdcbiAgQGV4dGVuZCgpXG4gIEByZWdpc3RlclRvU2VsZWN0TGlzdCgpXG4gIGRpc3BsYXlOYW1lOiAnSGFyZCBUYWInXG5cbiAgbXV0YXRlU2VsZWN0aW9uOiAoc2VsZWN0aW9uKSAtPlxuICAgIHRhYkxlbmd0aCA9IEBlZGl0b3IuZ2V0VGFiTGVuZ3RoKClcbiAgICBAc2NhbkZvcndhcmQgL1sgXFx0XSsvZywge3NjYW5SYW5nZTogc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCl9LCAoe3JhbmdlLCByZXBsYWNlfSkgPT5cbiAgICAgIHtzdGFydCwgZW5kfSA9IEBlZGl0b3Iuc2NyZWVuUmFuZ2VGb3JCdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgIHN0YXJ0Q29sdW1uID0gc3RhcnQuY29sdW1uXG4gICAgICBlbmRDb2x1bW4gPSBlbmQuY29sdW1uXG5cbiAgICAgICMgV2UgY2FuJ3QgbmFpdmVseSByZXBsYWNlIHNwYWNlcyB0byB0YWIsIHdlIGhhdmUgdG8gY29uc2lkZXIgdmFsaWQgdGFiU3RvcCBjb2x1bW5cbiAgICAgICMgSWYgbmV4dFRhYlN0b3AgY29sdW1uIGV4Y2VlZHMgcmVwbGFjYWJsZSByYW5nZSwgd2UgcGFkIHdpdGggc3BhY2VzLlxuICAgICAgbmV3VGV4dCA9ICcnXG4gICAgICBsb29wXG4gICAgICAgIHJlbWFpbmRlciA9IHN0YXJ0Q29sdW1uICUlIHRhYkxlbmd0aFxuICAgICAgICBuZXh0VGFiU3RvcCA9IHN0YXJ0Q29sdW1uICsgKGlmIHJlbWFpbmRlciBpcyAwIHRoZW4gdGFiTGVuZ3RoIGVsc2UgcmVtYWluZGVyKVxuICAgICAgICBpZiBuZXh0VGFiU3RvcCA+IGVuZENvbHVtblxuICAgICAgICAgIG5ld1RleHQgKz0gXCIgXCIucmVwZWF0KGVuZENvbHVtbiAtIHN0YXJ0Q29sdW1uKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbmV3VGV4dCArPSBcIlxcdFwiXG4gICAgICAgIHN0YXJ0Q29sdW1uID0gbmV4dFRhYlN0b3BcbiAgICAgICAgYnJlYWsgaWYgc3RhcnRDb2x1bW4gPj0gZW5kQ29sdW1uXG5cbiAgICAgIHJlcGxhY2UobmV3VGV4dClcblxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBUcmFuc2Zvcm1TdHJpbmdCeUV4dGVybmFsQ29tbWFuZCBleHRlbmRzIFRyYW5zZm9ybVN0cmluZ1xuICBAZXh0ZW5kKGZhbHNlKVxuICBhdXRvSW5kZW50OiB0cnVlXG4gIGNvbW1hbmQ6ICcnICMgZS5nLiBjb21tYW5kOiAnc29ydCdcbiAgYXJnczogW10gIyBlLmcgYXJnczogWyctcm4nXVxuICBzdGRvdXRCeVNlbGVjdGlvbjogbnVsbFxuXG4gIGV4ZWN1dGU6IC0+XG4gICAgQG5vcm1hbGl6ZVNlbGVjdGlvbnNJZk5lY2Vzc2FyeSgpXG4gICAgaWYgQHNlbGVjdFRhcmdldCgpXG4gICAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgICAgQGNvbGxlY3QocmVzb2x2ZSlcbiAgICAgIC50aGVuID0+XG4gICAgICAgIGZvciBzZWxlY3Rpb24gaW4gQGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgICAgICAgICB0ZXh0ID0gQGdldE5ld1RleHQoc2VsZWN0aW9uLmdldFRleHQoKSwgc2VsZWN0aW9uKVxuICAgICAgICAgIHNlbGVjdGlvbi5pbnNlcnRUZXh0KHRleHQsIHtAYXV0b0luZGVudH0pXG4gICAgICAgIEByZXN0b3JlQ3Vyc29yUG9zaXRpb25zSWZOZWNlc3NhcnkoKVxuICAgICAgICBAYWN0aXZhdGVNb2RlKEBmaW5hbE1vZGUsIEBmaW5hbFN1Ym1vZGUpXG5cbiAgY29sbGVjdDogKHJlc29sdmUpIC0+XG4gICAgQHN0ZG91dEJ5U2VsZWN0aW9uID0gbmV3IE1hcFxuICAgIHByb2Nlc3NSdW5uaW5nID0gcHJvY2Vzc0ZpbmlzaGVkID0gMFxuICAgIGZvciBzZWxlY3Rpb24gaW4gQGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgICAgIHtjb21tYW5kLCBhcmdzfSA9IEBnZXRDb21tYW5kKHNlbGVjdGlvbikgPyB7fVxuICAgICAgcmV0dXJuIHVubGVzcyAoY29tbWFuZD8gYW5kIGFyZ3M/KVxuICAgICAgcHJvY2Vzc1J1bm5pbmcrK1xuICAgICAgZG8gKHNlbGVjdGlvbikgPT5cbiAgICAgICAgc3RkaW4gPSBAZ2V0U3RkaW4oc2VsZWN0aW9uKVxuICAgICAgICBzdGRvdXQgPSAob3V0cHV0KSA9PlxuICAgICAgICAgIEBzdGRvdXRCeVNlbGVjdGlvbi5zZXQoc2VsZWN0aW9uLCBvdXRwdXQpXG4gICAgICAgIGV4aXQgPSAoY29kZSkgLT5cbiAgICAgICAgICBwcm9jZXNzRmluaXNoZWQrK1xuICAgICAgICAgIHJlc29sdmUoKSBpZiAocHJvY2Vzc1J1bm5pbmcgaXMgcHJvY2Vzc0ZpbmlzaGVkKVxuICAgICAgICBAcnVuRXh0ZXJuYWxDb21tYW5kIHtjb21tYW5kLCBhcmdzLCBzdGRvdXQsIGV4aXQsIHN0ZGlufVxuXG4gIHJ1bkV4dGVybmFsQ29tbWFuZDogKG9wdGlvbnMpIC0+XG4gICAgc3RkaW4gPSBvcHRpb25zLnN0ZGluXG4gICAgZGVsZXRlIG9wdGlvbnMuc3RkaW5cbiAgICBidWZmZXJlZFByb2Nlc3MgPSBuZXcgQnVmZmVyZWRQcm9jZXNzKG9wdGlvbnMpXG4gICAgYnVmZmVyZWRQcm9jZXNzLm9uV2lsbFRocm93RXJyb3IgKHtlcnJvciwgaGFuZGxlfSkgPT5cbiAgICAgICMgU3VwcHJlc3MgY29tbWFuZCBub3QgZm91bmQgZXJyb3IgaW50ZW50aW9uYWxseS5cbiAgICAgIGlmIGVycm9yLmNvZGUgaXMgJ0VOT0VOVCcgYW5kIGVycm9yLnN5c2NhbGwuaW5kZXhPZignc3Bhd24nKSBpcyAwXG4gICAgICAgIGNvbW1hbmROYW1lID0gQGNvbnN0cnVjdG9yLmdldENvbW1hbmROYW1lKClcbiAgICAgICAgY29uc29sZS5sb2cgXCIje2NvbW1hbmROYW1lfTogRmFpbGVkIHRvIHNwYXduIGNvbW1hbmQgI3tlcnJvci5wYXRofS5cIlxuICAgICAgICBoYW5kbGUoKVxuICAgICAgQGNhbmNlbE9wZXJhdGlvbigpXG5cbiAgICBpZiBzdGRpblxuICAgICAgYnVmZmVyZWRQcm9jZXNzLnByb2Nlc3Muc3RkaW4ud3JpdGUoc3RkaW4pXG4gICAgICBidWZmZXJlZFByb2Nlc3MucHJvY2Vzcy5zdGRpbi5lbmQoKVxuXG4gIGdldE5ld1RleHQ6ICh0ZXh0LCBzZWxlY3Rpb24pIC0+XG4gICAgQGdldFN0ZG91dChzZWxlY3Rpb24pID8gdGV4dFxuXG4gICMgRm9yIGVhc2lseSBleHRlbmQgYnkgdm1wIHBsdWdpbi5cbiAgZ2V0Q29tbWFuZDogKHNlbGVjdGlvbikgLT4ge0Bjb21tYW5kLCBAYXJnc31cbiAgZ2V0U3RkaW46IChzZWxlY3Rpb24pIC0+IHNlbGVjdGlvbi5nZXRUZXh0KClcbiAgZ2V0U3Rkb3V0OiAoc2VsZWN0aW9uKSAtPiBAc3Rkb3V0QnlTZWxlY3Rpb24uZ2V0KHNlbGVjdGlvbilcblxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBUcmFuc2Zvcm1TdHJpbmdCeVNlbGVjdExpc3QgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmdcbiAgQGV4dGVuZCgpXG4gIEBkZXNjcmlwdGlvbjogXCJJbnRlcmFjdGl2ZWx5IGNob29zZSBzdHJpbmcgdHJhbnNmb3JtYXRpb24gb3BlcmF0b3IgZnJvbSBzZWxlY3QtbGlzdFwiXG4gIEBzZWxlY3RMaXN0SXRlbXM6IG51bGxcbiAgcmVxdWlyZUlucHV0OiB0cnVlXG5cbiAgZ2V0SXRlbXM6IC0+XG4gICAgQGNvbnN0cnVjdG9yLnNlbGVjdExpc3RJdGVtcyA/PSBAY29uc3RydWN0b3Iuc3RyaW5nVHJhbnNmb3JtZXJzLm1hcCAoa2xhc3MpIC0+XG4gICAgICBpZiBrbGFzczo6aGFzT3duUHJvcGVydHkoJ2Rpc3BsYXlOYW1lJylcbiAgICAgICAgZGlzcGxheU5hbWUgPSBrbGFzczo6ZGlzcGxheU5hbWVcbiAgICAgIGVsc2VcbiAgICAgICAgZGlzcGxheU5hbWUgPSBfLmh1bWFuaXplRXZlbnROYW1lKF8uZGFzaGVyaXplKGtsYXNzLm5hbWUpKVxuICAgICAge25hbWU6IGtsYXNzLCBkaXNwbGF5TmFtZX1cblxuICBpbml0aWFsaXplOiAtPlxuICAgIHN1cGVyXG5cbiAgICBAdmltU3RhdGUub25EaWRDb25maXJtU2VsZWN0TGlzdCAoaXRlbSkgPT5cbiAgICAgIHRyYW5zZm9ybWVyID0gaXRlbS5uYW1lXG4gICAgICBAdGFyZ2V0ID0gdHJhbnNmb3JtZXI6OnRhcmdldCBpZiB0cmFuc2Zvcm1lcjo6dGFyZ2V0P1xuICAgICAgQHZpbVN0YXRlLnJlc2V0KClcbiAgICAgIGlmIEB0YXJnZXQ/XG4gICAgICAgIEB2aW1TdGF0ZS5vcGVyYXRpb25TdGFjay5ydW4odHJhbnNmb3JtZXIsIHtAdGFyZ2V0fSlcbiAgICAgIGVsc2VcbiAgICAgICAgQHZpbVN0YXRlLm9wZXJhdGlvblN0YWNrLnJ1bih0cmFuc2Zvcm1lcilcblxuICAgIEBmb2N1c1NlbGVjdExpc3QoaXRlbXM6IEBnZXRJdGVtcygpKVxuXG4gIGV4ZWN1dGU6IC0+XG4gICAgIyBORVZFUiBiZSBleGVjdXRlZCBzaW5jZSBvcGVyYXRpb25TdGFjayBpcyByZXBsYWNlZCB3aXRoIHNlbGVjdGVkIHRyYW5zZm9ybWVyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiI3tAbmFtZX0gc2hvdWxkIG5vdCBiZSBleGVjdXRlZFwiKVxuXG5jbGFzcyBUcmFuc2Zvcm1Xb3JkQnlTZWxlY3RMaXN0IGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nQnlTZWxlY3RMaXN0XG4gIEBleHRlbmQoKVxuICB0YXJnZXQ6IFwiSW5uZXJXb3JkXCJcblxuY2xhc3MgVHJhbnNmb3JtU21hcnRXb3JkQnlTZWxlY3RMaXN0IGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nQnlTZWxlY3RMaXN0XG4gIEBleHRlbmQoKVxuICBAZGVzY3JpcHRpb246IFwiVHJhbnNmb3JtIElubmVyU21hcnRXb3JkIGJ5IGB0cmFuc2Zvcm0tc3RyaW5nLWJ5LXNlbGVjdC1saXN0YFwiXG4gIHRhcmdldDogXCJJbm5lclNtYXJ0V29yZFwiXG5cbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgUmVwbGFjZVdpdGhSZWdpc3RlciBleHRlbmRzIFRyYW5zZm9ybVN0cmluZ1xuICBAZXh0ZW5kKClcbiAgQGRlc2NyaXB0aW9uOiBcIlJlcGxhY2UgdGFyZ2V0IHdpdGggc3BlY2lmaWVkIHJlZ2lzdGVyIHZhbHVlXCJcbiAgZ2V0TmV3VGV4dDogKHRleHQpIC0+XG4gICAgQHZpbVN0YXRlLnJlZ2lzdGVyLmdldFRleHQoKVxuXG4jIFNhdmUgdGV4dCB0byByZWdpc3RlciBiZWZvcmUgcmVwbGFjZVxuY2xhc3MgU3dhcFdpdGhSZWdpc3RlciBleHRlbmRzIFRyYW5zZm9ybVN0cmluZ1xuICBAZXh0ZW5kKClcbiAgQGRlc2NyaXB0aW9uOiBcIlN3YXAgcmVnaXN0ZXIgdmFsdWUgd2l0aCB0YXJnZXRcIlxuICBnZXROZXdUZXh0OiAodGV4dCwgc2VsZWN0aW9uKSAtPlxuICAgIG5ld1RleHQgPSBAdmltU3RhdGUucmVnaXN0ZXIuZ2V0VGV4dCgpXG4gICAgQHNldFRleHRUb1JlZ2lzdGVyKHRleHQsIHNlbGVjdGlvbilcbiAgICBuZXdUZXh0XG5cbiMgSW5kZW50IDwgVHJhbnNmb3JtU3RyaW5nXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEluZGVudCBleHRlbmRzIFRyYW5zZm9ybVN0cmluZ1xuICBAZXh0ZW5kKClcbiAgc3RheUJ5TWFya2VyOiB0cnVlXG4gIHNldFRvRmlyc3RDaGFyYWN0ZXJPbkxpbmV3aXNlOiB0cnVlXG4gIHdpc2U6ICdsaW5ld2lzZSdcblxuICBtdXRhdGVTZWxlY3Rpb246IChzZWxlY3Rpb24pIC0+XG4gICAgIyBOZWVkIGNvdW50IHRpbWVzIGluZGVudGF0aW9uIGluIHZpc3VhbC1tb2RlIGFuZCBpdHMgcmVwZWF0KGAuYCkuXG4gICAgaWYgQHRhcmdldC5pcygnQ3VycmVudFNlbGVjdGlvbicpXG4gICAgICBvbGRUZXh0ID0gbnVsbFxuICAgICAgICMgbGltaXQgdG8gMTAwIHRvIGF2b2lkIGZyZWV6aW5nIGJ5IGFjY2lkZW50YWwgYmlnIG51bWJlci5cbiAgICAgIGNvdW50ID0gbGltaXROdW1iZXIoQGdldENvdW50KCksIG1heDogMTAwKVxuICAgICAgQGNvdW50VGltZXMgY291bnQsICh7c3RvcH0pID0+XG4gICAgICAgIG9sZFRleHQgPSBzZWxlY3Rpb24uZ2V0VGV4dCgpXG4gICAgICAgIEBpbmRlbnQoc2VsZWN0aW9uKVxuICAgICAgICBzdG9wKCkgaWYgc2VsZWN0aW9uLmdldFRleHQoKSBpcyBvbGRUZXh0XG4gICAgZWxzZVxuICAgICAgQGluZGVudChzZWxlY3Rpb24pXG5cbiAgaW5kZW50OiAoc2VsZWN0aW9uKSAtPlxuICAgIHNlbGVjdGlvbi5pbmRlbnRTZWxlY3RlZFJvd3MoKVxuXG5jbGFzcyBPdXRkZW50IGV4dGVuZHMgSW5kZW50XG4gIEBleHRlbmQoKVxuICBpbmRlbnQ6IChzZWxlY3Rpb24pIC0+XG4gICAgc2VsZWN0aW9uLm91dGRlbnRTZWxlY3RlZFJvd3MoKVxuXG5jbGFzcyBBdXRvSW5kZW50IGV4dGVuZHMgSW5kZW50XG4gIEBleHRlbmQoKVxuICBpbmRlbnQ6IChzZWxlY3Rpb24pIC0+XG4gICAgc2VsZWN0aW9uLmF1dG9JbmRlbnRTZWxlY3RlZFJvd3MoKVxuXG5jbGFzcyBUb2dnbGVMaW5lQ29tbWVudHMgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmdcbiAgQGV4dGVuZCgpXG4gIHN0YXlCeU1hcmtlcjogdHJ1ZVxuICB3aXNlOiAnbGluZXdpc2UnXG4gIG11dGF0ZVNlbGVjdGlvbjogKHNlbGVjdGlvbikgLT5cbiAgICBzZWxlY3Rpb24udG9nZ2xlTGluZUNvbW1lbnRzKClcblxuY2xhc3MgQXV0b0Zsb3cgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmdcbiAgQGV4dGVuZCgpXG4gIG11dGF0ZVNlbGVjdGlvbjogKHNlbGVjdGlvbikgLT5cbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKEBlZGl0b3JFbGVtZW50LCAnYXV0b2Zsb3c6cmVmbG93LXNlbGVjdGlvbicpXG5cbiMgU3Vycm91bmQgPCBUcmFuc2Zvcm1TdHJpbmdcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgU3Vycm91bmRCYXNlIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nXG4gIEBleHRlbmQoZmFsc2UpXG4gIHBhaXJzOiBbXG4gICAgWydbJywgJ10nXVxuICAgIFsnKCcsICcpJ11cbiAgICBbJ3snLCAnfSddXG4gICAgWyc8JywgJz4nXVxuICBdXG4gIHBhaXJDaGFyc0FsbG93Rm9yd2FyZGluZzogJ1tdKCl7fSdcbiAgaW5wdXQ6IG51bGxcbiAgcmVxdWlyZUlucHV0OiB0cnVlXG4gIHN1cHBvcnRFYXJseVNlbGVjdDogdHJ1ZSAjIEV4cGVyaW1lbnRhbFxuXG4gIGZvY3VzSW5wdXRGb3JTdXJyb3VuZENoYXI6IC0+XG4gICAgaW5wdXRVSSA9IEBuZXdJbnB1dFVJKClcbiAgICBpbnB1dFVJLm9uRGlkQ29uZmlybShAb25Db25maXJtU3Vycm91bmRDaGFyLmJpbmQodGhpcykpXG4gICAgaW5wdXRVSS5vbkRpZENhbmNlbChAY2FuY2VsT3BlcmF0aW9uLmJpbmQodGhpcykpXG4gICAgaW5wdXRVSS5mb2N1cygxLCB0cnVlKVxuXG4gIGZvY3VzSW5wdXRGb3JUYXJnZXRQYWlyQ2hhcjogLT5cbiAgICBpbnB1dFVJID0gQG5ld0lucHV0VUkoKVxuICAgIGlucHV0VUkub25EaWRDb25maXJtKEBvbkNvbmZpcm1UYXJnZXRQYWlyQ2hhci5iaW5kKHRoaXMpKVxuICAgIGlucHV0VUkub25EaWRDYW5jZWwoQGNhbmNlbE9wZXJhdGlvbi5iaW5kKHRoaXMpKVxuICAgIGlucHV0VUkuZm9jdXMoKVxuXG4gIGdldFBhaXI6IChjaGFyKSAtPlxuICAgIGlmIHBhaXIgPSBfLmRldGVjdChAcGFpcnMsIChwYWlyKSAtPiBjaGFyIGluIHBhaXIpXG4gICAgICBwYWlyXG4gICAgZWxzZVxuICAgICAgW2NoYXIsIGNoYXJdXG5cbiAgc3Vycm91bmQ6ICh0ZXh0LCBjaGFyLCBvcHRpb25zPXt9KSAtPlxuICAgIGtlZXBMYXlvdXQgPSBvcHRpb25zLmtlZXBMYXlvdXQgPyBmYWxzZVxuICAgIFtvcGVuLCBjbG9zZV0gPSBAZ2V0UGFpcihjaGFyKVxuICAgIGlmIChub3Qga2VlcExheW91dCkgYW5kIHRleHQuZW5kc1dpdGgoXCJcXG5cIilcbiAgICAgIEBhdXRvSW5kZW50QWZ0ZXJJbnNlcnRUZXh0ID0gdHJ1ZVxuICAgICAgb3BlbiArPSBcIlxcblwiXG4gICAgICBjbG9zZSArPSBcIlxcblwiXG5cbiAgICBpZiBjaGFyIGluIEBnZXRDb25maWcoJ2NoYXJhY3RlcnNUb0FkZFNwYWNlT25TdXJyb3VuZCcpIGFuZCBpc1NpbmdsZUxpbmVUZXh0KHRleHQpXG4gICAgICB0ZXh0ID0gJyAnICsgdGV4dCArICcgJ1xuXG4gICAgb3BlbiArIHRleHQgKyBjbG9zZVxuXG4gIGRlbGV0ZVN1cnJvdW5kOiAodGV4dCkgLT5cbiAgICBbb3BlbiwgaW5uZXJUZXh0Li4uLCBjbG9zZV0gPSB0ZXh0XG4gICAgaW5uZXJUZXh0ID0gaW5uZXJUZXh0LmpvaW4oJycpXG4gICAgaWYgaXNTaW5nbGVMaW5lVGV4dCh0ZXh0KSBhbmQgKG9wZW4gaXNudCBjbG9zZSlcbiAgICAgIGlubmVyVGV4dC50cmltKClcbiAgICBlbHNlXG4gICAgICBpbm5lclRleHRcblxuICBvbkNvbmZpcm1TdXJyb3VuZENoYXI6IChAaW5wdXQpIC0+XG4gICAgQHByb2Nlc3NPcGVyYXRpb24oKVxuXG4gIG9uQ29uZmlybVRhcmdldFBhaXJDaGFyOiAoY2hhcikgLT5cbiAgICBAc2V0VGFyZ2V0IEBuZXcoJ0FQYWlyJywgcGFpcjogQGdldFBhaXIoY2hhcikpXG5cbmNsYXNzIFN1cnJvdW5kIGV4dGVuZHMgU3Vycm91bmRCYXNlXG4gIEBleHRlbmQoKVxuICBAZGVzY3JpcHRpb246IFwiU3Vycm91bmQgdGFyZ2V0IGJ5IHNwZWNpZmllZCBjaGFyYWN0ZXIgbGlrZSBgKGAsIGBbYCwgYFxcXCJgXCJcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBvbkRpZFNlbGVjdFRhcmdldChAZm9jdXNJbnB1dEZvclN1cnJvdW5kQ2hhci5iaW5kKHRoaXMpKVxuICAgIHN1cGVyXG5cbiAgZ2V0TmV3VGV4dDogKHRleHQpIC0+XG4gICAgQHN1cnJvdW5kKHRleHQsIEBpbnB1dClcblxuY2xhc3MgU3Vycm91bmRXb3JkIGV4dGVuZHMgU3Vycm91bmRcbiAgQGV4dGVuZCgpXG4gIEBkZXNjcmlwdGlvbjogXCJTdXJyb3VuZCAqKndvcmQqKlwiXG4gIHRhcmdldDogJ0lubmVyV29yZCdcblxuY2xhc3MgU3Vycm91bmRTbWFydFdvcmQgZXh0ZW5kcyBTdXJyb3VuZFxuICBAZXh0ZW5kKClcbiAgQGRlc2NyaXB0aW9uOiBcIlN1cnJvdW5kICoqc21hcnQtd29yZCoqXCJcbiAgdGFyZ2V0OiAnSW5uZXJTbWFydFdvcmQnXG5cbmNsYXNzIE1hcFN1cnJvdW5kIGV4dGVuZHMgU3Vycm91bmRcbiAgQGV4dGVuZCgpXG4gIEBkZXNjcmlwdGlvbjogXCJTdXJyb3VuZCBlYWNoIHdvcmQoYC9cXHcrL2ApIHdpdGhpbiB0YXJnZXRcIlxuICBvY2N1cnJlbmNlOiB0cnVlXG4gIHBhdHRlcm5Gb3JPY2N1cnJlbmNlOiAvXFx3Ky9nXG5cbiMgRGVsZXRlIFN1cnJvdW5kXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIERlbGV0ZVN1cnJvdW5kIGV4dGVuZHMgU3Vycm91bmRCYXNlXG4gIEBleHRlbmQoKVxuICBAZGVzY3JpcHRpb246IFwiRGVsZXRlIHNwZWNpZmllZCBzdXJyb3VuZCBjaGFyYWN0ZXIgbGlrZSBgKGAsIGBbYCwgYFxcXCJgXCJcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBmb2N1c0lucHV0Rm9yVGFyZ2V0UGFpckNoYXIoKSB1bmxlc3MgQHRhcmdldD9cbiAgICBzdXBlclxuXG4gIG9uQ29uZmlybVRhcmdldFBhaXJDaGFyOiAoaW5wdXQpIC0+XG4gICAgc3VwZXJcbiAgICBAaW5wdXQgPSBpbnB1dFxuICAgIEBwcm9jZXNzT3BlcmF0aW9uKClcblxuICBnZXROZXdUZXh0OiAodGV4dCkgLT5cbiAgICBAZGVsZXRlU3Vycm91bmQodGV4dClcblxuY2xhc3MgRGVsZXRlU3Vycm91bmRBbnlQYWlyIGV4dGVuZHMgRGVsZXRlU3Vycm91bmRcbiAgQGV4dGVuZCgpXG4gIEBkZXNjcmlwdGlvbjogXCJEZWxldGUgc3Vycm91bmQgY2hhcmFjdGVyIGJ5IGF1dG8tZGV0ZWN0IHBhaXJlZCBjaGFyIGZyb20gY3Vyc29yIGVuY2xvc2VkIHBhaXJcIlxuICB0YXJnZXQ6ICdBQW55UGFpcidcbiAgcmVxdWlyZUlucHV0OiBmYWxzZVxuXG5jbGFzcyBEZWxldGVTdXJyb3VuZEFueVBhaXJBbGxvd0ZvcndhcmRpbmcgZXh0ZW5kcyBEZWxldGVTdXJyb3VuZEFueVBhaXJcbiAgQGV4dGVuZCgpXG4gIEBkZXNjcmlwdGlvbjogXCJEZWxldGUgc3Vycm91bmQgY2hhcmFjdGVyIGJ5IGF1dG8tZGV0ZWN0IHBhaXJlZCBjaGFyIGZyb20gY3Vyc29yIGVuY2xvc2VkIHBhaXIgYW5kIGZvcndhcmRpbmcgcGFpciB3aXRoaW4gc2FtZSBsaW5lXCJcbiAgdGFyZ2V0OiAnQUFueVBhaXJBbGxvd0ZvcndhcmRpbmcnXG5cbiMgQ2hhbmdlIFN1cnJvdW5kXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIENoYW5nZVN1cnJvdW5kIGV4dGVuZHMgU3Vycm91bmRCYXNlXG4gIEBleHRlbmQoKVxuICBAZGVzY3JpcHRpb246IFwiQ2hhbmdlIHN1cnJvdW5kIGNoYXJhY3Rlciwgc3BlY2lmeSBib3RoIGZyb20gYW5kIHRvIHBhaXIgY2hhclwiXG5cbiAgc2hvd0RlbGV0ZUNoYXJPbkhvdmVyOiAtPlxuICAgIGNoYXIgPSBAZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpWzBdXG4gICAgQHZpbVN0YXRlLmhvdmVyLnNldChjaGFyLCBAdmltU3RhdGUuZ2V0T3JpZ2luYWxDdXJzb3JQb3NpdGlvbigpKVxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgaWYgQHRhcmdldD9cbiAgICAgIEBvbkRpZEZhaWxTZWxlY3RUYXJnZXQoQGFib3J0LmJpbmQodGhpcykpXG4gICAgZWxzZVxuICAgICAgQG9uRGlkRmFpbFNlbGVjdFRhcmdldChAY2FuY2VsT3BlcmF0aW9uLmJpbmQodGhpcykpXG4gICAgICBAZm9jdXNJbnB1dEZvclRhcmdldFBhaXJDaGFyKClcbiAgICBzdXBlclxuXG4gICAgQG9uRGlkU2VsZWN0VGFyZ2V0ID0+XG4gICAgICBAc2hvd0RlbGV0ZUNoYXJPbkhvdmVyKClcbiAgICAgIEBmb2N1c0lucHV0Rm9yU3Vycm91bmRDaGFyKClcblxuICBnZXROZXdUZXh0OiAodGV4dCkgLT5cbiAgICBpbm5lclRleHQgPSBAZGVsZXRlU3Vycm91bmQodGV4dClcbiAgICBAc3Vycm91bmQoaW5uZXJUZXh0LCBAaW5wdXQsIGtlZXBMYXlvdXQ6IHRydWUpXG5cbmNsYXNzIENoYW5nZVN1cnJvdW5kQW55UGFpciBleHRlbmRzIENoYW5nZVN1cnJvdW5kXG4gIEBleHRlbmQoKVxuICBAZGVzY3JpcHRpb246IFwiQ2hhbmdlIHN1cnJvdW5kIGNoYXJhY3RlciwgZnJvbSBjaGFyIGlzIGF1dG8tZGV0ZWN0ZWRcIlxuICB0YXJnZXQ6IFwiQUFueVBhaXJcIlxuXG5jbGFzcyBDaGFuZ2VTdXJyb3VuZEFueVBhaXJBbGxvd0ZvcndhcmRpbmcgZXh0ZW5kcyBDaGFuZ2VTdXJyb3VuZEFueVBhaXJcbiAgQGV4dGVuZCgpXG4gIEBkZXNjcmlwdGlvbjogXCJDaGFuZ2Ugc3Vycm91bmQgY2hhcmFjdGVyLCBmcm9tIGNoYXIgaXMgYXV0by1kZXRlY3RlZCBmcm9tIGVuY2xvc2VkIGFuZCBmb3J3YXJkaW5nIGFyZWFcIlxuICB0YXJnZXQ6IFwiQUFueVBhaXJBbGxvd0ZvcndhcmRpbmdcIlxuXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgRklYTUVcbiMgQ3VycmVudGx5IG5hdGl2ZSBlZGl0b3Iuam9pbkxpbmVzKCkgaXMgYmV0dGVyIGZvciBjdXJzb3IgcG9zaXRpb24gc2V0dGluZ1xuIyBTbyBJIHVzZSBuYXRpdmUgbWV0aG9kcyBmb3IgYSBtZWFud2hpbGUuXG5jbGFzcyBKb2luIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nXG4gIEBleHRlbmQoKVxuICB0YXJnZXQ6IFwiTW92ZVRvUmVsYXRpdmVMaW5lXCJcbiAgZmxhc2hUYXJnZXQ6IGZhbHNlXG4gIHJlc3RvcmVQb3NpdGlvbnM6IGZhbHNlXG5cbiAgbXV0YXRlU2VsZWN0aW9uOiAoc2VsZWN0aW9uKSAtPlxuICAgIGlmIGlzTGluZXdpc2VSYW5nZShyYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpKVxuICAgICAgc2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKHJhbmdlLnRyYW5zbGF0ZShbMCwgMF0sIFstMSwgSW5maW5pdHldKSlcbiAgICBzZWxlY3Rpb24uam9pbkxpbmVzKClcbiAgICBlbmQgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5lbmRcbiAgICBzZWxlY3Rpb24uY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKGVuZC50cmFuc2xhdGUoWzAsIC0xXSkpXG5cbmNsYXNzIEpvaW5CYXNlIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nXG4gIEBleHRlbmQoZmFsc2UpXG4gIHdpc2U6ICdsaW5ld2lzZSdcbiAgdHJpbTogZmFsc2VcbiAgdGFyZ2V0OiBcIk1vdmVUb1JlbGF0aXZlTGluZU1pbmltdW1PbmVcIlxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQGZvY3VzSW5wdXQoMTApIGlmIEByZXF1aXJlSW5wdXRcbiAgICBzdXBlclxuXG4gIGdldE5ld1RleHQ6ICh0ZXh0KSAtPlxuICAgIGlmIEB0cmltXG4gICAgICBwYXR0ZXJuID0gL1xccj9cXG5bIFxcdF0qL2dcbiAgICBlbHNlXG4gICAgICBwYXR0ZXJuID0gL1xccj9cXG4vZ1xuICAgIHRleHQudHJpbVJpZ2h0KCkucmVwbGFjZShwYXR0ZXJuLCBAaW5wdXQpICsgXCJcXG5cIlxuXG5jbGFzcyBKb2luV2l0aEtlZXBpbmdTcGFjZSBleHRlbmRzIEpvaW5CYXNlXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBpbnB1dDogJydcblxuY2xhc3MgSm9pbkJ5SW5wdXQgZXh0ZW5kcyBKb2luQmFzZVxuICBAZXh0ZW5kKClcbiAgQHJlZ2lzdGVyVG9TZWxlY3RMaXN0KClcbiAgQGRlc2NyaXB0aW9uOiBcIlRyYW5zZm9ybSBtdWx0aS1saW5lIHRvIHNpbmdsZS1saW5lIGJ5IHdpdGggc3BlY2lmaWVkIHNlcGFyYXRvciBjaGFyYWN0ZXJcIlxuICByZXF1aXJlSW5wdXQ6IHRydWVcbiAgdHJpbTogdHJ1ZVxuXG5jbGFzcyBKb2luQnlJbnB1dFdpdGhLZWVwaW5nU3BhY2UgZXh0ZW5kcyBKb2luQnlJbnB1dFxuICBAZXh0ZW5kKClcbiAgQHJlZ2lzdGVyVG9TZWxlY3RMaXN0KClcbiAgQGRlc2NyaXB0aW9uOiBcIkpvaW4gbGluZXMgd2l0aG91dCBwYWRkaW5nIHNwYWNlIGJldHdlZW4gZWFjaCBsaW5lXCJcbiAgdHJpbTogZmFsc2VcblxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIFN0cmluZyBzdWZmaXggaW4gbmFtZSBpcyB0byBhdm9pZCBjb25mdXNpb24gd2l0aCAnc3BsaXQnIHdpbmRvdy5cbmNsYXNzIFNwbGl0U3RyaW5nIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBAZGVzY3JpcHRpb246IFwiU3BsaXQgc2luZ2xlLWxpbmUgaW50byBtdWx0aS1saW5lIGJ5IHNwbGl0dGluZyBzcGVjaWZpZWQgc2VwYXJhdG9yIGNoYXJzXCJcbiAgcmVxdWlyZUlucHV0OiB0cnVlXG4gIGlucHV0OiBudWxsXG4gIHRhcmdldDogXCJNb3ZlVG9SZWxhdGl2ZUxpbmVcIlxuICBrZWVwU3BsaXR0ZXI6IGZhbHNlXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICBAb25EaWRTZXRUYXJnZXQgPT5cbiAgICAgIEBmb2N1c0lucHV0KDEwKVxuICAgIHN1cGVyXG5cbiAgZ2V0TmV3VGV4dDogKHRleHQpIC0+XG4gICAgaW5wdXQgPSBAaW5wdXQgb3IgXCJcXFxcblwiXG4gICAgcmVnZXggPSAvLy8je18uZXNjYXBlUmVnRXhwKGlucHV0KX0vLy9nXG4gICAgaWYgQGtlZXBTcGxpdHRlclxuICAgICAgbGluZVNlcGFyYXRvciA9IEBpbnB1dCArIFwiXFxuXCJcbiAgICBlbHNlXG4gICAgICBsaW5lU2VwYXJhdG9yID0gXCJcXG5cIlxuICAgIHRleHQucmVwbGFjZShyZWdleCwgbGluZVNlcGFyYXRvcilcblxuY2xhc3MgU3BsaXRTdHJpbmdXaXRoS2VlcGluZ1NwbGl0dGVyIGV4dGVuZHMgU3BsaXRTdHJpbmdcbiAgQGV4dGVuZCgpXG4gIEByZWdpc3RlclRvU2VsZWN0TGlzdCgpXG4gIGtlZXBTcGxpdHRlcjogdHJ1ZVxuXG5jbGFzcyBTcGxpdEFyZ3VtZW50cyBleHRlbmRzIFRyYW5zZm9ybVN0cmluZ1xuICBAZXh0ZW5kKClcbiAgQHJlZ2lzdGVyVG9TZWxlY3RMaXN0KClcbiAga2VlcFNlcGFyYXRvcjogdHJ1ZVxuICBhdXRvSW5kZW50QWZ0ZXJJbnNlcnRUZXh0OiB0cnVlXG5cbiAgZ2V0TmV3VGV4dDogKHRleHQpIC0+XG4gICAgYWxsVG9rZW5zID0gc3BsaXRBcmd1bWVudHModGV4dC50cmltKCkpXG4gICAgbmV3VGV4dCA9ICcnXG4gICAgd2hpbGUgYWxsVG9rZW5zLmxlbmd0aFxuICAgICAge3RleHQsIHR5cGV9ID0gYWxsVG9rZW5zLnNoaWZ0KClcbiAgICAgIGlmIHR5cGUgaXMgJ3NlcGFyYXRvcidcbiAgICAgICAgaWYgQGtlZXBTZXBhcmF0b3JcbiAgICAgICAgICB0ZXh0ID0gdGV4dC50cmltKCkgKyBcIlxcblwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0ZXh0ID0gXCJcXG5cIlxuICAgICAgbmV3VGV4dCArPSB0ZXh0XG4gICAgXCJcXG5cIiArIG5ld1RleHQgKyBcIlxcblwiXG5cbmNsYXNzIFNwbGl0QXJndW1lbnRzV2l0aFJlbW92ZVNlcGFyYXRvciBleHRlbmRzIFNwbGl0QXJndW1lbnRzXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBrZWVwU2VwYXJhdG9yOiBmYWxzZVxuXG5jbGFzcyBTcGxpdEFyZ3VtZW50c09mSW5uZXJBbnlQYWlyIGV4dGVuZHMgU3BsaXRBcmd1bWVudHNcbiAgQGV4dGVuZCgpXG4gIEByZWdpc3RlclRvU2VsZWN0TGlzdCgpXG4gIHRhcmdldDogXCJJbm5lckFueVBhaXJcIlxuXG5jbGFzcyBDaGFuZ2VPcmRlciBleHRlbmRzIFRyYW5zZm9ybVN0cmluZ1xuICBAZXh0ZW5kKGZhbHNlKVxuICBnZXROZXdUZXh0OiAodGV4dCkgLT5cbiAgICBpZiBAdGFyZ2V0LmlzTGluZXdpc2UoKVxuICAgICAgQGdldE5ld0xpc3Qoc3BsaXRUZXh0QnlOZXdMaW5lKHRleHQpKS5qb2luKFwiXFxuXCIpICsgXCJcXG5cIlxuICAgIGVsc2VcbiAgICAgIEBzb3J0QXJndW1lbnRzSW5UZXh0QnkodGV4dCwgKGFyZ3MpID0+IEBnZXROZXdMaXN0KGFyZ3MpKVxuXG4gIHNvcnRBcmd1bWVudHNJblRleHRCeTogKHRleHQsIGZuKSAtPlxuICAgIGxlYWRpbmdTcGFjZXMgPSB0cmFpbGluZ1NwYWNlcyA9ICcnXG4gICAgc3RhcnQgPSB0ZXh0LnNlYXJjaCgvXFxTLylcbiAgICBlbmQgPSB0ZXh0LnNlYXJjaCgvXFxzKiQvKVxuICAgIGxlYWRpbmdTcGFjZXMgPSB0cmFpbGluZ1NwYWNlcyA9ICcnXG4gICAgbGVhZGluZ1NwYWNlcyA9IHRleHRbMC4uLnN0YXJ0XSBpZiBzdGFydCBpc250IC0xXG4gICAgdHJhaWxpbmdTcGFjZXMgPSB0ZXh0W2VuZC4uLl0gaWYgZW5kIGlzbnQgLTFcbiAgICB0ZXh0ID0gdGV4dFtzdGFydC4uLmVuZF1cblxuICAgIGFsbFRva2VucyA9IHNwbGl0QXJndW1lbnRzKHRleHQpXG4gICAgYXJncyA9IGFsbFRva2Vuc1xuICAgICAgLmZpbHRlciAodG9rZW4pIC0+IHRva2VuLnR5cGUgaXMgJ2FyZ3VtZW50J1xuICAgICAgLm1hcCAodG9rZW4pIC0+IHRva2VuLnRleHRcbiAgICBuZXdBcmdzID0gZm4oYXJncylcblxuICAgIG5ld1RleHQgPSAnJ1xuICAgIHdoaWxlIGFsbFRva2Vucy5sZW5ndGhcbiAgICAgIHt0ZXh0LCB0eXBlfSA9IGFsbFRva2Vucy5zaGlmdCgpXG4gICAgICBuZXdUZXh0ICs9IHN3aXRjaCB0eXBlXG4gICAgICAgIHdoZW4gJ3NlcGFyYXRvcicgdGhlbiB0ZXh0XG4gICAgICAgIHdoZW4gJ2FyZ3VtZW50JyB0aGVuIG5ld0FyZ3Muc2hpZnQoKVxuICAgIGxlYWRpbmdTcGFjZXMgKyBuZXdUZXh0ICsgdHJhaWxpbmdTcGFjZXNcblxuY2xhc3MgUmV2ZXJzZSBleHRlbmRzIENoYW5nZU9yZGVyXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBnZXROZXdMaXN0OiAocm93cykgLT5cbiAgICByb3dzLnJldmVyc2UoKVxuXG5jbGFzcyBSZXZlcnNlSW5uZXJBbnlQYWlyIGV4dGVuZHMgUmV2ZXJzZVxuICBAZXh0ZW5kKClcbiAgdGFyZ2V0OiBcIklubmVyQW55UGFpclwiXG5cbmNsYXNzIFJvdGF0ZSBleHRlbmRzIENoYW5nZU9yZGVyXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBnZXROZXdMaXN0OiAocm93cykgLT5cbiAgICByb3dzLnVuc2hpZnQocm93cy5wb3AoKSlcbiAgICByb3dzXG5cbmNsYXNzIFJvdGF0ZUJhY2t3YXJkcyBleHRlbmRzIENoYW5nZU9yZGVyXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBnZXROZXdMaXN0OiAocm93cykgLT5cbiAgICByb3dzLnB1c2gocm93cy5zaGlmdCgpKVxuICAgIHJvd3NcblxuY2xhc3MgU29ydCBleHRlbmRzIENoYW5nZU9yZGVyXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBAZGVzY3JpcHRpb246IFwiU29ydCBhbHBoYWJldGljYWxseVwiXG4gIGdldE5ld0xpc3Q6IChyb3dzKSAtPlxuICAgIHJvd3Muc29ydCgpXG5cbmNsYXNzIFNvcnRDYXNlSW5zZW5zaXRpdmVseSBleHRlbmRzIENoYW5nZU9yZGVyXG4gIEBleHRlbmQoKVxuICBAcmVnaXN0ZXJUb1NlbGVjdExpc3QoKVxuICBAZGVzY3JpcHRpb246IFwiU29ydCBhbHBoYWJldGljYWxseSB3aXRoIGNhc2UgaW5zZW5zaXRpdmVseVwiXG4gIGdldE5ld0xpc3Q6IChyb3dzKSAtPlxuICAgIHJvd3Muc29ydCAocm93QSwgcm93QikgLT5cbiAgICAgIHJvd0EubG9jYWxlQ29tcGFyZShyb3dCLCBzZW5zaXRpdml0eTogJ2Jhc2UnKVxuXG5jbGFzcyBTb3J0QnlOdW1iZXIgZXh0ZW5kcyBDaGFuZ2VPcmRlclxuICBAZXh0ZW5kKClcbiAgQHJlZ2lzdGVyVG9TZWxlY3RMaXN0KClcbiAgQGRlc2NyaXB0aW9uOiBcIlNvcnQgbnVtZXJpY2FsbHlcIlxuICBnZXROZXdMaXN0OiAocm93cykgLT5cbiAgICBfLnNvcnRCeSByb3dzLCAocm93KSAtPlxuICAgICAgTnVtYmVyLnBhcnNlSW50KHJvdykgb3IgSW5maW5pdHlcbiJdfQ==
