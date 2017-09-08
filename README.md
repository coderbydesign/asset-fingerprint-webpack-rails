# Asset Fingerprint Webpack Rails
A webpack plugin to fingerprint your JS for consumption by Rails

## Install
```
npm install asset-fingerprint-webpack-rails --save-dev
```

## Usage
**Note:** _You will likely want to avoid running the fingerprinting in anything but a production build. Otherwise, if you have file watching setup for instance, it will rebuild the fingerprinting each time a file is updated, requiring you to bounce the Rails server to pickup the new fingerprint. One way to avoid this is by passing an option to your command for dev vs prod: (`webpack` for dev without fingerprinting, and `webpack --env.fingerprint` for prod build)._

### Option 1
Use a local variable in `webpack.config.js` to pass into the plugin to inform it whether not not it should fingerprint. **_defualts to true with no args_**
```javascript
// webpack.config.js

...
/**
 * require the plugin
 */
const AssetFingerprintPlugin = require('asset-fingerprint-webpack-rails');
const needsFingerprint = someLocalBoolean;

/**
 * add it to your plugins
 */
...
plugins: [
  new AssetFingerprintPlugin(needsFingerprint)
]
...
```

### Option 2
Setup your `webpack.config.js` to conditionally return an object based on an argument passed into the `webpack` command, like `webpack --env.fingerprint`

start webpack with an option: `webpack --env.fingerprint`

Then in `webpack.config.js`
```javascript
// webpack.config.js

/**
 * return a configuration object based on the option passed in, only using the plugin when it exists
 */

const AssetFingerprintPlugin = require('asset-fingerprint-webpack-rails');

module.exports = function(fingerprint) {
  if (fingerprint) {
    return {
      entry: "./entry.js",
      output: {
        path: __dirname,
        filename: "bundle.js"
      },
      module: {
        plugins: [
          new AssetFingerprintPlugin()
        ]
      }
    }
  } else {
    return {
      entry: "./entry.js",
      output: {
        path: __dirname,
        filename: "bundle.js"
      }
    }
  }
};
```