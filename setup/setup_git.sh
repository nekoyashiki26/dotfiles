# git setup
if [ ! -x "`which git`" ]; then
    git config --global ghq.root ~/.ghq
    git config --global core.excludesfile ~/.gitignore
fi
