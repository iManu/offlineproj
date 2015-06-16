module.exports = Backbone.Collection.extend({
  // le modèle de la collection ce sera 'app_list'
  model: require('models/app_list'),
  url: '/apps'/*,
  comparator: function (c1, c2) {
    return +c2.get('key') - +c1.get('key');
  }*/
});
