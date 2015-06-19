// Contrôleur zone des items applications
// ======================================

'use strict';

var View = require('./view');
var store = require('lib/persistence');

module.exports = View.extend({
  // Le template interne pour la liste et ses éléments
  listTemplate: require('./templates/apps_list'),
  // Les événements app-wide (pub/sub) auxquels on réagit
  subscriptions: {
    //'checkins:new': 'insertCheckIn',
    'appslist:reset': 'render'
  },
  // Le template principal
  template: require('./templates/apps'),

  // Convention définie par notre classe mère View pour render : on
  // peuple le template principal avec ces données.
  getRenderData: function() {
    return {
      appsList: this.listTemplate(store.getAppsList())
    };
  }

  // Réagit à la notif de nouveau check-in en l'insérant en haut
  // de la liste.
  /*insertCheckIn: function(checkIn) {
    checkIn.extra_class = 'new';
    this.$('#history').prepend(this.listTemplate([checkIn]));
    var that = this;
    _.defer(function() { that.$('#history li.new').removeClass('new'); });
  }*/
});
