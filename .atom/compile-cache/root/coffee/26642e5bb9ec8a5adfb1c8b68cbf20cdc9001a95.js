(function() {
  var ContextMenu;

  ContextMenu = (function() {
    function ContextMenu() {}

    ContextMenu.localize = function(defC) {
      this.updateContextMenu(defC);
      return atom.menu.update();
    };

    ContextMenu.updateContextMenu = function(defC) {
      var i, item, itemSet, label, len, ref, results, set;
      ref = atom.contextMenu.itemSets;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        itemSet = ref[i];
        set = defC.Context[itemSet.selector];
        if (!set) {
          continue;
        }
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = itemSet.items;
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            item = ref1[j];
            if (item.type === "separator") {
              continue;
            }
            label = set[item.command];
            if (label != null) {
              results1.push(item.label = label);
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      }
      return results;
    };

    return ContextMenu;

  })();

  module.exports = ContextMenu;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLW1lbnUvbGliL2NvbnRleHQtbWVudS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNOzs7SUFFSixXQUFDLENBQUEsUUFBRCxHQUFXLFNBQUMsSUFBRDtNQUNULElBQUMsQ0FBQSxpQkFBRCxDQUFtQixJQUFuQjthQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBVixDQUFBO0lBRlM7O0lBSVgsV0FBQyxDQUFBLGlCQUFELEdBQW9CLFNBQUMsSUFBRDtBQUNsQixVQUFBO0FBQUE7QUFBQTtXQUFBLHFDQUFBOztRQUNFLEdBQUEsR0FBTSxJQUFJLENBQUMsT0FBUSxDQUFBLE9BQU8sQ0FBQyxRQUFSO1FBQ25CLElBQVksQ0FBSSxHQUFoQjtBQUFBLG1CQUFBOzs7O0FBQ0E7QUFBQTtlQUFBLHdDQUFBOztZQUNFLElBQVksSUFBSSxDQUFDLElBQUwsS0FBYSxXQUF6QjtBQUFBLHVCQUFBOztZQUNBLEtBQUEsR0FBUSxHQUFJLENBQUEsSUFBSSxDQUFDLE9BQUw7WUFDWixJQUFzQixhQUF0Qjs0QkFBQSxJQUFJLENBQUMsS0FBTCxHQUFhLE9BQWI7YUFBQSxNQUFBO29DQUFBOztBQUhGOzs7QUFIRjs7SUFEa0I7Ozs7OztFQVN0QixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQWZqQiIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIENvbnRleHRNZW51XG5cbiAgQGxvY2FsaXplOiAoZGVmQykgLT5cbiAgICBAdXBkYXRlQ29udGV4dE1lbnUoZGVmQylcbiAgICBhdG9tLm1lbnUudXBkYXRlKClcblxuICBAdXBkYXRlQ29udGV4dE1lbnU6IChkZWZDKSAtPlxuICAgIGZvciBpdGVtU2V0IGluIGF0b20uY29udGV4dE1lbnUuaXRlbVNldHNcbiAgICAgIHNldCA9IGRlZkMuQ29udGV4dFtpdGVtU2V0LnNlbGVjdG9yXVxuICAgICAgY29udGludWUgaWYgbm90IHNldFxuICAgICAgZm9yIGl0ZW0gaW4gaXRlbVNldC5pdGVtc1xuICAgICAgICBjb250aW51ZSBpZiBpdGVtLnR5cGUgaXMgXCJzZXBhcmF0b3JcIlxuICAgICAgICBsYWJlbCA9IHNldFtpdGVtLmNvbW1hbmRdXG4gICAgICAgIGl0ZW0ubGFiZWwgPSBsYWJlbCBpZiBsYWJlbD9cblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0TWVudVxuIl19
