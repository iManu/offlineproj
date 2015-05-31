/* globals bmw, audi */
var a, b;
if (a === b) {
  console.log(a);
}

function Car(maxSpeed) {
  this.maxSpeed = maxSpeed;
}

var ferrari = new Car(240);
var twingo = new Car(100);
console.log(ferrari, twingo);
console.log(bmw);
console.log(audi);

if (a == null) {
  console.log('check null or undefined easily');
}

$(function() {
  console.log('dom:loaded');
});
