
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
  url: '/db.json',
  parse: function (response) {
    return response;
  }
  /*url: '/apps',
  comparator: function (c1, c2) {
    return +c2.get('key') - +c1.get('key');
  }*/
});

