(function() {
  var $, $$, SelectListView, View, _, fuzzaldrin, highlightMatches, humanize, ref, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  ref = require('atom-space-pen-views'), SelectListView = ref.SelectListView, $ = ref.$, $$ = ref.$$;

  fuzzaldrin = require('fuzzaldrin');

  ref1 = require('./utils'), humanize = ref1.humanize, highlightMatches = ref1.highlightMatches;

  module.exports = View = (function(superClass) {
    extend(View, superClass);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.initialInput = null;

    View.prototype.itemsCache = null;

    View.prototype.schedulePopulateList = function() {
      if (this.initialInput) {
        if (this.isOnDom()) {
          this.populateList();
        }
        return this.initialInput = false;
      } else {
        return View.__super__.schedulePopulateList.apply(this, arguments);
      }
    };

    View.prototype.initialize = function() {
      this.commands = require('./commands');
      this.addClass('vim-mode-plus-ex-mode');
      return View.__super__.initialize.apply(this, arguments);
    };

    View.prototype.getFilterKey = function() {
      return 'displayName';
    };

    View.prototype.cancelled = function() {
      return this.hide();
    };

    View.prototype.toggle = function(vimState, commandKind) {
      var ref2, ref3;
      this.vimState = vimState;
      if ((ref2 = this.panel) != null ? ref2.isVisible() : void 0) {
        return this.cancel();
      } else {
        ref3 = this.vimState, this.editorElement = ref3.editorElement, this.editor = ref3.editor;
        return this.show(commandKind);
      }
    };

    View.prototype.show = function(commandKind) {
      this.initialInput = true;
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.setItems(this.getItemsForKind(commandKind));
      return this.focusFilterEditor();
    };

    View.prototype.getItemsForKind = function(kind) {
      var commands, items;
      if (this.itemsCache == null) {
        this.itemsCache = {};
      }
      if (kind in this.itemsCache) {
        return this.itemsCache[kind];
      } else {
        commands = _.keys(this.commands[kind]);
        items = commands.map((function(_this) {
          return function(name) {
            return _this.getItem(kind, name);
          };
        })(this));
        this.itemsCache[kind] = items;
        return items;
      }
    };

    View.prototype.getItem = function(kind, name) {
      var displayName;
      if (kind === 'toggleCommands' || kind === 'numberCommands') {
        displayName = humanize(name);
      } else {
        displayName = name;
      }
      return {
        name: name,
        kind: kind,
        displayName: displayName
      };
    };

    View.prototype.hide = function() {
      var ref2;
      return (ref2 = this.panel) != null ? ref2.hide() : void 0;
    };

    View.prototype.getFallBackItemsForQuery = function(query) {
      var filterQuery, item, items;
      items = [];
      if (/^!/.test(query)) {
        filterQuery = query.slice(1);
        items = this.getItemsForKind('toggleCommands');
        items = fuzzaldrin.filter(items, filterQuery, {
          key: this.getFilterKey()
        });
      } else if (/^[+-\d]/.test(query)) {
        if (item = this.getNumberCommandItem(query)) {
          items.push(item);
        }
      }
      return items;
    };

    View.prototype.getNumberCommandItem = function(query) {
      var item, match, name, options;
      if (match = query.match(/^(\d+)+$/)) {
        name = 'moveToLine';
        options = {
          row: Number(match[1])
        };
      } else if (match = query.match(/^(\d+)%$/)) {
        name = 'moveToLineByPercent';
        options = {
          percent: Number(match[1])
        };
      } else if (match = query.match(/^(\d+):(\d+)$/)) {
        name = 'moveToLineAndColumn';
        options = {
          row: Number(match[1]),
          column: Number(match[2])
        };
      } else if (match = query.match(/^([+-]\d+)$/)) {
        name = 'moveToRelativeLine';
        options = {
          offset: Number(match[1])
        };
      }
      if (name != null) {
        item = this.getItem('numberCommands', name);
        item.options = options;
        return item;
      }
    };

    View.prototype.getEmptyMessage = function(itemCount, filteredItemCount) {
      this.setError(null);
      this.setFallbackItems(this.getFallBackItemsForQuery(this.getFilterQuery()));
      return this.selectItemView(this.list.find('li:first'));
    };

    View.prototype.setFallbackItems = function(items) {
      var i, item, itemView, len, results;
      results = [];
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        itemView = $(this.viewForItem(item));
        itemView.data('select-list-item', item);
        results.push(this.list.append(itemView));
      }
      return results;
    };

    View.prototype.viewForItem = function(arg) {
      var displayName, filterQuery, matches;
      displayName = arg.displayName;
      filterQuery = this.getFilterQuery();
      if (filterQuery.startsWith('!')) {
        filterQuery = filterQuery.slice(1);
      }
      matches = fuzzaldrin.match(displayName, filterQuery);
      return $$(function() {
        return this.li({
          "class": 'event',
          'data-event-name': name
        }, (function(_this) {
          return function() {
            return _this.span({
              title: displayName
            }, function() {
              return highlightMatches(_this, displayName, matches, 0);
            });
          };
        })(this));
      });
    };

    View.prototype.confirmed = function(arg) {
      var kind, name, options;
      kind = arg.kind, name = arg.name, options = arg.options;
      this.cancel();
      return this.commands[kind][name](this.vimState, options);
    };

    return View;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpeWFtYWd1Y2hpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMtZXgtbW9kZS9saWIvdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGlGQUFBO0lBQUE7OztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osTUFBMEIsT0FBQSxDQUFRLHNCQUFSLENBQTFCLEVBQUMsbUNBQUQsRUFBaUIsU0FBakIsRUFBb0I7O0VBQ3BCLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7RUFDYixPQUErQixPQUFBLENBQVEsU0FBUixDQUEvQixFQUFDLHdCQUFELEVBQVc7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OzttQkFDSixZQUFBLEdBQWM7O21CQUNkLFVBQUEsR0FBWTs7bUJBR1osb0JBQUEsR0FBc0IsU0FBQTtNQUNwQixJQUFHLElBQUMsQ0FBQSxZQUFKO1FBQ0UsSUFBbUIsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFuQjtVQUFBLElBQUMsQ0FBQSxZQUFELENBQUEsRUFBQTs7ZUFDQSxJQUFDLENBQUEsWUFBRCxHQUFnQixNQUZsQjtPQUFBLE1BQUE7ZUFJRSxnREFBQSxTQUFBLEVBSkY7O0lBRG9COzttQkFPdEIsVUFBQSxHQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsUUFBRCxHQUFZLE9BQUEsQ0FBUSxZQUFSO01BQ1osSUFBQyxDQUFBLFFBQUQsQ0FBVSx1QkFBVjthQUNBLHNDQUFBLFNBQUE7SUFIVTs7bUJBS1osWUFBQSxHQUFjLFNBQUE7YUFDWjtJQURZOzttQkFHZCxTQUFBLEdBQVcsU0FBQTthQUNULElBQUMsQ0FBQSxJQUFELENBQUE7SUFEUzs7bUJBR1gsTUFBQSxHQUFRLFNBQUMsUUFBRCxFQUFZLFdBQVo7QUFDTixVQUFBO01BRE8sSUFBQyxDQUFBLFdBQUQ7TUFDUCxzQ0FBUyxDQUFF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O3FCQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLFFBQWI7QUFIRjs7SUFEZ0I7O21CQU1sQixXQUFBLEdBQWEsU0FBQyxHQUFEO0FBRVgsVUFBQTtNQUZhLGNBQUQ7TUFFWixXQUFBLEdBQWMsSUFBQyxDQUFBLGNBQUQsQ0FBQTtNQUNkLElBQWtDLFdBQVcsQ0FBQyxVQUFaLENBQXVCLEdBQXZCLENBQWxDO1FBQUEsV0FBQSxHQUFjLFdBQVksVUFBMUI7O01BRUEsT0FBQSxHQUFVLFVBQVUsQ0FBQyxLQUFYLENBQWlCLFdBQWpCLEVBQThCLFdBQTlCO2FBQ1YsRUFBQSxDQUFHLFNBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJO1VBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQO1VBQWdCLGlCQUFBLEVBQW1CLElBQW5DO1NBQUosRUFBNkMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDM0MsS0FBQyxDQUFBLElBQUQsQ0FBTTtjQUFBLEtBQUEsRUFBTyxXQUFQO2FBQU4sRUFBMEIsU0FBQTtxQkFDeEIsZ0JBQUEsQ0FBaUIsS0FBakIsRUFBdUIsV0FBdkIsRUFBb0MsT0FBcEMsRUFBNkMsQ0FBN0M7WUFEd0IsQ0FBMUI7VUFEMkM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdDO01BREMsQ0FBSDtJQU5XOzttQkFXYixTQUFBLEdBQVcsU0FBQyxHQUFEO0FBQ1QsVUFBQTtNQURXLGlCQUFNLGlCQUFNO01BQ3ZCLElBQUMsQ0FBQSxNQUFELENBQUE7YUFDQSxJQUFDLENBQUEsUUFBUyxDQUFBLElBQUEsQ0FBTSxDQUFBLElBQUEsQ0FBaEIsQ0FBc0IsSUFBQyxDQUFBLFFBQXZCLEVBQWlDLE9BQWpDO0lBRlM7Ozs7S0FwSE07QUFObkIiLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xue1NlbGVjdExpc3RWaWV3LCAkLCAkJH0gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbmZ1enphbGRyaW4gPSByZXF1aXJlICdmdXp6YWxkcmluJ1xue2h1bWFuaXplLCBoaWdobGlnaHRNYXRjaGVzfSA9IHJlcXVpcmUgJy4vdXRpbHMnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICBpbml0aWFsSW5wdXQ6IG51bGxcbiAgaXRlbXNDYWNoZTogbnVsbFxuXG4gICMgRGlzYWJsZSB0aHJvdHRsaW5nIHBvcHVsYXRlTGlzdCBmb3IgaW5pdGlhbElucHV0XG4gIHNjaGVkdWxlUG9wdWxhdGVMaXN0OiAtPlxuICAgIGlmIEBpbml0aWFsSW5wdXRcbiAgICAgIEBwb3B1bGF0ZUxpc3QoKSBpZiBAaXNPbkRvbSgpXG4gICAgICBAaW5pdGlhbElucHV0ID0gZmFsc2VcbiAgICBlbHNlXG4gICAgICBzdXBlclxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQGNvbW1hbmRzID0gcmVxdWlyZSAnLi9jb21tYW5kcydcbiAgICBAYWRkQ2xhc3MoJ3ZpbS1tb2RlLXBsdXMtZXgtbW9kZScpXG4gICAgc3VwZXJcblxuICBnZXRGaWx0ZXJLZXk6IC0+XG4gICAgJ2Rpc3BsYXlOYW1lJ1xuXG4gIGNhbmNlbGxlZDogLT5cbiAgICBAaGlkZSgpXG5cbiAgdG9nZ2xlOiAoQHZpbVN0YXRlLCBjb21tYW5kS2luZCkgLT5cbiAgICBpZiBAcGFuZWw/LmlzVmlzaWJsZSgpXG4gICAgICBAY2FuY2VsKClcbiAgICBlbHNlXG4gICAgICB7QGVkaXRvckVsZW1lbnQsIEBlZGl0b3J9ID0gQHZpbVN0YXRlXG4gICAgICBAc2hvdyhjb21tYW5kS2luZClcblxuICBzaG93OiAoY29tbWFuZEtpbmQpIC0+XG4gICAgQGluaXRpYWxJbnB1dCA9IHRydWVcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe2l0ZW06IHRoaXN9KVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc2V0SXRlbXMoQGdldEl0ZW1zRm9yS2luZChjb21tYW5kS2luZCkpXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBnZXRJdGVtc0ZvcktpbmQ6IChraW5kKSAtPlxuICAgIEBpdGVtc0NhY2hlID89IHt9XG4gICAgaWYga2luZCBvZiBAaXRlbXNDYWNoZVxuICAgICAgQGl0ZW1zQ2FjaGVba2luZF1cbiAgICBlbHNlXG4gICAgICBjb21tYW5kcyA9IF8ua2V5cyhAY29tbWFuZHNba2luZF0pXG4gICAgICBpdGVtcyA9IGNvbW1hbmRzLm1hcCAobmFtZSkgPT4gQGdldEl0ZW0oa2luZCwgbmFtZSlcbiAgICAgIEBpdGVtc0NhY2hlW2tpbmRdID0gaXRlbXNcbiAgICAgIGl0ZW1zXG5cbiAgZ2V0SXRlbTogKGtpbmQsIG5hbWUpIC0+XG4gICAgaWYga2luZCBpbiBbJ3RvZ2dsZUNvbW1hbmRzJywgJ251bWJlckNvbW1hbmRzJ11cbiAgICAgIGRpc3BsYXlOYW1lID0gaHVtYW5pemUobmFtZSlcbiAgICBlbHNlXG4gICAgICBkaXNwbGF5TmFtZSA9IG5hbWVcbiAgICB7bmFtZSwga2luZCwgZGlzcGxheU5hbWV9XG5cbiAgaGlkZTogLT5cbiAgICBAcGFuZWw/LmhpZGUoKVxuXG4gIGdldEZhbGxCYWNrSXRlbXNGb3JRdWVyeTogKHF1ZXJ5KSAtPlxuICAgIGl0ZW1zID0gW11cblxuICAgIGlmIC9eIS8udGVzdChxdWVyeSlcbiAgICAgIGZpbHRlclF1ZXJ5ID0gcXVlcnlbMS4uLl0gIyB0byB0cmltIGZpcnN0ICchJ1xuICAgICAgaXRlbXMgPSBAZ2V0SXRlbXNGb3JLaW5kKCd0b2dnbGVDb21tYW5kcycpXG4gICAgICBpdGVtcyA9IGZ1enphbGRyaW4uZmlsdGVyKGl0ZW1zLCBmaWx0ZXJRdWVyeSwga2V5OiBAZ2V0RmlsdGVyS2V5KCkpXG5cbiAgICBlbHNlIGlmIC9eWystXFxkXS8udGVzdChxdWVyeSlcbiAgICAgIGl0ZW1zLnB1c2goaXRlbSkgaWYgaXRlbSA9IEBnZXROdW1iZXJDb21tYW5kSXRlbShxdWVyeSlcblxuICAgIGl0ZW1zXG5cbiAgZ2V0TnVtYmVyQ29tbWFuZEl0ZW06IChxdWVyeSkgLT5cbiAgICBpZiBtYXRjaCA9IHF1ZXJ5Lm1hdGNoKC9eKFxcZCspKyQvKVxuICAgICAgbmFtZSA9ICdtb3ZlVG9MaW5lJ1xuICAgICAgb3B0aW9ucyA9IHtyb3c6IE51bWJlcihtYXRjaFsxXSl9XG5cbiAgICBlbHNlIGlmIG1hdGNoID0gcXVlcnkubWF0Y2goL14oXFxkKyklJC8pXG4gICAgICBuYW1lID0gJ21vdmVUb0xpbmVCeVBlcmNlbnQnXG4gICAgICBvcHRpb25zID0ge3BlcmNlbnQ6IE51bWJlcihtYXRjaFsxXSl9XG5cbiAgICBlbHNlIGlmIG1hdGNoID0gcXVlcnkubWF0Y2goL14oXFxkKyk6KFxcZCspJC8pXG4gICAgICBuYW1lID0gJ21vdmVUb0xpbmVBbmRDb2x1bW4nXG4gICAgICBvcHRpb25zID0ge3JvdzogTnVtYmVyKG1hdGNoWzFdKSwgY29sdW1uOiBOdW1iZXIobWF0Y2hbMl0pfVxuXG4gICAgZWxzZSBpZiBtYXRjaCA9IHF1ZXJ5Lm1hdGNoKC9eKFsrLV1cXGQrKSQvKVxuICAgICAgbmFtZSA9ICdtb3ZlVG9SZWxhdGl2ZUxpbmUnXG4gICAgICBvcHRpb25zID0ge29mZnNldDogTnVtYmVyKG1hdGNoWzFdKX1cblxuICAgIGlmIG5hbWU/XG4gICAgICBpdGVtID0gQGdldEl0ZW0oJ251bWJlckNvbW1hbmRzJywgbmFtZSlcbiAgICAgIGl0ZW0ub3B0aW9ucyA9IG9wdGlvbnNcbiAgICAgIGl0ZW1cblxuICAjIFVzZSBhcyBjb21tYW5kIG1pc3NpbmcgaG9vay5cbiAgZ2V0RW1wdHlNZXNzYWdlOiAoaXRlbUNvdW50LCBmaWx0ZXJlZEl0ZW1Db3VudCkgLT5cbiAgICBAc2V0RXJyb3IobnVsbClcbiAgICBAc2V0RmFsbGJhY2tJdGVtcyhAZ2V0RmFsbEJhY2tJdGVtc0ZvclF1ZXJ5KEBnZXRGaWx0ZXJRdWVyeSgpKSlcbiAgICBAc2VsZWN0SXRlbVZpZXcoQGxpc3QuZmluZCgnbGk6Zmlyc3QnKSlcblxuICBzZXRGYWxsYmFja0l0ZW1zOiAoaXRlbXMpIC0+XG4gICAgZm9yIGl0ZW0gaW4gaXRlbXNcbiAgICAgIGl0ZW1WaWV3ID0gJChAdmlld0Zvckl0ZW0oaXRlbSkpXG4gICAgICBpdGVtVmlldy5kYXRhKCdzZWxlY3QtbGlzdC1pdGVtJywgaXRlbSlcbiAgICAgIEBsaXN0LmFwcGVuZChpdGVtVmlldylcblxuICB2aWV3Rm9ySXRlbTogKHtkaXNwbGF5TmFtZX0pIC0+XG4gICAgIyBTdHlsZSBtYXRjaGVkIGNoYXJhY3RlcnMgaW4gc2VhcmNoIHJlc3VsdHNcbiAgICBmaWx0ZXJRdWVyeSA9IEBnZXRGaWx0ZXJRdWVyeSgpXG4gICAgZmlsdGVyUXVlcnkgPSBmaWx0ZXJRdWVyeVsxLi5dIGlmIGZpbHRlclF1ZXJ5LnN0YXJ0c1dpdGgoJyEnKVxuXG4gICAgbWF0Y2hlcyA9IGZ1enphbGRyaW4ubWF0Y2goZGlzcGxheU5hbWUsIGZpbHRlclF1ZXJ5KVxuICAgICQkIC0+XG4gICAgICBAbGkgY2xhc3M6ICdldmVudCcsICdkYXRhLWV2ZW50LW5hbWUnOiBuYW1lLCA9PlxuICAgICAgICBAc3BhbiB0aXRsZTogZGlzcGxheU5hbWUsID0+XG4gICAgICAgICAgaGlnaGxpZ2h0TWF0Y2hlcyh0aGlzLCBkaXNwbGF5TmFtZSwgbWF0Y2hlcywgMClcblxuICBjb25maXJtZWQ6ICh7a2luZCwgbmFtZSwgb3B0aW9uc30pIC0+XG4gICAgQGNhbmNlbCgpXG4gICAgQGNvbW1hbmRzW2tpbmRdW25hbWVdKEB2aW1TdGF0ZSwgb3B0aW9ucylcbiJdfQ==
