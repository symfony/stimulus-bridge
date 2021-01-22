/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

var webpack = require('webpack');

module.exports = function createStimulusBridgePlugin(controllersJsonPath) {
  return new webpack.NormalModuleReplacementPlugin(/stimulus-bridge\/controllers-placeholder\.json$/, function (resource) {
    // controls how the import string will be parsed, includes loader
    resource.request = "./webpack/loader!".concat(controllersJsonPath); // controls the physical file that will be read

    resource.createData.resource = controllersJsonPath;
  });
};