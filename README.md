# HomeRemote

Web GUI for some Upstart scripts spread out over several debian/ubuntu servers. Implemented in Node, ES6 and jQuery.

To run:

* temporarily disable git security on raspberry pi (see below)
* clone the repo
* install newest version of node, don't use apt-get:
* ```wget http://node-arm.herokuapp.com/node_latest_armhf.deb``` 
* ```sudo dpkg -i node_latest_armhf.deb```
// * ```sudo apt-get install nodejs npm node-semver```
* ```npm i --production``` (had to run this several times, because it couldn't find the packages at first)
* run ```npm start``` (this will call node app.js)

for debugging

* run ```npm test``` (this will call node app.js --debugremote)

read log file with

* bunyan -o short homeremote-error.log (or bunyan /var/log/foo.log). Bunyan has many options for filtering.

Temporarily disable git security on raspberry pi:

```git config --global http.sslVerify false``` and afterwards ```git config --global http.sslVerify true```


## TODO

* bunyan logging in grunt-express
* should have rotating logs (bunyan offers support for it)