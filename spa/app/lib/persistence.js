// Couche de persistence
// =====================

'use strict';

// Ce module encapsule toute la couche de persistence pour
// le reste de l'appli.  Il gère aussi bien les collections et
// modèles Backbone en RAM (limités au temps de vie de la page)
// que la couche de stockage côté client (ici limitée à `localStorage`)
// et sa synchronisation avec le serveur (Ajax pour le moment, à terme
// abstraction via Socket.IO pour tirer parti notamment des WebSockets
// quand c'est possible et de toute une série de fallbacks sympa).

// On importe le modèle pour surcharger sa fonction d'I/O serveur…
//var Apps = require('models/apps_list');

// On a évidemment besoin de la collection pour l'instancier
var AppsListCollection = require('models/collection');

// …et on est *très* sensibles à la connectivité, pour déterminer
// quand mettre en attente les synchros et quand réconcilier avec
// la couche serveur.
//var cnxSvc = require('lib/connectivity');

// Instantiations de la collection Backbone et du datastore
// persistent côté client.
var collection = new AppsListCollection();
var localStore = new Lawnchair({ name: 'appslist' }, $.noop);

collection.fetch({ reset: true });

// Une des deux fonctions exposées par l'API : enregistre un nouveau
// check-in.
/*function addAppsList(applist) {
  // Assurer une clé de stockage pour le datastore côté client (ici,
  // c'est Lawnchair qui repose sur `key`).
  applist.key = applist.key || Date.now();
  // Ignorer le checkIn si on l'a déjà (notif WebSocket montante
  // suite à un POST Ajax qui n'est pas forcément encore finalisé,
  // donc qui ne m'a pas encore forcément transmis mon `id`).
  if (collection.findWhere(_.pick(applist, 'key', 'title')))
    return;

  collection['id' in applist ? 'add' : 'create'](applist);
}*/

// La 2ème fonction exposée par l'API : renvoie la collection actuelle
// dans son ensemble (utilisé principalement au lancement et suite à
// une réconciliation client/serveur).
function getAppsList() {
  return collection.toJSON();
}

// Cette fonction interne est appelée au chargement pour initialiser
// la collection Backbone sur la base du datastore persistent côté client.
function initialLoad() {
  localStore.all(function(appslist) {
    collection.reset(appslist);
  });
}

// Fonction interne de réconciliation client/serveur, au chargement ou
// suite à un retour online.
/*function syncPending() {
  if (!cnxSvc.isOnline())
    return;

  // On a des _pending saves_ : on va commencer par là avant de
  // récupérer une liste finalisée depuis le serveur.  Afin de
  // savoir quand on pourra, il faut garder le compte des sauvegardes
  // au fil de leurs accusés de synchronisation.  On passe par un
  // gestionnaire temporaire d'événement pour `sync`.
  function accountForSync(model) {
    pendings = _.without(pendings, model);
    if (pendings.length)
      return;
    // `0 == pendings.length` : on peut récupérer la liste à jour
    // côté serveur.
    collection.off('sync', accountForSync);
    collection.fetch({ reset: true });
  }

  var pendings = collection.filter(function(c) { return c.isNew(); });
  if (pendings.length) {
    collection.on('sync', accountForSync);
    _.invoke(pendings, 'save');
  } else {
    // Aucun _pending save_ : on récupère directement la liste à jour
    // depuis le serveur.
    collection.fetch({ reset: true });
  }
}*/

// Surcharge du gestionnaire Backbone de persistence.  Primo, pour
// éviter toute requête XHR alors qu'on est offline.
/*Apps.prototype.sync = function sync(method, model, options) {
  console.log('Checkin::sync(', method, ', ', model, ', ', options, ') -- cnxSvc.isOnline() -> ', cnxSvc.isOnline());
  if (!cnxSvc.isOnline())
    return;
  return Backbone.sync(method, model, options);
};*/

// Gestionnaires d'événements (collection et app-wide) afin
// d'assurer la synchro client/serveur.

// La collection reset : uniquement lors d'une réconciliation
// finalisée.  On remplace alors le datastore client persistent
// et on publie un événement app-wide adapté pour que la vue d'historique
// se rafraîchisse complètement.
collection.on('reset', function() {
  localStore.nuke(function() {
    localStore.batch(collection.toJSON());
  });
  Backbone.Mediator.publish('appslist:reset');
});

// Ajout d'un checkin à la collection : ajouter au datastore client
// persistent (pour la couche serveur, Backbone s'en occupe tout seul).
/*collection.on('add', function(model) {
  localStore.save(model.toJSON());

  // L'événement app-wide qui va bien (la vue historique va s'en
  // servir pour insérer le check-in de façon animée tout en haut).
  Backbone.Mediator.publish('appslist:new', model.toJSON());
});*/

// La collection sync : la couche serveur a retourné un accusé de
// sauvegarde pour un nouveau check-in.  On a donc le champ `id`,
// ce qu’il faut absolument refléter dans le datastore client persistent
// pour éviter de le réconcilier par erreur plus tard en le prenant
// à tort pour un _pending save_…
/*collection.on('sync', function(model) {
  if (model instanceof Apps)
    localStore.save(model.toJSON());
});

Backbone.Mediator.subscribe('connectivity:online', syncPending);*/

// Initialisation au chargement

initialLoad();
//syncPending();

// Deux fonctions seulements publiées, comme indiqué plus haut.

module.exports = {
  //addAppsList: addAppsList,
  getAppsList: getAppsList
};
