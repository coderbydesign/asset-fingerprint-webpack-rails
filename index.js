const fs = require('fs');

function AssetFingerprint(initializerDirectory, needsFingerprint = true) {
  _validateInitializerDirectory();

  this.initializerDirectory = initializerDirectory;
  this.needsFingerprint = needsFingerprint;

  function _validateInitializerDirectory() {
    if (initializerDirectory === undefined) {
      throw new Error('Please supply a directory path for your initializer, such as `config/initializers`.');
    }
  }
}

AssetFingerprint.prototype.apply = function(compiler) {
  compiler.plugin('done', function(stats) {
    if (this.needsFingerprint) {
      let output = `ASSET_FINGERPRINT = '${stats.hash}'`;
      let initializerPath = `${this.initializerDirectory}/asset_fingerprint.rb`;

      fs.writeFileSync(initializerPath, output);
    }
  }.bind(this));
}

module.exports = AssetFingerprint;
