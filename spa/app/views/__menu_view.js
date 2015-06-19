/**
 * = menu_view.js
 */

// Contrôleur zone du menu
// =======================

'use strict';

var View = require('./view');
//var store = require('lib/persistence');

module.exports = View.extend({
  // Le template interne pour le menu et ses éléments
  menuItemsTemplate: require('./templates/menu_items'),
  // Les événements app-wide (pub/sub) auxquels on réagit
  subscriptions: {
    //'checkins:new': 'insertCheckIn',
    //'appslist:reset': 'render'
  },
  // Le template principal
  template: require('./templates/menu'),

  // Convention définie par notre classe mère View pour render : on
  // peuple le template principal avec ces données.
  getRenderData: function() {
    return {
      //menuItems: this.listTemplate(store.getAppsList())
      menuItems: this.menuItemsTemplate({
        alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      })

    };
  }


});
