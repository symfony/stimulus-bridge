# CHANGELOG

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
