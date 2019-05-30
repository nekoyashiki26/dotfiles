#!/bin/bash
set -eu

# 実行場所のディレクトリを取得
THIS_DIR=$(cd $(dirname $0); pwd)
echo $THIS_DIR
cd $THIS_DIR
git submodule init
git submodule update

echo "start setup"

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
ln -snfv "$THIS_DIR"/nvim ~/.config 1>/dev/null
ln -snfv "$THIS_DIR"/settings.json ~/Library/Application\ Support/Code/User 1>/dev/null

echo -e "finish setup"

