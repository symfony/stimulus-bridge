/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

var VirtualModulesPlugin = require('webpack-virtual-modules');

var createAutoimportVirtualModule = require('./create-autoimport-module');

var createControllersVirtualModule = require('./create-controllers-module');

module.exports = function createStimulusBridgePlugin(config) {
  return new VirtualModulesPlugin({
    'node_modules/@symfony/autoimport.js': createAutoimportVirtualModule(config),
    'node_modules/@symfony/controllers.js': createControllersVirtualModule(config)
  });
};