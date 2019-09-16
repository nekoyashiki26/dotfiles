#!/bin/bash

USERNAME=$(whoami)
# home brew install
if [ ! -x "`which brew`" ]; then
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  brew update
fi


# git install
if [ ! -x "`which git`" ]; then
    su -l $USERNAME -c "brew install git"
fi

# go install
if [ ! -x "`which go`" ]; then
    su -l $USERNAME -c "brew install go"
    su -l $USERNAME -c "export GOPATH=$HOME"
    su -l $USERNAME -c "export PATH=$PATH:$GOPATH/bin"
fi

# ghq install
if [ ! -x "`which ghq`" ]; then
    su -l $USERNAME -c "brew install ghq"
    su -l $USERNAME -c "git config --global ghq.root ~/src"
fi

