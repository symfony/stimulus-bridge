/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

var generateLazyController = require('./generate-lazy-controller');

module.exports = function createControllersModule(config) {
  var controllerContents = 'export default {';
  var autoImportContents = '';
  var hasLazyControllers = false;
  var deprecations = [];

  if ('undefined' !== typeof config['placeholder']) {
    throw new Error('Your controllers.json file was not found. Be sure to add a Webpack alias from "@symfony/stimulus-bridge/controllers.json" to *your* controllers.json file.');
  }

  if ('undefined' === typeof config['controllers']) {
    throw new Error('Your Stimulus configuration file (assets/controllers.json) lacks a "controllers" key.');
  }

  for (var packageName in config.controllers) {
    var packageConfig = void 0;

    try {
      packageConfig = require(packageName + '/package.json');
    } catch (e) {
      throw new Error("The file \"".concat(packageName, "/package.json\" could not be found. Try running \"yarn install --force\"."));
    }

    for (var controllerName in config.controllers[packageName]) {
      var controllerReference = packageName + '/' + controllerName; // Normalize the controller name: remove the initial @ and use Stimulus format

      var controllerNormalizedName = controllerReference.substr(1).replace(/_/g, '-').replace(/\//g, '--'); // Find package config for the controller

      if ('undefined' === typeof packageConfig.symfony.controllers[controllerName]) {
        throw new Error('Controller "' + controllerReference + '" does not exist in the package and cannot be compiled.');
      }

      var controllerPackageConfig = packageConfig.symfony.controllers[controllerName];
      var controllerUserConfig = config.controllers[packageName][controllerName];

      if (!controllerUserConfig.enabled) {
        continue;
      }

      var controllerMain = packageName + '/' + controllerPackageConfig.main;
      var fetchMode = 'eager';

      if ('undefined' !== typeof controllerUserConfig.webpackMode) {
        deprecations.push('The "webpackMode" config key is deprecated in controllers.json. Use "fetch" instead, set to either "eager" or "lazy".');
      }

      if ('undefined' !== typeof controllerUserConfig.fetch) {
        if (!['eager', 'lazy'].includes(controllerUserConfig.fetch)) {
          throw new Error("Invalid \"fetch\" value \"".concat(controllerUserConfig.fetch, "\" in controllers.json. Expected \"eager\" or \"lazy\"."));
        }

        fetchMode = controllerUserConfig.fetch;
      }

      var moduleValueContents = "import(/* webpackMode: \"eager\" */ '".concat(controllerMain, "')");

      if (fetchMode === 'lazy') {
        hasLazyControllers = true;
        moduleValueContents = "\nnew Promise((resolve, reject) => resolve({ default:\n".concat(generateLazyController(controllerMain, 6), "\n  }))\n                ").trim();
      }

      controllerContents += "\n  '".concat(controllerNormalizedName, "': ").concat(moduleValueContents, ",");

      for (var autoimport in controllerUserConfig.autoimport || []) {
        if (controllerUserConfig.autoimport[autoimport]) {
          autoImportContents += "import '" + autoimport + "';\n";
        }
      }
    }
  }

  if (hasLazyControllers) {
    controllerContents = "import { Controller } from 'stimulus';\n".concat(controllerContents);
  }

  return {
    finalSource: "".concat(autoImportContents).concat(controllerContents, "\n};"),
    deprecations: deprecations
  };
};