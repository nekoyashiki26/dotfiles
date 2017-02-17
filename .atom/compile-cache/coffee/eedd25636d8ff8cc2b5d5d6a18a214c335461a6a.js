(function() {
  var CompositeDisposable, MinimapHighlightSelected, requirePackages,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  requirePackages = require('atom-utils').requirePackages;

  MinimapHighlightSelected = (function() {
    function MinimapHighlightSelected() {
      this.markersDestroyed = bind(this.markersDestroyed, this);
      this.markerCreated = bind(this.markerCreated, this);
      this.dispose = bind(this.dispose, this);
      this.init = bind(this.init, this);
      this.subscriptions = new CompositeDisposable;
    }

    MinimapHighlightSelected.prototype.activate = function(state) {};

    MinimapHighlightSelected.prototype.consumeMinimapServiceV1 = function(minimap) {
      this.minimap = minimap;
      return this.minimap.registerPlugin('highlight-selected', this);
    };

    MinimapHighlightSelected.prototype.consumeHighlightSelectedServiceV1 = function(highlightSelected) {
      this.highlightSelected = highlightSelected;
      if ((this.minimap != null) && (this.active != null)) {
        return this.init();
      }
    };

    MinimapHighlightSelected.prototype.deactivate = function() {
      this.deactivatePlugin();
      this.minimapPackage = null;
      this.highlightSelectedPackage = null;
      this.highlightSelected = null;
      return this.minimap = null;
    };

    MinimapHighlightSelected.prototype.isActive = function() {
      return this.active;
    };

    MinimapHighlightSelected.prototype.activatePlugin = function() {
      if (this.active) {
        return;
      }
      this.subscriptions.add(this.minimap.onDidActivate(this.init));
      this.subscriptions.add(this.minimap.onDidDeactivate(this.dispose));
      this.active = true;
      if (this.highlightSelected != null) {
        return this.init();
      }
    };

    MinimapHighlightSelected.prototype.init = function() {
      this.decorations = [];
      this.highlightSelected.onDidAddMarker((function(_this) {
        return function(marker) {
          return _this.markerCreated(marker);
        };
      })(this));
      this.highlightSelected.onDidAddSelectedMarker((function(_this) {
        return function(marker) {
          return _this.markerCreated(marker, true);
        };
      })(this));
      return this.highlightSelected.onDidRemoveAllMarkers((function(_this) {
        return function() {
          return _this.markersDestroyed();
        };
      })(this));
    };

    MinimapHighlightSelected.prototype.dispose = function() {
      var ref;
      if ((ref = this.decorations) != null) {
        ref.forEach(function(decoration) {
          return decoration.destroy();
        });
      }
      return this.decorations = null;
    };

    MinimapHighlightSelected.prototype.markerCreated = function(marker, selected) {
      var activeMinimap, className, decoration;
      if (selected == null) {
        selected = false;
      }
      activeMinimap = this.minimap.getActiveMinimap();
      if (activeMinimap == null) {
        return;
      }
      className = 'highlight-selected';
      if (selected) {
        className += ' selected';
      }
      decoration = activeMinimap.decorateMarker(marker, {
        type: 'highlight',
        "class": className
      });
      return this.decorations.push(decoration);
    };

    MinimapHighlightSelected.prototype.markersDestroyed = function() {
      this.decorations.forEach(function(decoration) {
        return decoration.destroy();
      });
      return this.decorations = [];
    };

    MinimapHighlightSelected.prototype.deactivatePlugin = function() {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.dispose();
      return this.subscriptions.dispose();
    };

    return MinimapHighlightSelected;

  })();

  module.exports = new MinimapHighlightSelected;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL21pbmltYXAtaGlnaGxpZ2h0LXNlbGVjdGVkL2xpYi9taW5pbWFwLWhpZ2hsaWdodC1zZWxlY3RlZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDhEQUFBO0lBQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSOztFQUN2QixrQkFBbUIsT0FBQSxDQUFRLFlBQVI7O0VBRWQ7SUFDUyxrQ0FBQTs7Ozs7TUFDWCxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO0lBRFY7O3VDQUdiLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTs7dUNBRVYsdUJBQUEsR0FBeUIsU0FBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7YUFDeEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxJQUE5QztJQUR1Qjs7dUNBR3pCLGlDQUFBLEdBQW1DLFNBQUMsaUJBQUQ7TUFBQyxJQUFDLENBQUEsb0JBQUQ7TUFDbEMsSUFBVyxzQkFBQSxJQUFjLHFCQUF6QjtlQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsRUFBQTs7SUFEaUM7O3VDQUduQyxVQUFBLEdBQVksU0FBQTtNQUNWLElBQUMsQ0FBQSxnQkFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFDbEIsSUFBQyxDQUFBLHdCQUFELEdBQTRCO01BQzVCLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjthQUNyQixJQUFDLENBQUEsT0FBRCxHQUFXO0lBTEQ7O3VDQU9aLFFBQUEsR0FBVSxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUo7O3VDQUVWLGNBQUEsR0FBZ0IsU0FBQTtNQUNkLElBQVUsSUFBQyxDQUFBLE1BQVg7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBdUIsSUFBQyxDQUFBLElBQXhCLENBQW5CO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsZUFBVCxDQUF5QixJQUFDLENBQUEsT0FBMUIsQ0FBbkI7TUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVO01BRVYsSUFBVyw4QkFBWDtlQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsRUFBQTs7SUFSYzs7dUNBVWhCLElBQUEsR0FBTSxTQUFBO01BQ0osSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxjQUFuQixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtpQkFBWSxLQUFDLENBQUEsYUFBRCxDQUFlLE1BQWY7UUFBWjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7TUFDQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsc0JBQW5CLENBQTBDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO2lCQUFZLEtBQUMsQ0FBQSxhQUFELENBQWUsTUFBZixFQUF1QixJQUF2QjtRQUFaO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQzthQUNBLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxxQkFBbkIsQ0FBeUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxnQkFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpDO0lBSkk7O3VDQU1OLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTs7V0FBWSxDQUFFLE9BQWQsQ0FBc0IsU0FBQyxVQUFEO2lCQUFnQixVQUFVLENBQUMsT0FBWCxDQUFBO1FBQWhCLENBQXRCOzthQUNBLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFGUjs7dUNBSVQsYUFBQSxHQUFlLFNBQUMsTUFBRCxFQUFTLFFBQVQ7QUFDYixVQUFBOztRQURzQixXQUFXOztNQUNqQyxhQUFBLEdBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsZ0JBQVQsQ0FBQTtNQUNoQixJQUFjLHFCQUFkO0FBQUEsZUFBQTs7TUFDQSxTQUFBLEdBQWE7TUFDYixJQUE0QixRQUE1QjtRQUFBLFNBQUEsSUFBYSxZQUFiOztNQUVBLFVBQUEsR0FBYSxhQUFhLENBQUMsY0FBZCxDQUE2QixNQUE3QixFQUNYO1FBQUMsSUFBQSxFQUFNLFdBQVA7UUFBb0IsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUEzQjtPQURXO2FBRWIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFVBQWxCO0lBUmE7O3VDQVVmLGdCQUFBLEdBQWtCLFNBQUE7TUFDaEIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLFNBQUMsVUFBRDtlQUFnQixVQUFVLENBQUMsT0FBWCxDQUFBO01BQWhCLENBQXJCO2FBQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUZDOzt1Q0FJbEIsZ0JBQUEsR0FBa0IsU0FBQTtNQUNoQixJQUFBLENBQWMsSUFBQyxDQUFBLE1BQWY7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFDVixJQUFDLENBQUEsT0FBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7SUFMZ0I7Ozs7OztFQU9wQixNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFJO0FBakVyQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2V2ZW50LWtpdCdcbntyZXF1aXJlUGFja2FnZXN9ID0gcmVxdWlyZSAnYXRvbS11dGlscydcblxuY2xhc3MgTWluaW1hcEhpZ2hsaWdodFNlbGVjdGVkXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuXG4gIGNvbnN1bWVNaW5pbWFwU2VydmljZVYxOiAoQG1pbmltYXApIC0+XG4gICAgQG1pbmltYXAucmVnaXN0ZXJQbHVnaW4gJ2hpZ2hsaWdodC1zZWxlY3RlZCcsIHRoaXNcblxuICBjb25zdW1lSGlnaGxpZ2h0U2VsZWN0ZWRTZXJ2aWNlVjE6IChAaGlnaGxpZ2h0U2VsZWN0ZWQpIC0+XG4gICAgQGluaXQoKSBpZiBAbWluaW1hcD8gYW5kIEBhY3RpdmU/XG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAZGVhY3RpdmF0ZVBsdWdpbigpXG4gICAgQG1pbmltYXBQYWNrYWdlID0gbnVsbFxuICAgIEBoaWdobGlnaHRTZWxlY3RlZFBhY2thZ2UgPSBudWxsXG4gICAgQGhpZ2hsaWdodFNlbGVjdGVkID0gbnVsbFxuICAgIEBtaW5pbWFwID0gbnVsbFxuXG4gIGlzQWN0aXZlOiAtPiBAYWN0aXZlXG5cbiAgYWN0aXZhdGVQbHVnaW46IC0+XG4gICAgcmV0dXJuIGlmIEBhY3RpdmVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAbWluaW1hcC5vbkRpZEFjdGl2YXRlIEBpbml0XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBtaW5pbWFwLm9uRGlkRGVhY3RpdmF0ZSBAZGlzcG9zZVxuXG4gICAgQGFjdGl2ZSA9IHRydWVcblxuICAgIEBpbml0KCkgaWYgQGhpZ2hsaWdodFNlbGVjdGVkP1xuXG4gIGluaXQ6ID0+XG4gICAgQGRlY29yYXRpb25zID0gW11cbiAgICBAaGlnaGxpZ2h0U2VsZWN0ZWQub25EaWRBZGRNYXJrZXIgKG1hcmtlcikgPT4gQG1hcmtlckNyZWF0ZWQobWFya2VyKVxuICAgIEBoaWdobGlnaHRTZWxlY3RlZC5vbkRpZEFkZFNlbGVjdGVkTWFya2VyIChtYXJrZXIpID0+IEBtYXJrZXJDcmVhdGVkKG1hcmtlciwgdHJ1ZSlcbiAgICBAaGlnaGxpZ2h0U2VsZWN0ZWQub25EaWRSZW1vdmVBbGxNYXJrZXJzID0+IEBtYXJrZXJzRGVzdHJveWVkKClcblxuICBkaXNwb3NlOiA9PlxuICAgIEBkZWNvcmF0aW9ucz8uZm9yRWFjaCAoZGVjb3JhdGlvbikgLT4gZGVjb3JhdGlvbi5kZXN0cm95KClcbiAgICBAZGVjb3JhdGlvbnMgPSBudWxsXG5cbiAgbWFya2VyQ3JlYXRlZDogKG1hcmtlciwgc2VsZWN0ZWQgPSBmYWxzZSkgPT5cbiAgICBhY3RpdmVNaW5pbWFwID0gQG1pbmltYXAuZ2V0QWN0aXZlTWluaW1hcCgpXG4gICAgcmV0dXJuIHVubGVzcyBhY3RpdmVNaW5pbWFwP1xuICAgIGNsYXNzTmFtZSAgPSAnaGlnaGxpZ2h0LXNlbGVjdGVkJ1xuICAgIGNsYXNzTmFtZSArPSAnIHNlbGVjdGVkJyBpZiBzZWxlY3RlZFxuXG4gICAgZGVjb3JhdGlvbiA9IGFjdGl2ZU1pbmltYXAuZGVjb3JhdGVNYXJrZXIobWFya2VyLFxuICAgICAge3R5cGU6ICdoaWdobGlnaHQnLCBjbGFzczogY2xhc3NOYW1lIH0pXG4gICAgQGRlY29yYXRpb25zLnB1c2ggZGVjb3JhdGlvblxuXG4gIG1hcmtlcnNEZXN0cm95ZWQ6ID0+XG4gICAgQGRlY29yYXRpb25zLmZvckVhY2ggKGRlY29yYXRpb24pIC0+IGRlY29yYXRpb24uZGVzdHJveSgpXG4gICAgQGRlY29yYXRpb25zID0gW11cblxuICBkZWFjdGl2YXRlUGx1Z2luOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGFjdGl2ZVxuXG4gICAgQGFjdGl2ZSA9IGZhbHNlXG4gICAgQGRpc3Bvc2UoKVxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBNaW5pbWFwSGlnaGxpZ2h0U2VsZWN0ZWRcbiJdfQ==
