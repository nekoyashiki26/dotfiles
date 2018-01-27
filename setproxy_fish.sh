function setproxy
	# == Global variable ==
	set -g ProgramName 'setproxy'
	set -g Version 2.0.1
	set -g HttpProxy 'wwwproxy.kanazawa-it.ac.jp:8080'
	set -g HttpsProxy 'wwwproxy.kanazawa-it.ac.jp:8080'
	set -g FtpPrpxy 'wwwproxy.kanazawa-it.ac.jp:8080'
	set -g NoProxy 'localhost,127.0.0.0/8,::1,*kanazawa-it.ac.jp,*kanazawa-tc.ac.jp,*kitnet.ne.jp,*eagle-net.ne.jp'
	set -g Copyright 'Copyright (c) 2015-2017, Hayato Doi'
	set -g tab '    '
	#== Global variable =end

	# == Manual ==

	# == Proxy set function ==
	function envproxy
		switch "$argv[1]"
    case on #echo on
			export http_proxy=$HttpProxy
      export https_proxy=$HttpsProxy
      export ftp_proxy=$FtpPrpxy
      export no_proxy=$NoProxy
    case off  #echo of
			set -e http_proxy
			set -e https_proxy
			set -e ftp_proxy
			set -e no_proxy
		case *
      echo {$ErrorArgument}
		end
	end
	function gitproxy
		# git command exist.
		switch "$argv[1]"
		case on  #echo on
			git config --global http.proxy http://{$HttpProxy}
			git config --global https.proxy http://{$HttpsProxy}
			git config --global url.'https://'.insteadOf git://
		case off
			git config --global --unset http.proxy
			git config --global --unset https.proxy
			git config --global --unset url.'https://'.insteadOf git://
    case *
				echo {$ErrorArgument}
		end
	end
	function npmproxy
		# git command exist.
		#if type npm > /dev/null 2>&1
		switch "$argv[1]"
    case on  #echo on
			npm -g config set proxy http://{$HttpProxy}
			npm -g config set https-proxy http://{$HttpsProxy}
			npm -g config set registry "https://registry.npmjs.org/"
  		npm config set proxy http://{$HttpProxy}
			npm config set https-proxy http://{$HttpsProxy}
			npm config set registry "https://registry.npmjs.org/"
		case off  #echo of
			npm -g config delete proxy
			npm -g config delete https-proxy
			npm -g config delete registry
			npm config delete proxy
			npm config delete https-proxy
			npm config delete registry
		case * 
			echo {$ErrorArgument}
		end
	end
	# == Proxy set function =end
	switch "$argv[1]"
    case all
			envproxy $argv[2]
			gitproxy $argv[2]
			npmproxy $argv[2]
		case env
			envproxy $argv[2]
		case git
			gitproxy $argv[2]
		case npm
			npmproxy $argv[2]
		case --version #echo version
			echo {$ProgramName}' '{$Version}
			echo $Copyright
		case --help #echo help
			echo {$ManualText}
		case * #shift #echo '--'
			echo {$ErrorArgument}
	end
end
