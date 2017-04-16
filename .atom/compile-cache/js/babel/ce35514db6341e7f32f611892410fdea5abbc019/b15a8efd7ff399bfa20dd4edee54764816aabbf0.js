Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.processListItems = processListItems;
exports.showError = showError;
exports.disposableEvent = disposableEvent;
exports.stoppingEvent = stoppingEvent;

var _atom = require('atom');

var $class = '__$sb_intentions_class';

exports.$class = $class;

function processListItems(suggestions) {
  for (var i = 0, _length = suggestions.length; i < _length; ++i) {
    var suggestion = suggestions[i];
    var className = [];
    if (suggestion['class']) {
      className.push(suggestion['class'].trim());
    }
    if (suggestion.icon) {
      className.push('icon icon-' + suggestion.icon);
    }
    suggestion[$class] = className.join(' ');
  }

  return suggestions.sort(function (a, b) {
    return b.priority - a.priority;
  });
}

function showError(message) {
  var detail = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  if (message instanceof Error) {
    detail = message.stack;
    message = message.message;
  }
  atom.notifications.addError('[Intentions] ' + message, {
    detail: detail,
    dismissable: true
  });
}

function disposableEvent(element, eventName, callback) {
  element.addEventListener(eventName, callback);
  return new _atom.Disposable(function () {
    element.removeEventListener(eventName, callback);
  });
}

function stoppingEvent(callback) {
  return function (event) {
    event.stopImmediatePropagation();
    callback.call(this, event);
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUUyQixNQUFNOztBQUcxQixJQUFNLE1BQU0sR0FBRyx3QkFBd0IsQ0FBQTs7OztBQUV2QyxTQUFTLGdCQUFnQixDQUFDLFdBQTRCLEVBQW1CO0FBQzlFLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxPQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDNUQsUUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2pDLFFBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQTtBQUNwQixRQUFJLFVBQVUsU0FBTSxFQUFFO0FBQ3BCLGVBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxTQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtLQUN4QztBQUNELFFBQUksVUFBVSxDQUFDLElBQUksRUFBRTtBQUNuQixlQUFTLENBQUMsSUFBSSxnQkFBYyxVQUFVLENBQUMsSUFBSSxDQUFHLENBQUE7S0FDL0M7QUFDRCxjQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtHQUN6Qzs7QUFFRCxTQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3JDLFdBQU8sQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFBO0dBQy9CLENBQUMsQ0FBQTtDQUNIOztBQUVNLFNBQVMsU0FBUyxDQUFDLE9BQXVCLEVBQTBCO01BQXhCLE1BQWUseURBQUcsSUFBSTs7QUFDdkUsTUFBSSxPQUFPLFlBQVksS0FBSyxFQUFFO0FBQzVCLFVBQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFBO0FBQ3RCLFdBQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFBO0dBQzFCO0FBQ0QsTUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLG1CQUFpQixPQUFPLEVBQUk7QUFDckQsVUFBTSxFQUFOLE1BQU07QUFDTixlQUFXLEVBQUUsSUFBSTtHQUNsQixDQUFDLENBQUE7Q0FDSDs7QUFFTSxTQUFTLGVBQWUsQ0FBQyxPQUFvQixFQUFFLFNBQWlCLEVBQUUsUUFBa0IsRUFBYztBQUN2RyxTQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQzdDLFNBQU8scUJBQWUsWUFBVztBQUMvQixXQUFPLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0dBQ2pELENBQUMsQ0FBQTtDQUNIOztBQUVNLFNBQVMsYUFBYSxDQUFDLFFBQWlDLEVBQTRCO0FBQ3pGLFNBQU8sVUFBVSxLQUFZLEVBQUU7QUFDN0IsU0FBSyxDQUFDLHdCQUF3QixFQUFFLENBQUE7QUFDaEMsWUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7R0FDM0IsQ0FBQTtDQUNGIiwiZmlsZSI6Ii9ob21lL3lvc2hpbm9yaS9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IExpc3RJdGVtIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGNvbnN0ICRjbGFzcyA9ICdfXyRzYl9pbnRlbnRpb25zX2NsYXNzJ1xuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0xpc3RJdGVtcyhzdWdnZXN0aW9uczogQXJyYXk8TGlzdEl0ZW0+KTogQXJyYXk8TGlzdEl0ZW0+IHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHN1Z2dlc3Rpb25zLmxlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29uc3Qgc3VnZ2VzdGlvbiA9IHN1Z2dlc3Rpb25zW2ldXG4gICAgY29uc3QgY2xhc3NOYW1lID0gW11cbiAgICBpZiAoc3VnZ2VzdGlvbi5jbGFzcykge1xuICAgICAgY2xhc3NOYW1lLnB1c2goc3VnZ2VzdGlvbi5jbGFzcy50cmltKCkpXG4gICAgfVxuICAgIGlmIChzdWdnZXN0aW9uLmljb24pIHtcbiAgICAgIGNsYXNzTmFtZS5wdXNoKGBpY29uIGljb24tJHtzdWdnZXN0aW9uLmljb259YClcbiAgICB9XG4gICAgc3VnZ2VzdGlvblskY2xhc3NdID0gY2xhc3NOYW1lLmpvaW4oJyAnKVxuICB9XG5cbiAgcmV0dXJuIHN1Z2dlc3Rpb25zLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0Vycm9yKG1lc3NhZ2U6IEVycm9yIHwgc3RyaW5nLCBkZXRhaWw6ID9zdHJpbmcgPSBudWxsKSB7XG4gIGlmIChtZXNzYWdlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICBkZXRhaWwgPSBtZXNzYWdlLnN0YWNrXG4gICAgbWVzc2FnZSA9IG1lc3NhZ2UubWVzc2FnZVxuICB9XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgW0ludGVudGlvbnNdICR7bWVzc2FnZX1gLCB7XG4gICAgZGV0YWlsLFxuICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcG9zYWJsZUV2ZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKVxuICByZXR1cm4gbmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9wcGluZ0V2ZW50KGNhbGxiYWNrOiAoKGV2ZW50OiBFdmVudCkgPT4gYW55KSk6ICgoZXZlbnQ6IEV2ZW50KSA9PiB2b2lkKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXZlbnQ6IEV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKClcbiAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGV2ZW50KVxuICB9XG59XG4iXX0=