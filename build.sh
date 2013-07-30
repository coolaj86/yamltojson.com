#!/bin/bash
set -u
set -e

rm -rf public/

git add build.sh examples/ index.jade browser.js style.less README.md package.json
git commit -m "build.sh: YOLO" || true
git push

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

git checkout gh-pages
rsync -a public/ ./
rm -rf public/
git commit -a -m "build.sh: YOLO"
git push
git checkout master
