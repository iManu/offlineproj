// Helpers pour les vues
// =====================

'use strict';

/* global Handlebars */

// Ce module est un emplacement dédié pour tous nos helpers Handlebars.

// Petit helper formattant un nombre de secondes avec un niveau
// d'arrondi plus parlant (tel quel sous la minute, en minutes sinon).
Handlebars.registerHelper('seconds_to_minutes', function(secs) {
  return secs < 50 ? secs + 's' : Math.round(secs / 60) + 'mn';
});
/*
// Helper pour afficher les lettres de l'alphabet
Handlebars.registerHelper('alphabet', function() {
    var accum, alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    for(var i = 0, len = alphabet.length; i < len; ++i) {

    }
        accum += block.fn(i);
    return accum;
});*/
