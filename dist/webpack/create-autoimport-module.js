/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

module.exports = function createAutoimportVirtualModule(config) {
  var file = '';

  if ('undefined' === typeof config['controllers']) {
    throw new Error('Your Stimulus configuration file (assets/controllers.json) lacks a "controllers" key.');
  }

  for (var packageName in config.controllers) {
    for (var controllerName in config.controllers[packageName]) {
      var controllerConfig = config.controllers[packageName][controllerName];

      if (!controllerConfig.enabled || 'undefined' === typeof controllerConfig.autoimport) {
        continue;
      }

      for (var autoimport in controllerConfig.autoimport) {
        if (!controllerConfig.autoimport[autoimport]) {
          continue;
        }

        file += "\nimport '" + autoimport + "';";
      }
    }
  }

  return file;
};