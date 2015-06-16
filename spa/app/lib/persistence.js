/**
 * = persistence.js
 */

var AppsCollection = require('models/collection'),
  connectivity = require('lib/connectivity'),
  localStore = new Lawnchair({
    name:'apps'
  }, $.noop), // il faut un callback à Lawnchair du fait de son orientation asynchrone..
  // du coup on utilise noop qui est une fonction anonyme jQuery, equivalent à : function() {}),
  collection = new AppsCollection();


function addAppList(appList) {
  appList.key = Date.now(); // timestamp pour Lawnchair
  if(collection.findWhere( _.pick(appList, 'key', 'name'))) return;
  // create fait un add + un request et si le serveur répond 201, il fait un sync
  collection['id' in appList ? 'add' : 'create'](appList);
}
exports.addAppList = addAppList;



function getAppList() {
  // toJSON permet de revoyer un objet clean sans toutes les méthodes BBone
  return collection.toJSON();
}
exports.getAppList = getAppList;

// au chargement, récupération de la DB
function initialLoad() {
  // d'abord fetch du local
  localStore.all(function (appList) {
    collection.reset(appList);
  });
  /*
  // si pas de connection, on sort
  if (!connectivity.isOnline()) return;
  // recup la DB
  collection.fetch({
    // reset true pour dire que c'est le serveur qui est dans le vrai (si la collection eu été modifiée en local)
    reset: true
  });
  */
}
// pour éviter le problème de la vue chargée avant que la requête ne revienne
collection.on('reset', function() {
  Backbone.Mediator.publish('apps:reset');
});
/*
// POST d'un checkin
collection.on('add', function(checkIn) {
  Backbone.Mediator.publish('checkins:new', checkIn.toJSON());
  localStore.save(checkIn.toJSON());
});*/

initialLoad();
/*
// si pas de connection, on coupe le sync du POST
collection.model.prototype.sync = function sync(method, model, options) {
  if (!connectivity.isOnline()) return;
  return Backbone.sync(method, model, options);
};*/
/*
Backbone.Mediator.subscribe('connectivity:online', syncPending);

function syncPending() {
  // au cas où, des fois il annonce online alors que ça repasse en offline
  if (!connectivity.isOnline()) return;
  // si pas d'id dans le checkin, c'est qu'il a été enregistré en local et le serveur ne le connait pas encore
  // http://backbonejs.org/#Model-isNew
  var pendings = collection.filter(function(checkIn) {
    return checkIn.isNew();
  });
  if (pendings.length) {
    collection.on('sync', accountForSync);
    // http://underscorejs.org/#invoke + http://backbonejs.org/#Model-save
    _.invoke(pendings, 'save');
  }
  // on va vider le tableau pendings petit à petit
  function accountForSync(model) {
    pendings = _.without(pendings, model);
    if (pendings.length) return;
    // on coupe le sync
    collection.off('sync', accountForSync);
    // on recharge la liste quand le dernier est passé
    collection.fetch({
      reset: true
    });
  }
}

collection.on('sync', function (model) {
  // comme ça on stocke même les checks d'autres utilisateurs
  localStore.save(model.toJSON());
});*/
