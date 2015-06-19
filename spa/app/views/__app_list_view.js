/**
 * = app_list_view.js
 */
var View = require('./view'),
  //locSvc = require('lib/location'),
  //poiSvc = require('lib/places'),
  //notifications = require('lib/notifications'),
  //store = require('lib/persistence'),
  connectivity = require('lib/connectivity');

module.exports = View.extend({
  template: require('./templates/app_list'),
  listTemplate: require('./templates/captions'),
  // convention backbone pour catcher les events :
  // equivalent jq : $('header button').on('click', this.fetchPlaces)
  /*events: {
    'click header button': 'fetchApps',
    // backbone fait automatiquement de la délégation d'évènements
    // correspond à $('#places').on('click', 'li', this.selectPlace)
    'click #places li': 'selectPlace',
    'submit': 'checkIn'
  },*/
  getRenderData: function appListGetRenderData() {
    return {
      appList: this.listTemplate({
        apps: this.apps
      })
    };
  },
  afterRender: function appListAfterRender() {
    this.fetchApps();
  },
  $submitter: null,
  $currentApp: null,
  $comment: null,
  // Chargement initial des apps
  fetchApps: function fetchApps() {
    if(!connectivity.isOnline()) return;

    // on vide la liste
    this.apps = [];
    this.renderApps();

    //var that = this;
    /*locSvc.getCurrentLocation(function(lt, lg) {
      that.$el.find('#geoloc').text(lt.toFixed(5) + ' ' + lg.toFixed(5));
      poiSvc.lookupPlaces(lt, lg, function(places) {
        //console.table(places);
        that.places = places;
        that.renderPlaces();
      });
    });*/
  },
  renderApps: function renderApps() {
    this.$el.find('#apps').html(
      this.getRenderData().appList
    );
  },
  selectApp: function selectApp(e) {
    /*
    console.log(this);
    console.log(e.target);
    console.log(e.currentTarget);
    */
    var current = $(e.currentTarget),
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
    }
  }/*,
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
