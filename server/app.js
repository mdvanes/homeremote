#!/usr/bin/env node
/* eslint-env node */

let express = require('express');
let debug = false;
const app = express();
const http = require('http');
const path = require('path');
const bunyan = require('bunyan');
const radio = require('./radio.js');
const motion = require('./motion.js');
const switcher = require('./switch.js');
const filemanager = require('./fm.js');
const getMusic = require('./getMusic.js');
const gears = require('./gears.js');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;
const bodyParser = require('body-parser');

const settings = require('../settings.json');
const auth = require('../auth.json');

app.use(bodyParser.json()); // for parsing application/json

// Configuration
let log = bunyan.createLogger({
    name: 'HomeRemote',
    streams: [
        {
            level: 'info',
            stream: process.stdout // log INFO and above to stdout
        },
        {
            level: 'error',
            path: path.join(__dirname, '../homeremote-error.log') // log ERROR and above to a file // TODO should be /var/tmp/homeremote-error.log ?
        }
    ]
});

passport.use(new LocalStrategy(
    function(requestedUsername, requestedPassword, done) {
        const retrievedUsers = auth.users.filter(user => {
            return user.name === requestedUsername;
        });
        if(retrievedUsers &&
            retrievedUsers.length === 1 &&
            retrievedUsers[0].name === requestedUsername &&
            retrievedUsers[0].password === requestedPassword
        ) {
            return done(null, retrievedUsers[0]);
        } else {
            return done(null, false, { message: 'Incorrect username/password.' });
        }
    }
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    const retrievedUsers = auth.users.filter(user => {
        return user.id === id;
    });
    if(retrievedUsers &&
        retrievedUsers.length === 1 &&
        retrievedUsers[0].id === id
    ) {
        return cb(null, retrievedUsers[0]);
    }
    return cb('cannot deserialize user');
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Read application arguments
process.argv.forEach(function (val, index) {
    // Detect debug mode
    if(index === 2 && val === '--debugremote') {
        log.warn('Running in debug mode!');
        debug = true;
    }
});

if(typeof settings.enableAuth === 'undefined' || settings.enableAuth) {
    // enableAuth: default is true
    //https://github.com/passport/express-4.x-local-example
    app.use(require('morgan')('combined'));
    app.use(require('cookie-parser')());
    app.use(bodyParser.urlencoded({ extended: true }));
    // https://github.com/expressjs/session
    if(!auth.salt) {
        throw new Error('set salt in auth.json');
    }
    app.use(session({ secret: auth.salt, resave: false, saveUninitialized: false }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/login', (req, res) => {
        res.render('login');
    });
    app.post(
        '/login',
        passport.authenticate('local', { failureRedirect: '/login?failed' }),
        (req, res) => {
            res.redirect('/');
    });
    app.get('/logout',
        function(req, res){
            req.logout();
            res.redirect('/login');
        });

    app.use(
        connectEnsureLogin(),
        express.static('public'));

    // Set routes
    if(!debug) {
        // Do not start motion in debugmode, because of sudo password requests.
        radio.bind(app, log, debug);
        motion.bind(app, log, debug);
    }
    switcher.bind(app, log);
    gears.bind(app, log);
    filemanager.bind(app, log);
    getMusic.bind(app, log);
    //broadcast.bind(app, log, debug);

    // Using the /r/ subpath for views, to easily match here and in webpack.config proxies
    app.get('/r/*', connectEnsureLogin(), (req, res) => {
        if(!debug) {
            res.sendfile(path.resolve(__dirname + '/../public/index.html'));
        } else {
            // Better solution: https://forum-archive.vuejs.org/topic/836/webpack-hot-reloading-possible-with-express-server/6
            res.redirect('/');
        }
    });

} else {
    app.use(
        express.static('public')
    );
}

http.createServer(app).listen(3000, () => log.info('HomeRemote listening at http://localhost:3000') );