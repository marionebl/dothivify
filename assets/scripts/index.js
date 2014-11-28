var dothivify = require('../../src/');
var onSubmit = require('./on-submit');
var onChange = require('./on-change');

document.addEventListener('DOMContentLoaded', function(){
	dothivify({
		queries: ['.h0'],
		diameter: '10px',
		dotBackground: '#730C61',
		injectStyles: false
	});

	document.addEventListener('submit', onSubmit, false);
	document.addEventListener('change', onChange, false);
});

var targets = document.getElementsByClassName("stage-title");
	window.onload = function() {
		targets[0].className = targets[0].className + ' animated fadeInDown';
};
