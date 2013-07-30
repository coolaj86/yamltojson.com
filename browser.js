jQuery(function () {
  "use strict";

  var YAML = require('YAML')
    , $ = require('jQuery')
    , $events = $('body')
    ;

  $events.on('click', '.js-convert', function () {
    var yml = $('.js-yml').val()
      , data
      , json
      ;

    try {
      data = YAML.parse(yml);
    } catch(e) {
      $('.js-json').val(
        e.toString()
      + '\n\n'
      + "Go validate your YAML at http://yamllint.com to figure out where the error is.\nThen come back here and try again."
      );
      return;
    }

    json = JSON.stringify(data, null, '  ');
    $('.js-json').val(json);
  });

});
