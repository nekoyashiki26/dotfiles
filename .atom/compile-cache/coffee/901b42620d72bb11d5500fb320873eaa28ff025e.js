(function() {
  module.exports = {
    Settings: {
      menu: [
        {
          label: "Core",
          value: "コア設定"
        }, {
          label: "Editor",
          value: "エディタ設定"
        }, {
          label: "System",
          value: "システム設定"
        }, {
          label: "Keybindings",
          value: "キーバインド"
        }, {
          label: "Packages",
          value: "パッケージ"
        }, {
          label: "Themes",
          value: "テーマ"
        }, {
          label: "Updates",
          value: "アップデート"
        }, {
          label: "Install",
          value: "インストール"
        }
      ],
      sectionHeadings: [
        {
          label: "Core Settings",
          value: "コア設定"
        }, {
          label: "Editor Settings",
          value: "エディタ設定"
        }, {
          label: "System Settings",
          value: "システム設定"
        }, {
          label: "Keybindings",
          value: "キーバインド"
        }, {
          label: "Installed Packages",
          value: "インストール済みのパッケージ"
        }, {
          label: "Choose a Theme",
          value: "テーマの選択"
        }, {
          label: "Installed Themes",
          value: "インストール済みのテーマ"
        }, {
          label: "Install Packages",
          value: "パッケージのインストール"
        }, {
          label: "Featured Packages",
          value: "おすすめのパッケージ"
        }, {
          label: "Install Themes",
          value: "テーマのインストール"
        }, {
          label: "Featured Themes",
          value: "おすすめのテーマ"
        }
      ],
      subSectionHeadings: [
        {
          label: "Invisible",
          value: "不可視文字"
        }, {
          label: "Community Packages",
          value: "コミュニティパッケージ"
        }, {
          label: "Core Packages",
          value: "コアパッケージ"
        }, {
          label: "Development Packages",
          value: "開発パッケージ"
        }, {
          label: "Git Packages",
          value: "Git パッケージ"
        }, {
          label: "Community Themes",
          value: "コミュニティテーマ"
        }, {
          label: "Core Themes",
          value: "コアテーマ"
        }, {
          label: "Development Themes",
          value: "開発テーマ"
        }, {
          label: "Git Themes",
          value: "Git テーマ"
        }
      ],
      settings: {
        notes: [
          {
            id: 'core-settings-note',
            html: 'テキスト編集のふるまいとは関係のないコアな部分の設定項目です。個々のパッケージにも固有の設定項目が用意されている場合があるので、 こちらの <a class="link packages-open">パッケージリスト</a> からパッケージカードをクリックして設定をご確認ください。'
          }, {
            id: 'editor-settings-note',
            html: 'テキスト編集のふるまいに関する設定項目です。言語の基準によってはこれらの設定が上書きされる場合があるため、 こちらの <a class="link packages-open">パッケージリスト</a> からパッケージカードをクリックして設定をご確認ください。'
          }
        ],
        controls: [
          {
            id: 'core.allowPendingPaneItems',
            title: "プレビュータブを使う",
            desc: "ツリービューなどでファイルを選択した時にタブをプレビュー状態で開きます。 プレビュー時はタブ名が斜体となり、別のファイル選択時にタブが使い回されます。 ダブルクリックまたは編集を開始することでプレビュー状態が解除されます。"
          }, {
            id: 'core.audioBeep',
            title: "ビープ音を鳴らす",
            desc: "処理が予期したとおりに実行されなかったり、結果が何も得られなかった場合にシステムのビープ音を鳴らします。"
          }, {
            id: 'core.automaticallyUpdate',
            title: "自動アップデート",
            desc: "新しいバージョンの Atom がリリースされていた場合に自動でアップデートします。"
          }, {
            id: 'core.closeDeletedFileTabs',
            title: "削除されたファイルのタブを閉じる",
            desc: "Atom の外で削除されたファイルのタブを自動的に閉じます。"
          }, {
            id: 'core.autoHideMenuBar',
            title: "メニューバーを自動的に隠す",
            desc: "メニューバーを自動的に隠して Alt キーで切り替えます。この設定は Windows と Linux でのみサポートされます。"
          }, {
            id: 'core.closeEmptyWindows',
            title: "空になったウインドウをタブと同様に閉じる",
            desc: "ウインドウ内にタブもペインもない状態でタブを閉じるコマンドを与えた場合、ウインドウを閉じます。"
          }, {
            id: 'core.destroyEmptyPanes',
            title: "空になったペインを自動的に閉じる",
            desc: "最後に開いていたタブを閉じた場合、ペインも閉じます。"
          }, {
            id: 'core.excludeVcsIgnoredPaths',
            title: "バージョン管理システムによって無視されたパスを除外する",
            desc: "現在のプロジェクトで使用中のバージョン管理システムによって無視されたファイルとディレクトリが、あいまい検索や検索、置換の中で無視されるようになります。 例えば Git を使用しているプロジェクトでは .gitignore ファイルで定義されたパスがそれにあたります。 個々のパッケージにもこの設定とは別にファイルやフォルダを無視する設定があるかもしれません。"
          }, {
            id: 'core.fileEncoding',
            title: "ファイルエンコーディング",
            desc: "ファイルを読み書きするためのデフォルトキャラクタセットを指定します。"
          }, {
            id: 'core.followSymlinks',
            title: "シンボリックリンクをたどる",
            desc: "あいまい検索でファイルを検索・開く時に使用されます。"
          }, {
            id: 'core.ignoredNames',
            title: "無視するファイル",
            desc: "無視する glob パターンを列挙します。マッチしたファイルとディレクトリは、あいまい検索やツリービューで表示されなくなります。 個々のパッケージにもこの設定とは別にファイルやフォルダを無視する設定があるかもしれません。"
          }, {
            id: 'core.openEmptyEditorOnStart',
            title: "起動時に新規エディタを開く",
            desc: "起動時に新規のエディタを自動的に開きます。"
          }, {
            id: 'core.projectHome',
            title: "プロジェクトホーム",
            desc: "プロジェクト群を配置するディレクトリを指定します。パッケージジェネレータで作成されたパッケージはデフォルトでここが格納先となります。"
          }, {
            id: 'core.reopenProjectMenuCount',
            title: "プロジェクト履歴の表示数",
            desc: "メニュー「プロジェクト履歴から開く」に表示するプロジェクトの数を指定します。"
          }, {
            id: 'core.restorePreviousWindowsOnStart',
            title: "起動時に前回のウインドウ表示状態を復元する",
            desc: "アイコンもしくは atom コマンドから起動したときに、最後に開いていた Atom のウインドウすべてを復元します。"
          }, {
            id: 'core.telemetryConsent',
            title: "Atom チームに遠隔測定結果を送信する",
            desc: "使用統計データと障害レポートを Atom チームに送信して機能向上に役立てることを許可します。",
            select: {
              limited: "匿名で限定された使用統計データと障害レポートの送信を許可する",
              no: "遠隔測定結果を送信しない",
              undecided: "まだ決まっていない（次回起動時に再確認）"
            }
          }, {
            id: 'core.useCustomTitleBar',
            title: "カスタムタイトルバーを使う"
          }, {
            id: 'core.useProxySettingsWhenCallingApm',
            title: "APM を呼ぶときにプロキシ設定を使う",
            desc: "APM (Atom Package Manager) の apm コマンドラインツールを呼ぶときに、検出したプロキシ設定を使います。"
          }, {
            id: 'core.warnOnLargeFileLimit',
            title: "重いファイルを開く時に警告するサイズ",
            desc: "指定したファイルサイズ（メガバイト）より大きなファイルを開く前に警告します。"
          }, {
            id: 'editor.atomicSoftTabs',
            title: "アトミック ソフトタブ",
            desc: "カーソル移動の時、ソフトタブインデントの空白をタブ幅でスキップします。"
          }, {
            id: 'editor.autoIndent',
            title: "自動インデント",
            desc: "新しい行を挿入（改行）した時、カーソル位置を自動的にインデントした位置に移動します。"
          }, {
            id: 'editor.autoIndentOnPaste',
            title: "ペースト時に自動インデント",
            desc: "ペーストしたテキストを直前の行のインデントを基準に自動的にインデントします。"
          }, {
            id: 'editor.backUpBeforeSaving',
            title: "保存前にバックアップを取る",
            desc: "ファイルの保存中に I/O エラーが発生した場合にファイルの内容が失われないよう、バックアップ用の一時コピーを作成します。"
          }, {
            id: 'editor.confirmCheckoutHeadRevision',
            title: "変更を破棄して HEAD リビジョンに戻す時に確認する",
            desc: "コマンド `Editor: Checkout Head Revision` を使用して HEAD リビジョンをチェックアウトし現在の変更内容を破棄する前に確認ダイアログを表示します。"
          }, {
            id: 'editor.fontFamily',
            title: "フォント",
            desc: "font-family"
          }, {
            id: 'editor.fontSize',
            title: "フォントサイズ",
            desc: "font-size (px)"
          }, {
            id: 'editor.invisibles.cr',
            title: "不可視文字 キャリッジ・リターン (Cr)",
            desc: "キャリッジ・リターン（Microsoftスタイルの行末文字）として描画する文字（「不可視文字を表示」を有効にしている場合）"
          }, {
            id: 'editor.invisibles.eol',
            title: "不可視文字 改行 (Eol)",
            desc: "改行 (\\n) として描画する文字（「不可視文字を表示」を有効にしている場合）"
          }, {
            id: 'editor.invisibles.space',
            title: "不可視文字 スペース",
            desc: "スペース（行頭以前と行末以降）として描画する文字（「不可視文字を表示」を有効にしている場合）"
          }, {
            id: 'editor.invisibles.tab',
            title: "不可視文字 タブ",
            desc: "ハードタブ（\\t）として描画する文字（「不可視文字を表示」を有効にしている場合）"
          }, {
            id: 'editor.lineHeight',
            title: "行の高さ",
            desc: "line-height (number)"
          }, {
            id: 'editor.nonWordCharacters',
            title: "単語の一部として扱わない文字",
            desc: "単語の境界を定めるための文字"
          }, {
            id: 'editor.preferredLineLength',
            title: "右端ガイドの位置",
            desc: "「右端ガイドの位置でソフトラップ」が有効な場合にテキストを折り返す位置を文字数で指定します。"
          }, {
            id: 'editor.scrollPastEnd',
            title: "最終行を超えてスクロール",
            desc: "エディタに最終行が表示された地点でスクロールを止めないようにします。"
          }, {
            id: 'editor.scrollSensitivity',
            title: "スクロール速度",
            desc: "マウスやトラックパッドでエディタをスクロールする時の速度"
          }, {
            id: 'editor.showCursorOnSelection',
            title: "選択範囲にカーソルを表示",
            desc: "選択範囲が存在する場合にカーソル（点滅するＩビーム）を表示します。"
          }, {
            id: 'editor.showIndentGuide',
            title: "インデントガイドを表示",
            desc: "エディタ内にインデントガイドを表示します。"
          }, {
            id: 'editor.showInvisibles',
            title: "不可視文字を表示",
            desc: "タブやスペース、改行などの見えない文字を記号として表示します。"
          }, {
            id: 'editor.showLineNumbers',
            title: "行番号を表示",
            desc: "エディタ内に行番号を表示します。"
          }, {
            id: 'editor.softTabs',
            title: "ソフトタブ",
            desc: "タブ文字の代わりにスペースを連ねて挿入します。"
          }, {
            id: 'editor.softWrap',
            title: "ソフトラップ",
            desc: "ウィンドウ幅を超えた時に折り返して表示します。「右端ガイドの位置でソフトラップ」が有効の場合は「右端ガイドの位置」の設定値で折り返されます。"
          }, {
            id: 'editor.softWrapAtPreferredLineLength',
            title: "右端ガイドの位置でソフトラップ",
            desc: "「右端ガイドの位置」の設定値で折り返します。この設定はソフトラップがグローバルまたは作業中の言語で有効な場合のみ適用されます。"
          }, {
            id: 'editor.softWrapHangingIndent',
            title: "ソフトラップ時のインデント幅",
            desc: "「ソフトラップ」が有効な場合、ラップされた行に対し指定した文字数だけ追加でインデントします。"
          }, {
            id: 'editor.tabLength',
            title: "タブ幅",
            desc: "タブを表す際に使用されるスペースの数"
          }, {
            id: 'editor.tabType',
            title: "タブタイプ",
            desc: 'タブキーを押した際に挿入する文字の形式を指定します。"soft" はソフトタブ（Space）、"hard" はハードタブ（Tab）が使用されます。 "auto" はエディタがバッファの内容を自動判別します。自動判別は最初に見つけた行（コメント行を除く）の先頭にあるスペースで行われます。 自動判別できなかった場合はソフトタブが設定されます。'
          }, {
            id: 'editor.undoGroupingInterval',
            title: "取り消し操作単位",
            desc: "ひとまとまりの操作と認識させて取り消し履歴に登録する間隔（ミリ秒）"
          }, {
            id: 'editor.zoomFontWhenCtrlScrolling',
            title: "Ctrl スクロールでフォントサイズを変える",
            desc: "コントロールキーを押しながらスクロールを上下することでエディタのフォントサイズを拡大/縮小します。"
          }, {
            id: 'system.windows.file-handler',
            title: "ファイルを取扱うアプリとして登録する",
            desc: "ファイルの関連付けを簡単にするために、Atom を「プログラムから開く...」の一覧に表示します。"
          }, {
            id: 'system.windows.shell-menu-files',
            title: "ファイルの右クリックメニューから開く",
            desc: "エクスプローラでのファイル右クリックメニューに \"Open with Atom\" を追加します。"
          }, {
            id: 'system.windows.shell-menu-folders',
            title: "フォルダの右クリックメニューから開く",
            desc: "エクスプローラでのフォルダ右クリックメニューに \"Open with Atom\" を追加します。"
          }
        ]
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUveW9zaGlub3JpL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2phcGFuZXNlLW1lbnUvZGVmL3NldHRpbmdzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQ2pCLFFBQUEsRUFDRTtNQUFBLElBQUEsRUFBTTtRQUNKO1VBQ0UsS0FBQSxFQUFPLE1BRFQ7VUFFRSxLQUFBLEVBQU8sTUFGVDtTQURJLEVBS0o7VUFDRSxLQUFBLEVBQU8sUUFEVDtVQUVFLEtBQUEsRUFBTyxRQUZUO1NBTEksRUFTSjtVQUNFLEtBQUEsRUFBTyxRQURUO1VBRUUsS0FBQSxFQUFPLFFBRlQ7U0FUSSxFQWFKO1VBQ0UsS0FBQSxFQUFPLGFBRFQ7VUFFRSxLQUFBLEVBQU8sUUFGVDtTQWJJLEVBaUJKO1VBQ0UsS0FBQSxFQUFPLFVBRFQ7VUFFRSxLQUFBLEVBQU8sT0FGVDtTQWpCSSxFQXFCSjtVQUNFLEtBQUEsRUFBTyxRQURUO1VBRUUsS0FBQSxFQUFPLEtBRlQ7U0FyQkksRUF5Qko7VUFDRSxLQUFBLEVBQU8sU0FEVDtVQUVFLEtBQUEsRUFBTyxRQUZUO1NBekJJLEVBNkJKO1VBQ0UsS0FBQSxFQUFPLFNBRFQ7VUFFRSxLQUFBLEVBQU8sUUFGVDtTQTdCSTtPQUFOO01Ba0NBLGVBQUEsRUFBaUI7UUFDZjtVQUFDLEtBQUEsRUFBTyxlQUFSO1VBQXlCLEtBQUEsRUFBTyxNQUFoQztTQURlLEVBRWY7VUFBQyxLQUFBLEVBQU8saUJBQVI7VUFBMkIsS0FBQSxFQUFPLFFBQWxDO1NBRmUsRUFHZjtVQUFDLEtBQUEsRUFBTyxpQkFBUjtVQUEyQixLQUFBLEVBQU8sUUFBbEM7U0FIZSxFQUlmO1VBQUMsS0FBQSxFQUFPLGFBQVI7VUFBdUIsS0FBQSxFQUFPLFFBQTlCO1NBSmUsRUFLZjtVQUFDLEtBQUEsRUFBTyxvQkFBUjtVQUE4QixLQUFBLEVBQU8sZ0JBQXJD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WUFFRSxLQUFBLEVBQU8sd0JBRlQ7WUFHRSxJQUFBLEVBQU0sbURBSFI7V0FqUFEsRUFzUFI7WUFDRSxFQUFBLEVBQUksNkJBRE47WUFFRSxLQUFBLEVBQU8sb0JBRlQ7WUFHRSxJQUFBLEVBQU0sbURBSFI7V0F0UFEsRUEyUFI7WUFDRSxFQUFBLEVBQUksaUNBRE47WUFFRSxLQUFBLEVBQU8sb0JBRlQ7WUFHRSxJQUFBLEVBQU0sb0RBSFI7V0EzUFEsRUFnUVI7WUFDRSxFQUFBLEVBQUksbUNBRE47WUFFRSxLQUFBLEVBQU8sb0JBRlQ7WUFHRSxJQUFBLEVBQU0sb0RBSFI7V0FoUVE7U0FiRjtPQTFEVjtLQUZlOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuU2V0dGluZ3M6XG4gIG1lbnU6IFtcbiAgICB7XG4gICAgICBsYWJlbDogXCJDb3JlXCJcbiAgICAgIHZhbHVlOiBcIuOCs+OCouioreWumlwiXG4gICAgfVxuICAgIHtcbiAgICAgIGxhYmVsOiBcIkVkaXRvclwiXG4gICAgICB2YWx1ZTogXCLjgqjjg4fjgqPjgr/oqK3lrppcIlxuICAgIH1cbiAgICB7XG4gICAgICBsYWJlbDogXCJTeXN0ZW1cIlxuICAgICAgdmFsdWU6IFwi44K344K544OG44Og6Kit5a6aXCJcbiAgICB9XG4gICAge1xuICAgICAgbGFiZWw6IFwiS2V5YmluZGluZ3NcIlxuICAgICAgdmFsdWU6IFwi44Kt44O844OQ44Kk44Oz44OJXCJcbiAgICB9XG4gICAge1xuICAgICAgbGFiZWw6IFwiUGFja2FnZXNcIlxuICAgICAgdmFsdWU6IFwi44OR44OD44Kx44O844K4XCJcbiAgICB9XG4gICAge1xuICAgICAgbGFiZWw6IFwiVGhlbWVzXCJcbiAgICAgIHZhbHVlOiBcIuODhuODvOODnlwiXG4gICAgfVxuICAgIHtcbiAgICAgIGxhYmVsOiBcIlVwZGF0ZXNcIlxuICAgICAgdmFsdWU6IFwi44Ki44OD44OX44OH44O844OIXCJcbiAgICB9XG4gICAge1xuICAgICAgbGFiZWw6IFwiSW5zdGFsbFwiXG4gICAgICB2YWx1ZTogXCLjgqTjg7Pjgrnjg4jjg7zjg6tcIlxuICAgIH1cbiAgXVxuICBzZWN0aW9uSGVhZGluZ3M6IFtcbiAgICB7bGFiZWw6IFwiQ29yZSBTZXR0aW5nc1wiLCB2YWx1ZTogXCLjgrPjgqLoqK3lrppcIn1cbiAgICB7bGFiZWw6IFwiRWRpdG9yIFNldHRpbmdzXCIsIHZhbHVlOiBcIuOCqOODh+OCo+OCv+ioreWumlwifVxuICAgIHtsYWJlbDogXCJTeXN0ZW0gU2V0dGluZ3NcIiwgdmFsdWU6IFwi44K344K544OG44Og6Kit5a6aXCJ9XG4gICAge2xhYmVsOiBcIktleWJpbmRpbmdzXCIsIHZhbHVlOiBcIuOCreODvOODkOOCpOODs+ODiVwifVxuICAgIHtsYWJlbDogXCJJbnN0YWxsZWQgUGFja2FnZXNcIiwgdmFsdWU6IFwi44Kk44Oz44K544OI44O844Or5riI44G/44Gu44OR44OD44Kx44O844K4XCJ9XG4gICAge2xhYmVsOiBcIkNob29zZSBhIFRoZW1lXCIsIHZhbHVlOiBcIuODhuODvOODnuOBrumBuOaKnlwifVxuICAgIHtsYWJlbDogXCJJbnN0YWxsZWQgVGhlbWVzXCIsIHZhbHVlOiBcIuOCpOODs+OCueODiOODvOODq+a4iOOBv+OBruODhuODvOODnlwifVxuICAgIHtsYWJlbDogXCJJbnN0YWxsIFBhY2thZ2VzXCIsIHZhbHVlOiBcIuODkeODg+OCseODvOOCuOOBruOCpOODs+OCueODiOODvOODq1wifVxuICAgIHtsYWJlbDogXCJGZWF0dXJlZCBQYWNrYWdlc1wiLCB2YWx1ZTogXCLjgYrjgZnjgZnjgoHjga7jg5Hjg4PjgrHjg7zjgrhcIn1cbiAgICB7bGFiZWw6IFwiSW5zdGFsbCBUaGVtZXNcIiwgdmFsdWU6IFwi44OG44O844Oe44Gu44Kk44Oz44K544OI44O844OrXCJ9XG4gICAge2xhYmVsOiBcIkZlYXR1cmVkIFRoZW1lc1wiLCB2YWx1ZTogXCLjgYrjgZnjgZnjgoHjga7jg4bjg7zjg55cIn1cbiAgXVxuICBzdWJTZWN0aW9uSGVhZGluZ3M6IFtcbiAgICB7bGFiZWw6IFwiSW52aXNpYmxlXCIsIHZhbHVlOiBcIuS4jeWPr+imluaWh+Wtl1wifVxuICAgIHtsYWJlbDogXCJDb21tdW5pdHkgUGFja2FnZXNcIiwgdmFsdWU6IFwi44Kz44Of44Ol44OL44OG44Kj44OR44OD44Kx44O844K4XCJ9XG4gICAge2xhYmVsOiBcIkNvcmUgUGFja2FnZXNcIiwgdmFsdWU6IFwi44Kz44Ki44OR44OD44Kx44O844K4XCJ9XG4gICAge2xhYmVsOiBcIkRldmVsb3BtZW50IFBhY2thZ2VzXCIsIHZhbHVlOiBcIumWi+eZuuODkeODg+OCseODvOOCuFwifVxuICAgIHtsYWJlbDogXCJHaXQgUGFja2FnZXNcIiwgdmFsdWU6IFwiR2l0IOODkeODg+OCseODvOOCuFwifVxuICAgIHtsYWJlbDogXCJDb21tdW5pdHkgVGhlbWVzXCIsIHZhbHVlOiBcIuOCs+ODn+ODpeODi+ODhuOCo+ODhuODvOODnlwifVxuICAgIHtsYWJlbDogXCJDb3JlIFRoZW1lc1wiLCB2YWx1ZTogXCLjgrPjgqLjg4bjg7zjg55cIn1cbiAgICB7bGFiZWw6IFwiRGV2ZWxvcG1lbnQgVGhlbWVzXCIsIHZhbHVlOiBcIumWi+eZuuODhuODvOODnlwifVxuICAgIHtsYWJlbDogXCJHaXQgVGhlbWVzXCIsIHZhbHVlOiBcIkdpdCDjg4bjg7zjg55cIn1cbiAgXVxuICBzZXR0aW5nczoge1xuICAgIG5vdGVzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiAnY29yZS1zZXR0aW5ncy1ub3RlJ1xuICAgICAgICBodG1sOiAn44OG44Kt44K544OI57eo6ZuG44Gu44G144KL44G+44GE44Go44Gv6Zai5L+C44Gu44Gq44GE44Kz44Ki44Gq6YOo5YiG44Gu6Kit5a6a6aCF55uu44Gn44GZ44CC5YCL44CF44Gu44OR44OD44Kx44O844K444Gr44KC5Zu65pyJ44Gu6Kit5a6a6aCF55uu44GM55So5oSP44GV44KM44Gm44GE44KL5aC05ZCI44GM44GC44KL44Gu44Gn44CBXG4gICAgICAgICAgICAgICDjgZPjgaHjgonjga4gPGEgY2xhc3M9XCJsaW5rIHBhY2thZ2VzLW9wZW5cIj7jg5Hjg4PjgrHjg7zjgrjjg6rjgrnjg4g8L2E+IOOBi+OCieODkeODg+OCseODvOOCuOOCq+ODvOODieOCkuOCr+ODquODg+OCr+OBl+OBpuioreWumuOCkuOBlOeiuuiqjeOBj+OBoOOBleOBhOOAgidcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlZGl0b3Itc2V0dGluZ3Mtbm90ZSdcbiAgICAgICAgaHRtbDogJ+ODhuOCreOCueODiOe3qOmbhuOBruOBteOCi+OBvuOBhOOBq+mWouOBmeOCi+ioreWumumgheebruOBp+OBmeOAguiogOiqnuOBruWfuua6luOBq+OCiOOBo+OBpuOBr+OBk+OCjOOCieOBruioreWumuOBjOS4iuabuOOBjeOBleOCjOOCi+WgtOWQiOOBjOOBguOCi+OBn+OCgeOAgVxuICAgICAgICAgICAgICAg44GT44Gh44KJ44GuIDxhIGNsYXNzPVwibGluayBwYWNrYWdlcy1vcGVuXCI+44OR44OD44Kx44O844K444Oq44K544OIPC9hPiDjgYvjgonjg5Hjg4PjgrHjg7zjgrjjgqvjg7zjg4njgpLjgq/jg6rjg4Pjgq/jgZfjgaboqK3lrprjgpLjgZTnorroqo3jgY/jgaDjgZXjgYTjgIInXG4gICAgICB9XG4gICAgXVxuICAgIGNvbnRyb2xzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiAnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnXG4gICAgICAgIHRpdGxlOiBcIuODl+ODrOODk+ODpeODvOOCv+ODluOCkuS9v+OBhlwiXG4gICAgICAgIGRlc2M6IFwi44OE44Oq44O844OT44Ol44O844Gq44Gp44Gn44OV44Kh44Kk44Or44KS6YG45oqe44GX44Gf5pmC44Gr44K/44OW44KS44OX44Os44OT44Ol44O854q25oWL44Gn6ZaL44GN44G+44GZ44CCXG4gICAgICAgICAgICAgICDjg5fjg6zjg5Pjg6Xjg7zmmYLjga/jgr/jg5blkI3jgYzmlpzkvZPjgajjgarjgorjgIHliKXjga7jg5XjgqHjgqTjg6vpgbjmip7mmYLjgavjgr/jg5bjgYzkvb/jgYTlm57jgZXjgozjgb7jgZnjgIJcbiAgICAgICAgICAgICAgIOODgOODluODq+OCr+ODquODg+OCr+OBvuOBn+OBr+e3qOmbhuOCkumWi+Wni+OBmeOCi+OBk+OBqOOBp+ODl+ODrOODk+ODpeODvOeKtuaFi+OBjOino+mZpOOBleOCjOOBvuOBmeOAglwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnY29yZS5hdWRpb0JlZXAnXG4gICAgICAgIHRpdGxlOiBcIuODk+ODvOODl+mfs+OCkumztOOCieOBmVwiXG4gICAgICAgIGRlc2M6IFwi5Yem55CG44GM5LqI5pyf44GX44Gf44Go44GK44KK44Gr5a6f6KGM44GV44KM44Gq44GL44Gj44Gf44KK44CB57WQ5p6c44GM5L2V44KC5b6X44KJ44KM44Gq44GL44Gj44Gf5aC05ZCI44Gr44K344K544OG44Og44Gu44OT44O844OX6Z+z44KS6bO044KJ44GX44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdjb3JlLmF1dG9tYXRpY2FsbHlVcGRhdGUnXG4gICAgICAgIHRpdGxlOiBcIuiHquWLleOCouODg+ODl+ODh+ODvOODiFwiXG4gICAgICAgIGRlc2M6IFwi5paw44GX44GE44OQ44O844K444On44Oz44GuIEF0b20g44GM44Oq44Oq44O844K544GV44KM44Gm44GE44Gf5aC05ZCI44Gr6Ieq5YuV44Gn44Ki44OD44OX44OH44O844OI44GX44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdjb3JlLmNsb3NlRGVsZXRlZEZpbGVUYWJzJ1xuICAgICAgICB0aXRsZTogXCLliYrpmaTjgZXjgozjgZ/jg5XjgqHjgqTjg6vjga7jgr/jg5bjgpLplonjgZjjgotcIlxuICAgICAgICBkZXNjOiBcIkF0b20g44Gu5aSW44Gn5YmK6Zmk44GV44KM44Gf44OV44Kh44Kk44Or44Gu44K/44OW44KS6Ieq5YuV55qE44Gr6ZaJ44GY44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdjb3JlLmF1dG9IaWRlTWVudUJhcidcbiAgICAgICAgdGl0bGU6IFwi44Oh44OL44Ol44O844OQ44O844KS6Ieq5YuV55qE44Gr6Zqg44GZXCJcbiAgICAgICAgZGVzYzogXCLjg6Hjg4vjg6Xjg7zjg5Djg7zjgpLoh6rli5XnmoTjgavpmqDjgZfjgaYgQWx0IOOCreODvOOBp+WIh+OCiuabv+OBiOOBvuOBmeOAguOBk+OBruioreWumuOBryBXaW5kb3dzIOOBqCBMaW51eCDjgafjga7jgb/jgrXjg53jg7zjg4jjgZXjgozjgb7jgZnjgIJcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2NvcmUuY2xvc2VFbXB0eVdpbmRvd3MnXG4gICAgICAgIHRpdGxlOiBcIuepuuOBq+OBquOBo+OBn+OCpuOCpOODs+ODieOCpuOCkuOCv+ODluOBqOWQjOanmOOBq+mWieOBmOOCi1wiXG4gICAgICAgIGRlc2M6IFwi44Km44Kk44Oz44OJ44Km5YaF44Gr44K/44OW44KC44Oa44Kk44Oz44KC44Gq44GE54q25oWL44Gn44K/44OW44KS6ZaJ44GY44KL44Kz44Oe44Oz44OJ44KS5LiO44GI44Gf5aC05ZCI44CB44Km44Kk44Oz44OJ44Km44KS6ZaJ44GY44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdjb3JlLmRlc3Ryb3lFbXB0eVBhbmVzJ1xuICAgICAgICB0aXRsZTogXCLnqbrjgavjgarjgaPjgZ/jg5rjgqTjg7PjgpLoh6rli5XnmoTjgavplonjgZjjgotcIlxuICAgICAgICBkZXNjOiBcIuacgOW+jOOBq+mWi+OBhOOBpuOBhOOBn+OCv+ODluOCkumWieOBmOOBn+WgtOWQiOOAgeODmuOCpOODs+OCgumWieOBmOOBvuOBmeOAglwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJ1xuICAgICAgICB0aXRsZTogXCLjg5Djg7zjgrjjg6fjg7PnrqHnkIbjgrfjgrnjg4bjg6DjgavjgojjgaPjgabnhKHoppbjgZXjgozjgZ/jg5HjgrnjgpLpmaTlpJbjgZnjgotcIlxuICAgICAgICBkZXNjOiBcIuePvuWcqOOBruODl+ODreOCuOOCp+OCr+ODiOOBp+S9v+eUqOS4reOBruODkOODvOOCuOODp+ODs+euoeeQhuOCt+OCueODhuODoOOBq+OCiOOBo+OBpueEoeimluOBleOCjOOBn+ODleOCoeOCpOODq+OBqOODh+OCo+ODrOOCr+ODiOODquOBjOOAgeOBguOBhOOBvuOBhOaknOe0ouOChOaknOe0ouOAgee9ruaPm+OBruS4reOBp+eEoeimluOBleOCjOOCi+OCiOOBhuOBq+OBquOCiuOBvuOBmeOAglxuICAgICAgICAgICAgICAg5L6L44GI44GwIEdpdCDjgpLkvb/nlKjjgZfjgabjgYTjgovjg5fjg63jgrjjgqfjgq/jg4jjgafjga8gLmdpdGlnbm9yZSDjg5XjgqHjgqTjg6vjgaflrprnvqnjgZXjgozjgZ/jg5HjgrnjgYzjgZ3jgozjgavjgYLjgZ/jgorjgb7jgZnjgIJcbiAgICAgICAgICAgICAgIOWAi+OAheOBruODkeODg+OCseODvOOCuOOBq+OCguOBk+OBruioreWumuOBqOOBr+WIpeOBq+ODleOCoeOCpOODq+OChOODleOCqeODq+ODgOOCkueEoeimluOBmeOCi+ioreWumuOBjOOBguOCi+OBi+OCguOBl+OCjOOBvuOBm+OCk+OAglwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnY29yZS5maWxlRW5jb2RpbmcnXG4gICAgICAgIHRpdGxlOiBcIuODleOCoeOCpOODq+OCqOODs+OCs+ODvOODh+OCo+ODs+OCsFwiXG4gICAgICAgIGRlc2M6IFwi44OV44Kh44Kk44Or44KS6Kqt44G/5pu444GN44GZ44KL44Gf44KB44Gu44OH44OV44Kp44Or44OI44Kt44Oj44Op44Kv44K/44K744OD44OI44KS5oyH5a6a44GX44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdjb3JlLmZvbGxvd1N5bWxpbmtzJ1xuICAgICAgICB0aXRsZTogXCLjgrfjg7Pjg5zjg6rjg4Pjgq/jg6rjg7Pjgq/jgpLjgZ/jganjgotcIlxuICAgICAgICBkZXNjOiBcIuOBguOBhOOBvuOBhOaknOe0ouOBp+ODleOCoeOCpOODq+OCkuaknOe0ouODu+mWi+OBj+aZguOBq+S9v+eUqOOBleOCjOOBvuOBmeOAglwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnY29yZS5pZ25vcmVkTmFtZXMnXG4gICAgICAgIHRpdGxlOiBcIueEoeimluOBmeOCi+ODleOCoeOCpOODq1wiXG4gICAgICAgIGRlc2M6IFwi54Sh6KaW44GZ44KLIGdsb2Ig44OR44K/44O844Oz44KS5YiX5oyZ44GX44G+44GZ44CC44Oe44OD44OB44GX44Gf44OV44Kh44Kk44Or44Go44OH44Kj44Os44Kv44OI44Oq44Gv44CB44GC44GE44G+44GE5qSc57Si44KE44OE44Oq44O844OT44Ol44O844Gn6KGo56S644GV44KM44Gq44GP44Gq44KK44G+44GZ44CCXG4gICAgICAgICAgICAgICDlgIvjgIXjga7jg5Hjg4PjgrHjg7zjgrjjgavjgoLjgZPjga7oqK3lrprjgajjga/liKXjgavjg5XjgqHjgqTjg6vjgoTjg5Xjgqnjg6vjg4DjgpLnhKHoppbjgZnjgovoqK3lrprjgYzjgYLjgovjgYvjgoLjgZfjgozjgb7jgZvjgpPjgIJcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2NvcmUub3BlbkVtcHR5RWRpdG9yT25TdGFydCdcbiAgICAgICAgdGl0bGU6IFwi6LW35YuV5pmC44Gr5paw6KaP44Ko44OH44Kj44K/44KS6ZaL44GPXCJcbiAgICAgICAgZGVzYzogXCLotbfli5XmmYLjgavmlrDopo/jga7jgqjjg4fjgqPjgr/jgpLoh6rli5XnmoTjgavplovjgY3jgb7jgZnjgIJcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2NvcmUucHJvamVjdEhvbWUnXG4gICAgICAgIHRpdGxlOiBcIuODl+ODreOCuOOCp+OCr+ODiOODm+ODvOODoFwiXG4gICAgICAgIGRlc2M6IFwi44OX44Ot44K444Kn44Kv44OI576k44KS6YWN572u44GZ44KL44OH44Kj44Os44Kv44OI44Oq44KS5oyH5a6a44GX44G+44GZ44CC44OR44OD44Kx44O844K444K444Kn44ON44Os44O844K/44Gn5L2c5oiQ44GV44KM44Gf44OR44OD44Kx44O844K444Gv44OH44OV44Kp44Or44OI44Gn44GT44GT44GM5qC857SN5YWI44Go44Gq44KK44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdjb3JlLnJlb3BlblByb2plY3RNZW51Q291bnQnXG4gICAgICAgIHRpdGxlOiBcIuODl+ODreOCuOOCp+OCr+ODiOWxpeattOOBruihqOekuuaVsFwiXG4gICAgICAgIGRlc2M6IFwi44Oh44OL44Ol44O844CM44OX44Ot44K444Kn44Kv44OI5bGl5q2044GL44KJ6ZaL44GP44CN44Gr6KGo56S644GZ44KL44OX44Ot44K444Kn44Kv44OI44Gu5pWw44KS5oyH5a6a44GX44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdjb3JlLnJlc3RvcmVQcmV2aW91c1dpbmRvd3NPblN0YXJ0J1xuICAgICAgICB0aXRsZTogXCLotbfli5XmmYLjgavliY3lm57jga7jgqbjgqTjg7Pjg4njgqbooajnpLrnirbmhYvjgpLlvqnlhYPjgZnjgotcIlxuICAgICAgICBkZXNjOiBcIuOCouOCpOOCs+ODs+OCguOBl+OBj+OBryBhdG9tIOOCs+ODnuODs+ODieOBi+OCiei1t+WLleOBl+OBn+OBqOOBjeOBq+OAgeacgOW+jOOBq+mWi+OBhOOBpuOBhOOBnyBBdG9tIOOBruOCpuOCpOODs+ODieOCpuOBmeOBueOBpuOCkuW+qeWFg+OBl+OBvuOBmeOAglwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnY29yZS50ZWxlbWV0cnlDb25zZW50J1xuICAgICAgICB0aXRsZTogXCJBdG9tIOODgeODvOODoOOBq+mBoOmalOa4rOWumue1kOaenOOCkumAgeS/oeOBmeOCi1wiXG4gICAgICAgIGRlc2M6IFwi5L2/55So57Wx6KiI44OH44O844K/44Go6Zqc5a6z44Os44Od44O844OI44KSIEF0b20g44OB44O844Og44Gr6YCB5L+h44GX44Gm5qmf6IO95ZCR5LiK44Gr5b2556uL44Gm44KL44GT44Go44KS6Kix5Y+v44GX44G+44GZ44CCXCJcbiAgICAgICAgc2VsZWN0OlxuICAgICAgICAgIGxpbWl0ZWQ6IFwi5Yy/5ZCN44Gn6ZmQ5a6a44GV44KM44Gf5L2/55So57Wx6KiI44OH44O844K/44Go6Zqc5a6z44Os44Od44O844OI44Gu6YCB5L+h44KS6Kix5Y+v44GZ44KLXCJcbiAgICAgICAgICBubzogXCLpgaDpmpTmuKzlrprntZDmnpzjgpLpgIHkv6HjgZfjgarjgYRcIlxuICAgICAgICAgIHVuZGVjaWRlZDogXCLjgb7jgaDmsbrjgb7jgaPjgabjgYTjgarjgYTvvIjmrKHlm57otbfli5XmmYLjgavlho3norroqo3vvIlcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2NvcmUudXNlQ3VzdG9tVGl0bGVCYXInXG4gICAgICAgIHRpdGxlOiBcIuOCq+OCueOCv+ODoOOCv+OCpOODiOODq+ODkOODvOOCkuS9v+OBhlwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnY29yZS51c2VQcm94eVNldHRpbmdzV2hlbkNhbGxpbmdBcG0nXG4gICAgICAgIHRpdGxlOiBcIkFQTSDjgpLlkbzjgbbjgajjgY3jgavjg5fjg63jgq3jgrfoqK3lrprjgpLkvb/jgYZcIlxuICAgICAgICBkZXNjOiBcIkFQTSAoQXRvbSBQYWNrYWdlIE1hbmFnZXIpIOOBriBhcG0g44Kz44Oe44Oz44OJ44Op44Kk44Oz44OE44O844Or44KS5ZG844G244Go44GN44Gr44CB5qSc5Ye644GX44Gf44OX44Ot44Kt44K36Kit5a6a44KS5L2/44GE44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdjb3JlLndhcm5PbkxhcmdlRmlsZUxpbWl0J1xuICAgICAgICB0aXRsZTogXCLph43jgYTjg5XjgqHjgqTjg6vjgpLplovjgY/mmYLjgavorablkYrjgZnjgovjgrXjgqTjgrpcIlxuICAgICAgICBkZXNjOiBcIuaMh+WumuOBl+OBn+ODleOCoeOCpOODq+OCteOCpOOCuu+8iOODoeOCrOODkOOCpOODiO+8ieOCiOOCiuWkp+OBjeOBquODleOCoeOCpOODq+OCkumWi+OBj+WJjeOBq+itpuWRiuOBl+OBvuOBmeOAglwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLmF0b21pY1NvZnRUYWJzJ1xuICAgICAgICB0aXRsZTogXCLjgqLjg4jjg5/jg4Pjgq8g44K944OV44OI44K/44OWXCJcbiAgICAgICAgZGVzYzogXCLjgqvjg7zjgr3jg6vnp7vli5Xjga7mmYLjgIHjgr3jg5Xjg4jjgr/jg5bjgqTjg7Pjg4fjg7Pjg4jjga7nqbrnmb3jgpLjgr/jg5bluYXjgafjgrnjgq3jg4Pjg5fjgZfjgb7jgZnjgIJcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2VkaXRvci5hdXRvSW5kZW50J1xuICAgICAgICB0aXRsZTogXCLoh6rli5XjgqTjg7Pjg4fjg7Pjg4hcIlxuICAgICAgICBkZXNjOiBcIuaWsOOBl+OBhOihjOOCkuaMv+WFpe+8iOaUueihjO+8ieOBl+OBn+aZguOAgeOCq+ODvOOCveODq+S9jee9ruOCkuiHquWLleeahOOBq+OCpOODs+ODh+ODs+ODiOOBl+OBn+S9jee9ruOBq+enu+WLleOBl+OBvuOBmeOAglwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLmF1dG9JbmRlbnRPblBhc3RlJ1xuICAgICAgICB0aXRsZTogXCLjg5rjg7zjgrnjg4jmmYLjgavoh6rli5XjgqTjg7Pjg4fjg7Pjg4hcIlxuICAgICAgICBkZXNjOiBcIuODmuODvOOCueODiOOBl+OBn+ODhuOCreOCueODiOOCkuebtOWJjeOBruihjOOBruOCpOODs+ODh+ODs+ODiOOCkuWfuua6luOBq+iHquWLleeahOOBq+OCpOODs+ODh+ODs+ODiOOBl+OBvuOBmeOAglwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLmJhY2tVcEJlZm9yZVNhdmluZydcbiAgICAgICAgdGl0bGU6IFwi5L+d5a2Y5YmN44Gr44OQ44OD44Kv44Ki44OD44OX44KS5Y+W44KLXCJcbiAgICAgICAgZGVzYzogXCLjg5XjgqHjgqTjg6vjga7kv53lrZjkuK3jgasgSS9PIOOCqOODqeODvOOBjOeZuueUn+OBl+OBn+WgtOWQiOOBq+ODleOCoeOCpOODq+OBruWGheWuueOBjOWkseOCj+OCjOOBquOBhOOCiOOBhuOAgeODkOODg+OCr+OCouODg+ODl+eUqOOBruS4gOaZguOCs+ODlOODvOOCkuS9nOaIkOOBl+OBvuOBmeOAglwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLmNvbmZpcm1DaGVja291dEhlYWRSZXZpc2lvbidcbiAgICAgICAgdGl0bGU6IFwi5aSJ5pu044KS56C05qOE44GX44GmIEhFQUQg44Oq44OT44K444On44Oz44Gr5oi744GZ5pmC44Gr56K66KqN44GZ44KLXCJcbiAgICAgICAgZGVzYzogXCLjgrPjg57jg7Pjg4kgYEVkaXRvcjogQ2hlY2tvdXQgSGVhZCBSZXZpc2lvbmAg44KS5L2/55So44GX44GmIEhFQUQg44Oq44OT44K444On44Oz44KS44OB44Kn44OD44Kv44Ki44Km44OI44GX54++5Zyo44Gu5aSJ5pu05YaF5a6544KS56C05qOE44GZ44KL5YmN44Gr56K66KqN44OA44Kk44Ki44Ot44Kw44KS6KGo56S644GX44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlZGl0b3IuZm9udEZhbWlseSdcbiAgICAgICAgdGl0bGU6IFwi44OV44Kp44Oz44OIXCJcbiAgICAgICAgZGVzYzogXCJmb250LWZhbWlseVwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLmZvbnRTaXplJ1xuICAgICAgICB0aXRsZTogXCLjg5Xjgqnjg7Pjg4jjgrXjgqTjgrpcIlxuICAgICAgICBkZXNjOiBcImZvbnQtc2l6ZSAocHgpXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlZGl0b3IuaW52aXNpYmxlcy5jcidcbiAgICAgICAgdGl0bGU6IFwi5LiN5Y+v6KaW5paH5a2XIOOCreODo+ODquODg+OCuOODu+ODquOCv+ODvOODsyAoQ3IpXCJcbiAgICAgICAgZGVzYzogXCLjgq3jg6Pjg6rjg4Pjgrjjg7vjg6rjgr/jg7zjg7PvvIhNaWNyb3NvZnTjgrnjgr/jgqTjg6vjga7ooYzmnKvmloflrZfvvInjgajjgZfjgabmj4/nlLvjgZnjgovmloflrZfvvIjjgIzkuI3lj6/oppbmloflrZfjgpLooajnpLrjgI3jgpLmnInlirnjgavjgZfjgabjgYTjgovloLTlkIjvvIlcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2VkaXRvci5pbnZpc2libGVzLmVvbCdcbiAgICAgICAgdGl0bGU6IFwi5LiN5Y+v6KaW5paH5a2XIOaUueihjCAoRW9sKVwiXG4gICAgICAgIGRlc2M6IFwi5pS56KGMIChcXFxcbikg44Go44GX44Gm5o+P55S744GZ44KL5paH5a2X77yI44CM5LiN5Y+v6KaW5paH5a2X44KS6KGo56S644CN44KS5pyJ5Yq544Gr44GX44Gm44GE44KL5aC05ZCI77yJXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlZGl0b3IuaW52aXNpYmxlcy5zcGFjZSdcbiAgICAgICAgdGl0bGU6IFwi5LiN5Y+v6KaW5paH5a2XIOOCueODmuODvOOCuVwiXG4gICAgICAgIGRlc2M6IFwi44K544Oa44O844K577yI6KGM6aCt5Lul5YmN44Go6KGM5pyr5Lul6ZmN77yJ44Go44GX44Gm5o+P55S744GZ44KL5paH5a2X77yI44CM5LiN5Y+v6KaW5paH5a2X44KS6KGo56S644CN44KS5pyJ5Yq544Gr44GX44Gm44GE44KL5aC05ZCI77yJXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlZGl0b3IuaW52aXNpYmxlcy50YWInXG4gICAgICAgIHRpdGxlOiBcIuS4jeWPr+imluaWh+WtlyDjgr/jg5ZcIlxuICAgICAgICBkZXNjOiBcIuODj+ODvOODieOCv+ODlu+8iFxcXFx077yJ44Go44GX44Gm5o+P55S744GZ44KL5paH5a2X77yI44CM5LiN5Y+v6KaW5paH5a2X44KS6KGo56S644CN44KS5pyJ5Yq544Gr44GX44Gm44GE44KL5aC05ZCI77yJXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlZGl0b3IubGluZUhlaWdodCdcbiAgICAgICAgdGl0bGU6IFwi6KGM44Gu6auY44GVXCJcbiAgICAgICAgZGVzYzogXCJsaW5lLWhlaWdodCAobnVtYmVyKVwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLm5vbldvcmRDaGFyYWN0ZXJzJ1xuICAgICAgICB0aXRsZTogXCLljZjoqp7jga7kuIDpg6jjgajjgZfjgabmibHjgo/jgarjgYTmloflrZdcIlxuICAgICAgICBkZXNjOiBcIuWNmOiqnuOBruWig+eVjOOCkuWumuOCgeOCi+OBn+OCgeOBruaWh+Wtl1wiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnXG4gICAgICAgIHRpdGxlOiBcIuWPs+err+OCrOOCpOODieOBruS9jee9rlwiXG4gICAgICAgIGRlc2M6IFwi44CM5Y+z56uv44Ks44Kk44OJ44Gu5L2N572u44Gn44K944OV44OI44Op44OD44OX44CN44GM5pyJ5Yq544Gq5aC05ZCI44Gr44OG44Kt44K544OI44KS5oqY44KK6L+U44GZ5L2N572u44KS5paH5a2X5pWw44Gn5oyH5a6a44GX44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlZGl0b3Iuc2Nyb2xsUGFzdEVuZCdcbiAgICAgICAgdGl0bGU6IFwi5pyA57WC6KGM44KS6LaF44GI44Gm44K544Kv44Ot44O844OrXCJcbiAgICAgICAgZGVzYzogXCLjgqjjg4fjgqPjgr/jgavmnIDntYLooYzjgYzooajnpLrjgZXjgozjgZ/lnLDngrnjgafjgrnjgq/jg63jg7zjg6vjgpLmraLjgoHjgarjgYTjgojjgYbjgavjgZfjgb7jgZnjgIJcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2VkaXRvci5zY3JvbGxTZW5zaXRpdml0eSdcbiAgICAgICAgdGl0bGU6IFwi44K544Kv44Ot44O844Or6YCf5bqmXCJcbiAgICAgICAgZGVzYzogXCLjg57jgqbjgrnjgoTjg4jjg6njg4Pjgq/jg5Hjg4Pjg4njgafjgqjjg4fjgqPjgr/jgpLjgrnjgq/jg63jg7zjg6vjgZnjgovmmYLjga7pgJ/luqZcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2VkaXRvci5zaG93Q3Vyc29yT25TZWxlY3Rpb24nXG4gICAgICAgIHRpdGxlOiBcIumBuOaKnuevhOWbsuOBq+OCq+ODvOOCveODq+OCkuihqOekulwiXG4gICAgICAgIGRlc2M6IFwi6YG45oqe56+E5Zuy44GM5a2Y5Zyo44GZ44KL5aC05ZCI44Gr44Kr44O844K944Or77yI54K55ruF44GZ44KL77yp44OT44O844Og77yJ44KS6KGo56S644GX44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlZGl0b3Iuc2hvd0luZGVudEd1aWRlJ1xuICAgICAgICB0aXRsZTogXCLjgqTjg7Pjg4fjg7Pjg4jjgqzjgqTjg4njgpLooajnpLpcIlxuICAgICAgICBkZXNjOiBcIuOCqOODh+OCo+OCv+WGheOBq+OCpOODs+ODh+ODs+ODiOOCrOOCpOODieOCkuihqOekuuOBl+OBvuOBmeOAglwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLnNob3dJbnZpc2libGVzJ1xuICAgICAgICB0aXRsZTogXCLkuI3lj6/oppbmloflrZfjgpLooajnpLpcIlxuICAgICAgICBkZXNjOiBcIuOCv+ODluOChOOCueODmuODvOOCueOAgeaUueihjOOBquOBqeOBruimi+OBiOOBquOBhOaWh+Wtl+OCkuiomOWPt+OBqOOBl+OBpuihqOekuuOBl+OBvuOBmeOAglwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLnNob3dMaW5lTnVtYmVycydcbiAgICAgICAgdGl0bGU6IFwi6KGM55Wq5Y+344KS6KGo56S6XCJcbiAgICAgICAgZGVzYzogXCLjgqjjg4fjgqPjgr/lhoXjgavooYznlarlj7fjgpLooajnpLrjgZfjgb7jgZnjgIJcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2VkaXRvci5zb2Z0VGFicydcbiAgICAgICAgdGl0bGU6IFwi44K944OV44OI44K/44OWXCJcbiAgICAgICAgZGVzYzogXCLjgr/jg5bmloflrZfjga7ku6Pjgo/jgorjgavjgrnjg5rjg7zjgrnjgpLpgKPjga3jgabmjL/lhaXjgZfjgb7jgZnjgIJcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2VkaXRvci5zb2Z0V3JhcCdcbiAgICAgICAgdGl0bGU6IFwi44K944OV44OI44Op44OD44OXXCJcbiAgICAgICAgZGVzYzogXCLjgqbjgqPjg7Pjg4njgqbluYXjgpLotoXjgYjjgZ/mmYLjgavmipjjgorov5TjgZfjgabooajnpLrjgZfjgb7jgZnjgILjgIzlj7Pnq6/jgqzjgqTjg4njga7kvY3nva7jgafjgr3jg5Xjg4jjg6njg4Pjg5fjgI3jgYzmnInlirnjga7loLTlkIjjga/jgIzlj7Pnq6/jgqzjgqTjg4njga7kvY3nva7jgI3jga7oqK3lrprlgKTjgafmipjjgorov5TjgZXjgozjgb7jgZnjgIJcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2VkaXRvci5zb2Z0V3JhcEF0UHJlZmVycmVkTGluZUxlbmd0aCdcbiAgICAgICAgdGl0bGU6IFwi5Y+z56uv44Ks44Kk44OJ44Gu5L2N572u44Gn44K944OV44OI44Op44OD44OXXCJcbiAgICAgICAgZGVzYzogXCLjgIzlj7Pnq6/jgqzjgqTjg4njga7kvY3nva7jgI3jga7oqK3lrprlgKTjgafmipjjgorov5TjgZfjgb7jgZnjgILjgZPjga7oqK3lrprjga/jgr3jg5Xjg4jjg6njg4Pjg5fjgYzjgrDjg63jg7zjg5Djg6vjgb7jgZ/jga/kvZzmpa3kuK3jga7oqIDoqp7jgafmnInlirnjgarloLTlkIjjga7jgb/pgannlKjjgZXjgozjgb7jgZnjgIJcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ2VkaXRvci5zb2Z0V3JhcEhhbmdpbmdJbmRlbnQnXG4gICAgICAgIHRpdGxlOiBcIuOCveODleODiOODqeODg+ODl+aZguOBruOCpOODs+ODh+ODs+ODiOW5hVwiXG4gICAgICAgIGRlc2M6IFwi44CM44K944OV44OI44Op44OD44OX44CN44GM5pyJ5Yq544Gq5aC05ZCI44CB44Op44OD44OX44GV44KM44Gf6KGM44Gr5a++44GX5oyH5a6a44GX44Gf5paH5a2X5pWw44Gg44GR6L+95Yqg44Gn44Kk44Oz44OH44Oz44OI44GX44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdlZGl0b3IudGFiTGVuZ3RoJ1xuICAgICAgICB0aXRsZTogXCLjgr/jg5bluYVcIlxuICAgICAgICBkZXNjOiBcIuOCv+ODluOCkuihqOOBmemam+OBq+S9v+eUqOOBleOCjOOCi+OCueODmuODvOOCueOBruaVsFwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLnRhYlR5cGUnXG4gICAgICAgIHRpdGxlOiBcIuOCv+ODluOCv+OCpOODl1wiXG4gICAgICAgIGRlc2M6ICfjgr/jg5bjgq3jg7zjgpLmirzjgZfjgZ/pmpvjgavmjL/lhaXjgZnjgovmloflrZfjga7lvaLlvI/jgpLmjIflrprjgZfjgb7jgZnjgIJcInNvZnRcIiDjga/jgr3jg5Xjg4jjgr/jg5bvvIhTcGFjZe+8ieOAgVwiaGFyZFwiIOOBr+ODj+ODvOODieOCv+ODlu+8iFRhYu+8ieOBjOS9v+eUqOOBleOCjOOBvuOBmeOAglxuICAgICAgICAgICAgICAgXCJhdXRvXCIg44Gv44Ko44OH44Kj44K/44GM44OQ44OD44OV44Kh44Gu5YaF5a6544KS6Ieq5YuV5Yik5Yil44GX44G+44GZ44CC6Ieq5YuV5Yik5Yil44Gv5pyA5Yid44Gr6KaL44Gk44GR44Gf6KGM77yI44Kz44Oh44Oz44OI6KGM44KS6Zmk44GP77yJ44Gu5YWI6aCt44Gr44GC44KL44K544Oa44O844K544Gn6KGM44KP44KM44G+44GZ44CCXG4gICAgICAgICAgICAgICDoh6rli5XliKTliKXjgafjgY3jgarjgYvjgaPjgZ/loLTlkIjjga/jgr3jg5Xjg4jjgr/jg5bjgYzoqK3lrprjgZXjgozjgb7jgZnjgIInXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLnVuZG9Hcm91cGluZ0ludGVydmFsJ1xuICAgICAgICB0aXRsZTogXCLlj5bjgormtojjgZfmk43kvZzljZjkvY1cIlxuICAgICAgICBkZXNjOiBcIuOBsuOBqOOBvuOBqOOBvuOCiuOBruaTjeS9nOOBqOiqjeitmOOBleOBm+OBpuWPluOCiua2iOOBl+WxpeattOOBq+eZu+mMsuOBmeOCi+mWk+malO+8iOODn+ODquenku+8iVwiXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGlkOiAnZWRpdG9yLnpvb21Gb250V2hlbkN0cmxTY3JvbGxpbmcnXG4gICAgICAgIHRpdGxlOiBcIkN0cmwg44K544Kv44Ot44O844Or44Gn44OV44Kp44Oz44OI44K144Kk44K644KS5aSJ44GI44KLXCJcbiAgICAgICAgZGVzYzogXCLjgrPjg7Pjg4jjg63jg7zjg6vjgq3jg7zjgpLmirzjgZfjgarjgYzjgonjgrnjgq/jg63jg7zjg6vjgpLkuIrkuIvjgZnjgovjgZPjgajjgafjgqjjg4fjgqPjgr/jga7jg5Xjgqnjg7Pjg4jjgrXjgqTjgrrjgpLmi6HlpKcv57iu5bCP44GX44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdzeXN0ZW0ud2luZG93cy5maWxlLWhhbmRsZXInXG4gICAgICAgIHRpdGxlOiBcIuODleOCoeOCpOODq+OCkuWPluaJseOBhuOCouODl+ODquOBqOOBl+OBpueZu+mMsuOBmeOCi1wiXG4gICAgICAgIGRlc2M6IFwi44OV44Kh44Kk44Or44Gu6Zai6YCj5LuY44GR44KS57Ch5Y2Y44Gr44GZ44KL44Gf44KB44Gr44CBQXRvbSDjgpLjgIzjg5fjg63jgrDjg6njg6DjgYvjgonplovjgY8uLi7jgI3jga7kuIDopqfjgavooajnpLrjgZfjgb7jgZnjgIJcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBpZDogJ3N5c3RlbS53aW5kb3dzLnNoZWxsLW1lbnUtZmlsZXMnXG4gICAgICAgIHRpdGxlOiBcIuODleOCoeOCpOODq+OBruWPs+OCr+ODquODg+OCr+ODoeODi+ODpeODvOOBi+OCiemWi+OBj1wiXG4gICAgICAgIGRlc2M6IFwi44Ko44Kv44K544OX44Ot44O844Op44Gn44Gu44OV44Kh44Kk44Or5Y+z44Kv44Oq44OD44Kv44Oh44OL44Ol44O844GrIFxcXCJPcGVuIHdpdGggQXRvbVxcXCIg44KS6L+95Yqg44GX44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaWQ6ICdzeXN0ZW0ud2luZG93cy5zaGVsbC1tZW51LWZvbGRlcnMnXG4gICAgICAgIHRpdGxlOiBcIuODleOCqeODq+ODgOOBruWPs+OCr+ODquODg+OCr+ODoeODi+ODpeODvOOBi+OCiemWi+OBj1wiXG4gICAgICAgIGRlc2M6IFwi44Ko44Kv44K544OX44Ot44O844Op44Gn44Gu44OV44Kp44Or44OA5Y+z44Kv44Oq44OD44Kv44Oh44OL44Ol44O844GrIFxcXCJPcGVuIHdpdGggQXRvbVxcXCIg44KS6L+95Yqg44GX44G+44GZ44CCXCJcbiAgICAgIH1cbiAgICBdXG4gIH1cbn1cbiJdfQ==
