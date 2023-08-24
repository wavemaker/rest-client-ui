#!/bin/bash

# create symlinks for distributions in react example
cd examples/react-app/public/assets/
ln -s ../../../../dist/rest-import-bundle.js rest-import-bundle.js 
ln -s ../../../../dist/rest-import-bundle.css rest-import-bundle.css
ln -s ../../../../dist/config-import-bundle.js config-import-bundle.js


# create symlinks for distributions in angular example
cd ../../../../examples/angular-app/src/assets/plugins/
ln -s ../../../../../dist/rest-import-bundle.js rest-import-bundle.js 
ln -s ../../../../../dist/rest-import-bundle.css rest-import-bundle.css
ln -s ../../../../../dist/config-import-bundle.js config-import-bundle.js

cd ../../../../../


