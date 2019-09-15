#!/bin/bash
# app install

# mas-cliのインストール
if [ ! -x "`which mas`" ]; then
  brew install mas
fi

# brew-file install 
if [ ! -x "`which brew-file`" ]; then
    brew install rcmdnk/file/brew-file
fi

export HOMEBREW_BREWFILE=`ghq list -p | grep dotfiles`/brew-file/Brewfile
brew-file install
