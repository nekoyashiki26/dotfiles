(function() {
  var ClipboardItems, CompositeDisposable, Disposable, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  module.exports = ClipboardItems = (function() {
    ClipboardItems.prototype.limit = 15;

    ClipboardItems.prototype.items = [];

    ClipboardItems.prototype.destroyed = false;

    function ClipboardItems(state) {
      var ref1;
      if (state == null) {
        state = {};
      }
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.wrapClipboard());
      this.subscriptions.add(atom.config.observe('clipboard-plus.limit', (function(_this) {
        return function(limit) {
          return _this.limit = limit;
        };
      })(this)));
      this.items = (ref1 = state.items) != null ? ref1 : [];
    }

    ClipboardItems.prototype.destroy = function() {
      var ref1;
      if (this.destroyed) {
        return;
      }
      if ((ref1 = this.subscriptions) != null) {
        ref1.dispose();
      }
      this.subscriptions = null;
      this.clear();
      return this.destroyed = true;
    };

    ClipboardItems.prototype.wrapClipboard = function() {
      var clipboard, readWithMetadata, write;
      clipboard = atom.clipboard;
      write = clipboard.write, readWithMetadata = clipboard.readWithMetadata;
      clipboard.write = (function(_this) {
        return function(text, metadata) {
          var ignore, ref1, ref2, ref3, replace;
          if (metadata == null) {
            metadata = {};
          }
          ignore = (ref1 = metadata.ignore) != null ? ref1 : false;
          delete metadata.ignore;
          replace = (ref2 = metadata.replace) != null ? ref2 : false;
          delete metadata.replace;
          write.call(clipboard, text, metadata);
          if (ignore) {
            return;
          }
          if (_this.isIgnoreText(text)) {
            return;
          }
          ref3 = clipboard.readWithMetadata(), text = ref3.text, metadata = ref3.metadata;
          if (metadata == null) {
            metadata = {};
          }
          metadata.time = Date.now();
          if (replace) {
            _this.items.pop();
          }
          return _this.push({
            text: text,
            metadata: metadata
          });
        };
      })(this);
      clipboard.readWithMetadata = function() {
        var result;
        result = readWithMetadata.call(clipboard);
        if (!result.hasOwnProperty('metadata')) {
          clipboard.write(result.text);
        }
        return result;
      };
      return new Disposable(function() {
        clipboard.write = write;
        return clipboard.readWithMetadata = readWithMetadata;
      });
    };

    ClipboardItems.prototype.push = function(arg) {
      var deleteCount, metadata, text;
      text = arg.text, metadata = arg.metadata;
      if (atom.config.get('clipboard-plus.unique')) {
        this.deleteByText(text);
      }
      this.items.push({
        text: text,
        metadata: metadata
      });
      deleteCount = this.items.length - this.limit;
      if (deleteCount > 0) {
        return this.items.splice(0, deleteCount);
      }
    };

    ClipboardItems.prototype.size = function() {
      return this.items.length;
    };

    ClipboardItems.prototype["delete"] = function(item) {
      return this.items.splice(this.items.indexOf(item), 1);
    };

    ClipboardItems.prototype.deleteByText = function(text) {
      return this.items = this.items.filter(function(item) {
        return item.text !== text;
      });
    };

    ClipboardItems.prototype.clear = function() {
      return this.items.length = 0;
    };

    ClipboardItems.prototype.entries = function() {
      return this.items.slice();
    };

    ClipboardItems.prototype.get = function(index) {
      return this.items[index];
    };

    ClipboardItems.prototype.serialize = function() {
      return {
        items: this.items.slice()
      };
    };

    ClipboardItems.prototype.syncSystemClipboard = function() {
      atom.clipboard.readWithMetadata();
      return this;
    };

    ClipboardItems.prototype.isIgnoreText = function(text) {
      var trimmed;
      if (text.match(/^\s+$/)) {
        return true;
      }
      trimmed = text.trim();
      if (trimmed.length < atom.config.get('clipboard-plus.minimumTextLength')) {
        return true;
      }
      if (trimmed.length > atom.config.get('clipboard-plus.maximumTextLength')) {
        return true;
      }
      return false;
    };

    return ClipboardItems;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2NsaXBib2FyZC1wbHVzL2xpYi9jbGlwYm9hcmQtaXRlbXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUV0QixNQUFNLENBQUMsT0FBUCxHQUNNOzZCQUNKLEtBQUEsR0FBTzs7NkJBQ1AsS0FBQSxHQUFPOzs2QkFDUCxTQUFBLEdBQVc7O0lBRUUsd0JBQUMsS0FBRDtBQUNYLFVBQUE7O1FBRFksUUFBUTs7TUFDcEIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFuQjtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0JBQXBCLEVBQTRDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lCQUM3RCxLQUFDLENBQUEsS0FBRCxHQUFTO1FBRG9EO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QyxDQUFuQjtNQUdBLElBQUMsQ0FBQSxLQUFELHlDQUF1QjtJQU5aOzs2QkFRYixPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxJQUFVLElBQUMsQ0FBQSxTQUFYO0FBQUEsZUFBQTs7O1lBQ2MsQ0FBRSxPQUFoQixDQUFBOztNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCO01BQ2pCLElBQUMsQ0FBQSxLQUFELENBQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhO0lBTE47OzZCQU9ULGFBQUEsR0FBZSxTQUFBO0FBQ2IsVUFBQTtNQUFDLFlBQWE7TUFDYix1QkFBRCxFQUFRO01BRVIsU0FBUyxDQUFDLEtBQVYsR0FB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QUksQ0FBQyxTQUFTLENBQUMsZ0JBQWYsQ0FBQTthQUNBO0lBRm1COzs2QkFJckIsWUFBQSxHQUFjLFNBQUMsSUFBRDtBQUNaLFVBQUE7TUFBQSxJQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWCxDQUFmO0FBQUEsZUFBTyxLQUFQOztNQUNBLE9BQUEsR0FBVSxJQUFJLENBQUMsSUFBTCxDQUFBO01BRVYsSUFBRyxPQUFPLENBQUMsTUFBUixHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLENBQXBCO0FBQ0UsZUFBTyxLQURUOztNQUVBLElBQUcsT0FBTyxDQUFDLE1BQVIsR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQixDQUFwQjtBQUNFLGVBQU8sS0FEVDs7YUFHQTtJQVRZOzs7OztBQXRGaEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDbGlwYm9hcmRJdGVtc1xuICBsaW1pdDogMTVcbiAgaXRlbXM6IFtdXG4gIGRlc3Ryb3llZDogZmFsc2VcblxuICBjb25zdHJ1Y3RvcjogKHN0YXRlID0ge30pIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChAd3JhcENsaXBib2FyZCgpKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdjbGlwYm9hcmQtcGx1cy5saW1pdCcsIChsaW1pdCkgPT5cbiAgICAgIEBsaW1pdCA9IGxpbWl0XG4gICAgKSlcbiAgICBAaXRlbXMgPSBzdGF0ZS5pdGVtcyA/IFtdXG5cbiAgZGVzdHJveTogLT5cbiAgICByZXR1cm4gaWYgQGRlc3Ryb3llZFxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICBAY2xlYXIoKVxuICAgIEBkZXN0cm95ZWQgPSB0cnVlXG5cbiAgd3JhcENsaXBib2FyZDogLT5cbiAgICB7Y2xpcGJvYXJkfSA9IGF0b21cbiAgICB7d3JpdGUsIHJlYWRXaXRoTWV0YWRhdGF9ID0gY2xpcGJvYXJkXG5cbiAgICBjbGlwYm9hcmQud3JpdGUgPSAodGV4dCwgbWV0YWRhdGEgPSB7fSkgPT5cbiAgICAgIGlnbm9yZSA9IG1ldGFkYXRhLmlnbm9yZSA/IGZhbHNlXG4gICAgICBkZWxldGUgbWV0YWRhdGEuaWdub3JlXG4gICAgICByZXBsYWNlID0gbWV0YWRhdGEucmVwbGFjZSA/IGZhbHNlXG4gICAgICBkZWxldGUgbWV0YWRhdGEucmVwbGFjZVxuXG4gICAgICB3cml0ZS5jYWxsKGNsaXBib2FyZCwgdGV4dCwgbWV0YWRhdGEpXG4gICAgICByZXR1cm4gaWYgaWdub3JlXG4gICAgICByZXR1cm4gaWYgQGlzSWdub3JlVGV4dCh0ZXh0KVxuXG4gICAgICB7dGV4dCwgbWV0YWRhdGF9ID0gY2xpcGJvYXJkLnJlYWRXaXRoTWV0YWRhdGEoKVxuICAgICAgbWV0YWRhdGEgPz0ge31cbiAgICAgIG1ldGFkYXRhLnRpbWUgPSBEYXRlLm5vdygpXG5cbiAgICAgIEBpdGVtcy5wb3AoKSBpZiByZXBsYWNlXG4gICAgICBAcHVzaCh7dGV4dCwgbWV0YWRhdGF9KVxuXG4gICAgY2xpcGJvYXJkLnJlYWRXaXRoTWV0YWRhdGEgPSAtPlxuICAgICAgcmVzdWx0ID0gcmVhZFdpdGhNZXRhZGF0YS5jYWxsKGNsaXBib2FyZClcbiAgICAgICMgY29weSBmcm9tIHN5c3RlbSBjbGlwYm9hcmQgdG8gYXRvbSBjbGlwYm9hcmRcbiAgICAgIGNsaXBib2FyZC53cml0ZShyZXN1bHQudGV4dCkgdW5sZXNzIHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnbWV0YWRhdGEnKVxuICAgICAgcmVzdWx0XG5cbiAgICBuZXcgRGlzcG9zYWJsZSAtPlxuICAgICAgY2xpcGJvYXJkLndyaXRlID0gd3JpdGVcbiAgICAgIGNsaXBib2FyZC5yZWFkV2l0aE1ldGFkYXRhID0gcmVhZFdpdGhNZXRhZGF0YVxuXG4gIHB1c2g6ICh7dGV4dCwgbWV0YWRhdGF9KSAtPlxuICAgIEBkZWxldGVCeVRleHQodGV4dCkgaWYgYXRvbS5jb25maWcuZ2V0KCdjbGlwYm9hcmQtcGx1cy51bmlxdWUnKVxuICAgIEBpdGVtcy5wdXNoKHt0ZXh0LCBtZXRhZGF0YX0pXG4gICAgZGVsZXRlQ291bnQgPSBAaXRlbXMubGVuZ3RoIC0gQGxpbWl0XG4gICAgQGl0ZW1zLnNwbGljZSgwLCBkZWxldGVDb3VudCkgaWYgZGVsZXRlQ291bnQgPiAwXG4gICAgIyBjb25zb2xlLmxvZyBAaXRlbXMgaWYgYXRvbS5kZXZNb2RlXG5cbiAgc2l6ZTogLT5cbiAgICBAaXRlbXMubGVuZ3RoXG5cbiAgZGVsZXRlOiAoaXRlbSkgLT5cbiAgICBAaXRlbXMuc3BsaWNlKEBpdGVtcy5pbmRleE9mKGl0ZW0pLCAxKVxuXG4gIGRlbGV0ZUJ5VGV4dDogKHRleHQpIC0+XG4gICAgQGl0ZW1zID0gQGl0ZW1zLmZpbHRlcigoaXRlbSkgLT4gaXRlbS50ZXh0IGlzbnQgdGV4dClcblxuICBjbGVhcjogLT5cbiAgICBAaXRlbXMubGVuZ3RoID0gMFxuXG4gIGVudHJpZXM6IC0+XG4gICAgQGl0ZW1zLnNsaWNlKClcblxuICBnZXQ6IChpbmRleCkgLT5cbiAgICBAaXRlbXNbaW5kZXhdXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIGl0ZW1zOiBAaXRlbXMuc2xpY2UoKVxuXG4gIHN5bmNTeXN0ZW1DbGlwYm9hcmQ6IC0+XG4gICAgYXRvbS5jbGlwYm9hcmQucmVhZFdpdGhNZXRhZGF0YSgpXG4gICAgdGhpc1xuXG4gIGlzSWdub3JlVGV4dDogKHRleHQpIC0+XG4gICAgcmV0dXJuIHRydWUgaWYgdGV4dC5tYXRjaCgvXlxccyskLylcbiAgICB0cmltbWVkID0gdGV4dC50cmltKClcblxuICAgIGlmIHRyaW1tZWQubGVuZ3RoIDwgYXRvbS5jb25maWcuZ2V0KCdjbGlwYm9hcmQtcGx1cy5taW5pbXVtVGV4dExlbmd0aCcpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGlmIHRyaW1tZWQubGVuZ3RoID4gYXRvbS5jb25maWcuZ2V0KCdjbGlwYm9hcmQtcGx1cy5tYXhpbXVtVGV4dExlbmd0aCcpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgZmFsc2VcbiJdfQ==
