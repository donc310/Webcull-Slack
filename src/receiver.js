const config = require('./config');
const { ExpressReceiver } = require('@slack/bolt');
const { InstallProvider } = require('@slack/oauth');
const { authenticate } = require('./api/webcull');
const {
  storeTeamInfo,
  storeUserInfo,
  fetchInstallationInfo,
} = require('./utils');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const jsonParser = bodyParser.json();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
});

const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  authVersion: 'v2',
  stateSecret: process.env.INSTALLATION_STATE_SECRET,
  installationStore: {
    storeInstallation: (installation) => {
      return storeTeamInfo(installation);
    },
    fetchInstallation: (InstallQuery) => {
      return fetchInstallationInfo(InstallQuery.teamId);
    },
  },
});

const callbackOptions = {
  success: async (installation, installOptions, req, res) => {
    try {
      await storeUserInfo(installation, installOptions);
      res.send('successful!');
    } catch (error) {
      res.send(String(error));
    }
  },
  failure: (error, installOptions, req, res) => {
    res.send('failure');
    console.log(error);
  },
};

receiver.app.set('views', path.join(__dirname, 'views'));
receiver.app.set('view engine', 'ejs');
receiver.app.use(express.static(path.join(__dirname, 'public')));
receiver.router.get('/', (req, res) => res.redirect('/slack/install'));

receiver.router.post(
  '/slack/authenticate',
  jsonParser,
  async (req, res, next) => {
    try {
      const payLoad = req.body;
      if (payLoad && payLoad.email && payLoad.password) {
        const { data } = await authenticate(payLoad.email, payLoad.password);
        if (data.success === 'true') {
          const url = await installer.generateInstallUrl({
            scopes: config.scopes,
            redirectUri: config.appHome + '/slack/oauth_redirect',
            metadata: JSON.stringify(data),
          });
          res.status(200).json({
            success: true,
            user: data.name,
            icon: data.icon,
            authLink: url,
          });
        } else {
          res.status(200).json({
            success: false,
            reason: Object.values(data),
          });
        }
      } else {
        res.status(200).json({
          success: false,
          reason: ['email and password is required'],
        });
      }
    } catch (error) {
      res.status(200).json({
        success: false,
        reason: [String(error)],
      });
    }
  },
);
receiver.router.get('/slack/install', async (req, res, next) => {
  try {
    res.render('pages/install', {
      authLink: config.appHome + '/slack/authenticate',
    });
  } catch (error) {
    console.log(error);
  }
});
receiver.router.get('/slack/oauth_redirect', async (req, res) => {
  await installer.handleCallback(req, res, callbackOptions);
});
module.exports = {
  receiver,
};
