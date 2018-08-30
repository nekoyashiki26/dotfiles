# mac_dotfiles

## macのdotfile詰め合わせ
```
使っているソフト
zsh or fish
zplug
neovim
dein.vim
```
## fileの内容  
```
README.md
    説明用のファイル
.vimrc
    vimの設定ファイル。
.zshrc
    zshの設定ファイル aliasなんかも入ってる。
.vim
     vimのあれこれ。
install.sh
    実行するとホームディレクトリにシンボリックリンクを作成する。
    zsh用の金沢工業大学用のプロキシ設定ファイルのシンボリックリンクを作成する。
install_fish.sh
    実行するとホームディレクトリにシンボリックリンクを作成する。
    fish用の金沢工業大学用のプロキシ設定ファイルのシンボリックリンクを作成する。
AutoProxy.sh 
    proxy環境切り替え用のスクリプト
    このファイルと~/Library/LaunchAgents/*.plistファイルを用意してlaunchctlを使ってロードすることでwifiに接続するタイミングでプロキシ環境を切り替えることができる。
setting.json
    vscodeの設定ファイル。
neim 
    neovimの設定ファイル
```
## インストール
### git

```
# githubからダウンロードする。
$ git clone https://github.com/nekoyashiki26/dotfiles.git 

# ダウンロードしてきたディレクトリに移動する
$ cd dotfiles 

# シンボリックリンクを必要な場所に作成する。
$ ./install.sh 
```
### ghq
```
$ ghq get nekoyashiki26/dotfiles
$ cd ~/ghq/github.com/nekoyashiki26/dotfiles
$ ./install.sh
```
---
