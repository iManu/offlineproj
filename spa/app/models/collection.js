module.exports = Backbone.Collection.extend({
  // le modèle de la collection ce sera 'check_in'
  model: require('models/check_in'),
  url: '/checkins',
  comparator: function (c1, c2) {
    return +c2.get('key') - +c1.get('key');
  }
});
