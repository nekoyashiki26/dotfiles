(function() {
  var Base, CompositeDisposable, Disposable, Emitter, StatusBarManager, VimState, _, addClassList, forEachPaneAxis, globalState, ref, ref1, removeClassList, settings,
    slice = [].slice;

  _ = require('underscore-plus');

  ref = require('atom'), Disposable = ref.Disposable, Emitter = ref.Emitter, CompositeDisposable = ref.CompositeDisposable;

  Base = require('./base');

  StatusBarManager = require('./status-bar-manager');

  globalState = require('./global-state');

  settings = require('./settings');

  VimState = require('./vim-state');

  ref1 = require('./utils'), forEachPaneAxis = ref1.forEachPaneAxis, addClassList = ref1.addClassList, removeClassList = ref1.removeClassList;

  module.exports = {
    config: settings.config,
    activate: function(state) {
      var developer, service;
      this.subscriptions = new CompositeDisposable;
      this.statusBarManager = new StatusBarManager;
      this.emitter = new Emitter;
      service = this.provideVimModePlus();
      this.subscribe(Base.init(service));
      this.registerCommands();
      this.registerVimStateCommands();
      settings.notifyDeprecatedParams();
      if (atom.inSpecMode()) {
        settings.set('strictAssertion', true);
      }
      if (atom.inDevMode()) {
        developer = new (require('./developer'));
        this.subscribe(developer.init(service));
      }
      this.subscribe(this.observeVimMode(function() {
        var message;
        message = "## Message by vim-mode-plus: vim-mode detected!\nTo use vim-mode-plus, you must **disable vim-mode** manually.";
        return atom.notifications.addWarning(message, {
          dismissable: true
        });
      }));
      this.subscribe(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var vimState;
          if (editor.isMini()) {
            return;
          }
          vimState = new VimState(editor, _this.statusBarManager, globalState);
          return _this.emitter.emit('did-add-vim-state', vimState);
        };
      })(this)));
      this.subscribe(atom.workspace.onDidChangeActivePane(this.demaximizePane.bind(this)));
      this.subscribe(atom.workspace.onDidChangeActivePaneItem(function() {
        if (settings.get('automaticallyEscapeInsertModeOnActivePaneItemChange')) {
          return VimState.forEach(function(vimState) {
            if (vimState.mode === 'insert') {
              return vimState.activate('normal');
            }
          });
        }
      }));
      this.subscribe(atom.workspace.onDidStopChangingActivePaneItem((function(_this) {
        return function(item) {
          var ref2;
          if (atom.workspace.isTextEditor(item)) {
            return (ref2 = _this.getEditorState(item)) != null ? ref2.highlightSearch.refresh() : void 0;
          }
        };
      })(this)));
      this.subscribe(settings.observe('highlightSearch', function(newValue) {
        if (newValue) {
          return globalState.set('highlightSearchPattern', globalState.get('lastSearchPattern'));
        } else {
          return globalState.set('highlightSearchPattern', null);
        }
      }));
      return this.subscribe.apply(this, settings.observeConditionalKeymaps());
    },
    observeVimMode: function(fn) {
      if (atom.packages.isPackageActive('vim-mode')) {
        fn();
      }
      return atom.packages.onDidActivatePackage(function(pack) {
        if (pack.name === 'vim-mode') {
          return fn();
        }
      });
    },
    onDidAddVimState: function(fn) {
      return this.emitter.on('did-add-vim-state', fn);
    },
    observeVimStates: function(fn) {
      VimState.forEach(fn);
      return this.onDidAddVimState(fn);
    },
    clearPersistentSelectionForEditors: function() {
      var editor, i, len, ref2, results;
      ref2 = atom.workspace.getTextEditors();
      results = [];
      for (i = 0, len = ref2.length; i < len; i++) {
        editor = ref2[i];
        results.push(this.getEditorState(editor).clearPersistentSelections());
      }
      return results;
    },
    deactivate: function() {
      this.subscriptions.dispose();
      VimState.forEach(function(vimState) {
        return vimState.destroy();
      });
      return VimState.clear();
    },
    subscribe: function() {
      var args, ref2;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref2 = this.subscriptions).add.apply(ref2, args);
    },
    unsubscribe: function(arg) {
      return this.subscriptions.remove(arg);
    },
    registerCommands: function() {
      this.subscribe(atom.commands.add('atom-text-editor:not([mini])', {
        'vim-mode-plus:clear-highlight-search': function() {
          return globalState.set('highlightSearchPattern', null);
        },
        'vim-mode-plus:toggle-highlight-search': function() {
          return settings.toggle('highlightSearch');
        },
        'vim-mode-plus:clear-persistent-selection': (function(_this) {
          return function() {
            return _this.clearPersistentSelectionForEditors();
          };
        })(this)
      }));
      return this.subscribe(atom.commands.add('atom-workspace', {
        'vim-mode-plus:maximize-pane': (function(_this) {
          return function() {
            return _this.maximizePane();
          };
        })(this),
        'vim-mode-plus:equalize-panes': (function(_this) {
          return function() {
            return _this.equalizePanes();
          };
        })(this)
      }));
    },
    demaximizePane: function() {
      if (this.maximizePaneDisposable != null) {
        this.maximizePaneDisposable.dispose();
        this.unsubscribe(this.maximizePaneDisposable);
        return this.maximizePaneDisposable = null;
      }
    },
    maximizePane: function() {
      var classActivePaneAxis, classHideStatusBar, classHideTabBar, classPaneMaximized, getView, paneElement, workspaceClassNames, workspaceElement;
      if (this.maximizePaneDisposable != null) {
        this.demaximizePane();
        return;
      }
      getView = function(model) {
        return atom.views.getView(model);
      };
      classPaneMaximized = 'vim-mode-plus--pane-maximized';
      classHideTabBar = 'vim-mode-plus--hide-tab-bar';
      classHideStatusBar = 'vim-mode-plus--hide-status-bar';
      classActivePaneAxis = 'vim-mode-plus--active-pane-axis';
      workspaceElement = getView(atom.workspace);
      paneElement = getView(atom.workspace.getActivePane());
      workspaceClassNames = [classPaneMaximized];
      if (settings.get('hideTabBarOnMaximizePane')) {
        workspaceClassNames.push(classHideTabBar);
      }
      if (settings.get('hideStatusBarOnMaximizePane')) {
        workspaceClassNames.push(classHideStatusBar);
      }
      addClassList.apply(null, [workspaceElement].concat(slice.call(workspaceClassNames)));
      forEachPaneAxis(function(axis) {
        var paneAxisElement;
        paneAxisElement = getView(axis);
        if (paneAxisElement.contains(paneElement)) {
          return addClassList(paneAxisElement, classActivePaneAxis);
        }
      });
      this.maximizePaneDisposable = new Disposable(function() {
        forEachPaneAxis(function(axis) {
          return removeClassList(getView(axis), classActivePaneAxis);
        });
        return removeClassList.apply(null, [workspaceElement].concat(slice.call(workspaceClassNames)));
      });
      return this.subscribe(this.maximizePaneDisposable);
    },
    equalizePanes: function() {
      var setFlexScale;
      setFlexScale = function(newValue, base) {
        var child, i, len, ref2, ref3, results;
        if (base == null) {
          base = atom.workspace.getActivePane().getContainer().getRoot();
        }
        base.setFlexScale(newValue);
        ref3 = (ref2 = base.children) != null ? ref2 : [];
        results = [];
        for (i = 0, len = ref3.length; i < len; i++) {
          child = ref3[i];
          results.push(setFlexScale(newValue, child));
        }
        return results;
      };
      return setFlexScale(1);
    },
    registerVimStateCommands: function() {
      var bindToVimState, char, chars, commands, fn1, getEditorState, i, j, len, results;
      commands = {
        'activate-normal-mode': function() {
          return this.activate('normal');
        },
        'activate-linewise-visual-mode': function() {
          return this.activate('visual', 'linewise');
        },
        'activate-characterwise-visual-mode': function() {
          return this.activate('visual', 'characterwise');
        },
        'activate-blockwise-visual-mode': function() {
          return this.activate('visual', 'blockwise');
        },
        'reset-normal-mode': function() {
          return this.resetNormalMode({
            userInvocation: true
          });
        },
        'set-register-name': function() {
          return this.register.setName();
        },
        'set-register-name-to-_': function() {
          return this.register.setName('_');
        },
        'set-register-name-to-*': function() {
          return this.register.setName('*');
        },
        'operator-modifier-characterwise': function() {
          return this.emitDidSetOperatorModifier({
            wise: 'characterwise'
          });
        },
        'operator-modifier-linewise': function() {
          return this.emitDidSetOperatorModifier({
            wise: 'linewise'
          });
        },
        'operator-modifier-occurrence': function() {
          return this.emitDidSetOperatorModifier({
            occurrence: true,
            occurrenceType: 'base'
          });
        },
        'operator-modifier-subword-occurrence': function() {
          return this.emitDidSetOperatorModifier({
            occurrence: true,
            occurrenceType: 'subword'
          });
        },
        'repeat': function() {
          return this.operationStack.runRecorded();
        },
        'repeat-find': function() {
          return this.operationStack.runCurrentFind();
        },
        'repeat-find-reverse': function() {
          return this.operationStack.runCurrentFind({
            reverse: true
          });
        },
        'repeat-search': function() {
          return this.operationStack.runCurrentSearch();
        },
        'repeat-search-reverse': function() {
          return this.operationStack.runCurrentSearch({
            reverse: true
          });
        },
        'set-count-0': function() {
          return this.setCount(0);
        },
        'set-count-1': function() {
          return this.setCount(1);
        },
        'set-count-2': function() {
          return this.setCount(2);
        },
        'set-count-3': function() {
          return this.setCount(3);
        },
        'set-count-4': function() {
          return this.setCount(4);
        },
        'set-count-5': function() {
          return this.setCount(5);
        },
        'set-count-6': function() {
          return this.setCount(6);
        },
        'set-count-7': function() {
          return this.setCount(7);
        },
        'set-count-8': function() {
          return this.setCount(8);
        },
        'set-count-9': function() {
          return this.setCount(9);
        }
      };
      chars = (function() {
        results = [];
        for (i = 32; i <= 126; i++){ results.push(i); }
        return results;
      }).apply(this).map(function(code) {
        return String.fromCharCode(code);
      });
      fn1 = function(char) {
        var charForKeymap;
        charForKeymap = char === ' ' ? 'space' : char;
        return commands["set-input-char-" + charForKeymap] = function() {
          return this.emitDidSetInputChar(char);
        };
      };
      for (j = 0, len = chars.length; j < len; j++) {
        char = chars[j];
        fn1(char);
      }
      getEditorState = this.getEditorState.bind(this);
      bindToVimState = function(oldCommands) {
        var fn, fn2, name, newCommands;
        newCommands = {};
        fn2 = function(fn) {
          return newCommands["vim-mode-plus:" + name] = function(event) {
            var vimState;
            event.stopPropagation();
            if (vimState = getEditorState(this.getModel())) {
              return fn.call(vimState, event);
            }
          };
        };
        for (name in oldCommands) {
          fn = oldCommands[name];
          fn2(fn);
        }
        return newCommands;
      };
      return this.subscribe(atom.commands.add('atom-text-editor:not([mini])', bindToVimState(commands)));
    },
    consumeStatusBar: function(statusBar) {
      this.statusBarManager.initialize(statusBar);
      this.statusBarManager.attach();
      return this.subscribe(new Disposable((function(_this) {
        return function() {
          return _this.statusBarManager.detach();
        };
      })(this)));
    },
    consumeDemoMode: function(arg1) {
      var onDidRemoveHover, onDidStart, onDidStop, onWillAddItem;
      onWillAddItem = arg1.onWillAddItem, onDidStart = arg1.onDidStart, onDidStop = arg1.onDidStop, onDidRemoveHover = arg1.onDidRemoveHover;
      return this.subscribe(onDidStart(function() {
        return globalState.set('demoModeIsActive', true);
      }), onDidStop(function() {
        return globalState.set('demoModeIsActive', false);
      }), onDidRemoveHover(this.destroyAllDemoModeFlasheMarkers.bind(this)), onWillAddItem((function(_this) {
        return function(arg2) {
          var commandElement, element, event, item;
          item = arg2.item, event = arg2.event;
          if (event.binding.command.startsWith('vim-mode-plus:')) {
            commandElement = item.getElementsByClassName('command')[0];
            commandElement.textContent = commandElement.textContent.replace(/^vim-mode-plus:/, '');
          }
          element = document.createElement('span');
          element.classList.add('kind', 'pull-right');
          element.textContent = _this.getKindForCommand(event.binding.command);
          return item.appendChild(element);
        };
      })(this)));
    },
    destroyAllDemoModeFlasheMarkers: function() {
      return VimState.forEach(function(vimState) {
        return vimState.flashManager.destroyDemoModeMarkers();
      });
    },
    getKindForCommand: function(command) {
      var kind, ref2;
      if (command.startsWith('vim-mode-plus')) {
        command = command.replace(/^vim-mode-plus:/, '');
        if (command.startsWith('operator-modifier')) {
          return kind = 'op-modifier';
        } else {
          return (ref2 = Base.getKindForCommandName(command)) != null ? ref2 : 'vmp-other';
        }
      } else {
        return 'non-vmp';
      }
    },
    getGlobalState: function() {
      return globalState;
    },
    getEditorState: function(editor) {
      return VimState.getByEditor(editor);
    },
    provideVimModePlus: function() {
      return {
        Base: Base,
        getGlobalState: this.getGlobalState.bind(this),
        getEditorState: this.getEditorState.bind(this),
        observeVimStates: this.observeVimStates.bind(this),
        onDidAddVimState: this.onDidAddVimState.bind(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrSkFBQTtJQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBRUosTUFBNkMsT0FBQSxDQUFRLE1BQVIsQ0FBN0MsRUFBQywyQkFBRCxFQUFhLHFCQUFiLEVBQXNCOztFQUV0QixJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0VBQ1AsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNCQUFSOztFQUNuQixXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUNkLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7RUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsT0FBbUQsT0FBQSxDQUFRLFNBQVIsQ0FBbkQsRUFBQyxzQ0FBRCxFQUFrQixnQ0FBbEIsRUFBZ0M7O0VBRWhDLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQVEsUUFBUSxDQUFDLE1BQWpCO0lBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtBQUNSLFVBQUE7TUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFJO01BQ3hCLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSTtNQUVmLE9BQUEsR0FBVSxJQUFDLENBQUEsa0JBQUQsQ0FBQTtNQUNWLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLENBQVg7TUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSx3QkFBRCxDQUFBO01BRUEsUUFBUSxDQUFDLHNCQUFULENBQUE7TUFFQSxJQUFHLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBSDtRQUNFLFFBQVEs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QixNQUFyQjtJQURjLENBalBoQjtJQW9QQSxrQkFBQSxFQUFvQixTQUFBO2FBQ2xCO1FBQUEsSUFBQSxFQUFNLElBQU47UUFDQSxjQUFBLEVBQWdCLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsSUFBckIsQ0FEaEI7UUFFQSxjQUFBLEVBQWdCLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsSUFBckIsQ0FGaEI7UUFHQSxnQkFBQSxFQUFrQixJQUFDLENBQUEsZ0JBQWdCLENBQUMsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FIbEI7UUFJQSxnQkFBQSxFQUFrQixJQUFDLENBQUEsZ0JBQWdCLENBQUMsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FKbEI7O0lBRGtCLENBcFBwQjs7QUFaRiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbntEaXNwb3NhYmxlLCBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbkJhc2UgPSByZXF1aXJlICcuL2Jhc2UnXG5TdGF0dXNCYXJNYW5hZ2VyID0gcmVxdWlyZSAnLi9zdGF0dXMtYmFyLW1hbmFnZXInXG5nbG9iYWxTdGF0ZSA9IHJlcXVpcmUgJy4vZ2xvYmFsLXN0YXRlJ1xuc2V0dGluZ3MgPSByZXF1aXJlICcuL3NldHRpbmdzJ1xuVmltU3RhdGUgPSByZXF1aXJlICcuL3ZpbS1zdGF0ZSdcbntmb3JFYWNoUGFuZUF4aXMsIGFkZENsYXNzTGlzdCwgcmVtb3ZlQ2xhc3NMaXN0fSA9IHJlcXVpcmUgJy4vdXRpbHMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOiBzZXR0aW5ncy5jb25maWdcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3RhdHVzQmFyTWFuYWdlciA9IG5ldyBTdGF0dXNCYXJNYW5hZ2VyXG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuXG4gICAgc2VydmljZSA9IEBwcm92aWRlVmltTW9kZVBsdXMoKVxuICAgIEBzdWJzY3JpYmUoQmFzZS5pbml0KHNlcnZpY2UpKVxuICAgIEByZWdpc3RlckNvbW1hbmRzKClcbiAgICBAcmVnaXN0ZXJWaW1TdGF0ZUNvbW1hbmRzKClcblxuICAgIHNldHRpbmdzLm5vdGlmeURlcHJlY2F0ZWRQYXJhbXMoKVxuXG4gICAgaWYgYXRvbS5pblNwZWNNb2RlKClcbiAgICAgIHNldHRpbmdzLnNldCgnc3RyaWN0QXNzZXJ0aW9uJywgdHJ1ZSlcblxuICAgIGlmIGF0b20uaW5EZXZNb2RlKClcbiAgICAgIGRldmVsb3BlciA9IG5ldyAocmVxdWlyZSAnLi9kZXZlbG9wZXInKVxuICAgICAgQHN1YnNjcmliZShkZXZlbG9wZXIuaW5pdChzZXJ2aWNlKSlcblxuICAgIEBzdWJzY3JpYmUgQG9ic2VydmVWaW1Nb2RlIC0+XG4gICAgICBtZXNzYWdlID0gXCJcIlwiXG4gICAgICAgICMjIE1lc3NhZ2UgYnkgdmltLW1vZGUtcGx1czogdmltLW1vZGUgZGV0ZWN0ZWQhXG4gICAgICAgIFRvIHVzZSB2aW0tbW9kZS1wbHVzLCB5b3UgbXVzdCAqKmRpc2FibGUgdmltLW1vZGUqKiBtYW51YWxseS5cbiAgICAgICAgXCJcIlwiXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhtZXNzYWdlLCBkaXNtaXNzYWJsZTogdHJ1ZSlcblxuICAgIEBzdWJzY3JpYmUgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICByZXR1cm4gaWYgZWRpdG9yLmlzTWluaSgpXG4gICAgICB2aW1TdGF0ZSA9IG5ldyBWaW1TdGF0ZShlZGl0b3IsIEBzdGF0dXNCYXJNYW5hZ2VyLCBnbG9iYWxTdGF0ZSlcbiAgICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1hZGQtdmltLXN0YXRlJywgdmltU3RhdGUpXG5cbiAgICBAc3Vic2NyaWJlIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZShAZGVtYXhpbWl6ZVBhbmUuYmluZCh0aGlzKSlcblxuICAgIEBzdWJzY3JpYmUgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAtPlxuICAgICAgaWYgc2V0dGluZ3MuZ2V0KCdhdXRvbWF0aWNhbGx5RXNjYXBlSW5zZXJ0TW9kZU9uQWN0aXZlUGFuZUl0ZW1DaGFuZ2UnKVxuICAgICAgICBWaW1TdGF0ZS5mb3JFYWNoICh2aW1TdGF0ZSkgLT5cbiAgICAgICAgICB2aW1TdGF0ZS5hY3RpdmF0ZSgnbm9ybWFsJykgaWYgdmltU3RhdGUubW9kZSBpcyAnaW5zZXJ0J1xuXG4gICAgQHN1YnNjcmliZSBhdG9tLndvcmtzcGFjZS5vbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtIChpdGVtKSA9PlxuICAgICAgaWYgYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yKGl0ZW0pXG4gICAgICAgICMgU3RpbGwgdGhlcmUgaXMgcG9zc2liaWxpdHkgZWRpdG9yIGlzIGRlc3Ryb3llZCBhbmQgZG9uJ3QgaGF2ZSBjb3JyZXNwb25kaW5nXG4gICAgICAgICMgdmltU3RhdGUgIzE5Ni5cbiAgICAgICAgQGdldEVkaXRvclN0YXRlKGl0ZW0pPy5oaWdobGlnaHRTZWFyY2gucmVmcmVzaCgpXG5cbiAgICBAc3Vic2NyaWJlIHNldHRpbmdzLm9ic2VydmUgJ2hpZ2hsaWdodFNlYXJjaCcsIChuZXdWYWx1ZSkgLT5cbiAgICAgIGlmIG5ld1ZhbHVlXG4gICAgICAgICMgUmUtc2V0dGluZyB2YWx1ZSB0cmlnZ2VyIGhpZ2hsaWdodFNlYXJjaCByZWZyZXNoXG4gICAgICAgIGdsb2JhbFN0YXRlLnNldCgnaGlnaGxpZ2h0U2VhcmNoUGF0dGVybicsIGdsb2JhbFN0YXRlLmdldCgnbGFzdFNlYXJjaFBhdHRlcm4nKSlcbiAgICAgIGVsc2VcbiAgICAgICAgZ2xvYmFsU3RhdGUuc2V0KCdoaWdobGlnaHRTZWFyY2hQYXR0ZXJuJywgbnVsbClcblxuICAgIEBzdWJzY3JpYmUoc2V0dGluZ3Mub2JzZXJ2ZUNvbmRpdGlvbmFsS2V5bWFwcygpLi4uKVxuXG4gIG9ic2VydmVWaW1Nb2RlOiAoZm4pIC0+XG4gICAgZm4oKSBpZiBhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZSgndmltLW1vZGUnKVxuICAgIGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZVBhY2thZ2UgKHBhY2spIC0+XG4gICAgICBmbigpIGlmIHBhY2submFtZSBpcyAndmltLW1vZGUnXG5cbiAgIyAqIGBmbmAge0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiB2aW1TdGF0ZSBpbnN0YW5jZSB3YXMgY3JlYXRlZC5cbiAgIyAgVXNhZ2U6XG4gICMgICBvbkRpZEFkZFZpbVN0YXRlICh2aW1TdGF0ZSkgLT4gZG8gc29tZXRoaW5nLi5cbiAgIyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZEFkZFZpbVN0YXRlOiAoZm4pIC0+IEBlbWl0dGVyLm9uKCdkaWQtYWRkLXZpbS1zdGF0ZScsIGZuKVxuXG4gICMgKiBgZm5gIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdpdGggYWxsIGN1cnJlbnQgYW5kIGZ1dHVyZSB2aW1TdGF0ZVxuICAjICBVc2FnZTpcbiAgIyAgIG9ic2VydmVWaW1TdGF0ZXMgKHZpbVN0YXRlKSAtPiBkbyBzb21ldGhpbmcuLlxuICAjIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9ic2VydmVWaW1TdGF0ZXM6IChmbikgLT5cbiAgICBWaW1TdGF0ZS5mb3JFYWNoKGZuKVxuICAgIEBvbkRpZEFkZFZpbVN0YXRlKGZuKVxuXG4gIGNsZWFyUGVyc2lzdGVudFNlbGVjdGlvbkZvckVkaXRvcnM6IC0+XG4gICAgZm9yIGVkaXRvciBpbiBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gICAgICBAZ2V0RWRpdG9yU3RhdGUoZWRpdG9yKS5jbGVhclBlcnNpc3RlbnRTZWxlY3Rpb25zKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIFZpbVN0YXRlLmZvckVhY2ggKHZpbVN0YXRlKSAtPlxuICAgICAgdmltU3RhdGUuZGVzdHJveSgpXG4gICAgVmltU3RhdGUuY2xlYXIoKVxuXG4gIHN1YnNjcmliZTogKGFyZ3MuLi4pIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKGFyZ3MuLi4pXG5cbiAgdW5zdWJzY3JpYmU6IChhcmcpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMucmVtb3ZlKGFyZylcblxuICByZWdpc3RlckNvbW1hbmRzOiAtPlxuICAgIEBzdWJzY3JpYmUgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3I6bm90KFttaW5pXSknLFxuICAgICAgJ3ZpbS1tb2RlLXBsdXM6Y2xlYXItaGlnaGxpZ2h0LXNlYXJjaCc6IC0+IGdsb2JhbFN0YXRlLnNldCgnaGlnaGxpZ2h0U2VhcmNoUGF0dGVybicsIG51bGwpXG4gICAgICAndmltLW1vZGUtcGx1czp0b2dnbGUtaGlnaGxpZ2h0LXNlYXJjaCc6IC0+IHNldHRpbmdzLnRvZ2dsZSgnaGlnaGxpZ2h0U2VhcmNoJylcbiAgICAgICd2aW0tbW9kZS1wbHVzOmNsZWFyLXBlcnNpc3RlbnQtc2VsZWN0aW9uJzogPT4gQGNsZWFyUGVyc2lzdGVudFNlbGVjdGlvbkZvckVkaXRvcnMoKVxuXG4gICAgQHN1YnNjcmliZSBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ3ZpbS1tb2RlLXBsdXM6bWF4aW1pemUtcGFuZSc6ID0+IEBtYXhpbWl6ZVBhbmUoKVxuICAgICAgJ3ZpbS1tb2RlLXBsdXM6ZXF1YWxpemUtcGFuZXMnOiA9PiBAZXF1YWxpemVQYW5lcygpXG5cbiAgZGVtYXhpbWl6ZVBhbmU6IC0+XG4gICAgaWYgQG1heGltaXplUGFuZURpc3Bvc2FibGU/XG4gICAgICBAbWF4aW1pemVQYW5lRGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICAgIEB1bnN1YnNjcmliZShAbWF4aW1pemVQYW5lRGlzcG9zYWJsZSlcbiAgICAgIEBtYXhpbWl6ZVBhbmVEaXNwb3NhYmxlID0gbnVsbFxuXG4gIG1heGltaXplUGFuZTogLT5cbiAgICBpZiBAbWF4aW1pemVQYW5lRGlzcG9zYWJsZT9cbiAgICAgIEBkZW1heGltaXplUGFuZSgpXG4gICAgICByZXR1cm5cblxuICAgIGdldFZpZXcgPSAobW9kZWwpIC0+IGF0b20udmlld3MuZ2V0Vmlldyhtb2RlbClcbiAgICBjbGFzc1BhbmVNYXhpbWl6ZWQgPSAndmltLW1vZGUtcGx1cy0tcGFuZS1tYXhpbWl6ZWQnXG4gICAgY2xhc3NIaWRlVGFiQmFyID0gJ3ZpbS1tb2RlLXBsdXMtLWhpZGUtdGFiLWJhcidcbiAgICBjbGFzc0hpZGVTdGF0dXNCYXIgPSAndmltLW1vZGUtcGx1cy0taGlkZS1zdGF0dXMtYmFyJ1xuICAgIGNsYXNzQWN0aXZlUGFuZUF4aXMgPSAndmltLW1vZGUtcGx1cy0tYWN0aXZlLXBhbmUtYXhpcydcblxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBnZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIHBhbmVFbGVtZW50ID0gZ2V0VmlldyhhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpXG5cbiAgICB3b3Jrc3BhY2VDbGFzc05hbWVzID0gW2NsYXNzUGFuZU1heGltaXplZF1cbiAgICB3b3Jrc3BhY2VDbGFzc05hbWVzLnB1c2goY2xhc3NIaWRlVGFiQmFyKSBpZiBzZXR0aW5ncy5nZXQoJ2hpZGVUYWJCYXJPbk1heGltaXplUGFuZScpXG4gICAgd29ya3NwYWNlQ2xhc3NOYW1lcy5wdXNoKGNsYXNzSGlkZVN0YXR1c0JhcikgaWYgc2V0dGluZ3MuZ2V0KCdoaWRlU3RhdHVzQmFyT25NYXhpbWl6ZVBhbmUnKVxuXG4gICAgYWRkQ2xhc3NMaXN0KHdvcmtzcGFjZUVsZW1lbnQsIHdvcmtzcGFjZUNsYXNzTmFtZXMuLi4pXG5cbiAgICBmb3JFYWNoUGFuZUF4aXMgKGF4aXMpIC0+XG4gICAgICBwYW5lQXhpc0VsZW1lbnQgPSBnZXRWaWV3KGF4aXMpXG4gICAgICBpZiBwYW5lQXhpc0VsZW1lbnQuY29udGFpbnMocGFuZUVsZW1lbnQpXG4gICAgICAgIGFkZENsYXNzTGlzdChwYW5lQXhpc0VsZW1lbnQsIGNsYXNzQWN0aXZlUGFuZUF4aXMpXG5cbiAgICBAbWF4aW1pemVQYW5lRGlzcG9zYWJsZSA9IG5ldyBEaXNwb3NhYmxlIC0+XG4gICAgICBmb3JFYWNoUGFuZUF4aXMgKGF4aXMpIC0+XG4gICAgICAgIHJlbW92ZUNsYXNzTGlzdChnZXRWaWV3KGF4aXMpLCBjbGFzc0FjdGl2ZVBhbmVBeGlzKVxuICAgICAgcmVtb3ZlQ2xhc3NMaXN0KHdvcmtzcGFjZUVsZW1lbnQsIHdvcmtzcGFjZUNsYXNzTmFtZXMuLi4pXG5cbiAgICBAc3Vic2NyaWJlKEBtYXhpbWl6ZVBhbmVEaXNwb3NhYmxlKVxuXG4gIGVxdWFsaXplUGFuZXM6IC0+XG4gICAgc2V0RmxleFNjYWxlID0gKG5ld1ZhbHVlLCBiYXNlKSAtPlxuICAgICAgYmFzZSA/PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0Q29udGFpbmVyKCkuZ2V0Um9vdCgpXG4gICAgICBiYXNlLnNldEZsZXhTY2FsZShuZXdWYWx1ZSlcbiAgICAgIGZvciBjaGlsZCBpbiBiYXNlLmNoaWxkcmVuID8gW11cbiAgICAgICAgc2V0RmxleFNjYWxlKG5ld1ZhbHVlLCBjaGlsZClcblxuICAgIHNldEZsZXhTY2FsZSgxKVxuXG4gIHJlZ2lzdGVyVmltU3RhdGVDb21tYW5kczogLT5cbiAgICAjIGFsbCBjb21tYW5kcyBoZXJlIGlzIGV4ZWN1dGVkIHdpdGggY29udGV4dCB3aGVyZSAndGhpcycgYm91bmQgdG8gJ3ZpbVN0YXRlJ1xuICAgIGNvbW1hbmRzID1cbiAgICAgICdhY3RpdmF0ZS1ub3JtYWwtbW9kZSc6IC0+IEBhY3RpdmF0ZSgnbm9ybWFsJylcbiAgICAgICdhY3RpdmF0ZS1saW5ld2lzZS12aXN1YWwtbW9kZSc6IC0+IEBhY3RpdmF0ZSgndmlzdWFsJywgJ2xpbmV3aXNlJylcbiAgICAgICdhY3RpdmF0ZS1jaGFyYWN0ZXJ3aXNlLXZpc3VhbC1tb2RlJzogLT4gQGFjdGl2YXRlKCd2aXN1YWwnLCAnY2hhcmFjdGVyd2lzZScpXG4gICAgICAnYWN0aXZhdGUtYmxvY2t3aXNlLXZpc3VhbC1tb2RlJzogLT4gQGFjdGl2YXRlKCd2aXN1YWwnLCAnYmxvY2t3aXNlJylcbiAgICAgICdyZXNldC1ub3JtYWwtbW9kZSc6IC0+IEByZXNldE5vcm1hbE1vZGUodXNlckludm9jYXRpb246IHRydWUpXG4gICAgICAnc2V0LXJlZ2lzdGVyLW5hbWUnOiAtPiBAcmVnaXN0ZXIuc2V0TmFtZSgpICMgXCJcbiAgICAgICdzZXQtcmVnaXN0ZXItbmFtZS10by1fJzogLT4gQHJlZ2lzdGVyLnNldE5hbWUoJ18nKVxuICAgICAgJ3NldC1yZWdpc3Rlci1uYW1lLXRvLSonOiAtPiBAcmVnaXN0ZXIuc2V0TmFtZSgnKicpXG4gICAgICAnb3BlcmF0b3ItbW9kaWZpZXItY2hhcmFjdGVyd2lzZSc6IC0+IEBlbWl0RGlkU2V0T3BlcmF0b3JNb2RpZmllcih3aXNlOiAnY2hhcmFjdGVyd2lzZScpXG4gICAgICAnb3BlcmF0b3ItbW9kaWZpZXItbGluZXdpc2UnOiAtPiBAZW1pdERpZFNldE9wZXJhdG9yTW9kaWZpZXIod2lzZTogJ2xpbmV3aXNlJylcbiAgICAgICdvcGVyYXRvci1tb2RpZmllci1vY2N1cnJlbmNlJzogLT4gQGVtaXREaWRTZXRPcGVyYXRvck1vZGlmaWVyKG9jY3VycmVuY2U6IHRydWUsIG9jY3VycmVuY2VUeXBlOiAnYmFzZScpXG4gICAgICAnb3BlcmF0b3ItbW9kaWZpZXItc3Vid29yZC1vY2N1cnJlbmNlJzogLT4gQGVtaXREaWRTZXRPcGVyYXRvck1vZGlmaWVyKG9jY3VycmVuY2U6IHRydWUsIG9jY3VycmVuY2VUeXBlOiAnc3Vid29yZCcpXG4gICAgICAncmVwZWF0JzogLT4gQG9wZXJhdGlvblN0YWNrLnJ1blJlY29yZGVkKClcbiAgICAgICdyZXBlYXQtZmluZCc6IC0+IEBvcGVyYXRpb25TdGFjay5ydW5DdXJyZW50RmluZCgpXG4gICAgICAncmVwZWF0LWZpbmQtcmV2ZXJzZSc6IC0+IEBvcGVyYXRpb25TdGFjay5ydW5DdXJyZW50RmluZChyZXZlcnNlOiB0cnVlKVxuICAgICAgJ3JlcGVhdC1zZWFyY2gnOiAtPiBAb3BlcmF0aW9uU3RhY2sucnVuQ3VycmVudFNlYXJjaCgpXG4gICAgICAncmVwZWF0LXNlYXJjaC1yZXZlcnNlJzogLT4gQG9wZXJhdGlvblN0YWNrLnJ1bkN1cnJlbnRTZWFyY2gocmV2ZXJzZTogdHJ1ZSlcbiAgICAgICdzZXQtY291bnQtMCc6IC0+IEBzZXRDb3VudCgwKVxuICAgICAgJ3NldC1jb3VudC0xJzogLT4gQHNldENvdW50KDEpXG4gICAgICAnc2V0LWNvdW50LTInOiAtPiBAc2V0Q291bnQoMilcbiAgICAgICdzZXQtY291bnQtMyc6IC0+IEBzZXRDb3VudCgzKVxuICAgICAgJ3NldC1jb3VudC00JzogLT4gQHNldENvdW50KDQpXG4gICAgICAnc2V0LWNvdW50LTUnOiAtPiBAc2V0Q291bnQoNSlcbiAgICAgICdzZXQtY291bnQtNic6IC0+IEBzZXRDb3VudCg2KVxuICAgICAgJ3NldC1jb3VudC03JzogLT4gQHNldENvdW50KDcpXG4gICAgICAnc2V0LWNvdW50LTgnOiAtPiBAc2V0Q291bnQoOClcbiAgICAgICdzZXQtY291bnQtOSc6IC0+IEBzZXRDb3VudCg5KVxuXG4gICAgY2hhcnMgPSBbMzIuLjEyNl0ubWFwIChjb2RlKSAtPiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpXG4gICAgZm9yIGNoYXIgaW4gY2hhcnNcbiAgICAgIGRvIChjaGFyKSAtPlxuICAgICAgICBjaGFyRm9yS2V5bWFwID0gaWYgY2hhciBpcyAnICcgdGhlbiAnc3BhY2UnIGVsc2UgY2hhclxuICAgICAgICBjb21tYW5kc1tcInNldC1pbnB1dC1jaGFyLSN7Y2hhckZvcktleW1hcH1cIl0gPSAtPlxuICAgICAgICAgIEBlbWl0RGlkU2V0SW5wdXRDaGFyKGNoYXIpXG5cbiAgICBnZXRFZGl0b3JTdGF0ZSA9IEBnZXRFZGl0b3JTdGF0ZS5iaW5kKHRoaXMpXG5cbiAgICBiaW5kVG9WaW1TdGF0ZSA9IChvbGRDb21tYW5kcykgLT5cbiAgICAgIG5ld0NvbW1hbmRzID0ge31cbiAgICAgIGZvciBuYW1lLCBmbiBvZiBvbGRDb21tYW5kc1xuICAgICAgICBkbyAoZm4pIC0+XG4gICAgICAgICAgbmV3Q29tbWFuZHNbXCJ2aW0tbW9kZS1wbHVzOiN7bmFtZX1cIl0gPSAoZXZlbnQpIC0+XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgaWYgdmltU3RhdGUgPSBnZXRFZGl0b3JTdGF0ZShAZ2V0TW9kZWwoKSlcbiAgICAgICAgICAgICAgZm4uY2FsbCh2aW1TdGF0ZSwgZXZlbnQpXG4gICAgICBuZXdDb21tYW5kc1xuXG4gICAgQHN1YnNjcmliZSBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKScsIGJpbmRUb1ZpbVN0YXRlKGNvbW1hbmRzKSlcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoc3RhdHVzQmFyKSAtPlxuICAgIEBzdGF0dXNCYXJNYW5hZ2VyLmluaXRpYWxpemUoc3RhdHVzQmFyKVxuICAgIEBzdGF0dXNCYXJNYW5hZ2VyLmF0dGFjaCgpXG4gICAgQHN1YnNjcmliZSBuZXcgRGlzcG9zYWJsZSA9PlxuICAgICAgQHN0YXR1c0Jhck1hbmFnZXIuZGV0YWNoKClcblxuICBjb25zdW1lRGVtb01vZGU6ICh7b25XaWxsQWRkSXRlbSwgb25EaWRTdGFydCwgb25EaWRTdG9wLCBvbkRpZFJlbW92ZUhvdmVyfSkgLT5cbiAgICBAc3Vic2NyaWJlKFxuICAgICAgb25EaWRTdGFydCgtPiBnbG9iYWxTdGF0ZS5zZXQoJ2RlbW9Nb2RlSXNBY3RpdmUnLCB0cnVlKSlcbiAgICAgIG9uRGlkU3RvcCgtPiBnbG9iYWxTdGF0ZS5zZXQoJ2RlbW9Nb2RlSXNBY3RpdmUnLCBmYWxzZSkpXG4gICAgICBvbkRpZFJlbW92ZUhvdmVyKEBkZXN0cm95QWxsRGVtb01vZGVGbGFzaGVNYXJrZXJzLmJpbmQodGhpcykpXG4gICAgICBvbldpbGxBZGRJdGVtKCh7aXRlbSwgZXZlbnR9KSA9PlxuICAgICAgICBpZiBldmVudC5iaW5kaW5nLmNvbW1hbmQuc3RhcnRzV2l0aCgndmltLW1vZGUtcGx1czonKVxuICAgICAgICAgIGNvbW1hbmRFbGVtZW50ID0gaXRlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb21tYW5kJylbMF1cbiAgICAgICAgICBjb21tYW5kRWxlbWVudC50ZXh0Q29udGVudCA9IGNvbW1hbmRFbGVtZW50LnRleHRDb250ZW50LnJlcGxhY2UoL152aW0tbW9kZS1wbHVzOi8sICcnKVxuXG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdraW5kJywgJ3B1bGwtcmlnaHQnKVxuICAgICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gQGdldEtpbmRGb3JDb21tYW5kKGV2ZW50LmJpbmRpbmcuY29tbWFuZClcbiAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChlbGVtZW50KVxuICAgICAgKVxuICAgIClcblxuICBkZXN0cm95QWxsRGVtb01vZGVGbGFzaGVNYXJrZXJzOiAtPlxuICAgIFZpbVN0YXRlLmZvckVhY2ggKHZpbVN0YXRlKSAtPlxuICAgICAgdmltU3RhdGUuZmxhc2hNYW5hZ2VyLmRlc3Ryb3lEZW1vTW9kZU1hcmtlcnMoKVxuXG4gIGdldEtpbmRGb3JDb21tYW5kOiAoY29tbWFuZCkgLT5cbiAgICBpZiBjb21tYW5kLnN0YXJ0c1dpdGgoJ3ZpbS1tb2RlLXBsdXMnKVxuICAgICAgY29tbWFuZCA9IGNvbW1hbmQucmVwbGFjZSgvXnZpbS1tb2RlLXBsdXM6LywgJycpXG4gICAgICBpZiBjb21tYW5kLnN0YXJ0c1dpdGgoJ29wZXJhdG9yLW1vZGlmaWVyJylcbiAgICAgICAga2luZCA9ICdvcC1tb2RpZmllcidcbiAgICAgIGVsc2VcbiAgICAgICAgQmFzZS5nZXRLaW5kRm9yQ29tbWFuZE5hbWUoY29tbWFuZCkgPyAndm1wLW90aGVyJ1xuICAgIGVsc2VcbiAgICAgICdub24tdm1wJ1xuXG4gICMgU2VydmljZSBBUElcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGdldEdsb2JhbFN0YXRlOiAtPlxuICAgIGdsb2JhbFN0YXRlXG5cbiAgZ2V0RWRpdG9yU3RhdGU6IChlZGl0b3IpIC0+XG4gICAgVmltU3RhdGUuZ2V0QnlFZGl0b3IoZWRpdG9yKVxuXG4gIHByb3ZpZGVWaW1Nb2RlUGx1czogLT5cbiAgICBCYXNlOiBCYXNlXG4gICAgZ2V0R2xvYmFsU3RhdGU6IEBnZXRHbG9iYWxTdGF0ZS5iaW5kKHRoaXMpXG4gICAgZ2V0RWRpdG9yU3RhdGU6IEBnZXRFZGl0b3JTdGF0ZS5iaW5kKHRoaXMpXG4gICAgb2JzZXJ2ZVZpbVN0YXRlczogQG9ic2VydmVWaW1TdGF0ZXMuYmluZCh0aGlzKVxuICAgIG9uRGlkQWRkVmltU3RhdGU6IEBvbkRpZEFkZFZpbVN0YXRlLmJpbmQodGhpcylcbiJdfQ==
