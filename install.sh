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
    [ "$f" = ".DS_Store" ] && continue
    [ "$f" = ".require_oh-my-zsh" ] && continue
    [ "$f" = ".gitmodules" ] && continue
    [ "$f" = ".gitattributes" ] && continue
    [ "$f" = ".git-crypt" ] && continue

    ln -snfv "$THIS_DIR"/"$f" ~ 1>/dev/null
done
ln -snfv "$THIS_DIR"/nvim ~/.config 1>/dev/null
ln -snfv "$THIS_DIR"/settings.json ~/Library/Application\ Support/Code/User 1>/dev/null

GIT_CONFIG_LOCAL=~/.gitconfig.local
if [ ! -e $GIT_CONFIG_LOCAL ]; then
    echo -n "git config user.name? > "
    read GIT_AUTHOR_NAME

    echo -n "git config user.email? > "
    read GIT_AUTHOR_EMAIL

    cat << END > $GIT_CONFIG_LOCAL
[alias]
    co = checkout
    st = status
    cm = commit -m
    br = branch
    cg = config
[user]
    naem = $GIT_AUTHOR_NAME
    email = $GIT_AUTHOR_EMAIL
[core]
    editor = vim -c \"set fenc=utf-8\"
[ghq]
    root = ~/ghq
    root = ~/go/src
END

fi

cat << END

**************************************************
DOTFILES SETUP FINISHED! bye.
**************************************************

END
