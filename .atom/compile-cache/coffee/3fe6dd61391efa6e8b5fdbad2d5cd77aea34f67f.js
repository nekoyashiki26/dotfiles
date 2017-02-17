(function() {
  var Commands, CompositeDisposable, EditorLinter, EditorRegistry, Emitter, Helpers, IndieRegistry, Linter, LinterRegistry, LinterViews, MessageRegistry, Path, ref;

  Path = require('path');

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  LinterViews = require('./linter-views');

  MessageRegistry = require('./message-registry');

  EditorRegistry = require('./editor-registry');

  EditorLinter = require('./editor-linter');

  LinterRegistry = require('./linter-registry');

  IndieRegistry = require('./indie-registry');

  Helpers = require('./helpers');

  Commands = require('./commands');

  Linter = (function() {
    function Linter(state) {
      var base;
      this.state = state;
      if ((base = this.state).scope == null) {
        base.scope = 'File';
      }
      this.lintOnFly = true;
      this.emitter = new Emitter;
      this.linters = new LinterRegistry;
      this.indieLinters = new IndieRegistry();
      this.editors = new EditorRegistry;
      this.messages = new MessageRegistry();
      this.views = new LinterViews(this.state.scope, this.editors);
      this.commands = new Commands(this);
      this.subscriptions = new CompositeDisposable(this.views, this.editors, this.linters, this.messages, this.commands, this.indieLinters);
      this.indieLinters.observe((function(_this) {
        return function(indieLinter) {
          return indieLinter.onDidDestroy(function() {
            return _this.messages.deleteMessages(indieLinter);
          });
        };
      })(this));
      this.indieLinters.onDidUpdateMessages((function(_this) {
        return function(arg) {
          var linter, messages;
          linter = arg.linter, messages = arg.messages;
          return _this.messages.set({
            linter: linter,
            messages: messages
          });
        };
      })(this));
      this.linters.onDidUpdateMessages((function(_this) {
        return function(arg) {
          var editor, linter, messages;
          linter = arg.linter, messages = arg.messages, editor = arg.editor;
          return _this.messages.set({
            linter: linter,
            messages: messages,
            editorLinter: _this.editors.ofTextEditor(editor)
          });
        };
      })(this));
      this.messages.onDidUpdateMessages((function(_this) {
        return function(messages) {
          return _this.views.render(messages);
        };
      })(this));
      this.views.onDidUpdateScope((function(_this) {
        return function(scope) {
          return _this.state.scope = scope;
        };
      })(this));
      this.subscriptions.add(atom.config.observe('linter.lintOnFly', (function(_this) {
        return function(value) {
          return _this.lintOnFly = value;
        };
      })(this)));
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.commands.lint();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.createEditorLinter(editor);
        };
      })(this)));
    }

    Linter.prototype.addLinter = function(linter) {
      return this.linters.addLinter(linter);
    };

    Linter.prototype.deleteLinter = function(linter) {
      if (!this.hasLinter(linter)) {
        return;
      }
      this.linters.deleteLinter(linter);
      return this.deleteMessages(linter);
    };

    Linter.prototype.hasLinter = function(linter) {
      return this.linters.hasLinter(linter);
    };

    Linter.prototype.getLinters = function() {
      return this.linters.getLinters();
    };

    Linter.prototype.setMessages = function(linter, messages) {
      return this.messages.set({
        linter: linter,
        messages: messages
      });
    };

    Linter.prototype.deleteMessages = function(linter) {
      return this.messages.deleteMessages(linter);
    };

    Linter.prototype.getMessages = function() {
      return this.messages.publicMessages;
    };

    Linter.prototype.onDidUpdateMessages = function(callback) {
      return this.messages.onDidUpdateMessages(callback);
    };

    Linter.prototype.getActiveEditorLinter = function() {
      return this.editors.ofActiveTextEditor();
    };

    Linter.prototype.getEditorLinter = function(editor) {
      return this.editors.ofTextEditor(editor);
    };

    Linter.prototype.getEditorLinterByPath = function(path) {
      return this.editors.ofPath(path);
    };

    Linter.prototype.eachEditorLinter = function(callback) {
      return this.editors.forEach(callback);
    };

    Linter.prototype.observeEditorLinters = function(callback) {
      return this.editors.observe(callback);
    };

    Linter.prototype.createEditorLinter = function(editor) {
      var editorLinter;
      if (this.editors.has(editor)) {
        return;
      }
      editorLinter = this.editors.create(editor);
      editorLinter.onShouldUpdateBubble((function(_this) {
        return function() {
          return _this.views.renderBubble(editorLinter);
        };
      })(this));
      editorLinter.onShouldLint((function(_this) {
        return function(onChange) {
          return _this.linters.lint({
            onChange: onChange,
            editorLinter: editorLinter
          });
        };
      })(this));
      editorLinter.onDidDestroy((function(_this) {
        return function() {
          return _this.messages.deleteEditorMessages(editorLinter);
        };
      })(this));
      editorLinter.onDidCalculateLineMessages((function(_this) {
        return function() {
          _this.views.updateCounts();
          if (_this.state.scope === 'Line') {
            return _this.views.bottomPanel.refresh();
          }
        };
      })(this));
      return this.views.notifyEditorLinter(editorLinter);
    };

    Linter.prototype.deactivate = function() {
      return this.subscriptions.dispose();
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLE1BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3RCLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBQ2QsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVI7O0VBQ2xCLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSOztFQUNqQixZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSOztFQUNmLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSOztFQUNqQixhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUjs7RUFDaEIsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztFQUNWLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7RUFFTDtJQUVTLGdCQUFDLEtBQUQ7QUFDWCxVQUFBO01BRFksSUFBQyxDQUFBLFFBQUQ7O1lBQ04sQ0FBQyxRQUFTOztNQUdoQixJQUFDLENBQUEsU0FBRCxHQUFhO01BR2IsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxhQUFBLENBQUE7TUFDcEIsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxlQUFBLENBQUE7TUFDaEIsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQW5CLEVBQTBCLElBQUMsQ0FBQSxPQUEzQjtNQUNiLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsUUFBQSxDQUFTLElBQVQ7TUFFaEIs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SUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7SUFEVTs7Ozs7O0VBR2QsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUE1R2pCIiwic291cmNlc0NvbnRlbnQiOlsiUGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57Q29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuTGludGVyVmlld3MgPSByZXF1aXJlICcuL2xpbnRlci12aWV3cydcbk1lc3NhZ2VSZWdpc3RyeSA9IHJlcXVpcmUgJy4vbWVzc2FnZS1yZWdpc3RyeSdcbkVkaXRvclJlZ2lzdHJ5ID0gcmVxdWlyZSAnLi9lZGl0b3ItcmVnaXN0cnknXG5FZGl0b3JMaW50ZXIgPSByZXF1aXJlICcuL2VkaXRvci1saW50ZXInXG5MaW50ZXJSZWdpc3RyeSA9IHJlcXVpcmUgJy4vbGludGVyLXJlZ2lzdHJ5J1xuSW5kaWVSZWdpc3RyeSA9IHJlcXVpcmUgJy4vaW5kaWUtcmVnaXN0cnknXG5IZWxwZXJzID0gcmVxdWlyZSAnLi9oZWxwZXJzJ1xuQ29tbWFuZHMgPSByZXF1aXJlICcuL2NvbW1hbmRzJ1xuXG5jbGFzcyBMaW50ZXJcbiAgIyBTdGF0ZSBpcyBhbiBvYmplY3QgYnkgZGVmYXVsdDsgbmV2ZXIgbnVsbCBvciB1bmRlZmluZWRcbiAgY29uc3RydWN0b3I6IChAc3RhdGUpICAtPlxuICAgIEBzdGF0ZS5zY29wZSA/PSAnRmlsZSdcblxuICAgICMgUHVibGljIFN0dWZmXG4gICAgQGxpbnRPbkZseSA9IHRydWUgIyBBIGRlZmF1bHQgYXJ0IHZhbHVlLCB0byBiZSBpbW1lZGlhdGVseSByZXBsYWNlZCBieSB0aGUgb2JzZXJ2ZSBjb25maWcgYmVsb3dcblxuICAgICMgUHJpdmF0ZSBTdHVmZlxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICBAbGludGVycyA9IG5ldyBMaW50ZXJSZWdpc3RyeVxuICAgIEBpbmRpZUxpbnRlcnMgPSBuZXcgSW5kaWVSZWdpc3RyeSgpXG4gICAgQGVkaXRvcnMgPSBuZXcgRWRpdG9yUmVnaXN0cnlcbiAgICBAbWVzc2FnZXMgPSBuZXcgTWVzc2FnZVJlZ2lzdHJ5KClcbiAgICBAdmlld3MgPSBuZXcgTGludGVyVmlld3MoQHN0YXRlLnNjb3BlLCBAZWRpdG9ycylcbiAgICBAY29tbWFuZHMgPSBuZXcgQ29tbWFuZHModGhpcylcblxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoQHZpZXdzLCBAZWRpdG9ycywgQGxpbnRlcnMsIEBtZXNzYWdlcywgQGNvbW1hbmRzLCBAaW5kaWVMaW50ZXJzKVxuXG4gICAgQGluZGllTGludGVycy5vYnNlcnZlIChpbmRpZUxpbnRlcikgPT5cbiAgICAgIGluZGllTGludGVyLm9uRGlkRGVzdHJveSA9PlxuICAgICAgICBAbWVzc2FnZXMuZGVsZXRlTWVzc2FnZXMoaW5kaWVMaW50ZXIpXG4gICAgQGluZGllTGludGVycy5vbkRpZFVwZGF0ZU1lc3NhZ2VzICh7bGludGVyLCBtZXNzYWdlc30pID0+XG4gICAgICBAbWVzc2FnZXMuc2V0KHtsaW50ZXIsIG1lc3NhZ2VzfSlcbiAgICBAbGludGVycy5vbkRpZFVwZGF0ZU1lc3NhZ2VzICh7bGludGVyLCBtZXNzYWdlcywgZWRpdG9yfSkgPT5cbiAgICAgIEBtZXNzYWdlcy5zZXQoe2xpbnRlciwgbWVzc2FnZXMsIGVkaXRvckxpbnRlcjogQGVkaXRvcnMub2ZUZXh0RWRpdG9yKGVkaXRvcil9KVxuICAgIEBtZXNzYWdlcy5vbkRpZFVwZGF0ZU1lc3NhZ2VzIChtZXNzYWdlcykgPT5cbiAgICAgIEB2aWV3cy5yZW5kZXIobWVzc2FnZXMpXG4gICAgQHZpZXdzLm9uRGlkVXBkYXRlU2NvcGUgKHNjb3BlKSA9PlxuICAgICAgQHN0YXRlLnNjb3BlID0gc2NvcGVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdsaW50ZXIubGludE9uRmx5JywgKHZhbHVlKSA9PlxuICAgICAgQGxpbnRPbkZseSA9IHZhbHVlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzID0+XG4gICAgICBAY29tbWFuZHMubGludCgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+IEBjcmVhdGVFZGl0b3JMaW50ZXIoZWRpdG9yKVxuXG4gIGFkZExpbnRlcjogKGxpbnRlcikgLT5cbiAgICBAbGludGVycy5hZGRMaW50ZXIobGludGVyKVxuXG4gIGRlbGV0ZUxpbnRlcjogKGxpbnRlcikgLT5cbiAgICByZXR1cm4gdW5sZXNzIEBoYXNMaW50ZXIobGludGVyKVxuICAgIEBsaW50ZXJzLmRlbGV0ZUxpbnRlcihsaW50ZXIpXG4gICAgQGRlbGV0ZU1lc3NhZ2VzKGxpbnRlcilcblxuICBoYXNMaW50ZXI6IChsaW50ZXIpIC0+XG4gICAgQGxpbnRlcnMuaGFzTGludGVyKGxpbnRlcilcblxuICBnZXRMaW50ZXJzOiAtPlxuICAgIEBsaW50ZXJzLmdldExpbnRlcnMoKVxuXG4gIHNldE1lc3NhZ2VzOiAobGludGVyLCBtZXNzYWdlcykgLT5cbiAgICBAbWVzc2FnZXMuc2V0KHtsaW50ZXIsIG1lc3NhZ2VzfSlcblxuICBkZWxldGVNZXNzYWdlczogKGxpbnRlcikgLT5cbiAgICBAbWVzc2FnZXMuZGVsZXRlTWVzc2FnZXMobGludGVyKVxuXG4gIGdldE1lc3NhZ2VzOiAtPlxuICAgIEBtZXNzYWdlcy5wdWJsaWNNZXNzYWdlc1xuXG4gIG9uRGlkVXBkYXRlTWVzc2FnZXM6IChjYWxsYmFjaykgLT5cbiAgICBAbWVzc2FnZXMub25EaWRVcGRhdGVNZXNzYWdlcyhjYWxsYmFjaylcblxuICBnZXRBY3RpdmVFZGl0b3JMaW50ZXI6IC0+XG4gICAgQGVkaXRvcnMub2ZBY3RpdmVUZXh0RWRpdG9yKClcblxuICBnZXRFZGl0b3JMaW50ZXI6IChlZGl0b3IpIC0+XG4gICAgQGVkaXRvcnMub2ZUZXh0RWRpdG9yKGVkaXRvcilcblxuICBnZXRFZGl0b3JMaW50ZXJCeVBhdGg6IChwYXRoKSAtPlxuICAgIEBlZGl0b3JzLm9mUGF0aChwYXRoKVxuXG4gIGVhY2hFZGl0b3JMaW50ZXI6IChjYWxsYmFjaykgLT5cbiAgICBAZWRpdG9ycy5mb3JFYWNoKGNhbGxiYWNrKVxuXG4gIG9ic2VydmVFZGl0b3JMaW50ZXJzOiAoY2FsbGJhY2spIC0+XG4gICAgQGVkaXRvcnMub2JzZXJ2ZShjYWxsYmFjaylcblxuICBjcmVhdGVFZGl0b3JMaW50ZXI6IChlZGl0b3IpIC0+XG4gICAgcmV0dXJuIGlmIEBlZGl0b3JzLmhhcyhlZGl0b3IpXG5cbiAgICBlZGl0b3JMaW50ZXIgPSBAZWRpdG9ycy5jcmVhdGUoZWRpdG9yKVxuICAgIGVkaXRvckxpbnRlci5vblNob3VsZFVwZGF0ZUJ1YmJsZSA9PlxuICAgICAgQHZpZXdzLnJlbmRlckJ1YmJsZShlZGl0b3JMaW50ZXIpXG4gICAgZWRpdG9yTGludGVyLm9uU2hvdWxkTGludCAob25DaGFuZ2UpID0+XG4gICAgICBAbGludGVycy5saW50KHtvbkNoYW5nZSwgZWRpdG9yTGludGVyfSlcbiAgICBlZGl0b3JMaW50ZXIub25EaWREZXN0cm95ID0+XG4gICAgICBAbWVzc2FnZXMuZGVsZXRlRWRpdG9yTWVzc2FnZXMoZWRpdG9yTGludGVyKVxuICAgIGVkaXRvckxpbnRlci5vbkRpZENhbGN1bGF0ZUxpbmVNZXNzYWdlcyA9PlxuICAgICAgQHZpZXdzLnVwZGF0ZUNvdW50cygpXG4gICAgICBAdmlld3MuYm90dG9tUGFuZWwucmVmcmVzaCgpIGlmIEBzdGF0ZS5zY29wZSBpcyAnTGluZSdcbiAgICBAdmlld3Mubm90aWZ5RWRpdG9yTGludGVyKGVkaXRvckxpbnRlcilcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbnRlclxuIl19
