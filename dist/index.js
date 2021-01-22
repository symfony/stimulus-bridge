/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startStimulusApp = startStimulusApp;

var _stimulus = require("stimulus");

var _webpackHelpers = require("stimulus/webpack-helpers");

var _controllers = _interopRequireDefault(require("./webpack/loader!@symfony/stimulus-bridge/controllers.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// The @symfony/stimulus-bridge/controllers.json should be changed
// to point to the real controllers.json file via a Webpack alias
function startStimulusApp(context) {
  var application = _stimulus.Application.start();

  if (context) {
    application.load((0, _webpackHelpers.definitionsFromContext)(context));
  }

  var _loop = function _loop(controllerName) {
    if (!_controllers["default"].hasOwnProperty(controllerName)) {
      return "continue";
    }

    _controllers["default"][controllerName].then(function (module) {
      application.register(controllerName, module["default"]);
    });
  };

  for (var controllerName in _controllers["default"]) {
    var _ret = _loop(controllerName);

    if (_ret === "continue") continue;
  }

  return application;
}