#!/bin/bash

set -u

# 実行場所のディレクトリを取得
THIS_DIR=$(cd $(dirname $0); pwd)

cd $THIS_DIR
git submodule init
git submodule update

echo "start setup..."
for f in .??*; do
    [ "$f" = ".git" ] && continue
    [ "$f" = ".gitconfig.local.template" ] && continue
    [ "$f" = ".require_oh-my-zsh" ] && continue
    [ "$f" = ".gitmodules" ] && continue

    ln -snfv "$THIS_DIR"/"$f" ~/
done

cat << END

**************************************************
DOTFILES SETUP FINISHED! bye.
**************************************************

END

yes | sudo apt-get update

yes | sudo apt-get upgrade

yes | sudo apt-get install zsh

yes | sudo apt-get install gdebi

curl -sL zplug.sh/installer | zsh

git clone https://github.com/nekoyashiki26/proxy.git ~

