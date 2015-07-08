/**
 * = menu_items_view.js
 */
var View = require('./view'),
  store = require('lib/persistence'),
  connectivity = require('lib/connectivity'),
  a11y = require('lib/a11y')
;

module.exports = View.extend({
  template: require('./templates/menu_items'),
  subscriptions: {
    'filters:reset': 'render'
  },
  events: {
    // backbone fait automatiquement de la délégation d'évènements
    // correspond à $('#places').on('click', 'li', this.selectPlace)
    'click .js-check-letter': function(e) { this.elemCheck(e, 'letter'); },
    'click .js-check-craft': function(e) { this.elemCheck(e, 'craft'); },
    'click .js-check-category': function(e) { this.elemCheck(e, 'category'); },
    'click .js-check-partner': function(e) { this.elemCheck(e, 'partner'); },
    'keyup .js-search': 'searchBox',
    'click .js-craft-button': 'toggleFilterList',
    'click .js-category-button': 'toggleFilterList',
    'click .js-partner-button': 'toggleFilterList',
    'click .js-clear-filters': 'clearFilters'
  },
  getRenderData: function menuItemsGetRenderData() {
    var filters =  store.getFilters(),
      filterCrafts = filters[0].crafts,
      filterCategories = filters[0].categories,
      filterPartners = filters[0].partners
    ;
    return {
      alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      filterCrafts: filterCrafts,
      filterCategories: filterCategories,
      filterPartners: filterPartners
    };
  },
  qsRegex:'',
  buttonFilter:'',
  afterRender: function menuItemsAfterRender() {
    this.fetchFilters();
    this.$isogrid = $('.js-apps-list');
    this.$nothing = $('.js-noresults');

    var that = this;
    // Isotope init (http://isotope.metafizzy.co/)
    // http://codepen.io/desandro/pen/mCdbD
    // http://codepen.io/gpetrioli/pen/yqcvd
    setTimeout(function() {
      // setTimeout : we need a dom repaint !
      that.$isogrid.isotope({
        // options
        itemSelector: '.js-item-selector',
        layoutMode: 'fitRows',
        //containerStyle: null,
        getSortData: {
          name: '.js-sort-title'
        },
        sortBy: 'name',
        hiddenStyle: {
          opacity: 0
        },
        visibleStyle: {
          opacity: 1
        },
        percentPosition: true,

        filter: function() {
          var $this = $(this);
          var searchResult = that.qsRegex ? $this.find('.js-sort-title, .js-baseline').text().match( that.qsRegex ) : true;
          var buttonResult = that.buttonFilter ? $this.is( that.buttonFilter ) : true;
          return searchResult && buttonResult;
        }
      });

      // Lazy load des icones
      that.$isogrid.isotope('on', 'layoutComplete', function () {
          that.loadVisible($imgs, 'lazylazy');
      });
      var $win = $('.Wrapper'),
        $imgs = $(".Isogrid__icon--img")
      ;
      $win.on('scroll', function () {
          that.loadVisible($imgs, 'lazylazy');
      });
      $imgs.lazyload({
          effect: "fadeIn",
          failure_limit: Math.max($imgs.length - 1, 0),
          event: 'lazylazy'
      });


    }, 1);

  },
  loadVisible: function loadVisible($els, trigger) {
      $els.filter(function () {
          var rect = this.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= window.innerHeight;
      }).trigger(trigger);
  },
  $submitter: null,
  $idList: {'craft':[], 'category': [], 'partner': [], 'letter':[]},
  $isogrid: {},
  $nothing: {},
  toggleFilterList : function toggleFilterList(e) {
    var target = e.target,
      buttonElem = ( $(target).is('button') ) ? $(target) : $(target).parents('button'),
      //buttonCheck = buttonElem.find('.js-btn-check'),
      listElem = buttonElem.siblings('.js-filter-list')
    ;
    listElem[ ( listElem.hasClass('is-open') ? 'remove' : 'add' ) + 'Class' ]('is-open');
    a11y.expandService(listElem);
    buttonElem[ ( buttonElem.hasClass('is-check') ? 'remove' : 'add' ) + 'Class' ]('is-check');
  },
  filterIsotope: function filterIsotope() {
    // Ici les filtres choisis sont concatenes et sont envoyes a isotope:filter
    var
      filterValue = ''
    ;

    if( this.$idList.craft.length > 0 ) {
      filterValue += this.$idList.craft.join();
    }
    if( this.$idList.category.length > 0 ) {
      filterValue += this.$idList.category.join();
    }
    if( this.$idList.partner.length > 0 ) {
      filterValue += this.$idList.partner.join();
    }
    if( this.$idList.letter.length > 0 ) {
      filterValue += this.$idList.letter.join();
    }

    this.buttonFilter = filterValue;
    this.$isogrid.isotope();
    if ( !this.$isogrid.data('isotope').filteredItems.length ) {
      // Aucun résultats !
      this.nothingFound('show');
    }
  },
  elemCheck: function listCheck(e, elemName) {
  	this.nothingFound('hide');
  	var that = this,
      target = e.target,
      checkElem = $(target),
      id = (elemName === 'letter') ? target.value : checkElem.data(elemName),
      spanBtnCheck = $('.js-'+elemName+'-button').find('span'),
      labelCheck = checkElem.siblings('label'),
      spanLabelCheck = labelCheck.find('span.js-label-check')
    ;
    //console.log(spanLabelCheck)
    // Les ID cochées/sécochées sont stockées dans un array
    // ça servira pour les filtres
    if( checkElem.is(':checked') ) {
      // on ajoute
      this.$idList[elemName].push( '.' + elemName + '-' + id );
      labelCheck.addClass('is-label-check');
      spanLabelCheck.addClass('is-elem-check');

    } else {
      // on retire de la liste
      this.$idList[elemName] = _.without(this.$idList[elemName], '.' + elemName + '-' + id);
      labelCheck.removeClass('is-label-check');
      spanLabelCheck.removeClass('is-elem-check');
    }
    // la coche bleue globale
    spanBtnCheck[ ((this.$idList[elemName].length > 0) ? 'add' : 'remove') + 'Class' ]('is-list-elem-check');
    // a11y
    a11y.checkService(checkElem);
    //
    this.filterIsotope();
  },
  searchBox: _.debounce(function searchBox(e) {
  	this.nothingFound('hide');
    var target = e.target,
      searchElem = $(target),
      research = searchElem.val()
    ;

    this.qsRegex = new RegExp( research, 'gi' );
    this.$isogrid.isotope();
    if ( !this.$isogrid.data('isotope').filteredItems.length ) {
      // Aucun résultats !
      this.nothingFound('show');
    }
  }, 250),
  clearFilters: function clearFilters() {
    this.qsRegex = '';
    this.$idList = {'craft':[], 'category': [], 'partner': [], 'letter':[]};

    $('.js-craft-button, .js-category-button, .js-partner-button').find('span').removeClass('is-list-elem-check');
    $('.js-search').val('');

    $('.Nav__filters, .Nav__alphabet').find('input[type="checkbox"]').each(function() {
      var elem = $(this),
        labelCheck = elem.siblings('label'),
        spanLabelCheck = labelCheck.find('span.js-label-check')
      ;
      labelCheck.removeClass('is-label-check');
      spanLabelCheck.removeClass('is-elem-check');
      elem.attr('checked', false);
      a11y.checkService(elem);
    });
    this.filterIsotope();
    this.$isogrid.isotope();

  },
  nothingFound: function nothingFound(state) {
    this.$nothing[ (state === 'show') ? 'fadeIn' : 'fadeOut' ]();
  },
  // Chargement initial des filtres
  fetchFilters: function fetchFilters() {
    if(!connectivity.isOnline()) return;

    // on vide la liste
    this.filters = [];
    this.renderFilters();
  },
  renderFilters: function renderFilters() {
    this.$el.find('#filters').html(
      this.getRenderData().filters
    );

  }
});
