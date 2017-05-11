(function() {
  var CompositeDisposable, Emitter, getEditorState, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom'), Emitter = ref.Emitter, CompositeDisposable = ref.CompositeDisposable;

  getEditorState = null;

  module.exports = {
    activate: function() {
      var self;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      self = this;
      return this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
        'vim-mode-plus-ex-mode:open': function() {
          return self.toggle(this.getModel(), 'normalCommands');
        },
        'vim-mode-plus-ex-mode:toggle-setting': function() {
          return self.toggle(this.getModel(), 'toggleCommands');
        }
      }));
    },
    toggle: function(editor, commandKind) {
      return this.getEditorState(editor).then((function(_this) {
        return function(vimState) {
          return _this.getView().toggle(vimState, commandKind);
        };
      })(this));
    },
    getEditorState: function(editor) {
      if (getEditorState != null) {
        return Promise.resolve(getEditorState(editor));
      } else {
        return new Promise((function(_this) {
          return function(resolve) {
            return _this.onDidConsumeVim(function() {
              return resolve(getEditorState(editor));
            });
          };
        })(this));
      }
    },
    deactivate: function() {
      var ref1, ref2;
      this.subscriptions.dispose();
      if ((ref1 = this.view) != null) {
        if (typeof ref1.destroy === "function") {
          ref1.destroy();
        }
      }
      return ref2 = {}, this.subscriptions = ref2.subscriptions, this.view = ref2.view, ref2;
    },
    getView: function() {
      return this.view != null ? this.view : this.view = new (require('./view'));
    },
    onDidConsumeVim: function(fn) {
      return this.emitter.on('did-consume-vim', fn);
    },
    consumeVim: function(service) {
      var Base, Motion, MoveToLineAndColumn;
      getEditorState = service.getEditorState, Base = service.Base;
      Motion = MoveToLineAndColumn = (function(superClass) {
        extend(MoveToLineAndColumn, superClass);

        function MoveToLineAndColumn() {
          return MoveToLineAndColumn.__super__.constructor.apply(this, arguments);
        }

        MoveToLineAndColumn.extend();

        MoveToLineAndColumn.commandPrefix = 'vim-mode-plus-user';

        MoveToLineAndColumn.prototype.wise = 'characterwise';

        MoveToLineAndColumn.prototype.column = null;

        MoveToLineAndColumn.prototype.moveCursor = function(cursor) {
          var point;
          MoveToLineAndColumn.__super__.moveCursor.apply(this, arguments);
          point = [cursor.getBufferRow(), this.column - 1];
          return cursor.setBufferPosition(point);
        };

        return MoveToLineAndColumn;

      })(Base.getClass('MoveToFirstLine'));
      return this.emitter.emit('did-consume-vim');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMtZXgtbW9kZS9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGlEQUFBO0lBQUE7OztFQUFBLE1BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMscUJBQUQsRUFBVTs7RUFDVixjQUFBLEdBQWlCOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFBLEdBQU87YUFDUCxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLDhCQUFsQixFQUNqQjtRQUFBLDRCQUFBLEVBQThCLFNBQUE7aUJBQzVCLElBQUksQ0FBQyxNQUFMLENBQVksSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFaLEVBQXlCLGdCQUF6QjtRQUQ0QixDQUE5QjtRQUVBLHNDQUFBLEVBQXdDLFNBQUE7aUJBQ3RDLElBQUksQ0FBQyxNQUFMLENBQVksSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFaLEVBQXlCLGdCQUF6QjtRQURzQyxDQUZ4QztPQURpQixDQUFuQjtJQUpRLENBQVY7SUFVQSxNQUFBLEVBQVEsU0FBQyxNQUFELEVBQVMsV0FBVDthQUNOLElBQUMsQ0FBQSxjQUFELENBQWdCLE1BQWhCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFFBQUQ7aUJBQzNCLEtBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVSxDQUFDLE1BQVgsQ0FBa0IsUUFBbEIsRUFBNEIsV0FBNUI7UUFEMkI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCO0lBRE0sQ0FWUjtJQWNBLGNBQUEsRUFBZ0IsU0FBQyxNQUFEO01BQ2QsSUFBRyxzQkFBSDtlQUNFLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGNBQUEsQ0FBZSxNQUFmLENBQWhCLEVBREY7T0FBQSxNQUFBO2VBR00sSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxPQUFEO21CQUNWLEtBQUMsQ0FBQSxlQUFELENBQWlCLFNBQUE7cUJBQ2YsT0FBQSxDQUFRLGNBQUEsQ0FBZSxNQUFmLENBQVI7WUFEZSxDQUFqQjtVQURVO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSLEVBSE47O0lBRGMsQ0FkaEI7SUFzQkEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7OztjQUNLLENBQUU7OzthQUNQLE9BQTBCLEVBQTFCLEVBQUMsSUFBQyxDQUFBLHFCQUFBLGFBQUYsRUFBaUIsSUFBQyxDQUFBLFlBQUEsSUFBbEIsRUFBQTtJQUhVLENBdEJaO0lBMkJBLE9BQUEsRUFBUyxTQUFBO2lDQUNQLElBQUMsQ0FBQSxPQUFELElBQUMsQ0FBQSxPQUFRLElBQUksQ0FBQyxPQUFBLENBQVEsUUFBUixDQUFEO0lBRE4sQ0EzQlQ7SUE4QkEsZUFBQSxFQUFpQixTQUFDLEVBQUQ7YUFDZixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQjtJQURlLENBOUJqQjtJQWlDQSxVQUFBLEVBQVksU0FBQyxPQUFEO0FBQ1YsVUFBQTtNQUFDLHVDQUFELEVBQWlCO01BQ2pCLE1BQUEsR0FHTTs7Ozs7OztRQUNKLG1CQUFDLENBQUEsTUFBRCxDQUFBOztRQUNBLG1CQUFDLENBQUEsYUFBRCxHQUFnQjs7c0NBQ2hCLElBQUEsR0FBTTs7c0NBQ04sTUFBQSxHQUFROztzQ0FFUixVQUFBLEdBQVksU0FBQyxNQUFEO0FBQ1YsY0FBQTtVQUFBLHFEQUFBLFNBQUE7VUFDQSxLQUFBLEdBQVEsQ0FBQyxNQUFNLENBQUMsWUFBUCxDQUFBLENBQUQsRUFBd0IsSUFBQyxDQUFBLE1BQUQsR0FBVSxDQUFsQztpQkFDUixNQUFNLENBQUMsaUJBQVAsQ0FBeUIsS0FBekI7UUFIVTs7OztTQU5vQixJQUFJLENBQUMsUUFBTCxDQUFjLGlCQUFkO2FBV2xDLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGlCQUFkO0lBaEJVLENBakNaOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbmdldEVkaXRvclN0YXRlID0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAtPlxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgc2VsZiA9IHRoaXNcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3I6bm90KFttaW5pXSknLFxuICAgICAgJ3ZpbS1tb2RlLXBsdXMtZXgtbW9kZTpvcGVuJzogLT5cbiAgICAgICAgc2VsZi50b2dnbGUoQGdldE1vZGVsKCksICdub3JtYWxDb21tYW5kcycpXG4gICAgICAndmltLW1vZGUtcGx1cy1leC1tb2RlOnRvZ2dsZS1zZXR0aW5nJzogLT5cbiAgICAgICAgc2VsZi50b2dnbGUoQGdldE1vZGVsKCksICd0b2dnbGVDb21tYW5kcycpXG5cbiAgdG9nZ2xlOiAoZWRpdG9yLCBjb21tYW5kS2luZCkgLT5cbiAgICBAZ2V0RWRpdG9yU3RhdGUoZWRpdG9yKS50aGVuICh2aW1TdGF0ZSkgPT5cbiAgICAgIEBnZXRWaWV3KCkudG9nZ2xlKHZpbVN0YXRlLCBjb21tYW5kS2luZClcblxuICBnZXRFZGl0b3JTdGF0ZTogKGVkaXRvcikgLT5cbiAgICBpZiBnZXRFZGl0b3JTdGF0ZT9cbiAgICAgIFByb21pc2UucmVzb2x2ZShnZXRFZGl0b3JTdGF0ZShlZGl0b3IpKVxuICAgIGVsc2VcbiAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgICBAb25EaWRDb25zdW1lVmltIC0+XG4gICAgICAgICAgcmVzb2x2ZShnZXRFZGl0b3JTdGF0ZShlZGl0b3IpKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQHZpZXc/LmRlc3Ryb3k/KClcbiAgICB7QHN1YnNjcmlwdGlvbnMsIEB2aWV3fSA9IHt9XG5cbiAgZ2V0VmlldzogLT5cbiAgICBAdmlldyA/PSBuZXcgKHJlcXVpcmUoJy4vdmlldycpKVxuXG4gIG9uRGlkQ29uc3VtZVZpbTogKGZuKSAtPlxuICAgIEBlbWl0dGVyLm9uKCdkaWQtY29uc3VtZS12aW0nLCBmbilcblxuICBjb25zdW1lVmltOiAoc2VydmljZSkgLT5cbiAgICB7Z2V0RWRpdG9yU3RhdGUsIEJhc2V9ID0gc2VydmljZVxuICAgIE1vdGlvbiA9XG5cbiAgICAjIGtleW1hcDogZyBnXG4gICAgY2xhc3MgTW92ZVRvTGluZUFuZENvbHVtbiBleHRlbmRzIEJhc2UuZ2V0Q2xhc3MoJ01vdmVUb0ZpcnN0TGluZScpXG4gICAgICBAZXh0ZW5kKClcbiAgICAgIEBjb21tYW5kUHJlZml4OiAndmltLW1vZGUtcGx1cy11c2VyJ1xuICAgICAgd2lzZTogJ2NoYXJhY3Rlcndpc2UnXG4gICAgICBjb2x1bW46IG51bGxcblxuICAgICAgbW92ZUN1cnNvcjogKGN1cnNvcikgLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgcG9pbnQgPSBbY3Vyc29yLmdldEJ1ZmZlclJvdygpLCBAY29sdW1uIC0gMV1cbiAgICAgICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvaW50KVxuXG4gICAgQGVtaXR0ZXIuZW1pdCgnZGlkLWNvbnN1bWUtdmltJylcbiJdfQ==
