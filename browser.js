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
      $('.js-yml').val(
        e.toString()
      + '\n\n'
      + "Go validate your JSON at http://jsonlint.com to figure out where the error is.\nThen come back here and try again."
      );
      return;
    }

    yml = YAML.stringify(data);
    $('.js-yml').val(yml);
  });

});
