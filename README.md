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
* should have rotating logs (bunyan offers support for it)