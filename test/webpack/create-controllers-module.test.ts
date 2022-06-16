/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

import createControllersModule from '../../src/webpack/create-controllers-module';

describe('createControllersModule', () => {
    describe('empty.json', () => {
        it('must return an empty file', () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const config = require('../fixtures/empty.json');
            expect(createControllersModule(config).finalSource).toEqual('export default {\n};');
        });
    });

    describe('disabled-controller.json', () => {
        it('must return an empty file', () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const config = require('../fixtures/disabled-controller.json');
            expect(createControllersModule(config).finalSource).toEqual('export default {\n};');
        });
    });

    describe('disabled-autoimport.json', () => {
        it('must return file with no autoimport', () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const config = require('../fixtures/disabled-autoimport.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "export default {\n  'symfony--mock-module--mock': import(/* webpackMode: \"eager\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });

    describe('eager-no-autoimport.json', () => {
        it('must return file with no autoimport', () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const config = require('../fixtures/eager-no-autoimport.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "export default {\n  'symfony--mock-module--mock': import(/* webpackMode: \"eager\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });

    describe('deprecated-webpack-mode.json', () => {
        it('must return eager mode with deprecation', () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
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
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const config = require('../fixtures/eager-autoimport.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "import '@symfony/mock-module/dist/style.css';\nexport default {\n  'symfony--mock-module--mock': import(/* webpackMode: \"eager\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });

    describe('lazy-controller-no-autoimport.json', () => {
        it('must return a file with a lazy controller', () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const config = require('../fixtures/lazy-no-autoimport.json');
            expect(createControllersModule(config).finalSource).toEqual(
                `
import { Controller } from '@hotwired/stimulus';
export default {
  'symfony--mock-module--mock': new Promise((resolve, reject) => resolve({ default:
      (function() {
          return class LazyController extends Controller {
              constructor(context) {
                  super(context);
                  this.__stimulusLazyController = true;
              }
              initialize() {
                  if (this.application.controllers.find((controller) => {
                      return controller.identifier === this.identifier && controller.__stimulusLazyController;
                  })) {
                      return;
                  }
                  import('@symfony/mock-module/dist/controller.js').then((controller) => {
                      this.application.register(this.identifier, controller.default);
                  });
              }
          }
      })()
  })),
};
                `.trim()
            );
        });
    });

    describe('load-named-controller.json', () => {
        it('must register the custom name from package\'s package.json', () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const config = require('../fixtures/load-named-controller.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "export default {\n  'foo--custom_name': import(/* webpackMode: \"eager\" */ '@symfony/mock-module/dist/named_controller.js'),\n};"
            );
        });
    });

    describe('override-name.json', () => {
        it('must use the overridden "name" from user\'s config', () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const config = require('../fixtures/override-name.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "export default {\n  'foo--overridden_name': import(/* webpackMode: \"eager\" */ '@symfony/mock-module/dist/controller.js'),\n};"
            );
        });
    });
});
