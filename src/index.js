var defaults = require('./defaults');
var dotHIVStyles = require('./templates/styles.dot');
var dotHIVTemplate = require('./templates/dot.dot');

var childrenTextNodes = require('./utils/children-text-nodes');

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
		Array.prototype.forEach.call(childrenTextNodes(el), function(textNode){
			for ( var i = 0; i <= textNode.nodeValue.length; i += 1) {
				console.log(textNode);
				if (textNode.nodeValue[i] === options.replaced) {
					var split = textNode.splitText(i);
					split.nodeValue = split.nodeValue.replace('.', '');
					var container = document.createElement('div');
					container.innerHTML = replacement;
					var dot = container.firstChild;
					textNode.parentNode.insertBefore(dot, split);
				}
			}
		});
	});
}

dotHIVify({});

module.exports = dotHIVify;
