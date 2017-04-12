Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.cachedProperty = cachedProperty;
exports.getProjectPath = getProjectPath;
exports.preferredSeparatorFor = preferredSeparatorFor;
exports.defineImmutable = defineImmutable;
exports.absolutify = absolutify;
exports.dom = dom;
exports.closest = closest;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _osenv = require('osenv');

var _osenv2 = _interopRequireDefault(_osenv);

/**
 * Generates the return value for the wrapper property on first access
 * and caches it on the object. All future calls return the cached value
 * instead of re-calculating it.
 */

function cachedProperty(target, key, descriptor) {
    var getter = descriptor.get;
    var cached_key = Symbol(key + '_cached');

    descriptor.get = function () {
        if (this[cached_key] === undefined) {
            Object.defineProperty(this, cached_key, {
                value: getter.call(this),
                writable: false,
                enumerable: false
            });
        }
        return this[cached_key];
    };

    return descriptor;
}

/**
 * Get the path to the current project directory. For now this just uses
 * the first directory in the list. Return null if there are no project
 * directories.
 *
 * TODO: Support more than just the first.
 */

function getProjectPath() {
    var projectPaths = atom.project.getPaths();
    if (projectPaths.length > 0) {
        return projectPaths[0];
    } else {
        return null;
    }
}

/**
 * Get the preferred path separator for the given string based on the
 * first path separator detected.
 */

function preferredSeparatorFor(path) {
    var forwardIndex = path.indexOf('/');
    var backIndex = path.indexOf('\\');

    if (backIndex === -1 && forwardIndex === -1) {
        return _path2['default'].sep;
    } else if (forwardIndex === -1) {
        return '\\';
    } else if (backIndex === -1) {
        return '/';
    } else if (forwardIndex < backIndex) {
        return '/';
    } else {
        return '\\';
    }
}

/**
 * Define an immutable property on an object.
 */

function defineImmutable(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        writable: false,
        enumerable: true
    });
}

/**
 * Turn the given path into an absolute path if necessary. Paths are
 * considered relative to the project root.
 */

function absolutify(path) {
    // If we start with a tilde, just replace it with the home dir.
    var sep = preferredSeparatorFor(path);
    if (path.startsWith('~' + sep)) {
        return _osenv2['default'].home() + sep + path.slice(2);
    }

    // If the path doesn't start with a separator, it's relative to the
    // project root.
    if (!path.startsWith(sep)) {
        var relativeBases = [];
        var projectPath = getProjectPath();
        if (projectPath) {
            relativeBases.push(projectPath);
        }

        return _path2['default'].resolve.apply(_path2['default'], relativeBases.concat([path]));
    }

    // Otherwise it was absolute already.
    return path;
}

/**
 * Parse the given string as HTML and return DOM nodes. Assumes a root
 * DOM node because, well, that's all I use it for.
 */

function dom(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
}

/**
 * Starts at the current DOM element and moves upward in the DOM tree
 * until an element matching the given selector is found.
 *
 * Intended to be bound to DOM elements like so:
 * domNode::closest('selector');
 */

