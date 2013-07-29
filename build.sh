#!/bin/bash

mkdir -p public/{js,css}

# jadetohtml
jade index.jade
mv index.html public/

# lesstocss
lessc -x style.less > public/css/style.min.css

# cjstojs
pakmanager -e browser build
uglifyjs pakmanaged.js > public/js/pakmanaged.min.js
rm pakmanaged.js
