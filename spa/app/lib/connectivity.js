// par defaut OK, on Fake la fonction
exports.isOnline = function() { return true; };
// si la propriété existe, on renvoi la bonne value
if ('onLine' in navigator) {
  exports.isOnline = function() {
    return navigator.onLine;
  };
  $(window).on('online offline', checkStatus);
  checkStatus();
}

function checkStatus () {
  Backbone.Mediator.publish( navigator.onLine ? 'connectivity:online':'connectivity:offline' );
}
