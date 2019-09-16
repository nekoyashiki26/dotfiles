if [[ ! -f $HOME/.zplugin/bin/zplugin.zsh ]]; then
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/zdharma/zplugin/master/doc/install.sh)"
fi
source $HOME/.zplugin/bin/zplugin.zsh
autoload -Uz _zplugin
(( ${+_comps} )) && _comps[zplugin]=_zplugin
# コマンド履歴から推測し、候補として表示するプラグイン。
zplugin ice wait'0';zplugin load 'zsh-users/zsh-autosuggestions'
# Zshの候補選択を拡張するプラグイン。
zplugin ice wait'0';zplugin load 'zsh-users/zsh-completions' 
# cdの拡張
zplugin ice wait'0';zplugin load "b4b4r07/enhancd" 
# プロンプトのコマンドを色づけするプラグイン
zplugin ice wait'0';zplugin load "zsh-users/zsh-syntax-highlighting"
# theme
zplugin load "agkozak/agkozak-zsh-theme"
#zplugin load 'yous/lime'
# シェルの設定を色々いい感じにやってくれる。
zplugin ice wait'0';zplugin load 'yous/vanilli.sh' 
zplugin ice wait'0';zplugin load 'zsh-users/zsh-history-substring-search' 


#----------zsh setting----------
fpath=(/usr/local/share/zsh-completions $fpath)
autoload -U compinit
compinit -u

# history
HISTFILE=~/.zsh_historyx
HISTSIZE=10000
SAVEHIST=10000

# 補完候補のカーソル選択を有効にする設定
zstyle ':completion:*:default' menu select=1
#補完を大文字小文字を区別しない
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'
# 色を使用
# 補完後、メニュー選択モードになり左右キーで移動が出来る
zstyle ':completion:*:default' menu select=2
zstyle ':completion:*' list-colors 'di=36' 'ln=35' 'ex=32'
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
setopt hist_ignore_all_dups # ヒストリに追加されるコマンド行が古いものと同じなら古いものを削除
setopt hist_save_no_dups # 古いコマンドと同じものは無視 
setopt hist_reduce_blanks
setopt hist_no_store
setopt share_history  # シェルのプロセスごとに履歴を共有
setopt extended_history  # 履歴ファイルに時刻を記録
setopt append_history  # 複数の zsh を同時に使う時など history ファイルに上書きせず追加
setopt auto_list  # 補完候補が複数ある時に、一覧表示
setopt auto_menu  # 補完候補が複数あるときに自動的に一覧表示する
unsetopt list_beep
setopt complete_in_word  # カーソル位置で補完する。

#----------system settingu----------
#source ~/.dotfiles/shellscript/setproxy.sh
# .znyenv
# .anyenv set script
eval "$(anyenv init - --no-rehash)"

# system lang
# Customize to your needs...
export LANG=ja_JP.UTF-8

# homebrew
# brew install時のupdateを禁止
export HOMEBREW_NO_AUTO_UPDATE=1
# homebrew cask save Application in the directory
export HOMEBREW_CASK_OPTS="--appdir=/Applications"
# brewfile path
export HOMEBREW_BREWFILE=~/.dotfiles/Brewfile

# pip setting
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

# path
# add path
export PATH="/usr/local/sbin:$PATH"

# pipenv
# virtual env create project file
export PIPENV_VENV_IN_PROJECT=true
# pipenv completion
#eval "$(pipenv --completion)"

# neovim 
# init.vimのpath
export XDG_CONFIG_HOME="$HOME/.config"

# alias
alias la='gls --color=auto -la'
alias ls='gls --color=auto'
alias dl='aria2c -k 20M -s 16 -x 16'
alias sudo='sudo -E '
alias sd='mac shutdown > /dev/null'
alias reboot='mac restart > /dev/null'
alias load='exec zsh -l'
alias c='clear'
alias vi='nvim'
alias vz='nvim ~/.zshrc'
alias vs='nvim ~/.ssh/config'

# historyに日付を表示
alias h='fc -lt '%F %T' 1'
alias cp='cp -ia'
alias rm='rm -rf'
alias diff='diff -U1'

# ssh
#alias ssh='auto_ssh'
alias b-route='sudo route -nv add -net 153.156.70.51 192.168.179.1'

# cd
alias div='ghq list --full-path | grep "ghq" | fzf  > /dev/null | cd'

#git 
alias gget='ghq get -shallow'

# ---------- custom command ----------
# show history using fzf
function select-history() {
  BUFFER=$(history -n -r 1 | fzf --no-sort +m --query "$LBUFFER" --prompt="History > ")
  CURSOR=$#BUFFER
}
zle -N select-history
bindkey '^r' select-history

function auto_ssh(){
    SSID=`networksetup -getairportnetwork en0 |cut -d':' -f2|cut -b 2-`;
    case "$SSID" in
        "OSCAR1")
            ln -snfv ~/.ssh/conf/innerssh.conf ~/.ssh/config
            ;;
        *)
            ln -snfv ~/.ssh/conf/outerssh.conf ~/.ssh/config
            ;;
    esac
    #unalias ssh;
    ssh $1;
    #alias ssh='auto_ssh'
}
if (which zprof > /dev/null) ;then
  zprof | less
fi
