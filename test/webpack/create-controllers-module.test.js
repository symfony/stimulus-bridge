/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const createControllersModule = require('../../dist/webpack/create-controllers-module');

describe('createControllersModule', () => {
    describe('empty.json', () => {
        it('must return an empty file', () => {
            const config = require('../fixtures/empty.json');
            expect(createControllersModule(config)).toEqual('export default {\n};');
        });
    });

    describe('disabled-controller.json', () => {
        it('must return an empty file', () => {
            const config = require('../fixtures/disabled-controller.json');
            expect(createControllersModule(config)).toEqual('export default {\n};');
        });
    });

    describe('disabled-autoimport.json', () => {
        it('must return file with no autoimport', () => {
            const config = require('../fixtures/disabled-autoimport.json');
            expect(createControllersModule(config)).toEqual(
                "export default {\n  '@symfony/mock-module/mock': import(/* webpackMode: \"lazy\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });

    describe('eager-no-autoimport.json', () => {
        it('must return file with no autoimport', () => {
            const config = require('../fixtures/eager-no-autoimport.json');
            expect(createControllersModule(config)).toEqual(
                "export default {\n  '@symfony/mock-module/mock': import(/* webpackMode: \"eager\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });

    describe('lazy-autoimport.json', () => {
        it('must return a file with the enabled controller', () => {
            const config = require('../fixtures/lazy-autoimport.json');
            expect(createControllersModule(config)).toEqual(
                "import '@symfony/mock-module/dist/style.css';\nexport default {\n  '@symfony/mock-module/mock': import(/* webpackMode: \"lazy\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });
});
