// Helpers pour les vues
// =====================

'use strict';

/* global Handlebars */

// Ce module est un emplacement dédié pour tous nos helpers Handlebars.

// helper pour obtenir la première lettre du nom de l'application
// sera utile pour le filtre alphabet
Handlebars.registerHelper('first_letter', function(title) {
  return title.charAt(0).toLowerCase();
});

