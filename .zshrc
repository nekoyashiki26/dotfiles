if [ ! -f ~/.zshrc.zwc -o ~/.zshrc -nt ~/.zshrc.zwc ]; then
   zcompile ~/.zshrc
fi

export ZPLUG_HOME=/usr/local/opt/zplug
if [[ -f $ZPLUG_HOME/init.zsh ]]; then
  source $ZPLUG_HOME/init.zsh
  # ここに、導入したいプラグインを記述します！
  # 入力中のコマンドをコマンド履歴から推測し、候補として表示するプラグイン。
  zplug 'zsh-users/zsh-autosuggestions'
  # Zshの候補選択を拡張するプラグイン。
  zplug 'zsh-users/zsh-completions', use:'src/_*', lazy:true

  # cdの拡張
  zplug "b4b4r07/enhancd", use:init.sh

  # プロンプトのコマンドを色づけするプラグイン
  # compinit 以降に読み込むようにロードの優先度を変更する
  zplug "zsh-users/zsh-syntax-highlighting", defer:2
  # theme
  zplug "agkozak/agkozak-zsh-theme"
  #zplug 'yous/lime'
  # シェルの設定を色々いい感じにやってくれる。
  zplug 'yous/vanilli.sh'
  zplug 'zsh-users/zsh-history-substring-search'
  # Install plugins if there are plugins that have not been installed
#  if ! zplug check --verbose; then
#    printf "Install? [y/N]: "
#    if read -q; then
#      echo; zplug install
#    fi
#  fi
# Then, source plugins and add commands to $PATH
  zplug load 
fi


# .anyenv set script
if [ -d $HOME/.anyenv ] ; then
  export PATH="$HOME/.anyenv/bin:$PATH"
  eval "$(anyenv init -)"
  for D in `\ls $HOME/.anyenv/envs`
  do
    export PATH="$HOME/.anyenv/envs/$D/shims:$PATH"
  done
  eval "$(pyenv virtualenv-init -)"
fi

# Customize to your needs...
export LANG=ja_JP.UTF-8

# brew install時のupdateを禁止
export HOMEBREW_NO_AUTO_UPDATE=1

# 補完候補のカーソル選択を有効にする設定
zstyle ':completion:*:default' menu select=1

fpath=(/path/to/homebrew/share/zsh-completions $fpath)

# init.vimのpath
export XDG_CONFIG_HOME="$HOME/.config"

#補完を大文字小文字を区別しない
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'
# 色を使用

# エイリアス
alias pip3='pip3'
alias airport='/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport'
alias autoproxy='sh ~/ghq/github.com/nekoyashiki26/dotfiles/autoproxy.sh'
alias pip='pip3'
alias la='gls --color=auto -la'
alias ls='gls --color=auto'
alias disk='diskutil'
alias dl='aria2c -k 20M -s 16 -x 16'
alias sudo='sudo -E '
alias sd='mac shutdown > /dev/null'
alias reboot='mac restart > /dev/null'
alias ssaver='mac screensaver > /dev/null'
alias lock='mac lock > /dev/null'
alias load='exec $SHELL -l'
alias c='clear'
alias sleep='mac sleep'
alias vi='nvim'
alias vz='nvim ~/.zshrc'
alias vs='nvim ~/.ssh/config'
alias sl='sl'
# historyに日付を表示
alias h='fc -lt '%F %T' 1'
alias cp='cp -ia'
alias rm='rm -rf'
alias diff='diff -U1'
# 二段階認証
alias amazon='oathtool --totp --base32 $AMAZON_KEY | pbcopy'
alias nekotarou26='oathtool --totp --base32 $NEKOTAROU26_KEY | pbcopy'
alias nekoyashiki26='oathtool --totp --base32 $NEKOYASHIKI26_KEY | pbcopy'
alias nekoyaro26='oathtool --totp --base32 $NEKOYARO26_KEY | pbcopy'
alias hurgenduttu='oathtool --totp --base32 $HURGENDUTTU_KEY | pbcopy'
alias ddns2017='oathtool --totp --base32 $DDNS2017_KEY | pbcopy'
alias appletiser='oathtool --totp --base32 $WINDOWS_KEY | pbcopy'
alias kekkaisensen='oathtool --totp --base32 $KEKKAISENSEN | pbcopy'
alias github='oathtool --totp --base32 $GitHub | pbcopy'
alias facebook='oathtool --totp --base32 $FaceBook | pbcopy'
# ssh
alias cisco_remote='ssh -oProxyCommand="ssh -W %h:%p mlab_remote" cisco'
alias cisco='ssh -oProxyCommand="ssh -W %h:%p mlab" cisco'

