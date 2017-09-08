const fs = require('fs');

function AssetFingerprint(needsFingerprint = true) {
  this.needsFingerprint = needsFingerprint;
}

AssetFingerprint.prototype.apply = function(compiler) {
  compiler.plugin('done', function(stats) {
    if (this.needsFingerprint) {
      let output = `ASSET_FINGERPRINT = '${stats.hash}'`;
      fs.writeFileSync('config/initializers/asset_fingerprint.rb', output)
    }
  }.bind(this));
}

module.exports = AssetFingerprint;
