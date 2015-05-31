
/**
 * multishift
 */
var multishift = function(myArr, nbToRemove) {
  return myArr.splice( 0, nbToRemove );
}

/**
 * multipop
 */
var multipop = function(myArr, nbToRemove) {
  return myArr.splice( -nbToRemove, nbToRemove );
}

var arr = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

multishift(arr, 2);
console.log(arr);

multipop(arr, 2);
console.log(arr);


/**
 * Singleton
 */
(function() {
  var connx = null;
  function Connx() {
    console.log('connecté');
  }
  window.getConnx = function() {
    if(connx) return connx;
    connx = new Connx();
    return connx;
  }
})();

var con = getConnx();

/**
 * Multiton
 */
(function() {
  var sliders = {};
  function privSlider() {
    console.log('slide');
  }
  window.getSlider = function(DomID) {
    if(!sliders[DomID]) return sliders[DomID];
    sliders[DomID] = new privSlider();
    return sliders[DomID];
  }
})();

var slide1 = getSlider('#main');

var slide2 = getSlider('#aside');
var slide3 = getSlider('#aside');

