(function() {
  var $, AnsiToHtml, OutputView, ScrollView, ansiToHtml, defaultMessage, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  AnsiToHtml = require('ansi-to-html');

  ansiToHtml = new AnsiToHtml();

  ref = require('atom-space-pen-views'), $ = ref.$, ScrollView = ref.ScrollView;

  defaultMessage = 'Nothing new to show';

  OutputView = (function(superClass) {
    extend(OutputView, superClass);

    function OutputView() {
      return OutputView.__super__.constructor.apply(this, arguments);
    }

    OutputView.content = function() {
      return this.div({
        "class": 'git-plus info-view'
      }, (function(_this) {
        return function() {
          return _this.pre({
            "class": 'output'
          }, defaultMessage);
        };
      })(this));
    };

    OutputView.prototype.html = defaultMessage;

    OutputView.prototype.initialize = function() {
      return OutputView.__super__.initialize.apply(this, arguments);
    };

    OutputView.prototype.reset = function() {
      return this.html = defaultMessage;
    };

    OutputView.prototype.setContent = function(content) {
      this.html = ansiToHtml.toHtml(content);
      return this;
    };

    OutputView.prototype.finish = function() {
      this.find(".output").html(this.html);
      this.show();
      return this.timeout = setTimeout((function(_this) {
        return function() {
          return _this.hide();
        };
      })(this), atom.config.get('git-plus.general.messageTimeout') * 1000);
    };

    OutputView.prototype.toggle = function() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      return $.fn.toggle.call(this);
    };

    return OutputView;

  })(ScrollView);

  module.exports = OutputView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9vdXRwdXQtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNFQUFBO0lBQUE7OztFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFBOztFQUNqQixNQUFrQixPQUFBLENBQVEsc0JBQVIsQ0FBbEIsRUFBQyxTQUFELEVBQUk7O0VBRUosY0FBQSxHQUFpQjs7RUFFWDs7Ozs7OztJQUNKLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG9CQUFQO09BQUwsRUFBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNoQyxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxRQUFQO1dBQUwsRUFBc0IsY0FBdEI7UUFEZ0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDO0lBRFE7O3lCQUlWLElBQUEsR0FBTTs7eUJBRU4sVUFBQSxHQUFZLFNBQUE7YUFBRyw0Q0FBQSxTQUFBO0lBQUg7O3lCQUVaLEtBQUEsR0FBTyxTQUFBO2FBQUcsSUFBQyxDQUFBLElBQUQsR0FBUTtJQUFYOzt5QkFFUCxVQUFBLEdBQVksU0FBQyxPQUFEO01BQ1YsSUFBQyxDQUFBLElBQUQsR0FBUSxVQUFVLENBQUMsTUFBWCxDQUFrQixPQUFsQjthQUNSO0lBRlU7O3lCQUlaLE1BQUEsR0FBUSxTQUFBO01BQ04sSUFBQyxDQUFBLElBQUQsQ0FBTSxTQUFOLENBQWdCLENBQUMsSUFBakIsQ0FBc0IsSUFBQyxDQUFBLElBQXZCO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDcEIsS0FBQyxDQUFBLElBQUQsQ0FBQTtRQURvQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUVULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQ0FBaEIsQ0FBQSxHQUFxRCxJQUY1QztJQUhMOzt5QkFPUixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQXlCLElBQUMsQ0FBQSxPQUExQjtRQUFBLFlBQUEsQ0FBYSxJQUFDLENBQUEsT0FBZCxFQUFBOzthQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBaUIsSUFBakI7SUFGTTs7OztLQXRCZTs7RUEwQnpCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBaENqQiIsInNvdXJjZXNDb250ZW50IjpbIkFuc2lUb0h0bWwgPSByZXF1aXJlICdhbnNpLXRvLWh0bWwnXG5hbnNpVG9IdG1sID0gbmV3IEFuc2lUb0h0bWwoKVxueyQsIFNjcm9sbFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmRlZmF1bHRNZXNzYWdlID0gJ05vdGhpbmcgbmV3IHRvIHNob3cnXG5cbmNsYXNzIE91dHB1dFZpZXcgZXh0ZW5kcyBTY3JvbGxWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICdnaXQtcGx1cyBpbmZvLXZpZXcnLCA9PlxuICAgICAgQHByZSBjbGFzczogJ291dHB1dCcsIGRlZmF1bHRNZXNzYWdlXG5cbiAgaHRtbDogZGVmYXVsdE1lc3NhZ2VcblxuICBpbml0aWFsaXplOiAtPiBzdXBlclxuXG4gIHJlc2V0OiAtPiBAaHRtbCA9IGRlZmF1bHRNZXNzYWdlXG5cbiAgc2V0Q29udGVudDogKGNvbnRlbnQpIC0+XG4gICAgQGh0bWwgPSBhbnNpVG9IdG1sLnRvSHRtbCBjb250ZW50XG4gICAgdGhpc1xuXG4gIGZpbmlzaDogLT5cbiAgICBAZmluZChcIi5vdXRwdXRcIikuaHRtbChAaHRtbClcbiAgICBAc2hvdygpXG4gICAgQHRpbWVvdXQgPSBzZXRUaW1lb3V0ID0+XG4gICAgICBAaGlkZSgpXG4gICAgLCBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwubWVzc2FnZVRpbWVvdXQnKSAqIDEwMDBcblxuICB0b2dnbGU6IC0+XG4gICAgY2xlYXJUaW1lb3V0IEB0aW1lb3V0IGlmIEB0aW1lb3V0XG4gICAgJC5mbi50b2dnbGUuY2FsbCh0aGlzKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE91dHB1dFZpZXdcbiJdfQ==
