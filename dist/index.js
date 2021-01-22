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

  var _loop = function _loop(_controllerName) {
    if (!_controllers["default"].hasOwnProperty(_controllerName)) {
      controllerName = _controllerName;
      return "continue";
    }

    _controllers["default"][_controllerName].then(function (module) {
      // Normalize the controller name: remove the initial @ and use Stimulus format
      _controllerName = _controllerName.substr(1).replace(/_/g, '-').replace(/\//g, '--');
      application.register(_controllerName, module["default"]);
    });

    controllerName = _controllerName;
  };

  for (var controllerName in _controllers["default"]) {
    var _ret = _loop(controllerName);

    if (_ret === "continue") continue;
  }

  return application;
}