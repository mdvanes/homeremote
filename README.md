# HomeRemote

Web GUI for some Upstart scripts spread out over several debian/ubuntu servers. Implemented in Node, ES6 and jQuery.

To run:

* temporarily disable git security on raspberry pi (see below)
* clone the repo
* install newest version of node, don't use apt-get: http://node-arm.herokuapp.com/
// can't find new enough npm installer for rasp pi??   * ```npm i --production``` (had to run this several times, because it couldn't find the packages at first)
// * run ```npm start``` (this will call node app.js)
* copy node_modules over sftp
* ```node app.js```
* server is on http://192.168.0.15:3000/

for debugging

* run ```npm test``` (this will call node app.js --debugremote)

read log file with

* bunyan -o short homeremote-error.log (or bunyan /var/log/foo.log). Bunyan has many options for filtering.

Temporarily disable git security on raspberry pi:

```git config --global http.sslVerify false``` and afterwards ```git config --global http.sslVerify true```


## TODO

* bunyan logging in grunt-express
* bunyan logging on RPi (requires npm on RPi)
* should have rotating logs (bunyan offers support for it)
* combine modules in Babel or sourcemaps on Babel->Uglify




# ELRO

* install he853-remote in e.g. /home/martin/elro/he853-remote (from https://github.com/mdvanes/he853-remote)

```
#!/usr/bin/env node

/* since ./he853 requires sudo, run this script as root: sudo npm start
obviously, it's not very secure to run node as root
the alternative is to make dedicated scripts for all allowed commands (e.g. set_001_on.sh) comparable to
prepared statements and to add all these to the sudoers. Or add he853 itself to sudoers.

Example:

must be edited with: sudo visudo (will edit with nano, otherwise see https://help.ubuntu.com/community/Sudoers)

and then (under command aliases):
Cmnd_Alias ELRO_CMDS = /home/martin/elro/he853-remote/he853

and then (under user specification, after the %admin ALL = (ALL) ALL line):
theusernamethatwillrunnode ALL=(ALL) NOPASSWD: ELRO_CMDS

It would be better to somehow fix the requirement to have sudo for he853, which probably has something to do
with the usb driver.


Now set up an upstart script to run the node script. This should not run as root.

*/

var exec = require('child_process').exec;
var express = require('express');
var app = express();

app.get('/on', function(req, res) {
  console.log('endpoint on');
  //exec('sudo /home/martin/elro/he853-remote/he853 002 1', function(error, stdout, stderr){
  exec('sudo /home/martin/elro/he853-remote/he853 002 1', function(error, stdout, stderr){
    console.log('['+stdout+'] [' + stderr + ']');
  });
});

app.get('/off', function(req, res) {
  console.log('endpoint off');
  //exec('sudo /home/martin/elro/he853-remote/he853 002 0', function(error, stdout, stderr){
  exec('sudo /home/martin/elro/he853-remote/he853 002 0', function(error, stdout, stderr){
    console.log('['+stdout+'] [' + stderr + ']');
  });
});

app.get('/', function(req, res) {
  console.log('loading home');
  res.send('<html><body><h1>Start</h1><a href="/">home</a><br/><h2><a href="/on">on</a></h2> <h2><a href="/off">of$
});

var server = app.listen(3001, function() {
  console.log('started at localhost:3001');
});
```




## React

Run ```grunt```. There is a watch on jsx files.
It will serve at http://localhost:3000/react/

### TODO

* define endpoints on the (stubbed) server to log button clicks etc
* buttons as icons. Large, 2 adjacent possible
* strip packages from package.json until no longer works, because there are some unused packages in there 
* React Native output
* JSHint/JSCS for react/es6
* make configurable. Remove 3fm and other references. Make repo public


## Screenshot

![Screenshot](screenshot.png)