# HomeRemote

Web GUI in ES6 React for a Node backend that calls scripts spread out over several debian/ubuntu servers. The scripts 
are Upstart scripts to start/stop a radio playing service and direct shell calls to toggle a remote control for lightswitches.

Material Design:

* Material UI
* Keep.google.com
* https://codelabs.developers.google.com/codelabs/polymer-2-carousel/


## Run

For the moment, `npm i` is not enough. After `npm i` also run `buildPatchExpressWs.sh` until PR has been accepted.

After installation (see below), use ```sudo service homeremote start``` and go to https://localhost:3443

Read log file with:

* ```bunyan -o short homeremote-error.log``` (or bunyan /var/log/foo.log). Bunyan has many options for filtering.


## Test

Tests will run

* lint (server/client)
* Jest API test

The API tests try to access all the HTTP endpoints when logged out, to see if they are
secure. 

Also run curl-ws.sh manually. It will call (existing and non-existing) websocket endpoints when logged 
out to see if the server crashes (https://github.com/HenningM/express-ws/issues/64)

To run API tests, first build and run the server:

* `npm run build`
* `npm run start`
// This does not work as expected, it keeps the first websocket open instead of continuing * in second terminal: `./test/curl-ws.sh` and after completion without errors ctrl+c
* in second terminal: `npm run test`
* in the browser (localhost:3000) be logged out and run:
    * probe non-existing ws endpoint `const socket1 = new WebSocket('ws://localhost:3000/hack'); socket1.onopen = () => socket1.send(JSON.stringify({type: 'init'}));`
    * probe (the only) existing ws endpoint `const socket2 = new WebSocket('ws://localhost:3000/fm/mvToTargetLocationProgress'); socket2.onopen = () => socket2.send(JSON.stringify({type: 'init'}));`
    * both should give no error, but in the Network panel no responses are received.
    * now login and run:
    * probe non-existing ws endpoint `const socket1 = new WebSocket('ws://localhost:3000/hack'); socket1.onopen = () => socket1.send(JSON.stringify({type: 'init'}));`
    * probe (the only) existing ws endpoint `const socket2 = new WebSocket('ws://localhost:3000/fm/mvToTargetLocationProgress'); socket2.onopen = () => socket2.send(JSON.stringify({type: 'init'}));`


## Screenshot

![Screenshot](screenshot.png)

## Updating

* `npm build` and test locally
* set build version in package.json and push commits
* ssh to server
* stop "services" via web app, if running.
* stop `sudo service homeremote stop`
* `cd /opt/homeremote`
* update `git pull origin master`
* update dependencies `npm i`
* install patched express-ws (if needed): `chmod +x buildPatchExpressWs.sh` and `./buildPatchExpressWs.sh`
* build for production: `npm run build` to create updated JS and source map
* test run `node server/app.js | bunyan`
* start `sudo service homeremote start`


## Installation


### Domoticz

Install [Domoticz](https://www.domoticz.com). Use the domain name + port as domoticzuri in the settings.json, e.g. http://192.168.0.19:8080.


### Node server

Requires that the node server upstart script is run as root. (Was because of ELRO, no longer needed?)

Install in /opt (because of upstart script):

* cache git credentials for this session: ```git config --global credential.helper cache```
* `cd /opt`
* check out with ```sudo git clone``` to create /opt/homeremote (update later with ```git pull origin master```)
* change ownership of the created /opt/homeremote to a normal user with ```sudo chown -R```
* ```npm i --production```
* create a settings.json in the root of the project, like:
```
#!javascript
{
    "domoticzuri": "http://192.168.0.19:8080",
    "enableAuth": true,
    "radiologpath": "/tmp/homeremote-playradio-status.log",
    "fm": {
        "rootPath": "/path/to/list",
        "targetLocations": [
            {
                "path": "/path/to/move/to"
            }
        ]
    },
    "ftp": {
        "host": "ftp.example.com",
        "user": "ftp_user",
        "password": "ftp_pass",
        "remotePath": "/remote/directory"
    },
    "musicpath": "/path/to/music",
    "ownerinfo": {
        "uid": 1000,
        "gid": 1000
    },
    "gears": {
        "sn": {
            "uri": "http://192.168.0.1:8000/",
            "apikey": "123"
        },
        "tr": {
            "host": "192.168.0.1",
            "port": "8000",
            "user": "username",
            "password": "password"
        }
    },
    "vm": {
        "vmName": "name-of-the-vm",
        "userName" "USER"
    },
    "vmservices": {
        "elevate": "elevation-prefix",
        "host": "192.168.0.1",
        "port": "1234",
        "user": "username"
    },
    "shell": [
        {
            "name": "SomeLabel",
            "cmd": "ls",
            "mapping": ["json properties of which the value must be shown"]
        }
    ]
}
```
* ownerinfo: the uid and gid of the user account for the "Get Music" feature
* The "Get Music" feature has an OS dependency to ffmpeg, ffprobe and eyeD3. For Debian based systems install with
  * sudo apt-get install software-properties-common # to get add-apt-repository
  * sudo add-apt-repository ppa:jonathonf/ffmpeg-3
  * sudo apt-get update
  * sudo apt-get install ffmpeg eyed3 # to get ffmpeg, eyeD3
* it is possible to install HomeRemote on multiple servers, have the USB stick in one of them and call one from another by setting a URL in heserverip, like: http://192.168.0.25:3000
* it is possible to disable authentication (for servers that are only accessible within the LAN) by setting enableAuth to false (default is true)
* create a auth.json in the root and content should be: 
```
{
  "salt": "SOME_RANDOM_TEXT",
  "users": [{
    "id": 1,
    "name": "username",
    "password": "password"
  }]
}
```
* the /keys dir contains a server.cert and server.key. The ones in the repo are for localhost, and so only usable for debugging. Create your own (see below, Set up localhost SSL) for the target domain and place in the /keys dir.
* set up the router for access to the SSL server (do not allow non-SSL access from outside the network), enable port forwarding to <ip of this server>:3443
* ```npm run start``` or ```node server/app.js``` or ```sudo service homeremote restart``` (see below)
 

### Upstart scripts

For the node server and toggles (e.g. radio toggle). Broadcast toggle upstart script and server need to be installed on a remote machine.

On the server (with speakers plugged in), install the homeremote and playradio upstart scripts:

* ```sudo cp upstart/homeremote.conf /etc/init/```
* homeremote should now be startable with ```sudo service homeremote start``` 
* ```sudo cp upstart/playradio.conf /etc/init/```
* playing the radio should now be startable with ```sudo service playradio start``` 
* the playradio upstart script is set to [3fm](http://www.3fm.nl), but the playradio.conf can be easily modified to use a different radio stream URL.


### Notes for installing on Raspberry Pi

To install the server on a Pi with OSMC:

* If git not installed: ```sudo apt-get install git```
* Install newest version of node, but don't use apt-get 
    * installing with ```sudo apt-get install nodejs``` results in nodejs -v v0.10.29, current LTS is 4.4.3 and current stable is 5.11.0
    * instead go to https://nodejs.org/dist/ and find the latest LTS (currently 4.4.3) that ends with "armv7l" (for RPi2B, for older RPi it would be "armv6l")
    * e.g. ```wget https://nodejs.org/dist/latest-v4.x/node-v4.4.3-linux-armv7l.tar.gz```
    * untar and cd into the untarred dir
    * copy to /usr/local/ ```sudo cp -R * /usr/local/```
    * test with ```node -v```
* npm install can take a long time on a RPi, at least 12 minutes on a RPi2
    * test with ```node /opt/homeremote/app.js``` before setting up the upstart scripts
    * At this time OSMC doesn't use Upstart, but it is possible to set up a daemon service. See below for more details. 
* Server is on http://localhost:3000/

Source: https://blog.wia.io/installing-node-js-v4-0-0-on-a-raspberry-pi

#### Set up systemd service

* ```cd /etc/systemd/system```
* Create a file ```sudo pico homeremote.service``` with content:
        
```
#!bash

[Unit]
Description=HomeRemote

[Service]
User=root
WorkingDirectory=/opt/homeremote/
ExecStart=/usr/local/bin/node app.js
Restart=always
# Restart service after 10 seconds if node service crashes
RestartSec=10
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=homeremote

[Install]
WantedBy=multi-user.target
```

* ```sudo systemctl daemon-reload```
* ```sudo systemctl start homeremote.service``` (should keep running after CTRL-C, or try ```sudo systemctl start homeremote.service &```)
* This last instruction should be called automatically when booting.
* Stop with: ```sudo systemctl stop homeremote.service```
* Status with: ```sudo systemctl status homeremote.service```


#### Temporarily disable git security on raspberry pi:

* ```git config --global http.sslVerify false``` 
* and afterwards enable with ```git config --global http.sslVerify true```


## Set up localhost SSL

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


## TODO

* strip packages from package.json until no longer works, because there are some unused packages in there
* extract everything that is on a remote server (only broadcast for now) to a subdir: remote-broadcast-server with it's own node server and upstart scripts
* Add static typing with Flow: doesn't work on Windows but works on Ubuntu and probably on Travis. The problem is that this requires transpilation to remove the typing, so it would not be possible to build on Windows anymore.
* bunyan logging in grunt-express
* bunyan logging on RPi (requires npm on RPi)
* should have rotating logs (bunyan offers support for it)

Currently it is required when using :8080 to navigate to /login manually after each server restart because of /r/* redirect in app.js