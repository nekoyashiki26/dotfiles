(function() {
  module.exports = {
    Context: {
      "atom-workspace": {
        "application:inspect": "要素の検証"
      },
      "atom-text-editor": {
        "color-picker:open": "カラーピッカー",
        "minimap:toggle": "ミニマップ切替"
      },
      "atom-text-editor, .overlayer": {
        "core:undo": "取り消す",
        "core:redo": "やり直す",
        "core:cut": "カット",
        "core:copy": "コピー",
        "core:paste": "ペースト",
        "core:delete": "削除",
        "core:select-all": "すべて選択",
        "pane:split-up-and-copy-active-item": "ペイン分割･複製 ↑",
        "pane:split-down-and-copy-active-item": "ペイン分割･複製 ↓",
        "pane:split-left-and-copy-active-item": "ペイン分割･複製 ←",
        "pane:split-right-and-copy-active-item": "ペイン分割･複製 →",
        "pane:close": "ペインを閉じる"
      },
      "atom-pane": {
        "pane:split-up-and-copy-active-item": "ペイン分割 ↑",
        "pane:split-down-and-copy-active-item": "ペイン分割 ↓",
        "pane:split-left-and-copy-active-item": "ペイン分割 ←",
        "pane:split-right-and-copy-active-item": "ペイン分割 →",
        "pane:close": "ペインを閉じる"
      },
      "atom-text-editor:not([mini])": {
        "encoding-selector:show": "エンコーディング選択",
        "spell-check:correct-misspelling": "スペル修正",
        "symbols-view:go-to-declaration": "宣言に移動"
      },
      ".overlayer": {
        "autocomplete:toggle": "オートコンプリート",
        "grammar-selector:show": "文法を選択"
      },
      ".image-view": {
        "image-view:reload": "画像をリロード"
      },
      ".tab": {
        "tabs:close-tab": "タブを閉じる",
        "tabs:close-other-tabs": "他のタブをすべて閉じる",
        "tabs:close-tabs-to-right": "右側のタブを閉じる",
        "tabs:close-tabs-to-left": "左側のタブを閉じる",
        "tabs:close-saved-tabs": "保存したタブを閉じる",
        "tabs:close-all-tabs": "タブをすべて閉じる",
        "tabs:split-up": "ペイン分割 ↑",
        "tabs:split-down": "ペイン分割 ↓",
        "tabs:split-left": "ペイン分割 ←",
        "tabs:split-right": "ペイン分割 →"
      },
      ".tab.texteditor": {
        "tabs:open-in-new-window": "新規ウインドウで開く"
      },
      ".tab.pending-tab": {
        "tabs:keep-pending-tab": "プレビュー状態を解除"
      },
      ".tab-bar": {
        "pane:reopen-closed-item": "閉じたタブを開く"
      },
      ".tree-view.full-menu": {
        "tree-view:add-file": "新規ファイル",
        "tree-view:add-folder": "新規フォルダ",
        "tree-view:move": "移動・名前を変更...",
        "tree-view:duplicate": "複製",
        "tree-view:remove": "削除",
        "tree-view:copy": "コピー",
        "tree-view:cut": "カット",
        "tree-view:paste": "ペースト",
        "tree-view:open-selected-entry-up": "ペイン分割 ↑",
        "tree-view:open-selected-entry-down": "ペイン分割 ↓",
        "tree-view:open-selected-entry-left": "ペイン分割 ←",
        "tree-view:open-selected-entry-right": "ペイン分割 →",
        "application:add-project-folder": "プロジェクトフォルダを追加...",
        "tree-view:copy-full-path": "フルパスをコピー",
        "tree-view:copy-project-path": "プロジェクトパスをコピー",
        "tree-view:open-in-new-window": "新規ウインドウで開く"
      },
      '.tree-view.full-menu [is="tree-view-file"]': {
        "tree-view:open-selected-entry-up": "ペイン分割 ↑",
        "tree-view:open-selected-entry-down": "ペイン分割 ↓",
        "tree-view:open-selected-entry-left": "ペイン分割 ←",
        "tree-view:open-selected-entry-right": "ペイン分割 →"
      },
      ".tree-view.full-menu .project-root > .header": {
        "tree-view:add-file": "新規ファイル",
        "tree-view:add-folder": "新規フォルダ",
        "tree-view:move": "移動・名前を変更...",
        "tree-view:duplicate": "複製",
        "tree-view:remove": "削除",
        "tree-view:copy": "コピー",
        "tree-view:cut": "カット",
        "tree-view:paste": "ペースト",
        "tree-view:open-selected-entry-up": "ペイン分割 ↑",
        "tree-view:open-selected-entry-down": "ペイン分割 ↓",
        "tree-view:open-selected-entry-left": "ペイン分割 ←",
        "tree-view:open-selected-entry-right": "ペイン分割 →",
        "application:add-project-folder": "プロジェクトフォルダを追加...",
        "tree-view:remove-project-folder": "プロジェクトフォルダを除去",
        "tree-view:copy-full-path": "フルパスをコピー",
        "tree-view:copy-project-path": "プロジェクトパスをコピー",
        "tree-view:open-in-new-window": "新規ウインドウで開く"
      },
      ".platform-darwin .tree-view.full-menu": {
        "tree-view:show-in-file-manager": "Finder で表示"
      },
      ".platform-win32 .tree-view.full-menu": {
        "tree-view:show-in-file-manager": "エクスプローラで表示"
      },
      ".platform-linux .tree-view.full-menu": {
        "tree-view:show-in-file-manager": "ファイルマネージャで表示"
      },
      ".tree-view > li.directory": {
        "project-find:show-in-current-directory": "ディレクトリ内を検索"
      },
      ".tree-view.multi-select": {
        "tree-view:remove": "削除",
        "tree-view:copy": "コピー",
        "tree-view:cut": "カット",
        "tree-view:paste": "ペースト"
      },
      "atom-pane[data-active-item-path] .item-views": {
        "tree-view:reveal-active-file": "ツリービューに表示"
      },
      "atom-pane[data-active-item-path] .tab.active": {
        "tree-view:rename": "移動・名前を変更...",
        "tree-view:reveal-active-file": "ツリービューに表示"
      },
      ".platform-darwin atom-pane[data-active-item-path] .tab.active": {
        "tree-view:show-current-file-in-file-manager": "Finder で表示"
      },
      ".platform-win32 atom-pane[data-active-item-path] .tab.active": {
        "tree-view:show-current-file-in-file-manager": "エクスプローラで表示"
      },
      ".platform-linux atom-pane[data-active-item-path] .tab.active": {
        "tree-view:show-current-file-in-file-manager": "ファイルマネージャで表示"
      },
      ".platform-darwin atom-text-editor:not([mini])": {
        "tree-view:show-current-file-in-file-manager": "Finder で表示"
      },
      ".platform-win32 atom-text-editor:not([mini])": {
        "tree-view:show-current-file-in-file-manager": "エクスプローラで表示"
      },
      ".platform-linux atom-text-editor:not([mini])": {
        "tree-view:show-current-file-in-file-manager": "ファイルマネージャで表示"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLW1lbnUvZGVmL2NvbnRleHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFDakIsT0FBQSxFQUNFO01BQUEsZ0JBQUEsRUFDRTtRQUFBLHFCQUFBLEVBQXVCLE9BQXZCO09BREY7TUFFQSxrQkFBQSxFQUNFO1FBQUEsbUJBQUEsRUFBcUIsU0FBckI7UUFDQSxnQkFBQSxFQUFrQixTQURsQjtPQUhGO01BS0EsOEJBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSxNQUFiO1FBQ0EsV0FBQSxFQUFhLE1BRGI7UUFFQSxVQUFBLEVBQVksS0FGWjtRQUdBLFdBQUEsRUFBYSxLQUhiO1FBSUEsWUFBQSxFQUFjLE1BSmQ7UUFLQSxhQUFBLEVBQWUsSUFMZjtRQU1BLGlCQUFBLEVBQW1CLE9BTm5CO1FBT0Esb0NBQUEsRUFBc0MsWUFQdEM7UUFRQSxzQ0FBQSxFQUF3QyxZQVJ4QztRQVNBLHNDQUFBLEVBQXdDLFlBVHhDO1FBVUEsdUNBQUEsRUFBeUMsWUFWekM7UUFXQSxZQUFBLEVBQWMsU0FYZDtPQU5GO01Ba0JBLFdBQUEsRUFDRTtRQUFBLG9DQUFBLEVBQXNDLFNBQXRDO1FBQ0Esc0NBQUEsRUFBd0MsU0FEeEM7UUFFQSxzQ0FBQSxFQUF3QyxTQUZ4QztRQUdBLHVDQUFBLEVBQXlDLFNBSHpDO1FBSUEsWUFBQSxFQUFjLFNBSmQ7T0FuQkY7TUF3QkEsOEJBQUEsRUFDRTtRQUFBLHdCQUFBLEVBQTBCLFlBQTFCO1FBQ0EsaUNBQUEsRUFBbUMsT0FEbkM7UUFFQSxnQ0FBQSxFQUFrQyxPQUZsQztPQXpCRjtNQTRCQSxZQUFBLEVBQ0U7UUFBQSxxQkFBQSxFQUF1QixXQUF2QjtRQUNBLHVCQUFBLEVBQXlCLE9BRHpCO09BN0JGO01BK0JBLGFBQUEsRUFDRTtRQUFBLG1C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QUEsRUFDRTtRQUFBLDZDQUFBLEVBQStDLFlBQS9DO09BL0dGO01BZ0hBLDhEQUFBLEVBQ0U7UUFBQSw2Q0FBQSxFQUErQyxjQUEvQztPQWpIRjtNQWtIQSwrQ0FBQSxFQUNFO1FBQUEsNkNBQUEsRUFBK0MsWUFBL0M7T0FuSEY7TUFvSEEsOENBQUEsRUFDRTtRQUFBLDZDQUFBLEVBQStDLFlBQS9DO09BckhGO01Bc0hBLDhDQUFBLEVBQ0U7UUFBQSw2Q0FBQSxFQUErQyxjQUEvQztPQXZIRjtLQUZlOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuQ29udGV4dDpcbiAgXCJhdG9tLXdvcmtzcGFjZVwiOlxuICAgIFwiYXBwbGljYXRpb246aW5zcGVjdFwiOiBcIuimgee0oOOBruaknOiovFwiXG4gIFwiYXRvbS10ZXh0LWVkaXRvclwiOlxuICAgIFwiY29sb3ItcGlja2VyOm9wZW5cIjogXCLjgqvjg6njg7zjg5Tjg4Pjgqvjg7xcIlxuICAgIFwibWluaW1hcDp0b2dnbGVcIjogXCLjg5/jg4vjg57jg4Pjg5fliIfmm79cIlxuICBcImF0b20tdGV4dC1lZGl0b3IsIC5vdmVybGF5ZXJcIjpcbiAgICBcImNvcmU6dW5kb1wiOiBcIuWPluOCiua2iOOBmVwiXG4gICAgXCJjb3JlOnJlZG9cIjogXCLjgoTjgornm7TjgZlcIlxuICAgIFwiY29yZTpjdXRcIjogXCLjgqvjg4Pjg4hcIlxuICAgIFwiY29yZTpjb3B5XCI6IFwi44Kz44OU44O8XCJcbiAgICBcImNvcmU6cGFzdGVcIjogXCLjg5rjg7zjgrnjg4hcIlxuICAgIFwiY29yZTpkZWxldGVcIjogXCLliYrpmaRcIlxuICAgIFwiY29yZTpzZWxlY3QtYWxsXCI6IFwi44GZ44G544Gm6YG45oqeXCJcbiAgICBcInBhbmU6c3BsaXQtdXAtYW5kLWNvcHktYWN0aXZlLWl0ZW1cIjogXCLjg5rjgqTjg7PliIblibLvvaXopIfoo70g4oaRXCJcbiAgICBcInBhbmU6c3BsaXQtZG93bi1hbmQtY29weS1hY3RpdmUtaXRlbVwiOiBcIuODmuOCpOODs+WIhuWJsu+9peikh+ijvSDihpNcIlxuICAgIFwicGFuZTpzcGxpdC1sZWZ0LWFuZC1jb3B5LWFjdGl2ZS1pdGVtXCI6IFwi44Oa44Kk44Oz5YiG5Ymy772l6KSH6KO9IOKGkFwiXG4gICAgXCJwYW5lOnNwbGl0LXJpZ2h0LWFuZC1jb3B5LWFjdGl2ZS1pdGVtXCI6IFwi44Oa44Kk44Oz5YiG5Ymy772l6KSH6KO9IOKGklwiXG4gICAgXCJwYW5lOmNsb3NlXCI6IFwi44Oa44Kk44Oz44KS6ZaJ44GY44KLXCJcbiAgXCJhdG9tLXBhbmVcIjpcbiAgICBcInBhbmU6c3BsaXQtdXAtYW5kLWNvcHktYWN0aXZlLWl0ZW1cIjogXCLjg5rjgqTjg7PliIblibIg4oaRXCJcbiAgICBcInBhbmU6c3BsaXQtZG93bi1hbmQtY29weS1hY3RpdmUtaXRlbVwiOiBcIuODmuOCpOODs+WIhuWJsiDihpNcIlxuICAgIFwicGFuZTpzcGxpdC1sZWZ0LWFuZC1jb3B5LWFjdGl2ZS1pdGVtXCI6IFwi44Oa44Kk44Oz5YiG5YmyIOKGkFwiXG4gICAgXCJwYW5lOnNwbGl0LXJpZ2h0LWFuZC1jb3B5LWFjdGl2ZS1pdGVtXCI6IFwi44Oa44Kk44Oz5YiG5YmyIOKGklwiXG4gICAgXCJwYW5lOmNsb3NlXCI6IFwi44Oa44Kk44Oz44KS6ZaJ44GY44KLXCJcbiAgXCJhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pXCI6XG4gICAgXCJlbmNvZGluZy1zZWxlY3RvcjpzaG93XCI6IFwi44Ko44Oz44Kz44O844OH44Kj44Oz44Kw6YG45oqeXCJcbiAgICBcInNwZWxsLWNoZWNrOmNvcnJlY3QtbWlzc3BlbGxpbmdcIjogXCLjgrnjg5rjg6vkv67mraNcIlxuICAgIFwic3ltYm9scy12aWV3OmdvLXRvLWRlY2xhcmF0aW9uXCI6IFwi5a6j6KiA44Gr56e75YuVXCJcbiAgXCIub3ZlcmxheWVyXCI6XG4gICAgXCJhdXRvY29tcGxldGU6dG9nZ2xlXCI6IFwi44Kq44O844OI44Kz44Oz44OX44Oq44O844OIXCJcbiAgICBcImdyYW1tYXItc2VsZWN0b3I6c2hvd1wiOiBcIuaWh+azleOCkumBuOaKnlwiXG4gIFwiLmltYWdlLXZpZXdcIjpcbiAgICBcImltYWdlLXZpZXc6cmVsb2FkXCI6IFwi55S75YOP44KS44Oq44Ot44O844OJXCJcbiAgXCIudGFiXCI6XG4gICAgXCJ0YWJzOmNsb3NlLXRhYlwiOiBcIuOCv+ODluOCkumWieOBmOOCi1wiXG4gICAgXCJ0YWJzOmNsb3NlLW90aGVyLXRhYnNcIjogXCLku5bjga7jgr/jg5bjgpLjgZnjgbnjgabplonjgZjjgotcIlxuICAgIFwidGFiczpjbG9zZS10YWJzLXRvLXJpZ2h0XCI6IFwi5Y+z5YG044Gu44K/44OW44KS6ZaJ44GY44KLXCJcbiAgICBcInRhYnM6Y2xvc2UtdGFicy10by1sZWZ0XCI6IFwi5bem5YG044Gu44K/44OW44KS6ZaJ44GY44KLXCJcbiAgICBcInRhYnM6Y2xvc2Utc2F2ZWQtdGFic1wiOiBcIuS/neWtmOOBl+OBn+OCv+ODluOCkumWieOBmOOCi1wiXG4gICAgXCJ0YWJzOmNsb3NlLWFsbC10YWJzXCI6IFwi44K/44OW44KS44GZ44G544Gm6ZaJ44GY44KLXCJcbiAgICBcInRhYnM6c3BsaXQtdXBcIjogXCLjg5rjgqTjg7PliIblibIg4oaRXCJcbiAgICBcInRhYnM6c3BsaXQtZG93blwiOiBcIuODmuOCpOODs+WIhuWJsiDihpNcIlxuICAgIFwidGFiczpzcGxpdC1sZWZ0XCI6IFwi44Oa44Kk44Oz5YiG5YmyIOKGkFwiXG4gICAgXCJ0YWJzOnNwbGl0LXJpZ2h0XCI6IFwi44Oa44Kk44Oz5YiG5YmyIOKGklwiXG4gIFwiLnRhYi50ZXh0ZWRpdG9yXCI6XG4gICAgXCJ0YWJzOm9wZW4taW4tbmV3LXdpbmRvd1wiOiBcIuaWsOimj+OCpuOCpOODs+ODieOCpuOBp+mWi+OBj1wiXG4gIFwiLnRhYi5wZW5kaW5nLXRhYlwiOlxuICAgIFwidGFiczprZWVwLXBlbmRpbmctdGFiXCI6IFwi44OX44Os44OT44Ol44O854q25oWL44KS6Kej6ZmkXCJcbiAgXCIudGFiLWJhclwiOlxuICAgIFwicGFuZTpyZW9wZW4tY2xvc2VkLWl0ZW1cIjogXCLplonjgZjjgZ/jgr/jg5bjgpLplovjgY9cIlxuICBcIi50cmVlLXZpZXcuZnVsbC1tZW51XCI6XG4gICAgXCJ0cmVlLXZpZXc6YWRkLWZpbGVcIjogXCLmlrDopo/jg5XjgqHjgqTjg6tcIlxuICAgIFwidHJlZS12aWV3OmFkZC1mb2xkZXJcIjogXCLmlrDopo/jg5Xjgqnjg6vjg4BcIlxuICAgIFwidHJlZS12aWV3Om1vdmVcIjogXCLnp7vli5Xjg7vlkI3liY3jgpLlpInmm7QuLi5cIlxuICAgIFwidHJlZS12aWV3OmR1cGxpY2F0ZVwiOiBcIuikh+ijvVwiXG4gICAgXCJ0cmVlLXZpZXc6cmVtb3ZlXCI6IFwi5YmK6ZmkXCJcbiAgICBcInRyZWUtdmlldzpjb3B5XCI6IFwi44Kz44OU44O8XCJcbiAgICBcInRyZWUtdmlldzpjdXRcIjogXCLjgqvjg4Pjg4hcIlxuICAgIFwidHJlZS12aWV3OnBhc3RlXCI6IFwi44Oa44O844K544OIXCJcbiAgICBcInRyZWUtdmlldzpvcGVuLXNlbGVjdGVkLWVudHJ5LXVwXCI6IFwi44Oa44Kk44Oz5YiG5YmyIOKGkVwiXG4gICAgXCJ0cmVlLXZpZXc6b3Blbi1zZWxlY3RlZC1lbnRyeS1kb3duXCI6IFwi44Oa44Kk44Oz5YiG5YmyIOKGk1wiXG4gICAgXCJ0cmVlLXZpZXc6b3Blbi1zZWxlY3RlZC1lbnRyeS1sZWZ0XCI6IFwi44Oa44Kk44Oz5YiG5YmyIOKGkFwiXG4gICAgXCJ0cmVlLXZpZXc6b3Blbi1zZWxlY3RlZC1lbnRyeS1yaWdodFwiOiBcIuODmuOCpOODs+WIhuWJsiDihpJcIlxuICAgIFwiYXBwbGljYXRpb246YWRkLXByb2plY3QtZm9sZGVyXCI6IFwi44OX44Ot44K444Kn44Kv44OI44OV44Kp44Or44OA44KS6L+95YqgLi4uXCJcbiAgICBcInRyZWUtdmlldzpjb3B5LWZ1bGwtcGF0aFwiOiBcIuODleODq+ODkeOCueOCkuOCs+ODlOODvFwiXG4gICAgXCJ0cmVlLXZpZXc6Y29weS1wcm9qZWN0LXBhdGhcIjogXCLjg5fjg63jgrjjgqfjgq/jg4jjg5HjgrnjgpLjgrPjg5Tjg7xcIlxuICAgIFwidHJlZS12aWV3Om9wZW4taW4tbmV3LXdpbmRvd1wiOiBcIuaWsOimj+OCpuOCpOODs+ODieOCpuOBp+mWi+OBj1wiXG4gICcudHJlZS12aWV3LmZ1bGwtbWVudSBbaXM9XCJ0cmVlLXZpZXctZmlsZVwiXSc6XG4gICAgXCJ0cmVlLXZpZXc6b3Blbi1zZWxlY3RlZC1lbnRyeS11cFwiOiBcIuODmuOCpOODs+WIhuWJsiDihpFcIlxuICAgIFwidHJlZS12aWV3Om9wZW4tc2VsZWN0ZWQtZW50cnktZG93blwiOiBcIuODmuOCpOODs+WIhuWJsiDihpNcIlxuICAgIFwidHJlZS12aWV3Om9wZW4tc2VsZWN0ZWQtZW50cnktbGVmdFwiOiBcIuODmuOCpOODs+WIhuWJsiDihpBcIlxuICAgIFwidHJlZS12aWV3Om9wZW4tc2VsZWN0ZWQtZW50cnktcmlnaHRcIjogXCLjg5rjgqTjg7PliIblibIg4oaSXCJcbiAgXCIudHJlZS12aWV3LmZ1bGwtbWVudSAucHJvamVjdC1yb290ID4gLmhlYWRlclwiOlxuICAgIFwidHJlZS12aWV3OmFkZC1maWxlXCI6IFwi5paw6KaP44OV44Kh44Kk44OrXCJcbiAgICBcInRyZWUtdmlldzphZGQtZm9sZGVyXCI6IFwi5paw6KaP44OV44Kp44Or44OAXCJcbiAgICBcInRyZWUtdmlldzptb3ZlXCI6IFwi56e75YuV44O75ZCN5YmN44KS5aSJ5pu0Li4uXCJcbiAgICBcInRyZWUtdmlldzpkdXBsaWNhdGVcIjogXCLopIfoo71cIlxuICAgIFwidHJlZS12aWV3OnJlbW92ZVwiOiBcIuWJiumZpFwiXG4gICAgXCJ0cmVlLXZpZXc6Y29weVwiOiBcIuOCs+ODlOODvFwiXG4gICAgXCJ0cmVlLXZpZXc6Y3V0XCI6IFwi44Kr44OD44OIXCJcbiAgICBcInRyZWUtdmlldzpwYXN0ZVwiOiBcIuODmuODvOOCueODiFwiXG4gICAgXCJ0cmVlLXZpZXc6b3Blbi1zZWxlY3RlZC1lbnRyeS11cFwiOiBcIuODmuOCpOODs+WIhuWJsiDihpFcIlxuICAgIFwidHJlZS12aWV3Om9wZW4tc2VsZWN0ZWQtZW50cnktZG93blwiOiBcIuODmuOCpOODs+WIhuWJsiDihpNcIlxuICAgIFwidHJlZS12aWV3Om9wZW4tc2VsZWN0ZWQtZW50cnktbGVmdFwiOiBcIuODmuOCpOODs+WIhuWJsiDihpBcIlxuICAgIFwidHJlZS12aWV3Om9wZW4tc2VsZWN0ZWQtZW50cnktcmlnaHRcIjogXCLjg5rjgqTjg7PliIblibIg4oaSXCJcbiAgICBcImFwcGxpY2F0aW9uOmFkZC1wcm9qZWN0LWZvbGRlclwiOiBcIuODl+ODreOCuOOCp+OCr+ODiOODleOCqeODq+ODgOOCkui/veWKoC4uLlwiXG4gICAgXCJ0cmVlLXZpZXc6cmVtb3ZlLXByb2plY3QtZm9sZGVyXCI6IFwi44OX44Ot44K444Kn44Kv44OI44OV44Kp44Or44OA44KS6Zmk5Y67XCJcbiAgICBcInRyZWUtdmlldzpjb3B5LWZ1bGwtcGF0aFwiOiBcIuODleODq+ODkeOCueOCkuOCs+ODlOODvFwiXG4gICAgXCJ0cmVlLXZpZXc6Y29weS1wcm9qZWN0LXBhdGhcIjogXCLjg5fjg63jgrjjgqfjgq/jg4jjg5HjgrnjgpLjgrPjg5Tjg7xcIlxuICAgIFwidHJlZS12aWV3Om9wZW4taW4tbmV3LXdpbmRvd1wiOiBcIuaWsOimj+OCpuOCpOODs+ODieOCpuOBp+mWi+OBj1wiXG4gIFwiLnBsYXRmb3JtLWRhcndpbiAudHJlZS12aWV3LmZ1bGwtbWVudVwiOlxuICAgIFwidHJlZS12aWV3OnNob3ctaW4tZmlsZS1tYW5hZ2VyXCI6IFwiRmluZGVyIOOBp+ihqOekulwiXG4gIFwiLnBsYXRmb3JtLXdpbjMyIC50cmVlLXZpZXcuZnVsbC1tZW51XCI6XG4gICAgXCJ0cmVlLXZpZXc6c2hvdy1pbi1maWxlLW1hbmFnZXJcIjogXCLjgqjjgq/jgrnjg5fjg63jg7zjg6njgafooajnpLpcIlxuICBcIi5wbGF0Zm9ybS1saW51eCAudHJlZS12aWV3LmZ1bGwtbWVudVwiOlxuICAgIFwidHJlZS12aWV3OnNob3ctaW4tZmlsZS1tYW5hZ2VyXCI6IFwi44OV44Kh44Kk44Or44Oe44ON44O844K444Oj44Gn6KGo56S6XCJcbiAgXCIudHJlZS12aWV3ID4gbGkuZGlyZWN0b3J5XCI6XG4gICAgXCJwcm9qZWN0LWZpbmQ6c2hvdy1pbi1jdXJyZW50LWRpcmVjdG9yeVwiOiBcIuODh+OCo+ODrOOCr+ODiOODquWGheOCkuaknOe0olwiXG4gIFwiLnRyZWUtdmlldy5tdWx0aS1zZWxlY3RcIjpcbiAgICBcInRyZWUtdmlldzpyZW1vdmVcIjogXCLliYrpmaRcIlxuICAgIFwidHJlZS12aWV3OmNvcHlcIjogXCLjgrPjg5Tjg7xcIlxuICAgIFwidHJlZS12aWV3OmN1dFwiOiBcIuOCq+ODg+ODiFwiXG4gICAgXCJ0cmVlLXZpZXc6cGFzdGVcIjogXCLjg5rjg7zjgrnjg4hcIlxuICBcImF0b20tcGFuZVtkYXRhLWFjdGl2ZS1pdGVtLXBhdGhdIC5pdGVtLXZpZXdzXCI6XG4gICAgXCJ0cmVlLXZpZXc6cmV2ZWFsLWFjdGl2ZS1maWxlXCI6IFwi44OE44Oq44O844OT44Ol44O844Gr6KGo56S6XCJcbiAgXCJhdG9tLXBhbmVbZGF0YS1hY3RpdmUtaXRlbS1wYXRoXSAudGFiLmFjdGl2ZVwiOlxuICAgIFwidHJlZS12aWV3OnJlbmFtZVwiOiBcIuenu+WLleODu+WQjeWJjeOCkuWkieabtC4uLlwiXG4gICAgXCJ0cmVlLXZpZXc6cmV2ZWFsLWFjdGl2ZS1maWxlXCI6IFwi44OE44Oq44O844OT44Ol44O844Gr6KGo56S6XCJcbiAgXCIucGxhdGZvcm0tZGFyd2luIGF0b20tcGFuZVtkYXRhLWFjdGl2ZS1pdGVtLXBhdGhdIC50YWIuYWN0aXZlXCI6XG4gICAgXCJ0cmVlLXZpZXc6c2hvdy1jdXJyZW50LWZpbGUtaW4tZmlsZS1tYW5hZ2VyXCI6IFwiRmluZGVyIOOBp+ihqOekulwiXG4gIFwiLnBsYXRmb3JtLXdpbjMyIGF0b20tcGFuZVtkYXRhLWFjdGl2ZS1pdGVtLXBhdGhdIC50YWIuYWN0aXZlXCI6XG4gICAgXCJ0cmVlLXZpZXc6c2hvdy1jdXJyZW50LWZpbGUtaW4tZmlsZS1tYW5hZ2VyXCI6IFwi44Ko44Kv44K544OX44Ot44O844Op44Gn6KGo56S6XCJcbiAgXCIucGxhdGZvcm0tbGludXggYXRvbS1wYW5lW2RhdGEtYWN0aXZlLWl0ZW0tcGF0aF0gLnRhYi5hY3RpdmVcIjpcbiAgICBcInRyZWUtdmlldzpzaG93LWN1cnJlbnQtZmlsZS1pbi1maWxlLW1hbmFnZXJcIjogXCLjg5XjgqHjgqTjg6vjg57jg43jg7zjgrjjg6PjgafooajnpLpcIlxuICBcIi5wbGF0Zm9ybS1kYXJ3aW4gYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKVwiOlxuICAgIFwidHJlZS12aWV3OnNob3ctY3VycmVudC1maWxlLWluLWZpbGUtbWFuYWdlclwiOiBcIkZpbmRlciDjgafooajnpLpcIlxuICBcIi5wbGF0Zm9ybS13aW4zMiBhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pXCI6XG4gICAgXCJ0cmVlLXZpZXc6c2hvdy1jdXJyZW50LWZpbGUtaW4tZmlsZS1tYW5hZ2VyXCI6IFwi44Ko44Kv44K544OX44Ot44O844Op44Gn6KGo56S6XCJcbiAgXCIucGxhdGZvcm0tbGludXggYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKVwiOlxuICAgIFwidHJlZS12aWV3OnNob3ctY3VycmVudC1maWxlLWluLWZpbGUtbWFuYWdlclwiOiBcIuODleOCoeOCpOODq+ODnuODjeODvOOCuOODo+OBp+ihqOekulwiXG59XG4iXX0=
