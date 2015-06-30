// a11y
// http://www.w3.org/TR/wai-aria/states_and_properties
// 1. States
// 	- Widget
// 	- Live
// 	- Drag & Drop
// 2. Properties
// ========================

'use strict';


/**
 * States
 */

// widget
exports.checkService = function checkService(elem) {
	return elem.is(':checked') ? elem.attr('aria-checked', true) : elem.attr('aria-checked', false);
};
exports.disableService = function disableService(elem) {
	return elem;
};
exports.expandService = function expandService(elem) {
	return elem.attr('aria-expanded') === 'false' ? elem.attr('aria-expanded', true) : elem.attr('aria-expanded', false);
};
exports.hideService = function hideService(elem) {
	return elem;
};
exports.invalidService = function invalidService(elem) {
	return elem;
};
exports.pressService = function pressService(elem) {
	return elem;
};
exports.selectService = function selectService(elem) {
	return elem;
};

// live
exports.busService = function busService(elem) {
	return elem;
};

// Drag and Drop
exports.grabService = function grabService(elem) {
	return elem;
};

/**
 * Properties
 */

exports.popService = function popService(elem) {
	return elem;
};
