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
    const spaces = ' '.repeat(indentationSpaces);

    return `${spaces}(function() {
${spaces}    function LazyController(context) {
${spaces}        this.__stimulusLazyController = true;
${spaces}        Controller.call(this, context);
${spaces}    }
${spaces}    LazyController.prototype = Object.create(Controller && Controller.prototype, {
${spaces}        constructor: { value: LazyController, writable: true, configurable: true }
${spaces}    });
${spaces}    Object.setPrototypeOf(LazyController, Controller);
${spaces}    LazyController.prototype.initialize = function() {
${spaces}        var _this = this;
${spaces}        if (this.application.controllers.find(function(controller) {
${spaces}            return controller.identifier === _this.identifier && controller.__stimulusLazyController;
${spaces}        })) {
${spaces}            return;
${spaces}        }
${spaces}        import('${controllerPath.replace(/\\/g, '\\\\')}').then(function(controller) {
${spaces}            _this.application.register(_this.identifier, controller.default);
${spaces}        });
${spaces}    }
${spaces}    return LazyController;
${spaces}})()`;
};
