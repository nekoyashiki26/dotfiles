(function() {
  var Commands, CompositeDisposable,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  CompositeDisposable = require('atom').CompositeDisposable;

  Commands = (function() {
    function Commands(linter) {
      this.linter = linter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'linter:next-error': (function(_this) {
          return function() {
            return _this.nextError();
          };
        })(this),
        'linter:previous-error': (function(_this) {
          return function() {
            return _this.previousError();
          };
        })(this),
        'linter:toggle': (function(_this) {
          return function() {
            return _this.toggleLinter();
          };
        })(this),
        'linter:togglePanel': (function(_this) {
          return function() {
            return _this.togglePanel();
          };
        })(this),
        'linter:set-bubble-transparent': (function(_this) {
          return function() {
            return _this.setBubbleTransparent();
          };
        })(this),
        'linter:expand-multiline-messages': (function(_this) {
          return function() {
            return _this.expandMultilineMessages();
          };
        })(this),
        'linter:lint': (function(_this) {
          return function() {
            return _this.lint();
          };
        })(this)
      }));
      this.index = null;
    }

    Commands.prototype.togglePanel = function() {
      return atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
    };

    Commands.prototype.toggleLinter = function() {
      var activeEditor, editorLinter;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!activeEditor) {
        return;
      }
      editorLinter = this.linter.getEditorLinter(activeEditor);
      if (editorLinter) {
        return editorLinter.dispose();
      } else {
        this.linter.createEditorLinter(activeEditor);
        return this.lint();
      }
    };

    Commands.prototype.setBubbleTransparent = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.add('transparent');
        document.addEventListener('keyup', this.setBubbleOpaque);
        return window.addEventListener('blur', this.setBubbleOpaque);
      }
    };

    Commands.prototype.setBubbleOpaque = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.remove('transparent');
      }
      document.removeEventListener('keyup', this.setBubbleOpaque);
      return window.removeEventListener('blur', this.setBubbleOpaque);
    };

    Commands.prototype.expandMultilineMessages = function() {
      var elem, i, len, ref;
      ref = document.getElementsByTagName('linter-multiline-message');
      for (i = 0, len = ref.length; i < len; i++) {
        elem = ref[i];
        elem.classList.add('expanded');
      }
      document.addEventListener('keyup', this.collapseMultilineMessages);
      return window.addEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.collapseMultilineMessages = function() {
      var elem, i, len, ref;
      ref = document.getElementsByTagName('linter-multiline-message');
      for (i = 0, len = ref.length; i < len; i++) {
        elem = ref[i];
        elem.classList.remove('expanded');
      }
      document.removeEventListener('keyup', this.collapseMultilineMessages);
      return window.removeEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.lint = function() {
      var error, ref;
      try {
        return (ref = this.linter.getActiveEditorLinter()) != null ? ref.lint(false) : void 0;
      } catch (error1) {
        error = error1;
        return atom.notifications.addError(error.message, {
          detail: error.stack,
          dismissable: true
        });
      }
    };

    Commands.prototype.getMessage = function(index) {
      var messages;
      messages = this.linter.views.messages;
      return messages[modulo(index, messages.length)];
    };

    Commands.prototype.nextError = function() {
      var message;
      if (this.index != null) {
        this.index++;
      } else {
        this.index = 0;
      }
      message = this.getMessage(this.index);
      if (!(message != null ? message.filePath : void 0)) {
        return;
      }
      if (!(message != null ? message.range : void 0)) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.previousError = function() {
      var message;
      if (this.index != null) {
        this.index--;
      } else {
        this.index = 0;
      }
      message = this.getMessage(this.index);
      if (!(message != null ? message.filePath : void 0)) {
        return;
      }
      if (!(message != null ? message.range : void 0)) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.dispose = function() {
      this.messages = null;
      return this.subscriptions.dispose();
    };

    return Commands;

  })();

  module.exports = Commands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvY29tbWFuZHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2QkFBQTtJQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFbEI7SUFDUyxrQkFBQyxNQUFEO01BQUMsSUFBQyxDQUFBLFNBQUQ7TUFDWixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO1FBQUEsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsU0FBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCO1FBQ0EsdUJBQUEsRUFBeUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsYUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHpCO1FBRUEsZUFBQSxFQUFpQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxZQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGakI7UUFHQSxvQkFBQSxFQUFzQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxXQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIdEI7UUFJQSwrQkFBQSxFQUFpQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxvQkFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmpDO1FBS0Esa0NBQUEsRUFBb0MsQ0FBQSxTQUFBLEtBQUE7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QTtlQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyx1QkFBckMsQ0FBNkQsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUEzRTtNQUR5QyxDQUEzQztJQVJhOzt1QkFXZixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxRQUFELEdBQVk7YUFDWixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQUZPOzs7Ozs7RUFJWCxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQWhHakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5jbGFzcyBDb21tYW5kc1xuICBjb25zdHJ1Y3RvcjogKEBsaW50ZXIpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ2xpbnRlcjpuZXh0LWVycm9yJzogPT4gQG5leHRFcnJvcigpXG4gICAgICAnbGludGVyOnByZXZpb3VzLWVycm9yJzogPT4gQHByZXZpb3VzRXJyb3IoKVxuICAgICAgJ2xpbnRlcjp0b2dnbGUnOiA9PiBAdG9nZ2xlTGludGVyKClcbiAgICAgICdsaW50ZXI6dG9nZ2xlUGFuZWwnOiA9PiBAdG9nZ2xlUGFuZWwoKVxuICAgICAgJ2xpbnRlcjpzZXQtYnViYmxlLXRyYW5zcGFyZW50JzogPT4gQHNldEJ1YmJsZVRyYW5zcGFyZW50KClcbiAgICAgICdsaW50ZXI6ZXhwYW5kLW11bHRpbGluZS1tZXNzYWdlcyc6ID0+IEBleHBhbmRNdWx0aWxpbmVNZXNzYWdlcygpXG4gICAgICAnbGludGVyOmxpbnQnOiA9PiBAbGludCgpXG5cbiAgICAjIERlZmF1bHQgdmFsdWVzXG4gICAgQGluZGV4ID0gbnVsbFxuXG4gIHRvZ2dsZVBhbmVsOiAtPlxuICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLnNob3dFcnJvclBhbmVsJywgbm90IGF0b20uY29uZmlnLmdldCgnbGludGVyLnNob3dFcnJvclBhbmVsJykpXG5cbiAgdG9nZ2xlTGludGVyOiAtPlxuICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHJldHVybiB1bmxlc3MgYWN0aXZlRWRpdG9yXG4gICAgZWRpdG9yTGludGVyID0gQGxpbnRlci5nZXRFZGl0b3JMaW50ZXIoYWN0aXZlRWRpdG9yKVxuICAgIGlmIGVkaXRvckxpbnRlclxuICAgICAgZWRpdG9yTGludGVyLmRpc3Bvc2UoKVxuICAgIGVsc2VcbiAgICAgIEBsaW50ZXIuY3JlYXRlRWRpdG9yTGludGVyKGFjdGl2ZUVkaXRvcilcbiAgICAgIEBsaW50KClcblxuXG4gIHNldEJ1YmJsZVRyYW5zcGFyZW50OiAtPlxuICAgIGJ1YmJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW50ZXItaW5saW5lJylcbiAgICBpZiBidWJibGVcbiAgICAgIGJ1YmJsZS5jbGFzc0xpc3QuYWRkICd0cmFuc3BhcmVudCdcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ2tleXVwJywgQHNldEJ1YmJsZU9wYXF1ZVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ2JsdXInLCBAc2V0QnViYmxlT3BhcXVlXG5cbiAgc2V0QnViYmxlT3BhcXVlOiAtPlxuICAgIGJ1YmJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW50ZXItaW5saW5lJylcbiAgICBpZiBidWJibGVcbiAgICAgIGJ1YmJsZS5jbGFzc0xpc3QucmVtb3ZlICd0cmFuc3BhcmVudCdcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyICdrZXl1cCcsIEBzZXRCdWJibGVPcGFxdWVcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciAnYmx1cicsIEBzZXRCdWJibGVPcGFxdWVcblxuICBleHBhbmRNdWx0aWxpbmVNZXNzYWdlczogLT5cbiAgICBmb3IgZWxlbSBpbiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSAnbGludGVyLW11bHRpbGluZS1tZXNzYWdlJ1xuICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkICdleHBhbmRlZCdcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyICdrZXl1cCcsIEBjb2xsYXBzZU11bHRpbGluZU1lc3NhZ2VzXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ2JsdXInLCBAY29sbGFwc2VNdWx0aWxpbmVNZXNzYWdlc1xuXG4gIGNvbGxhcHNlTXVsdGlsaW5lTWVzc2FnZXM6IC0+XG4gICAgZm9yIGVsZW0gaW4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgJ2xpbnRlci1tdWx0aWxpbmUtbWVzc2FnZSdcbiAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZSAnZXhwYW5kZWQnXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAna2V5dXAnLCBAY29sbGFwc2VNdWx0aWxpbmVNZXNzYWdlc1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyICdibHVyJywgQGNvbGxhcHNlTXVsdGlsaW5lTWVzc2FnZXNcblxuICBsaW50OiAtPlxuICAgIHRyeVxuICAgICAgQGxpbnRlci5nZXRBY3RpdmVFZGl0b3JMaW50ZXIoKT8ubGludChmYWxzZSlcbiAgICBjYXRjaCBlcnJvclxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIGVycm9yLm1lc3NhZ2UsIHtkZXRhaWw6IGVycm9yLnN0YWNrLCBkaXNtaXNzYWJsZTogdHJ1ZX1cblxuICBnZXRNZXNzYWdlOiAoaW5kZXgpIC0+XG4gICAgbWVzc2FnZXMgPSBAbGludGVyLnZpZXdzLm1lc3NhZ2VzXG4gICAgIyBVc2UgdGhlIGRpdmlkZW5kIGluZGVwZW5kZW50IG1vZHVsbyBzbyB0aGF0IHRoZSBpbmRleCBzdGF5cyBpbnNpZGUgdGhlXG4gICAgIyBhcnJheSdzIGJvdW5kcywgZXZlbiB3aGVuIG5lZ2F0aXZlLlxuICAgICMgVGhhdCB3YXkgdGhlIGluZGV4IGNhbiBiZSArKyBhbiAtLSB3aXRob3V0IGNhcmluZyBhYm91dCB0aGUgYXJyYXkgYm91bmRzLlxuICAgIG1lc3NhZ2VzW2luZGV4ICUlIG1lc3NhZ2VzLmxlbmd0aF1cblxuICBuZXh0RXJyb3I6IC0+XG4gICAgaWYgQGluZGV4P1xuICAgICAgQGluZGV4KytcbiAgICBlbHNlXG4gICAgICBAaW5kZXggPSAwXG4gICAgbWVzc2FnZSA9IEBnZXRNZXNzYWdlKEBpbmRleClcbiAgICByZXR1cm4gdW5sZXNzIG1lc3NhZ2U/LmZpbGVQYXRoXG4gICAgcmV0dXJuIHVubGVzcyBtZXNzYWdlPy5yYW5nZVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4obWVzc2FnZS5maWxlUGF0aCkudGhlbiAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKG1lc3NhZ2UucmFuZ2Uuc3RhcnQpXG5cbiAgcHJldmlvdXNFcnJvcjogLT5cbiAgICBpZiBAaW5kZXg/XG4gICAgICBAaW5kZXgtLVxuICAgIGVsc2VcbiAgICAgIEBpbmRleCA9IDBcbiAgICBtZXNzYWdlID0gQGdldE1lc3NhZ2UoQGluZGV4KVxuICAgIHJldHVybiB1bmxlc3MgbWVzc2FnZT8uZmlsZVBhdGhcbiAgICByZXR1cm4gdW5sZXNzIG1lc3NhZ2U/LnJhbmdlXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihtZXNzYWdlLmZpbGVQYXRoKS50aGVuIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24obWVzc2FnZS5yYW5nZS5zdGFydClcblxuICBkaXNwb3NlOiAtPlxuICAgIEBtZXNzYWdlcyA9IG51bGxcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxubW9kdWxlLmV4cG9ydHMgPSBDb21tYW5kc1xuIl19
