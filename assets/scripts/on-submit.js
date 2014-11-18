var template = document.querySelectorAll('.js_generator_template')[0].innerText;
var form = document.querySelectorAll('.js_generator')[0];
var fields = form.querySelectorAll('input, select');
var outputEl = document.querySelectorAll('.js_output')[0];
var exit = document.getElementById('output');

var defaults = require('../../src/defaults');

function onSubmit(e) {
	if (e.target.className.indexOf('js_generator') === -1) {
		return;
	}

	e.preventDefault();
	var data = {};

	Array.prototype.forEach.call(fields, function(el){
		data[el.name] = el.value;
	});

	data.queries = data.queries.split(',').filter(function(item){
		return item;
	}).map(function(item){
		return item.trim();
	});

	var sanitized = {};

	Object.keys(data).forEach(function(key){
		if (data[key] !== defaults[key]) {
			sanitized[key] = data[key];
		}
	});

	outputEl.innerText = '<script type="text/javascript">'+ template +'window.dotHIVify('+ JSON.stringify(sanitized) +');</script>';
	exit.checked = true;
	outputEl.focus();
	outputEl.select();
}

module.exports = onSubmit;
