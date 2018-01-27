# Executes commands at the start of an interactive session.
#
# Authors:
#   Sorin Ionescu <sorin.ionescu@gmail.com>
#

#if test -d $HOME/.anyenv
#  set -x PATH $HOME/.anyenv/bin $PATH
#  eval (anyenv init -)
#  for D in `ls $HOME/.anyenv/envs`
#    set -x PATH $HOME/.anyenv/envs/$D/shims $PATH
#  end
#end
# anyenv path
set -x PATH $HOME/.anyenv/bin $PATH
# ndenv PATH
set -x NDENV_ROOT "/Users/nekoyashiki26/.anyenv/envs/ndenv"
set -x PATH "/Users/nekoyashiki26/.anyenv/envs/ndenv/bin" $PATH
set -x PATH "/Users/nekoyashiki26/.anyenv/envs/ndenv/shims" $PATH
# phpenv PATH
set -x PHPENV_ROOT "/Users/nekoyashiki26/.anyenv/envs/phpenv"
set -x PATH "/Users/nekoyashiki26/.anyenv/envs/phpenv/bin" $PATH
set -x PATH "/Users/nekoyashiki26/.anyenv/envs/phpenv/shims" $PATH
# pyenv PATH
set -x PYENV_ROOT "/Users/nekoyashiki26/.anyenv/envs/pyenv"
set -x PATH $PATH "/Users/nekoyashiki26/.anyenv/envs/pyenv/bin"
set -gx PATH '/Users/nekoyashiki26/.anyenv/envs/pyenv/shims' $PATH
# rbenv PATH
set -x RBENV_ROOT "/Users/nekoyashiki26/.anyenv/envs/rbenv"
set -x PATH $PATH "/Users/nekoyashiki26/.anyenv/envs/rbenv/bin"
set -gx PATH '/Users/nekoyashiki26/.anyenv/envs/rbenv/shims' $PATH
set -x HOMEBREW_NO_AUTO_UPDATE 1
source ~/setproxy_fish.sh
# エイリアス
alias l='gls -ltr --color=auto'
alias ls='gls --color=auto'
alias java-version='/usr/libexec/java_home -V'
alias java-version-all='/usr/libexec/java_home'
alias java9='set -x JAVA_HOME=`/usr/libexec/java_home -v 9`'
alias java8='set -x JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_131`'
alias nekotarou26='oathtool --totp --base32 $NEKOTAROU26_KEY'
alias nekoyaro26='oathtool --totp --base32 $NEKOYARO26_KEY'
alias hurgenduttu='oathtool --totp --base32 $HURGENDUTTU_KEY'
alias ddns2017='oathtool --totp --base32 $DDNS2017_KEY'
alias appletiser='oathtool --totp --base32 $WINDOWS_KEY'
alias la='gls -la --color=auto'
alias ll='gls -l --color=auto'
alias sudo='sudo -E '
alias so='source'
alias sd='sudo shutdown '
alias vi='nvim'
alias vz='nvim ~/.zshrc'
alias c='cdr'
alias cl='clear'
alias sl='sl'
# historyに日付を表示
alias cp='cp -i'
alias rm='rm -rf'
alias mkdir='mkdir -p'
alias ..='c ../'
alias back='pushd'
alias diff='diff -U1'
alias go='google-chrome &'
alias reboot='sudo reboot'
# backspace,deleteキーを使えるように
set -g theme_nerd_fonts yes
#stty erase ^H
function cd
  builtin cd $argv
  ls -l
end
function peco_sync_select_history
  history-merge
  peco_select_history $argv
end

