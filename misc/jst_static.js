/**
 * [description]
 * @return {[type]} [description]
 */
var Person = (function() {
  var instanceCount = 0,
      autreVar = 0;

  function Person(first, last) {
    this.first = first;
    this.last = last;jsh
    ++instanceCount;
  }

  Person.get = {
    instanceCount : function getInstanceCount() {
      return instanceCount;
    },
    autreVar : function getAutreVar() {
      return autreVar;
    }
  }

  return Person;
})();
