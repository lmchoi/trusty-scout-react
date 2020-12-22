import express from 'express';
import { createServer } from 'https';
import { readFileSync } from 'fs';
import createOAuthClient from './yahoo-client.mjs';
import { Strategy } from 'openid-client';

import expressSesssion from 'express-session';
import passport from 'passport';
import got from 'got';

const options = {
  key: readFileSync('server/key.pem'),
  cert: readFileSync('server/cert.pem')
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

  app.get('/account', (req, res) => {

    (async () => {
      const response = await got('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nba/teams', {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        }
      });
      console.log(response.body);
      console.log('fetched account');
      res.send(response.body);
    })();
  });

  app.get('/auth/yahoo', (req, res, next) => {
    passport.authenticate('oidc')(req, res, next);
  });

  app.get('/auth/yahoo/return', (req, res, next) => {
    passport.authenticate('oidc', {
      successRedirect: 'http://localhost:3000/account',
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
