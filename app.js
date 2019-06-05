/* app.js

	Copyright 2017 Fast Dog Coding, LLC

	Licensed under the Apache License, Version 2.0 (the "License"); you may not
	use this file except in compliance with the License. You may obtain a copy
	of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
	WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
	License for the specific language governing permissions and limitations
	under the License.
*/
'use strict';

// Required modules
const express = require('express');
const hbs = require('hbs');
const cfenv = require('cfenv');
const database = require('./database');

// create a new express server
let app = express();

// express set up
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
let appEnv = cfenv.getAppEnv(require('./config'));
database.init(appEnv, 'cloudant-resume-fdc');

// set up handlebars view plugin (hbs)
hbs.registerPartials(__dirname + '/views/partials', () => {
  console.log('- Handlebars: partials loaded.');
});

// Routes
app.get('/', (req, res, next) => {
  database.getResume('resume-default')
    .then(resume => {
      // console.log('Resume: ', resume);
      res.status(200)
        .render('layout', resume);
    })
    .catch(error => next(error));
});

app.get('/chart', (req, res, next) => {
  database.getDocument('chartData-goals')
    .then(doc => {
      res.status(200)
        .json(doc.data);
    })
    .catch(error => next(error));
});

// Error handler
app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  // err.name       = err.name || 'Error';
  err.statusCode = err.statusCode || 500;
  // err.message    = (err.message ? err.message : err.error);
  console.dir(err);

  // console.error(err);
  res.status(err.statusCode)
    .render('layout', err);
});

// Start server on the specified port and binding host
app.listen(appEnv.port || '3002', appEnv.bind, function () {
  console.log("Started server listening at " + appEnv.url);
});
