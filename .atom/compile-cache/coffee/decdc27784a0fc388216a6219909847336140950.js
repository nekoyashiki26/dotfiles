(function() {
  var CompositeDisposable, colorHelper, random;

  CompositeDisposable = require("atom").CompositeDisposable;

  random = require("lodash.random");

  colorHelper = require("./color-helper");

  module.exports = {
    colorHelper: colorHelper,
    subscriptions: null,
    init: function() {
      this.resetParticles();
      return this.animationOn();
    },
    resetCanvas: function() {
      this.animationOff();
      this.editor = null;
      return this.editorElement = null;
    },
    animationOff: function() {
      cancelAnimationFrame(this.animationFrame);
      return this.animationFrame = null;
    },
    animationOn: function() {
      return this.animationFrame = requestAnimationFrame(this.drawParticles.bind(this));
    },
    resetParticles: function() {
      return this.particles = [];
    },
    destroy: function() {
      var ref, ref1;
      this.resetCanvas();
      this.resetParticles();
      if ((ref = this.canvas) != null) {
        ref.parentNode.removeChild(this.canvas);
      }
      this.canvas = null;
      return (ref1 = this.subscriptions) != null ? ref1.dispose() : void 0;
    },
    setupCanvas: function(editor, editorElement) {
      if (!this.canvas) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.classList.add("power-mode-canvas");
        this.initConfigSubscribers();
      }
      editorElement.appendChild(this.canvas);
      this.canvas.style.display = "block";
      this.canvas.width = editorElement.offsetWidth;
      this.canvas.height = editorElement.offsetHeight;
      this.scrollView = editorElement.querySelector(".scroll-view");
      this.editorElement = editorElement;
      this.editor = editor;
      return this.init();
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('activate-power-mode.particles.spawnCount.min', (function(_this) {
        return function(value) {
          return _this.confMinCount = value;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('activate-power-mode.particles.spawnCount.max', (function(_this) {
        return function(value) {
          return _this.confMaxCount = value;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('activate-power-mode.particles.totalCount.max', (function(_this) {
        return function(value) {
          return _this.confTotalCount = value;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('activate-power-mode.particles.size.min', (function(_this) {
        return function(value) {
          return _this.confMinSize = value;
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('activate-power-mode.particles.size.max', (function(_this) {
        return function(value) {
          return _this.confMaxSize = value;
        };
      })(this)));
    },
    spawnParticles: function(screenPosition) {
      var color, left, nextColor, numParticles, ref, results, top;
      ref = this.calculatePositions(screenPosition), left = ref.left, top = ref.top;
      numParticles = random(this.confMinCount, this.confMaxCount);
      color = this.colorHelper.getColor(this.editor, this.editorElement, screenPosition);
      results = [];
      while (numParticles--) {
        nextColor = typeof color === "object" ? color.next().value : color;
        if (this.particles.length >= this.confTotalCount) {
          this.particles.shift();
        }
        results.push(this.particles.push(this.createParticle(left, top, nextColor)));
      }
      return results;
    },
    calculatePositions: function(screenPosition) {
      var left, ref, top;
      ref = this.editorElement.pixelPositionForScreenPosition(screenPosition), left = ref.left, top = ref.top;
      return {
        left: left + this.scrollView.offsetLeft - this.editorElement.getScrollLeft(),
        top: top + this.scrollView.offsetTop - this.editorElement.getScrollTop() + this.editor.getLineHeightInPixels() / 2
      };
    },
    createParticle: function(x, y, color) {
      return {
        x: x,
        y: y,
        alpha: 1,
        color: color,
        size: random(this.confMinSize, this.confMaxSize, true),
        velocity: {
          x: -1 + Math.random() * 2,
          y: -3.5 + Math.random() * 2
        }
      };
    },
    drawParticles: function() {
      var gco, i, j, particle, ref;
      this.animationOn();
      this.canvas.width = this.canvas.width;
      if (!this.particles.length) {
        return;
      }
      gco = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = "lighter";
      for (i = j = ref = this.particles.length - 1; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
        particle = this.particles[i];
        if (particle.alpha <= 0.1) {
          this.particles.splice(i, 1);
          continue;
        }
        particle.velocity.y += 0.075;
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.alpha *= 0.96;
        this.context.fillStyle = "rgba(" + particle.color.slice(4, -1) + ", " + particle.alpha + ")";
        this.context.fillRect(Math.round(particle.x - particle.size / 2), Math.round(particle.y - particle.size / 2), particle.size, particle.size);
      }
      return this.context.globalCompositeOperation = gco;
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode.particles." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3Bvd2VyLWNhbnZhcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxlQUFSOztFQUNULFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFdBQUEsRUFBYSxXQUFiO0lBQ0EsYUFBQSxFQUFlLElBRGY7SUFHQSxJQUFBLEVBQU0sU0FBQTtNQUNKLElBQUMsQ0FBQSxjQUFELENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO0lBRkksQ0FITjtJQU9BLFdBQUEsRUFBYSxTQUFBO01BQ1gsSUFBQyxDQUFBLFlBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVU7YUFDVixJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUhOLENBUGI7SUFZQSxZQUFBLEVBQWMsU0FBQTtNQUNaLG9CQUFBLENBQXFCLElBQUMsQ0FBQSxjQUF0QjthQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCO0lBRk4sQ0FaZDtJQWdCQSxXQUFBLEVBQWEsU0FBQTthQUNYLElBQUMsQ0FBQSxjQUFELEdBQWtCLHFCQUFBLENBQXNCLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixJQUFwQixDQUF0QjtJQURQLENBaEJiO0lBbUJBLGNBQUEsRUFBZ0IsU0FBQTthQUNkLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFEQyxDQW5CaEI7SUFzQkEsT0FBQSxFQUFTLFNBQUE7QUFDUCxVQUFBO01BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxjQUFELENBQUE7O1dBQ08sQ0FBRSxVQUFVLENBQUMsV0FBcEIsQ0FBZ0MsSUFBQyxD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QUE1QyxHQUFrRDtRQUN2RSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FDRSxJQUFJLENBQUMsS0FBTCxDQUFXLFFBQVEsQ0FBQyxDQUFULEdBQWEsUUFBUSxDQUFDLElBQVQsR0FBZ0IsQ0FBeEMsQ0FERixFQUVFLElBQUksQ0FBQyxLQUFMLENBQVcsUUFBUSxDQUFDLENBQVQsR0FBYSxRQUFRLENBQUMsSUFBVCxHQUFnQixDQUF4QyxDQUZGLEVBR0UsUUFBUSxDQUFDLElBSFgsRUFHaUIsUUFBUSxDQUFDLElBSDFCO0FBWkY7YUFrQkEsSUFBQyxDQUFBLE9BQU8sQ0FBQyx3QkFBVCxHQUFvQztJQTFCdkIsQ0F2RmY7SUFtSEEsU0FBQSxFQUFXLFNBQUMsTUFBRDthQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBQSxHQUFpQyxNQUFqRDtJQURTLENBbkhYOztBQUxGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxucmFuZG9tID0gcmVxdWlyZSBcImxvZGFzaC5yYW5kb21cIlxuY29sb3JIZWxwZXIgPSByZXF1aXJlIFwiLi9jb2xvci1oZWxwZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbG9ySGVscGVyOiBjb2xvckhlbHBlclxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cbiAgaW5pdDogLT5cbiAgICBAcmVzZXRQYXJ0aWNsZXMoKVxuICAgIEBhbmltYXRpb25PbigpXG5cbiAgcmVzZXRDYW52YXM6IC0+XG4gICAgQGFuaW1hdGlvbk9mZigpXG4gICAgQGVkaXRvciA9IG51bGxcbiAgICBAZWRpdG9yRWxlbWVudCA9IG51bGxcblxuICBhbmltYXRpb25PZmY6IC0+XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoQGFuaW1hdGlvbkZyYW1lKVxuICAgIEBhbmltYXRpb25GcmFtZSA9IG51bGxcblxuICBhbmltYXRpb25PbjogLT5cbiAgICBAYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgQGRyYXdQYXJ0aWNsZXMuYmluZCh0aGlzKVxuXG4gIHJlc2V0UGFydGljbGVzOiAtPlxuICAgIEBwYXJ0aWNsZXMgPSBbXVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHJlc2V0Q2FudmFzKClcbiAgICBAcmVzZXRQYXJ0aWNsZXMoKVxuICAgIEBjYW52YXM/LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQgQGNhbnZhc1xuICAgIEBjYW52YXMgPSBudWxsXG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuXG4gIHNldHVwQ2FudmFzOiAoZWRpdG9yLCBlZGl0b3JFbGVtZW50KSAtPlxuICAgIGlmIG5vdCBAY2FudmFzXG4gICAgICBAY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcImNhbnZhc1wiXG4gICAgICBAY29udGV4dCA9IEBjYW52YXMuZ2V0Q29udGV4dCBcIjJkXCJcbiAgICAgIEBjYW52YXMuY2xhc3NMaXN0LmFkZCBcInBvd2VyLW1vZGUtY2FudmFzXCJcbiAgICAgIEBpbml0Q29uZmlnU3Vic2NyaWJlcnMoKVxuXG4gICAgZWRpdG9yRWxlbWVudC5hcHBlbmRDaGlsZCBAY2FudmFzXG4gICAgQGNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiXG4gICAgQGNhbnZhcy53aWR0aCA9IGVkaXRvckVsZW1lbnQub2Zmc2V0V2lkdGhcbiAgICBAY2FudmFzLmhlaWdodCA9IGVkaXRvckVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gICAgQHNjcm9sbFZpZXcgPSBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2Nyb2xsLXZpZXdcIilcbiAgICBAZWRpdG9yRWxlbWVudCA9IGVkaXRvckVsZW1lbnRcbiAgICBAZWRpdG9yID0gZWRpdG9yXG5cbiAgICBAaW5pdCgpXG5cbiAgaW5pdENvbmZpZ1N1YnNjcmliZXJzOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAnYWN0aXZhdGUtcG93ZXItbW9kZS5wYXJ0aWNsZXMuc3Bhd25Db3VudC5taW4nLCAodmFsdWUpID0+XG4gICAgICBAY29uZk1pbkNvdW50ID0gdmFsdWVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAnYWN0aXZhdGUtcG93ZXItbW9kZS5wYXJ0aWNsZXMuc3Bhd25Db3VudC5tYXgnLCAodmFsdWUpID0+XG4gICAgICBAY29uZk1heENvdW50ID0gdmFsdWVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAnYWN0aXZhdGUtcG93ZXItbW9kZS5wYXJ0aWNsZXMudG90YWxDb3VudC5tYXgnLCAodmFsdWUpID0+XG4gICAgICBAY29uZlRvdGFsQ291bnQgPSB2YWx1ZVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdhY3RpdmF0ZS1wb3dlci1tb2RlLnBhcnRpY2xlcy5zaXplLm1pbicsICh2YWx1ZSkgPT5cbiAgICAgIEBjb25mTWluU2l6ZSA9IHZhbHVlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2FjdGl2YXRlLXBvd2VyLW1vZGUucGFydGljbGVzLnNpemUubWF4JywgKHZhbHVlKSA9PlxuICAgICAgQGNvbmZNYXhTaXplID0gdmFsdWVcblxuICBzcGF3blBhcnRpY2xlczogKHNjcmVlblBvc2l0aW9uKSAtPlxuICAgIHtsZWZ0LCB0b3B9ID0gQGNhbGN1bGF0ZVBvc2l0aW9ucyBzY3JlZW5Qb3NpdGlvblxuXG4gICAgbnVtUGFydGljbGVzID0gcmFuZG9tIEBjb25mTWluQ291bnQsIEBjb25mTWF4Q291bnRcblxuICAgIGNvbG9yID0gQGNvbG9ySGVscGVyLmdldENvbG9yIEBlZGl0b3IsIEBlZGl0b3JFbGVtZW50LCBzY3JlZW5Qb3NpdGlvblxuXG4gICAgd2hpbGUgbnVtUGFydGljbGVzLS1cbiAgICAgIG5leHRDb2xvciA9IGlmIHR5cGVvZiBjb2xvciBpcyBcIm9iamVjdFwiIHRoZW4gY29sb3IubmV4dCgpLnZhbHVlIGVsc2UgY29sb3JcblxuICAgICAgQHBhcnRpY2xlcy5zaGlmdCgpIGlmIEBwYXJ0aWNsZXMubGVuZ3RoID49IEBjb25mVG90YWxDb3VudFxuICAgICAgQHBhcnRpY2xlcy5wdXNoIEBjcmVhdGVQYXJ0aWNsZSBsZWZ0LCB0b3AsIG5leHRDb2xvclxuXG4gIGNhbGN1bGF0ZVBvc2l0aW9uczogKHNjcmVlblBvc2l0aW9uKSAtPlxuICAgIHtsZWZ0LCB0b3B9ID0gQGVkaXRvckVsZW1lbnQucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uIHNjcmVlblBvc2l0aW9uXG4gICAgbGVmdDogbGVmdCArIEBzY3JvbGxWaWV3Lm9mZnNldExlZnQgLSBAZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxMZWZ0KClcbiAgICB0b3A6IHRvcCArIEBzY3JvbGxWaWV3Lm9mZnNldFRvcCAtIEBlZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpICsgQGVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKSAvIDJcblxuICBjcmVhdGVQYXJ0aWNsZTogKHgsIHksIGNvbG9yKSAtPlxuICAgIHg6IHhcbiAgICB5OiB5XG4gICAgYWxwaGE6IDFcbiAgICBjb2xvcjogY29sb3JcbiAgICBzaXplOiByYW5kb20gQGNvbmZNaW5TaXplLCBAY29uZk1heFNpemUsIHRydWVcbiAgICB2ZWxvY2l0eTpcbiAgICAgIHg6IC0xICsgTWF0aC5yYW5kb20oKSAqIDJcbiAgICAgIHk6IC0zLjUgKyBNYXRoLnJhbmRvbSgpICogMlxuXG4gIGRyYXdQYXJ0aWNsZXM6IC0+XG4gICAgQGFuaW1hdGlvbk9uKClcbiAgICBAY2FudmFzLndpZHRoID0gQGNhbnZhcy53aWR0aFxuICAgIHJldHVybiBpZiBub3QgQHBhcnRpY2xlcy5sZW5ndGhcblxuICAgIGdjbyA9IEBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvblxuICAgIEBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwibGlnaHRlclwiXG5cbiAgICBmb3IgaSBpbiBbQHBhcnRpY2xlcy5sZW5ndGggLSAxIC4uMF1cbiAgICAgIHBhcnRpY2xlID0gQHBhcnRpY2xlc1tpXVxuICAgICAgaWYgcGFydGljbGUuYWxwaGEgPD0gMC4xXG4gICAgICAgIEBwYXJ0aWNsZXMuc3BsaWNlIGksIDFcbiAgICAgICAgY29udGludWVcblxuICAgICAgcGFydGljbGUudmVsb2NpdHkueSArPSAwLjA3NVxuICAgICAgcGFydGljbGUueCArPSBwYXJ0aWNsZS52ZWxvY2l0eS54XG4gICAgICBwYXJ0aWNsZS55ICs9IHBhcnRpY2xlLnZlbG9jaXR5LnlcbiAgICAgIHBhcnRpY2xlLmFscGhhICo9IDAuOTZcblxuICAgICAgQGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2JhKCN7cGFydGljbGUuY29sb3JbNC4uLi0xXX0sICN7cGFydGljbGUuYWxwaGF9KVwiXG4gICAgICBAY29udGV4dC5maWxsUmVjdChcbiAgICAgICAgTWF0aC5yb3VuZChwYXJ0aWNsZS54IC0gcGFydGljbGUuc2l6ZSAvIDIpXG4gICAgICAgIE1hdGgucm91bmQocGFydGljbGUueSAtIHBhcnRpY2xlLnNpemUgLyAyKVxuICAgICAgICBwYXJ0aWNsZS5zaXplLCBwYXJ0aWNsZS5zaXplXG4gICAgICApXG5cbiAgICBAY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBnY29cblxuICBnZXRDb25maWc6IChjb25maWcpIC0+XG4gICAgYXRvbS5jb25maWcuZ2V0IFwiYWN0aXZhdGUtcG93ZXItbW9kZS5wYXJ0aWNsZXMuI3tjb25maWd9XCJcbiJdfQ==