function closest(selector) {
    if (this.matches && this.matches(selector)) {
        return this;
    } else if (this.parentNode) {
        var _context;

        return (_context = this.parentNode, closest).call(_context, selector);
    } else {
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1vcGVuLWZpbGUvbGliL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztvQkFFb0IsTUFBTTs7OztxQkFFUixPQUFPOzs7Ozs7Ozs7O0FBUWxCLFNBQVMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFO0FBQ3BELFFBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUM7QUFDNUIsUUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFJLEdBQUcsYUFBVSxDQUFDOztBQUV6QyxjQUFVLENBQUMsR0FBRyxHQUFHLFlBQVc7QUFDeEIsWUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssU0FBUyxFQUFFO0FBQ2hDLGtCQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7QUFDcEMscUJBQUssRUFBRSxBQUFNLE1BQU0sTUFBWixJQUFJLENBQVU7QUFDckIsd0JBQVEsRUFBRSxLQUFLO0FBQ2YsMEJBQVUsRUFBRSxLQUFLO2FBQ3BCLENBQUMsQ0FBQztTQUNOO0FBQ0QsZUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDM0IsQ0FBQzs7QUFFRixXQUFPLFVBQVUsQ0FBQztDQUNyQjs7Ozs7Ozs7OztBQVVNLFNBQVMsY0FBYyxHQUFHO0FBQzdCLFFBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDM0MsUUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN6QixlQUFPLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxQixNQUFNO0FBQ0gsZUFBTyxJQUFJLENBQUM7S0FDZjtDQUNKOzs7Ozs7O0FBT00sU0FBUyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUU7QUFDeEMsUUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQyxRQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVuQyxRQUFJLFNBQVMsS0FBSyxDQUFDLENBQUMsSUFBSSxZQUFZLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDekMsZUFBTyxrQkFBUSxHQUFHLENBQUM7S0FDdEIsTUFBTSxJQUFJLFlBQVksS0FBSyxDQUFDLENBQUMsRUFBRTtBQUM1QixlQUFPLElBQUksQ0FBQztLQUNmLE1BQU0sSUFBSSxTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDekIsZUFBTyxHQUFHLENBQUM7S0FDZCxNQUFNLElBQUksWUFBWSxHQUFHLFNBQVMsRUFBRTtBQUNqQyxlQUFPLEdBQUcsQ0FBQztLQUNkLE1BQU07QUFDSCxlQUFPLElBQUksQ0FBQztLQUNmO0NBQ0o7Ozs7OztBQU1NLFNBQVMsZUFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzlDLFVBQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRTtBQUM3QixhQUFLLEVBQUUsS0FBSztBQUNaLGdCQUFRLEVBQUUsS0FBSztBQUNmLGtCQUFVLEVBQUUsSUFBSTtLQUNuQixDQUFDLENBQUM7Q0FDTjs7Ozs7OztBQU9NLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTs7QUFFN0IsUUFBSSxHQUFHLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsUUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRTtBQUM1QixlQUFPLG1CQUFNLElBQUksRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdDOzs7O0FBSUQsUUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDdkIsWUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFlBQUksV0FBVyxHQUFHLGNBQWMsRUFBRSxDQUFDO0FBQ25DLFlBQUksV0FBVyxFQUFFO0FBQ2IseUJBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDbkM7O0FBRUQsZUFBTyxrQkFBUSxPQUFPLE1BQUEsb0JBQUksYUFBYSxTQUFFLElBQUksR0FBQyxDQUFDO0tBQ2xEOzs7QUFHRCxXQUFPLElBQUksQ0FBQztDQUNmOzs7Ozs7O0FBT00sU0FBUyxHQUFHLENBQUMsSUFBSSxFQUFFO0FBQ3RCLFFBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsT0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDckIsV0FBTyxHQUFHLENBQUMsaUJBQWlCLENBQUM7Q0FDaEM7Ozs7Ozs7Ozs7QUFVTSxTQUFTLE9BQU8sQ0FBQyxRQUFRLEVBQUU7QUFDOUIsUUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDeEMsZUFBTyxJQUFJLENBQUM7S0FDZixNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTs7O0FBQ3hCLGVBQU8sWUFBQSxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8saUJBQUMsUUFBUSxDQUFDLENBQUM7S0FDN0MsTUFBTTtBQUNILGVBQU8sSUFBSSxDQUFDO0tBQ2Y7Q0FDSiIsImZpbGUiOiIvaG9tZS95b3NoaW5vcmkvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHN0ZFBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCBvc2VudiBmcm9tICdvc2Vudic7XG5cblxuLyoqXG4gKiBHZW5lcmF0ZXMgdGhlIHJldHVybiB2YWx1ZSBmb3IgdGhlIHdyYXBwZXIgcHJvcGVydHkgb24gZmlyc3QgYWNjZXNzXG4gKiBhbmQgY2FjaGVzIGl0IG9uIHRoZSBvYmplY3QuIEFsbCBmdXR1cmUgY2FsbHMgcmV0dXJuIHRoZSBjYWNoZWQgdmFsdWVcbiAqIGluc3RlYWQgb2YgcmUtY2FsY3VsYXRpbmcgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYWNoZWRQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcikge1xuICAgIGxldCBnZXR0ZXIgPSBkZXNjcmlwdG9yLmdldDtcbiAgICBsZXQgY2FjaGVkX2tleSA9IFN5bWJvbChgJHtrZXl9X2NhY2hlZGApO1xuXG4gICAgZGVzY3JpcHRvci5nZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXNbY2FjaGVkX2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGNhY2hlZF9rZXksIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGhpczo6Z2V0dGVyKCksXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXNbY2FjaGVkX2tleV07XG4gICAgfTtcblxuICAgIHJldHVybiBkZXNjcmlwdG9yO1xufVxuXG5cbi8qKlxuICogR2V0IHRoZSBwYXRoIHRvIHRoZSBjdXJyZW50IHByb2plY3QgZGlyZWN0b3J5LiBGb3Igbm93IHRoaXMganVzdCB1c2VzXG4gKiB0aGUgZmlyc3QgZGlyZWN0b3J5IGluIHRoZSBsaXN0LiBSZXR1cm4gbnVsbCBpZiB0aGVyZSBhcmUgbm8gcHJvamVjdFxuICogZGlyZWN0b3JpZXMuXG4gKlxuICogVE9ETzogU3VwcG9ydCBtb3JlIHRoYW4ganVzdCB0aGUgZmlyc3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9qZWN0UGF0aCgpIHtcbiAgICBsZXQgcHJvamVjdFBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG4gICAgaWYgKHByb2plY3RQYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBwcm9qZWN0UGF0aHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG5cbi8qKlxuICogR2V0IHRoZSBwcmVmZXJyZWQgcGF0aCBzZXBhcmF0b3IgZm9yIHRoZSBnaXZlbiBzdHJpbmcgYmFzZWQgb24gdGhlXG4gKiBmaXJzdCBwYXRoIHNlcGFyYXRvciBkZXRlY3RlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZWZlcnJlZFNlcGFyYXRvckZvcihwYXRoKSB7XG4gICAgbGV0IGZvcndhcmRJbmRleCA9IHBhdGguaW5kZXhPZignLycpO1xuICAgIGxldCBiYWNrSW5kZXggPSBwYXRoLmluZGV4T2YoJ1xcXFwnKTtcblxuICAgIGlmIChiYWNrSW5kZXggPT09IC0xICYmIGZvcndhcmRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHN0ZFBhdGguc2VwO1xuICAgIH0gZWxzZSBpZiAoZm9yd2FyZEluZGV4ID09PSAtMSkge1xuICAgICAgICByZXR1cm4gJ1xcXFwnO1xuICAgIH0gZWxzZSBpZiAoYmFja0luZGV4ID09PSAtMSkge1xuICAgICAgICByZXR1cm4gJy8nO1xuICAgIH0gZWxzZSBpZiAoZm9yd2FyZEluZGV4IDwgYmFja0luZGV4KSB7XG4gICAgICAgIHJldHVybiAnLyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdcXFxcJztcbiAgICB9XG59XG5cblxuLyoqXG4gKiBEZWZpbmUgYW4gaW1tdXRhYmxlIHByb3BlcnR5IG9uIGFuIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUltbXV0YWJsZShvYmosIG5hbWUsIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB9KTtcbn1cblxuXG4vKipcbiAqIFR1cm4gdGhlIGdpdmVuIHBhdGggaW50byBhbiBhYnNvbHV0ZSBwYXRoIGlmIG5lY2Vzc2FyeS4gUGF0aHMgYXJlXG4gKiBjb25zaWRlcmVkIHJlbGF0aXZlIHRvIHRoZSBwcm9qZWN0IHJvb3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhYnNvbHV0aWZ5KHBhdGgpIHtcbiAgICAvLyBJZiB3ZSBzdGFydCB3aXRoIGEgdGlsZGUsIGp1c3QgcmVwbGFjZSBpdCB3aXRoIHRoZSBob21lIGRpci5cbiAgICBsZXQgc2VwID0gcHJlZmVycmVkU2VwYXJhdG9yRm9yKHBhdGgpO1xuICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoJ34nICsgc2VwKSkge1xuICAgICAgICByZXR1cm4gb3NlbnYuaG9tZSgpICsgc2VwICsgcGF0aC5zbGljZSgyKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgcGF0aCBkb2Vzbid0IHN0YXJ0IHdpdGggYSBzZXBhcmF0b3IsIGl0J3MgcmVsYXRpdmUgdG8gdGhlXG4gICAgLy8gcHJvamVjdCByb290LlxuICAgIGlmICghcGF0aC5zdGFydHNXaXRoKHNlcCkpIHtcbiAgICAgICAgbGV0IHJlbGF0aXZlQmFzZXMgPSBbXTtcbiAgICAgICAgbGV0IHByb2plY3RQYXRoID0gZ2V0UHJvamVjdFBhdGgoKTtcbiAgICAgICAgaWYgKHByb2plY3RQYXRoKSB7XG4gICAgICAgICAgICByZWxhdGl2ZUJhc2VzLnB1c2gocHJvamVjdFBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0ZFBhdGgucmVzb2x2ZSguLi5yZWxhdGl2ZUJhc2VzLCBwYXRoKTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgaXQgd2FzIGFic29sdXRlIGFscmVhZHkuXG4gICAgcmV0dXJuIHBhdGg7XG59XG5cblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gc3RyaW5nIGFzIEhUTUwgYW5kIHJldHVybiBET00gbm9kZXMuIEFzc3VtZXMgYSByb290XG4gKiBET00gbm9kZSBiZWNhdXNlLCB3ZWxsLCB0aGF0J3MgYWxsIEkgdXNlIGl0IGZvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRvbShodG1sKSB7XG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJldHVybiBkaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XG59XG5cblxuLyoqXG4gKiBTdGFydHMgYXQgdGhlIGN1cnJlbnQgRE9NIGVsZW1lbnQgYW5kIG1vdmVzIHVwd2FyZCBpbiB0aGUgRE9NIHRyZWVcbiAqIHVudGlsIGFuIGVsZW1lbnQgbWF0Y2hpbmcgdGhlIGdpdmVuIHNlbGVjdG9yIGlzIGZvdW5kLlxuICpcbiAqIEludGVuZGVkIHRvIGJlIGJvdW5kIHRvIERPTSBlbGVtZW50cyBsaWtlIHNvOlxuICogZG9tTm9kZTo6Y2xvc2VzdCgnc2VsZWN0b3InKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsb3Nlc3Qoc2VsZWN0b3IpIHtcbiAgICBpZiAodGhpcy5tYXRjaGVzICYmIHRoaXMubWF0Y2hlcyhzZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudE5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Tm9kZTo6Y2xvc2VzdChzZWxlY3Rvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuIl19