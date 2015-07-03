(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("application", function(exports, require, module) {
// Singleton de l'application
// ==========================

'use strict';

// S'assurer que la détection de modif AppCache s'exécute
require('lib/appcache');

// L'appli principale.  Reste super basique à ce stade : on a un seul
// écran donc pas de routes spéciales pour plein de trucs, et on
// connecte juste la racine à la Home View.
var Application = {
  initialize: function() {
    var HomeView = require('views/home_view');
    var Router = require('lib/router');

    this.homeView = new HomeView();
    this.router = new Router();

    /*this.isStandalone = false;
    if (window.navigator.standalone) {
      // The app is running in standalone mode. (webapp)
      this.isStandalone = true;
    }
    console.log('is Standalone: ', this.isStandalone);*/

    if ('function' === typeof Object.freeze)
      Object.freeze(this);
  }
};

module.exports = Application;


});

require.register("initialize", function(exports, require, module) {
// Point d'entrée de l'appli
// =========================

'use strict';

// L'initialiseur applicatif.  Se contente de faire deux choses :
//
// 1. Instancier l'application JS et l'initialiser
// 2. Activer la gestion des routes Backbone (même si on ne s'en
//    sert pas particulièrement ici)

var application = require('application');

$(function() {
  moment.lang('fr');
  application.initialize();
  Backbone.history.start();
});

});

require.register("lib/a11y", function(exports, require, module) {
// a11y
// http://www.w3.org/TR/wai-aria/states_and_properties
// 1. States
// 	- Widget
// 	- Live
// 	- Drag & Drop
// 2. Properties
// ========================

'use strict';


/**
 * States
 */

// widget
exports.checkService = function checkService(elem) {
	return elem.is(':checked') ? elem.attr('aria-checked', true) : elem.attr('aria-checked', false);
};
exports.disableService = function disableService(elem) {
	return elem;
};
exports.expandService = function expandService(elem) {
	return elem.attr('aria-expanded') === 'false' ? elem.attr('aria-expanded', true) : elem.attr('aria-expanded', false);
};
exports.hideService = function hideService(elem) {
	return elem;
};
exports.invalidService = function invalidService(elem) {
	return elem;
};
exports.pressService = function pressService(elem) {
	return elem;
};
exports.selectService = function selectService(elem) {
	return elem;
};

// live
exports.busService = function busService(elem) {
	return elem;
};

// Drag and Drop
exports.grabService = function grabService(elem) {
	return elem;
};

/**
 * Properties
 */

exports.popService = function popService(elem) {
	return elem;
};

});

require.register("lib/appcache", function(exports, require, module) {
// Appcache
// ========================

'use strict';

if('applicationCache' in window) {
  window.applicationCache.addEventListener('updateready', function () {
    //alert('Rafraichir S.V.P.');
    $('#reloadPrompt').modal({show:true});

  });
  // si la page n'est jamais rechargé, ce qui peut arriver en SPA
  setInterval(applicationCache.update, 100000000000000);
}

});

;require.register("lib/connectivity", function(exports, require, module) {
// Connectivity
// ========================

'use strict';

// par defaut OK, on Fake la fonction
exports.isOnline = function() { return true; };
// si la propriété existe, on renvoi la bonne value
if ('onLine' in navigator) {
  exports.isOnline = function() {
    return navigator.onLine;
  };
  $(window).on('online offline', checkStatus);
  checkStatus();
}

function checkStatus () {
  Backbone.Mediator.publish( navigator.onLine ? 'connectivity:online':'connectivity:offline' );
}

});

;require.register("lib/persistence", function(exports, require, module) {
// Couche de persistence
// =====================

'use strict';

// Ce module encapsule toute la couche de persistence pour
// le reste de l'appli.  Il gère aussi bien les collections et
// modèles Backbone en RAM (limités au temps de vie de la page)
// que la couche de stockage côté client (ici limitée à `localStorage`)
// et sa synchronisation avec le serveur (Ajax pour le moment).

// On importe les modèles pour surcharger sa fonction d'I/O serveur…

// On a évidemment besoin de la collection pour l'instancier
var FiltersCollection = require('models/filters_collection');
var AppsListCollection = require('models/apps_collection');

// …et on est *très* sensibles à la connectivité, pour déterminer
// quand mettre en attente les synchros et quand réconcilier avec
// la couche serveur.
var cnxSvc = require('lib/connectivity');

// Instantiations de la collection Backbone et du datastore
// persistent côté client.
var filters_collection = new FiltersCollection();
var apps_collection = new AppsListCollection();

var localStore_apps = new Lawnchair({ name: 'appslist' }, $.noop);
var localStore_filters = new Lawnchair({ name: 'filters' }, $.noop);

// popule localstore
filters_collection.fetch({ reset: true });
apps_collection.fetch({ reset: true });

// Les 2 fonctions exposées par l'API : renvoie la collection de apps
// et la collection des filtres
function getAppsList() {
  var filters = filters_collection.toJSON(),
      filterActions = filters[0].actions,
      apps = apps_collection.toJSON()
  ;
  _.each(apps, function(element, index, list) {
      element.action = _.map(element.action, function(idAction, indexAction) {
        return _.findWhere(filterActions, {id: idAction});
      });
  });

  return apps;
}
function getFilters() {
  return filters_collection.toJSON();
}
/*
function addPartner(partner) {
  localStore_apps.save(partner);
}
*/
// Cette fonction interne est appelée au chargement pour initialiser
// les collections Backbone.
function initialLoad() {
  localStore_apps.all(function(appslist) {
    apps_collection.reset(appslist);
  });
  localStore_filters.all(function(filters) {
    filters_collection.reset(filters);
  });
}

// Gestionnaires d'événements (collection et app-wide) afin
// d'assurer la synchro client/serveur.

// La collection reset : On remplace le datastore client persistent
// et on publie un événement app-wide adapté pour que la vue d'historique
// se rafraîchisse complètement.
apps_collection.on('reset', function() {
  localStore_apps.nuke(function() {
    localStore_apps.batch(apps_collection.toJSON());
  });
  Backbone.Mediator.publish('appslist:reset');
});

filters_collection.on('reset', function() {
  localStore_filters.nuke(function() {
    localStore_filters.batch(filters_collection.toJSON());
  });
  Backbone.Mediator.publish('filters:reset');
});

// Initialisation au chargement
initialLoad();

// Deux fonctions seulement publiées
module.exports = {
  //addPartner: addPartner,
  getAppsList: getAppsList,
  getFilters: getFilters
};

});

require.register("lib/router", function(exports, require, module) {
// Router
// ========================

'use strict';

// Le routeur le plus basique du monde…

var application = require('application');

module.exports = Backbone.Router.extend({
  routes: {
    '': 'home'
  },

  home: function() {
    $('body').html( application.homeView.render().el );
  }
});

});

require.register("lib/view_helper", function(exports, require, module) {
// Helpers pour les vues
// =====================

'use strict';

/* global Handlebars */

// Ce module est un emplacement dédié pour tous nos helpers Handlebars.

// helper pour obtenir la première lettre du nom de l'application
// sera utile pour le filtre alphabet
Handlebars.registerHelper('first_letter', function(title) {
  return title.charAt(0).toLowerCase();
});


});

require.register("models/apps_collection", function(exports, require, module) {

// Collection : Apps-list
// ======================

'use strict';

// Définition de la collection qu'on va employer (collection
// Backbone de apps-list).  On exploite ici plusieurs aspects
// pratiques des collections Backbone.


module.exports = Backbone.Collection.extend({
  // Définition du modèle à exploiter lors d'ajouts, fetches, etc.
  // Du coup, on peut passer juste des hashes d'attributs, ça
  // convertit tout seul.
  model: require('models/apps_list'),
  url: 'apps_db.json',
  parse: function (response) {
    return response;
  }

});


});

require.register("models/apps_list", function(exports, require, module) {
// Modèle : Apps
// ================

'use strict';

// Bon, on n'a *rien* à rajouter aux capacités inhérentes
// de Backbone.Model, mais c'est toujours mieux de prévoir un
// module par modèle et par collection, donc voilà.

module.exports = Backbone.Model.extend({
});

});

require.register("models/filters_collection", function(exports, require, module) {

// Collection : Filters
// ======================

'use strict';

// Définition de la collection qu'on va employer (collection
// Backbone de filters).  On exploite ici plusieurs aspects
// pratiques des collections Backbone.


module.exports = Backbone.Collection.extend({
  // Définition du modèle à exploiter lors d'ajouts, fetches, etc.
  // Du coup, on peut passer juste des hashes d'attributs, ça
  // convertit tout seul.
  model: require('models/filters_list'),
  url: 'filters_db.json',
  parse: function (response) {
    return response;
  }
});


});

require.register("models/filters_list", function(exports, require, module) {
// Modèle : Filters
// ================

'use strict';

// Bon, on n'a *rien* à rajouter aux capacités inhérentes
// de Backbone.Model, mais c'est toujours mieux de prévoir un
// module par modèle et par collection, donc voilà.

module.exports = Backbone.Model.extend({
});

});

require.register("views/apps_view", function(exports, require, module) {
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




    });
    // init carousel
    that.contentItems.find('.app-carousel-app001').slick({
      dots: false,
      arrows: true,
      infinite: true,
      adaptiveHeight: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
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

});

require.register("views/home_view", function(exports, require, module) {
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
    'click .js-legacy-close': 'popinLegalClose'
  },
  // Le template principal
  template: require('./templates/home'),

  // Après le rendering complet (initial), on procède aux initialisations
  // de comportements et injections des vues imbriquées
  afterRender: function() {

 		this.burgerElem = this.$el.find('.js-burger-menu');
  	this.burgerElem.siblings('.js-burger-btn').is(':checked')
  		? this.burgerElem.attr('aria-expanded', false) : this.burgerElem.attr('aria-expanded', true);
  	a11y.expandService(this.burgerElem);

    // On met en cache le marqueur online/offline
    this.syncMarker();

    // On initialise et on render à la volée les deux vues imbriquées
    new MenuView({ el: this.$('#menuUI') }).render();
    new AppsView({ el: this.$('#appsUI') }).render();

    // popin
    this.popinElem = $('.js-popin-legal');
  },

  // Convention définie par notre classe mère View pour render : on
  // peuple le template principal avec ces données.
  getRenderData: function() {
    return {
      mydata: 'fake',
      otherdata: 'fake'
    };
  },
  // juste pour le state aria
  burgerElem: {},
  ariaBurger: function ariaBurger() {
  	a11y.expandService(this.burgerElem);
    // on referme la popin si elle est ouverte
    if( this.popinElem.hasClass('is-popin') ) {
      this.popinLegalClose();
    }
  },
  popinElem: {},
  popinLegal: function popinLegal() {
    this.popinElem[ ( !this.popinElem.hasClass('is-popin') ? 'add' : 'remove' ) + 'Class' ]('is-popin');
  },
  popinLegalClose: function popinLegalClose() {
    this.popinElem.removeClass('is-popin');
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

});

require.register("views/menu_items_view", function(exports, require, module) {
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
      filterPartners = filters[0].partners/*,
      filterActions = filters[0].actions*/
    ;
    return {
      alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      filterCrafts: filterCrafts,
      filterCategories: filterCategories,
      filterPartners: filterPartners/*,
      filterActions: filterActions*/
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
          var searchResult = that.qsRegex ? $this.find('.js-sort-title, .js-actions').text().match( that.qsRegex ) : true;
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
  $idList: {'craft':[], 'category': [], 'partner': [], 'action':[], 'letter':[]},
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
    this.$idList = {'craft':[], 'category': [], 'partner': [], 'action':[], 'letter':[]};

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

});

require.register("views/templates/apps", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function";


  buffer += "<ul id=\"apps\" class=\"Isogrid js-apps-list\" role=\"list\">";
  if (helper = helpers.appsList) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.appsList); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</ul>\n<div id=\"appsDetails\">";
  if (helper = helpers.appsDetails) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.appsDetails); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/apps_details", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n      <article class=\"content__item\">\n        <div class=\"article-top\">\n          <div class=\"article-pictos\">\n            ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.pictos)),stack1 == null || stack1 === false ? stack1 : stack1.gcn), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.pictos)),stack1 == null || stack1 === false ? stack1 : stack1.smb), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </div>\n          <div class=\"article-left\">\n            <img src=\"";
  if (helper = helpers.folder) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.folder); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/";
  if (helper = helpers.icon) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.icon); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"article-icon\" alt=\"\">\n          </div><!--\n          --><div class=\"article-right\">\n            <h2 class=\"article-title\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n            <p class=\"article-desc\">";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n            <a href=\"";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"article-link\">Télécharger l'application</a>\n          </div>\n        </div>\n        <div class=\"article-carousel\">\n          <div class=\"app-carousel-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.visuals), {hash:{},inverse:self.noop,fn:self.programWithDepth(6, program6, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </div>\n        </div>\n      </article>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "\n              <img src=\"images/gcn.png\" width=\"35\" height=\"8\" class=\"pictopts\" alt=\"GCN\">\n            ";
  }

