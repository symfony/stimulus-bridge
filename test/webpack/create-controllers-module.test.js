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
            expect(createControllersModule(config).finalSource).toEqual('export default {\n};');
        });
    });

    describe('disabled-controller.json', () => {
        it('must return an empty file', () => {
            const config = require('../fixtures/disabled-controller.json');
            expect(createControllersModule(config).finalSource).toEqual('export default {\n};');
        });
    });

    describe('disabled-autoimport.json', () => {
        it('must return file with no autoimport', () => {
            const config = require('../fixtures/disabled-autoimport.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "export default {\n  'symfony--mock-module--mock': import(/* webpackMode: \"eager\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });

    describe('eager-no-autoimport.json', () => {
        it('must return file with no autoimport', () => {
            const config = require('../fixtures/eager-no-autoimport.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "export default {\n  'symfony--mock-module--mock': import(/* webpackMode: \"eager\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });

    describe('deprecated-webpack-mode.json', () => {
        it('must return eager mode with deprecation', () => {
            const config = require('../fixtures/deprecated-webpack-mode.json');
            const result = createControllersModule(config);
            expect(result.finalSource).toEqual(
                "export default {\n  'symfony--mock-module--mock': import(/* webpackMode: \"eager\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
            expect(result.deprecations).toHaveLength(1);
        });
    });

    describe('eager-autoimport.json', () => {
        it('must return a file with the enabled controller and auto-import', () => {
            const config = require('../fixtures/eager-autoimport.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "import '@symfony/mock-module/dist/style.css';\nexport default {\n  'symfony--mock-module--mock': import(/* webpackMode: \"eager\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });

    describe('lazy-controller-no-autoimport.json', () => {
        it('must return a file with a lazy controller', () => {
            const config = require('../fixtures/lazy-no-autoimport.json');
            expect(createControllersModule(config).finalSource).toEqual(
                `
import { Controller } from '@hotwired/stimulus';
export default {
  'symfony--mock-module--mock': new Promise((resolve, reject) => resolve({ default:
      (function() {
          function LazyController(context) {
              this.__stimulusLazyController = true;
              Controller.call(this, context);
          }
          LazyController.prototype = Object.create(Controller && Controller.prototype, {
              constructor: { value: LazyController, writable: true, configurable: true }
          });
          Object.setPrototypeOf(LazyController, Controller);
          LazyController.prototype.initialize = function() {
              var _this = this;
              if (this.application.controllers.find(function(controller) {
                  return controller.identifier === _this.identifier && controller.__stimulusLazyController;
              })) {
                  return;
              }
              import('@symfony/mock-module/dist/controller.js').then(function(controller) {
                  _this.application.register(_this.identifier, controller.default);
              });
          }
          return LazyController;
      })()
  })),
};
                `.trim()
            );
        });
    });
});