# cd
alias div='ghq list --full-path | grep "ghq" | fzy  > /dev/null | cd'
alias lab='cd ~/Documents/investigation'
# 補完後、メニュー選択モードになり左右キーで移動が出来る
zstyle ':completion:*:default' menu select=2

function bus(){
  THIS_DIR=$(cd $(dirname $0); pwd)
  cd ~/ghq/github.com/nekoyashiki26/lab/lab-bus
  python3 bus.py $1
  cd $THIS_DIR
}

function filemake(){
  for i in `seq ${2}`
  do
    filename=${1}`printf %03d ${i}`
    if [[ -d ${filename} ]]; then
      echo "$filename exists!"
    else
      mkdir ${filename}
    fi
  done
}


function all-rename(){
  if [[ -n $2 ]]; then
    count=0
    newfile=$1
    filetype=$2
    ls -ltr *.${filetype} | while read line
    do
      (( count++ ))
      filename=$(awk '{print $NF}' <<<${line})
      echo "${filename} -> $newfile`printf %04d $count`.${filename##*.}"
      mv $filename "$newfile`printf %04d $count`.${filename##*.}"
    done
  elif [[ -n $1 ]]; then
    count=0
    newfile=$1
    ls -ltr * | while read line
    do
      (( count++ ))
      filename=$(awk '{print $NF}' <<<${line})
      mv $filename "$newfile`printf %04d $count`.${filename##*.}"
    done
  else
    echo 'please enter new file name'
  fi
}

function select-history() {
  BUFFER=$(history -n -r 1 | fzf --no-sort +m --query "$LBUFFER" --prompt="History > ")
  CURSOR=$#BUFFER
}
zle -N select-history
bindkey '^r' select-history

zstyle ':completion:*' list-colors 'di=36' 'ln=35' 'ex=32'

HISTFILE=~/.zsh_historyx
HISTSIZE=10000
SAVEHIST=10000

## 補完候補をキャッシュする。
zstyle ':completion:*' use-cache yes
zstyle ':completion:*' cache-path ~/.zsh/cache
## 詳細な情報を使わない
zstyle ':completion:*' verbose no

## sudo の時にコマンドを探すパス
zstyle ':completion:*:sudo:*' command-path /usr/local/sbin /usr/local/bin /usr/sbin /usr/bin /sbin /bin

setopt no_beep  # 補完候補がないときなどにビープ音を鳴らさない。
setopt no_nomatch # git show HEAD^とかrake foo[bar]とか使いたい
setopt prompt_subst  # PROMPT内で変数展開・コマンド置換・算術演算を実行
setopt transient_rprompt  # コマンド実行後は右プロンプトを消す
# ヒストリに追加されるコマンド行が古いものと同じなら古いものを削除
setopt hist_ignore_all_dups
# 古いコマンドと同じものは無視 
setopt hist_save_no_dups
setopt hist_reduce_blanks
setopt hist_no_store
setopt hist_verify
setopt share_history  # シェルのプロセスごとに履歴を共有
setopt extended_history  # 履歴ファイルに時刻を記録
setopt append_history  # 複数の zsh を同時に使う時など history ファイルに上書きせず追加
setopt auto_list  # 補完候補が複数ある時に、一覧表示
setopt auto_menu  # 補完候補が複数あるときに自動的に一覧表示する
unsetopt list_beep
setopt complete_in_word  # カーソル位置で補完する。
source ~/ghq/github.com/nekoyashiki26/dotfiles/setproxy.sh

# pip zsh completion start
function _pip_completion {
  local words cword
  read -Ac words
  read -cn cword
  reply=( $( COMP_WORDS="$words[*]" \
             COMP_CWORD=$(( cword-1 )) \
             PIP_AUTO_COMPLETE=1 $words[1] ) )
}
compctl -K _pip_completion pip

export PATH="/usr/local/sbin:$PATH"
export PIPENV_VENV_IN_PROJECT=true
