(function() {
  var PU, Preferences, PreferencesSettings;

  PU = require('./preferences-util');

  PreferencesSettings = require('./preferences-settings');

  Preferences = (function() {
    var applyInstallPanelOnSwitch;

    function Preferences() {}

    Preferences.localize = function(defS) {
      this.defS = defS;
      this.updateSettings();
      return atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          if (item !== void 0) {
            if (item.uri !== void 0) {
              if (item.uri.indexOf('atom://config') !== -1) {
                if (!window.JapaneseMenu.pref.done) {
                  return _this.updateSettings(true);
                }
              }
            }
          }
        };
      })(this));
    };

    Preferences.updateSettings = function(onSettingsOpen) {
      if (onSettingsOpen == null) {
        onSettingsOpen = false;
      }
      return setTimeout(this.delaySettings, 0, onSettingsOpen);
    };

    Preferences.delaySettings = function(onSettingsOpen) {
      var btn, btns, e, i, len, settingsEnabled, settingsTab;
      settingsTab = document.querySelector('.tab-bar [data-type="SettingsView"]');
      if (settingsTab) {
        settingsEnabled = settingsTab.className.includes('active');
      }
      if (!(settingsTab && settingsEnabled)) {
        return;
      }
      try {
        settingsTab.querySelector('.title').textContent = "設定";
        Preferences.sv = document.querySelector('.settings-view');
        Preferences.applyFonts();
        Preferences.loadAllSettingsPanels();
        PreferencesSettings.localize();
        Preferences.applyLeftSide();
        btns = Preferences.sv.querySelectorAll('div.section:not(.themes-panel) .search-container .btn');
        for (i = 0, len = btns.length; i < len; i++) {
          btn = btns[i];
          btn.addEventListener('click', applyInstallPanelOnSwitch);
        }
        return window.JapaneseMenu.pref.done = true;
      } catch (error) {
        e = error;
        return console.error("日本語化に失敗しました。", e);
      }
    };

    Preferences.applyFonts = function() {
      var font, settingsTab;
      if (process.platform === 'win32') {
        font = atom.config.get('editor.fontFamily');
        if (font) {
          return Preferences.sv.style["fontFamily"] = font;
        } else {
          return Preferences.sv.style["fontFamily"] = "'Segoe UI', Meiryo";
        }
      } else if (process.platform === 'linux') {
        font = atom.config.get('editor.fontFamily');
        Preferences.sv.style["fontFamily"] = font;
        settingsTab = document.querySelector('.tab-bar [data-type="SettingsView"]');
        return settingsTab.style["fontFamily"] = font;
      }
    };

    Preferences.loadAllSettingsPanels = function() {
      var i, lastMenu, len, panelMenus, pm;
      lastMenu = Preferences.sv.querySelector('.panels-menu .active a');
      panelMenus = Preferences.sv.querySelectorAll('.settings-view .panels-menu li a');
      for (i = 0, len = panelMenus.length; i < len; i++) {
        pm = panelMenus[i];
        pm.click();
        pm.addEventListener('click', applyInstallPanelOnSwitch);
      }
      if (lastMenu) {
        return lastMenu.click();
      }
    };

    Preferences.applyLeftSide = function() {
      var d, el, ext, i, len, menu, ref;
      menu = Preferences.sv.querySelector('.settings-view .panels-menu');
      if (!menu) {
        return;
      }
      ref = Preferences.defS.Settings.menu;
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        el = menu.querySelector("[name='" + d.label + "']>a");
        if (!el) {
          continue;
        }
        PU.applyTextWithOrg(el, d.value);
      }
      ext = Preferences.sv.querySelector('.settings-view .icon-link-external');
      return PU.applyTextWithOrg(ext, "設定フォルダを開く");
    };

    applyInstallPanelOnSwitch = function() {
      var info, inst;
      PU.applySectionHeadings(true);
      PU.applyButtonToolbar();
      inst = document.querySelector('div.section:not(.themes-panel)');
      info = inst.querySelector('.native-key-bindings');
      return info.querySelector('span:nth-child(2)').textContent = "パッケージ・テーマは ";
    };

    return Preferences;

  })();

  module.exports = Preferences;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLW1lbnUvbGliL3ByZWZlcmVuY2VzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxvQkFBUjs7RUFDTCxtQkFBQSxHQUFzQixPQUFBLENBQVEsd0JBQVI7O0VBRWhCO0FBRUosUUFBQTs7OztJQUFBLFdBQUMsQ0FBQSxRQUFELEdBQVcsU0FBQyxJQUFEO01BQ1QsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLElBQUMsQ0FBQSxjQUFELENBQUE7YUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQ3ZDLElBQUcsSUFBQSxLQUFVLE1BQWI7WUFDRSxJQUFHLElBQUksQ0FBQyxHQUFMLEtBQWMsTUFBakI7Y0FDRSxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBVCxDQUFpQixlQUFqQixDQUFBLEtBQXVDLENBQUMsQ0FBM0M7Z0JBQ0UsSUFBQSxDQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQWhDO3lCQUNFLEtBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBREY7aUJBREY7ZUFERjthQURGOztRQUR1QztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekM7SUFIUzs7SUFVWCxXQUFDLENBQUEsY0FBRCxHQUFpQixTQUFDLGNBQUQ7O1FBQUMsaUJBQWlCOzthQUNqQyxVQUFBLENBQVcsSUFBQyxDQUFBLGFBQVosRUFBMkIsQ0FBM0IsRUFBOEIsY0FBOUI7SUFEZTs7SUFHakIsV0FBQyxDQUFBLGFBQUQsR0FBZ0IsU0FBQyxjQUFEO0FBQ2QsVUFBQTtNQUFBLFdBQUEsR0FBYyxRQUFRLENBQUMsYUFBVCxDQUF1QixxQ0FBdkI7TUFDZCxJQUE2RCxXQUE3RDtRQUFBLGVBQUEsR0FBa0IsV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUF0QixDQUErQixRQUEvQixFQUFsQjs7TUFDQSxJQUFBLENBQUEsQ0FBYyxXQUFBLElBQWUsZUFBN0IsQ0FBQTtBQUFBLGVBQUE7O0FBQ0E7UUFFRSxXQUFXLENBQUMsYUFBWixDQUEwQixRQUExQixDQUFtQyxDQUFDLFdBQXBDLEdBQWtEO1FBRWxELFdBQUMsQ0FBQSxFQUFELEdBQU0sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZ0JBQXZCO1FBRU4sV0FBQyxDQUFBLFVBQUQsQ0FBQTtRQUVBLFdBQUMsQ0FBQSxxQkFBRCxDQUFBO1FBRUEsbUJBQW1CLENBQUMsUUFBcEIsQ0FBQTtRQUVBLFdBQUMsQ0FBQSxhQUFELENBQUE7UUFHQSxJQUFBLEdBQU8sV0FBQyxDQUFBLEVBQUUsQ0FBQyxnQkFBSixDQUFxQix1REFBckI7QUFDUCxhQUFBLHNDQUFBOztVQUNFLEdBQUcsQ0FBQyxnQkFBSixDQUFxQixPQUFyQixFQUE4Qix5QkFBOUI7QUFERjtlQUdBLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQXpCLEdBQWdDLEtBbkJsQztPQUFBLGFBQUE7UUFvQk07ZUFDSixPQUFPLENBQUMsS0FBUixDQUFjLGNBQWQsRUFBOEIsQ0FBOUIsRUFyQkY7O0lBSmM7O0lBMkJoQixXQUFDLENBQUEsVUFBRCxHQUFhLFNBQUE7QUFDWCxVQUFBO01BQUEsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QjtRQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCO1FBQ1AsSUFBRyxJQUFIO2lCQUNFLFdBQUMsQ0FBQSxFQUFFLENBQUMsS0FBTSxDQUFBLFlBQUEsQ0FBVixHQUEwQixLQUQ1QjtTQUFBLE1BQUE7aUJBR0UsV0FBQyxDQUFBLEVBQUUsQ0FBQyxLQUFNLENBQUEsWUFBQSxDQUFWLEdBQTBCLHFCQUg1QjtTQUZGO09BQUEsTUFNSyxJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXZCO1FBQ0gsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEI7UUFDUCxXQUFDLENBQUEsRUFBRSxDQUFDLEtBQU0sQ0FBQSxZQUFBLENBQVYsR0FBMEI7UUFDMUIsV0FBQSxHQUFjLFFBQVEsQ0FBQyxhQUFULENBQXVCLHFDQUF2QjtlQUNkLFdBQVcsQ0FBQyxLQUFNLENBQUEsWUFBQSxDQUFsQixHQUFrQyxLQUovQjs7SUFQTTs7SUFhYixXQUFDLENBQUEscUJBQUQsR0FBd0IsU0FBQTtBQUV0QixVQUFBO01BQUEsUUFBQSxHQUFXLFdBQUMsQ0FBQSxFQUFFLENBQUMsYUFBSixDQUFrQix3QkFBbEI7TUFDWCxVQUFBLEdBQWEsV0FBQyxDQUFBLEVBQUUsQ0FBQyxnQkFBSixDQUFxQixrQ0FBckI7QUFDYixXQUFBLDRDQUFBOztRQUNFLEVBQUUsQ0FBQyxLQUFILENBQUE7UUFDQSxFQUFFLENBQUMsZ0JBQUgsQ0FBb0IsT0FBcEIsRUFBNkIseUJBQTdCO0FBRkY7TUFJQSxJQUFvQixRQUFwQjtlQUFBLFFBQVEsQ0FBQyxLQUFULENBQUEsRUFBQTs7SUFSc0I7O0lBVXhCLFdBQUMsQ0FBQSxhQUFELEdBQWdCLFNBQUE7QUFFZCxVQUFBO01BQUEsSUFBQSxHQUFPLFdBQUMsQ0FBQSxFQUFFLENBQUMsYUFBSixDQUFrQiw2QkFBbEI7TUFDUCxJQUFBLENBQWMsSUFBZDtBQUFBLGVBQUE7O0FBQ0E7QUFBQSxXQUFBLHFDQUFBOztRQUNFLEVBQUEsR0FBSyxJQUFJLENBQUMsYUFBTCxDQUFtQixTQUFBLEdBQVUsQ0FBQyxDQUFDLEtBQVosR0FBa0IsTUFBckM7UUFDTCxJQUFBLENBQWdCLEVBQWhCO0FBQUEsbUJBQUE7O1FBQ0EsRUFBRSxDQUFDLGdCQUFILENBQW9CLEVBQXBCLEVBQXdCLENBQUMsQ0FBQyxLQUExQjtBQUhGO01BTUEsR0FBQSxHQUFNLFdBQUMsQ0FBQSxFQUFFLENBQUMsYUFBSixDQUFrQixvQ0FBbEI7YUFDTixFQUFFLENBQUMsZ0JBQUgsQ0FBb0IsR0FBcEIsRUFBeUIsV0FBekI7SUFYYzs7SUFhaEIseUJBQUEsR0FBNEIsU0FBQTtBQUMxQixVQUFBO01BQUEsRUFBRSxDQUFDLG9CQUFILENBQXdCLElBQXhCO01BQ0EsRUFBRSxDQUFDLGtCQUFILENBQUE7TUFDQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZ0NBQXZCO01BQ1AsSUFBQSxHQUFPLElBQUksQ0FBQyxhQUFMLENBQW1CLHNCQUFuQjthQUNQLElBQUksQ0FBQyxhQUFMLENBQW1CLG1CQUFuQixDQUF1QyxDQUFDLFdBQXhDLEdBQXNEO0lBTDVCOzs7Ozs7RUFROUIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUF6RmpCIiwic291cmNlc0NvbnRlbnQiOlsiUFUgPSByZXF1aXJlICcuL3ByZWZlcmVuY2VzLXV0aWwnXG5QcmVmZXJlbmNlc1NldHRpbmdzID0gcmVxdWlyZSAnLi9wcmVmZXJlbmNlcy1zZXR0aW5ncydcblxuY2xhc3MgUHJlZmVyZW5jZXNcblxuICBAbG9jYWxpemU6IChkZWZTKSAtPlxuICAgIEBkZWZTID0gZGVmU1xuICAgIEB1cGRhdGVTZXR0aW5ncygpXG4gICAgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoaXRlbSkgPT5cbiAgICAgIGlmIGl0ZW0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgaWYgaXRlbS51cmkgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICBpZiBpdGVtLnVyaS5pbmRleE9mKCdhdG9tOi8vY29uZmlnJykgaXNudCAtMVxuICAgICAgICAgICAgdW5sZXNzIHdpbmRvdy5KYXBhbmVzZU1lbnUucHJlZi5kb25lXG4gICAgICAgICAgICAgIEB1cGRhdGVTZXR0aW5ncyh0cnVlKVxuXG4gIEB1cGRhdGVTZXR0aW5nczogKG9uU2V0dGluZ3NPcGVuID0gZmFsc2UpIC0+XG4gICAgc2V0VGltZW91dChAZGVsYXlTZXR0aW5ncywgMCwgb25TZXR0aW5nc09wZW4pXG5cbiAgQGRlbGF5U2V0dGluZ3M6IChvblNldHRpbmdzT3BlbikgPT5cbiAgICBzZXR0aW5nc1RhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWItYmFyIFtkYXRhLXR5cGU9XCJTZXR0aW5nc1ZpZXdcIl0nKVxuICAgIHNldHRpbmdzRW5hYmxlZCA9IHNldHRpbmdzVGFiLmNsYXNzTmFtZS5pbmNsdWRlcyAnYWN0aXZlJyBpZiBzZXR0aW5nc1RhYlxuICAgIHJldHVybiB1bmxlc3Mgc2V0dGluZ3NUYWIgJiYgc2V0dGluZ3NFbmFibGVkXG4gICAgdHJ5XG4gICAgICAjIFRhYiB0aXRsZVxuICAgICAgc2V0dGluZ3NUYWIucXVlcnlTZWxlY3RvcignLnRpdGxlJykudGV4dENvbnRlbnQgPSBcIuioreWumlwiXG5cbiAgICAgIEBzdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZXR0aW5ncy12aWV3JylcblxuICAgICAgQGFwcGx5Rm9udHMoKVxuXG4gICAgICBAbG9hZEFsbFNldHRpbmdzUGFuZWxzKClcblxuICAgICAgUHJlZmVyZW5jZXNTZXR0aW5ncy5sb2NhbGl6ZSgpXG5cbiAgICAgIEBhcHBseUxlZnRTaWRlKClcblxuICAgICAgIyBBZGQgRXZlbnRzXG4gICAgICBidG5zID0gQHN2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdi5zZWN0aW9uOm5vdCgudGhlbWVzLXBhbmVsKSAuc2VhcmNoLWNvbnRhaW5lciAuYnRuJylcbiAgICAgIGZvciBidG4gaW4gYnRuc1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhcHBseUluc3RhbGxQYW5lbE9uU3dpdGNoKVxuXG4gICAgICB3aW5kb3cuSmFwYW5lc2VNZW51LnByZWYuZG9uZSA9IHRydWVcbiAgICBjYXRjaCBlXG4gICAgICBjb25zb2xlLmVycm9yIFwi5pel5pys6Kqe5YyW44Gr5aSx5pWX44GX44G+44GX44Gf44CCXCIsIGVcblxuICBAYXBwbHlGb250czogKCkgPT5cbiAgICBpZiBwcm9jZXNzLnBsYXRmb3JtID09ICd3aW4zMidcbiAgICAgIGZvbnQgPSBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5mb250RmFtaWx5JylcbiAgICAgIGlmIGZvbnRcbiAgICAgICAgQHN2LnN0eWxlW1wiZm9udEZhbWlseVwiXSA9IGZvbnRcbiAgICAgIGVsc2VcbiAgICAgICAgQHN2LnN0eWxlW1wiZm9udEZhbWlseVwiXSA9IFwiJ1NlZ29lIFVJJywgTWVpcnlvXCJcbiAgICBlbHNlIGlmIHByb2Nlc3MucGxhdGZvcm0gPT0gJ2xpbnV4J1xuICAgICAgZm9udCA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLmZvbnRGYW1pbHknKVxuICAgICAgQHN2LnN0eWxlW1wiZm9udEZhbWlseVwiXSA9IGZvbnRcbiAgICAgIHNldHRpbmdzVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYi1iYXIgW2RhdGEtdHlwZT1cIlNldHRpbmdzVmlld1wiXScpXG4gICAgICBzZXR0aW5nc1RhYi5zdHlsZVtcImZvbnRGYW1pbHlcIl0gPSBmb250XG5cbiAgQGxvYWRBbGxTZXR0aW5nc1BhbmVsczogKCkgPT5cbiAgICAjIExvYWQgYWxsIHNldHRpbmdzIHBhbmVsc1xuICAgIGxhc3RNZW51ID0gQHN2LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbHMtbWVudSAuYWN0aXZlIGEnKVxuICAgIHBhbmVsTWVudXMgPSBAc3YucXVlcnlTZWxlY3RvckFsbCgnLnNldHRpbmdzLXZpZXcgLnBhbmVscy1tZW51IGxpIGEnKVxuICAgIGZvciBwbSBpbiBwYW5lbE1lbnVzXG4gICAgICBwbS5jbGljaygpXG4gICAgICBwbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFwcGx5SW5zdGFsbFBhbmVsT25Td2l0Y2gpXG4gICAgIyBSZXN0b3JlIGxhc3QgYWN0aXZlIG1lbnVcbiAgICBsYXN0TWVudS5jbGljaygpIGlmIGxhc3RNZW51XG5cbiAgQGFwcGx5TGVmdFNpZGU6ICgpID0+XG4gICAgIyBMZWZ0LXNpZGUgbWVudVxuICAgIG1lbnUgPSBAc3YucXVlcnlTZWxlY3RvcignLnNldHRpbmdzLXZpZXcgLnBhbmVscy1tZW51JylcbiAgICByZXR1cm4gdW5sZXNzIG1lbnVcbiAgICBmb3IgZCBpbiBAZGVmUy5TZXR0aW5ncy5tZW51XG4gICAgICBlbCA9IG1lbnUucXVlcnlTZWxlY3RvcihcIltuYW1lPScje2QubGFiZWx9J10+YVwiKVxuICAgICAgY29udGludWUgdW5sZXNzIGVsXG4gICAgICBQVS5hcHBseVRleHRXaXRoT3JnIGVsLCBkLnZhbHVlXG5cbiAgICAjIExlZnQtc2lkZSBidXR0b25cbiAgICBleHQgPSBAc3YucXVlcnlTZWxlY3RvcignLnNldHRpbmdzLXZpZXcgLmljb24tbGluay1leHRlcm5hbCcpXG4gICAgUFUuYXBwbHlUZXh0V2l0aE9yZyBleHQsIFwi6Kit5a6a44OV44Kp44Or44OA44KS6ZaL44GPXCJcblxuICBhcHBseUluc3RhbGxQYW5lbE9uU3dpdGNoID0gKCkgLT5cbiAgICBQVS5hcHBseVNlY3Rpb25IZWFkaW5ncyh0cnVlKVxuICAgIFBVLmFwcGx5QnV0dG9uVG9vbGJhcigpXG4gICAgaW5zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5zZWN0aW9uOm5vdCgudGhlbWVzLXBhbmVsKScpXG4gICAgaW5mbyA9IGluc3QucXVlcnlTZWxlY3RvcignLm5hdGl2ZS1rZXktYmluZGluZ3MnKVxuICAgIGluZm8ucXVlcnlTZWxlY3Rvcignc3BhbjpudGgtY2hpbGQoMiknKS50ZXh0Q29udGVudCA9IFwi44OR44OD44Kx44O844K444O744OG44O844Oe44GvIFwiXG5cblxubW9kdWxlLmV4cG9ydHMgPSBQcmVmZXJlbmNlc1xuIl19
