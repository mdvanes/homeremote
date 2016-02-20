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


### Installation

Install Elro Home Easy

#### Elro Home Easy

install 

* ```git clone https://github.com/mdvanes/he853-remote.git```
* ```sudo apt-get install libusb-1.0-0-dev```
* ```make```
* ```sudo ./he853``` e.g. ```sudo ./he853 001 1``` (0 is off, 1 is on)

there are 4 switches with id's 001, 002, 003, 004

See the repo for how to add switches.

#### Node server

Will call the Elro binary directly through Node. This requires that the node server upstart script is run as root.

On the server with the Elro USB stick plugged in, install in /opt (because of upstart script):

* cache git credentials for this session: ```git config --global credential.helper cache```
* ```cd /opt``
* check out with ```sudo git clone``` to create /opt/homeremote (update later with ```git pull origin master```)
* change ownership of the created /opt/homeremote to a normal user with ```sudo chown -R```
* ```npm i --production```
* create a settings.json in the root, like:
```
{
    "hepath": "/home/foo/elro/he853-remote",
    "radiologpath": "/tmp/homeremote-playradio-status.log"
}
```
* create a users.htpasswd in the root and add one user per line in the format: ```username:password```
* the /keys dir contains a server.cert and server.key. The ones in the repo are for localhost, and so only usable for debugging. Create your own (see below, Set up localhost SSL) for the target domain and place in the /keys dir.
* set up the router for access to the SSL server (do not allow non-SSL access from outside the network), enable port forwarding to <ip of this server>:3443
* ```node app.js``` or ```sudo service homeremote restart``` (see below)
 

#### Upstart scripts

For the node server and toggles (e.g. radio toggle). Broadcast toggle upstart script and server need to be installed on a remote machine.
There are no upstart scripts for the (fire and forget) Elro switches.

On the server with the Elro USB stick, and speakers plugged in, install the homeremote and playradio upstart scripts:

* ```sudo cp upstart/homeremote.conf /etc/init/```
* homeremote should now be startable with ```sudo service homeremote start``` 
* ```sudo cp upstart/playradio.conf /etc/init/```
* playing the radio should now be startable with ```sudo service playradio start``` 
* the playradio upstart script is set to [3fm](http://www.3fm.nl), but the playradio.conf can be easily modified to use a different radio stream URL.

### Set up localhost SSL

On Ubuntu, in a temp dir do:

* ```openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days XXX -nodes -subj '/CN=localhost'```
* This will create a cert.pem (certificate) and a key.pem (prive key).
* Rename and move key.pem from the Ubuntu system to keys/localhost.key in this dir.
* Likewise, rename and move cert.pem to keys/localhost.cert

details:

* -nodes => no DES, so do not use a password
* -subj => configure 
* also possible with -subj '/CN=servername.local' for testing on a server within a network

Note:

1. AppCache will fail when using a self-signed certificate. Starting Chrome with ```--ignore-certicate-errors``` should help, and also using a real certificate should work.
Otherwise, for testing AppCache, just use the non-SSL entrypoint at :3000
2. The SSL certificate that I created for use within the network (e.g. "foo.local") also seems to works for the external domain (e.g. "foo.com"), albeit with warnings. This is good enough for now.  

### TODO

* move /react to /
* convert less to libsass
* sourcemap doesn't work
* add timer to turn a switch on or off. Maybe with: https://www.npmjs.com/package/node-schedule
* add http basic authentication (or better digest access?)
* strip packages from package.json until no longer works, because there are some unused packages in there 
* make configurable. Remove 3fm and other references. Make repo public
* extract everything that is on a remote server (only broadcast for now) to a subdir: remote-broadcast-server with it's own node server and upstart scripts
* make "all on/all off" buttons
* Add static typing with Flow (doesn't work on Windows but maybe on Travis?)
* React Native output


## Screenshot

![Screenshot](screenshot.png)