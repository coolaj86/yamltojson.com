#!/bin/bash

# jadetohtml
jade index.jade

# lesstocss
lessc -x style.less > css/style.min.css

# cjstojs
pakmanager -e browser build
uglifyjs pakmanaged.js > js/pakmanaged.min.js
rm pakmanaged.js
