// Appcache
// ========================

'use strict';

if('applicationCache' in window) {
  window.applicationCache.addEventListener('updateready', function () {
    //alert('Rafraichir S.V.P.');
    //$('#reloadPrompt').addClass('show');

    // No prompt, on recharge methode meme pas mal
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
      window.applicationCache.swapCache();
      window.location.reload();
    }

  }, false);
  // si la page n'est jamais rechargé, ce qui peut arriver en SPA
  setInterval(applicationCache.update, 100000000000000);
}
