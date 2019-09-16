#!/bin/bash

# home brew install
if [ ! -x "`which brew`" ]; then
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  brew update
fi


# git install
if [ ! -x "`which git`" ]; then
    brew install git
fi

# go install
if [ ! -x "`which go`" ]; then
    echo '-----go------'
    brew install go
    export GOPATH=$HOME
    export PATH=$PATH:$GOPATH/bin
fi

# ghq install
if [ ! -x "`which ghq`" ]; then
    echo '-----ghq------'
    brew install ghq
    git config --global ghq.root ~/src
fi

