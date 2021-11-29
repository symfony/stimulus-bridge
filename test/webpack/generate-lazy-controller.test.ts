/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

import generateLazyController from '../../src/webpack/generate-lazy-controller';
import { parse } from '@babel/parser';
import { isNode } from '@babel/types';

describe('generateLazyControllerModule', () => {
    describe('generateLazyController()', () => {
        it('must return a functional ES5 class', () => {
            const controllerCode =
                "const Controller = require('@hotwired/stimulus');\n" +
                // this, for some reason, is undefined in a test but populated in a real situation
                // this avoid an explosion since it is undefined here
                'Controller.prototype = {};\n' +
                generateLazyController('@symfony/some-module/dist/controller.js');
            const result = parse(controllerCode, {
                sourceType: 'module',
            });
            expect(isNode(result)).toBeTruthy();

            const lazyControllerClass = eval(`${controllerCode}`);
            // if all goes correctly, the prototype should have a Controller key
            expect(Object.getPrototypeOf(lazyControllerClass)).toHaveProperty('Controller');
            expect(controllerCode).toContain('_this.application.register(_this.identifier, controller.default)');
        });

        it('must return a functional ES5 class on Windows', () => {
            const controllerCode =
                "const Controller = require('@hotwired/stimulus');\n" +
                // this, for some reason, is undefined in a test but populated in a real situation
                // this avoid an explosion since it is undefined here
                'Controller.prototype = {};\n' +
                generateLazyController('C:\\\\path\\to\\file.js');
            const result = parse(controllerCode, {
                sourceType: 'module',
            });
            expect(isNode(result)).toBeTruthy();
            /*
             * This looks insane. We're creating a string that looks like this:
             *      C:\\\\path\\to\\file.js
             *
             * We want to make sure that in the final written file, each "\"
             * is escaped properly.
             */
            expect(controllerCode).toContain(`import('C:\\\\\\\\path\\\\to\\\\file.js')`);
        });

        it('must use the correct, named export', () => {
            const controllerCode =
                "const Controller = require('@hotwired/stimulus');\n" +
                // this, for some reason, is undefined in a test but populated in a real situation
                // this avoid an explosion since it is undefined here
                'Controller.prototype = {};\n' +
                generateLazyController('@symfony/some-module/dist/controller.js', 0, 'CustomController');
            const result = parse(controllerCode, {
                sourceType: 'module',
            });
            expect(isNode(result)).toBeTruthy();
            expect(controllerCode).toContain(
                '_this.application.register(_this.identifier, controller.CustomController)'
            );
        });
    });
});
