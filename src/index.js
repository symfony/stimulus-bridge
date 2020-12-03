/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

import { Application } from 'stimulus';
import { definitionsFromContext } from 'stimulus/webpack-helpers';
import symfonyControllers from '@symfony/controllers';

export function startStimulusApp(context) {
    const application = Application.start();
    application.load(definitionsFromContext(context));

    for (let controllerName in symfonyControllers) {
        if (!symfonyControllers.hasOwnProperty(controllerName)) {
            continue;
        }

        symfonyControllers[controllerName].then((module) => {
            application.register(controllerName, module.default);
        });
    }

    return application;
}
