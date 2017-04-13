Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _triejs = require('triejs');

'use babel';

function sortTrie() {
  this.sort(function (a, b) {
    var compare = b.lastUsed - a.lastUsed;
    if (compare === 0) {
      compare = a.name.localeCompare(b.name);
    }
    return compare;
  });
}

var Dictionary = (function () {
  function Dictionary() {
    _classCallCheck(this, Dictionary);

    this.tries = new Map();
  }

  _createClass(Dictionary, [{
    key: 'add',
    value: function add(category, name, desc) {
      this._getTrie(category, true).add(name, desc);
    }
  }, {
    key: 'remove',
    value: function remove(category, name) {
      try {
        this._getTrie(category, true).remove(name);
      } catch (err) {
        // OK
      }
    }
  }, {
    key: 'removeCategory',
    value: function removeCategory(category) {
      this.tries['delete'](category);
    }
  }, {
    key: 'find',
    value: function find(category, namePrefix) {
      var trie = this._getTrie(category);
      return trie ? trie.find(namePrefix) : [];
    }
  }, {
    key: 'touch',
    value: function touch(result) {
      result.lastUsed = Date.now();
    }
  }, {
    key: '_getTrie',
    value: function _getTrie(category, create) {
      var trie = this.tries.get(category);
      if (!trie && create) {
        trie = new _triejs.Triejs({
          returnRoot: true,
          sort: sortTrie,
          enableCache: false
        });
        this.tries.set(category, trie);
      }
      return trie;
    }
  }]);

  return Dictionary;
})();

exports.Dictionary = Dictionary;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvRGljdGlvbmFyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFFdUIsUUFBUTs7QUFGL0IsV0FBVyxDQUFDOztBQUlaLFNBQVMsUUFBUSxHQUFHO0FBQ2xCLE1BQUksQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQ2xCLFFBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUN0QyxRQUFJLE9BQU8sS0FBSyxDQUFDLEVBQUU7QUFDakIsYUFBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4QztBQUNELFdBQU8sT0FBTyxDQUFDO0dBQ2hCLENBQUMsQ0FBQztDQUNKOztJQUVZLFVBQVU7QUFFVixXQUZBLFVBQVUsR0FFUDswQkFGSCxVQUFVOztBQUduQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7R0FDeEI7O2VBSlUsVUFBVTs7V0FNbEIsYUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtBQUN4QixVQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQy9DOzs7V0FFSyxnQkFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFO0FBQ3JCLFVBQUk7QUFDRixZQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDNUMsQ0FBQyxPQUFPLEdBQUcsRUFBRTs7T0FFYjtLQUNGOzs7V0FFYSx3QkFBQyxRQUFRLEVBQUU7QUFDdkIsVUFBSSxDQUFDLEtBQUssVUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzdCOzs7V0FFRyxjQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUU7QUFDekIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxhQUFPLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUMxQzs7O1dBRUksZUFBQyxNQUFNLEVBQUU7QUFDWixZQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUM5Qjs7O1dBRU8sa0JBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUN6QixVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQyxVQUFJLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRTtBQUNuQixZQUFJLEdBQUcsbUJBQVc7QUFDaEIsb0JBQVUsRUFBRSxJQUFJO0FBQ2hCLGNBQUksRUFBRSxRQUFRO0FBQ2QscUJBQVcsRUFBRSxLQUFLO1NBQ25CLENBQUMsQ0FBQztBQUNILFlBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNoQztBQUNELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztTQTFDVSxVQUFVIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvRGljdGlvbmFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBUcmllanMgfSBmcm9tICd0cmllanMnO1xuXG5mdW5jdGlvbiBzb3J0VHJpZSgpIHtcbiAgdGhpcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgbGV0IGNvbXBhcmUgPSBiLmxhc3RVc2VkIC0gYS5sYXN0VXNlZDtcbiAgICBpZiAoY29tcGFyZSA9PT0gMCkge1xuICAgICAgY29tcGFyZSA9IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBjb21wYXJlO1xuICB9KTtcbn1cblxuZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudHJpZXMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBhZGQoY2F0ZWdvcnksIG5hbWUsIGRlc2MpIHtcbiAgICB0aGlzLl9nZXRUcmllKGNhdGVnb3J5LCB0cnVlKS5hZGQobmFtZSwgZGVzYyk7XG4gIH1cblxuICByZW1vdmUoY2F0ZWdvcnksIG5hbWUpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fZ2V0VHJpZShjYXRlZ29yeSwgdHJ1ZSkucmVtb3ZlKG5hbWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gT0tcbiAgICB9XG4gIH1cblxuICByZW1vdmVDYXRlZ29yeShjYXRlZ29yeSkge1xuICAgIHRoaXMudHJpZXMuZGVsZXRlKGNhdGVnb3J5KTtcbiAgfVxuXG4gIGZpbmQoY2F0ZWdvcnksIG5hbWVQcmVmaXgpIHtcbiAgICBjb25zdCB0cmllID0gdGhpcy5fZ2V0VHJpZShjYXRlZ29yeSk7XG4gICAgcmV0dXJuIHRyaWUgPyB0cmllLmZpbmQobmFtZVByZWZpeCkgOiBbXTtcbiAgfVxuXG4gIHRvdWNoKHJlc3VsdCkge1xuICAgIHJlc3VsdC5sYXN0VXNlZCA9IERhdGUubm93KCk7XG4gIH1cblxuICBfZ2V0VHJpZShjYXRlZ29yeSwgY3JlYXRlKSB7XG4gICAgbGV0IHRyaWUgPSB0aGlzLnRyaWVzLmdldChjYXRlZ29yeSk7XG4gICAgaWYgKCF0cmllICYmIGNyZWF0ZSkge1xuICAgICAgdHJpZSA9IG5ldyBUcmllanMoe1xuICAgICAgICByZXR1cm5Sb290OiB0cnVlLFxuICAgICAgICBzb3J0OiBzb3J0VHJpZSxcbiAgICAgICAgZW5hYmxlQ2FjaGU6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgICB0aGlzLnRyaWVzLnNldChjYXRlZ29yeSwgdHJpZSk7XG4gICAgfVxuICAgIHJldHVybiB0cmllO1xuICB9XG5cbn1cbiJdfQ==