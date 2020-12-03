# Symfony UX Stimulus bridge

This repository is the Stimulus integration bridge for Symfony projects which allow
reusable code to be shipped in your applications.

It contains a helper to initialize a Stimulus application based on vendor 
controllers and application code. It also contains a Webpack plugin used by 
Webpack Encore to include vendor controllers and styles into application built files.

In new Symfony applications, this package is automatically configured by Symfony Flex to
work out of the box. **You probably don't need to configure this package yourself.**

Symfony UX Stimulus bridge is currently considered **experimental**.

## Installation

```sh
yarn add @symfony/stimulus-bridge
```

## Usage

This package relies on [webpack-virtual-modules](https://github.com/sysgears/webpack-virtual-modules)
to build dynamic modules referencing vendor Stimulus controllers and styles.

To use it, first configure Webpack Encore:

```javascript
// webpack.config.js

// Provide the location of your controllers.json file
Encore.enableStimulusBridge('./assets/controllers.json');
```

Then use the package in your JavaScript code:

```javascript
// app.js (or bootstrap.js if you use the standard Symfony structure)

import { startStimulusApp } from '@symfony/stimulus-bridge';
import '@symfony/autoimport';

export const app = startStimulusApp(require.context('./controllers', true, /\.(j|t)sx?$/));
```

## Run tests

```sh
yarn test
```
