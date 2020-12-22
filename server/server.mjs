import express from 'express';
import { createServer } from 'https';
import { readFileSync } from 'fs';
import createOAuthClient from './yahoo-client.mjs';
import { Strategy } from 'openid-client';

import expressSesssion from 'express-session';
import passport from 'passport';

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
      return done(null, tokenSet.claims());
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  app.get('/account', (req, res) => {
    res.send('my account');
  });

  app.get('/auth/yahoo', (req, res, next) => {
    passport.authenticate('oidc')(req, res, next);
  });

  app.get('/auth/yahoo/return', (req, res, next) => {
    passport.authenticate('oidc', {
      successRedirect: '/account',
      failureRedirect: '/'
    })(req, res, next);
  });

  createServer(options, app).listen(PORT);

  console.log(`Running on http://${HOST}:${PORT}`);
});
