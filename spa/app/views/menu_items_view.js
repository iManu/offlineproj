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
    //'submit': 'checkIn'
    'click .js-check-letter': function(e) { this.elemCheck(e, 'letter') },
    'click .js-check-craft': function(e) { this.elemCheck(e, 'craft') },
    'click .js-check-category': function(e) { this.elemCheck(e, 'category') },
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
  afterRender: function menuItemsAfterRender() {
    this.fetchFilters();
    this.$isogrid = $('.Isogrid');
  },
  $submitter: null,
  $idList: {'craft':[], 'category': [], 'action':[], 'letter':[]},
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


    if( this.$idList.craft.length > 0 ) {
      filterValue += this.$idList.craft.join();
    }
    if( this.$idList.category.length > 0 ) {
      filterValue += this.$idList.category.join();
    }
    if( this.$idList.letter.length > 0 ) {
      filterValue += this.$idList.letter.join();
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
        return qsRegex ? $(this).find('.js-sort-title').text().match( qsRegex ) : true;
      }
    });
  }, 250),
  elemCheck: function listCheck(e, elemName) {
  	var that = this,
      target = e.target,
      checkElem = $(target),
      id = (elemName === 'letter') ? target.value : checkElem.data(elemName)
    ;
    // Les ID cochées/sécochées sont stockées dans un array
    // ça servira pour les filtres
    if( checkElem.is(':checked') ) {
      // on ajoute
      this.$idList[elemName].push( '.' + elemName + '-' + id );
    } else {
      // on retire de la liste
      this.$idList[elemName] = _.without(this.$idList[elemName], '.' + elemName + '-' + id);
    }
    this.filterIsotope();
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
