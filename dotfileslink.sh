#!/bin/zsh
for f in .??*
do
  # 無視したいファイルやディレクトリはこんな風に追加してね
  $f = ".git" && continue
  $f = ".gitignore" && continue
  ln -snfv ~/dotfiles/$f ~/$f

done
echo $(tput setaf 2)Deploy dotfiles complete!. ✔︎$(tput sgr0)

