/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const generateLazyController = require('../../dist/webpack/generate-lazy-controller');
const babelParser = require('@babel/parser');
const babelTypes = require('@babel/types');

describe('generateLazyControllerModule', () => {
    describe('generateLazyController()', () => {
        it('must return a functional ES5 class', () => {
            const controllerCode =
                "const Controller = require('stimulus');\n" +
                // this, for some reason, is undefined in a test but populated in a real situation
                // this avoid an explosion since it is undefined here
                'Controller.prototype = {};\n' +
                generateLazyController('@symfony/some-module/dist/controller.js');
            const result = babelParser.parse(controllerCode, {
                sourceType: 'module',
            });
            expect(babelTypes.isNode(result)).toBeTruthy();

            const lazyControllerClass = eval(`${controllerCode}`);
            // if all goes correctly, the prototype should have a Controller key
            expect(Object.getPrototypeOf(lazyControllerClass)).toHaveProperty('Controller');
        });
    });
});
