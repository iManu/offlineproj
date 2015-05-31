/**
 * [throttle description]
 * @return {[type]} [description]
 */
Function.prototype.throttle = function(myInterval) {
  var f = this,
      dateNow = Date.now();

  return function() {

    if( dateNow+myInterval < Date.now() ) return;

    dateNow = Date.now();
    return f.apply(this, arguments);
  };
};

// Protocole de test

function sayHi() {
  console.log(Date.now(), "Hiiiii");
}

console.log(Date.now());
hiCoquine = setInterval(sayHi.throttle(1000), 100);

setTimeout(function() { clearInterval(hiCoquine); }, 10000);
