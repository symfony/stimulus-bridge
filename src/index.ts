/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

import { Application } from '@hotwired/stimulus';
import { definitionsFromContext } from '@hotwired/stimulus-webpack-helpers';

// The @symfony/stimulus-bridge/controllers.json should be changed
// to point to the real controllers.json file via a Webpack alias
// @ts-ignore: Unable to find module
import symfonyControllers from './webpack/loader!@symfony/stimulus-bridge/controllers.json';

export function startStimulusApp(context: any) {
    const application = Application.start();

    if (context) {
        application.load(definitionsFromContext(context));
    }

    for (const controllerName in symfonyControllers) {
        // eslint-disable-next-line no-prototype-builtins
        if (!symfonyControllers.hasOwnProperty(controllerName)) {
            continue;
        }

        symfonyControllers[controllerName].then((module: any) => {
            application.register(controllerName, module.default);
        });
    }

    return application;
}
