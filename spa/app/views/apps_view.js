// Contrôleur zone des items applications
// ======================================

'use strict';

var View = require('./view');
var store = require('lib/persistence');

module.exports = View.extend({
  // Le template principal
  template: require('./templates/apps'),
  // Le template interne pour la liste et ses éléments
  listTemplate: require('./templates/apps_list'),
  // Les événements app-wide (pub/sub) auxquels on réagit
  subscriptions: {
    'appslist:reset': 'render'
  },
  // Convention définie par notre classe mère View pour render : on
  // peuple le template principal avec ces données.
  getRenderData: function() {
    return {
      appsList: this.listTemplate(store.getAppsList())
    };
  }

});
