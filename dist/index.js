import { Application } from "@hotwired/stimulus";
import symfonyControllers from "./webpack/loader!@symfony/stimulus-bridge/controllers.json";

//#region node_modules/.pnpm/@hotwired+stimulus-webpack-helpers@1.0.1_@hotwired+stimulus@3.2.2/node_modules/@hotwired/stimulus-webpack-helpers/dist/stimulus-webpack-helpers.js
function definitionsFromContext(context) {
	return context.keys().map((key) => definitionForModuleWithContextAndKey(context, key)).filter((value) => value);
}
function definitionForModuleWithContextAndKey(context, key) {
	const identifier = identifierForContextKey(key);
	if (identifier) return definitionForModuleAndIdentifier(context(key), identifier);
}
function definitionForModuleAndIdentifier(module, identifier) {
	const controllerConstructor = module.default;
	if (typeof controllerConstructor == "function") return {
		identifier,
		controllerConstructor
	};
}
function identifierForContextKey(key) {
	const logicalName = (key.match(/^(?:\.\/)?(.+)(?:[_-]controller\..+?)$/) || [])[1];
	if (logicalName) return logicalName.replace(/_/g, "-").replace(/\//g, "--");
}

//#endregion
//#region src/index.ts
function startStimulusApp(context) {
	const application = Application.start();
	if (process.env.NODE_ENV === "development") application.debug = true;
	if (context) application.load(definitionsFromContext(context));
	for (const controllerName in symfonyControllers) {
		if (!Object.prototype.hasOwnProperty.call(symfonyControllers, controllerName)) continue;
		application.register(controllerName, symfonyControllers[controllerName]);
	}
	return application;
}

//#endregion
export { startStimulusApp };