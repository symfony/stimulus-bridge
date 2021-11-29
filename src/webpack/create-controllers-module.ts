/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

import generateLazyController from './generate-lazy-controller';

export default function createControllersModule(config) {
    let controllerContents = 'export default {';
    let autoImportContents = '';
    let hasLazyControllers = false;
    const deprecations = [];

    if ('undefined' !== typeof config['placeholder']) {
        throw new Error(
            'Your controllers.json file was not found. Be sure to add a Webpack alias from "@symfony/stimulus-bridge/controllers.json" to *your* controllers.json file.'
        );
    }

    if ('undefined' === typeof config['controllers']) {
        throw new Error('Your Stimulus configuration file (assets/controllers.json) lacks a "controllers" key.');
    }

    for (const packageName in config.controllers) {
        let packageConfig;
        try {
            packageConfig = require(packageName + '/package.json');
        } catch (e) {
            throw new Error(
                `The file "${packageName}/package.json" could not be found. Try running "yarn install --force".`
            );
        }

        for (const controllerName in config.controllers[packageName]) {
            const controllerReference = packageName + '/' + controllerName;
            // Normalize the controller name: remove the initial @ and use Stimulus format
            const controllerNormalizedName = controllerReference.substr(1).replace(/_/g, '-').replace(/\//g, '--');

            // Find package config for the controller
            if ('undefined' === typeof packageConfig.symfony.controllers[controllerName]) {
                throw new Error(
                    'Controller "' + controllerReference + '" does not exist in the package and cannot be compiled.'
                );
            }

            const controllerPackageConfig = packageConfig.symfony.controllers[controllerName];
            const controllerUserConfig = config.controllers[packageName][controllerName];

            if (!controllerUserConfig.enabled) {
                continue;
            }

            const controllerMain = packageName + '/' + controllerPackageConfig.main;
            let fetchMode = 'eager';

            if ('undefined' !== typeof controllerUserConfig.webpackMode) {
                deprecations.push(
                    'The "webpackMode" config key is deprecated in controllers.json. Use "fetch" instead, set to either "eager" or "lazy".'
                );
            }

            if ('undefined' !== typeof controllerUserConfig.fetch) {
                if (!['eager', 'lazy'].includes(controllerUserConfig.fetch)) {
                    throw new Error(
                        `Invalid "fetch" value "${controllerUserConfig.fetch}" in controllers.json. Expected "eager" or "lazy".`
                    );
                }

                fetchMode = controllerUserConfig.fetch;
            }

            let moduleValueContents = `import(/* webpackMode: "eager" */ '${controllerMain}')`;
            if (fetchMode === 'lazy') {
                hasLazyControllers = true;
                moduleValueContents = `
new Promise((resolve, reject) => resolve({ default:
${generateLazyController(controllerMain, 6)}
  }))
                `.trim();
            }

            controllerContents += `\n  '${controllerNormalizedName}': ${moduleValueContents},`;

            for (const autoimport in controllerUserConfig.autoimport || []) {
                if (controllerUserConfig.autoimport[autoimport]) {
                    autoImportContents += "import '" + autoimport + "';\n";
                }
            }
        }
    }

    if (hasLazyControllers) {
        controllerContents = `import { Controller } from '@hotwired/stimulus';\n${controllerContents}`;
    }

    return {
        finalSource: `${autoImportContents}${controllerContents}\n};`,
        deprecations,
    };
}
