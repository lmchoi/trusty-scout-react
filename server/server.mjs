import express from 'express';
import { createServer } from 'https';
import { readFileSync } from 'fs';
import createOAuthClient from './yahoo-client.mjs';
import { Strategy } from 'openid-client';

import expressSesssion from 'express-session';
import passport from 'passport';
import Scout from './scout.mjs';
import StatsFetcher from './stats-fetcher.mjs';

const options = {
  key: readFileSync('key.pem'),
  cert: readFileSync('cert.pem')
};

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

createOAuthClient().then(client => {
  const app = express();
  app.use(
    expressSesssion({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    'oidc',
    new Strategy({ client }, (tokenSet, userinfo, done) => {
      const userObj = Object.assign(tokenSet.claims(), { token: tokenSet.access_token });
      return done(null, userObj);
    })
  );

  passport.serializeUser(function (req, user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (req, user, done) {
    done(null, user);
  });

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });

  app.get('/matchup', (req, res) => {
    const scout = new Scout();
    // TODO write test week is a number with === 
    scout.report(req.user, Number(req.query.week)).then(r => res.send(r));
  });

  app.get('/fetchstats', (req, res) => {
    const fetcher = new StatsFetcher();
    fetcher.fetch().then(s => res.send(s));
  });

  app.get('/fetchgamestats', (req, res) => {
    const fetcher = new StatsFetcher();
    fetcher.fetchGameStats(req.query.gameId).then(s => res.send(s));
  });

  app.get('/auth/yahoo', (req, res, next) => {
    passport.authenticate('oidc')(req, res, next);
  });

  app.get('/auth/yahoo/return', (req, res, next) => {
    passport.authenticate('oidc', {
      successRedirect: 'http://localhost:3000/return',
      failureRedirect: '/'
    })(req, res, next);
  });

  app.get('/auth/yahoo/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000');
  });

  createServer(options, app).listen(PORT);

  console.log(`Running on http://${HOST}:${PORT}`);
});
