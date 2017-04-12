Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _child_process = require('child_process');

'use babel';

var fs = require('fs');

var IOUtil = (function () {
  function IOUtil() {
    _classCallCheck(this, IOUtil);
  }

  _createClass(IOUtil, [{
    key: 'readDir',
    value: function readDir(path) {
      return new Promise(function (resolve) {
        fs.readdir(path, function (err, names) {
          if (err) {
            // TODO reject promise on error and notify user about error afterwards
            atom.notifications.addError('autocomplete-java:\n' + err, { dismissable: true });
            resolve([]);
          } else {
            resolve(names);
          }
        });
      });
    }
  }, {
    key: 'readFile',
    value: function readFile(path, noErrorMessage) {
      return new Promise(function (resolve) {
        fs.readFile(path, 'utf8', function (err, data) {
          if (err) {
            // TODO reject promise on error and notify user about error afterwards
            if (!noErrorMessage) {
              atom.notifications.addError('autocomplete-java:\n' + err, { dismissable: true });
            }
            resolve('');
          } else {
            resolve(data);
          }
        });
      });
    }

    // TODO avoid large maxBuffer by using spawn instead
  }, {
    key: 'exec',
    value: function exec(command, ignoreError, noErrorMessage) {
      return new Promise(function (resolve) {
        (0, _child_process.exec)(command, { maxBuffer: 2000 * 1024 }, function (err, stdout) {
          if (err && !ignoreError) {
            // TODO reject promise on error and notify user about error afterwards
            if (!noErrorMessage) {
              atom.notifications.addError('autocomplete-java:\n' + err, { dismissable: true });
            } else {
              console.warn('autocomplete-java: ' + err + '\n' + command);
            }
            resolve('');
          } else {
            resolve(stdout);
          }
        });
      });
    }
  }]);

  return IOUtil;
})();

exports['default'] = new IOUtil();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS9saWIvaW9VdGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzZCQUVxQixlQUFlOztBQUZwQyxXQUFXLENBQUM7O0FBR1osSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUVuQixNQUFNO1dBQU4sTUFBTTswQkFBTixNQUFNOzs7ZUFBTixNQUFNOztXQUVILGlCQUFDLElBQUksRUFBRTtBQUNaLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDOUIsVUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQy9CLGNBQUksR0FBRyxFQUFFOztBQUVQLGdCQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLEVBQ3RELEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDekIsbUJBQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztXQUNiLE1BQU07QUFDTCxtQkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1dBQ2hCO1NBQ0YsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztXQUVPLGtCQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7QUFDN0IsYUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUM5QixVQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFLO0FBQ3ZDLGNBQUksR0FBRyxFQUFFOztBQUVQLGdCQUFJLENBQUMsY0FBYyxFQUFFO0FBQ25CLGtCQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLEVBQ3RELEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7YUFDMUI7QUFDRCxtQkFBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQ2IsTUFBTTtBQUNMLG1CQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDZjtTQUNGLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7OztXQUdHLGNBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUU7QUFDekMsYUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUM5QixpQ0FBSyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxHQUFHLElBQUksRUFBRSxFQUFFLFVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBSztBQUN6RCxjQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRTs7QUFFdkIsZ0JBQUksQ0FBQyxjQUFjLEVBQUU7QUFDbkIsa0JBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLHNCQUFzQixHQUFHLEdBQUcsRUFDdEQsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUMxQixNQUFNO0FBQ0wscUJBQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQzthQUM1RDtBQUNELG1CQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7V0FDYixNQUFNO0FBQ0wsbUJBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztXQUNqQjtTQUNGLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0FwREcsTUFBTTs7O3FCQXdERyxJQUFJLE1BQU0sRUFBRSIsImZpbGUiOiIvaG9tZS95b3NoaW5vcmkvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWphdmEvbGliL2lvVXRpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBleGVjIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbmNsYXNzIElPVXRpbCB7XG5cbiAgcmVhZERpcihwYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBmcy5yZWFkZGlyKHBhdGgsIChlcnIsIG5hbWVzKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBUT0RPIHJlamVjdCBwcm9taXNlIG9uIGVycm9yIGFuZCBub3RpZnkgdXNlciBhYm91dCBlcnJvciBhZnRlcndhcmRzXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdhdXRvY29tcGxldGUtamF2YTpcXG4nICsgZXJyLFxuICAgICAgICAgICAgeyBkaXNtaXNzYWJsZTogdHJ1ZSB9KTtcbiAgICAgICAgICByZXNvbHZlKFtdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKG5hbWVzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZWFkRmlsZShwYXRoLCBub0Vycm9yTWVzc2FnZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgZnMucmVhZEZpbGUocGF0aCwgJ3V0ZjgnLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBUT0RPIHJlamVjdCBwcm9taXNlIG9uIGVycm9yIGFuZCBub3RpZnkgdXNlciBhYm91dCBlcnJvciBhZnRlcndhcmRzXG4gICAgICAgICAgaWYgKCFub0Vycm9yTWVzc2FnZSkge1xuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdhdXRvY29tcGxldGUtamF2YTpcXG4nICsgZXJyLFxuICAgICAgICAgICAgICB7IGRpc21pc3NhYmxlOiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKCcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFRPRE8gYXZvaWQgbGFyZ2UgbWF4QnVmZmVyIGJ5IHVzaW5nIHNwYXduIGluc3RlYWRcbiAgZXhlYyhjb21tYW5kLCBpZ25vcmVFcnJvciwgbm9FcnJvck1lc3NhZ2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGV4ZWMoY29tbWFuZCwgeyBtYXhCdWZmZXI6IDIwMDAgKiAxMDI0IH0sIChlcnIsIHN0ZG91dCkgPT4ge1xuICAgICAgICBpZiAoZXJyICYmICFpZ25vcmVFcnJvcikge1xuICAgICAgICAgIC8vIFRPRE8gcmVqZWN0IHByb21pc2Ugb24gZXJyb3IgYW5kIG5vdGlmeSB1c2VyIGFib3V0IGVycm9yIGFmdGVyd2FyZHNcbiAgICAgICAgICBpZiAoIW5vRXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2F1dG9jb21wbGV0ZS1qYXZhOlxcbicgKyBlcnIsXG4gICAgICAgICAgICAgIHsgZGlzbWlzc2FibGU6IHRydWUgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignYXV0b2NvbXBsZXRlLWphdmE6ICcgKyBlcnIgKyAnXFxuJyArIGNvbW1hbmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKCcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHN0ZG91dCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IElPVXRpbCgpO1xuIl19