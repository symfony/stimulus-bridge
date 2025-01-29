# CHANGELOG

## 4.0.0

### Breaking changes

* Drop support for Node.js <18, by @Kocal in https://github.com/symfony/stimulus-bridge/pull/94 and https://github.com/symfony/stimulus-bridge/pull/98
  This should not affect most users since previous versions of Node.js are not maintained anymore, and Node.js 18 is in maintenance LTS.

### Features

* Thus having no effects on the `dist/` files, TypeScript `module` is now set to `ESNext`, `moduleResolution` to `NodeNext`, and `target` to `ES2021` by @Kocal in https://github.com/symfony/stimulus-bridge/pull/99
* Upgrade minimum supported `acorn` version to 8.2.0 by @Kocal in https://github.com/symfony/stimulus-bridge/pull/110
* Add support for `loader-utils@^3.0.0` and `schema-utils@^4.0.0` by @Kocal in https://github.com/symfony/stimulus-bridge/pull/111
* Move `acorn` dependency to devDependency, as it is already bundled in dist files, by @Kocal in https://github.com/symfony/stimulus-bridge/pull/114

### Internal

* [CI] Ensure tests are run under multiple Node.js versions by @Kocal in https://github.com/symfony/stimulus-bridge/pull/94
* [CI] Check for un-built JS dist files by, @Kocal in https://github.com/symfony/stimulus-bridge/pull/96
* [CI] Run tests for lowest/locked/highest dependency versions by @Kocal in https://github.com/symfony/stimulus-bridge/pull/111
* Replace ESLint and Prettier by Biome.js by @Kocal in https://github.com/symfony/stimulus-bridge/pull/95
* Migrate from [Rollup](https://rollupjs.org/) to [Rolldown](https://rolldown.rs/) by @Kocal in https://github.com/symfony/stimulus-bridge/pull/99
* Migrate from [Yarn](https://yarnpkg.com/) to [pnpm](https://pnpm.io/) by @Kocal in https://github.com/symfony/stimulus-bridge/pull/108
* Migrate from [Jest](https://jestjs.io/) to [Vitest](https://vitest.dev/) by @Kocal in https://github.com/symfony/stimulus-bridge/pull/115
* Migrate or remove [Babel](https://babeljs.io/) in favor of [Acorn](https://github.com/acornjs/acorn) by @Kocal in https://github.com/symfony/stimulus-bridge/pull/116

## 3.3.3

* Add missing `@babel/plugin-proposal-class-properties` dev dependency by @Kocal in https://github.com/symfony/stimulus-bridge/pull/92
* Fix lazy-controller detection when controller contain static properties (update `acorn` ECMAScript version) by @ameotoko in https://github.com/symfony/stimulus-bridge/pull/93

## 3.2.3

* [Bug] Removing unnecessary Promise in object of controllers to be loaded. See #81.

* Fix README: registering lazy controllers in bootstrap.js. See #76.

## 3.2.1

* Normalizing custom names "/" to "--" like normal controller names. See #72.

## 3.2.0

* Allow the controller name to be overridden by the package or user. See #70.

* Moved TypeScript types into the package. See #55.

## 3.1.0

* Automatically enabled Stimulus's "debug" mode when doing a dev build. You will
  now, while developing, see debugging information in your browser's console log!
  See #65.

## 3.0.0

Dropped support for `stimulus` 2.0, in favor of `@hotwired/stimulus` version 3.
You can read about Stimulus version on its [release announcement](https://world.hey.com/hotwired/stimulus-3-c438d432).

The most important change needed is to:

* Remove `stimulus` from your `package.json` file and replace it with `"@hotwired/stimulus": "^3.0"`.
  Also change your `@symfony/webpack-encore` version to `^1.7` and `@symfony/stimulus-bridge` to `^3.0`.
  After making these changes, run `yarn install`.

* Update all of your controllers to replace any imports for `stimulus` with
  imports from `@hotwired/stimulus`:

```diff
-import { Controller } from 'stimulus';
+import { Controller } from '@hotwired/stimulus';
```

* In `composer.json`, update any `symfony/ux-*` packages that you have installed to version `^2.0`.
  Run `composer up "symfony/ux-*"`. Once that finishes, run `yarn install --force`.

## 2.0.0

Following the release of Webpack Encore 1.0, this release adapts the stimulus-bridge to Webpack 5
features.

Read the blog post on https://symfony.com/blog/webpack-encore-1-0-and-stimulus-bridge-2-0-released
for details.

## 1.2.0

* Webpack integration with this library has changed. If you're using
  Webpack Encore, you must upgrade to version 1.0.0 or higher of that
  library - #14.

* Controller names were changed and normalized - #12

  Before: `@symfony/ux-dropzone/dropzone`
  After: `symfony--ux-dropzone--dropzone`

* Support for "lazy controllers" was added. By setting the `fetch`
  in `controllers.json` to `lazy`, your controller will not
  be downloaded until the controller element first appears on the page.

* Support for making your own controllers "lazy" (as described above)
  can now be achieved by loading your controllers through the
  `@symfony/stimulus-bridge/lazy-controller-loader` loader and
  adding a `/* stimulusFetch: 'lazy' */` comment above your controller.

## 1.1.0

* Support for Stimulus 1 dropped and support for Stimulus 2 added - #4.

## 1.0.0

* Initial release!
