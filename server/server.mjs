import express from 'express';
import { Issuer } from 'openid-client';
import { createServer } from 'https';
import { readFileSync } from 'fs';
import config from "../auth_config.json";

const options = {
  key: readFileSync('key.pem'),
  cert: readFileSync('cert.pem')
};

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

Issuer.discover('https://api.login.yahoo.com')
  .then(issuer => {
    const client = createClient(issuer);

    const app = express();
    // app.use(express.static('public'));
    
    app.get('/account', (req, res) => {
      res.send('my account');
    });

    app.get('/auth/yahoo', (req, res) => {
      const authUrl = client.authorizationUrl();
      res.redirect(authUrl);
    });

    app.get('/auth/yahoo/return', (req, res) => {
      const params = client.callbackParams(req);
      client.callback('https://localhost:8080/auth/yahoo/return', params)
        .then(tokenSet => {
          console.log('received and validated tokens %j', tokenSet);
          console.log('validated ID Token claims %j', tokenSet.claims());

          client.requestResource('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nba/teams', tokenSet.access_token)
            .then(response => {
              res.send(response.body);
            })
        });
    });

    createServer(options, app).listen(PORT);

    console.log(`Running on http://${HOST}:${PORT}`);
  });

function createClient(issuer) {
  console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);
  return new issuer.Client({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uris: config.redirectUris,
    response_types: ['code'],
    id_token_signed_response_alg: 'ES256'
  });
}




///
// const express = require('express');
// // const bodyParser = require('body-parser')
// const path = require('path');


// const app = express();
// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/ping', function (req, res) {
//  return res.send('pong');
// });

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// app.listen(process.env.PORT || 8080);