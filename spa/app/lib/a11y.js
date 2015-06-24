// a11y
// ========================

'use strict';

exports.checkService = function checkService(elem) {
		return elem.is(':checked') ? elem.attr('aria-checked', true) : elem.attr('aria-checked', false);
};
