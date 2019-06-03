#!/bin/bash

# home brew install
if [ ! -x "`which brew`" ]; then
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  brew update
fi

# mas-cliのインストール
if [ ! -x "`which mas`" ]; then
  brew install mas
fi

# brew-file install 
if [ ! -x "`which brew-file`" ]; then
    brew install rcmdnk/file/brew-file
fi


# git install
if [ ! -x "`which git`" ]; then
    brew install git
fi

