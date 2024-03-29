
// Collection : Filters
// ======================

'use strict';

// Définition de la collection qu'on va employer (collection
// Backbone de filters).  On exploite ici plusieurs aspects
// pratiques des collections Backbone.


module.exports = Backbone.Collection.extend({
  // Définition du modèle à exploiter lors d'ajouts, fetches, etc.
  // Du coup, on peut passer juste des hashes d'attributs, ça
  // convertit tout seul.
  model: require('models/filters_list'),
  url: 'filters_db.json',
  parse: function (response) {
    return response;
  }
});

