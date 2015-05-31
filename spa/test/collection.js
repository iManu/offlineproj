/**
 * = test/collection.js
 */

/* globals describe, it, beforeEach */
var assert = require("assert");
global.Backbone = require('backbone');
describe('La collection', function() {
  var coll;
  beforeEach(function() {
    var Collection = require('models/collection');
    coll = new Collection();
  });

  it('Devrait avoir le checkin le plus récent en premier', function() {

    var checkinOld = {key:Date.now() - 10000};
    var checkinNew = {key:Date.now()};
    coll.add(checkinOld);
    coll.add(checkinNew);

    console.log(coll);

    assert.deepEqual(coll.at(0).toJSON(), checkinNew, 'Le premier checkin est le plus récent');
    assert.deepEqual(coll.at(1).toJSON(), checkinOld, 'Le dernier checkin est le plus ancient');

  });
});
