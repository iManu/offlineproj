// Contrôleur principal
// ====================

'use strict';

var View = require('./view');
var MenuView = require('./menu_items_view');
var AppsView = require('./apps_view');
var cnxSvc = require('lib/connectivity');
var a11y = require('lib/a11y');

module.exports = View.extend({
  // Les événements app-wide (pub/sub) auxquels on réagit
  subscriptions: {
    'connectivity:online': 'syncMarker',
    'connectivity:offline': 'syncMarker'
  },
  events: {
  	'click .js-burger-btn': 'ariaBurger',
    'click .js-legacy': 'popinLegal',
    'click .js-legacy-close': 'popinLegalClose',
    //'click .Nav__logo': 'easterActions',
    'click .js-modal-close': 'closeModal'
  },
  // Le template principal
  template: require('./templates/home'),

  // Après le rendering complet (initial), on procède aux initialisations
  // de comportements et injections des vues imbriquées
  afterRender: function() {

    this.burgerElem = this.$el.find('.js-burger-menu');
    this.burgerElem.siblings('.js-burger-btn').is(':checked') ? this.burgerElem.attr('aria-expanded', false) : this.burgerElem.attr('aria-expanded', true);
    a11y.expandService(this.burgerElem);

    // On met en cache le marqueur online/offline
    this.syncMarker();

    // On initialise et on render à la volée les deux vues imbriquées
    new MenuView({ el: this.$('#menuUI') }).render();
    new AppsView({ el: this.$('#appsUI') }).render();

    // popin
    this.popinElem = $('.js-popin-legal');
    this.popinButton = $('.js-legacy');
    // easter egg to see actions
    //this.eastClicks = 0;
    /**
     * taggerEngine
     */
    setTimeout(function() {
      $('body').find('[data-tag]').taggerEngine({ clean: true });
    }, 1);

    // orientation
    /*
    function reorient(e) {
      var portrait = (window.orientation % 180 === 0);
      $("body").css("-webkit-transform", !portrait ? "rotate(-90deg)" : "");
    }
    window.onorientationchange = reorient;
    window.setTimeout(reorient, 0);
    */

    // FastClick
    FastClick.attach(document.body);

  },

  // Convention définie par notre classe mère View pour render : on
  // peuple le template principal avec ces données.
  getRenderData: function() {
    return {
      mydata: 'fake',
      otherdata: 'fake'
    };
  },
  closeModal: function closeModal() {
    $('.modal').removeClass('show');
  },
  // juste pour le state aria
  burgerElem: {},
  ariaBurger: function ariaBurger() {
    a11y.expandService(this.burgerElem);
  },
  /*easterActions: function easterActions(e) {
  	this.eastClicks += 1;
  	var that = this,
  			$actions = $('.js-actions');
  	console.log(this.eastClicks);
  	_.delay(function(){
  		if(that.eastClicks === 5) {
  			$actions[ ($actions.css('display') === 'none') ? 'fadeIn' : 'fadeOut' ]();
  		}
  		that.eastClicks = 0;
  	}, 1000);
  },*/
  popinElem: {},
  popinButton: {},
  popinLegal: function popinLegal() {
    var that = this;
    _.defer(function() {
      that.popinElem[ ( !that.popinElem.hasClass('is-popin') ? 'add' : 'remove' ) + 'Class' ]('is-popin');
      that.popinButton[ ( !that.popinButton.hasClass('is-pop') ? 'add' : 'remove' ) + 'Class' ]('is-pop');
      $('body').on('click.popinopen', function() {
        that.popinLegalClose();
      });
    });
  },
  popinLegalClose: function popinLegalClose() {
    _.delay(function() { return null }, 1);
    if(this.popinElem.hasClass('is-popin')) {
      this.popinElem.removeClass('is-popin');
      this.popinButton.removeClass('is-pop');
      $('body').off('click.popinopen');
    }
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
