const fs = require('fs');

function AssetFingerprint(initializerDirectory, needsFingerprint = true, fingerprintName) {
  _validateInitializerDirectory();

  this.initializerDirectory = initializerDirectory;
  this.needsFingerprint = needsFingerprint;
  this.fingerprintName = fingerprintName || 'ASSET_FINGERPRINT';

  function _validateInitializerDirectory() {
    if (initializerDirectory === undefined) {
      throw new Error('Please supply a directory path for your initializer, such as `config/initializers`.');
    }
  }
}

AssetFingerprint.prototype.apply = function(compiler) {
  compiler.plugin('done', function(stats) {
    if (this.needsFingerprint) {
        let defaultRun = this.fingerprintName === 'ASSET_FINGERPRINT';
        let initializerPath = `${this.initializerDirectory}/asset_fingerprint.rb`;
        const newline = defaultRun ? '' : '\r\n';
        const fsMethod = defaultRun ? 'writeFileSync' : 'appendFileSync';
        let output = `${newline}${this.fingerprintName} = '${stats.hash}'`;
        fs[fsMethod](initializerPath, output);
        console.log(`asset-fingerprint-webpack-rails: updated file ${initializerPath} with ${this.fingerprintName} = ${stats.hash}`)
    }
  }.bind(this));
}

module.exports = AssetFingerprint;
