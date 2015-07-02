// Couche de persistence
// =====================

'use strict';

// Ce module encapsule toute la couche de persistence pour
// le reste de l'appli.  Il gère aussi bien les collections et
// modèles Backbone en RAM (limités au temps de vie de la page)
// que la couche de stockage côté client (ici limitée à `localStorage`)
// et sa synchronisation avec le serveur (Ajax pour le moment).

// On importe les modèles pour surcharger sa fonction d'I/O serveur…

// On a évidemment besoin de la collection pour l'instancier
var FiltersCollection = require('models/filters_collection');
var AppsListCollection = require('models/apps_collection');

// …et on est *très* sensibles à la connectivité, pour déterminer
// quand mettre en attente les synchros et quand réconcilier avec
// la couche serveur.
var cnxSvc = require('lib/connectivity');

// Instantiations de la collection Backbone et du datastore
// persistent côté client.
var filters_collection = new FiltersCollection();
var apps_collection = new AppsListCollection();

var localStore_apps = new Lawnchair({ name: 'appslist' }, $.noop);
var localStore_filters = new Lawnchair({ name: 'filters' }, $.noop);

// popule localstore
filters_collection.fetch({ reset: true });
apps_collection.fetch({ reset: true });

// Les 2 fonctions exposées par l'API : renvoie la collection de apps
// et la collection des filtres
function getAppsList() {
  var filters = filters_collection.toJSON(),
      filterActions = filters[0].actions,
      apps = apps_collection.toJSON()
  ;
  _.each(apps, function(element, index, list) {
      element.action = _.map(element.action, function(idAction, indexAction) {
        return _.findWhere(filterActions, {id: idAction});
      });
  });

  return apps;
}
function getFilters() {
  return filters_collection.toJSON();
}
/*
function addPartner(partner) {
  localStore_apps.save(partner);
}
*/
// Cette fonction interne est appelée au chargement pour initialiser
// les collections Backbone.
function initialLoad() {
  localStore_apps.all(function(appslist) {
    apps_collection.reset(appslist);
  });
  localStore_filters.all(function(filters) {
    filters_collection.reset(filters);
  });
}

// Gestionnaires d'événements (collection et app-wide) afin
// d'assurer la synchro client/serveur.

// La collection reset : On remplace le datastore client persistent
// et on publie un événement app-wide adapté pour que la vue d'historique
// se rafraîchisse complètement.
apps_collection.on('reset', function() {
  localStore_apps.nuke(function() {
    localStore_apps.batch(apps_collection.toJSON());
  });
  Backbone.Mediator.publish('appslist:reset');
});

filters_collection.on('reset', function() {
  localStore_filters.nuke(function() {
    localStore_filters.batch(filters_collection.toJSON());
  });
  Backbone.Mediator.publish('filters:reset');
});

// Initialisation au chargement
initialLoad();

// Deux fonctions seulement publiées
module.exports = {
  //addPartner: addPartner,
  getAppsList: getAppsList,
  getFilters: getFilters
};
