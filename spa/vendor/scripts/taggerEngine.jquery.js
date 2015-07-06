/**
 * taggerEngine
 */

(function ($) {


  var TaggerEngine = function () {
    return this.init.apply(this, arguments);
  };
  TaggerEngine.prototype = {
    /*options: { // personalized options
      delay: 300
    },*/
    init: function (element, options) {
      //this.options = $.extend(true, {}, this.options, options);
      //
      this.taglink = $(element);
      this.tag = this.taglink.data('tag');
      this.addEvent();

    },
    sendData: function() {
      eventTrack(this.tag, 'o');
    },
    addEvent: function() {
      var _this = this;
      this.taglink.on('click', function() {
        _this.sendData();
      });
    }
  };
  /**
   * Add the function to jQuery for chaining
   * @return {Object}         Instanciate new one
   */
  $.fn.taggerEngine = function (options) {
    this.each(function () {
      $(this).data('taggerEngine', new TaggerEngine(this, options));
    });
  };

})(jQuery);
