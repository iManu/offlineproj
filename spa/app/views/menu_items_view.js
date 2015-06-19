/**
 * = menu_items_view.js
 */
var View = require('./view'),
  store = require('lib/persistence'),
  connectivity = require('lib/connectivity')
;

module.exports = View.extend({
  template: require('./templates/menu_items'),
  //listTemplate: require('./templates/captions'),
  subscriptions: {
    'filters:reset': 'render'
  },
  // convention backbone pour catcher les events :
  // equivalent jq : $('header button').on('click', this.fetchPlaces)
  events: {
    //'click header button': 'fetchApps',
    // backbone fait automatiquement de la délégation d'évènements
    // correspond à $('#places').on('click', 'li', this.selectPlace)
    //'click #places li': 'selectPlace',
    //'submit': 'checkIn'
    'click .js-check-letter': 'letterCheck',
    'click .js-check-craft': 'craftCheck',
    'click .js-check-category': 'categoryCheck'
  },
  getRenderData: function menuItemsGetRenderData() {
    var filters =  store.getFilters(),
      filterCrafts = filters[0].crafts,
      filterCategories = filters[0].categories,
      filterActions = filters[0].actions
    ;
    //console.log('filters', filterCrafts);
    return {
      alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      filterCrafts: filterCrafts,
      filterCategories: filterCategories,
      filterActions: filterActions
    };
  },
  afterRender: function menuItemsAfterRender() {
    this.fetchFilters();
  },
  $submitter: null,
  $lettersList: [],
  $craftsList: [],
  $categoriesList: [],
  $actionsList: [],
  letterCheck: function letterCheck(e) {

    var target = e.target,
      letter = target.value,
      checkElem = $(target)
    ;
    // Les lettres de l'alphabet cochées/sécochées sont stockées dans un array
    // ça servira pour les filtres
    if( checkElem.is(':checked') ) {
      // on ajoute
      this.$lettersList.push( letter );
    } else {
      // on retire de la liste
      this.$lettersList = _.without(this.$lettersList, letter);
    }

    //console.log( this.$lettersList );
  },
  craftCheck: function craftCheck(e) {

    var target = e.target,
      checkElem = $(target),
      craft = checkElem.data('craft')
    ;
    // Les ID métiers cochées/sécochées sont stockées dans un array
    // ça servira pour les filtres
    if( checkElem.is(':checked') ) {
      // on ajoute
      this.$craftsList.push( craft );
    } else {
      // on retire de la liste
      this.$craftsList = _.without(this.$craftsList, craft);
    }

    //console.log('craft', this.$craftsList );
  },
  categoryCheck: function categoryCheck(e) {

    var target = e.target,
      checkElem = $(target),
      category = checkElem.data('category')
    ;
    // Les ID catégories cochées/sécochées sont stockées dans un array
    // ça servira pour les filtres
    if( checkElem.is(':checked') ) {
      // on ajoute
      this.$categoriesList.push( category );
    } else {
      // on retire de la liste
      this.$categoriesList = _.without(this.$categoriesList, category);
    }

    //console.log('categ', this.$categoriesList );
  },
  // Chargement initial des filtres
  fetchFilters: function fetchFilters() {
    if(!connectivity.isOnline()) return;

    // on vide la liste
    this.filters = [];
    this.renderFilters();

    /*var that = this;
    locSvc.getCurrentLocation(function(lt, lg) {
      that.$el.find('#geoloc').text(lt.toFixed(5) + ' ' + lg.toFixed(5));
      poiSvc.lookupPlaces(lt, lg, function(places) {
        //console.table(places);
        that.places = places;
        that.renderPlaces();
      });
    });*/
  },
  renderFilters: function renderFilters() {
    this.$el.find('#filters').html(
      this.getRenderData().filters
    );

  },
  //selectApp: function selectApp(e) {
    /*
    console.log(this);
    console.log(e.target);
    console.log(e.currentTarget);
    */
 /*   var current = $(e.currentTarget),
      active = this.$('#apps li.active');
    if (active[0] === current[0]) {
      return;
    }
    current.addClass('active');
    active.removeClass('active');
    this.$currentApp = current;

    this.updateUI(true);
  },
  updateUI: function updateUI(enabled) {
    this.$submitter = this.$submitter || this.$el.find('button[type="submit"]', 'form#submission');
    //this.$comment = this.$comment || this.$el.find('#comment');
    if (enabled) {
      this.$submitter.attr('disabled', false);
    } else {
      this.$submitter.attr('disabled', true);
      /*this.$comment.val('');
      if (this.$currentPlace) {
        this.$currentPlace.removeClass('active');
      }
      this.$currentPlace = null;*/
 /*   }
  /*,
  checkIn: function checkIn(e) {
    e.preventDefault();
    if (!this.$currentPlace) return;
    var placeId = this.$currentPlace.attr('data-place-id'),
      place = _.findWhere(this.places, {
        id: placeId
      }),
      data = {
        placeId: place.id,
        name: place.name,
        vicinity: place.vicinity,
        icon: place.icon,
        userName: notifications.userName,
        comment: this.$comment.val(),
        stamp: moment().format('HH:mm')
      };
    this.updateUI(false);
    //console.log(data);
    store.addCheckIn(data);
  }*/
});
