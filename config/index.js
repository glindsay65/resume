/* config/index.js

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

// Supplies the required configuration, if running locally.
'use strict';

// This code looks for a local.js to be present in the same folder. This
// file is deliberately excluded. The file contains sensitive credentials,
// in this case, for logging into the database.
try {
	module.exports = require('./local');
	console.log('- Using local config');
} catch (ex) {
	module.exports = {};
}
