(function() {
  var comboMode, playAudio, powerCanvas, screenShake, throttle,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  throttle = require("lodash.throttle");

  screenShake = require("./screen-shake");

  playAudio = require("./play-audio");

  powerCanvas = require("./power-canvas");

  comboMode = require("./combo-mode");

  module.exports = {
    screenShake: screenShake,
    playAudio: playAudio,
    powerCanvas: powerCanvas,
    comboMode: comboMode,
    enable: function() {
      this.throttledShake = throttle(this.screenShake.shake.bind(this.screenShake), 100, {
        trailing: false
      });
      this.throttledPlayAudio = throttle(this.playAudio.play.bind(this.playAudio), 100, {
        trailing: false
      });
      this.activeItemSubscription = atom.workspace.onDidStopChangingActivePaneItem((function(_this) {
        return function() {
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.comboModeEnabledSubscription = atom.config.observe('activate-power-mode.comboMode.enabled', (function(_this) {
        return function(value) {
          _this.isComboMode = value;
          if (_this.isComboMode && _this.editorElement) {
            return _this.comboMode.setup(_this.editorElement);
          } else {
            return _this.comboMode.destroy();
          }
        };
      })(this));
      return this.subscribeToActiveTextEditor();
    },
    disable: function() {
      var ref, ref1, ref2, ref3;
      if ((ref = this.activeItemSubscription) != null) {
        ref.dispose();
      }
      if ((ref1 = this.editorChangeSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.comboModeEnabledSubscription) != null) {
        ref2.dispose();
      }
      if ((ref3 = this.editorAddCursor) != null) {
        ref3.dispose();
      }
      this.powerCanvas.destroy();
      this.comboMode.destroy();
      return this.isComboMode = false;
    },
    subscribeToActiveTextEditor: function() {
      this.powerCanvas.resetCanvas();
      if (this.isComboMode) {
        this.comboMode.reset();
      }
      return this.prepareEditor();
    },
    prepareEditor: function() {
      var ref, ref1, ref2, ref3;
      if ((ref = this.editorChangeSubscription) != null) {
        ref.dispose();
      }
      if ((ref1 = this.editorAddCursor) != null) {
        ref1.dispose();
      }
      this.editor = atom.workspace.getActiveTextEditor();
      if (!this.editor) {
        return;
      }
      if (ref2 = (ref3 = this.editor.getPath()) != null ? ref3.split('.').pop() : void 0, indexOf.call(this.getConfig("excludedFileTypes.excluded"), ref2) >= 0) {
        return;
      }
      this.editorElement = atom.views.getView(this.editor);
      this.powerCanvas.setupCanvas(this.editor, this.editorElement);
      if (this.isComboMode) {
        this.comboMode.setup(this.editorElement);
      }
      this.editorChangeSubscription = this.editor.getBuffer().onDidChange(this.onChange.bind(this));
      return this.editorAddCursor = this.editor.observeCursors(this.handleCursor.bind(this));
    },
    handleCursor: function(cursor) {
      return cursor.throttleSpawnParticles = throttle(this.powerCanvas.spawnParticles.bind(this.powerCanvas), 25, {
        trailing: false
      });
    },
    onChange: function(e) {
      var cursor, range, screenPosition, spawnParticles;
      spawnParticles = true;
      if (e.newText) {
        spawnParticles = e.newText !== "\n";
        range = e.newRange.end;
      } else {
        range = e.newRange.start;
      }
      screenPosition = this.editor.screenPositionForBufferPosition(range);
      cursor = this.editor.getCursorAtScreenPosition(screenPosition);
      if (!cursor) {
        return;
      }
      if (this.isComboMode) {
        this.comboMode.increaseStreak();
        if (!this.comboMode.hasReached()) {
          return;
        }
      }
      if (spawnParticles && this.getConfig("particles.enabled")) {
        cursor.throttleSpawnParticles(screenPosition);
      }
      if (this.getConfig("screenShake.enabled")) {
        this.throttledShake(this.editorElement);
      }
      if (this.getConfig("playAudio.enabled")) {
        return this.throttledPlayAudio();
      }
    },
    getCombo: function() {
      return this.comboMode;
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3Bvd2VyLWVkaXRvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHdEQUFBO0lBQUE7O0VBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUjs7RUFDWCxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUNkLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjs7RUFDWixXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUNkLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsV0FBQSxFQUFhLFdBQWI7SUFDQSxTQUFBLEVBQVcsU0FEWDtJQUVBLFdBQUEsRUFBYSxXQUZiO0lBR0EsU0FBQSxFQUFXLFNBSFg7SUFLQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxjQUFELEdBQWtCLFFBQUEsQ0FBUyxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFuQixDQUF3QixJQUFDLENBQUEsV0FBekIsQ0FBVCxFQUFnRCxHQUFoRCxFQUFxRDtRQUFBLFFBQUEsRUFBVSxLQUFWO09BQXJEO01BQ2xCLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixRQUFBLENBQVMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBaEIsQ0FBcUIsSUFBQyxDQUFBLFNBQXRCLENBQVQsRUFBMkMsR0FBM0MsRUFBZ0Q7UUFBQSxRQUFBLEVBQVUsS0FBVjtPQUFoRDtNQUV0QixJQUFDLENBQUEsc0JBQUQsR0FBMEIsSUFBSSxDQUFDLFNBQVMsQ0FBQywrQkFBZixDQUErQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3ZFLEtBQUMsQ0FBQSwyQkFBRCxDQUFBO1FBRHVFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQztNQUcxQixJQUFDLENBQUEsNEJBQUQsR0FBZ0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHVDQUFwQixFQUE2RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtVQUMzRixLQUFDLENBQUEsV0FBRCxHQUFlO1VBQ2YsSUFBRyxLQUFDLENBQUEsV0FBRCxJQUFpQixLQUFDLENBQUEsYUFBckI7bUJBQ0UsS0FBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQWlCLEtBQUMsQ0FBQSxhQUFsQixFQURGO1dBQUEsTUFBQTttQkFHRSxLQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBQSxFQUhGOztRQUYyRjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0Q7YUFPaEMsSUFBQyxDQUFBLDJCQUFELENBQUE7SUFkTSxDQUxSO0lBcUJBLE9BQUEsRUFBUyxTQUFBO0FBQ1AsVUFBQTs7V0FBdUIsQ0FBRSxPQUF6QixDQUFBOzs7WUFDeUIsQ0FBRSxPQUEzQixDQUFBOzs7WUFDNkIsQ0FBRSxPQUEvQixDQUFBOzs7WUFDZ0IsQ0FBRSxPQUFsQixDQUFBOztNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO01BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFYLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlO0lBUFIsQ0FyQlQ7SUE4QkEsMkJBQUEsRUFBNkIsU0FBQTtNQUMzQixJQUFDLENBQUEsV0FBVyxDQUFDLFdBQWIsQ0FBQTtNQUNBLElBQXNCLElBQUMsQ0FBQSxXQUF2QjtRQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBLEVBQUE7O2FBQ0EsSUFBQyxDQUFBLGFBQUQsQ0FBQTtJQUgyQixDQTlCN0I7SUFtQ0EsYUFBQSxFQUFlLFNBQUE7QUFDYixVQUFBOztXQUF5QixDQUFFLE9BQTNCLENBQUE7OztZQUNnQixDQUFFLE9BQWxCLENBQUE7O01BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVixJQUFBLENBQWMsSUFBQyxDQUFBLE1BQWY7QUFBQSxlQUFBOztNQUNBLHdEQUEyQixDQUFFLEtBQW5CLENBQXlCLEdBQXpCLENBQTZCLENBQUMsR0FBOUIsQ0FBQSxVQUFBLEVBQUEsYUFBdUMsSUFBQyxDQUFBLFNBQUQsQ0FBVyw0QkFBWCxDQUF2QyxFQUFBLElBQUEsTUFBVjtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxNQUFwQjtNQUVqQixJQUFDLENBQUEsV0FBVyxDQUFDLFdBQWIsQ0FBeUIsSUFBQyxDQUFBLE1BQTFCLEVBQWtDLElBQUMsQ0FBQSxhQUFuQztNQUNBLElBQW1DLElBQUMsQ0FBQSxXQUFwQztRQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFpQixJQUFDLENBQUEsYUFBbEIsRUFBQTs7TUFFQSxJQUFDLENBQUEsd0JBQUQsR0FBNEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxXQUFwQixDQUFnQyxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFmLENBQWhDO2FBQzVCLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUF1QixJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsSUFBbkIsQ0FBdkI7SUFiTixDQW5DZjtJQWtEQSxZQUFBLEVBQWMsU0FBQyxNQUFEO2FBQ1osTUFBTSxDQUFDLHNCQUFQLEdBQWdDLFFBQUEsQ0FBUyxJQUFDLENBQUEsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUE1QixDQUFpQyxJQUFDLENBQUEsV0FBbEMsQ0FBVCxFQUF5RCxFQUF6RCxFQUE2RDtRQUFBLFFBQUEsRUFBVSxLQUFWO09BQTdEO0lBRHBCLENBbERkO0lBcURBLFFBQUEsRUFBVSxTQUFDLENBQUQ7QUFDUixVQUFBO01BQUEsY0FBQSxHQUFpQjtNQUNqQixJQUFHLENBQUMsQ0FBQyxPQUFMO1FBQ0UsY0FBQSxHQUFpQixDQUFDLENBQUMsT0FBRixLQUFlO1FBQ2hDLEtBQUEsR0FBUSxDQUFDLENBQUMsUUFBUSxDQUFDLElBRnJCO09BQUEsTUFBQTtRQUlFLEtBQUEsR0FBUSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BSnJCOztNQU1BLGNBQUEsR0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQywrQkFBUixDQUF3QyxLQUF4QztNQUNqQixNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyx5QkFBUixDQUFrQyxjQUFsQztNQUNULElBQUEsQ0FBYyxNQUFkO0FBQUEsZUFBQTs7TUFFQSxJQUFHLElBQUMsQ0FBQSxXQUFKO1FBQ0UsSUFBQyxDQUFBLFNBQVMsQ0FBQyxjQUFYLENBQUE7UUFDQSxJQUFBLENBQWMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxVQUFYLENBQUEsQ0FBZDtBQUFBLGlCQUFBO1NBRkY7O01BSUEsSUFBRyxjQUFBLElBQW1CLElBQUMsQ0FBQSxTQUFELENBQVcsbUJBQVgsQ0FBdEI7UUFDRSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsY0FBOUIsRUFERjs7TUFFQSxJQUFHLElBQUMsQ0FBQSxTQUFELENBQVcscUJBQVgsQ0FBSDtRQUNFLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQUMsQ0FBQSxhQUFqQixFQURGOztNQUVBLElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBVyxtQkFBWCxDQUFIO2VBQ0UsSUFBQyxDQUFBLGtCQUFELENBQUEsRUFERjs7SUFwQlEsQ0FyRFY7SUE0RUEsUUFBQSxFQUFVLFNBQUE7YUFDUixJQUFDLENBQUE7SUFETyxDQTVFVjtJQStFQSxTQUFBLEVBQVcsU0FBQyxNQUFEO2FBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFBLEdBQXVCLE1BQXZDO0lBRFMsQ0EvRVg7O0FBUEYiLCJzb3VyY2VzQ29udGVudCI6WyJ0aHJvdHRsZSA9IHJlcXVpcmUgXCJsb2Rhc2gudGhyb3R0bGVcIlxuc2NyZWVuU2hha2UgPSByZXF1aXJlIFwiLi9zY3JlZW4tc2hha2VcIlxucGxheUF1ZGlvID0gcmVxdWlyZSBcIi4vcGxheS1hdWRpb1wiXG5wb3dlckNhbnZhcyA9IHJlcXVpcmUgXCIuL3Bvd2VyLWNhbnZhc1wiXG5jb21ib01vZGUgPSByZXF1aXJlIFwiLi9jb21iby1tb2RlXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzY3JlZW5TaGFrZTogc2NyZWVuU2hha2VcbiAgcGxheUF1ZGlvOiBwbGF5QXVkaW9cbiAgcG93ZXJDYW52YXM6IHBvd2VyQ2FudmFzXG4gIGNvbWJvTW9kZTogY29tYm9Nb2RlXG5cbiAgZW5hYmxlOiAtPlxuICAgIEB0aHJvdHRsZWRTaGFrZSA9IHRocm90dGxlIEBzY3JlZW5TaGFrZS5zaGFrZS5iaW5kKEBzY3JlZW5TaGFrZSksIDEwMCwgdHJhaWxpbmc6IGZhbHNlXG4gICAgQHRocm90dGxlZFBsYXlBdWRpbyA9IHRocm90dGxlIEBwbGF5QXVkaW8ucGxheS5iaW5kKEBwbGF5QXVkaW8pLCAxMDAsIHRyYWlsaW5nOiBmYWxzZVxuXG4gICAgQGFjdGl2ZUl0ZW1TdWJzY3JpcHRpb24gPSBhdG9tLndvcmtzcGFjZS5vbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtID0+XG4gICAgICBAc3Vic2NyaWJlVG9BY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIEBjb21ib01vZGVFbmFibGVkU3Vic2NyaXB0aW9uID0gYXRvbS5jb25maWcub2JzZXJ2ZSAnYWN0aXZhdGUtcG93ZXItbW9kZS5jb21ib01vZGUuZW5hYmxlZCcsICh2YWx1ZSkgPT5cbiAgICAgIEBpc0NvbWJvTW9kZSA9IHZhbHVlXG4gICAgICBpZiBAaXNDb21ib01vZGUgYW5kIEBlZGl0b3JFbGVtZW50XG4gICAgICAgIEBjb21ib01vZGUuc2V0dXAgQGVkaXRvckVsZW1lbnRcbiAgICAgIGVsc2VcbiAgICAgICAgQGNvbWJvTW9kZS5kZXN0cm95KClcblxuICAgIEBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3IoKVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQGFjdGl2ZUl0ZW1TdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBlZGl0b3JDaGFuZ2VTdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBjb21ib01vZGVFbmFibGVkU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAZWRpdG9yQWRkQ3Vyc29yPy5kaXNwb3NlKClcbiAgICBAcG93ZXJDYW52YXMuZGVzdHJveSgpXG4gICAgQGNvbWJvTW9kZS5kZXN0cm95KClcbiAgICBAaXNDb21ib01vZGUgPSBmYWxzZVxuXG4gIHN1YnNjcmliZVRvQWN0aXZlVGV4dEVkaXRvcjogLT5cbiAgICBAcG93ZXJDYW52YXMucmVzZXRDYW52YXMoKVxuICAgIEBjb21ib01vZGUucmVzZXQoKSBpZiBAaXNDb21ib01vZGVcbiAgICBAcHJlcGFyZUVkaXRvcigpXG5cbiAgcHJlcGFyZUVkaXRvcjogLT5cbiAgICBAZWRpdG9yQ2hhbmdlU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAZWRpdG9yQWRkQ3Vyc29yPy5kaXNwb3NlKClcbiAgICBAZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBAZWRpdG9yXG4gICAgcmV0dXJuIGlmIEBlZGl0b3IuZ2V0UGF0aCgpPy5zcGxpdCgnLicpLnBvcCgpIGluIEBnZXRDb25maWcgXCJleGNsdWRlZEZpbGVUeXBlcy5leGNsdWRlZFwiXG5cbiAgICBAZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyBAZWRpdG9yXG5cbiAgICBAcG93ZXJDYW52YXMuc2V0dXBDYW52YXMgQGVkaXRvciwgQGVkaXRvckVsZW1lbnRcbiAgICBAY29tYm9Nb2RlLnNldHVwIEBlZGl0b3JFbGVtZW50IGlmIEBpc0NvbWJvTW9kZVxuXG4gICAgQGVkaXRvckNoYW5nZVN1YnNjcmlwdGlvbiA9IEBlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRDaGFuZ2UgQG9uQ2hhbmdlLmJpbmQodGhpcylcbiAgICBAZWRpdG9yQWRkQ3Vyc29yID0gQGVkaXRvci5vYnNlcnZlQ3Vyc29ycyBAaGFuZGxlQ3Vyc29yLmJpbmQodGhpcylcblxuICBoYW5kbGVDdXJzb3I6IChjdXJzb3IpIC0+XG4gICAgY3Vyc29yLnRocm90dGxlU3Bhd25QYXJ0aWNsZXMgPSB0aHJvdHRsZSBAcG93ZXJDYW52YXMuc3Bhd25QYXJ0aWNsZXMuYmluZChAcG93ZXJDYW52YXMpLCAyNSwgdHJhaWxpbmc6IGZhbHNlXG5cbiAgb25DaGFuZ2U6IChlKSAtPlxuICAgIHNwYXduUGFydGljbGVzID0gdHJ1ZVxuICAgIGlmIGUubmV3VGV4dFxuICAgICAgc3Bhd25QYXJ0aWNsZXMgPSBlLm5ld1RleHQgaXNudCBcIlxcblwiXG4gICAgICByYW5nZSA9IGUubmV3UmFuZ2UuZW5kXG4gICAgZWxzZVxuICAgICAgcmFuZ2UgPSBlLm5ld1JhbmdlLnN0YXJ0XG5cbiAgICBzY3JlZW5Qb3NpdGlvbiA9IEBlZGl0b3Iuc2NyZWVuUG9zaXRpb25Gb3JCdWZmZXJQb3NpdGlvbiByYW5nZVxuICAgIGN1cnNvciA9IEBlZGl0b3IuZ2V0Q3Vyc29yQXRTY3JlZW5Qb3NpdGlvbiBzY3JlZW5Qb3NpdGlvblxuICAgIHJldHVybiB1bmxlc3MgY3Vyc29yXG5cbiAgICBpZiBAaXNDb21ib01vZGVcbiAgICAgIEBjb21ib01vZGUuaW5jcmVhc2VTdHJlYWsoKVxuICAgICAgcmV0dXJuIHVubGVzcyBAY29tYm9Nb2RlLmhhc1JlYWNoZWQoKVxuXG4gICAgaWYgc3Bhd25QYXJ0aWNsZXMgYW5kIEBnZXRDb25maWcgXCJwYXJ0aWNsZXMuZW5hYmxlZFwiXG4gICAgICBjdXJzb3IudGhyb3R0bGVTcGF3blBhcnRpY2xlcyBzY3JlZW5Qb3NpdGlvblxuICAgIGlmIEBnZXRDb25maWcgXCJzY3JlZW5TaGFrZS5lbmFibGVkXCJcbiAgICAgIEB0aHJvdHRsZWRTaGFrZSBAZWRpdG9yRWxlbWVudFxuICAgIGlmIEBnZXRDb25maWcgXCJwbGF5QXVkaW8uZW5hYmxlZFwiXG4gICAgICBAdGhyb3R0bGVkUGxheUF1ZGlvKClcblxuICBnZXRDb21ibzogLT5cbiAgICBAY29tYm9Nb2RlXG5cbiAgZ2V0Q29uZmlnOiAoY29uZmlnKSAtPlxuICAgIGF0b20uY29uZmlnLmdldCBcImFjdGl2YXRlLXBvd2VyLW1vZGUuI3tjb25maWd9XCJcbiJdfQ==
