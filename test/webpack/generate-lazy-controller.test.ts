/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { parse } from 'acorn';
import { describe, expect, it } from 'vitest';
import generateLazyController from '../../src/webpack/generate-lazy-controller';

const wrapLazyController = (controllerString: string): string => {
    return `
        const { Controller } = require('@hotwired/stimulus');
        (function() {
            return ${controllerString}
        })()
    `;
};

describe('generateLazyControllerModule', () => {
    describe('generateLazyController()', () => {
        it('must return a functional ES6 class', () => {
            expect.assertions(3);

            const controllerCode = wrapLazyController(
                generateLazyController('@symfony/some-module/dist/controller.js', 0)
            );
            const result = parse(controllerCode, {
                ecmaVersion: 2020,
                sourceType: 'module',
            });
            expect(result.constructor.name).toBe('Node');

            // biome-ignore lint/security/noGlobalEval: We need to eval the code to test it
            const lazyControllerClass = eval(`${controllerCode}`);
            // if all goes correctly, the prototype should have a Controller key
            expect(Object.getPrototypeOf(lazyControllerClass)).toHaveProperty('targets');
            expect(controllerCode).toContain('this.application.register(this.identifier, controller.default)');
        });

        it('must return a functional ES6 class on Windows', () => {
            expect.assertions(2);

            const controllerCode = wrapLazyController(generateLazyController('C:\\\\path\\to\\file.js', 0));
            const result = parse(controllerCode, {
                ecmaVersion: 2020,
                sourceType: 'module',
            });
            expect(result.constructor.name).toBe('Node');
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
            expect.assertions(2);

            const controllerCode = wrapLazyController(
                generateLazyController('@symfony/some-module/dist/controller.js', 0, 'CustomController')
            );
            const result = parse(controllerCode, {
                ecmaVersion: 2020,
                sourceType: 'module',
            });
            expect(result.constructor.name).toBe('Node');

            expect(controllerCode).toContain('this.application.register(this.identifier, controller.CustomController)');
        });
    });
});
