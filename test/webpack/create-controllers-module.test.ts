/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import createControllersModule from '../../src/webpack/create-controllers-module';

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
                "import controller_0 from '@symfony/mock-module/dist/controller.js';\nexport default {\n  'symfony--mock-module--mock': controller_0,\n};"
            );
        });
    });

    describe('eager-no-autoimport.json', () => {
        it('must return file with no autoimport', () => {
            const config = require('../fixtures/eager-no-autoimport.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "import controller_0 from '@symfony/mock-module/dist/controller.js';\nexport default {\n  'symfony--mock-module--mock': controller_0,\n};"
            );
        });
    });

    describe('eager-autoimport.json', () => {
        it('must return a file with the enabled controller and auto-import', () => {
            const config = require('../fixtures/eager-autoimport.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "import controller_0 from '@symfony/mock-module/dist/controller.js';\nimport '@symfony/mock-module/dist/style.css';\nexport default {\n  'symfony--mock-module--mock': controller_0,\n};"
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
  'symfony--mock-module--mock': class extends Controller {
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
  },
};
                `.trim()
            );
        });
    });

    describe('load-named-controller.json', () => {
        it("must register the custom name from package's package.json", () => {
            const config = require('../fixtures/load-named-controller.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "import controller_0 from '@symfony/mock-module/dist/named_controller.js';\nexport default {\n  'foo--custom_name': controller_0,\n};"
            );
        });
    });

    describe('override-name.json', () => {
        it('must use the overridden "name" from user\'s config', () => {
            const config = require('../fixtures/override-name.json');
            expect(createControllersModule(config).finalSource).toEqual(
                "import controller_0 from '@symfony/mock-module/dist/controller.js';\nexport default {\n  'foo--overridden_name': controller_0,\n};"
            );
        });
    });
});
