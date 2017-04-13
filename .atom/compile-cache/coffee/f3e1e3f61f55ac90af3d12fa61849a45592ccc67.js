(function() {
  var JumpyView;

  JumpyView = require('./jumpy-view');

  module.exports = {
    jumpyView: null,
    config: {
      fontSize: {
        description: 'The font size of jumpy labels.',
        type: 'number',
        "default": .75,
        minimum: 0,
        maximum: 1
      },
      highContrast: {
        description: 'This will display a high contrast label, usually green.  It is dynamic per theme.',
        type: 'boolean',
        "default": false
      },
      useHomingBeaconEffectOnJumps: {
        description: 'This will animate a short lived homing beacon upon jump.  It is *temporarily* not working due to architectural changes in Atom.',
        type: 'boolean',
        "default": true
      },
      matchPattern: {
        description: 'Jumpy will create labels based on this pattern.',
        type: 'string',
        "default": '([A-Z]+([0-9a-z])*)|[a-z0-9]{2,}'
      }
    },
    activate: function(state) {
      return this.jumpyView = new JumpyView(state.jumpyViewState);
    },
    deactivate: function() {
      this.jumpyView.destroy();
      return this.jumpyView = null;
    },
    serialize: function() {
      return {
        jumpyViewState: this.jumpyView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2p1bXB5L2xpYi9qdW1weS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsU0FBQSxFQUFXLElBQVg7SUFDQSxNQUFBLEVBQ0k7TUFBQSxRQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWEsZ0NBQWI7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsR0FGVDtRQUdBLE9BQUEsRUFBUyxDQUhUO1FBSUEsT0FBQSxFQUFTLENBSlQ7T0FESjtNQU1BLFlBQUEsRUFDSTtRQUFBLFdBQUEsRUFBYSxtRkFBYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO09BUEo7TUFXQSw0QkFBQSxFQUNJO1FBQUEsV0FBQSxFQUFhLGlJQUFiO1FBR0EsSUFBQSxFQUFNLFNBSE47UUFJQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSlQ7T0FaSjtNQWlCQSxZQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWEsaURBQWI7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsa0NBRlQ7T0FsQko7S0FGSjtJQXdCQSxRQUFBLEVBQVUsU0FBQyxLQUFEO2FBQ04sSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxTQUFBLENBQVUsS0FBSyxDQUFDLGNBQWhCO0lBRFgsQ0F4QlY7SUEyQkEsVUFBQSxFQUFZLFNBQUE7TUFDUixJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFGTCxDQTNCWjtJQStCQSxTQUFBLEVBQVcsU0FBQTthQUNQO1FBQUEsY0FBQSxFQUFnQixJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBQSxDQUFoQjs7SUFETyxDQS9CWDs7QUFISiIsInNvdXJjZXNDb250ZW50IjpbIkp1bXB5VmlldyA9IHJlcXVpcmUgJy4vanVtcHktdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIGp1bXB5VmlldzogbnVsbFxuICAgIGNvbmZpZzpcbiAgICAgICAgZm9udFNpemU6XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb250IHNpemUgb2YganVtcHkgbGFiZWxzLidcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICAgICAgICBkZWZhdWx0OiAuNzVcbiAgICAgICAgICAgIG1pbmltdW06IDBcbiAgICAgICAgICAgIG1heGltdW06IDFcbiAgICAgICAgaGlnaENvbnRyYXN0OlxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIHdpbGwgZGlzcGxheSBhIGhpZ2ggY29udHJhc3QgbGFiZWwsXG4gICAgICAgICAgICB1c3VhbGx5IGdyZWVuLiAgSXQgaXMgZHluYW1pYyBwZXIgdGhlbWUuJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB1c2VIb21pbmdCZWFjb25FZmZlY3RPbkp1bXBzOlxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIHdpbGwgYW5pbWF0ZSBhIHNob3J0IGxpdmVkIGhvbWluZyBiZWFjb24gdXBvblxuICAgICAgICAgICAganVtcC4gIEl0IGlzICp0ZW1wb3JhcmlseSogbm90IHdvcmtpbmcgZHVlIHRvIGFyY2hpdGVjdHVyYWxcbiAgICAgICAgICAgIGNoYW5nZXMgaW4gQXRvbS4nXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgbWF0Y2hQYXR0ZXJuOlxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdKdW1weSB3aWxsIGNyZWF0ZSBsYWJlbHMgYmFzZWQgb24gdGhpcyBwYXR0ZXJuLidcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBkZWZhdWx0OiAnKFtBLVpdKyhbMC05YS16XSkqKXxbYS16MC05XXsyLH0nXG5cbiAgICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICAgICBAanVtcHlWaWV3ID0gbmV3IEp1bXB5VmlldyBzdGF0ZS5qdW1weVZpZXdTdGF0ZVxuXG4gICAgZGVhY3RpdmF0ZTogLT5cbiAgICAgICAgQGp1bXB5Vmlldy5kZXN0cm95KClcbiAgICAgICAgQGp1bXB5VmlldyA9IG51bGxcblxuICAgIHNlcmlhbGl6ZTogLT5cbiAgICAgICAganVtcHlWaWV3U3RhdGU6IEBqdW1weVZpZXcuc2VyaWFsaXplKClcbiJdfQ==
