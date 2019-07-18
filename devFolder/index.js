/*jslint node: true, es5: true, nomen: true*/
(function () {
    'use strict';

    var app,
        bodyParser,
        express,
        fs,
        http,
        routes,
        session,
        sessionConfig,
        timeout;

    // Require application dependencies.
    fs = require('fs');
    http = require('http');
    routes = require('./server/routes');
    express = require('express');
    session = require('express-session');
    timeout = require('connect-timeout');
    bodyParser = require('body-parser');

    // If deployed in our demo site, we store the sessions using Redis.
    // Locally, we store the sessions in memory.
    sessionConfig = {
        resave: false,
        saveUninitialized: true,
        secret: '+rEchas&-wub24dR'
    };

    // Create our application and register its dependencies
    app = express();
    app.use(bodyParser.json());
    app.use(session(sessionConfig));
    app.use(timeout('30s'));

    // Register our OAUTH2 routes.
    app.get('/auth/authenticated', routes.auth.getAuthenticated);
    app.get('/auth/login', routes.auth.getLogin);
    app.get('/auth/callback', routes.auth.getCallback);
    app.get('/auth/logout', routes.auth.getLogout);

    // Register our SKY API GET routes.
    app.get('/api/constituents/:constituentId', routes.auth.checkSession, routes.api.getConstituent);
    app.get('/api/constituents/phone/pre/:constituentId', routes.auth.checkSession, routes.api.getPrePhone);
    app.get('/api/constituents/phone/post/:constituentId', routes.auth.checkSession, routes.api.getPostPhone);
    app.get('/api/constituents/name/pre/live/:constituentId', routes.auth.checkSession, routes.api.getConstituentNamePre);
    app.get('/api/constituents/name/post/live/:constituentId', routes.auth.checkSession, routes.api.getConstituentNamePost);
    app.get('/api/constituentcodes/:offset', routes.auth.checkSession, routes.api.getConstituentCodes);
    app.get('/api/constituentrelationships/:constituentId', routes.auth.checkSession, routes.api.getConstituentRelationships);
    app.get('/api/constituents/firstname/:constituentId', routes.auth.checkSession, routes.api.getConstituentFirstName);
    app.get('/api/constituents/firstname/pre/:constituentId', routes.auth.checkSession, routes.api.patchConstituentFirstNamePre);
    app.get('/api/constituents/firstname/post/:constituentId', routes.auth.checkSession, routes.api.patchConstituentFirstNamePost);
    app.get('/api/constituents/title/pre/test/:constituentId', routes.auth.checkSession, routes.api.getConstituentTitlePreTest);
    app.get('/api/constituents/title/pre/live/:constituentId', routes.auth.checkSession, routes.api.getConstituentTitlePreLive);
    app.get('/api/constituents/title/test/:constituentId-:title', routes.auth.checkSession, routes.api.patchConstituentTitleTest);
    app.get('/api/constituents/title/live/:constituentId-:title', routes.auth.checkSession, routes.api.patchConstituentTitleLive);
    app.get('/api/constituents/title/post/test/:constituentId', routes.auth.checkSession, routes.api.getConstituentTitlePostTest);
    app.get('/api/constituents/title/post/live/:constituentId', routes.auth.checkSession, routes.api.getConstituentTitlePostLive);
    app.get('/api/guessGender/:firstName', routes.auth.checkSession, routes.api.guessGender);
    app.get('/api/constituents/TG/pre/live/:constituentId', routes.auth.checkSession, routes.api.getTGPre);
    app.get('/api/constituents/TG/post/live/:constituentId', routes.auth.checkSession, routes.api.getTGPost);
    app.get('/api/csv/:fileName', routes.auth.checkSession, routes.api.getCSVid);
    app.get('/api/titleSwap/pre/live/:constituentId', routes.auth.checkSession, routes.api.preTitleSwap);
    // ADD ADDITIONAL ROUTES HERE

    // Register our SKY API PATCH routes.
    app.patch('/api/constituents/firstname/:constituentId-:firstName', routes.auth.checkSession, routes.api.patchConstituentFirstName);
    app.patch('/api/constituents/name/live/:constituentId-:firstName-:midInitial', routes.auth.checkSession, routes.api.patchConstituentName);
    app.patch('/api/constituents/title/live/:constituentId-:gender', routes.auth.checkSession, routes.api.patchTitle);
    app.patch('/api/constituents/gender/live/:constituentId-:gender', routes.auth.checkSession, routes.api.patchGender);
    app.patch('/api/constituents/TG/live/:constituentId-:gender', routes.auth.checkSession, routes.api.patchTG);
    app.patch('/api/constituents/titleSwap/:constituentId', routes.auth.checkSession, routes.api.titleSwap);
    // ADD ADDITIONAL ROUTES HERE

    // Register our front-end UI routes.
    app.use('/', express.static(__dirname + '/ui'));

    // Every route requires authorization.
    app.get('/', routes.auth.checkSession, function (request, response) {
        response.json({
            access_token: request.session.ticket
        });
    });

    // Display the startup message.
    function onListen() {
        console.log('SKY API Auth Code Flow app running for http://localhost:%s/', process.env.PORT);
    }

    // Start the server.
    http.createServer(app).listen(process.env.PORT, onListen);
}());
