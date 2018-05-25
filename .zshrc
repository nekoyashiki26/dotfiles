if [ ! -f ~/.zshrc.zwc -o ~/.zshrc -nt ~/.zshrc.zwc ]; then
   zcompile ~/.zshrc
fi
if [[ -f $HOME/.zplug/init.zsh ]]; then
  source ~/.zplug/init.zsh

  # ここに、導入したいプラグインを記述します！
  # 入力中のコマンドをコマンド履歴から推測し、候補として表示するプラグイン。
  zplug 'zsh-users/zsh-autosuggestions'
  # enhancd cd の拡張
  zplug "b4b4r07/enhancd", use:init.sh as:plugin
  # Zshの候補選択を拡張するプラグイン。
  zplug 'zsh-users/zsh-completions'

  # プロンプトのコマンドを色づけするプラグイン
  zplug 'zsh-users/zsh-syntax-highlighting'

  # pecoのようなインタラクティブフィルタツールのラッパ。
  #zplug 'mollifier/anyframe'
  # theme
  zplug "agkozak/agkozak-zsh-theme"
  #zplug 'yous/lime'
  # シェルの設定を色々いい感じにやってくれる。
  zplug 'yous/vanilli.sh'
  zplug 'zsh-users/zsh-history-substring-search'
  # Install plugins if there are plugins that have not been installed
  if ! zplug check --verbose; then
    printf "Install? [y/N]: "
    if read -q; then
      echo; zplug install
    fi
  fi
# Then, source plugins and add commands to $PATH
  zplug load 
fi

#
# Executes commands at the start of an interactive session.
#
# Authors:
#   Sorin Ionescu <sorin.ionescu@gmail.com>
#

export XDG_CONFIG_HOME=~/.config

if [ -d $HOME/.anyenv ] ; then
  export PATH="$HOME/.anyenv/bin:$PATH"
  eval "$(anyenv init -)"
  for D in `ls $HOME/.anyenv/envs`
  do
    export PATH="$HOME/.anyenv/envs/$D/shims:$PATH"
  done
fi


