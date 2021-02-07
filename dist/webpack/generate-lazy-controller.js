/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';
/**
 *
 * @param {string} controllerPath The importable path to the controller
 * @param {Number} indentationSpaces Amount each line should be indented
 */

module.exports = function generateLazyController(controllerPath, indentationSpaces) {
  var spaces = ' '.repeat(indentationSpaces);
  return "".concat(spaces, "(function() {\n").concat(spaces, "    function LazyController(context) {\n").concat(spaces, "        this.__stimulusLazyController = true;\n").concat(spaces, "        Controller.call(this, context);\n").concat(spaces, "    }\n").concat(spaces, "    LazyController.prototype = Object.create(Controller && Controller.prototype, {\n").concat(spaces, "        constructor: { value: LazyController, writable: true, configurable: true }\n").concat(spaces, "    });\n").concat(spaces, "    Object.setPrototypeOf(LazyController, Controller);\n").concat(spaces, "    LazyController.prototype.initialize = function() {\n").concat(spaces, "        var _this = this;\n").concat(spaces, "        if (this.application.controllers.find(function(controller) {\n").concat(spaces, "            return controller.identifier === _this.identifier && controller.__stimulusLazyController;\n").concat(spaces, "        })) {\n").concat(spaces, "            return;\n").concat(spaces, "        }\n").concat(spaces, "        import('").concat(controllerPath.replace(/\\/g, '\\\\'), "').then(function(controller) {\n").concat(spaces, "            _this.application.register(_this.identifier, controller.default);\n").concat(spaces, "        });\n").concat(spaces, "    }\n").concat(spaces, "    return LazyController;\n").concat(spaces, "})()");
};