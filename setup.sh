#!/bin/bash
set -eu

echo " --------- General settings start ----------"
# 1.システム環境設定

# スクロールバーの表示:スクロール時に表示
defaults write -g AppleShowScrollBars -string "WhenScrolling"

# Dock:自動的に隠さない
defaults write com.apple.dock autohide -bool true

# スリープとスクリーンセーバの解除にパスワードを要求
defaults write com.apple.screensaver askForPassword -bool true

# パスワードを要求するまでの秒数
defaults write com.apple.screensaver askForPasswordDelay -int 5

# トラックパット周り
defaults write com.apple.trackpad.enableSecondaryClick -int 1
defaults write com.apple.trackpad.fiveFingerPinchSwipeGesture -int 2
defaults write com.apple.trackpad.fourFingerHorizSwipeGesture -int 2
defaults write com.apple.trackpad.fourFingerPinchSwipeGesture -int 2
defaults write com.apple.trackpad.fourFingerVertSwipeGesture -int 2
defaults write com.apple.trackpad.momentumScroll -int 1
defaults write com.apple.trackpad.pinchGesture -int 1
defaults write com.apple.trackpad.rotateGesture -int 1
defaukts write com.apple.trackpad.scrollBehavior -int 2
defaults write com.apple.trackpad.threeFingerDragGesture -int 0
defaults write com.apple.trackpad.threeFingerHorizSwipeGesture -int 2
defaults write com.apple.trackpad.threeFingerTapGesture -int 2
defaults write com.apple.trackpad.threeFingerVertSwipeGesture -int 2
defaults write com.apple.trackpad.twoFingerDoubleTapGesture -int 1
defaults write com.apple.trackpad.twoFingerFromRightEdgeSwipeGesture -int 3
defaults write com.apple.trackpad.version -int 5
defaults write PKSecureElementAvailableFlagsByHost -int 1

# カーソルの移動速度を変更 （1〜15）
defaults write -g com.apple.trackpad.scaling -float 10

# Finder:隠しファイル/フォルダを表示
defaults write com.apple.finder AppleShowAllFiles true

# Finder:拡張子を表示
defaults write NSGlobalDomain AppleShowAllExtensions -bool true


echo " --------- brew install start ----------"

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
if [! -x "`which brew-file`"]; then
    brew install rcmdnk/file/brew-file
fi


# git install
if [! -x "`which git`"]; then
    brew install git
fi


echo " --------- dotfiles setting start ----------"


# dotfiles設置
git clone --depth https://github.com/nekoyashiki26/dotfiles.git ~/.dotfiles 
~/.dotfiles/install.sh

echo " --------- app install start ----------"

# app install
export HOMEBREW_BREWFILE=~/.dotfiles/Brewfile

brew-file install