# visual studio code 
code () {
if [[ $# = 0 ]]
then
    open -a "Visual Studio Code"
else
    [[ $1 = /* ]] && F="$1" || F="$PWD/${1#./}"
    open -a "Visual Studio Code" --args "$F"
fi
}

# プロンプトが表示されるたびにプロンプト文字列を評価、置換する
setopt prompt_subst

# プロンプトの右側(RPROMPT)にメソッドの結果を表示させる
# Customize to your needs...
export LANG=en_US.UTF-8

# brew install時のupdateを禁止
export HOMEBREW_NO_AUTO_UPDATE=1

# 補完候補のカーソル選択を有効にする設定
zstyle ':completion:*:default' menu select=1

# コマンドエラーの修正
setopt nonomatch

fpath=(/path/to/homebrew/share/zsh-completions $fpath)


#補完を大文字小文字を区別しない
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'
# パスを追加したい場合
export PATH="$HOME/bin:$PATH"

# 色を使用
autoload -Uz colors
colors

# グローバルエイリアス
alias -g L='| less'
alias -g H='| head'
alias -g G='| grep'
alias -g GI='| grep -ri'

# エイリアス
alias l='gls --color=auto -ltr'
alias pip3='pip3'
alias airport='/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport'
alias autoproxy='sh ~/dotfiles/autoproxy.sh'
alias pip='pip3'
alias man='jman'
alias la='gls --color=auto -la'
alias ls='gls --color=auto -l'
alias disk='diskutil'
alias lun='sudo ifconfig en7 ether b8:6b:23:65:9f:8e'
alias so='source'
alias pupdate='pip3 list --outdated --format=legacy | awk '{print $1}' | xargs pip install -U'
alias reload='exec $SHELL -l'
alias new='touch'
alias sudo='sudo -E '
alias sd='mac shutdown'
alias reboot='mac restart'
alias ssaver='mac screensaver'
alias lock='mac lock'
alias sleep='mac sleep'
alias vi='nvim'
alias vz='nvim ~/.zshrc'
alias sl='sl'
# historyに日付を表示
alias h='fc -lt '%F %T' 1'
alias cp='cp -i'
alias rm='rm -rf'
alias diff='diff -U1'
# google二段階認証
alias amazon='oathtool --totp --base32 $AMAZON_KEY | pbcopy'
alias nekotarou26='oathtool --totp --base32 $NEKOTAROU26_KEY | pbcopy'
alias nekoyaro26='oathtool --totp --base32 $NEKOYARO26_KEY | pbcopy'
alias hurgenduttu='oathtool --totp --base32 $HURGENDUTTU_KEY | pbcopy'
alias ddns2017='oathtool --totp --base32 $DDNS2017_KEY | pbcopy'
alias appletiser='oathtool --totp --base32 $WINDOWS_KEY | pbcopy'

# backspace,deleteキーを使えるように
stty erase ^H
bindkey "^[[3~" delete-char 

# 補完後、メニュー選択モードになり左右キーで移動が出来る
zstyle ':completion:*:default' menu select=2

# mkdirとcdを同時実行
function mkcd() {
  if [[ -d $1 ]]; then
    echo "$1 already exists!"
    cd $1
  else
    mkdir -p $1 && cd $1
  fi
}

function twitter(){
  save="-s"
  THIS_DIR=$(cd $(dirname $0); pwd)
  cd ~/project/twitter
  if [ "$1" = "$save" ]; then
    python3 twitter.py -s
  else
    echo 'b'
    python3 twitter.py
  fi
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
function vpn(){
  case $1 in 
    on ) 
      launchctl load -w /Library/LaunchAgents/net.juniper.pulsetray.plist;;
    off )
      launchctl unload -w /Library/LaunchAgents/net.juniper.pulsetray.plist;;
  esac
}

function all-kill(){
  if [[ -n $1 ]]; then
    ps aux | grep $1 | grep -v grep | awk '{ print "kill -9", $2 }' | zsh
  else
    echo 'not found process name'
  fi
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
      echo "${filename} -> $newfile`printf %02d $count`.${filename##*.}"
      mv $filename "$newfile`printf %02d $count`.${filename##*.}"
    done
  elif [[ -n $1 ]]; then
    count=0
    newfile=$1
    ls -ltr * | while read line
    do
      (( count++ ))
      filename=$(awk '{print $NF}' <<<${line})
      mv $filename "$newfile`printf %02d $count`.${filename##*.}"
    done
  else
    echo 'please enter new file name'
  fi
}


autoload history-search-end
zle -N history-beginning-search-backward-end history-search-end
zle -N history-beginning-search-forward-end history-search-end
bindkey "^P" history-beginning-search-backward-end
bindkey "^N" history-beginning-search-forward-end

export LSCOLORS=gxfxxxxxcxxxxxxxxxgxgx
export LS_COLORS='di=01;36:ln=01;35:ex=01;32'
zstyle ':completion:*' list-colors 'di=36' 'ln=35' 'ex=32'

#ディレクトリ名だけで移動する。

HISTFILE=~/.zsh_historyx
HISTSIZE=10000
SAVEHIST=10000

### 補完
autoload -U compinit; compinit -C

### 補完方法毎にグループ化する。
zstyle ':completion:*' format '%B%F{blue}%d%f%b'
zstyle ':completion:*' group-name ''
### 補完侯補をメニューから選択する。
### select=2: 補完候補を一覧から選択する。補完候補が2つ以上なければすぐに補完する。
zstyle ':completion:*:default' menu select=2
### 補完候補に色を付ける。
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
### 補完候補がなければより曖昧に候補を探す。
### m:{a-z}={A-Z}: 小文字を大文字に変えたものでも補完する。
### r:|[._-]=*: 「.」「_」「-」の前にワイルドカード「*」があるものとして補完する。
#zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z} r:|[._-]=*'
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'

zstyle ':completion:*' keep-prefix
zstyle ':completion:*' recent-dirs-insert both

zstyle ':completion:*' completer _complete _ignored

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
setopt hist_ignore_dups   # 直前と同じコマンドラインはヒストリに追加しない
# ヒストリに追加されるコマンド行が古いものと同じなら古いものを削除
setopt hist_ignore_all_dups
# 古いコマンドと同じものは無視 
setopt hist_save_no_dups
setopt hist_reduce_blanks
setopt hist_no_store
setopt hist_verify
setopt share_history  # シェルのプロセスごとに履歴を共有
setopt extended_history  # 履歴ファイルに時刻を記録
#setopt hist_expand  # 補完時にヒストリを自動的に展開する。
setopt append_history  # 複数の zsh を同時に使う時など history ファイルに上書きせず追加
setopt auto_cd  # ディレクトリ名だけで移動
#setopt auto_pushd  # cd したら pushd
setopt auto_list  # 補完候補が複数ある時に、一覧表示
setopt auto_menu  # 補完候補が複数あるときに自動的に一覧表示する
#setopt auto_param_slash
setopt list_packed
setopt list_types
setopt no_flow_control
setopt print_eight_bit
setopt pushd_ignore_dups
setopt rec_exact
setopt autoremoveslash
unsetopt list_beep
setopt complete_in_word  # カーソル位置で補完する。
setopt glob
setopt glob_complete  # globを展開しないで候補の一覧から補完する。
setopt extended_glob  # 拡張globを有効にする。
setopt mark_dirs   # globでパスを生成したときに、パスがディレクトリだったら最後に「/」をつける。
setopt numeric_glob_sort  # 辞書順ではなく数字順に並べる。
setopt magic_equal_subst  # コマンドライン引数の --prefix=/usr とか=以降でも補完
setopt always_last_prompt  # 無駄なスクロールを避ける

## 実行したプロセスの消費時間が3秒以上かかったら
## 自動的に消費時間の統計情報を表示する。
REPORTTIME=3
manpath=/home/yoshinoriyamaguchi/.linuxbrew/share/man:/usr/local/man:/usr/local/share/man:/usr/share/man/ja:/usr/share/man:/usr/lib/jvm/java-8-oracle/man/ja
export MANPATH
source ~/enhancd/init.sh
source ~/setproxy.sh

function select-history() {
  BUFFER=$(history -n -r 1 | fzf --no-sort +m --query "$LBUFFER" --prompt="History > ")
  CURSOR=$#BUFFER
}
zle -N select-history
bindkey '^r' select-history

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
# pip zsh completion end


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
# pip zsh completion end


autoload history-search-end
zle -N history-beginning-search-backward-end history-search-end
zle -N history-beginning-search-forward-end history-search-end
bindkey "^P" history-beginning-search-backward-end
bindkey "^N" history-beginning-search-forward-end

export LSCOLORS=gxfxxxxxcxxxxxxxxxgxgx
export LS_COLORS='di=01;36:ln=01;35:ex=01;32'
zstyle ':completion:*' list-colors 'di=36' 'ln=35' 'ex=32'

#ディレクトリ名だけで移動する。

HISTFILE=~/.zsh_historyx
HISTSIZE=10000
SAVEHIST=10000

### 補完
autoload -U compinit; compinit -C

### 補完方法毎にグループ化する。
zstyle ':completion:*' format '%B%F{blue}%d%f%b'
zstyle ':completion:*' group-name ''
### 補完侯補をメニューから選択する。
### select=2: 補完候補を一覧から選択する。補完候補が2つ以上なければすぐに補完する。
zstyle ':completion:*:default' menu select=2
### 補完候補に色を付ける。
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
### 補完候補がなければより曖昧に候補を探す。
### m:{a-z}={A-Z}: 小文字を大文字に変えたものでも補完する。
### r:|[._-]=*: 「.」「_」「-」の前にワイルドカード「*」があるものとして補完する。
#zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z} r:|[._-]=*'
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'

zstyle ':completion:*' keep-prefix
zstyle ':completion:*' recent-dirs-insert both

zstyle ':completion:*' completer _complete _ignored

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
setopt hist_ignore_dups   # 直前と同じコマンドラインはヒストリに追加しない
# ヒストリに追加されるコマンド行が古いものと同じなら古いものを削除
setopt hist_ignore_all_dups
# 古いコマンドと同じものは無視 
setopt hist_save_no_dups
setopt hist_reduce_blanks
setopt hist_no_store
setopt hist_verify
setopt share_history  # シェルのプロセスごとに履歴を共有
setopt extended_history  # 履歴ファイルに時刻を記録
#setopt hist_expand  # 補完時にヒストリを自動的に展開する。
setopt append_history  # 複数の zsh を同時に使う時など history ファイルに上書きせず追加
setopt auto_cd  # ディレクトリ名だけで移動
#setopt auto_pushd  # cd したら pushd
setopt auto_list  # 補完候補が複数ある時に、一覧表示
setopt auto_menu  # 補完候補が複数あるときに自動的に一覧表示する
#setopt auto_param_slash
setopt list_packed
setopt list_types
setopt no_flow_control
setopt print_eight_bit
setopt pushd_ignore_dups
setopt rec_exact
setopt autoremoveslash
unsetopt list_beep
setopt complete_in_word  # カーソル位置で補完する。
setopt glob
setopt glob_complete  # globを展開しないで候補の一覧から補完する。
setopt extended_glob  # 拡張globを有効にする。
setopt mark_dirs   # globでパスを生成したときに、パスがディレクトリだったら最後に「/」をつける。
setopt numeric_glob_sort  # 辞書順ではなく数字順に並べる。
setopt magic_equal_subst  # コマンドライン引数の --prefix=/usr とか=以降でも補完
setopt always_last_prompt  # 無駄なスクロールを避ける

## 実行したプロセスの消費時間が3秒以上かかったら
## 自動的に消費時間の統計情報を表示する。
REPORTTIME=3
manpath=/home/yoshinoriyamaguchi/.linuxbrew/share/man:/usr/local/man:/usr/local/share/man:/usr/share/man/ja:/usr/share/man:/usr/lib/jvm/java-8-oracle/man/ja
export MANPATH
source ~/enhancd/init.sh
source ~/setproxy.sh

function select-history() {
  BUFFER=$(history -n -r 1 | fzf --no-sort +m --query "$LBUFFER" --prompt="History > ")
  CURSOR=$#BUFFER
}
zle -N select-history
bindkey '^r' select-history

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
# pip zsh completion end


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
# pip zsh completion end

