// Appcache
// ========================

'use strict';

if('applicationCache' in window) {
  window.applicationCache.addEventListener('updateready', function () {
    //alert('Rafraichir S.V.P.');
    $('#reloadPrompt').addClass('show');

  });
  // si la page n'est jamais rechargé, ce qui peut arriver en SPA
  setInterval(applicationCache.update, 100000000000000);
}
