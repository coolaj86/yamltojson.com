(function () {
  "use strict";

  var YAML = require('yamljs')
    , json
    , data
    , yml
    ;

  yml = '---\\n  foo: bar';
  data = YAML.parse(yml);
  json = JSON.stringify(data);

  console.log(json);
}());
