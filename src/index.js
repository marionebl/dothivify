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

	var els = document.querySelectorAll(options['queries'].join(', ')); // jshint ignore: line
	var replacement = dotHIVTemplate(options);
	var styles = dotHIVStyles(options);

	// Construct detoggle input
	var detoggle = document.createElement('input');
	detoggle.type = 'radio';
	detoggle.name = options['prefix']; // jshint ignore: line
	detoggle.className = options['prefix'] + '-state'; // jshint ignore: line
	detoggle.id = options['prefix'] + '-state-revert'; // jshint ignore: line

	// Construct styling
	var sheet = document.createElement('style');
	sheet.type = 'text/css';

	// Construct dot template
	var documentFragment = document.createDocumentFragment();
	var container = document.createElement('div');
	container.innerHTML = replacement;
	documentFragment.appendChild(container);
	var dotTemplate = container.firstChild;

	if (sheet.styleSheet) {
		sheet.styleSheet.cssText = styles;
	} else {
		sheet.appendChild(document.createTextNode(styles));
	}

	// Inject styling and detoggle
	document.head.appendChild(sheet);
	document.body.appendChild(detoggle);

	// Replace all the things.
	for (var i = 0; i < els.length; i += 1) {
		var textNodes = childrenTextNodes(els[i]);

		for (var j = 0; j < textNodes.length; j += 1) {
			var replacementNodes = [];
			var fragments = textNodes[j].nodeValue.split(options['replaced']); // jshint ignore: line
			var previousChars = [];
			var trailingChars = [];

			for (var k = 0; k < fragments.length; k += 1) {
				var previousChar = fragments[k - 1] ? fragments[k - 1][fragments[k - 1].length - 1] : '';
				var trailingChar = fragments[k + 1] ? fragments[k + 1][0] : true;

				previousChars.push(previousChar.match(/[a-z]/i));
				trailingChars.push(trailingChar !== null);
				replacementNodes.push(document.createTextNode(fragments[k]));
			}

			for (var l = 0; l < replacementNodes.length; l += 1) {
				textNodes[j].parentNode.insertBefore(replacementNodes[l], textNodes[j]);

				if (replacementNodes[l].nodeValue && previousChars[l] && trailingChars[l]) {
					textNodes[j].parentNode.insertBefore(dotTemplate.cloneNode(true), replacementNodes[l]);
				} else if (previousChars[l]) {
					replacementNodes[l].nodeValue = '.' + replacementNodes[l].nodeValue;
				}
			}

			textNodes[j].parentNode.removeChild(textNodes[j]);
		}
	}
}

window['dotHIVify'] = dotHIVify; // jshint ignore: line
module.exports = dotHIVify;
