(function() {
  var _, highlightMatches, humanize, toggleConfig;

  _ = require('underscore-plus');

  toggleConfig = function(param) {
    var value;
    value = atom.config.get(param);
    return atom.config.set(param, !value);
  };

  humanize = function(name) {
    return _.humanizeEventName(_.dasherize(name));
  };

  highlightMatches = function(context, name, matches, offsetIndex) {
    var i, lastIndex, len, matchIndex, matchedChars, unmatched;
    if (offsetIndex == null) {
      offsetIndex = 0;
    }
    lastIndex = 0;
    matchedChars = [];
    for (i = 0, len = matches.length; i < len; i++) {
      matchIndex = matches[i];
      matchIndex -= offsetIndex;
      if (matchIndex < 0) {
        continue;
      }
      unmatched = name.substring(lastIndex, matchIndex);
      if (unmatched) {
        if (matchedChars.length) {
          context.span(matchedChars.join(''), {
            "class": 'character-match'
          });
        }
        matchedChars = [];
        context.text(unmatched);
      }
      matchedChars.push(name[matchIndex]);
      lastIndex = matchIndex + 1;
    }
    if (matchedChars.length) {
      context.span(matchedChars.join(''), {
        "class": 'character-match'
      });
    }
    return context.text(name.substring(lastIndex));
  };

  module.exports = {
    toggleConfig: toggleConfig,
    humanize: humanize,
    highlightMatches: highlightMatches
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMtZXgtbW9kZS9saWIvdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUVKLFlBQUEsR0FBZSxTQUFDLEtBQUQ7QUFDYixRQUFBO0lBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixLQUFoQjtXQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixLQUFoQixFQUF1QixDQUFJLEtBQTNCO0VBRmE7O0VBSWYsUUFBQSxHQUFXLFNBQUMsSUFBRDtXQUNULENBQUMsQ0FBQyxpQkFBRixDQUFvQixDQUFDLENBQUMsU0FBRixDQUFZLElBQVosQ0FBcEI7RUFEUzs7RUFJWCxnQkFBQSxHQUFtQixTQUFDLE9BQUQsRUFBVSxJQUFWLEVBQWdCLE9BQWhCLEVBQXlCLFdBQXpCO0FBQ2pCLFFBQUE7O01BRDBDLGNBQVk7O0lBQ3RELFNBQUEsR0FBWTtJQUNaLFlBQUEsR0FBZTtBQUVmLFNBQUEseUNBQUE7O01BQ0UsVUFBQSxJQUFjO01BQ2QsSUFBWSxVQUFBLEdBQWEsQ0FBekI7QUFBQSxpQkFBQTs7TUFDQSxTQUFBLEdBQVksSUFBSSxDQUFDLFNBQUwsQ0FBZSxTQUFmLEVBQTBCLFVBQTFCO01BQ1osSUFBRyxTQUFIO1FBQ0UsSUFBZ0UsWUFBWSxDQUFDLE1BQTdFO1VBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxZQUFZLENBQUMsSUFBYixDQUFrQixFQUFsQixDQUFiLEVBQW9DO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxpQkFBUDtXQUFwQyxFQUFBOztRQUNBLFlBQUEsR0FBZTtRQUNmLE9BQU8sQ0FBQyxJQUFSLENBQWEsU0FBYixFQUhGOztNQUlBLFlBQVksQ0FBQyxJQUFiLENBQWtCLElBQUssQ0FBQSxVQUFBLENBQXZCO01BQ0EsU0FBQSxHQUFZLFVBQUEsR0FBYTtBQVQzQjtJQVdBLElBQWdFLFlBQVksQ0FBQyxNQUE3RTtNQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsWUFBWSxDQUFDLElBQWIsQ0FBa0IsRUFBbEIsQ0FBYixFQUFvQztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8saUJBQVA7T0FBcEMsRUFBQTs7V0FDQSxPQUFPLENBQUMsSUFBUixDQUFhLElBQUksQ0FBQyxTQUFMLENBQWUsU0FBZixDQUFiO0VBaEJpQjs7RUFrQm5CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsY0FBQSxZQUFEO0lBQWUsVUFBQSxRQUFmO0lBQXlCLGtCQUFBLGdCQUF6Qjs7QUE1QmpCIiwic291cmNlc0NvbnRlbnQiOlsiXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcblxudG9nZ2xlQ29uZmlnID0gKHBhcmFtKSAtPlxuICB2YWx1ZSA9IGF0b20uY29uZmlnLmdldChwYXJhbSlcbiAgYXRvbS5jb25maWcuc2V0KHBhcmFtLCBub3QgdmFsdWUpXG5cbmh1bWFuaXplID0gKG5hbWUpIC0+XG4gIF8uaHVtYW5pemVFdmVudE5hbWUoXy5kYXNoZXJpemUobmFtZSkpXG5cbiMgQ29waWVkICYgbW9kaWZpZWQgZnJvbSBmdXp6eS1maW5kZXIncyBjb2RlLlxuaGlnaGxpZ2h0TWF0Y2hlcyA9IChjb250ZXh0LCBuYW1lLCBtYXRjaGVzLCBvZmZzZXRJbmRleD0wKSAtPlxuICBsYXN0SW5kZXggPSAwXG4gIG1hdGNoZWRDaGFycyA9IFtdICMgQnVpbGQgdXAgYSBzZXQgb2YgbWF0Y2hlZCBjaGFycyB0byBiZSBtb3JlIHNlbWFudGljXG5cbiAgZm9yIG1hdGNoSW5kZXggaW4gbWF0Y2hlc1xuICAgIG1hdGNoSW5kZXggLT0gb2Zmc2V0SW5kZXhcbiAgICBjb250aW51ZSBpZiBtYXRjaEluZGV4IDwgMCAjIElmIG1hcmtpbmcgdXAgdGhlIGJhc2VuYW1lLCBvbWl0IG5hbWUgbWF0Y2hlc1xuICAgIHVubWF0Y2hlZCA9IG5hbWUuc3Vic3RyaW5nKGxhc3RJbmRleCwgbWF0Y2hJbmRleClcbiAgICBpZiB1bm1hdGNoZWRcbiAgICAgIGNvbnRleHQuc3BhbiBtYXRjaGVkQ2hhcnMuam9pbignJyksIGNsYXNzOiAnY2hhcmFjdGVyLW1hdGNoJyBpZiBtYXRjaGVkQ2hhcnMubGVuZ3RoXG4gICAgICBtYXRjaGVkQ2hhcnMgPSBbXVxuICAgICAgY29udGV4dC50ZXh0IHVubWF0Y2hlZFxuICAgIG1hdGNoZWRDaGFycy5wdXNoKG5hbWVbbWF0Y2hJbmRleF0pXG4gICAgbGFzdEluZGV4ID0gbWF0Y2hJbmRleCArIDFcblxuICBjb250ZXh0LnNwYW4gbWF0Y2hlZENoYXJzLmpvaW4oJycpLCBjbGFzczogJ2NoYXJhY3Rlci1tYXRjaCcgaWYgbWF0Y2hlZENoYXJzLmxlbmd0aFxuICBjb250ZXh0LnRleHQgbmFtZS5zdWJzdHJpbmcobGFzdEluZGV4KSAjIFJlbWFpbmluZyBjaGFyYWN0ZXJzIGFyZSBwbGFpbiB0ZXh0XG5cbm1vZHVsZS5leHBvcnRzID0ge3RvZ2dsZUNvbmZpZywgaHVtYW5pemUsIGhpZ2hsaWdodE1hdGNoZXN9XG4iXX0=
