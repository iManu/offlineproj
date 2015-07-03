// Contrôleur zone des items applications
// ======================================

'use strict';

var View = require('./view');
var store = require('lib/persistence');
var cnxSvc = require('lib/connectivity');

module.exports = View.extend({
  // Le template principal
  template: require('./templates/apps'),
  // Le template interne pour la liste et ses éléments
  listTemplate: require('./templates/apps_list'),
  detailTemplate: require('./templates/apps_details'),
  // Les événements app-wide (pub/sub) auxquels on réagit
  subscriptions: {
    'appslist:reset': 'render',
    'connectivity:online': 'syncMarker',
    'connectivity:offline': 'syncMarker'
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
    var appList = this.listTemplate(store.getAppsList());
    var appDetails = this.detailTemplate(store.getAppsList());

    return {
      appsList: appList,
      appsDetails: appDetails
    };
  },
  afterRender: function appsAfterRender() {


    this.bodyEl = $('.Wrapper');
    this.docElem = $('.Wrapper');
    this.support = { transitions: Modernizr.csstransitions };
    this.transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' };
    this.transEndEventName = this.transEndEventNames[ Modernizr.prefixed( 'transition' ) ];

    this.gridItemsContainer = $('.js-apps-list');
    this.contentItemsContainer = $('.js-app-detail');
    this.gridItems = this.gridItemsContainer.find('.js-item-selector');
    this.contentItems = this.contentItemsContainer.find('.content__item');
    this.closeCtrl = this.contentItemsContainer.find('.close-button');
    this.currentItem = -1;
    this.lockScroll = false, this.xscroll, this.yscroll;
    this.isAnimating = false;

    this.initEvents();
    this.syncMarker();
  },
  syncMarker: function() {
    this._onlineMarker = this._onlineMarker || this.$('#onlineMarker2');
    if(cnxSvc.isOnline()) {
      this._onlineMarker.find('.js-on').addClass('is-lighten');
      this._onlineMarker.find('.js-off').removeClass('is-lighten');
    } else {
      this._onlineMarker.find('.js-off').addClass('is-lighten');
      this._onlineMarker.find('.js-on').removeClass('is-lighten');
    }
  },
  onEndTransition: function onEndTransition( el, callback ) {
    var that = this;
    var onEndCallbackFn = function( ev ) {
      if( that.support.transitions ) {
        if( ev.target != this ) return;
        $(this).off( that.transEndEventName, onEndCallbackFn );
      }
      if( callback && typeof callback === 'function' ) { callback.call(this); }
    };
    if( that.support.transitions ) {
      el.on( that.transEndEventName, onEndCallbackFn );
    }
    else {
      onEndCallbackFn();
    }

  },
  getViewport: function getViewport( axis ) {
    var client, inner;
    if( axis === 'x' ) {
      client = this.docElem.outerWidth();
      inner = window['innerWidth'];
    }
    else if( axis === 'y' ) {
      client = this.docElem.outerHeight();
      inner = window['innerHeight'];
    }

    return client < inner ? inner : client;
  },
  scrollX: function scrollX() { return this.docElem.scrollLeft(); },
  scrollY: function scrollY() { return this.docElem.scrollTop(); },

  initEvents: function initEvents() {
    var that = this;
    _.forEach(that.gridItems, function(item, pos) {
      // grid item click event
      var $item = $(item);

      $item.find('.js-btn-plus').on('click', function(ev) {
        ev.preventDefault();
        if(that.isAnimating || that.currentItem === pos) {
          return false;
        }
        /*that.contentItemsContainer = $item.find('.js-app-detail');
        that.contentItems = that.contentItemsContainer.find('.content__item');
        that.closeCtrl = that.contentItemsContainer.find('.close-button');*/

        that.isAnimating = true;
        // index of current item
        that.currentItem = pos;
        // simulate loading time..
        $item.addClass('grid__item--loading');
        setTimeout(function() {
          $item.addClass('grid__item--animate');
          // reveal/load content after the last element animates out (todo: wait for the last transition to finish)
          setTimeout(function() { that.loadContent($item); }, 20);
        }, 100);
      });
    });

    that.closeCtrl.on('click', function() {
      // hide content
      that.hideContent();
    });

    // keyboard esc - hide content
    $(document).on('keydown', function(ev) {
      if(!that.isAnimating && that.currentItem !== -1) {
        var keyCode = ev.keyCode || ev.which;
        if( keyCode === 27 ) {
          ev.preventDefault();
          if ("activeElement" in document)
              document.activeElement.blur();
          that.hideContent();
        }
      }
    } );

  },

  loadContent: function loadContent(item) {
    var that = this;
    // add expanding element/placeholder
    var dummy = document.createElement('div');
    dummy.className = 'placeholder';
    var $dummy = $(dummy);

    // set the width/heigth and position
    //

    $dummy.css('WebkitTransform', 'translate3d(' + (item.offset().left - 265) + 'px, ' + (item.offset().top + 371) + 'px, 0px) scale3d(' + item.outerWidth()/that.gridItemsContainer.outerWidth() + ',' + item.outerHeight()/that.getViewport('y') + ',1)');
    $dummy.css('transform', 'translate3d(' + (item.offset().left - 265) + 'px, ' + (item.offset().top + 371) + 'px, 0px) scale3d(' + item.outerWidth()/that.gridItemsContainer.outerWidth() + ',' + item.outerHeight()/that.getViewport('y') + ',1)');
/*

    $dummy.css('WebkitTransform', 'translate3d(' + item.css('left') + ', ' + item.css('top') + ', 0px) scale3d(' + item.outerWidth()/that.gridItemsContainer.outerWidth() + ',' + item.outerHeight()/that.getViewport('y') + ',1)');
    $dummy.css('transform', 'translate3d(' + item.css('left') + ', ' + item.css('top') + ', 0px) scale3d(' + item.outerWidth()/that.gridItemsContainer.outerWidth() + ',' + item.outerHeight()/that.getViewport('y') + ',1)');
 */

    // add transition class
    $dummy.addClass('placeholder--trans-in');

    // insert it after all the grid items
    that.gridItemsContainer.parent('.Content').append(dummy);

    // body overlay

    that.bodyEl.addClass('view-single');

    setTimeout(function() {
      // expands the placeholder
      $dummy.css('WebkitTransform', 'translate3d(-5px, ' + (that.scrollY() - 5) + 'px, 0px)');
      $dummy.css('transform', 'translate3d(-5px, ' + (that.scrollY() - 5) + 'px, 0px)');
      // disallow scroll
      //$(window).on('scroll', that.noscroll);
    }, 5);

    that.onEndTransition($dummy, function() {
      /*that.bodyEl.animate({
        scrollTop: 0
      }, 0);*/
      // add transition class
      $dummy.removeClass('placeholder--trans-in');
      $dummy.addClass('placeholder--trans-out');
      // position the content container

      that.contentItemsContainer.css('top', that.scrollY() + 'px');
      // show the main content container
      that.contentItemsContainer.addClass('content--show');
      // show content item:
      //that.contentItems[that.currentItem].addClass('content__item--show');
      //
      //console.log(that.contentItems[that.currentItem])
      //
      $(that.contentItems[that.currentItem]).addClass('content__item--show');
      // show close control
      that.closeCtrl.addClass('close-button--show');
      // sets overflow hidden to the body and allows the switch to the content scroll
      that.bodyEl.addClass('noscroll');

      that.isAnimating = false;

      // init carousel
      if(cnxSvc.isOnline()) {
        that.contentItems.find('.app-carousel').slick({
          dots: false,
          arrows: true,
          infinite: true,
          adaptiveHeight: true,
          centerMode: true,
          variableWidth: true,
          speed: 300,
          slidesToShow: 3,
          slidesToScroll: 2,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 2,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
          ]
        });
      }

    });

  },

  hideContent: function hideContent() {
    var that = this;
    var gridItem = $(that.gridItems[that.currentItem]),
        contentItem = $(that.contentItems[that.currentItem]);

    $(contentItem).removeClass('content__item--show');
    that.contentItemsContainer.removeClass('content--show');
    that.closeCtrl.removeClass('close-button--show');
    that.bodyEl.removeClass('view-single');

    setTimeout(function() {
      var dummy = that.gridItemsContainer.parent('.Content').find('.placeholder');

      that.bodyEl.removeClass('noscroll');

      dummy.css('WebkitTransform', 'translate3d(' + gridItem.offset().left + 'px, ' + gridItem.offset().top + 'px, 0px) scale3d(' + gridItem.outerWidth()/that.gridItemsContainer.outerWidth() + ',' + gridItem.outerHeight()/that.getViewport('y') + ',1)');
      dummy.css('transform', 'translate3d(' + gridItem.offset().left + 'px, ' + gridItem.offset().top + 'px, 0px) scale3d(' + gridItem.outerWidth()/that.gridItemsContainer.outerWidth() + ',' + gridItem.outerHeight()/that.getViewport('y') + ',1)');

      //that.onEndTransition(dummy, function(e) { console.log('close dummy');
        // reset content scroll..
        //contentItem.parentNode.scrollTop = 0;

        that.gridItemsContainer.parent('.Content').find('.placeholder').remove();
        //$('.placeholder')
        gridItem.removeClass('grid__item--loading');
        gridItem.removeClass('grid__item--animate');
        that.lockScroll = false;
        $(window).off( 'scroll', that.noscroll );
      //});

      // reset current
      that.currentItem = -1;

      that.contentItemsContainer.find('.scroll-wrap').animate({
      	scrollTop: 0
      });

    }, 5);
  },

  noscroll: function noscroll() {
    var that = this;
    if(!that.lockScroll) {
      that.lockScroll = true;
      that.xscroll = that.scrollX();
      that.yscroll = that.scrollY();
    }
    window.scrollTo(that.xscroll, that.yscroll);
  }

});
