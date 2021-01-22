/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

var LoaderDependency = require('webpack/lib/dependencies/LoaderDependency');

var createControllersModule = require('./create-controllers-module');
/**
 * Loader that processes the controllers.json file.
 *
 * This reads the controllers key and returns an object
 * where the keys are each controller name and the value
 * is the module name (or inline class for lazy controllers)
 * for that controller.
 *
 * @param {string} source controllers.json source
 * @return {string}
 */


module.exports = function (source) {
  var _this = this;

  var logger = this.getLogger('stimulus-bridge-loader');
  /*
   * The following code prevents the normal JSON loader from
   * executing after our loader. This is a workaround from WebpackEncore.
   */

  var requiredType = 'javascript/auto';

  var factory = this._compilation.dependencyFactories.get(LoaderDependency);

  if (factory === undefined) {
    throw new Error('Could not retrieve module factory for type LoaderDependency');
  }

  this._module.type = requiredType;
  this._module.generator = factory.getGenerator(requiredType);
  this._module.parser = factory.getParser(requiredType);
  /* End workaround */

  var _createControllersMod = createControllersModule(JSON.parse(source)),
      finalSource = _createControllersMod.finalSource,
      deprecations = _createControllersMod.deprecations;

  deprecations.forEach(function (message) {
    _this.emitWarning(new Error(message));
  });
  return finalSource;
};