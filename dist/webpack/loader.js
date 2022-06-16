'use strict';

var LoaderDependency = require('webpack/lib/dependencies/LoaderDependency');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var LoaderDependency__default = /*#__PURE__*/_interopDefaultLegacy(LoaderDependency);

function generateLazyController (controllerPath, indentationSpaces, exportName = 'default') {
    const spaces = ' '.repeat(indentationSpaces);
    return `${spaces}(function() {
${spaces}    return class LazyController extends Controller {
${spaces}        constructor(context) {
${spaces}            super(context);
${spaces}            this.__stimulusLazyController = true;
${spaces}        }
${spaces}        initialize() {
${spaces}            if (this.application.controllers.find((controller) => {
${spaces}                return controller.identifier === this.identifier && controller.__stimulusLazyController;
${spaces}            })) {
${spaces}                return;
${spaces}            }
${spaces}            import('${controllerPath.replace(/\\/g, '\\\\')}').then((controller) => {
${spaces}                this.application.register(this.identifier, controller.${exportName});
${spaces}            });
${spaces}        }
${spaces}    }
${spaces}})()`;
}

function createControllersModule(config) {
    let controllerContents = 'export default {';
    let autoImportContents = '';
    let hasLazyControllers = false;
    const deprecations = [];
    if ('undefined' !== typeof config['placeholder']) {
        throw new Error('Your controllers.json file was not found. Be sure to add a Webpack alias from "@symfony/stimulus-bridge/controllers.json" to *your* controllers.json file.');
    }
    if ('undefined' === typeof config['controllers']) {
        throw new Error('Your Stimulus configuration file (assets/controllers.json) lacks a "controllers" key.');
    }
    for (const packageName in config.controllers) {
        let packageConfig;
        try {
            packageConfig = require(packageName + '/package.json');
        }
        catch (e) {
            throw new Error(`The file "${packageName}/package.json" could not be found. Try running "yarn install --force".`);
        }
        for (const controllerName in config.controllers[packageName]) {
            const controllerReference = packageName + '/' + controllerName;
            if ('undefined' === typeof packageConfig.symfony.controllers[controllerName]) {
                throw new Error('Controller "' + controllerReference + '" does not exist in the package and cannot be compiled.');
            }
            const controllerPackageConfig = packageConfig.symfony.controllers[controllerName];
            const controllerUserConfig = config.controllers[packageName][controllerName];
            if (!controllerUserConfig.enabled) {
                continue;
            }
            const controllerMain = packageName + '/' + controllerPackageConfig.main;
            let fetchMode = 'eager';
            if ('undefined' !== typeof controllerUserConfig.webpackMode) {
                deprecations.push('The "webpackMode" config key is deprecated in controllers.json. Use "fetch" instead, set to either "eager" or "lazy".');
            }
            if ('undefined' !== typeof controllerUserConfig.fetch) {
                if (!['eager', 'lazy'].includes(controllerUserConfig.fetch)) {
                    throw new Error(`Invalid "fetch" value "${controllerUserConfig.fetch}" in controllers.json. Expected "eager" or "lazy".`);
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
            let controllerNormalizedName = controllerReference.substr(1).replace(/_/g, '-').replace(/\//g, '--');
            if ('undefined' !== typeof controllerPackageConfig.name) {
                controllerNormalizedName = controllerPackageConfig.name.replace(/\//g, '--');
            }
            if ('undefined' !== typeof controllerUserConfig.name) {
                controllerNormalizedName = controllerUserConfig.name.replace(/\//g, '--');
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

function loader (source) {
    const requiredType = 'javascript/auto';
    const factory = this._compilation.dependencyFactories.get(LoaderDependency__default["default"]);
    if (factory === undefined) {
        throw new Error('Could not retrieve module factory for type LoaderDependency');
    }
    this._module.type = requiredType;
    this._module.generator = factory.getGenerator(requiredType);
    this._module.parser = factory.getParser(requiredType);
    const { finalSource, deprecations } = createControllersModule(JSON.parse(source));
    deprecations.forEach((message) => {
        this.emitWarning(new Error(message));
    });
    return finalSource;
}

module.exports = loader;
