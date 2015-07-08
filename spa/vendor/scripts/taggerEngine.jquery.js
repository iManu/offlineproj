/**
 * taggerEngine
 */

(function ($) {


  var TaggerEngine = function () {
    return this.init.apply(this, arguments);
  };
  TaggerEngine.prototype = {
    options: { // personalized options
      clean: false
    },
    init: function (element, options) {
      this.options = $.extend(true, {}, this.options, options);
      //
      this.taglink = $(element);
      this.tag = this.taglink.data('tag');
      this.addEvent();

    },
    sendData: function() {
      var finalTag = ( this.options.clean ) ? this.cleanData(this.tag) : this.tag;
      eventTrack(finalTag, 'o');
    },
    cleanData: function() {
      var new_string = "", my_string = this.tag;
      var pattern_accent = new Array("é", "è", "ê", "ë", "ç", "à", "â", "ä", "î", "ï", "ù", "ô", "ó", "ö", "/", " ", "'", "’", "&");
      var pattern_replace = new Array("e", "e", "e", "e", "c", "a", "a", "a", "i", "i", "u", "o", "o", "o", "-", "-", "-", "-", "-");
      if (my_string && my_string !== "") {
        new_string = this.preg_replace(pattern_accent, pattern_replace, my_string);
      }
      return new_string;
    },
    preg_replace: function(array_pattern, array_pattern_replace, my_string)  {
      var new_string = String (my_string);
      for (var i=0, arrLen = array_pattern.length; i < arrLen; i++) {
        var reg_exp = new RegExp(array_pattern[i], "gi");
        var val_to_replace = array_pattern_replace[i];
        new_string = new_string.replace (reg_exp, val_to_replace);
      }
      return new_string;
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
