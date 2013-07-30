(function () {
  "use strict";

  var YAML = require('yamljs')
    , json
    , data
    , yml
    ;

  yml = '---&#92;n  foo: bar';
  data = YAML.parse(yml);
  json = JSON.stringify(data);

  console.log(json);
}());
