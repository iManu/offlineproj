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
    'click .js-check-category': 'categoryCheck',
    'keyup .js-search': 'searchBox',
    'click .js-craft-button': 'toggleFilterList',
    'click .js-category-button': 'toggleFilterList'
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
  /*initialize: function() {

  },*/
  afterRender: function menuItemsAfterRender() {
    this.fetchFilters();
    this.$isogrid = $('.Isogrid');
  },
  $submitter: null,
  $lettersList: [],
  $craftsList: [],
  $categoriesList: [],
  $actionsList: [],
  $isogrid: {},
  toggleFilterList : function toggleFilterList(e) {
    var target = e.target,
      buttonElem = $(target),
      listElem = buttonElem.siblings('.Filters__list')
    ;
    //console.log(listElem)
    listElem[ ( listElem.hasClass('is-open') ? 'remove' : 'add' ) + 'Class' ]('is-open');
  },
  filterIsotope: function filterIsotope() {
    // Ici les filtres choisis sont concatenes et sont envoyes a isotope:filter
    var
      that = this,
      filterValue = ''
    ;


    if( this.$craftsList.length > 0 ) {
      filterValue += this.$craftsList.join();
    }
    if( this.$categoriesList.length > 0 ) {
      filterValue += this.$categoriesList.join();
    }
    if( this.$lettersList.length > 0 ) {
      filterValue += this.$lettersList.join();
    }

    //console.log(filterValue);

    //setTimeout(function() {
      // setTimeout : we need a dom repaint !
      that.$isogrid.isotope({ filter: filterValue });
      //console.log(that.$isogrid.data('isotope'))
      if ( !that.$isogrid.data('isotope').filteredItems.length ) {
        // Aucun résultats !
        alert('nothing');
      }
    //},1);
  },
  letterCheck: function letterCheck(e) {

    var target = e.target,
      letter = target.value,
      checkElem = $(target)
    ;
    // Les lettres de l'alphabet cochées/sécochées sont stockées dans un array
    // ça servira pour les filtres
    if( checkElem.is(':checked') ) {
      // on ajoute
      this.$lettersList.push( '.letter-' + letter );
    } else {
      // on retire de la liste
      this.$lettersList = _.without(this.$lettersList, '.letter-' + letter);
    }

    this.filterIsotope();
    //console.log( this.$lettersList );
  },
  searchBox: _.debounce(function searchBox(e) {
    var target = e.target,
      searchElem = $(target),
      research = searchElem.val(),
      qsRegex = new RegExp( research, 'gi' )
    ;

    //console.log('research: ', research);
    //console.log(qsRegex, this.$isogrid.find('.Isogrid__title').text().match(  ) );

    this.$isogrid.isotope({
      filter: function() {
        return qsRegex ? $(this).find('.Isogrid__title').text().match( qsRegex ) : true;
      }
    });


  }, 500),
  craftCheck: function craftCheck(e) {

    var that = this,
      target = e.target,
      checkElem = $(target),
      craft = checkElem.data('craft')
    ;
    // Les ID métiers cochées/sécochées sont stockées dans un array
    // ça servira pour les filtres
    if( checkElem.is(':checked') ) {
      // on ajoute
      this.$craftsList.push( '.craft-' + craft );
    } else {
      // on retire de la liste
      this.$craftsList = _.without(this.$craftsList, '.craft-' + craft);
    }

    this.filterIsotope();
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
      this.$categoriesList.push( '.category-' + category );
    } else {
      // on retire de la liste
      this.$categoriesList = _.without(this.$categoriesList, '.category-' + category);
    }

    this.filterIsotope();
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
