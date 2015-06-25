// Contrôleur principal
// ====================

'use strict';

var View = require('./view');
var MenuView = require('./menu_items_view');
var AppsView = require('./apps_view');
var cnxSvc = require('lib/connectivity');

module.exports = View.extend({
  // Les événements app-wide (pub/sub) auxquels on réagit
  subscriptions: {
    'connectivity:online': 'syncMarker',
    'connectivity:offline': 'syncMarker'
  },
  // Le template principal
  template: require('./templates/home'),

  // Après le rendering complet (initial), on procède aux initialisations
  // de comportements et injections des vues imbriquées
  afterRender: function() {
    // On met en cache le marqueur online/offline
    this.syncMarker();

    // On initialise et on render à la volée les deux vues imbriquées
    new MenuView({ el: this.$('#menuUI') }).render();
    new AppsView({ el: this.$('#appsUI') }).render();
  },

  // Convention définie par notre classe mère View pour render : on
  // peuple le template principal avec ces données.
  getRenderData: function() {
    return {
      mydata: 'fake',
      otherdata: 'fake'
    };
  },

  // Réaction à la notif de passage online/offline : on ajuste le marqueur
  syncMarker: function() {
    this._onlineMarker = this._onlineMarker || this.$('#onlineMarker');
    if(cnxSvc.isOnline()) {
      this._onlineMarker.find('.js-on').addClass('is-lighten');
      this._onlineMarker.find('.js-off').removeClass('is-lighten');
    } else {
      this._onlineMarker.find('.js-off').addClass('is-lighten');
      this._onlineMarker.find('.js-on').removeClass('is-lighten');
    }
  }

});
