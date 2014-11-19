(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../../src/":6,"./on-change":2,"./on-submit":3}],2:[function(require,module,exports){
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

},{"animated-scrollto":4}],3:[function(require,module,exports){
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

},{"../../src/defaults":5}],4:[function(require,module,exports){
(function (window) {
    var requestAnimFrame = (function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(callback){window.setTimeout(callback,1000/60);};})();

    var easeInOutQuad = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

    var animatedScrollTo = function (element, to, duration, callback) {
        var start = element.scrollTop,
        change = to - start,
        animationStart = +new Date();
        var animating = true;
        var lastpos = null;

        var animateScroll = function() {
            if (!animating) {
                return;
            }
            requestAnimFrame(animateScroll);
            var now = +new Date();
            var val = Math.floor(easeInOutQuad(now - animationStart, start, change, duration));
            if (lastpos) {
                if (lastpos === element.scrollTop) {
                    lastpos = val;
                    element.scrollTop = val;
                } else {
                    animating = false;
                }
            } else {
                lastpos = val;
                element.scrollTop = val;
            }
            if (now > animationStart + duration) {
                element.scrollTop = to;
                animating = false;
                if (callback) { callback(); }
            }
        };
        requestAnimFrame(animateScroll);
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = animatedScrollTo;
    } else {
        window.animatedScrollTo = animatedScrollTo;
    }
})(window);

},{}],5:[function(require,module,exports){
module.exports={
    "replaced": ".",
    "prefix": "dothiv",
    "queries": ["p"],
    "diameter": "4px",
    "offset": "16px",
    "dotBackground": "#ff0000",
    "popoverBackground": "#ffffff",
    "popoverColor": "#000000",
    "popoverFontSize": "14px",
    "headline": "A dot making all the difference.",
    "headlineColor": "#e00073",
    "headlineFontweight": "bold",
    "text": "For every single click on a .hiv site we donate to the fight against AIDS.",
    "buttonText": "Help now",
    "buttonHref": "https://click4life.hiv/en/",
    "buttonTarget": "_blank",
    "buttonBackground": "#e00073",
    "buttonHoverBackground": "#ff47a5",
    "buttonColor": "#ffffff"
}

},{}],6:[function(require,module,exports){
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

	var prefix = options['prefix']; // jshint ignore: line
	var els = document.querySelectorAll(options['queries'].join(', ')); // jshint ignore: line
	var replacement = dotHIVTemplate(options);
	var styles = dotHIVStyles(options);
	var stateClass = prefix + '-state';

	// Construct detoggle input
	var detoggle = document.createElement('input');
	detoggle.type = 'radio';
	detoggle.name = prefix;
	detoggle.className = stateClass;
	detoggle.id = prefix + '-state-revert';

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

	document.addEventListener('change', function(e){
		if (window.innerWidth < 1024) {
			return;
		}

		if (! e.target.classList.contains(stateClass)) {
			return;
		}

		var containerEl = e.target.parentNode;
		var asideEl = containerEl.querySelectorAll('.' + prefix + '-replacement-aside')[0];
		var asideRect = asideEl.getBoundingClientRect();
		var asideSpan = asideRect.width / 2;
		var containerRect = containerEl.getBoundingClientRect();

		if (! e.target.checked) {
			window.setTimeout(function(){
				containerEl.className = containerRect.className.replace(/down|right|left/ig, '');
			}, 300);
			return;
		}

		var classNames = [];

		if (asideRect.height > containerRect.top) {
			classNames.push('down');
		}

		if (asideSpan > containerRect.left) {
			classNames.push('right');
		} else if (asideSpan > window.innerWidth - containerRect.left) {
			classNames.push('left');
		}

		console.log(classNames);

		var containerClassName = containerEl.className;
		console.log(containerClassName);

		for (var j = 0; j < classNames.length; j += 1) {
			if (containerClassName.indexOf(classNames[j]) === -1) {
				containerClassName += ' ' + classNames[j];
			}
		}

		console.log(containerClassName);
		containerEl.className = containerClassName;
	}, false);
}

window['dotHIVify'] = dotHIVify; // jshint ignore: line
module.exports = dotHIVify;

},{"./defaults":5,"./templates/dot.dot":7,"./templates/styles.dot":8,"./utils/children-text-nodes":9}],7:[function(require,module,exports){
module.exports = function anonymous(it) {
var out='<label class="'+(it['prefix'])+'-replacement-wrapper"><input class="'+(it['prefix'])+'-state" type="radio" name="'+(it['prefix'])+'" /><label class="'+(it['prefix'])+'-state-revert-trigger" for="'+(it['prefix'])+'-state-revert"></label><aside class="'+(it['prefix'])+'-replacement-aside"><div><strong class="'+(it['prefix'])+'-h">'+(it['headline'])+'</strong>'+(it['text'])+'</div><a class="'+(it['prefix'])+'-cta" href="'+(it['buttonHref'])+'" target="'+(it['buttonTarget'])+'">'+(it['buttonText'])+'</a></aside></label>\'';return out;
}
},{}],8:[function(require,module,exports){
module.exports = function anonymous(it) {
var out='@import url(http://fonts.googleapis.com/css?family=Source+Sans+Pro:300);.'+(it['prefix'])+'-replacement-wrapper{position: relative;display: inline-block;height: '+(it['diameter'])+';width: '+(it['diameter'])+';margin: 1px 0 0 1px;vertical-align: baseline;background: '+(it['dotBackground'])+';border-radius: 50%;cursor: pointer;}.'+(it['prefix'])+'-replacement-wrapper::before{content: \'\';position: absolute;width: 30px;height: 30px;top: -15px;left: -15px;}.'+(it['prefix'])+'-state{position: fixed;top: 0;left: -100000px;}.'+(it['prefix'])+'-state-revert{display: none;}.'+(it['prefix'])+'-replacement-aside{z-index: 100001;box-sizing: border-box;position: absolute;left: -1000px;left: -200vw;bottom: '+(it.offset)+';width: 260px;margin-left: -130px;margin-bottom: -25px;padding: 10px;opacity: 0;background: '+(it['popoverBackground'])+';border: 1px solid #ddd;box-shadow: 0 0 10px rgba(0,0,0,.15);text-align: left;font-size: '+(it['popoverFontSize'])+';font-family: \'Source Sans Pro\', sans-serif;color: '+(it['popoverColor'])+';-webkit-transition: opacity .3s ease-in-out, margin .3s, left 0s .3s; -moz-transition: opacity .3s ease-in-out, margin .3s, left 0s .3s; -ms-transition: opacity .3s ease-in-out, margin .3s, left 0s .3s; transition: opacity .3s ease-in-out, margin .3s, left 0s .3s;}.'+(it['prefix'])+'-replacement-aside p,.'+(it['prefix'])+'-replacement-aside h{line-height: 1.5em;}.'+(it['prefix'])+'-replacement-aside a{line-height: 1.25em;}.'+(it['prefix'])+'-h{display: block;color: '+(it['headlineColor'])+';font-weight: '+(it['headlineFontweight'])+';margin: .25em 0 .5em 0;}.'+(it['prefix'])+'-state:checked + .'+(it['prefix'])+'-state-revert-trigger{position: fixed;z-index: 100000;top: 0;right: 0;bottom: 0;left: 0;}.'+(it['prefix'])+'-state:checked ~ .'+(it['prefix'])+'-replacement-aside{left: 50%;opacity: 1;margin-bottom: 0;-webkit-transition: opacity .3s ease-in-out, margin .3s; -moz-transition: opacity .3s ease-in-out, margin .3s; -ms-transition: opacity .3s ease-in-out, margin .3s; transition: opacity .3s ease-in-out, margin .3s;}a.'+(it['prefix'])+'-cta{box-sizing: border-box;display: inline-block;width: 100%;margin-top: 10px;padding: 3px 5px;text-align: center;text-decoration: none!important;font-weight: bold;color: '+(it['buttonColor'])+'!important;background: '+(it['buttonBackground'])+';cursor: pointer;-webkit-transition: all .3s ease-in-out; -moz-transition: all .3s ease-in-out; -ms-transition: all .3s ease-in-out; transition: all .3s ease-in-out;}.'+(it['prefix'])+'-replacement-aside::after{content: \'\';position: absolute;bottom: -7px;left: 50%;margin-left: -10px;width: 0;height: 0;border-style: solid;border-width: 7.5px 10px 0 10px;border-color: '+(it['popoverBackground'])+' transparent transparent transparent;}.'+(it['prefix'])+'-replacement-aside::before{content: \'\';position: absolute;bottom: -8px;left: 50%;margin-left: -10px;width: 0;height: 0;border-style: solid;border-width: 7.5px 10px 0 10px;border-color: #ddd transparent transparent transparent;}.down > .'+(it['prefix'])+'-replacement-aside{top: 100%;bottom: auto;margin-top: '+(it.offset)+';}.down > .'+(it['prefix'])+'-replacement-aside::after{top: -7px;bottom: auto;border-width: 0 10px 7.5px 10px;border-color: transparent transparent '+(it['popoverBackground'])+' transparent;}.down > .'+(it['prefix'])+'-replacement-aside::before{top: -8px;bottom: auto;border-width: 0 10px 7.5px 10px;border-color: transparent transparent #ddd transparent;}.left > .'+(it['prefix'])+'-replacement-aside{margin-left: -260px;}.left > .'+(it['prefix'])+'-replacement-aside::after,.left > .'+(it['prefix'])+'-replacement-aside::before{left: 100%;margin-left: -25px;}.right > .'+(it['prefix'])+'-replacement-aside{margin-left: 0;}.right > .'+(it['prefix'])+'-replacement-aside::after,.right > .'+(it['prefix'])+'-replacement-aside::before{left: auto;right: 100%;margin-right: -25px;}a.'+(it['prefix'])+'-cta{color: #fff;}a.'+(it['prefix'])+'-cta:hover{background: '+(it['buttonHoverBackground'])+';}@media only screen and (max-device-width: 1024px) {.'+(it['prefix'])+'-replacement-aside{position: fixed;right: 0;bottom: 0;left: 0;margin: 0;width: 100%;opacity: 1;padding: 25px 15px;-webkit-transform: translateY(100%); -moz-transform: translateY(100%); -ms-transform: translateY(100%); transform: translateY(100%);-webkit-transition: -webkit-transform .3s ease-in-out; -moz-transition: -moz-transform .3s ease-in-out; -ms-transition: -ms-transform .3s ease-in-out; transition: transform .3s ease-in-out;}.'+(it['prefix'])+'-state:checked ~ .'+(it['prefix'])+'-replacement-aside{left: 0;-webkit-transform: none; -moz-transform: none; -ms-transform: none; transform: none;-webkit-transition: -webkit-transform .3s ease-in-out; -moz-transition: -moz-transform .3s ease-in-out; -ms-transition: -ms-transform .3s ease-in-out; transition: transform .3s ease-in-out;}.'+(it['prefix'])+'-cta{margin-top: 20px;}}';return out;
}
},{}],9:[function(require,module,exports){
function childrenTextNodes(node) {
	var textNodes = [];
	for (node = node.firstChild; node; node = node.nextSibling) {
		if (node.nodeType === 3) {
			textNodes.push(node);
		}
	}

	return textNodes;
}

module.exports = childrenTextNodes;

},{}]},{},[1]);
