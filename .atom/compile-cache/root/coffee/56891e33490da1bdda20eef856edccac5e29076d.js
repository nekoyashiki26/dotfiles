(function() {
  var Disposable, Linter;

  Disposable = require('atom').Disposable;

  module.exports = Linter = {
    instance: null,
    config: {
      lintOnFly: {
        title: 'Lint As You Type',
        description: 'Lint files while typing, without the need to save',
        type: 'boolean',
        "default": true,
        order: 1
      },
      lintOnFlyInterval: {
        title: 'Lint As You Type Interval',
        description: 'Interval at which providers are triggered as you type (in ms)',
        type: 'integer',
        "default": 300,
        order: 1
      },
      ignoredMessageTypes: {
        description: 'Comma separated list of message types to completely ignore',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        order: 2
      },
      ignoreVCSIgnoredFiles: {
        title: 'Do Not Lint Files Ignored by VCS',
        description: 'E.g., ignore files specified in .gitignore',
        type: 'boolean',
        "default": true,
        order: 2
      },
      ignoreMatchedFiles: {
        title: 'Do Not Lint Files that match this Glob',
        type: 'string',
        "default": '/**/*.min.{js,css}',
        order: 2
      },
      showErrorInline: {
        title: 'Show Inline Error Tooltips',
        type: 'boolean',
        "default": true,
        order: 3
      },
      inlineTooltipInterval: {
        title: 'Inline Tooltip Interval',
        description: 'Interval at which inline tooltip is updated (in ms)',
        type: 'integer',
        "default": 60,
        order: 3
      },
      gutterEnabled: {
        title: 'Highlight Error Lines in Gutter',
        type: 'boolean',
        "default": true,
        order: 3
      },
      gutterPosition: {
        title: 'Position of Gutter Highlights',
        "enum": ['Left', 'Right'],
        "default": 'Right',
        order: 3,
        type: 'string'
      },
      underlineIssues: {
        title: 'Underline Issues',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showProviderName: {
        title: 'Show Provider Name (When Available)',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showErrorPanel: {
        title: 'Show Error Panel',
        description: 'Show a list of errors at the bottom of the editor',
        type: 'boolean',
        "default": true,
        order: 4
      },
      errorPanelHeight: {
        title: 'Error Panel Height',
        description: 'Height of the error panel (in px)',
        type: 'number',
        "default": 150,
        order: 4
      },
      alwaysTakeMinimumSpace: {
        title: 'Automatically Reduce Error Panel Height',
        description: 'Reduce panel height when it exceeds the height of the error list',
        type: 'boolean',
        "default": true,
        order: 4
      },
      displayLinterInfo: {
        title: 'Display Linter Info in the Status Bar',
        description: 'Whether to show any linter information in the status bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      displayLinterStatus: {
        title: 'Display Linter Status Info in Status Bar',
        description: 'The `No Issues` or `X Issues` widget',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabLine: {
        title: 'Show "Line" Tab in the Status Bar',
        type: 'boolean',
        "default": false,
        order: 5
      },
      showErrorTabFile: {
        title: 'Show "File" Tab in the Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabProject: {
        title: 'Show "Project" Tab in the Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      statusIconScope: {
        title: 'Scope of Linter Messages to Show in Status Icon',
        type: 'string',
        "enum": ['File', 'Line', 'Project'],
        "default": 'Project',
        order: 5
      },
      statusIconPosition: {
        title: 'Position of Status Icon in the Status Bar',
        "enum": ['Left', 'Right'],
        type: 'string',
        "default": 'Left',
        order: 5
      }
    },
    activate: function(state) {
      var LinterPlus;
      Linter.state = state;
      LinterPlus = require('./linter.coffee');
      return this.instance = new LinterPlus(state);
    },
    serialize: function() {
      return Linter.state;
    },
    consumeLinter: function(linters) {
      var i, len, linter;
      if (!(linters instanceof Array)) {
        linters = [linters];
      }
      for (i = 0, len = linters.length; i < len; i++) {
        linter = linters[i];
        this.instance.addLinter(linter);
      }
      return new Disposable((function(_this) {
        return function() {
          var j, len1, results;
          results = [];
          for (j = 0, len1 = linters.length; j < len1; j++) {
            linter = linters[j];
            results.push(_this.instance.deleteLinter(linter));
          }
          return results;
        };
      })(this));
    },
    consumeStatusBar: function(statusBar) {
      return this.instance.views.attachBottom(statusBar);
    },
    provideLinter: function() {
      return this.instance;
    },
    provideIndie: function() {
      var ref;
      return (ref = this.instance) != null ? ref.indieLinters : void 0;
    },
    deactivate: function() {
      var ref;
      return (ref = this.instance) != null ? ref.deactivate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVI7O0VBQ2YsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBQSxHQUNmO0lBQUEsUUFBQSxFQUFVLElBQVY7SUFDQSxNQUFBLEVBQ0U7TUFBQSxTQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sa0JBQVA7UUFDQSxXQUFBLEVBQWEsbURBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFIVDtRQUlBLEtBQUEsRUFBTyxDQUpQO09BREY7TUFNQSxpQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLDJCQUFQO1FBQ0EsV0FBQSxFQUFhLCtEQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEdBSFQ7UUFJQSxLQUFBLEVBQU8sQ0FKUDtPQVBGO01BYUEsbUJBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSw0REFBYjtRQUNBLElBQUEsRUFBTSxPQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUZUO1FBR0EsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FKRjtRQUtBLEtBQUEsRUFBTyxDQUxQO09BZEY7TUFvQkEscUJBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxrQ0FBUDtRQUNBLFdBQUEsRUFBYSw0Q0FEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1FBSUEsS0FBQSxFQUFPLENBSlA7T0FyQkY7TUEwQkEsa0JBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyx3Q0FBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxvQkFGVDtRQUdBLEtBQUEsRUFBTyxD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LFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBaEIsQ0FBNkIsU0FBN0I7SUFEZ0IsQ0FqSmxCO0lBb0pBLGFBQUEsRUFBZSxTQUFBO2FBQ2IsSUFBQyxDQUFBO0lBRFksQ0FwSmY7SUF1SkEsWUFBQSxFQUFjLFNBQUE7QUFDWixVQUFBO2dEQUFTLENBQUU7SUFEQyxDQXZKZDtJQTBKQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7Z0RBQVMsQ0FBRSxVQUFYLENBQUE7SUFEVSxDQTFKWjs7QUFGRiIsInNvdXJjZXNDb250ZW50IjpbIntEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2F0b20nKVxubW9kdWxlLmV4cG9ydHMgPSBMaW50ZXIgPVxuICBpbnN0YW5jZTogbnVsbFxuICBjb25maWc6XG4gICAgbGludE9uRmx5OlxuICAgICAgdGl0bGU6ICdMaW50IEFzIFlvdSBUeXBlJ1xuICAgICAgZGVzY3JpcHRpb246ICdMaW50IGZpbGVzIHdoaWxlIHR5cGluZywgd2l0aG91dCB0aGUgbmVlZCB0byBzYXZlJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogMVxuICAgIGxpbnRPbkZseUludGVydmFsOlxuICAgICAgdGl0bGU6ICdMaW50IEFzIFlvdSBUeXBlIEludGVydmFsJ1xuICAgICAgZGVzY3JpcHRpb246ICdJbnRlcnZhbCBhdCB3aGljaCBwcm92aWRlcnMgYXJlIHRyaWdnZXJlZCBhcyB5b3UgdHlwZSAoaW4gbXMpJ1xuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAzMDBcbiAgICAgIG9yZGVyOiAxXG5cbiAgICBpZ25vcmVkTWVzc2FnZVR5cGVzOlxuICAgICAgZGVzY3JpcHRpb246ICdDb21tYSBzZXBhcmF0ZWQgbGlzdCBvZiBtZXNzYWdlIHR5cGVzIHRvIGNvbXBsZXRlbHkgaWdub3JlJ1xuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogW11cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgb3JkZXI6IDJcbiAgICBpZ25vcmVWQ1NJZ25vcmVkRmlsZXM6XG4gICAgICB0aXRsZTogJ0RvIE5vdCBMaW50IEZpbGVzIElnbm9yZWQgYnkgVkNTJ1xuICAgICAgZGVzY3JpcHRpb246ICdFLmcuLCBpZ25vcmUgZmlsZXMgc3BlY2lmaWVkIGluIC5naXRpZ25vcmUnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiAyXG4gICAgaWdub3JlTWF0Y2hlZEZpbGVzOlxuICAgICAgdGl0bGU6ICdEbyBOb3QgTGludCBGaWxlcyB0aGF0IG1hdGNoIHRoaXMgR2xvYidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnLyoqLyoubWluLntqcyxjc3N9J1xuICAgICAgb3JkZXI6IDJcblxuICAgIHNob3dFcnJvcklubGluZTpcbiAgICAgIHRpdGxlOiAnU2hvdyBJbmxpbmUgRXJyb3IgVG9vbHRpcHMnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiAzXG4gICAgaW5saW5lVG9vbHRpcEludGVydmFsOlxuICAgICAgdGl0bGU6ICdJbmxpbmUgVG9vbHRpcCBJbnRlcnZhbCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnSW50ZXJ2YWwgYXQgd2hpY2ggaW5saW5lIHRvb2x0aXAgaXMgdXBkYXRlZCAoaW4gbXMpJ1xuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiA2MFxuICAgICAgb3JkZXI6IDNcbiAgICBndXR0ZXJFbmFibGVkOlxuICAgICAgdGl0bGU6ICdIaWdobGlnaHQgRXJyb3IgTGluZXMgaW4gR3V0dGVyJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogM1xuICAgIGd1dHRlclBvc2l0aW9uOlxuICAgICAgdGl0bGU6ICdQb3NpdGlvbiBvZiBHdXR0ZXIgSGlnaGxpZ2h0cydcbiAgICAgIGVudW06IFsnTGVmdCcsICdSaWdodCddXG4gICAgICBkZWZhdWx0OiAnUmlnaHQnXG4gICAgICBvcmRlcjogM1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICB1bmRlcmxpbmVJc3N1ZXM6XG4gICAgICB0aXRsZTogJ1VuZGVybGluZSBJc3N1ZXMnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiAzXG4gICAgc2hvd1Byb3ZpZGVyTmFtZTpcbiAgICAgIHRpdGxlOiAnU2hvdyBQcm92aWRlciBOYW1lIChXaGVuIEF2YWlsYWJsZSknXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiAzXG5cbiAgICBzaG93RXJyb3JQYW5lbDpcbiAgICAgIHRpdGxlOiAnU2hvdyBFcnJvciBQYW5lbCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2hvdyBhIGxpc3Qgb2YgZXJyb3JzIGF0IHRoZSBib3R0b20gb2YgdGhlIGVkaXRvcidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDRcbiAgICBlcnJvclBhbmVsSGVpZ2h0OlxuICAgICAgdGl0bGU6ICdFcnJvciBQYW5lbCBIZWlnaHQnXG4gICAgICBkZXNjcmlwdGlvbjogJ0hlaWdodCBvZiB0aGUgZXJyb3IgcGFuZWwgKGluIHB4KSdcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICBkZWZhdWx0OiAxNTBcbiAgICAgIG9yZGVyOiA0XG4gICAgYWx3YXlzVGFrZU1pbmltdW1TcGFjZTpcbiAgICAgIHRpdGxlOiAnQXV0b21hdGljYWxseSBSZWR1Y2UgRXJyb3IgUGFuZWwgSGVpZ2h0J1xuICAgICAgZGVzY3JpcHRpb246ICdSZWR1Y2UgcGFuZWwgaGVpZ2h0IHdoZW4gaXQgZXhjZWVkcyB0aGUgaGVpZ2h0IG9mIHRoZSBlcnJvciBsaXN0J1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogNFxuXG4gICAgZGlzcGxheUxpbnRlckluZm86XG4gICAgICB0aXRsZTogJ0Rpc3BsYXkgTGludGVyIEluZm8gaW4gdGhlIFN0YXR1cyBCYXInXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdG8gc2hvdyBhbnkgbGludGVyIGluZm9ybWF0aW9uIGluIHRoZSBzdGF0dXMgYmFyJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogNVxuICAgIGRpc3BsYXlMaW50ZXJTdGF0dXM6XG4gICAgICB0aXRsZTogJ0Rpc3BsYXkgTGludGVyIFN0YXR1cyBJbmZvIGluIFN0YXR1cyBCYXInXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBgTm8gSXNzdWVzYCBvciBgWCBJc3N1ZXNgIHdpZGdldCdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDVcbiAgICBzaG93RXJyb3JUYWJMaW5lOlxuICAgICAgdGl0bGU6ICdTaG93IFwiTGluZVwiIFRhYiBpbiB0aGUgU3RhdHVzIEJhcidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIG9yZGVyOiA1XG4gICAgc2hvd0Vycm9yVGFiRmlsZTpcbiAgICAgIHRpdGxlOiAnU2hvdyBcIkZpbGVcIiBUYWIgaW4gdGhlIFN0YXR1cyBCYXInXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiA1XG4gICAgc2hvd0Vycm9yVGFiUHJvamVjdDpcbiAgICAgIHRpdGxlOiAnU2hvdyBcIlByb2plY3RcIiBUYWIgaW4gdGhlIFN0YXR1cyBCYXInXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiA1XG4gICAgc3RhdHVzSWNvblNjb3BlOlxuICAgICAgdGl0bGU6ICdTY29wZSBvZiBMaW50ZXIgTWVzc2FnZXMgdG8gU2hvdyBpbiBTdGF0dXMgSWNvbidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBlbnVtOiBbJ0ZpbGUnLCAnTGluZScsICdQcm9qZWN0J11cbiAgICAgIGRlZmF1bHQ6ICdQcm9qZWN0J1xuICAgICAgb3JkZXI6IDVcbiAgICBzdGF0dXNJY29uUG9zaXRpb246XG4gICAgICB0aXRsZTogJ1Bvc2l0aW9uIG9mIFN0YXR1cyBJY29uIGluIHRoZSBTdGF0dXMgQmFyJ1xuICAgICAgZW51bTogWydMZWZ0JywgJ1JpZ2h0J11cbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnTGVmdCdcbiAgICAgIG9yZGVyOiA1XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBMaW50ZXIuc3RhdGUgPSBzdGF0ZVxuICAgIExpbnRlclBsdXMgPSByZXF1aXJlKCcuL2xpbnRlci5jb2ZmZWUnKVxuICAgIEBpbnN0YW5jZSA9IG5ldyBMaW50ZXJQbHVzIHN0YXRlXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIExpbnRlci5zdGF0ZVxuXG4gIGNvbnN1bWVMaW50ZXI6IChsaW50ZXJzKSAtPlxuICAgIHVubGVzcyBsaW50ZXJzIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgIGxpbnRlcnMgPSBbIGxpbnRlcnMgXVxuXG4gICAgZm9yIGxpbnRlciBpbiBsaW50ZXJzXG4gICAgICBAaW5zdGFuY2UuYWRkTGludGVyKGxpbnRlcilcblxuICAgIG5ldyBEaXNwb3NhYmxlID0+XG4gICAgICBmb3IgbGludGVyIGluIGxpbnRlcnNcbiAgICAgICAgQGluc3RhbmNlLmRlbGV0ZUxpbnRlcihsaW50ZXIpXG5cbiAgY29uc3VtZVN0YXR1c0JhcjogKHN0YXR1c0JhcikgLT5cbiAgICBAaW5zdGFuY2Uudmlld3MuYXR0YWNoQm90dG9tKHN0YXR1c0JhcilcblxuICBwcm92aWRlTGludGVyOiAtPlxuICAgIEBpbnN0YW5jZVxuXG4gIHByb3ZpZGVJbmRpZTogLT5cbiAgICBAaW5zdGFuY2U/LmluZGllTGludGVyc1xuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGluc3RhbmNlPy5kZWFjdGl2YXRlKClcbiJdfQ==
