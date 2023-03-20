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

export default function createControllersModule(config: any) {
    let controllerContents = 'export default {';
    let importStatementContents = '';
    let hasLazyControllers = false;

    if ('undefined' !== typeof config['placeholder']) {
        throw new Error(
            'Your controllers.json file was not found. Be sure to add a Webpack alias from "@symfony/stimulus-bridge/controllers.json" to *your* controllers.json file.'
        );
    }

    if ('undefined' === typeof config['controllers']) {
        throw new Error('Your Stimulus configuration file (assets/controllers.json) lacks a "controllers" key.');
    }

    let controllerIndex = 0;
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
            let fetchMode = controllerUserConfig.fetch || 'eager';

            let moduleValueContents = ``;
            if (fetchMode === 'eager') {
                const controllerNameForVariable = `controller_${controllerIndex++}`;
                importStatementContents += `import ${controllerNameForVariable} from '${controllerMain}';\n`;

                // simply use the imported controller
                moduleValueContents = controllerNameForVariable;
            } else if (fetchMode === 'lazy') {
                hasLazyControllers = true;
                moduleValueContents = generateLazyController(controllerMain, 2);
            } else {
                throw new Error(`Invalid fetch mode "${fetchMode}" in controllers.json. Expected "eager" or "lazy".`);
            }

            // Normalize the controller name: remove the initial @ and use Stimulus format
            let controllerNormalizedName = controllerReference.substr(1).replace(/_/g, '-').replace(/\//g, '--');
            // allow the package or user config to override name
            if ('undefined' !== typeof controllerPackageConfig.name) {
                controllerNormalizedName = controllerPackageConfig.name.replace(/\//g, '--');
            }
            if ('undefined' !== typeof controllerUserConfig.name) {
                controllerNormalizedName = controllerUserConfig.name.replace(/\//g, '--');
            }

            controllerContents += `\n  '${controllerNormalizedName}': ${moduleValueContents},`;

            for (const autoimport in controllerUserConfig.autoimport || []) {
                if (controllerUserConfig.autoimport[autoimport]) {
                    importStatementContents += "import '" + autoimport + "';\n";
                }
            }
        }
    }

    if (hasLazyControllers) {
        controllerContents = `import { Controller } from '@hotwired/stimulus';\n${controllerContents}`;
    }

    return {
        finalSource: `${importStatementContents}${controllerContents}\n};`,
        deprecations: [],
    };
}
