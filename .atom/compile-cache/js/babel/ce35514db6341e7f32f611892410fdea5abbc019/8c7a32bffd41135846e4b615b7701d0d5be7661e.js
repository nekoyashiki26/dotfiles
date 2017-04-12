Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.get = get;
/** @babel */

var DEFAULT_ACTIVE_FILE_DIR = 'Active file\'s directory';
exports.DEFAULT_ACTIVE_FILE_DIR = DEFAULT_ACTIVE_FILE_DIR;
var DEFAULT_PROJECT_ROOT = 'Project root';
exports.DEFAULT_PROJECT_ROOT = DEFAULT_PROJECT_ROOT;
var DEFAULT_EMPTY = 'Empty';

exports.DEFAULT_EMPTY = DEFAULT_EMPTY;

function get(key) {
    return atom.config.get('advanced-open-file.' + key);
}

var config = {
    createDirectories: {
        title: 'Create directories',
        description: 'When opening a path to a directory that doesn\'t\n                      exist, create the directory instead of beeping.',
        type: 'boolean',
        'default': false
    },
    createFileInstantly: {
        title: 'Create files instantly',
        description: 'When opening files that don\'t exist, create them\n                      immediately instead of on save.',
        type: 'boolean',
        'default': false
    },
    helmDirSwitch: {
        title: 'Shortcuts for fast directory switching',
        description: 'See README for details.',
        type: 'boolean',
        'default': false
    },
    defaultInputValue: {
        title: 'Default input value',
        description: 'What should the path input default to when the dialog\n                      is opened?',
        type: 'string',
        'enum': [DEFAULT_ACTIVE_FILE_DIR, DEFAULT_PROJECT_ROOT, DEFAULT_EMPTY],
        'default': DEFAULT_ACTIVE_FILE_DIR
    },
    fuzzyMatch: {
        title: 'Use fuzzy matching for matching filenames',
        description: 'Replaces default prefix-based matching. See README for\n                      details.',
        type: 'boolean',
        'default': false
    }
};
exports.config = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1vcGVuLWZpbGUvbGliL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFTyxJQUFNLHVCQUF1QixHQUFHLDBCQUEwQixDQUFDOztBQUMzRCxJQUFNLG9CQUFvQixHQUFHLGNBQWMsQ0FBQzs7QUFDNUMsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDOzs7O0FBRzlCLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRTtBQUNyQixXQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyx5QkFBdUIsR0FBRyxDQUFHLENBQUM7Q0FDdkQ7O0FBR00sSUFBSSxNQUFNLEdBQUc7QUFDaEIscUJBQWlCLEVBQUU7QUFDZixhQUFLLEVBQUUsb0JBQW9CO0FBQzNCLG1CQUFXLDJIQUNtRDtBQUM5RCxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7S0FDakI7QUFDRCx1QkFBbUIsRUFBRTtBQUNqQixhQUFLLEVBQUUsd0JBQXdCO0FBQy9CLG1CQUFXLDRHQUNtQztBQUM5QyxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7S0FDakI7QUFDRCxpQkFBYSxFQUFFO0FBQ1gsYUFBSyxFQUFFLHdDQUF3QztBQUMvQyxtQkFBVyxFQUFFLHlCQUF5QjtBQUN0QyxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7S0FDakI7QUFDRCxxQkFBaUIsRUFBRTtBQUNmLGFBQUssRUFBRSxxQkFBcUI7QUFDNUIsbUJBQVcsMkZBQ2M7QUFDekIsWUFBSSxFQUFFLFFBQVE7QUFDZCxnQkFBTSxDQUFDLHVCQUF1QixFQUFFLG9CQUFvQixFQUFFLGFBQWEsQ0FBQztBQUNwRSxtQkFBUyx1QkFBdUI7S0FDbkM7QUFDRCxjQUFVLEVBQUU7QUFDUixhQUFLLEVBQUUsMkNBQTJDO0FBQ2xELG1CQUFXLDBGQUNZO0FBQ3ZCLFlBQUksRUFBRSxTQUFTO0FBQ2YsbUJBQVMsS0FBSztLQUNqQjtDQUNKLENBQUMiLCJmaWxlIjoiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2FkdmFuY2VkLW9wZW4tZmlsZS9saWIvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9BQ1RJVkVfRklMRV9ESVIgPSAnQWN0aXZlIGZpbGVcXCdzIGRpcmVjdG9yeSc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9QUk9KRUNUX1JPT1QgPSAnUHJvamVjdCByb290JztcbmV4cG9ydCBjb25zdCBERUZBVUxUX0VNUFRZID0gJ0VtcHR5JztcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoYGFkdmFuY2VkLW9wZW4tZmlsZS4ke2tleX1gKTtcbn1cblxuXG5leHBvcnQgbGV0IGNvbmZpZyA9IHtcbiAgICBjcmVhdGVEaXJlY3Rvcmllczoge1xuICAgICAgICB0aXRsZTogJ0NyZWF0ZSBkaXJlY3RvcmllcycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBgV2hlbiBvcGVuaW5nIGEgcGF0aCB0byBhIGRpcmVjdG9yeSB0aGF0IGRvZXNuJ3RcbiAgICAgICAgICAgICAgICAgICAgICBleGlzdCwgY3JlYXRlIHRoZSBkaXJlY3RvcnkgaW5zdGVhZCBvZiBiZWVwaW5nLmAsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBjcmVhdGVGaWxlSW5zdGFudGx5OiB7XG4gICAgICAgIHRpdGxlOiAnQ3JlYXRlIGZpbGVzIGluc3RhbnRseScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBgV2hlbiBvcGVuaW5nIGZpbGVzIHRoYXQgZG9uJ3QgZXhpc3QsIGNyZWF0ZSB0aGVtXG4gICAgICAgICAgICAgICAgICAgICAgaW1tZWRpYXRlbHkgaW5zdGVhZCBvZiBvbiBzYXZlLmAsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBoZWxtRGlyU3dpdGNoOiB7XG4gICAgICAgIHRpdGxlOiAnU2hvcnRjdXRzIGZvciBmYXN0IGRpcmVjdG9yeSBzd2l0Y2hpbmcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1NlZSBSRUFETUUgZm9yIGRldGFpbHMuJyxcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGRlZmF1bHRJbnB1dFZhbHVlOiB7XG4gICAgICAgIHRpdGxlOiAnRGVmYXVsdCBpbnB1dCB2YWx1ZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBgV2hhdCBzaG91bGQgdGhlIHBhdGggaW5wdXQgZGVmYXVsdCB0byB3aGVuIHRoZSBkaWFsb2dcbiAgICAgICAgICAgICAgICAgICAgICBpcyBvcGVuZWQ/YCxcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGVudW06IFtERUZBVUxUX0FDVElWRV9GSUxFX0RJUiwgREVGQVVMVF9QUk9KRUNUX1JPT1QsIERFRkFVTFRfRU1QVFldLFxuICAgICAgICBkZWZhdWx0OiBERUZBVUxUX0FDVElWRV9GSUxFX0RJUixcbiAgICB9LFxuICAgIGZ1enp5TWF0Y2g6IHtcbiAgICAgICAgdGl0bGU6ICdVc2UgZnV6enkgbWF0Y2hpbmcgZm9yIG1hdGNoaW5nIGZpbGVuYW1lcycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBgUmVwbGFjZXMgZGVmYXVsdCBwcmVmaXgtYmFzZWQgbWF0Y2hpbmcuIFNlZSBSRUFETUUgZm9yXG4gICAgICAgICAgICAgICAgICAgICAgZGV0YWlscy5gLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH1cbn07XG4iXX0=