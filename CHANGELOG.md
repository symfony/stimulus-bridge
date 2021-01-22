# CHANGELOG

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

* The `webpackMode` option in `controllers.json` was deprecated. Use
  the new `fetch` option instead.

## 1.1.0

* Support for Stimulus 1 dropped and support for Stimulus 2 added - #4.

## 1.0.0

* Initial release!
