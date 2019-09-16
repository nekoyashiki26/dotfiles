#!/bin/bash
set -eu

USERNAME=$(whoami)
echo " --------- General settings start ----------"
sh -c "$(curl -fsSL https://raw.githubusercontent.com/nekoyashiki26/dotfiles/master/setup/setup_system.sh)"

echo " --------- setup brew start ----------"
su -l $USERNAME -c 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/nekoyashiki26/dotfiles/master/setup/setup_brew.sh)"'

echo " --------- dotfiles setting start ----------"
su -l $USERNAME -c 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/nekoyashiki26/dotfiles/master/setup/setup_dotfiles.sh)"'

echo " --------- app install start ----------"
su -l $USERNAME -c "sh `ghq list -p | grep dotfiles`/setup/setup_app.sh"

