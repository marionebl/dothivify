var scrollTo = require('animated-scrollto');

function onChange(e) {
	var output = document.getElementById('output');

	if (e.target.className.indexOf('state') === -1 && e.target.checked !== true) {
		return;
	}

	scrollTo(document.body, e.target.offsetTop, 300);

	window.setTimeout(function(){
		if (output.checked) {
			var textarea = document.querySelectorAll('textarea')[0];
			textarea.focus();
			textarea.select();
		}
	}, 300);
}

module.exports = onChange;
