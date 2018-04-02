#!/bin/bash
rm -rf node_modules/express-ws
cd node_modules
git clone https://github.com/mdvanes/express-ws.git
cd express-ws
npm i
./node_modules/.bin/babel ../../src/ -d ../../lib/
cd ..