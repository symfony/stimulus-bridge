/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

module.exports = function createControllersModule(config) {
  var controllerContents = 'export default {';
  var autoImportContents = '';

  if ('undefined' !== typeof config['placeholder']) {
    throw new Error('Your controllers.json file was not found. Be sure to add a Webpack alias from "@symfony/stimulus-bridge/controllers.json" to *your* controllers.json file.');
  }

  if ('undefined' === typeof config['controllers']) {
    throw new Error('Your Stimulus configuration file (assets/controllers.json) lacks a "controllers" key.');
  }

  for (var packageName in config.controllers) {
    var packageConfig = require(packageName + '/package.json');

    for (var controllerName in config.controllers[packageName]) {
      var controllerReference = packageName + '/' + controllerName; // Find package config for the controller

      if ('undefined' === typeof packageConfig.symfony.controllers[controllerName]) {
        throw new Error('Controller "' + controllerReference + '" does not exist in the package and cannot be compiled.');
      }

      var controllerPackageConfig = packageConfig.symfony.controllers[controllerName];
      var controllerUserConfig = config.controllers[packageName][controllerName];

      if (!controllerUserConfig.enabled) {
        continue;
      }

      var controllerMain = packageName + '/' + controllerPackageConfig.main;
      var webpackMode = controllerUserConfig.webpackMode;
      controllerContents += "\n  '" + controllerReference + '\': import(/* webpackMode: "' + webpackMode + '" */ \'' + controllerMain + "'),";

      for (var autoimport in controllerUserConfig.autoimport || []) {
        if (controllerUserConfig.autoimport[autoimport]) {
          autoImportContents += "import '" + autoimport + "';\n";
        }
      }
    }
  }

  return "".concat(autoImportContents).concat(controllerContents, "\n};");
};