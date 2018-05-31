const fs = require('fs');

function AssetFingerprint(initializerDirectory, needsFingerprint = true, fingerprintName) {
  _validateInitializerDirectory();
  this.initializerDirectory = initializerDirectory;
  this.initializerPath = `${this.initializerDirectory}/asset_fingerprint.rb`;
  
  if(fingerprintName) {
    _validateFingerprintName(fingerprintName);

    if(_checkForExistingFingerprint(fingerprintName, this.initializerPath)) {
      throw new Error('The provided fingerprint name has already been used.');
    }
  }
 
  this.needsFingerprint = needsFingerprint;
  this.fingerprintName = fingerprintName || 'ASSET_FINGERPRINT';

  function _validateInitializerDirectory() {
    if (initializerDirectory === undefined) {
      throw new Error('Please supply a directory path for your initializer, such as `config/initializers`.');
    }
  }

  function _validateFingerprintName(fingerprintName) {
    if(!/^([A-Z]|_)*_FINGERPRINT$/.test(fingerprintName)) {
      throw new Error('Please supply a fingerprint name that is all caps separating words by underscores ending with "_FINGERPRINT" (i.e. CUSTOM_ASSET_FINGERPRINT).');
    }
  }

  function _checkForExistingFingerprint(fingerprintName, initializerPath) {
    if(fs.existsSync(initializerPath)) {
      let file = fs.readFileSync(initializerPath, "utf8");
      return file.indexOf(fingerprintName) >= 0;
    } else {
      return false;
    }
  }
}

AssetFingerprint.prototype.apply = function(compiler) {
  compiler.plugin('done', function(stats) {
    if (this.needsFingerprint) {
        let defaultRun = this.fingerprintName === 'ASSET_FINGERPRINT';
        const newline = defaultRun ? '' : '\r\n';
        const fsMethod = defaultRun ? 'writeFileSync' : 'appendFileSync';
        let output = `${newline}${this.fingerprintName} = '${stats.hash}'`;
        fs[fsMethod](this.initializerPath, output);
        console.log(`asset-fingerprint-webpack-rails: updated file ${this.initializerPath} with ${this.fingerprintName} = ${stats.hash}`)
    }
  }.bind(this));
}

module.exports = AssetFingerprint;
