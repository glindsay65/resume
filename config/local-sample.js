/* config/local-sample.js

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

/* ** IMPORTANT **
 *
 * This file is not useful as is.
 *
 * It contains the general expected structure for running your application
 * locally. However, it requires modifications as follows:
 *
 * 1. Copy this file to one named, local.js, in the same folder ("config").
 * 2. **DO NOT** add the new, local.js, file to your hosted VCS
 *    (like Github.) Doing so will expose your private credentials
 *    to the world.
 * 3. Edit the new local.js file to include the Cloudant credentials
 *    to YOUR instance under your IBM Bluemix Organization and Space.
 *    These credentials are available within Bluemix.
 *
 * Now, when you run locally, the application will be able to connect to
 * your Cloudant database and retrieve your data. When you run on Bluemix,
 * this connection information will be provided to your application there
 * and, therefore this file is not needed.
 *
 * The new local.js file should be included in both the .gitignore
 * and .cfignore files to prevent it from being exposed elsewhere.
 */

// Supplies Cloud Foundry service information when running locally.
module.exports = {
	"vcap": {
		"services": {
			"cloudantNoSQLDB": [
				{
					"credentials": {
						"username": "YOUR-USERNAME-bluemix",
						"password": "YOUR-PASSWORD",
						"host": "YOUR-USERNAME-bluemix.cloudant.com",
						"port": 443,
						"url": "https://YOUR-USERNAME-bluemix:YOUR-PASSWORD@YOUR-USERNAME-bluemix.cloudant.com"
					},
					"syslog_drain_url": null,
					"volume_mounts": [],
					"label": "cloudantNoSQLDB",
					"provider": null,
					"plan": "Lite",
					"name": "NAME",
					"tags": []
				}
			]
		}
	}
};
