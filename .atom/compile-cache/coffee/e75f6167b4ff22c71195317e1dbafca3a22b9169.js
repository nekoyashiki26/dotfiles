(function() {
  var debounce, defer, sample;

  debounce = require("lodash.debounce");

  defer = require("lodash.defer");

  sample = require("lodash.sample");

  module.exports = {
    currentStreak: 0,
    reached: false,
    maxStreakReached: false,
    reset: function() {
      var ref, ref1;
      return (ref = this.container) != null ? (ref1 = ref.parentNode) != null ? ref1.removeChild(this.container) : void 0 : void 0;
    },
    destroy: function() {
      var ref, ref1, ref2;
      this.reset();
      this.container = null;
      if ((ref = this.debouncedEndStreak) != null) {
        ref.cancel();
      }
      this.debouncedEndStreak = null;
      if ((ref1 = this.streakTimeoutObserver) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.opacityObserver) != null) {
        ref2.dispose();
      }
      this.currentStreak = 0;
      this.reached = false;
      return this.maxStreakReached = false;
    },
    createElement: function(name, parent) {
      this.element = document.createElement("div");
      this.element.classList.add(name);
      if (parent) {
        parent.appendChild(this.element);
      }
      return this.element;
    },
    setup: function(editorElement) {
      var leftTimeout, ref, ref1;
      if (!this.container) {
        this.maxStreak = this.getMaxStreak();
        this.container = this.createElement("streak-container");
        this.container.classList.add("combo-zero");
        this.title = this.createElement("title", this.container);
        this.title.textContent = "Combo";
        this.max = this.createElement("max", this.container);
        this.max.textContent = "Max " + this.maxStreak;
        this.counter = this.createElement("counter", this.container);
        this.bar = this.createElement("bar", this.container);
        this.exclamations = this.createElement("exclamations", this.container);
        if ((ref = this.streakTimeoutObserver) != null) {
          ref.dispose();
        }
        this.streakTimeoutObserver = atom.config.observe('activate-power-mode.comboMode.streakTimeout', (function(_this) {
          return function(value) {
            var ref1;
            _this.streakTimeout = value * 1000;
            _this.endStreak();
            if ((ref1 = _this.debouncedEndStreak) != null) {
              ref1.cancel();
            }
            return _this.debouncedEndStreak = debounce(_this.endStreak.bind(_this), _this.streakTimeout);
          };
        })(this));
        if ((ref1 = this.opacityObserver) != null) {
          ref1.dispose();
        }
        this.opacityObserver = atom.config.observe('activate-power-mode.comboMode.opacity', (function(_this) {
          return function(value) {
            var ref2;
            return (ref2 = _this.container) != null ? ref2.style.opacity = value : void 0;
          };
        })(this));
      }
      this.exclamations.innerHTML = '';
      editorElement.querySelector(".scroll-view").appendChild(this.container);
      if (this.currentStreak) {
        leftTimeout = this.streakTimeout - (performance.now() - this.lastStreak);
        this.refreshStreakBar(leftTimeout);
      }
      return this.renderStreak();
    },
    increaseStreak: function() {
      this.lastStreak = performance.now();
      this.debouncedEndStreak();
      this.currentStreak++;
      this.container.classList.remove("combo-zero");
      if (this.currentStreak > this.maxStreak) {
        this.increaseMaxStreak();
      }
      if (this.currentStreak > 0 && this.currentStreak % this.getConfig("exclamationEvery") === 0) {
        this.showExclamation();
      }
      if (this.currentStreak >= this.getConfig("activationThreshold") && !this.reached) {
        this.reached = true;
        this.container.classList.add("reached");
      }
      this.refreshStreakBar();
      return this.renderStreak();
    },
    endStreak: function() {
      this.currentStreak = 0;
      this.reached = false;
      this.maxStreakReached = false;
      this.container.classList.add("combo-zero");
      this.container.classList.remove("reached");
      return this.renderStreak();
    },
    renderStreak: function() {
      this.counter.textContent = this.currentStreak;
      this.counter.classList.remove("bump");
      return defer((function(_this) {
        return function() {
          return _this.counter.classList.add("bump");
        };
      })(this));
    },
    refreshStreakBar: function(leftTimeout) {
      var scale;
      if (leftTimeout == null) {
        leftTimeout = this.streakTimeout;
      }
      scale = leftTimeout / this.streakTimeout;
      this.bar.style.transition = "none";
      this.bar.style.transform = "scaleX(" + scale + ")";
      return setTimeout((function(_this) {
        return function() {
          _this.bar.style.transform = "";
          return _this.bar.style.transition = "transform " + leftTimeout + "ms linear";
        };
      })(this), 100);
    },
    showExclamation: function(text) {
      var exclamation;
      if (text == null) {
        text = null;
      }
      exclamation = document.createElement("span");
      exclamation.classList.add("exclamation");
      if (text === null) {
        text = sample(this.getConfig("exclamationTexts"));
      }
      exclamation.textContent = text;
      this.exclamations.insertBefore(exclamation, this.exclamations.childNodes[0]);
      return setTimeout((function(_this) {
        return function() {
          if (exclamation.parentNode === _this.exclamations) {
            return _this.exclamations.removeChild(exclamation);
          }
        };
      })(this), 2000);
    },
    hasReached: function() {
      return this.reached;
    },
    getMaxStreak: function() {
      var maxStreak;
      maxStreak = localStorage.getItem("activate-power-mode.maxStreak");
      if (maxStreak === null) {
        maxStreak = 0;
      }
      return maxStreak;
    },
    increaseMaxStreak: function() {
      localStorage.setItem("activate-power-mode.maxStreak", this.currentStreak);
      this.maxStreak = this.currentStreak;
      this.max.textContent = "Max " + this.maxStreak;
      if (this.maxStreakReached === false) {
        this.showExclamation("NEW MAX!!!");
      }
      return this.maxStreakReached = true;
    },
    resetMaxStreak: function() {
      localStorage.setItem("activate-power-mode.maxStreak", 0);
      this.maxStreakReached = false;
      this.maxStreak = 0;
      if (this.max) {
        return this.max.textContent = "Max 0";
      }
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode.comboMode." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2NvbWJvLW1vZGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSOztFQUNYLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUjs7RUFDUixNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGFBQUEsRUFBZSxDQUFmO0lBQ0EsT0FBQSxFQUFTLEtBRFQ7SUFFQSxnQkFBQSxFQUFrQixLQUZsQjtJQUlBLEtBQUEsRUFBTyxTQUFBO0FBQ0wsVUFBQTtvRkFBc0IsQ0FBRSxXQUF4QixDQUFvQyxJQUFDLENBQUEsU0FBckM7SUFESyxDQUpQO0lBT0EsT0FBQSxFQUFTLFNBQUE7QUFDUCxVQUFBO01BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWE7O1dBQ00sQ0FBRSxNQUFyQixDQUFBOztNQUNBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQjs7WUFDQSxDQUFFLE9BQXhCLENBQUE7OztZQUNnQixDQUFFLE9BQWxCLENBQUE7O01BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7TUFDakIsSUFBQyxDQUFBLE9BQUQsR0FBVzthQUNYLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtJQVRiLENBUFQ7SUFrQkEsYUFBQSxFQUFlLFNBQUMsSUFBRCxFQUFPLE1BQVA7TUFDYixJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsSUFBdkI7TUFDQSxJQUErQixNQUEvQjtRQUFBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLElBQUMsQ0FBQSxPQUFw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ZmVyID0gcmVxdWlyZSBcImxvZGFzaC5kZWZlclwiXG5zYW1wbGUgPSByZXF1aXJlIFwibG9kYXNoLnNhbXBsZVwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY3VycmVudFN0cmVhazogMFxuICByZWFjaGVkOiBmYWxzZVxuICBtYXhTdHJlYWtSZWFjaGVkOiBmYWxzZVxuXG4gIHJlc2V0OiAtPlxuICAgIEBjb250YWluZXI/LnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkIEBjb250YWluZXJcblxuICBkZXN0cm95OiAtPlxuICAgIEByZXNldCgpXG4gICAgQGNvbnRhaW5lciA9IG51bGxcbiAgICBAZGVib3VuY2VkRW5kU3RyZWFrPy5jYW5jZWwoKVxuICAgIEBkZWJvdW5jZWRFbmRTdHJlYWsgPSBudWxsXG4gICAgQHN0cmVha1RpbWVvdXRPYnNlcnZlcj8uZGlzcG9zZSgpXG4gICAgQG9wYWNpdHlPYnNlcnZlcj8uZGlzcG9zZSgpXG4gICAgQGN1cnJlbnRTdHJlYWsgPSAwXG4gICAgQHJlYWNoZWQgPSBmYWxzZVxuICAgIEBtYXhTdHJlYWtSZWFjaGVkID0gZmFsc2VcblxuICBjcmVhdGVFbGVtZW50OiAobmFtZSwgcGFyZW50KS0+XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiZGl2XCJcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkIG5hbWVcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQgQGVsZW1lbnQgaWYgcGFyZW50XG4gICAgQGVsZW1lbnRcblxuICBzZXR1cDogKGVkaXRvckVsZW1lbnQpIC0+XG4gICAgaWYgbm90IEBjb250YWluZXJcbiAgICAgIEBtYXhTdHJlYWsgPSBAZ2V0TWF4U3RyZWFrKClcbiAgICAgIEBjb250YWluZXIgPSBAY3JlYXRlRWxlbWVudCBcInN0cmVhay1jb250YWluZXJcIlxuICAgICAgQGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkIFwiY29tYm8temVyb1wiXG4gICAgICBAdGl0bGUgPSBAY3JlYXRlRWxlbWVudCBcInRpdGxlXCIsIEBjb250YWluZXJcbiAgICAgIEB0aXRsZS50ZXh0Q29udGVudCA9IFwiQ29tYm9cIlxuICAgICAgQG1heCA9IEBjcmVhdGVFbGVtZW50IFwibWF4XCIsIEBjb250YWluZXJcbiAgICAgIEBtYXgudGV4dENvbnRlbnQgPSBcIk1heCAje0BtYXhTdHJlYWt9XCJcbiAgICAgIEBjb3VudGVyID0gQGNyZWF0ZUVsZW1lbnQgXCJjb3VudGVyXCIsIEBjb250YWluZXJcbiAgICAgIEBiYXIgPSBAY3JlYXRlRWxlbWVudCBcImJhclwiLCBAY29udGFpbmVyXG4gICAgICBAZXhjbGFtYXRpb25zID0gQGNyZWF0ZUVsZW1lbnQgXCJleGNsYW1hdGlvbnNcIiwgQGNvbnRhaW5lclxuXG4gICAgICBAc3RyZWFrVGltZW91dE9ic2VydmVyPy5kaXNwb3NlKClcbiAgICAgIEBzdHJlYWtUaW1lb3V0T2JzZXJ2ZXIgPSBhdG9tLmNvbmZpZy5vYnNlcnZlICdhY3RpdmF0ZS1wb3dlci1tb2RlLmNvbWJvTW9kZS5zdHJlYWtUaW1lb3V0JywgKHZhbHVlKSA9PlxuICAgICAgICBAc3RyZWFrVGltZW91dCA9IHZhbHVlICogMTAwMFxuICAgICAgICBAZW5kU3RyZWFrKClcbiAgICAgICAgQGRlYm91bmNlZEVuZFN0cmVhaz8uY2FuY2VsKClcbiAgICAgICAgQGRlYm91bmNlZEVuZFN0cmVhayA9IGRlYm91bmNlIEBlbmRTdHJlYWsuYmluZCh0aGlzKSwgQHN0cmVha1RpbWVvdXRcblxuICAgICAgQG9wYWNpdHlPYnNlcnZlcj8uZGlzcG9zZSgpXG4gICAgICBAb3BhY2l0eU9ic2VydmVyID0gYXRvbS5jb25maWcub2JzZXJ2ZSAnYWN0aXZhdGUtcG93ZXItbW9kZS5jb21ib01vZGUub3BhY2l0eScsICh2YWx1ZSkgPT5cbiAgICAgICAgQGNvbnRhaW5lcj8uc3R5bGUub3BhY2l0eSA9IHZhbHVlXG5cbiAgICBAZXhjbGFtYXRpb25zLmlubmVySFRNTCA9ICcnXG5cbiAgICBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2Nyb2xsLXZpZXdcIikuYXBwZW5kQ2hpbGQgQGNvbnRhaW5lclxuXG4gICAgaWYgQGN1cnJlbnRTdHJlYWtcbiAgICAgIGxlZnRUaW1lb3V0ID0gQHN0cmVha1RpbWVvdXQgLSAocGVyZm9ybWFuY2Uubm93KCkgLSBAbGFzdFN0cmVhaylcbiAgICAgIEByZWZyZXNoU3RyZWFrQmFyIGxlZnRUaW1lb3V0XG5cbiAgICBAcmVuZGVyU3RyZWFrKClcblxuICBpbmNyZWFzZVN0cmVhazogLT5cbiAgICBAbGFzdFN0cmVhayA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgQGRlYm91bmNlZEVuZFN0cmVhaygpXG5cbiAgICBAY3VycmVudFN0cmVhaysrXG5cbiAgICBAY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUgXCJjb21iby16ZXJvXCJcbiAgICBpZiBAY3VycmVudFN0cmVhayA+IEBtYXhTdHJlYWtcbiAgICAgIEBpbmNyZWFzZU1heFN0cmVhaygpXG5cbiAgICBAc2hvd0V4Y2xhbWF0aW9uKCkgaWYgQGN1cnJlbnRTdHJlYWsgPiAwIGFuZCBAY3VycmVudFN0cmVhayAlIEBnZXRDb25maWcoXCJleGNsYW1hdGlvbkV2ZXJ5XCIpIGlzIDBcblxuICAgIGlmIEBjdXJyZW50U3RyZWFrID49IEBnZXRDb25maWcoXCJhY3RpdmF0aW9uVGhyZXNob2xkXCIpIGFuZCBub3QgQHJlYWNoZWRcbiAgICAgIEByZWFjaGVkID0gdHJ1ZVxuICAgICAgQGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkIFwicmVhY2hlZFwiXG5cbiAgICBAcmVmcmVzaFN0cmVha0JhcigpXG5cbiAgICBAcmVuZGVyU3RyZWFrKClcblxuICBlbmRTdHJlYWs6IC0+XG4gICAgQGN1cnJlbnRTdHJlYWsgPSAwXG4gICAgQHJlYWNoZWQgPSBmYWxzZVxuICAgIEBtYXhTdHJlYWtSZWFjaGVkID0gZmFsc2VcbiAgICBAY29udGFpbmVyLmNsYXNzTGlzdC5hZGQgXCJjb21iby16ZXJvXCJcbiAgICBAY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUgXCJyZWFjaGVkXCJcbiAgICBAcmVuZGVyU3RyZWFrKClcblxuICByZW5kZXJTdHJlYWs6IC0+XG4gICAgQGNvdW50ZXIudGV4dENvbnRlbnQgPSBAY3VycmVudFN0cmVha1xuICAgIEBjb3VudGVyLmNsYXNzTGlzdC5yZW1vdmUgXCJidW1wXCJcblxuICAgIGRlZmVyID0+XG4gICAgICBAY291bnRlci5jbGFzc0xpc3QuYWRkIFwiYnVtcFwiXG5cbiAgcmVmcmVzaFN0cmVha0JhcjogKGxlZnRUaW1lb3V0ID0gQHN0cmVha1RpbWVvdXQpIC0+XG4gICAgc2NhbGUgPSBsZWZ0VGltZW91dCAvIEBzdHJlYWtUaW1lb3V0XG4gICAgQGJhci5zdHlsZS50cmFuc2l0aW9uID0gXCJub25lXCJcbiAgICBAYmFyLnN0eWxlLnRyYW5zZm9ybSA9IFwic2NhbGVYKCN7c2NhbGV9KVwiXG5cbiAgICBzZXRUaW1lb3V0ID0+XG4gICAgICBAYmFyLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCJcbiAgICAgIEBiYXIuc3R5bGUudHJhbnNpdGlvbiA9IFwidHJhbnNmb3JtICN7bGVmdFRpbWVvdXR9bXMgbGluZWFyXCJcbiAgICAsIDEwMFxuXG4gIHNob3dFeGNsYW1hdGlvbjogKHRleHQgPSBudWxsKSAtPlxuICAgIGV4Y2xhbWF0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcInNwYW5cIlxuICAgIGV4Y2xhbWF0aW9uLmNsYXNzTGlzdC5hZGQgXCJleGNsYW1hdGlvblwiXG4gICAgdGV4dCA9IHNhbXBsZSBAZ2V0Q29uZmlnIFwiZXhjbGFtYXRpb25UZXh0c1wiIGlmIHRleHQgaXMgbnVsbFxuICAgIGV4Y2xhbWF0aW9uLnRleHRDb250ZW50ID0gdGV4dFxuXG4gICAgQGV4Y2xhbWF0aW9ucy5pbnNlcnRCZWZvcmUgZXhjbGFtYXRpb24sIEBleGNsYW1hdGlvbnMuY2hpbGROb2Rlc1swXVxuICAgIHNldFRpbWVvdXQgPT5cbiAgICAgIGlmIGV4Y2xhbWF0aW9uLnBhcmVudE5vZGUgaXMgQGV4Y2xhbWF0aW9uc1xuICAgICAgICBAZXhjbGFtYXRpb25zLnJlbW92ZUNoaWxkIGV4Y2xhbWF0aW9uXG4gICAgLCAyMDAwXG5cbiAgaGFzUmVhY2hlZDogLT5cbiAgICBAcmVhY2hlZFxuXG4gIGdldE1heFN0cmVhazogLT5cbiAgICBtYXhTdHJlYWsgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSBcImFjdGl2YXRlLXBvd2VyLW1vZGUubWF4U3RyZWFrXCJcbiAgICBtYXhTdHJlYWsgPSAwIGlmIG1heFN0cmVhayBpcyBudWxsXG4gICAgbWF4U3RyZWFrXG5cbiAgaW5jcmVhc2VNYXhTdHJlYWs6IC0+XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gXCJhY3RpdmF0ZS1wb3dlci1tb2RlLm1heFN0cmVha1wiLCBAY3VycmVudFN0cmVha1xuICAgIEBtYXhTdHJlYWsgPSBAY3VycmVudFN0cmVha1xuICAgIEBtYXgudGV4dENvbnRlbnQgPSBcIk1heCAje0BtYXhTdHJlYWt9XCJcbiAgICBAc2hvd0V4Y2xhbWF0aW9uIFwiTkVXIE1BWCEhIVwiIGlmIEBtYXhTdHJlYWtSZWFjaGVkIGlzIGZhbHNlXG4gICAgQG1heFN0cmVha1JlYWNoZWQgPSB0cnVlXG5cbiAgcmVzZXRNYXhTdHJlYWs6IC0+XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gXCJhY3RpdmF0ZS1wb3dlci1tb2RlLm1heFN0cmVha1wiLCAwXG4gICAgQG1heFN0cmVha1JlYWNoZWQgPSBmYWxzZVxuICAgIEBtYXhTdHJlYWsgPSAwXG4gICAgaWYgQG1heFxuICAgICAgQG1heC50ZXh0Q29udGVudCA9IFwiTWF4IDBcIlxuXG4gIGdldENvbmZpZzogKGNvbmZpZykgLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQgXCJhY3RpdmF0ZS1wb3dlci1tb2RlLmNvbWJvTW9kZS4je2NvbmZpZ31cIlxuIl19
