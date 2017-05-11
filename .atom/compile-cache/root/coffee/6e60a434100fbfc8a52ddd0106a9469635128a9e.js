(function() {
  var highlightSearch, indentGuide, lineNumbers, moveToLine, moveToLineAndColumn, moveToLineByPercent, moveToRelativeLine, nohlsearch, normalCommands, numberCommands, q, qall, showInvisible, softWrap, split, toggleCommands, toggleConfig, vsplit, w, wall, wq, wqall, x, xall;

  toggleConfig = require('./utils').toggleConfig;

  w = function(arg) {
    var editor;
    editor = (arg != null ? arg : {}).editor;
    if (editor != null ? editor.getPath() : void 0) {
      return editor.save();
    } else {
      return atom.workspace.saveActivePaneItem();
    }
  };

  q = function() {
    return atom.workspace.closeActivePaneItemOrEmptyPaneOrWindow();
  };

  wq = x = function() {
    w();
    return q();
  };

  qall = function() {
    var i, item, len, ref, results;
    ref = atom.workspace.getPaneItems();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      results.push(q());
    }
    return results;
  };

  wall = function() {
    var editor, i, len, ref, results;
    ref = atom.workspace.getTextEditors();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      editor = ref[i];
      if (editor.isModified()) {
        results.push(w({
          editor: editor
        }));
      }
    }
    return results;
  };

  wqall = xall = function() {
    var i, item, len, ref, results;
    ref = atom.workspace.getPaneItems();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      results.push(wq());
    }
    return results;
  };

  split = function(arg) {
    var editor, editorElement;
    editor = arg.editor, editorElement = arg.editorElement;
    return atom.commands.dispatch(editorElement, 'pane:split-down-and-copy-active-item');
  };

  vsplit = function(arg) {
    var editor, editorElement;
    editor = arg.editor, editorElement = arg.editorElement;
    return atom.commands.dispatch(editorElement, 'pane:split-right-and-copy-active-item');
  };

  nohlsearch = function(arg) {
    var globalState;
    globalState = arg.globalState;
    return globalState.set('highlightSearchPattern', null);
  };

  showInvisible = function() {
    return toggleConfig('editor.showInvisibles');
  };

  highlightSearch = function() {
    return toggleConfig('vim-mode-plus.highlightSearch');
  };

  softWrap = function(arg) {
    var editorElement;
    editorElement = arg.editorElement;
    return atom.commands.dispatch(editorElement, 'editor:toggle-soft-wrap');
  };

  indentGuide = function(arg) {
    var editorElement;
    editorElement = arg.editorElement;
    return atom.commands.dispatch(editorElement, 'editor:toggle-indent-guide');
  };

  lineNumbers = function(arg) {
    var editorElement;
    editorElement = arg.editorElement;
    return atom.commands.dispatch(editorElement, 'editor:toggle-line-numbers');
  };

  moveToLine = function(vimState, arg) {
    var row;
    row = arg.row;
    vimState.setCount(row);
    return vimState.operationStack.run('MoveToFirstLine');
  };

  moveToLineAndColumn = function(vimState, arg) {
    var column, row;
    row = arg.row, column = arg.column;
    vimState.setCount(row);
    return vimState.operationStack.run('MoveToLineAndColumn', {
      column: column
    });
  };

  moveToLineByPercent = function(vimState, arg) {
    var percent;
    percent = arg.percent;
    vimState.setCount(percent);
    return vimState.operationStack.run('MoveToLineByPercent');
  };

  moveToRelativeLine = function(vimState, arg) {
    var offset;
    offset = arg.offset;
    vimState.setCount(offset + 1);
    return vimState.operationStack.run('MoveToRelativeLine');
  };

  normalCommands = {
    w: w,
    wq: wq,
    x: x,
    wall: wall,
    wqall: wqall,
    xall: xall,
    q: q,
    qall: qall,
    split: split,
    vsplit: vsplit,
    nohlsearch: nohlsearch
  };

  toggleCommands = {
    showInvisible: showInvisible,
    softWrap: softWrap,
    indentGuide: indentGuide,
    lineNumbers: lineNumbers,
    highlightSearch: highlightSearch
  };

  numberCommands = {
    moveToLine: moveToLine,
    moveToLineAndColumn: moveToLineAndColumn,
    moveToLineByPercent: moveToLineByPercent,
    moveToRelativeLine: moveToRelativeLine
  };

  module.exports = {
    normalCommands: normalCommands,
    toggleCommands: toggleCommands,
    numberCommands: numberCommands
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMtZXgtbW9kZS9saWIvY29tbWFuZHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxlQUFnQixPQUFBLENBQVEsU0FBUjs7RUFJakIsQ0FBQSxHQUFJLFNBQUMsR0FBRDtBQUNGLFFBQUE7SUFESSx3QkFBRCxNQUFTO0lBQ1oscUJBQUcsTUFBTSxDQUFFLE9BQVIsQ0FBQSxVQUFIO2FBQ0UsTUFBTSxDQUFDLElBQVAsQ0FBQSxFQURGO0tBQUEsTUFBQTthQUdFLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBQSxFQUhGOztFQURFOztFQU1KLENBQUEsR0FBSSxTQUFBO1dBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxzQ0FBZixDQUFBO0VBQUg7O0VBQ0osRUFBQSxHQUFLLENBQUEsR0FBSSxTQUFBO0lBQUcsQ0FBQSxDQUFBO1dBQUssQ0FBQSxDQUFBO0VBQVI7O0VBQ1QsSUFBQSxHQUFPLFNBQUE7QUFBRyxRQUFBO0FBQUE7QUFBQTtTQUFBLHFDQUFBOzttQkFBQSxDQUFBLENBQUE7QUFBQTs7RUFBSDs7RUFDUCxJQUFBLEdBQU8sU0FBQTtBQUFHLFFBQUE7QUFBQTtBQUFBO1NBQUEscUNBQUE7O1VBQStELE1BQU0sQ0FBQyxVQUFQLENBQUE7cUJBQS9ELENBQUEsQ0FBRTtVQUFDLFFBQUEsTUFBRDtTQUFGOztBQUFBOztFQUFIOztFQUNQLEtBQUEsR0FBUSxJQUFBLEdBQU8sU0FBQTtBQUFHLFFBQUE7QUFBQTtBQUFBO1NBQUEscUNBQUE7O21CQUFBLEVBQUEsQ0FBQTtBQUFBOztFQUFIOztFQUNmLEtBQUEsR0FBUSxTQUFDLEdBQUQ7QUFBNkIsUUFBQTtJQUEzQixxQkFBUTtXQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0Msc0NBQXRDO0VBQTdCOztFQUNSLE1BQUEsR0FBUyxTQUFDLEdBQUQ7QUFBNkIsUUFBQTtJQUEzQixxQkFBUTtXQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsdUNBQXRDO0VBQTdCOztFQUNULFVBQUEsR0FBYSxTQUFDLEdBQUQ7QUFBbUIsUUFBQTtJQUFqQixjQUFEO1dBQWtCLFdBQVcsQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixFQUEwQyxJQUExQztFQUFuQjs7RUFJYixhQUFBLEdBQWdCLFNBQUE7V0FBRyxZQUFBLENBQWEsdUJBQWI7RUFBSDs7RUFDaEIsZUFBQSxHQUFrQixTQUFBO1dBQUcsWUFBQSxDQUFhLCtCQUFiO0VBQUg7O0VBQ2xCLFFBQUEsR0FBVyxTQUFDLEdBQUQ7QUFBcUIsUUFBQTtJQUFuQixnQkFBRDtXQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MseUJBQXRDO0VBQXJCOztFQUNYLFdBQUEsR0FBYyxTQUFDLEdBQUQ7QUFBcUIsUUFBQTtJQUFuQixnQkFBRDtXQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsNEJBQXRDO0VBQXJCOztFQUNkLFdBQUEsR0FBYyxTQUFDLEdBQUQ7QUFBcUIsUUFBQTtJQUFuQixnQkFBRDtXQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsNEJBQXRDO0VBQXJCOztFQUlkLFVBQUEsR0FBYSxTQUFDLFFBQUQsRUFBVyxHQUFYO0FBQ1gsUUFBQTtJQUR1QixNQUFEO0lBQ3RCLFFBQVEsQ0FBQyxRQUFULENBQWtCLEdBQWxCO1dBQ0EsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUF4QixDQUE0QixpQkFBNUI7RUFGVzs7RUFJYixtQkFBQSxHQUFzQixTQUFDLFFBQUQsRUFBVyxHQUFYO0FBQ3BCLFFBQUE7SUFEZ0MsZUFBSztJQUNyQyxRQUFRLENBQUMsUUFBVCxDQUFrQixHQUFsQjtXQUNBLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBeEIsQ0FBNEIscUJBQTVCLEVBQW1EO01BQUMsUUFBQSxNQUFEO0tBQW5EO0VBRm9COztFQUl0QixtQkFBQSxHQUFzQixTQUFDLFFBQUQsRUFBVyxHQUFYO0FBQ3BCLFFBQUE7SUFEZ0MsVUFBRDtJQUMvQixRQUFRLENBQUMsUUFBVCxDQUFrQixPQUFsQjtXQUNBLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBeEIsQ0FBNEIscUJBQTVCO0VBRm9COztFQUl0QixrQkFBQSxHQUFxQixTQUFDLFFBQUQsRUFBVyxHQUFYO0FBQ25CLFFBQUE7SUFEK0IsU0FBRDtJQUM5QixRQUFRLENBQUMsUUFBVCxDQUFrQixNQUFBLEdBQVMsQ0FBM0I7V0FDQSxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQXhCLENBQTRCLG9CQUE1QjtFQUZtQjs7RUFJckIsY0FBQSxHQUFpQjtJQUNmLEdBQUEsQ0FEZTtJQUVmLElBQUEsRUFGZTtJQUVYLEdBQUEsQ0FGVztJQUdmLE1BQUEsSUFIZTtJQUlmLE9BQUEsS0FKZTtJQUlSLE1BQUEsSUFKUTtJQUtmLEdBQUEsQ0FMZTtJQU1mLE1BQUEsSUFOZTtJQU9mLE9BQUEsS0FQZTtJQU9SLFFBQUEsTUFQUTtJQVFmLFlBQUEsVUFSZTs7O0VBV2pCLGNBQUEsR0FBaUI7SUFDZixlQUFBLGFBRGU7SUFFZixVQUFBLFFBRmU7SUFHZixhQUFBLFdBSGU7SUFJZixhQUFBLFdBSmU7SUFLZixpQkFBQSxlQUxlOzs7RUFRakIsY0FBQSxHQUFpQjtJQUNmLFlBQUEsVUFEZTtJQUVmLHFCQUFBLG1CQUZlO0lBR2YscUJBQUEsbUJBSGU7SUFJZixvQkFBQSxrQkFKZTs7O0VBT2pCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsZ0JBQUEsY0FBRDtJQUFpQixnQkFBQSxjQUFqQjtJQUFpQyxnQkFBQSxjQUFqQzs7QUF2RWpCIiwic291cmNlc0NvbnRlbnQiOlsie3RvZ2dsZUNvbmZpZ30gPSByZXF1aXJlICcuL3V0aWxzJ1xuXG4jIGV4IGNvbW1hbmRcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudyA9ICh7ZWRpdG9yfT17fSkgLT5cbiAgaWYgZWRpdG9yPy5nZXRQYXRoKClcbiAgICBlZGl0b3Iuc2F2ZSgpXG4gIGVsc2VcbiAgICBhdG9tLndvcmtzcGFjZS5zYXZlQWN0aXZlUGFuZUl0ZW0oKVxuXG5xID0gLT4gYXRvbS53b3Jrc3BhY2UuY2xvc2VBY3RpdmVQYW5lSXRlbU9yRW1wdHlQYW5lT3JXaW5kb3coKVxud3EgPSB4ID0gLT4gdygpOyBxKClcbnFhbGwgPSAtPiBxKCkgZm9yIGl0ZW0gaW4gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKClcbndhbGwgPSAtPiB3KHtlZGl0b3J9KSBmb3IgZWRpdG9yIGluIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkgd2hlbiBlZGl0b3IuaXNNb2RpZmllZCgpXG53cWFsbCA9IHhhbGwgPSAtPiB3cSgpIGZvciBpdGVtIGluIGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpXG5zcGxpdCA9ICh7ZWRpdG9yLCBlZGl0b3JFbGVtZW50fSkgLT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCAncGFuZTpzcGxpdC1kb3duLWFuZC1jb3B5LWFjdGl2ZS1pdGVtJylcbnZzcGxpdCA9ICh7ZWRpdG9yLCBlZGl0b3JFbGVtZW50fSkgLT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCAncGFuZTpzcGxpdC1yaWdodC1hbmQtY29weS1hY3RpdmUtaXRlbScpXG5ub2hsc2VhcmNoID0gKHtnbG9iYWxTdGF0ZX0pIC0+IGdsb2JhbFN0YXRlLnNldCgnaGlnaGxpZ2h0U2VhcmNoUGF0dGVybicsIG51bGwpXG5cbiMgQ29uZmlndXJhdGlvbiBzd2l0Y2hcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2hvd0ludmlzaWJsZSA9IC0+IHRvZ2dsZUNvbmZpZygnZWRpdG9yLnNob3dJbnZpc2libGVzJylcbmhpZ2hsaWdodFNlYXJjaCA9IC0+IHRvZ2dsZUNvbmZpZygndmltLW1vZGUtcGx1cy5oaWdobGlnaHRTZWFyY2gnKVxuc29mdFdyYXAgPSAoe2VkaXRvckVsZW1lbnR9KSAtPiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsICdlZGl0b3I6dG9nZ2xlLXNvZnQtd3JhcCcpXG5pbmRlbnRHdWlkZSA9ICh7ZWRpdG9yRWxlbWVudH0pIC0+IGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgJ2VkaXRvcjp0b2dnbGUtaW5kZW50LWd1aWRlJylcbmxpbmVOdW1iZXJzID0gKHtlZGl0b3JFbGVtZW50fSkgLT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCAnZWRpdG9yOnRvZ2dsZS1saW5lLW51bWJlcnMnKVxuXG4jIFdoZW4gbnVtYmVyIHdhcyB0eXBlZFxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb3ZlVG9MaW5lID0gKHZpbVN0YXRlLCB7cm93fSkgLT5cbiAgdmltU3RhdGUuc2V0Q291bnQocm93KVxuICB2aW1TdGF0ZS5vcGVyYXRpb25TdGFjay5ydW4oJ01vdmVUb0ZpcnN0TGluZScpXG5cbm1vdmVUb0xpbmVBbmRDb2x1bW4gPSAodmltU3RhdGUsIHtyb3csIGNvbHVtbn0pIC0+XG4gIHZpbVN0YXRlLnNldENvdW50KHJvdylcbiAgdmltU3RhdGUub3BlcmF0aW9uU3RhY2sucnVuKCdNb3ZlVG9MaW5lQW5kQ29sdW1uJywge2NvbHVtbn0pXG5cbm1vdmVUb0xpbmVCeVBlcmNlbnQgPSAodmltU3RhdGUsIHtwZXJjZW50fSkgLT5cbiAgdmltU3RhdGUuc2V0Q291bnQocGVyY2VudClcbiAgdmltU3RhdGUub3BlcmF0aW9uU3RhY2sucnVuKCdNb3ZlVG9MaW5lQnlQZXJjZW50JylcblxubW92ZVRvUmVsYXRpdmVMaW5lID0gKHZpbVN0YXRlLCB7b2Zmc2V0fSkgLT5cbiAgdmltU3RhdGUuc2V0Q291bnQob2Zmc2V0ICsgMSlcbiAgdmltU3RhdGUub3BlcmF0aW9uU3RhY2sucnVuKCdNb3ZlVG9SZWxhdGl2ZUxpbmUnKVxuXG5ub3JtYWxDb21tYW5kcyA9IHtcbiAgd1xuICB3cSwgeFxuICB3YWxsXG4gIHdxYWxsLCB4YWxsXG4gIHFcbiAgcWFsbFxuICBzcGxpdCwgdnNwbGl0XG4gIG5vaGxzZWFyY2hcbn1cblxudG9nZ2xlQ29tbWFuZHMgPSB7XG4gIHNob3dJbnZpc2libGVcbiAgc29mdFdyYXBcbiAgaW5kZW50R3VpZGVcbiAgbGluZU51bWJlcnNcbiAgaGlnaGxpZ2h0U2VhcmNoXG59XG5cbm51bWJlckNvbW1hbmRzID0ge1xuICBtb3ZlVG9MaW5lXG4gIG1vdmVUb0xpbmVBbmRDb2x1bW5cbiAgbW92ZVRvTGluZUJ5UGVyY2VudFxuICBtb3ZlVG9SZWxhdGl2ZUxpbmVcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7bm9ybWFsQ29tbWFuZHMsIHRvZ2dsZUNvbW1hbmRzLCBudW1iZXJDb21tYW5kc31cbiJdfQ==
