(function() {
  var Disposable, Settings, inferType;

  Disposable = require('atom').Disposable;

  inferType = function(value) {
    switch (false) {
      case !Number.isInteger(value):
        return 'integer';
      case typeof value !== 'boolean':
        return 'boolean';
      case typeof value !== 'string':
        return 'string';
      case !Array.isArray(value):
        return 'array';
    }
  };

  Settings = (function() {
    Settings.prototype.deprecatedParams = ['showCursorInVisualMode', 'showCursorInVisualMode2'];

    Settings.prototype.notifyDeprecatedParams = function() {
      var content, deprecatedParams, j, len, notification, param;
      deprecatedParams = this.deprecatedParams.filter((function(_this) {
        return function(param) {
          return _this.has(param);
        };
      })(this));
      if (deprecatedParams.length === 0) {
        return;
      }
      content = [this.scope + ": Config options deprecated.  ", "Remove from your `connfig.cson` now?  "];
      for (j = 0, len = deprecatedParams.length; j < len; j++) {
        param = deprecatedParams[j];
        content.push("- `" + param + "`");
      }
      return notification = atom.notifications.addWarning(content.join("\n"), {
        dismissable: true,
        buttons: [
          {
            text: 'Remove All',
            onDidClick: (function(_this) {
              return function() {
                var k, len1;
                for (k = 0, len1 = deprecatedParams.length; k < len1; k++) {
                  param = deprecatedParams[k];
                  _this["delete"](param);
                }
                return notification.dismiss();
              };
            })(this)
          }
        ]
      });
    };

    function Settings(scope, config) {
      var i, j, k, key, len, len1, name, ref, ref1, value;
      this.scope = scope;
      this.config = config;
      ref = Object.keys(this.config);
      for (j = 0, len = ref.length; j < len; j++) {
        key = ref[j];
        if (typeof this.config[key] === 'boolean') {
          this.config[key] = {
            "default": this.config[key]
          };
        }
        if ((value = this.config[key]).type == null) {
          value.type = inferType(value["default"]);
        }
      }
      ref1 = Object.keys(this.config);
      for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
        name = ref1[i];
        this.config[name].order = i;
      }
    }

    Settings.prototype.has = function(param) {
      return param in atom.config.get(this.scope);
    };

    Settings.prototype["delete"] = function(param) {
      return this.set(param, void 0);
    };

    Settings.prototype.get = function(param) {
      return atom.config.get(this.scope + "." + param);
    };

    Settings.prototype.set = function(param, value) {
      return atom.config.set(this.scope + "." + param, value);
    };

    Settings.prototype.toggle = function(param) {
      return this.set(param, !this.get(param));
    };

    Settings.prototype.observe = function(param, fn) {
      return atom.config.observe(this.scope + "." + param, fn);
    };

    Settings.prototype.observeConditionalKeymaps = function() {
      var conditionalKeymaps, observeConditionalKeymap;
      conditionalKeymaps = {
        keymapUnderscoreToReplaceWithRegister: {
          'atom-text-editor.vim-mode-plus:not(.insert-mode)': {
            '_': 'vim-mode-plus:replace-with-register'
          }
        },
        keymapPToPutWithAutoIndent: {
          'atom-text-editor.vim-mode-plus:not(.insert-mode):not(.operator-pending-mode)': {
            'P': 'vim-mode-plus:put-before-with-auto-indent',
            'p': 'vim-mode-plus:put-after-with-auto-indent'
          }
        },
        keymapCCToChangeInnerSmartWord: {
          'atom-text-editor.vim-mode-plus.operator-pending-mode.change-pending': {
            'c': 'vim-mode-plus:inner-smart-word'
          }
        },
        keymapSemicolonToInnerAnyPairInOperatorPendingMode: {
          'atom-text-editor.vim-mode-plus.operator-pending-mode': {
            ';': 'vim-mode-plus:inner-any-pair'
          }
        },
        keymapSemicolonToInnerAnyPairInVisualMode: {
          'atom-text-editor.vim-mode-plus.visual-mode': {
            ';': 'vim-mode-plus:inner-any-pair'
          }
        },
        keymapBackslashToInnerCommentOrParagraphWhenToggleLineCommentsIsPending: {
          'atom-text-editor.vim-mode-plus.operator-pending-mode.toggle-line-comments-pending': {
            '/': 'vim-mode-plus:inner-comment-or-paragraph'
          }
        }
      };
      observeConditionalKeymap = (function(_this) {
        return function(param) {
          var disposable, keymapSource;
          keymapSource = "vim-mode-plus-conditional-keymap:" + param;
          disposable = _this.observe(param, function(newValue) {
            if (newValue) {
              return atom.keymaps.add(keymapSource, conditionalKeymaps[param]);
            } else {
              return atom.keymaps.removeBindingsFromSource(keymapSource);
            }
          });
          return new Disposable(function() {
            disposable.dispose();
            return atom.keymaps.removeBindingsFromSource(keymapSource);
          });
        };
      })(this);
      return Object.keys(conditionalKeymaps).map(function(param) {
        return observeConditionalKeymap(param);
      });
    };

    return Settings;

  })();

  module.exports = new Settings('vim-mode-plus', {
    keymapUnderscoreToReplaceWithRegister: {
      "default": false,
      description: "Can: `_ i (` to replace inner-parenthesis with register's value<br>\nCan: `_ i ;` to replace inner-any-pair if you enabled `keymapSemicolonToInnerAnyPairInOperatorPendingMode`<br>\nConflicts: `_`( `move-to-first-character-of-line-and-down` ) motion. Who use this??"
    },
    keymapPToPutWithAutoIndent: {
      "default": false,
      description: "Remap `p` and `P` to auto indent version.<br>\n`p` remapped to `put-before-with-auto-indent` from original `put-before`<br>\n`P` remapped to `put-after-with-auto-indent` from original `put-after`<br>\nConflicts: Original `put-after` and `put-before` become unavailable unless you set different keymap by yourself."
    },
    keymapCCToChangeInnerSmartWord: {
      "default": false,
      description: "Can: `c c` to `change inner-smart-word`<br>\nConflicts: `c c`( change-current-line ) keystroke which is equivalent to `S` or `c i l` etc."
    },
    keymapSemicolonToInnerAnyPairInOperatorPendingMode: {
      "default": false,
      description: "Can: `c ;` to `change inner-any-pair`, Conflicts with original `;`( `repeat-find` ) motion.<br>\nConflicts: `;`( `repeat-find` )."
    },
    keymapSemicolonToInnerAnyPairInVisualMode: {
      "default": false,
      description: "Can: `v ;` to `select inner-any-pair`, Conflicts with original `;`( `repeat-find` ) motion.<br>L\nConflicts: `;`( `repeat-find` )."
    },
    keymapBackslashToInnerCommentOrParagraphWhenToggleLineCommentsIsPending: {
      "default": false,
      description: "Can: `g / /` to comment-in already commented region, `g / /` to comment-out paragraph.<br>\nConflicts: `/`( `search` ) motion only when `g /` is pending. you no longe can `g /` with search."
    },
    setCursorToStartOfChangeOnUndoRedo: true,
    setCursorToStartOfChangeOnUndoRedoStrategy: {
      "default": 'smart',
      "enum": ['smart', 'simple'],
      description: "When you think undo/redo cursor position has BUG, set this to `simple`.<br>\n`smart`: Good accuracy but have cursor-not-updated-on-different-editor limitation<br>\n`simple`: Always work, but accuracy is not as good as `smart`.<br>"
    },
    groupChangesWhenLeavingInsertMode: true,
    useClipboardAsDefaultRegister: true,
    dontUpdateRegisterOnChangeOrSubstitute: {
      "default": false,
      description: "When set to `true` any `change` or `substitute` operation no longer update register content<br>\nAffects `c`, `C`, `s`, `S` operator."
    },
    startInInsertMode: false,
    startInInsertModeScopes: {
      "default": [],
      items: {
        type: 'string'
      },
      description: 'Start in insert-mode when editorElement matches scope'
    },
    clearMultipleCursorsOnEscapeInsertMode: false,
    autoSelectPersistentSelectionOnOperate: true,
    automaticallyEscapeInsertModeOnActivePaneItemChange: {
      "default": false,
      description: 'Escape insert-mode on tab switch, pane switch'
    },
    wrapLeftRightMotion: false,
    numberRegex: {
      "default": '-?[0-9]+',
      description: "Used to find number in ctrl-a/ctrl-x.<br>\nTo ignore \"-\"(minus) char in string like \"identifier-1\" use `(?:\\B-)?[0-9]+`"
    },
    clearHighlightSearchOnResetNormalMode: {
      "default": true,
      description: 'Clear highlightSearch on `escape` in normal-mode'
    },
    clearPersistentSelectionOnResetNormalMode: {
      "default": true,
      description: 'Clear persistentSelection on `escape` in normal-mode'
    },
    charactersToAddSpaceOnSurround: {
      "default": [],
      items: {
        type: 'string'
      },
      description: "Comma separated list of character, which add space around surrounded text.<br>\nFor vim-surround compatible behavior, set `(, {, [, <`."
    },
    ignoreCaseForSearch: {
      "default": false,
      description: 'For `/` and `?`'
    },
    useSmartcaseForSearch: {
      "default": false,
      description: 'For `/` and `?`. Override `ignoreCaseForSearch`'
    },
    ignoreCaseForSearchCurrentWord: {
      "default": false,
      description: 'For `*` and `#`.'
    },
    useSmartcaseForSearchCurrentWord: {
      "default": false,
      description: 'For `*` and `#`. Override `ignoreCaseForSearchCurrentWord`'
    },
    highlightSearch: true,
    highlightSearchExcludeScopes: {
      "default": [],
      items: {
        type: 'string'
      },
      description: 'Suppress highlightSearch when any of these classes are present in the editor'
    },
    incrementalSearch: false,
    incrementalSearchVisitDirection: {
      "default": 'absolute',
      "enum": ['absolute', 'relative'],
      description: "When `relative`, `tab`, and `shift-tab` respect search direction('/' or '?')"
    },
    stayOnTransformString: {
      "default": false,
      description: "Don't move cursor after TransformString e.g upper-case, surround"
    },
    stayOnYank: {
      "default": false,
      description: "Don't move cursor after yank"
    },
    stayOnDelete: {
      "default": false,
      description: "Don't move cursor after delete"
    },
    stayOnOccurrence: {
      "default": true,
      description: "Don't move cursor when operator works on occurrences( when `true`, override operator specific `stayOn` options )"
    },
    keepColumnOnSelectTextObject: {
      "default": false,
      description: "Keep column on select TextObject(Paragraph, Indentation, Fold, Function, Edge)"
    },
    moveToFirstCharacterOnVerticalMotion: {
      "default": true,
      description: "Almost equivalent to `startofline` pure-Vim option. When true, move cursor to first char.<br>\nAffects to `ctrl-f, b, d, u`, `G`, `H`, `M`, `L`, `gg`<br>\nUnlike pure-Vim, `d`, `<<`, `>>` are not affected by this option, use independent `stayOn` options."
    },
    flashOnUndoRedo: true,
    flashOnMoveToOccurrence: {
      "default": false,
      description: "Affects normal-mode's `tab`, `shift-tab`."
    },
    flashOnOperate: true,
    flashOnOperateBlacklist: {
      "default": [],
      items: {
        type: 'string'
      },
      description: 'Comma separated list of operator class name to disable flash e.g. "yank, auto-indent"'
    },
    flashOnSearch: true,
    flashScreenOnSearchHasNoMatch: true,
    showHoverSearchCounter: false,
    showHoverSearchCounterDuration: {
      "default": 700,
      description: "Duration(msec) for hover search counter"
    },
    hideTabBarOnMaximizePane: {
      "default": true,
      description: "If set to `false`, tab still visible after maximize-pane( `cmd-enter` )"
    },
    hideStatusBarOnMaximizePane: {
      "default": true
    },
    smoothScrollOnFullScrollMotion: {
      "default": false,
      description: "For `ctrl-f` and `ctrl-b`"
    },
    smoothScrollOnFullScrollMotionDuration: {
      "default": 500,
      description: "Smooth scroll duration in milliseconds for `ctrl-f` and `ctrl-b`"
    },
    smoothScrollOnHalfScrollMotion: {
      "default": false,
      description: "For `ctrl-d` and `ctrl-u`"
    },
    smoothScrollOnHalfScrollMotionDuration: {
      "default": 500,
      description: "Smooth scroll duration in milliseconds for `ctrl-d` and `ctrl-u`"
    },
    statusBarModeStringStyle: {
      "default": 'short',
      "enum": ['short', 'long']
    },
    debug: {
      "default": false,
      description: "[Dev use]"
    },
    strictAssertion: {
      "default": false,
      description: "[Dev use] to catche wired state in vmp-dev, enable this if you want help me"
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMvbGliL3NldHRpbmdzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsYUFBYyxPQUFBLENBQVEsTUFBUjs7RUFFZixTQUFBLEdBQVksU0FBQyxLQUFEO0FBQ1YsWUFBQSxLQUFBO0FBQUEsWUFDTyxNQUFNLENBQUMsU0FBUCxDQUFpQixLQUFqQixDQURQO2VBQ29DO0FBRHBDLFdBRU8sT0FBTyxLQUFQLEtBQWlCLFNBRnhCO2VBRXVDO0FBRnZDLFdBR08sT0FBTyxLQUFQLEtBQWlCLFFBSHhCO2VBR3NDO0FBSHRDLFlBSU8sS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFkLENBSlA7ZUFJaUM7QUFKakM7RUFEVTs7RUFPTjt1QkFDSixnQkFBQSxHQUFrQixDQUNoQix3QkFEZ0IsRUFFaEIseUJBRmdCOzt1QkFJbEIsc0JBQUEsR0FBd0IsU0FBQTtBQUN0QixVQUFBO01BQUEsZ0JBQUEsR0FBbUIsSUFBQyxDQUFBLGdCQUFnQixDQUFDLE1BQWxCLENBQXlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lCQUFXLEtBQUMsQ0FBQSxHQUFELENBQUssS0FBTDtRQUFYO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QjtNQUNuQixJQUFVLGdCQUFnQixDQUFDLE1BQWpCLEtBQTJCLENBQXJDO0FBQUEsZUFBQTs7TUFFQSxPQUFBLEdBQVUsQ0FDTCxJQUFDLENBQUEsS0FBRixHQUFRLGdDQURGLEVBRVIsd0NBRlE7QUFJVixXQUFBLGtEQUFBOztRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsS0FBQSxHQUFNLEtBQU4sR0FBWSxHQUF6QjtBQUFBO2FBRUEsWUFBQSxHQUFlLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsT0FBTyxDQUFDLElB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a0VBRGI7S0ExSkY7SUE0SkEsOEJBQUEsRUFDRTtNQUFBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FBVDtNQUNBLFdBQUEsRUFBYSwyQkFEYjtLQTdKRjtJQStKQSxzQ0FBQSxFQUNFO01BQUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxHQUFUO01BQ0EsV0FBQSxFQUFhLGtFQURiO0tBaEtGO0lBa0tBLHdCQUFBLEVBQ0U7TUFBQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE9BQVQ7TUFDQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FETjtLQW5LRjtJQXFLQSxLQUFBLEVBQ0U7TUFBQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBQVQ7TUFDQSxXQUFBLEVBQWEsV0FEYjtLQXRLRjtJQXdLQSxlQUFBLEVBQ0U7TUFBQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBQVQ7TUFDQSxXQUFBLEVBQWEsNkVBRGI7S0F6S0Y7R0FEbUI7QUF4R3JCIiwic291cmNlc0NvbnRlbnQiOlsie0Rpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuaW5mZXJUeXBlID0gKHZhbHVlKSAtPlxuICBzd2l0Y2hcbiAgICB3aGVuIE51bWJlci5pc0ludGVnZXIodmFsdWUpIHRoZW4gJ2ludGVnZXInXG4gICAgd2hlbiB0eXBlb2YodmFsdWUpIGlzICdib29sZWFuJyB0aGVuICdib29sZWFuJ1xuICAgIHdoZW4gdHlwZW9mKHZhbHVlKSBpcyAnc3RyaW5nJyB0aGVuICdzdHJpbmcnXG4gICAgd2hlbiBBcnJheS5pc0FycmF5KHZhbHVlKSB0aGVuICdhcnJheSdcblxuY2xhc3MgU2V0dGluZ3NcbiAgZGVwcmVjYXRlZFBhcmFtczogW1xuICAgICdzaG93Q3Vyc29ySW5WaXN1YWxNb2RlJ1xuICAgICdzaG93Q3Vyc29ySW5WaXN1YWxNb2RlMidcbiAgXVxuICBub3RpZnlEZXByZWNhdGVkUGFyYW1zOiAtPlxuICAgIGRlcHJlY2F0ZWRQYXJhbXMgPSBAZGVwcmVjYXRlZFBhcmFtcy5maWx0ZXIoKHBhcmFtKSA9PiBAaGFzKHBhcmFtKSlcbiAgICByZXR1cm4gaWYgZGVwcmVjYXRlZFBhcmFtcy5sZW5ndGggaXMgMFxuXG4gICAgY29udGVudCA9IFtcbiAgICAgIFwiI3tAc2NvcGV9OiBDb25maWcgb3B0aW9ucyBkZXByZWNhdGVkLiAgXCIsXG4gICAgICBcIlJlbW92ZSBmcm9tIHlvdXIgYGNvbm5maWcuY3NvbmAgbm93PyAgXCJcbiAgICBdXG4gICAgY29udGVudC5wdXNoIFwiLSBgI3twYXJhbX1gXCIgZm9yIHBhcmFtIGluIGRlcHJlY2F0ZWRQYXJhbXNcblxuICAgIG5vdGlmaWNhdGlvbiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nIGNvbnRlbnQuam9pbihcIlxcblwiKSxcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICBidXR0b25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnUmVtb3ZlIEFsbCdcbiAgICAgICAgICBvbkRpZENsaWNrOiA9PlxuICAgICAgICAgICAgQGRlbGV0ZShwYXJhbSkgZm9yIHBhcmFtIGluIGRlcHJlY2F0ZWRQYXJhbXNcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKClcbiAgICAgICAgfVxuICAgICAgXVxuXG4gIGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAY29uZmlnKSAtPlxuICAgICMgQXV0b21hdGljYWxseSBpbmZlciBhbmQgaW5qZWN0IGB0eXBlYCBvZiBlYWNoIGNvbmZpZyBwYXJhbWV0ZXIuXG4gICAgIyBza2lwIGlmIHZhbHVlIHdoaWNoIGFsZWFkeSBoYXZlIGB0eXBlYCBmaWVsZC5cbiAgICAjIEFsc28gdHJhbnNsYXRlIGJhcmUgYGJvb2xlYW5gIHZhbHVlIHRvIHtkZWZhdWx0OiBgYm9vbGVhbmB9IG9iamVjdFxuICAgIGZvciBrZXkgaW4gT2JqZWN0LmtleXMoQGNvbmZpZylcbiAgICAgIGlmIHR5cGVvZihAY29uZmlnW2tleV0pIGlzICdib29sZWFuJ1xuICAgICAgICBAY29uZmlnW2tleV0gPSB7ZGVmYXVsdDogQGNvbmZpZ1trZXldfVxuICAgICAgdW5sZXNzICh2YWx1ZSA9IEBjb25maWdba2V5XSkudHlwZT9cbiAgICAgICAgdmFsdWUudHlwZSA9IGluZmVyVHlwZSh2YWx1ZS5kZWZhdWx0KVxuXG4gICAgIyBbQ0FVVElPTl0gaW5qZWN0aW5nIG9yZGVyIHByb3BldHkgdG8gc2V0IG9yZGVyIHNob3duIGF0IHNldHRpbmctdmlldyBNVVNULUNPTUUtTEFTVC5cbiAgICBmb3IgbmFtZSwgaSBpbiBPYmplY3Qua2V5cyhAY29uZmlnKVxuICAgICAgQGNvbmZpZ1tuYW1lXS5vcmRlciA9IGlcblxuICBoYXM6IChwYXJhbSkgLT5cbiAgICBwYXJhbSBvZiBhdG9tLmNvbmZpZy5nZXQoQHNjb3BlKVxuXG4gIGRlbGV0ZTogKHBhcmFtKSAtPlxuICAgIEBzZXQocGFyYW0sIHVuZGVmaW5lZClcblxuICBnZXQ6IChwYXJhbSkgLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQoXCIje0BzY29wZX0uI3twYXJhbX1cIilcblxuICBzZXQ6IChwYXJhbSwgdmFsdWUpIC0+XG4gICAgYXRvbS5jb25maWcuc2V0KFwiI3tAc2NvcGV9LiN7cGFyYW19XCIsIHZhbHVlKVxuXG4gIHRvZ2dsZTogKHBhcmFtKSAtPlxuICAgIEBzZXQocGFyYW0sIG5vdCBAZ2V0KHBhcmFtKSlcblxuICBvYnNlcnZlOiAocGFyYW0sIGZuKSAtPlxuICAgIGF0b20uY29uZmlnLm9ic2VydmUoXCIje0BzY29wZX0uI3twYXJhbX1cIiwgZm4pXG5cbiAgb2JzZXJ2ZUNvbmRpdGlvbmFsS2V5bWFwczogLT5cbiAgICBjb25kaXRpb25hbEtleW1hcHMgPVxuICAgICAga2V5bWFwVW5kZXJzY29yZVRvUmVwbGFjZVdpdGhSZWdpc3RlcjpcbiAgICAgICAgJ2F0b20tdGV4dC1lZGl0b3IudmltLW1vZGUtcGx1czpub3QoLmluc2VydC1tb2RlKSc6XG4gICAgICAgICAgJ18nOiAndmltLW1vZGUtcGx1czpyZXBsYWNlLXdpdGgtcmVnaXN0ZXInXG4gICAgICBrZXltYXBQVG9QdXRXaXRoQXV0b0luZGVudDpcbiAgICAgICAgJ2F0b20tdGV4dC1lZGl0b3IudmltLW1vZGUtcGx1czpub3QoLmluc2VydC1tb2RlKTpub3QoLm9wZXJhdG9yLXBlbmRpbmctbW9kZSknOlxuICAgICAgICAgICdQJzogJ3ZpbS1tb2RlLXBsdXM6cHV0LWJlZm9yZS13aXRoLWF1dG8taW5kZW50J1xuICAgICAgICAgICdwJzogJ3ZpbS1tb2RlLXBsdXM6cHV0LWFmdGVyLXdpdGgtYXV0by1pbmRlbnQnXG4gICAgICBrZXltYXBDQ1RvQ2hhbmdlSW5uZXJTbWFydFdvcmQ6XG4gICAgICAgICdhdG9tLXRleHQtZWRpdG9yLnZpbS1tb2RlLXBsdXMub3BlcmF0b3ItcGVuZGluZy1tb2RlLmNoYW5nZS1wZW5kaW5nJzpcbiAgICAgICAgICAnYyc6ICd2aW0tbW9kZS1wbHVzOmlubmVyLXNtYXJ0LXdvcmQnXG4gICAgICBrZXltYXBTZW1pY29sb25Ub0lubmVyQW55UGFpckluT3BlcmF0b3JQZW5kaW5nTW9kZTpcbiAgICAgICAgJ2F0b20tdGV4dC1lZGl0b3IudmltLW1vZGUtcGx1cy5vcGVyYXRvci1wZW5kaW5nLW1vZGUnOlxuICAgICAgICAgICc7JzogJ3ZpbS1tb2RlLXBsdXM6aW5uZXItYW55LXBhaXInXG4gICAgICBrZXltYXBTZW1pY29sb25Ub0lubmVyQW55UGFpckluVmlzdWFsTW9kZTpcbiAgICAgICAgJ2F0b20tdGV4dC1lZGl0b3IudmltLW1vZGUtcGx1cy52aXN1YWwtbW9kZSc6XG4gICAgICAgICAgJzsnOiAndmltLW1vZGUtcGx1czppbm5lci1hbnktcGFpcidcbiAgICAgIGtleW1hcEJhY2tzbGFzaFRvSW5uZXJDb21tZW50T3JQYXJhZ3JhcGhXaGVuVG9nZ2xlTGluZUNvbW1lbnRzSXNQZW5kaW5nOlxuICAgICAgICAnYXRvbS10ZXh0LWVkaXRvci52aW0tbW9kZS1wbHVzLm9wZXJhdG9yLXBlbmRpbmctbW9kZS50b2dnbGUtbGluZS1jb21tZW50cy1wZW5kaW5nJzpcbiAgICAgICAgICAnLyc6ICd2aW0tbW9kZS1wbHVzOmlubmVyLWNvbW1lbnQtb3ItcGFyYWdyYXBoJ1xuXG4gICAgb2JzZXJ2ZUNvbmRpdGlvbmFsS2V5bWFwID0gKHBhcmFtKSA9PlxuICAgICAga2V5bWFwU291cmNlID0gXCJ2aW0tbW9kZS1wbHVzLWNvbmRpdGlvbmFsLWtleW1hcDoje3BhcmFtfVwiXG4gICAgICBkaXNwb3NhYmxlID0gQG9ic2VydmUgcGFyYW0sIChuZXdWYWx1ZSkgLT5cbiAgICAgICAgaWYgbmV3VmFsdWVcbiAgICAgICAgICBhdG9tLmtleW1hcHMuYWRkKGtleW1hcFNvdXJjZSwgY29uZGl0aW9uYWxLZXltYXBzW3BhcmFtXSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ua2V5bWFwcy5yZW1vdmVCaW5kaW5nc0Zyb21Tb3VyY2Uoa2V5bWFwU291cmNlKVxuXG4gICAgICBuZXcgRGlzcG9zYWJsZSAtPlxuICAgICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKVxuICAgICAgICBhdG9tLmtleW1hcHMucmVtb3ZlQmluZGluZ3NGcm9tU291cmNlKGtleW1hcFNvdXJjZSlcblxuICAgICMgUmV0dXJuIGRpc3Bvc2FsYmVzIHRvIGRpc3Bvc2UgY29uZmlnIG9ic2VydmF0aW9uIGFuZCBjb25kaXRpb25hbCBrZXltYXAuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbmRpdGlvbmFsS2V5bWFwcykubWFwIChwYXJhbSkgLT4gb2JzZXJ2ZUNvbmRpdGlvbmFsS2V5bWFwKHBhcmFtKVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTZXR0aW5ncyAndmltLW1vZGUtcGx1cycsXG4gIGtleW1hcFVuZGVyc2NvcmVUb1JlcGxhY2VXaXRoUmVnaXN0ZXI6XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBkZXNjcmlwdGlvbjogXCJcIlwiXG4gICAgQ2FuOiBgXyBpIChgIHRvIHJlcGxhY2UgaW5uZXItcGFyZW50aGVzaXMgd2l0aCByZWdpc3RlcidzIHZhbHVlPGJyPlxuICAgIENhbjogYF8gaSA7YCB0byByZXBsYWNlIGlubmVyLWFueS1wYWlyIGlmIHlvdSBlbmFibGVkIGBrZXltYXBTZW1pY29sb25Ub0lubmVyQW55UGFpckluT3BlcmF0b3JQZW5kaW5nTW9kZWA8YnI+XG4gICAgQ29uZmxpY3RzOiBgX2AoIGBtb3ZlLXRvLWZpcnN0LWNoYXJhY3Rlci1vZi1saW5lLWFuZC1kb3duYCApIG1vdGlvbi4gV2hvIHVzZSB0aGlzPz9cbiAgICBcIlwiXCJcbiAga2V5bWFwUFRvUHV0V2l0aEF1dG9JbmRlbnQ6XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBkZXNjcmlwdGlvbjogXCJcIlwiXG4gICAgUmVtYXAgYHBgIGFuZCBgUGAgdG8gYXV0byBpbmRlbnQgdmVyc2lvbi48YnI+XG4gICAgYHBgIHJlbWFwcGVkIHRvIGBwdXQtYmVmb3JlLXdpdGgtYXV0by1pbmRlbnRgIGZyb20gb3JpZ2luYWwgYHB1dC1iZWZvcmVgPGJyPlxuICAgIGBQYCByZW1hcHBlZCB0byBgcHV0LWFmdGVyLXdpdGgtYXV0by1pbmRlbnRgIGZyb20gb3JpZ2luYWwgYHB1dC1hZnRlcmA8YnI+XG4gICAgQ29uZmxpY3RzOiBPcmlnaW5hbCBgcHV0LWFmdGVyYCBhbmQgYHB1dC1iZWZvcmVgIGJlY29tZSB1bmF2YWlsYWJsZSB1bmxlc3MgeW91IHNldCBkaWZmZXJlbnQga2V5bWFwIGJ5IHlvdXJzZWxmLlxuICAgIFwiXCJcIlxuICBrZXltYXBDQ1RvQ2hhbmdlSW5uZXJTbWFydFdvcmQ6XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBkZXNjcmlwdGlvbjogXCJcIlwiXG4gICAgQ2FuOiBgYyBjYCB0byBgY2hhbmdlIGlubmVyLXNtYXJ0LXdvcmRgPGJyPlxuICAgIENvbmZsaWN0czogYGMgY2AoIGNoYW5nZS1jdXJyZW50LWxpbmUgKSBrZXlzdHJva2Ugd2hpY2ggaXMgZXF1aXZhbGVudCB0byBgU2Agb3IgYGMgaSBsYCBldGMuXG4gICAgXCJcIlwiXG4gIGtleW1hcFNlbWljb2xvblRvSW5uZXJBbnlQYWlySW5PcGVyYXRvclBlbmRpbmdNb2RlOlxuICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgZGVzY3JpcHRpb246IFwiXCJcIlxuICAgIENhbjogYGMgO2AgdG8gYGNoYW5nZSBpbm5lci1hbnktcGFpcmAsIENvbmZsaWN0cyB3aXRoIG9yaWdpbmFsIGA7YCggYHJlcGVhdC1maW5kYCApIG1vdGlvbi48YnI+XG4gICAgQ29uZmxpY3RzOiBgO2AoIGByZXBlYXQtZmluZGAgKS5cbiAgICBcIlwiXCJcbiAga2V5bWFwU2VtaWNvbG9uVG9Jbm5lckFueVBhaXJJblZpc3VhbE1vZGU6XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBkZXNjcmlwdGlvbjogXCJcIlwiXG4gICAgQ2FuOiBgdiA7YCB0byBgc2VsZWN0IGlubmVyLWFueS1wYWlyYCwgQ29uZmxpY3RzIHdpdGggb3JpZ2luYWwgYDtgKCBgcmVwZWF0LWZpbmRgICkgbW90aW9uLjxicj5MXG4gICAgQ29uZmxpY3RzOiBgO2AoIGByZXBlYXQtZmluZGAgKS5cbiAgICBcIlwiXCJcbiAga2V5bWFwQmFja3NsYXNoVG9Jbm5lckNvbW1lbnRPclBhcmFncmFwaFdoZW5Ub2dnbGVMaW5lQ29tbWVudHNJc1BlbmRpbmc6XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBkZXNjcmlwdGlvbjogXCJcIlwiXG4gICAgQ2FuOiBgZyAvIC9gIHRvIGNvbW1lbnQtaW4gYWxyZWFkeSBjb21tZW50ZWQgcmVnaW9uLCBgZyAvIC9gIHRvIGNvbW1lbnQtb3V0IHBhcmFncmFwaC48YnI+XG4gICAgQ29uZmxpY3RzOiBgL2AoIGBzZWFyY2hgICkgbW90aW9uIG9ubHkgd2hlbiBgZyAvYCBpcyBwZW5kaW5nLiB5b3Ugbm8gbG9uZ2UgY2FuIGBnIC9gIHdpdGggc2VhcmNoLlxuICAgIFwiXCJcIlxuICBzZXRDdXJzb3JUb1N0YXJ0T2ZDaGFuZ2VPblVuZG9SZWRvOiB0cnVlXG4gIHNldEN1cnNvclRvU3RhcnRPZkNoYW5nZU9uVW5kb1JlZG9TdHJhdGVneTpcbiAgICBkZWZhdWx0OiAnc21hcnQnXG4gICAgZW51bTogWydzbWFydCcsICdzaW1wbGUnXVxuICAgIGRlc2NyaXB0aW9uOiBcIlwiXCJcbiAgICBXaGVuIHlvdSB0aGluayB1bmRvL3JlZG8gY3Vyc29yIHBvc2l0aW9uIGhhcyBCVUcsIHNldCB0aGlzIHRvIGBzaW1wbGVgLjxicj5cbiAgICBgc21hcnRgOiBHb29kIGFjY3VyYWN5IGJ1dCBoYXZlIGN1cnNvci1ub3QtdXBkYXRlZC1vbi1kaWZmZXJlbnQtZWRpdG9yIGxpbWl0YXRpb248YnI+XG4gICAgYHNpbXBsZWA6IEFsd2F5cyB3b3JrLCBidXQgYWNjdXJhY3kgaXMgbm90IGFzIGdvb2QgYXMgYHNtYXJ0YC48YnI+XG4gICAgXCJcIlwiXG4gIGdyb3VwQ2hhbmdlc1doZW5MZWF2aW5nSW5zZXJ0TW9kZTogdHJ1ZVxuICB1c2VDbGlwYm9hcmRBc0RlZmF1bHRSZWdpc3RlcjogdHJ1ZVxuICBkb250VXBkYXRlUmVnaXN0ZXJPbkNoYW5nZU9yU3Vic3RpdHV0ZTpcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGRlc2NyaXB0aW9uOiBcIlwiXCJcbiAgICBXaGVuIHNldCB0byBgdHJ1ZWAgYW55IGBjaGFuZ2VgIG9yIGBzdWJzdGl0dXRlYCBvcGVyYXRpb24gbm8gbG9uZ2VyIHVwZGF0ZSByZWdpc3RlciBjb250ZW50PGJyPlxuICAgIEFmZmVjdHMgYGNgLCBgQ2AsIGBzYCwgYFNgIG9wZXJhdG9yLlxuICAgIFwiXCJcIlxuICBzdGFydEluSW5zZXJ0TW9kZTogZmFsc2VcbiAgc3RhcnRJbkluc2VydE1vZGVTY29wZXM6XG4gICAgZGVmYXVsdDogW11cbiAgICBpdGVtczogdHlwZTogJ3N0cmluZydcbiAgICBkZXNjcmlwdGlvbjogJ1N0YXJ0IGluIGluc2VydC1tb2RlIHdoZW4gZWRpdG9yRWxlbWVudCBtYXRjaGVzIHNjb3BlJ1xuICBjbGVhck11bHRpcGxlQ3Vyc29yc09uRXNjYXBlSW5zZXJ0TW9kZTogZmFsc2VcbiAgYXV0b1NlbGVjdFBlcnNpc3RlbnRTZWxlY3Rpb25Pbk9wZXJhdGU6IHRydWVcbiAgYXV0b21hdGljYWxseUVzY2FwZUluc2VydE1vZGVPbkFjdGl2ZVBhbmVJdGVtQ2hhbmdlOlxuICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgZGVzY3JpcHRpb246ICdFc2NhcGUgaW5zZXJ0LW1vZGUgb24gdGFiIHN3aXRjaCwgcGFuZSBzd2l0Y2gnXG4gIHdyYXBMZWZ0UmlnaHRNb3Rpb246IGZhbHNlXG4gIG51bWJlclJlZ2V4OlxuICAgIGRlZmF1bHQ6ICctP1swLTldKydcbiAgICBkZXNjcmlwdGlvbjogXCJcIlwiXG4gICAgICBVc2VkIHRvIGZpbmQgbnVtYmVyIGluIGN0cmwtYS9jdHJsLXguPGJyPlxuICAgICAgVG8gaWdub3JlIFwiLVwiKG1pbnVzKSBjaGFyIGluIHN0cmluZyBsaWtlIFwiaWRlbnRpZmllci0xXCIgdXNlIGAoPzpcXFxcQi0pP1swLTldK2BcbiAgICAgIFwiXCJcIlxuICBjbGVhckhpZ2hsaWdodFNlYXJjaE9uUmVzZXROb3JtYWxNb2RlOlxuICAgIGRlZmF1bHQ6IHRydWVcbiAgICBkZXNjcmlwdGlvbjogJ0NsZWFyIGhpZ2hsaWdodFNlYXJjaCBvbiBgZXNjYXBlYCBpbiBub3JtYWwtbW9kZSdcbiAgY2xlYXJQZXJzaXN0ZW50U2VsZWN0aW9uT25SZXNldE5vcm1hbE1vZGU6XG4gICAgZGVmYXVsdDogdHJ1ZVxuICAgIGRlc2NyaXB0aW9uOiAnQ2xlYXIgcGVyc2lzdGVudFNlbGVjdGlvbiBvbiBgZXNjYXBlYCBpbiBub3JtYWwtbW9kZSdcbiAgY2hhcmFjdGVyc1RvQWRkU3BhY2VPblN1cnJvdW5kOlxuICAgIGRlZmF1bHQ6IFtdXG4gICAgaXRlbXM6IHR5cGU6ICdzdHJpbmcnXG4gICAgZGVzY3JpcHRpb246IFwiXCJcIlxuICAgICAgQ29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgY2hhcmFjdGVyLCB3aGljaCBhZGQgc3BhY2UgYXJvdW5kIHN1cnJvdW5kZWQgdGV4dC48YnI+XG4gICAgICBGb3IgdmltLXN1cnJvdW5kIGNvbXBhdGlibGUgYmVoYXZpb3IsIHNldCBgKCwgeywgWywgPGAuXG4gICAgICBcIlwiXCJcbiAgaWdub3JlQ2FzZUZvclNlYXJjaDpcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGRlc2NyaXB0aW9uOiAnRm9yIGAvYCBhbmQgYD9gJ1xuICB1c2VTbWFydGNhc2VGb3JTZWFyY2g6XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBkZXNjcmlwdGlvbjogJ0ZvciBgL2AgYW5kIGA/YC4gT3ZlcnJpZGUgYGlnbm9yZUNhc2VGb3JTZWFyY2hgJ1xuICBpZ25vcmVDYXNlRm9yU2VhcmNoQ3VycmVudFdvcmQ6XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBkZXNjcmlwdGlvbjogJ0ZvciBgKmAgYW5kIGAjYC4nXG4gIHVzZVNtYXJ0Y2FzZUZvclNlYXJjaEN1cnJlbnRXb3JkOlxuICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgZGVzY3JpcHRpb246ICdGb3IgYCpgIGFuZCBgI2AuIE92ZXJyaWRlIGBpZ25vcmVDYXNlRm9yU2VhcmNoQ3VycmVudFdvcmRgJ1xuICBoaWdobGlnaHRTZWFyY2g6IHRydWVcbiAgaGlnaGxpZ2h0U2VhcmNoRXhjbHVkZVNjb3BlczpcbiAgICBkZWZhdWx0OiBbXVxuICAgIGl0ZW1zOiB0eXBlOiAnc3RyaW5nJ1xuICAgIGRlc2NyaXB0aW9uOiAnU3VwcHJlc3MgaGlnaGxpZ2h0U2VhcmNoIHdoZW4gYW55IG9mIHRoZXNlIGNsYXNzZXMgYXJlIHByZXNlbnQgaW4gdGhlIGVkaXRvcidcbiAgaW5jcmVtZW50YWxTZWFyY2g6IGZhbHNlXG4gIGluY3JlbWVudGFsU2VhcmNoVmlzaXREaXJlY3Rpb246XG4gICAgZGVmYXVsdDogJ2Fic29sdXRlJ1xuICAgIGVudW06IFsnYWJzb2x1dGUnLCAncmVsYXRpdmUnXVxuICAgIGRlc2NyaXB0aW9uOiBcIldoZW4gYHJlbGF0aXZlYCwgYHRhYmAsIGFuZCBgc2hpZnQtdGFiYCByZXNwZWN0IHNlYXJjaCBkaXJlY3Rpb24oJy8nIG9yICc/JylcIlxuICBzdGF5T25UcmFuc2Zvcm1TdHJpbmc6XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBkZXNjcmlwdGlvbjogXCJEb24ndCBtb3ZlIGN1cnNvciBhZnRlciBUcmFuc2Zvcm1TdHJpbmcgZS5nIHVwcGVyLWNhc2UsIHN1cnJvdW5kXCJcbiAgc3RheU9uWWFuazpcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGRlc2NyaXB0aW9uOiBcIkRvbid0IG1vdmUgY3Vyc29yIGFmdGVyIHlhbmtcIlxuICBzdGF5T25EZWxldGU6XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBkZXNjcmlwdGlvbjogXCJEb24ndCBtb3ZlIGN1cnNvciBhZnRlciBkZWxldGVcIlxuICBzdGF5T25PY2N1cnJlbmNlOlxuICAgIGRlZmF1bHQ6IHRydWVcbiAgICBkZXNjcmlwdGlvbjogXCJEb24ndCBtb3ZlIGN1cnNvciB3aGVuIG9wZXJhdG9yIHdvcmtzIG9uIG9jY3VycmVuY2VzKCB3aGVuIGB0cnVlYCwgb3ZlcnJpZGUgb3BlcmF0b3Igc3BlY2lmaWMgYHN0YXlPbmAgb3B0aW9ucyApXCJcbiAga2VlcENvbHVtbk9uU2VsZWN0VGV4dE9iamVjdDpcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGRlc2NyaXB0aW9uOiBcIktlZXAgY29sdW1uIG9uIHNlbGVjdCBUZXh0T2JqZWN0KFBhcmFncmFwaCwgSW5kZW50YXRpb24sIEZvbGQsIEZ1bmN0aW9uLCBFZGdlKVwiXG4gIG1vdmVUb0ZpcnN0Q2hhcmFjdGVyT25WZXJ0aWNhbE1vdGlvbjpcbiAgICBkZWZhdWx0OiB0cnVlXG4gICAgZGVzY3JpcHRpb246IFwiXCJcIlxuICAgICAgQWxtb3N0IGVxdWl2YWxlbnQgdG8gYHN0YXJ0b2ZsaW5lYCBwdXJlLVZpbSBvcHRpb24uIFdoZW4gdHJ1ZSwgbW92ZSBjdXJzb3IgdG8gZmlyc3QgY2hhci48YnI+XG4gICAgICBBZmZlY3RzIHRvIGBjdHJsLWYsIGIsIGQsIHVgLCBgR2AsIGBIYCwgYE1gLCBgTGAsIGBnZ2A8YnI+XG4gICAgICBVbmxpa2UgcHVyZS1WaW0sIGBkYCwgYDw8YCwgYD4+YCBhcmUgbm90IGFmZmVjdGVkIGJ5IHRoaXMgb3B0aW9uLCB1c2UgaW5kZXBlbmRlbnQgYHN0YXlPbmAgb3B0aW9ucy5cbiAgICAgIFwiXCJcIlxuICBmbGFzaE9uVW5kb1JlZG86IHRydWVcbiAgZmxhc2hPbk1vdmVUb09jY3VycmVuY2U6XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBkZXNjcmlwdGlvbjogXCJBZmZlY3RzIG5vcm1hbC1tb2RlJ3MgYHRhYmAsIGBzaGlmdC10YWJgLlwiXG4gIGZsYXNoT25PcGVyYXRlOiB0cnVlXG4gIGZsYXNoT25PcGVyYXRlQmxhY2tsaXN0OlxuICAgIGRlZmF1bHQ6IFtdXG4gICAgaXRlbXM6IHR5cGU6ICdzdHJpbmcnXG4gICAgZGVzY3JpcHRpb246ICdDb21tYSBzZXBhcmF0ZWQgbGlzdCBvZiBvcGVyYXRvciBjbGFzcyBuYW1lIHRvIGRpc2FibGUgZmxhc2ggZS5nLiBcInlhbmssIGF1dG8taW5kZW50XCInXG4gIGZsYXNoT25TZWFyY2g6IHRydWVcbiAgZmxhc2hTY3JlZW5PblNlYXJjaEhhc05vTWF0Y2g6IHRydWVcbiAgc2hvd0hvdmVyU2VhcmNoQ291bnRlcjogZmFsc2VcbiAgc2hvd0hvdmVyU2VhcmNoQ291bnRlckR1cmF0aW9uOlxuICAgIGRlZmF1bHQ6IDcwMFxuICAgIGRlc2NyaXB0aW9uOiBcIkR1cmF0aW9uKG1zZWMpIGZvciBob3ZlciBzZWFyY2ggY291bnRlclwiXG4gIGhpZGVUYWJCYXJPbk1heGltaXplUGFuZTpcbiAgICBkZWZhdWx0OiB0cnVlXG4gICAgZGVzY3JpcHRpb246IFwiSWYgc2V0IHRvIGBmYWxzZWAsIHRhYiBzdGlsbCB2aXNpYmxlIGFmdGVyIG1heGltaXplLXBhbmUoIGBjbWQtZW50ZXJgIClcIlxuICBoaWRlU3RhdHVzQmFyT25NYXhpbWl6ZVBhbmU6XG4gICAgZGVmYXVsdDogdHJ1ZVxuICBzbW9vdGhTY3JvbGxPbkZ1bGxTY3JvbGxNb3Rpb246XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBkZXNjcmlwdGlvbjogXCJGb3IgYGN0cmwtZmAgYW5kIGBjdHJsLWJgXCJcbiAgc21vb3RoU2Nyb2xsT25GdWxsU2Nyb2xsTW90aW9uRHVyYXRpb246XG4gICAgZGVmYXVsdDogNTAwXG4gICAgZGVzY3JpcHRpb246IFwiU21vb3RoIHNjcm9sbCBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgZm9yIGBjdHJsLWZgIGFuZCBgY3RybC1iYFwiXG4gIHNtb290aFNjcm9sbE9uSGFsZlNjcm9sbE1vdGlvbjpcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGRlc2NyaXB0aW9uOiBcIkZvciBgY3RybC1kYCBhbmQgYGN0cmwtdWBcIlxuICBzbW9vdGhTY3JvbGxPbkhhbGZTY3JvbGxNb3Rpb25EdXJhdGlvbjpcbiAgICBkZWZhdWx0OiA1MDBcbiAgICBkZXNjcmlwdGlvbjogXCJTbW9vdGggc2Nyb2xsIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcyBmb3IgYGN0cmwtZGAgYW5kIGBjdHJsLXVgXCJcbiAgc3RhdHVzQmFyTW9kZVN0cmluZ1N0eWxlOlxuICAgIGRlZmF1bHQ6ICdzaG9ydCdcbiAgICBlbnVtOiBbJ3Nob3J0JywgJ2xvbmcnXVxuICBkZWJ1ZzpcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGRlc2NyaXB0aW9uOiBcIltEZXYgdXNlXVwiXG4gIHN0cmljdEFzc2VydGlvbjpcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGRlc2NyaXB0aW9uOiBcIltEZXYgdXNlXSB0byBjYXRjaGUgd2lyZWQgc3RhdGUgaW4gdm1wLWRldiwgZW5hYmxlIHRoaXMgaWYgeW91IHdhbnQgaGVscCBtZVwiXG4iXX0=
