(function() {
  var OutputView, create, getView, view;

  OutputView = require('./views/output-view');

  view = null;

  getView = function() {
    if (view === null) {
      view = new OutputView;
      atom.workspace.addBottomPanel({
        item: view
      });
      view.hide();
    }
    return view;
  };

  create = function() {
    if (view != null) {
      view.reset();
    }
    return getView();
  };

  module.exports = {
    create: create,
    getView: getView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9vdXRwdXQtdmlldy1tYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUjs7RUFFYixJQUFBLEdBQU87O0VBRVAsT0FBQSxHQUFVLFNBQUE7SUFDUixJQUFHLElBQUEsS0FBUSxJQUFYO01BQ0UsSUFBQSxHQUFPLElBQUk7TUFDWCxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEI7UUFBQSxJQUFBLEVBQU0sSUFBTjtPQUE5QjtNQUNBLElBQUksQ0FBQyxJQUFMLENBQUEsRUFIRjs7V0FJQTtFQUxROztFQU9WLE1BQUEsR0FBUyxTQUFBOztNQUNQLElBQUksQ0FBRSxLQUFOLENBQUE7O1dBQ0EsT0FBQSxDQUFBO0VBRk87O0VBSVQsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFBQyxRQUFBLE1BQUQ7SUFBUyxTQUFBLE9BQVQ7O0FBZmpCIiwic291cmNlc0NvbnRlbnQiOlsiT3V0cHV0VmlldyA9IHJlcXVpcmUgJy4vdmlld3Mvb3V0cHV0LXZpZXcnXG5cbnZpZXcgPSBudWxsXG5cbmdldFZpZXcgPSAtPlxuICBpZiB2aWV3IGlzIG51bGxcbiAgICB2aWV3ID0gbmV3IE91dHB1dFZpZXdcbiAgICBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbChpdGVtOiB2aWV3KVxuICAgIHZpZXcuaGlkZSgpXG4gIHZpZXdcblxuY3JlYXRlID0gLT5cbiAgdmlldz8ucmVzZXQoKVxuICBnZXRWaWV3KClcblxubW9kdWxlLmV4cG9ydHMgPSB7Y3JlYXRlLCBnZXRWaWV3fVxuIl19
