function dotHIVStyles(options) {
	return '.' + options.prefix + '-replacement-wrapper{ \
			position: relative;\
			display: inline-block;\
			height: ' + options.diameter + ';\
			width: ' + options.diameter + ';\
			margin: 1px;\
			vertical-align: bottom;\
			background: '+ options.dotBackground +';\
			border-radius: 100%;\
		}\
		.' + options.prefix + '-state{ \
			position: fixed;\
			top: 0;\
			left: -100000px;\
		}\
		.' + options.prefix + '-state-revert{ \
			display: none;\
		}\
		.' + options.prefix + '-replacement-aside{\
			display: none;\
			z-index: 100001;\
			box-sizing: border-box;\
			position: absolute;\
			bottom: ' + options.offset + ';\
			left: 50%;\
			width: 200px;\
			margin-left: -100px;\
			padding: 5px;\
			background: '+ options.popoverBackground +';\
			color: '+ options.popoverColor +';\
			font-family: Arial, Verdana, sans-serif;\
			font-size: 12px;\
		}\
		.' + options.prefix + '-state:checked + .' + options.prefix + '-state-revert-trigger{\
			position: fixed;\
			z-index: 100000;\
			top: 0;\
			right: 0;\
			bottom: 0;\
			left: 0;\
		}\
		.' + options.prefix + '-state:checked ~ .' + options.prefix + '-replacement-aside{\
			display: block;\
		}\
		.' + options.prefix + '-cta{\
			box-sizing: border-box;\
			display: inline-block;\
			width: 100%;\
			margin-top: 10px;\
			padding: 3px 5px;\
			text-align: center;\
			text-decoration: none;\
			color: inherit;\
			background: rgba(255,255,255,.4);\
			-webkit-transition: all .3s ease-in-out;\
			-moz-transition: all .3s ease-in-out;\
			transition: all .3s ease-in-out;\
		}\
		.' + options.prefix + '-replacement-aside::after{\
			content: \'\';\
			position: absolute;\
			bottom: -7px;\
			left: 50%;\
			margin-left: -10px;\
			width: 0;\
			height: 0;\
			border-style: solid;\
			border-width: 7.5px 10px 0 10px;\
			border-color: #000000 transparent transparent transparent;\
		}\
		.' + options.prefix + '-cta:hover{\
			background: rgba(255,255,255,.6);\
		}\
		@media only screen\
		and (max-device-width: 1024px) {\
			.' + options.prefix + '-replacement-aside{\
				position: fixed;\
				bottom: 0;\
				right: 0;\
				left: 0;\
				margin: 0;\
				width: 100%;\
				padding: 25px 15px;\
			}\
			.' + options.prefix + '-cta{\
				margin-top: 20px;\
			}\
		}';
}

module.exports = dotHIVStyles;
