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
    /*var filters =  store.getFilters(),
        filterPartners = filters[0].partners,
        applist = store.getAppsList()
    ;
    //console.log( filterPartners[idPartner] )

    applist.forEach(function(json) {

      var idPartnerApp = json.partner[0];

      var partnerObj = _.findWhere(filterPartners, { 'id': idPartnerApp });

      store.addPartner({
        'id' : json.id,
        'partner-name': partnerObj.item
      });
    });*/
    /**/
    return {
      appsList: this.listTemplate(store.getAppsList())
    };
  }

});
