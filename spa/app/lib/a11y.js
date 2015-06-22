// par defaut OK, on Fake la fonction
//exports.checkElem = function() { return false; };


exports.checkService = function checkService(elem) {

	//this.check = function (elem) {
		return elem.is(':checked') ? elem.attr('aria-checked', true) : elem.attr('aria-checked', false);
	//};
};


// si la propriété existe, on renvoi la bonne value
/*if ('' in navigator) {
  exports.checkElem = function() {
    return navigator.onLine;
  };
  $(window).on('check uncheck', checkElem);
  checkElem();
}*/

//$(window).on('check uncheck', checkService.check);
/*
exports.checkElem = function checkElem (elem) {
  Backbone.Mediator.publish( state === true ? 'a11y:check':'a11y:uncheck' );
}*/
