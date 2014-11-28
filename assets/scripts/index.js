var dothivify = require('../../src/');
var onSubmit = require('./on-submit');
var onChange = require('./on-change');

document.addEventListener('DOMContentLoaded', function(){
	var optionsEl = document.getElementsByClassName('js_snippet_defaults')[0];
	var options = JSON.parse(optionsEl.textContent);
	dothivify(options);

	document.addEventListener('submit', onSubmit, false);
	document.addEventListener('change', onChange, false);
});
