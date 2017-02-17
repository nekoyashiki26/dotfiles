(function() {
  var Range, Validate, helpers;

  Range = require('atom').Range;

  helpers = require('./helpers');

  module.exports = Validate = {
    linter: function(linter, indie) {
      if (indie == null) {
        indie = false;
      }
      if (!indie) {
        if (!(linter.grammarScopes instanceof Array)) {
          throw new Error("grammarScopes is not an Array. Got: " + linter.grammarScopes);
        }
        if (linter.lint) {
          if (typeof linter.lint !== 'function') {
            throw new Error("linter.lint isn't a function on provider");
          }
        } else {
          throw new Error('Missing linter.lint on provider');
        }
        if (linter.scope && typeof linter.scope === 'string') {
          linter.scope = linter.scope.toLowerCase();
        }
        if (linter.scope !== 'file' && linter.scope !== 'project') {
          throw new Error('Linter.scope must be either `file` or `project`');
        }
      }
      if (linter.name) {
        if (typeof linter.name !== 'string') {
          throw new Error('Linter.name must be a string');
        }
      } else {
        linter.name = null;
      }
      return true;
    },
    messages: function(messages, linter) {
      if (!(messages instanceof Array)) {
        throw new Error("Expected messages to be array, provided: " + (typeof messages));
      }
      if (!linter) {
        throw new Error('No linter provided');
      }
      messages.forEach(function(result) {
        if (result.type) {
          if (typeof result.type !== 'string') {
            throw new Error('Invalid type field on Linter Response');
          }
        } else {
          throw new Error('Missing type field on Linter Response');
        }
        if (result.html) {
          if (typeof result.text === 'string') {
            throw new Error('Got both html and text fields on Linter Response, expecting only one');
          }
          if (typeof result.html !== 'string' && !(result.html instanceof HTMLElement)) {
            throw new Error('Invalid html field on Linter Response');
          }
          result.text = null;
        } else if (result.text) {
          if (typeof result.text !== 'string') {
            throw new Error('Invalid text field on Linter Response');
          }
          result.html = null;
        } else {
          throw new Error('Missing html/text field on Linter Response');
        }
        if (result.trace) {
          if (!(result.trace instanceof Array)) {
            throw new Error('Invalid trace field on Linter Response');
          }
        } else {
          result.trace = null;
        }
        if (result["class"]) {
          if (typeof result["class"] !== 'string') {
            throw new Error('Invalid class field on Linter Response');
          }
        } else {
          result["class"] = result.type.toLowerCase().replace(' ', '-');
        }
        if (result.filePath) {
          if (typeof result.filePath !== 'string') {
            throw new Error('Invalid filePath field on Linter response');
          }
        } else {
          result.filePath = null;
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result.key = helpers.messageKey(result);
        result.linter = linter.name;
        if (result.trace && result.trace.length) {
          return Validate.messages(result.trace, linter);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmFsaWRhdGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSOztFQUNWLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUjs7RUFFVixNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFBLEdBQ2Y7SUFBQSxNQUFBLEVBQVEsU0FBQyxNQUFELEVBQVMsS0FBVDs7UUFBUyxRQUFROztNQUN2QixJQUFBLENBQU8sS0FBUDtRQUNFLElBQUEsQ0FBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLFlBQWdDLEtBQXZDLENBQUE7QUFDRSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSxzQ0FBQSxHQUF1QyxNQUFNLENBQUMsYUFBcEQsRUFEWjs7UUFFQSxJQUFHLE1BQU0sQ0FBQyxJQUFWO1VBQ0UsSUFBK0QsT0FBTyxNQUFNLENBQUMsSUFBZCxLQUF3QixVQUF2RjtBQUFBLGtCQUFVLElBQUEsS0FBQSxDQUFNLDBDQUFOLEVBQVY7V0FERjtTQUFBLE1BQUE7QUFHRSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSxpQ0FBTixFQUhaOztRQUlBLElBQUcsTUFBTSxDQUFDLEtBQVAsSUFBaUIsT0FBTyxNQUFNLENBQUMsS0FBZCxLQUF1QixRQUEzQztVQUNFLE1BQU0sQ0FBQyxLQUFQLEdBQWUsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFiLENBQUEsRUFEakI7O1FBRUEsSUFBc0UsTUFBTSxDQUFDLEtBQVAsS0FBa0IsTUFBbEIsSUFBNkIsTUFBTSxDQUFDLEtBQVAsS0FBa0IsU0FBckg7QUFBQSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSxpREFBTixFQUFWO1NBVEY7O01BVUEsSUFBRyxNQUFNLENBQUMsSUFBVjtRQUNFLElBQW1ELE9BQU8sTUFBTSxDQUFDLElBQWQsS0FBd0IsUUFBM0U7QUFBQSxnQkFBVSxJ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QjtJQUpRLENBakJWOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie1JhbmdlfSA9IHJlcXVpcmUoJ2F0b20nKVxuaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpXG5cbm1vZHVsZS5leHBvcnRzID0gVmFsaWRhdGUgPVxuICBsaW50ZXI6IChsaW50ZXIsIGluZGllID0gZmFsc2UpIC0+XG4gICAgdW5sZXNzIGluZGllXG4gICAgICB1bmxlc3MgbGludGVyLmdyYW1tYXJTY29wZXMgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJncmFtbWFyU2NvcGVzIGlzIG5vdCBhbiBBcnJheS4gR290OiAje2xpbnRlci5ncmFtbWFyU2NvcGVzfVwiKVxuICAgICAgaWYgbGludGVyLmxpbnRcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibGludGVyLmxpbnQgaXNuJ3QgYSBmdW5jdGlvbiBvbiBwcm92aWRlclwiKSBpZiB0eXBlb2YgbGludGVyLmxpbnQgaXNudCAnZnVuY3Rpb24nXG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBsaW50ZXIubGludCBvbiBwcm92aWRlcicpXG4gICAgICBpZiBsaW50ZXIuc2NvcGUgYW5kIHR5cGVvZiBsaW50ZXIuc2NvcGUgaXMgJ3N0cmluZydcbiAgICAgICAgbGludGVyLnNjb3BlID0gbGludGVyLnNjb3BlLnRvTG93ZXJDYXNlKClcbiAgICAgIHRocm93IG5ldyBFcnJvcignTGludGVyLnNjb3BlIG11c3QgYmUgZWl0aGVyIGBmaWxlYCBvciBgcHJvamVjdGAnKSBpZiBsaW50ZXIuc2NvcGUgaXNudCAnZmlsZScgYW5kIGxpbnRlci5zY29wZSBpc250ICdwcm9qZWN0J1xuICAgIGlmIGxpbnRlci5uYW1lXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xpbnRlci5uYW1lIG11c3QgYmUgYSBzdHJpbmcnKSBpZiB0eXBlb2YgbGludGVyLm5hbWUgaXNudCAnc3RyaW5nJ1xuICAgIGVsc2VcbiAgICAgIGxpbnRlci5uYW1lID0gbnVsbFxuICAgIHJldHVybiB0cnVlXG5cbiAgbWVzc2FnZXM6IChtZXNzYWdlcywgbGludGVyKSAtPlxuICAgIHVubGVzcyBtZXNzYWdlcyBpbnN0YW5jZW9mIEFycmF5XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBtZXNzYWdlcyB0byBiZSBhcnJheSwgcHJvdmlkZWQ6ICN7dHlwZW9mIG1lc3NhZ2VzfVwiKVxuICAgIHRocm93IG5ldyBFcnJvciAnTm8gbGludGVyIHByb3ZpZGVkJyB1bmxlc3MgbGludGVyXG4gICAgbWVzc2FnZXMuZm9yRWFjaCAocmVzdWx0KSAtPlxuICAgICAgaWYgcmVzdWx0LnR5cGVcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yICdJbnZhbGlkIHR5cGUgZmllbGQgb24gTGludGVyIFJlc3BvbnNlJyBpZiB0eXBlb2YgcmVzdWx0LnR5cGUgaXNudCAnc3RyaW5nJ1xuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ01pc3NpbmcgdHlwZSBmaWVsZCBvbiBMaW50ZXIgUmVzcG9uc2UnXG4gICAgICBpZiByZXN1bHQuaHRtbFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ0dvdCBib3RoIGh0bWwgYW5kIHRleHQgZmllbGRzIG9uIExpbnRlciBSZXNwb25zZSwgZXhwZWN0aW5nIG9ubHkgb25lJyBpZiB0eXBlb2YgcmVzdWx0LnRleHQgaXMgJ3N0cmluZydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yICdJbnZhbGlkIGh0bWwgZmllbGQgb24gTGludGVyIFJlc3BvbnNlJyBpZiB0eXBlb2YgcmVzdWx0Lmh0bWwgaXNudCAnc3RyaW5nJyBhbmQgbm90IChyZXN1bHQuaHRtbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICByZXN1bHQudGV4dCA9IG51bGxcbiAgICAgIGVsc2UgaWYgcmVzdWx0LnRleHRcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yICdJbnZhbGlkIHRleHQgZmllbGQgb24gTGludGVyIFJlc3BvbnNlJyBpZiB0eXBlb2YgcmVzdWx0LnRleHQgaXNudCAnc3RyaW5nJ1xuICAgICAgICByZXN1bHQuaHRtbCA9IG51bGxcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yICdNaXNzaW5nIGh0bWwvdGV4dCBmaWVsZCBvbiBMaW50ZXIgUmVzcG9uc2UnXG4gICAgICBpZiByZXN1bHQudHJhY2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yICdJbnZhbGlkIHRyYWNlIGZpZWxkIG9uIExpbnRlciBSZXNwb25zZScgdW5sZXNzIHJlc3VsdC50cmFjZSBpbnN0YW5jZW9mIEFycmF5XG4gICAgICBlbHNlIHJlc3VsdC50cmFjZSA9IG51bGxcbiAgICAgIGlmIHJlc3VsdC5jbGFzc1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ0ludmFsaWQgY2xhc3MgZmllbGQgb24gTGludGVyIFJlc3BvbnNlJyBpZiB0eXBlb2YgcmVzdWx0LmNsYXNzIGlzbnQgJ3N0cmluZydcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzdWx0LmNsYXNzID0gcmVzdWx0LnR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcgJywgJy0nKVxuICAgICAgaWYgcmVzdWx0LmZpbGVQYXRoXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBmaWxlUGF0aCBmaWVsZCBvbiBMaW50ZXIgcmVzcG9uc2UnKSBpZiB0eXBlb2YgcmVzdWx0LmZpbGVQYXRoIGlzbnQgJ3N0cmluZydcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzdWx0LmZpbGVQYXRoID0gbnVsbFxuICAgICAgcmVzdWx0LnJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdCByZXN1bHQucmFuZ2UgaWYgcmVzdWx0LnJhbmdlP1xuICAgICAgcmVzdWx0LmtleSA9IGhlbHBlcnMubWVzc2FnZUtleShyZXN1bHQpXG4gICAgICByZXN1bHQubGludGVyID0gbGludGVyLm5hbWVcbiAgICAgIFZhbGlkYXRlLm1lc3NhZ2VzKHJlc3VsdC50cmFjZSwgbGludGVyKSBpZiByZXN1bHQudHJhY2UgYW5kIHJlc3VsdC50cmFjZS5sZW5ndGhcbiAgICByZXR1cm5cbiJdfQ==
