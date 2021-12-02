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
        it('must return a functional ES6 class', () => {
            const controllerCode =
                "const { Controller } = require('@hotwired/stimulus');\n" +
                generateLazyController('@symfony/some-module/dist/controller.js', 0);
            const result = parse(controllerCode, {
                sourceType: 'module',
            });
            expect(isNode(result)).toBeTruthy();

            const lazyControllerClass = eval(`${controllerCode}`);
            // if all goes correctly, the prototype should have a Controller key
            expect(Object.getPrototypeOf(lazyControllerClass)).toHaveProperty('targets');
            expect(controllerCode).toContain('this.application.register(this.identifier, controller.default)');
        });

        it('must return a functional ES5 class on Windows', () => {
            const controllerCode =
                "const { Controller } = require('@hotwired/stimulus');\n" +
                generateLazyController('C:\\\\path\\to\\file.js', 0);
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
                "const { Controller } = require('@hotwired/stimulus');\n" +
                generateLazyController('@symfony/some-module/dist/controller.js', 0, 'CustomController');
            const result = parse(controllerCode, {
                sourceType: 'module',
            });
            expect(isNode(result)).toBeTruthy();
            expect(controllerCode).toContain(
                'this.application.register(this.identifier, controller.CustomController)'
            );
        });
    });
});
