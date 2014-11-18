var dothivify = require('../../src/');
var onSubmit = require('./on-submit');
var onChange = require('./on-change');

document.addEventListener('DOMContentLoaded', function(){
	dothivify({
		queries: ['.demo'],
		diameter: '30px',
		offset: '35px',
		dotBackground: 'transparent'
	});

	document.addEventListener('submit', onSubmit, false);
	document.addEventListener('change', onChange, false);
});
