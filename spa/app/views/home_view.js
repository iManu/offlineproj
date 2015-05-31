var View = require('./view'),
  notifications = require('lib/notifications'),
  HistoryView = require('./history_view'),
  connectivity = require('lib/connectivity'),
  CheckInView = require('./check_in_view'); // charge le js de la vue check_in

module.exports = View.extend({
  template: require('./templates/home'),
  subscriptions: {
    'connectivity:online':'syncMarker',
    'connectivity:offline':'syncMarker'
  },
  getRenderData: function homeViewGetRenderData() {
    return {
      userName: notifications.userName,
      now: moment().format('dddd D MMMM YYYY HH:mm:ss')
    };
  },
  afterRender: function homeViewAfterRender() {
    this.startClock();
    this.syncMarker();
    // on instancie la vue check_in_view... convention Backbone
    new CheckInView({
      el: this.$el.find('#checkInUI')
    }).render(); // render
    new HistoryView({
      el: this.$('#historyUI')
    }).render(); // terminé par un render
  },
  onlineMarker: null,
  startClock: function startClock() {
    this.clock = this.clock || this.$el.find('#ticker');
    var that = this;
    setInterval(function() {
      that.clock.text(that.getRenderData().now);
    }, 1000);
  },
  syncMarker: function syncMarker() {
    this.onlineMarker = this.onlineMarker || this.$('#onlineMarker');
    this.onlineMarker[ connectivity.isOnline() ? 'show' : 'hide']();
  }
});
