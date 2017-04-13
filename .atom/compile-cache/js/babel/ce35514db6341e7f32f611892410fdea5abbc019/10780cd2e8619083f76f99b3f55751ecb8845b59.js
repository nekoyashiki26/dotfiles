Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fuzzaldrinPlus = require('fuzzaldrin-plus');

var _fuzzaldrinPlus2 = _interopRequireDefault(_fuzzaldrinPlus);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _touch = require('touch');

var _touch2 = _interopRequireDefault(_touch);

var _config = require('./config');

var config = _interopRequireWildcard(_config);

var _utils = require('./utils');

/**
 * Wrapper for dealing with filesystem paths.
 */

var Path = (function () {
    function Path() {
        var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        _classCallCheck(this, Path);

        // The last path segment is the "fragment". Paths that end in a
        // separator have a blank fragment.
        var sep = (0, _utils.preferredSeparatorFor)(path);
        var parts = path.split(sep);
        var fragment = parts[parts.length - 1];
        var directory = path.substring(0, path.length - fragment.length);

        // Set non-writable properties.
        (0, _utils.defineImmutable)(this, 'directory', directory);
        (0, _utils.defineImmutable)(this, 'fragment', fragment);
        (0, _utils.defineImmutable)(this, 'full', path);
        (0, _utils.defineImmutable)(this, 'sep', sep);
    }

    /**
     * Return whether the filename matches the given path fragment.
     */

    _createDecoratedClass(Path, [{
        key: 'isDirectory',
        value: function isDirectory() {
            return this.stat ? this.stat.isDirectory() : null;
        }
    }, {
        key: 'isFile',
        value: function isFile() {
            return this.stat ? !this.stat.isDirectory() : null;
        }
    }, {
        key: 'isProjectDirectory',
        value: function isProjectDirectory() {
            return atom.project.getPaths().indexOf(this.absolute) !== -1;
        }
    }, {
        key: 'isRoot',
        value: function isRoot() {
            return _path2['default'].dirname(this.absolute) === this.absolute;
        }
    }, {
        key: 'hasCaseSensitiveFragment',
        value: function hasCaseSensitiveFragment() {
            return this.fragment !== '' && this.fragment !== this.fragment.toLowerCase();
        }
    }, {
        key: 'exists',
        value: function exists() {
            return this.stat !== null;
        }
    }, {
        key: 'asDirectory',
        value: function asDirectory() {
            return new Path(this.full + (this.fragment ? this.sep : ''));
        }
    }, {
        key: 'parent',
        value: function parent() {
            if (this.isRoot()) {
                return this;
            } else if (this.fragment) {
                return new Path(this.directory);
            } else {
                return new Path(_path2['default'].dirname(this.directory) + this.sep);
            }
        }

        /**
         * Return path for the root directory for the drive this path is on.
         */
    }, {
        key: 'root',
        value: function root() {
            var last = null;
            var current = this.absolute;
            while (current !== last) {
                last = current;
                current = _path2['default'].dirname(current);
            }

            return new Path(current);
        }

        /**
         * Create an empty file at the given path if it doesn't already exist.
         */
    }, {
        key: 'createFile',
        value: function createFile() {
            _touch2['default'].sync(this.absolute);
        }

        /**
         * Create directories for the file this path points to, or do nothing
         * if they already exist.
         */
    }, {
        key: 'createDirectories',
        value: function createDirectories() {
            try {
                _mkdirp2['default'].sync((0, _utils.absolutify)(this.directory));
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }
        }
    }, {
        key: 'matchingPaths',
        value: function matchingPaths() {
            var _this = this;

            var caseSensitive = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            var absoluteDir = (0, _utils.absolutify)(this.directory);
            var filenames = null;

            try {
                filenames = _fs2['default'].readdirSync(absoluteDir);
            } catch (err) {
                return []; // TODO: Catch permissions error and display a message.
            }

            if (this.fragment) {
                if (config.get('fuzzyMatch')) {
                    filenames = _fuzzaldrinPlus2['default'].filter(filenames, this.fragment);
                } else {
                    if (caseSensitive === null) {
                        caseSensitive = this.hasCaseSensitiveFragment();
                    }

                    filenames = filenames.filter(function (fn) {
                        return matchFragment(_this.fragment, fn, caseSensitive);
                    });
                }
            }

            return filenames.map(function (fn) {
                return new Path(_this.directory + fn);
            });
        }

        /**
         * Check if the last path fragment in this path is equal to the given
         * shortcut string, and the path ends in a separator.
         *
         * For example, ':/' and '/foo/bar/:/' have the ':' shortcut, but
         * '/foo/bar:/' and '/blah/:' do not.
         */
    }, {
        key: 'hasShortcut',
        value: function hasShortcut(shortcut) {
            shortcut = shortcut + this.sep;
            return !this.fragment && (this.directory.endsWith(this.sep + shortcut) || this.directory === shortcut);
        }
    }, {
        key: 'equals',
        value: function equals(otherPath) {
            return this.full === otherPath.full;
        }

        /**
         * Return the path to show initially in the path input.
         */
    }, {
        key: 'absolute',
        decorators: [_utils.cachedProperty],
        get: function get() {
            return (0, _utils.absolutify)(this.full);
        }
    }, {
        key: 'stat',
        decorators: [_utils.cachedProperty],
        get: function get() {
            try {
                return _fs2['default'].statSync(this.absolute);
            } catch (err) {
                return null;
            }
        }
    }], [{
        key: 'initial',
        value: function initial() {
            switch (config.get('defaultInputValue')) {
                case config.DEFAULT_ACTIVE_FILE_DIR:
                    var editor = atom.workspace.getActiveTextEditor();
                    if (editor && editor.getPath()) {
                        return new Path(_path2['default'].dirname(editor.getPath()) + _path2['default'].sep);
                    }
                // No break so that we fall back to project root.
                case config.DEFAULT_PROJECT_ROOT:
                    var projectPath = (0, _utils.getProjectPath)();
                    if (projectPath) {
                        return new Path(projectPath + _path2['default'].sep);
                    }
            }

            return new Path('');
        }

        /**
         * Compare two paths lexicographically.
         */
    }, {
        key: 'compare',
        value: function compare(path1, path2) {
            return path1.full.localeCompare(path2.full);
        }

        /**
         * Return a new path instance with the common prefix of all the
         * given paths.
         */
    }, {
        key: 'commonPrefix',
        value: function commonPrefix(paths) {
            var caseSensitive = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (paths.length < 2) {
                throw new Error('Cannot find common prefix for lists shorter than two elements.');
            }

            paths = paths.map(function (path) {
                return path.full;
            }).sort();
            var first = paths[0];
            var last = paths[paths.length - 1];

            var prefix = '';
            var prefixMaxLength = Math.min(first.length, last.length);
            for (var k = 0; k < prefixMaxLength; k++) {
                if (first[k] === last[k]) {
                    prefix += first[k];
                } else if (!caseSensitive && first[k].toLowerCase() === last[k].toLowerCase()) {
                    prefix += first[k].toLowerCase();
                } else {
                    break;
                }
            }

            return new Path(prefix);
        }
    }]);

    return Path;
})();

