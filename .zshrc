if [[ -f $HOME/.zplug/init.zsh ]]; then
    source ~/.zplug/init.zsh

    # ここに、導入したいプラグインを記述します！

    # 入力中のコマンドをコマンド履歴から推測し、候補として表示するプラグイン。
    zplug 'zsh-users/zsh-autosuggestions'

    # Zshの候補選択を拡張するプラグイン。
    zplug 'zsh-users/zsh-completions'

    # プロンプトのコマンドを色づけするプラグイン
    zplug 'zsh-users/zsh-syntax-highlighting'

    # pecoのようなインタラクティブフィルタツールのラッパ。
    zplug 'mollifier/anyframe'

    # シェルの設定を色々いい感じにやってくれる。
    zplug 'yous/vanilli.sh'
    #zplug 'yous/lime'
    zplug 'zsh-users/zsh-history-substring-search'
    zplug 'yous/lime'

   # Install plugins if there are plugins that have not been installed
    if ! zplug check --verbose; then
        printf "Install? [y/N]: "
        if read -q; then
            echo; zplug install
        fi
    fi

    # Then, source plugins and add commands to $PATH
    zplug load --verbose
fi

#
# Executes commands at the start of an interactive session.
#
# Authors:
#   Sorin Ionescu <sorin.ionescu@gmail.com>
#
export export XDG_CONFIG_HOME=~/.config

#hub commands install
#function git(){hub "$@"}
local git==git
branchname=`${git} symbolic-ref --short HEAD 2> /dev/null`
# ここはプロンプトの設定なので今回の設定とは関係ありません
if [ $UID -eq 0 ];then
# ルートユーザーの場合
PROMPT="%F{red}%n:%f%F{green}%d%f [%m] %%
"
else
# ルートユーザー以外の場合
PROMPT="%F{cyan}%n:%f%F{green}%d%f [%m] %%
"
fi


# ブランチ名を色付きで表示させるメソッド
function rprompt-git-current-branch {
  local branch_name st branch_status

  if [ ! -e  ".git" ]; then
    # gitで管理されていないディレクトリは何も返さない
    return
  fi
  branch_name=`git rev-parse --abbrev-ref HEAD 2> /dev/null`
  st=`git status 2> /dev/null`
  if [[ -n `echo "$st" | grep "^nothing to"` ]]; then
    # 全てcommitされてクリーンな状態
    branch_status="%F{green}"
  elif [[ -n `echo "$st" | grep "^Untracked files"` ]]; then
    # gitに管理されていないファイルがある状態
    branch_status="%F{red}?"
  elif [[ -n `echo "$st" | grep "^Changes not staged for commit"` ]]; then
    # git addされていないファイルがある状態
    branch_status="%F{red}+"
  elif [[ -n `echo "$st" | grep "^Changes to be committed"` ]]; then
    # git commitされていないファイルがある状態
    branch_status="%F{yellow}!"
  elif [[ -n `echo "$st" | grep "^rebase in progress"` ]]; then
    # コンフリクトが起こった状態
    echo "%F{red}!(no branch)"
    return
  else
    # 上記以外の状態の場合は青色で表示させる
    branch_status="%F{blue}"
  fi
  # ブランチ名を色付きで表示する
  echo "${branch_status}[$branch_name]"
}

# プロンプトが表示されるたびにプロンプト文字列を評価、置換する
setopt prompt_subst

# プロンプトの右側(RPROMPT)にメソッドの結果を表示させる
RPROMPT='`rprompt-git-current-branch`'
# Customize to your needs...
export LANG=ja_JP.UTF-8

# ls 等の色設定
export LS_COLORS='di=36;01:ln=35:so=32:pi=33:ex=31:bd=46;34:cd=43;34:su=41;30:sg=46;30:tw=42;30:ow=43;30'

# 補完候補一覧をカラー表示する設定
zstyle ':completion:*:default' list-colors ${(s.:.)LS_COLORS}

# 補完候補のカーソル選択を有効にする設定
zstyle ':completion:*:default' menu select=1

# コマンドエラーの修正
setopt nonomatch

#補完を大文字小文字を区別しない
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'
# パスを追加したい場合
export PATH="$HOME/bin:$PATH"

export PATH="$HOME/.linuxbrew/bin:$PATH"
export MANPATH="$HOME/.linuxbrew/share/man:$MANPATH"
export INFOPATH="$HOME/.linuxbrew/share/info:$INFOPATH"

# 色を使用
autoload -Uz colors
colors

# 補完
autoload -Uz compinit
compinit

# グローバルエイリアス
alias -g L='| less'
alias -g H='| head'
alias -g G='| grep'
alias -g GI='| grep -ri'


