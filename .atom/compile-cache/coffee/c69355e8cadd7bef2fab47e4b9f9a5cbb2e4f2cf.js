(function() {
  var JapaneseWrapManager;

  JapaneseWrapManager = require('./japanese-wrap-manager');

  module.exports = {
    japaneseWrapManager: null,
    config: {
      characterWidth: {
        type: 'object',
        properties: {
          greekAndCoptic: {
            title: 'ギリシャ文字及びコプト文字の幅',
            type: 'integer',
            "default": 2,
            minimum: 1,
            maximum: 2
          },
          cyrillic: {
            title: 'キリル文字の幅',
            type: 'integer',
            "default": 2,
            minimum: 1,
            maximum: 2
          }
        }
      },
      lineBreakingRule: {
        type: 'object',
        properties: {
          japanese: {
            title: '日本語禁則処理を行う',
            type: 'boolean',
            "default": true
          },
          halfwidthKatakana: {
            title: '半角カタカナ(JIS X 0201 片仮名図形文字集合)を禁則処理に含める',
            type: 'boolean',
            "default": true
          },
          ideographicSpaceAsWihteSpace: {
            title: '和文間隔(U+3000)を空白文字に含める',
            type: 'boolean',
            "default": false
          }
        }
      }
    },
    activate: function(state) {
      this.japaneseWrapManager = new JapaneseWrapManager;
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.japaneseWrapManager.overwriteFindWrapColumn(editor.displayBuffer);
        };
      })(this));
    },
    deactivate: function() {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.japaneseWrapManager.restoreFindWrapColumn(editor.displayBuffer);
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLXdyYXAvbGliL2phcGFuZXNlLXdyYXAuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVI7O0VBRXRCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxtQkFBQSxFQUFxQixJQUFyQjtJQUVBLE1BQUEsRUFhRTtNQUFBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsVUFBQSxFQUNFO1VBQUEsY0FBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLGlCQUFQO1lBQ0EsSUFBQSxFQUFNLFNBRE47WUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBRlQ7WUFHQSxPQUFBLEVBQVMsQ0FIVDtZQUlBLE9BQUEsRUFBUyxDQUpUO1dBREY7VUFNQSxRQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8sU0FBUDtZQUNBLElBQUEsRUFBTSxTQUROO1lBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUZUO1lBR0EsT0FBQSxFQUFTLENBSFQ7WUFJQSxPQUFBLEVBQVMsQ0FKVDtXQVBGO1NBRkY7T0FERjtNQWtCQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxVQUFBLEVBQ0U7VUFBQSxRQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8sWUFBUDtZQUNBLElBQUEsRUFBTSxTQUROO1lBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUZUO1dBREY7VUFJQSxpQkFBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLHVDQUFQO1lBQ0EsSUFBQSxFQUFNLFNBRE47WUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRlQ7V0FMRjtVQVFBLDRCQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8sdUJBQVA7WUFDQSxJQUFBLEVBQU0sU0FETjtZQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtXQVRGO1NBRkY7T0FuQkY7S0FmRjtJQWlEQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLG1CQUFELEdBQXVCLElBQUk7YUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtpQkFDaEMsS0FBQyxDQUFBLG1CQUFtQixDQUFDLHVCQUFyQixDQUE2QyxNQUFNLENBQUMsYUFBcEQ7UUFEZ0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDO0lBRlEsQ0FqRFY7SUF3REEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO2lCQUNoQyxLQUFDLENBQUEsbUJBQW1CLENBQUMscUJBQXJCLENBQTJDLE1BQU0sQ0FBQyxhQUFsRDtRQURnQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7SUFEVSxDQXhEWjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIkphcGFuZXNlV3JhcE1hbmFnZXIgPSByZXF1aXJlICcuL2phcGFuZXNlLXdyYXAtbWFuYWdlcidcblxubW9kdWxlLmV4cG9ydHMgPVxuICBqYXBhbmVzZVdyYXBNYW5hZ2VyOiBudWxsXG5cbiAgY29uZmlnOlxuICAgICMn5YWo6KeS5Y+l6Kqt54K544G244KJ5LiL44GSJzpcbiAgICAjICB0eXBlOiAnYm9vbGVhbidcbiAgICAjICBkZWZhdWx0OiB0cnVlXG4gICAgIyfljYrop5Llj6Xoqq3ngrnjgbbjgonkuIvjgZInOlxuICAgICMgIHR5cGU6ICdib29sZWFuJ1xuICAgICMgIGRlZmF1bHQ6IHRydWVcbiAgICAjJ+WFqOinkuODlOODquOCquODiS/jgrPjg7Pjg57jgbbjgonkuIvjgZInOlxuICAgICMgIHR5cGU6ICdib29sZWFuJ1xuICAgICMgIGRlZmF1bHQ6IGZhbHNlXG4gICAgIyfljYrop5Ljg5Tjg6rjgqrjg4kv44Kz44Oz44Oe44G244KJ5LiL44GSJzpcbiAgICAjICB0eXBlOiAnYm9vbGVhbidcbiAgICAjICBkZWZhdWx0OiBmYWxzZVxuICAgIGNoYXJhY3RlcldpZHRoOlxuICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgIGdyZWVrQW5kQ29wdGljOlxuICAgICAgICAgIHRpdGxlOiAn44Ku44Oq44K344Oj5paH5a2X5Y+K44Gz44Kz44OX44OI5paH5a2X44Gu5bmFJ1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgICAgIGRlZmF1bHQ6IDJcbiAgICAgICAgICBtaW5pbXVtOiAxXG4gICAgICAgICAgbWF4aW11bTogMlxuICAgICAgICBjeXJpbGxpYzpcbiAgICAgICAgICB0aXRsZTogJ+OCreODquODq+aWh+Wtl+OBruW5hSdcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgICAgICBkZWZhdWx0OiAyXG4gICAgICAgICAgbWluaW11bTogMVxuICAgICAgICAgIG1heGltdW06IDJcbiAgICAjJ0FTQ0lJ5paH5a2X44KS56aB5YmH5Yem55CG44Gr5ZCr44KB44KLJzpcbiAgICAjICB0eXBlOiAnYm9vbGVhbidcbiAgICAjICBkZWZhdWx0OiBmYWxzZVxuICAgIGxpbmVCcmVha2luZ1J1bGU6XG4gICAgICB0eXBlOiAnb2JqZWN0J1xuICAgICAgcHJvcGVydGllczpcbiAgICAgICAgamFwYW5lc2U6XG4gICAgICAgICAgdGl0bGU6ICfml6XmnKzoqp7npoHliYflh6bnkIbjgpLooYzjgYYnXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBoYWxmd2lkdGhLYXRha2FuYTpcbiAgICAgICAgICB0aXRsZTogJ+WNiuinkuOCq+OCv+OCq+ODiihKSVMgWCAwMjAxIOeJh+S7ruWQjeWbs+W9ouaWh+Wtl+mbhuWQiCnjgpLnpoHliYflh6bnkIbjgavlkKvjgoHjgosnXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBpZGVvZ3JhcGhpY1NwYWNlQXNXaWh0ZVNwYWNlOlxuICAgICAgICAgIHRpdGxlOiAn5ZKM5paH6ZaT6ZqUKFUrMzAwMCnjgpLnqbrnmb3mloflrZfjgavlkKvjgoHjgosnXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2VcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBqYXBhbmVzZVdyYXBNYW5hZ2VyID0gbmV3IEphcGFuZXNlV3JhcE1hbmFnZXJcbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIEBqYXBhbmVzZVdyYXBNYW5hZ2VyLm92ZXJ3cml0ZUZpbmRXcmFwQ29sdW1uKGVkaXRvci5kaXNwbGF5QnVmZmVyKVxuICAgICAgIyBjb25zb2xlLmxvZyhcImFjdGl2ZSBqYXBhbmVzZS13cmFwXCIpXG4gICAgICAjIGNvbnNvbGUubG9nKGVkaXRvci5kaXNwbGF5QnVmZmVyKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAamFwYW5lc2VXcmFwTWFuYWdlci5yZXN0b3JlRmluZFdyYXBDb2x1bW4oZWRpdG9yLmRpc3BsYXlCdWZmZXIpXG4gICAgICAjIGNvbnNvbGUubG9nKFwiZGVhY3RpdmUgamFwYW5lc2Utd3JhcFwiKVxuICAgICAgIyBjb25zb2xlLmxvZyhlZGl0b3IuZGlzcGxheUJ1ZmZlcilcbiJdfQ==
