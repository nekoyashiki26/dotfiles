#!/bin/bash
# dotfiles設置
if [ ! -e ~/.dotfiles ]; then 
    git clone --depth 1 https://github.com/nekoyashiki26/dotfiles.git ~/.dotfiles 
fi

echo " --------- create simbolic link start ----------"

# 実行場所のディレクトリを取得
THIS_DIR=~/.dotfiles
cd $THIS_DIR
git submodule init
git submodule update

# 各種設定のリンクをホームディレクトリに作成
for f in .??*; do
    [ "$f" = ".git" ] && continue
    [ "$f" = ".gitconfig.local.template" ] && continue
    [ "$f" = ".DS_Store" ] && continue
    [ "$f" = ".require_oh-my-zsh" ] && continue
    [ "$f" = ".gitmodules" ] && continue
    [ "$f" = ".gitattributes" ] && continue
    [ "$f" = ".git-crypt" ] && continue

    ln -snfv "$THIS_DIR"/"$f" ~ 1>/dev/null
done
ln -snfv "$THIS_DIR"/nvim/ ~/.config/nvim 1>/dev/null
ln -snfv "$THIS_DIR"/vscode/settings.json ~/Library/Application\ Support/Code/User 1>/dev/null