exports.Path = Path;
function matchFragment(fragment, filename) {
    var caseSensitive = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (!caseSensitive) {
        fragment = fragment.toLowerCase();
        filename = filename.toLowerCase();
    }

    return filename.startsWith(fragment);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1vcGVuLWZpbGUvbGliL21vZGVscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztrQkFFZSxJQUFJOzs7O29CQUNDLE1BQU07Ozs7OEJBRUgsaUJBQWlCOzs7O3NCQUNyQixRQUFROzs7O3FCQUNULE9BQU87Ozs7c0JBRUQsVUFBVTs7SUFBdEIsTUFBTTs7cUJBT1gsU0FBUzs7Ozs7O0lBTUgsSUFBSTtBQUNGLGFBREYsSUFBSSxHQUNRO1lBQVQsSUFBSSx5REFBQyxFQUFFOzs4QkFEVixJQUFJOzs7O0FBSVQsWUFBSSxHQUFHLEdBQUcsa0NBQXNCLElBQUksQ0FBQyxDQUFDO0FBQ3RDLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsWUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkMsWUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUdqRSxvQ0FBZ0IsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM5QyxvQ0FBZ0IsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1QyxvQ0FBZ0IsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQyxvQ0FBZ0IsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNyQzs7Ozs7OzBCQWRRLElBQUk7O2VBOEJGLHVCQUFHO0FBQ1YsbUJBQU8sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQztTQUNyRDs7O2VBRUssa0JBQUc7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RUFBRSxDQUFDO0FBQ2hCLGdCQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFELGlCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RDLG9CQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDdEIsMEJBQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3RCLE1BQU0sSUFBSSxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQzNFLDBCQUFNLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUNwQyxNQUFNO0FBQ0gsMEJBQU07aUJBQ1Q7YUFDSjs7QUFFRCxtQkFBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQjs7O1dBN01RLElBQUk7Ozs7QUFtTmpCLFNBQVMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQXVCO1FBQXJCLGFBQWEseURBQUMsS0FBSzs7QUFDMUQsUUFBSSxDQUFDLGFBQWEsRUFBRTtBQUNoQixnQkFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNsQyxnQkFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNyQzs7QUFFRCxXQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDeEMiLCJmaWxlIjoiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2FkdmFuY2VkLW9wZW4tZmlsZS9saWIvbW9kZWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHN0ZFBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCBmdXp6YWxkcmluIGZyb20gJ2Z1enphbGRyaW4tcGx1cyc7XG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQgdG91Y2ggZnJvbSAndG91Y2gnO1xuXG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtcbiAgICBhYnNvbHV0aWZ5LFxuICAgIGNhY2hlZFByb3BlcnR5LFxuICAgIGRlZmluZUltbXV0YWJsZSxcbiAgICBnZXRQcm9qZWN0UGF0aCxcbiAgICBwcmVmZXJyZWRTZXBhcmF0b3JGb3Jcbn0gZnJvbSAnLi91dGlscyc7XG5cblxuLyoqXG4gKiBXcmFwcGVyIGZvciBkZWFsaW5nIHdpdGggZmlsZXN5c3RlbSBwYXRocy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhdGgge1xuICAgIGNvbnN0cnVjdG9yKHBhdGg9JycpIHtcbiAgICAgICAgLy8gVGhlIGxhc3QgcGF0aCBzZWdtZW50IGlzIHRoZSBcImZyYWdtZW50XCIuIFBhdGhzIHRoYXQgZW5kIGluIGFcbiAgICAgICAgLy8gc2VwYXJhdG9yIGhhdmUgYSBibGFuayBmcmFnbWVudC5cbiAgICAgICAgbGV0IHNlcCA9IHByZWZlcnJlZFNlcGFyYXRvckZvcihwYXRoKTtcbiAgICAgICAgbGV0IHBhcnRzID0gcGF0aC5zcGxpdChzZXApO1xuICAgICAgICBsZXQgZnJhZ21lbnQgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgbGV0IGRpcmVjdG9yeSA9IHBhdGguc3Vic3RyaW5nKDAsIHBhdGgubGVuZ3RoIC0gZnJhZ21lbnQubGVuZ3RoKTtcblxuICAgICAgICAvLyBTZXQgbm9uLXdyaXRhYmxlIHByb3BlcnRpZXMuXG4gICAgICAgIGRlZmluZUltbXV0YWJsZSh0aGlzLCAnZGlyZWN0b3J5JywgZGlyZWN0b3J5KTtcbiAgICAgICAgZGVmaW5lSW1tdXRhYmxlKHRoaXMsICdmcmFnbWVudCcsIGZyYWdtZW50KTtcbiAgICAgICAgZGVmaW5lSW1tdXRhYmxlKHRoaXMsICdmdWxsJywgcGF0aCk7XG4gICAgICAgIGRlZmluZUltbXV0YWJsZSh0aGlzLCAnc2VwJywgc2VwKTtcbiAgICB9XG5cbiAgICBAY2FjaGVkUHJvcGVydHlcbiAgICBnZXQgYWJzb2x1dGUoKSB7XG4gICAgICAgIHJldHVybiBhYnNvbHV0aWZ5KHRoaXMuZnVsbCk7XG4gICAgfVxuXG4gICAgQGNhY2hlZFByb3BlcnR5XG4gICAgZ2V0IHN0YXQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZnMuc3RhdFN5bmModGhpcy5hYnNvbHV0ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0RpcmVjdG9yeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdCA/IHRoaXMuc3RhdC5pc0RpcmVjdG9yeSgpIDogbnVsbDtcbiAgICB9XG5cbiAgICBpc0ZpbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXQgPyAhdGhpcy5zdGF0LmlzRGlyZWN0b3J5KCkgOiBudWxsO1xuICAgIH1cblxuICAgIGlzUHJvamVjdERpcmVjdG9yeSgpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ucHJvamVjdC5nZXRQYXRocygpLmluZGV4T2YodGhpcy5hYnNvbHV0ZSkgIT09IC0xO1xuICAgIH1cblxuICAgIGlzUm9vdCgpIHtcbiAgICAgICAgcmV0dXJuIHN0ZFBhdGguZGlybmFtZSh0aGlzLmFic29sdXRlKSA9PT0gdGhpcy5hYnNvbHV0ZTtcbiAgICB9XG5cbiAgICBoYXNDYXNlU2Vuc2l0aXZlRnJhZ21lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyYWdtZW50ICE9PSAnJyAmJiB0aGlzLmZyYWdtZW50ICE9PSB0aGlzLmZyYWdtZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgZXhpc3RzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ICE9PSBudWxsO1xuICAgIH1cblxuICAgIGFzRGlyZWN0b3J5KCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhdGgodGhpcy5mdWxsICsgKHRoaXMuZnJhZ21lbnQgPyB0aGlzLnNlcCA6ICcnKSk7XG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuICAgICAgICBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5mcmFnbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQYXRoKHRoaXMuZGlyZWN0b3J5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGF0aChzdGRQYXRoLmRpcm5hbWUodGhpcy5kaXJlY3RvcnkpICsgdGhpcy5zZXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHBhdGggZm9yIHRoZSByb290IGRpcmVjdG9yeSBmb3IgdGhlIGRyaXZlIHRoaXMgcGF0aCBpcyBvbi5cbiAgICAgKi9cbiAgICByb290KCkge1xuICAgICAgICBsZXQgbGFzdCA9IG51bGw7XG4gICAgICAgIGxldCBjdXJyZW50ID0gdGhpcy5hYnNvbHV0ZTtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IGxhc3QpIHtcbiAgICAgICAgICAgIGxhc3QgPSBjdXJyZW50O1xuICAgICAgICAgICAgY3VycmVudCA9IHN0ZFBhdGguZGlybmFtZShjdXJyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUGF0aChjdXJyZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW4gZW1wdHkgZmlsZSBhdCB0aGUgZ2l2ZW4gcGF0aCBpZiBpdCBkb2Vzbid0IGFscmVhZHkgZXhpc3QuXG4gICAgICovXG4gICAgY3JlYXRlRmlsZSgpIHtcbiAgICAgICAgdG91Y2guc3luYyh0aGlzLmFic29sdXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgZGlyZWN0b3JpZXMgZm9yIHRoZSBmaWxlIHRoaXMgcGF0aCBwb2ludHMgdG8sIG9yIGRvIG5vdGhpbmdcbiAgICAgKiBpZiB0aGV5IGFscmVhZHkgZXhpc3QuXG4gICAgICovXG4gICAgY3JlYXRlRGlyZWN0b3JpZXMoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0aWZ5KHRoaXMuZGlyZWN0b3J5KSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGVyci5jb2RlICE9PSAnRU5PRU5UJykge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hdGNoaW5nUGF0aHMoY2FzZVNlbnNpdGl2ZT1udWxsKSB7XG4gICAgICAgIGxldCBhYnNvbHV0ZURpciA9IGFic29sdXRpZnkodGhpcy5kaXJlY3RvcnkpO1xuICAgICAgICBsZXQgZmlsZW5hbWVzID0gbnVsbDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmlsZW5hbWVzID0gZnMucmVhZGRpclN5bmMoYWJzb2x1dGVEaXIpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTsgLy8gVE9ETzogQ2F0Y2ggcGVybWlzc2lvbnMgZXJyb3IgYW5kIGRpc3BsYXkgYSBtZXNzYWdlLlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZnJhZ21lbnQpIHtcbiAgICAgICAgICAgIGlmIChjb25maWcuZ2V0KCdmdXp6eU1hdGNoJykpIHtcbiAgICAgICAgICAgICAgICBmaWxlbmFtZXMgPSBmdXp6YWxkcmluLmZpbHRlcihmaWxlbmFtZXMsIHRoaXMuZnJhZ21lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FzZVNlbnNpdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlU2Vuc2l0aXZlID0gdGhpcy5oYXNDYXNlU2Vuc2l0aXZlRnJhZ21lbnQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmaWxlbmFtZXMgPSBmaWxlbmFtZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAoZm4pID0+IG1hdGNoRnJhZ21lbnQodGhpcy5mcmFnbWVudCwgZm4sIGNhc2VTZW5zaXRpdmUpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlbmFtZXMubWFwKChmbikgPT4gbmV3IFBhdGgodGhpcy5kaXJlY3RvcnkgKyBmbikpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSBsYXN0IHBhdGggZnJhZ21lbnQgaW4gdGhpcyBwYXRoIGlzIGVxdWFsIHRvIHRoZSBnaXZlblxuICAgICAqIHNob3J0Y3V0IHN0cmluZywgYW5kIHRoZSBwYXRoIGVuZHMgaW4gYSBzZXBhcmF0b3IuXG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZSwgJzovJyBhbmQgJy9mb28vYmFyLzovJyBoYXZlIHRoZSAnOicgc2hvcnRjdXQsIGJ1dFxuICAgICAqICcvZm9vL2JhcjovJyBhbmQgJy9ibGFoLzonIGRvIG5vdC5cbiAgICAgKi9cbiAgICBoYXNTaG9ydGN1dChzaG9ydGN1dCkge1xuICAgICAgICBzaG9ydGN1dCA9IHNob3J0Y3V0ICsgdGhpcy5zZXA7XG4gICAgICAgIHJldHVybiAhdGhpcy5mcmFnbWVudCAmJiAoXG4gICAgICAgICAgICB0aGlzLmRpcmVjdG9yeS5lbmRzV2l0aCh0aGlzLnNlcCArIHNob3J0Y3V0KVxuICAgICAgICAgICAgfHwgdGhpcy5kaXJlY3RvcnkgPT09IHNob3J0Y3V0XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBlcXVhbHMob3RoZXJQYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZ1bGwgPT09IG90aGVyUGF0aC5mdWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgcGF0aCB0byBzaG93IGluaXRpYWxseSBpbiB0aGUgcGF0aCBpbnB1dC5cbiAgICAgKi9cbiAgICBzdGF0aWMgaW5pdGlhbCgpIHtcbiAgICAgICAgc3dpdGNoIChjb25maWcuZ2V0KCdkZWZhdWx0SW5wdXRWYWx1ZScpKSB7XG4gICAgICAgICAgICBjYXNlIGNvbmZpZy5ERUZBVUxUX0FDVElWRV9GSUxFX0RJUjpcbiAgICAgICAgICAgICAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3IgJiYgZWRpdG9yLmdldFBhdGgoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFBhdGgoc3RkUGF0aC5kaXJuYW1lKGVkaXRvci5nZXRQYXRoKCkpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBObyBicmVhayBzbyB0aGF0IHdlIGZhbGwgYmFjayB0byBwcm9qZWN0IHJvb3QuXG4gICAgICAgICAgICBjYXNlIGNvbmZpZy5ERUZBVUxUX1BST0pFQ1RfUk9PVDpcbiAgICAgICAgICAgICAgICBsZXQgcHJvamVjdFBhdGggPSBnZXRQcm9qZWN0UGF0aCgpO1xuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0UGF0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFBhdGgocHJvamVjdFBhdGggKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQYXRoKCcnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21wYXJlIHR3byBwYXRocyBsZXhpY29ncmFwaGljYWxseS5cbiAgICAgKi9cbiAgICBzdGF0aWMgY29tcGFyZShwYXRoMSwgcGF0aDIpIHtcbiAgICAgICAgcmV0dXJuIHBhdGgxLmZ1bGwubG9jYWxlQ29tcGFyZShwYXRoMi5mdWxsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBuZXcgcGF0aCBpbnN0YW5jZSB3aXRoIHRoZSBjb21tb24gcHJlZml4IG9mIGFsbCB0aGVcbiAgICAgKiBnaXZlbiBwYXRocy5cbiAgICAgKi9cbiAgICBzdGF0aWMgY29tbW9uUHJlZml4KHBhdGhzLCBjYXNlU2Vuc2l0aXZlPWZhbHNlKSB7XG4gICAgICAgIGlmIChwYXRocy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgJ0Nhbm5vdCBmaW5kIGNvbW1vbiBwcmVmaXggZm9yIGxpc3RzIHNob3J0ZXIgdGhhbiB0d28gZWxlbWVudHMuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdGhzID0gcGF0aHMubWFwKChwYXRoKSA9PiBwYXRoLmZ1bGwpLnNvcnQoKTtcbiAgICAgICAgbGV0IGZpcnN0ID0gcGF0aHNbMF07XG4gICAgICAgIGxldCBsYXN0ID0gcGF0aHNbcGF0aHMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgbGV0IHByZWZpeCA9ICcnO1xuICAgICAgICBsZXQgcHJlZml4TWF4TGVuZ3RoID0gTWF0aC5taW4oZmlyc3QubGVuZ3RoLCBsYXN0Lmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgcHJlZml4TWF4TGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChmaXJzdFtrXSA9PT0gbGFzdFtrXSkge1xuICAgICAgICAgICAgICAgIHByZWZpeCArPSBmaXJzdFtrXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWNhc2VTZW5zaXRpdmUgJiYgZmlyc3Rba10udG9Mb3dlckNhc2UoKSA9PT0gbGFzdFtrXS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgcHJlZml4ICs9IGZpcnN0W2tdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQYXRoKHByZWZpeCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIHRoZSBmaWxlbmFtZSBtYXRjaGVzIHRoZSBnaXZlbiBwYXRoIGZyYWdtZW50LlxuICovXG5mdW5jdGlvbiBtYXRjaEZyYWdtZW50KGZyYWdtZW50LCBmaWxlbmFtZSwgY2FzZVNlbnNpdGl2ZT1mYWxzZSkge1xuICAgIGlmICghY2FzZVNlbnNpdGl2ZSkge1xuICAgICAgICBmcmFnbWVudCA9IGZyYWdtZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsZW5hbWUuc3RhcnRzV2l0aChmcmFnbWVudCk7XG59XG4iXX0=