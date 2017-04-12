(function() {
  var DotinstallNavigationView,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.$ = window.jQuery = require('../node_modules/jquery');

  module.exports = DotinstallNavigationView = (function() {
    function DotinstallNavigationView(webview, help) {
      this.stopLoading = bind(this.stopLoading, this);
      this.startLoading = bind(this.startLoading, this);
      this.openHelp = bind(this.openHelp, this);
      this.webview = webview;
      this.help = help;
      this.element = $('<div>').addClass('dotinstall-navigation');
      this.backButton = this.createBackButton();
      this.forwardButton = this.createForwardButton();
      this.reloadButton = this.createReloadButton();
      this.helpButton = this.createHelpButton();
      this.element.append(this.backButton).append(this.forwardButton).append(this.reloadButton).append(this.helpButton);
    }

    DotinstallNavigationView.prototype.createBackButton = function() {
      return this.createButton().addClass('disabled').append('<i class="fa fa-chevron-left">').on('click', (function(_this) {
        return function() {
          return _this.goBack();
        };
      })(this));
    };

    DotinstallNavigationView.prototype.createForwardButton = function() {
      return this.createButton().addClass('disabled').append('<i class="fa fa-chevron-right">').on('click', (function(_this) {
        return function() {
          return _this.goForward();
        };
      })(this));
    };

    DotinstallNavigationView.prototype.createReloadButton = function() {
      return this.createButton().append('<i class="fa fa-refresh">').on('click', (function(_this) {
        return function() {
          return _this.reload();
        };
      })(this));
    };

    DotinstallNavigationView.prototype.createHelpButton = function() {
      return this.createButton().addClass('pull-right').addClass('help-button').append('<i class="fa fa-question fa-lg">').on('click', (function(_this) {
        return function() {
          return _this.openHelp();
        };
      })(this));
    };

    DotinstallNavigationView.prototype.createButton = function() {
      return $('<button>').addClass('dotinstall-navigation-back').on('mousedown', function() {
        return $(this).addClass('pushed');
      }).on('mouseup', function() {
        return $(this).removeClass('pushed');
      }).on('mouseleave', function() {
        return $(this).removeClass('pushed');
      });
    };

    DotinstallNavigationView.prototype.getElement = function() {
      return this.element;
    };

    DotinstallNavigationView.prototype.goBack = function() {
      return this.webview.executeJavaScript('history.back()');
    };

    DotinstallNavigationView.prototype.goForward = function() {
      return this.webview.executeJavaScript('history.forward()');
    };

    DotinstallNavigationView.prototype.reload = function() {
      return this.webview.executeJavaScript('location.reload()');
    };

    DotinstallNavigationView.prototype.openHelp = function() {
      return this.help.fadeIn();
    };

    DotinstallNavigationView.prototype.startLoading = function() {
      return this.reloadButton.find('i').addClass('fa-spin');
    };

    DotinstallNavigationView.prototype.stopLoading = function() {
      return this.reloadButton.find('i').removeClass('fa-spin');
    };

    DotinstallNavigationView.prototype.setCanGoBack = function(can) {
      if (can) {
        return this.backButton.removeClass('disabled');
      } else {
        return this.backButton.addClass('disabled');
      }
    };

    DotinstallNavigationView.prototype.setCanGoForward = function(can) {
      if (can) {
        return this.forwardButton.removeClass('disabled');
      } else {
        return this.forwardButton.addClass('disabled');
      }
    };

    return DotinstallNavigationView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RvdGluc3RhbGwtcGFuZS9saWIvZG90aW5zdGFsbC1uYXZpZ2F0aW9uLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBOztFQUFBLE1BQU0sQ0FBQyxDQUFQLEdBQVcsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsT0FBQSxDQUFRLHdCQUFSOztFQUUzQixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1Msa0NBQUMsT0FBRCxFQUFVLElBQVY7Ozs7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXO01BQ1gsSUFBQyxDQUFBLElBQUQsR0FBVztNQUVYLElBQUMsQ0FBQSxPQUFELEdBQVcsQ0FBQSxDQUFFLE9BQUYsQ0FBVSxDQUFDLFFBQVgsQ0FBb0IsdUJBQXBCO01BRVgsSUFBQyxDQUFBLFVBQUQsR0FBaUIsSUFBQyxDQUFBLGdCQUFELENBQUE7TUFDakIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLG1CQUFELENBQUE7TUFDakIsSUFBQyxDQUFBLFlBQUQsR0FBaUIsSUFBQyxDQUFBLGtCQUFELENBQUE7TUFDakIsSUFBQyxDQUFBLFVBQUQsR0FBaUIsSUFBQyxDQUFBLGdCQUFELENBQUE7TUFFakIsSUFBQyxDQUFBLE9BQ0MsQ0FBQyxNQURILENBQ1UsSUFBQyxDQUFBLFVBRFgsQ0FFRSxDQUFDLE1BRkgsQ0FFVSxJQUFDLENBQUEsYUFGWCxDQUdFLENBQUMsTUFISCxDQUdVLElBQUMsQ0FBQSxZQUhYLENBSUUsQ0FBQyxNQUpILENBSVUsSUFBQyxDQUFBLFVBSlg7SUFYVzs7dUNBaUJiLGdCQUFBLEdBQWtCLFNBQUE7YUFDaEIsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUNFLENBQUMsUUFESCxDQUNZLFVBRFosQ0FFRSxDQUFDLE1BRkgsQ0FFVSxnQ0FGVixDQUdFLENBQUMsRUFI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QURZOzt1Q0FNZCxlQUFBLEdBQWlCLFNBQUMsR0FBRDtNQUNmLElBQUcsR0FBSDtlQUNFLElBQUMsQ0FBQSxhQUFhLENBQUMsV0FBZixDQUEyQixVQUEzQixFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxhQUFhLENBQUMsUUFBZixDQUF3QixVQUF4QixFQUhGOztJQURlOzs7OztBQXRGbkIiLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cuJCA9IHdpbmRvdy5qUXVlcnkgPSByZXF1aXJlKCcuLi9ub2RlX21vZHVsZXMvanF1ZXJ5JylcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRG90aW5zdGFsbE5hdmlnYXRpb25WaWV3XG4gIGNvbnN0cnVjdG9yOiAod2VidmlldywgaGVscCkgLT5cbiAgICBAd2VidmlldyA9IHdlYnZpZXdcbiAgICBAaGVscCAgICA9IGhlbHBcblxuICAgIEBlbGVtZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnZG90aW5zdGFsbC1uYXZpZ2F0aW9uJylcblxuICAgIEBiYWNrQnV0dG9uICAgID0gQGNyZWF0ZUJhY2tCdXR0b24oKVxuICAgIEBmb3J3YXJkQnV0dG9uID0gQGNyZWF0ZUZvcndhcmRCdXR0b24oKVxuICAgIEByZWxvYWRCdXR0b24gID0gQGNyZWF0ZVJlbG9hZEJ1dHRvbigpXG4gICAgQGhlbHBCdXR0b24gICAgPSBAY3JlYXRlSGVscEJ1dHRvbigpXG5cbiAgICBAZWxlbWVudFxuICAgICAgLmFwcGVuZChAYmFja0J1dHRvbilcbiAgICAgIC5hcHBlbmQoQGZvcndhcmRCdXR0b24pXG4gICAgICAuYXBwZW5kKEByZWxvYWRCdXR0b24pXG4gICAgICAuYXBwZW5kKEBoZWxwQnV0dG9uKVxuXG4gIGNyZWF0ZUJhY2tCdXR0b246IC0+XG4gICAgQGNyZWF0ZUJ1dHRvbigpXG4gICAgICAuYWRkQ2xhc3MoJ2Rpc2FibGVkJylcbiAgICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi1sZWZ0XCI+JylcbiAgICAgIC5vbiAnY2xpY2snLCA9PlxuICAgICAgICBAZ29CYWNrKClcblxuICBjcmVhdGVGb3J3YXJkQnV0dG9uOiAtPlxuICAgIEBjcmVhdGVCdXR0b24oKVxuICAgICAgLmFkZENsYXNzKCdkaXNhYmxlZCcpXG4gICAgICAuYXBwZW5kKCc8aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tcmlnaHRcIj4nKVxuICAgICAgLm9uICdjbGljaycsID0+XG4gICAgICAgIEBnb0ZvcndhcmQoKVxuXG4gIGNyZWF0ZVJlbG9hZEJ1dHRvbjogLT5cbiAgICBAY3JlYXRlQnV0dG9uKClcbiAgICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtcmVmcmVzaFwiPicpXG4gICAgICAub24gJ2NsaWNrJywgPT5cbiAgICAgICAgQHJlbG9hZCgpXG5cbiAgY3JlYXRlSGVscEJ1dHRvbjogLT5cbiAgICBAY3JlYXRlQnV0dG9uKClcbiAgICAgIC5hZGRDbGFzcygncHVsbC1yaWdodCcpXG4gICAgICAuYWRkQ2xhc3MoJ2hlbHAtYnV0dG9uJylcbiAgICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtcXVlc3Rpb24gZmEtbGdcIj4nKVxuICAgICAgLm9uICdjbGljaycsID0+XG4gICAgICAgIEBvcGVuSGVscCgpXG5cbiAgY3JlYXRlQnV0dG9uOiAtPlxuICAgICQoJzxidXR0b24+JylcbiAgICAgIC5hZGRDbGFzcyAnZG90aW5zdGFsbC1uYXZpZ2F0aW9uLWJhY2snXG4gICAgICAub24gJ21vdXNlZG93bicsIC0+XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3B1c2hlZCcpXG4gICAgICAub24gJ21vdXNldXAnLCAtPlxuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdwdXNoZWQnKVxuICAgICAgLm9uICdtb3VzZWxlYXZlJywgLT5cbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygncHVzaGVkJylcblxuICBnZXRFbGVtZW50OiAtPlxuICAgIEBlbGVtZW50XG5cbiAgZ29CYWNrOiAtPlxuICAgIEB3ZWJ2aWV3LmV4ZWN1dGVKYXZhU2NyaXB0ICdoaXN0b3J5LmJhY2soKSdcblxuICBnb0ZvcndhcmQ6IC0+XG4gICAgQHdlYnZpZXcuZXhlY3V0ZUphdmFTY3JpcHQgJ2hpc3RvcnkuZm9yd2FyZCgpJ1xuXG4gIHJlbG9hZDogLT5cbiAgICBAd2Vidmlldy5leGVjdXRlSmF2YVNjcmlwdCAnbG9jYXRpb24ucmVsb2FkKCknXG5cbiAgb3BlbkhlbHA6ID0+XG4gICAgQGhlbHAuZmFkZUluKClcblxuICBzdGFydExvYWRpbmc6ID0+XG4gICAgQHJlbG9hZEJ1dHRvbi5maW5kKCdpJykuYWRkQ2xhc3MoJ2ZhLXNwaW4nKVxuXG4gIHN0b3BMb2FkaW5nOiA9PlxuICAgIEByZWxvYWRCdXR0b24uZmluZCgnaScpLnJlbW92ZUNsYXNzKCdmYS1zcGluJylcblxuICBzZXRDYW5Hb0JhY2s6IChjYW4pIC0+XG4gICAgaWYgY2FuXG4gICAgICBAYmFja0J1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxuICAgIGVsc2VcbiAgICAgIEBiYWNrQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpXG5cbiAgc2V0Q2FuR29Gb3J3YXJkOiAoY2FuKSAtPlxuICAgIGlmIGNhblxuICAgICAgQGZvcndhcmRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJylcbiAgICBlbHNlXG4gICAgICBAZm9yd2FyZEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKVxuIl19
