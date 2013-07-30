(function () {
  "use strict";

  var YAML = window.YAML
    , json
    , data
    , yml
    ;

  yml = '---\\n  foo: bar';
  data = YAML.parse(yml);
  json = JSON.stringify(data);

  console.log(json);
}());
