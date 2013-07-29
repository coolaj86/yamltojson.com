jQuery(function () {
  "use strict";

  var YAML = require('json2yaml')
    , $ = require('jQuery')
    , $events = $('body')
    ;

  $events.on('click', '.js-convert', function () {
    var json = $('.js-json').val()
      , data
      , yml
      ;

    try {
      data = JSON.parse(json);
    } catch(e) {
      $('.js-yml').val(e.toString());
      return;
    }

    yml = YAML.stringify(data);
    $('.js-yml').val(yml);
  });

});
