# HomeRemote

Web GUI for some Upstart scripts spread out over several debian/ubuntu servers. Implemented in Node, ES6 and jQuery.

To run:

* clone the repo
* run ```npm start``` (this will call node app.js)

for debugging

* run ```npm test``` (this will call node app.js --debugremote)

read log file with

* bunyan -o short homeremote-error.log (or bunyan /var/log/foo.log). Bunyan has many options for filtering.

## TODO

* bunyan logging in grunt-express
* should have rotating logs (bunyan offers support for it)