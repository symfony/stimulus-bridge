const LoaderDependency = require('webpack/lib/dependencies/LoaderDependency');
const createControllersModule = require('./create-controllers-module');

module.exports = function (source) {
    const logger = this.getLogger('stimulus-bridge-loader');

    /*
     * The following code prevents the normal JSON loader from
     * executing after our loader. This is a workaround from WebpackEncore.
     */
    const requiredType = 'javascript/auto';
    const factory = this._compilation.dependencyFactories.get(LoaderDependency);
    if (factory === undefined) {
        throw new Error('Could not retrieve module factory for type LoaderDependency');
    }
    this._module.type = requiredType;
    this._module.generator = factory.getGenerator(requiredType);
    this._module.parser = factory.getParser(requiredType);
    /* End workaround */

    return createControllersModule(JSON.parse(source));
};
