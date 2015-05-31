/**
 *
 */
var View = require('./view'),
  store = require('lib/persistence');

module.exports = View.extend({
  template: require('./templates/history'),
  listTemplate: require('./templates/check_ins'),
  // subscriptions = convention de Backbone Mediator
  subscriptions: {
    'checkins:reset': 'render',
    'checkins:new': 'addCheckIn'
  },
  getRenderData: function historyViewGetRenderData() {
    return {
      checkIns: this.listTemplate(store.getCheckIns)
    };
  },
  afterRender: function historyViewAfterRender() {},
  addCheckIn: function addCheckIn(checkIn) {
    checkIn.extra_class = 'new';
    this.$('#history').prepend(this.listTemplate([checkIn]));
    var that = this;
    // on enlève la classe .new pour lancer l'anim css
    _.defer(function() {
      that.$('#history li.new').removeClass('new');
    });
  }
});
