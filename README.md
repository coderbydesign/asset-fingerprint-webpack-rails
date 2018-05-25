# Asset Fingerprint Webpack Rails
A webpack plugin to fingerprint your JS for consumption by Rails

[![Build Status](https://travis-ci.org/coderbydesign/asset-fingerprint-webpack-rails.svg?branch=master)](https://travis-ci.org/coderbydesign/asset-fingerprint-webpack-rails)

## Install
```
npm install asset-fingerprint-webpack-rails --save-dev
```

## Usage
**Note:** _You will likely want to avoid running the fingerprinting in anything but a production build. Otherwise, if you have file watching setup for instance, it will rebuild the fingerprinting each time a file is updated, requiring you to bounce the Rails server to pickup the new fingerprint. One way to avoid this is by passing an option to your command for dev vs prod: (`webpack` for dev without fingerprinting, and `webpack --env.fingerprint` for prod build)._

This plugin requires you to set your initializer directory path relative to your webpack config, such as: `config/initializers` as the first argument. The second optional argument determines whether or not the fingerprinting should take place. By default, this is set to `true`.

```javascript
const AssetFingerprintPlugin = require('asset-fingerprint-webpack-rails');
new AssetFingerprintPlugin('config/initializers', true);
```

It uses the `hash` values from the webpack `stats` object. This is the value that will be output into a new initializer called `asset_fingerprint.rb`, as: `ASSET_FINGERPRINT=XXXXXXXX`. You should setup your `webpack.config.js` to use this hash when building your output file (see sample config below).

It is also recommended that you use a plugin such as [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin) in conjunction with this plugin to clean out your output directory on each build, if you wish to avoid a collection of old files.

### Option 1
Use a local variable in `webpack.config.js` to pass into the plugin to inform it whether not not it should fingerprint, calling `webpack` without any args. **_plugin defualts to fingerprint=true with no args_**
```javascript
// webpack.config.js

...
/**
 * require the plugin
 */
const AssetFingerprintPlugin = require('asset-fingerprint-webpack-rails');
const needsFingerprint = someLocalBoolean;
const initializerDirectory = 'config/initializers';
/**
 * add it to your plugins and conditionally use the hash in the filename
 */
module.exports = {
  entry: "./entry.js",
  output: {
    path: __dirname,
    filename: needsFingerprint ? "bundle-[hash].js" : "bundle.js"
  },
  plugins: [
    new AssetFingerprintPlugin(initializerDirectory, needsFingerprint)
  ]
};
```

### Option 2
Setup your `webpack.config.js` to conditionally return an object based on an argument passed into the `webpack` command, like `webpack --env.fingerprint`

start webpack with an option: `webpack --env.fingerprint`

Then in `webpack.config.js`
```javascript
// webpack.config.js

/**
 * require the plugin
 */
const AssetFingerprintPlugin = require('asset-fingerprint-webpack-rails');

/**
 * return a configuration object based on the option passed in, only using the plugin when it exists
 * and conditionally using the hash in the filename
 */
module.exports = function(fingerprint) {
  if (fingerprint) {
    return {
      entry: "./entry.js",
      output: {
        path: __dirname,
        filename: "bundle-[hash].js"
      },
      plugins: [
        new AssetFingerprintPlugin(initializerDirectory)
      ]
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

### Integration with Rails
Now that our `asset_fingerprint.rb` file is setup, we can conditionally use it in our views by setting up a helper method in `application_helper.rb`:

```ruby
  def asset_with_fingerprint(asset_name)
    Rails.env.production? ? "#{asset_name}-#{ASSET_FINGERPRINT}" : asset_name
  end
```

And in your layout:

```html
  = javascript_include_tag asset_with_fingerprint('path_of_bundled_js_output/bundle')
```

That's it! Now if you use a cleaner as suggested, along with file watching, you'll be able to run this in `development` and have `bundle.js` rebuild without fingerprinting, and your Rails app with use that directly. Once you build for production, your Rails app and your `bundle.js` will use a fingerprinted version of the file.

### Managing multiple webpack builds

If your build setup launches webpack multiple times a new hash will be generated with each run.  This can cause problems when using the default
arguments.  The last run will overwrite any previously written hash value.  An additional parameter can be passed to tell the plugin to append a new named value that has the key from the subsequent run.

Passing a name in the third paramenter will generate a new line in `asset_fingerprint.rb` having the name assigned to the new hash. For example:

```
AssetFingerprintPlugin(rubyConfigInitPath, true, 'CUSTOM_ASSET_FINGERPRINT')
```

will generate a new line in the file like this:

```
ASSET_FINGERPRINT = '0556f9ab7cbd607d10ed'
CUSTOM_ASSET_FINGERPRINT = '921dcffe35e5f2740ef5'
```


### Credit
Concept adapted from @samullen - http://samuelmullen.com/articles/replacing-the-rails-asset-pipeline-with-webpack-and-yarn/
