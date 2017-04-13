(function() {
  var PU, PreferencesSettings;

  PU = require('./preferences-util');

  PreferencesSettings = (function() {
    var applyTextContentBySettingsId;

    function PreferencesSettings() {}

    PreferencesSettings.localize = function() {
      this.defS = window.JapaneseMenu.defS.Settings;
      this.sv = document.querySelector('.settings-view');
      this.localizeSettingsPanel();
      this.localizeKeybindingsPanel();
      this.localizeThemesPanel();
      this.localizeUpdatesPanel();
      this.localizeInstallPanel();
      return PU.applyButtonToolbar();
    };

    PreferencesSettings.localizeSettingsPanel = function() {
      var d, i, info, j, len, len1, note, ref, ref1, results;
      ref = this.defS.settings.notes;
      for (i = 0, len = ref.length; i < len; i++) {
        note = ref[i];
        info = this.sv.querySelector("[id='" + note.id + "']");
        if (!PU.isAlreadyLocalized(info)) {
          info.innerHTML = note.html;
          info.setAttribute('data-localized', 'true');
        }
      }
      ref1 = this.defS.settings.controls;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        d = ref1[j];
        results.push(applyTextContentBySettingsId(d));
      }
      return results;
    };

    applyTextContentBySettingsId = function(data) {
      var ctrl, el, i, len, o, ref, results, v;
      el = document.querySelector("[id='" + data.id + "']");
      if (!el) {
        return;
      }
      ctrl = el.closest('.control-group');
      PU.applyTextWithOrg(ctrl.querySelector('.setting-title'), data.title);
      PU.applyTextWithOrg(ctrl.querySelector('.setting-description'), data.desc);
      if (!data.select) {
        return;
      }
      ref = el.querySelectorAll("option");
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        o = ref[i];
        v = o.attributes["value"].value;
        results.push(o.innerText = data.select[v]);
      }
      return results;
    };

    PreferencesSettings.localizeKeybindingsPanel = function() {
      var info, span;
      info = PreferencesSettings.sv.querySelector('.keybinding-panel>div:nth-child(2)');
      if (!PU.isAlreadyLocalized(info)) {
        info.querySelector('span:nth-child(2)').textContent = "これらのキーバインドは　";
        info.querySelector('span:nth-child(4)').textContent = "をクリック（コピー）して";
        info.querySelector('a.link').textContent = " キーマップファイル ";
        span = document.createElement('span');
        span.textContent = "に貼り付けると上書きできます。";
        info.appendChild(span);
        return info.setAttribute('data-localized', 'true');
      }
    };

    PreferencesSettings.localizeThemesPanel = function() {
      var info, span, tp1, tp2;
      info = PreferencesSettings.sv.querySelector('.themes-panel>div>div:nth-child(2)');
      if (!PU.isAlreadyLocalized(info)) {
        info.querySelector('span').textContent = "Atom は";
        info.querySelector('a.link').textContent = " スタイルシート ";
        span = document.createElement('span');
        span.textContent = "を編集してスタイルを変更することもできます。";
        info.appendChild(span);
        tp1 = PreferencesSettings.sv.querySelector('.themes-picker>div:nth-child(1)');
        tp1.querySelector('.setting-title').textContent = "インターフェーステーマ";
        tp1.querySelector('.setting-description').textContent = "タブ、ステータスバー、ツリービューとドロップダウンのスタイルを変更します。";
        tp2 = PreferencesSettings.sv.querySelector('.themes-picker>div:nth-child(2)');
        tp2.querySelector('.setting-title').textContent = "シンタックステーマ";
        tp2.querySelector('.setting-description').textContent = "テキストエディタの内側のスタイルを変更します。";
        return info.setAttribute('data-localized', 'true');
      }
    };

    PreferencesSettings.localizeUpdatesPanel = function() {
      PU.applySpecialHeading(PreferencesSettings.sv, "Available Updates", 2, "利用可能なアップデート");
      PU.applyTextWithOrg(PreferencesSettings.sv.querySelector('.update-all-button.btn-primary'), "すべてアップデート");
      PU.applyTextWithOrg(PreferencesSettings.sv.querySelector('.update-all-button:not(.btn-primary)'), "アップデートをチェック");
      PU.applyTextWithOrg(PreferencesSettings.sv.querySelector('.alert.icon-hourglass'), "アップデートを確認中...");
      return PU.applyTextWithOrg(PreferencesSettings.sv.querySelector('.alert.icon-heart'), "インストールしたパッケージはすべて最新です！");
    };

    PreferencesSettings.localizeInstallPanel = function() {
      var info, inst, span, tc;
      PU.applySectionHeadings();
      inst = document.querySelector('div.section:not(.themes-panel)');
      info = inst.querySelector('.native-key-bindings');
      if (!PU.isAlreadyLocalized(info)) {
        info.querySelector('span:nth-child(2)').textContent = "パッケージ・テーマは ";
        tc = info.querySelector('span:nth-child(4)');
        tc.textContent = tc.textContent.replace("and are installed to", "に公開されており ");
        span = document.createElement('span');
        span.textContent = " にインストールされます。";
        info.appendChild(span);
        info.setAttribute('data-localized', 'true');
      }
      PU.applyTextWithOrg(inst.querySelector('.search-container .btn:nth-child(1)'), "パッケージ");
      return PU.applyTextWithOrg(inst.querySelector('.search-container .btn:nth-child(2)'), "テーマ");
    };

    return PreferencesSettings;

  })();

  module.exports = PreferencesSettings;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLW1lbnUvbGliL3ByZWZlcmVuY2VzLXNldHRpbmdzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxvQkFBUjs7RUFFQztBQUVKLFFBQUE7Ozs7SUFBQSxtQkFBQyxDQUFBLFFBQUQsR0FBVyxTQUFBO01BRVQsSUFBQyxDQUFBLElBQUQsR0FBUSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztNQUNqQyxJQUFDLENBQUEsRUFBRCxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QjtNQUdOLElBQUMsQ0FBQSxxQkFBRCxDQUFBO01BR0EsSUFBQyxDQUFBLHdCQUFELENBQUE7TUFHQSxJQUFDLENBQUEsbUJBQUQsQ0FBQTtNQUdBLElBQUMsQ0FBQSxvQkFBRCxDQUFBO01BR0EsSUFBQyxDQUFBLG9CQUFELENBQUE7YUFHQSxFQUFFLENBQUMsa0JBQUgsQ0FBQTtJQXJCUzs7SUF1QlgsbUJBQUMsQ0FBQSxxQkFBRCxHQUF3QixTQUFBO0FBRXRCLFVBQUE7QUFBQTtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsSUFBQSxHQUFPLElBQUMsQ0FBQSxFQUFFLENBQUMsYUFBSixDQUFrQixPQUFBLEdBQVEsSUFBSSxDQUFDLEVBQWIsR0FBZ0IsSUFBbEM7UUFDUCxJQUFBLENBQU8sRUFBRSxDQUFDLGtCQUFILENBQXNCLElBQXRCLENBQVA7VUFDRSxJQUFJLENBQUMsU0FBTCxHQUFpQixJQUFJLENBQUM7VUFDdEIsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsZ0JBQWxCLEVBQW9DLE1BQXBDLEVBRkY7O0FBRkY7QUFPQTtBQUFBO1dBQUEsd0NBQUE7O3FCQUNFLDRCQUFBLENBQTZCLENBQTdCO0FBREY7O0lBVHNCOztJQVl4Qiw0QkFBQSxHQUErQixTQUFDLElBQUQ7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QixnQkFBbEIsRUFBb0MsTUFBcEMsRUFQRjs7TUFRQSxFQUFFLENBQUMsZ0JBQUgsQ0FBb0IsSUFBSSxDQUFDLGFBQUwsQ0FBbUIscUNBQW5CLENBQXBCLEVBQStFLE9BQS9FO2FBQ0EsRUFBRSxDQUFDLGdCQUFILENBQW9CLElBQUksQ0FBQyxhQUFMLENBQW1CLHFDQUFuQixDQUFwQixFQUErRSxLQUEvRTtJQWJxQjs7Ozs7O0VBZ0J6QixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQXBHakIiLCJzb3VyY2VzQ29udGVudCI6WyJQVSA9IHJlcXVpcmUgJy4vcHJlZmVyZW5jZXMtdXRpbCdcblxuY2xhc3MgUHJlZmVyZW5jZXNTZXR0aW5nc1xuXG4gIEBsb2NhbGl6ZTogKCkgLT5cblxuICAgIEBkZWZTID0gd2luZG93LkphcGFuZXNlTWVudS5kZWZTLlNldHRpbmdzXG4gICAgQHN2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNldHRpbmdzLXZpZXcnKVxuXG4gICAgIyBTZXR0aW5ncyBwYW5lbFxuICAgIEBsb2NhbGl6ZVNldHRpbmdzUGFuZWwoKVxuXG4gICAgIyBLZXliaW5kaW5nc1xuICAgIEBsb2NhbGl6ZUtleWJpbmRpbmdzUGFuZWwoKVxuXG4gICAgIyBUaGVtZXMgcGFuZWxcbiAgICBAbG9jYWxpemVUaGVtZXNQYW5lbCgpXG5cbiAgICAjIFVwZGF0ZXMgcGFuZWxcbiAgICBAbG9jYWxpemVVcGRhdGVzUGFuZWwoKVxuXG4gICAgIyBJbnN0YWxsIHBhbmVsXG4gICAgQGxvY2FsaXplSW5zdGFsbFBhbmVsKClcblxuICAgICMgQnV0dG9uc1xuICAgIFBVLmFwcGx5QnV0dG9uVG9vbGJhcigpXG5cbiAgQGxvY2FsaXplU2V0dGluZ3NQYW5lbDogKCkgLT5cbiAgICAjIE5vdGVzXG4gICAgZm9yIG5vdGUgaW4gQGRlZlMuc2V0dGluZ3Mubm90ZXNcbiAgICAgIGluZm8gPSBAc3YucXVlcnlTZWxlY3RvcihcIltpZD0nI3tub3RlLmlkfSddXCIpXG4gICAgICB1bmxlc3MgUFUuaXNBbHJlYWR5TG9jYWxpemVkKGluZm8pXG4gICAgICAgIGluZm8uaW5uZXJIVE1MID0gbm90ZS5odG1sXG4gICAgICAgIGluZm8uc2V0QXR0cmlidXRlKCdkYXRhLWxvY2FsaXplZCcsICd0cnVlJylcblxuICAgICMgRXZlcnkgc2V0dGluZ3MgaXRlbVxuICAgIGZvciBkIGluIEBkZWZTLnNldHRpbmdzLmNvbnRyb2xzXG4gICAgICBhcHBseVRleHRDb250ZW50QnlTZXR0aW5nc0lkKGQpXG5cbiAgYXBwbHlUZXh0Q29udGVudEJ5U2V0dGluZ3NJZCA9IChkYXRhKSAtPlxuICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltpZD0nI3tkYXRhLmlkfSddXCIpXG4gICAgcmV0dXJuIHVubGVzcyBlbFxuICAgIGN0cmwgPSBlbC5jbG9zZXN0KCcuY29udHJvbC1ncm91cCcpXG4gICAgUFUuYXBwbHlUZXh0V2l0aE9yZyhjdHJsLnF1ZXJ5U2VsZWN0b3IoJy5zZXR0aW5nLXRpdGxlJyksIGRhdGEudGl0bGUpXG4gICAgUFUuYXBwbHlUZXh0V2l0aE9yZyhjdHJsLnF1ZXJ5U2VsZWN0b3IoJy5zZXR0aW5nLWRlc2NyaXB0aW9uJyksIGRhdGEuZGVzYylcbiAgICByZXR1cm4gdW5sZXNzIGRhdGEuc2VsZWN0XG4gICAgZm9yIG8gaW4gZWwucXVlcnlTZWxlY3RvckFsbChcIm9wdGlvblwiKVxuICAgICAgdiA9IG8uYXR0cmlidXRlc1tcInZhbHVlXCJdLnZhbHVlXG4gICAgICBvLmlubmVyVGV4dCA9IGRhdGEuc2VsZWN0W3ZdXG5cbiAgQGxvY2FsaXplS2V5YmluZGluZ3NQYW5lbDogKCkgPT5cbiAgICBpbmZvID0gQHN2LnF1ZXJ5U2VsZWN0b3IoJy5rZXliaW5kaW5nLXBhbmVsPmRpdjpudGgtY2hpbGQoMiknKVxuICAgIHVubGVzcyBQVS5pc0FscmVhZHlMb2NhbGl6ZWQoaW5mbylcbiAgICAgIGluZm8ucXVlcnlTZWxlY3Rvcignc3BhbjpudGgtY2hpbGQoMiknKS50ZXh0Q29udGVudCA9IFwi44GT44KM44KJ44Gu44Kt44O844OQ44Kk44Oz44OJ44Gv44CAXCJcbiAgICAgIGluZm8ucXVlcnlTZWxlY3Rvcignc3BhbjpudGgtY2hpbGQoNCknKS50ZXh0Q29udGVudCA9IFwi44KS44Kv44Oq44OD44Kv77yI44Kz44OU44O877yJ44GX44GmXCJcbiAgICAgIGluZm8ucXVlcnlTZWxlY3RvcignYS5saW5rJykudGV4dENvbnRlbnQgPSBcIiDjgq3jg7zjg57jg4Pjg5fjg5XjgqHjgqTjg6sgXCJcbiAgICAgIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBcIuOBq+iyvOOCiuS7mOOBkeOCi+OBqOS4iuabuOOBjeOBp+OBjeOBvuOBmeOAglwiXG4gICAgICBpbmZvLmFwcGVuZENoaWxkKHNwYW4pXG4gICAgICBpbmZvLnNldEF0dHJpYnV0ZSgnZGF0YS1sb2NhbGl6ZWQnLCAndHJ1ZScpXG5cbiAgQGxvY2FsaXplVGhlbWVzUGFuZWw6ICgpID0+XG4gICAgaW5mbyA9IEBzdi5xdWVyeVNlbGVjdG9yKCcudGhlbWVzLXBhbmVsPmRpdj5kaXY6bnRoLWNoaWxkKDIpJylcbiAgICB1bmxlc3MgUFUuaXNBbHJlYWR5TG9jYWxpemVkKGluZm8pXG4gICAgICBpbmZvLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS50ZXh0Q29udGVudCA9IFwiQXRvbSDjga9cIlxuICAgICAgaW5mby5xdWVyeVNlbGVjdG9yKCdhLmxpbmsnKS50ZXh0Q29udGVudCA9IFwiIOOCueOCv+OCpOODq+OCt+ODvOODiCBcIlxuICAgICAgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IFwi44KS57eo6ZuG44GX44Gm44K544K/44Kk44Or44KS5aSJ5pu044GZ44KL44GT44Go44KC44Gn44GN44G+44GZ44CCXCJcbiAgICAgIGluZm8uYXBwZW5kQ2hpbGQoc3BhbilcbiAgICAgIHRwMSA9IEBzdi5xdWVyeVNlbGVjdG9yKCcudGhlbWVzLXBpY2tlcj5kaXY6bnRoLWNoaWxkKDEpJylcbiAgICAgIHRwMS5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZy10aXRsZScpLnRleHRDb250ZW50ID0gXCLjgqTjg7Pjgr/jg7zjg5Xjgqfjg7zjgrnjg4bjg7zjg55cIlxuICAgICAgdHAxLnF1ZXJ5U2VsZWN0b3IoJy5zZXR0aW5nLWRlc2NyaXB0aW9uJykudGV4dENvbnRlbnQgPSBcIuOCv+ODluOAgeOCueODhuODvOOCv+OCueODkOODvOOAgeODhOODquODvOODk+ODpeODvOOBqOODieODreODg+ODl+ODgOOCpuODs+OBruOCueOCv+OCpOODq+OCkuWkieabtOOBl+OBvuOBmeOAglwiXG4gICAgICB0cDIgPSBAc3YucXVlcnlTZWxlY3RvcignLnRoZW1lcy1waWNrZXI+ZGl2Om50aC1jaGlsZCgyKScpXG4gICAgICB0cDIucXVlcnlTZWxlY3RvcignLnNldHRpbmctdGl0bGUnKS50ZXh0Q29udGVudCA9IFwi44K344Oz44K/44OD44Kv44K544OG44O844OeXCJcbiAgICAgIHRwMi5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZy1kZXNjcmlwdGlvbicpLnRleHRDb250ZW50ID0gXCLjg4bjgq3jgrnjg4jjgqjjg4fjgqPjgr/jga7lhoXlgbTjga7jgrnjgr/jgqTjg6vjgpLlpInmm7TjgZfjgb7jgZnjgIJcIlxuICAgICAgaW5mby5zZXRBdHRyaWJ1dGUoJ2RhdGEtbG9jYWxpemVkJywgJ3RydWUnKVxuXG4gIEBsb2NhbGl6ZVVwZGF0ZXNQYW5lbDogKCkgPT5cbiAgICBQVS5hcHBseVNwZWNpYWxIZWFkaW5nKEBzdiwgXCJBdmFpbGFibGUgVXBkYXRlc1wiLCAyLCBcIuWIqeeUqOWPr+iDveOBquOCouODg+ODl+ODh+ODvOODiFwiKVxuICAgIFBVLmFwcGx5VGV4dFdpdGhPcmcoQHN2LnF1ZXJ5U2VsZWN0b3IoJy51cGRhdGUtYWxsLWJ1dHRvbi5idG4tcHJpbWFyeScpLCBcIuOBmeOBueOBpuOCouODg+ODl+ODh+ODvOODiFwiKVxuICAgIFBVLmFwcGx5VGV4dFdpdGhPcmcoQHN2LnF1ZXJ5U2VsZWN0b3IoJy51cGRhdGUtYWxsLWJ1dHRvbjpub3QoLmJ0bi1wcmltYXJ5KScpLCBcIuOCouODg+ODl+ODh+ODvOODiOOCkuODgeOCp+ODg+OCr1wiKVxuICAgIFBVLmFwcGx5VGV4dFdpdGhPcmcoQHN2LnF1ZXJ5U2VsZWN0b3IoJy5hbGVydC5pY29uLWhvdXJnbGFzcycpLCBcIuOCouODg+ODl+ODh+ODvOODiOOCkueiuuiqjeS4rS4uLlwiKVxuICAgIFBVLmFwcGx5VGV4dFdpdGhPcmcoQHN2LnF1ZXJ5U2VsZWN0b3IoJy5hbGVydC5pY29uLWhlYXJ0JyksIFwi44Kk44Oz44K544OI44O844Or44GX44Gf44OR44OD44Kx44O844K444Gv44GZ44G544Gm5pyA5paw44Gn44GZ77yBXCIpXG5cbiAgQGxvY2FsaXplSW5zdGFsbFBhbmVsOiAoKSAtPlxuICAgIFBVLmFwcGx5U2VjdGlvbkhlYWRpbmdzKClcbiAgICBpbnN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LnNlY3Rpb246bm90KC50aGVtZXMtcGFuZWwpJylcbiAgICBpbmZvID0gaW5zdC5xdWVyeVNlbGVjdG9yKCcubmF0aXZlLWtleS1iaW5kaW5ncycpXG4gICAgdW5sZXNzIFBVLmlzQWxyZWFkeUxvY2FsaXplZChpbmZvKVxuICAgICAgaW5mby5xdWVyeVNlbGVjdG9yKCdzcGFuOm50aC1jaGlsZCgyKScpLnRleHRDb250ZW50ID0gXCLjg5Hjg4PjgrHjg7zjgrjjg7vjg4bjg7zjg57jga8gXCJcbiAgICAgIHRjID0gaW5mby5xdWVyeVNlbGVjdG9yKCdzcGFuOm50aC1jaGlsZCg0KScpXG4gICAgICB0Yy50ZXh0Q29udGVudCA9IHRjLnRleHRDb250ZW50LnJlcGxhY2UoXCJhbmQgYXJlIGluc3RhbGxlZCB0b1wiLCBcIuOBq+WFrOmWi+OBleOCjOOBpuOBiuOCiiBcIilcbiAgICAgIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBcIiDjgavjgqTjg7Pjgrnjg4jjg7zjg6vjgZXjgozjgb7jgZnjgIJcIlxuICAgICAgaW5mby5hcHBlbmRDaGlsZChzcGFuKVxuICAgICAgaW5mby5zZXRBdHRyaWJ1dGUoJ2RhdGEtbG9jYWxpemVkJywgJ3RydWUnKVxuICAgIFBVLmFwcGx5VGV4dFdpdGhPcmcoaW5zdC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLWNvbnRhaW5lciAuYnRuOm50aC1jaGlsZCgxKScpLCBcIuODkeODg+OCseODvOOCuFwiKVxuICAgIFBVLmFwcGx5VGV4dFdpdGhPcmcoaW5zdC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLWNvbnRhaW5lciAuYnRuOm50aC1jaGlsZCgyKScpLCBcIuODhuODvOODnlwiKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gUHJlZmVyZW5jZXNTZXR0aW5nc1xuIl19
