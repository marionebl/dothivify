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

var targets = document.getElementsByClassName("stage-title");
	window.onload = function() {
		targets[0].className = targets[0].className + ' animated fadeInDown';
};
