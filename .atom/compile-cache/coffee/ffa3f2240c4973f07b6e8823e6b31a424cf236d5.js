(function() {
  module.exports = {
    Menu: {
      "&File": {
        value: "ファイル(&F)",
        submenu: {
          "New &Window": {
            value: "新規ウインドウ(&W)"
          },
          "&New File": {
            value: "新規ファイル(&N)"
          },
          "&Open File…": {
            value: "開く(&O)..."
          },
          "Open Folder…": {
            value: "フォルダを開く..."
          },
          "Add Project Folder…": {
            value: "プロジェクトフォルダを追加..."
          },
          "Reopen Project": {
            value: "プロジェクト履歴から開く",
            submenu: {
              "Clear Project History": {
                value: "プロジェクト履歴をクリア"
              }
            }
          },
          "Reopen Last &Item": {
            value: "最後に使用したファイルを開く(&I)"
          },
          "&Save": {
            value: "保存(&S)"
          },
          "Save &As…": {
            value: "別名で保存(&A)..."
          },
          "Save A&ll": {
            value: "すべて保存(&L)"
          },
          "&Close Tab": {
            value: "タブを閉じる(&C)"
          },
          "Close &Pane": {
            value: "ペインを閉じる(&P)"
          },
          "Clos&e Window": {
            value: "ウインドウを閉じる(&E)"
          },
          "Quit": {
            value: "終了"
          },
          "Close All Tabs": {
            value: "タブをすべて閉じる"
          }
        }
      },
      "&Edit": {
        value: "編集(&E)",
        submenu: {
          "&Undo": {
            value: "取り消す(&U)"
          },
          "&Redo": {
            value: "やり直す(&R)"
          },
          "&Cut": {
            value: "カット(&C)"
          },
          "C&opy": {
            value: "コピー(&O)"
          },
          "Copy Pat&h": {
            value: "パスをコピー(&H)"
          },
          "&Paste": {
            value: "ペースト(&P)"
          },
          "Select &All": {
            value: "すべて選択(&A)"
          },
          "&Toggle Comments": {
            value: "コメントの切替(&T)"
          },
          Lines: {
            value: "行",
            submenu: {
              "&Indent": {
                value: "インデントを追加(&I)"
              },
              "&Outdent": {
                value: "インデントを戻す(&O)"
              },
              "&Auto Indent": {
                value: "自動インデント(&A)"
              },
              "Move Line &Up": {
                value: "選択中の行を上に移動(&U)"
              },
              "Move Line &Down": {
                value: "選択中の行を下に移動(&D)"
              },
              "Du&plicate Lines": {
                value: "行を複製(&P)"
              },
              "D&elete Line": {
                value: "行を削除(&E)"
              },
              "&Join Lines": {
                value: "行を結合(&J)"
              }
            }
          },
          Columns: {
            value: "列",
            submenu: {
              "Move Selection &Left": {
                value: "選択範囲を左に移動(&L)"
              },
              "Move Selection &Right": {
                value: "選択範囲を右に移動(&R)"
              }
            }
          },
          Text: {
            value: "テキスト",
            submenu: {
              "&Upper Case": {
                value: "大文字に変換(&U)"
              },
              "&Lower Case": {
                value: "小文字に変換(&L)"
              },
              "Delete to End of &Word": {
                value: "単語の末尾まで削除(&W)"
              },
              "Delete to Previous Word Boundary": {
                value: "前の単語の境界まで削除"
              },
              "Delete to Next Word Boundary": {
                value: "次の単語の境界まで削除"
              },
              "&Delete Line": {
                value: "行を削除(&D)"
              },
              "&Transpose": {
                value: "前後を入れ替え(&T)"
              }
            }
          },
          Folding: {
            value: "折りたたみ",
            submenu: {
              "&Fold": {
                value: "折りたたむ(&F)"
              },
              "&Unfold": {
                value: "折りたたみを戻す(&U)"
              },
              "Unfold &All": {
                value: "すべての折りたたみを戻す(&A)"
              },
              "Fol&d All": {
                value: "すべて折りたたむ(&D)"
              },
              "Fold Level 1": {
                value: "1段階折りたたむ"
              },
              "Fold Level 2": {
                value: "2段階折りたたむ"
              },
              "Fold Level 3": {
                value: "3段階折りたたむ"
              },
              "Fold Level 4": {
                value: "4段階折りたたむ"
              },
              "Fold Level 5": {
                value: "5段階折りたたむ"
              },
              "Fold Level 6": {
                value: "6段階折りたたむ"
              },
              "Fold Level 7": {
                value: "7段階折りたたむ"
              },
              "Fold Level 8": {
                value: "8段階折りたたむ"
              },
              "Fold Level 9": {
                value: "9段階折りたたむ"
              }
            }
          },
          "&Preferences": {
            value: "環境設定(&P)..."
          },
          "Config…": {
            value: "個人設定..."
          },
          "Init Script…": {
            value: "起動スクリプト..."
          },
          "Keymap…": {
            value: "キーマップ..."
          },
          "Snippets…": {
            value: "スニペット..."
          },
          "Stylesheet…": {
            value: "スタイルシート..."
          },
          "Reflow Selection": {
            value: "選択範囲をリフロー"
          },
          Bookmark: {
            value: "ブックマーク",
            submenu: {
              "View All": {
                value: "すべて表示"
              },
              "Toggle Bookmark": {
                value: "ブックマークの切替"
              },
              "Jump to Next Bookmark": {
                value: "次のブックマークへ"
              },
              "Jump to Previous Bookmark": {
                value: "前のブックマークへ"
              }
            }
          },
          "Select Encoding": {
            value: "エンコーディング選択"
          },
          "Go to Line": {
            value: "指定行に移動"
          },
          "Select Grammar": {
            value: "文法を選択"
          }
        }
      },
      "&View": {
        value: "表示(&V)",
        submenu: {
          "Toggle &Full Screen": {
            value: "フルスクリーン切替(&F)"
          },
          "Toggle Menu Bar": {
            value: "メニューバー切替"
          },
          Panes: {
            value: "ペイン",
            submenu: {
              "Split Up": {
                value: "ペイン分割 ↑"
              },
              "Split Down": {
                value: "ペイン分割 ↓"
              },
              "Split Left": {
                value: "ペイン分割 ←"
              },
              "Split Right": {
                value: "ペイン分割 →"
              },
              "Focus Next Pane": {
                value: "次のペインにフォーカス"
              },
              "Focus Previous Pane": {
                value: "前のペインにフォーカス"
              },
              "Focus Pane Above": {
                value: "ペインにフォーカス ↑"
              },
              "Focus Pane Below": {
                value: "ペインにフォーカス ↓"
              },
              "Focus Pane On Left": {
                value: "ペインにフォーカス ←"
              },
              "Focus Pane On Right": {
                value: "ペインにフォーカス →"
              },
              "Close Pane": {
                value: "ペインを閉じる"
              }
            }
          },
          Developer: {
            value: "開発",
            submenu: {
              "Open In &Dev Mode…": {
                value: "開発モードで開く(&D)..."
              },
              "&Reload Window": {
                value: "ウィンドウの再読み込み(&R)"
              },
              "Run Package &Specs": {
                value: "パッケージスペックを実行(&S)"
              },
              "Toggle Developer &Tools": {
                value: "デベロッパー ツール(&T)"
              }
            }
          },
          "&Increase Font Size": {
            value: "フォントサイズの拡大"
          },
          "&Decrease Font Size": {
            value: "フォントサイズの縮小"
          },
          "Re&set Font Size": {
            value: "フォントサイズのリセット"
          },
          "Toggle Soft &Wrap": {
            value: "自動折り返しの切替(&W)"
          },
          "Toggle Command Palette": {
            value: "コマンドパレット"
          },
          "Toggle Tree View": {
            value: "ツリービュー"
          }
        }
      },
      "&Selection": {
        value: "選択(&S)",
        submenu: {
          "Add Selection &Above": {
            value: "選択範囲を広げる ↑(&A)"
          },
          "Add Selection &Below": {
            value: "選択範囲を広げる ↓(&B)"
          },
          "S&plit into Lines": {
            value: "選択範囲を各行に分割して同時操作(&P)"
          },
          "Single Selection": {
            value: "同時操作状態を解除"
          },
          "Select to &Top": {
            value: "ファイル先頭まで選択(&T)"
          },
          "Select to Botto&m": {
            value: "ファイル末尾まで選択(&M)"
          },
          "Select &Line": {
            value: "行を選択(&L)"
          },
          "Select &Word": {
            value: "単語を選択(&W)"
          },
          "Select to Beginning of W&ord": {
            value: "単語の先頭まで選択(&O)"
          },
          "Select to Beginning of L&ine": {
            value: "行頭まで選択(&I)"
          },
          "Select to First &Character of Line": {
            value: "行の最初の文字まで選択(&C)"
          },
          "Select to End of Wor&d": {
            value: "単語の末尾まで選択(&D)"
          },
          "Select to End of Lin&e": {
            value: "行末まで選択(&E)"
          },
          "Select Inside Brackets": {
            value: "カッコ内を選択"
          }
        }
      },
      "F&ind": {
        value: "検索(&I)",
        submenu: {
          "Find in Buffer": {
            value: "検索..."
          },
          "Replace in Buffer": {
            value: "置換..."
          },
          "Select Next": {
            value: "次の一致も選択"
          },
          "Select All": {
            value: "一致をすべて選択"
          },
          "Toggle Find in Buffer": {
            value: "検索パネル切替"
          },
          "Find in Project": {
            value: "プロジェクト内検索..."
          },
          "Toggle Find in Project": {
            value: "プロジェクト内検索パネル切替"
          },
          "Find All": {
            value: "すべて検索"
          },
          "Find Next": {
            value: "次を検索"
          },
          "Find Previous": {
            value: "前を検索"
          },
          "Replace Next": {
            value: "次を置換"
          },
          "Replace All": {
            value: "すべて置換"
          },
          "Clear History": {
            value: "履歴をクリア"
          },
          "Find Buffer": {
            value: "バッファを検索"
          },
          "Find File": {
            value: "ファイルを検索"
          },
          "Find Modified File": {
            value: "修正されたファイルを検索"
          }
        }
      },
      "&Packages": {
        value: "パッケージ(&P)"
      },
      "&Help": {
        value: "ヘルプ(&H)",
        submenu: {
          "View &Terms of Use": {
            value: "利用条件(&T)"
          },
          "View &License": {
            value: "ライセンス(&L)"
          },
          "&Documentation": {
            value: "ドキュメント(&D)"
          },
          Roadmap: {
            value: "ロードマップ"
          },
          "Frequently Asked Questions": {
            value: "よくあるご質問"
          },
          "Community Discussions": {
            value: "コミュニティ ディスカッション"
          },
          "Report Issue": {
            value: "問題の報告"
          },
          "Search Issues": {
            value: "報告されている問題"
          },
          "About Atom": {
            value: "Atom について"
          },
          "Welcome Guide": {
            value: "ウェルカムガイド"
          }
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLW1lbnUvZGVmL21lbnVfbGludXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFDakIsSUFBQSxFQUNFO01BQUEsT0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLFVBQVA7UUFDQSxPQUFBLEVBQ0U7VUFBQSxhQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8sYUFBUDtXQURGO1VBRUEsV0FBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLFlBQVA7V0FIRjtVQUlBLGFBQUEsRUFDRTtZQUFBLEtBQUEsRUFBTyxXQUFQO1dBTEY7VUFNQSxjQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8sWUFBUDtXQVBGO1VBUUEscUJBQUEsRUFDRTtZQUFBLEtBQUEsRUFBTyxrQkFBUDtXQVRGO1VBVUEsZ0JBQUEsRUFDRTtZQUFBLEtBQUEsRUFBTyxjQUFQO1lBQ0EsT0FBQSxFQUNFO2NBQUEsdUJBQUEsRUFDRTtnQkFBQSxLQUFBLEVBQU8sY0FBUDtlQURGO2FBRkY7V0FYRjtVQWVBLG1CQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8sb0JBQVA7V0FoQkY7VUFpQkEsT0FBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLFFBQVA7V0FsQkY7VUFtQkEsV0FBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLGNBQVA7V0FwQkY7VUFxQkEsV0FBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLFdBQVA7V0F0QkY7VUF1QkEsWUFBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLFlBQVA7V0F4QkY7VUF5QkEsYUFBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLGFBQVA7V0ExQkY7VUEyQkEsZUFBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLGVBQVA7V0E1QkY7VUE2QkEsTUFBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLElBQVA7V0E5QkY7VUErQkEsZ0JB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QUFQO1dBVEY7VUFVQSx1QkFBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLGlCQUFQO1dBWEY7VUFZQSxjQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8sT0FBUDtXQWJGO1VBY0EsZUFBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLFdBQVA7V0FmRjtVQWdCQSxZQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8sV0FBUDtXQWpCRjtVQWtCQSxlQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8sVUFBUDtXQW5CRjtTQUZGO09BMVJGO0tBRmU7O0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG5NZW51OlxuICBcIiZGaWxlXCI6XG4gICAgdmFsdWU6IFwi44OV44Kh44Kk44OrKCZGKVwiXG4gICAgc3VibWVudTpcbiAgICAgIFwiTmV3ICZXaW5kb3dcIjpcbiAgICAgICAgdmFsdWU6IFwi5paw6KaP44Km44Kk44Oz44OJ44KmKCZXKVwiXG4gICAgICBcIiZOZXcgRmlsZVwiOlxuICAgICAgICB2YWx1ZTogXCLmlrDopo/jg5XjgqHjgqTjg6soJk4pXCJcbiAgICAgIFwiJk9wZW4gRmlsZeKAplwiOlxuICAgICAgICB2YWx1ZTogXCLplovjgY8oJk8pLi4uXCJcbiAgICAgIFwiT3BlbiBGb2xkZXLigKZcIjpcbiAgICAgICAgdmFsdWU6IFwi44OV44Kp44Or44OA44KS6ZaL44GPLi4uXCJcbiAgICAgIFwiQWRkIFByb2plY3QgRm9sZGVy4oCmXCI6XG4gICAgICAgIHZhbHVlOiBcIuODl+ODreOCuOOCp+OCr+ODiOODleOCqeODq+ODgOOCkui/veWKoC4uLlwiXG4gICAgICBcIlJlb3BlbiBQcm9qZWN0XCI6XG4gICAgICAgIHZhbHVlOiBcIuODl+ODreOCuOOCp+OCr+ODiOWxpeattOOBi+OCiemWi+OBj1wiXG4gICAgICAgIHN1Ym1lbnU6XG4gICAgICAgICAgXCJDbGVhciBQcm9qZWN0IEhpc3RvcnlcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuODl+ODreOCuOOCp+OCr+ODiOWxpeattOOCkuOCr+ODquOColwiXG4gICAgICBcIlJlb3BlbiBMYXN0ICZJdGVtXCI6XG4gICAgICAgIHZhbHVlOiBcIuacgOW+jOOBq+S9v+eUqOOBl+OBn+ODleOCoeOCpOODq+OCkumWi+OBjygmSSlcIlxuICAgICAgXCImU2F2ZVwiOlxuICAgICAgICB2YWx1ZTogXCLkv53lrZgoJlMpXCJcbiAgICAgIFwiU2F2ZSAmQXPigKZcIjpcbiAgICAgICAgdmFsdWU6IFwi5Yil5ZCN44Gn5L+d5a2YKCZBKS4uLlwiXG4gICAgICBcIlNhdmUgQSZsbFwiOlxuICAgICAgICB2YWx1ZTogXCLjgZnjgbnjgabkv53lrZgoJkwpXCJcbiAgICAgIFwiJkNsb3NlIFRhYlwiOlxuICAgICAgICB2YWx1ZTogXCLjgr/jg5bjgpLplonjgZjjgosoJkMpXCJcbiAgICAgIFwiQ2xvc2UgJlBhbmVcIjpcbiAgICAgICAgdmFsdWU6IFwi44Oa44Kk44Oz44KS6ZaJ44GY44KLKCZQKVwiXG4gICAgICBcIkNsb3MmZSBXaW5kb3dcIjpcbiAgICAgICAgdmFsdWU6IFwi44Km44Kk44Oz44OJ44Km44KS6ZaJ44GY44KLKCZFKVwiXG4gICAgICBcIlF1aXRcIjpcbiAgICAgICAgdmFsdWU6IFwi57WC5LqGXCJcbiAgICAgIFwiQ2xvc2UgQWxsIFRhYnNcIjpcbiAgICAgICAgdmFsdWU6IFwi44K/44OW44KS44GZ44G544Gm6ZaJ44GY44KLXCJcbiAgXCImRWRpdFwiOlxuICAgIHZhbHVlOiBcIue3qOmbhigmRSlcIlxuICAgIHN1Ym1lbnU6XG4gICAgICBcIiZVbmRvXCI6XG4gICAgICAgIHZhbHVlOiBcIuWPluOCiua2iOOBmSgmVSlcIlxuICAgICAgXCImUmVkb1wiOlxuICAgICAgICB2YWx1ZTogXCLjgoTjgornm7TjgZkoJlIpXCJcbiAgICAgIFwiJkN1dFwiOlxuICAgICAgICB2YWx1ZTogXCLjgqvjg4Pjg4goJkMpXCJcbiAgICAgIFwiQyZvcHlcIjpcbiAgICAgICAgdmFsdWU6IFwi44Kz44OU44O8KCZPKVwiXG4gICAgICBcIkNvcHkgUGF0JmhcIjpcbiAgICAgICAgdmFsdWU6IFwi44OR44K544KS44Kz44OU44O8KCZIKVwiXG4gICAgICBcIiZQYXN0ZVwiOlxuICAgICAgICB2YWx1ZTogXCLjg5rjg7zjgrnjg4goJlApXCJcbiAgICAgIFwiU2VsZWN0ICZBbGxcIjpcbiAgICAgICAgdmFsdWU6IFwi44GZ44G544Gm6YG45oqeKCZBKVwiXG4gICAgICBcIiZUb2dnbGUgQ29tbWVudHNcIjpcbiAgICAgICAgdmFsdWU6IFwi44Kz44Oh44Oz44OI44Gu5YiH5pu/KCZUKVwiXG4gICAgICBMaW5lczpcbiAgICAgICAgdmFsdWU6IFwi6KGMXCJcbiAgICAgICAgc3VibWVudTpcbiAgICAgICAgICBcIiZJbmRlbnRcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuOCpOODs+ODh+ODs+ODiOOCkui/veWKoCgmSSlcIlxuICAgICAgICAgIFwiJk91dGRlbnRcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuOCpOODs+ODh+ODs+ODiOOCkuaIu+OBmSgmTylcIlxuICAgICAgICAgIFwiJkF1dG8gSW5kZW50XCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLoh6rli5XjgqTjg7Pjg4fjg7Pjg4goJkEpXCJcbiAgICAgICAgICBcIk1vdmUgTGluZSAmVXBcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIumBuOaKnuS4reOBruihjOOCkuS4iuOBq+enu+WLlSgmVSlcIlxuICAgICAgICAgIFwiTW92ZSBMaW5lICZEb3duXCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLpgbjmip7kuK3jga7ooYzjgpLkuIvjgavnp7vli5UoJkQpXCJcbiAgICAgICAgICBcIkR1JnBsaWNhdGUgTGluZXNcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuihjOOCkuikh+ijvSgmUClcIlxuICAgICAgICAgIFwiRCZlbGV0ZSBMaW5lXCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLooYzjgpLliYrpmaQoJkUpXCJcbiAgICAgICAgICBcIiZKb2luIExpbmVzXCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLooYzjgpLntZDlkIgoJkopXCJcbiAgICAgIENvbHVtbnM6XG4gICAgICAgIHZhbHVlOiBcIuWIl1wiXG4gICAgICAgIHN1Ym1lbnU6XG4gICAgICAgICAgXCJNb3ZlIFNlbGVjdGlvbiAmTGVmdFwiOlxuICAgICAgICAgICAgdmFsdWU6IFwi6YG45oqe56+E5Zuy44KS5bem44Gr56e75YuVKCZMKVwiXG4gICAgICAgICAgXCJNb3ZlIFNlbGVjdGlvbiAmUmlnaHRcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIumBuOaKnuevhOWbsuOCkuWPs+OBq+enu+WLlSgmUilcIlxuICAgICAgVGV4dDpcbiAgICAgICAgdmFsdWU6IFwi44OG44Kt44K544OIXCJcbiAgICAgICAgc3VibWVudTpcbiAgICAgICAgICBcIiZVcHBlciBDYXNlXCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLlpKfmloflrZfjgavlpInmj5soJlUpXCJcbiAgICAgICAgICBcIiZMb3dlciBDYXNlXCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLlsI/mloflrZfjgavlpInmj5soJkwpXCJcbiAgICAgICAgICBcIkRlbGV0ZSB0byBFbmQgb2YgJldvcmRcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuWNmOiqnuOBruacq+WwvuOBvuOBp+WJiumZpCgmVylcIlxuICAgICAgICAgIFwiRGVsZXRlIHRvIFByZXZpb3VzIFdvcmQgQm91bmRhcnlcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuWJjeOBruWNmOiqnuOBruWig+eVjOOBvuOBp+WJiumZpFwiXG4gICAgICAgICAgXCJEZWxldGUgdG8gTmV4dCBXb3JkIEJvdW5kYXJ5XCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLmrKHjga7ljZjoqp7jga7looPnlYzjgb7jgafliYrpmaRcIlxuICAgICAgICAgIFwiJkRlbGV0ZSBMaW5lXCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLooYzjgpLliYrpmaQoJkQpXCJcbiAgICAgICAgICBcIiZUcmFuc3Bvc2VcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuWJjeW+jOOCkuWFpeOCjOabv+OBiCgmVClcIlxuICAgICAgRm9sZGluZzpcbiAgICAgICAgdmFsdWU6IFwi5oqY44KK44Gf44Gf44G/XCJcbiAgICAgICAgc3VibWVudTpcbiAgICAgICAgICBcIiZGb2xkXCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLmipjjgorjgZ/jgZ/jgoAoJkYpXCJcbiAgICAgICAgICBcIiZVbmZvbGRcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuaKmOOCiuOBn+OBn+OBv+OCkuaIu+OBmSgmVSlcIlxuICAgICAgICAgIFwiVW5mb2xkICZBbGxcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuOBmeOBueOBpuOBruaKmOOCiuOBn+OBn+OBv+OCkuaIu+OBmSgmQSlcIlxuICAgICAgICAgIFwiRm9sJmQgQWxsXCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLjgZnjgbnjgabmipjjgorjgZ/jgZ/jgoAoJkQpXCJcbiAgICAgICAgICBcIkZvbGQgTGV2ZWwgMVwiOlxuICAgICAgICAgICAgdmFsdWU6IFwiMeautemajuaKmOOCiuOBn+OBn+OCgFwiXG4gICAgICAgICAgXCJGb2xkIExldmVsIDJcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIjLmrrXpmo7mipjjgorjgZ/jgZ/jgoBcIlxuICAgICAgICAgIFwiRm9sZCBMZXZlbCAzXCI6XG4gICAgICAgICAgICB2YWx1ZTogXCIz5q616ZqO5oqY44KK44Gf44Gf44KAXCJcbiAgICAgICAgICBcIkZvbGQgTGV2ZWwgNFwiOlxuICAgICAgICAgICAgdmFsdWU6IFwiNOautemajuaKmOOCiuOBn+OBn+OCgFwiXG4gICAgICAgICAgXCJGb2xkIExldmVsIDVcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIjXmrrXpmo7mipjjgorjgZ/jgZ/jgoBcIlxuICAgICAgICAgIFwiRm9sZCBMZXZlbCA2XCI6XG4gICAgICAgICAgICB2YWx1ZTogXCI25q616ZqO5oqY44KK44Gf44Gf44KAXCJcbiAgICAgICAgICBcIkZvbGQgTGV2ZWwgN1wiOlxuICAgICAgICAgICAgdmFsdWU6IFwiN+autemajuaKmOOCiuOBn+OBn+OCgFwiXG4gICAgICAgICAgXCJGb2xkIExldmVsIDhcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIjjmrrXpmo7mipjjgorjgZ/jgZ/jgoBcIlxuICAgICAgICAgIFwiRm9sZCBMZXZlbCA5XCI6XG4gICAgICAgICAgICB2YWx1ZTogXCI55q616ZqO5oqY44KK44Gf44Gf44KAXCJcbiAgICAgIFwiJlByZWZlcmVuY2VzXCI6XG4gICAgICAgIHZhbHVlOiBcIueSsOWig+ioreWumigmUCkuLi5cIlxuICAgICAgXCJDb25maWfigKZcIjpcbiAgICAgICAgdmFsdWU6IFwi5YCL5Lq66Kit5a6aLi4uXCJcbiAgICAgIFwiSW5pdCBTY3JpcHTigKZcIjpcbiAgICAgICAgdmFsdWU6IFwi6LW35YuV44K544Kv44Oq44OX44OILi4uXCJcbiAgICAgIFwiS2V5bWFw4oCmXCI6XG4gICAgICAgIHZhbHVlOiBcIuOCreODvOODnuODg+ODly4uLlwiXG4gICAgICBcIlNuaXBwZXRz4oCmXCI6XG4gICAgICAgIHZhbHVlOiBcIuOCueODi+ODmuODg+ODiC4uLlwiXG4gICAgICBcIlN0eWxlc2hlZXTigKZcIjpcbiAgICAgICAgdmFsdWU6IFwi44K544K/44Kk44Or44K344O844OILi4uXCJcbiAgICAgIFwiUmVmbG93IFNlbGVjdGlvblwiOlxuICAgICAgICB2YWx1ZTogXCLpgbjmip7nr4Tlm7LjgpLjg6rjg5Xjg63jg7xcIlxuICAgICAgQm9va21hcms6XG4gICAgICAgIHZhbHVlOiBcIuODluODg+OCr+ODnuODvOOCr1wiXG4gICAgICAgIHN1Ym1lbnU6XG4gICAgICAgICAgXCJWaWV3IEFsbFwiOlxuICAgICAgICAgICAgdmFsdWU6IFwi44GZ44G544Gm6KGo56S6XCJcbiAgICAgICAgICBcIlRvZ2dsZSBCb29rbWFya1wiOlxuICAgICAgICAgICAgdmFsdWU6IFwi44OW44OD44Kv44Oe44O844Kv44Gu5YiH5pu/XCJcbiAgICAgICAgICBcIkp1bXAgdG8gTmV4dCBCb29rbWFya1wiOlxuICAgICAgICAgICAgdmFsdWU6IFwi5qyh44Gu44OW44OD44Kv44Oe44O844Kv44G4XCJcbiAgICAgICAgICBcIkp1bXAgdG8gUHJldmlvdXMgQm9va21hcmtcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuWJjeOBruODluODg+OCr+ODnuODvOOCr+OBuFwiXG4gICAgICBcIlNlbGVjdCBFbmNvZGluZ1wiOlxuICAgICAgICB2YWx1ZTogXCLjgqjjg7PjgrPjg7zjg4fjgqPjg7PjgrDpgbjmip5cIlxuICAgICAgXCJHbyB0byBMaW5lXCI6XG4gICAgICAgIHZhbHVlOiBcIuaMh+WumuihjOOBq+enu+WLlVwiXG4gICAgICBcIlNlbGVjdCBHcmFtbWFyXCI6XG4gICAgICAgIHZhbHVlOiBcIuaWh+azleOCkumBuOaKnlwiXG4gIFwiJlZpZXdcIjpcbiAgICB2YWx1ZTogXCLooajnpLooJlYpXCJcbiAgICBzdWJtZW51OlxuICAgICAgXCJUb2dnbGUgJkZ1bGwgU2NyZWVuXCI6XG4gICAgICAgIHZhbHVlOiBcIuODleODq+OCueOCr+ODquODvOODs+WIh+abvygmRilcIlxuICAgICAgXCJUb2dnbGUgTWVudSBCYXJcIjpcbiAgICAgICAgdmFsdWU6IFwi44Oh44OL44Ol44O844OQ44O85YiH5pu/XCJcbiAgICAgIFBhbmVzOlxuICAgICAgICB2YWx1ZTogXCLjg5rjgqTjg7NcIlxuICAgICAgICBzdWJtZW51OlxuICAgICAgICAgIFwiU3BsaXQgVXBcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuODmuOCpOODs+WIhuWJsiDihpFcIlxuICAgICAgICAgIFwiU3BsaXQgRG93blwiOlxuICAgICAgICAgICAgdmFsdWU6IFwi44Oa44Kk44Oz5YiG5YmyIOKGk1wiXG4gICAgICAgICAgXCJTcGxpdCBMZWZ0XCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLjg5rjgqTjg7PliIblibIg4oaQXCJcbiAgICAgICAgICBcIlNwbGl0IFJpZ2h0XCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLjg5rjgqTjg7PliIblibIg4oaSXCJcbiAgICAgICAgICBcIkZvY3VzIE5leHQgUGFuZVwiOlxuICAgICAgICAgICAgdmFsdWU6IFwi5qyh44Gu44Oa44Kk44Oz44Gr44OV44Kp44O844Kr44K5XCJcbiAgICAgICAgICBcIkZvY3VzIFByZXZpb3VzIFBhbmVcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuWJjeOBruODmuOCpOODs+OBq+ODleOCqeODvOOCq+OCuVwiXG4gICAgICAgICAgXCJGb2N1cyBQYW5lIEFib3ZlXCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLjg5rjgqTjg7Pjgavjg5Xjgqnjg7zjgqvjgrkg4oaRXCJcbiAgICAgICAgICBcIkZvY3VzIFBhbmUgQmVsb3dcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuODmuOCpOODs+OBq+ODleOCqeODvOOCq+OCuSDihpNcIlxuICAgICAgICAgIFwiRm9jdXMgUGFuZSBPbiBMZWZ0XCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLjg5rjgqTjg7Pjgavjg5Xjgqnjg7zjgqvjgrkg4oaQXCJcbiAgICAgICAgICBcIkZvY3VzIFBhbmUgT24gUmlnaHRcIjpcbiAgICAgICAgICAgIHZhbHVlOiBcIuODmuOCpOODs+OBq+ODleOCqeODvOOCq+OCuSDihpJcIlxuICAgICAgICAgIFwiQ2xvc2UgUGFuZVwiOlxuICAgICAgICAgICAgdmFsdWU6IFwi44Oa44Kk44Oz44KS6ZaJ44GY44KLXCJcbiAgICAgIERldmVsb3BlcjpcbiAgICAgICAgdmFsdWU6IFwi6ZaL55m6XCJcbiAgICAgICAgc3VibWVudTpcbiAgICAgICAgICBcIk9wZW4gSW4gJkRldiBNb2Rl4oCmXCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLplovnmbrjg6Ljg7zjg4njgafplovjgY8oJkQpLi4uXCJcbiAgICAgICAgICBcIiZSZWxvYWQgV2luZG93XCI6XG4gICAgICAgICAgICB2YWx1ZTogXCLjgqbjgqPjg7Pjg4njgqbjga7lho3oqq3jgb/ovrzjgb8oJlIpXCJcbiAgICAgICAgICBcIlJ1biBQYWNrYWdlICZTcGVjc1wiOlxuICAgICAgICAgICAgdmFsdWU6IFwi44OR44OD44Kx44O844K444K544Oa44OD44Kv44KS5a6f6KGMKCZTKVwiXG4gICAgICAgICAgXCJUb2dnbGUgRGV2ZWxvcGVyICZUb29sc1wiOlxuICAgICAgICAgICAgdmFsdWU6IFwi44OH44OZ44Ot44OD44OR44O8IOODhOODvOODqygmVClcIlxuICAgICAgXCImSW5jcmVhc2UgRm9udCBTaXplXCI6XG4gICAgICAgIHZhbHVlOiBcIuODleOCqeODs+ODiOOCteOCpOOCuuOBruaLoeWkp1wiXG4gICAgICBcIiZEZWNyZWFzZSBGb250IFNpemVcIjpcbiAgICAgICAgdmFsdWU6IFwi44OV44Kp44Oz44OI44K144Kk44K644Gu57iu5bCPXCJcbiAgICAgIFwiUmUmc2V0IEZvbnQgU2l6ZVwiOlxuICAgICAgICB2YWx1ZTogXCLjg5Xjgqnjg7Pjg4jjgrXjgqTjgrrjga7jg6rjgrvjg4Pjg4hcIlxuICAgICAgXCJUb2dnbGUgU29mdCAmV3JhcFwiOlxuICAgICAgICB2YWx1ZTogXCLoh6rli5Xmipjjgorov5TjgZfjga7liIfmm78oJlcpXCJcbiAgICAgIFwiVG9nZ2xlIENvbW1hbmQgUGFsZXR0ZVwiOlxuICAgICAgICB2YWx1ZTogXCLjgrPjg57jg7Pjg4njg5Hjg6zjg4Pjg4hcIlxuICAgICAgXCJUb2dnbGUgVHJlZSBWaWV3XCI6XG4gICAgICAgIHZhbHVlOiBcIuODhOODquODvOODk+ODpeODvFwiXG4gIFwiJlNlbGVjdGlvblwiOlxuICAgIHZhbHVlOiBcIumBuOaKnigmUylcIlxuICAgIHN1Ym1lbnU6XG4gICAgICBcIkFkZCBTZWxlY3Rpb24gJkFib3ZlXCI6XG4gICAgICAgIHZhbHVlOiBcIumBuOaKnuevhOWbsuOCkuW6g+OBkuOCiyDihpEoJkEpXCJcbiAgICAgIFwiQWRkIFNlbGVjdGlvbiAmQmVsb3dcIjpcbiAgICAgICAgdmFsdWU6IFwi6YG45oqe56+E5Zuy44KS5bqD44GS44KLIOKGkygmQilcIlxuICAgICAgXCJTJnBsaXQgaW50byBMaW5lc1wiOlxuICAgICAgICB2YWx1ZTogXCLpgbjmip7nr4Tlm7LjgpLlkITooYzjgavliIblibLjgZfjgablkIzmmYLmk43kvZwoJlApXCJcbiAgICAgIFwiU2luZ2xlIFNlbGVjdGlvblwiOlxuICAgICAgICB2YWx1ZTogXCLlkIzmmYLmk43kvZznirbmhYvjgpLop6PpmaRcIlxuICAgICAgXCJTZWxlY3QgdG8gJlRvcFwiOlxuICAgICAgICB2YWx1ZTogXCLjg5XjgqHjgqTjg6vlhYjpoK3jgb7jgafpgbjmip4oJlQpXCJcbiAgICAgIFwiU2VsZWN0IHRvIEJvdHRvJm1cIjpcbiAgICAgICAgdmFsdWU6IFwi44OV44Kh44Kk44Or5pyr5bC+44G+44Gn6YG45oqeKCZNKVwiXG4gICAgICBcIlNlbGVjdCAmTGluZVwiOlxuICAgICAgICB2YWx1ZTogXCLooYzjgpLpgbjmip4oJkwpXCJcbiAgICAgIFwiU2VsZWN0ICZXb3JkXCI6XG4gICAgICAgIHZhbHVlOiBcIuWNmOiqnuOCkumBuOaKnigmVylcIlxuICAgICAgXCJTZWxlY3QgdG8gQmVnaW5uaW5nIG9mIFcmb3JkXCI6XG4gICAgICAgIHZhbHVlOiBcIuWNmOiqnuOBruWFiOmgreOBvuOBp+mBuOaKnigmTylcIlxuICAgICAgXCJTZWxlY3QgdG8gQmVnaW5uaW5nIG9mIEwmaW5lXCI6XG4gICAgICAgIHZhbHVlOiBcIuihjOmgreOBvuOBp+mBuOaKnigmSSlcIlxuICAgICAgXCJTZWxlY3QgdG8gRmlyc3QgJkNoYXJhY3RlciBvZiBMaW5lXCI6XG4gICAgICAgIHZhbHVlOiBcIuihjOOBruacgOWIneOBruaWh+Wtl+OBvuOBp+mBuOaKnigmQylcIlxuICAgICAgXCJTZWxlY3QgdG8gRW5kIG9mIFdvciZkXCI6XG4gICAgICAgIHZhbHVlOiBcIuWNmOiqnuOBruacq+WwvuOBvuOBp+mBuOaKnigmRClcIlxuICAgICAgXCJTZWxlY3QgdG8gRW5kIG9mIExpbiZlXCI6XG4gICAgICAgIHZhbHVlOiBcIuihjOacq+OBvuOBp+mBuOaKnigmRSlcIlxuICAgICAgXCJTZWxlY3QgSW5zaWRlIEJyYWNrZXRzXCI6XG4gICAgICAgIHZhbHVlOiBcIuOCq+ODg+OCs+WGheOCkumBuOaKnlwiXG4gIFwiRiZpbmRcIjpcbiAgICB2YWx1ZTogXCLmpJzntKIoJkkpXCJcbiAgICBzdWJtZW51OlxuICAgICAgXCJGaW5kIGluIEJ1ZmZlclwiOlxuICAgICAgICB2YWx1ZTogXCLmpJzntKIuLi5cIlxuICAgICAgXCJSZXBsYWNlIGluIEJ1ZmZlclwiOlxuICAgICAgICB2YWx1ZTogXCLnva7mj5suLi5cIlxuICAgICAgXCJTZWxlY3QgTmV4dFwiOlxuICAgICAgICB2YWx1ZTogXCLmrKHjga7kuIDoh7TjgoLpgbjmip5cIlxuICAgICAgXCJTZWxlY3QgQWxsXCI6XG4gICAgICAgIHZhbHVlOiBcIuS4gOiHtOOCkuOBmeOBueOBpumBuOaKnlwiXG4gICAgICBcIlRvZ2dsZSBGaW5kIGluIEJ1ZmZlclwiOlxuICAgICAgICB2YWx1ZTogXCLmpJzntKLjg5Hjg43jg6vliIfmm79cIlxuICAgICAgXCJGaW5kIGluIFByb2plY3RcIjpcbiAgICAgICAgdmFsdWU6IFwi44OX44Ot44K444Kn44Kv44OI5YaF5qSc57SiLi4uXCJcbiAgICAgIFwiVG9nZ2xlIEZpbmQgaW4gUHJvamVjdFwiOlxuICAgICAgICB2YWx1ZTogXCLjg5fjg63jgrjjgqfjgq/jg4jlhoXmpJzntKLjg5Hjg43jg6vliIfmm79cIlxuICAgICAgXCJGaW5kIEFsbFwiOlxuICAgICAgICB2YWx1ZTogXCLjgZnjgbnjgabmpJzntKJcIlxuICAgICAgXCJGaW5kIE5leHRcIjpcbiAgICAgICAgdmFsdWU6IFwi5qyh44KS5qSc57SiXCJcbiAgICAgIFwiRmluZCBQcmV2aW91c1wiOlxuICAgICAgICB2YWx1ZTogXCLliY3jgpLmpJzntKJcIlxuICAgICAgXCJSZXBsYWNlIE5leHRcIjpcbiAgICAgICAgdmFsdWU6IFwi5qyh44KS572u5o+bXCJcbiAgICAgIFwiUmVwbGFjZSBBbGxcIjpcbiAgICAgICAgdmFsdWU6IFwi44GZ44G544Gm572u5o+bXCJcbiAgICAgIFwiQ2xlYXIgSGlzdG9yeVwiOlxuICAgICAgICB2YWx1ZTogXCLlsaXmrbTjgpLjgq/jg6rjgqJcIlxuICAgICAgXCJGaW5kIEJ1ZmZlclwiOlxuICAgICAgICB2YWx1ZTogXCLjg5Djg4Pjg5XjgqHjgpLmpJzntKJcIlxuICAgICAgXCJGaW5kIEZpbGVcIjpcbiAgICAgICAgdmFsdWU6IFwi44OV44Kh44Kk44Or44KS5qSc57SiXCJcbiAgICAgIFwiRmluZCBNb2RpZmllZCBGaWxlXCI6XG4gICAgICAgIHZhbHVlOiBcIuS/ruato+OBleOCjOOBn+ODleOCoeOCpOODq+OCkuaknOe0olwiXG4gIFwiJlBhY2thZ2VzXCI6XG4gICAgdmFsdWU6IFwi44OR44OD44Kx44O844K4KCZQKVwiXG4gIFwiJkhlbHBcIjpcbiAgICB2YWx1ZTogXCLjg5jjg6vjg5coJkgpXCJcbiAgICBzdWJtZW51OlxuICAgICAgXCJWaWV3ICZUZXJtcyBvZiBVc2VcIjpcbiAgICAgICAgdmFsdWU6IFwi5Yip55So5p2h5Lu2KCZUKVwiXG4gICAgICBcIlZpZXcgJkxpY2Vuc2VcIjpcbiAgICAgICAgdmFsdWU6IFwi44Op44Kk44K744Oz44K5KCZMKVwiXG4gICAgICBcIiZEb2N1bWVudGF0aW9uXCI6XG4gICAgICAgIHZhbHVlOiBcIuODieOCreODpeODoeODs+ODiCgmRClcIlxuICAgICAgUm9hZG1hcDpcbiAgICAgICAgdmFsdWU6IFwi44Ot44O844OJ44Oe44OD44OXXCJcbiAgICAgIFwiRnJlcXVlbnRseSBBc2tlZCBRdWVzdGlvbnNcIjpcbiAgICAgICAgdmFsdWU6IFwi44KI44GP44GC44KL44GU6LOq5ZWPXCJcbiAgICAgIFwiQ29tbXVuaXR5IERpc2N1c3Npb25zXCI6XG4gICAgICAgIHZhbHVlOiBcIuOCs+ODn+ODpeODi+ODhuOCoyDjg4fjgqPjgrnjgqvjg4Pjgrfjg6fjg7NcIlxuICAgICAgXCJSZXBvcnQgSXNzdWVcIjpcbiAgICAgICAgdmFsdWU6IFwi5ZWP6aGM44Gu5aCx5ZGKXCJcbiAgICAgIFwiU2VhcmNoIElzc3Vlc1wiOlxuICAgICAgICB2YWx1ZTogXCLloLHlkYrjgZXjgozjgabjgYTjgovllY/poYxcIlxuICAgICAgXCJBYm91dCBBdG9tXCI6XG4gICAgICAgIHZhbHVlOiBcIkF0b20g44Gr44Gk44GE44GmXCJcbiAgICAgIFwiV2VsY29tZSBHdWlkZVwiOlxuICAgICAgICB2YWx1ZTogXCLjgqbjgqfjg6vjgqvjg6DjgqzjgqTjg4lcIlxufVxuIl19
