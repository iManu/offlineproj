
// Collection : Apps-list
// ======================

'use strict';

// Définition de la collection qu'on va employer (collection
// Backbone de apps-list).  On exploite ici plusieurs aspects
// pratiques des collections Backbone.


module.exports = Backbone.Collection.extend({
  // Définition du modèle à exploiter lors d'ajouts, fetches, etc.
  // Du coup, on peut passer juste des hashes d'attributs, ça
  // convertit tout seul.
  model: require('models/apps_list'),
  url: 'apps_db.json',
  parse: function (response) {
    return response;
  }

});