function program4(depth0,data) {
  
  
  return "\n              <img src=\"images/smb.png\" width=\"35\" height=\"8\" class=\"pictopts\" alt=\"SMB\">\n            ";
  }

function program6(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n            <div>\n              <img src=\""
    + escapeExpression(((stack1 = (depth1 && depth1.folder)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" class=\"carousel-img\" alt=\"\">\n            </div>\n            ";
  return buffer;
  }

  buffer += "\n<div class=\"Isogrid__detail js-app-detail\">\n  <div class=\"scroll-wrap\">\n  	<h2 class=\"Wrapper__title\"><span>Solutions</span><span>Métiers</span><span>Mobilité</span></h2>\n  	<div id=\"onlineMarker2\" class=\"Wrapper__onoff Wrapper__onoff--two\">\n	   <span class=\"Wrapper__onoff--on js-on\">Online</span>\n	   <span class=\"Wrapper__onoff--off js-off\">Offline</span>\n	  </div>\n    <div class=\"Wrapper__article\">\n    ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n  </div>\n  <button class=\"close-button\"><img src=\"images/gfx/arrow_back.png\" alt=\"<\"><span>Retour</span></button>\n</div>\n";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/apps_list", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n<li class=\"Isogrid__item js-item-selector";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.craft), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = helpers.each.call(depth0, (depth0 && depth0.category), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.partner)),stack1 == null || stack1 === false ? stack1 : stack1.id), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " letter-"
    + escapeExpression((helper = helpers.first_letter || (depth0 && depth0.first_letter),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.title), options) : helperMissing.call(depth0, "first_letter", (depth0 && depth0.title), options)))
    + "\">\n  <div class=\"Isogrid__header\">\n    <div class=\"Isogrid__header--left\">\n      <img class=\"Isogrid__icon--img\" src=\"images/grey.gif\" data-original=\"";
  if (helper = helpers.folder) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.folder); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/";
  if (helper = helpers.icon) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.icon); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\">\n    </div><!--\n    --><div class=\"Isogrid__header--right\">\n\n      <h2 title=\"";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"Isogrid__title js-sort-title\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n      <h3 class=\"Isogrid__subtitle\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.partner)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h3>\n    </div>\n  </div>\n  <div class=\"Isogrid__resume\">\n    <p class=\"Isogrid__baseline\">";
  if (helper = helpers.baseline) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.baseline); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n    <div class=\"Isogrid__actions js-actions\">";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.action), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n    <div class=\"Isogrid__footer\">\n      <div class=\"Isogrid__footer--left\">\n        <button class=\"Isogrid__btnplus js-btn-plus\">\n          En savoir <span>+</span>\n        </button>\n      </div><!--\n      --><div class=\"Isogrid__footer--right\">\n        ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.pictos)),stack1 == null || stack1 === false ? stack1 : stack1.gcn), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.pictos)),stack1 == null || stack1 === false ? stack1 : stack1.smb), {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n    </div>\n  </div>\n</li>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "";
  buffer += " craft-"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0));
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "";
  buffer += " category-"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0));
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " partner-"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.partner)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " "
    + escapeExpression(((stack1 = (depth0 && depth0.item)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  return buffer;
  }

function program10(depth0,data) {
  
  
  return "\n          <img src=\"images/gcn.png\" width=\"35\" height=\"8\" class=\"pictopts\" alt=\"GCN\">\n        ";
  }

function program12(depth0,data) {
  
  
  return "\n          <img src=\"images/smb.png\" width=\"35\" height=\"8\" class=\"pictopts\" alt=\"SMB\">\n        ";
  }

  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/home", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<nav id=\"menuUI\" class=\"Nav js-burger-menu\" aria-expanded=\"true\" role=\"navigation\"></nav>\n<input type=\"checkbox\" id=\"nav-trigger\" class=\"nav-trigger js-burger-btn\" checked=\"checked\" />\n<label for=\"nav-trigger\" aria-controls=\"menuUI\"></label>\n<div class=\"Wrapper\" role=\"main\">\n  <h1 class=\"Wrapper__title\"><span>Solutions</span><span>Métiers</span><span>Mobilité</span></h1>\n	<div id=\"onlineMarker\" class=\"Wrapper__onoff\">\n   <span class=\"Wrapper__onoff--on js-on\">Online</span>\n   <span class=\"Wrapper__onoff--off js-off\">Offline</span>\n  </div>\n	<div id=\"appsUI\" class=\"Content\"></div>\n  <div class=\"Content Content__nothing js-noresults\" style=\"display:none\">\n    <p class=\"Content__nothing--p\">\n      Aucune application ne correspond\n      <br>\n      aux filtres sélectionnés.\n    </p>\n  </div>\n\n	<div class=\"modal fade\" id=\"reloadPrompt\" style=\"display:none\" role=\"alertdialog\">\n		<div class=\"modal-dialog\">\n			<div class=\"modal-content\">\n				<div class=\"modal-header\">\n					<button class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n					<h4 class=\"modal-title\">Nouvelle version disponible !</h4>\n				</div>\n				<div class=\"modal-body\">\n					<p>Une nouvelle version de cette application est disponible.</p>\n					<p>Souhaitez-vous la charger dès maintenant ?</p>\n				</div>\n				<div class=\"modal-footer\">\n					<a href=\"\" class=\"btn btn-primary\">Mais carrément !</a>\n					<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">pas la peine</button>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n<div class=\"Footer__popin Popin js-popin-legal\">\n  <div class=\"Popin__close\">\n    <button class=\"Popin__btn js-legacy-close\"><img src=\"images/gfx/close.png\" alt=\"Fermer\"></button>\n  </div>\n  <h2 class=\"Popin__title\">\n    Infos légales\n  </h2>\n  <p class=\"Popin__text\">\n    <strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</strong> Dolores perspiciatis soluta illo consectetur harum, ratione id accusamus impedit nulla! Eius nam delectus iste id voluptas repellendus dignissimos architecto iure dolores!\n  </p>\n</div>\n\n\n";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/menu_items", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <li class=\"Filters__item\" role=\"list-item\">\n            <input type=\"checkbox\" id=\"craft-"
    + escapeExpression(((stack1 = (depth0 && depth0.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"Filters__input js-check-craft\" data-craft=\""
    + escapeExpression(((stack1 = (depth0 && depth0.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" aria-checked=\"false\">\n            <label for=\"craft-"
    + escapeExpression(((stack1 = (depth0 && depth0.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"Filters__label\">\n              <div class=\"Filters__label--content\">\n                <span class=\"Filters__label--text\">"
    + escapeExpression(((stack1 = (depth0 && depth0.item)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span><span class=\"Filters__label--check js-label-check\"><img src=\"images/gfx/check.png\" alt=\"check\"></span>\n              </div>\n            </label>\n          </li>\n        ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <li class=\"Filters__item\" role=\"list-item\">\n            <input type=\"checkbox\" id=\"category-"
    + escapeExpression(((stack1 = (depth0 && depth0.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"Filters__input js-check-category\" data-category=\""
    + escapeExpression(((stack1 = (depth0 && depth0.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" aria-checked=\"false\">\n            <label for=\"category-"
    + escapeExpression(((stack1 = (depth0 && depth0.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"Filters__label\">\n              <div class=\"Filters__label--content\">\n                <span class=\"Filters__label--text\">"
    + escapeExpression(((stack1 = (depth0 && depth0.item)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span><span class=\"Filters__label--check js-label-check\"><img src=\"images/gfx/check.png\" alt=\"check\"></span>\n              </div>\n            </label>\n          </li>\n        ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <li class=\"Filters__item\" role=\"list-item\">\n            <input type=\"checkbox\" id=\"partner-"
    + escapeExpression(((stack1 = (depth0 && depth0.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"Filters__input js-check-partner\" data-partner=\""
    + escapeExpression(((stack1 = (depth0 && depth0.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" aria-checked=\"false\">\n            <label for=\"partner-"
    + escapeExpression(((stack1 = (depth0 && depth0.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"Filters__label\">\n              <div class=\"Filters__label--content\">\n                <span class=\"Filters__label--text\">"
    + escapeExpression(((stack1 = (depth0 && depth0.item)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span><span class=\"Filters__label--check js-label-check\"><img src=\"images/gfx/check.png\" alt=\"check\"></span>\n              </div>\n            </label>\n          </li>\n        ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "";
  buffer += "\n    <li class=\"Alphabet__item\" role=\"list-item\">\n      <input type=\"checkbox\" id=\"alpha-"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" class=\"Alphabet__check js-check-letter\" role=\"checkbox\" aria-checked=\"false\">\n      <label for=\"alpha-"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" class=\"Alphabet__label\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</label>\n    </li>\n    ";
  return buffer;
  }

  buffer += "<div class=\"Nav__left\">\n  <div class=\"Nav__logo\"><img src=\"images/logo_samsungb2b.png\" alt=\"Samsung Business\"></div>\n  <ul class=\"Nav__filters\" role=\"list\">\n    <li class=\"Filters\" role=\"list-item\">\n      <button class=\"Filters__button js-craft-button\" aria-controls=\"aria-filter-crafts\" role=\"button\">\n        <span>Nos Métiers</span><span class=\"Filters__button--check\"><img src=\"images/gfx/check.png\" alt=\"check\"></span>\n      </button>\n      <ul id=\"aria-filter-crafts\" aria-expanded=\"false\" class=\"Filters__list Filters__list--crafts js-filter-list\" role=\"list\">\n        ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.filterCrafts), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </ul>\n    </li>\n    <li class=\"Filters\" role=\"list-item\">\n      <button class=\"Filters__button js-category-button\" aria-controls=\"aria-filter-categories\" role=\"button\">\n        <span>Catégories</span><span class=\"Filters__button--check\"><img src=\"images/gfx/check.png\" alt=\"\"></span>\n      </button>\n      <ul id=\"aria-filter-categories\" aria-expanded=\"false\" class=\"Filters__list Filters__list--category js-filter-list\" role=\"list\">\n        ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.filterCategories), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </ul>\n    </li>\n    <li class=\"Filters\" role=\"list-item\">\n      <button class=\"Filters__button js-partner-button\" aria-controls=\"aria-filter-partners\" role=\"button\">\n        <span>Partenaires</span><span class=\"Filters__button--check\"><img src=\"images/gfx/check.png\" alt=\"\"></span>\n      </button>\n      <ul id=\"aria-filter-partners\" aria-expanded=\"false\" class=\"Filters__list Filters__list--partner js-filter-list\" role=\"list\">\n        ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.filterPartners), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </ul>\n    </li>\n    <li class=\"Filters Filters__li-search\" role=\"list-item\">\n      <input type=\"search\" placeholder=\"Rechercher\" role=\"search\" value=\"\" class=\"Filters__search js-search\">\n    </li>\n    <li class=\"Filters__li-clear\" role=\"list-item\">\n      <button class=\"Filters__clear js-clear-filters\" role=\"button\">\n        Effacer les filtres\n      </button>\n    </li>\n  </ul>\n  <footer class=\"Footer\" role=\"contentinfo\">\n	 <ul class=\"Footer__list\">\n    <li class=\"Footer__item\">\n      <button class=\"Footer__button js-legacy\">Infos légales</button>\n    </li>\n    <li class=\"Footer__item\">\n      Tous droits réservés\n    </li>\n   </ul>\n  </footer>\n</div><!--\n--><div class=\"Nav__right\">\n  <ul class=\"Nav__alphabet Alphabet\" role=\"list\">\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.alphabet), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n</div>\n";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/view", function(exports, require, module) {
// Classe de contrôleur étendu
// ===========================

'use strict';

require('lib/view_helper');

// Classe de base pour toutes les vues.  Presque pile
// celle de brunch.io (on a juste ajouté le _.defer pour
// régler automatiquement toute une catégorie de bugs,
// et initialisé la langue de Moment.js).
module.exports = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'template', 'getRenderData', 'render', 'afterRender');
  },

  template: function() {},
  getRenderData: function() {},

  render: function() {
    this.$el.html(this.template(this.getRenderData()));
    _.defer(this.afterRender);
    return this;
  },

  afterRender: function() {}
});

});


//# sourceMappingURL=app.js.map