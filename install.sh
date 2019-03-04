#!/bin/bash
set -u

# 実行場所のディレクトリを取得
THIS_DIR=$(cd $(dirname $0); pwd)

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

# gitの設定ファイルを作成
GIT_CONFIG_LOCAL=~/.gitconfig.local
if [ ! -e $GIT_CONFIG_LOCAL ]; then
    read -p "Are you Yoshinori Yamaguchi? [y/n] > " flag
    
    if [ $flag = "y" ]; then
        GIT_AUTHOR_NAME="YoshinoriYamaguchi"
        GIT_AUTHOR_EMAIL="b1518292@planet.kanazawa-it.ac.jp"
    elif [ $flag = "n" ]; then
        read -p "git config user.name? > " GIT_AUTHOR_NAME
        read -p "git config user.email? > " GIT_AUTHOR_EMAIL
    else
        echo -n "error"
        exit
    fi
    cat << END > $GIT_CONFIG_LOCAL
[alias]
    co = checkout
    st = status
    cm = commit -m
    br = branch
    cg = config
    bra = branch -a -vv
    ls = ls-files
    amend = commit --amend
    aliases = !git config --get-regexp alias
    pr = !hub browse -- pull/$(git symbolic-ref --short HEAD)
    list = !hub browse -- pulls/$(git config user.name)
    aliases = !git config --get-regexp alias |  sed 's/^alias.//g' | sed 's/ / = /1'
    
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

echo -e "finish setup"

