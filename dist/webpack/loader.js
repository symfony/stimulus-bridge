"use strict";
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
const webpack_lib_dependencies_LoaderDependency = __toESM(require("webpack/lib/dependencies/LoaderDependency"));

//#region src/webpack/generate-lazy-controller.ts
function generate_lazy_controller_default(controllerPath, indentationSpaces, exportName = "default") {
	const spaces = " ".repeat(indentationSpaces);
	return `class extends Controller {
${spaces}    constructor(context) {
${spaces}        super(context);
${spaces}        this.__stimulusLazyController = true;
${spaces}    }
${spaces}    initialize() {
${spaces}        if (this.application.controllers.find((controller) => {
${spaces}            return controller.identifier === this.identifier && controller.__stimulusLazyController;
${spaces}        })) {
${spaces}            return;
${spaces}        }
${spaces}        import('${controllerPath.replace(/\\/g, "\\\\")}').then((controller) => {
${spaces}            this.application.register(this.identifier, controller.${exportName});
${spaces}        });
${spaces}    }
${spaces}}`;
}

//#endregion
//#region src/webpack/create-controllers-module.ts
function createControllersModule(config) {
	let controllerContents = "export default {";
	let importStatementContents = "";
	let hasLazyControllers = false;
	if ("undefined" !== typeof config.placeholder) throw new Error("Your controllers.json file was not found. Be sure to add a Webpack alias from \"@symfony/stimulus-bridge/controllers.json\" to *your* controllers.json file.");
	if ("undefined" === typeof config.controllers) throw new Error("Your Stimulus configuration file (assets/controllers.json) lacks a \"controllers\" key.");
	let controllerIndex = 0;
	for (const packageName in config.controllers) {
		let packageConfig;
		try {
			packageConfig = require(`${packageName}/package.json`);
		} catch (e) {
			throw new Error(`The file "${packageName}/package.json" could not be found. Try running "yarn install --force".`);
		}
		for (const controllerName in config.controllers[packageName]) {
			const controllerReference = `${packageName}/${controllerName}`;
			if ("undefined" === typeof packageConfig.symfony.controllers[controllerName]) throw new Error(`Controller "${controllerReference}" does not exist in the package and cannot be compiled.`);
			const controllerPackageConfig = packageConfig.symfony.controllers[controllerName];
			const controllerUserConfig = config.controllers[packageName][controllerName];
			if (!controllerUserConfig.enabled) continue;
			const controllerMain = `${packageName}/${controllerPackageConfig.main}`;
			const fetchMode = controllerUserConfig.fetch || "eager";
			let moduleValueContents = "";
			if (fetchMode === "eager") {
				const controllerNameForVariable = `controller_${controllerIndex++}`;
				importStatementContents += `import ${controllerNameForVariable} from '${controllerMain}';\n`;
				moduleValueContents = controllerNameForVariable;
			} else if (fetchMode === "lazy") {
				hasLazyControllers = true;
				moduleValueContents = generate_lazy_controller_default(controllerMain, 2);
			} else throw new Error(`Invalid fetch mode "${fetchMode}" in controllers.json. Expected "eager" or "lazy".`);
			let controllerNormalizedName = controllerReference.substr(1).replace(/_/g, "-").replace(/\//g, "--");
			if ("undefined" !== typeof controllerPackageConfig.name) controllerNormalizedName = controllerPackageConfig.name.replace(/\//g, "--");
			if ("undefined" !== typeof controllerUserConfig.name) controllerNormalizedName = controllerUserConfig.name.replace(/\//g, "--");
			controllerContents += `\n  '${controllerNormalizedName}': ${moduleValueContents},`;
			for (const autoimport in controllerUserConfig.autoimport || []) if (controllerUserConfig.autoimport[autoimport]) importStatementContents += `import '${autoimport}';\n`;
		}
	}
	if (hasLazyControllers) controllerContents = `import { Controller } from '@hotwired/stimulus';\n${controllerContents}`;
	return {
		finalSource: `${importStatementContents}${controllerContents}\n};`,
		deprecations: []
	};
}

//#endregion
//#region src/webpack/loader.ts
function loader_default(source) {
	const requiredType = "javascript/auto";
	const factory = this._compilation.dependencyFactories.get(webpack_lib_dependencies_LoaderDependency.default);
	if (factory === undefined) throw new Error("Could not retrieve module factory for type LoaderDependency");
	this._module.type = requiredType;
	this._module.generator = factory.getGenerator(requiredType);
	this._module.parser = factory.getParser(requiredType);
	const { finalSource, deprecations } = createControllersModule(JSON.parse(source));
	deprecations.forEach((message) => {
		this.emitWarning(new Error(message));
	});
	return finalSource;
}

//#endregion
module.exports = loader_default;