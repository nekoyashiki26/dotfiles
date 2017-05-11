function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

module.exports = {
  activate: function activate() {
    this.instance = new _main2['default']();
  },
  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.instance.attach(statusBar);
  },
  providerRegistry: function providerRegistry() {
    return this.instance.registry;
  },
  deactivate: function deactivate() {
    this.instance.dispose();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaXlhbWFndWNoaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7b0JBRXVCLFFBQVE7Ozs7QUFHL0IsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFVBQVEsRUFBQSxvQkFBRztBQUNULFFBQUksQ0FBQyxRQUFRLEdBQUcsdUJBQWdCLENBQUE7R0FDakM7QUFDRCxrQkFBZ0IsRUFBQSwwQkFBQyxTQUFpQixFQUFFO0FBQ2xDLFFBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0dBQ2hDO0FBQ0Qsa0JBQWdCLEVBQUEsNEJBQW1CO0FBQ2pDLFdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUE7R0FDOUI7QUFDRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQ3hCO0NBQ0YsQ0FBQSIsImZpbGUiOiIvaG9tZS95b3NoaW5vcml5YW1hZ3VjaGkvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IEJ1c3lTaWduYWwgZnJvbSAnLi9tYWluJ1xuaW1wb3J0IHR5cGUgU2lnbmFsUmVnaXN0cnkgZnJvbSAnLi9yZWdpc3RyeSdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgQnVzeVNpZ25hbCgpXG4gIH0sXG4gIGNvbnN1bWVTdGF0dXNCYXIoc3RhdHVzQmFyOiBPYmplY3QpIHtcbiAgICB0aGlzLmluc3RhbmNlLmF0dGFjaChzdGF0dXNCYXIpXG4gIH0sXG4gIHByb3ZpZGVyUmVnaXN0cnkoKTogU2lnbmFsUmVnaXN0cnkge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLnJlZ2lzdHJ5XG4gIH0sXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pbnN0YW5jZS5kaXNwb3NlKClcbiAgfSxcbn1cbiJdfQ==