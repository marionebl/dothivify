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
