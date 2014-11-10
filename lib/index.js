var defaults = require('./defaults');
var dotHIVStyles = require('./styles');
var dotHIVTemplate = require('./html');

function dotHIVify(config) {
	'use strict';
	var options = {};

	// (Poor man's) merge of defaults with user-provided configuration
	for (var property in defaults) {
		if (defaults.hasOwnProperty(property)) {
			options[property] = typeof config[property] !== 'undefined' ? config[property] : defaults[property];
		}
	}

	var els = document.querySelectorAll(options.queries.join(', '));
	var replacement = dotHIVTemplate(options);
	var styles = dotHIVStyles(options);

	// Construct detoggle input
	var detoggle = document.createElement('input');
	detoggle.type = 'radio';
	detoggle.name = options.prefix;
	detoggle.className = options.prefix + '-state';
	detoggle.id = options.prefix + '-state-revert';

	// Construct styling
	var sheet = document.createElement('style');
	sheet.type = 'text/css';

	if (sheet.styleSheet) {
		sheet.styleSheet.cssText = styles;
	} else {
		sheet.appendChild(document.createTextNode(styles));
	}

	// Inject styling and detoggle
	document.head.appendChild(sheet);
	document.body.appendChild(detoggle);

	// Replace all the things.
	Array.prototype.forEach.call(els, function(el){
		el.innerHTML = el.innerText.split('.').join(replacement);
	});
}

module.exports = dotHIVify;
