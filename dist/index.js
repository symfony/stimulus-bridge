import { Application } from '@hotwired/stimulus';
import symfonyControllers from './webpack/loader!@symfony/stimulus-bridge/controllers.json';

/*
Stimulus Webpack Helpers 1.0.0
Copyright © 2021 Basecamp, LLC
 */
function definitionsFromContext(context) {
    return context.keys()
        .map((key) => definitionForModuleWithContextAndKey(context, key))
        .filter((value) => value);
}
function definitionForModuleWithContextAndKey(context, key) {
    const identifier = identifierForContextKey(key);
    if (identifier) {
        return definitionForModuleAndIdentifier(context(key), identifier);
    }
}
function definitionForModuleAndIdentifier(module, identifier) {
    const controllerConstructor = module.default;
    if (typeof controllerConstructor == "function") {
        return { identifier, controllerConstructor };
    }
}
function identifierForContextKey(key) {
    const logicalName = (key.match(/^(?:\.\/)?(.+)(?:[_-]controller\..+?)$/) || [])[1];
    if (logicalName) {
        return logicalName.replace(/_/g, "-").replace(/\//g, "--");
    }
}

function startStimulusApp(context) {
    const application = Application.start();
    if (process.env.NODE_ENV === 'development') {
        application.debug = true;
    }
    if (context) {
        application.load(definitionsFromContext(context));
    }
    for (const controllerName in symfonyControllers) {
        if (!symfonyControllers.hasOwnProperty(controllerName)) {
            continue;
        }
        application.register(controllerName, symfonyControllers[controllerName]);
    }
    return application;
}

export { startStimulusApp };
