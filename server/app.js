#!/usr/bin/env node
/* eslint-env node */

// TODO remove this by setting env node or the like in .eslintrc in this dir
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const express = require('express');
let debug = false;
const app = express();
const http = require('http');
const path = require('path');
const bunyan = require('bunyan');
const nowplaying = require('./nowplaying.js');
const serviceToggle = require('./serviceToggle.js');
const vmServicesToggle = require('./vmServicesToggle.js');
const vmToggle = require('./vmToggle.js');
const shellStatus = require('./shellStatus.js');
const switcher = require('./switch.js');
const filemanager = require('./fm.js');
const getMusic = require('./getMusic.js');
const gears = require('./gears.js');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;
const bodyParser = require('body-parser');
const server = http.createServer(app);
const expressWs = require('express-ws')(app, server);
const listEndpointsExpress = require('list-endpoints-express');
//require('express-ws')(app, server);

const settings = require('../settings.json');
const auth = require('../auth.json');

app.use(bodyParser.json()); // for parsing application/json

// Configuration
const log = bunyan.createLogger({
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

passport.use(
    new LocalStrategy(function(requestedUsername, requestedPassword, done) {
        const retrievedUsers = auth.users.filter(user => {
            return user.name === requestedUsername;
        });
        if (
            retrievedUsers &&
            retrievedUsers.length === 1 &&
            retrievedUsers[0].name === requestedUsername &&
            retrievedUsers[0].password === requestedPassword
        ) {
            return done(null, retrievedUsers[0]);
        } else {
            return done(null, false, {
                message: 'Incorrect username/password.'
            });
        }
    })
);

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
    if (
        retrievedUsers &&
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
process.argv.forEach(function(val, index) {
    // Detect debug mode
    if (index === 2 && val === '--debugremote') {
        log.warn(
            'Running in debug mode! Disabled authentication and running on port 3001'
        );
        debug = true;
    }
});

const startsWithR = req =>
    req.session && req.session.returnTo && req.session.returnTo.indexOf('/r');

const handlePostLogin = (req, res) => {
    if (req.body.remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
    } else {
        req.session.cookie.expires = false; // Cookie expires at end of session
    }
    const redirectUrl = startsWithR(req) === 0 ? req.session.returnTo : '/';
    log.info(`/login redirectUrl: ${redirectUrl}`);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

const handleGetLogout = (req, res) => {
    req.logout();
    res.redirect('/login');
};

if (typeof settings.enableAuth === 'undefined' || settings.enableAuth) {
    // enableAuth: default is true
    //https://github.com/passport/express-4.x-local-example
    app.use(require('morgan')('combined'));
    app.use(require('cookie-parser')());
    app.use(bodyParser.urlencoded({ extended: true }));
    // https://github.com/expressjs/session
    if (!auth.salt) {
        throw new Error('set salt in auth.json');
    }

    if (!debug) {
        app.use(
            session({
                secret: auth.salt,
                resave: false,
                saveUninitialized: false
            })
        );

        app.use(passport.initialize());
        app.use(passport.session());

        app.get('/login', (req, res) => {
            res.render('login');
        });
        app.post(
            '/login',
            passport.authenticate('local', {
                failureRedirect: '/login?failed'
            }),
            handlePostLogin
        );
        app.get('/logout', handleGetLogout);
        app.get('/r/logout', handleGetLogout);
        app.use(connectEnsureLogin(), express.static('public'));
    } else {
        log.warn(`WARNING: Authentication is disabled!`);

        app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            next();
        });
        log.warn(`WARNING: Disabled CORS protection!`);
    }

    const ensuredLoggedIn = debug
        ? () => {
              // Dummy callback
              return (req, res, next) => {
                  next();
              };
          }
        : connectEnsureLogin;

    app.get('/manifest.json', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/../public/manifest.json'));
    });

    // Set routes
    if (!debug) {
        // Do not start motion in debugmode, because of sudo password requests.
        nowplaying.bind(app, log, debug);
    }
    serviceToggle.bind(app, 'playradio', log);
    serviceToggle.bind(app, 'motion', log);
    vmToggle.bind(app, log);
    vmServicesToggle.bind(app, log);

    shellStatus.bind(app, 'shell', log);
    switcher.bind(app, log, ensuredLoggedIn);
    gears.bind(app, log);
    filemanager.bind(app, expressWs, log);
    getMusic.bind(app, log);
    //broadcast.bind(app, log, debug);

    // TODO remove /r/* subpath matching
    // Using the /r/ subpath for views, to easily match here and in webpack.config proxies
    app.get('/r/*', connectEnsureLogin(), (req, res) => {
        if (!debug) {
            res.sendFile(path.resolve(__dirname + '/../public/index.html'));
        } else {
            // Better solution: https://forum-archive.vuejs.org/topic/836/webpack-hot-reloading-possible-with-express-server/6
            res.redirect('/');
        }
    });
} else {
    app.use(express.static('public'));
}

const PORT = debug ? 3001 : 3000;

server.listen(PORT, () =>
    log.info(`HomeRemote listening at http://localhost:${PORT}`)
);

log.info(
    'Registered endpoints:\n',
    JSON.stringify(listEndpointsExpress(app), null, 2)
);
