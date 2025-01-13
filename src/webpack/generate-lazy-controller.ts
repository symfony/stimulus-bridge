/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 *
 * @param {string} controllerPath The importable path to the controller
 * @param {Number} indentationSpaces Amount each line should be indented
 * @param {string} exportName The name of the module that's exported from the controller
 */
export default function (controllerPath: string, indentationSpaces: number, exportName = 'default') {
    const spaces = ' '.repeat(indentationSpaces);

    return `class extends Controller {
${spaces}    constructor(context) {
${spaces}        super(context);
${spaces}        this.__stimulusLazyController = true;
${spaces}    }
${spaces}    initialize() {
${spaces}        if (this.application.controllers.find((controller) => {
${spaces}            return controller.identifier === this.identifier && controller.__stimulusLazyController;
${spaces}        })) {
${spaces}            return;
${spaces}        }
${spaces}        import('${controllerPath.replace(/\\/g, '\\\\')}').then((controller) => {
${spaces}            this.application.register(this.identifier, controller.${exportName});
${spaces}        });
${spaces}    }
${spaces}}`;
}
