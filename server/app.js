#!/usr/bin/env node
/* eslint-env node */

let express = require('express');
const app = express();
const http = require('http');
    //https = require('https'),
    //fs = require('fs'),
const path = require('path');
const bunyan = require('bunyan');
const broadcast = require('./broadcast.js');
const radio = require('./radio.js');
const motion = require('./motion.js');
const togglestub = require('./togglestub.js');
const clickstub = require('./clickstub.js');
const switcher = require('./switch.js');
const filemanager = require('./fm.js');
const getMusic = require('./getMusic.js');
const gears = require('./gears.js');
const settings = require('../settings.json');
let debug = false;
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;
const bodyParser = require('body-parser');
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

// TODO remove
// let basic = auth.basic({
//     realm: 'HomeRemote', // pages with the same root URL and realm share credentials
//     file: path.join(__dirname, '../users.htpasswd')
// });
// let options = {
//     key: fs.readFileSync('keys/server.key'),
//     cert: fs.readFileSync('keys/server.cert')
// };

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('incoming credentials', username, password);
        // TODO from JSON
        if(username === 'john' && password === 'test') {
            return done(null, {username: 'john', id: 1});
        } else {
            return done(null, false, { message: 'Incorrect username/password.' });
        }
        // User.findOne({ username: username }, function (err, user) {
        //     if (err) { return done(err); }
        //     if (!user) {
        //         return done(null, false, { message: 'Incorrect username.' });
        //     }
        //     if (!user.validPassword(password)) {
        //         return done(null, false, { message: 'Incorrect password.' });
        //     }
        //     return done(null, user);
        // });
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
    // db.users.findById(id, function (err, user) {
    //     if (err) { return cb(err); }
    //     cb(null, user);
    // });
    cb(null, {username: 'john', id: 1}); // TODO from JSON
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

// TODO test if API routes are blocked when not logged in
// Set routes
broadcast.bind(app, log, debug);
if(!debug) {
    // Do not start motion in debugmode, because of sudo password requests.
    radio.bind(app, log, debug);
    motion.bind(app, log, debug);
}
togglestub.bind(app);
clickstub.bind(app);
switcher.bind(app, log);
getMusic.bind(app, log);

// Using the /r/ subpath for views, to easily match here and in webpack.config proxies
app.get('/r/*', (req, res) => {
    if(!debug) {
        res.sendfile(path.resolve(__dirname + '/../public/index.html'));
    } else {
        // Better solution: https://forum-archive.vuejs.org/topic/836/webpack-hot-reloading-possible-with-express-server/6
        res.redirect('/');
    }
});

if(typeof settings.enableAuth === 'undefined' || settings.enableAuth) {
    // enableAuth: default is true
    console.log('using authentication'); // TODO remove
    //https://github.com/passport/express-4.x-local-example
    app.use(require('morgan')('combined'));
    app.use(require('cookie-parser')());
    app.use(bodyParser.urlencoded({ extended: true }));
    // https://github.com/expressjs/session
    // TODO use better secret
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

    app.use(passport.initialize());
    app.use(passport.session());

    // TODO remove
    // app.get('/',
    //     function(req, res) {
    //         //res.render('home', { user: req.user });
    //         app.use(express.static('public'));
    //         res.redirect('/')
    //     });
    // app.use(
    //     //auth.connect(basic),
    //     express.static('public')
    // );
    // http://passportjs.org/docs
    // app.configure(function() {
    //     app.use(express.static('public'));
    //     // app.use(express.cookieParser());
    //     // app.use(express.bodyParser());
    //     // app.use(express.session({ secret: 'keyboard cat' }));
    //     app.use(passport.initialize());
    //     app.use(passport.session());
    //     //app.use(app.router);
    // });

    app.get('/login', (req, res) => {
        res.render('login');
    });
    app.post(
        '/login',
        passport.authenticate('local', { failureRedirect: '/login?failed' }),
        (req, res) => {
            console.log('post login');
            res.redirect('/');
    });
    app.get('/logout',
        function(req, res){
            req.logout();
            res.redirect('/');
        });

    app.use(
        connectEnsureLogin(),
        express.static('public'));

    gears.bind(app, log);
    filemanager.bind(app, log);

} else {
    app.use(
        express.static('public')
    );
}

http.createServer(app).listen(3000, () => log.info('HomeRemote listening at http://localhost:3000') );
// TODO Remove - https.createServer(options, app).listen(3443, () => log.info('HomeRemote listening at https://localhost:3443') );