/* database/index.js

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

const Cloudant = require('@cloudant/cloudant');
let instance = null;
let contentDb = null;

/**
 * From a list of Cloudant `_id`s, fetches the documents and builds an
 * array of them to return.
 *
 * @param ids - array of ids to lookup
 * @returns {*}
 */
function expandContent(ids) {
  if (ids) {
    return fetchDocuments(ids)
      .then(bulk => {
        if (bulk.rows) {
          // Turn the fetch results into Promises that process each new doc.
          return Promise.all(
            // Use a reduce function to accumulate an array of only
            // those result rows that have a document.
            bulk.rows.reduce((acc, row) => {
              if (row.doc) {
                acc.push(processDocument(row.doc));
              }
              return acc;
            }, []))
            .then(newContent => {
              // console.log('newContent:', newContent);
              return Promise.resolve(newContent);
            });
        } else {
          return Promise.resolve(null);
        }
      });
  } else {
    return Promise.resolve(null);
  }
}

/**
 * Collects multiple documents by key with one call.
 *
 * @param ids - an Array of document `_id`s to collect.
 * @returns {Promise}
 */
function fetchDocuments(ids) {
  return new Promise((resolve, reject) => {
    if (contentDb) {
      contentDb.fetch({ keys: ids }, null, (err, bulk) => {
        if (err) {
          return reject(err);
        }
        resolve(bulk);
      });
    } else {
      let err = new Error('Internal Server Error');
      err.statusCode = 500;
      err.reason = 'Cloudant database not opened';
      reject(err);
    }
  });
}

/**
 * Generic Cloudant document getter. Wrapped in a Promise.
 * @param id - `_id` of the document to retrieve.
 * @returns {Promise}
 */
function getDocument(id) {
  return new Promise((resolve, reject) => {
    if (contentDb) {
      contentDb.get(id, { include_docs: true }, (err, doc) => {
        if (err) {
          return reject(err);
        }
        resolve(doc);
      });
    } else {
      reject(new Error('Cloudant database not opened'));
    }
  });
}

/**
 * Document's content property (Array) is converted from `_id`s to
 * the actual docs.
 *
 * @param doc - Cloudant document
 * @returns {Promise}
 */
function processDocument(doc) {
  return expandContent(doc.content)
    .then(newContent => {
      if (newContent) {
        doc.content = newContent;
      }
      return Promise.resolve(doc);
    })
    .then(doc => {
      // Reverse sort the skills array, when it shows up
      if (doc.skills) {
        doc.skills.sort((a, b) => {
          // Descending
          return b.level - a.level;
        });
      }
      return Promise.resolve(doc);
    });
}

module.exports = {
  init: (appEnv, name) => {
    // Cloudant may return a status code 429 when too many calls are made
    // (above the threshold for the tier being used.) The built-in "retry"
    // plugin automatically retries the calls with an exponential back-off.
    let opts = {
      url: appEnv.getServiceCreds(name).url,
      plugin: 'retry',
      retryAttempts: 5,
      retryTimeout: 250
    };
    Cloudant(opts, (err, cloudant) => {
      if (err) {
        return console.error('Failed to initialize Cloudant', err);
      }
      instance = cloudant;
      contentDb = instance.db.use('content');
      return console.log('- Cloudant initialized');
    });
  },

  getResume: (id) => {
    return getDocument(id)
      .then(resume => {
        return processDocument(resume);
      });
  },

  getDocument
};
