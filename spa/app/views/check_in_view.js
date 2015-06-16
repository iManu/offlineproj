// Contrôleur zone de check-ins
// ============================

'use strict';

var View = require('./view');
var locSvc = require('lib/location');
var poiSvc = require('lib/places');
var cnxSvc = require('lib/connectivity');
var store = require('lib/persistence');
var userName = require('lib/notifications').userName;

module.exports = View.extend({
  // Le `<li>` actuellement sélectionné
  currentPlace: null,
  // Les événements UI auxquels on réagit
  events: {
    'click header button': 'fetchPlaces',
    'click #places li': 'selectPlace',
    'submit': 'checkIn'
  },
  // Notre template de liste
  listTemplate: require('./templates/places'),
  // Les POI qu'on connait
  places: [],
  // Les événements app-wide (pub/sub) auxquels on réagit
  subscriptions: {
    'connectivity:online': 'fetchPlaces'
  },
  // Notre template principal
  template: require('./templates/check_in'),

  afterRender: function() {
    this.fetchPlaces();
  },

  // Envoi d'un check-in
  checkIn: function(e) {
    e.preventDefault();
    if (!this.currentPlace)
      return;

    // On récupère l'ID du POI depuis data-place-id et on le trouve dans places
    var placeId = this.currentPlace.attr('data-place-id');
    var place = _.findWhere(this.places, { id: placeId });
    // On soumet le check-in à la couche de persistence.  L'événement app-wide
    // qu'elle déclenchera (checkins:new) activera l'insertion dans l'historique.
    store.addCheckIn({
      userName: userName,
      placeId: place.id,
      name: place.name,
      vicinity: place.vicinity,
      icon: place.icon,
      comment: this._comment.val(),
      stamp: moment().format('HH:mm')
    });
    // Remise "à zéro" de l'UI de check-in
    this.updateUI(false);
  },

  // Désactive l'UI de check-in le temps de récupérer la géoloc actuelle
  // et les POI associés.
  fetchPlaces: function() {
    if (!cnxSvc.isOnline())
      return;

    // Le premier rendering de `#places` affichera le mode recherche…
    this.places = [];
    this.renderPlaces();
    this.updateUI(false);
    var that = this;
    // On récupère la géoloc…
    locSvc.getCurrentLocation(function(lat, lng) {
      that.$('#geoloc').text(lat.toFixed(7) + ' / ' + lng.toFixed(7));
      // Et du coup, on choppe les POI
      poiSvc.lookupPlaces(lat, lng, function(places) {
        // Et on re-render
        that.places = places;
        that.renderPlaces();
      });
    });
  },

  // Convention définie par notre classe mère View pour render : on
  // peuple le template principal avec ces données.
  // Le searching est juste là pour afficher le spinner si pas de
  // POI, afin de différencier avec le contexte de l'historique, ou pas
  // d'éléments = juste du vide…
  getRenderData: function() {
    return {
      placeList: this.listTemplate({ places: this.places })
    };
  },

  // Mise à jour localisée du bloc des POI, sans toucher au reste.
  renderPlaces: function() {
    this.$('#places').html(this.getRenderData().placeList);
  },

  // Réagit au clic dans la liste des POI pour faire sélection et activer l'UI
  // de check-in.
  selectPlace: function(e) {
    var active = this.$('#places li.active'), current = $(e.currentTarget);
    if (active[0] === current[0])
      return;
    active.removeClass('active');
    this.currentPlace = current.addClass('active');
    this.updateUI(true);
  },

  // Petite méthode utilitaire pour activer/désactiver l'envoi (classe CSS
  // pour le style sur les vieux navigateurs, attribut disabled pour le vrai
  // comportement du bouton)
  updateUI: function(enabled) {
    this._submitter = this._submitter || this.$('button[type="submit"]');
    this._comment = this._comment || this.$('#comment');

    if (enabled) {
      this._submitter.attr('disabled', false);
    } else {
      this._submitter.attr('disabled', true);
      if (this.currentPlace)
        this.currentPlace.removeClass('active');
      this.currentPlace = null;
      this._comment.val('');
    }
  }
});
