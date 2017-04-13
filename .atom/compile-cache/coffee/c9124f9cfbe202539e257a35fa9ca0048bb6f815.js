(function() {
  var DotinstallNavigationView, DotinstallPaneView, shell,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.$ = window.jQuery = require('../node_modules/jquery');

  shell = require('shell');

  DotinstallNavigationView = require('./dotinstall-navigation-view.coffee');

  module.exports = DotinstallPaneView = (function() {
    DotinstallPaneView.HANDLE_WIDTH = 8;

    DotinstallPaneView.DEFAULT_PANE_WIDTH = 640;

    DotinstallPaneView.USER_AGENT = 'DotinstallAtomPane/1.0.3';

    function DotinstallPaneView(serializedState) {
      this.stopLoading = bind(this.stopLoading, this);
      this.startLoading = bind(this.startLoading, this);
      this.fitHeight = bind(this.fitHeight, this);
      this.resizeDotinstallStopped = bind(this.resizeDotinstallStopped, this);
      this.resizeDotinstallPane = bind(this.resizeDotinstallPane, this);
      this.resizeDotinstallStarted = bind(this.resizeDotinstallStarted, this);
      var $element, $help, $main, $resizeHandle, url;
      this.resizing = false;
      this.element = document.createElement('div');
      this.webview = document.createElement('webview');
      this.webview.setAttribute('useragent', window.navigator.userAgent + ' ' + DotinstallPaneView.USER_AGENT);
      this.webview.addEventListener('new-window', (function(_this) {
        return function(e) {
          if (/^https?:\/\/dotinstall\.com\/(?!help\/415$)/.test(e.url)) {
            return _this.webview.src = e.url;
          } else {
            return shell.openExternal(e.url);
          }
        };
      })(this));
      this.webview.addEventListener('did-start-loading', (function(_this) {
        return function() {
          return _this.startLoading();
        };
      })(this));
      this.webview.addEventListener('did-stop-loading', (function(_this) {
        return function() {
          _this.navigation.setCanGoBack(_this.webview.canGoBack());
          _this.navigation.setCanGoForward(_this.webview.canGoForward());
          return _this.stopLoading();
        };
      })(this));
      $element = $(this.element).addClass('dotinstall-pane');
      $main = $('<div>').attr('id', 'dotinstall_pane_main').appendTo($element);
      $help = $('<div>').attr('id', 'dotinstall_pane_help').append($('<div class="help-body">').html(this.helpHtml())).on('click', function() {
        return $(this).fadeOut();
      }).appendTo($element);
      this.navigation = new DotinstallNavigationView(this.webview, $help);
      $main.append(this.navigation.getElement());
      if ((serializedState != null) && (serializedState.pane_width != null)) {
        this.paneWidth = serializedState.pane_width;
      } else {
        this.paneWidth = DotinstallPaneView.DEFAULT_PANE_WIDTH;
      }
      $('.dotinstall-pane').width(this.paneWidth);
      $main.width(this.paneWidth - DotinstallPaneView.HANDLE_WIDTH);
      url = 'http://dotinstall.com';
      if ((serializedState != null) && (serializedState.src != null)) {
        url = serializedState.src;
      }
      $(this.webview).attr('id', 'dotinstall_view').addClass('native-key-bindings').attr('src', url).appendTo($main);
      $resizeHandle = $('<div>').attr('id', 'dotinstall_resize_handle').on('mousedown', this.resizeDotinstallStarted).appendTo($element);
      this.loadingBar = $('<div>').attr('id', 'dotinstall_loading_bar').appendTo($main);
      $(document).on('mousemove', this.resizeDotinstallPane);
      $(document).on('mouseup', this.resizeDotinstallStopped);
      $(window).on('resize', this.fitHeight);
    }

    DotinstallPaneView.prototype.serialize = function() {
      return {
        src: this.webview.src,
        pane_width: this.paneWidth
      };
    };

    DotinstallPaneView.prototype.destroy = function() {
      return this.element.remove();
    };

    DotinstallPaneView.prototype.getElement = function() {
      return this.element;
    };

    DotinstallPaneView.prototype.reload = function() {
      return this.webview.reload();
    };

    DotinstallPaneView.prototype.resizeDotinstallStarted = function() {
      return this.resizing = true;
    };

    DotinstallPaneView.prototype.resizeDotinstallPane = function(arg) {
      var pageX, paneWidth, which;
      pageX = arg.pageX, which = arg.which;
      if (!(this.resizing && which === 1)) {
        return;
      }
      paneWidth = pageX;
      if (paneWidth < 510) {
        paneWidth = 510;
      }
      $('.dotinstall-pane').width(paneWidth);
      $('#dotinstall_pane_main').width(paneWidth - DotinstallPaneView.HANDLE_WIDTH);
      return this.paneWidth = paneWidth;
    };

    DotinstallPaneView.prototype.resizeDotinstallStopped = function() {
      if (!this.resizing) {
        return;
      }
      return this.resizing = false;
    };

    DotinstallPaneView.prototype.fitHeight = function() {
      return $(this.webview).height($('.dotinstall-pane').height());
    };

    DotinstallPaneView.prototype.startLoading = function() {
      var width;
      this.navigation.startLoading();
      width = 40 + Math.floor(Math.random() * 20);
      return this.loadingBar.show().animate({
        width: width + "%"
      }, 550);
    };

    DotinstallPaneView.prototype.stopLoading = function() {
      this.navigation.stopLoading();
      return this.loadingBar.animate({
        width: '100%'
      }, 180, (function(_this) {
        return function() {
          return _this.loadingBar.hide().width(0);
        };
      })(this));
    };

    DotinstallPaneView.prototype.helpHtml = function() {
      return ['<div class="close-help"><i class="fa fa-times fa-2x"></i></div>', '<dl>', '<dt>Open/Close</dt>', '<dd>Alt (Option) + Shift + D</dd>', '<dt>Play/Pause</dt>', '<dd>Alt (Option) + Shift + Enter</dd>', '<dt>Rewind 5 sec (5秒戻る)</dt>', '<dd>Alt (Option) + Shift + [</dd>', '<dt>Forword 5 sec (5秒進む)</dt>', '<dd>Alt (Option) + Shift + ]</dd>', '</dl>', '<p class="more-info">', '<a href="https://atom.io/packages/dotinstall-pane" target="_blank">https://atom.io/packages/dotinstall-pane</a>', '</p>'].join('');
    };

    return DotinstallPaneView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RvdGluc3RhbGwtcGFuZS9saWIvZG90aW5zdGFsbC1wYW5lLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxtREFBQTtJQUFBOztFQUFBLE1BQU0sQ0FBQyxDQUFQLEdBQVcsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsT0FBQSxDQUFRLHdCQUFSOztFQUMzQixLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0VBRVIsd0JBQUEsR0FBMkIsT0FBQSxDQUFRLHFDQUFSOztFQUUzQixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ0osa0JBQUMsQ0FBQSxZQUFELEdBQXNCOztJQUN0QixrQkFBQyxDQUFBLGtCQUFELEdBQXNCOztJQUN0QixrQkFBQyxDQUFBLFVBQUQsR0FBc0I7O0lBRVQsNEJBQUMsZUFBRDs7Ozs7OztBQUNYLFVBQUE7TUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksUUFBUSxDQUFDLGFBQVQsQ0FBdUIsU0FBdkI7TUFFWixJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsV0FBdEIsRUFBbUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFqQixHQUE2QixHQUE3QixHQUFtQyxrQkFBa0IsQ0FBQyxVQUF6RjtNQUtBLElBQUMsQ0FBQSxPQUFPLENBQUMsZ0JBQVQsQ0FBMEIsWUFBMUIsRUFBd0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFDdEMsSUFBRyw2Q0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxDQUFDLENBQUMsR0FBckQsQ0FBSDttQkFDRSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsR0FBZSxDQUFDLENBQUMsSUFEbkI7V0FBQSxNQUFB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Q0FlTyxFQWZQO0lBRFE7Ozs7O0FBeklaIiwic291cmNlc0NvbnRlbnQiOlsid2luZG93LiQgPSB3aW5kb3cualF1ZXJ5ID0gcmVxdWlyZSgnLi4vbm9kZV9tb2R1bGVzL2pxdWVyeScpXG5zaGVsbCA9IHJlcXVpcmUoJ3NoZWxsJylcblxuRG90aW5zdGFsbE5hdmlnYXRpb25WaWV3ID0gcmVxdWlyZSAnLi9kb3RpbnN0YWxsLW5hdmlnYXRpb24tdmlldy5jb2ZmZWUnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIERvdGluc3RhbGxQYW5lVmlld1xuICBASEFORExFX1dJRFRIICAgICAgID0gOFxuICBAREVGQVVMVF9QQU5FX1dJRFRIID0gNjQwXG4gIEBVU0VSX0FHRU5UICAgICAgICAgPSAnRG90aW5zdGFsbEF0b21QYW5lLzEuMC4zJ1xuXG4gIGNvbnN0cnVjdG9yOiAoc2VyaWFsaXplZFN0YXRlKSAtPlxuICAgIEByZXNpemluZyA9IGZhbHNlXG4gICAgQGVsZW1lbnQgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBAd2VidmlldyAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd3ZWJ2aWV3JylcblxuICAgIEB3ZWJ2aWV3LnNldEF0dHJpYnV0ZSgndXNlcmFnZW50Jywgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQgKyAnICcgKyBEb3RpbnN0YWxsUGFuZVZpZXcuVVNFUl9BR0VOVClcblxuICAgICMgQHdlYnZpZXcuYWRkRXZlbnRMaXN0ZW5lciAnZG9tLXJlYWR5JywgPT5cbiAgICAjICAgQHdlYnZpZXcub3BlbkRldlRvb2xzKClcblxuICAgIEB3ZWJ2aWV3LmFkZEV2ZW50TGlzdGVuZXIgJ25ldy13aW5kb3cnLCAoZSkgPT5cbiAgICAgIGlmIC9eaHR0cHM/OlxcL1xcL2RvdGluc3RhbGxcXC5jb21cXC8oPyFoZWxwXFwvNDE1JCkvLnRlc3QgZS51cmxcbiAgICAgICAgQHdlYnZpZXcuc3JjID0gZS51cmxcbiAgICAgIGVsc2VcbiAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKGUudXJsKVxuXG4gICAgQHdlYnZpZXcuYWRkRXZlbnRMaXN0ZW5lciAnZGlkLXN0YXJ0LWxvYWRpbmcnLCA9PlxuICAgICAgQHN0YXJ0TG9hZGluZygpXG5cbiAgICBAd2Vidmlldy5hZGRFdmVudExpc3RlbmVyICdkaWQtc3RvcC1sb2FkaW5nJywgPT5cbiAgICAgIEBuYXZpZ2F0aW9uLnNldENhbkdvQmFjayBAd2Vidmlldy5jYW5Hb0JhY2soKVxuICAgICAgQG5hdmlnYXRpb24uc2V0Q2FuR29Gb3J3YXJkIEB3ZWJ2aWV3LmNhbkdvRm9yd2FyZCgpXG4gICAgICBAc3RvcExvYWRpbmcoKVxuXG4gICAgJGVsZW1lbnQgPSAkKEBlbGVtZW50KS5hZGRDbGFzcygnZG90aW5zdGFsbC1wYW5lJylcblxuICAgICRtYWluID0gJCgnPGRpdj4nKVxuICAgICAgLmF0dHIoJ2lkJywgJ2RvdGluc3RhbGxfcGFuZV9tYWluJylcbiAgICAgIC5hcHBlbmRUbygkZWxlbWVudClcblxuICAgICRoZWxwID0gJCgnPGRpdj4nKVxuICAgICAgLmF0dHIoJ2lkJywgJ2RvdGluc3RhbGxfcGFuZV9oZWxwJylcbiAgICAgIC5hcHBlbmQoXG4gICAgICAgICQoJzxkaXYgY2xhc3M9XCJoZWxwLWJvZHlcIj4nKS5odG1sKEBoZWxwSHRtbCgpKVxuICAgICAgKS5vbihcbiAgICAgICAgJ2NsaWNrJywgLT4gJChAKS5mYWRlT3V0KClcbiAgICAgICkuYXBwZW5kVG8oJGVsZW1lbnQpXG5cbiAgICBAbmF2aWdhdGlvbiA9IG5ldyBEb3RpbnN0YWxsTmF2aWdhdGlvblZpZXcoQHdlYnZpZXcsICRoZWxwKVxuXG4gICAgJG1haW4uYXBwZW5kKEBuYXZpZ2F0aW9uLmdldEVsZW1lbnQoKSlcblxuICAgIGlmIHNlcmlhbGl6ZWRTdGF0ZT8gYW5kIHNlcmlhbGl6ZWRTdGF0ZS5wYW5lX3dpZHRoP1xuICAgICAgQHBhbmVXaWR0aCA9IHNlcmlhbGl6ZWRTdGF0ZS5wYW5lX3dpZHRoXG4gICAgZWxzZVxuICAgICAgQHBhbmVXaWR0aCA9IERvdGluc3RhbGxQYW5lVmlldy5ERUZBVUxUX1BBTkVfV0lEVEhcblxuICAgICQoJy5kb3RpbnN0YWxsLXBhbmUnKS53aWR0aChAcGFuZVdpZHRoKVxuXG4gICAgJG1haW4ud2lkdGgoQHBhbmVXaWR0aCAtIERvdGluc3RhbGxQYW5lVmlldy5IQU5ETEVfV0lEVEgpXG5cbiAgICB1cmwgPSAnaHR0cDovL2RvdGluc3RhbGwuY29tJ1xuXG4gICAgaWYgc2VyaWFsaXplZFN0YXRlPyBhbmQgc2VyaWFsaXplZFN0YXRlLnNyYz9cbiAgICAgIHVybCA9IHNlcmlhbGl6ZWRTdGF0ZS5zcmNcblxuICAgICQoQHdlYnZpZXcpXG4gICAgICAuYXR0cignaWQnLCAnZG90aW5zdGFsbF92aWV3JylcbiAgICAgIC5hZGRDbGFzcygnbmF0aXZlLWtleS1iaW5kaW5ncycpXG4gICAgICAuYXR0cignc3JjJywgdXJsKVxuICAgICAgLmFwcGVuZFRvKCRtYWluKVxuXG4gICAgJHJlc2l6ZUhhbmRsZSA9ICQoJzxkaXY+JylcbiAgICAgIC5hdHRyKCdpZCcsICdkb3RpbnN0YWxsX3Jlc2l6ZV9oYW5kbGUnKVxuICAgICAgLm9uKCdtb3VzZWRvd24nLCBAcmVzaXplRG90aW5zdGFsbFN0YXJ0ZWQpXG4gICAgICAuYXBwZW5kVG8oJGVsZW1lbnQpXG5cbiAgICBAbG9hZGluZ0JhciA9ICQoJzxkaXY+JylcbiAgICAgIC5hdHRyKCdpZCcsICdkb3RpbnN0YWxsX2xvYWRpbmdfYmFyJylcbiAgICAgIC5hcHBlbmRUbygkbWFpbilcblxuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZW1vdmUnLCBAcmVzaXplRG90aW5zdGFsbFBhbmUpXG4gICAgJChkb2N1bWVudCkub24oJ21vdXNldXAnLCBAcmVzaXplRG90aW5zdGFsbFN0b3BwZWQpXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBAZml0SGVpZ2h0KVxuXG4gICMgUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgcmV0cmlldmVkIHdoZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWRcbiAgc2VyaWFsaXplOiAtPlxuICAgIHtcbiAgICAgIHNyYzogQHdlYnZpZXcuc3JjXG4gICAgICBwYW5lX3dpZHRoOiBAcGFuZVdpZHRoXG4gICAgfVxuXG4gICMgVGVhciBkb3duIGFueSBzdGF0ZSBhbmQgZGV0YWNoXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGVsZW1lbnQucmVtb3ZlKClcblxuICBnZXRFbGVtZW50OiAtPlxuICAgIEBlbGVtZW50XG5cbiAgcmVsb2FkOiAtPlxuICAgIEB3ZWJ2aWV3LnJlbG9hZCgpXG5cbiAgcmVzaXplRG90aW5zdGFsbFN0YXJ0ZWQ6ID0+XG4gICAgQHJlc2l6aW5nID0gdHJ1ZVxuXG4gIHJlc2l6ZURvdGluc3RhbGxQYW5lOiAoe3BhZ2VYLCB3aGljaH0pID0+XG4gICAgcmV0dXJuIHVubGVzcyBAcmVzaXppbmcgYW5kIHdoaWNoIGlzIDFcblxuICAgIHBhbmVXaWR0aCA9IHBhZ2VYXG5cbiAgICBpZiBwYW5lV2lkdGggPCA1MTBcbiAgICAgIHBhbmVXaWR0aCA9IDUxMFxuXG4gICAgJCgnLmRvdGluc3RhbGwtcGFuZScpLndpZHRoKHBhbmVXaWR0aClcbiAgICAkKCcjZG90aW5zdGFsbF9wYW5lX21haW4nKS53aWR0aChwYW5lV2lkdGggLSBEb3RpbnN0YWxsUGFuZVZpZXcuSEFORExFX1dJRFRIKVxuXG4gICAgQHBhbmVXaWR0aCA9IHBhbmVXaWR0aFxuXG4gIHJlc2l6ZURvdGluc3RhbGxTdG9wcGVkOiA9PlxuICAgIHJldHVybiB1bmxlc3MgQHJlc2l6aW5nXG5cbiAgICBAcmVzaXppbmcgPSBmYWxzZVxuXG4gIGZpdEhlaWdodDogPT5cbiAgICAkKEB3ZWJ2aWV3KS5oZWlnaHQoJCgnLmRvdGluc3RhbGwtcGFuZScpLmhlaWdodCgpKVxuXG4gIHN0YXJ0TG9hZGluZzogPT5cbiAgICBAbmF2aWdhdGlvbi5zdGFydExvYWRpbmcoKVxuICAgIHdpZHRoID0gNDAgKyBNYXRoLmZsb29yIE1hdGgucmFuZG9tKCkgKiAyMFxuICAgIEBsb2FkaW5nQmFyLnNob3coKS5hbmltYXRlIHdpZHRoOiBcIiN7d2lkdGh9JVwiLCA1NTBcblxuICBzdG9wTG9hZGluZzogPT5cbiAgICBAbmF2aWdhdGlvbi5zdG9wTG9hZGluZygpXG4gICAgQGxvYWRpbmdCYXIuYW5pbWF0ZSB3aWR0aDogJzEwMCUnLCAxODAsID0+XG4gICAgICBAbG9hZGluZ0Jhci5oaWRlKCkud2lkdGgoMClcblxuICBoZWxwSHRtbDogLT5cbiAgICBbXG4gICAgICAnPGRpdiBjbGFzcz1cImNsb3NlLWhlbHBcIj48aSBjbGFzcz1cImZhIGZhLXRpbWVzIGZhLTJ4XCI+PC9pPjwvZGl2PicsXG4gICAgICAnPGRsPicsXG4gICAgICAnPGR0Pk9wZW4vQ2xvc2U8L2R0PicsXG4gICAgICAnPGRkPkFsdCAoT3B0aW9uKSArIFNoaWZ0ICsgRDwvZGQ+JyxcbiAgICAgICc8ZHQ+UGxheS9QYXVzZTwvZHQ+JyxcbiAgICAgICc8ZGQ+QWx0IChPcHRpb24pICsgU2hpZnQgKyBFbnRlcjwvZGQ+JyxcbiAgICAgICc8ZHQ+UmV3aW5kIDUgc2VjICg156eS5oi744KLKTwvZHQ+JyxcbiAgICAgICc8ZGQ+QWx0IChPcHRpb24pICsgU2hpZnQgKyBbPC9kZD4nLFxuICAgICAgJzxkdD5Gb3J3b3JkIDUgc2VjICg156eS6YCy44KAKTwvZHQ+JyxcbiAgICAgICc8ZGQ+QWx0IChPcHRpb24pICsgU2hpZnQgKyBdPC9kZD4nLFxuICAgICAgJzwvZGw+JyxcbiAgICAgICc8cCBjbGFzcz1cIm1vcmUtaW5mb1wiPicsXG4gICAgICAnPGEgaHJlZj1cImh0dHBzOi8vYXRvbS5pby9wYWNrYWdlcy9kb3RpbnN0YWxsLXBhbmVcIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL2F0b20uaW8vcGFja2FnZXMvZG90aW5zdGFsbC1wYW5lPC9hPicsXG4gICAgICAnPC9wPidcbiAgICBdLmpvaW4oJycpXG4iXX0=
