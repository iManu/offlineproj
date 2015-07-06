// Helpers pour les vues
// =====================

'use strict';

var cnxSvc = require('lib/connectivity');

/* global Handlebars */

// Ce module est un emplacement dédié pour tous nos helpers Handlebars.

// helper pour obtenir la première lettre du nom de l'application
// sera utile pour le filtre alphabet
Handlebars.registerHelper('first_letter', function(title) {
  return title.charAt(0).toLowerCase();
});

// Helper qui permet de ne pas render des blocks si pas de connexion
Handlebars.registerHelper('is_online', function(options) {
  if( cnxSvc.isOnline() ) {
    return options.fn(this);
  }
});

// Helper pour passer en bas de casse
Handlebars.registerHelper('lowercase', function(str) {
  if(str && typeof str === "string") {
    return str.toLowerCase();
  }
});
