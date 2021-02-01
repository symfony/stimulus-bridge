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

* Support for making your own controllers "lazy" (as described above)
  can now be achieved by loading your controllers through the
  `@symfony/stimulus-bridge/lazy-controller-loader` loader and
  adding a `/* stimulusFetch: 'lazy' */` comment above your controller.

## 1.1.0

* Support for Stimulus 1 dropped and support for Stimulus 2 added - #4.

## 1.0.0

* Initial release!
