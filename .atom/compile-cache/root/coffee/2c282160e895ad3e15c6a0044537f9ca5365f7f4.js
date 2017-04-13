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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLW1lbnUvbGliL3ByZWZlcmVuY2VzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxvQkFBUjs7RUFDTCxtQkFBQSxHQUFzQixPQUFBLENBQVEsd0JBQVI7O0VBRWhCO0FBRUosUUFBQTs7OztJQUFBLFdBQUMsQ0FBQSxRQUFELEdBQVcsU0FBQyxJQUFEO01BQ1QsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLElBQUMsQ0FBQSxjQUFELENBQUE7YUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQ3ZDLElBQUcsSUFBQSxLQUFVLE1BQWI7WUFDRSxJQUFHLElBQUksQ0FBQyxHQUFMLEtBQWMsTUFBakI7Y0FDRSxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBVCxDQUFpQixlQUFqQixDQUFBLEtBQXVDLENBQUMsQ0FBM0M7Z0JBQ0UsSUFBQSxDQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQWhDO3lCQUNFLEtBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBREY7aUJBREY7ZUFERjthQURGOztRQUR1QztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekM7SUFIUzs7SUFVWCxXQUFDLENBQUEsY0FBRCxHQUFpQixTQUFDLGNBQUQ7O1FBQUMsaUJBQWlCOzthQUNqQyxVQUFBLENBQVcsSUFBQyxDQUFBLGFBQVosRUFBMkIsQ0FBM0IsRUFBOEIsY0FBOUI7SUFEZTs7SUFHakIsV0FBQyxDQUFBLGFBQUQsR0FBZ0IsU0FBQyxjQUFEO0FBQ2QsVUFBQTtNQUFBLFdBQUEsR0FBYyxRQUFRLENBQUMsYUFBVCxDQUF1QixxQ0FBdkI7TUFDZCxJQUE2RCxXQUE3RDtRQUFB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QUFBO0FBQzFCLFVBQUE7TUFBQSxFQUFFLENBQUMsb0JBQUgsQ0FBd0IsSUFBeEI7TUFDQSxFQUFFLENBQUMsa0JBQUgsQ0FBQTtNQUNBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixnQ0FBdkI7TUFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBbUIsc0JBQW5CO2FBQ1AsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsbUJBQW5CLENBQXVDLENBQUMsV0FBeEMsR0FBc0Q7SUFMNUI7Ozs7OztFQVE5QixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQXhGakIiLCJzb3VyY2VzQ29udGVudCI6WyJQVSA9IHJlcXVpcmUgJy4vcHJlZmVyZW5jZXMtdXRpbCdcblByZWZlcmVuY2VzU2V0dGluZ3MgPSByZXF1aXJlICcuL3ByZWZlcmVuY2VzLXNldHRpbmdzJ1xuXG5jbGFzcyBQcmVmZXJlbmNlc1xuXG4gIEBsb2NhbGl6ZTogKGRlZlMpIC0+XG4gICAgQGRlZlMgPSBkZWZTXG4gICAgQHVwZGF0ZVNldHRpbmdzKClcbiAgICBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIChpdGVtKSA9PlxuICAgICAgaWYgaXRlbSBpc250IHVuZGVmaW5lZFxuICAgICAgICBpZiBpdGVtLnVyaSBpc250IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIGl0ZW0udXJpLmluZGV4T2YoJ2F0b206Ly9jb25maWcnKSBpc250IC0xXG4gICAgICAgICAgICB1bmxlc3Mgd2luZG93LkphcGFuZXNlTWVudS5wcmVmLmRvbmVcbiAgICAgICAgICAgICAgQHVwZGF0ZVNldHRpbmdzKHRydWUpXG5cbiAgQHVwZGF0ZVNldHRpbmdzOiAob25TZXR0aW5nc09wZW4gPSBmYWxzZSkgLT5cbiAgICBzZXRUaW1lb3V0KEBkZWxheVNldHRpbmdzLCAwLCBvblNldHRpbmdzT3BlbilcblxuICBAZGVsYXlTZXR0aW5nczogKG9uU2V0dGluZ3NPcGVuKSA9PlxuICAgIHNldHRpbmdzVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYi1iYXIgW2RhdGEtdHlwZT1cIlNldHRpbmdzVmlld1wiXScpXG4gICAgc2V0dGluZ3NFbmFibGVkID0gc2V0dGluZ3NUYWIuY2xhc3NOYW1lLmluY2x1ZGVzICdhY3RpdmUnIGlmIHNldHRpbmdzVGFiXG4gICAgcmV0dXJuIHVubGVzcyBzZXR0aW5nc1RhYiAmJiBzZXR0aW5nc0VuYWJsZWRcbiAgICB0cnlcbiAgICAgICMgVGFiIHRpdGxlXG4gICAgICBzZXR0aW5nc1RhYi5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS50ZXh0Q29udGVudCA9IFwi6Kit5a6aXCJcblxuICAgICAgQHN2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNldHRpbmdzLXZpZXcnKVxuXG4gICAgICBAYXBwbHlGb250cygpXG5cbiAgICAgIEBsb2FkQWxsU2V0dGluZ3NQYW5lbHMoKVxuXG4gICAgICBQcmVmZXJlbmNlc1NldHRpbmdzLmxvY2FsaXplKClcblxuICAgICAgQGFwcGx5TGVmdFNpZGUoKVxuXG4gICAgICAjIEFkZCBFdmVudHNcbiAgICAgIGJ0bnMgPSBAc3YucXVlcnlTZWxlY3RvckFsbCgnZGl2LnNlY3Rpb246bm90KC50aGVtZXMtcGFuZWwpIC5zZWFyY2gtY29udGFpbmVyIC5idG4nKVxuICAgICAgZm9yIGJ0biBpbiBidG5zXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFwcGx5SW5zdGFsbFBhbmVsT25Td2l0Y2gpXG5cbiAgICAgIHdpbmRvdy5KYXBhbmVzZU1lbnUucHJlZi5kb25lID0gdHJ1ZVxuICAgIGNhdGNoIGVcbiAgICAgIGNvbnNvbGUuZXJyb3IgXCLml6XmnKzoqp7ljJbjgavlpLHmlZfjgZfjgb7jgZfjgZ/jgIJcIiwgZVxuXG4gIEBhcHBseUZvbnRzOiAoKSA9PlxuICAgIGlmIHByb2Nlc3MucGxhdGZvcm0gPT0gJ3dpbjMyJ1xuICAgICAgZm9udCA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLmZvbnRGYW1pbHknKVxuICAgICAgaWYgZm9udFxuICAgICAgICBAc3Yuc3R5bGVbXCJmb250RmFtaWx5XCJdID0gZm9udFxuICAgICAgZWxzZVxuICAgICAgICBAc3Yuc3R5bGVbXCJmb250RmFtaWx5XCJdID0gXCInU2Vnb2UgVUknLCBNZWlyeW9cIlxuICAgIGVsc2UgaWYgcHJvY2Vzcy5wbGF0Zm9ybSA9PSAnbGludXgnXG4gICAgICBmb250ID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3IuZm9udEZhbWlseScpXG4gICAgICBAc3Yuc3R5bGVbXCJmb250RmFtaWx5XCJdID0gZm9udFxuICAgICAgc2V0dGluZ3NUYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFiLWJhciBbZGF0YS10eXBlPVwiU2V0dGluZ3NWaWV3XCJdJylcbiAgICAgIHNldHRpbmdzVGFiLnN0eWxlW1wiZm9udEZhbWlseVwiXSA9IGZvbnRcblxuICBAbG9hZEFsbFNldHRpbmdzUGFuZWxzOiAoKSA9PlxuICAgICMgTG9hZCBhbGwgc2V0dGluZ3MgcGFuZWxzXG4gICAgbGFzdE1lbnUgPSBAc3YucXVlcnlTZWxlY3RvcignLnBhbmVscy1tZW51IC5hY3RpdmUgYScpXG4gICAgcGFuZWxNZW51cyA9IEBzdi5xdWVyeVNlbGVjdG9yQWxsKCcuc2V0dGluZ3MtdmlldyAucGFuZWxzLW1lbnUgbGkgYScpXG4gICAgZm9yIHBtIGluIHBhbmVsTWVudXNcbiAgICAgIHBtLmNsaWNrKClcbiAgICAgIHBtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXBwbHlJbnN0YWxsUGFuZWxPblN3aXRjaClcbiAgICAjIFJlc3RvcmUgbGFzdCBhY3RpdmUgbWVudVxuICAgIGxhc3RNZW51LmNsaWNrKCkgaWYgbGFzdE1lbnVcblxuICBAYXBwbHlMZWZ0U2lkZTogKCkgPT5cbiAgICAjIExlZnQtc2lkZSBtZW51XG4gICAgbWVudSA9IEBzdi5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZ3MtdmlldyAucGFuZWxzLW1lbnUnKVxuICAgIHJldHVybiB1bmxlc3MgbWVudVxuICAgIGZvciBkIGluIEBkZWZTLlNldHRpbmdzLm1lbnVcbiAgICAgIGVsID0gbWVudS5xdWVyeVNlbGVjdG9yKFwiW25hbWU9JyN7ZC5sYWJlbH0nXT5hXCIpXG4gICAgICBQVS5hcHBseVRleHRXaXRoT3JnIGVsLCBkLnZhbHVlXG5cbiAgICAjIExlZnQtc2lkZSBidXR0b25cbiAgICBleHQgPSBAc3YucXVlcnlTZWxlY3RvcignLnNldHRpbmdzLXZpZXcgLmljb24tbGluay1leHRlcm5hbCcpXG4gICAgUFUuYXBwbHlUZXh0V2l0aE9yZyBleHQsIFwi6Kit5a6a44OV44Kp44Or44OA44KS6ZaL44GPXCJcblxuICBhcHBseUluc3RhbGxQYW5lbE9uU3dpdGNoID0gKCkgLT5cbiAgICBQVS5hcHBseVNlY3Rpb25IZWFkaW5ncyh0cnVlKVxuICAgIFBVLmFwcGx5QnV0dG9uVG9vbGJhcigpXG4gICAgaW5zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5zZWN0aW9uOm5vdCgudGhlbWVzLXBhbmVsKScpXG4gICAgaW5mbyA9IGluc3QucXVlcnlTZWxlY3RvcignLm5hdGl2ZS1rZXktYmluZGluZ3MnKVxuICAgIGluZm8ucXVlcnlTZWxlY3Rvcignc3BhbjpudGgtY2hpbGQoMiknKS50ZXh0Q29udGVudCA9IFwi44OR44OD44Kx44O844K444O744OG44O844Oe44GvIFwiXG5cblxubW9kdWxlLmV4cG9ydHMgPSBQcmVmZXJlbmNlc1xuIl19
