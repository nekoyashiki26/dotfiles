# mac_dotfiles

## macのdotfile詰め合わせ
```
使っているソフト
zsh
zplug
neovim
dein.vim
```
## repositoryの内容  
```
README.md
 説明用のファイル

.vimrc
 vimの設定ファイル.

.zshrc
 zshの設定ファイル aliasなんかも入ってる.

.vim
 vimのあれこれ.

.gitignore
 gitで管理しないファイルを設定する．

.gitconfig
 gitの設定ファイル.
 私の設定になっているので自分の設定に書き換えてください．
 通常の状態ではシンボリックリンクが作成されないようになっているのでコメントアウトしてください．

install.sh
 実行するとホームディレクトリにシンボリックリンクを作成する.
 gitの設定ファイルを作成する.

AutoProxy.sh 
 proxy環境切り替え用のスクリプト.

setting.json
 vscodeの設定ファイル.

neim 
 neovimの設定ファイル.

com.googlecode.iterm2.plist
 iTerm 2用の設定ファイル
```
## インストール
```
設定ファイルをダウンロードしてbrew-fileに書いているソフトをインストールする。
sh -c "$(curl -fsSL https://raw.githubusercontent.com/nekoyashiki26/dotfiles/master/shellscript/install.sh)"
```