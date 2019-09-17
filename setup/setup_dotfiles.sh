#!/bin/bash
# dotfiles設置

if [ ! -e ~/.ghq/github.com/nekoyashiki26/dotfiles ]; then
    ghq get -shallow https://github.com/nekoyashiki26/dotfiles.git
fi
echo " --------- create simbolic link start ----------"

# 実行場所のディレクトリを取得
THIS_DIR=`pwd`
INSTALL_DIR=`ghq list -p | grep dotfiles`
cd $INSTALL_DIR
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

    ln -snfv "$INSTALL_DIR"/"$f" ~ 1>/dev/null
done

if [ ! -e ~/.config ]; then
    mkdir ~/.config
fi
ln -snfv "$INSTALL_DIR"/nvim/ ~/.config/nvim 1>/dev/null
if [ -e "~/Library/Application\ Support/Code/" ]; then
    ln -snfv "$INSTALL_DIR"/vscode/settings.json ~/Library/Application\ Support/Code/User 1>/dev/null
fi

cd $THIS_DIR