# エイリアス
alias l='ls -ltr --color=auto'
alias la='ls -la --color=auto'
alias ll='ls -l --color=auto'
alias sudo='sudo -E '
alias so='source'
alias sd='shutdown -h now'
alias vi='nvim'
alias vz='nvim ~/.zshrc'
alias c='cdr'
alias cl='clear'
alias sl='sl'
# historyに日付を表示
alias h='fc -lt '%F %T' 1'
alias cp='cp -i'
alias rm='rm -i'
alias mkdir='mkdir -p'
alias ..='c ../'
alias back='pushd'
alias diff='diff -U1'
alias vm='sudo vmplayer'

# backspace,deleteキーを使えるように
stty erase ^H
bindkey "^[[3~" delete-char

# cdの後にlsを実行
chpwd() { ls -ltr --color=auto }

# どこからでも参照できるディレクトリパス
cdpath=(~)

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

setopt hist_ignore_dups

autoload history-search-end
zle -N history-beginning-search-backward-end history-search-end
zle -N history-beginning-search-forward-end history-search-end
bindkey "^P" history-beginning-search-backward-end
bindkey "^N" history-beginning-search-forward-end

export LSCOLORS=gxfxxxxxcxxxxxxxxxgxgx
export LS_COLORS='di=01;36:ln=01;35:ex=01;32'
zstyle ':completion:*' list-colors 'di=36' 'ln=35' 'ex=32'

#ディレクトリ名だけで移動する。
setopt auto_cd

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

### 補完候補
### _oldlist 前回の補完結果を再利用する。
### _complete: 補完する。
### _match: globを展開しないで候補の一覧から補完する。
### _history: ヒストリのコマンドも補完候補とする。
### _ignored: 補完候補にださないと指定したものも補完候補とする。
### _approximate: 似ている補完候補も補完候補とする。
### _prefix: カーソル以降を無視してカーソル位置までで補完する。
#zstyle ':completion:*' completer _oldlist _complete _match _history _ignored _approximate _prefix
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
setopt hist_ignore_all_dups  # 重複したヒストリは追加しない
setopt hist_reduce_blanks
setopt hist_no_store
setopt hist_verify
setopt share_history  # シェルのプロセスごとに履歴を共有
setopt extended_history  # 履歴ファイルに時刻を記録
#setopt hist_expand  # 補完時にヒストリを自動的に展開する。
setopt append_history  # 複数の zsh を同時に使う時など history ファイルに上書きせず追加
setopt auto_cd  # ディレクトリ名だけで移動
setopt auto_pushd  # cd したら pushd
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



function envproxy(){
	# Function name      : envproxy
	
# Author             : Hayato Doi
	# Outline            : この関数は、環境変数をセットするプログラムである。
	# Update information : 2系 .<shell>rcに書き込む事で、sourceしなくて良くなった。
	#                    : ヒアドキュメントのインデントを修正。
	#
	# Arguments          : 
	#              * on     プロキシをセットする
	#              * off    プロキシを解除する。
	#              * --version バージョン情報の表示
	#              * --help ヘルプの表示
	# Copyright (c) 2015-2016, Hayato Doi


	# == Global variable ==
	ProgramName='envproxy'
	Version=2.0.1
	HttpProxy='wwwproxy.kanazawa-it.ac.jp:8080'
	HttpsProxy='wwwproxy.kanazawa-it.ac.jp:8080'
	FtpPrpxy='wwwproxy.kanazawa-it.ac.jp:8080'
	NoProxy='localhost,127.0.0.0/8,::1,*kanazawa-it.ac.jp,*kanazawa-tc.ac.jp,*kitnet.ne.jp,*eagle-net.ne.jp'
	Copyright='Copyright (c) 2015-2016, Hayato Doi'
	tab='    '
	#== Global variable =end

	# == Manual ==
	ManualText=`cat <<- EOS
		使用法: ${ProgramName} [オプション]
		[オプション]
		${tab}on        プロキシをセットする。
		${tab}of        プロキシのセットを無効化する。
		${tab}--version プログラムのバージョン情報を表示する。
		${tab}--help    プログラムのヘルプを表示する。
		${ProgramName} に関するバグは< b1517914@planet.kanazawa-it.ac.jp >までご連絡ください。
		${Copyright}
	EOS`
	# == Manual =end

	# == Error Message ==
	ErrorArgument=`cat <<- EOS
		コマンドライン引数が間違っています。
		--help で使い方を確認できます。
	EOS`
	# == Error Message =end

	if [ $# -eq 0 ];then
		echo ${ErrorArgument}
	fi

	case $1 in
		on) #echo on
			export http_proxy=$HttpProxy
			export https_proxy=$HttpsProxy
			export ftp_proxy=$FtpPrpxy
			export no_proxy=$NoProxy
			;;
		off) #echo of
			unset http_proxy
			unset https_proxy
			unset ftp_proxy
			unset no_proxy
			;;
		--version) #echo version
			echo ${ProgramName}' '${Version}
			echo $Copyright
			;;
		--help) #echo help
			echo ${ManualText}
			;;
		--) shift #echo '--'
			echo ${ErrorArgument}
			;;
	esac
}


